import type { ExcalidrawElement } from './capabilityMapTypes'
import { RelatedElement } from './loadRelatedElements'
import {
  AddRelatedElementsConfig,
  RelativePosition,
  ArrowType,
  CreatedElementsResult,
} from '../types/addRelatedElements'

// Standard-Elementgrößen (angepasst an die Diagramm-Standards)
const ELEMENT_SIZE = {
  width: 160,
  height: 80,
}

// Pfeil-Konfigurationen für verschiedene Excalidraw-Typen
const ARROW_CONFIGS = {
  sharp: {
    roundness: null, // Keine Rundung für scharfe Pfeile
    elbowed: false,
  },
  curved: {
    roundness: { type: 2 }, // Proportionale Rundung für gekrümmte Pfeile
    elbowed: false,
  },
  elbow: {
    roundness: null,
    elbowed: true, // Elbow-Pfeile sind rechtwinklig
  },
}

/**
 * Berechnet die Position für ein neues Element relativ zum Ausgangselement
 */
export const calculateElementPosition = (
  sourceElement: ExcalidrawElement,
  position: RelativePosition,
  spacing: number,
  index: number,
  totalElements: number
): { x: number; y: number } => {
  const sourceX = sourceElement.x
  const sourceY = sourceElement.y
  const sourceWidth = sourceElement.width
  const sourceHeight = sourceElement.height

  // Berechne den offset basierend auf der Anzahl der Elemente
  const offsetIndex = index - Math.floor(totalElements / 2)
  const elementSpacing = ELEMENT_SIZE.height + 20 // Vertikaler Abstand zwischen Elementen

  switch (position) {
    case 'right':
      return {
        x: sourceX + sourceWidth + spacing,
        y: sourceY + offsetIndex * elementSpacing,
      }
    case 'left':
      return {
        x: sourceX - spacing - ELEMENT_SIZE.width,
        y: sourceY + offsetIndex * elementSpacing,
      }
    case 'top':
      return {
        x: sourceX + offsetIndex * (ELEMENT_SIZE.width + 20),
        y: sourceY - spacing - ELEMENT_SIZE.height,
      }
    case 'bottom':
      return {
        x: sourceX + offsetIndex * (ELEMENT_SIZE.width + 20),
        y: sourceY + sourceHeight + spacing,
      }
    default:
      return { x: sourceX + spacing, y: sourceY }
  }
}

/**
 * Erstellt ein neues Excalidraw-Element für ein verwandtes Element
 */
export const createExcalidrawElement = (
  relatedElement: RelatedElement,
  position: { x: number; y: number },
  elementId: string
): ExcalidrawElement => {
  // Bestimme die Farbe basierend auf dem Elementtyp
  const getElementColor = (elementType: string): string => {
    const colors = {
      businessCapability: '#e1f5fe', // Hellblau
      application: '#f3e5f5', // Hellviolett
      dataObject: '#e8f5e8', // Hellgrün
      applicationInterface: '#fff3e0', // Hellorange
      infrastructure: '#fce4ec', // Hellrosa
    }
    return colors[elementType as keyof typeof colors] || '#f5f5f5'
  }

  return {
    type: 'rectangle',
    id: elementId,
    x: position.x,
    y: position.y,
    width: ELEMENT_SIZE.width,
    height: ELEMENT_SIZE.height,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: getElementColor(relatedElement.elementType),
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: `a${Math.random().toString(36).substring(2, 9)}`,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    customData: {
      elementType: relatedElement.elementType,
      databaseId: relatedElement.id,
      displayText: relatedElement.displayText,
      isFromDatabase: true,
    },
  } as ExcalidrawElement
}

/**
 * Erstellt ein Text-Element für die Beschriftung
 */
export const createTextElement = (
  relatedElement: RelatedElement,
  rectangleElement: ExcalidrawElement,
  textId: string
): ExcalidrawElement => {
  const text = relatedElement.displayText || relatedElement.name

  return {
    type: 'text',
    id: textId,
    x: rectangleElement.x + 10, // Leichter Innenabstand
    y: rectangleElement.y + rectangleElement.height / 2 - 10, // Vertikal zentriert
    width: rectangleElement.width - 20,
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
    index: `a${Math.random().toString(36).substring(2, 9)}`,
    roundness: null,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    text,
    fontSize: 14,
    fontFamily: 1, // Virgil
    textAlign: 'center',
    verticalAlign: 'middle',
    baseline: 18,
    containerId: rectangleElement.id,
    originalText: text,
    lineHeight: 1.25,
  } as ExcalidrawElement
}

/**
 * Erstellt einen Pfeil zwischen zwei Elementen mit Excalidraw-Pfeiltypen
 */
export const createArrowElement = (
  sourceElement: ExcalidrawElement,
  targetElement: ExcalidrawElement,
  arrowType: ArrowType,
  reverseArrow: boolean,
  arrowId: string
): ExcalidrawElement => {
  // Berechne Verbindungspunkte
  const sourceCenter = {
    x: sourceElement.x + sourceElement.width / 2,
    y: sourceElement.y + sourceElement.height / 2,
  }

  const targetCenter = {
    x: targetElement.x + targetElement.width / 2,
    y: targetElement.y + targetElement.height / 2,
  }

  // Bestimme Start- und Endpunkte am Rand der Elemente
  const startPoint = getConnectionPoint(sourceElement, targetCenter)
  const endPoint = getConnectionPoint(targetElement, sourceCenter)

  const arrowConfig = ARROW_CONFIGS[arrowType]

  // Bestimme die tatsächlichen Start- und Endpunkte basierend auf reverseArrow
  const actualStartPoint = reverseArrow ? endPoint : startPoint
  const actualEndPoint = reverseArrow ? startPoint : endPoint
  const actualStartElement = reverseArrow ? targetElement : sourceElement
  const actualEndElement = reverseArrow ? sourceElement : targetElement

  return {
    type: 'arrow',
    id: arrowId,
    x: actualStartPoint.x,
    y: actualStartPoint.y,
    width: actualEndPoint.x - actualStartPoint.x,
    height: actualEndPoint.y - actualStartPoint.y,
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
    index: `a${Math.random().toString(36).substring(2, 9)}`,
    roundness: arrowConfig.roundness,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    startBinding: {
      elementId: actualStartElement.id,
      focus: 0,
      gap: 3,
    },
    endBinding: {
      elementId: actualEndElement.id,
      focus: 0,
      gap: 3,
    },
    lastCommittedPoint: null,
    startArrowhead: null, // Nur Pfeilspitze am Ende
    endArrowhead: 'arrow', // Standard Pfeilspitze
    points: [
      [0, 0],
      [actualEndPoint.x - actualStartPoint.x, actualEndPoint.y - actualStartPoint.y],
    ],
    // Elbow-spezifische Eigenschaften
    elbowed: arrowConfig.elbowed,
    ...(arrowConfig.elbowed && {
      fixedSegments: null,
      startIsSpecial: null,
      endIsSpecial: null,
    }),
  } as ExcalidrawElement
}

/**
 * Berechnet den optimalen Verbindungspunkt am Rand eines Elements
 */
const getConnectionPoint = (
  element: ExcalidrawElement,
  targetCenter: { x: number; y: number }
): { x: number; y: number } => {
  const elementCenter = {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  }

  const dx = targetCenter.x - elementCenter.x
  const dy = targetCenter.y - elementCenter.y

  // Berechne Schnittpunkt mit dem Elementrand
  const halfWidth = element.width / 2
  const halfHeight = element.height / 2

  if (Math.abs(dx) / halfWidth > Math.abs(dy) / halfHeight) {
    // Horizontaler Rand
    const x = elementCenter.x + (dx > 0 ? halfWidth : -halfWidth)
    const y = elementCenter.y + (dy * halfWidth) / Math.abs(dx)
    return { x, y }
  } else {
    // Vertikaler Rand
    const x = elementCenter.x + (dx * halfHeight) / Math.abs(dy)
    const y = elementCenter.y + (dy > 0 ? halfHeight : -halfHeight)
    return { x, y }
  }
}

/**
 * Generiert eine eindeutige ID für Excalidraw-Elemente
 */
export const generateElementId = (): string => {
  return `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Hauptfunktion zum Erstellen aller Elemente und Pfeile
 */
export const createElementsWithRelationships = (
  sourceElement: ExcalidrawElement,
  relatedElements: RelatedElement[],
  config: AddRelatedElementsConfig
): CreatedElementsResult => {
  const elements: ExcalidrawElement[] = []
  const elementData: Array<{
    element: ExcalidrawElement
    textElement: ExcalidrawElement
    relatedElement: RelatedElement
  }> = []

  // Erstelle alle verwandten Elemente
  relatedElements.forEach((relatedElement, index) => {
    const position = calculateElementPosition(
      sourceElement,
      config.position,
      config.spacing,
      index,
      relatedElements.length
    )

    const elementId = generateElementId()
    const textId = generateElementId()

    const rectangleElement = createExcalidrawElement(relatedElement, position, elementId)
    const textElement = createTextElement(relatedElement, rectangleElement, textId)

    elements.push(rectangleElement, textElement)
    elementData.push({
      element: rectangleElement,
      textElement,
      relatedElement,
    })
  })

  // Erstelle alle Pfeile
  elementData.forEach(({ element, relatedElement }) => {
    const arrowId = generateElementId()
    const arrow = createArrowElement(
      sourceElement,
      element,
      config.arrowType,
      relatedElement.reverseArrow,
      arrowId
    )
    elements.push(arrow)
  })

  return {
    elements,
    totalElements: relatedElements.length,
    boundingBox: calculateBoundingBox([sourceElement, ...elements]),
  }
}

/**
 * Berechnet die Bounding Box aller Elemente
 */
const calculateBoundingBox = (elements: ExcalidrawElement[]) => {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  elements.forEach(element => {
    minX = Math.min(minX, element.x)
    minY = Math.min(minY, element.y)
    maxX = Math.max(maxX, element.x + element.width)
    maxY = Math.max(maxY, element.y + element.height)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}
