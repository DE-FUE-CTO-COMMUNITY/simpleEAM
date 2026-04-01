import { LlmConfig } from '../types'

// ─────────────────────────────────────────────
// Env-based operational config (no URLs/keys)
// ─────────────────────────────────────────────

const DEFAULT_LLM_TIMEOUT_MS = 45_000
const DEFAULT_LLM_RETRY_COUNT = 1
const DEFAULT_ALLOW_LLM_FALLBACK = false
const DEFAULT_LOG_LLM_PROMPT = false
const DEFAULT_LLM_PROMPT_PREVIEW_CHARS = 1200

export const getLlmTimeoutMs = (): number => {
  const value = Number(process.env.AI_LLM_TIMEOUT_MS)
  return Number.isFinite(value) && value >= 5000 ? Math.floor(value) : DEFAULT_LLM_TIMEOUT_MS
}

export const getLlmRetryCount = (): number => {
  const value = Number(process.env.AI_LLM_RETRY_COUNT)
  return Number.isFinite(value) && value >= 0
    ? Math.min(Math.floor(value), 3)
    : DEFAULT_LLM_RETRY_COUNT
}

export const isLlmFallbackEnabled = (): boolean => {
  const value = process.env.AI_ALLOW_LLM_FALLBACK?.trim().toLowerCase()
  if (!value) return DEFAULT_ALLOW_LLM_FALLBACK
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}

export const isLlmPromptLoggingEnabled = (): boolean => {
  const value = process.env.AI_LOG_LLM_PROMPT?.trim().toLowerCase()
  if (!value) return DEFAULT_LOG_LLM_PROMPT
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}

export const getLlmPromptPreviewChars = (): number => {
  const value = Number(process.env.AI_LLM_PROMPT_LOG_PREVIEW_CHARS)
  return Number.isFinite(value) && value >= 200
    ? Math.min(Math.floor(value), 8000)
    : DEFAULT_LLM_PROMPT_PREVIEW_CHARS
}

// ─────────────────────────────────────────────
// Text utilities
// ─────────────────────────────────────────────

export const limitText = (value: string, maxLength: number): string => {
  const normalized = value.trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}

export const decodeHtmlEntities = (value: string): string =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

export const stripHtml = (value: string): string =>
  decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// ─────────────────────────────────────────────
// JSON / type-safe extraction helpers
// ─────────────────────────────────────────────

const extractJsonObjectText = (raw: string): string | null => {
  const trimmed = raw.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed
  const firstCurly = trimmed.indexOf('{')
  const lastCurly = trimmed.lastIndexOf('}')
  if (firstCurly === -1 || lastCurly === -1 || lastCurly <= firstCurly) return null
  return trimmed.slice(firstCurly, lastCurly + 1)
}

export const parseJsonObject = (raw: string): Record<string, unknown> | null => {
  const jsonText = extractJsonObjectText(raw)
  if (!jsonText) return null
  try {
    const parsed = JSON.parse(jsonText) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

export const asString = (value: unknown, fallback: string, maxLength = 240): string => {
  if (typeof value !== 'string' || !value.trim()) return fallback
  return limitText(value, maxLength)
}

export const asStringArray = (
  value: unknown,
  fallback: readonly string[],
  maxLength = 120
): readonly string[] => {
  if (!Array.isArray(value)) return fallback
  const normalized = value
    .map(entry => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean)
    .map(entry => limitText(entry, maxLength))
  return normalized.length > 0 ? normalized : fallback
}

export const ensureDateYearString = (value: unknown, fallbackYear: string): string => {
  if (typeof value !== 'string') return fallbackYear
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  if (/^\d{4}$/.test(value)) return `${value}-01-01`
  return fallbackYear
}

// ─────────────────────────────────────────────
// HTTP utilities
// ─────────────────────────────────────────────

export const fetchWithTimeout = async (
  url: string,
  init: RequestInit = {},
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

// ─────────────────────────────────────────────
// LLM configuration helpers
// ─────────────────────────────────────────────

export const resolveLlmConfig = (
  config: Pick<LlmConfig, 'llmUrl' | 'llmModel'>
): { endpointUrl: string; model: string } => {
  try {
    const parsedUrl = new URL(config.llmUrl)
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)

    if (pathSegments.length >= 2 && pathSegments[0] === 'chat') {
      const modelFromPath = decodeURIComponent(pathSegments.slice(1).join('/'))
      parsedUrl.pathname = '/v1/chat/completions'
      return { endpointUrl: parsedUrl.toString(), model: config.llmModel || modelFromPath }
    }

    if (pathSegments.length === 1 && pathSegments[0] === 'chat') {
      parsedUrl.pathname = '/v1/chat/completions'
      return { endpointUrl: parsedUrl.toString(), model: config.llmModel }
    }

    return { endpointUrl: config.llmUrl, model: config.llmModel }
  } catch {
    return { endpointUrl: config.llmUrl, model: config.llmModel }
  }
}

// ─────────────────────────────────────────────
// LLM response text extraction
// ─────────────────────────────────────────────

export const extractLlmText = (payload: unknown): string => {
  if (typeof payload === 'string') return payload
  if (!payload || typeof payload !== 'object') return ''

  const data = payload as Record<string, unknown>
  const choices = data.choices

  if (Array.isArray(choices) && choices.length > 0) {
    const firstChoice = choices[0] as Record<string, unknown>
    const message = firstChoice.message as Record<string, unknown> | undefined
    const content = message?.content

    if (typeof content === 'string') return content

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

  if (typeof data.response === 'string') return data.response
  if (typeof data.output === 'string') return data.output
  if (typeof data.text === 'string') return data.text
  return ''
}

// ─────────────────────────────────────────────
// Core LLM call
// ─────────────────────────────────────────────

export const callLlm = async (
  prompt: string,
  config: LlmConfig,
  systemPrompt = 'You are a helpful enterprise AI assistant. Return only JSON when asked for structured output.'
): Promise<string> => {
  const llmConfig = resolveLlmConfig(config)
  const llmTimeoutMs = getLlmTimeoutMs()
  const llmRetryCount = getLlmRetryCount()

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (config.llmKey) headers.Authorization = `Bearer ${config.llmKey}`

  const openAiLikeBody: Record<string, unknown> = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  }
  if (llmConfig.model) openAiLikeBody.model = llmConfig.model

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= llmRetryCount; attempt += 1) {
    try {
      const openAiResponse = await fetchWithTimeout(
        llmConfig.endpointUrl,
        { method: 'POST', headers, body: JSON.stringify(openAiLikeBody) },
        llmTimeoutMs
      )

      if (openAiResponse.ok) {
        const payload = (await openAiResponse.json().catch(() => null)) as unknown
        const text = extractLlmText(payload)
        if (text.trim()) return text
      }

      const genericResponse = await fetchWithTimeout(
        llmConfig.endpointUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ prompt, temperature: 0.2, model: llmConfig.model || undefined }),
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
      if (!text.trim()) throw new Error('LLM response did not contain usable text output')
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
