import { resolve } from 'node:path'

import { loadArtifacts, resolveArtifactsDirectory } from '../loader'
import type { GraphqlQueryLibraryEntry, GraphqlQueryLibraryParam } from '../types'
import { buildPolicyCapabilities, getEntityCapability } from '../../policy/capabilities'
import { parseSchemaDigest } from './digestParser'
import { parseTemplateFile } from './templateParser'

export interface QueryLibraryValidationReport {
  readonly errors: readonly string[]
  readonly warnings: readonly string[]
}

const COMPANY_ID_EXCEPTIONS = new Set<string>()
const EXPECTED_QUERY_IDS = [
  'entity.searchByName',
  'entity.detailsById',
  'entity.gap.byRelation',
  'entity.relation.someByNameContains',
  'entity.countByStatus',
] as const

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

function sanitizeRootField(value: string): string {
  return value.replace(/\{\{\s*[a-zA-Z0-9_.-]+\s*\}\}/g, 'PLACEHOLDER')
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
    if (selection === 'aggregate' || selection === 'PLACEHOLDER') {
      continue
    }
    if (!allowedSelections.has(selection)) {
      errors.push(
        `query-library.${queryDefinition.queryId}: selection "${selection}" is not allowed by SCHEMA_DIGEST for root field "${queryDefinition.rootField}".`
      )
    }
  }
}

function validateEntityMappings(queryDefinition: GraphqlQueryLibraryEntry, errors: string[]): void {
  const artifacts = loadArtifacts()
  const capabilities = buildPolicyCapabilities(artifacts.schemaDigest)

  for (const entityType of queryDefinition.entityTypes) {
    const capability = getEntityCapability(capabilities, entityType)

    if (queryDefinition.rootField.includes('Connection')) {
      if (!capability.countRootField) {
        errors.push(
          `query-library.${queryDefinition.queryId}: entity type "${entityType}" does not define a governed count root.`
        )
      }
      continue
    }

    if (!capability.rootField) {
      errors.push(
        `query-library.${queryDefinition.queryId}: entity type "${entityType}" does not define a governed root field.`
      )
    }

    const relationParam = getParamByName(queryDefinition, 'relationField')
    if (!relationParam) {
      continue
    }

    const allowedRelations =
      queryDefinition.queryId === 'entity.gap.byRelation'
        ? capability.gapRelations
        : capability.relationFilterRelations

    if (allowedRelations.length === 0) {
      errors.push(
        `query-library.${queryDefinition.queryId}: entity type "${entityType}" has no governed relation allow-list.`
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
  const capabilities = buildPolicyCapabilities(artifacts.schemaDigest)
  const errors: string[] = []
  const warnings: string[] = []

  const queryIds = artifacts.queryLibrary.queries.map(query => query.queryId)
  if (new Set(queryIds).size !== queryIds.length) {
    errors.push('query-library: duplicate queryId values detected.')
  }

  const missingQueryIds = EXPECTED_QUERY_IDS.filter(queryId => !queryIds.includes(queryId))
  if (missingQueryIds.length > 0) {
    errors.push(`query-library: missing required generic queryIds: ${missingQueryIds.join(', ')}`)
  }

  for (const queryDefinition of artifacts.queryLibrary.queries) {
    const templatePath = resolve(resolvedArtifactsDir, queryDefinition.templateFile)
    const parsedTemplate = parseTemplateFile(templatePath)

    if (!parsedTemplate.rootField) {
      errors.push(
        `query-library.${queryDefinition.queryId}: could not determine template root field.`
      )
      continue
    }

    if (parsedTemplate.rootField !== sanitizeRootField(queryDefinition.rootField)) {
      errors.push(
        `query-library.${queryDefinition.queryId}: template root field "${parsedTemplate.rootField}" does not match metadata rootField "${queryDefinition.rootField}".`
      )
    }

    for (const entityType of queryDefinition.entityTypes) {
      const capability = getEntityCapability(capabilities, entityType)
      const resolvedRootField = queryDefinition.rootField.includes('Connection')
        ? capability.countRootField
        : capability.rootField

      if (!resolvedRootField) {
        errors.push(
          `query-library.${queryDefinition.queryId}: entity type "${entityType}" does not resolve a root field.`
        )
        continue
      }

      const digestCollection = digestIndex.collections[resolvedRootField]
      if (!digestCollection && !resolvedRootField.endsWith('Connection')) {
        errors.push(
          `query-library.${queryDefinition.queryId}: rootField "${resolvedRootField}" is not declared by SCHEMA_DIGEST.`
        )
        continue
      }

      if (digestCollection) {
        validateTemplateSelections(
          queryDefinition,
          parsedTemplate.selections,
          digestCollection.fields,
          digestCollection.relations,
          errors
        )
      }
    }

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
    validateEntityMappings(queryDefinition, errors)
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
