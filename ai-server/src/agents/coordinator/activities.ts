import { graphqlRequest } from '../../graphql/client'
import {
  AgentPlan,
  AgentStepResult,
  AggregateStepResultsInput,
  AggregateStepResultsOutput,
  CompleteAiRunInput,
  DocumentInput,
  FailAiRunInput,
  LlmConfig,
  PlanAgentRunInput,
  StrategicDraftPayload,
} from '../types'
import { agentRegistry } from '../registry'
import { callLlm, parseJsonObject, asString, limitText } from '../shared/llm'

// ─────────────────────────────────────────────
// AI Run lifecycle mutations
// ─────────────────────────────────────────────

export const markAiRunRunningWithToken = async (input: {
  runId: string
  accessToken: string
}): Promise<void> => {
  const timestamp = new Date().toISOString()
  console.info('[AI WORKER][COORDINATOR][RUNNING]', { runId: input.runId, timestamp })

  await graphqlRequest({
    query: `
      mutation MarkAiRunRunning($runId: ID!, $startedAt: DateTime!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: { status: { set: "RUNNING" }, startedAt: { set: $startedAt } }
        ) { aiRuns { id } }
      }
    `,
    variables: { runId: input.runId, startedAt: timestamp },
    accessToken: input.accessToken,
  })
}

export const markAiRunCompletedWithToken = async (
  input: CompleteAiRunInput & { accessToken: string }
): Promise<void> => {
  const timestamp = new Date().toISOString()
  console.info('[AI WORKER][COORDINATOR][COMPLETED]', {
    runId: input.runId,
    timestamp,
    summaryLength: input.summary.length,
  })

  await graphqlRequest({
    query: `
      mutation MarkAiRunCompleted($runId: ID!, $summary: String!, $draftPayload: String, $approvalStatus: String, $completedAt: DateTime!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: {
            status: { set: "COMPLETED" }
            resultSummary: { set: $summary }
            draftPayload: { set: $draftPayload }
            approvalStatus: { set: $approvalStatus }
            completedAt: { set: $completedAt }
          }
        ) { aiRuns { id } }
      }
    `,
    variables: {
      runId: input.runId,
      summary: input.summary,
      draftPayload: input.draftPayload ? JSON.stringify(input.draftPayload) : null,
      approvalStatus: input.draftPayload ? 'PENDING_REVIEW' : null,
      completedAt: timestamp,
    },
    accessToken: input.accessToken,
  })
}

export const markAiRunFailedWithToken = async (
  input: FailAiRunInput & { accessToken: string }
): Promise<void> => {
  const timestamp = new Date().toISOString()
  console.error('[AI WORKER][COORDINATOR][FAILED]', {
    runId: input.runId,
    timestamp,
    errorMessage: input.errorMessage,
  })

  await graphqlRequest({
    query: `
      mutation MarkAiRunFailed($runId: ID!, $errorMessage: String!, $completedAt: DateTime!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: {
            status: { set: "FAILED" }
            errorMessage: { set: $errorMessage }
            completedAt: { set: $completedAt }
          }
        ) { aiRuns { id } }
      }
    `,
    variables: { runId: input.runId, errorMessage: input.errorMessage, completedAt: timestamp },
    accessToken: input.accessToken,
  })
}

// ─────────────────────────────────────────────
// Status message update (progress reporting)
// ─────────────────────────────────────────────

export const updateAiRunStatusMessage = async (input: {
  runId: string
  statusMessage: string
  accessToken: string
}): Promise<void> => {
  await graphqlRequest({
    query: `
      mutation UpdateAiRunStatusMessage($runId: ID!, $statusMessage: String!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: { statusMessage: { set: $statusMessage } }
        ) { aiRuns { id } }
      }
    `,
    variables: { runId: input.runId, statusMessage: input.statusMessage },
    accessToken: input.accessToken,
  })
}

// ─────────────────────────────────────────────
// Agent planning via LLM
// ─────────────────────────────────────────────

const STRATEGY_KEYWORDS = [
  'create mission',
  'create vision',
  'generate strategy',
  'generate strategies',
  'generate mission',
  'generate vision',
  'draft strategy',
  'draft mission',
  'draft vision',
  'develop strategy',
  'develop strategies',
  'build strategy',
  'strategic enrichment',
  'business model canvas',
  'create roadmap',
  'generate roadmap',
] as const

const DATA_LOOKUP_KEYWORDS = [
  // "which X" patterns — entity names with or without modifiers in between
  'which application',
  'which business',
  'which capability',
  'which capabilities',
  'which infrastructure',
  'which interface',
  'which interfaces',
  'which supplier',
  'which organisation',
  'which data object',
  'which ai component',
  // "what X do I/we have" patterns
  'what applications',
  'what capabilities',
  'what infrastructure',
  'what interfaces',
  'what data objects',
  'what suppliers',
  'do i have',
  'do we have',
  'in my architecture',
  'in our architecture',
  'in the architecture',
  // list/show/count
  'list applications',
  'list capabilities',
  'list all',
  'show applications',
  'show capabilities',
  'show me',
  'show all',
  'find all',
  'how many applications',
  'how many capabilities',
  'how many',
  'count of',
  // standalone entity type names used as subject of a question
  'business capabilities',
  'business processes',
  'application interface',
  'interfaces has',
  'has interface',
  'has interfaces',
  'data object',
  'ai component',
  // relationship/filter patterns
  'confidential data',
  'data classification',
  'hosted on',
  'runs on',
  'running on',
  'supports capability',
  // architecture context keywords
  'existing architecture',
  'current architecture',
  'my architecture',
  'our architecture',
  // explicit intent
  'lookup',
  'not supported',
  'without support',
  'without application',
] as const

const looksLikeDataLookupIntent = (prompt: string): boolean => {
  const p = prompt.toLowerCase()

  if (DATA_LOOKUP_KEYWORDS.some(kw => p.includes(kw))) {
    return true
  }

  const hasQuestionVerb = /(which|what|list|show|find|how many|count|number of)\b/.test(p)
  const hasEntityKeyword =
    /(application|applications|capability|capabilities|business process|business processes|interface|interfaces|data object|data objects|infrastructure|supplier|suppliers|organisation|organisations|organization|organizations|ai component|ai components)\b/.test(
      p
    )

  // Entity-centric architecture questions should default to data-lookup.
  return hasQuestionVerb && hasEntityKeyword
}

const forceDataLookupPlan = (prompt: string): AgentPlan => ({
  reasoning:
    'Deterministic guard: prompt matches architecture-entity lookup intent, forcing data-lookup.',
  steps: [
    {
      stepId: '1',
      agentId: 'data-lookup',
      task: limitText(prompt, 400),
      dependsOn: [],
    },
  ],
})

const normalizePlanForPrompt = (plan: AgentPlan, prompt: string): AgentPlan => {
  if (!looksLikeDataLookupIntent(prompt)) {
    return plan
  }

  const hasDataLookupStep = plan.steps.some(step => step.agentId === 'data-lookup')
  if (hasDataLookupStep) {
    return plan
  }

  // Planner drifted to internet/general research for an internal architecture lookup.
  return forceDataLookupPlan(prompt)
}

const buildFallbackPlan = (prompt: string, documents: readonly DocumentInput[]): AgentPlan => {
  const lowerPrompt = prompt.toLowerCase()
  const isStrategyRequest = STRATEGY_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  const isDataLookupRequest = DATA_LOOKUP_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  const hasDocs = documents.length > 0

  if (isDataLookupRequest && !isStrategyRequest) {
    return {
      reasoning: 'Fallback: data/architecture lookup keywords detected → data-lookup.',
      steps: [
        {
          stepId: '1',
          agentId: 'data-lookup',
          task: limitText(prompt, 400),
          dependsOn: [],
        },
      ],
    }
  }

  if (hasDocs && isStrategyRequest) {
    return {
      reasoning:
        'Fallback: documents provided + strategy keywords detected → document-research then strategy-generator.',
      steps: [
        {
          stepId: '1',
          agentId: 'document-research',
          task: `Extract relevant strategic information from the provided documents to support: ${limitText(prompt, 200)}`,
          dependsOn: [],
          documents,
        },
        {
          stepId: '2',
          agentId: 'strategy-generator',
          task: `Generate a comprehensive strategy proposal based on the document analysis: ${limitText(prompt, 200)}`,
          dependsOn: ['1'],
        },
      ],
    }
  }

  if (hasDocs) {
    return {
      reasoning: 'Fallback: documents provided → document-research.',
      steps: [
        {
          stepId: '1',
          agentId: 'document-research',
          task: limitText(prompt, 300),
          dependsOn: [],
          documents,
        },
      ],
    }
  }

  if (isStrategyRequest) {
    return {
      reasoning:
        'Fallback: strategy keywords detected → internet-research then strategy-generator.',
      steps: [
        {
          stepId: '1',
          agentId: 'internet-research',
          task: `Research current strategic context, market position, and industry context for: ${limitText(prompt, 200)}`,
          dependsOn: [],
        },
        {
          stepId: '2',
          agentId: 'strategy-generator',
          task: `Generate a comprehensive strategy proposal: ${limitText(prompt, 200)}`,
          dependsOn: ['1'],
        },
      ],
    }
  }

  return {
    reasoning: 'Fallback: general research request → internet-research.',
    steps: [
      {
        stepId: '1',
        agentId: 'internet-research',
        task: limitText(prompt, 300),
        dependsOn: [],
      },
    ],
  }
}

const buildPlannerPrompt = (input: PlanAgentRunInput): string => {
  const agentsDescription = agentRegistry.formatForLlm()
  const hasDocs = input.documents.length > 0
  const previousResultsBlock =
    input.previousResults.length > 0
      ? input.previousResults.map(r => `[${r.agentId}]: ${limitText(r.summary, 400)}`).join('\n')
      : 'none'

  return [
    'You are an enterprise AI coordinator. Create an execution plan to fulfill the user request.',
    'Select the most appropriate agents and define the execution order.',
    'Steps can depend on previous steps — use the dependsOn field to express dependencies.',
    '',
    `User request: ${input.prompt}`,
    `Company: ${input.companyName}`,
    `Objective: ${input.objective ?? 'not specified'}`,
    `Available documents: ${hasDocs ? input.documents.map(d => d.name).join(', ') : 'none'}`,
    input.qcFeedback ? `Quality control feedback from previous attempt:\n${input.qcFeedback}` : '',
    input.previousResults.length > 0 ? `Previous attempt results:\n${previousResultsBlock}` : '',
    '',
    'Available agents:',
    agentsDescription,
    '',
    'Rules:',
    '- Only use agent IDs listed above.',
    '- For document-research steps, include documentAgentIds selection in the task description if relevant.',
    '- Create the minimum number of steps needed to fulfill the request.',
    '- If internet research is needed before strategy generation, create a dependency.',
    '- CRITICAL: Only use "strategy-generator" when the user explicitly asks to CREATE or GENERATE new strategic content (e.g. "create my mission", "generate a strategy", "draft our vision", "build a business model canvas"). The strategy-generator always produces a draft requiring user approval.',
    '- Do NOT use "strategy-generator" for informational questions, analytical queries, questions about the existing architecture, or questions that ask "what are" / "show me" / "list" / "how".',
    '- Use "data-lookup" for ANY question about existing architecture content in the database. This includes: (a) listing or enumerating entities — "which business capabilities do I have?", "show me all active applications", "list my suppliers"; (b) counting — "how many applications are there?", "how many capabilities without support?"; (c) relationship traversals — "which applications support capability X and run on infrastructure Y?", "which interfaces transfer confidential data?"; (d) gap analyses — "capabilities without supporting applications"; (e) any question containing entity type names (applications, capabilities, business capabilities, infrastructure, interfaces, data objects, organisations, suppliers, AI components) in the context of the user\'s own architecture.',
    '- CRITICAL: If the user asks about their OWN architecture data (uses words like "my", "our", "I have", "we have", "current", "existing") combined with any entity type name, ALWAYS use "data-lookup".',
    '- Prefer "data-lookup" over "internet-research" when the question is about internal architecture data that exists in the database.',
    '- Use "internet-research" ONLY for questions about external facts, market trends, best practices, or general knowledge that cannot be answered from the database.',
    '',
    'Return ONLY valid JSON (no markdown fences):',
    '{',
    '  "reasoning": "brief explanation of your plan",',
    '  "steps": [',
    '    {',
    '      "stepId": "1",',
    '      "agentId": "agent-id-here",',
    '      "task": "specific task description for this agent",',
    '      "dependsOn": []',
    '    }',
    '  ]',
    '}',
  ]
    .filter(line => line !== null)
    .join('\n')
}

const parsePlanFromLlm = (
  llmResponse: string,
  documents: readonly DocumentInput[]
): AgentPlan | null => {
  const parsed = parseJsonObject(llmResponse)
  if (!parsed) return null

  const rawSteps = Array.isArray(parsed.steps) ? parsed.steps : []
  if (rawSteps.length === 0) return null

  const steps = rawSteps
    .map((raw: unknown) => {
      const step = raw as Record<string, unknown>
      const stepId = asString(step.stepId, '', 20).trim()
      const agentId = asString(step.agentId, '', 50).trim()
      const task = asString(step.task, '', 600).trim()
      if (!stepId || !agentId || !task) return null
      const dependsOn = Array.isArray(step.dependsOn)
        ? (step.dependsOn as unknown[]).map(d => String(d)).filter(Boolean)
        : []

      // Attach documents to document-research steps
      const stepDocs =
        agentId === 'document-research' && documents.length > 0 ? documents : undefined

      return { stepId, agentId, task, dependsOn, documents: stepDocs }
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)

  if (steps.length === 0) return null

  const validAgentIds = new Set(agentRegistry.getAll().map(a => a.id))
  const validSteps = steps.filter(s => validAgentIds.has(s.agentId))
  if (validSteps.length === 0) return null

  return {
    steps: validSteps,
    reasoning: asString(parsed.reasoning, 'LLM-generated plan.', 400),
  }
}

export const planAgentRun = async (input: PlanAgentRunInput): Promise<AgentPlan> => {
  console.info('[AI WORKER][COORDINATOR][PLANNING]', {
    promptLength: input.prompt.length,
    hasDocuments: input.documents.length > 0,
    hasQcFeedback: Boolean(input.qcFeedback),
    registeredAgents: agentRegistry.getAll().map(a => a.id),
  })

  try {
    const prompt = buildPlannerPrompt(input)
    const llmResponse = await callLlm(
      prompt,
      input.llmConfig,
      'You are an enterprise AI coordinator. Return only JSON plans.'
    )
    const plan = parsePlanFromLlm(llmResponse, input.documents)
    if (plan) {
      const normalizedPlan = normalizePlanForPrompt(plan, input.prompt)
      console.info('[AI WORKER][COORDINATOR][PLAN_CREATED]', {
        reasoning: limitText(normalizedPlan.reasoning, 200),
        steps: normalizedPlan.steps.map(s => ({ stepId: s.stepId, agentId: s.agentId })),
      })
      return normalizedPlan
    }
  } catch (error) {
    console.warn('[AI WORKER][COORDINATOR][PLAN_LLM_FAILED]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'using keyword-based fallback plan',
    })
  }

  const fallback = buildFallbackPlan(input.prompt, input.documents)
  console.info('[AI WORKER][COORDINATOR][FALLBACK_PLAN]', {
    reasoning: fallback.reasoning,
    steps: fallback.steps.map(s => ({ stepId: s.stepId, agentId: s.agentId })),
  })
  return fallback
}

// ─────────────────────────────────────────────
// Result aggregation
// ─────────────────────────────────────────────

const buildAggregationPrompt = (
  prompt: string,
  companyName: string,
  stepResults: readonly AgentStepResult[]
): string => {
  const resultsBlock = stepResults
    .map(r => `--- ${r.agentId} ---\n${r.summary || '(no summary)'}`)
    .join('\n\n')

  return [
    'You are an enterprise analyst synthesizing results from multiple AI agents.',
    'Create a comprehensive executive summary that answers the original user request.',
    '',
    `User request: ${prompt}`,
    `Company: ${companyName}`,
    '',
    'Agent results:',
    resultsBlock,
    '',
    'Write a clear, concise executive summary (max 600 words) that:',
    "1. Directly answers the user's original request",
    '2. Highlights key findings and insights',
    '3. Notes any important limitations or gaps',
    '',
    'Return plain text (not JSON).',
  ].join('\n')
}

export const aggregateStepResults = async (
  input: AggregateStepResultsInput
): Promise<AggregateStepResultsOutput> => {
  if (input.stepResults.length === 0) {
    return { summary: 'No agent results were produced for this request.' }
  }

  if (input.stepResults.length === 1) {
    return { summary: input.stepResults[0].summary || 'Agent completed without producing output.' }
  }

  try {
    const prompt = buildAggregationPrompt(input.prompt, input.companyName, input.stepResults)
    const summary = await callLlm(
      prompt,
      input.llmConfig,
      'You are an enterprise analyst. Return plain text summaries.'
    )
    return { summary }
  } catch (error) {
    console.warn('[AI WORKER][COORDINATOR][AGGREGATION_FAILED]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'concatenating step summaries',
    })
    const summary = input.stepResults.map(r => `[${r.agentId}]: ${r.summary}`).join('\n\n')
    return { summary }
  }
}
