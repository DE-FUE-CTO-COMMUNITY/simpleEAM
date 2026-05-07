import { Annotation, END, START, StateGraph } from '@langchain/langgraph'

import { loadArtifacts } from '../artifacts/loader'
import type { LoadedArtifacts, SupportedLocale } from '../artifacts/types'
import { createPlan, type CoordinatorArtifactExcerpt } from '../agents/coordinatorAdapter'
import { executeQuery, type ExecutedQueryResult } from '../agents/dataLookupAdapter'
import { responseFormatter } from '../formatting/responseFormatter'
import { ASK_CLARIFICATION, enforceCoordinatorPlan } from '../policy/enforce'
import type { QueryId, QuerySelection } from '../policy/querySelect'
import type { AiState, AnswerState, NormalizedState, SelectedQueryState } from '../state/aiState'
import type { Clarification, Plan } from '../state/plan'
import { appendStateStep } from '../state/trajectory'

interface GraphRuntimeContext {
  readonly llmConfig?: {
    readonly llmUrl: string
    readonly llmModel: string
    readonly llmKey: string
    readonly temperature?: number
    readonly topP?: number
    readonly maxTokens?: number
  }
  readonly accessToken?: string | null
  readonly companyName?: string | null
  readonly systemPrompt?: string
  readonly artifactExcerptPrompt?: string
  readonly artifacts?: LoadedArtifacts
}

interface GraphExecutionEnvelope {
  readonly runtime?: GraphRuntimeContext
  readonly querySelection?: QuerySelection
  readonly lookupResult?: ExecutedQueryResult
}

const aiStateAnnotation = Annotation.Root({
  userInput: Annotation<AiState['userInput']>({ reducer: (_, update) => update }),
  plan: Annotation<Plan | null>({ reducer: (_, update) => update, default: () => null }),
  normalized: Annotation<NormalizedState | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  selectedQuery: Annotation<SelectedQueryState | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  data: Annotation<unknown>({ reducer: (_, update) => update, default: () => null }),
  answer: Annotation<AnswerState | null>({ reducer: (_, update) => update, default: () => null }),
  clarification: Annotation<Clarification | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
  steps: Annotation<AiState['steps']>({ reducer: (_, update) => update, default: () => [] }),
})

function asEnvelope(data: unknown): GraphExecutionEnvelope {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {}
  }

  return data as GraphExecutionEnvelope
}

function withEnvelope(
  state: AiState,
  patch: Partial<GraphExecutionEnvelope>
): GraphExecutionEnvelope {
  return {
    ...asEnvelope(state.data),
    ...patch,
  }
}

function getArtifacts(state: AiState): LoadedArtifacts {
  const envelope = asEnvelope(state.data)
  return envelope.runtime?.artifacts ?? loadArtifacts()
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

async function planNode(state: AiState): Promise<Partial<AiState>> {
  const envelope = asEnvelope(state.data)
  const runtime = envelope.runtime
  const artifacts = getArtifacts(state)

  if (!runtime?.llmConfig) {
    return {
      clarification: buildClarification(
        'Please provide the missing runtime configuration for planning.',
        'runGraph requires llmConfig in state.data.runtime before planNode can create a plan.'
      ),
      steps: appendStateStep(
        state.steps,
        'CLARIFICATION_REQUESTED',
        'planNode could not run because llmConfig was missing.',
        { node: 'planNode' }
      ),
      data: withEnvelope(state, { runtime: { ...runtime, artifacts } }),
    }
  }

  const result = await createPlan(
    {
      text: state.userInput.text,
      locale: (state.userInput.locale ?? null) as SupportedLocale | null,
      companyName: runtime.companyName ?? null,
      llmConfig: runtime.llmConfig,
      systemPrompt: runtime.systemPrompt,
    },
    {
      artifacts,
      promptText: runtime.artifactExcerptPrompt,
    } satisfies CoordinatorArtifactExcerpt
  )

  if (result.action === ASK_CLARIFICATION) {
    return {
      clarification: result.clarification,
      steps: appendStateStep(
        state.steps,
        'CLARIFICATION_REQUESTED',
        'planNode requested clarification.',
        { node: 'planNode', reason: result.clarification.reason }
      ),
      data: withEnvelope(state, { runtime: { ...runtime, artifacts } }),
    }
  }

  return {
    plan: result.plan,
    clarification: null,
    steps: appendStateStep(state.steps, 'PLAN_CREATED', 'planNode created a valid plan.', {
      node: 'planNode',
      intent: result.plan.intent,
      entityType: result.plan.entityHint?.entityType,
    }),
    data: withEnvelope(state, { runtime: { ...runtime, artifacts } }),
  }
}

async function enforceNode(state: AiState): Promise<Partial<AiState>> {
  const artifacts = getArtifacts(state)

  if (state.clarification) {
    return {
      steps: appendStateStep(
        state.steps,
        'CLARIFICATION_REQUESTED',
        'enforceNode observed a clarification state and stopped graph execution.',
        { node: 'enforceNode', reason: state.clarification.reason }
      ),
      data: withEnvelope(state, { runtime: { ...asEnvelope(state.data).runtime, artifacts } }),
    }
  }

  if (!state.plan) {
    const clarification = buildClarification(
      'Please restate the request with enough detail to build a plan.',
      'enforceNode received no plan from planNode.'
    )

    return {
      clarification,
      steps: appendStateStep(
        state.steps,
        'CLARIFICATION_REQUESTED',
        'enforceNode requested clarification because no plan was present.',
        { node: 'enforceNode' }
      ),
      data: withEnvelope(state, { runtime: { ...asEnvelope(state.data).runtime, artifacts } }),
    }
  }

  if (!state.userInput.companyId?.trim()) {
    const clarification = buildClarification(
      'Please provide the company context for the lookup.',
      'Mandatory company scoping requires userInput.companyId before execution can continue.'
    )

    return {
      clarification,
      steps: appendStateStep(
        state.steps,
        'CLARIFICATION_REQUESTED',
        'enforceNode requested clarification because companyId was missing.',
        { node: 'enforceNode' }
      ),
      data: withEnvelope(state, { runtime: { ...asEnvelope(state.data).runtime, artifacts } }),
    }
  }

  const decision = enforceCoordinatorPlan({
    text: state.userInput.text,
    locale: (state.userInput.locale ?? null) as SupportedLocale | null,
    plan: state.plan,
    artifacts,
  })

  if (decision.action === ASK_CLARIFICATION) {
    return {
      clarification: decision.clarification,
      normalized: {
        text: decision.normalized.canonicalText,
        locale: decision.normalized.locale,
        requestedEntityDescription:
          state.plan.entityHint && 'description' in state.plan.entityHint
            ? state.plan.entityHint.description
            : null,
        tokens: decision.normalized.tokens,
        semanticConstraints: decision.normalized.semanticConstraints,
        semanticAmbiguities: decision.normalized.semanticAmbiguities,
      },
      steps: appendStateStep(
        state.steps,
        'CLARIFICATION_REQUESTED',
        'enforceNode rejected the plan and requested clarification.',
        { node: 'enforceNode', reasons: decision.reasons }
      ),
      data: withEnvelope(state, { runtime: { ...asEnvelope(state.data).runtime, artifacts } }),
    }
  }

  return {
    plan: decision.plan,
    normalized: {
      text: decision.normalized.canonicalText,
      locale: decision.normalized.locale,
      requestedEntityDescription:
        decision.plan.entityHint && 'description' in decision.plan.entityHint
          ? decision.plan.entityHint.description
          : null,
      tokens: decision.normalized.tokens,
      semanticConstraints: decision.normalized.semanticConstraints,
      semanticAmbiguities: decision.normalized.semanticAmbiguities,
    },
    clarification: null,
    steps: appendStateStep(
      state.steps,
      'INPUT_NORMALIZED',
      'enforceNode normalized and validated the plan against artifacts.',
      {
        node: 'enforceNode',
        intent: decision.plan.intent,
        entityType: decision.plan.entityHint?.entityType,
      }
    ),
    data: withEnvelope(state, {
      runtime: { ...asEnvelope(state.data).runtime, artifacts },
      querySelection: decision.querySelection,
    }),
  }
}

async function querySelectNode(state: AiState): Promise<Partial<AiState>> {
  const envelope = asEnvelope(state.data)
  const selection = envelope.querySelection
  const artifacts = getArtifacts(state)

  if (!selection?.selected) {
    throw new Error(selection?.reason ?? 'querySelectNode requires a deterministic selected query.')
  }

  const selectedQuery: SelectedQueryState = {
    queryId: selection.selected.queryId,
    args: selection.selected.args,
  }

  return {
    selectedQuery,
    steps: appendStateStep(
      state.steps,
      'QUERY_SELECTED',
      'querySelectNode accepted the deterministic governed query selection.',
      {
        node: 'querySelectNode',
        queryId: selectedQuery.queryId,
        candidates: selection.queryIds,
      }
    ),
    data: withEnvelope(state, {
      runtime: { ...envelope.runtime, artifacts },
      querySelection: selection,
    }),
  }
}

async function lookupNode(state: AiState): Promise<Partial<AiState>> {
  if (!state.selectedQuery) {
    throw new Error('lookupNode requires a selectedQuery.')
  }

  if (!state.userInput.companyId?.trim()) {
    throw new Error('lookupNode requires userInput.companyId for mandatory company scoping.')
  }

  const envelope = asEnvelope(state.data)
  const artifacts = getArtifacts(state)
  const lookupResult = await executeQuery(state.selectedQuery.queryId as QueryId, {
    companyId: state.userInput.companyId,
    accessToken: envelope.runtime?.accessToken ?? null,
    args: state.selectedQuery.args,
    artifacts,
  })

  return {
    data: withEnvelope(state, {
      runtime: { ...envelope.runtime, artifacts },
      querySelection: envelope.querySelection,
      lookupResult,
    }),
    steps: appendStateStep(
      state.steps,
      'DATA_ATTACHED',
      'lookupNode attached GraphQL lookup results.',
      {
        node: 'lookupNode',
        queryId: lookupResult.queryId,
        rootQueries: lookupResult.rootQueries,
      }
    ),
  }
}

async function explainNode(state: AiState): Promise<Partial<AiState>> {
  const envelope = asEnvelope(state.data)
  const lookupResult = envelope.lookupResult
  if (!lookupResult) {
    throw new Error('explainNode requires lookup results from lookupNode.')
  }

  const relationType =
    typeof state.selectedQuery?.args?.relationField === 'string'
      ? state.selectedQuery.args.relationField
      : null
  const formatted = responseFormatter.format(lookupResult.data, {
    text: state.userInput.text,
    locale: state.userInput.locale ?? null,
    intent: state.plan?.intent ?? null,
    entityType: state.plan?.entityHint?.entityType ?? null,
    relationType,
    selectedQueryArgs: state.selectedQuery?.args ?? null,
  })

  const answer: AnswerState = {
    text: formatted,
    confidence: 1,
    citations: [
      {
        queryId: lookupResult.queryId,
        rootQueries: lookupResult.rootQueries,
      },
    ],
  }

  return {
    answer,
    data: withEnvelope(state, envelope),
    steps: appendStateStep(
      state.steps,
      'ANSWER_PREPARED',
      'explainNode prepared an answer using lookup results only.',
      { node: 'explainNode', queryId: lookupResult.queryId }
    ),
  }
}

function buildWorkflow() {
  return new StateGraph(aiStateAnnotation)
    .addNode('planNode', planNode)
    .addNode('enforceNode', enforceNode)
    .addNode('querySelect', querySelectNode)
    .addNode('lookup', lookupNode)
    .addNode('explain', explainNode)
    .addEdge(START, 'planNode')
    .addEdge('planNode', 'enforceNode')
    .addConditionalEdges(
      'enforceNode',
      state => (state.clarification ? ASK_CLARIFICATION : 'querySelect'),
      {
        [ASK_CLARIFICATION]: END,
        querySelect: 'querySelect',
      }
    )
    .addEdge('querySelect', 'lookup')
    .addEdge('lookup', 'explain')
    .addEdge('explain', END)
}

export function buildGraph() {
  return buildWorkflow().compile()
}

export async function runGraph(initialState: AiState): Promise<AiState> {
  const graph = buildGraph()
  const result = await graph.invoke({
    userInput: initialState.userInput,
    plan: initialState.plan,
    normalized: initialState.normalized,
    selectedQuery: initialState.selectedQuery,
    data: initialState.data,
    answer: initialState.answer,
    clarification: initialState.clarification,
    steps: initialState.steps ?? [],
  })

  return result as AiState
}
