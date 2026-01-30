// Import ID mapping utilities for diagram elements
import { gql } from '@apollo/client'

interface ElementIdMapping {
  oldId: string
  newId: string
  elementType: string
  elementName: string
}

interface DiagramElement {
  id: string
  type: string
  text?: string
  rawText?: string
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?:
      | 'businessCapability'
      | 'application'
      | 'dataObject'
      | 'interface'
      | 'businessCapability'
      | 'applicationInterface'
    elementName?: string // Optimierung: Nur der Name statt kompletter originalElement
    originalElement?: any // Für Rückwärtskompatibilität beibehalten
    isMainElement?: boolean
    mainElementId?: string
    lastSyncedName?: string
  }
  [key: string]: any
}

interface ImportedDiagramData {
  elements: DiagramElement[]
  appState: any
}

// GraphQL queries to find elements by type and name
const FIND_ELEMENT_QUERIES = {
  capability: gql`
    query FindCapabilityByName($name: String!) {
      businessCapabilities(where: { name: { eq: $name } }) {
        id
        name
        description
      }
    }
  `,
  businessCapability: gql`
    query FindCapabilityByName($name: String!) {
      businessCapabilities(where: { name: { eq: $name } }) {
        id
        name
        description
      }
    }
  `,
  application: gql`
    query FindApplicationByName($name: String!) {
      applications(where: { name: { eq: $name } }) {
        id
        name
        description
      }
    }
  `,
  dataObject: gql`
    query FindDataObjectByName($name: String!) {
      dataObjects(where: { name: { eq: $name } }) {
        id
        name
        description
      }
    }
  `,
  interface: gql`
    query FindInterfaceByName($name: String!) {
      applicationInterfaces(where: { name: { eq: $name } }) {
        id
        name
        description
      }
    }
  `,
  applicationInterface: gql`
    query FindInterfaceByName($name: String!) {
      applicationInterfaces(where: { name: { eq: $name } }) {
        id
        name
        description
      }
    }
  `,
}

// GraphQL queries to check if element exists by ID
const CHECK_ELEMENT_QUERIES = {
  capability: gql`
    query CheckCapabilityExists($id: ID!) {
      businessCapabilities(where: { id: { eq: $id } }) {
        id
        name
      }
    }
  `,
  businessCapability: gql`
    query CheckCapabilityExists($id: ID!) {
      businessCapabilities(where: { id: { eq: $id } }) {
        id
        name
      }
    }
  `,
  application: gql`
    query CheckApplicationExists($id: ID!) {
      applications(where: { id: { eq: $id } }) {
        id
        name
      }
    }
  `,
  dataObject: gql`
    query CheckDataObjectExists($id: ID!) {
      dataObjects(where: { id: { eq: $id } }) {
        id
        name
      }
    }
  `,
  interface: gql`
    query CheckInterfaceExists($id: ID!) {
      applicationInterfaces(where: { id: { eq: $id } }) {
        id
        name
      }
    }
  `,
  applicationInterface: gql`
    query CheckInterfaceExists($id: ID!) {
      applicationInterfaces(where: { id: { eq: $id } }) {
        id
        name
      }
    }
  `,
}

/**
 * Normalisiert Elementtypen für einheitliche Verarbeitung
 */
const normalizeElementType = (elementType: string): string => {
  switch (elementType) {
    case 'businessCapability':
      return 'businessCapability'
    case 'applicationInterface':
      return 'interface'
    default:
      return elementType
  }
}

/**
 * Normalisiert Element-Namen für bessere Vergleichbarkeit
 */
const normalizeElementName = (name: string): string => {
  return name
    .trim()
    .replace(/\n/g, ' ') // Ersetze Zeilenumbrüche durch Leerzeichen
    .replace(/\s+/g, ' ') // Mehrfache Leerzeichen durch einzelne ersetzen
}

/**
 * Extrahiert den Namen eines Elements (prioritiert Datenbank-Namen über angezeigten Text)
 */
const extractElementName = (
  element: DiagramElement,
  allElements: DiagramElement[]
): string | null => {
  // Für Datenbank-Elemente: Priorität liegt auf dem ursprünglichen DB-Namen
  if (element.customData?.isFromDatabase) {
    // 1. HÖCHSTE Priorität: elementName (optimiert, statt originalElement.name)
    if (element.customData.elementName) {
      const dbName = normalizeElementName(element.customData.elementName)
      return dbName
    }

    // 2. Fallback: originalElement.name (für Rückwärtskompatibilität)
    if (element.customData.originalElement?.name) {
      const dbName = normalizeElementName(element.customData.originalElement.name)
      return dbName
    }

    // 3. Priorität: Direkt im Element gespeicherter Text (falls kein elementName)
    if (element.text || element.rawText) {
      const directText = normalizeElementName(element.text || element.rawText || '')
      return directText
    }

    // 3. NIEDRIGSTE Priorität: Suche nach verknüpftem Text-Element (kann Zeilenumbrüche enthalten)
    const textElement = allElements.find(
      el =>
        el.type === 'text' &&
        (el.containerId === element.id ||
          // Fallback: Text-Element in der Nähe
          (el.x !== undefined &&
            el.y !== undefined &&
            element.x !== undefined &&
            element.y !== undefined &&
            Math.abs(el.x - element.x) < 50 &&
            Math.abs(el.y - element.y) < 50))
    )

    if (textElement && (textElement.text || textElement.rawText)) {
      // Entferne Zeilenumbrüche aus dem angezeigten Text
      const displayedText = normalizeElementName(textElement.text || textElement.rawText || '')
      return displayedText
    }
  }

  // Für Text-Elemente: direkter Text (mit bereinigten Zeilenumbrüchen)
  if (element.type === 'text') {
    const cleanedText = normalizeElementName(element.text || element.rawText || '')
    return cleanedText
  }

  return null
}

/**
 * Prüft, ob ein Element mit der gegebenen ID in der Datenbank existiert
 */
const checkElementExistsById = async (
  apolloClient: any,
  elementId: string,
  elementType: string
): Promise<boolean> => {
  const normalizedType = normalizeElementType(elementType)
  const query = CHECK_ELEMENT_QUERIES[normalizedType as keyof typeof CHECK_ELEMENT_QUERIES]

  if (!query) {
    console.warn(`No check query found for element type: ${elementType}`)
    return false
  }

  try {
    const result = await apolloClient.query({
      query,
      variables: { id: elementId },
      fetchPolicy: 'network-only',
    })

    // Prüfe, ob ein Element zurückgegeben wurde
    const elements = Object.values(result.data)[0] as any[]
    return elements && elements.length > 0
  } catch (error) {
    console.warn(`Error checking existence of ${elementType} ${elementId}:`, error)
    return false
  }
}

/**
 * Sucht ein Element mit dem gleichen Typ und Namen in der Datenbank
 */
const findElementByTypeAndName = async (
  apolloClient: any,
  elementType: string,
  elementName: string
): Promise<string | null> => {
  const normalizedType = normalizeElementType(elementType)
  const query = FIND_ELEMENT_QUERIES[normalizedType as keyof typeof FIND_ELEMENT_QUERIES]

  if (!query) {
    console.warn(`No find query found for element type: ${elementType}`)
    return null
  }

  try {
    const result = await apolloClient.query({
      query,
      variables: { name: elementName },
      fetchPolicy: 'network-only',
    })

    // Hole das erste gefundene Element
    const elements = Object.values(result.data)[0] as any[]
    if (elements && elements.length > 0) {
      return elements[0].id
    }

    return null
  } catch (error) {
    console.warn(`Error finding ${elementType} by name "${elementName}":`, error)
    return null
  }
}

/**
 * Erstellt ID-Mappings für importierte Diagramm-Elemente
 */
export const createIdMappingsForImport = async (
  apolloClient: any,
  importedData: ImportedDiagramData
): Promise<ElementIdMapping[]> => {
  const mappings: ElementIdMapping[] = []
  const processedElements = new Set<string>()

  for (const element of importedData.elements) {
    // Nur Datenbank-Elemente verarbeiten
    if (
      !element.customData?.isFromDatabase ||
      !element.customData?.databaseId ||
      !element.customData?.elementType
    ) {
      continue
    }

    // Hauptelemente bevorzugen, um Duplikate zu vermeiden
    if (!element.customData.isMainElement) {
      continue
    }

    const oldId = element.customData.databaseId
    const elementType = element.customData.elementType

    // Bereits verarbeitete Elemente überspringen
    if (processedElements.has(oldId)) {
      continue
    }

    processedElements.add(oldId)

    // 1. Prüfe, ob die Original-ID in der aktuellen Datenbank existiert
    const existsById = await checkElementExistsById(apolloClient, oldId, elementType)

    if (existsById) {
      continue
    }

    // 2. Element existiert nicht - suche nach Element mit gleichem Namen
    const elementName = extractElementName(element, importedData.elements)

    if (!elementName) {
      continue
    }

    const newId = await findElementByTypeAndName(apolloClient, elementType, elementName)

    if (newId) {
      mappings.push({
        oldId,
        newId,
        elementType,
        elementName,
      })
    } else {
      console.warn(
        `Kein passendes Element gefunden für ${elementType} "${elementName}" (ID: ${oldId})`
      )
    }
  }

  return mappings
}

/**
 * Wendet ID-Mappings auf importierte Diagramm-Daten an
 */
export const applyIdMappingsToImportedData = (
  importedData: ImportedDiagramData,
  mappings: ElementIdMapping[]
): ImportedDiagramData => {
  if (mappings.length === 0) {
    return importedData
  }

  const mappingMap = new Map(mappings.map(m => [m.oldId, m.newId]))

  const updatedElements = importedData.elements.map(element => {
    // Prüfe, ob Element eine Datenbank-ID hat, die gemappt werden muss
    if (element.customData?.isFromDatabase && element.customData.databaseId) {
      const oldId = element.customData.databaseId
      const newId = mappingMap.get(oldId)

      if (newId) {
        return {
          ...element,
          customData: {
            ...element.customData,
            databaseId: newId,
          },
        }
      }
    }

    return element
  })

  return {
    ...importedData,
    elements: updatedElements,
  }
}

/**
 * Hauptfunktion: Verarbeitet importierte Diagramm-Daten und mappt IDs bei Bedarf
 */
export const processImportedDiagramData = async (
  apolloClient: any,
  importedData: ImportedDiagramData
): Promise<{
  processedData: ImportedDiagramData
  mappings: ElementIdMapping[]
  summary: string
}> => {
  // 1. Erstelle ID-Mappings
  const mappings = await createIdMappingsForImport(apolloClient, importedData)

  // 2. Wende Mappings an
  const processedData = applyIdMappingsToImportedData(importedData, mappings)

  // 3. Erstelle Zusammenfassung
  const summary =
    mappings.length > 0
      ? `${mappings.length} Element-IDs wurden automatisch angepasst:\n${mappings
          .map(m => `• ${m.elementType}: "${m.elementName}" (${m.oldId} → ${m.newId})`)
          .join('\n')}`
      : 'Alle Element-IDs sind bereits korrekt, keine Anpassungen nötig.'

  return {
    processedData,
    mappings,
    summary,
  }
}

/**
 * Aktualisiert die databaseId-Referenzen in einem Diagramm-JSON basierend auf ID-Mappings
 * Diese Funktion ist speziell für JSON-Imports gedacht und unterscheidet sich von der
 * Excel-Version, da sie mit customData.databaseId arbeitet statt customFields.databaseId
 */
export const updateDiagramDatabaseIds = (
  diagramData: ImportedDiagramData,
  idMappings: { [oldId: string]: string }
): ImportedDiagramData => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return diagramData
  }

  const updatedElements = diagramData.elements.map(element => {
    // Prüfe, ob Element customData mit databaseId hat
    if (element.customData?.databaseId) {
      const oldId = element.customData.databaseId
      const newId = idMappings[oldId]

      if (newId && newId !== oldId) {
        return {
          ...element,
          customData: {
            ...element.customData,
            databaseId: newId,
          },
        }
      }
    }

    return element
  })

  return {
    ...diagramData,
    elements: updatedElements,
  }
}
