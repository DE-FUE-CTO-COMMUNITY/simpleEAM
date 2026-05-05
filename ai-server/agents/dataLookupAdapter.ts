import type { LoadedArtifacts, QueryLibraryEntry } from '../artifacts/types'
import type { QueryId } from '../policy/querySelect'
import { getRequiredParametersForQueryId } from '../policy/querySelect'
import { TOOLS, type ToolCallResult } from '../graph/query-registry'

const COUNT_ENTITY_ROOT_QUERY_BY_PARAM = {
  applications: 'applicationsConnection',
  businessCapabilities: 'businessCapabilitiesConnection',
  applicationInterfaces: 'applicationInterfacesConnection',
  dataObjects: 'dataObjectsConnection',
  infrastructures: 'infrastructuresConnection',
  businessProcesses: 'businessProcessesConnection',
  aiComponents: 'aiComponentsConnection',
  suppliers: 'suppliersConnection',
  organisations: 'organisationsConnection',
  people: 'peopleConnection',
  architectures: 'architecturesConnection',
  softwareProducts: 'softwareProductsConnection',
} as const

type CountEntityParam = keyof typeof COUNT_ENTITY_ROOT_QUERY_BY_PARAM

export interface ExecuteQueryParams {
  readonly companyId: string
  readonly accessToken?: string | null
  readonly args?: Readonly<Record<string, unknown>>
  readonly artifacts: LoadedArtifacts
}

export interface ExecutedQueryResult extends ToolCallResult {
  readonly queryId: QueryId
  readonly rootQueries: readonly string[]
}

function assertSchemaDigestGovernance(artifacts: LoadedArtifacts): void {
  if (!artifacts.schemaDigest.governance.readOnly) {
    throw new Error('SCHEMA_DIGEST must remain read-only.')
  }

  if (artifacts.schemaDigest.governance.dynamicQueryGenerationAllowed) {
    throw new Error('SCHEMA_DIGEST must not allow dynamic query generation.')
  }
}

function assertKnownQueryId(queryId: QueryId): void {
  if (!(queryId in TOOLS)) {
    throw new Error(`QueryId "${queryId}" is not a predefined GraphQL query.`)
  }
}

function getQueryEntry(queryId: QueryId, artifacts: LoadedArtifacts): QueryLibraryEntry {
  const queryEntry = artifacts.queryLibraryMetadata.queries.find(entry => entry.queryId === queryId)
  if (!queryEntry) {
    throw new Error(`QueryId "${queryId}" is missing from query library metadata.`)
  }

  return queryEntry
}

function assertRequiredParameters(queryId: QueryId, args: Readonly<Record<string, unknown>>): void {
  for (const parameterName of getRequiredParametersForQueryId(queryId)) {
    const value = args[parameterName]
    if (typeof value === 'string') {
      if (!value.trim()) {
        throw new Error(`QueryId "${queryId}" requires parameter "${parameterName}".`)
      }
      continue
    }

    if (value === undefined || value === null) {
      throw new Error(`QueryId "${queryId}" requires parameter "${parameterName}".`)
    }
  }
}

function assertScopeCoverage(queryEntry: QueryLibraryEntry, artifacts: LoadedArtifacts): void {
  const scopeRules = artifacts.schemaDigest.mandatoryCompanyScoping

  for (const rootQuery of queryEntry.rootQueries) {
    const hasCoverage = queryEntry.companyScopeRuleIds.some(ruleId => {
      const rule = scopeRules.find(candidate => candidate.id === ruleId)
      return Boolean(rule?.appliesToRootQueries.includes(rootQuery))
    })

    if (!hasCoverage) {
      throw new Error(
        `QueryId "${queryEntry.queryId}" is not covered by a mandatory SCHEMA_DIGEST company scope rule for root query "${rootQuery}".`
      )
    }
  }
}

function assertRootQueriesDeclared(
  queryEntry: QueryLibraryEntry,
  artifacts: LoadedArtifacts
): void {
  const declaredRootQueries = new Set<string>([
    ...artifacts.schemaDigest.allowedRootQueries.map(entry => entry.rootQuery),
    ...artifacts.schemaDigest.countQueries.map(entry => entry.rootQuery),
  ])

  for (const rootQuery of queryEntry.rootQueries) {
    if (!declaredRootQueries.has(rootQuery)) {
      throw new Error(
        `QueryId "${queryEntry.queryId}" references root query "${rootQuery}" not declared by SCHEMA_DIGEST.`
      )
    }
  }
}

function assertCountQueryCompatibility(
  queryEntry: QueryLibraryEntry,
  args: Readonly<Record<string, unknown>>,
  artifacts: LoadedArtifacts
): void {
  if (queryEntry.queryId !== 'countEntities') {
    return
  }

  const entityType = args.entityType
  if (typeof entityType !== 'string' || !(entityType in COUNT_ENTITY_ROOT_QUERY_BY_PARAM)) {
    throw new Error(
      `QueryId "countEntities" requires a supported entityType: ${Object.keys(COUNT_ENTITY_ROOT_QUERY_BY_PARAM).join(', ')}`
    )
  }

  const expectedRootQuery = COUNT_ENTITY_ROOT_QUERY_BY_PARAM[entityType as CountEntityParam]
  if (!queryEntry.rootQueries.includes(expectedRootQuery)) {
    throw new Error(
      `QueryId "countEntities" is not compatible with SCHEMA_DIGEST root query "${expectedRootQuery}".`
    )
  }

  const declaredCountQuery = artifacts.schemaDigest.countQueries.find(
    entry => entry.rootQuery === expectedRootQuery
  )
  if (!declaredCountQuery) {
    throw new Error(
      `SCHEMA_DIGEST does not declare count root query "${expectedRootQuery}" for countEntities.`
    )
  }
}

function sanitizeArgs(args: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const sanitizedArgs = { ...args }
  delete sanitizedArgs.companyId
  delete sanitizedArgs.company
  delete sanitizedArgs.companies
  return sanitizedArgs
}

export async function executeQuery(
  queryId: QueryId,
  params: ExecuteQueryParams
): Promise<ExecutedQueryResult> {
  assertSchemaDigestGovernance(params.artifacts)
  assertKnownQueryId(queryId)

  const queryEntry = getQueryEntry(queryId, params.artifacts)
  const args = sanitizeArgs(params.args ?? {})

  if (!params.companyId.trim()) {
    throw new Error('executeQuery requires a non-empty companyId.')
  }

  assertRequiredParameters(queryId, args)
  assertRootQueriesDeclared(queryEntry, params.artifacts)
  assertScopeCoverage(queryEntry, params.artifacts)
  assertCountQueryCompatibility(queryEntry, args, params.artifacts)

  const executionResult = await TOOLS[queryId].execute(
    args,
    params.companyId,
    params.accessToken ?? ''
  )

  return {
    ...executionResult,
    queryId,
    rootQueries: queryEntry.rootQueries,
  }
}
