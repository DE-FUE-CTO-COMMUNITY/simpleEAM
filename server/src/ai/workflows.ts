import { proxyActivities } from '@temporalio/workflow'
import { AiRunWorkflowInput } from './types'
import type * as activities from './activities'

const { markAiRunRunning, markAiRunCompleted, markAiRunFailed } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '30 seconds',
  retry: {
    maximumAttempts: 3,
  },
})

const { generateAiRunSummary } = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
  retry: {
    maximumAttempts: 1,
  },
})

export async function aiRunWorkflow(input: AiRunWorkflowInput): Promise<void> {
  await markAiRunRunning(input.runId)

  try {
    const generatedOutput = await generateAiRunSummary({
      companyId: input.companyId,
      prompt: input.prompt,
      objective: input.objective,
      useCase: input.useCase,
    })

    await markAiRunCompleted({
      runId: input.runId,
      summary: generatedOutput.summary,
      draftPayload: generatedOutput.draftPayload,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown AI run workflow error'

    await markAiRunFailed({
      runId: input.runId,
      errorMessage,
    })

    throw error
  }
}
