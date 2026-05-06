import { proxyActivities } from '@temporalio/workflow'

import type { AiState } from '../state/aiState'
import type { CompleteAiRunInput, FailAiRunInput } from '../src/types/agents'
import type { AiQueryWorkflowInput } from './activities'

type TemporalAiQueryActivities = {
  markAiRunRunningWithToken: (input: { runId: string; accessToken: string }) => Promise<void>
  markAiRunCompletedWithToken: (
    input: CompleteAiRunInput & { accessToken: string }
  ) => Promise<void>
  markAiRunFailedWithToken: (input: FailAiRunInput & { accessToken: string }) => Promise<void>
  updateAiRunStatusMessage: (input: {
    runId: string
    statusMessage: string
    accessToken: string
  }) => Promise<void>
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

const {
  markAiRunRunningWithToken,
  markAiRunCompletedWithToken,
  markAiRunFailedWithToken,
  updateAiRunStatusMessage,
} = proxyActivities<
  Pick<
    TemporalAiQueryActivities,
    | 'markAiRunRunningWithToken'
    | 'markAiRunCompletedWithToken'
    | 'markAiRunFailedWithToken'
    | 'updateAiRunStatusMessage'
  >
>({
  startToCloseTimeout: '30 seconds',
  retry: {
    maximumAttempts: 2,
    backoffCoefficient: 2,
    initialInterval: '2s',
    maximumInterval: '10s',
  },
})

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

async function runGovernedQueryWorkflow(userInput: AiQueryWorkflowInput): Promise<AiState> {
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

  await updateAiRunStatusMessage({
    runId: userInput.runId,
    statusMessage: 'Selecting governed query...',
    accessToken: userInput.accessToken ?? '',
  })

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

  await updateAiRunStatusMessage({
    runId: userInput.runId,
    statusMessage: 'Executing governed query...',
    accessToken: userInput.accessToken ?? '',
  })

  state = await dataLookupActivity({
    state,
    accessToken: userInput.accessToken ?? null,
  })

  await updateAiRunStatusMessage({
    runId: userInput.runId,
    statusMessage: 'Preparing governed answer...',
    accessToken: userInput.accessToken ?? '',
  })

  return explainActivity({ state })
}

export async function aiQueryWorkflow(userInput: AiQueryWorkflowInput): Promise<AiState> {
  await markAiRunRunningWithToken({
    runId: userInput.runId,
    accessToken: userInput.accessToken ?? '',
  })

  try {
    const state = await runGovernedQueryWorkflow(userInput)
    const finalText =
      state.clarification?.question ??
      state.answer?.text ??
      'No governed answer could be prepared for this request.'

    await markAiRunCompletedWithToken({
      runId: userInput.runId,
      summary: finalText,
      draftPayload: null,
      accessToken: userInput.accessToken ?? '',
    })

    return state
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Governed query workflow failed'

    await markAiRunFailedWithToken({
      runId: userInput.runId,
      errorMessage,
      accessToken: userInput.accessToken ?? '',
    })

    throw error
  }
}
