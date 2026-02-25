import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { graphqlRequest } from '../graphql/client'
import {
  CompleteAiRunInput,
  FailAiRunInput,
  GenerateSummaryInput,
  GeneratedRunOutput,
  StrategicDraftPayload,
  StrategicResearchSource,
} from './types'

const DEFAULT_LLM_URL = 'https://localai.mf2.eu/v1/chat/completions'
const DEFAULT_LLM_MODEL = 'mistral-7b-instruct-v0.3'
const SEARCH_BASE_URL = 'https://duckduckgo.com/html/'
const SEARCH_LITE_BASE_URL = 'https://lite.duckduckgo.com/lite/'
const WIKIPEDIA_SEARCH_URL = 'https://en.wikipedia.org/w/api.php'
const DEFAULT_WEB_SOURCE_COUNT = 4
const DEFAULT_WEB_SEARCH_RESULT_COUNT = 16
const DEFAULT_WEB_FETCH_TIMEOUT_MS = 12000
const DEFAULT_LLM_TIMEOUT_MS = 45000
const DEFAULT_LLM_RETRY_COUNT = 1
const DEFAULT_ALLOW_LLM_FALLBACK = false
const DEFAULT_LOG_LLM_PROMPT = false
const DEFAULT_LLM_PROMPT_PREVIEW_CHARS = 1200
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

const getLlmUrl = () => process.env.AI_LLM_URL?.trim() || DEFAULT_LLM_URL
const getLlmApiKey = () => process.env.AI_LLM_API_KEY?.trim() || ''
const getLlmModel = () => process.env.AI_LLM_MODEL?.trim() || DEFAULT_LLM_MODEL
const getLlmTimeoutMs = () => {
  const value = Number(process.env.AI_LLM_TIMEOUT_MS)
  return Number.isFinite(value) && value >= 5000 ? Math.floor(value) : DEFAULT_LLM_TIMEOUT_MS
}
const getLlmRetryCount = () => {
  const value = Number(process.env.AI_LLM_RETRY_COUNT)
  return Number.isFinite(value) && value >= 0
    ? Math.min(Math.floor(value), 3)
    : DEFAULT_LLM_RETRY_COUNT
}
const getWebFetchTimeoutMs = () => {
  const value = Number(process.env.AI_WEB_FETCH_TIMEOUT_MS)
  return Number.isFinite(value) && value >= 3000 ? Math.floor(value) : DEFAULT_WEB_FETCH_TIMEOUT_MS
}
const isLlmFallbackEnabled = () => {
  const value = process.env.AI_ALLOW_LLM_FALLBACK?.trim().toLowerCase()
  if (!value) return DEFAULT_ALLOW_LLM_FALLBACK
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}
const isLlmPromptLoggingEnabled = () => {
  const value = process.env.AI_LOG_LLM_PROMPT?.trim().toLowerCase()
  if (!value) return DEFAULT_LOG_LLM_PROMPT
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}
const getLlmPromptPreviewChars = () => {
  const value = Number(process.env.AI_LLM_PROMPT_LOG_PREVIEW_CHARS)
  return Number.isFinite(value) && value >= 200
    ? Math.min(Math.floor(value), 8000)
    : DEFAULT_LLM_PROMPT_PREVIEW_CHARS
}
const getWebSourceCount = () => {
  const value = Number(process.env.AI_WEB_SOURCE_COUNT)
  return Number.isFinite(value) && value > 0
    ? Math.min(Math.floor(value), 8)
    : DEFAULT_WEB_SOURCE_COUNT
}
const getWebSearchResultCount = () => {
  const value = Number(process.env.AI_WEB_SEARCH_RESULT_COUNT)
  return Number.isFinite(value) && value > 0
    ? Math.min(Math.floor(value), 30)
    : DEFAULT_WEB_SEARCH_RESULT_COUNT
}
const getSearchProviders = (): readonly string[] => {
  const rawValue = process.env.AI_SEARCH_PROVIDERS?.trim()
  if (!rawValue) {
    return DEFAULT_SEARCH_PROVIDERS
  }

  const parsed = rawValue
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)

  return parsed.length > 0 ? parsed : DEFAULT_SEARCH_PROVIDERS
}
const getSearxngUrl = () => process.env.AI_SEARCH_SEARXNG_URL?.trim() || ''
const getSearxngApiKey = () => process.env.AI_SEARCH_SEARXNG_API_KEY?.trim() || ''

const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

const stripHtml = (value: string): string =>
  decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const limitText = (value: string, maxLength: number): string => {
  const normalized = value.trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}

const fetchWithTimeout = async (url: string, init: RequestInit = {}, timeoutMs: number) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

const resolveLlmConfig = (): { endpointUrl: string; model: string } => {
  const configuredUrl = getLlmUrl()
  const configuredModel = getLlmModel()

  try {
    const parsedUrl = new URL(configuredUrl)
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)

    if (pathSegments.length >= 2 && pathSegments[0] === 'chat') {
      const modelFromPath = decodeURIComponent(pathSegments.slice(1).join('/'))
      parsedUrl.pathname = '/v1/chat/completions'
      return {
        endpointUrl: parsedUrl.toString(),
        model: configuredModel || modelFromPath,
      }
    }

    if (pathSegments.length === 1 && pathSegments[0] === 'chat') {
      parsedUrl.pathname = '/v1/chat/completions'
      return {
        endpointUrl: parsedUrl.toString(),
        model: configuredModel,
      }
    }

    return {
      endpointUrl: configuredUrl,
      model: configuredModel,
    }
  } catch {
    return {
      endpointUrl: configuredUrl,
      model: configuredModel,
    }
  }
}

const extractJsonObjectText = (raw: string): string | null => {
  const trimmed = raw.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed
  }

  const firstCurly = trimmed.indexOf('{')
  const lastCurly = trimmed.lastIndexOf('}')
  if (firstCurly === -1 || lastCurly === -1 || lastCurly <= firstCurly) {
    return null
  }

  return trimmed.slice(firstCurly, lastCurly + 1)
}

const parseJsonObject = (raw: string): Record<string, unknown> | null => {
  const jsonText = extractJsonObjectText(raw)
  if (!jsonText) return null

  try {
    const parsed = JSON.parse(jsonText) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

const asString = (value: unknown, fallback: string, maxLength = 240): string => {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback
  }

  return limitText(value, maxLength)
}

const asStringArray = (
  value: unknown,
  fallback: readonly string[],
  maxLength = 120
): readonly string[] => {
  if (!Array.isArray(value)) {
    return fallback
  }

  const normalized = value
    .map(entry => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean)
    .map(entry => limitText(entry, maxLength))

  return normalized.length > 0 ? normalized : fallback
}

const ensureDateYearString = (value: unknown, fallbackYear: string): string => {
  if (typeof value !== 'string') return fallbackYear
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  if (/^\d{4}$/.test(value)) return `${value}-01-01`
  return fallbackYear
}

const extractSearchResultUrl = (href: string): string | null => {
  if (!href) return null

  const normalizedHref = decodeHtmlEntities(href.trim())

  const resolveDuckDuckGoRedirect = (value: string): string | null => {
    try {
      const parsed = new URL(value)
      const host = parsed.hostname.toLowerCase()
      if (!host.includes('duckduckgo.com')) {
        return null
      }

      if (!parsed.pathname.startsWith('/l/')) {
        return null
      }

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
    const resolved = resolveDuckDuckGoRedirect(`https:${normalizedHref}`)
    if (resolved) {
      return resolved
    }

    return `https:${normalizedHref}`
  }

  if (normalizedHref.startsWith('http://') || normalizedHref.startsWith('https://')) {
    const resolved = resolveDuckDuckGoRedirect(normalizedHref)
    if (resolved) {
      return resolved
    }

    return normalizedHref
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

const buildCompanySearchQuery = (companyName: string, objective: string | null): string => {
  if (!objective?.trim()) {
    return companyName.trim()
  }

  return `${companyName.trim()} ${objective.trim()}`.trim()
}

const scoreKeywordHits = (content: string, companyName: string): number => {
  const normalized = content.toLowerCase()
  const companyTokens = companyName
    .toLowerCase()
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 2)

  const keywordScore = STRATEGY_KEYWORDS.reduce((acc, keyword) => {
    return acc + (normalized.includes(keyword) ? 1 : 0)
  }, 0)

  const companyScore = companyTokens.reduce((acc, token) => {
    return acc + (normalized.includes(token) ? 1 : 0)
  }, 0)

  return keywordScore * 2 + companyScore
}

const normalizeForComparison = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const scoreSearchCandidate = (candidate: WebSearchCandidate, companyName: string): number => {
  const domain = extractDomain(candidate.url)
  const content = `${candidate.title} ${candidate.snippet} ${domain}`
  let score = scoreKeywordHits(content, companyName)

  const normalizedCompany = normalizeForComparison(companyName)
  const companyTokens = normalizedCompany
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 2)

  const domainCompact = domain.replace(/[^a-z0-9]+/g, '')
  const companyCompact = normalizedCompany.replace(/[^a-z0-9]+/g, '')

  if (companyCompact && domainCompact.includes(companyCompact)) {
    score += 24
  }

  const matchedDomainTokens = companyTokens.filter(token => domain.includes(token)).length
  score += matchedDomainTokens * 6

  if (candidate.title.toLowerCase().includes('official')) {
    score += 4
  }

  if (
    domain.includes('linkedin.com') ||
    domain.includes('facebook.com') ||
    domain.includes('crunchbase.com') ||
    domain.includes('leadiq.com')
  ) {
    score -= 4
  }

  if (candidate.provider === 'duckduckgo_html' || candidate.provider === 'duckduckgo_lite') {
    score += 2
  }

  if (candidate.provider === 'wikipedia_api') {
    score -= 1
  }

  return score
}

const dedupeCandidates = (candidates: readonly WebSearchCandidate[]): WebSearchCandidate[] => {
  const seen = new Set<string>()
  const deduped: WebSearchCandidate[] = []

  for (const candidate of candidates) {
    const key = candidate.url.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    deduped.push(candidate)
  }

  return deduped
}

const collectDuckduckgoHtmlCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const searchResponse = await fetchWithTimeout(
    `${SEARCH_BASE_URL}?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'User-Agent': 'simple-eam-ai-worker/1.0',
      },
    },
    getWebFetchTimeoutMs()
  )

  if (!searchResponse.ok) {
    throw new Error(`DuckDuckGo HTML search failed with status ${searchResponse.status}`)
  }

  const html = await searchResponse.text()
  const matches = html.matchAll(
    /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
  )

  const links: WebSearchCandidate[] = []

  for (const match of matches) {
    const resolvedUrl = extractSearchResultUrl(match[1])
    if (!resolvedUrl) {
      continue
    }

    links.push({
      provider: 'duckduckgo_html',
      url: resolvedUrl,
      title: asString(stripHtml(match[2]), resolvedUrl, 180),
      snippet: '',
    })

    if (links.length >= maxResults) {
      break
    }
  }

  return links
}

const collectDuckduckgoLiteCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const searchResponse = await fetchWithTimeout(
    `${SEARCH_LITE_BASE_URL}?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'User-Agent': 'simple-eam-ai-worker/1.0',
      },
    },
    getWebFetchTimeoutMs()
  )

  if (!searchResponse.ok) {
    throw new Error(`DuckDuckGo Lite search failed with status ${searchResponse.status}`)
  }

  const html = await searchResponse.text()
  const matches = html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)
  const links: WebSearchCandidate[] = []

  for (const match of matches) {
    const resolvedUrl = extractSearchResultUrl(match[1])
    if (!resolvedUrl) {
      continue
    }

    links.push({
      provider: 'duckduckgo_lite',
      url: resolvedUrl,
      title: asString(stripHtml(match[2]), resolvedUrl, 180),
      snippet: '',
    })

    if (links.length >= maxResults) {
      break
    }
  }

  return links
}

const collectWikipediaCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const response = await fetchWithTimeout(
    `${WIKIPEDIA_SEARCH_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&utf8=1&srlimit=${Math.min(maxResults, 10)}`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'simple-eam-ai-worker/1.0',
      },
    },
    getWebFetchTimeoutMs()
  )

  if (!response.ok) {
    throw new Error(`Wikipedia search failed with status ${response.status}`)
  }

  const payload = (await response.json().catch(() => null)) as {
    query?: { search?: Array<{ title?: string; snippet?: string }> }
  } | null

  const results = payload?.query?.search ?? []

  return results
    .map(result => {
      const title = (result.title ?? '').trim()
      if (!title) {
        return null
      }

      return {
        provider: 'wikipedia_api',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`,
        title,
        snippet: stripHtml(result.snippet ?? ''),
      } satisfies WebSearchCandidate
    })
    .filter((result): result is WebSearchCandidate => Boolean(result))
    .slice(0, maxResults)
}

const collectSearxngCandidates = async (
  query: string,
  maxResults: number
): Promise<WebSearchCandidate[]> => {
  const searxngUrl = getSearxngUrl()
  if (!searxngUrl) {
    return []
  }

  const url = new URL(searxngUrl)
  if (!url.pathname || url.pathname === '/') {
    url.pathname = '/search'
  }
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'simple-eam-ai-worker/1.0',
  }

  const apiKey = getSearxngApiKey()
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const response = await fetchWithTimeout(
    url.toString(),
    {
      headers,
    },
    getWebFetchTimeoutMs()
  )

  if (!response.ok) {
    throw new Error(`SearXNG search failed with status ${response.status}`)
  }

  const payload = (await response.json().catch(() => null)) as {
    results?: Array<{ title?: string; url?: string; content?: string }>
  } | null

  const results = payload?.results ?? []
  return results
    .map(result => {
      const rawUrl = result.url?.trim() ?? ''
      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        return null
      }

      return {
        provider: 'searxng',
        url: rawUrl,
        title: asString(result.title, rawUrl, 180),
        snippet: asString(result.content, '', 240),
      } satisfies WebSearchCandidate
    })
    .filter((result): result is WebSearchCandidate => Boolean(result))
    .slice(0, maxResults)
}

const collectSearchCandidates = async (input: {
  companyName: string
  objective: string | null
  maxResults: number
}): Promise<{
  query: string
  providers: readonly string[]
  providerResults: Record<string, { candidates: number; error?: string }>
  candidates: WebSearchCandidate[]
}> => {
  const query = buildCompanySearchQuery(input.companyName, input.objective)
  const providers = getSearchProviders()
  const providerResults: Record<string, { candidates: number; error?: string }> = {}
  const allCandidates: WebSearchCandidate[] = []

  for (const provider of providers) {
    try {
      const providerCandidates =
        provider === 'duckduckgo_html'
          ? await collectDuckduckgoHtmlCandidates(query, input.maxResults)
          : provider === 'duckduckgo_lite'
            ? await collectDuckduckgoLiteCandidates(query, input.maxResults)
            : provider === 'wikipedia_api'
              ? await collectWikipediaCandidates(query, input.maxResults)
              : provider === 'searxng'
                ? await collectSearxngCandidates(query, input.maxResults)
                : []

      providerResults[provider] = {
        candidates: providerCandidates.length,
      }
      allCandidates.push(...providerCandidates)
    } catch (error) {
      providerResults[provider] = {
        candidates: 0,
        error: error instanceof Error ? error.message : 'unknown provider error',
      }
    }
  }

  const deduped = dedupeCandidates(allCandidates)
  const ranked = deduped
    .map(candidate => ({
      candidate,
      score: scoreSearchCandidate(candidate, input.companyName),
    }))
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.candidate)

  return {
    query,
    providers,
    providerResults,
    candidates: ranked.slice(0, Math.max(input.maxResults, getWebSourceCount() * 4)),
  }
}

const collectWebSources = async (
  companyName: string,
  objective: string | null
): Promise<StrategicResearchSource[]> => {
  const maxSources = getWebSourceCount()
  const maxResults = getWebSearchResultCount()

  console.info('[AI RUN][WORKER][WEB_RESEARCH][SEARCH]', {
    companyName,
    maxSources,
    maxResults,
    providers: getSearchProviders(),
    hasSearxngUrl: Boolean(getSearxngUrl()),
    webFetchTimeoutMs: getWebFetchTimeoutMs(),
  })

  const candidateResult = await collectSearchCandidates({
    companyName,
    objective,
    maxResults,
  })

  const sources: StrategicResearchSource[] = []
  const matchedSources: StrategicResearchSource[] = []
  const fallbackSources: StrategicResearchSource[] = []
  const diagnostics = {
    query: candidateResult.query,
    providers: candidateResult.providers,
    providerResults: candidateResult.providerResults,
    candidateLinks: candidateResult.candidates.length,
    attemptedLinks: 0,
    keywordMatchedPages: 0,
    fallbackPages: 0,
    skippedNonOkStatus: 0,
    skippedUnsupportedContentType: 0,
    skippedEmptySnippet: 0,
    skippedFetchError: 0,
    sampleFailures: [] as Array<{
      url: string
      reason: string
      status?: number
      contentType?: string
      message?: string
    }>,
  }

  for (const link of candidateResult.candidates) {
    diagnostics.attemptedLinks += 1
    try {
      const pageResponse = await fetchWithTimeout(
        link.url,
        {
          headers: {
            'User-Agent': 'simple-eam-ai-worker/1.0',
          },
        },
        getWebFetchTimeoutMs()
      )

      if (!pageResponse.ok) {
        diagnostics.skippedNonOkStatus += 1
        if (diagnostics.sampleFailures.length < 6) {
          diagnostics.sampleFailures.push({
            url: link.url,
            reason: 'non-ok-status',
            status: pageResponse.status,
          })
        }
        continue
      }

      const contentType = pageResponse.headers.get('content-type') ?? ''
      if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
        diagnostics.skippedUnsupportedContentType += 1
        if (diagnostics.sampleFailures.length < 6) {
          diagnostics.sampleFailures.push({
            url: link.url,
            reason: 'unsupported-content-type',
            contentType,
          })
        }
        continue
      }

      const rawContent = await pageResponse.text()
      const cleanedText = stripHtml(rawContent)
      const snippet = limitText(cleanedText, 800)
      if (!snippet) {
        diagnostics.skippedEmptySnippet += 1
        if (diagnostics.sampleFailures.length < 6) {
          diagnostics.sampleFailures.push({
            url: link.url,
            reason: 'empty-snippet',
          })
        }
        continue
      }

      const keywordScore = scoreKeywordHits(
        `${link.title} ${link.snippet} ${cleanedText.slice(0, 4000)}`,
        companyName
      )

      const source: StrategicResearchSource = {
        title: link.title,
        url: link.url,
        snippet,
      }

      if (keywordScore > 0) {
        diagnostics.keywordMatchedPages += 1
        matchedSources.push(source)
      } else {
        diagnostics.fallbackPages += 1
        fallbackSources.push(source)
      }

      if (matchedSources.length >= maxSources) {
        break
      }
    } catch {
      diagnostics.skippedFetchError += 1
      if (diagnostics.sampleFailures.length < 6) {
        diagnostics.sampleFailures.push({
          url: link.url,
          reason: 'fetch-error',
        })
      }
      continue
    }
  }

  if (matchedSources.length > 0) {
    sources.push(...matchedSources.slice(0, maxSources))
  } else {
    sources.push(...fallbackSources.slice(0, maxSources))
  }

  console.info('[AI RUN][WORKER][WEB_RESEARCH][DIAGNOSTICS]', {
    ...diagnostics,
    selectedSourcesFrom: matchedSources.length > 0 ? 'keyword-matched' : 'general-fallback',
    collectedSources: sources.length,
  })

  return sources
}

const buildLlmPrompt = (input: {
  companyName: string
  prompt: string
  objective: string | null
  sources: readonly StrategicResearchSource[]
}) => {
  const sourcesBlock = input.sources
    .map((source, index) => {
      return [
        `Source ${index + 1}: ${source.title}`,
        `URL: ${source.url}`,
        `Snippet: ${source.snippet}`,
      ].join('\n')
    })
    .join('\n\n')

  return [
    'You are an enterprise strategy analyst.',
    'Return ONLY valid JSON without markdown.',
    'Use the provided web sources and user prompt to create a strategic draft for the company.',
    '',
    `Company: ${input.companyName}`,
    `Objective: ${input.objective ?? 'not provided'}`,
    `User Prompt: ${input.prompt}`,
    '',
    'Required JSON shape:',
    '{',
    '  "summary": "string",',
    '  "mission": {"name": "string", "purposeStatement": "string", "keywords": ["string"], "year": "YYYY"},',
    '  "vision": {"name": "string", "visionStatement": "string", "timeHorizon": "string", "year": "YYYY"},',
    '  "values": [{"name": "string", "valueStatement": "string"}],',
    '  "goals": [{"name": "string", "goalStatement": "string"}],',
    '  "strategies": [{"name": "string", "description": "string"}],',
    '  "bmc": {',
    '    "keyPartners": ["string"],',
    '    "keyActivities": ["string"],',
    '    "valuePropositions": ["string"],',
    '    "customerSegments": ["string"],',
    '    "channels": ["string"],',
    '    "revenueStreams": ["string"],',
    '    "costStructure": ["string"]',
    '  }',
    '}',
    '',
    'Web sources:',
    sourcesBlock || 'No web sources were available.',
  ].join('\n')
}

const extractLlmText = (payload: unknown): string => {
  if (typeof payload === 'string') {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const data = payload as Record<string, unknown>
  const choices = data.choices
  if (Array.isArray(choices) && choices.length > 0) {
    const firstChoice = choices[0] as Record<string, unknown>
    const message = firstChoice.message as Record<string, unknown> | undefined
    const content = message?.content

    if (typeof content === 'string') {
      return content
    }

    if (Array.isArray(content)) {
      const assembled = content
        .map(entry => {
          if (typeof entry === 'string') return entry
          if (entry && typeof entry === 'object' && 'text' in entry) {
            const text = (entry as { text?: unknown }).text
            return typeof text === 'string' ? text : ''
          }
          return ''
        })
        .join('')
      if (assembled.trim()) return assembled
    }
  }

  if (typeof data.response === 'string') {
    return data.response
  }

  if (typeof data.output === 'string') {
    return data.output
  }

  if (typeof data.text === 'string') {
    return data.text
  }

  return ''
}

const callLlm = async (prompt: string): Promise<string> => {
  const llmConfig = resolveLlmConfig()
  const llmUrl = llmConfig.endpointUrl
  const llmApiKey = getLlmApiKey()
  const llmModel = llmConfig.model
  const llmTimeoutMs = getLlmTimeoutMs()
  const llmRetryCount = getLlmRetryCount()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (llmApiKey) {
    headers.Authorization = `Bearer ${llmApiKey}`
  }

  const openAiLikeBody: Record<string, unknown> = {
    messages: [
      {
        role: 'system',
        content: 'You generate enterprise strategic drafts. Return only JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
  }

  if (llmModel) {
    openAiLikeBody.model = llmModel
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= llmRetryCount; attempt += 1) {
    try {
      const openAiLikeResponse = await fetchWithTimeout(
        llmUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(openAiLikeBody),
        },
        llmTimeoutMs
      )

      if (openAiLikeResponse.ok) {
        const payload = (await openAiLikeResponse.json().catch(() => null)) as unknown
        const text = extractLlmText(payload)
        if (text.trim()) {
          return text
        }
      }

      const genericResponse = await fetchWithTimeout(
        llmUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            prompt,
            temperature: 0.2,
            model: llmModel || undefined,
          }),
        },
        llmTimeoutMs
      )

      if (!genericResponse.ok) {
        const bodyText = await genericResponse.text().catch(() => '')
        throw new Error(
          `LLM request failed (${genericResponse.status}): ${limitText(bodyText, 240) || 'no response body'}`
        )
      }

      const payload = (await genericResponse
        .json()
        .catch(async () => ({ text: await genericResponse.text() }))) as unknown
      const text = extractLlmText(payload)
      if (!text.trim()) {
        throw new Error('LLM response did not contain usable text output')
      }

      return text
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Unknown LLM error')

      if (normalizedError.name === 'AbortError') {
        lastError = new Error(
          `LLM request timed out after ${llmTimeoutMs}ms (attempt ${attempt + 1})`
        )
      } else {
        lastError = normalizedError
      }

      if (attempt < llmRetryCount) {
        await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)))
      }
    }
  }

  throw lastError ?? new Error('LLM request failed without a detailed error')
}

const createFallbackDraft = (input: {
  companyName: string
  prompt: string
  objective: string | null
  sources: readonly StrategicResearchSource[]
}): StrategicDraftPayload => {
  const year = `${new Date().getUTCFullYear()}-01-01`
  const compactPrompt = limitText(input.prompt, 160)
  const objectivePrefix = input.objective ? limitText(input.objective, 160) : 'Strategic alignment'

  return {
    companyName: input.companyName,
    generatedAt: new Date().toISOString(),
    mission: {
      name: `${input.companyName} Mission`,
      purposeStatement: `Deliver business value through ${objectivePrefix.toLowerCase()} with focus on ${compactPrompt.toLowerCase()}.`,
      keywords: ['Value delivery', 'Customer focus', 'Execution excellence'],
      year,
    },
    vision: {
      name: `${input.companyName} Vision`,
      visionStatement: `Become a strategically resilient and digitally enabled enterprise driven by ${compactPrompt.toLowerCase()}.`,
      timeHorizon: '3-5 years',
      year,
    },
    values: [
      { name: 'Customer Focus', valueStatement: 'We prioritize measurable customer outcomes.' },
      {
        name: 'Innovation',
        valueStatement: 'We continuously modernize capabilities and services.',
      },
      { name: 'Accountability', valueStatement: 'We take ownership for strategic execution.' },
    ],
    goals: [
      {
        name: 'Increase Strategic Alignment',
        goalStatement: 'Align business and IT initiatives around shared strategic priorities.',
      },
      {
        name: 'Improve Operational Efficiency',
        goalStatement: 'Reduce process and system friction across core value streams.',
      },
      {
        name: 'Strengthen Governance',
        goalStatement: 'Establish transparent decision-making and architecture standards.',
      },
    ],
    strategies: [
      {
        name: 'Capability-led Planning',
        description: 'Prioritize investments by business capabilities.',
      },
      {
        name: 'Platform Consolidation',
        description: 'Reduce complexity through standard platforms.',
      },
      {
        name: 'Data Quality Program',
        description: 'Improve trust and usability of enterprise data.',
      },
    ],
    sources: input.sources,
    bmc: {
      keyPartners: ['Technology partners', 'Implementation partners'],
      keyActivities: ['Architecture governance', 'Capability roadmapping'],
      valuePropositions: ['Faster strategic execution', 'Improved transparency'],
      customerSegments: ['Executive stakeholders', 'Business domain owners'],
      channels: ['Portfolio reviews', 'Architecture boards'],
      revenueStreams: ['Cost reduction', 'Productivity gains'],
      costStructure: ['Transformation programs', 'Platform operations'],
    },
  }
}

const buildDraftFromModelOutput = (input: {
  companyName: string
  modelOutput: Record<string, unknown>
  sources: readonly StrategicResearchSource[]
}): StrategicDraftPayload => {
  const year = `${new Date().getUTCFullYear()}-01-01`
  const mission = (input.modelOutput.mission as Record<string, unknown> | undefined) ?? {}
  const vision = (input.modelOutput.vision as Record<string, unknown> | undefined) ?? {}
  const bmc = (input.modelOutput.bmc as Record<string, unknown> | undefined) ?? {}

  const valuesRaw = Array.isArray(input.modelOutput.values)
    ? (input.modelOutput.values as unknown[])
    : []
  const goalsRaw = Array.isArray(input.modelOutput.goals)
    ? (input.modelOutput.goals as unknown[])
    : []
  const strategiesRaw = Array.isArray(input.modelOutput.strategies)
    ? (input.modelOutput.strategies as unknown[])
    : []

  const values = valuesRaw
    .map(item => {
      const value = (item as Record<string, unknown>) ?? {}
      return {
        name: asString(value.name, 'Strategic Value', 120),
        valueStatement: asString(
          value.valueStatement,
          'This value supports strategic execution.',
          280
        ),
      }
    })
    .slice(0, 8)

  const goals = goalsRaw
    .map(item => {
      const goal = (item as Record<string, unknown>) ?? {}
      return {
        name: asString(goal.name, 'Strategic Goal', 120),
        goalStatement: asString(goal.goalStatement, 'This goal guides strategic priorities.', 280),
      }
    })
    .slice(0, 8)

  const strategies = strategiesRaw
    .map(item => {
      const strategy = (item as Record<string, unknown>) ?? {}
      return {
        name: asString(strategy.name, 'Strategic Initiative', 120),
        description: asString(strategy.description, 'This strategy supports target goals.', 280),
      }
    })
    .slice(0, 8)

  return {
    companyName: input.companyName,
    generatedAt: new Date().toISOString(),
    mission: {
      name: asString(mission.name, `${input.companyName} Mission`, 120),
      purposeStatement: asString(
        mission.purposeStatement,
        'Deliver measurable strategic value for customers and stakeholders.',
        320
      ),
      keywords: asStringArray(mission.keywords, ['Strategy', 'Execution', 'Value'], 60),
      year: ensureDateYearString(mission.year, year),
    },
    vision: {
      name: asString(vision.name, `${input.companyName} Vision`, 120),
      visionStatement: asString(
        vision.visionStatement,
        'Build a resilient and future-ready enterprise architecture.',
        320
      ),
      timeHorizon: asString(vision.timeHorizon, '3-5 years', 80),
      year: ensureDateYearString(vision.year, year),
    },
    values:
      values.length > 0
        ? values
        : [{ name: 'Customer Focus', valueStatement: 'We prioritize customer value.' }],
    goals:
      goals.length > 0
        ? goals
        : [
            {
              name: 'Improve Strategic Alignment',
              goalStatement: 'Align architecture and business priorities.',
            },
          ],
    strategies:
      strategies.length > 0
        ? strategies
        : [
            {
              name: 'Capability-led Transformation',
              description: 'Prioritize initiatives by strategic capabilities.',
            },
          ],
    sources: input.sources,
    bmc: {
      keyPartners: asStringArray(bmc.keyPartners, ['Strategic technology partners']),
      keyActivities: asStringArray(bmc.keyActivities, ['Architecture governance']),
      valuePropositions: asStringArray(bmc.valuePropositions, [
        'Transparent strategic decision support',
      ]),
      customerSegments: asStringArray(bmc.customerSegments, ['Business and IT leadership']),
      channels: asStringArray(bmc.channels, ['Architecture board', 'Portfolio review']),
      revenueStreams: asStringArray(bmc.revenueStreams, ['Efficiency gains']),
      costStructure: asStringArray(bmc.costStructure, ['Transformation investments']),
    },
  }
}

interface StrategicEnrichmentGraphState {
  input: GenerateSummaryInput
  companyName: string
  objective: string | null
  sources: StrategicResearchSource[]
  prompt: string
  summary: string
  draftPayload: StrategicDraftPayload | null
  llmErrorMessage: string | null
  fallbackEnabled: boolean
}

const strategicEnrichmentState = Annotation.Root({
  input: Annotation<GenerateSummaryInput>({
    reducer: (_, update) => update,
  }),
  companyName: Annotation<string>({
    reducer: (_, update) => update,
  }),
  objective: Annotation<string | null>({
    reducer: (_, update) => update,
  }),
  sources: Annotation<StrategicResearchSource[]>({
    reducer: (_, update) => update,
    default: () => [],
  }),
  prompt: Annotation<string>({
    reducer: (_, update) => update,
    default: () => '',
  }),
  summary: Annotation<string>({
    reducer: (_, update) => update,
    default: () => '',
  }),
  draftPayload: Annotation<StrategicDraftPayload | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  llmErrorMessage: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  fallbackEnabled: Annotation<boolean>({
    reducer: (_, update) => update,
  }),
})

const executeStrategicEnrichmentGraph = async (
  input: GenerateSummaryInput,
  companyName: string,
  objective: string | null
): Promise<GeneratedRunOutput> => {
  const workflow = new StateGraph(strategicEnrichmentState)
    .addNode('research', async state => {
      try {
        const sources = await collectWebSources(state.companyName, state.objective)
        console.info('[AI RUN][WORKER][WEB_RESEARCH][RESULT]', {
          companyId: state.input.companyId,
          companyName: state.companyName,
          sourceCount: sources.length,
          sources: sources.map(source => ({
            title: source.title,
            url: source.url,
            snippetPreview:
              source.snippet.length > 220 ? `${source.snippet.slice(0, 220)}…` : source.snippet,
          })),
        })
        return { sources }
      } catch (error) {
        console.warn('[AI RUN][WORKER][WEB_RESEARCH][FAILED]', {
          companyId: state.input.companyId,
          error: error instanceof Error ? error.message : 'Unknown web research error',
        })
        return { sources: [] }
      }
    })
    .addNode('preparePrompt', async state => {
      const prompt = buildLlmPrompt({
        companyName: state.companyName,
        prompt: state.input.prompt,
        objective: state.objective,
        sources: state.sources,
      })

      const llmConfig = resolveLlmConfig()
      const promptLoggingEnabled = isLlmPromptLoggingEnabled()

      console.info('[AI RUN][WORKER][LLM][REQUEST]', {
        companyId: state.input.companyId,
        llmUrl: llmConfig.endpointUrl,
        llmModel: llmConfig.model || null,
        llmTimeoutMs: getLlmTimeoutMs(),
        llmRetryCount: getLlmRetryCount(),
        sourcesCount: state.sources.length,
        promptLength: prompt.length,
        promptLoggingEnabled,
      })

      if (promptLoggingEnabled) {
        const previewChars = getLlmPromptPreviewChars()
        const promptPreview =
          prompt.length > previewChars ? `${prompt.slice(0, previewChars)}…` : prompt

        console.info('[AI RUN][WORKER][LLM][PROMPT_PREVIEW]', {
          companyId: state.input.companyId,
          previewChars,
          promptPreview,
        })
      }

      return { prompt }
    })
    .addNode('generateDraft', async state => {
      try {
        const llmRawText = await callLlm(state.prompt)
        const parsedOutput = parseJsonObject(llmRawText)

        if (!parsedOutput) {
          throw new Error('LLM output was not valid JSON')
        }

        const draftPayload = buildDraftFromModelOutput({
          companyName: state.companyName,
          modelOutput: parsedOutput,
          sources: state.sources,
        })

        const summary = asString(
          parsedOutput.summary,
          `Strategic enrichment draft generated for ${state.companyName} using ${state.sources.length} web sources.`,
          600
        )

        return {
          draftPayload,
          summary,
          llmErrorMessage: null,
        }
      } catch (error) {
        const llmConfig = resolveLlmConfig()
        const llmErrorMessage = error instanceof Error ? error.message : 'Unknown LLM error'

        console.warn('[AI RUN][WORKER][LLM][FAILED]', {
          companyId: state.input.companyId,
          llmUrl: llmConfig.endpointUrl,
          llmModel: llmConfig.model || null,
          llmTimeoutMs: getLlmTimeoutMs(),
          llmRetryCount: getLlmRetryCount(),
          fallbackEnabled: state.fallbackEnabled,
          error: llmErrorMessage,
        })

        return {
          llmErrorMessage,
        }
      }
    })
    .addNode('fallbackDraft', async state => {
      console.warn('[AI RUN][WORKER][LLM][FALLBACK_ENABLED]', {
        companyId: state.input.companyId,
        message: 'Using template fallback because AI_ALLOW_LLM_FALLBACK=true',
      })

      const draftPayload = createFallbackDraft({
        companyName: state.companyName,
        prompt: state.input.prompt,
        objective: state.objective,
        sources: state.sources,
      })

      const summary = `Strategic enrichment draft generated for ${state.companyName} using fallback template and ${state.sources.length} web sources.`

      return {
        draftPayload,
        summary,
      }
    })
    .addNode('failDraftGeneration', async state => {
      throw new Error(state.llmErrorMessage ?? 'Strategic enrichment generation failed')
    })
    .addNode('completeDraft', async () => ({}))
    .addEdge(START, 'research')
    .addEdge('research', 'preparePrompt')
    .addEdge('preparePrompt', 'generateDraft')
    .addConditionalEdges(
      'generateDraft',
      state => {
        if (!state.llmErrorMessage) {
          return 'completeDraft'
        }

        return state.fallbackEnabled ? 'fallbackDraft' : 'failDraftGeneration'
      },
      {
        completeDraft: 'completeDraft',
        fallbackDraft: 'fallbackDraft',
        failDraftGeneration: 'failDraftGeneration',
      }
    )
    .addEdge('fallbackDraft', END)
    .addEdge('completeDraft', END)
    .addEdge('failDraftGeneration', END)

  const graph = workflow.compile()
  const result = await graph.invoke({
    input,
    companyName,
    objective,
    sources: [],
    prompt: '',
    summary: '',
    draftPayload: null,
    llmErrorMessage: null,
    fallbackEnabled: isLlmFallbackEnabled(),
  })

  if (!result.draftPayload) {
    throw new Error('Strategic enrichment graph completed without draft payload')
  }

  return {
    summary: result.summary,
    draftPayload: result.draftPayload,
  }
}

export const markAiRunRunning = async (runId: string) => {
  throw new Error('markAiRunRunning requires access token input after GraphQL migration')
}

export const generateAiRunSummary = async (
  input: GenerateSummaryInput
): Promise<GeneratedRunOutput> => {
  console.info('[AI RUN][WORKER][SUMMARY_GENERATION]', {
    promptLength: input.prompt.trim().length,
    hasObjective: Boolean(input.objective?.trim()),
    useCase: input.useCase,
    companyId: input.companyId,
  })

  const companyName = input.companyName || 'Selected Company'
  const normalizedObjective = input.objective?.trim() || null

  return executeStrategicEnrichmentGraph(input, companyName, normalizedObjective)
}

export const markAiRunCompleted = async ({ runId, summary, draftPayload }: CompleteAiRunInput) => {
  throw new Error('markAiRunCompleted requires access token input after GraphQL migration')
}

export const markAiRunFailed = async ({ runId, errorMessage }: FailAiRunInput) => {
  throw new Error('markAiRunFailed requires access token input after GraphQL migration')
}

export const markAiRunRunningWithToken = async (input: { runId: string; accessToken: string }) => {
  const timestamp = new Date().toISOString()
  console.info('[AI RUN][WORKER][RUNNING]', { runId: input.runId, timestamp })

  await graphqlRequest({
    query: `
      mutation MarkAiRunRunning($runId: ID!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: { status: "RUNNING", startedAt: datetime() }
        ) {
          aiRuns { id }
        }
      }
    `,
    variables: {
      runId: input.runId,
    },
    accessToken: input.accessToken,
  })
}

export const markAiRunCompletedWithToken = async (
  input: CompleteAiRunInput & { accessToken: string }
) => {
  const timestamp = new Date().toISOString()
  console.info('[AI RUN][WORKER][COMPLETED]', {
    runId: input.runId,
    timestamp,
    summaryLength: input.summary.length,
  })

  await graphqlRequest({
    query: `
      mutation MarkAiRunCompleted($runId: ID!, $summary: String!, $draftPayload: String) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: {
            status: "COMPLETED"
            resultSummary: $summary
            draftPayload: $draftPayload
            approvalStatus: "PENDING_REVIEW"
            completedAt: datetime()
          }
        ) {
          aiRuns { id }
        }
      }
    `,
    variables: {
      runId: input.runId,
      summary: input.summary,
      draftPayload: input.draftPayload ? JSON.stringify(input.draftPayload) : null,
    },
    accessToken: input.accessToken,
  })
}

export const markAiRunFailedWithToken = async (input: FailAiRunInput & { accessToken: string }) => {
  const timestamp = new Date().toISOString()
  console.error('[AI RUN][WORKER][FAILED]', {
    runId: input.runId,
    timestamp,
    errorMessage: input.errorMessage,
  })

  await graphqlRequest({
    query: `
      mutation MarkAiRunFailed($runId: ID!, $errorMessage: String!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: {
            status: "FAILED"
            errorMessage: $errorMessage
            completedAt: datetime()
          }
        ) {
          aiRuns { id }
        }
      }
    `,
    variables: {
      runId: input.runId,
      errorMessage: input.errorMessage,
    },
    accessToken: input.accessToken,
  })
}
