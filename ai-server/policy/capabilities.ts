import type {
  CanonicalConceptType,
  QueryForm,
  SchemaCountQueryDefinition,
  SchemaDigestArtifact,
  SchemaRootQueryDefinition,
} from '../artifacts/types'

const SEARCH_AND_DETAILS_ENTITY_TYPES = [
  'Application',
  'BusinessCapability',
  'ApplicationInterface',
  'DataObject',
  'Infrastructure',
  'BusinessProcess',
  'SoftwareProduct',
] as const satisfies readonly CanonicalConceptType[]

const GAP_RELATIONS: Readonly<Partial<Record<CanonicalConceptType, readonly string[]>>> = {
  Application: ['supportsCapabilities'],
  ApplicationInterface: ['dataObjects'],
  BusinessCapability: ['supportedByApplications'],
  BusinessProcess: ['supportedByApplications'],
  DataObject: ['usedByApplications'],
}

const RELATION_FILTER_RELATIONS: Readonly<
  Partial<Record<CanonicalConceptType, readonly string[]>>
> = {
  Application: ['supportsCapabilities', 'supportsBusinessProcesses', 'usesDataObjects'],
  ApplicationInterface: ['sourceApplications', 'targetApplications', 'dataObjects'],
  BusinessCapability: ['supportedByApplications', 'supportedByBusinessProcesses'],
  BusinessProcess: ['supportsCapabilities', 'supportedByApplications'],
  DataObject: ['usedByApplications', 'relatedToCapabilities'],
  Infrastructure: ['hostsApplications', 'usesSoftwareProducts'],
}

const DETAIL_RELATIONS: Readonly<Partial<Record<CanonicalConceptType, readonly string[]>>> = {
  Application: [
    'supportsCapabilities',
    'usesDataObjects',
    'sourceOfInterfaces',
    'targetOfInterfaces',
  ],
  ApplicationInterface: ['sourceApplications', 'targetApplications', 'dataObjects'],
  BusinessCapability: ['supportedByApplications', 'relatedDataObjects'],
  BusinessProcess: ['supportsCapabilities', 'supportedByApplications'],
  DataObject: ['usedByApplications', 'relatedToCapabilities'],
  Infrastructure: ['hostsApplications', 'usesSoftwareProducts'],
  SoftwareProduct: ['usedByApplications', 'versions'],
}

const STATUS_ENUM_TYPES: Readonly<Partial<Record<CanonicalConceptType, string>>> = {
  Application: 'ApplicationStatus',
  ApplicationInterface: 'InterfaceStatus',
  BusinessCapability: 'CapabilityStatus',
  BusinessProcess: 'ProcessStatus',
  Infrastructure: 'InfrastructureStatus',
}

const STATUS_SELECTIONS: Readonly<Partial<Record<CanonicalConceptType, string>>> = {
  Application: 'status',
  ApplicationInterface: 'status',
  BusinessCapability: 'status',
  BusinessProcess: 'status',
  Infrastructure: 'status',
}

const LIFECYCLE_SELECTIONS: Readonly<Partial<Record<CanonicalConceptType, string>>> = {
  SoftwareProduct: 'lifecycleStatus',
}

export interface EntityCapability {
  readonly entityType: CanonicalConceptType
  readonly rootField: string
  readonly countRootField?: string
  readonly statusEnumType?: string
  readonly statusFieldSelection: string
  readonly lifecycleFieldSelection: string
  readonly gapRelations: readonly string[]
  readonly relationFilterRelations: readonly string[]
  readonly detailRelationSelections: string
}

export interface PolicyCapabilities {
  readonly byEntityType: Readonly<Partial<Record<CanonicalConceptType, EntityCapability>>>
  readonly entityTypesByQueryForm: Readonly<Record<QueryForm, readonly CanonicalConceptType[]>>
}

function asRootDefinitionMap(
  schemaDigest: SchemaDigestArtifact
): ReadonlyMap<CanonicalConceptType, SchemaRootQueryDefinition> {
  return new Map(
    schemaDigest.allowedRootQueries.map(definition => [definition.entityType, definition] as const)
  )
}

function asCountDefinitionMap(
  schemaDigest: SchemaDigestArtifact
): ReadonlyMap<CanonicalConceptType, SchemaCountQueryDefinition> {
  return new Map(
    schemaDigest.countQueries.map(definition => [definition.entityType, definition] as const)
  )
}

function assertDigestField(
  root: SchemaRootQueryDefinition,
  fieldName: string,
  entityType: CanonicalConceptType
): void {
  if (!root.fields.includes(fieldName)) {
    throw new Error(
      `SCHEMA_DIGEST root "${root.rootQuery}" for ${entityType} is missing field "${fieldName}".`
    )
  }
}

function assertDigestRelation(
  root: SchemaRootQueryDefinition,
  relationName: string,
  entityType: CanonicalConceptType
): void {
  if (!root.relations.includes(relationName)) {
    throw new Error(
      `SCHEMA_DIGEST root "${root.rootQuery}" for ${entityType} is missing relation "${relationName}".`
    )
  }
}

function buildDetailRelationSelections(relations: readonly string[]): string {
  return relations.map(relation => `${relation} { id name }`).join('\n')
}

export function buildPolicyCapabilities(schemaDigest: SchemaDigestArtifact): PolicyCapabilities {
  const rootsByEntityType = asRootDefinitionMap(schemaDigest)
  const countsByEntityType = asCountDefinitionMap(schemaDigest)
  const byEntityType: Partial<Record<CanonicalConceptType, EntityCapability>> = {}

  for (const entityType of SEARCH_AND_DETAILS_ENTITY_TYPES) {
    const root = rootsByEntityType.get(entityType)
    if (!root) {
      throw new Error(`SCHEMA_DIGEST is missing a governed root query for ${entityType}.`)
    }

    assertDigestField(root, 'id', entityType)
    assertDigestField(root, 'name', entityType)

    const statusFieldSelection = STATUS_SELECTIONS[entityType] ?? ''
    if (statusFieldSelection) {
      assertDigestField(root, statusFieldSelection, entityType)
    }

    const lifecycleFieldSelection = LIFECYCLE_SELECTIONS[entityType] ?? ''
    if (lifecycleFieldSelection) {
      assertDigestField(root, lifecycleFieldSelection, entityType)
    }

    const gapRelations = GAP_RELATIONS[entityType] ?? []
    for (const relationName of gapRelations) {
      assertDigestRelation(root, relationName, entityType)
    }

    const relationFilterRelations = RELATION_FILTER_RELATIONS[entityType] ?? []
    for (const relationName of relationFilterRelations) {
      assertDigestRelation(root, relationName, entityType)
    }

    const detailRelations = DETAIL_RELATIONS[entityType] ?? []
    for (const relationName of detailRelations) {
      assertDigestRelation(root, relationName, entityType)
    }

    const countDefinition = countsByEntityType.get(entityType)
    const statusEnumType = STATUS_ENUM_TYPES[entityType]
    if (statusEnumType) {
      if (!countDefinition) {
        throw new Error(`SCHEMA_DIGEST is missing a governed count root for ${entityType}.`)
      }
      if (!(statusEnumType in schemaDigest.enumValues)) {
        throw new Error(`SCHEMA_DIGEST is missing enum type "${statusEnumType}" for ${entityType}.`)
      }
    }

    byEntityType[entityType] = {
      entityType,
      rootField: root.rootQuery,
      countRootField: countDefinition?.rootQuery,
      statusEnumType,
      statusFieldSelection,
      lifecycleFieldSelection,
      gapRelations,
      relationFilterRelations,
      detailRelationSelections: buildDetailRelationSelections(detailRelations),
    }
  }

  return {
    byEntityType,
    entityTypesByQueryForm: {
      COUNT_ENTITIES: Object.keys(byEntityType).filter(entityType =>
        Boolean(byEntityType[entityType as CanonicalConceptType]?.statusEnumType)
      ) as CanonicalConceptType[],
      ENTITY_DETAILS: [...SEARCH_AND_DETAILS_ENTITY_TYPES],
      ENTITY_GAP_ANALYSIS: Object.keys(GAP_RELATIONS) as CanonicalConceptType[],
      ENTITY_RELATION_FILTER: Object.keys(RELATION_FILTER_RELATIONS) as CanonicalConceptType[],
      ENTITY_SEARCH: [...SEARCH_AND_DETAILS_ENTITY_TYPES],
    },
  }
}

export function getEntityCapability(
  capabilities: PolicyCapabilities,
  entityType: CanonicalConceptType
): EntityCapability {
  const capability = capabilities.byEntityType[entityType]
  if (!capability) {
    throw new Error(`No governed policy capability is configured for entity type "${entityType}".`)
  }

  return capability
}
