import { ApolloClient } from '@apollo/client'
import { getMutationsByEntityType } from './graphql'
import {
  ApplicationStatus,
  CriticalityLevel,
  DataClassification,
  InterfaceType,
  InterfaceStatus,
  InterfaceProtocol,
  InfrastructureType,
  InfrastructureStatus,
  ArchitectureDomain,
  ArchitectureType,
  PrincipleCategory,
  PrinciplePriority,
  CapabilityStatus,
  CapabilityType,
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
      return [
        'owners',
        'parents',
        'children',
        'supportedByApplications',
        'partOfArchitectures',
        'relatedDataObjects',
        'depictedInDiagrams',
      ]
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
    case 'infrastructures':
      return [
        'owners',
        'hostsApplications',
        'partOfArchitectures',
        'depictedInDiagrams',
        'parentInfrastructure',
        'childInfrastructures',
      ]
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
      case 'infrastructures':
        return result.data?.infrastructures?.length > 0
      default:
        return false
    }
  } catch (error) {
    console.error(`Error checking entity existence for ${entityType}:`, error)
    return false
  }
}

// Helper function to update databaseId references in diagramJson
export const updateDiagramJsonDatabaseIds = (
  diagramJson: string,
  entityMappings: { [originalId: string]: string }
): string => {
  try {
    const diagramData = JSON.parse(diagramJson)

    // Update databaseId in elements' customFields
    if (diagramData.elements && Array.isArray(diagramData.elements)) {
      diagramData.elements.forEach((element: any) => {
        if (element.customFields && element.customFields.databaseId) {
          const originalId = element.customFields.databaseId
          const newId = entityMappings[originalId]
          if (newId) {
            console.log(`DEBUG: Updating diagram element databaseId from ${originalId} to ${newId}`)
            element.customFields.databaseId = newId
          }
        }
      })
    }

    return JSON.stringify(diagramData)
  } catch (error) {
    console.warn('Failed to update databaseId references in diagramJson:', error)
    return diagramJson // Return original if parsing fails
  }
}

// Helper function to create entity input based on entity type and row data
export const createEntityInput = (
  entityType: string,
  row: any,
  allEntityMappings?: { [originalId: string]: string }
): any => {
  // Helper function to generate a fallback name if name is empty
  const generateFallbackName = (prefix: string, row: any): string => {
    // Für Diagramme: Verwende 'title' statt 'name'
    const nameField = entityType === 'diagrams' ? 'title' : 'name'

    if (row[nameField] && row[nameField].trim()) {
      return row[nameField].trim()
    }

    // Generate fallback name based on available data
    if (row.id && row.id.trim()) {
      return `${prefix} ${row.id}`
    }

    // Use description as fallback
    if (row.description && row.description.trim()) {
      const desc = row.description.trim()
      return desc.length > 50 ? `${desc.substring(0, 47)}...` : desc
    }

    // Last resort: use timestamp
    const fallbackName = `${prefix} ${new Date().toISOString()}`
    console.log(
      `DEBUG: Generated fallback name "${fallbackName}" for row:`,
      JSON.stringify(row, null, 2)
    )
    return fallbackName
  }

  switch (entityType) {
    case 'businessCapabilities': {
      const validStatus = Object.values(CapabilityStatus).includes(
        row.status?.toUpperCase() as CapabilityStatus
      )
        ? (row.status.toUpperCase() as CapabilityStatus)
        : CapabilityStatus.ACTIVE

      const validType =
        row.type &&
        Object.values(CapabilityType).includes(row.type?.toUpperCase() as CapabilityType)
          ? (row.type.toUpperCase() as CapabilityType)
          : undefined

      return {
        name: generateFallbackName('Business Capability', row),
        description: row.description || '',
        status: validStatus,
        type: validType,
        // Numerische Felder
        businessValue:
          typeof row.businessValue === 'number'
            ? row.businessValue
            : row.businessValue
              ? parseInt(row.businessValue, 10)
              : undefined,
        maturityLevel:
          typeof row.maturityLevel === 'number'
            ? row.maturityLevel
            : row.maturityLevel
              ? parseInt(row.maturityLevel, 10)
              : undefined,
        sequenceNumber:
          typeof row.sequenceNumber === 'number'
            ? row.sequenceNumber
            : row.sequenceNumber
              ? parseInt(row.sequenceNumber, 10)
              : undefined,
        // Datum-Felder
        introductionDate: row.introductionDate ? new Date(row.introductionDate) : undefined,
        endDate: row.endDate ? new Date(row.endDate) : undefined,
        // Tags-Array
        tags: Array.isArray(row.tags)
          ? row.tags
          : typeof row.tags === 'string' && row.tags.trim()
            ? row.tags.split(',').map((t: string) => t.trim())
            : undefined,
        // updatedAt für Excel
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      }
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
        name: generateFallbackName('Application', row),
        description: row.description || '',
        version: row.version || '',
        status: validStatus,
        criticality: validCriticality,
        vendor: row.vendor || '',
        hostingEnvironment: row.hostingEnvironment || '',
        // Numerische Felder
        costs:
          typeof row.costs === 'number' ? row.costs : row.costs ? parseFloat(row.costs) : undefined,
        // Datum-Felder
        introductionDate: row.introductionDate ? new Date(row.introductionDate) : undefined,
        endOfLifeDate: row.endOfLifeDate ? new Date(row.endOfLifeDate) : undefined,
        endOfUseDate: row.endOfUseDate ? new Date(row.endOfUseDate) : undefined,
        planningDate: row.planningDate ? new Date(row.planningDate) : undefined,
        // Array-Felder
        technologyStack: Array.isArray(row.technologyStack)
          ? row.technologyStack
          : typeof row.technologyStack === 'string' && row.technologyStack.trim()
            ? row.technologyStack.split(',').map((t: string) => t.trim())
            : undefined,
        // updatedAt für Excel
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      }
    }

    case 'dataObjects': {
      const validClassification = Object.values(DataClassification).includes(
        row.classification?.toUpperCase() as DataClassification
      )
        ? (row.classification.toUpperCase() as DataClassification)
        : DataClassification.INTERNAL

      return {
        name: generateFallbackName('Data Object', row),
        description: row.description || '',
        classification: validClassification,
        format: row.format || '',
        // Datum-Felder
        introductionDate: row.introductionDate ? new Date(row.introductionDate) : undefined,
        endOfLifeDate: row.endOfLifeDate ? new Date(row.endOfLifeDate) : undefined,
        endOfUseDate: row.endOfUseDate ? new Date(row.endOfUseDate) : undefined,
        planningDate: row.planningDate ? new Date(row.planningDate) : undefined,
        // updatedAt für Excel
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      }
    }

    case 'interfaces': {
      const validInterfaceType = Object.values(InterfaceType).includes(
        row.interfaceType?.toUpperCase() as InterfaceType
      )
        ? (row.interfaceType.toUpperCase() as InterfaceType)
        : Object.values(InterfaceType).includes(row.type?.toUpperCase() as InterfaceType)
          ? (row.type.toUpperCase() as InterfaceType)
          : InterfaceType.OTHER

      const validStatus = Object.values(InterfaceStatus).includes(
        row.status?.toUpperCase() as InterfaceStatus
      )
        ? (row.status.toUpperCase() as InterfaceStatus)
        : InterfaceStatus.PLANNED

      const validProtocol = Object.values(InterfaceProtocol).includes(
        row.protocol?.toUpperCase() as InterfaceProtocol
      )
        ? (row.protocol.toUpperCase() as InterfaceProtocol)
        : undefined

      return {
        name: generateFallbackName('Interface', row),
        description: row.description || '',
        interfaceType: validInterfaceType,
        status: validStatus,
        protocol: validProtocol,
        version: row.version || '',
        // Datums-Felder
        introductionDate: row.introductionDate ? new Date(row.introductionDate) : undefined,
        planningDate: row.planningDate ? new Date(row.planningDate) : undefined,
        endOfUseDate: row.endOfUseDate ? new Date(row.endOfUseDate) : undefined,
        endOfLifeDate: row.endOfLifeDate ? new Date(row.endOfLifeDate) : undefined,
      }
    }

    case 'persons':
      return {
        firstName: row.firstName || generateFallbackName('Person', row).split(' ')[0] || 'Vorname',
        lastName:
          row.lastName ||
          generateFallbackName('Person', row).split(' ').slice(1).join(' ') ||
          'Nachname',
        email: row.email || '',
        department: row.department || '',
        role: row.role || '',
        phone: row.phone || '',
        avatarUrl: row.avatarUrl || '',
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      }

    case 'architectures': {
      const validDomain = Object.values(ArchitectureDomain).includes(
        row.domain?.toUpperCase() as ArchitectureDomain
      )
        ? (row.domain.toUpperCase() as ArchitectureDomain)
        : ArchitectureDomain.ENTERPRISE

      const validType = Object.values(ArchitectureType).includes(
        row.type?.toUpperCase() as ArchitectureType
      )
        ? (row.type.toUpperCase() as ArchitectureType)
        : ArchitectureType.CURRENT_STATE

      return {
        name: generateFallbackName('Architecture', row),
        description: row.description || '',
        domain: validDomain,
        type: validType,
        timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
        tags: row.tags ? parseRelationshipIds(row.tags) : [],
      }
    }

    case 'diagrams': {
      const baseJson =
        row.diagramJson ||
        row.content ||
        '{"elements":[],"appState":{"currentChartType":"whiteboard"}}'

      // Update databaseId references if mappings are available
      const updatedJson = allEntityMappings
        ? updateDiagramJsonDatabaseIds(baseJson, allEntityMappings)
        : baseJson

      return {
        title: row.title || row.name || generateFallbackName('Diagram', row),
        description: row.description || '',
        diagramJson: updatedJson,
      }
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
        name: generateFallbackName('Architecture Principle', row),
        description: row.description || '',
        category: validCategory,
        priority: validPriority,
        rationale: row.rationale || '',
        implications: row.implications || '',
        tags: tags,
        isActive: row.isActive === 'true' || row.isActive === true || row.isActive === 1,
      }
    }

    case 'infrastructures': {
      const validInfrastructureType = Object.values(InfrastructureType).includes(
        row.infrastructureType?.toUpperCase() as InfrastructureType
      )
        ? (row.infrastructureType.toUpperCase() as InfrastructureType)
        : Object.values(InfrastructureType).includes(row.type?.toUpperCase() as InfrastructureType)
          ? (row.type.toUpperCase() as InfrastructureType)
          : InfrastructureType.PHYSICAL_SERVER

      const validStatus = Object.values(InfrastructureStatus).includes(
        row.status?.toUpperCase() as InfrastructureStatus
      )
        ? (row.status.toUpperCase() as InfrastructureStatus)
        : InfrastructureStatus.PLANNED

      return {
        name: generateFallbackName('Infrastructure', row),
        description: row.description || '',
        infrastructureType: validInfrastructureType,
        status: validStatus,
        location: row.location || '',
        capacity: row.capacity || '',
        costs: row.costs ? parseFloat(row.costs.toString()) : undefined,
        vendor: row.vendor || '',
        operatingSystem: row.operatingSystem || '',
        ipAddress: row.ipAddress || '',
        specifications: row.specifications || '',
        maintenanceWindow: row.maintenanceWindow || '',
        // Datums-Felder
        introductionDate: row.introductionDate ? new Date(row.introductionDate) : undefined,
        planningDate: row.planningDate ? new Date(row.planningDate) : undefined,
        endOfUseDate: row.endOfUseDate ? new Date(row.endOfUseDate) : undefined,
        endOfLifeDate: row.endOfLifeDate ? new Date(row.endOfLifeDate) : undefined,
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

  console.log(
    `DEBUG MAP_RELATIONSHIPS: Processing ${entityType} with ${Object.keys(allEntityMappings).length} total mappings`
  )

  relationshipFields.forEach(field => {
    if (row[field]) {
      let originalIds: string[] = []

      // Handle different formats of relationship data
      if (Array.isArray(row[field])) {
        // JSON format: Array of objects with id property
        originalIds = row[field]
          .map((item: any) => {
            if (typeof item === 'string') {
              return item
            } else if (typeof item === 'object' && item.id) {
              return item.id
            }
            return null
          })
          .filter((id: string | null) => id !== null)
      } else if (typeof row[field] === 'string') {
        // Excel format: comma-separated string
        originalIds = parseRelationshipIds(row[field])
      } else if (typeof row[field] === 'object' && row[field].id) {
        // Single object with id
        originalIds = [row[field].id]
      }

      console.log(`DEBUG MAP_RELATIONSHIPS: Field "${field}" - originalIds:`, originalIds)

      if (originalIds.length > 0) {
        const mappedIds = originalIds
          .map(originalId => {
            const mappedId = allEntityMappings[originalId] || originalId
            console.log(
              `DEBUG MAP_RELATIONSHIPS: Mapping ${originalId} -> ${mappedId} (found: ${!!allEntityMappings[originalId]})`
            )
            return mappedId
          })
          .filter(id => id)

        console.log(`DEBUG MAP_RELATIONSHIPS: Field "${field}" - mappedIds:`, mappedIds)

        if (mappedIds.length > 0) {
          updatedRow[field] = mappedIds.join(',')
        }
      }
    }
  })

  return updatedRow
}
