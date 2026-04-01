import { StrategicResearchSource } from '../types'
import { fetchWithTimeout, stripHtml, limitText, decodeHtmlEntities } from './llm'

// ─────────────────────────────────────────────
// Env config
// ─────────────────────────────────────────────

const DEFAULT_WEB_SOURCE_COUNT = 4
const DEFAULT_WEB_SEARCH_RESULT_COUNT = 16
const DEFAULT_WEB_FETCH_TIMEOUT_MS = 12_000
const DEFAULT_SEARCH_PROVIDERS = ['duckduckgo_html', 'duckduckgo_lite', 'wikipedia_api'] as const

const STRATEGY_KEYWORDS = [
  'vision',
  'mission',
  'strategy',
  'strategic',
  'values',
  'goal',
  'goals',
  'purpose',
  'business model',
  'value proposition',
] as const

const SEARCH_BASE_URL = 'https://duckduckgo.com/html/'
const SEARCH_LITE_BASE_URL = 'https://lite.duckduckgo.com/lite/'
const WIKIPEDIA_SEARCH_URL = 'https://en.wikipedia.org/w/api.php'

export const getWebSourceCount = (): number => {
  const value = Number(process.env.AI_WEB_SOURCE_COUNT)
  return Number.isFinite(value) && value > 0
    ? Math.min(Math.floor(value), 8)
    : DEFAULT_WEB_SOURCE_COUNT
}

const getWebSearchResultCount = (): number => {
  const value = Number(process.env.AI_WEB_SEARCH_RESULT_COUNT)
  return Number.isFinite(value) && value > 0
    ? Math.min(Math.floor(value), 30)
    : DEFAULT_WEB_SEARCH_RESULT_COUNT
}

const getWebFetchTimeoutMs = (): number => {
  const value = Number(process.env.AI_WEB_FETCH_TIMEOUT_MS)
  return Number.isFinite(value) && value >= 3000 ? Math.floor(value) : DEFAULT_WEB_FETCH_TIMEOUT_MS
}

const getSearchProviders = (): readonly string[] => {
  const rawValue = process.env.AI_SEARCH_PROVIDERS?.trim()
  if (!rawValue) return DEFAULT_SEARCH_PROVIDERS
  const parsed = rawValue
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean)
  return parsed.length > 0 ? parsed : DEFAULT_SEARCH_PROVIDERS
}

const getSearxngUrl = (): string => process.env.AI_SEARCH_SEARXNG_URL?.trim() || ''
const getSearxngApiKey = (): string => process.env.AI_SEARCH_SEARXNG_API_KEY?.trim() || ''

// ─────────────────────────────────────────────
// Candidate types + helpers
// ─────────────────────────────────────────────

interface WebSearchCandidate {
  readonly provider: string
  readonly url: string
  readonly title: string
  readonly snippet: string
}

const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

const extractSearchResultUrl = (href: string): string | null => {
  if (!href) return null
  const normalizedHref = decodeHtmlEntities(href.trim())

  const resolveDdgRedirect = (value: string): string | null => {
    try {
      const parsed = new URL(value)
      if (!parsed.hostname.toLowerCase().includes('duckduckgo.com')) return null
      if (!parsed.pathname.startsWith('/l/')) return null
      const redirected = parsed.searchParams.get('uddg')
      if (redirected && (redirected.startsWith('http://') || redirected.startsWith('https://'))) {
        return decodeURIComponent(redirected)
      }
    } catch {
      return null
    }
    return null
  }

  if (normalizedHref.startsWith('//')) {
    return resolveDdgRedirect(`https:${normalizedHref}`) ?? `https:${normalizedHref}`
  }

  if (normalizedHref.startsWith('http://') || normalizedHref.startsWith('https://')) {
    return resolveDdgRedirect(normalizedHref) ?? normalizedHref
  }

  if (normalizedHref.startsWith('/l/?')) {
    try {
      const parsed = new URL(`https://duckduckgo.com${normalizedHref}`)
      const redirected = parsed.searchParams.get('uddg')
      if (redirected && (redirected.startsWith('http://') || redirected.startsWith('https://'))) {
        return decodeURIComponent(redirected)
      }
    } catch {
      return null
    }
  }

  return null
}

const normalizeForComparison = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const scoreKeywordHits = (content: string, companyName: string): number => {
  const normalized = content.toLowerCase()
  const companyTokens = companyName
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length > 2)
  const keywordScore = STRATEGY_KEYWORDS.reduce(
    (acc, kw) => acc + (normalized.includes(kw) ? 1 : 0),
    0
  )
  const companyScore = companyTokens.reduce((acc, t) => acc + (normalized.includes(t) ? 1 : 0), 0)
  return keywordScore * 2 + companyScore
}

const scoreSearchCandidate = (candidate: WebSearchCandidate, companyName: string): number => {
  const domain = extractDomain(candidate.url)
  const content = `${candidate.title} ${candidate.snippet} ${domain}`
  let score = scoreKeywordHits(content, companyName)

  const domainCompact = domain.replace(/[^a-z0-9]+/g, '')
  const companyCompact = normalizeForComparison(companyName).replace(/[^a-z0-9]+/g, '')

  if (companyCompact && domainCompact.includes(companyCompact)) score += 24

  const companyTokens = normalizeForComparison(companyName)
    .split(/\s+/)
    .filter(t => t.length > 2)
  score += companyTokens.filter(t => domain.includes(t)).length * 6

  if (candidate.title.toLowerCase().includes('official')) score += 4
  if (
    domain.includes('linkedin.com') ||
    domain.includes('facebook.com') ||
    domain.includes('crunchbase.com') ||
    domain.includes('leadiq.com')
  )
    score -= 4

  if (candidate.provider === 'duckduckgo_html' || candidate.provider === 'duckduckgo_lite')
    score += 2
  if (candidate.provider === 'wikipedia_api') score -= 1

  return score
}

const dedupeCandidates = (candidates: readonly WebSearchCandidate[]): WebSearchCandidate[] => {
  const seen = new Set<string>()
  return candidates.filter(c => {
    const key = c.url.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─────────────────────────────────────────────
// Provider implementations
// ─────────────────────────────────────────────

const collectDuckduckgoHtmlCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const res = await fetchWithTimeout(
    `${SEARCH_BASE_URL}?q=${encodeURIComponent(query)}`,
    { headers: { 'User-Agent': 'nextgen-eam-ai-worker/1.0' } },
    getWebFetchTimeoutMs()
  )
  if (!res.ok) throw new Error(`DuckDuckGo HTML search failed with status ${res.status}`)
  const html = await res.text()
  const links: WebSearchCandidate[] = []
  for (const match of html.matchAll(
    /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
  )) {
    const resolvedUrl = extractSearchResultUrl(match[1])
    if (!resolvedUrl) continue
    links.push({
      provider: 'duckduckgo_html',
      url: resolvedUrl,
      title: limitText(stripHtml(match[2]), 180),
      snippet: '',
    })
    if (links.length >= maxResults) break
  }
  return links
}

const collectDuckduckgoLiteCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const res = await fetchWithTimeout(
    `${SEARCH_LITE_BASE_URL}?q=${encodeURIComponent(query)}`,
    { headers: { 'User-Agent': 'nextgen-eam-ai-worker/1.0' } },
    getWebFetchTimeoutMs()
  )
  if (!res.ok) throw new Error(`DuckDuckGo Lite search failed with status ${res.status}`)
  const html = await res.text()
  const links: WebSearchCandidate[] = []
  for (const match of html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const resolvedUrl = extractSearchResultUrl(match[1])
    if (!resolvedUrl) continue
    links.push({
      provider: 'duckduckgo_lite',
      url: resolvedUrl,
      title: limitText(stripHtml(match[2]), 180),
      snippet: '',
    })
    if (links.length >= maxResults) break
  }
  return links
}

const collectWikipediaCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const res = await fetchWithTimeout(
    `${WIKIPEDIA_SEARCH_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&utf8=1&srlimit=${Math.min(maxResults, 10)}`,
    { headers: { Accept: 'application/json', 'User-Agent': 'nextgen-eam-ai-worker/1.0' } },
    getWebFetchTimeoutMs()
  )
  if (!res.ok) throw new Error(`Wikipedia search failed with status ${res.status}`)
  const payload = (await res.json().catch(() => null)) as {
    query?: { search?: Array<{ title?: string; snippet?: string }> }
  } | null
  return (payload?.query?.search ?? [])
    .map(result => {
      const title = (result.title ?? '').trim()
      if (!title) return null
      return {
        provider: 'wikipedia_api',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`,
        title,
        snippet: stripHtml(result.snippet ?? ''),
      } satisfies WebSearchCandidate
    })
    .filter((r): r is WebSearchCandidate => Boolean(r))
    .slice(0, maxResults)
}

const collectSearxngCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const searxngUrl = getSearxngUrl()
  if (!searxngUrl) return []

  const url = new URL(searxngUrl)
  if (!url.pathname || url.pathname === '/') url.pathname = '/search'
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'nextgen-eam-ai-worker/1.0',
  }
  const apiKey = getSearxngApiKey()
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const res = await fetchWithTimeout(url.toString(), { headers }, getWebFetchTimeoutMs())
  if (!res.ok) throw new Error(`SearXNG search failed with status ${res.status}`)

  const payload = (await res.json().catch(() => null)) as {
    results?: Array<{ title?: string; url?: string; content?: string }>
  } | null

  return (payload?.results ?? [])
    .map(result => {
      const rawUrl = result.url?.trim() ?? ''
      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) return null
      return {
        provider: 'searxng',
        url: rawUrl,
        title: limitText(result.title ?? rawUrl, 180),
        snippet: limitText(result.content ?? '', 240),
      } satisfies WebSearchCandidate
    })
    .filter((r): r is WebSearchCandidate => Boolean(r))
    .slice(0, maxResults)
}

// ─────────────────────────────────────────────
// Orchestrate search across providers
// ─────────────────────────────────────────────

const buildSearchQuery = (companyName: string, objective: string | null): string => {
  if (!objective?.trim()) return companyName.trim()
  return `${companyName.trim()} ${objective.trim()}`.trim()
}

export const collectWebSources = async (
  companyName: string,
  objective: string | null
): Promise<StrategicResearchSource[]> => {
  const maxSources = getWebSourceCount()
  const maxResults = getWebSearchResultCount()
  const query = buildSearchQuery(companyName, objective)
  const providers = getSearchProviders()

  console.info('[AI WORKER][WEB_RESEARCH][SEARCH]', {
    companyName,
    query,
    maxSources,
    maxResults,
    providers,
    hasSearxngUrl: Boolean(getSearxngUrl()),
  })

  const allCandidates: WebSearchCandidate[] = []
  const providerResults: Record<string, { candidates: number; error?: string }> = {}

  for (const provider of providers) {
    try {
      const candidates =
        provider === 'duckduckgo_html'
          ? await collectDuckduckgoHtmlCandidates(query, maxResults)
          : provider === 'duckduckgo_lite'
            ? await collectDuckduckgoLiteCandidates(query, maxResults)
            : provider === 'wikipedia_api'
              ? await collectWikipediaCandidates(query, maxResults)
              : provider === 'searxng'
                ? await collectSearxngCandidates(query, maxResults)
                : []
      providerResults[provider] = { candidates: candidates.length }
      allCandidates.push(...candidates)
    } catch (error) {
      providerResults[provider] = {
        candidates: 0,
        error: error instanceof Error ? error.message : 'unknown provider error',
      }
    }
  }

  const ranked = dedupeCandidates(allCandidates)
    .map(c => ({ candidate: c, score: scoreSearchCandidate(c, companyName) }))
    .sort((a, b) => b.score - a.score)
    .map(e => e.candidate)
    .slice(0, Math.max(maxResults, maxSources * 4))

  const matchedSources: StrategicResearchSource[] = []
  const fallbackSources: StrategicResearchSource[] = []
  let attemptedLinks = 0

  for (const link of ranked) {
    if (matchedSources.length >= maxSources) break
    attemptedLinks += 1
    try {
      const pageRes = await fetchWithTimeout(
        link.url,
        { headers: { 'User-Agent': 'nextgen-eam-ai-worker/1.0' } },
        getWebFetchTimeoutMs()
      )
      if (!pageRes.ok) continue
      const contentType = pageRes.headers.get('content-type') ?? ''
      if (!contentType.includes('text/html') && !contentType.includes('text/plain')) continue

      const rawContent = await pageRes.text()
      const cleanedText = stripHtml(rawContent)
      const snippet = limitText(cleanedText, 800)
      if (!snippet) continue

      const source: StrategicResearchSource = { title: link.title, url: link.url, snippet }
      const kws = scoreKeywordHits(
        `${link.title} ${link.snippet} ${cleanedText.slice(0, 4000)}`,
        companyName
      )
      if (kws > 0) matchedSources.push(source)
      else fallbackSources.push(source)
    } catch {
      continue
    }
  }

  const sources =
    matchedSources.length > 0
      ? matchedSources.slice(0, maxSources)
      : fallbackSources.slice(0, maxSources)

  console.info('[AI WORKER][WEB_RESEARCH][RESULT]', {
    companyName,
    query,
    providerResults,
    attemptedLinks,
    selectedFrom: matchedSources.length > 0 ? 'keyword-matched' : 'fallback',
    collectedSources: sources.length,
  })

  return sources
}
