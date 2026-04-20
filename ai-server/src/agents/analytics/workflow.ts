import { proxyActivities } from '@temporalio/workflow'
import {
  AnalyticsProjectionCompany,
  AnalyticsProjectionRefreshWorkflowInput,
  AnalyticsProjectionRefreshWorkflowResult,
  AnalyticsProjectionSyncResult,
} from '../types'

type AnalyticsProjectionActivities = {
  discoverAnalyticsCompanies: (input: {
    companyId?: string | null
  }) => Promise<AnalyticsProjectionCompany[]>
  syncCompanyAnalyticsProjection: (input: {
    companyId: string
    companyName: string
  }) => Promise<AnalyticsProjectionSyncResult>
}

const { discoverAnalyticsCompanies, syncCompanyAnalyticsProjection } =
  proxyActivities<AnalyticsProjectionActivities>({
    startToCloseTimeout: '15 minutes',
    retry: { maximumAttempts: 3 },
  })

function chunkCompanies(
  companies: readonly AnalyticsProjectionCompany[],
  maxConcurrency: number
): AnalyticsProjectionCompany[][] {
  const batches: AnalyticsProjectionCompany[][] = []

  for (let index = 0; index < companies.length; index += maxConcurrency) {
    batches.push(companies.slice(index, index + maxConcurrency))
  }

  return batches
}

export async function analyticsProjectionRefreshWorkflow(
  input: AnalyticsProjectionRefreshWorkflowInput
): Promise<AnalyticsProjectionRefreshWorkflowResult> {
  const requestedCompanyId = input.companyId ?? null
  const companies = await discoverAnalyticsCompanies({ companyId: requestedCompanyId })

  if (companies.length === 0) {
    return {
      initiatedBy: input.initiatedBy,
      reason: input.reason,
      requestedCompanyId,
      syncedCompanies: 0,
      results: [],
    }
  }

  const maxConcurrency = Math.max(1, Math.trunc(input.maxConcurrency ?? 5))
  const results: AnalyticsProjectionSyncResult[] = []
  const failures: string[] = []

  for (const batch of chunkCompanies(companies, maxConcurrency)) {
    const settledResults = await Promise.allSettled(
      batch.map(company =>
        syncCompanyAnalyticsProjection({
          companyId: company.id,
          companyName: company.name,
        })
      )
    )

    settledResults.forEach((result, index) => {
      const company = batch[index]

      if (result.status === 'fulfilled') {
        results.push(result.value)
        return
      }

      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
      failures.push(`${company.id}: ${reason}`)
    })
  }

  if (failures.length > 0) {
    throw new Error(`Analytics projection refresh failed for ${failures.join('; ')}`)
  }

  return {
    initiatedBy: input.initiatedBy,
    reason: input.reason,
    requestedCompanyId,
    syncedCompanies: results.length,
    results,
  }
}
