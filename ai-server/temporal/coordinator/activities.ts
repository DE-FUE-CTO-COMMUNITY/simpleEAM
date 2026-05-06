import { graphqlRequest } from '../../src/graphql/client'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
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
} from '../../src/types/agents'
import { agentRegistry } from '../../agents/registry'
import { callLlm, parseJsonObject, asString, limitText } from '../../src/shared/agents/llm'
import { resolveAgentRuntimeConfig } from '../../src/shared/agents/agent-config'
import { getAgentConfigDefault } from '../../src/shared/agents/default-agent-configs'

const COORDINATOR_PLANNER_DEFAULT_CONFIG = getAgentConfigDefault('coordinator-planner')

const COORDINATOR_AGGREGATOR_DEFAULT_CONFIG = getAgentConfigDefault('coordinator-aggregator')

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

interface IntentDefinition {
  description: string
  requiresTraversal: boolean
}

type IntentSchema = Record<string, IntentDefinition>
type ClassifiedIntent = string

const resolveCoordinatorArtifactPath = (fileName: string): string => {
  const sourceLocalPath = join(__dirname, fileName)
  if (existsSync(sourceLocalPath)) {
    return sourceLocalPath
  }

  return resolve(__dirname, '../../../temporal/coordinator', fileName)
}

const INTENT_SCHEMA_PATH = resolveCoordinatorArtifactPath('intent-schema.v1.0.0.json')

let intentSchemaCache: IntentSchema | null = null

const loadIntentSchema = (): IntentSchema => {
  if (intentSchemaCache) return intentSchemaCache

  const parsed = JSON.parse(readFileSync(INTENT_SCHEMA_PATH, 'utf8')) as IntentSchema
  intentSchemaCache = parsed
  return parsed
}

const buildIntentClassificationPrompt = (input: PlanAgentRunInput): string => {
  const intentSchema = loadIntentSchema()

  return [
    'You are an enterprise architecture AI intent classifier.',
    'Classify the user request using ONLY the provided intent schema.',
    'Return exactly one intent from the schema or ASK_CLARIFICATION.',
    'Do not invent, rename, merge, or split intents.',
    'If the request is ambiguous, mixes multiple intents, or lacks enough information, return ASK_CLARIFICATION.',
    'Return ONLY valid JSON with this exact shape:',
    '{ "intent": "INTENT_NAME_OR_ASK_CLARIFICATION" }',
    '',
    `User request: ${input.prompt}`,
    `Company: ${input.companyName}`,
    `Objective: ${input.objective ?? 'not specified'}`,
    `Available documents: ${input.documents.length > 0 ? input.documents.map(d => d.name).join(', ') : 'none'}`,
    '',
    `Intent schema (authoritative): ${JSON.stringify(intentSchema)}`,
  ].join('\n')
}

const parseIntentClassification = (
  llmResponse: string,
  validIntents: readonly string[]
): ClassifiedIntent => {
  const parsed = parseJsonObject(llmResponse)
  if (!parsed) return 'ASK_CLARIFICATION'

  const intent = asString(parsed.intent, 'ASK_CLARIFICATION', 100).trim()
  if (intent === 'ASK_CLARIFICATION') return intent
  return validIntents.includes(intent) ? intent : 'ASK_CLARIFICATION'
}

const buildClarificationPlan = (validIntents: readonly string[]): AgentPlan => ({
  reasoning: `Clarification needed. Please restate the request as exactly one of: ${validIntents.join(', ')}.`,
  steps: [],
})

const buildStepTask = (agentId: string, prompt: string, hasDocuments: boolean): string => {
  switch (agentId) {
    case 'document-research':
      return `Extract relevant strategic information from the provided documents to support: ${limitText(prompt, 200)}`
    case 'internet-research':
      return `Research current strategic context, market position, and industry context for: ${limitText(prompt, 200)}`
    case 'strategy-generator':
      return hasDocuments
        ? `Generate a comprehensive strategy proposal based on the document analysis: ${limitText(prompt, 200)}`
        : `Generate a comprehensive strategy proposal: ${limitText(prompt, 200)}`
    default:
      return limitText(prompt, 300)
  }
}

const buildPlanFromIntent = (intent: ClassifiedIntent, input: PlanAgentRunInput): AgentPlan => {
  const intentSchema = loadIntentSchema()
  const validIntents = Object.keys(intentSchema)
  if (intent === 'ASK_CLARIFICATION') {
    return buildClarificationPlan(validIntents)
  }

  if (intent !== 'STRATEGIC_ENRICHMENT') {
    return {
      reasoning:
        'Legacy lookup system replaced by governed query architecture. Non-strategic requests must use the governed query workflow.',
      steps: [],
    }
  }

  const selectedAgentIds =
    input.documents.length > 0
      ? (['document-research', 'strategy-generator'] as const)
      : (['internet-research', 'strategy-generator'] as const)

  const validAgentIds = new Set(agentRegistry.getAll().map(agent => agent.id))
  const planSteps = selectedAgentIds
    .filter(agentId => validAgentIds.has(agentId))
    .map((agentId, index) => ({
      stepId: `${index + 1}`,
      agentId,
      task: buildStepTask(agentId, input.prompt, input.documents.length > 0),
      dependsOn: index === 0 ? [] : [`${index}`],
      documents:
        agentId === 'document-research' && input.documents.length > 0 ? input.documents : undefined,
    }))

  if (planSteps.length === 0) {
    return buildClarificationPlan(validIntents)
  }

  return {
    reasoning: `Policy-driven strategic routing selected intent ${intent}.`,
    steps: planSteps,
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
    const runtimeConfig = await resolveAgentRuntimeConfig({
      accessToken: input.accessToken,
      llmConfig: input.llmConfig,
      defaults: COORDINATOR_PLANNER_DEFAULT_CONFIG,
    })
    const prompt = buildIntentClassificationPrompt(input)
    const llmResponse = await callLlm(prompt, runtimeConfig.llmConfig, runtimeConfig.systemPrompt)
    const intent = parseIntentClassification(llmResponse, Object.keys(loadIntentSchema()))
    const plan = buildPlanFromIntent(intent, input)

    console.info('[AI WORKER][COORDINATOR][PLAN_CREATED]', {
      intent,
      reasoning: limitText(plan.reasoning, 200),
      steps: plan.steps.map(step => ({ stepId: step.stepId, agentId: step.agentId })),
    })

    return plan
  } catch (error) {
    console.warn('[AI WORKER][COORDINATOR][PLAN_LLM_FAILED]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'using clarification plan',
    })
  }

  const fallback = buildClarificationPlan(Object.keys(loadIntentSchema()))
  console.info('[AI WORKER][COORDINATOR][FALLBACK_PLAN]', {
    reasoning: fallback.reasoning,
    steps: fallback.steps.map(step => ({ stepId: step.stepId, agentId: step.agentId })),
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
    const runtimeConfig = await resolveAgentRuntimeConfig({
      accessToken: input.accessToken,
      llmConfig: input.llmConfig,
      defaults: COORDINATOR_AGGREGATOR_DEFAULT_CONFIG,
    })
    const prompt = buildAggregationPrompt(input.prompt, input.companyName, input.stepResults)
    const summary = await callLlm(prompt, runtimeConfig.llmConfig, runtimeConfig.systemPrompt)
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
