import { proxyActivities } from '@temporalio/workflow'
import { AiRunWorkflowInput } from './types'
import type * as activities from './activities'

const {
  markAiRunRunningWithToken,
  markAiRunCompletedWithToken,
  markAiRunFailedWithToken,
  generateAiRunSummary,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
  retry: {
    maximumAttempts: 3,
  },
})

export async function aiRunWorkflow(input: AiRunWorkflowInput): Promise<void> {
  await markAiRunRunningWithToken({
    runId: input.runId,
    accessToken: input.accessToken,
  })

  try {
    const generatedOutput = await generateAiRunSummary({
      companyId: input.companyId,
      companyName: input.companyName,
      prompt: input.prompt,
      objective: input.objective,
      useCase: input.useCase,
    })

    await markAiRunCompletedWithToken({
      runId: input.runId,
      summary: generatedOutput.summary,
      draftPayload: generatedOutput.draftPayload,
      accessToken: input.accessToken,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown AI run workflow error'

    await markAiRunFailedWithToken({
      runId: input.runId,
      errorMessage,
      accessToken: input.accessToken,
    })

    throw error
  }
}
