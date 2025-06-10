// Database synchronization utilities for diagram elements
import { gql } from '@apollo/client'

/**
 * Entfernt Zeilenumbrüche und normalisiert Text für Vergleiche
 */
const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''
  return text.replace(/\r?\n/g, ' ').trim()
}

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
      | 'businessCapability'
      | 'applicationInterface'
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
  apolloClient: any,
  elements: DiagramElement[]
): Promise<ValidationResult> => {
  const databaseElements = extractDatabaseElements(elements)
  const missingElements: string[] = []
  const updatedElements: DiagramElement[] = []

  console.log(`Validating ${databaseElements.length} database elements...`)

  for (const element of databaseElements) {
    if (!element.customData?.databaseId || !element.customData?.elementType) continue

    const databaseId = element.customData.databaseId
    const elementType = element.customData.elementType

    console.log(
      `Checking ${elementType} with ID: ${databaseId} (original elementType: ${element.customData.elementType})`
    )

    // Aktuelle Daten aus der Datenbank abrufen
    const currentData = await fetchElementData(apolloClient, databaseId, elementType)

    if (!currentData) {
      // Element nicht mehr in Datenbank vorhanden
      console.log(`Element ${databaseId} not found in database`)
      missingElements.push(databaseId)
      continue
    }

    console.log(`Found element ${databaseId} with name: ${currentData.name}`)

    // Namen synchronisieren wenn nötig - prüfe verschiedene Quellen für aktuellen Namen
    const currentElementName = element.customData.originalElement?.name
    const lastSyncedName = element.customData.lastSyncedName
    const databaseName = currentData.name

    // Robuste Text-Element-Suche mit verschiedenen Verknüpfungsstrategien
    let textElement = elements.find(
      el =>
        el.type === 'text' &&
        // 1. Direkte Verknüpfung über mainElementId
        (el.customData?.mainElementId === element.id ||
          // 2. Verknüpfung über dieselbe databaseId
          (el.customData?.databaseId === databaseId && databaseId) ||
          // 3. Text-Inhalt stimmt mit aktuellem Namen überein
          normalizeText(el.text) === normalizeText(currentElementName) ||
          normalizeText(el.rawText) === normalizeText(currentElementName) ||
          // 4. Text-Inhalt stimmt mit letztem synchronisierten Namen überein
          (lastSyncedName &&
            (normalizeText(el.text) === normalizeText(lastSyncedName) ||
              normalizeText(el.rawText) === normalizeText(lastSyncedName))))
    )

    // Fallback: Suche nach Text-Elementen in der Nähe des Hauptelements
    if (!textElement && element.x !== undefined && element.y !== undefined) {
      const tolerance = 100 // Pixel-Toleranz für Nähe-Suche
      textElement = elements.find(
        el =>
          el.type === 'text' &&
          el.x !== undefined &&
          el.y !== undefined &&
          Math.abs(el.x - element.x) < tolerance &&
          Math.abs(el.y - element.y) < tolerance &&
          // Zusätzlich: Text sollte ähnlich zum erwarteten Namen sein
          (normalizeText(el.text).includes(normalizeText(currentElementName).split(' ')[0]) ||
            normalizeText(currentElementName).includes(normalizeText(el.text).split(' ')[0]))
      )
    }

    const displayedName = textElement?.text || textElement?.rawText

    console.log(`Name comparison for ${databaseId}:`)
    console.log(`  - originalElement.name: "${currentElementName}"`)
    console.log(`  - lastSyncedName: "${lastSyncedName}"`)
    console.log(`  - displayedName: "${displayedName}"`)
    console.log(`  - databaseName: "${databaseName}"`)
    console.log(`  - textElement found: ${!!textElement} (id: ${textElement?.id})`)

    // Update erforderlich wenn sich der Datenbankname vom gespeicherten Namen unterscheidet
    // Verwende normalizeText für Vergleiche, um Zeilenumbrüche zu ignorieren
    // Behandle undefined/null Werte korrekt
    const normalizedCurrentElementName = normalizeText(currentElementName)
    const normalizedLastSyncedName = lastSyncedName ? normalizeText(lastSyncedName) : ''
    const normalizedDisplayedName = normalizeText(displayedName)
    const normalizedDatabaseName = normalizeText(databaseName)

    console.log(`Normalized comparison:`)
    console.log(`  - normalizedCurrentElementName: "${normalizedCurrentElementName}"`)
    console.log(`  - normalizedLastSyncedName: "${normalizedLastSyncedName}"`)
    console.log(`  - normalizedDisplayedName: "${normalizedDisplayedName}"`)
    console.log(`  - normalizedDatabaseName: "${normalizedDatabaseName}"`)

    // Ein Update ist NUR nötig, wenn sich Namen tatsächlich unterscheiden
    // Ignoriere lastSyncedName - das ist nur ein interner Tracking-Wert

    const isDisplayedNameDifferent =
      displayedName && normalizedDisplayedName !== normalizedDatabaseName
    const isOriginalNameDifferent =
      currentElementName && normalizedCurrentElementName !== normalizedDatabaseName

    // Update nur wenn tatsächlich eine Diskrepanz besteht
    const nameUpdateNeeded = databaseName && (isDisplayedNameDifferent || isOriginalNameDifferent)

    console.log(`Update decision:`)
    console.log(
      `  - displayedName different from DB: ${isDisplayedNameDifferent} ("${normalizedDisplayedName}" vs "${normalizedDatabaseName}")`
    )
    console.log(
      `  - originalName different from DB: ${isOriginalNameDifferent} ("${normalizedCurrentElementName}" vs "${normalizedDatabaseName}")`
    )
    console.log(`  - nameUpdateNeeded: ${nameUpdateNeeded}`)

    if (nameUpdateNeeded) {
      console.log(`Name update needed for ${databaseId}: updating to "${databaseName}"`)

      // Aktualisiere originalElement mit neuen Daten
      element.customData.originalElement = {
        ...element.customData.originalElement,
        ...currentData,
      }
      element.customData.lastSyncedName = databaseName
      updatedElements.push(element)
    } else if (databaseName) {
      console.log(`No name change needed for ${databaseId}`)
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
      console.log(`Marking element ${databaseId} as missing (red border)`)
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
      console.log(`Removing missing marker for element ${databaseId} (found in database)`)
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
  console.group('📊 Element Structure Analysis')

  const databaseElements = elements.filter(el => el.customData?.isFromDatabase)
  const textElements = elements.filter(el => el.type === 'text')

  console.log(`Total elements: ${elements.length}`)
  console.log(`Database elements: ${databaseElements.length}`)
  console.log(`Text elements: ${textElements.length}`)

  databaseElements.forEach(dbEl => {
    const linkedTexts = textElements.filter(
      textEl =>
        textEl.customData?.mainElementId === dbEl.id ||
        textEl.customData?.databaseId === dbEl.customData?.databaseId ||
        normalizeText(textEl.text) === normalizeText(dbEl.customData?.originalElement?.name)
    )

    console.log(`🔗 DB Element ${dbEl.customData?.databaseId} (${dbEl.customData?.elementType}):`)
    console.log(`   Name: "${dbEl.customData?.originalElement?.name}"`)
    console.log(`   Linked texts: ${linkedTexts.length}`)
    linkedTexts.forEach(text => console.log(`     - "${text.text}" (id: ${text.id})`))
  })

  console.groupEnd()
}

/**
 * Synchronisiert Diagrammelemente beim Öffnen
 */
export const syncDiagramOnOpen = async (apolloClient: any, diagramData: any): Promise<any> => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return diagramData
  }

  console.log('Synchronizing diagram elements with database...')

  // Debug: Analysiere Element-Struktur
  debugElementStructure(diagramData.elements)

  const validationResult = await validateAndSyncElements(apolloClient, diagramData.elements)

  // Aktualisiere Elemente mit neuen Namen
  let updatedElements = [...diagramData.elements]

  console.log(
    `Processing ${validationResult.updatedElements.length} updated elements for name sync`
  )

  // Anwenden der Namen-Updates auf alle verwandten Elemente
  for (const updatedElement of validationResult.updatedElements) {
    const newName = updatedElement.customData?.originalElement?.name
    if (!newName) {
      console.warn(`No new name found for updated element ${updatedElement.id}`)
      continue
    }

    console.log(`Applying name update for element ${updatedElement.id}: "${newName}"`)

    // Normalisiere den neuen Namen (entferne Zeilenumbrüche)
    const normalizedNewName = normalizeText(newName)

    // Aktualisiere das Hauptelement und alle verwandten Elemente
    updatedElements = updatedElements.map(element => {
      // Hauptelement aktualisieren
      if (element.id === updatedElement.id) {
        console.log(`Updating main element ${element.id} customData`)
        return {
          ...element,
          customData: {
            ...element.customData,
            originalElement: updatedElement.customData?.originalElement,
            lastSyncedName: normalizedNewName,
          },
        }
      }

      // Text-Elemente aktualisieren - erweiterte Verknüpfungsstrategien
      const isLinkedTextElement =
        element.type === 'text' &&
        // 1. Direkte Verknüpfung über mainElementId
        (element.customData?.mainElementId === updatedElement.id ||
          // 2. Verknüpfung über dieselbe databaseId
          (element.customData?.databaseId === updatedElement.customData?.databaseId &&
            updatedElement.customData?.databaseId) ||
          // 3. Text-Elemente ohne customData, die Namen-Match haben
          (!element.customData?.isFromDatabase &&
            (normalizeText(element.text) ===
              normalizeText(updatedElement.customData?.originalElement?.name) ||
              normalizeText(element.rawText) ===
                normalizeText(updatedElement.customData?.originalElement?.name) ||
              normalizeText(element.text) ===
                normalizeText(updatedElement.customData?.lastSyncedName) ||
              normalizeText(element.rawText) ===
                normalizeText(updatedElement.customData?.lastSyncedName))) ||
          // 4. Proximity-basierte Suche für Text-Elemente in der Nähe
          (element.x !== undefined &&
            element.y !== undefined &&
            updatedElement.x !== undefined &&
            updatedElement.y !== undefined &&
            Math.abs(element.x - updatedElement.x) < 100 &&
            Math.abs(element.y - updatedElement.y) < 100 &&
            (normalizeText(element.text).includes(
              normalizeText(updatedElement.customData?.originalElement?.name).split(' ')[0]
            ) ||
              normalizeText(updatedElement.customData?.originalElement?.name).includes(
                normalizeText(element.text).split(' ')[0]
              ))))

      if (isLinkedTextElement) {
        console.log(
          `Updating text element ${element.id}: "${element.text}" -> "${normalizedNewName}"`
        )
        return {
          ...element,
          text: normalizedNewName,
          rawText: normalizedNewName,
          customData: {
            ...element.customData,
            lastSyncedName: normalizedNewName,
          },
        }
      }

      return element
    })
  }

  // WICHTIG: Markiere fehlende UND entferne Markierungen für gefundene Elemente
  console.log(`Processing missing elements: ${validationResult.missingElements.length} missing`)
  updatedElements = markMissingElements(updatedElements, validationResult.missingElements)

  if (validationResult.missingElements.length > 0) {
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
  apolloClient: any,
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

    // Finde das Text-Element für dieses Hauptelement - robuste erweiterte Suche
    let textElement = diagramData.elements.find(
      (el: DiagramElement) =>
        el.type === 'text' &&
        // 1. Direkte Verknüpfung über mainElementId
        (el.customData?.mainElementId === element.id ||
          // 2. Verknüpfung über dieselbe databaseId
          el.customData?.databaseId === element.customData?.databaseId ||
          // 3. Text-Elemente ohne customData, die Namen-Match haben
          (!el.customData?.isFromDatabase &&
            (normalizeText(el.text) === normalizeText(element.customData?.lastSyncedName) ||
              normalizeText(el.rawText) === normalizeText(element.customData?.lastSyncedName) ||
              normalizeText(el.text) === normalizeText(element.customData?.originalElement?.name) ||
              normalizeText(el.rawText) ===
                normalizeText(element.customData?.originalElement?.name))))
    )

    // Fallback: Proximity-basierte Suche für Text-Elemente in der Nähe
    if (!textElement && element.x !== undefined && element.y !== undefined) {
      const tolerance = 100
      textElement = diagramData.elements.find(
        (el: DiagramElement) =>
          el.type === 'text' &&
          el.x !== undefined &&
          el.y !== undefined &&
          Math.abs(el.x - element.x) < tolerance &&
          Math.abs(el.y - element.y) < tolerance &&
          (normalizeText(el.text).includes(
            normalizeText(element.customData?.originalElement?.name).split(' ')[0]
          ) ||
            normalizeText(element.customData?.originalElement?.name).includes(
              normalizeText(el.text).split(' ')[0]
            ))
      )
    }

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

    console.log(
      `Found text element for ${element.customData.databaseId}: "${textElement.text}" (id: ${textElement.id})`
    )

    const currentName = normalizeText(textElement.text || textElement.rawText)
    const lastSyncedName = normalizeText(
      element.customData.lastSyncedName || element.customData.originalElement?.name
    )

    console.log(
      `Checking name change for ${element.customData.databaseId}: "${lastSyncedName}" vs "${currentName}"`
    )

    // Prüfe ob sich der Name geändert hat (mit normalisiertem Text)
    if (currentName && currentName.trim() !== '' && currentName !== lastSyncedName) {
      console.log(`Name changed, updating database: "${lastSyncedName}" -> "${currentName}"`)
      const success = await updateElementName(
        apolloClient,
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
        console.log(`Successfully updated name for ${element.customData.databaseId}`)
      } else {
        console.error(`Failed to update name for ${element.customData.databaseId}`)
      }
    } else {
      console.log(`No name change detected for ${element.customData.databaseId}`)
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
        strokeWidth: element.strokeWidth === 3 ? 2 : element.strokeWidth,
        strokeStyle: 'solid',
        customData: cleanCustomData,
      }
    }
    return element
  })
}
