import type {
  AllowedIntent,
  CanonicalConceptType,
  FilterSyntaxContract,
  LoadedArtifacts,
  SupportedLocale,
} from '../artifacts/types'
import type { Clarification, EntityHint, Plan } from '../state/plan'
import type { JsonValue } from '../state/plan.schema'
import { planSchema } from '../state/plan'
import { normalizeUserInput, type NormalizedUserInput } from './normalize'
import {
  getRequiredParametersForQueryId,
  selectAllowedQueryIds,
  type QueryId,
  type QuerySelection,
} from './querySelect'

export const ASK_CLARIFICATION = 'ASK_CLARIFICATION' as const

export interface CoordinatorPlan {
  readonly intent?: string | null
  readonly entityHint?: {
    readonly entityType?: string | null
    readonly name?: string | null
    readonly description?: string | null
    readonly filters?: Readonly<Record<string, unknown>> | null
  } | null
  readonly clarification?: {
    readonly question?: string | null
    readonly reason?: string | null
    readonly isRequired?: boolean | null
  } | null
  readonly queryId?: string | null
}

export interface EnforceCoordinatorPlanArgs {
  readonly text: string
  readonly locale?: SupportedLocale | null
  readonly plan: CoordinatorPlan
  readonly artifacts: LoadedArtifacts
}

export interface AllowedPolicyDecision {
  readonly action: 'ALLOW'
  readonly plan: Plan
  readonly normalized: NormalizedUserInput
  readonly querySelection: QuerySelection
}

export interface AskClarificationPolicyDecision {
  readonly action: typeof ASK_CLARIFICATION
  readonly clarification: Clarification
  readonly normalized: NormalizedUserInput
  readonly candidateIntents: readonly AllowedIntent[]
  readonly candidateEntityTypes: readonly CanonicalConceptType[]
  readonly reasons: readonly string[]
}

export type PolicyDecision = AllowedPolicyDecision | AskClarificationPolicyDecision

const INTENT_KEYWORDS: Readonly<Record<AllowedIntent, readonly string[]>> = {
  FACT_LOOKUP: [
    'list',
    'show',
    'what is',
    'what are',
    'which',
    'count',
    'how many',
    'overview',
    'detail',
    'details',
  ],
  IMPACT_ANALYSIS: [
    'impact',
    'impacts',
    'affected',
    'affects',
    'what if',
    'happens if',
    'fails',
    'changes',
    'consequence',
  ],
  DEPENDENCY_EXPLORATION: [
    'dependency',
    'dependencies',
    'depends on',
    'connected to',
    'related to',
    'upstream',
    'downstream',
    'relationship',
  ],
  STRATEGIC_ENRICHMENT: [
    'strategy',
    'strategic',
    'roadmap',
    'proposal',
    'recommendation',
    'improve',
    'enrichment',
  ],
  ENTITY_IDENTIFICATION: [
    'identify',
    'which application',
    'which system',
    'what application',
    'what system',
    'the application that',
    'the system that',
  ],
} as const

const STRONG_INTENT_PRIORITY: readonly AllowedIntent[] = [
  'ENTITY_IDENTIFICATION',
  'IMPACT_ANALYSIS',
  'DEPENDENCY_EXPLORATION',
  'STRATEGIC_ENRICHMENT',
]

const ENTITY_SUBJECT_PATTERNS: ReadonlyArray<{
  readonly entityType: CanonicalConceptType
  readonly patterns: readonly RegExp[]
}> = [
  {
    entityType: 'BusinessCapability',
    patterns: [
      /\bbusiness capabilities?\b.*\b(?:not supported by|supported by|without)\b/,
      /\bcapabilities?\b.*\b(?:not supported by|supported by|without)\b/,
    ],
  },
  {
    entityType: 'Application',
    patterns: [
      /\bapplications?\b.*\b(?:support|supports|use|uses|host|hosts)\b/,
      /\bhow many\b.*\bapplications?\b/,
    ],
  },
  {
    entityType: 'ApplicationInterface',
    patterns: [/\binterfaces?\b.*\b(?:data|applications?)\b/],
  },
  {
    entityType: 'DataObject',
    patterns: [/\bdata objects?\b.*\b(?:used by|related to)\b/],
  },
] as const

function uniqueValues<T>(values: readonly T[]): readonly T[] {
  return Array.from(new Set(values))
}

function isAllowedIntent(value: string, artifacts: LoadedArtifacts): value is AllowedIntent {
  return value in artifacts.intentSchema.intents
}

function isCanonicalConceptType(
  value: string,
  artifacts: LoadedArtifacts
): value is CanonicalConceptType {
  return value in artifacts.conceptDictionary.concepts
}

function canonicalizeForMatching(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getEntityTypeMentionPosition(
  entityType: CanonicalConceptType,
  normalized: NormalizedUserInput,
  artifacts: LoadedArtifacts
): number {
  const concept = artifacts.conceptDictionary.concepts[entityType]
  const aliases = new Set<string>([
    entityType,
    concept.graphLabel,
    ...concept.synonyms.de,
    ...concept.synonyms.en,
    ...concept.synonyms.fr,
  ])

  const normalizedText = ` ${normalized.normalizedText} `
  let earliestIndex = Number.POSITIVE_INFINITY

  for (const alias of aliases) {
    const normalizedAlias = canonicalizeForMatching(alias)
    if (!normalizedAlias) {
      continue
    }

    const index = normalizedText.indexOf(` ${normalizedAlias} `)
    if (index >= 0 && index < earliestIndex) {
      earliestIndex = index
    }
  }

  return earliestIndex
}

function buildClarification(question: string, reason: string): Clarification {
  return {
    question,
    reason,
    isRequired: true,
  }
}

function buildAskClarificationDecision(
  normalized: NormalizedUserInput,
  reasons: readonly string[],
  candidateIntents: readonly AllowedIntent[],
  candidateEntityTypes: readonly CanonicalConceptType[]
): AskClarificationPolicyDecision {
  const reason = reasons.join(' ')
  const intentText =
    candidateIntents.length > 0 ? ` Possible intents: ${candidateIntents.join(', ')}.` : ''
  const entityText =
    candidateEntityTypes.length > 0
      ? ` Possible entity types: ${candidateEntityTypes.join(', ')}.`
      : ''

  return {
    action: ASK_CLARIFICATION,
    clarification: buildClarification(
      `Please restate the request with exactly one intent and one entity type.${intentText}${entityText}`,
      reason || 'The request is ambiguous under the deterministic policy rules.'
    ),
    normalized,
    candidateIntents,
    candidateEntityTypes,
    reasons,
  }
}

function inferIntentCandidates(normalized: NormalizedUserInput): readonly AllowedIntent[] {
  const matches = STRONG_INTENT_PRIORITY.filter(intent =>
    INTENT_KEYWORDS[intent].some(keyword => normalized.canonicalText.includes(keyword))
  )

  if (matches.length > 0) {
    return matches
  }

  return INTENT_KEYWORDS.FACT_LOOKUP.some(keyword => normalized.canonicalText.includes(keyword))
    ? ['FACT_LOOKUP']
    : []
}

function resolveIntent(
  rawIntent: string | null | undefined,
  normalized: NormalizedUserInput,
  artifacts: LoadedArtifacts
): {
  readonly value?: AllowedIntent
  readonly candidates: readonly AllowedIntent[]
  readonly reason?: string
} {
  if (typeof rawIntent === 'string' && rawIntent.trim()) {
    const intent = rawIntent.trim()
    if (!isAllowedIntent(intent, artifacts)) {
      return { candidates: [], reason: `Unsupported intent "${intent}".` }
    }

    return { value: intent, candidates: [intent] }
  }

  const candidates = inferIntentCandidates(normalized)
  if (candidates.length === 1) {
    return { value: candidates[0], candidates }
  }

  return {
    candidates,
    reason:
      candidates.length === 0
        ? 'The request does not resolve to an allowed intent deterministically.'
        : 'The request matches multiple allowed intents.',
  }
}

function validateFilterOperators(filterSyntax: FilterSyntaxContract, key: string): boolean {
  return (
    filterSyntax.stringOperators.includes(key) ||
    filterSyntax.enumOperators.includes(key) ||
    filterSyntax.nullOperators.includes(key) ||
    filterSyntax.relationOperators.includes(key) ||
    filterSyntax.logicalOperators.includes(key)
  )
}

function resolveEntityTypeFromSubjectCue(
  normalized: NormalizedUserInput,
  artifacts: LoadedArtifacts
): CanonicalConceptType | null {
  for (const candidate of ENTITY_SUBJECT_PATTERNS) {
    if (candidate.patterns.some(pattern => pattern.test(normalized.normalizedText))) {
      return isCanonicalConceptType(candidate.entityType, artifacts) ? candidate.entityType : null
    }
  }

  return null
}

function validateFilterShape(
  value: unknown,
  allowedKeys: ReadonlySet<string>,
  filterSyntax: FilterSyntaxContract,
  depth = 0
): void {
  if (value === null || typeof value !== 'object') {
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      validateFilterShape(item, allowedKeys, filterSyntax, depth + 1)
    }
    return
  }

  for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
    if (depth === 0) {
      if (!allowedKeys.has(key) && !filterSyntax.logicalOperators.includes(key)) {
        throw new Error(
          `Filter key "${key}" is not declared in SCHEMA_DIGEST for this entity type.`
        )
      }
    } else if (!validateFilterOperators(filterSyntax, key)) {
      validateFilterShape(nestedValue, allowedKeys, filterSyntax, depth + 1)
      continue
    }

    if (filterSyntax.logicalOperators.includes(key)) {
      if (!Array.isArray(nestedValue)) {
        throw new Error(`Logical operator "${key}" must contain an array value.`)
      }
      validateFilterShape(nestedValue, allowedKeys, filterSyntax, depth + 1)
      continue
    }

    validateFilterShape(nestedValue, allowedKeys, filterSyntax, depth + 1)
  }
}

function validateEntityHintAgainstSchemaDigest(
  entityHint: EntityHint,
  entityType: CanonicalConceptType,
  artifacts: LoadedArtifacts
): void {
  if (!('filters' in entityHint)) {
    return
  }

  const governedRootQueries = artifacts.schemaDigest.allowedRootQueries.filter(
    query => query.entityType === entityType
  )

  if (governedRootQueries.length === 0) {
    throw new Error(`No governed SCHEMA_DIGEST root query exists for entity type "${entityType}".`)
  }

  const allowedKeys = new Set<string>()
  for (const rootQuery of governedRootQueries) {
    for (const field of rootQuery.fields) {
      allowedKeys.add(field)
    }
    for (const relation of rootQuery.relations) {
      allowedKeys.add(relation)
    }
  }

  validateFilterShape(entityHint.filters, allowedKeys, artifacts.schemaDigest.filterSyntax)
}

function resolveEntityType(
  plan: CoordinatorPlan,
  normalized: NormalizedUserInput,
  artifacts: LoadedArtifacts
): {
  readonly value?: CanonicalConceptType
  readonly candidates: readonly CanonicalConceptType[]
  readonly reason?: string
} {
  const rawEntityType = plan.entityHint?.entityType
  if (typeof rawEntityType === 'string' && rawEntityType.trim()) {
    const entityType = rawEntityType.trim()
    if (!isCanonicalConceptType(entityType, artifacts)) {
      return { candidates: [], reason: `Unsupported entity type "${entityType}".` }
    }

    return { value: entityType, candidates: [entityType] }
  }

  const subjectCueEntityType = resolveEntityTypeFromSubjectCue(normalized, artifacts)
  if (subjectCueEntityType) {
    return {
      value: subjectCueEntityType,
      candidates: normalized.candidateEntityTypes,
    }
  }

  if (normalized.preferredEntityType) {
    return {
      value: normalized.preferredEntityType,
      candidates: [normalized.preferredEntityType],
    }
  }

  if (normalized.candidateEntityTypes.length > 1) {
    const rankedCandidates = [...normalized.candidateEntityTypes].sort(
      (left, right) =>
        getEntityTypeMentionPosition(left, normalized, artifacts) -
        getEntityTypeMentionPosition(right, normalized, artifacts)
    )
    const firstCandidate = rankedCandidates[0]
    const secondCandidate = rankedCandidates[1]
    if (
      firstCandidate &&
      getEntityTypeMentionPosition(firstCandidate, normalized, artifacts) !==
        getEntityTypeMentionPosition(secondCandidate ?? firstCandidate, normalized, artifacts)
    ) {
      return {
        value: firstCandidate,
        candidates: rankedCandidates,
      }
    }
  }

  return {
    candidates: normalized.candidateEntityTypes,
    reason:
      normalized.candidateEntityTypes.length === 0
        ? 'The request does not resolve to a single entity type through the concept dictionary.'
        : 'The request matches multiple entity types in the concept dictionary.',
  }
}

function buildEntityHint(
  plan: CoordinatorPlan,
  entityType: CanonicalConceptType,
  normalized: NormalizedUserInput
): EntityHint {
  if (plan.entityHint?.filters && Object.keys(plan.entityHint.filters).length > 0) {
    return {
      entityType,
      filters: plan.entityHint.filters as Record<string, JsonValue>,
    }
  }

  if (typeof plan.entityHint?.name === 'string' && plan.entityHint.name.trim()) {
    return {
      entityType,
      name: plan.entityHint.name.trim(),
    }
  }

  if (typeof plan.entityHint?.description === 'string' && plan.entityHint.description.trim()) {
    return {
      entityType,
      description: plan.entityHint.description.trim(),
    }
  }

  return {
    entityType,
    description: normalized.rawText.trim(),
  }
}

function validateProvidedQueryId(
  queryId: string | null | undefined,
  querySelection: QuerySelection
): void {
  if (!queryId || !queryId.trim()) {
    return
  }

  if (!querySelection.queryIds.includes(queryId.trim() as QueryId)) {
    throw new Error(`QueryId "${queryId}" is not allowed for the resolved intent and entity type.`)
  }
}

function assertSchemaDigestGovernance(artifacts: LoadedArtifacts): void {
  if (!artifacts.schemaDigest.governance.readOnly) {
    throw new Error('SCHEMA_DIGEST governance must be read-only.')
  }

  if (artifacts.schemaDigest.governance.dynamicQueryGenerationAllowed) {
    throw new Error('SCHEMA_DIGEST must not allow dynamic query generation.')
  }
}

export function enforceCoordinatorPlan(args: EnforceCoordinatorPlanArgs): PolicyDecision {
  assertSchemaDigestGovernance(args.artifacts)

  const normalized = normalizeUserInput({
    text: args.text,
    locale: args.locale ?? null,
    artifacts: args.artifacts,
  })

  const reasons: string[] = []
  const resolvedIntent = resolveIntent(args.plan.intent, normalized, args.artifacts)
  if (!resolvedIntent.value) {
    if (resolvedIntent.reason) {
      reasons.push(resolvedIntent.reason)
    }
    return buildAskClarificationDecision(
      normalized,
      reasons,
      resolvedIntent.candidates,
      normalized.candidateEntityTypes
    )
  }

  const resolvedEntityType = resolveEntityType(args.plan, normalized, args.artifacts)
  if (!resolvedEntityType.value) {
    if (resolvedEntityType.reason) {
      reasons.push(resolvedEntityType.reason)
    }
    return buildAskClarificationDecision(
      normalized,
      reasons,
      [resolvedIntent.value],
      resolvedEntityType.candidates
    )
  }

  const entityHint = buildEntityHint(args.plan, resolvedEntityType.value, normalized)

  try {
    validateEntityHintAgainstSchemaDigest(entityHint, resolvedEntityType.value, args.artifacts)
  } catch (error) {
    return buildAskClarificationDecision(
      normalized,
      [error instanceof Error ? error.message : 'Entity filters are not allowed by SCHEMA_DIGEST.'],
      [resolvedIntent.value],
      [resolvedEntityType.value]
    )
  }

  const querySelection = selectAllowedQueryIds({
    intent: resolvedIntent.value,
    entityType: resolvedEntityType.value,
    text: args.text,
    normalizedText: normalized.canonicalText,
    entityHint,
    artifacts: args.artifacts,
  })

  if (querySelection.queryIds.length === 0 || !querySelection.selected) {
    return buildAskClarificationDecision(
      normalized,
      [
        querySelection.reason ??
          'No governed QueryId is available for the resolved intent and entity type.',
      ],
      [resolvedIntent.value],
      [resolvedEntityType.value]
    )
  }

  try {
    validateProvidedQueryId(args.plan.queryId, querySelection)
  } catch (error) {
    return buildAskClarificationDecision(
      normalized,
      [error instanceof Error ? error.message : 'The provided QueryId is not allowed.'],
      [resolvedIntent.value],
      [resolvedEntityType.value]
    )
  }

  const resolvedPlan = planSchema.parse({
    intent: resolvedIntent.value,
    entityHint,
    clarification: null,
  }) as Plan

  return {
    action: 'ALLOW',
    plan: resolvedPlan,
    normalized,
    querySelection,
  }
}
