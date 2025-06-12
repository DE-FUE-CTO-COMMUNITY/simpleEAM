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

    // Skip if not a shape that can be converted to database element
    if (!['rectangle', 'ellipse', 'diamond'].includes(element.type)) {
      continue
    }

    // Mindestgröße prüfen - beide Dimensionen müssen groß genug sein
    const minWidth = 80 // Mindestens 80px Breite
    const minHeight = 40 // Mindestens 40px Höhe
    if (element.width < minWidth || element.height < minHeight) {
      continue
    }

    // Extract text content
    const text = extractElementText(element, elements)

    // Skip Elemente ohne Text
    if (!text || text.trim().length === 0) {
      continue
    }

    // Verbesserte Filterung für "Unbenannte Elemente"
    const trimmedText = text.trim()

    // Skip Default-Namen und sehr kurze Texte
    const defaultNames = ['unbenanntes element', 'unnamed element', 'element', 'neu', 'new']
    if (defaultNames.includes(trimmedText.toLowerCase()) || trimmedText.length < 3) {
      continue
    }

    // Skip Elemente mit nur Zahlen, Sonderzeichen oder sehr kurzen Texten
    if (/^[0-9\s\-_.]*$/.test(trimmedText) || /^[^a-zA-ZäöüÄÖÜß]*$/.test(trimmedText)) {
      continue
    }

    // Skip Elemente, die nur aus wenigen Zeichen bestehen
    if (
      trimmedText.length < 2 ||
      (trimmedText.length === 2 && !/[a-zA-ZäöüÄÖÜß]/.test(trimmedText))
    ) {
      continue
    }

    // Try to determine element type based on shape and text
    const elementType = determineElementType(element, elements)
    if (!elementType) {
      continue
    }

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
 * Bestimmt den Element-Typ basierend auf Form und Text
 */
const determineElementType = (
  element: DiagramElement,
  allElements: DiagramElement[]
): string | null => {
  const text = extractElementText(element, allElements)?.toLowerCase() || ''

  // Einfache Heuristik basierend auf Form und Textinhalt
  switch (element.type) {
    case 'rectangle':
      if (text.includes('application') || text.includes('app') || text.includes('anwendung')) {
        return ELEMENT_TYPES.APPLICATION
      }
      if (text.includes('data') || text.includes('daten')) {
        return ELEMENT_TYPES.DATA_OBJECT
      }
      if (text.includes('interface') || text.includes('schnittstelle')) {
        return ELEMENT_TYPES.INTERFACE
      }
      // Default für Rechtecke
      return ELEMENT_TYPES.APPLICATION

    case 'ellipse':
      if (text.includes('capability') || text.includes('fähigkeit')) {
        return ELEMENT_TYPES.CAPABILITY
      }
      // Default für Ellipsen
      return ELEMENT_TYPES.CAPABILITY

    case 'diamond':
      // Diamanten als Data Objects interpretieren
      return ELEMENT_TYPES.DATA_OBJECT

    default:
      return null
  }
}

/**
 * Extrahiert Text aus einem Element (sucht nach verknüpften Text-Elementen)
 */
const extractElementText = (element: DiagramElement, allElements: DiagramElement[]): string => {
  // Check if element has bound text elements
  if (element.type === 'text') {
    return (element as any).text || ''
  }

  // Look for linked text elements
  const linkedTextElement = allElements.find(
    el => el.type === 'text' && (el as any).containerId === element.id
  )

  if (linkedTextElement) {
    return (linkedTextElement as any).text || ''
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
