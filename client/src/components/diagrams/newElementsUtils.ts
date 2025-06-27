import { gql } from '@apollo/client'

interface DiagramElement {
  id: string
  type: string
  text?: string
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  strokeWidth?: number
  strokeStyle?: string
  backgroundColor: string
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?:
      | 'capability'
      | 'application'
      | 'dataObject'
      | 'interface'
      | 'businessCapability'
      | 'applicationInterface'
    originalElement?: any
    isMainElement?: boolean
    mainElementId?: string
    lastSyncedName?: string
    isDatabaseMissing?: boolean
    missingReason?: string
  }
}

interface NewElement {
  id: string
  text: string
  elementType: string
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  backgroundColor: string
  selected: boolean
}

interface ElementCreationResult {
  success: boolean
  createdElements: Array<{
    elementId: string
    databaseId: string
    elementType: string
  }>
  errors: string[]
}

// Unterstützte Element-Typen - kompatibel mit databaseSyncUtils
export const ELEMENT_TYPES = {
  APPLICATION: 'application',
  CAPABILITY: 'capability',
  DATA_OBJECT: 'dataObject',
  INTERFACE: 'interface',
} as const

// GraphQL-Mutation für die Erstellung neuer Elemente
const CREATE_APPLICATION_MUTATION = gql`
  mutation CreateApplication($input: [ApplicationCreateInput!]!) {
    createApplications(input: $input) {
      applications {
        id
        name
        description
      }
    }
  }
`

const CREATE_CAPABILITY_MUTATION = gql`
  mutation CreateCapability($input: [BusinessCapabilityCreateInput!]!) {
    createBusinessCapabilities(input: $input) {
      businessCapabilities {
        id
        name
        description
      }
    }
  }
`

const CREATE_INTERFACE_MUTATION = gql`
  mutation CreateApplicationInterface($input: [ApplicationInterfaceCreateInput!]!) {
    createApplicationInterfaces(input: $input) {
      applicationInterfaces {
        id
        name
        description
      }
    }
  }
`

const CREATE_DATA_OBJECT_MUTATION = gql`
  mutation CreateDataObjects($input: [DataObjectCreateInput!]!) {
    createDataObjects(input: $input) {
      dataObjects {
        id
        name
        description
      }
    }
  }
`

/**
 * Erkennt neue Elemente im Diagramm, die nicht von der Datenbank stammen
 */
export const detectNewElements = (elements: DiagramElement[]): NewElement[] => {
  const newElements: NewElement[] = []

  for (const element of elements) {
    if (element.type === 'text') {
      // Skip eigenständige Text-Elemente - diese sind meist an Shapes gebunden
      continue
    }

    // Skip if element is from database
    if (element.customData?.isFromDatabase) {
      continue
    }

    // NEUE LOGIK: Nur Elemente mit elementType aber ohne databaseId sollen erkannt werden
    // Dies sind Symbole aus der ArchiMate-Bibliothek, die noch nicht gespeichert sind
    if (!element.customData?.elementType) {
      // Kein elementType definiert -> einfaches grafisches Element -> ignorieren
      continue
    }

    if (element.customData?.databaseId) {
      // Hat bereits eine databaseId -> bereits gespeichert -> ignorieren
      continue
    }

    // Ab hier: Element hat elementType aber keine databaseId -> potentielles neues DB-Element

    // Skip if not a shape that can be converted to database element
    if (!['rectangle', 'ellipse', 'diamond'].includes(element.type)) {
      continue
    }

    // Prüfe ob Element Text hat (sollte bei ArchiMate-Symbolen immer der Fall sein)
    const text = extractElementText(element, elements)

    // Skip Elemente ohne Text oder mit leerem Text
    if (!text || text.trim().length === 0) {
      continue
    }

    const trimmedText = text.trim()

    // Für ArchiMate-Symbole: Einfache Validierung, da diese bereits vordefiniert sind
    // Nur sehr offensichtlich ungültige Texte ausschließen
    if (trimmedText.length < 2) {
      continue
    }

    // Bei ArchiMate-Symbolen können wir die meisten Validierungen überspringen,
    // da diese bereits vordefiniert und valide sind. Nutze elementType direkt aus customData.
    const elementType = element.customData.elementType

    newElements.push({
      id: element.id,
      text: trimmedText,
      elementType,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      strokeColor: element.strokeColor,
      backgroundColor: element.backgroundColor,
      selected: false,
    })
  }

  return newElements
}

/**
 * Extrahiert Text aus einem Element (sucht nach verknüpften Text-Elementen)
 */
const extractElementText = (element: DiagramElement, allElements: DiagramElement[]): string => {
  // Check if element has bound text elements
  if (element.type === 'text') {
    return (element as any).text || ''
  }

  // Look for linked text elements (bound to container)
  const linkedTextElement = allElements.find(
    el => el.type === 'text' && (el as any).containerId === element.id
  )

  if (linkedTextElement) {
    return (linkedTextElement as any).text || ''
  }

  // Look for text elements with the same position (unbound text near the shape)
  const textNearElement = allElements.find(
    el => el.type === 'text' && Math.abs(el.x - element.x) < 50 && Math.abs(el.y - element.y) < 50
  )

  if (textNearElement) {
    return (textNearElement as any).text || ''
  }

  // Fallback: use element's text property if available
  return (element as any).text || ''
}

/**
 * Erstellt neue Elemente in der Datenbank
 */
export const createNewElementsInDatabase = async (
  apolloClient: any,
  newElements: NewElement[]
): Promise<ElementCreationResult> => {
  const result: ElementCreationResult = {
    success: true,
    createdElements: [],
    errors: [],
  }

  // Group elements by type for batch creation
  const elementsByType = new Map<string, NewElement[]>()

  for (const element of newElements) {
    if (!elementsByType.has(element.elementType)) {
      elementsByType.set(element.elementType, [])
    }
    elementsByType.get(element.elementType)!.push(element)
  }

  // Create elements for each type
  for (const elementType of Array.from(elementsByType.keys())) {
    const elements = elementsByType.get(elementType)!
    try {
      const createdElements = await createElementsByType(apolloClient, elementType, elements)
      result.createdElements.push(...createdElements)
    } catch (error) {
      result.success = false
      result.errors.push(`Fehler beim Erstellen von ${elementType}: ${error}`)
    }
  }

  return result
}

/**
 * Erstellt Elemente eines bestimmten Typs in der Datenbank
 */
const createElementsByType = async (
  apolloClient: any,
  elementType: string,
  elements: NewElement[]
): Promise<Array<{ elementId: string; databaseId: string; elementType: string }>> => {
  const input = elements.map(element => {
    const baseInput = {
      name: element.text,
      description: `Automatisch erstellt aus Diagramm`,
    }

    // Add type-specific fields
    switch (elementType) {
      case ELEMENT_TYPES.APPLICATION:
        return {
          ...baseInput,
          status: 'ACTIVE',
          criticality: 'MEDIUM',
        }
      case ELEMENT_TYPES.CAPABILITY:
        return {
          ...baseInput,
          maturityLevel: 1,
          businessValue: 5,
          status: 'ACTIVE',
        }
      case ELEMENT_TYPES.DATA_OBJECT:
        return {
          ...baseInput,
          classification: 'INTERNAL',
          format: 'Nicht spezifiziert',
        }
      case ELEMENT_TYPES.INTERFACE:
        return {
          ...baseInput,
          interfaceType: 'API',
          protocol: 'HTTP',
          status: 'ACTIVE',
        }
      default:
        return baseInput
    }
  })

  let mutation: any
  let resultPath: string

  switch (elementType) {
    case ELEMENT_TYPES.APPLICATION:
      mutation = CREATE_APPLICATION_MUTATION
      resultPath = 'createApplications.applications'
      break
    case ELEMENT_TYPES.CAPABILITY:
      mutation = CREATE_CAPABILITY_MUTATION
      resultPath = 'createBusinessCapabilities.businessCapabilities'
      break
    case ELEMENT_TYPES.DATA_OBJECT:
      mutation = CREATE_DATA_OBJECT_MUTATION
      resultPath = 'createDataObjects.dataObjects'
      break
    case ELEMENT_TYPES.INTERFACE:
      mutation = CREATE_INTERFACE_MUTATION
      resultPath = 'createApplicationInterfaces.applicationInterfaces'
      break
    default:
      throw new Error(`Unsupported element type: ${elementType}`)
  }

  const response = await apolloClient.mutate({
    mutation,
    variables: { input },
  })

  const createdItems = getNestedProperty(response.data, resultPath)

  return elements.map((element, index) => ({
    elementId: element.id,
    databaseId: createdItems[index].id,
    elementType,
  }))
}

/**
 * Hilfsfunktion zum Zugriff auf verschachtelte Eigenschaften
 */
const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Aktualisiert Diagrammelemente mit Datenbankreferenzen
 */
export const updateElementsWithDatabaseReferences = (
  elements: DiagramElement[],
  createdElements: Array<{ elementId: string; databaseId: string; elementType: string }>
): DiagramElement[] => {
  const elementMap = new Map(createdElements.map(el => [el.elementId, el]))

  console.log('updateElementsWithDatabaseReferences:', {
    totalElements: elements.length,
    createdElements: createdElements.length,
    elementMap: Array.from(elementMap.keys()),
  })

  return elements.map(element => {
    const createdElement = elementMap.get(element.id)
    if (!createdElement) {
      return element
    }

    console.log(`Updating element ${element.id} with database reference:`, {
      originalStrokeColor: element.strokeColor,
      originalStrokeWidth: element.strokeWidth,
      newStrokeColor: '#000000',
      newStrokeWidth: 2,
      databaseId: createdElement.databaseId,
      elementType: createdElement.elementType,
    })

    // Update element with database reference using correct Excalidraw properties
    const updatedElement = {
      ...element,
      strokeColor: '#000000', // Schwarzer Rahmen
      strokeWidth: 2, // Rahmendicke 2px
      strokeStyle: 'solid', // Durchgezogene Linie
      customData: {
        ...element.customData,
        isFromDatabase: true,
        databaseId: createdElement.databaseId,
        elementType: createdElement.elementType as any, // Type assertion for compatibility
        isMainElement: true,
        originalElement: {
          id: createdElement.databaseId,
          name: extractElementText(element, []),
          elementType: createdElement.elementType,
        },
      },
    }

    console.log('Updated element result:', updatedElement)
    return updatedElement
  })
}

/**
 * Übersetzt Element-Typen in Deutsche Labels
 */
export const getElementTypeLabel = (elementType: string): string => {
  switch (elementType) {
    case ELEMENT_TYPES.APPLICATION:
      return 'Anwendung'
    case ELEMENT_TYPES.CAPABILITY:
      return 'Capability'
    case ELEMENT_TYPES.DATA_OBJECT:
      return 'Datenobjekt'
    case ELEMENT_TYPES.INTERFACE:
      return 'Schnittstelle'
    default:
      return elementType
  }
}
