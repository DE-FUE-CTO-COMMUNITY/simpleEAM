import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { loadArtifacts, resolveArtifactsDirectory } from '../loader'
import type {
  GraphqlQueryLibraryEntry,
  GraphqlQueryLibraryParam,
  LoadedArtifacts,
  SchemaDigestArtifact,
} from '../types'

const PLACEHOLDER_PATTERN = /\{\{[a-zA-Z0-9_.-]+\}\}/g

export interface RenderGraphqlQueryArgs {
  readonly queryId: string
  readonly companyId: string
  readonly params?: Readonly<Record<string, unknown>>
  readonly artifactsDir?: string
}

function toGraphqlStringLiteral(value: string): string {
  return JSON.stringify(value)
}

function assertNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`)
  }

  return value.trim()
}

function assertGraphqlTemplateIsInlineOnly(template: string, queryId: string): void {
  if (/\$[A-Za-z_][A-Za-z0-9_]*/.test(template)) {
    throw new Error(`Query template "${queryId}" must not use GraphQL variables.`)
  }
}

function getQueryDefinition(artifacts: LoadedArtifacts, queryId: string): GraphqlQueryLibraryEntry {
  const queryDefinition = artifacts.queryLibrary.queries.find(query => query.queryId === queryId)
  if (!queryDefinition) {
    throw new Error(`Unknown queryId "${queryId}".`)
  }

  return queryDefinition
}

function getRootFieldScopeRule(
  schemaDigest: SchemaDigestArtifact,
  rootField: string
): { companyScopeRuleId: string } {
  const queryDefinition = schemaDigest.allowedRootQueries.find(
    query => query.rootQuery === rootField
  )
  if (queryDefinition) {
    return { companyScopeRuleId: queryDefinition.companyScopeRuleId }
  }

  const countDefinition = schemaDigest.countQueries.find(query => query.rootQuery === rootField)
  if (countDefinition) {
    return { companyScopeRuleId: countDefinition.companyScopeRuleId }
  }

  throw new Error(`Root field "${rootField}" is not declared in SCHEMA_DIGEST.`)
}

function renderInlineParam(
  paramDefinition: GraphqlQueryLibraryParam,
  rawValue: unknown,
  schemaDigest: SchemaDigestArtifact
): string {
  const resolvedValue = rawValue ?? paramDefinition.defaultValue

  if (resolvedValue === undefined || resolvedValue === null) {
    if (paramDefinition.required) {
      throw new Error(`Missing required parameter "${paramDefinition.name}".`)
    }

    throw new Error(`Parameter "${paramDefinition.name}" did not resolve to a value.`)
  }

  switch (paramDefinition.kind) {
    case 'string':
    case 'id':
      return toGraphqlStringLiteral(assertNonEmptyString(resolvedValue, paramDefinition.name))
    case 'int': {
      const numericValue =
        typeof resolvedValue === 'number'
          ? resolvedValue
          : Number.parseInt(String(resolvedValue), 10)

      if (!Number.isInteger(numericValue) || numericValue <= 0) {
        throw new Error(`Parameter "${paramDefinition.name}" must be a positive integer.`)
      }

      return String(numericValue)
    }
    case 'enum': {
      const enumValue = assertNonEmptyString(resolvedValue, paramDefinition.name)
      const enumType = assertNonEmptyString(
        paramDefinition.enumType,
        `${paramDefinition.name}.enumType`
      )
      const allowedEnumValues = schemaDigest.enumValues[enumType]

      if (!allowedEnumValues) {
        throw new Error(`SCHEMA_DIGEST does not declare enum type "${enumType}".`)
      }

      if (!allowedEnumValues.includes(enumValue)) {
        throw new Error(
          `Enum value "${enumValue}" is not allowed for ${enumType}. Allowed values: ${allowedEnumValues.join(', ')}`
        )
      }

      return enumValue
    }
    default: {
      const exhaustiveCheck: never = paramDefinition.kind
      throw new Error(`Unsupported parameter kind: ${exhaustiveCheck}`)
    }
  }
}

function renderTemplate(template: string, replacements: Readonly<Record<string, string>>): string {
  let renderedTemplate = template

  for (const [placeholder, replacement] of Object.entries(replacements)) {
    renderedTemplate = renderedTemplate.split(placeholder).join(replacement)
  }

  const unresolvedPlaceholders = renderedTemplate.match(PLACEHOLDER_PATTERN)
  if (unresolvedPlaceholders && unresolvedPlaceholders.length > 0) {
    throw new Error(
      `GraphQL template contains unresolved placeholders: ${Array.from(new Set(unresolvedPlaceholders)).join(', ')}`
    )
  }

  return renderedTemplate.trim()
}

function resolveTemplateFilePath(artifactsDir: string, templateFile: string): string {
  const resolvedPath = resolve(artifactsDir, templateFile)
  const rootPath = resolve(artifactsDir)

  if (!resolvedPath.startsWith(rootPath)) {
    throw new Error(`Template path "${templateFile}" resolves outside the artifacts directory.`)
  }

  return resolvedPath
}

export function escapeGraphqlString(value: string): string {
  return toGraphqlStringLiteral(value)
}

export function renderGraphqlQuery(args: RenderGraphqlQueryArgs): string {
  const companyId = assertNonEmptyString(args.companyId, 'companyId')
  const artifacts = loadArtifacts({ artifactsDir: args.artifactsDir })
  const queryDefinition = getQueryDefinition(artifacts, args.queryId)
  const rootFieldScopeRule = getRootFieldScopeRule(
    artifacts.schemaDigest,
    queryDefinition.rootField
  )

  if (rootFieldScopeRule.companyScopeRuleId !== queryDefinition.companyScopeRuleId) {
    throw new Error(
      `Query "${queryDefinition.queryId}" must use scope rule "${rootFieldScopeRule.companyScopeRuleId}" for root field "${queryDefinition.rootField}".`
    )
  }

  const artifactsDir = resolveArtifactsDirectory(args.artifactsDir)
  const template = readFileSync(
    resolveTemplateFilePath(artifactsDir, queryDefinition.templateFile),
    'utf8'
  )

  assertGraphqlTemplateIsInlineOnly(template, queryDefinition.queryId)

  const companyIdParam = queryDefinition.params.find(param => param.name === 'companyId')
  if (!companyIdParam || !companyIdParam.required) {
    throw new Error(
      `Query template "${queryDefinition.queryId}" must define required companyId param.`
    )
  }

  const replacements: Record<string, string> = {
    [companyIdParam.placeholder]: toGraphqlStringLiteral(companyId),
  }

  for (const paramDefinition of queryDefinition.params) {
    if (paramDefinition.name === 'companyId') {
      continue
    }

    replacements[paramDefinition.placeholder] = renderInlineParam(
      paramDefinition,
      args.params?.[paramDefinition.name],
      artifacts.schemaDigest
    )
  }

  const renderedQuery = renderTemplate(template, replacements)
  assertGraphqlTemplateIsInlineOnly(renderedQuery, queryDefinition.queryId)

  return renderedQuery
}
