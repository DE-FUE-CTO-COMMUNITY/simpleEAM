import type { LoadedArtifacts, SupportedLocale } from '../artifacts/types'
import { ASK_CLARIFICATION, enforceCoordinatorPlan } from '../policy/enforce'
import type { Clarification, Plan } from '../state/plan'
import { planSchema } from '../state/plan.schema'
import { callLlm, parseJsonObject } from '../src/shared/agents/llm'
import type { LlmConfig } from '../src/types/agents'

export interface CoordinatorUserInput {
  readonly text: string
  readonly locale?: SupportedLocale | null
  readonly companyName?: string | null
  readonly objective?: string | null
  readonly llmConfig: LlmConfig
  readonly systemPrompt?: string
}

export interface CoordinatorArtifactExcerpt {
  readonly artifacts: LoadedArtifacts
  readonly promptText?: string
}

export interface ValidCoordinatorPlanResult {
  readonly action: 'ALLOW'
  readonly plan: Plan
  readonly rawOutput: string
}

export interface ClarificationCoordinatorPlanResult {
  readonly action: typeof ASK_CLARIFICATION
  readonly clarification: Clarification
  readonly rawOutput: string
}

export type CoordinatorPlanResult = ValidCoordinatorPlanResult | ClarificationCoordinatorPlanResult

function buildArtifactExcerptPrompt(excerpt: CoordinatorArtifactExcerpt): string {
  if (excerpt.promptText?.trim()) {
    return excerpt.promptText.trim()
  }

  const intents = Object.keys(excerpt.artifacts.intentSchema.intents)
  const entityTypes = Object.keys(excerpt.artifacts.conceptDictionary.concepts).slice(0, 16)

  return [
    `Allowed intents: ${intents.join(', ')}`,
    `Known entity types: ${entityTypes.join(', ')}`,
    'If the request is ambiguous, incomplete, or does not map cleanly to one intent and one entity type, prefer a narrow draft plan and let policy request clarification.',
  ].join('\n')
}

function buildPlanPrompt(
  userInput: CoordinatorUserInput,
  artifactExcerpt: CoordinatorArtifactExcerpt
): string {
  return [
    'You are an enterprise architecture coordinator planner.',
    'Create a JSON plan that matches this exact schema:',
    '{',
    '  "intent": "FACT_LOOKUP | IMPACT_ANALYSIS | DEPENDENCY_EXPLORATION | STRATEGIC_ENRICHMENT | ENTITY_IDENTIFICATION",',
    '  "entityHint"?: {',
    '    "entityType": "CanonicalEntityType",',
    '    "name"?: "exact name",',
    '    "description"?: "plain language description",',
    '    "filters"?: { "field": { "operator": "value" } }',
    '  },',
    '  "clarification"?: {',
    '    "question": "question for the user",',
    '    "reason": "why clarification is needed",',
    '    "isRequired": true',
    '  }',
    '}',
    'Return ONLY JSON.',
    'Do not generate GraphQL.',
    'Do not generate Cypher.',
    'Do not invent new intents or entity types.',
    '',
    `Company: ${userInput.companyName?.trim() || 'not specified'}`,
    `Objective: ${userInput.objective?.trim() || 'not specified'}`,
    `User input: ${userInput.text}`,
    '',
    'Artifact excerpt:',
    buildArtifactExcerptPrompt(artifactExcerpt),
  ].join('\n')
}

function buildClarificationResult(
  rawOutput: string,
  reason: string
): ClarificationCoordinatorPlanResult {
  return {
    action: ASK_CLARIFICATION,
    clarification: {
      question: 'Please restate the request with exactly one intent and one target entity type.',
      reason,
      isRequired: true,
    },
    rawOutput,
  }
}

export async function createPlan(
  userInput: CoordinatorUserInput,
  artifactExcerpt: CoordinatorArtifactExcerpt
): Promise<CoordinatorPlanResult> {
  const prompt = buildPlanPrompt(userInput, artifactExcerpt)
  const rawOutput = await callLlm(
    prompt,
    userInput.llmConfig,
    userInput.systemPrompt ??
      'You are a precise enterprise architecture planner. Return only valid JSON matching the requested schema.'
  )

  const parsed = parseJsonObject(rawOutput)
  if (!parsed) {
    return buildClarificationResult(rawOutput, 'Coordinator output was not valid JSON.')
  }

  const schemaResult = planSchema.safeParse(parsed)
  if (!schemaResult.success) {
    const issueSummary = schemaResult.error.issues
      .map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ')

    return buildClarificationResult(
      rawOutput,
      `Coordinator output did not match plan.schema.ts. ${issueSummary}`
    )
  }

  const policyDecision = enforceCoordinatorPlan({
    text: userInput.text,
    locale: userInput.locale ?? null,
    plan: schemaResult.data,
    artifacts: artifactExcerpt.artifacts,
  })

  if (policyDecision.action === ASK_CLARIFICATION) {
    return {
      action: ASK_CLARIFICATION,
      clarification: policyDecision.clarification,
      rawOutput,
    }
  }

  return {
    action: 'ALLOW',
    plan: policyDecision.plan,
    rawOutput,
  }
}
