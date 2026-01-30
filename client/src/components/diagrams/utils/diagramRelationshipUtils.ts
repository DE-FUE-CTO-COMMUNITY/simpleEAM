import { ElementType } from '@/graphql/library'

interface DatabaseElementReference {
  id: string
  elementType: ElementType | 'businessCapability' // Fix: Legacy-Typ für Rückwärtskompatibilität
  elementName: string // Optimierung: Nur der Name statt kompletter originalElement
}

interface DiagramElement {
  id: string
  type: string
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?: ElementType | 'businessCapability' // Fix: Legacy type for backward compatibility
    elementName?: string // Optimization: Only the name instead of complete originalElement
    originalElement?: any // Kept for backward compatibility
    isMainElement?: boolean
    mainElementId?: string
  }
}

interface DiagramData {
  elements: DiagramElement[]
}

/**
 * Extracts all database element references from diagram data
 * @param diagramJsonString JSON string of the Excalidraw diagram
 * @returns Array of database element references
 */
export const extractDatabaseElementsFromDiagram = (
  diagramJsonString: string
): DatabaseElementReference[] => {
  try {
    const diagramData: DiagramData = JSON.parse(diagramJsonString)
    const databaseElements: DatabaseElementReference[] = []
    const processedElements = new Set<string>() // Prevents duplicates

    if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
      return []
    }

    for (const element of diagramData.elements) {
      // Only process elements with database references
      if (!element.customData?.isFromDatabase) {
        continue
      }

      // Main elements: Contain all metadata
      if (element.customData.isMainElement && element.customData.databaseId) {
        const elementId = element.customData.databaseId

        // Avoid duplicates
        if (processedElements.has(elementId)) {
          continue
        }

        processedElements.add(elementId)

        const dbElement = {
          id: elementId,
          elementType: (element.customData.elementType === 'businessCapability'
            ? 'businessCapability'
            : element.customData.elementType!) as ElementType, // Normalize legacy elementType
          elementName:
            element.customData.elementName || element.customData.originalElement?.name || '',
        }

        databaseElements.push(dbElement)
      }
      // Child elements: Reference main element
      else if (element.customData.mainElementId) {
        // Find the main element
        const mainElement = diagramData.elements.find(
          el => el.id === element.customData!.mainElementId
        )

        if (mainElement?.customData?.isMainElement && mainElement.customData.databaseId) {
          const elementId = mainElement.customData.databaseId

          // Duplikate vermeiden
          if (processedElements.has(elementId)) {
            continue
          }

          processedElements.add(elementId)

          databaseElements.push({
            id: elementId,
            elementType: mainElement.customData.elementType!,
            elementName:
              mainElement.customData.elementName ||
              mainElement.customData.originalElement?.name ||
              '',
          })
        }
      }
    }

    return databaseElements
  } catch (error) {
    console.error('❌ Fehler beim Extrahieren der Datenbankelemente:', error)
    return []
  }
}

/**
 * Gruppiert Datenbankelemente nach ihrem Typ für GraphQL-Mutations
 * @param elements Array von Datenbankelement-Referenzen
 * @returns Objekt mit Arrays für jeden Elementtyp
 */
export const groupElementsByType = (elements: DatabaseElementReference[]) => {
  const grouped = {
    capabilities: [] as string[],
    applications: [] as string[],
    aiComponents: [] as string[],
    dataObjects: [] as string[],
    interfaces: [] as string[],
    infrastructures: [] as string[],
  }

  for (const element of elements) {
    // Normalisiere businessCapability zu capability für Rückwärtskompatibilität
    const normalizedElementType =
      element.elementType === 'businessCapability' ? 'businessCapability' : element.elementType

    switch (normalizedElementType) {
      case 'businessCapability':
        grouped.capabilities.push(element.id)
        break
      case 'application':
        grouped.applications.push(element.id)
        break
      case 'aiComponent':
        grouped.aiComponents.push(element.id)
        break
      case 'dataObject':
        grouped.dataObjects.push(element.id)
        break
      case 'interface':
      case 'applicationInterface': // Fix: Beide Varianten unterstützen
        grouped.interfaces.push(element.id)
        break
      case 'infrastructure':
        grouped.infrastructures.push(element.id)
        break
      default:
        console.warn('⚠️ Unbekannter elementType:', element.elementType, 'für Element:', element.id)
    }
  }

  return grouped
}

/**
 * Erstellt GraphQL-Connect-Klauseln für die Beziehungen
 * @param elementIds Array von Element-IDs
 * @returns GraphQL-Connect-Array
 */
export const createConnectClause = (elementIds: string[]) => {
  return elementIds.map(id => ({
    where: {
      node: { id: { eq: id } },
    },
  }))
}

/**
 * Erstellt die kompletten Relationship-Updates für ein Diagramm
 * @param diagramJsonString JSON-String des Diagramms
 * @returns Objekt mit allen Relationship-Updates
 */
export const createDiagramRelationshipUpdates = (diagramJsonString: string) => {
  const elements = extractDatabaseElementsFromDiagram(diagramJsonString)
  const grouped = groupElementsByType(elements)

  const relationships: any = {}

  // Capabilities
  if (grouped.capabilities.length > 0) {
    relationships.containsCapabilities = {
      connect: createConnectClause(grouped.capabilities),
    }
  }

  // Applications
  if (grouped.applications.length > 0) {
    relationships.containsApplications = {
      connect: createConnectClause(grouped.applications),
    }
  }

  // Data Objects
  if (grouped.dataObjects.length > 0) {
    relationships.containsDataObjects = {
      connect: createConnectClause(grouped.dataObjects),
    }
  }

  // Interfaces
  if (grouped.interfaces.length > 0) {
    relationships.containsInterfaces = {
      connect: createConnectClause(grouped.interfaces),
    }
  }

  // Infrastructure
  if (grouped.infrastructures.length > 0) {
    relationships.containsInfrastructure = {
      connect: createConnectClause(grouped.infrastructures),
    }
  }

  return relationships
}

/**
 * Erstellt Relationship-Updates mit Disconnect für bestehende Diagramme
 * @param diagramJsonString JSON-String des Diagramms
 * @returns Objekt mit Disconnect/Connect-Updates
 */
export const createDiagramRelationshipUpdatesWithDisconnect = (diagramJsonString: string) => {
  const elements = extractDatabaseElementsFromDiagram(diagramJsonString)
  const grouped = groupElementsByType(elements)

  const relationships: any = {}

  // Capabilities - nur Disconnect wenn keine neuen Connections
  if (grouped.capabilities.length > 0) {
    relationships.containsCapabilities = {
      disconnect: [{ where: {} }],
      connect: createConnectClause(grouped.capabilities),
    }
  } else {
    relationships.containsCapabilities = {
      disconnect: [{ where: {} }],
    }
  }

  // Applications
  if (grouped.applications.length > 0) {
    relationships.containsApplications = {
      disconnect: [{ where: {} }],
      connect: createConnectClause(grouped.applications),
    }
  } else {
    relationships.containsApplications = {
      disconnect: [{ where: {} }],
    }
  }

  // Data Objects
  if (grouped.dataObjects.length > 0) {
    relationships.containsDataObjects = {
      disconnect: [{ where: {} }],
      connect: createConnectClause(grouped.dataObjects),
    }
  } else {
    relationships.containsDataObjects = {
      disconnect: [{ where: {} }],
    }
  }

  // Interfaces
  if (grouped.interfaces.length > 0) {
    relationships.containsInterfaces = {
      disconnect: [{ where: {} }],
      connect: createConnectClause(grouped.interfaces),
    }
  } else {
    relationships.containsInterfaces = {
      disconnect: [{ where: {} }],
    }
  }

  // Infrastructure
  if (grouped.infrastructures.length > 0) {
    relationships.containsInfrastructure = {
      disconnect: [{ where: {} }],
      connect: createConnectClause(grouped.infrastructures),
    }
  } else {
    relationships.containsInfrastructure = {
      disconnect: [{ where: {} }],
    }
  }

  return relationships
}

/**
 * Erstellt Architektur-Verknüpfungen für alle Elemente im Diagramm
 * @param diagramJsonString JSON-String des Diagramms
 * @param architectureId ID der Architektur, mit der alle Elemente verknüpft werden sollen
 * @returns Objekt mit gruppierten Element-IDs für Architektur-Verknüpfungen
 */
export const createArchitectureLinkingUpdates = (
  diagramJsonString: string,
  architectureId: string
) => {
  const elements = extractDatabaseElementsFromDiagram(diagramJsonString)
  const grouped = groupElementsByType(elements)

  const linkingData = {
    architectureId,
    capabilities: grouped.capabilities,
    applications: grouped.applications,
    aiComponents: grouped.aiComponents,
    dataObjects: grouped.dataObjects,
    interfaces: grouped.interfaces,
    infrastructures: grouped.infrastructures,
  }
  return linkingData
}
