import type {
  AllowedIntent,
  CanonicalConceptType,
  LoadedArtifacts,
  QueryLibraryEntry,
} from '../artifacts/types'

export const QUERY_PARAMETER_RULES = {
  listApplications: [] as const,
  listBusinessCapabilities: [] as const,
  listApplicationInterfaces: [] as const,
  listDataObjects: [] as const,
  listInfrastructures: [] as const,
  listBusinessProcesses: [] as const,
  listAIComponents: [] as const,
  listSuppliers: [] as const,
  listOrganisations: [] as const,
  listPeople: [] as const,
  countEntities: ['entityType'] as const,
  getCompanyOverview: [] as const,
} as const

export type QueryId = keyof typeof QUERY_PARAMETER_RULES

export interface QueryParameterPolicy {
  readonly queryId: QueryId
  readonly requiredParameters: readonly string[]
}

export interface QuerySelection {
  readonly intent: AllowedIntent
  readonly entityType: CanonicalConceptType
  readonly queryIds: readonly QueryId[]
  readonly parameterPolicies: readonly QueryParameterPolicy[]
}

export interface SelectAllowedQueryIdsArgs {
  readonly intent: AllowedIntent
  readonly entityType: CanonicalConceptType
  readonly artifacts: Pick<LoadedArtifacts, 'queryLibraryMetadata' | 'schemaDigest'>
}

function isQueryId(value: string): value is QueryId {
  return value in QUERY_PARAMETER_RULES
}

function isGovernedQuery(
  entry: QueryLibraryEntry,
  artifacts: Pick<LoadedArtifacts, 'schemaDigest'>
): boolean {
  const declaredRootQueries = new Set<string>([
    ...artifacts.schemaDigest.allowedRootQueries.map(query => query.rootQuery),
    ...artifacts.schemaDigest.countQueries.map(query => query.rootQuery),
  ])
  const declaredScopeRuleIds = new Set<string>(
    artifacts.schemaDigest.mandatoryCompanyScoping.map(rule => rule.id)
  )

  return (
    entry.rootQueries.every(rootQuery => declaredRootQueries.has(rootQuery)) &&
    entry.companyScopeRuleIds.every(ruleId => declaredScopeRuleIds.has(ruleId))
  )
}

function compareQueryIds(left: QueryLibraryEntry, right: QueryLibraryEntry): number {
  const priority = { overview: 0, list: 1, count: 2 } as const
  return priority[left.kind] - priority[right.kind] || left.queryId.localeCompare(right.queryId)
}

export function getRequiredParametersForQueryId(queryId: QueryId): readonly string[] {
  return QUERY_PARAMETER_RULES[queryId]
}

export function selectAllowedQueryIds(args: SelectAllowedQueryIdsArgs): QuerySelection {
  const matchingEntries = args.artifacts.queryLibraryMetadata.queries
    .filter(entry => isQueryId(entry.queryId))
    .filter(entry => entry.allowedIntents.includes(args.intent))
    .filter(entry => entry.entityTypes.includes(args.entityType))
    .filter(entry => isGovernedQuery(entry, args.artifacts))
    .sort(compareQueryIds)

  const queryIds = matchingEntries.map(entry => entry.queryId as QueryId)

  return {
    intent: args.intent,
    entityType: args.entityType,
    queryIds,
    parameterPolicies: queryIds.map(queryId => ({
      queryId,
      requiredParameters: getRequiredParametersForQueryId(queryId),
    })),
  }
}
