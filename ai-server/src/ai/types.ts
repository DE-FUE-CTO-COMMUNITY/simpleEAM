export type AiRunUseCase = 'STRATEGIC_ENRICHMENT'

export interface StrategicResearchSource {
  readonly title: string
  readonly url: string
  readonly snippet: string
}

export interface StrategicMissionDraft {
  readonly name: string
  readonly purposeStatement: string
  readonly keywords: readonly string[]
  readonly year: string
}

export interface StrategicVisionDraft {
  readonly name: string
  readonly visionStatement: string
  readonly timeHorizon: string
  readonly year: string
}

export interface StrategicValueDraft {
  readonly name: string
  readonly valueStatement: string
}

export interface StrategicGoalDraft {
  readonly name: string
  readonly goalStatement: string
}

export interface StrategicStrategyDraft {
  readonly name: string
  readonly description: string
}

export interface AiRunWorkflowInput {
  readonly runId: string
  readonly companyId: string
  readonly companyName: string
  readonly prompt: string
  readonly objective?: string | null
  readonly initiatedBy: string
  readonly useCase: AiRunUseCase
  readonly accessToken: string
}

export interface StrategicDraftPayload {
  readonly companyName: string
  readonly generatedAt: string
  readonly mission: StrategicMissionDraft
  readonly vision: StrategicVisionDraft
  readonly values: readonly StrategicValueDraft[]
  readonly goals: readonly StrategicGoalDraft[]
  readonly strategies: readonly StrategicStrategyDraft[]
  readonly sources: readonly StrategicResearchSource[]
  readonly bmc: {
    readonly keyPartners: readonly string[]
    readonly keyActivities: readonly string[]
    readonly valuePropositions: readonly string[]
    readonly customerSegments: readonly string[]
    readonly channels: readonly string[]
    readonly revenueStreams: readonly string[]
    readonly costStructure: readonly string[]
  }
}

export interface GeneratedRunOutput {
  readonly summary: string
  readonly draftPayload: StrategicDraftPayload | null
}

export interface CompleteAiRunInput {
  readonly runId: string
  readonly summary: string
  readonly draftPayload: StrategicDraftPayload | null
  readonly accessToken?: string
}

export interface FailAiRunInput {
  readonly runId: string
  readonly errorMessage: string
  readonly accessToken?: string
}

export interface GenerateSummaryInput {
  readonly companyId: string
  readonly companyName?: string
  readonly prompt: string
  readonly objective?: string | null
  readonly useCase: AiRunUseCase
}

export interface CreateAiAuditEventInput {
  readonly runId: string
  readonly action: 'APPROVED' | 'REJECTED'
  readonly actor: string
  readonly comment?: string | null
}
