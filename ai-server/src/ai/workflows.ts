import { proxyActivities } from '@temporalio/workflow'
import { AiRunWorkflowInput, SovereigntyScoreWorkflowInput } from './types'
import type * as activities from './activities'

const {
  markAiRunRunningWithToken,
  markAiRunCompletedWithToken,
  markAiRunFailedWithToken,
  generateAiRunSummary,
  fetchSovereigntyReqEntities,
  fetchSovereigntyAchEntities,
  computeSovereigntyScores,
  updateCompanySovereigntyScores,
  markSovereigntyCalculating,
  markSovereigntyError,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '5 minutes',
  retry: {
    maximumAttempts: 3,
  },
})

export async function aiRunWorkflow(input: AiRunWorkflowInput): Promise<void> {
  try {
    await markAiRunRunningWithToken({
      runId: input.runId,
      accessToken: input.accessToken,
    })

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

    try {
      await markAiRunFailedWithToken({
        runId: input.runId,
        errorMessage,
        accessToken: input.accessToken,
      })
    } catch (markFailedError) {
      const markFailedMessage =
        markFailedError instanceof Error ? markFailedError.message : 'Unknown mark-failed error'
      throw new Error(
        `${errorMessage}; additionally failed to persist FAILED state: ${markFailedMessage}`
      )
    }

    throw error
  }
}

export async function sovereigntyScoreWorkflow(
  input: SovereigntyScoreWorkflowInput
): Promise<void> {
  await markSovereigntyCalculating({
    companyId: input.companyId,
    accessToken: input.accessToken,
  })

  try {
    const reqEntities = await fetchSovereigntyReqEntities({
      companyId: input.companyId,
      accessToken: input.accessToken,
    })

    const achEntities = await fetchSovereigntyAchEntities({
      companyId: input.companyId,
      accessToken: input.accessToken,
    })

    const scores = await computeSovereigntyScores({ reqEntities, achEntities })

    await updateCompanySovereigntyScores({
      companyId: input.companyId,
      scores,
      accessToken: input.accessToken,
    })
  } catch (error) {
    try {
      await markSovereigntyError({
        companyId: input.companyId,
        accessToken: input.accessToken,
      })
    } catch {
      // best-effort – don't swallow original error
    }
    throw error
  }
}
