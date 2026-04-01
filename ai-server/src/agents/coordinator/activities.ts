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
      mutation MarkAiRunCompleted($runId: ID!, $summary: String!, $draftPayload: String, $completedAt: DateTime!) {
        updateAiRuns(
          where: { id: { eq: $runId } }
          update: {
            status: { set: "COMPLETED" }
            resultSummary: { set: $summary }
            draftPayload: { set: $draftPayload }
            approvalStatus: { set: "PENDING_REVIEW" }
            completedAt: { set: $completedAt }
          }
        ) { aiRuns { id } }
      }
    `,
    variables: {
      runId: input.runId,
      summary: input.summary,
      draftPayload: input.draftPayload ? JSON.stringify(input.draftPayload) : null,
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
// Agent planning via LLM
// ─────────────────────────────────────────────

const STRATEGY_KEYWORDS = [
  'vision',
  'mission',
  'strategy',
  'strategic',
  'values',
  'goal',
  'purpose',
  'business model',
  'roadmap',
] as const

const buildFallbackPlan = (prompt: string, documents: readonly DocumentInput[]): AgentPlan => {
  const lowerPrompt = prompt.toLowerCase()
  const isStrategyRequest = STRATEGY_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  const hasDocs = documents.length > 0

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
      console.info('[AI WORKER][COORDINATOR][PLAN_CREATED]', {
        reasoning: limitText(plan.reasoning, 200),
        steps: plan.steps.map(s => ({ stepId: s.stepId, agentId: s.agentId })),
      })
      return plan
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
    return { summary: limitText(summary, 2400) }
  } catch (error) {
    console.warn('[AI WORKER][COORDINATOR][AGGREGATION_FAILED]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'concatenating step summaries',
    })
    const summary = input.stepResults.map(r => `[${r.agentId}]: ${r.summary}`).join('\n\n')
    return { summary: limitText(summary, 2400) }
  }
}
