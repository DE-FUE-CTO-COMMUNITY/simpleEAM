/**
 * tools.ts — Typed query tool layer for the data-lookup agent.
 *
 * The LLM picks a tool by name and provides structured JSON args.
 * This layer constructs and executes pre-written GraphQL queries using
 * proper variables — the LLM never generates any GraphQL syntax.
 *
 * Company scope is injected by every tool's execute function.
 * No regex injection, no string manipulation, no LLM-generated WHERE clauses.
 */

import { graphqlRequest } from '../../graphql/client'
import type {
  ApplicationWhere,
  BusinessCapabilityWhere,
  ApplicationInterfaceWhere,
  DataObjectWhere,
  InfrastructureWhere,
  BusinessProcessWhere,
  AiComponentWhere,
  SupplierWhere,
  OrganisationWhere,
  PersonWhere,
  CompanyWhere,
} from '../../gql/generated'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolCallResult {
  readonly data: unknown
  readonly toolName: string
  readonly argsUsed: Record<string, unknown>
}

interface ArgDef {
  readonly name: string
  readonly type: string
  readonly description: string
  readonly optional: boolean
}

export interface ToolDefinition {
  readonly name: string
  readonly description: string
  readonly argsSchema: ReadonlyArray<ArgDef>
  readonly execute: (
    args: Record<string, unknown>,
    companyId: string,
    accessToken: string
  ) => Promise<ToolCallResult>
}

// ─────────────────────────────────────────────────────────────────────────────
// Where-clause builder helpers
// ─────────────────────────────────────────────────────────────────────────────

// Used only for the dynamic countEntities tool where the Where type is not known statically
type WhereClause = Record<string, unknown>

/** Adds a name contains filter if value is a non-empty string */
const withName = (where: object, value: unknown): void => {
  if (typeof value === 'string' && value.trim()) {
    ;(where as WhereClause).name = { contains: value.trim() }
  }
}

/** Adds an enum equality filter if value is a non-empty string */
const withEnum = (where: object, field: string, value: unknown): void => {
  if (typeof value === 'string' && value.trim()) {
    ;(where as WhereClause)[field] = { eq: value.trim() }
  }
}

/** Adds a { contains } filter on an arbitrary string field */
const withContains = (where: object, field: string, value: unknown): void => {
  if (typeof value === 'string' && value.trim()) {
    ;(where as WhereClause)[field] = { contains: value.trim() }
  }
}

/** Adds a relationship "some" filter matching name */
const withRelationName = (
  where: object,
  relation: string,
  value: unknown,
  nameField = 'name'
): void => {
  if (typeof value === 'string' && value.trim()) {
    ;(where as WhereClause)[relation] = { some: { [nameField]: { contains: value.trim() } } }
  }
}

/** Adds a relationship "none" filter (gap queries) */
const withRelationNone = (where: object, relation: string, flag: unknown): void => {
  if (flag === true || flag === 'true') {
    ;(where as WhereClause)[relation] = { none: {} }
  }
}

/** Parses and limits the limit arg */
const getLimit = (args: Record<string, unknown>, defaultLimit = 50): number => {
  const v = args.limit
  if (typeof v === 'number') return Math.min(v, 200)
  if (typeof v === 'string' && !Number.isNaN(Number(v))) return Math.min(Number(v), 200)
  return defaultLimit
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listApplications
// ─────────────────────────────────────────────────────────────────────────────

const listApplications: ToolDefinition = {
  name: 'listApplications',
  description:
    'List applications with optional filters. Returns applications with their capabilities, infrastructure, interfaces, AI components, and suppliers.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    {
      name: 'status',
      type: 'string',
      description:
        'ApplicationStatus: ACTIVE | INACTIVE | PLANNED | RETIRED | MIGRATION | DECOMMISSIONED',
      optional: true,
    },
    {
      name: 'criticality',
      type: 'string',
      description: 'CriticalityLevel: LOW | MEDIUM | HIGH | CRITICAL',
      optional: true,
    },
    {
      name: 'vendor',
      type: 'string',
      description: 'Filter by vendor name substring',
      optional: true,
    },
    {
      name: 'capabilityNameContains',
      type: 'string',
      description: 'Only apps supporting a capability matching this name',
      optional: true,
    },
    {
      name: 'infrastructureNameContains',
      type: 'string',
      description: 'Only apps hosted on matching infrastructure',
      optional: true,
    },
    {
      name: 'supplierNameContains',
      type: 'string',
      description: 'Only apps provided, supported, or maintained by a matching supplier',
      optional: true,
    },
    {
      name: 'dataObjectClassification',
      type: 'string',
      description:
        'Only apps using data objects with this classification: PUBLIC | INTERNAL | CONFIDENTIAL | STRICTLY_CONFIDENTIAL',
      optional: true,
    },
    {
      name: 'interfaceDataObjectNameContains',
      type: 'string',
      description:
        'Only apps with interfaces transferring a matching data object name (e.g. customer)',
      optional: true,
    },
    {
      name: 'interfaceDataClassification',
      type: 'string',
      description:
        'Only apps with interfaces transferring this data classification: PUBLIC | INTERNAL | CONFIDENTIAL | STRICTLY_CONFIDENTIAL',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: ApplicationWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'criticality', args.criticality)
    withContains(where, 'vendor', args.vendor)
    withRelationName(where, 'supportsCapabilities', args.capabilityNameContains)
    withRelationName(where, 'hostedOn', args.infrastructureNameContains)
    if (typeof args.supplierNameContains === 'string' && args.supplierNameContains.trim()) {
      const v = args.supplierNameContains.trim()
      where.OR = [
        { providedBy: { some: { name: { contains: v } } } },
        { supportedBy: { some: { name: { contains: v } } } },
        { maintainedBy: { some: { name: { contains: v } } } },
      ]
    }
    if (typeof args.dataObjectClassification === 'string' && args.dataObjectClassification.trim()) {
      where.usesDataObjects = {
        some: {
          classification: { eq: args.dataObjectClassification.trim() as any },
        },
      }
    }
    if (
      typeof args.interfaceDataObjectNameContains === 'string' &&
      args.interfaceDataObjectNameContains.trim()
    ) {
      const v = args.interfaceDataObjectNameContains.trim()
      where.sourceOfInterfaces = {
        some: { dataObjects: { some: { name: { contains: v } } } },
      }
    }
    if (
      typeof args.interfaceDataClassification === 'string' &&
      args.interfaceDataClassification.trim()
    ) {
      const v = args.interfaceDataClassification.trim()
      where.sourceOfInterfaces = {
        some: { dataObjects: { some: { classification: { eq: v as any } } } },
      }
    }

    const data = await graphqlRequest({
      query: `
        query ListApplications($where: ApplicationWhere, $limit: Int) {
          applications(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description status criticality vendor technologyStack hostingEnvironment costs
            supportsCapabilities { id name status maturityLevel }
            hostedOn { id name infrastructureType status vendor location }
            sourceOfInterfaces { id name interfaceType status
              dataObjects { id name classification }
              targetApplications { id name } }
            usesDataObjects { id name classification }
            usesAIComponents { id name aiType status }
            providedBy { id name supplierType status }
            supportedBy { id name supplierType status }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listApplications', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listBusinessCapabilities
// ─────────────────────────────────────────────────────────────────────────────

const listBusinessCapabilities: ToolDefinition = {
  name: 'listBusinessCapabilities',
  description:
    'List business capabilities with optional filters. Returns supporting applications, AI components, processes, and child capabilities.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    {
      name: 'status',
      type: 'string',
      description: 'CapabilityStatus: ACTIVE | INACTIVE | PLANNED | RETIRED',
      optional: true,
    },
    {
      name: 'type',
      type: 'string',
      description: 'CapabilityType: BUSINESS | TECHNICAL | DATA | ENABLING',
      optional: true,
    },
    {
      name: 'maturityLevel',
      type: 'string',
      description: 'Filter by exact maturity level value',
      optional: true,
    },
    {
      name: 'noSupportingApplications',
      type: 'boolean',
      description: 'Set true to find capability gaps (capabilities with no supporting apps)',
      optional: true,
    },
    {
      name: 'applicationNameContains',
      type: 'string',
      description: 'Only capabilities supported by a matching application',
      optional: true,
    },
    {
      name: 'parentNameContains',
      type: 'string',
      description: 'Only child capabilities of a parent matching this name',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: BusinessCapabilityWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'type', args.type)
    withEnum(where, 'maturityLevel', args.maturityLevel)
    withRelationNone(where, 'supportedByApplications', args.noSupportingApplications)
    withRelationName(where, 'supportedByApplications', args.applicationNameContains)
    withRelationName(where, 'parents', args.parentNameContains)

    const data = await graphqlRequest({
      query: `
        query ListBusinessCapabilities($where: BusinessCapabilityWhere, $limit: Int) {
          businessCapabilities(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description status type maturityLevel businessValue
            supportedByApplications { id name status criticality vendor }
            supportedByAIComponents { id name aiType status }
            supportedByBusinessProcesses { id name status }
            parents { id name status }
            children { id name status }
            relatedDataObjects { id name classification }
            usedByOrganisations { id name type }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listBusinessCapabilities', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listApplicationInterfaces
// ─────────────────────────────────────────────────────────────────────────────

const listApplicationInterfaces: ToolDefinition = {
  name: 'listApplicationInterfaces',
  description:
    'List application interfaces (integrations between systems). Returns source/target applications and transferred data objects.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    {
      name: 'status',
      type: 'string',
      description: 'InterfaceStatus: ACTIVE | INACTIVE | PLANNED | RETIRED | DEPRECATED',
      optional: true,
    },
    {
      name: 'interfaceType',
      type: 'string',
      description: 'InterfaceType: API | FILE | DATABASE | MESSAGE_QUEUE | OTHER',
      optional: true,
    },
    {
      name: 'sourceAppNameContains',
      type: 'string',
      description: 'Only interfaces sent from a matching source application',
      optional: true,
    },
    {
      name: 'targetAppNameContains',
      type: 'string',
      description: 'Only interfaces received by a matching target application',
      optional: true,
    },
    {
      name: 'dataClassification',
      type: 'string',
      description:
        'Only interfaces transferring data of this classification: PUBLIC | INTERNAL | CONFIDENTIAL | STRICTLY_CONFIDENTIAL',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: ApplicationInterfaceWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'interfaceType', args.interfaceType)
    withRelationName(where, 'sourceApplications', args.sourceAppNameContains)
    withRelationName(where, 'targetApplications', args.targetAppNameContains)
    if (typeof args.dataClassification === 'string' && args.dataClassification.trim()) {
      where.dataObjects = {
        some: { classification: { eq: args.dataClassification.trim() as any } },
      }
    }

    const data = await graphqlRequest({
      query: `
        query ListApplicationInterfaces($where: ApplicationInterfaceWhere, $limit: Int) {
          applicationInterfaces(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description interfaceType protocol status version
            sourceApplications { id name status criticality }
            targetApplications { id name status criticality }
            dataObjects { id name classification description format }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listApplicationInterfaces', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listDataObjects
// ─────────────────────────────────────────────────────────────────────────────

const listDataObjects: ToolDefinition = {
  name: 'listDataObjects',
  description:
    'List data objects with optional filters. Returns which applications use them and which interfaces transfer them.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    {
      name: 'classification',
      type: 'string',
      description: 'DataClassification: PUBLIC | INTERNAL | CONFIDENTIAL | STRICTLY_CONFIDENTIAL',
      optional: true,
    },
    {
      name: 'usedByAppNameContains',
      type: 'string',
      description: 'Only data objects used by a matching application',
      optional: true,
    },
    {
      name: 'transferredByInterfaceNameContains',
      type: 'string',
      description: 'Only data objects transferred by a matching interface',
      optional: true,
    },
    {
      name: 'relatedToCapabilityNameContains',
      type: 'string',
      description: 'Only data objects related to a matching capability',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: DataObjectWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'classification', args.classification)
    withRelationName(where, 'usedByApplications', args.usedByAppNameContains)
    withRelationName(where, 'transferredInInterfaces', args.transferredByInterfaceNameContains)
    withRelationName(where, 'relatedToCapabilities', args.relatedToCapabilityNameContains)

    const data = await graphqlRequest({
      query: `
        query ListDataObjects($where: DataObjectWhere, $limit: Int) {
          dataObjects(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description classification format
            usedByApplications { id name status criticality }
            dataSources { id name status }
            transferredInInterfaces { id name interfaceType status
              sourceApplications { id name }
              targetApplications { id name } }
            relatedToCapabilities { id name status }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listDataObjects', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listInfrastructures
// ─────────────────────────────────────────────────────────────────────────────

const listInfrastructures: ToolDefinition = {
  name: 'listInfrastructures',
  description:
    'List infrastructure items (servers, cloud, containers, etc.). Returns hosted applications and AI components.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    {
      name: 'status',
      type: 'string',
      description: 'InfrastructureStatus: ACTIVE | INACTIVE | PLANNED | RETIRED | MAINTENANCE',
      optional: true,
    },
    {
      name: 'infrastructureType',
      type: 'string',
      description:
        'InfrastructureType: SERVER | STORAGE | NETWORK | CLOUD | CONTAINER | DATABASE | PLATFORM | OTHER',
      optional: true,
    },
    {
      name: 'vendor',
      type: 'string',
      description: 'Filter by vendor name substring',
      optional: true,
    },
    {
      name: 'location',
      type: 'string',
      description: 'Filter by location substring',
      optional: true,
    },
    {
      name: 'applicationNameContains',
      type: 'string',
      description: 'Only infrastructure hosting a matching application',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: InfrastructureWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'infrastructureType', args.infrastructureType)
    withContains(where, 'vendor', args.vendor)
    withContains(where, 'location', args.location)
    withRelationName(where, 'hostsApplications', args.applicationNameContains)

    const data = await graphqlRequest({
      query: `
        query ListInfrastructures($where: InfrastructureWhere, $limit: Int) {
          infrastructures(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description infrastructureType status vendor location operatingSystem costs
            hostsApplications { id name status criticality
              supportsCapabilities { id name } }
            hostsAIComponents { id name aiType status }
            parentInfrastructure { id name }
            childInfrastructures { id name }
            providedBy { id name supplierType }
            maintainedBy { id name supplierType }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listInfrastructures', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listBusinessProcesses
// ─────────────────────────────────────────────────────────────────────────────

const listBusinessProcesses: ToolDefinition = {
  name: 'listBusinessProcesses',
  description:
    'List business processes with optional filters. Returns supporting applications and linked capabilities.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    { name: 'status', type: 'string', description: 'ProcessStatus enum value', optional: true },
    {
      name: 'processType',
      type: 'string',
      description: 'ProcessType: CORE | MANAGEMENT | SUPPORT',
      optional: true,
    },
    {
      name: 'capabilityNameContains',
      type: 'string',
      description: 'Only processes linked to a matching capability',
      optional: true,
    },
    {
      name: 'applicationNameContains',
      type: 'string',
      description: 'Only processes supported by a matching application',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: BusinessProcessWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'processType', args.processType)
    withRelationName(where, 'supportsCapabilities', args.capabilityNameContains)
    withRelationName(where, 'supportedByApplications', args.applicationNameContains)

    const data = await graphqlRequest({
      query: `
        query ListBusinessProcesses($where: BusinessProcessWhere, $limit: Int) {
          businessProcesses(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description processType status maturityLevel category
            supportsCapabilities { id name status }
            supportedByApplications { id name status criticality }
            parentProcess { id name }
            childProcesses { id name }
            usedByOrganisations { id name type }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listBusinessProcesses', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listAIComponents
// ─────────────────────────────────────────────────────────────────────────────

const listAIComponents: ToolDefinition = {
  name: 'listAIComponents',
  description:
    'List AI components. Returns capabilities they support, hosting infrastructure, training data, and applications using them.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    { name: 'status', type: 'string', description: 'AIComponentStatus enum value', optional: true },
    { name: 'aiType', type: 'string', description: 'AIComponentType enum value', optional: true },
    {
      name: 'provider',
      type: 'string',
      description: 'Filter by provider name substring',
      optional: true,
    },
    {
      name: 'capabilityNameContains',
      type: 'string',
      description: 'Only AI components supporting a matching capability',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: AiComponentWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'aiType', args.aiType)
    withContains(where, 'provider', args.provider)
    withRelationName(where, 'supportsCapabilities', args.capabilityNameContains)

    const data = await graphqlRequest({
      query: `
        query ListAIComponents($where: AIComponentWhere, $limit: Int) {
          aiComponents(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description aiType model version status accuracy provider license costs
            supportsCapabilities { id name status }
            hostedOn { id name infrastructureType status }
            trainedWithDataObjects { id name classification }
            usedByApplications { id name status }
            providedBy { id name supplierType }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listAIComponents', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listSuppliers
// ─────────────────────────────────────────────────────────────────────────────

const listSuppliers: ToolDefinition = {
  name: 'listSuppliers',
  description:
    'List suppliers with optional filters. Returns applications, AI components, and infrastructure they provide.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    { name: 'status', type: 'string', description: 'SupplierStatus enum value', optional: true },
    {
      name: 'supplierType',
      type: 'string',
      description: 'SupplierType: HARDWARE | SOFTWARE | SERVICE | CONSULTING | CLOUD | OTHER',
      optional: true,
    },
    {
      name: 'strategicImportance',
      type: 'string',
      description: 'StrategicImportance enum value',
      optional: true,
    },
    {
      name: 'riskClassification',
      type: 'string',
      description: 'RiskClassification enum value',
      optional: true,
    },
    {
      name: 'applicationNameContains',
      type: 'string',
      description: 'Only suppliers providing or supporting a matching application',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: SupplierWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)
    withEnum(where, 'supplierType', args.supplierType)
    withEnum(where, 'strategicImportance', args.strategicImportance)
    withEnum(where, 'riskClassification', args.riskClassification)
    if (typeof args.applicationNameContains === 'string' && args.applicationNameContains.trim()) {
      const v = args.applicationNameContains.trim()
      where.OR = [
        { providesApplications: { some: { name: { contains: v } } } },
        { supportsApplications: { some: { name: { contains: v } } } },
      ]
    }

    const data = await graphqlRequest({
      query: `
        query ListSuppliers($where: SupplierWhere, $limit: Int) {
          suppliers(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description supplierType status website
            annualSpend riskClassification strategicImportance performanceRating
            primaryContactPerson contractStartDate contractEndDate
            providesApplications { id name status criticality }
            supportsApplications { id name status criticality }
            maintainsApplications { id name status }
            providesAIComponents { id name aiType status }
            providesInfrastructure { id name infrastructureType status }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listSuppliers', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listOrganisations
// ─────────────────────────────────────────────────────────────────────────────

const listOrganisations: ToolDefinition = {
  name: 'listOrganisations',
  description: 'List organisational units. Returns capabilities and applications they use.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by name substring',
      optional: true,
    },
    {
      name: 'type',
      type: 'string',
      description: 'OrganisationType enum value',
      optional: true,
    },
    {
      name: 'capabilityNameContains',
      type: 'string',
      description: 'Only orgs using a matching capability',
      optional: true,
    },
    {
      name: 'applicationNameContains',
      type: 'string',
      description: 'Only orgs using a matching application',
      optional: true,
    },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    const where: OrganisationWhere = { company: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'type', args.type)
    withRelationName(where, 'usedCapabilities', args.capabilityNameContains)
    withRelationName(where, 'usedApplications', args.applicationNameContains)

    const data = await graphqlRequest({
      query: `
        query ListOrganisations($where: OrganisationWhere, $limit: Int) {
          organisations(where: $where, limit: $limit, sort: [{ name: ASC }]) {
            id name description type level
            parentOrganisation { id name }
            childOrganisations { id name }
            usedCapabilities { id name status }
            usedApplications { id name status criticality }
            usedDataObjects { id name classification }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listOrganisations', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: listPeople
// ─────────────────────────────────────────────────────────────────────────────

const listPeople: ToolDefinition = {
  name: 'listPeople',
  description: 'List people (employees, owners) with optional filters. Returns what they own.',
  argsSchema: [
    {
      name: 'nameContains',
      type: 'string',
      description: 'Filter by first or last name substring',
      optional: true,
    },
    {
      name: 'department',
      type: 'string',
      description: 'Filter by department name substring',
      optional: true,
    },
    { name: 'role', type: 'string', description: 'Filter by role substring', optional: true },
    { name: 'limit', type: 'number', description: 'Maximum results (default 50)', optional: true },
  ],
  async execute(args, companyId, accessToken) {
    // Person uses `companies` (EMPLOYED_BY) not `company` (OWNED_BY)
    const where: PersonWhere = { companies: { some: { id: { eq: companyId } } } }
    if (typeof args.nameContains === 'string' && args.nameContains.trim()) {
      const v = args.nameContains.trim()
      where.OR = [{ firstName: { contains: v } }, { lastName: { contains: v } }]
    }
    withContains(where, 'department', args.department)
    withContains(where, 'role', args.role)

    const data = await graphqlRequest({
      query: `
        query ListPeople($where: PersonWhere, $limit: Int) {
          people(where: $where, limit: $limit, sort: [{ lastName: ASC }]) {
            id firstName lastName email department role phone
            ownedApplications { id name status criticality }
            ownedCapabilities { id name status }
            ownedDataObjects { id name classification }
            ownedInfrastructure { id name infrastructureType }
          }
        }
      `,
      variables: { where, limit: getLimit(args) },
      accessToken,
    })

    return { data, toolName: 'listPeople', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: countEntities
// ─────────────────────────────────────────────────────────────────────────────

// Maps tool entity type names to their Connection query + WhereInput type + company field
const COUNT_ENTITY_CONFIG: Readonly<
  Record<string, { connection: string; whereType: string; companyField: string }>
> = {
  applications: {
    connection: 'applicationsConnection',
    whereType: 'ApplicationWhere',
    companyField: 'company',
  },
  businessCapabilities: {
    connection: 'businessCapabilitiesConnection',
    whereType: 'BusinessCapabilityWhere',
    companyField: 'company',
  },
  applicationInterfaces: {
    connection: 'applicationInterfacesConnection',
    whereType: 'ApplicationInterfaceWhere',
    companyField: 'company',
  },
  dataObjects: {
    connection: 'dataObjectsConnection',
    whereType: 'DataObjectWhere',
    companyField: 'company',
  },
  infrastructures: {
    connection: 'infrastructuresConnection',
    whereType: 'InfrastructureWhere',
    companyField: 'company',
  },
  businessProcesses: {
    connection: 'businessProcessesConnection',
    whereType: 'BusinessProcessWhere',
    companyField: 'company',
  },
  aiComponents: {
    connection: 'aiComponentsConnection',
    whereType: 'AIComponentWhere',
    companyField: 'company',
  },
  suppliers: {
    connection: 'suppliersConnection',
    whereType: 'SupplierWhere',
    companyField: 'company',
  },
  organisations: {
    connection: 'organisationsConnection',
    whereType: 'OrganisationWhere',
    companyField: 'company',
  },
  people: {
    connection: 'peopleConnection',
    whereType: 'PersonWhere',
    companyField: 'companies',
  },
  architectures: {
    connection: 'architecturesConnection',
    whereType: 'ArchitectureWhere',
    companyField: 'company',
  },
  softwareProducts: {
    connection: 'softwareProductsConnection',
    whereType: 'SoftwareProductWhere',
    companyField: 'company',
  },
}

const countEntities: ToolDefinition = {
  name: 'countEntities',
  description:
    'Count entities of a given type, with optional name or status filter. Use for questions like "how many applications do we have" or "how many active capabilities".',
  argsSchema: [
    {
      name: 'entityType',
      type: 'string',
      description: `One of: ${Object.keys(COUNT_ENTITY_CONFIG).join(' | ')}`,
      optional: false,
    },
    { name: 'nameContains', type: 'string', description: 'Optional name filter', optional: true },
    {
      name: 'status',
      type: 'string',
      description: 'Optional status enum filter',
      optional: true,
    },
  ],
  async execute(args, companyId, accessToken) {
    const entityType = typeof args.entityType === 'string' ? args.entityType.trim() : ''
    const cfg = COUNT_ENTITY_CONFIG[entityType]
    if (!cfg) {
      throw new Error(
        `Unknown entityType: "${entityType}". Valid values: ${Object.keys(COUNT_ENTITY_CONFIG).join(', ')}`
      )
    }

    const where: WhereClause = { [cfg.companyField]: { some: { id: { eq: companyId } } } }
    withName(where, args.nameContains)
    withEnum(where, 'status', args.status)

    const data = await graphqlRequest({
      // whereType is code-controlled (from the hardcoded config above), never user input
      query: `
        query CountEntities($where: ${cfg.whereType}) {
          ${cfg.connection}(where: $where) {
            aggregate { count { nodes } }
          }
        }
      `,
      variables: { where },
      accessToken,
    })

    return { data, toolName: 'countEntities', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool: getCompanyOverview
// ─────────────────────────────────────────────────────────────────────────────

const getCompanyOverview: ToolDefinition = {
  name: 'getCompanyOverview',
  description:
    'Get a high-level overview of the company architecture: all entity lists and key metrics. Use for broad questions like "what does our architecture look like" or "give me an overview".',
  argsSchema: [],
  async execute(args, companyId, accessToken) {
    const data = await graphqlRequest({
      query: `
        query CompanyOverview($where: CompanyWhere) {
          companies(where: $where, limit: 1) {
            id name description industry size sovereigntyScorePercent sovereigntyScoreStatus
            achievedSovereigntyScore expectedSovereigntyScore
            ownedApplications { id name status criticality vendor }
            ownedCapabilities { id name status maturityLevel }
            organisations { id name type }
            ownedSuppliers { id name supplierType strategicImportance }
            ownedInfrastructure { id name infrastructureType status }
            ownedInterfaces { id name interfaceType status }
            ownedDataObjects { id name classification }
            ownedAIComponents { id name aiType status }
            employees { id firstName lastName department role }
          }
        }
      `,
      variables: { where: { id: { eq: companyId } } },
      accessToken,
    })

    return { data, toolName: 'getCompanyOverview', argsUsed: args }
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export const TOOLS: Readonly<Record<string, ToolDefinition>> = {
  listApplications,
  listBusinessCapabilities,
  listApplicationInterfaces,
  listDataObjects,
  listInfrastructures,
  listBusinessProcesses,
  listAIComponents,
  listSuppliers,
  listOrganisations,
  listPeople,
  countEntities,
  getCompanyOverview,
}

// ─────────────────────────────────────────────────────────────────────────────
// LLM prompt section — one compact block per tool
// ─────────────────────────────────────────────────────────────────────────────

export const TOOLS_PROMPT_SECTION: string = Object.values(TOOLS)
  .map(tool => {
    if (tool.argsSchema.length === 0) {
      return `${tool.name}()\n  ${tool.description}`
    }
    const argsStr = tool.argsSchema
      .map(a => `    ${a.name}${a.optional ? '?' : ''}: ${a.type} — ${a.description}`)
      .join('\n')
    return `${tool.name}:\n  ${tool.description}\n  Args:\n${argsStr}`
  })
  .join('\n\n')
