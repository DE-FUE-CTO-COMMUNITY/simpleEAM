import { ApolloClient } from '@apollo/client'
import {
  GET_RELATED_ELEMENTS_FOR_CAPABILITY,
  GET_RELATED_ELEMENTS_FOR_APPLICATION,
  GET_RELATED_ELEMENTS_FOR_DATA_OBJECT,
  GET_RELATED_ELEMENTS_FOR_INTERFACE,
  GET_RELATED_ELEMENTS_FOR_INFRASTRUCTURE,
  RelatedElement,
  RelatedElementsResponse,
} from '@/graphql/relatedElements'
import { ArrowType, RelativePosition } from '../types/addRelatedElements'
import {
  createCapabilityElementsFromTemplate,
  createApplicationElementsFromTemplate,
  createDataObjectElementsFromTemplate,
  createInterfaceElementsFromTemplate,
  createInfrastructureElementsFromTemplate,
} from './elementCreation'

import { findArchimateTemplate, loadArchimateLibrary } from './archimateLibraryUtils'
import { generateElementId } from './elementIdManager'

interface AddRelatedElementsConfig {
  hops: number
  position: RelativePosition
  arrowType: ArrowType
  spacing: number
}

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
const loadRelatedElementsFromDatabase = async (
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

  // Position des ausgewählten Elements
  const sourceX = selectedElement.x
  const sourceY = selectedElement.y
  const sourceWidth = selectedElement.width
  const sourceHeight = selectedElement.height

  // Berechne Positionen basierend auf der gewählten Richtung
  const positions = calculateElementPositions(
    relatedElements,
    { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight },
    config.position,
    config.spacing
  )

  // Erstelle Elemente für jeden verwandten Eintrag
  for (let i = 0; i < relatedElements.length; i++) {
    const relatedElement = relatedElements[i]
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
      // Fallback für unbekannte Typen
      createdElements = createGenericElementFromTemplate(
        relatedElement,
        template,
        position.x,
        position.y
      )
    }

    newElements.push(...createdElements)

    // Erstelle Pfeil vom Quell-Element zum neuen Element
    if (createdElements.length > 0) {
      const targetElement = createdElements[0] // Haupt-Element (normalerweise das erste)
      const arrow = createArrowBetweenElements(selectedElement, targetElement, config.arrowType)
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
    elementsAdded: relatedElements.length,
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
  const elementWidth = 200 // Standard-Breite für neue Elemente
  const elementHeight = 100 // Standard-Höhe für neue Elemente

  for (let i = 0; i < elements.length; i++) {
    let x: number, y: number

    switch (position) {
      case 'right':
        x = sourceElement.x + sourceElement.width + spacing
        y = sourceElement.y + i * (elementHeight + 20)
        break
      case 'left':
        x = sourceElement.x - elementWidth - spacing
        y = sourceElement.y + i * (elementHeight + 20)
        break
      case 'top':
        x = sourceElement.x + i * (elementWidth + 20)
        y = sourceElement.y - elementHeight - spacing
        break
      case 'bottom':
        x = sourceElement.x + i * (elementWidth + 20)
        y = sourceElement.y + sourceElement.height + spacing
        break
      default:
        x = sourceElement.x + sourceElement.width + spacing
        y = sourceElement.y + i * (elementHeight + 20)
    }

    positions.push({ x, y })
  }

  return positions
}

/**
 * Erstellt ein generisches Element aus einem Template
 */
const createGenericElementFromTemplate = (
  element: RelatedElement,
  template: any,
  x: number,
  y: number
): any[] => {
  // Vereinfachte generische Element-Erstellung
  const elementId = generateElementId()
  const textId = generateElementId()

  const rectangle = {
    id: elementId,
    type: 'rectangle',
    x,
    y,
    width: 200,
    height: 100,
    angle: 0,
    strokeColor: template.elements[0]?.strokeColor || '#1e1e1e',
    backgroundColor: template.elements[0]?.backgroundColor || '#ffffff',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: 'a0',
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    boundElements: [{ id: textId, type: 'text' }],
    updated: Date.now(),
    link: null,
    locked: false,
    customData: {
      databaseId: element.id,
      elementType: element.elementType,
      elementName: element.name,
      isFromDatabase: true,
      isMainElement: true,
    },
  }

  const text = {
    id: textId,
    type: 'text',
    x: x + 10,
    y: y + 40,
    width: 180,
    height: 20,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: 'a1',
    roundness: null,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    containerId: elementId,
    originalText: element.name,
    updated: Date.now(),
    link: null,
    locked: false,
    fontSize: 16,
    fontFamily: 1,
    text: element.name,
    textAlign: 'center',
    verticalAlign: 'middle',
    baseline: 14,
    customData: {
      isFromDatabase: true,
      isMainElement: false,
      mainElementId: elementId,
    },
  }

  return [rectangle, text]
}

/**
 * Erstellt einen Pfeil zwischen zwei Elementen mit korrekten Randverbindungen
 */
const createArrowBetweenElements = (
  sourceElement: any,
  targetElement: any,
  arrowType: ArrowType
): any => {
  const arrowId = generateElementId()

  // Berechne optimale Verbindungspunkte an den Elementrändern
  const sourceCenter = {
    x: sourceElement.x + sourceElement.width / 2,
    y: sourceElement.y + sourceElement.height / 2,
  }

  const targetCenter = {
    x: targetElement.x + targetElement.width / 2,
    y: targetElement.y + targetElement.height / 2,
  }

  // Berechne die Richtung zwischen den Elementen
  const dx = targetCenter.x - sourceCenter.x
  const dy = targetCenter.y - sourceCenter.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) {
    // Fallback für gleiche Position
    return createFallbackArrow(sourceElement, targetElement, arrowId, arrowType)
  }

  // Normalisierte Richtungsvektoren
  const normalizedDx = dx / distance
  const normalizedDy = dy / distance

  // Berechne Verbindungspunkte an den Elementrändern
  const sourceConnectionPoint = calculateConnectionPoint(
    sourceElement,
    normalizedDx,
    normalizedDy,
    true // Ausgehend
  )

  const targetConnectionPoint = calculateConnectionPoint(
    targetElement,
    -normalizedDx, // Umgekehrte Richtung für eingehend
    -normalizedDy,
    false // Eingehend
  )

  // Konfiguriere Pfeil-Typ
  const arrowConfig = getArrowConfiguration(arrowType)

  return {
    id: arrowId,
    type: 'arrow',
    x: Math.min(sourceConnectionPoint.x, targetConnectionPoint.x),
    y: Math.min(sourceConnectionPoint.y, targetConnectionPoint.y),
    width: Math.abs(targetConnectionPoint.x - sourceConnectionPoint.x),
    height: Math.abs(targetConnectionPoint.y - sourceConnectionPoint.y),
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
      [
        targetConnectionPoint.x - sourceConnectionPoint.x,
        targetConnectionPoint.y - sourceConnectionPoint.y,
      ],
    ],
    lastCommittedPoint: null,
    startBinding: {
      elementId: sourceElement.id,
      focus: calculateBindingFocus(sourceElement, sourceConnectionPoint),
      gap: 1,
      fixedPoint: null,
    },
    endBinding: {
      elementId: targetElement.id,
      focus: calculateBindingFocus(targetElement, targetConnectionPoint),
      gap: 1,
      fixedPoint: null,
    },
    startArrowhead: null,
    endArrowhead: 'arrow',
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
