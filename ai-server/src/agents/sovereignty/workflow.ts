import { proxyActivities } from '@temporalio/workflow'
import type { SovereigntyScoreWorkflowInput, SovereigntyScores } from '../types'

type SovereigntyActivities = {
  fetchSovereigntyReqEntities: (input: {
    companyId: string
    accessToken: string
  }) => Promise<Record<string, string | number | null | undefined>[]>
  fetchSovereigntyAchEntities: (input: {
    companyId: string
    accessToken: string
  }) => Promise<Record<string, string | number | null | undefined>[]>
  computeSovereigntyScores: (input: {
    reqEntities: Record<string, string | number | null | undefined>[]
    achEntities: Record<string, string | number | null | undefined>[]
  }) => Promise<SovereigntyScores>
  updateCompanySovereigntyScores: (input: {
    companyId: string
    scores: SovereigntyScores
    accessToken: string
  }) => Promise<void>
  markSovereigntyCalculating: (input: { companyId: string; accessToken: string }) => Promise<void>
  markSovereigntyError: (input: { companyId: string; accessToken: string }) => Promise<void>
}

const {
  fetchSovereigntyReqEntities,
  fetchSovereigntyAchEntities,
  computeSovereigntyScores,
  updateCompanySovereigntyScores,
  markSovereigntyCalculating,
  markSovereigntyError,
} = proxyActivities<SovereigntyActivities>({
  startToCloseTimeout: '5 minutes',
  retry: { maximumAttempts: 3 },
})

export async function sovereigntyScoreWorkflow(
  input: SovereigntyScoreWorkflowInput
): Promise<void> {
  await markSovereigntyCalculating({ companyId: input.companyId, accessToken: input.accessToken })

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
      await markSovereigntyError({ companyId: input.companyId, accessToken: input.accessToken })
    } catch {
      // best-effort — don't swallow original error
    }
    throw error
  }
}
