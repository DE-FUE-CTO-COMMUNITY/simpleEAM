import { loadArtifacts } from '../artifacts/loader'
import type { SupportedLocale } from '../artifacts/types'
import { createPlan } from '../agents/coordinatorAdapter'
import { executeQuery } from '../agents/dataLookupAdapter'
import { ASK_CLARIFICATION, enforceCoordinatorPlan } from '../policy/enforce'
import type { QueryId } from '../policy/querySelect'
import type { AiState, AnswerState, SelectedQueryState } from '../state/aiState'
import type { Clarification, Plan } from '../state/plan'
import { appendStateStep } from '../state/trajectory'
import type { LlmConfig } from '../src/types/agents'

export interface AiQueryWorkflowInput {
  readonly text: string
  readonly locale?: SupportedLocale | null
  readonly companyId: string
  readonly companyName?: string | null
  readonly accessToken?: string | null
  readonly llmConfig: LlmConfig
  readonly systemPrompt?: string
  readonly artifactExcerptPrompt?: string
}

export interface CoordinatorPlanActivityInput {
  readonly state: AiState
  readonly companyName?: string | null
  readonly llmConfig: LlmConfig
  readonly systemPrompt?: string
  readonly artifactExcerptPrompt?: string
}

export interface DataLookupActivityInput {
  readonly state: AiState
  readonly accessToken?: string | null
}

export interface ExplainActivityInput {
  readonly state: AiState
}

function buildClarification(question: string, reason: string): Clarification {
  return {
    question,
    reason,
    isRequired: true,
  }
}

function summarizeValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `array(${value.length})`
  }

  if (value && typeof value === 'object') {
    return `object(${Object.keys(value as Record<string, unknown>).join(', ')})`
  }

  return String(value)
}

function summarizeLookupResult(data: unknown): string {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return `Lookup completed with ${summarizeValue(data)}.`
  }

  const entries = Object.entries(data as Record<string, unknown>)
  if (entries.length === 0) {
    return 'Lookup completed with an empty result set.'
  }

  return `Lookup completed. ${entries.map(([key, value]) => `${key}: ${summarizeValue(value)}`).join('; ')}`
}

export async function coordinatorPlanActivity(
  input: CoordinatorPlanActivityInput
): Promise<AiState> {
  const artifacts = loadArtifacts()
  const planResult = await createPlan(
    {
      text: input.state.userInput.text,
      locale: input.state.userInput.locale ?? null,
      companyName: input.companyName ?? null,
      llmConfig: input.llmConfig,
      systemPrompt: input.systemPrompt,
    },
    {
      artifacts,
      promptText: input.artifactExcerptPrompt,
    }
  )

  if (planResult.action === ASK_CLARIFICATION) {
    return {
      ...input.state,
      clarification: planResult.clarification,
      steps: appendStateStep(
        input.state.steps,
        'CLARIFICATION_REQUESTED',
        'coordinatorPlanActivity requested clarification.',
        { activity: 'coordinatorPlanActivity', reason: planResult.clarification.reason }
      ),
    }
  }

  const policyDecision = enforceCoordinatorPlan({
    text: input.state.userInput.text,
    locale: input.state.userInput.locale ?? null,
    plan: planResult.plan,
    artifacts,
  })

  if (policyDecision.action === ASK_CLARIFICATION) {
    return {
      ...input.state,
      clarification: policyDecision.clarification,
      normalized: {
        text: policyDecision.normalized.canonicalText,
        locale: policyDecision.normalized.locale,
        requestedEntityDescription:
          planResult.plan.entityHint && 'description' in planResult.plan.entityHint
            ? planResult.plan.entityHint.description
            : null,
        tokens: policyDecision.normalized.tokens,
      },
      steps: appendStateStep(
        input.state.steps,
        'CLARIFICATION_REQUESTED',
        'coordinatorPlanActivity rejected the plan and requested clarification.',
        { activity: 'coordinatorPlanActivity', reasons: policyDecision.reasons }
      ),
    }
  }

  if (!policyDecision.querySelection.selected) {
    return {
      ...input.state,
      clarification: buildClarification(
        'Please restate the request with enough detail for a governed query selection.',
        policyDecision.querySelection.reason ?? 'No deterministic governed query could be selected.'
      ),
      steps: appendStateStep(
        input.state.steps,
        'CLARIFICATION_REQUESTED',
        'coordinatorPlanActivity could not derive a deterministic governed query.',
        { activity: 'coordinatorPlanActivity', reason: policyDecision.querySelection.reason }
      ),
    }
  }

  const selectedQuery: SelectedQueryState = {
    queryId: policyDecision.querySelection.selected.queryId,
    args: policyDecision.querySelection.selected.args,
  }

  return {
    ...input.state,
    plan: policyDecision.plan,
    normalized: {
      text: policyDecision.normalized.canonicalText,
      locale: policyDecision.normalized.locale,
      requestedEntityDescription:
        policyDecision.plan.entityHint && 'description' in policyDecision.plan.entityHint
          ? policyDecision.plan.entityHint.description
          : null,
      tokens: policyDecision.normalized.tokens,
    },
    selectedQuery,
    clarification: null,
    steps: appendStateStep(
      appendStateStep(
        appendStateStep(
          input.state.steps,
          'PLAN_CREATED',
          'coordinatorPlanActivity created a valid plan.',
          {
            activity: 'coordinatorPlanActivity',
            intent: policyDecision.plan.intent,
            entityType: policyDecision.plan.entityHint?.entityType,
          }
        ),
        'INPUT_NORMALIZED',
        'coordinatorPlanActivity normalized and validated the plan against artifacts.',
        {
          activity: 'coordinatorPlanActivity',
          intent: policyDecision.plan.intent,
          entityType: policyDecision.plan.entityHint?.entityType,
        }
      ),
      'QUERY_SELECTED',
      'coordinatorPlanActivity accepted the deterministic governed query selection.',
      {
        activity: 'coordinatorPlanActivity',
        queryId: selectedQuery.queryId,
        candidates: policyDecision.querySelection.queryIds,
      }
    ),
  }
}

export async function dataLookupActivity(input: DataLookupActivityInput): Promise<AiState> {
  if (!input.state.selectedQuery) {
    throw new Error('dataLookupActivity requires selectedQuery.')
  }

  if (!input.state.userInput.companyId?.trim()) {
    throw new Error(
      'dataLookupActivity requires userInput.companyId for mandatory company scoping.'
    )
  }

  const artifacts = loadArtifacts()
  const lookupResult = await executeQuery(input.state.selectedQuery.queryId as QueryId, {
    companyId: input.state.userInput.companyId,
    accessToken: input.accessToken ?? null,
    args: input.state.selectedQuery.args,
    artifacts,
  })

  return {
    ...input.state,
    data: lookupResult.data,
    steps: appendStateStep(
      input.state.steps,
      'DATA_ATTACHED',
      'dataLookupActivity attached GraphQL lookup results.',
      {
        activity: 'dataLookupActivity',
        queryId: lookupResult.queryId,
        rootQueries: lookupResult.rootQueries,
      }
    ),
  }
}

export async function explainActivity(input: ExplainActivityInput): Promise<AiState> {
  const answer: AnswerState = {
    text: summarizeLookupResult(input.state.data),
    confidence: 1,
    citations: input.state.selectedQuery
      ? [
          {
            queryId: input.state.selectedQuery.queryId,
          },
        ]
      : [],
  }

  return {
    ...input.state,
    answer,
    steps: appendStateStep(
      input.state.steps,
      'ANSWER_PREPARED',
      'explainActivity prepared an answer from lookup results only.',
      { activity: 'explainActivity', queryId: input.state.selectedQuery?.queryId ?? null }
    ),
  }
}
