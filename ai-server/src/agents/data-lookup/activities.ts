import { agentRegistry } from '../registry'
import { DataLookupInput, DataLookupOutput } from '../types'
import {
  callLlm,
  limitText,
  isLlmPromptLoggingEnabled,
  getLlmPromptPreviewChars,
} from '../shared/llm'
import { graphqlRequest } from '../../graphql/client'
import { TOOLS, TOOLS_PROMPT_SECTION, ToolCallResult } from './tools'
import { SCHEMA_DIGEST } from './generated-schema-digest'
import { resolveAgentRuntimeConfig } from '../shared/agent-config'
import { getAgentConfigDefault } from '../shared/default-agent-configs'

const DATA_LOOKUP_DEFAULT_CONFIG = getAgentConfigDefault('data-lookup')

// ─────────────────────────────────────────────
// Agent registration
// ─────────────────────────────────────────────

agentRegistry.register({
  id: 'data-lookup',
  name: 'Architecture Data Lookup Agent',
  description:
    'Queries live enterprise architecture data from the database via GraphQL. Use this agent for any question about EXISTING architecture content: lists, counts, relationships, graph traversals. Examples: "which applications support capability X and run on infrastructure Y", "which interfaces transfer confidential data", "how many active applications use supplier Z", "show all capabilities without supporting applications".',
  capabilities: [
    'Retrieve and count applications, capabilities, infrastructure, interfaces, data objects, organisations, persons, suppliers, AI components',
    'Traverse relationships across multiple hops (capability → applications → infrastructure, interface → data objects)',
    'Filter entities by status, criticality, data classification, type, name, vendor',
    'Answer complex multi-entity graph traversal questions from live database',
    'Identify gaps such as capabilities without supporting applications',
  ],
  inputDescription:
    '{ task: "natural language question about the architecture", context: "optional summary from previous steps", companyId: "company scope" }',
  outputDescription:
    '{ summary: "plain text answer with entities and relationships found", queryUsed: "tool name + args used", resultCount: N }',
})

// ─────────────────────────────────────────────
// Tool selection prompt
// ─────────────────────────────────────────────

const buildToolSelectionPrompt = (question: string, companyName: string, context: string): string =>
  [
    'You are an enterprise architecture assistant.',
    'Select the best tool to answer the user question and provide the arguments as a JSON object.',
    '',
    'Reply with ONLY a valid JSON object in this exact format (no explanation, no markdown):',
    '{ "tool": "<toolName>", "args": { ... } }',
    '',
    `Company: ${companyName}`,
    context ? `Context:\n${context}` : '',
    `Question: ${question}`,
    '',
    'Available tools:',
    TOOLS_PROMPT_SECTION,
    'genericGraphQuery:\n  Generate and execute a schema-compliant read-only GraphQL query with variables for advanced, multi-hop, or not-yet-toolized questions.',
    '',
    'Rules:',
    '- Reply with ONLY the JSON object — no text before or after it.',
    '- Use only the exact tool names listed above.',
    '- If no predefined tool can accurately answer, choose tool "genericGraphQuery" and set args = {}.',
    '- Omit args you do not need — include only relevant filters.',
    '- For count questions ("how many"), use countEntities.',
    '- For overview or summary questions, use getCompanyOverview.',
    '- IMPORTANT subject matching: if the question asks for applications, choose listApplications even if conditions mention interfaces or data objects.',
    '- If the question asks for business capabilities, choose listBusinessCapabilities.',
    '- If the question asks for interfaces, choose listApplicationInterfaces.',
    '- String filter values are treated as case-insensitive substring matches.',
    '- Do NOT add company filters — they are applied automatically.',
  ]
    .filter(Boolean)
    .join('\n')

const buildGenericQueryPrompt = (
  question: string,
  companyName: string,
  context: string,
  previousError?: string
): string =>
  [
    'You are an enterprise architecture GraphQL expert.',
    'Generate a valid READ-ONLY GraphQL query and variables JSON payload that answers the user question.',
    'Return ONLY JSON in this exact shape:',
    '{ "query": "query ...", "variables": { ... } }',
    '',
    `Company: ${companyName}`,
    context ? `Context from previous steps:\n${context}` : '',
    previousError
      ? `Previous query failed with error: ${previousError}\nFix the query accordingly.`
      : '',
    `User question: ${question}`,
    '',
    'Schema and filter syntax reference:',
    SCHEMA_DIGEST,
    '',
    'Critical rules:',
    '- Query must be read-only (query only, never mutation/subscription).',
    '- Use variable "$companyId" and apply company scope in where filters.',
    '- For Person use companies: { some: { id: { eq: $companyId } } }.',
    '- For most other entities use company: { some: { id: { eq: $companyId } } }.',
    '- For Company root query use id: { eq: $companyId }.',
    '- You may traverse multiple relationships (multi-hop) if needed to answer.',
    '- Prefer variables over inline literals for dynamic values.',
  ]
    .filter(Boolean)
    .join('\n')

// ─────────────────────────────────────────────
// Parse the LLM tool call response
// ─────────────────────────────────────────────

function parseToolCall(raw: string): { tool: string; args: Record<string, unknown> } {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error(`LLM response does not contain a JSON object: ${limitText(raw, 200)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    throw new Error(`Failed to parse LLM tool call JSON: ${limitText(jsonMatch[0], 200)}`)
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('LLM response is not a JSON object')
  }

  const obj = parsed as Record<string, unknown>
  if (typeof obj.tool !== 'string' || !obj.tool.trim()) {
    throw new Error('LLM response is missing the "tool" field')
  }

  const args =
    typeof obj.args === 'object' && obj.args !== null ? (obj.args as Record<string, unknown>) : {}

  return { tool: obj.tool.trim(), args }
}

function parseGenericQueryPayload(raw: string): {
  query: string
  variables: Record<string, unknown>
} {
  const cleaned = raw
    .replace(/^```(?:json|graphql)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error(`Generic query payload is not JSON: ${limitText(raw, 200)}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    throw new Error(`Failed to parse generic query JSON: ${limitText(jsonMatch[0], 300)}`)
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Generic query payload must be an object')
  }

  const obj = parsed as Record<string, unknown>
  if (typeof obj.query !== 'string' || !obj.query.trim()) {
    throw new Error('Generic query payload must include a non-empty "query" string')
  }

  const variables =
    obj.variables && typeof obj.variables === 'object'
      ? (obj.variables as Record<string, unknown>)
      : {}

  return { query: obj.query.trim(), variables }
}

const isReadOnlyQuery = (query: string): boolean => {
  const normalized = query.trim().toLowerCase()
  if (normalized.startsWith('mutation') || normalized.startsWith('subscription')) return false
  return !/\bmutation\b|\bsubscription\b/.test(normalized)
}

const hasCompanyScope = (query: string): boolean => {
  const compact = query.replace(/\s+/g, ' ')
  return (
    compact.includes('$companyId') &&
    (compact.match(/company\s*:\s*\{\s*some\s*:\s*\{\s*id\s*:\s*\{\s*eq\s*:\s*\$companyId/) ||
      compact.match(/companies\s*:\s*\{\s*some\s*:\s*\{\s*id\s*:\s*\{\s*eq\s*:\s*\$companyId/) ||
      compact.match(/id\s*:\s*\{\s*eq\s*:\s*\$companyId/)) !== null
  )
}

function inferPreferredTool(question: string): string | null {
  const q = question.toLowerCase()
  if (
    /(which|what|list|show).*business capabilities|business capabilities.*(which|what|list|show)/.test(
      q
    )
  ) {
    return 'listBusinessCapabilities'
  }
  if (/(which|what|list|show).*applications|applications.*(which|what|list|show)/.test(q)) {
    return 'listApplications'
  }
  if (/(which|what|list|show).*interfaces|interfaces.*(which|what|list|show)/.test(q)) {
    return 'listApplicationInterfaces'
  }
  if (/(which|what|list|show).*data objects|data objects.*(which|what|list|show)/.test(q)) {
    return 'listDataObjects'
  }
  return null
}

function inferCountEntityType(question: string): string | null {
  const q = question.toLowerCase()
  if (!(q.includes('how many') || q.includes('count') || q.includes('number of'))) {
    return null
  }

  if (q.includes('interface')) return 'applicationInterfaces'
  if (q.includes('application')) return 'applications'
  if (q.includes('capabilit')) return 'businessCapabilities'
  if (q.includes('process')) return 'businessProcesses'
  if (q.includes('data object') || q.includes('data objects')) return 'dataObjects'
  if (q.includes('infrastructure')) return 'infrastructures'
  if (q.includes('supplier')) return 'suppliers'
  if (q.includes('organisation') || q.includes('organization')) return 'organisations'
  if (q.includes('people') || q.includes('person') || q.includes('employee')) return 'people'
  if (q.includes('architecture')) return 'architectures'
  if (q.includes('ai component') || q.includes('ai components')) return 'aiComponents'
  if (q.includes('software product') || q.includes('software products')) return 'softwareProducts'

  return null
}

function enrichArgsFromQuestion(
  toolName: string,
  args: Record<string, unknown>,
  question: string
): Record<string, unknown> {
  const q = question.toLowerCase()
  const nextArgs: Record<string, unknown> = { ...args }

  if (toolName === 'listApplications') {
    if (q.includes('interface') && q.includes('data')) {
      if (!nextArgs.interfaceDataObjectNameContains) {
        const m = q.match(/([a-z][a-z0-9_-]*)\s+data/)
        if (m && m[1] !== 'interface' && m[1] !== 'interfaces') {
          nextArgs.interfaceDataObjectNameContains = m[1]
        }
      }
    }
  }

  return nextArgs
}

function buildDeterministicSummary(question: string, data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const q = question.toLowerCase()
  const entries = Object.entries(data as Record<string, unknown>)
  const arrEntry = entries.find(([, v]) => Array.isArray(v))
  if (!arrEntry) return null

  const [rootKey, value] = arrEntry
  const items = value as unknown[]
  if (items.length === 0) return `No matching items were found in ${rootKey}.`

  const asObj = items.filter(v => v && typeof v === 'object') as Array<Record<string, unknown>>
  if (asObj.length === 0) return null

  const names = asObj
    .map(item => {
      if (typeof item.name === 'string') return item.name
      const first = typeof item.firstName === 'string' ? item.firstName : ''
      const last = typeof item.lastName === 'string' ? item.lastName : ''
      const full = `${first} ${last}`.trim()
      return full || null
    })
    .filter((v): v is string => Boolean(v))

  if (names.length === 0) return null

  const uniqueSorted = [...new Set(names)].sort((a, b) => a.localeCompare(b))

  if (q.includes('which') || q.includes('list') || q.includes('show')) {
    return `${uniqueSorted.length} item(s):\n${uniqueSorted.map(name => `- ${name}`).join('\n')}`
  }

  return null
}

// ─────────────────────────────────────────────
// Result interpretation prompt
// ─────────────────────────────────────────────

const buildInterpretationPrompt = (
  question: string,
  companyName: string,
  toolName: string,
  rawResult: unknown
): string => {
  const resultText = JSON.stringify(rawResult, null, 2)
  const preview = limitText(resultText, 8000)

  return [
    'You are an enterprise architecture analyst.',
    'Based on the tool results below, write a clear and concise plain text answer.',
    'Include specific entity names, counts, and relationships found in the data.',
    'If the result is empty, say clearly that no matching items were found.',
    'Do NOT include JSON in your answer. Do NOT use markdown headers.',
    '',
    `Company: ${companyName}`,
    `Question: ${question}`,
    `Tool used: ${toolName}`,
    '',
    'Tool results:',
    preview,
    '',
    'Write a focused plain text answer (max 400 words).',
  ].join('\n')
}

// ─────────────────────────────────────────────
// Count helper — returns total items across top-level keys
// ─────────────────────────────────────────────

const countResults = (data: unknown): number => {
  if (!data || typeof data !== 'object') return 0
  let total = 0
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      total += value.length
    } else if (value && typeof value === 'object') {
      // Connection aggregate: { aggregate: { count: { nodes: N } } }
      const agg = (value as Record<string, unknown>).aggregate
      if (agg && typeof agg === 'object') {
        const count = (agg as Record<string, unknown>).count
        if (count && typeof count === 'object') {
          const nodes = (count as Record<string, unknown>).nodes
          if (typeof nodes === 'number') total += nodes
        }
      }
      // Also count nested arrays (e.g. getCompanyOverview returns arrays per field)
      for (const v2 of Object.values(value as Record<string, unknown>)) {
        if (Array.isArray(v2)) total = Math.max(total, v2.length)
      }
    }
  }
  return total
}

// ─────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────

export async function performDataLookup(input: DataLookupInput): Promise<DataLookupOutput> {
  const companyName = input.companyName || 'the company'
  const context = input.context || ''
  const runtimeConfig = await resolveAgentRuntimeConfig({
    accessToken: input.accessToken,
    llmConfig: input.llmConfig,
    defaults: DATA_LOOKUP_DEFAULT_CONFIG,
  })

  console.info('[AI WORKER][DATA_LOOKUP][START]', {
    stepId: input.stepId,
    task: limitText(input.task, 120),
    companyName,
  })

  // ── Step 1: Select tool ───────────────────────────────────────────────────

  const selectionPrompt = buildToolSelectionPrompt(input.task, companyName, context)

  if (isLlmPromptLoggingEnabled()) {
    const previewChars = getLlmPromptPreviewChars()
    console.info('[AI WORKER][DATA_LOOKUP][SELECTION_PROMPT_PREVIEW]', {
      stepId: input.stepId,
      promptPreview:
        selectionPrompt.length > previewChars
          ? `${selectionPrompt.slice(0, previewChars)}…`
          : selectionPrompt,
    })
  }

  let rawSelection: string
  try {
    rawSelection = await callLlm(
      selectionPrompt,
      runtimeConfig.llmConfig,
      `${runtimeConfig.systemPrompt}\nReply with ONLY a JSON object: { "tool": "...", "args": { ... } }`
    )
  } catch (err) {
    throw new Error(
      `Data lookup failed during tool selection: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  const { tool: selectedToolName, args: selectedArgs } = parseToolCall(rawSelection)

  let toolName = selectedToolName
  let args = selectedArgs

  const inferredCountEntityType = inferCountEntityType(input.task)
  if (inferredCountEntityType) {
    if (toolName !== 'countEntities') {
      console.info('[AI WORKER][DATA_LOOKUP][TOOL_OVERRIDE]', {
        stepId: input.stepId,
        selectedToolName,
        preferredTool: 'countEntities',
        reason: 'Question is a count question',
      })
      toolName = 'countEntities'
    }
    args = { ...args, entityType: inferredCountEntityType }
  }

  const preferredTool = inferPreferredTool(input.task)
  if (
    !inferredCountEntityType &&
    preferredTool &&
    preferredTool !== toolName &&
    TOOLS[preferredTool]
  ) {
    console.info('[AI WORKER][DATA_LOOKUP][TOOL_OVERRIDE]', {
      stepId: input.stepId,
      selectedToolName,
      preferredTool,
      reason: 'Question subject indicates a different primary entity',
    })
    toolName = preferredTool
  }

  args = enrichArgsFromQuestion(toolName, args, input.task)

  if (toolName === 'genericGraphQuery') {
    let queryPayload: { query: string; variables: Record<string, unknown> } | null = null
    let lastError = ''

    for (let attempt = 1; attempt <= 2; attempt++) {
      const genericPrompt = buildGenericQueryPrompt(input.task, companyName, context, lastError)
      const rawGeneric = await callLlm(
        genericPrompt,
        runtimeConfig.llmConfig,
        `${runtimeConfig.systemPrompt}\nReturn only JSON: { "query": "...", "variables": { ... } }`
      )
      const parsed = parseGenericQueryPayload(rawGeneric)

      if (!isReadOnlyQuery(parsed.query)) {
        lastError = 'Generated query was not read-only (mutation/subscription found).'
        continue
      }
      if (!hasCompanyScope(parsed.query)) {
        lastError = 'Generated query does not include required company scoping with $companyId.'
        continue
      }

      parsed.variables.companyId = input.companyId
      queryPayload = parsed
      break
    }

    if (!queryPayload) {
      throw new Error(
        `Generic GraphQL generation failed: ${lastError || 'No valid query produced'}`
      )
    }

    let genericData: unknown
    try {
      genericData = await graphqlRequest({
        query: queryPayload.query,
        variables: queryPayload.variables,
        accessToken: input.accessToken,
      })
    } catch (execErr) {
      throw new Error(
        `Generic GraphQL execution failed: ${execErr instanceof Error ? execErr.message : String(execErr)}`
      )
    }

    const resultCount = countResults(genericData)
    const deterministic = buildDeterministicSummary(input.task, genericData)

    let summary = deterministic || ''
    if (!summary) {
      const interpretPrompt = buildInterpretationPrompt(
        input.task,
        companyName,
        'genericGraphQuery',
        genericData
      )
      summary = await callLlm(
        interpretPrompt,
        runtimeConfig.llmConfig,
        `${runtimeConfig.systemPrompt}\nReturn plain text answers, not JSON.`
      )
    }

    return {
      summary: summary.trim(),
      queryUsed: limitText(
        `tool: genericGraphQuery, query: ${queryPayload.query}, variables: ${JSON.stringify(queryPayload.variables)}`,
        2400
      ),
      resultCount,
    }
  }

  const toolDef = TOOLS[toolName]
  if (!toolDef) {
    throw new Error(
      `LLM selected unknown tool "${toolName}". Available tools: ${Object.keys(TOOLS).join(', ')}`
    )
  }

  console.info('[AI WORKER][DATA_LOOKUP][TOOL_SELECTED]', {
    stepId: input.stepId,
    toolName,
    args,
  })

  // ── Step 2: Execute tool ──────────────────────────────────────────────────

  let toolResult: ToolCallResult
  try {
    toolResult = await toolDef.execute(args, input.companyId, input.accessToken)
  } catch (execErr) {
    throw new Error(
      `Tool "${toolName}" execution failed: ${execErr instanceof Error ? execErr.message : String(execErr)}`
    )
  }

  const resultCount = countResults(toolResult.data)

  console.info('[AI WORKER][DATA_LOOKUP][TOOL_RESULT]', {
    stepId: input.stepId,
    toolName,
    resultCount,
  })

  // ── Step 3: Interpret results ─────────────────────────────────────────────

  const interpretPrompt = buildInterpretationPrompt(
    input.task,
    companyName,
    toolName,
    toolResult.data
  )

  let summary: string
  const deterministic = buildDeterministicSummary(input.task, toolResult.data)
  if (deterministic) {
    summary = deterministic
  } else {
    try {
      summary = await callLlm(
        interpretPrompt,
        runtimeConfig.llmConfig,
        `${runtimeConfig.systemPrompt}\nReturn plain text answers, not JSON.`
      )
    } catch (interpErr) {
      summary = `Found ${resultCount} result(s). Raw data (truncated): ${limitText(JSON.stringify(toolResult.data), 800)}`
    }
  }

  console.info('[AI WORKER][DATA_LOOKUP][DONE]', {
    stepId: input.stepId,
    toolName,
    resultCount,
    summaryLength: summary.length,
  })

  return {
    summary: summary.trim(),
    queryUsed: `tool: ${toolName}, args: ${JSON.stringify(args)}`,
    resultCount,
  }
}
