import type {
  AllowedIntent,
  CanonicalConceptType,
  GraphqlQueryLibraryEntry,
  LoadedArtifacts,
  QueryForm,
  QueryLibraryEntry,
} from '../artifacts/types'
import type { EntityHint } from '../state/plan'
import {
  START_POLICY_MATRIX,
  START_POLICY_MATRIX_ENTITY_TYPES,
  type StartPolicyMatrixEntityType,
} from './policy-matrix'

export const QUERY_PARAMETER_RULES = {
  'entity.searchByName': ['entityRoot', 'nameContains', 'companyId'] as const,
  'entity.detailsById': ['entityRoot', 'entityId', 'companyId'] as const,
  'entity.gap.byRelation': ['entityRoot', 'relationField', 'companyId'] as const,
  'entity.relation.someByNameContains': [
    'entityRoot',
    'entityWhereClause',
    'detailSelectionSet',
    'companyId',
  ] as const,
  'entity.countByStatus': ['entityRoot', 'statusEnum', 'statusEnumType', 'companyId'] as const,
} as const

const QUERY_FORM_TO_QUERY_ID = {
  ENTITY_SEARCH: 'entity.searchByName',
  ENTITY_DETAILS: 'entity.detailsById',
  ENTITY_RELATION_FILTER: 'entity.relation.someByNameContains',
  ENTITY_GAP_ANALYSIS: 'entity.gap.byRelation',
  COUNT_ENTITIES: 'entity.countByStatus',
} as const satisfies Record<QueryForm, QueryId>

const INTENT_TO_QUERY_FORMS: Readonly<Record<AllowedIntent, readonly QueryForm[]>> = {
  DEPENDENCY_EXPLORATION: ['ENTITY_GAP_ANALYSIS', 'ENTITY_RELATION_FILTER', 'ENTITY_DETAILS'],
  ENTITY_IDENTIFICATION: ['ENTITY_RELATION_FILTER', 'ENTITY_DETAILS', 'ENTITY_SEARCH'],
  FACT_LOOKUP: [
    'COUNT_ENTITIES',
    'ENTITY_GAP_ANALYSIS',
    'ENTITY_RELATION_FILTER',
    'ENTITY_DETAILS',
    'ENTITY_SEARCH',
  ],
  IMPACT_ANALYSIS: ['ENTITY_GAP_ANALYSIS', 'ENTITY_RELATION_FILTER', 'COUNT_ENTITIES'],
  STRATEGIC_ENRICHMENT: [],
}

const COUNT_STATUS_ENUM_TYPES: Readonly<Partial<Record<StartPolicyMatrixEntityType, string>>> = {
  Application: 'ApplicationStatus',
  ApplicationInterface: 'InterfaceStatus',
  BusinessCapability: 'CapabilityStatus',
  Infrastructure: 'InfrastructureStatus',
}

const RELATION_PATTERNS: Readonly<Partial<Record<string, readonly RegExp[]>>> = {
  dataObjects: [
    /\b(?:data|data objects?|daten(?:objekte?)?|donnees?|données?)\b/i,
    /\b(?:transfer(?:s|red)?|flow(?:s)?|carried|ubertragen|uebertragen|transportent)\b.*\b(?:data|daten|donnees?|données?)\b/i,
  ],
  hostsApplications: [/\bhost(?:s|ed|ing)?\b.*\bapplications?\b/i],
  providedBy: [/\bprovided by\b/i],
  softwareProduct: [/\bsoftware products?\b/i],
  sourceApplications: [/\bsource applications?\b/i],
  sourceOfInterfaces: [/\bsource of interfaces?\b/i, /\binterfaces?\b/i],
  supportedByApplications: [
    /\b(?:supported by|not supported by|without)\b.*\bapplications?\b/i,
    /\b(?:capabilities?|fahigkeiten|faehigkeiten)\b.*\b(?:durch|von)\b.*\b(?:unterstutzt|unterstützt)\b/i,
    /\b(?:supported by|unterstutzt durch|unterstützt durch)\b/i,
  ],
  supportedByBusinessProcesses: [
    /\b(?:supported by|not supported by|without)\b.*\b(?:business )?process(?:es)?\b/i,
  ],
  supportsBusinessProcesses: [/\bsupport(?:s|ed|ing)?\b.*\b(?:business )?process(?:es)?\b/i],
  supportsCapabilities: [/\bsupport(?:s|ed|ing)?\b.*\bcapabilit(?:y|ies)\b/i],
  targetApplications: [/\btarget applications?\b/i],
  targetOfInterfaces: [/\btarget of interfaces?\b/i],
  transferredInInterfaces: [/\b(?:transferred|flow(?:s)?|carried)\b.*\binterfaces?\b/i],
  usedByApplications: [/\bused by\b.*\bapplications?\b/i],
  usedByInfrastructure: [/\bused by\b.*\binfrastructure\b/i],
  usesDataObjects: [/\buse(?:s|d|ing)?\b.*\bdata objects?\b/i],
  usesHardwareProducts: [/\buse(?:s|d|ing)?\b.*\bhardware products?\b/i],
  usesSoftwareProducts: [/\buse(?:s|d|ing)?\b.*\bsoftware products?\b/i],
  versions: [/\bversions?\b/i],
}

const STATUS_KEYWORDS: ReadonlyArray<{ enumValue: string; keywords: readonly string[] }> = [
  { enumValue: 'ACTIVE', keywords: ['active', 'aktiv'] },
  { enumValue: 'IN_DEVELOPMENT', keywords: ['in development', 'under development', 'entwicklung'] },
  { enumValue: 'PLANNED', keywords: ['planned', 'geplant'] },
  { enumValue: 'RETIRED', keywords: ['retired', 'ausgemustert'] },
  { enumValue: 'DEPRECATED', keywords: ['deprecated'] },
  { enumValue: 'OUT_OF_SERVICE', keywords: ['out of service'] },
] as const

const DATA_CLASSIFICATION_KEYWORDS: ReadonlyArray<{
  enumValue: string
  keywords: readonly string[]
}> = [
  {
    enumValue: 'STRICTLY_CONFIDENTIAL',
    keywords: ['strictly confidential', 'streng vertraulich', 'hautement confidentiel'],
  },
  {
    enumValue: 'CONFIDENTIAL',
    keywords: ['confidential', 'vertraulich', 'confidentiel'],
  },
  {
    enumValue: 'INTERNAL',
    keywords: ['internal', 'intern', 'interne'],
  },
  {
    enumValue: 'PUBLIC',
    keywords: ['public', 'oeffentlich', 'offentlich', 'publique'],
  },
] as const

const CLOUD_ENVIRONMENT_KEYWORDS: ReadonlyArray<{
  value: string
  keywords: readonly string[]
}> = [
  { value: 'AWS', keywords: ['aws', 'amazon web services'] },
  { value: 'AZURE', keywords: ['azure', 'microsoft azure'] },
  { value: 'GCP', keywords: ['gcp', 'google cloud', 'google cloud platform'] },
  { value: 'CLOUD', keywords: ['cloud', 'cloud-based'] },
] as const

export type QueryId = keyof typeof QUERY_PARAMETER_RULES

export interface QueryParameterPolicy {
  readonly queryId: QueryId
  readonly requiredParameters: readonly string[]
}

export interface SelectedGovernedQuery {
  readonly queryId: QueryId
  readonly queryForm: QueryForm
  readonly args: Readonly<Record<string, unknown>>
}

export interface QuerySelection {
  readonly intent: AllowedIntent
  readonly entityType: CanonicalConceptType
  readonly queryForm: QueryForm | null
  readonly queryIds: readonly QueryId[]
  readonly parameterPolicies: readonly QueryParameterPolicy[]
  readonly selected: SelectedGovernedQuery | null
  readonly reason?: string
}

export interface SelectAllowedQueryIdsArgs {
  readonly intent: AllowedIntent
  readonly entityType: CanonicalConceptType
  readonly text: string
  readonly normalizedText?: string
  readonly entityHint?: EntityHint | null
  readonly artifacts: Pick<
    LoadedArtifacts,
    'queryLibrary' | 'queryLibraryMetadata' | 'schemaDigest'
  >
}

interface SelectedRootField {
  readonly entityRoot: string
  readonly rootQuery: string
}

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getAllowedQueryForms(intent: AllowedIntent): readonly QueryForm[] {
  return INTENT_TO_QUERY_FORMS[intent]
}

function isMatrixEntityType(
  entityType: CanonicalConceptType
): entityType is StartPolicyMatrixEntityType {
  return (START_POLICY_MATRIX_ENTITY_TYPES as readonly string[]).includes(entityType)
}

function getAllowedRelations(
  queryForm: QueryForm,
  entityType: CanonicalConceptType
): readonly string[] | null {
  if (!isMatrixEntityType(entityType)) {
    return null
  }

  return START_POLICY_MATRIX[queryForm][entityType]
}

function formatAllowedRelations(allowedRelations: readonly string[]): string {
  return allowedRelations.length > 0 ? allowedRelations.join(', ') : 'none'
}

function extractFilterRecord(entityHint: EntityHint | null | undefined): Record<string, unknown> {
  if (entityHint && 'filters' in entityHint && entityHint.filters) {
    return entityHint.filters as Record<string, unknown>
  }

  return {}
}

function extractEntityId(entityHint: EntityHint | null | undefined): string | null {
  const filters = extractFilterRecord(entityHint)
  const rawIdFilter = filters.id

  if (typeof rawIdFilter === 'string' && rawIdFilter.trim()) {
    return rawIdFilter.trim()
  }

  if (rawIdFilter && typeof rawIdFilter === 'object' && !Array.isArray(rawIdFilter)) {
    const eqValue = (rawIdFilter as Record<string, unknown>).eq
    if (typeof eqValue === 'string' && eqValue.trim()) {
      return eqValue.trim()
    }
  }

  return null
}

function extractEntityName(entityHint: EntityHint | null | undefined): string | null {
  if (
    entityHint &&
    'name' in entityHint &&
    typeof entityHint.name === 'string' &&
    entityHint.name.trim()
  ) {
    return entityHint.name.trim()
  }

  return null
}

function extractQuotedTerm(text: string): string | null {
  const match = text.match(/["“”']([^"“”']+)["“”']/)
  return match?.[1]?.trim() || null
}

function hasCountKeywords(text: string): boolean {
  return /\b(how many|count|number of)\b/i.test(text)
}

function hasGapKeywords(text: string): boolean {
  return /\b(no|without|missing|gap|not)\b/i.test(text)
}

function hasDetailKeywords(text: string): boolean {
  return /\b(detail|details|describe|information about|tell me about)\b/i.test(text)
}

function humanizeRelationName(relationName: string): string {
  return relationName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
}

function getRelationPatterns(relationName: string): readonly RegExp[] {
  return (
    RELATION_PATTERNS[relationName] ?? [
      new RegExp(`\\b${humanizeRelationName(relationName)}\\b`, 'i'),
    ]
  )
}

function detectRelationField(
  entityType: CanonicalConceptType,
  normalizedText: string,
  artifacts: Pick<LoadedArtifacts, 'schemaDigest'>
): string | null {
  const rootDefinition = artifacts.schemaDigest.allowedRootQueries.find(
    query => query.entityType === entityType
  )

  if (!rootDefinition) {
    return null
  }

  for (const relationName of rootDefinition.relations) {
    const patterns = getRelationPatterns(relationName)
    if (patterns.some(pattern => pattern.test(normalizedText))) {
      return relationName
    }
  }

  return null
}

function extractRelatedName(
  text: string,
  entityHint: EntityHint | null | undefined
): string | null {
  const explicitName = extractEntityName(entityHint)
  if (explicitName) {
    return explicitName
  }

  const quotedTerm = extractQuotedTerm(text)
  if (quotedTerm) {
    return quotedTerm
  }

  const relationMatch = text.match(
    /\b(?:support|supports|supported by|use|uses|using|host|hosts|hosted by|provided by)\s+(.+?)\s+(?:capabilities?|applications?|process(?:es)?|data objects?|software products?|hardware products?|interfaces?|infrastructure)\b/i
  )
  if (relationMatch?.[1]?.trim()) {
    return relationMatch[1].trim()
  }

  const passiveGermanMatch = text.match(/\bdurch\s+(.+?)\s+(?:unterstutzt|unterstützt)\b/i)
  if (passiveGermanMatch?.[1]?.trim()) {
    return passiveGermanMatch[1].trim()
  }

  const passiveEnglishMatch = text.match(
    /\b(?:supported by|used by|hosted by|provided by)\s+(.+?)(?:[?.!,]|$)/i
  )
  return passiveEnglishMatch?.[1]?.trim() || null
}

function toGraphqlStringLiteral(value: string): string {
  return JSON.stringify(value)
}

function resolveStatusEnum(normalizedText: string): string | null {
  for (const candidate of STATUS_KEYWORDS) {
    if (candidate.keywords.some(keyword => normalizedText.includes(normalizeText(keyword)))) {
      return candidate.enumValue
    }
  }

  return null
}

function resolveDataClassification(
  normalizedText: string,
  artifacts: Pick<LoadedArtifacts, 'schemaDigest'>
): string | null {
  const allowedValues = artifacts.schemaDigest.enumValues.DataClassification
  if (!allowedValues) {
    return null
  }

  for (const candidate of DATA_CLASSIFICATION_KEYWORDS) {
    if (
      allowedValues.includes(candidate.enumValue) &&
      candidate.keywords.some(keyword => normalizedText.includes(normalizeText(keyword)))
    ) {
      return candidate.enumValue
    }
  }

  return null
}

function resolveHostingEnvironmentContains(normalizedText: string): string | null {
  for (const candidate of CLOUD_ENVIRONMENT_KEYWORDS) {
    if (candidate.keywords.some(keyword => normalizedText.includes(normalizeText(keyword)))) {
      return candidate.value
    }
  }

  return null
}

function resolveRelationFilterClause(
  entityType: CanonicalConceptType,
  relationField: string,
  args: SelectAllowedQueryIdsArgs,
  normalizedText: string
): { value?: string; reason?: string } {
  if (
    entityType === 'Application' &&
    (relationField === 'sourceOfInterfaces' || relationField === 'targetOfInterfaces') &&
    hasInterfaceMention(normalizedText)
  ) {
    const dataClassification = resolveDataClassification(normalizedText, args.artifacts)
    if (dataClassification) {
      return { value: `classification: { eq: ${dataClassification} }` }
    }
  }

  if (entityType === 'ApplicationInterface' && relationField === 'dataObjects') {
    const dataClassification = resolveDataClassification(normalizedText, args.artifacts)
    if (dataClassification) {
      return { value: `classification: { eq: ${dataClassification} }` }
    }
  }

  const relatedNameContains = extractRelatedName(args.text, args.entityHint)
  if (!relatedNameContains) {
    return {
      reason: `ENTITY_RELATION_FILTER for ${entityType} requires a deterministic related-name fragment or governed enum filter.`,
    }
  }

  return {
    value: `name: { contains: ${toGraphqlStringLiteral(relatedNameContains)} }`,
  }
}

function hasInterfaceMention(normalizedText: string): boolean {
  return /\b(?:interfaces?|schnittstellen?)\b/i.test(normalizedText)
}

function buildDetailSelectionSet(relationField: string, relationDetailSelection: string): string {
  return `${relationField} {\n      ${relationDetailSelection}\n    }`
}

function buildApplicationInterfaceWhereClause(relatedFilterClause: string): string {
  return [
    'OR: [',
    `        { sourceOfInterfaces: { some: { dataObjects: { some: { ${relatedFilterClause} } } } } }`,
    `        { targetOfInterfaces: { some: { dataObjects: { some: { ${relatedFilterClause} } } } } }`,
    '      ]',
  ].join('\n')
}

function buildApplicationInterfaceDetailSelectionSet(): string {
  const interfaceSelection = [
    'id',
    'name',
    'dataObjects {',
    '          id',
    '          name',
    '          classification',
    '        }',
  ].join('\n        ')

  return [
    buildDetailSelectionSet('sourceOfInterfaces', interfaceSelection),
    buildDetailSelectionSet('targetOfInterfaces', interfaceSelection),
  ].join('\n    ')
}

function buildApplicationHostingEnvironmentDetailSelectionSet(relationField: string): string {
  return buildDetailSelectionSet(
    relationField,
    ['id', 'name', 'hostingEnvironment'].join('\n        ')
  )
}

function resolveRelationDetailSelection(
  entityType: CanonicalConceptType,
  relationField: string
): string {
  if (entityType === 'ApplicationInterface' && relationField === 'dataObjects') {
    return ['id', 'name', 'classification'].join('\n        ')
  }

  return ['id', 'name'].join('\n        ')
}

function resolveSearchTerm(text: string, entityHint: EntityHint | null | undefined): string | null {
  const explicitName = extractEntityName(entityHint)
  if (explicitName) {
    return explicitName
  }

  const quotedTerm = extractQuotedTerm(text)
  if (quotedTerm) {
    return quotedTerm
  }

  const forMatch = text.match(/\b(?:for|named)\s+([^?.!,]+)$/i)
  return forMatch?.[1]?.trim() || null
}

function getRootSelection(
  queryForm: QueryForm,
  entityType: CanonicalConceptType,
  artifacts: Pick<LoadedArtifacts, 'schemaDigest'>
): { value?: SelectedRootField; reason?: string } {
  if (queryForm === 'COUNT_ENTITIES') {
    const countDefinition = artifacts.schemaDigest.countQueries.find(
      query => query.entityType === entityType
    )

    if (!countDefinition) {
      return {
        reason: `COUNT_ENTITIES is not available for entity type "${entityType}" because SCHEMA_DIGEST has no governed count root.`,
      }
    }

    if (!countDefinition.rootQuery.endsWith('Connection')) {
      return {
        reason: `COUNT_ENTITIES for ${entityType} requires a Connection root query, but SCHEMA_DIGEST declares "${countDefinition.rootQuery}".`,
      }
    }

    return {
      value: {
        entityRoot: countDefinition.rootQuery.slice(0, -'Connection'.length),
        rootQuery: countDefinition.rootQuery,
      },
    }
  }

  const rootDefinition = artifacts.schemaDigest.allowedRootQueries.find(
    query => query.entityType === entityType
  )

  if (!rootDefinition) {
    return {
      reason: `SCHEMA_DIGEST has no governed root query for entity type "${entityType}".`,
    }
  }

  return {
    value: {
      entityRoot: rootDefinition.rootQuery,
      rootQuery: rootDefinition.rootQuery,
    },
  }
}

function getGraphqlQueryEntry(
  queryId: QueryId,
  artifacts: Pick<LoadedArtifacts, 'queryLibrary'>
): GraphqlQueryLibraryEntry | null {
  return artifacts.queryLibrary.queries.find(entry => entry.queryId === queryId) ?? null
}

function getMetadataEntry(
  queryId: QueryId,
  artifacts: Pick<LoadedArtifacts, 'queryLibraryMetadata'>
): QueryLibraryEntry | null {
  return artifacts.queryLibraryMetadata.queries.find(entry => entry.queryId === queryId) ?? null
}

function validateSelectedQuery(
  queryId: QueryId,
  queryForm: QueryForm,
  entityType: CanonicalConceptType,
  rootQuery: string,
  relationField: string | null,
  artifacts: Pick<LoadedArtifacts, 'queryLibrary' | 'queryLibraryMetadata' | 'schemaDigest'>
): { graphqlEntry?: GraphqlQueryLibraryEntry; reason?: string } {
  const metadataEntry = getMetadataEntry(queryId, artifacts)
  if (!metadataEntry) {
    return { reason: `QueryId "${queryId}" is missing from query-library-metadata.` }
  }

  if (!metadataEntry.allowedIntents.includes(queryForm)) {
    return { reason: `QueryId "${queryId}" is not allowed for generic intent ${queryForm}.` }
  }

  if (!metadataEntry.entityTypes.includes(entityType)) {
    return { reason: `QueryId "${queryId}" is not declared for entity type ${entityType}.` }
  }

  if (!metadataEntry.rootQueries.includes(rootQuery)) {
    return { reason: `QueryId "${queryId}" does not allow root query "${rootQuery}".` }
  }

  const graphqlEntry = getGraphqlQueryEntry(queryId, artifacts)
  if (!graphqlEntry) {
    return { reason: `QueryId "${queryId}" is missing from query-library.json.` }
  }

  if (!graphqlEntry.intents.includes(queryForm)) {
    return { reason: `query-library.json does not declare QueryId "${queryId}" for ${queryForm}.` }
  }

  if (!graphqlEntry.entityTypes.includes(entityType)) {
    return {
      reason: `query-library.json does not declare QueryId "${queryId}" for entity type ${entityType}.`,
    }
  }

  if (relationField) {
    const rootDefinition = artifacts.schemaDigest.allowedRootQueries.find(
      query => query.entityType === entityType && query.rootQuery === rootQuery
    )

    if (!rootDefinition) {
      return {
        reason: `SCHEMA_DIGEST does not declare root query "${rootQuery}" for entity type ${entityType}.`,
      }
    }

    if (!rootDefinition.relations.includes(relationField)) {
      return {
        reason: `Relation "${relationField}" is not declared by SCHEMA_DIGEST for root query "${rootQuery}".`,
      }
    }
  }

  return { graphqlEntry }
}

function resolveStatusEnumType(
  entityType: CanonicalConceptType,
  artifacts: Pick<LoadedArtifacts, 'schemaDigest'>
): { value?: string; reason?: string } {
  if (!isMatrixEntityType(entityType)) {
    return {
      reason: `COUNT_ENTITIES is not governed for entity type "${entityType}" by the start policy matrix.`,
    }
  }

  const enumType = COUNT_STATUS_ENUM_TYPES[entityType]
  if (!enumType) {
    return {
      reason: `COUNT_ENTITIES for ${entityType} requires a configured status enum type.`,
    }
  }

  if (!(enumType in artifacts.schemaDigest.enumValues)) {
    return {
      reason: `SCHEMA_DIGEST does not declare enum type "${enumType}" for ${entityType}.`,
    }
  }

  return { value: enumType }
}

function filterArgsToSchema(
  graphqlEntry: GraphqlQueryLibraryEntry,
  args: Readonly<Record<string, unknown>>
): Readonly<Record<string, unknown>> {
  const declaredParams = new Set(graphqlEntry.params.map(param => param.name))
  return Object.fromEntries(
    Object.entries(args).filter(
      ([key, value]) => declaredParams.has(key) && value !== undefined && value !== null
    )
  )
}

function resolveQueryForm(
  args: SelectAllowedQueryIdsArgs,
  normalizedText: string,
  detectedRelationField: string | null
): { queryForm: QueryForm | null; reason?: string } {
  const allowedQueryForms = getAllowedQueryForms(args.intent)
  if (allowedQueryForms.length === 0) {
    return {
      queryForm: null,
      reason: `Intent "${args.intent}" does not map to a governed generic query form.`,
    }
  }

  const entityId = extractEntityId(args.entityHint)
  const searchTerm = resolveSearchTerm(args.text, args.entityHint)

  if (allowedQueryForms.includes('COUNT_ENTITIES') && hasCountKeywords(normalizedText)) {
    return { queryForm: 'COUNT_ENTITIES' }
  }

  if (
    allowedQueryForms.includes('ENTITY_GAP_ANALYSIS') &&
    detectedRelationField &&
    hasGapKeywords(normalizedText)
  ) {
    return { queryForm: 'ENTITY_GAP_ANALYSIS' }
  }

  if (allowedQueryForms.includes('ENTITY_RELATION_FILTER') && detectedRelationField) {
    return { queryForm: 'ENTITY_RELATION_FILTER' }
  }

  if (allowedQueryForms.includes('ENTITY_DETAILS') && entityId) {
    return { queryForm: 'ENTITY_DETAILS' }
  }

  if (allowedQueryForms.includes('ENTITY_DETAILS') && hasDetailKeywords(normalizedText)) {
    return {
      queryForm: null,
      reason: 'Detail lookups require a deterministic entity id before execution can continue.',
    }
  }

  if (allowedQueryForms.includes('ENTITY_SEARCH') && searchTerm) {
    return { queryForm: 'ENTITY_SEARCH' }
  }

  if (detectedRelationField) {
    return {
      queryForm: null,
      reason: `The request references relation "${detectedRelationField}", but no allowed relation-based generic intent could be resolved for planner intent "${args.intent}".`,
    }
  }

  return {
    queryForm: null,
    reason: `No governed generic intent could be resolved for planner intent "${args.intent}" and entity type "${args.entityType}" without using defaults.`,
  }
}

function buildSelectedArgs(
  queryForm: QueryForm,
  args: SelectAllowedQueryIdsArgs,
  normalizedText: string,
  detectedRelationField: string | null,
  graphqlEntry: GraphqlQueryLibraryEntry
): { args?: Readonly<Record<string, unknown>>; reason?: string } {
  const allowedRelations = getAllowedRelations(queryForm, args.entityType)
  if (!allowedRelations) {
    return {
      reason: `Entity type "${args.entityType}" is not governed by the start policy matrix for ${queryForm}.`,
    }
  }

  const rootSelection = getRootSelection(queryForm, args.entityType, args.artifacts)
  if (!rootSelection.value) {
    return { reason: rootSelection.reason }
  }

  if ((queryForm === 'ENTITY_SEARCH' || queryForm === 'COUNT_ENTITIES') && detectedRelationField) {
    return {
      reason: `${queryForm} does not allow relation usage for ${args.entityType}. Allowed relations: ${formatAllowedRelations(allowedRelations)}.`,
    }
  }

  if (queryForm === 'ENTITY_RELATION_FILTER' || queryForm === 'ENTITY_GAP_ANALYSIS') {
    if (!detectedRelationField) {
      return {
        reason: `${queryForm} for ${args.entityType} requires one allowed relation. Allowed relations: ${formatAllowedRelations(allowedRelations)}.`,
      }
    }

    if (!allowedRelations.includes(detectedRelationField)) {
      return {
        reason: `Relation "${detectedRelationField}" is not allowed for ${queryForm} on ${args.entityType}. Allowed relations: ${formatAllowedRelations(allowedRelations)}.`,
      }
    }
  }

  const commonArgs = {
    entityRoot: rootSelection.value.entityRoot,
  } satisfies Record<string, unknown>

  switch (queryForm) {
    case 'ENTITY_SEARCH': {
      const nameContains = resolveSearchTerm(args.text, args.entityHint)
      if (!nameContains) {
        return {
          reason: `ENTITY_SEARCH for ${args.entityType} requires a deterministic name fragment.`,
        }
      }

      return {
        args: filterArgsToSchema(graphqlEntry, {
          ...commonArgs,
          limit: 50,
          nameContains,
        }),
      }
    }
    case 'ENTITY_DETAILS': {
      const entityId = extractEntityId(args.entityHint)
      if (!entityId) {
        return { reason: `ENTITY_DETAILS for ${args.entityType} requires an entity id.` }
      }

      return {
        args: filterArgsToSchema(graphqlEntry, {
          ...commonArgs,
          entityId,
        }),
      }
    }
    case 'ENTITY_GAP_ANALYSIS': {
      return {
        args: filterArgsToSchema(graphqlEntry, {
          ...commonArgs,
          limit: 50,
          relationField: detectedRelationField,
        }),
      }
    }
    case 'ENTITY_RELATION_FILTER': {
      if (!detectedRelationField) {
        return {
          reason: `ENTITY_RELATION_FILTER for ${args.entityType} requires one allowed relation.`,
        }
      }

      const relationFilterClause = resolveRelationFilterClause(
        args.entityType,
        detectedRelationField,
        args,
        normalizedText
      )
      if (!relationFilterClause.value) {
        return { reason: relationFilterClause.reason }
      }

      const isApplicationInterfaceRelation =
        args.entityType === 'Application' &&
        hasInterfaceMention(normalizedText) &&
        (detectedRelationField === 'sourceOfInterfaces' ||
          detectedRelationField === 'targetOfInterfaces')

      const hostingEnvironmentContains =
        args.entityType === 'BusinessCapability' &&
        detectedRelationField === 'supportedByApplications'
          ? resolveHostingEnvironmentContains(normalizedText)
          : null

      const isApplicationHostingEnvironmentRelation = Boolean(hostingEnvironmentContains)
      const resolvedHostingEnvironmentContains = hostingEnvironmentContains ?? ''

      const queryArgs = {
        ...commonArgs,
        limit: 50,
        entityWhereClause: isApplicationInterfaceRelation
          ? buildApplicationInterfaceWhereClause(relationFilterClause.value)
          : isApplicationHostingEnvironmentRelation
            ? `${detectedRelationField}: { some: { hostingEnvironment: { contains: ${toGraphqlStringLiteral(
                resolvedHostingEnvironmentContains
              )} } } }`
            : `${detectedRelationField}: { some: { ${relationFilterClause.value} } }`,
        detailSelectionSet: isApplicationInterfaceRelation
          ? buildApplicationInterfaceDetailSelectionSet()
          : isApplicationHostingEnvironmentRelation
            ? buildApplicationHostingEnvironmentDetailSelectionSet(detectedRelationField)
            : buildDetailSelectionSet(
                detectedRelationField,
                resolveRelationDetailSelection(args.entityType, detectedRelationField)
              ),
        relationField: detectedRelationField,
        relatedFilterClause: isApplicationHostingEnvironmentRelation
          ? `hostingEnvironment: { contains: ${toGraphqlStringLiteral(
              resolvedHostingEnvironmentContains
            )} }`
          : relationFilterClause.value,
      }

      return {
        args: {
          ...filterArgsToSchema(graphqlEntry, queryArgs),
          relationField: queryArgs.relationField,
          relatedFilterClause: queryArgs.relatedFilterClause,
        },
      }
    }
    case 'COUNT_ENTITIES': {
      const statusEnum = resolveStatusEnum(normalizedText)
      if (!statusEnum) {
        return {
          reason: `COUNT_ENTITIES for ${args.entityType} requires an explicit status keyword such as ACTIVE or PLANNED.`,
        }
      }

      const statusEnumType = resolveStatusEnumType(args.entityType, args.artifacts)
      if (!statusEnumType.value) {
        return { reason: statusEnumType.reason }
      }

      return {
        args: filterArgsToSchema(graphqlEntry, {
          entityRoot: rootSelection.value.entityRoot,
          statusEnum,
          statusEnumType: statusEnumType.value,
        }),
      }
    }
    default: {
      const exhaustiveCheck: never = queryForm
      return { reason: `Unsupported governed query form: ${exhaustiveCheck}` }
    }
  }
}

export function getRequiredParametersForQueryId(queryId: QueryId): readonly string[] {
  return QUERY_PARAMETER_RULES[queryId]
}

export function selectAllowedQueryIds(args: SelectAllowedQueryIdsArgs): QuerySelection {
  const normalizedText = args.normalizedText?.trim() || normalizeText(args.text)
  const detectedRelationField = detectRelationField(args.entityType, normalizedText, args.artifacts)
  const queryFormResolution = resolveQueryForm(args, normalizedText, detectedRelationField)

  if (!queryFormResolution.queryForm) {
    return {
      intent: args.intent,
      entityType: args.entityType,
      queryForm: null,
      queryIds: [],
      parameterPolicies: [],
      selected: null,
      reason: queryFormResolution.reason,
    }
  }

  const selectedQueryId = QUERY_FORM_TO_QUERY_ID[queryFormResolution.queryForm]
  const rootSelection = getRootSelection(
    queryFormResolution.queryForm,
    args.entityType,
    args.artifacts
  )
  if (!rootSelection.value) {
    return {
      intent: args.intent,
      entityType: args.entityType,
      queryForm: queryFormResolution.queryForm,
      queryIds: [],
      parameterPolicies: [],
      selected: null,
      reason: rootSelection.reason,
    }
  }

  const relationForValidation =
    queryFormResolution.queryForm === 'ENTITY_RELATION_FILTER' ||
    queryFormResolution.queryForm === 'ENTITY_GAP_ANALYSIS'
      ? detectedRelationField
      : null

  const queryValidation = validateSelectedQuery(
    selectedQueryId,
    queryFormResolution.queryForm,
    args.entityType,
    rootSelection.value.rootQuery,
    relationForValidation,
    args.artifacts
  )

  if (!queryValidation.graphqlEntry) {
    return {
      intent: args.intent,
      entityType: args.entityType,
      queryForm: queryFormResolution.queryForm,
      queryIds: [],
      parameterPolicies: [],
      selected: null,
      reason: queryValidation.reason,
    }
  }

  const queryIds: readonly QueryId[] = [selectedQueryId]
  const selectedArgs = buildSelectedArgs(
    queryFormResolution.queryForm,
    args,
    normalizedText,
    detectedRelationField,
    queryValidation.graphqlEntry
  )

  if (!selectedArgs.args) {
    return {
      intent: args.intent,
      entityType: args.entityType,
      queryForm: queryFormResolution.queryForm,
      queryIds,
      parameterPolicies: queryIds.map(queryId => ({
        queryId,
        requiredParameters: getRequiredParametersForQueryId(queryId),
      })),
      selected: null,
      reason:
        selectedArgs.reason ??
        `No deterministic argument set could be derived for ${queryFormResolution.queryForm}.`,
    }
  }

  return {
    intent: args.intent,
    entityType: args.entityType,
    queryForm: queryFormResolution.queryForm,
    queryIds,
    parameterPolicies: queryIds.map(queryId => ({
      queryId,
      requiredParameters: getRequiredParametersForQueryId(queryId),
    })),
    selected: {
      queryForm: queryFormResolution.queryForm,
      queryId: selectedQueryId,
      args: selectedArgs.args,
    },
  }
}
