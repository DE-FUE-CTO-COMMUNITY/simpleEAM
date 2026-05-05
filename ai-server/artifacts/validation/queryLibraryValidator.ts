import { resolve } from 'node:path'

import { loadArtifacts, resolveArtifactsDirectory } from '../loader'
import type { GraphqlQueryLibraryEntry, GraphqlQueryLibraryParam } from '../types'
import { parseSchemaDigest } from './digestParser'
import { parseTemplateFile } from './templateParser'

export interface QueryLibraryValidationReport {
  readonly errors: readonly string[]
  readonly warnings: readonly string[]
}

const COMPANY_ID_EXCEPTIONS = new Set<string>()

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function getParamByName(
  queryDefinition: GraphqlQueryLibraryEntry,
  paramName: string
): GraphqlQueryLibraryParam | undefined {
  return queryDefinition.params.find(param => param.name === paramName)
}

function buildExpectedCompanyScopeSnippets(whereClauseShape: string): readonly string[] {
  const placeholder = '{{companyId}}'
  return [
    normalizeWhitespace(whereClauseShape.replace(/\$companyId/g, `"${placeholder}"`)),
    normalizeWhitespace(whereClauseShape.replace(/\$companyId/g, placeholder)),
  ]
}

function validateCompanyScope(
  queryDefinition: GraphqlQueryLibraryEntry,
  templateText: string,
  whereClauseShape: string,
  errors: string[]
): void {
  if (COMPANY_ID_EXCEPTIONS.has(queryDefinition.queryId)) {
    return
  }

  const companyIdParam = getParamByName(queryDefinition, 'companyId')
  if (!companyIdParam || !companyIdParam.required) {
    errors.push(`query-library.${queryDefinition.queryId}: required companyId param is missing.`)
    return
  }

  const normalizedTemplate = normalizeWhitespace(templateText)
  const expectedSnippets = buildExpectedCompanyScopeSnippets(whereClauseShape)
  if (!expectedSnippets.some(snippet => normalizedTemplate.includes(snippet))) {
    errors.push(
      `query-library.${queryDefinition.queryId}: template is missing mandatory company scoping pattern for companyId.`
    )
  }
}

function validateTemplateSelections(
  queryDefinition: GraphqlQueryLibraryEntry,
  selections: readonly string[],
  allowedFields: readonly string[],
  allowedRelations: readonly string[],
  errors: string[]
): void {
  const allowedSelections = new Set([...allowedFields, ...allowedRelations])
  for (const selection of selections) {
    if (!allowedSelections.has(selection)) {
      errors.push(
        `query-library.${queryDefinition.queryId}: selection "${selection}" is not allowed by SCHEMA_DIGEST for root field "${queryDefinition.rootField}".`
      )
    }
  }
}

function validatePlaceholders(
  queryDefinition: GraphqlQueryLibraryEntry,
  placeholders: readonly string[],
  errors: string[],
  warnings: string[]
): void {
  const definedParams = new Set(queryDefinition.params.map(param => param.name))
  for (const placeholder of placeholders) {
    if (!definedParams.has(placeholder)) {
      errors.push(
        `query-library.${queryDefinition.queryId}: template placeholder "{{${placeholder}}}" is not declared in params.`
      )
    }
  }

  for (const param of queryDefinition.params) {
    if (!placeholders.includes(param.name)) {
      warnings.push(
        `query-library.${queryDefinition.queryId}: param "${param.name}" is defined but unused in the template.`
      )
    }
  }
}

function validateEnumLiterals(
  queryDefinition: GraphqlQueryLibraryEntry,
  enumLiterals: readonly string[],
  enumIndex: Readonly<Record<string, readonly string[]>>,
  errors: string[]
): void {
  const allowedEnumLiterals = new Set(Object.values(enumIndex).flat())
  for (const literal of enumLiterals) {
    if (!allowedEnumLiterals.has(literal)) {
      errors.push(
        `query-library.${queryDefinition.queryId}: template enum literal "${literal}" is not declared in SCHEMA_DIGEST.`
      )
    }
  }
}

export function validateQueryLibrary(artifactsDir?: string): QueryLibraryValidationReport {
  const resolvedArtifactsDir = resolveArtifactsDirectory(artifactsDir)
  const artifacts = loadArtifacts({ artifactsDir: resolvedArtifactsDir })
  const digestIndex = parseSchemaDigest(artifacts.schemaDigest)
  const errors: string[] = []
  const warnings: string[] = []

  const queryIds = artifacts.queryLibrary.queries.map(query => query.queryId)
  if (new Set(queryIds).size !== queryIds.length) {
    errors.push('query-library: duplicate queryId values detected.')
  }

  for (const queryDefinition of artifacts.queryLibrary.queries) {
    const digestCollection = digestIndex.collections[queryDefinition.rootField]
    if (!digestCollection) {
      errors.push(
        `query-library.${queryDefinition.queryId}: rootField "${queryDefinition.rootField}" is not declared by SCHEMA_DIGEST.`
      )
      continue
    }

    const templatePath = resolve(resolvedArtifactsDir, queryDefinition.templateFile)
    const parsedTemplate = parseTemplateFile(templatePath)

    if (!parsedTemplate.rootField) {
      errors.push(
        `query-library.${queryDefinition.queryId}: could not determine template root field.`
      )
      continue
    }

    if (parsedTemplate.rootField !== queryDefinition.rootField) {
      errors.push(
        `query-library.${queryDefinition.queryId}: template root field "${parsedTemplate.rootField}" does not match metadata rootField "${queryDefinition.rootField}".`
      )
    }

    validateTemplateSelections(
      queryDefinition,
      parsedTemplate.selections,
      digestCollection.fields,
      digestCollection.relations,
      errors
    )

    const companyScopeRule = digestIndex.companyScopeRules[queryDefinition.companyScopeRuleId]
    if (!companyScopeRule) {
      errors.push(
        `query-library.${queryDefinition.queryId}: unknown company scope rule "${queryDefinition.companyScopeRuleId}".`
      )
    } else {
      validateCompanyScope(
        queryDefinition,
        parsedTemplate.template,
        companyScopeRule.whereClauseShape,
        errors
      )
    }

    validatePlaceholders(queryDefinition, parsedTemplate.placeholders, errors, warnings)
    validateEnumLiterals(queryDefinition, parsedTemplate.enumLiterals, digestIndex.enums, errors)
  }

  return { errors, warnings }
}

export function validateOrThrow(artifactsDir?: string): QueryLibraryValidationReport {
  const report = validateQueryLibrary(artifactsDir)
  if (report.errors.length > 0) {
    throw new Error(`Query library validation failed:\n- ${report.errors.join('\n- ')}`)
  }

  return report
}

export function formatValidationReport(report: QueryLibraryValidationReport): string {
  const lines = [
    `Errors: ${report.errors.length}`,
    ...report.errors.map(error => `- ${error}`),
    `Warnings: ${report.warnings.length}`,
    ...report.warnings.map(warning => `- ${warning}`),
  ]

  return lines.join('\n')
}
