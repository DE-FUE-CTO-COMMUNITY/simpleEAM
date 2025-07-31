import { ApolloClient } from '@apollo/client'
import {
  GET_RELATED_ELEMENTS_FOR_CAPABILITY,
  GET_RELATED_ELEMENTS_FOR_APPLICATION,
  GET_RELATED_ELEMENTS_FOR_DATA_OBJECT,
  GET_RELATED_ELEMENTS_FOR_INTERFACE,
  GET_RELATED_ELEMENTS_FOR_INFRASTRUCTURE,
  RelatedElementsResponse,
} from '@/graphql/relatedElements'
import { ArrowType, RelativePosition, AddRelatedElementsConfig } from '../types/addRelatedElements'
import { getValidRelationships, normalizeElementType, ElementType } from './relationshipValidation'

// Extended RelatedElement interface mit reverseArrow support
interface RelatedElement {
  id: string
  name: string
  description?: string
  elementType: 'capability' | 'application' | 'dataObject' | 'interface' | 'infrastructure'
  relationshipType?: string
  reverseArrow?: boolean
  // Element-spezifische Eigenschaften
  status?: string
  criticality?: string
  type?: string
  maturityLevel?: number
  businessValue?: number
  classification?: string
  interfaceType?: string
  infrastructureType?: string
}
import {
  createCapabilityElementsFromTemplate,
  createApplicationElementsFromTemplate,
  createDataObjectElementsFromTemplate,
  createInterfaceElementsFromTemplate,
  createInfrastructureElementsFromTemplate,
} from './elementCreation'

import { findArchimateTemplate, loadArchimateLibrary } from './archimateLibraryUtils'

/**
 * Bestimmt ob ein Pfeil für eine bestimmte Beziehung umgekehrt werden soll
 */
const shouldReverseArrow = (
  sourceElementType: string,
  targetElementType: string,
  relationshipType: string
): boolean => {
  // Normalisiere Element-Typen
  const normalizedSource = normalizeElementType(sourceElementType)
  const normalizedTarget = normalizeElementType(targetElementType)

  if (!normalizedSource || !normalizedTarget) {
    return false
  }

  // Finde gültige Beziehung
  const validRelationships = getValidRelationships(normalizedSource, normalizedTarget)
  const relationship = validRelationships.find(rel => rel.type === relationshipType)

  return relationship?.reverseArrow || false
}
import { generateElementId } from './elementIdManager'

interface CreateRelatedElementsResult {
  success: boolean
  elementsAdded: number
  elements: any[]
  arrows: any[]
  errorMessage?: string
}

/**
 * Lädt verwandte Elemente für ein ausgewähltes Element und erstellt Excalidraw-Elemente
 */
export const loadAndCreateRelatedElements = async (
  apolloClient: ApolloClient<any>,
  selectedElement: any,
  excalidrawAPI: any,
  config: AddRelatedElementsConfig
): Promise<CreateRelatedElementsResult> => {
  try {
    // 1. Extrahiere Element-Informationen
    const databaseId = selectedElement.customData?.databaseId
    const elementType = selectedElement.customData?.elementType

    if (!databaseId || !elementType) {
      return {
        success: false,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Element hat keine Datenbankverknüpfung',
      }
    }

    // 2. Lade verwandte Elemente basierend auf Element-Typ
    const relatedElementsData = await loadRelatedElementsFromDatabase(
      apolloClient,
      selectedElement.customData.databaseId,
      selectedElement.customData.elementType
    )

    if (relatedElementsData.totalElements === 0) {
      return {
        success: true,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Keine verwandten Elemente gefunden',
      }
    }

    // 3. Lade Archimate-Templates
    const library = await loadArchimateLibrary()
    if (!library) {
      return {
        success: false,
        elementsAdded: 0,
        elements: [],
        arrows: [],
        errorMessage: 'Archimate-Bibliothek konnte nicht geladen werden',
      }
    }

    // 4. Erstelle Excalidraw-Elemente
    const result = await createExcalidrawElementsFromRelated(
      relatedElementsData.elements,
      selectedElement,
      library,
      config,
      excalidrawAPI
    )

    return result
  } catch (error) {
    console.error('Error loading and creating related elements:', error)
    return {
      success: false,
      elementsAdded: 0,
      elements: [],
      arrows: [],
      errorMessage: `Fehler beim Laden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
    }
  }
}

/**
 * Lädt verwandte Elemente aus der Datenbank
 */
/**
 * Mappt Element-Typen auf Archimate-Template-Namen
 */
const getArchimateTemplateName = (elementType: string): string => {
  const mapping: Record<string, string> = {
    capability: 'Capability',
    application: 'Application Component',
    dataObject: 'Business Object',
    interface: 'Application Interface',
    applicationInterface: 'Application Interface',
    infrastructure: 'Infrastruktur', // Deutsch statt 'Node'
  }

  return mapping[elementType] || elementType
}

/**
 * Aktualisiert die Element-Bindungen für korrekte Pfeil-Verbindungen
 */
const updateElementBindings = (
  sourceElement: any,
  targetElement: any,
  arrowId: string,
  allNewElements: any[]
): void => {
  // Finde das Ziel-Element in den neuen Elementen und aktualisiere seine boundElements
  const targetInNewElements = allNewElements.find(el => el.id === targetElement.id)
  if (targetInNewElements) {
    if (!targetInNewElements.boundElements) {
      targetInNewElements.boundElements = []
    }

    // Füge die Pfeil-Bindung hinzu, falls nicht bereits vorhanden
    const existingBinding = targetInNewElements.boundElements.find(
      (binding: any) => binding.id === arrowId
    )
    if (!existingBinding) {
      targetInNewElements.boundElements.push({
        id: arrowId,
        type: 'arrow',
      })
    }
  }

  // Hinweis: Das Quell-Element wird später vom Excalidraw-System automatisch aktualisiert
  // wenn die Szene aktualisiert wird, daher müssen wir es hier nicht manuell ändern
}

/**
 * Universelle Funktion zur Erstellung von Elementen aus Archimate-Templates
 */
export const loadRelatedElementsFromDatabase = async (
  apolloClient: ApolloClient<any>,
  elementId: string,
  elementType: string
): Promise<RelatedElementsResponse> => {
  let query
  let queryName: string

  // Normalisiere Element-Typ
  const normalizedElementType = elementType === 'businessCapability' ? 'capability' : elementType

  // Wähle die passende Query
  switch (normalizedElementType) {
    case 'capability':
      query = GET_RELATED_ELEMENTS_FOR_CAPABILITY
      queryName = 'businessCapabilities'
      break
    case 'application':
      query = GET_RELATED_ELEMENTS_FOR_APPLICATION
      queryName = 'applications'
      break
    case 'dataObject':
      query = GET_RELATED_ELEMENTS_FOR_DATA_OBJECT
      queryName = 'dataObjects'
      break
    case 'interface':
    case 'applicationInterface':
      query = GET_RELATED_ELEMENTS_FOR_INTERFACE
      queryName = 'applicationInterfaces'
      break
    case 'infrastructure':
      query = GET_RELATED_ELEMENTS_FOR_INFRASTRUCTURE
      queryName = 'infrastructures'
      break
    default:
      throw new Error(`Unsupported element type: ${elementType}`)
  }

  const result = await apolloClient.query({
    query,
    variables: { id: elementId },
    fetchPolicy: 'network-only',
  })

  const elementDataArray = result.data[queryName]
  if (!elementDataArray || elementDataArray.length === 0) {
    return { elements: [], relationshipTypes: [], totalElements: 0 }
  }

  // Nehme das erste Element aus dem Array
  const elementData = elementDataArray[0]

  // Transformiere die Daten in ein einheitliches Format
  const relatedElements = extractRelatedElementsFromQueryResult(elementData, normalizedElementType)

  return {
    elements: relatedElements,
    relationshipTypes: getRelationshipTypesForElement(normalizedElementType),
    totalElements: relatedElements.length,
  }
}

/**
 * Extrahiert verwandte Elemente aus dem Query-Ergebnis
 */
const extractRelatedElementsFromQueryResult = (
  elementData: any,
  sourceElementType: string
): RelatedElement[] => {
  const relatedElements: RelatedElement[] = []

  // Je nach Quell-Element-Typ verschiedene Beziehungen durchlaufen
  switch (sourceElementType) {
    case 'capability':
      // Applications, die diese Capability unterstützen
      if (elementData.supportedByApplications) {
        elementData.supportedByApplications.forEach((app: any) => {
          relatedElements.push({
            id: app.id,
            name: app.name,
            description: app.description,
            elementType: 'application',
            status: app.status,
            criticality: app.criticality,
            relationshipType: 'SUPPORTS',
            reverseArrow: shouldReverseArrow('capability', 'application', 'SUPPORTS'),
          })
        })
      }

      // Verwandte DataObjects
      if (elementData.relatedDataObjects) {
        elementData.relatedDataObjects.forEach((dataObj: any) => {
          relatedElements.push({
            id: dataObj.id,
            name: dataObj.name,
            description: dataObj.description,
            elementType: 'dataObject',
            classification: dataObj.classification,
            relationshipType: 'RELATED_TO',
            reverseArrow: shouldReverseArrow('capability', 'dataObject', 'RELATED_TO'),
          })
        })
      }

      // Parent und Child Capabilities
      if (elementData.parents) {
        elementData.parents.forEach((parent: any) => {
          relatedElements.push({
            id: parent.id,
            name: parent.name,
            description: parent.description,
            elementType: 'capability',
            status: parent.status,
            type: parent.type,
          })
        })
      }

      if (elementData.children) {
        elementData.children.forEach((child: any) => {
          relatedElements.push({
            id: child.id,
            name: child.name,
            description: child.description,
            elementType: 'capability',
            status: child.status,
            type: child.type,
          })
        })
      }
      break

    case 'application':
      // Unterstützte Capabilities
      if (elementData.supportsCapabilities) {
        elementData.supportsCapabilities.forEach((cap: any) => {
          relatedElements.push({
            id: cap.id,
            name: cap.name,
            description: cap.description,
            elementType: 'capability',
            status: cap.status,
            type: cap.type,
            maturityLevel: cap.maturityLevel,
            businessValue: cap.businessValue,
          })
        })
      }

      // Verwendete DataObjects
      if (elementData.usesDataObjects) {
        elementData.usesDataObjects.forEach((dataObj: any) => {
          relatedElements.push({
            id: dataObj.id,
            name: dataObj.name,
            description: dataObj.description,
            elementType: 'dataObject',
            classification: dataObj.classification,
          })
        })
      }

      // Source und Target Interfaces
      if (elementData.sourceOfInterfaces) {
        elementData.sourceOfInterfaces.forEach((iface: any) => {
          relatedElements.push({
            id: iface.id,
            name: iface.name,
            description: iface.description,
            elementType: 'interface',
            interfaceType: iface.interfaceType,
            relationshipType: 'INTERFACE_SOURCE',
            reverseArrow: false,
          })
        })
      }

      if (elementData.targetOfInterfaces) {
        elementData.targetOfInterfaces.forEach((iface: any) => {
          relatedElements.push({
            id: iface.id,
            name: iface.name,
            description: iface.description,
            elementType: 'interface',
            interfaceType: iface.interfaceType,
            relationshipType: 'INTERFACE_TARGET',
            reverseArrow: true,
          })
        })
      }

      // Hosting Infrastructure
      if (elementData.hostedOn) {
        elementData.hostedOn.forEach((infra: any) => {
          relatedElements.push({
            id: infra.id,
            name: infra.name,
            description: infra.description,
            elementType: 'infrastructure',
            infrastructureType: infra.infrastructureType,
            status: infra.status,
          })
        })
      }
      break

    case 'dataObject':
      // Data Sources (Applications)
      if (elementData.dataSources) {
        elementData.dataSources.forEach((app: any) => {
          relatedElements.push({
            id: app.id,
            name: app.name,
            description: app.description,
            elementType: 'application',
            status: app.status,
            criticality: app.criticality,
          })
        })
      }

      // Applications, die dieses DataObject verwenden
      if (elementData.usedByApplications) {
        elementData.usedByApplications.forEach((app: any) => {
          relatedElements.push({
            id: app.id,
            name: app.name,
            description: app.description,
            elementType: 'application',
            status: app.status,
            criticality: app.criticality,
          })
        })
      }

      // Verwandte Capabilities
      if (elementData.relatedToCapabilities) {
        elementData.relatedToCapabilities.forEach((cap: any) => {
          relatedElements.push({
            id: cap.id,
            name: cap.name,
            description: cap.description,
            elementType: 'capability',
            status: cap.status,
            type: cap.type,
            maturityLevel: cap.maturityLevel,
            businessValue: cap.businessValue,
          })
        })
      }

      // Interfaces, die dieses DataObject übertragen
      if (elementData.transferredInInterfaces) {
        elementData.transferredInInterfaces.forEach((iface: any) => {
          relatedElements.push({
            id: iface.id,
            name: iface.name,
            description: iface.description,
            elementType: 'interface',
            interfaceType: iface.interfaceType,
          })
        })
      }
      break

    case 'interface':
      // Source Applications (als Array behandeln)
      if (elementData.sourceApplications && elementData.sourceApplications.length > 0) {
        elementData.sourceApplications.forEach((app: any) => {
          relatedElements.push({
            id: app.id,
            name: app.name,
            description: app.description,
            elementType: 'application',
            status: app.status,
            criticality: app.criticality,
            relationshipType: 'INTERFACE_SOURCE',
            reverseArrow: true,
          })
        })
      }

      // Target Applications
      if (elementData.targetApplications) {
        elementData.targetApplications.forEach((app: any) => {
          relatedElements.push({
            id: app.id,
            name: app.name,
            description: app.description,
            elementType: 'application',
            status: app.status,
            criticality: app.criticality,
            relationshipType: 'INTERFACE_TARGET',
            reverseArrow: false,
          })
        })
      }

      // Übertragene DataObjects
      if (elementData.dataObjects) {
        elementData.dataObjects.forEach((dataObj: any) => {
          relatedElements.push({
            id: dataObj.id,
            name: dataObj.name,
            description: dataObj.description,
            elementType: 'dataObject',
            classification: dataObj.classification,
          })
        })
      }
      break

    case 'infrastructure':
      // Gehostete Applications
      if (elementData.hostsApplications) {
        elementData.hostsApplications.forEach((app: any) => {
          relatedElements.push({
            id: app.id,
            name: app.name,
            description: app.description,
            elementType: 'application',
            status: app.status,
            criticality: app.criticality,
          })
        })
      }
      break
  }

  // Entferne Duplikate basierend auf ID
  const uniqueElements = relatedElements.filter(
    (element, index, self) => index === self.findIndex(el => el.id === element.id)
  )

  return uniqueElements
}

/**
 * Gibt die Beziehungstypen für einen Element-Typ zurück
 */
const getRelationshipTypesForElement = (elementType: string): string[] => {
  const relationshipMap = {
    capability: ['SUPPORTS', 'RELATES_TO', 'HAS_PARENT', 'HAS_CHILD'],
    application: ['SUPPORTS', 'USES', 'SOURCE_OF', 'TARGET_OF', 'HOSTED_ON'],
    dataObject: ['USED_BY', 'DATA_SOURCE', 'RELATES_TO', 'TRANSFERRED_IN'],
    interface: ['SOURCE', 'TARGET', 'TRANSFERS'],
    infrastructure: ['HOSTS'],
  }

  return relationshipMap[elementType as keyof typeof relationshipMap] || []
}

/**
 * Erstellt Excalidraw-Elemente aus den verwandten Elementen
 */
const createExcalidrawElementsFromRelated = async (
  relatedElements: RelatedElement[],
  selectedElement: any,
  library: any,
  config: AddRelatedElementsConfig,
  excalidrawAPI: any
): Promise<CreateRelatedElementsResult> => {
  const newElements: any[] = []
  const newArrows: any[] = []

  // Filter elements by selected types if specified
  const filteredRelatedElements = config.selectedElementTypes
    ? relatedElements.filter(element => config.selectedElementTypes!.includes(element.elementType))
    : relatedElements

  if (filteredRelatedElements.length === 0) {
    return {
      success: true,
      elementsAdded: 0,
      elements: [],
      arrows: [],
    }
  }

  // Position des ausgewählten Elements
  const sourceX = selectedElement.x
  const sourceY = selectedElement.y
  const sourceWidth = selectedElement.width
  const sourceHeight = selectedElement.height

  console.log('Source element dimensions:', { sourceX, sourceY, sourceWidth, sourceHeight })
  console.log('Config spacing:', config.spacing)

  // Berechne Positionen basierend auf der gewählten Richtung
  const positions = calculateElementPositions(
    filteredRelatedElements,
    { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight },
    config.position,
    config.spacing
  )

  // Erstelle Elemente für jeden verwandten Eintrag
  for (let i = 0; i < filteredRelatedElements.length; i++) {
    const relatedElement = filteredRelatedElements[i]
    const position = positions[i]

    // Finde das passende Template basierend auf Element-Typ
    const templateName = getArchimateTemplateName(relatedElement.elementType)
    const template = findArchimateTemplate(library, templateName)

    if (!template) {
      console.warn(
        `No template found for element type: ${relatedElement.elementType} (template name: ${templateName})`
      )
      continue
    }

    // Erstelle Elemente basierend auf Typ - verwende immer die Template-basierten Funktionen
    let createdElements: any[] = []

    if (relatedElement.elementType === 'capability') {
      createdElements = createCapabilityElementsFromTemplate(
        relatedElement as any,
        'capability',
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'application') {
      createdElements = createApplicationElementsFromTemplate(
        relatedElement as any,
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'dataObject') {
      createdElements = createDataObjectElementsFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'interface') {
      createdElements = createInterfaceElementsFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    } else if (relatedElement.elementType === 'infrastructure') {
      createdElements = createInfrastructureElementsFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    } else {
      // Unbekannter Elementtyp - überspringen
      console.warn(
        `Unbekannter Elementtyp: ${relatedElement.elementType} - Element wird übersprungen`
      )
      continue
    }

    newElements.push(...createdElements)

    // Erstelle Pfeil vom Quell-Element zum neuen Element
    if (createdElements.length > 0) {
      const targetElement = createdElements[0] // Haupt-Element (normalerweise das erste)
      const arrow = createArrowBetweenElements(
        selectedElement,
        targetElement,
        config.arrowType,
        config.position,
        relatedElement.reverseArrow || false,
        i, // Arrow index
        filteredRelatedElements.length // Total arrows count
      )
      newArrows.push(arrow)

      // Aktualisiere boundElements der verbundenen Elemente
      updateElementBindings(selectedElement, targetElement, arrow.id, newElements)
    }
  }

  // Füge die neuen Elemente zum Diagramm hinzu
  if (newElements.length > 0 || newArrows.length > 0) {
    const currentElements = excalidrawAPI.getSceneElements()
    const allNewElements = [...newElements, ...newArrows]

    // Erstelle eine aktualisierte Element-Liste mit korrekten Bindungen
    const updatedCurrentElements = currentElements.map((element: any) => {
      // Prüfe, ob dieses Element das ausgewählte Quell-Element ist
      if (element.id === selectedElement.id) {
        // Aktualisiere boundElements mit neuen Pfeil-Referenzen
        const newBoundElements = [...(element.boundElements || [])]

        newArrows.forEach(arrow => {
          if (arrow.startBinding?.elementId === element.id) {
            const existingBinding = newBoundElements.find((binding: any) => binding.id === arrow.id)
            if (!existingBinding) {
              newBoundElements.push({
                id: arrow.id,
                type: 'arrow',
              })
            }
          }
        })

        return {
          ...element,
          boundElements: newBoundElements,
        }
      }

      return element
    })

    excalidrawAPI.updateScene({
      elements: [...updatedCurrentElements, ...allNewElements],
    })
  }

  return {
    success: true,
    elementsAdded: filteredRelatedElements.length,
    elements: newElements,
    arrows: newArrows,
  }
}

/**
 * Berechnet Positionen für verwandte Elemente
 */
const calculateElementPositions = (
  elements: RelatedElement[],
  sourceElement: { x: number; y: number; width: number; height: number },
  position: RelativePosition,
  spacing: number
): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = []
  // Verwende die Dimensionen des Quell-Elements für konsistente Größen
  const elementWidth = sourceElement.width // Gleiche Breite wie das Quell-Element
  const elementHeight = sourceElement.height // Gleiche Höhe wie das Quell-Element

  console.log('calculateElementPositions:', {
    sourceElementWidth: sourceElement.width,
    sourceElementHeight: sourceElement.height,
    spacing,
    position,
  })

  // Berechne Offset für mittige Positionierung
  const numElements = elements.length

  // Für rechts/links: Y-Koordinaten-Offset (mittige Positionierung in Y-Richtung)
  // Verwende das konfigurierbare spacing statt fest kodierten elementSpacing
  const totalHeightWithSpacing = elementHeight * numElements + spacing * (numElements - 1)
  const yOffset = totalHeightWithSpacing / 2

  // Für oben/unten: X-Koordinaten-Offset (mittige Positionierung in X-Richtung)
  // Verwende das konfigurierbare spacing statt fest kodierten elementSpacing
  const totalWidthWithSpacing = elementWidth * numElements + spacing * (numElements - 1)
  const xOffset = totalWidthWithSpacing / 2

  for (let i = 0; i < elements.length; i++) {
    let x: number, y: number

    switch (position) {
      case 'right':
        // Nach rechts: 2x Breite (bis zur rechten Kante + gewünschter Abstand) + spacing
        x = sourceElement.x + sourceElement.width * 2 + spacing
        y = sourceElement.y + i * (elementHeight + spacing) - yOffset + sourceElement.height / 2
        break
      case 'left':
        // Nach links: 1x Breite des neuen Elements + 1x Breite des Quell-Elements + spacing
        x = sourceElement.x - elementWidth - sourceElement.width - spacing
        y = sourceElement.y + i * (elementHeight + spacing) - yOffset + sourceElement.height / 2
        break
      case 'top':
        // Nach oben: 1x Höhe des neuen Elements + 1x Breite des Quell-Elements + spacing
        x = sourceElement.x + i * (elementWidth + spacing) - xOffset + sourceElement.width / 2
        y = sourceElement.y - elementHeight - sourceElement.width - spacing
        break
      case 'bottom':
        // Nach unten: 1x Höhe des Quell-Elements + 1x Breite des Quell-Elements + spacing
        x = sourceElement.x + i * (elementWidth + spacing) - xOffset + sourceElement.width / 2
        y = sourceElement.y + sourceElement.height + sourceElement.width + spacing
        break
      default:
        // Default: nach rechts
        x = sourceElement.x + sourceElement.width * 2 + spacing
        y = sourceElement.y + i * (elementHeight + spacing) - yOffset + sourceElement.height / 2
    }

    positions.push({ x, y })
  }

  return positions
}

/**
 * Berechnet verteilte Y-Koordinaten für mehrere Pfeile über die Höhe eines Elements
 * @param elementHeight - Höhe des Elements
 * @param elementY - Y-Position des Elements
 * @param arrowCount - Anzahl der Pfeile
 * @param arrowIndex - Index des aktuellen Pfeils (0-basiert)
 * @returns Y-Koordinate für den Pfeil
 */
const calculateDistributedArrowY = (
  elementHeight: number,
  elementY: number,
  arrowCount: number,
  arrowIndex: number
): number => {
  if (arrowCount === 1) {
    // Bei nur einem Pfeil: Mittig
    return elementY + elementHeight / 2
  }

  // Bei mehreren Pfeilen: Verteilung über die Höhe
  // Berechne 5 Punkte über die Höhe und verwende nicht den ersten und letzten
  const totalPoints = 5
  const usablePoints = totalPoints - 2 // Erste und letzte nicht verwenden
  const step = elementHeight / (totalPoints - 1) // Schritt zwischen den Punkten

  if (arrowCount <= usablePoints) {
    // Normal verteilen über die nutzbaren Punkte (Index 1 bis 3 bei 5 Punkten)
    const startPointIndex = 1 // Überspringe den ersten Punkt
    const usedPointIndex =
      startPointIndex + Math.floor((arrowIndex * (usablePoints - 1)) / Math.max(1, arrowCount - 1))
    return elementY + usedPointIndex * step
  } else {
    // Mehr Pfeile als nutzbare Punkte: gleichmäßig über den nutzbaren Bereich verteilen
    const usableHeight = elementHeight * (usablePoints / (totalPoints - 1))
    const startY = elementY + elementHeight / totalPoints // Beginne nach dem ersten übersprungenen Punkt
    return startY + (arrowIndex * usableHeight) / Math.max(1, arrowCount - 1)
  }
}

/**
 * Berechnet verteilte X-Koordinaten für mehrere Pfeile über die Breite eines Elements
 * @param elementWidth - Breite des Elements
 * @param elementX - X-Position des Elements
 * @param arrowCount - Anzahl der Pfeile
 * @param arrowIndex - Index des aktuellen Pfeils (0-basiert)
 * @returns X-Koordinate für den Pfeil
 */
const calculateDistributedArrowX = (
  elementWidth: number,
  elementX: number,
  arrowCount: number,
  arrowIndex: number
): number => {
  if (arrowCount === 1) {
    // Bei nur einem Pfeil: Mittig
    return elementX + elementWidth / 2
  }

  // Bei mehreren Pfeilen: Verteilung über die Breite
  // Berechne 5 Punkte über die Breite und verwende nicht den ersten und letzten
  const totalPoints = 5
  const usablePoints = totalPoints - 2 // Erste und letzte nicht verwenden
  const step = elementWidth / (totalPoints - 1) // Schritt zwischen den Punkten

  if (arrowCount <= usablePoints) {
    // Normal verteilen über die nutzbaren Punkte (Index 1 bis 3 bei 5 Punkten)
    const startPointIndex = 1 // Überspringe den ersten Punkt
    const usedPointIndex =
      startPointIndex + Math.floor((arrowIndex * (usablePoints - 1)) / Math.max(1, arrowCount - 1))
    return elementX + usedPointIndex * step
  } else {
    // Mehr Pfeile als nutzbare Punkte: gleichmäßig über den nutzbaren Bereich verteilen
    const usableWidth = elementWidth * (usablePoints / (totalPoints - 1))
    const startX = elementX + elementWidth / totalPoints // Beginne nach dem ersten übersprungenen Punkt
    return startX + (arrowIndex * usableWidth) / Math.max(1, arrowCount - 1)
  }
}

/**
 * Erstellt einen Pfeil zwischen zwei Elementen mit korrekten Randverbindungen
 */
const createArrowBetweenElements = (
  sourceElement: any,
  targetElement: any,
  arrowType: ArrowType,
  position?: RelativePosition,
  reverseArrow: boolean = false,
  arrowIndex: number = 0,
  totalArrows: number = 1
): any => {
  console.log(
    '🚀 createArrowBetweenElements called with position:',
    position,
    'reverseArrow:',
    reverseArrow
  )
  const arrowId = generateElementId()

  // KEINE Element-Vertauschung - die Geometrie bleibt unverändert
  const actualSourceElement = sourceElement
  const actualTargetElement = targetElement

  console.log(
    '🔄 Arrow direction - reverseArrow:',
    reverseArrow,
    'Source:',
    actualSourceElement.customData?.elementName || 'unknown',
    'Target:',
    actualTargetElement.customData?.elementName || 'unknown'
  )

  // Berechne optimale Verbindungspunkte an den Elementrändern
  const sourceCenter = {
    x: actualSourceElement.x + actualSourceElement.width / 2,
    y: actualSourceElement.y + actualSourceElement.height / 2,
  }

  const targetCenter = {
    x: actualTargetElement.x + actualTargetElement.width / 2,
    y: actualTargetElement.y + actualTargetElement.height / 2,
  }

  // Berechne die Richtung zwischen den Elementen
  const dx = targetCenter.x - sourceCenter.x
  const dy = targetCenter.y - sourceCenter.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) {
    // Fallback für gleiche Position
    return createFallbackArrow(actualSourceElement, actualTargetElement, arrowId, arrowType)
  }

  // Normalisierte Richtungsvektoren
  const normalizedDx = dx / distance
  const normalizedDy = dy / distance

  // Berechne Verbindungspunkte an den Elementrändern
  let sourceConnectionPoint = calculateConnectionPoint(
    actualSourceElement,
    normalizedDx,
    normalizedDy,
    true // Ausgehend
  )

  let targetConnectionPoint = calculateConnectionPoint(
    actualTargetElement,
    -normalizedDx, // Umgekehrte Richtung für eingehend
    -normalizedDy,
    false // Eingehend
  )

  // Spezielle Korrektur für "left" Position
  if (position === 'left') {
    console.log('🔧 Applying LEFT position arrow correction')
    console.log('🔧 Target element details:', {
      x: actualTargetElement.x,
      width: actualTargetElement.width,
      rightEdge: actualTargetElement.x + actualTargetElement.width,
    })

    // Berechne verteilte Y-Koordinate für das Source-Element
    const distributedSourceY = calculateDistributedArrowY(
      actualSourceElement.height,
      actualSourceElement.y,
      totalArrows,
      arrowIndex
    )

    // Bei "left" Position: Pfeil geht vom source Element (rechts) zum target Element (links)
    sourceConnectionPoint = {
      x: actualSourceElement.x - 6, // Linker Rand des Source-Elements mit 6px Abstand (Pfeil-Startpunkt)
      y: distributedSourceY,
    }
    targetConnectionPoint = {
      x: actualTargetElement.x + actualTargetElement.width + 6, // Rechter Rand des Target-Elements mit 6px Abstand (Pfeil-Endpunkt)
      y: actualTargetElement.y + actualTargetElement.height / 2,
    }
    console.log(
      '🔧 LEFT correction - Source (Pfeil startet hier):',
      sourceConnectionPoint,
      'Target (Pfeil endet hier):',
      targetConnectionPoint,
      'arrowIndex:',
      arrowIndex,
      'totalArrows:',
      totalArrows
    )
  } else if (position === 'right') {
    console.log('🔧 Applying RIGHT position arrow correction')
    console.log('🔧 Source element details:', {
      x: actualSourceElement.x,
      width: actualSourceElement.width,
      rightEdge: actualSourceElement.x + actualSourceElement.width,
    })

    // Berechne verteilte Y-Koordinate für das Source-Element
    const distributedSourceY = calculateDistributedArrowY(
      actualSourceElement.height,
      actualSourceElement.y,
      totalArrows,
      arrowIndex
    )

    // Bei "right" Position: Pfeil geht vom source Element (links) zum target Element (rechts)
    sourceConnectionPoint = {
      x: actualSourceElement.x + actualSourceElement.width + 6, // Rechter Rand des Source-Elements mit 6px Abstand (Pfeil-Startpunkt)
      y: distributedSourceY,
    }
    targetConnectionPoint = {
      x: actualTargetElement.x - 6, // Linker Rand des Target-Elements mit 6px Abstand (Pfeil-Endpunkt)
      y: actualTargetElement.y + actualTargetElement.height / 2,
    }
    console.log(
      '🔧 RIGHT correction - Source (Pfeil startet hier):',
      sourceConnectionPoint,
      'Target (Pfeil endet hier):',
      targetConnectionPoint,
      'arrowIndex:',
      arrowIndex,
      'totalArrows:',
      totalArrows
    )
  } else if (position === 'top') {
    console.log('🔧 Applying TOP position arrow correction')
    console.log('🔧 Source element details:', {
      x: actualSourceElement.x,
      height: actualSourceElement.height,
      bottomEdge: actualSourceElement.y + actualSourceElement.height,
    })

    // Berechne verteilte X-Koordinate für das Source-Element
    const distributedSourceX = calculateDistributedArrowX(
      actualSourceElement.width,
      actualSourceElement.x,
      totalArrows,
      arrowIndex
    )

    // Bei "top" Position: Pfeil geht vom source Element (unten) zum target Element (oben)
    sourceConnectionPoint = {
      x: distributedSourceX, // Verteilte X-Position des Source-Elements
      y: actualSourceElement.y - 6, // Oberer Rand des Source-Elements mit 6px Abstand (Pfeil-Startpunkt)
    }
    targetConnectionPoint = {
      x: actualTargetElement.x + actualTargetElement.width / 2, // Horizontale Mitte des Target-Elements
      y: actualTargetElement.y + actualTargetElement.height + 6, // Unterer Rand des Target-Elements mit 6px Abstand (Pfeil-Endpunkt)
    }
    console.log(
      '🔧 TOP correction - Source (Pfeil startet hier):',
      sourceConnectionPoint,
      'Target (Pfeil endet hier):',
      targetConnectionPoint,
      'arrowIndex:',
      arrowIndex,
      'totalArrows:',
      totalArrows
    )
  } else if (position === 'bottom') {
    console.log('🔧 Applying BOTTOM position arrow correction')
    console.log('🔧 Source element details:', {
      x: actualSourceElement.x,
      height: actualSourceElement.height,
      bottomEdge: actualSourceElement.y + actualSourceElement.height,
    })

    // Berechne verteilte X-Koordinate für das Source-Element
    const distributedSourceX = calculateDistributedArrowX(
      actualSourceElement.width,
      actualSourceElement.x,
      totalArrows,
      arrowIndex
    )

    // Bei "bottom" Position: Pfeil geht vom source Element (oben) zum target Element (unten)
    sourceConnectionPoint = {
      x: distributedSourceX, // Verteilte X-Position des Source-Elements
      y: actualSourceElement.y + actualSourceElement.height + 6, // Unterer Rand des Source-Elements mit 6px Abstand (Pfeil-Startpunkt)
    }
    targetConnectionPoint = {
      x: actualTargetElement.x + actualTargetElement.width / 2, // Horizontale Mitte des Target-Elements
      y: actualTargetElement.y - 6, // Oberer Rand des Target-Elements mit 6px Abstand (Pfeil-Endpunkt)
    }
    console.log(
      '🔧 BOTTOM correction - Source (Pfeil startet hier):',
      sourceConnectionPoint,
      'Target (Pfeil endet hier):',
      targetConnectionPoint,
      'arrowIndex:',
      arrowIndex,
      'totalArrows:',
      totalArrows
    )
  }

  // Konfiguriere Pfeil-Typ
  const arrowConfig = getArrowConfiguration(arrowType)

  // Pfeil-Geometrie: Positionsspezifische Berechnung
  let arrowGeometry
  if (position === 'left') {
    // Bei "left": Pfeil startet vom linken Rand des Source-Elements zum rechten Rand des Target-Elements
    arrowGeometry = {
      x: sourceConnectionPoint.x, // Startpunkt: linker Rand des Source-Elements
      y: sourceConnectionPoint.y, // Startpunkt Y
      width: targetConnectionPoint.x - sourceConnectionPoint.x, // Breite: Differenz x-Koordinaten
      height: targetConnectionPoint.y - sourceConnectionPoint.y, // Höhe: Differenz y-Koordinaten
    }
  } else if (position === 'right') {
    // Bei "right": Pfeil startet vom rechten Rand des Source-Elements zum linken Rand des Target-Elements
    arrowGeometry = {
      x: sourceConnectionPoint.x, // Startpunkt: rechter Rand des Source-Elements
      y: sourceConnectionPoint.y, // Startpunkt Y
      width: targetConnectionPoint.x - sourceConnectionPoint.x, // Breite: Differenz x-Koordinaten
      height: targetConnectionPoint.y - sourceConnectionPoint.y, // Höhe: Differenz y-Koordinaten
    }
  } else if (position === 'top') {
    // Bei "top": Pfeil startet vom oberen Rand des Source-Elements zum unteren Rand des Target-Elements
    arrowGeometry = {
      x: sourceConnectionPoint.x, // Startpunkt X
      y: sourceConnectionPoint.y, // Startpunkt: oberer Rand des Source-Elements
      width: targetConnectionPoint.x - sourceConnectionPoint.x, // Breite: Differenz x-Koordinaten
      height: targetConnectionPoint.y - sourceConnectionPoint.y, // Höhe: Differenz y-Koordinaten
    }
  } else if (position === 'bottom') {
    // Bei "bottom": Pfeil startet vom unteren Rand des Source-Elements zum oberen Rand des Target-Elements
    arrowGeometry = {
      x: sourceConnectionPoint.x, // Startpunkt X
      y: sourceConnectionPoint.y, // Startpunkt: unterer Rand des Source-Elements
      width: targetConnectionPoint.x - sourceConnectionPoint.x, // Breite: Differenz x-Koordinaten
      height: targetConnectionPoint.y - sourceConnectionPoint.y, // Höhe: Differenz y-Koordinaten
    }
  } else {
    // Für alle anderen Positionen: Standard-Berechnung
    arrowGeometry = {
      x: Math.min(sourceConnectionPoint.x, targetConnectionPoint.x),
      y: Math.min(sourceConnectionPoint.y, targetConnectionPoint.y),
      width: Math.abs(targetConnectionPoint.x - sourceConnectionPoint.x),
      height: Math.abs(targetConnectionPoint.y - sourceConnectionPoint.y),
    }
  }

  console.log(`🎯 Arrow geometry for position ${position}:`, arrowGeometry)

  return {
    id: arrowId,
    type: 'arrow',
    ...arrowGeometry,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: 'a2',
    roundness: arrowConfig.roundness,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    updated: Date.now(),
    link: null,
    locked: false,
    points: [
      [0, 0],
      position === 'left'
        ? [
            targetConnectionPoint.x - sourceConnectionPoint.x,
            targetConnectionPoint.y - sourceConnectionPoint.y,
          ]
        : position === 'right'
          ? [
              targetConnectionPoint.x - sourceConnectionPoint.x,
              targetConnectionPoint.y - sourceConnectionPoint.y,
            ]
          : position === 'top'
            ? [
                targetConnectionPoint.x - sourceConnectionPoint.x,
                targetConnectionPoint.y - sourceConnectionPoint.y,
              ]
            : position === 'bottom'
              ? [
                  targetConnectionPoint.x - sourceConnectionPoint.x,
                  targetConnectionPoint.y - sourceConnectionPoint.y,
                ]
              : [
                  targetConnectionPoint.x - sourceConnectionPoint.x,
                  targetConnectionPoint.y - sourceConnectionPoint.y,
                ],
    ],
    lastCommittedPoint: null,
    startBinding:
      position === 'left'
        ? {
            elementId: actualSourceElement.id,
            focus: calculateBindingFocus(actualSourceElement, sourceConnectionPoint),
            gap: 1,
            fixedPoint: null,
          }
        : {
            elementId: actualSourceElement.id,
            focus: calculateBindingFocus(actualSourceElement, sourceConnectionPoint),
            gap: 1,
            fixedPoint: null,
          },
    endBinding:
      position === 'left'
        ? {
            elementId: actualTargetElement.id,
            focus: calculateBindingFocus(actualTargetElement, targetConnectionPoint),
            gap: 1,
            fixedPoint: null,
          }
        : {
            elementId: actualTargetElement.id,
            focus: calculateBindingFocus(actualTargetElement, targetConnectionPoint),
            gap: 1,
            fixedPoint: null,
          },
    startArrowhead: reverseArrow ? 'arrow' : null,
    endArrowhead: reverseArrow ? null : 'arrow',
  }
}

/**
 * Berechnet den optimalen Verbindungspunkt an einem Elementrand
 */
const calculateConnectionPoint = (
  element: any,
  directionX: number,
  directionY: number,
  _isOutgoing: boolean
): { x: number; y: number } => {
  const centerX = element.x + element.width / 2
  const centerY = element.y + element.height / 2

  // Berechne Schnittpunkt mit Elementgrenzen
  const halfWidth = element.width / 2
  const halfHeight = element.height / 2

  // Normalisierte Richtung
  const absX = Math.abs(directionX)
  const absY = Math.abs(directionY)

  let connectionX: number
  let connectionY: number

  if (absX > absY) {
    // Horizontale Verbindung (links oder rechts)
    connectionX = centerX + (directionX > 0 ? halfWidth : -halfWidth)
    connectionY = centerY + (directionY * halfWidth) / absX

    // Begrenze Y auf Elementhöhe
    connectionY = Math.max(element.y, Math.min(element.y + element.height, connectionY))
  } else {
    // Vertikale Verbindung (oben oder unten)
    connectionY = centerY + (directionY > 0 ? halfHeight : -halfHeight)
    connectionX = centerX + (directionX * halfHeight) / absY

    // Begrenze X auf Elementbreite
    connectionX = Math.max(element.x, Math.min(element.x + element.width, connectionX))
  }

  return { x: connectionX, y: connectionY }
}

/**
 * Berechnet den Binding-Focus für eine Verbindung
 */
const calculateBindingFocus = (element: any, connectionPoint: { x: number; y: number }): number => {
  const centerX = element.x + element.width / 2
  const centerY = element.y + element.height / 2

  // Berechne relative Position (-1 bis 1)
  const relativeX = (connectionPoint.x - centerX) / (element.width / 2)
  const relativeY = (connectionPoint.y - centerY) / (element.height / 2)

  // Kombiniere X und Y zu einem Focus-Wert
  return Math.max(-0.9, Math.min(0.9, (relativeX + relativeY) / 2))
}

/**
 * Konfiguriert Pfeil-Eigenschaften basierend auf Typ
 */
const getArrowConfiguration = (arrowType: ArrowType) => {
  switch (arrowType) {
    case 'curved':
      return {
        roundness: { type: 2, value: 0.5 }, // Gebogene Linie
      }
    case 'elbow':
      return {
        roundness: { type: 1 }, // Rechtwinklige Verbindung
      }
    case 'sharp':
    default:
      return {
        roundness: null, // Gerade Linie
      }
  }
}

/**
 * Fallback für Pfeil-Erstellung bei Problemen
 */
const createFallbackArrow = (
  sourceElement: any,
  targetElement: any,
  arrowId: string,
  arrowType: ArrowType
): any => {
  const startX = sourceElement.x + sourceElement.width
  const startY = sourceElement.y + sourceElement.height / 2
  const endX = targetElement.x
  const endY = targetElement.y + targetElement.height / 2

  return {
    id: arrowId,
    type: 'arrow',
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: 'a2',
    roundness: getArrowConfiguration(arrowType).roundness,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    updated: Date.now(),
    link: null,
    locked: false,
    points: [
      [0, 0],
      [endX - startX, endY - startY],
    ],
    lastCommittedPoint: null,
    startBinding: {
      elementId: sourceElement.id,
      focus: 0.5,
      gap: 1,
      fixedPoint: null,
    },
    endBinding: {
      elementId: targetElement.id,
      focus: -0.5,
      gap: 1,
      fixedPoint: null,
    },
    startArrowhead: null,
    endArrowhead: 'arrow',
  }
}
