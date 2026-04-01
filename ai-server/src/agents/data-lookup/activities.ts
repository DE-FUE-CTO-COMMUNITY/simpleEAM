import { agentRegistry } from '../registry'
import { DataLookupInput, DataLookupOutput } from '../types'
import {
  callLlm,
  asString,
  limitText,
  isLlmPromptLoggingEnabled,
  getLlmPromptPreviewChars,
} from '../shared/llm'
import { graphqlRequest } from '../../graphql/client'

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
    '{ summary: "plain text answer with entities and relationships found", queryUsed: "the GraphQL query executed", resultCount: N }',
})

// ─────────────────────────────────────────────
// Schema digest — auto-generated from live introspection.
// Run `yarn generate-schema-digest` after schema changes.
// ─────────────────────────────────────────────
import { SCHEMA_DIGEST } from './generated-schema-digest'

// ─────────────────────────────────────────────
// Query generation prompt
// ─────────────────────────────────────────────

const buildQueryGenerationPrompt = (
  question: string,
  companyName: string,
  context: string,
  previousError?: string
): string =>
  [
    'You are an enterprise architecture GraphQL expert.',
    'Generate a valid GraphQL QUERY (read-only, no mutations) that answers the user question.',
    'Return ONLY the raw GraphQL query string — no markdown fences, no explanation.',
    '',
    `Company: ${companyName}`,
    context ? `Context from previous steps:\n${context}` : '',
    previousError
      ? `Previous query failed with error: ${previousError}\nFix the query accordingly.`
      : '',
    '',
    'Schema and filter syntax reference:',
    SCHEMA_DIGEST,
    '',
    'Rules:',
    '- Write ONLY a "query { ... }" block. Never write a mutation.',
    '- Use inline values in the where clause — no "$variables".',
    '- The company scope filter is injected automatically — do NOT add it yourself.',
    '- Apply a reasonable limit: 50 to avoid huge responses unless counting.',
    '- For counting, use the *Connection queries with aggregate { count { nodes } }.',
    '- When filtering by name use { contains: "..." } to allow partial matching.',
    '- For relationship traversals, nest the related type selections to show the full path.',
    '- Keep the selected fields focused on what is useful to answer the question.',
  ]
    .filter(Boolean)
    .join('\n')

// ─────────────────────────────────────────────
// Result interpretation prompt
// ─────────────────────────────────────────────

const buildInterpretationPrompt = (
  question: string,
  companyName: string,
  rawResult: unknown
): string => {
  const resultText = JSON.stringify(rawResult, null, 2)
  const preview = limitText(resultText, 8000)

  return [
    'You are an enterprise architecture analyst.',
    'Based on the GraphQL query results below, write a clear and concise plain text answer to the user question.',
    'Include specific entity names, counts, and relationships found in the data.',
    'If the result is empty, say clearly that no matching items were found.',
    'Do NOT include JSON in your answer. Do NOT use markdown headers.',
    '',
    `Company: ${companyName}`,
    `User question: ${question}`,
    '',
    'Query results:',
    preview,
    '',
    'Write a focused plain text answer (max 400 words).',
  ].join('\n')
}

// ─────────────────────────────────────────────
// Safety: ensure LLM only generated a read query
// ─────────────────────────────────────────────

const isReadOnlyQuery = (query: string): boolean => {
  const normalized = query.trim().toLowerCase()
  // Must start with "query" or "{ " (shorthand query), never "mutation" or "subscription"
  if (normalized.startsWith('mutation') || normalized.startsWith('subscription')) return false
  // Reject if the word "mutation" appears anywhere — belt-and-suspenders
  if (/\bmutation\b/.test(normalized)) return false
  return true
}

const extractQueryText = (raw: string): string => {
  // Strip any markdown fences the LLM may have added despite instructions
  const stripped = raw
    .replace(/^```(?:graphql|gql)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()
  return stripped
}

// ─────────────────────────────────────────────
// Company filter injection
// ─────────────────────────────────────────────
//
// All entity types use `company` in their WhereInput EXCEPT Person (uses `companies`).
// We inject the correct scoping filter after the LLM generates the query, so the LLM
// never has to write complex nested braces for the filter (which causes parse errors).

const injectCompanyFilter = (query: string, companyId: string): string => {
  // Regex: find every `where: {` occurrence (with optional whitespace).
  // Look backwards from each match to find the enclosing field name so we can
  // choose `company` vs `companies` for the Person type.
  return query.replace(/\bwhere\s*:\s*\{/g, (match, offset: number) => {
    // Walk backwards to find the closest opening `(` — that's the argument list
    // whose field name determines the entity type being queried.
    let depth = 0
    let fieldNameEnd = offset
    for (let i = offset - 1; i >= 0; i--) {
      const ch = query[i]
      if (ch === ')') depth++
      else if (ch === '(') {
        if (depth === 0) {
          fieldNameEnd = i
          break
        }
        depth--
      }
    }
    const preceding = query.slice(0, fieldNameEnd)
    const fieldNameMatch = preceding.match(/(\w+)\s*$/)
    const fieldName = fieldNameMatch ? fieldNameMatch[1] : ''
    // Person relationships use `companies` (plural `EMPLOYED_BY`); everything else uses `company`
    const companyFieldName = fieldName === 'people' ? 'companies' : 'company'
    return `where: { ${companyFieldName}: { some: { id: { eq: "${companyId}" } } } `
  })
}

// ─────────────────────────────────────────────
// Count helper — returns total items across all top-level keys
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

  console.info('[AI WORKER][DATA_LOOKUP][START]', {
    stepId: input.stepId,
    task: limitText(input.task, 120),
    companyName,
  })

  // ── Step 1: Generate GraphQL query ───────────────────────────────────────

  const queryGenPrompt = buildQueryGenerationPrompt(input.task, companyName, context)

  if (isLlmPromptLoggingEnabled()) {
    const previewChars = getLlmPromptPreviewChars()
    console.info('[AI WORKER][DATA_LOOKUP][QUERY_GEN_PROMPT_PREVIEW]', {
      stepId: input.stepId,
      promptPreview:
        queryGenPrompt.length > previewChars
          ? `${queryGenPrompt.slice(0, previewChars)}…`
          : queryGenPrompt,
    })
  }

  let rawQuery: string
  try {
    rawQuery = await callLlm(
      queryGenPrompt,
      input.llmConfig,
      'You are a GraphQL expert. Return only valid GraphQL query strings.'
    )
  } catch (err) {
    throw new Error(
      `Data lookup failed during query generation: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  let graphqlQuery = injectCompanyFilter(extractQueryText(rawQuery), input.companyId)

  console.info('[AI WORKER][DATA_LOOKUP][QUERY_GENERATED]', {
    stepId: input.stepId,
    queryLength: graphqlQuery.length,
    queryPreview: limitText(graphqlQuery, 300),
  })

  if (!isReadOnlyQuery(graphqlQuery)) {
    throw new Error(
      'Data lookup refused: the LLM produced a non-read operation. Only queries are allowed.'
    )
  }

  // ── Step 2: Execute query (with one retry on error) ───────────────────────

  let queryResult: unknown = null
  let queryUsed = graphqlQuery

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      queryResult = await graphqlRequest({
        query: graphqlQuery,
        accessToken: input.accessToken,
      })

      console.info('[AI WORKER][DATA_LOOKUP][QUERY_SUCCESS]', {
        stepId: input.stepId,
        attempt,
      })
      break
    } catch (execErr) {
      const errorMessage = execErr instanceof Error ? execErr.message : String(execErr)
      console.warn('[AI WORKER][DATA_LOOKUP][QUERY_EXEC_ERROR]', {
        stepId: input.stepId,
        attempt,
        error: errorMessage,
        query: limitText(graphqlQuery, 300),
      })

      if (attempt === 2) {
        throw new Error(`GraphQL query execution failed after 2 attempts: ${errorMessage}`)
      }

      // Retry: ask LLM to fix the query
      const retryPrompt = buildQueryGenerationPrompt(input.task, companyName, context, errorMessage)
      try {
        const retryRaw = await callLlm(
          retryPrompt,
          input.llmConfig,
          'You are a GraphQL expert. Return only valid GraphQL query strings.'
        )
        graphqlQuery = injectCompanyFilter(extractQueryText(retryRaw), input.companyId)
        queryUsed = graphqlQuery

        if (!isReadOnlyQuery(graphqlQuery)) {
          throw new Error('Retried query is not a read-only operation.')
        }
        console.info('[AI WORKER][DATA_LOOKUP][QUERY_RETRY]', {
          stepId: input.stepId,
          retryQueryLength: graphqlQuery.length,
        })
      } catch (retryGenErr) {
        throw new Error(
          `Query re-generation failed: ${retryGenErr instanceof Error ? retryGenErr.message : String(retryGenErr)}`
        )
      }
    }
  }

  // ── Step 3: Interpret results ─────────────────────────────────────────────

  const resultCount = countResults(queryResult)

  console.info('[AI WORKER][DATA_LOOKUP][INTERPRETING]', {
    stepId: input.stepId,
    resultCount,
  })

  const interpretPrompt = buildInterpretationPrompt(input.task, companyName, queryResult)
  let summary: string
  try {
    summary = await callLlm(
      interpretPrompt,
      input.llmConfig,
      'You are an enterprise architecture analyst. Return plain text answers, not JSON.'
    )
  } catch (interpErr) {
    // Fall back to raw JSON preview if LLM interpretation fails
    summary = `Found ${resultCount} result(s). Raw data (truncated): ${limitText(JSON.stringify(queryResult), 800)}`
  }

  console.info('[AI WORKER][DATA_LOOKUP][DONE]', {
    stepId: input.stepId,
    resultCount,
    summaryLength: summary.length,
  })

  return {
    summary: asString(
      summary,
      `Architecture lookup completed. Found ${resultCount} result(s).`,
      2400
    ),
    queryUsed,
    resultCount,
  }
}
