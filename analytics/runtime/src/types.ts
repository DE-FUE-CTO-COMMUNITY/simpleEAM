export interface AnalyticsProjectionRefreshWorkflowInput {
  readonly companyId?: string | null
  readonly initiatedBy: string
  readonly reason: 'manual' | 'scheduled'
  readonly maxConcurrency?: number
}

export interface AnalyticsProjectionCompany {
  readonly id: string
  readonly name: string
}

export interface AnalyticsProjectionSyncResult {
  readonly companyId: string
  readonly companyName: string
  readonly applications: number
  readonly capabilities: number
}

export interface AnalyticsProjectionRefreshWorkflowResult {
  readonly initiatedBy: string
  readonly reason: 'manual' | 'scheduled'
  readonly requestedCompanyId: string | null
  readonly syncedCompanies: number
  readonly results: readonly AnalyticsProjectionSyncResult[]
}
