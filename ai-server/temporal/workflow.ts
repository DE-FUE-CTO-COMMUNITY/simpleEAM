import { proxyActivities } from '@temporalio/workflow'

import type { AiState } from '../state/aiState'
import type { AiQueryWorkflowInput } from './activities'

type TemporalAiQueryActivities = {
  coordinatorPlanActivity: (input: {
    state: AiState
    companyName?: string | null
    llmConfig: AiQueryWorkflowInput['llmConfig']
    systemPrompt?: string
    artifactExcerptPrompt?: string
  }) => Promise<AiState>
  dataLookupActivity: (input: { state: AiState; accessToken?: string | null }) => Promise<AiState>
  explainActivity: (input: { state: AiState }) => Promise<AiState>
}

const { coordinatorPlanActivity } = proxyActivities<
  Pick<TemporalAiQueryActivities, 'coordinatorPlanActivity'>
>({
  startToCloseTimeout: '2 minutes',
  retry: {
    maximumAttempts: 2,
    backoffCoefficient: 2,
    initialInterval: '2s',
    maximumInterval: '20s',
  },
})

const { dataLookupActivity } = proxyActivities<
  Pick<TemporalAiQueryActivities, 'dataLookupActivity'>
>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 2,
    backoffCoefficient: 2,
    initialInterval: '2s',
    maximumInterval: '15s',
  },
})

const { explainActivity } = proxyActivities<Pick<TemporalAiQueryActivities, 'explainActivity'>>({
  startToCloseTimeout: '30 seconds',
  retry: {
    maximumAttempts: 2,
    backoffCoefficient: 2,
    initialInterval: '1s',
    maximumInterval: '10s',
  },
})

export async function aiQueryWorkflow(userInput: AiQueryWorkflowInput): Promise<AiState> {
  let state: AiState = {
    userInput: {
      text: userInput.text,
      locale: userInput.locale ?? null,
      companyId: userInput.companyId,
    },
    plan: null,
    normalized: null,
    selectedQuery: null,
    data: null,
    answer: null,
    clarification: null,
    steps: [],
  }

  state = await coordinatorPlanActivity({
    state,
    companyName: userInput.companyName ?? null,
    llmConfig: userInput.llmConfig,
    systemPrompt: userInput.systemPrompt,
    artifactExcerptPrompt: userInput.artifactExcerptPrompt,
  })

  if (state.clarification) {
    return state
  }

  state = await dataLookupActivity({
    state,
    accessToken: userInput.accessToken ?? null,
  })

  state = await explainActivity({ state })

  return state
}
