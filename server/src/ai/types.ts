export interface AiRunWorkflowInput {
  readonly runId: string
  readonly companyId: string
  readonly prompt: string
  readonly objective?: string | null
  readonly initiatedBy: string
}

export interface CompleteAiRunInput {
  readonly runId: string
  readonly summary: string
}

export interface FailAiRunInput {
  readonly runId: string
  readonly errorMessage: string
}

export interface GenerateSummaryInput {
  readonly prompt: string
  readonly objective?: string | null
}
