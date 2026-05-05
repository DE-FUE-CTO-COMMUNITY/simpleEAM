import { renderGraphqlQuery } from '../artifacts/graphql/render'
import type { GraphqlQueryLibraryEntry, LoadedArtifacts } from '../artifacts/types'
import { graphqlRequest } from '../graph/client/graphql-client'
import type { QueryId } from '../policy/querySelect'
import { getRequiredParametersForQueryId } from '../policy/querySelect'

const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g

export interface ExecuteQueryParams {
  readonly companyId: string
  readonly accessToken?: string | null
  readonly args?: Readonly<Record<string, unknown>>
  readonly artifacts: LoadedArtifacts
}

export interface ExecutedQueryResult {
  readonly data: unknown
  readonly toolName: string
  readonly argsUsed: Record<string, unknown>
  readonly queryId: QueryId
  readonly rootQueries: readonly string[]
  readonly renderedQuery: string
}

function assertSchemaDigestGovernance(artifacts: LoadedArtifacts): void {
  if (!artifacts.schemaDigest.governance.readOnly) {
    throw new Error('SCHEMA_DIGEST must remain read-only.')
  }

  if (artifacts.schemaDigest.governance.dynamicQueryGenerationAllowed) {
    throw new Error('SCHEMA_DIGEST must not allow dynamic query generation.')
  }
}

function getQueryEntry(queryId: QueryId, artifacts: LoadedArtifacts): GraphqlQueryLibraryEntry {
  const queryEntry = artifacts.queryLibrary.queries.find(entry => entry.queryId === queryId)
  if (!queryEntry) {
    throw new Error(`QueryId "${queryId}" is missing from the GraphQL query library.`)
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

function sanitizeArgs(args: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const sanitizedArgs = { ...args }
  delete sanitizedArgs.companyId
  delete sanitizedArgs.company
  delete sanitizedArgs.companies
  return sanitizedArgs
}

function assertGraphqlIdentifier(value: string, label: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`${label} must be a valid GraphQL identifier.`)
  }

  return value
}

function resolveRootField(
  queryEntry: GraphqlQueryLibraryEntry,
  args: Readonly<Record<string, unknown>>
): string {
  const resolved = queryEntry.rootField.replace(PLACEHOLDER_PATTERN, (_, placeholder: string) => {
    const value = args[placeholder]
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(
        `QueryId "${queryEntry.queryId}" requires identifier placeholder "${placeholder}" for root field resolution.`
      )
    }

    return value.trim()
  })

  return assertGraphqlIdentifier(resolved, `${queryEntry.queryId}.rootField`)
}

function assertRootQueryDeclared(rootQuery: string, artifacts: LoadedArtifacts): void {
  const declaredRootQueries = new Set<string>([
    ...artifacts.schemaDigest.allowedRootQueries.map(entry => entry.rootQuery),
    ...artifacts.schemaDigest.countQueries.map(entry => entry.rootQuery),
  ])

  if (!declaredRootQueries.has(rootQuery)) {
    throw new Error(`Root query "${rootQuery}" is not declared by SCHEMA_DIGEST.`)
  }
}

function assertScopeCoverage(
  queryEntry: GraphqlQueryLibraryEntry,
  rootQuery: string,
  artifacts: LoadedArtifacts
): void {
  const scopeRule = artifacts.schemaDigest.mandatoryCompanyScoping.find(
    rule => rule.id === queryEntry.companyScopeRuleId
  )

  if (!scopeRule || !scopeRule.appliesToRootQueries.includes(rootQuery)) {
    throw new Error(
      `QueryId "${queryEntry.queryId}" is not covered by mandatory company scope rule "${queryEntry.companyScopeRuleId}" for root query "${rootQuery}".`
    )
  }
}

export async function executeQuery(
  queryId: QueryId,
  params: ExecuteQueryParams
): Promise<ExecutedQueryResult> {
  assertSchemaDigestGovernance(params.artifacts)

  if (!params.companyId.trim()) {
    throw new Error('executeQuery requires a non-empty companyId.')
  }

  const queryEntry = getQueryEntry(queryId, params.artifacts)
  const args = sanitizeArgs(params.args ?? {})
  const argsWithCompanyId = { ...args, companyId: params.companyId }

  assertRequiredParameters(queryId, argsWithCompanyId)

  const rootQuery = resolveRootField(queryEntry, args)
  assertRootQueryDeclared(rootQuery, params.artifacts)
  assertScopeCoverage(queryEntry, rootQuery, params.artifacts)

  const renderedQuery = renderGraphqlQuery({
    queryId,
    companyId: params.companyId,
    params: args,
  })

  const data = await graphqlRequest({
    query: renderedQuery,
    accessToken: params.accessToken ?? null,
  })

  return {
    data,
    toolName: queryId,
    argsUsed: args,
    queryId,
    rootQueries: [rootQuery],
    renderedQuery,
  }
}
