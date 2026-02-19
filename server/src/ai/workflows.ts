import { proxyActivities } from '@temporalio/workflow'
import { AiRunWorkflowInput } from './types'
import type * as activities from './activities'

const {
  markAiRunRunning,
  generateAiRunSummary,
  markAiRunCompleted,
  markAiRunFailed,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
})

export async function aiRunWorkflow(input: AiRunWorkflowInput): Promise<void> {
  await markAiRunRunning(input.runId)

  try {
    const summary = await generateAiRunSummary({
      prompt: input.prompt,
      objective: input.objective,
    })

    await markAiRunCompleted({
      runId: input.runId,
      summary,
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
