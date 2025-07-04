import { ElementType } from '@/graphql/library'

interface DatabaseElementReference {
  id: string
  elementType: ElementType | 'businessCapability' // Fix: Legacy-Typ für Rückwärtskompatibilität
  originalElement: any
}

interface DiagramElement {
  id: string
  type: string
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?: ElementType | 'businessCapability' // Fix: Legacy-Typ für Rückwärtskompatibilität
    originalElement?: any
    isMainElement?: boolean
    mainElementId?: string
  }
}

interface DiagramData {
  elements: DiagramElement[]
}

/**
 * Extrahiert alle Datenbankelemente-Referenzen aus den Diagrammdaten
 * @param diagramJsonString JSON-String des Excalidraw-Diagramms
 * @returns Array von Datenbankelement-Referenzen
 */
export const extractDatabaseElementsFromDiagram = (
  diagramJsonString: string
): DatabaseElementReference[] => {
  try {
    const diagramData: DiagramData = JSON.parse(diagramJsonString)
    const databaseElements: DatabaseElementReference[] = []
    const processedElements = new Set<string>() // Verhindert Duplikate

    if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
      return []
    }

    for (const element of diagramData.elements) {
      // Nur Elemente mit Datenbank-Referenzen verarbeiten
      if (!element.customData?.isFromDatabase) {
        continue
      }

      // Hauptelemente: Enthalten alle Metadaten
      if (element.customData.isMainElement && element.customData.databaseId) {
        const elementId = element.customData.databaseId

        // Duplikate vermeiden
        if (processedElements.has(elementId)) {
          continue
        }

        processedElements.add(elementId)

        const dbElement = {
          id: elementId,
          elementType:
            element.customData.elementType === 'businessCapability'
              ? 'capability'
              : element.customData.elementType!, // Normalisiere legacy elementType
          originalElement: element.customData.originalElement,
        }

        databaseElements.push(dbElement)
      }
      // Untergeordnete Elemente: Verweisen auf Hauptelement
      else if (element.customData.mainElementId) {
        // Finde das Hauptelement
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
            originalElement: mainElement.customData.originalElement,
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
    dataObjects: [] as string[],
    interfaces: [] as string[],
  }

  for (const element of elements) {
    // Normalisiere businessCapability zu capability für Rückwärtskompatibilität
    const normalizedElementType =
      element.elementType === 'businessCapability' ? 'capability' : element.elementType

    switch (normalizedElementType) {
      case 'capability':
        grouped.capabilities.push(element.id)
        break
      case 'application':
        grouped.applications.push(element.id)
        break
      case 'dataObject':
        grouped.dataObjects.push(element.id)
        break
      case 'interface':
      case 'applicationInterface': // Fix: Beide Varianten unterstützen
        grouped.interfaces.push(element.id)
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

  // Capabilities
  relationships.containsCapabilities = {
    disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
    ...(grouped.capabilities.length > 0 && {
      connect: createConnectClause(grouped.capabilities),
    }),
  }

  // Applications
  relationships.containsApplications = {
    disconnect: [{ where: {} }],
    ...(grouped.applications.length > 0 && {
      connect: createConnectClause(grouped.applications),
    }),
  }

  // Data Objects
  relationships.containsDataObjects = {
    disconnect: [{ where: {} }],
    ...(grouped.dataObjects.length > 0 && {
      connect: createConnectClause(grouped.dataObjects),
    }),
  }

  // Interfaces
  relationships.containsInterfaces = {
    disconnect: [{ where: {} }],
    ...(grouped.interfaces.length > 0 && {
      connect: createConnectClause(grouped.interfaces),
    }),
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
    dataObjects: grouped.dataObjects,
    interfaces: grouped.interfaces,
  }
  return linkingData
}
