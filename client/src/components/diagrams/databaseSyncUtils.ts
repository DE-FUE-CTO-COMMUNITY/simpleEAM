// Database synchronization utilities for diagram elements
import { gql } from '@apollo/client'
import { createApolloClient } from '@/lib/apollo-client'

// Create Apollo client instance for database operations
const apolloClient = createApolloClient()

interface DiagramElement {
  id: string
  type: string
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?: 'capability' | 'application' | 'dataObject' | 'interface'
    originalElement?: any
    isMainElement?: boolean
    mainElementId?: string
    lastSyncedName?: string
    isDatabaseMissing?: boolean
    missingReason?: string
  }
  strokeColor?: string
  strokeWidth?: number
  strokeStyle?: string
  text?: string
  rawText?: string
  [key: string]: any
}

interface ValidationResult {
  valid: boolean
  missingElements: string[]
  updatedElements: DiagramElement[]
}

/**
 * Extrahiert alle Datenbankelemente aus einem Diagramm
 */
export const extractDatabaseElements = (elements: DiagramElement[]): DiagramElement[] => {
  const databaseElements: DiagramElement[] = []
  const processedIds = new Set<string>()

  for (const element of elements) {
    if (!element.customData?.isFromDatabase) continue

    // Hauptelemente verarbeiten
    if (element.customData.isMainElement && element.customData.databaseId) {
      const dbId = element.customData.databaseId
      if (!processedIds.has(dbId)) {
        databaseElements.push(element)
        processedIds.add(dbId)
      }
    }
    // Untergeordnete Elemente - suche das Hauptelement
    else if (element.customData.mainElementId) {
      const mainElement = elements.find(el => el.id === element.customData!.mainElementId)
      if (mainElement?.customData?.isMainElement && mainElement.customData.databaseId) {
        const dbId = mainElement.customData.databaseId
        if (!processedIds.has(dbId)) {
          databaseElements.push(mainElement)
          processedIds.add(dbId)
        }
      }
    }
  }

  return databaseElements
}

/**
 * Holt aktuelle Daten für ein Datenbankelement
 */
export const fetchElementData = async (
  databaseId: string,
  elementType: string
): Promise<any | null> => {
  try {
    let query

    // Wähle die passende Query basierend auf dem Elementtyp
    switch (elementType) {
      case 'capability':
        query = gql`
          query GetCapability($id: ID!) {
            businessCapabilities(where: { id: { eq: $id } }) {
              id
              name
              description
              status
            }
          }
        `
        break
      case 'application':
        query = gql`
          query GetApplication($id: ID!) {
            applications(where: { id: { eq: $id } }) {
              id
              name
              description
              status
            }
          }
        `
        break
      case 'dataObject':
        query = gql`
          query GetDataObject($id: ID!) {
            dataObjects(where: { id: { eq: $id } }) {
              id
              name
              description
              classification
            }
          }
        `
        break
      case 'interface':
        query = gql`
          query GetInterface($id: ID!) {
            applicationInterfaces(where: { id: { eq: $id } }) {
              id
              name
              description
              protocol
            }
          }
        `
        break
      default:
        return null
    }

    const result = await apolloClient.query({
      query,
      variables: { id: databaseId },
      fetchPolicy: 'network-only', // Immer aktuelle Daten abrufen
    })

    // Rückgabe des entsprechenden Elementtyps
    switch (elementType) {
      case 'capability':
        return result.data.businessCapabilities?.[0] || null
      case 'application':
        return result.data.applications?.[0] || null
      case 'dataObject':
        return result.data.dataObjects?.[0] || null
      case 'interface':
        return result.data.applicationInterfaces?.[0] || null
      default:
        return null
    }
  } catch (error) {
    console.warn(`Failed to fetch data for ${elementType} ${databaseId}:`, error)
    return null
  }
}

/**
 * Aktualisiert den Namen eines Datenbankelements
 */
export const updateElementName = async (
  databaseId: string,
  elementType: string,
  newName: string
): Promise<boolean> => {
  try {
    let mutation

    // Wähle die passende Mutation basierend auf dem Elementtyp
    switch (elementType) {
      case 'capability':
        mutation = gql`
          mutation UpdateCapabilityName($id: ID!, $name: String!) {
            updateBusinessCapabilities(
              where: { id: { eq: $id } }
              update: { name: { set: $name } }
            ) {
              businessCapabilities {
                id
                name
              }
            }
          }
        `
        break
      case 'application':
        mutation = gql`
          mutation UpdateApplicationName($id: ID!, $name: String!) {
            updateApplications(where: { id: { eq: $id } }, update: { name: { set: $name } }) {
              applications {
                id
                name
              }
            }
          }
        `
        break
      case 'dataObject':
        mutation = gql`
          mutation UpdateDataObjectName($id: ID!, $name: String!) {
            updateDataObjects(where: { id: { eq: $id } }, update: { name: { set: $name } }) {
              dataObjects {
                id
                name
              }
            }
          }
        `
        break
      case 'interface':
        mutation = gql`
          mutation UpdateInterfaceName($id: ID!, $name: String!) {
            updateApplicationInterfaces(
              where: { id: { eq: $id } }
              update: { name: { set: $name } }
            ) {
              applicationInterfaces {
                id
                name
              }
            }
          }
        `
        break
      default:
        return false
    }

    await apolloClient.mutate({
      mutation,
      variables: {
        id: databaseId,
        name: newName.trim(),
      },
    })

    console.log(`Updated ${elementType} ${databaseId} name to: ${newName}`)
    return true
  } catch (error) {
    console.error(`Failed to update ${elementType} ${databaseId} name:`, error)
    return false
  }
}

/**
 * Validiert Datenbankverbindungen und aktualisiert Elementnamen
 */
export const validateAndSyncElements = async (
  elements: DiagramElement[]
): Promise<ValidationResult> => {
  const databaseElements = extractDatabaseElements(elements)
  const missingElements: string[] = []
  const updatedElements: DiagramElement[] = []

  for (const element of databaseElements) {
    if (!element.customData?.databaseId || !element.customData?.elementType) continue

    const databaseId = element.customData.databaseId
    const elementType = element.customData.elementType

    // Aktuelle Daten aus der Datenbank abrufen
    const currentData = await fetchElementData(databaseId, elementType)

    if (!currentData) {
      // Element nicht mehr in Datenbank vorhanden
      missingElements.push(databaseId)
      continue
    }

    // Namen synchronisieren wenn nötig
    if (currentData.name && element.customData.originalElement?.name !== currentData.name) {
      // Aktualisiere originalElement mit neuen Daten
      element.customData.originalElement = {
        ...element.customData.originalElement,
        ...currentData,
      }
      element.customData.lastSyncedName = currentData.name
      updatedElements.push(element)
    }
  }

  return {
    valid: missingElements.length === 0,
    missingElements,
    updatedElements,
  }
}

/**
 * Markiert fehlende Elemente mit roten Rahmen
 */
export const markMissingElements = (
  elements: DiagramElement[],
  missingIds: string[]
): DiagramElement[] => {
  if (missingIds.length === 0) return elements

  return elements.map(element => {
    if (!element.customData?.isFromDatabase) return element

    // Prüfe ob dieses Element oder sein Hauptelement fehlt
    let isMissing = false

    if (element.customData.isMainElement && element.customData.databaseId) {
      isMissing = missingIds.includes(element.customData.databaseId)
    } else if (element.customData.mainElementId) {
      // Finde das Hauptelement und prüfe dessen databaseId
      const mainElement = elements.find(el => el.id === element.customData!.mainElementId)
      if (mainElement?.customData?.databaseId) {
        isMissing = missingIds.includes(mainElement.customData.databaseId)
      }
    }

    if (isMissing) {
      return {
        ...element,
        strokeColor: '#ff0000',
        strokeWidth: 3,
        strokeStyle: 'solid',
        customData: {
          ...element.customData,
          isDatabaseMissing: true,
          missingReason: 'Element nicht mehr in Datenbank vorhanden',
        },
      }
    }

    return element
  })
}

/**
 * Synchronisiert Diagrammelemente beim Öffnen
 */
export const syncDiagramOnOpen = async (diagramData: any): Promise<any> => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return diagramData
  }

  console.log('Synchronizing diagram elements with database...')

  const validationResult = await validateAndSyncElements(diagramData.elements)

  // Aktualisiere Elemente mit neuen Namen
  let updatedElements = [...diagramData.elements]

  // Anwenden der Namen-Updates auf alle verwandten Elemente
  for (const updatedElement of validationResult.updatedElements) {
    const newName = updatedElement.customData?.originalElement?.name
    if (!newName) continue

    // Aktualisiere das Hauptelement und alle verwandten Elemente
    updatedElements = updatedElements.map(element => {
      // Hauptelement aktualisieren
      if (element.id === updatedElement.id) {
        return {
          ...element,
          customData: {
            ...element.customData,
            originalElement: updatedElement.customData?.originalElement,
            lastSyncedName: newName,
          },
        }
      }

      // Text-Elemente aktualisieren
      if (element.customData?.mainElementId === updatedElement.id && element.type === 'text') {
        return {
          ...element,
          text: newName,
          rawText: newName,
        }
      }

      return element
    })
  }

  // Markiere fehlende Elemente
  if (validationResult.missingElements.length > 0) {
    updatedElements = markMissingElements(updatedElements, validationResult.missingElements)
    console.warn(
      `Found ${validationResult.missingElements.length} missing database elements:`,
      validationResult.missingElements
    )
  }

  if (validationResult.updatedElements.length > 0) {
    console.log(
      `Updated ${validationResult.updatedElements.length} elements with latest database names`
    )
  }

  return {
    ...diagramData,
    elements: updatedElements,
  }
}

/**
 * Synchronisiert Änderungen zurück zur Datenbank beim Speichern
 */
export const syncDiagramOnSave = async (
  diagramData: any
): Promise<{ success: boolean; updatedCount: number }> => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return { success: true, updatedCount: 0 }
  }

  console.log('Syncing diagram changes back to database...')

  const databaseElements = extractDatabaseElements(diagramData.elements)
  let updatedCount = 0

  for (const element of databaseElements) {
    if (!element.customData?.databaseId || !element.customData?.elementType) continue

    // Finde das Text-Element für dieses Hauptelement
    const textElement = diagramData.elements.find(
      (el: DiagramElement) => el.customData?.mainElementId === element.id && el.type === 'text'
    )

    if (!textElement) continue

    const currentName = textElement.text || textElement.rawText
    const lastSyncedName =
      element.customData.lastSyncedName || element.customData.originalElement?.name

    // Prüfe ob sich der Name geändert hat
    if (currentName && currentName.trim() !== '' && currentName !== lastSyncedName) {
      const success = await updateElementName(
        element.customData.databaseId,
        element.customData.elementType,
        currentName.trim()
      )

      if (success) {
        // Aktualisiere lastSyncedName
        element.customData.lastSyncedName = currentName.trim()
        element.customData.originalElement = {
          ...element.customData.originalElement,
          name: currentName.trim(),
        }
        updatedCount++
      }
    }
  }

  if (updatedCount > 0) {
    console.log(`Successfully updated ${updatedCount} database element names`)
  }

  return { success: true, updatedCount }
}

/**
 * Entfernt Markierungen für fehlende Elemente
 */
export const clearMissingElementMarkers = (elements: DiagramElement[]): DiagramElement[] => {
  return elements.map(element => {
    if (element.customData?.isDatabaseMissing) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isDatabaseMissing, missingReason, ...cleanCustomData } = element.customData
      return {
        ...element,
        strokeColor: element.strokeColor === '#ff0000' ? '#000000' : element.strokeColor,
        strokeWidth: element.strokeWidth === 3 ? 1 : element.strokeWidth,
        customData: cleanCustomData,
      }
    }
    return element
  })
}
