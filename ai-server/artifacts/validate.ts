import { z } from 'zod'

import {
  ALLOWED_INTENTS,
  CANONICAL_CONCEPT_TYPES,
  SUPPORTED_LOCALES,
  type AllowedIntent,
  type CanonicalConceptType,
  type CompanyScopingRule,
  type ConceptDictionaryArtifact,
  type IntentSchemaArtifact,
  type LoadedArtifacts,
  type QueryLibraryArtifact,
  type QueryLibraryMetadataArtifact,
  type SchemaDigestArtifact,
} from './types'

const versionSchema = z.string().regex(/^\d+\.\d+\.\d+$/)
const nonEmptyStringSchema = z.string().trim().min(1)

const supportedLocaleSchema = z.enum(SUPPORTED_LOCALES)
const allowedIntentSchema = z.enum(ALLOWED_INTENTS)
const canonicalConceptTypeSchema = z.enum(CANONICAL_CONCEPT_TYPES)

const intentDefinitionSchema = z
  .object({
    description: nonEmptyStringSchema,
    requiresTraversal: z.boolean(),
  })
  .strict()

const intentSchemaArtifactSchema = z
  .object({
    artifact: z.literal('intent-schema'),
    version: versionSchema,
    intents: z.record(z.string(), intentDefinitionSchema),
  })
  .strict()

const conceptDefinitionSchema = z
  .object({
    description: nonEmptyStringSchema,
    graphLabel: canonicalConceptTypeSchema,
    synonyms: z.record(supportedLocaleSchema, z.array(nonEmptyStringSchema).min(1)),
  })
  .strict()

const conceptDictionaryArtifactSchema = z
  .object({
    artifact: z.literal('concept-dictionary'),
    version: versionSchema,
    concepts: z.record(z.string(), conceptDefinitionSchema),
  })
  .strict()

const queryLibraryEntrySchema = z
  .object({
    queryId: nonEmptyStringSchema,
    kind: z.enum(['list', 'count', 'overview']),
    description: nonEmptyStringSchema,
    rootQueries: z.array(nonEmptyStringSchema).min(1),
    entityTypes: z.array(canonicalConceptTypeSchema).min(1),
    allowedIntents: z.array(allowedIntentSchema).min(1),
    parameterMode: z.enum(['structured-args', 'enumerated-config']),
    companyScopeRuleIds: z.array(nonEmptyStringSchema).min(1),
    sourceModules: z.array(nonEmptyStringSchema).min(1),
  })
  .strict()

const graphqlQueryLibraryParamSchema = z
  .object({
    name: nonEmptyStringSchema,
    kind: z.enum(['string', 'id', 'enum', 'int']),
    required: z.boolean(),
    placeholder: z.string().regex(/^\{\{[a-zA-Z0-9_.-]+\}\}$/),
    description: nonEmptyStringSchema,
    enumType: nonEmptyStringSchema.optional(),
    defaultValue: z.union([z.string(), z.number()]).optional(),
  })
  .strict()

const queryLibraryArtifactEntrySchema = z
  .object({
    queryId: nonEmptyStringSchema,
    intents: z.array(allowedIntentSchema).min(1),
    rootField: nonEmptyStringSchema,
    entityTypes: z.array(canonicalConceptTypeSchema).min(1),
    companyScopeRuleId: nonEmptyStringSchema,
    templateFile: z.string().regex(/^graphql\/[A-Za-z0-9._-]+\.graphql$/),
    params: z.array(graphqlQueryLibraryParamSchema),
  })
  .strict()

const queryLibraryArtifactSchema = z
  .object({
    artifact: z.literal('query-library'),
    version: versionSchema,
    dynamicQueryGenerationAllowed: z.literal(false),
    queries: z.array(queryLibraryArtifactEntrySchema).min(1),
  })
  .strict()

const queryLibraryMetadataArtifactSchema = z
  .object({
    artifact: z.literal('query-library-metadata'),
    version: versionSchema,
    selectionMode: z.literal('query-id-only'),
    dynamicQueryGenerationAllowed: z.literal(false),
    queries: z.array(queryLibraryEntrySchema).min(1),
  })
  .strict()

const companyScopingRuleSchema = z
  .object({
    id: nonEmptyStringSchema,
    appliesToRootQueries: z.array(nonEmptyStringSchema).min(1),
    requiredVariable: z.literal('companyId'),
    whereClauseShape: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
  })
  .strict()

const schemaRootQueryDefinitionSchema = z
  .object({
    rootQuery: nonEmptyStringSchema,
    entityType: canonicalConceptTypeSchema,
    whereType: nonEmptyStringSchema,
    companyScopeRuleId: nonEmptyStringSchema,
    fields: z.array(nonEmptyStringSchema).min(1),
    relations: z.array(nonEmptyStringSchema),
  })
  .strict()

const schemaCountQueryDefinitionSchema = z
  .object({
    rootQuery: nonEmptyStringSchema,
    entityType: canonicalConceptTypeSchema,
    whereType: nonEmptyStringSchema,
    companyScopeRuleId: nonEmptyStringSchema,
    resultPath: z.literal('aggregate.count.nodes'),
  })
  .strict()

const filterSyntaxContractSchema = z
  .object({
    stringOperators: z.array(nonEmptyStringSchema).min(1),
    enumOperators: z.array(nonEmptyStringSchema).min(1),
    nullOperators: z.array(nonEmptyStringSchema).min(1),
    relationOperators: z.array(nonEmptyStringSchema).min(1),
    logicalOperators: z.array(nonEmptyStringSchema).min(1),
    paginationArguments: z.array(nonEmptyStringSchema).min(1),
    notes: z.array(nonEmptyStringSchema).min(1),
    examples: z.array(nonEmptyStringSchema).min(1),
  })
  .strict()

const schemaDigestArtifactSchema = z
  .object({
    artifact: z.literal('schema-digest'),
    version: versionSchema,
    governance: z
      .object({
        readOnly: z.literal(true),
        dynamicQueryGenerationAllowed: z.literal(false),
        permittedUses: z
          .object({
            validation: z.literal(true),
            capabilityAwareness: z.literal(true),
            policyConstraints: z.literal(true),
          })
          .strict(),
      })
      .strict(),
    mandatoryCompanyScoping: z.array(companyScopingRuleSchema).min(1),
    allowedRootQueries: z.array(schemaRootQueryDefinitionSchema).min(1),
    countQueries: z.array(schemaCountQueryDefinitionSchema).min(1),
    enumValues: z.record(nonEmptyStringSchema, z.array(nonEmptyStringSchema).min(1)),
    filterSyntax: filterSyntaxContractSchema,
  })
  .strict()

const REQUIRED_FILTER_OPERATORS = {
  stringOperators: ['contains', 'eq', 'startsWith'],
  enumOperators: ['eq', 'in'],
  nullOperators: ['isNull'],
  relationOperators: ['some', 'none'],
  logicalOperators: ['AND', 'OR'],
  paginationArguments: ['limit', 'offset', 'sort'],
} as const

function assertExactKeys(
  label: string,
  actualKeys: readonly string[],
  expectedKeys: readonly string[]
): void {
  const actual = [...actualKeys].sort()
  const expected = [...expectedKeys].sort()

  if (actual.length !== expected.length) {
    throw new Error(
      `${label} must contain exactly ${expected.length} keys. Received ${actual.length}: ${actual.join(', ')}`
    )
  }

  for (let index = 0; index < expected.length; index += 1) {
    if (actual[index] !== expected[index]) {
      throw new Error(
        `${label} keys mismatch. Expected ${expected.join(', ')} but received ${actual.join(', ')}`
      )
    }
  }
}

function assertUnique(label: string, values: readonly string[]): void {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`${label} contains duplicate value "${value}"`)
    }
    seen.add(value)
  }
}

function assertCompanyRuleCoverage(
  rules: readonly CompanyScopingRule[],
  rootQueries: readonly { rootQuery: string; companyScopeRuleId: string }[],
  label: string
): void {
  const ruleIds = new Set(rules.map(rule => rule.id))

  for (const entry of rootQueries) {
    if (!ruleIds.has(entry.companyScopeRuleId)) {
      throw new Error(
        `${label} root query "${entry.rootQuery}" references unknown scope rule "${entry.companyScopeRuleId}"`
      )
    }
  }

  for (const rule of rules) {
    assertUnique(
      `mandatoryCompanyScoping[${rule.id}].appliesToRootQueries`,
      rule.appliesToRootQueries
    )
  }
}

function assertRequiredOperators(schemaDigest: SchemaDigestArtifact): void {
  for (const [fieldName, expectedValues] of Object.entries(REQUIRED_FILTER_OPERATORS)) {
    const actualValues =
      schemaDigest.filterSyntax[fieldName as keyof typeof REQUIRED_FILTER_OPERATORS]
    for (const value of expectedValues) {
      if (!actualValues.includes(value)) {
        throw new Error(`schema-digest.filterSyntax.${fieldName} must include "${value}"`)
      }
    }
  }
}

export function validateIntentSchemaArtifact(input: unknown): IntentSchemaArtifact {
  const parsed = intentSchemaArtifactSchema.parse(input) as IntentSchemaArtifact
  assertExactKeys('intent-schema.intents', Object.keys(parsed.intents), ALLOWED_INTENTS)
  return parsed
}

export function validateConceptDictionaryArtifact(input: unknown): ConceptDictionaryArtifact {
  const parsed = conceptDictionaryArtifactSchema.parse(
    input
  ) as unknown as ConceptDictionaryArtifact

  assertExactKeys(
    'concept-dictionary.concepts',
    Object.keys(parsed.concepts),
    CANONICAL_CONCEPT_TYPES
  )

  for (const conceptKey of CANONICAL_CONCEPT_TYPES) {
    const concept = parsed.concepts[conceptKey]
    if (concept.graphLabel !== conceptKey) {
      throw new Error(
        `concept-dictionary concept "${conceptKey}" must use graphLabel "${conceptKey}"`
      )
    }

    assertExactKeys(
      `concept-dictionary.concepts.${conceptKey}.synonyms`,
      Object.keys(concept.synonyms),
      SUPPORTED_LOCALES
    )

    for (const locale of SUPPORTED_LOCALES) {
      assertUnique(
        `concept-dictionary.concepts.${conceptKey}.synonyms.${locale}`,
        concept.synonyms[locale]
      )
    }
  }

  return parsed
}

export function validateQueryLibraryMetadataArtifact(input: unknown): QueryLibraryMetadataArtifact {
  const parsed = queryLibraryMetadataArtifactSchema.parse(input) as QueryLibraryMetadataArtifact

  assertUnique(
    'query-library-metadata.queries.queryId',
    parsed.queries.map(query => query.queryId)
  )

  for (const query of parsed.queries) {
    assertUnique(`query-library-metadata.${query.queryId}.rootQueries`, query.rootQueries)
    assertUnique(`query-library-metadata.${query.queryId}.entityTypes`, query.entityTypes)
    assertUnique(`query-library-metadata.${query.queryId}.allowedIntents`, query.allowedIntents)
    assertUnique(
      `query-library-metadata.${query.queryId}.companyScopeRuleIds`,
      query.companyScopeRuleIds
    )
    assertUnique(`query-library-metadata.${query.queryId}.sourceModules`, query.sourceModules)

    if (query.kind === 'count' && query.parameterMode !== 'enumerated-config') {
      throw new Error(`query-library-metadata entry "${query.queryId}" must use enumerated-config`)
    }

    if (query.kind !== 'count' && query.parameterMode !== 'structured-args') {
      throw new Error(`query-library-metadata entry "${query.queryId}" must use structured-args`)
    }
  }

  return parsed
}

export function validateQueryLibraryArtifact(input: unknown): QueryLibraryArtifact {
  const parsed = queryLibraryArtifactSchema.parse(input) as QueryLibraryArtifact

  assertUnique(
    'query-library.queries.queryId',
    parsed.queries.map(query => query.queryId)
  )

  for (const query of parsed.queries) {
    assertUnique(`query-library.${query.queryId}.intents`, query.intents)
    assertUnique(
      `query-library.${query.queryId}.params.placeholder`,
      query.params.map(param => param.placeholder)
    )
    assertUnique(
      `query-library.${query.queryId}.params.name`,
      query.params.map(param => param.name)
    )

    for (const param of query.params) {
      if (param.kind === 'enum' && !param.enumType) {
        throw new Error(`query-library.${query.queryId}.${param.name} must declare enumType`)
      }

      if (param.kind !== 'enum' && param.enumType) {
        throw new Error(
          `query-library.${query.queryId}.${param.name} must not declare enumType for non-enum params`
        )
      }

      if (param.kind === 'int' && typeof param.defaultValue === 'number') {
        if (!Number.isInteger(param.defaultValue)) {
          throw new Error(
            `query-library.${query.queryId}.${param.name} defaultValue must be an integer`
          )
        }
      }
    }
  }

  return parsed
}

export function validateSchemaDigestArtifact(input: unknown): SchemaDigestArtifact {
  const parsed = schemaDigestArtifactSchema.parse(input) as SchemaDigestArtifact

  assertUnique(
    'schema-digest.allowedRootQueries.rootQuery',
    parsed.allowedRootQueries.map(entry => entry.rootQuery)
  )
  assertUnique(
    'schema-digest.countQueries.rootQuery',
    parsed.countQueries.map(entry => entry.rootQuery)
  )
  assertUnique(
    'schema-digest.mandatoryCompanyScoping.id',
    parsed.mandatoryCompanyScoping.map(rule => rule.id)
  )

  for (const rootQuery of parsed.allowedRootQueries) {
    assertUnique(`schema-digest.${rootQuery.rootQuery}.fields`, rootQuery.fields)
    assertUnique(`schema-digest.${rootQuery.rootQuery}.relations`, rootQuery.relations)
  }

  assertCompanyRuleCoverage(
    parsed.mandatoryCompanyScoping,
    parsed.allowedRootQueries,
    'schema-digest'
  )
  assertCompanyRuleCoverage(
    parsed.mandatoryCompanyScoping,
    parsed.countQueries,
    'schema-digest count'
  )
  for (const [enumType, values] of Object.entries(parsed.enumValues)) {
    assertUnique(`schema-digest.enumValues.${enumType}`, values)
  }
  assertRequiredOperators(parsed)

  return parsed
}

export function validateLoadedArtifacts(artifacts: LoadedArtifacts): LoadedArtifacts {
  const intentKeys = new Set<AllowedIntent>(
    Object.keys(artifacts.intentSchema.intents) as AllowedIntent[]
  )
  const conceptKeys = new Set<CanonicalConceptType>(
    Object.keys(artifacts.conceptDictionary.concepts) as CanonicalConceptType[]
  )
  const schemaRootQueries = new Set<string>([
    ...artifacts.schemaDigest.allowedRootQueries.map(entry => entry.rootQuery),
    ...artifacts.schemaDigest.countQueries.map(entry => entry.rootQuery),
  ])
  const scopeRuleIds = new Set<string>(
    artifacts.schemaDigest.mandatoryCompanyScoping.map(rule => rule.id)
  )
  const digestRootQueries = new Map<string, { companyScopeRuleId: string }>([
    ...artifacts.schemaDigest.allowedRootQueries.map(
      entry => [entry.rootQuery, { companyScopeRuleId: entry.companyScopeRuleId }] as const
    ),
    ...artifacts.schemaDigest.countQueries.map(
      entry => [entry.rootQuery, { companyScopeRuleId: entry.companyScopeRuleId }] as const
    ),
  ])

  for (const query of artifacts.queryLibrary.queries) {
    for (const intent of query.intents) {
      if (!intentKeys.has(intent)) {
        throw new Error(
          `query-library entry "${query.queryId}" references unknown intent "${intent}"`
        )
      }
    }

    for (const entityType of query.entityTypes) {
      if (!conceptKeys.has(entityType)) {
        throw new Error(
          `query-library entry "${query.queryId}" references unknown entity type "${entityType}"`
        )
      }
    }

    const digestRootQuery = digestRootQueries.get(query.rootField)
    if (!digestRootQuery) {
      throw new Error(
        `query-library entry "${query.queryId}" references root field "${query.rootField}" that is not declared in schema-digest`
      )
    }

    if (!scopeRuleIds.has(query.companyScopeRuleId)) {
      throw new Error(
        `query-library entry "${query.queryId}" references unknown company scope rule "${query.companyScopeRuleId}"`
      )
    }

    if (digestRootQuery.companyScopeRuleId !== query.companyScopeRuleId) {
      throw new Error(
        `query-library entry "${query.queryId}" must use scope rule "${digestRootQuery.companyScopeRuleId}" for root field "${query.rootField}"`
      )
    }

    for (const param of query.params) {
      if (
        param.kind === 'enum' &&
        param.enumType &&
        !(param.enumType in artifacts.schemaDigest.enumValues)
      ) {
        throw new Error(
          `query-library entry "${query.queryId}" references unknown enum type "${param.enumType}"`
        )
      }
    }
  }

  for (const query of artifacts.queryLibraryMetadata.queries) {
    for (const intent of query.allowedIntents) {
      if (!intentKeys.has(intent)) {
        throw new Error(
          `query-library entry "${query.queryId}" references unknown intent "${intent}"`
        )
      }
    }

    for (const entityType of query.entityTypes) {
      if (!conceptKeys.has(entityType)) {
        throw new Error(
          `query-library entry "${query.queryId}" references unknown entity type "${entityType}"`
        )
      }
    }

    for (const rootQuery of query.rootQueries) {
      if (!schemaRootQueries.has(rootQuery)) {
        throw new Error(
          `query-library entry "${query.queryId}" references root query "${rootQuery}" that is not declared in schema-digest`
        )
      }
    }

    for (const ruleId of query.companyScopeRuleIds) {
      if (!scopeRuleIds.has(ruleId)) {
        throw new Error(
          `query-library entry "${query.queryId}" references unknown company scope rule "${ruleId}"`
        )
      }
    }
  }

  for (const rootQuery of artifacts.schemaDigest.allowedRootQueries) {
    if (!conceptKeys.has(rootQuery.entityType)) {
      throw new Error(
        `schema-digest root query "${rootQuery.rootQuery}" references unknown entity type "${rootQuery.entityType}"`
      )
    }
  }

  for (const countQuery of artifacts.schemaDigest.countQueries) {
    if (!conceptKeys.has(countQuery.entityType)) {
      throw new Error(
        `schema-digest count query "${countQuery.rootQuery}" references unknown entity type "${countQuery.entityType}"`
      )
    }
  }

  return artifacts
}
