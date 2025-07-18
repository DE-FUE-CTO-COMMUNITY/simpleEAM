// Database synchronization utilities for diagram elements
import { gql } from '@apollo/client'
import {
  normalizeText,
  prepareTextForDatabase,
  findLinkedTextElement,
  ensureTextContainerBindings,
  updateTextContentOnly,
} from './textContainerUtils'

interface DiagramElement {
  id: string
  type: string
  customData?: {
    isFromDatabase?: boolean
    databaseId?: string
    elementType?:
      | 'capability'
      | 'application'
      | 'dataObject'
      | 'interface'
      | 'infrastructure'
      | 'businessCapability'
      | 'applicationInterface'
    elementName?: string // Optimierung: Nur der Name statt kompletter originalElement
    originalElement?: any // Für Rückwärtskompatibilität beibehalten
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
  apolloClient: any,
  databaseId: string,
  elementType: string
): Promise<any | null> => {
  try {
    let query

    // Normalisiere elementType für businessCapability und applicationInterface
    const normalizedElementType =
      elementType === 'businessCapability'
        ? 'capability'
        : elementType === 'applicationInterface'
          ? 'interface'
          : elementType

    // Wähle die passende Query basierend auf dem Elementtyp
    switch (normalizedElementType) {
      case 'capability':
        query = gql`
          query GetCapability($id: ID!) {
            businessCapabilities(where: { id: { eq: $id } }) {
              id
              name
              description
              status
              maturityLevel
              businessValue
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
              interfaceType
            }
          }
        `
        break
      case 'infrastructure':
        query = gql`
          query GetInfrastructure($id: ID!) {
            infrastructures(where: { id: { eq: $id } }) {
              id
              name
              description
              infrastructureType
              status
              vendor
              version
              location
            }
          }
        `
        break
      default:
        console.warn(`Unknown elementType: ${elementType} (normalized: ${normalizedElementType})`)
        return null
    }

    const result = await apolloClient.query({
      query,
      variables: { id: databaseId },
      fetchPolicy: 'network-only', // Immer aktuelle Daten abrufen
    })

    // Rückgabe des entsprechenden Elementtyps
    switch (normalizedElementType) {
      case 'capability':
        return result.data.businessCapabilities?.[0] || null
      case 'application':
        return result.data.applications?.[0] || null
      case 'dataObject':
        return result.data.dataObjects?.[0] || null
      case 'interface':
        return result.data.applicationInterfaces?.[0] || null
      case 'infrastructure':
        return result.data.infrastructures?.[0] || null
      default:
        console.warn(`Unknown normalized elementType: ${normalizedElementType}`)
        return null
    }
  } catch (error: any) {
    console.warn(`Failed to fetch data for ${elementType} ${databaseId}:`, error)
    console.warn(
      `GraphQL error details:`,
      error?.graphQLErrors || error?.networkError || 'No detailed error info'
    )

    // Bei GraphQL-Fehlern die Response analysieren
    if (error?.graphQLErrors?.length > 0) {
      error.graphQLErrors.forEach((gqlError: any, index: number) => {
        console.warn(`GraphQL Error ${index + 1}:`, gqlError.message)
        if (gqlError.path) {
          console.warn(`Error path:`, gqlError.path)
        }
      })
    }

    return null
  }
}

/**
 * Aktualisiert den Namen eines Datenbankelements
 */
export const updateElementName = async (
  apolloClient: any,
  databaseId: string,
  elementType: string,
  newName: string
): Promise<boolean> => {
  try {
    let mutation

    // Normalisiere elementType für konsistente Behandlung
    const normalizedElementType =
      elementType === 'businessCapability'
        ? 'capability'
        : elementType === 'applicationInterface'
          ? 'interface'
          : elementType

    // Wähle die passende Mutation basierend auf dem Elementtyp
    switch (normalizedElementType) {
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
      case 'infrastructure':
        mutation = gql`
          mutation UpdateInfrastructureName($id: ID!, $name: String!) {
            updateInfrastructures(where: { id: { eq: $id } }, update: { name: { set: $name } }) {
              infrastructures {
                id
                name
              }
            }
          }
        `
        break
      default:
        console.warn(
          `Unknown elementType for mutation: ${elementType} (normalized: ${normalizedElementType})`
        )
        return false
    }

    await apolloClient.mutate({
      mutation,
      variables: {
        id: databaseId,
        name: prepareTextForDatabase(newName),
      },
    })

    return true
  } catch (error) {
    console.error(`Failed to update ${elementType} ${databaseId} name:`, error)
    return false
  }
}

/**
 * Validiert und synchronisiert Elemente beim Import von anderen Instanzen (mit Namensvergleich für ID-Mapping)
 * WICHTIG: Aktualisiert ALLE Instanzen von Elementen mit derselben databaseId
 * Sollte NUR beim Import verwendet werden, wo IDs nicht übereinstimmen und Namen verglichen werden müssen
 */
export const validateAndSyncElementsForImport = async (
  apolloClient: any,
  elements: DiagramElement[]
): Promise<ValidationResult> => {
  const databaseElements = extractDatabaseElements(elements)
  const missingElements: string[] = []
  const updatedElements: DiagramElement[] = []

  // Verarbeite jede eindeutige databaseId
  for (const element of databaseElements) {
    if (!element.customData?.databaseId || !element.customData?.elementType) continue

    const databaseId = element.customData.databaseId
    const elementType = element.customData.elementType

    // Aktuelle Daten aus der Datenbank abrufen
    const currentData = await fetchElementData(apolloClient, databaseId, elementType)

    if (!currentData) {
      // Element nicht mehr in Datenbank vorhanden
      missingElements.push(databaseId)
      continue
    }

    const databaseName = currentData.name

    // WICHTIG: Finde ALLE Elemente mit derselben databaseId
    const allElementsWithSameDbId = elements.filter(el => el.customData?.databaseId === databaseId)

    // Verarbeite jede Instanz des Datenbankelements
    for (const elementInstance of allElementsWithSameDbId) {
      // Sichere Prüfung für customData
      if (!elementInstance.customData) continue

      // Namen synchronisieren wenn nötig - prüfe verschiedene Quellen für aktuellen Namen
      const currentElementName =
        elementInstance.customData.elementName || elementInstance.customData.originalElement?.name

      // Verwende die gemeinsame Funktion für robuste Text-Element-Suche
      const textElement = findLinkedTextElement(elementInstance, elements)
      const displayedName = textElement?.text || textElement?.rawText

      // Update erforderlich wenn sich der Datenbankname vom gespeicherten Namen unterscheidet
      // Verwende normalizeText für Vergleiche, um Zeilenumbrüche zu ignorieren
      // Behandle undefined/null Werte korrekt
      const normalizedCurrentElementName = normalizeText(currentElementName)
      const normalizedDisplayedName = normalizeText(displayedName)
      const normalizedDatabaseName = normalizeText(databaseName)

      // Debug: Zeige die Vergleichswerte nur wenn ein Update potentiell nötig ist
      const isDisplayedNameDifferent =
        displayedName && normalizedDisplayedName !== normalizedDatabaseName
      const isOriginalNameDifferent =
        currentElementName && normalizedCurrentElementName !== normalizedDatabaseName

      // Update nur wenn tatsächlich eine Diskrepanz besteht
      const nameUpdateNeeded = databaseName && (isDisplayedNameDifferent || isOriginalNameDifferent)

      if (nameUpdateNeeded) {
        // Aktualisiere elementName mit neuen Daten (optimiert)
        elementInstance.customData.elementName = databaseName
        elementInstance.customData.lastSyncedName = databaseName

        // WICHTIG: Auch das zugehörige Text-Element direkt aktualisieren
        if (textElement) {
          // Aktualisiere den Text-Inhalt direkt
          const updatedTextElement = updateTextContentOnly(textElement, databaseName, elements)

          // Füge sowohl das Container-Element als auch das Text-Element zu den Updates hinzu
          updatedElements.push(elementInstance, updatedTextElement)
        } else {
          console.warn(
            `No text element found for ${elementType} ${databaseId} (instance ${elementInstance.id})`
          )
          updatedElements.push(elementInstance)
        }
      }
    }
  }

  return {
    valid: missingElements.length === 0,
    missingElements,
    updatedElements,
  }
}

/**
 * Markiert fehlende Elemente mit roten Rahmen und entfernt Markierungen für gefundene Elemente
 */
export const markMissingElements = (
  elements: DiagramElement[],
  missingIds: string[]
): DiagramElement[] => {
  return elements.map(element => {
    if (!element.customData?.isFromDatabase) return element

    // Prüfe ob dieses Element oder sein Hauptelement fehlt
    let isMissing = false
    let databaseId: string | undefined

    if (element.customData.isMainElement && element.customData.databaseId) {
      databaseId = element.customData.databaseId
      isMissing = missingIds.includes(databaseId)
    } else if (element.customData.mainElementId) {
      // Finde das Hauptelement und prüfe dessen databaseId
      const mainElement = elements.find(el => el.id === element.customData!.mainElementId)
      if (mainElement?.customData?.databaseId) {
        databaseId = mainElement.customData.databaseId
        isMissing = missingIds.includes(databaseId)
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
    } else if (element.customData.isDatabaseMissing) {
      // Element war vorher als fehlend markiert, ist aber jetzt wieder da - entferne Markierung
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isDatabaseMissing, missingReason, ...cleanCustomData } = element.customData
      return {
        ...element,
        strokeColor: element.strokeColor === '#ff0000' ? '#000000' : element.strokeColor,
        strokeWidth: element.strokeWidth === 3 ? 2 : element.strokeWidth,
        strokeStyle: 'solid',
        customData: cleanCustomData,
      }
    }

    return element
  })
}

/**
 * Debug-Hilfsfunktion: Analysiert alle Elemente und deren Verknüpfungen
 */
const debugElementStructure = (elements: DiagramElement[]): void => {
  const databaseElements = elements.filter(el => el.customData?.isFromDatabase)

  databaseElements.forEach(dbEl => {
    // Verwende die gemeinsame Funktion für Text-Element-Suche
    findLinkedTextElement(dbEl, elements)
  })
}

/**
 * Einfache Synchronisation beim Öffnen von Diagrammen - lädt Namen direkt über IDs ohne Vergleich
 */
export const syncDiagramOnOpenSimple = async (
  apolloClient: any,
  elements: DiagramElement[]
): Promise<DiagramElement[]> => {
  const databaseElements = extractDatabaseElements(elements)
  const missingElements: string[] = []
  const updatedElements: DiagramElement[] = []

  // Verarbeite jede eindeutige databaseId - nur ID-basierte Abfrage, kein Namensvergleich
  for (const element of databaseElements) {
    if (!element.customData?.databaseId || !element.customData?.elementType) continue

    const databaseId = element.customData.databaseId
    const elementType = element.customData.elementType

    // Aktuelle Daten aus der Datenbank abrufen
    const currentData = await fetchElementData(apolloClient, databaseId, elementType)

    if (!currentData) {
      // Element nicht mehr in Datenbank vorhanden
      missingElements.push(databaseId)
      continue
    }

    const databaseName = currentData.name

    // WICHTIG: Finde ALLE Elemente mit derselben databaseId
    const allElementsWithSameDbId = elements.filter(el => el.customData?.databaseId === databaseId)

    // Verarbeite jede Instanz des Datenbankelements
    for (const elementInstance of allElementsWithSameDbId) {
      // Sichere Prüfung für customData
      if (!elementInstance.customData) continue

      // Verwende die gemeinsame Funktion für robuste Text-Element-Suche
      const textElement = findLinkedTextElement(elementInstance, elements)

      // Beim normalen Öffnen: IMMER den Datenbanknamen verwenden, kein Vergleich nötig
      if (databaseName && textElement) {
        // Erstelle eine Kopie des Elements mit aktualisiertem Namen
        const updatedElement = {
          ...elementInstance,
          customData: {
            ...elementInstance.customData,
            elementName: databaseName,
            lastSyncedName: databaseName,
            // Entferne die missing-Markierung falls vorhanden
            isDatabaseMissing: false,
            missingReason: undefined,
          },
        }

        // Aktualisiere das Text-Element mit dem Datenbanknamen - WICHTIG: mit allElements für korrekte Formatierung
        const updatedTextElement = updateTextContentOnly(textElement, databaseName, elements)

        updatedElements.push(updatedElement)
        if (updatedTextElement && updatedTextElement.id !== updatedElement.id) {
          updatedElements.push(updatedTextElement)
        }
      }
    }
  }

  // Aktualisiere Elemente mit neuen Namen
  let finalElements = [...elements]

  // Aktualisiere Elemente basierend auf den Ergebnissen
  for (const updatedElement of updatedElements) {
    const elementIndex = finalElements.findIndex(el => el.id === updatedElement.id)
    if (elementIndex !== -1) {
      // Ersetze das Element im Array
      finalElements[elementIndex] = updatedElement
    }
  }

  // WICHTIG: Markiere fehlende UND entferne Markierungen für gefundene Elemente
  finalElements = markMissingElements(finalElements, missingElements)

  // Stelle sicher, dass Text-Container-Bindungen korrekt sind
  finalElements = ensureTextContainerBindings(finalElements)

  if (missingElements.length > 0) {
    console.warn(`Found ${missingElements.length} missing database elements:`, missingElements)
  }

  return finalElements
}

/**
 * Synchronisiert Diagrammelemente beim Öffnen
 */
export const syncDiagramOnOpen = async (apolloClient: any, diagramData: any): Promise<any> => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return diagramData
  }

  // Debug: Analysiere Element-Struktur
  debugElementStructure(diagramData.elements)

  // Verwende die einfache Synchronisation ohne Namensvergleich
  const updatedElements = await syncDiagramOnOpenSimple(apolloClient, diagramData.elements)

  return {
    ...diagramData,
    elements: updatedElements,
  }
}

/**
 * Synchronisiert Änderungen zurück zur Datenbank beim Speichern
 */
export const syncDiagramOnSave = async (
  apolloClient: any,
  diagramData: any
): Promise<{ success: boolean; updatedCount: number }> => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return { success: true, updatedCount: 0 }
  }

  const databaseElements = extractDatabaseElements(diagramData.elements)
  let updatedCount = 0

  for (const element of databaseElements) {
    if (!element.customData?.databaseId || !element.customData?.elementType) continue

    // Verwende die gemeinsame Funktion für robuste Text-Element-Suche
    const textElement = findLinkedTextElement(element, diagramData.elements)

    if (!textElement) {
      console.warn(`No text element found for database element ${element.customData.databaseId}`)
      console.warn(
        `Available text elements:`,
        diagramData.elements
          .filter((el: DiagramElement) => el.type === 'text')
          .map((el: DiagramElement) => ({
            id: el.id,
            text: el.text,
            rawText: el.rawText,
            customData: el.customData,
            x: el.x,
            y: el.y,
          }))
      )
      continue
    }

    const currentName = normalizeText(textElement.text || textElement.rawText)
    const lastSyncedName = normalizeText(
      element.customData.lastSyncedName ||
        element.customData.elementName ||
        element.customData.originalElement?.name
    )

    // Prüfe ob sich der Name geändert hat (mit normalisiertem Text)
    if (currentName && currentName.trim() !== '' && currentName !== lastSyncedName) {
      // WICHTIG: Normalisiere den Namen vor dem Speichern (entferne Zeilenumbrüche)
      const normalizedName = currentName.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')

      const success = await updateElementName(
        apolloClient,
        element.customData.databaseId,
        element.customData.elementType,
        normalizedName
      )

      if (success) {
        // Aktualisiere lastSyncedName mit normalisiertem Namen
        element.customData.lastSyncedName = normalizedName
        // WICHTIG: Verwende nur elementName, nicht originalElement.name für bessere Performance
        element.customData.elementName = normalizedName
        updatedCount++
      } else {
        console.error(`Failed to update name for ${element.customData.databaseId}`)
      }
    }
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
        strokeWidth: element.strokeWidth === 3 ? 2 : element.strokeWidth,
        strokeStyle: 'solid',
        customData: cleanCustomData,
      }
    }
    return element
  })
}
