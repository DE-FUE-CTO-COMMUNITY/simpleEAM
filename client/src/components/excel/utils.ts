import { ApolloClient } from '@apollo/client'
import { getMutationsByEntityType } from './graphql'
import {
  ApplicationStatus,
  CriticalityLevel,
  DataClassification,
  InterfaceType,
  InterfaceStatus,
  ArchitectureDomain,
  ArchitectureType,
  PrincipleCategory,
  PrinciplePriority,
} from '../../gql/generated'

// Helper function to parse comma-separated relationship IDs
export const parseRelationshipIds = (value: string | undefined | null): string[] => {
  if (!value || typeof value !== 'string') return []
  return value
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0)
}

// Helper function to get relationship field names for each entity type
export const getRelationshipFields = (entityType: string): string[] => {
  switch (entityType) {
    case 'businessCapabilities':
      return ['owners', 'parents']
    case 'applications':
      return ['owners', 'supportsCapabilities', 'usesDataObjects', 'partOfArchitectures']
    case 'dataObjects':
      return [
        'owners',
        'dataSources',
        'usedByApplications',
        'relatedToCapabilities',
        'transferredInInterfaces',
        'partOfArchitectures',
      ]
    case 'interfaces':
      return [
        'responsiblePerson',
        'sourceApplications',
        'targetApplications',
        'dataObjects',
        'partOfArchitectures',
      ]
    case 'persons':
      return [] // Persons typically don't have relationships in our model
    case 'architectures':
      return [
        'owners',
        'containsApplications',
        'containsCapabilities',
        'containsDataObjects',
        'diagrams',
        'parentArchitecture',
      ]
    case 'diagrams':
      return ['creator', 'architecture']
    case 'architecturePrinciples':
      return ['owners', 'appliedInArchitectures', 'implementedByApplications']
    default:
      return []
  }
}

// Helper function to transform input for UPDATE mutations (wrap scalars in { set: value })
export const transformInputForUpdate = (input: any): any => {
  const transformed: any = {}

  for (const [key, value] of Object.entries(input)) {
    if (key.includes('connect') || key.includes('disconnect') || key.includes('create')) {
      // Relationship fields - keep as is
      transformed[key] = value
    } else if (Array.isArray(value)) {
      // Array fields - wrap in { set: array }
      transformed[key] = { set: value }
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      // Scalar fields - wrap in { set: value }
      transformed[key] = { set: value }
    } else {
      // Other types - keep as is
      transformed[key] = value
    }
  }

  return transformed
}

// Helper function to check if entity exists in database
export const checkEntityExists = async (
  client: ApolloClient<any>,
  entityType: string,
  id: string
): Promise<boolean> => {
  const mutations = getMutationsByEntityType(entityType)
  if (!mutations?.check) {
    throw new Error(`No check mutation found for entity type: ${entityType}`)
  }

  try {
    const result = await client.query({
      query: mutations.check,
      variables: { id },
    })

    // Check based on entity type
    switch (entityType) {
      case 'businessCapabilities':
        return result.data?.businessCapabilities?.length > 0
      case 'applications':
        return result.data?.applications?.length > 0
      case 'dataObjects':
        return result.data?.dataObjects?.length > 0
      case 'interfaces':
        return result.data?.applicationInterfaces?.length > 0
      case 'persons':
        return result.data?.people?.length > 0
      case 'architectures':
        return result.data?.architectures?.length > 0
      case 'diagrams':
        return result.data?.diagrams?.length > 0
      case 'architecturePrinciples':
        return result.data?.architecturePrinciples?.length > 0
      default:
        return false
    }
  } catch (error) {
    console.error(`Error checking entity existence for ${entityType}:`, error)
    return false
  }
}

// Helper function to create entity input based on entity type and row data
export const createEntityInput = (entityType: string, row: any): any => {
  switch (entityType) {
    case 'businessCapabilities':
      return {
        id: row.id || '',
        name: row.name || '',
        description: row.description || '',
        level: row.level || 1,
        businessValue: row.businessValue || '',
        kpiDescription: row.kpiDescription || '',
        informationConcept: row.informationConcept || '',
        isActive: row.isActive === 'true' || row.isActive === true || row.isActive === 1,
      }

    case 'applications': {
      const validStatus = Object.values(ApplicationStatus).includes(
        row.status?.toUpperCase() as ApplicationStatus
      )
        ? (row.status.toUpperCase() as ApplicationStatus)
        : ApplicationStatus.ACTIVE

      const validCriticality = Object.values(CriticalityLevel).includes(
        row.criticality?.toUpperCase() as CriticalityLevel
      )
        ? (row.criticality.toUpperCase() as CriticalityLevel)
        : CriticalityLevel.MEDIUM

      return {
        id: row.id || '',
        name: row.name || '',
        description: row.description || '',
        version: row.version || '',
        status: validStatus,
        criticality: validCriticality,
        documentation: row.documentation || '',
        technicalSpecification: row.technicalSpecification || '',
        vendor: row.vendor || '',
        licenseDetails: row.licenseDetails || '',
        operatingSystem: row.operatingSystem || '',
        hostingEnvironment: row.hostingEnvironment || '',
        maintenanceWindow: row.maintenanceWindow || '',
        deploymentModel: row.deploymentModel || '',
      }
    }

    case 'dataObjects': {
      const validClassification = Object.values(DataClassification).includes(
        row.classification?.toUpperCase() as DataClassification
      )
        ? (row.classification.toUpperCase() as DataClassification)
        : DataClassification.INTERNAL

      return {
        id: row.id || '',
        name: row.name || '',
        description: row.description || '',
        classification: validClassification,
        dataFormat: row.dataFormat || '',
        storageLocation: row.storageLocation || '',
        retentionPeriod: row.retentionPeriod || '',
        backupFrequency: row.backupFrequency || '',
        complianceNotes: row.complianceNotes || '',
        isActive: row.isActive === 'true' || row.isActive === true || row.isActive === 1,
      }
    }

    case 'interfaces': {
      const validType = Object.values(InterfaceType).includes(
        row.type?.toUpperCase() as InterfaceType
      )
        ? (row.type.toUpperCase() as InterfaceType)
        : InterfaceType.API

      const validStatus = Object.values(InterfaceStatus).includes(
        row.status?.toUpperCase() as InterfaceStatus
      )
        ? (row.status.toUpperCase() as InterfaceStatus)
        : InterfaceStatus.ACTIVE

      return {
        id: row.id || '',
        name: row.name || '',
        description: row.description || '',
        type: validType,
        status: validStatus,
        protocol: row.protocol || '',
        endpoint: row.endpoint || '',
        authentication: row.authentication || '',
        dataFormat: row.dataFormat || '',
        frequency: row.frequency || '',
        errorHandling: row.errorHandling || '',
        monitoringDetails: row.monitoringDetails || '',
        documentation: row.documentation || '',
      }
    }

    case 'persons':
      return {
        id: row.id || '',
        firstName: row.firstName || '',
        lastName: row.lastName || '',
        email: row.email || '',
        department: row.department || '',
        jobTitle: row.jobTitle || '',
        phone: row.phone || '',
        location: row.location || '',
        isActive: row.isActive === 'true' || row.isActive === true || row.isActive === 1,
      }

    case 'architectures': {
      const validDomain = Object.values(ArchitectureDomain).includes(
        row.domain?.toUpperCase() as ArchitectureDomain
      )
        ? (row.domain.toUpperCase() as ArchitectureDomain)
        : ArchitectureDomain.BUSINESS

      const validType = Object.values(ArchitectureType).includes(
        row.type?.toUpperCase() as ArchitectureType
      )
        ? (row.type.toUpperCase() as ArchitectureType)
        : ArchitectureType.CONCEPTUAL

      return {
        id: row.id || '',
        name: row.name || '',
        description: row.description || '',
        domain: validDomain,
        type: validType,
        version: row.version || '',
        status: row.status || '',
        validFrom: row.validFrom || '',
        validTo: row.validTo || '',
        documentation: row.documentation || '',
        stakeholders: row.stakeholders || '',
        isActive: row.isActive === 'true' || row.isActive === true || row.isActive === 1,
      }
    }

    case 'diagrams':
      return {
        title: row.title || row.name || '',
        description: row.description || '',
        diagramJson: row.diagramJson || row.content || '{}',
      }

    case 'architecturePrinciples': {
      const validCategory = Object.values(PrincipleCategory).includes(
        row.category?.toUpperCase() as PrincipleCategory
      )
        ? (row.category.toUpperCase() as PrincipleCategory)
        : PrincipleCategory.BUSINESS

      const validPriority = Object.values(PrinciplePriority).includes(
        row.priority?.toUpperCase() as PrinciplePriority
      )
        ? (row.priority.toUpperCase() as PrinciplePriority)
        : PrinciplePriority.MEDIUM

      const tags = row.tags
        ? row.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
        : []

      return {
        name: row.name || '',
        description: row.description || '',
        category: validCategory,
        priority: validPriority,
        rationale: row.rationale || '',
        implications: row.implications || '',
        tags: tags,
        isActive: row.isActive === 'true' || row.isActive === true || row.isActive === 1,
      }
    }

    default:
      throw new Error(`Unsupported entity type: ${entityType}`)
  }
}

// Helper function to map relationship IDs using entity mappings
export const mapRelationshipValues = (
  row: any,
  entityType: string,
  allEntityMappings: { [originalId: string]: string }
): any => {
  const updatedRow = { ...row }
  const relationshipFields = getRelationshipFields(entityType)

  relationshipFields.forEach(field => {
    if (row[field]) {
      const originalIds = parseRelationshipIds(row[field])
      const mappedIds = originalIds
        .map(originalId => allEntityMappings[originalId] || originalId)
        .filter(id => id)

      if (mappedIds.length > 0) {
        updatedRow[field] = mappedIds.join(',')
      }
    }
  })

  return updatedRow
}
