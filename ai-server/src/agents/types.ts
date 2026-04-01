// ─────────────────────────────────────────────
// LLM Configuration
// ─────────────────────────────────────────────

export interface LlmConfig {
  readonly llmUrl: string
  readonly llmModel: string
  readonly llmKey: string
}

// ─────────────────────────────────────────────
// Agent Registry
// ─────────────────────────────────────────────

export interface AgentDescriptor {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly capabilities: readonly string[]
  readonly inputDescription: string
  readonly outputDescription: string
}

// ─────────────────────────────────────────────
// Coordinator / Plan Types
// ─────────────────────────────────────────────

export interface DocumentInput {
  readonly name: string
  readonly content: string
  readonly mimeType?: string
}

export interface AgentPlanStep {
  readonly stepId: string
  readonly agentId: string
  readonly task: string
  readonly dependsOn: readonly string[]
  readonly documents?: readonly DocumentInput[]
}

export interface AgentPlan {
  readonly steps: readonly AgentPlanStep[]
  readonly reasoning: string
}

export interface AgentStepResult {
  readonly stepId: string
  readonly agentId: string
  readonly summary: string
  readonly data: unknown
  readonly error?: string
}

// ─────────────────────────────────────────────
// Coordinator Workflow Input / Output Types
// ─────────────────────────────────────────────

export type AiRunUseCase = 'STRATEGIC_ENRICHMENT' | 'CONVERSATIONAL_ASSISTANT'

export interface CoordinatorWorkflowInput {
  readonly runId: string
  readonly companyId: string
  readonly companyName: string
  readonly prompt: string
  readonly objective?: string | null
  readonly useCase: AiRunUseCase
  readonly accessToken: string
  readonly llmConfig: LlmConfig
  readonly documents?: readonly DocumentInput[]
}

// ─────────────────────────────────────────────
// Activity Input / Output Types used in Workflow
// ─────────────────────────────────────────────

export interface PlanAgentRunInput {
  readonly prompt: string
  readonly objective: string | null
  readonly companyName: string
  readonly llmConfig: LlmConfig
  readonly previousResults: readonly AgentStepResult[]
  readonly qcFeedback: string
  readonly documents: readonly DocumentInput[]
}

export interface AggregateStepResultsInput {
  readonly prompt: string
  readonly companyName: string
  readonly stepResults: readonly AgentStepResult[]
  readonly llmConfig: LlmConfig
}

export interface AggregateStepResultsOutput {
  readonly summary: string
}

export interface QualityCheckInput {
  readonly originalPrompt: string
  readonly companyName: string
  readonly stepResults: readonly AgentStepResult[]
  readonly llmConfig: LlmConfig
  readonly iterationNumber: number
}

export interface QualityCheckOutput {
  readonly passed: boolean
  readonly score: number
  readonly feedback: string
}

export interface InternetResearchInput {
  readonly stepId: string
  readonly task: string
  readonly context?: string
  readonly companyName?: string
  readonly llmConfig: LlmConfig
}

export interface InternetResearchOutput {
  readonly summary: string
  readonly sources: Array<{ title: string; url: string; snippet: string }>
}

export interface DocumentResearchInput {
  readonly stepId: string
  readonly task: string
  readonly context?: string
  readonly documents: readonly DocumentInput[]
  readonly llmConfig: LlmConfig
}

export interface DocumentResearchOutput {
  readonly summary: string
  readonly findings: Array<{ documentName: string; excerpt: string }>
}

export interface StrategyGeneratorInput {
  readonly stepId: string
  readonly task: string
  readonly context?: string
  readonly companyId: string
  readonly companyName: string
  readonly prompt: string
  readonly objective?: string | null
  readonly llmConfig: LlmConfig
}

export interface StrategyGeneratorOutput {
  readonly summary: string
  readonly draftPayload: StrategicDraftPayload | null
}

// ─────────────────────────────────────────────
// Domain: Strategic Draft
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// AI Run Activity Types
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Sovereignty
// ─────────────────────────────────────────────

export interface SovereigntyScoreWorkflowInput {
  readonly companyId: string
  readonly accessToken: string
}

export interface SovereigntyScores {
  readonly expectedSovereigntyScore: number | null
  readonly achievedSovereigntyScore: number | null
  readonly sovereigntyGap: number | null
  readonly sovereigntyScorePercent: number | null
}

// ─────────────────────────────────────────────
// Audit
// ─────────────────────────────────────────────

export interface CreateAiAuditEventInput {
  readonly runId: string
  readonly action:
    | 'APPROVED'
    | 'REJECTED'
    | 'PROPOSAL_CREATED'
    | 'DRY_RUN_VALIDATED'
    | 'APPLY_REQUESTED'
    | 'APPLIED'
    | 'UNAUTHORIZED_BLOCKED'
  readonly actor: string
  readonly comment?: string | null
}
