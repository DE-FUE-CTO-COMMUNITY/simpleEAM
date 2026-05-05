export const SUPPORTED_LOCALES = ['de', 'en', 'fr'] as const

export const ALLOWED_INTENTS = [
  'FACT_LOOKUP',
  'IMPACT_ANALYSIS',
  'DEPENDENCY_EXPLORATION',
  'STRATEGIC_ENRICHMENT',
  'ENTITY_IDENTIFICATION',
] as const

export const CANONICAL_CONCEPT_TYPES = [
  'BusinessCapability',
  'BusinessProcess',
  'GEA_Vision',
  'GEA_Mission',
  'GEA_Value',
  'GEA_Goal',
  'GEA_Strategy',
  'AiRun',
  'AiRunAuditEvent',
  'AgentConfig',
  'Person',
  'ReportFolder',
  'AnalyticsReport',
  'Supplier',
  'Application',
  'ApplicationInterface',
  'DataObject',
  'Infrastructure',
  'SoftwareProduct',
  'SoftwareVersion',
  'HardwareProduct',
  'HardwareVersion',
  'ProductFamily',
  'SbomDocument',
  'LifecycleRecord',
  'AIComponent',
  'Company',
  'Organisation',
  'Architecture',
  'Diagram',
  'ArchitecturePrinciple',
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export type AllowedIntent = (typeof ALLOWED_INTENTS)[number]
export type CanonicalConceptType = (typeof CANONICAL_CONCEPT_TYPES)[number]

export type ArtifactKind =
  | 'intent-schema'
  | 'concept-dictionary'
  | 'query-library'
  | 'query-library-metadata'
  | 'schema-digest'

export interface ArtifactBase<TKind extends ArtifactKind> {
  readonly artifact: TKind
  readonly version: string
}

export interface IntentDefinition {
  readonly description: string
  readonly requiresTraversal: boolean
}

export interface IntentSchemaArtifact extends ArtifactBase<'intent-schema'> {
  readonly intents: Readonly<Record<AllowedIntent, IntentDefinition>>
}

export interface ConceptDefinition {
  readonly description: string
  readonly graphLabel: CanonicalConceptType
  readonly synonyms: Readonly<Record<SupportedLocale, readonly string[]>>
}

export interface ConceptDictionaryArtifact extends ArtifactBase<'concept-dictionary'> {
  readonly concepts: Readonly<Record<CanonicalConceptType, ConceptDefinition>>
}

export interface QueryLibraryEntry {
  readonly queryId: string
  readonly kind: 'list' | 'count' | 'overview'
  readonly description: string
  readonly rootQueries: readonly string[]
  readonly entityTypes: readonly CanonicalConceptType[]
  readonly allowedIntents: readonly AllowedIntent[]
  readonly parameterMode: 'structured-args' | 'enumerated-config'
  readonly companyScopeRuleIds: readonly string[]
  readonly sourceModules: readonly string[]
}

export interface GraphqlQueryLibraryParam {
  readonly name: string
  readonly kind: 'string' | 'id' | 'enum' | 'int'
  readonly required: boolean
  readonly placeholder: string
  readonly description: string
  readonly enumType?: string
  readonly defaultValue?: string | number
}

export interface GraphqlQueryLibraryEntry {
  readonly queryId: string
  readonly intents: readonly AllowedIntent[]
  readonly rootField: string
  readonly entityTypes: readonly CanonicalConceptType[]
  readonly companyScopeRuleId: string
  readonly templateFile: string
  readonly params: readonly GraphqlQueryLibraryParam[]
}

export interface QueryLibraryArtifact extends ArtifactBase<'query-library'> {
  readonly dynamicQueryGenerationAllowed: false
  readonly queries: readonly GraphqlQueryLibraryEntry[]
}

export interface QueryLibraryMetadataArtifact extends ArtifactBase<'query-library-metadata'> {
  readonly selectionMode: 'query-id-only'
  readonly dynamicQueryGenerationAllowed: false
  readonly queries: readonly QueryLibraryEntry[]
}

export interface SchemaDigestGovernance {
  readonly readOnly: true
  readonly dynamicQueryGenerationAllowed: false
  readonly permittedUses: {
    readonly validation: true
    readonly capabilityAwareness: true
    readonly policyConstraints: true
  }
}

export interface CompanyScopingRule {
  readonly id: string
  readonly appliesToRootQueries: readonly string[]
  readonly requiredVariable: 'companyId'
  readonly whereClauseShape: string
  readonly description: string
}

export interface SchemaRootQueryDefinition {
  readonly rootQuery: string
  readonly entityType: CanonicalConceptType
  readonly whereType: string
  readonly companyScopeRuleId: string
  readonly fields: readonly string[]
  readonly relations: readonly string[]
}

export interface SchemaCountQueryDefinition {
  readonly rootQuery: string
  readonly entityType: CanonicalConceptType
  readonly whereType: string
  readonly companyScopeRuleId: string
  readonly resultPath: 'aggregate.count.nodes'
}

export interface FilterSyntaxContract {
  readonly stringOperators: readonly string[]
  readonly enumOperators: readonly string[]
  readonly nullOperators: readonly string[]
  readonly relationOperators: readonly string[]
  readonly logicalOperators: readonly string[]
  readonly paginationArguments: readonly string[]
  readonly notes: readonly string[]
  readonly examples: readonly string[]
}

export interface EnumValueContract {
  readonly [enumType: string]: readonly string[]
}

export interface SchemaDigestArtifact extends ArtifactBase<'schema-digest'> {
  readonly governance: SchemaDigestGovernance
  readonly mandatoryCompanyScoping: readonly CompanyScopingRule[]
  readonly allowedRootQueries: readonly SchemaRootQueryDefinition[]
  readonly countQueries: readonly SchemaCountQueryDefinition[]
  readonly enumValues: EnumValueContract
  readonly filterSyntax: FilterSyntaxContract
}

export interface LoadedArtifacts {
  readonly intentSchema: IntentSchemaArtifact
  readonly conceptDictionary: ConceptDictionaryArtifact
  readonly queryLibrary: QueryLibraryArtifact
  readonly queryLibraryMetadata: QueryLibraryMetadataArtifact
  readonly schemaDigest: SchemaDigestArtifact
}

export type AnyArtifact =
  | IntentSchemaArtifact
  | ConceptDictionaryArtifact
  | QueryLibraryArtifact
  | QueryLibraryMetadataArtifact
  | SchemaDigestArtifact
