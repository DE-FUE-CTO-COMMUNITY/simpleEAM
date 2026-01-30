// Import-Typ für ExcalidrawElement - wird vom Excalidraw-Package zur Verfügung gestellt
type ExcalidrawElement = any
import { ElementType, LibraryElement, ELEMENT_TYPE_CONFIG } from '@/graphql/library'

// Generiere eindeutige IDs für Excalidraw-Elemente
export const generateElementId = (): string => {
  // Verwende eine Kombination aus Timestamp und Random für bessere Eindeutigkeit
  // Nur clientseitig ausführen
  if (typeof window !== 'undefined') {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
  }
  // Fallback für SSR - wird clientseitig ersetzt
  return 'temp-id-' + Date.now().toString(36)
}

// Erstelle ein Excalidraw-Element aus einem Datenbank-Element
export const createExcalidrawElementFromLibraryItem = (
  libraryElement: LibraryElement,
  elementType: ElementType,
  position: { x: number; y: number }
): ExcalidrawElement[] => {
  const config = ELEMENT_TYPE_CONFIG[elementType]
  const elementId = generateElementId()
  const textId = generateElementId()

  // Basisgröße für das Element
  const baseWidth = 160
  const baseHeight = 80

  // Text-Inhalt vorbereiten
  const primaryText = libraryElement.name
  const secondaryText = getSecondaryText(libraryElement, elementType)
  const displayText = secondaryText ? `${primaryText}\n${secondaryText}` : primaryText

  // Haupt-Element (Rechteck)
  const mainElement: ExcalidrawElement = {
    id: elementId,
    type: config.iconType === 'rounded-rectangle' ? 'rectangle' : 'rectangle',
    x: position.x,
    y: position.y,
    width: baseWidth,
    height: baseHeight,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: config.color,
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: config.iconType === 'rounded-rectangle' ? 1 : 0,
    opacity: 100,
    groupIds: [elementId],
    frameId: null,
    index: 'a0',
    roundness:
      config.iconType === 'rounded-rectangle' ? { type: 'proportional-radius', value: 0.1 } : null,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000000),
    isDeleted: false,
    boundElements: [
      {
        type: 'text',
        id: textId,
      },
    ],
    updated: typeof window !== 'undefined' ? Date.now() : 0, // Avoid hydration mismatch
    link: null,
    locked: false,
    // Speichere Datenbank-Informationen in customData - das Hauptelement erhält alle Metadaten
    customData: {
      databaseId: libraryElement.id,
      elementType: elementType,
      elementName: libraryElement.name, // Optimierung: Nur der Name statt kompletter originalElement
      isFromDatabase: true,
      isMainElement: true, // Markiere als Hauptelement
      // Typ-spezifische Metadaten
      ...getTypeSpecificMetadata(libraryElement, elementType),
    },
  }

  // Text-Element
  const textElement: ExcalidrawElement = {
    id: textId,
    type: 'text',
    x: position.x + baseWidth / 2,
    y: position.y + baseHeight / 2,
    width: 0, // Wird automatisch berechnet
    height: 0, // Wird automatisch berechnet
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [elementId],
    frameId: null,
    index: 'a1',
    roundness: null,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000000),
    isDeleted: false,
    boundElements: [],
    updated: typeof window !== 'undefined' ? Date.now() : 0, // Avoid hydration mismatch
    link: null,
    locked: false,
    text: displayText,
    fontSize: 14,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: elementId,
    originalText: displayText,
    autoResize: true,
    lineHeight: 1.25,
    // Text-Element erhält nur Verweis auf das Hauptelement
    customData: {
      isFromDatabase: true,
      isMainElement: false,
      mainElementId: elementId, // Verweis auf das Hauptelement
    },
  }

  // Icon-Element hinzufügen (falls gewünscht)
  const iconElement = createIconElement(elementType, position, elementId)

  return iconElement ? [mainElement, textElement, iconElement] : [mainElement, textElement]
}

// Erstelle ein Icon-Element für den Element-Typ
const createIconElement = (
  elementType: ElementType,
  position: { x: number; y: number },
  groupId: string
): ExcalidrawElement | null => {
  const iconId = generateElementId()
  const iconSize = 16
  const iconOffset = 8

  // Basis-Icon-Element
  const baseIcon: Partial<ExcalidrawElement> = {
    id: iconId,
    x: position.x + iconOffset,
    y: position.y + iconOffset,
    width: iconSize,
    height: iconSize,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1.5,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [groupId],
    frameId: null,
    index: 'a2',
    roundness: null,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000000),
    isDeleted: false,
    boundElements: [],
    updated: typeof window !== 'undefined' ? Date.now() : 0, // Avoid hydration mismatch
    link: null,
    locked: false,
    // Icon-Element erhält nur Verweis auf das Hauptelement
    customData: {
      isFromDatabase: true,
      isMainElement: false,
      mainElementId: groupId, // Verweis auf das Hauptelement (groupId ist die ID des Hauptelements)
    },
  }

  // Typ-spezifische Icons
  switch (elementType) {
    case 'businessCapability':
      return {
        ...baseIcon,
        type: 'diamond',
        width: iconSize * 1.2,
        height: iconSize * 1.2,
      } as ExcalidrawElement

    case 'application':
      return {
        ...baseIcon,
        type: 'rectangle',
        width: iconSize,
        height: iconSize,
        roundness: { type: 'proportional-radius', value: 0.2 },
      } as ExcalidrawElement

    case 'dataObject':
      return {
        ...baseIcon,
        type: 'ellipse',
        width: iconSize,
        height: iconSize,
      } as ExcalidrawElement

    case 'interface':
      return {
        ...baseIcon,
        type: 'rectangle',
        width: iconSize * 1.5,
        height: iconSize * 0.7,
      } as ExcalidrawElement

    case 'aiComponent':
      return {
        ...baseIcon,
        type: 'ellipse',
        width: iconSize,
        height: iconSize,
        backgroundColor: '#e6ccff', // Light purple for AI components
      } as ExcalidrawElement

    default:
      return null
  }
}

// Ermittle sekundären Text basierend auf Element-Typ
const getSecondaryText = (element: LibraryElement, elementType: ElementType): string => {
  switch (elementType) {
    case 'businessCapability': {
      const cap = element as any
      if (cap.maturityLevel) return `Level ${cap.maturityLevel}`
      if (cap.businessValue) return cap.businessValue
      return ''
    }

    case 'application': {
      const app = element as any
      if (app.version) return `v${app.version}`
      if (app.criticality) return app.criticality
      return ''
    }

    case 'dataObject': {
      const dataObj = element as any
      if (dataObj.classification) return dataObj.classification
      if (dataObj.format) return dataObj.format
      return ''
    }

    case 'interface': {
      const iface = element as any
      if (iface.interfaceType) return iface.interfaceType
      return ''
    }

    case 'aiComponent': {
      const aiComp = element as any
      if (aiComp.aiType) return aiComp.aiType
      if (aiComp.vendor) return aiComp.vendor
      return ''
    }

    default:
      return ''
  }
}

// Sammle typ-spezifische Metadaten
const getTypeSpecificMetadata = (
  element: LibraryElement,
  elementType: ElementType
): Record<string, any> => {
  switch (elementType) {
    case 'businessCapability': {
      const cap = element as any
      return {
        maturityLevel: cap.maturityLevel,
        businessValue: cap.businessValue,
        status: cap.status,
        parents: cap.parents,
      }
    }

    case 'application': {
      const app = element as any
      return {
        status: app.status,
        criticality: app.criticality,
        vendor: app.vendor,
        version: app.version,
      }
    }

    case 'dataObject': {
      const dataObj = element as any
      return {
        classification: dataObj.classification,
        source: dataObj.source,
        format: dataObj.format,
      }
    }

    case 'interface': {
      const iface = element as any
      return {
        interfaceType: iface.interfaceType,
      }
    }

    case 'aiComponent': {
      const aiComp = element as any
      return {
        aiType: aiComp.aiType,
        vendor: aiComp.vendor,
        version: aiComp.version,
        status: aiComp.status,
      }
    }

    default:
      return {}
  }
}

/**
 * WICHTIG: Neue Struktur für Library-Element-Metadaten
 *
 * Problem: Vorher wurden Datenbank-Beziehungen redundant in jedem Element eines Library-Items gespeichert.
 * Lösung: Jetzt wird die Beziehung nur einmal im Hauptelement gespeichert.
 *
 * Struktur:
 * - Hauptelement (erstes Element): Enthält vollständige customData mit databaseId, elementType, originalElement
 * - Andere Elemente: Enthalten nur Verweis auf Hauptelement über mainElementId
 *
 * Vorteile:
 * - Keine redundante Datenspeicherung
 * - Einfachere Synchronisation bei Datenbank-Updates
 * - Reduzierte Diagramm-Dateigröße
 * - Konsistente Datenintegrität
 */

// Hilfsfunktion: Prüfe ob ein Excalidraw-Element von der Datenbank stammt
export const isLibraryBasedElement = (element: ExcalidrawElement): boolean => {
  return !!element.customData?.isFromDatabase
}

// Hilfsfunktion: Prüfe ob es sich um das Hauptelement mit vollständigen Datenbank-Metadaten handelt
export const isMainLibraryElement = (element: ExcalidrawElement): boolean => {
  return !!(element.customData?.isFromDatabase && element.customData?.isMainElement)
}

// Hilfsfunktion: Extrahiere Datenbank-ID aus Excalidraw-Element (nur vom Hauptelement)
export const getLibraryElementId = (element: ExcalidrawElement): string | null => {
  if (element.customData?.isMainElement) {
    return element.customData?.databaseId || null
  }
  return null
}

// Hilfsfunktion: Extrahiere Element-Typ aus Excalidraw-Element (nur vom Hauptelement)
export const getLibraryElementType = (element: ExcalidrawElement): ElementType | null => {
  if (element.customData?.isMainElement) {
    return element.customData?.elementType || null
  }
  return null
}

// Hilfsfunktion: Finde das Hauptelement einer Gruppe von Library-basierten Elementen
export const findMainLibraryElement = (elements: ExcalidrawElement[]): ExcalidrawElement | null => {
  return elements.find(element => isMainLibraryElement(element)) || null
}

// Hilfsfunktion: Extrahiere das ursprüngliche Datenbank-Element (nur vom Hauptelement)
export const getOriginalDatabaseElement = (element: ExcalidrawElement): any | null => {
  if (element.customData?.isMainElement) {
    // Für Optimierung: Erstelle ein minimales Objekt mit nur den wichtigsten Daten
    return {
      id: element.customData.databaseId,
      name: element.customData.elementName || element.customData.originalElement?.name,
      elementType: element.customData.elementType,
    }
  }
  return null
}

// Aktualisiere ein bestehendes Excalidraw-Element mit neuen Datenbank-Daten (nur für Hauptelemente)
export const updateExcalidrawElementFromLibraryItem = (
  excalidrawElement: ExcalidrawElement,
  libraryElement: LibraryElement,
  elementType: ElementType
): ExcalidrawElement => {
  // Nur Hauptelemente sollten aktualisiert werden
  if (!isMainLibraryElement(excalidrawElement)) {
    console.warn('⚠️ Versuche nicht-Hauptelement zu aktualisieren:', excalidrawElement.id)
    return excalidrawElement
  }

  const secondaryText = getSecondaryText(libraryElement, elementType)
  const displayText = secondaryText
    ? `${libraryElement.name}\n${secondaryText}`
    : libraryElement.name

  return {
    ...excalidrawElement,
    customData: {
      ...excalidrawElement.customData,
      // Aktualisiere die Datenbank-Metadaten im Hauptelement
      databaseId: libraryElement.id,
      elementType,
      elementName: libraryElement.name, // Optimierung: Nur der Name statt kompletter originalElement
      isFromDatabase: true,
      isMainElement: true,
      // Behalte typ-spezifische Metadaten
      ...getTypeSpecificMetadata(libraryElement, elementType),
    },
    // Wenn es ein Text-Element ist, aktualisiere den Text
    ...(excalidrawElement.type === 'text' && {
      text: displayText,
      originalText: displayText,
      rawText: displayText,
    }),
    updated: typeof window !== 'undefined' ? Date.now() : 0, // Avoid hydration mismatch
  }
}

// Hilfsfunktion: Finde alle verwandten Elemente einer Library-Gruppe
export const findRelatedLibraryElements = (
  elements: ExcalidrawElement[],
  targetElement: ExcalidrawElement
): ExcalidrawElement[] => {
  // Wenn es das Hauptelement ist, finde alle Elemente die darauf verweisen
  if (isMainLibraryElement(targetElement)) {
    return elements.filter(
      el => el.customData?.mainElementId === targetElement.id || el.id === targetElement.id
    )
  }

  // Wenn es ein verweisendes Element ist, finde das Hauptelement und alle verwandten
  if (targetElement.customData?.mainElementId) {
    const mainElementId = targetElement.customData.mainElementId
    return elements.filter(
      el => el.id === mainElementId || el.customData?.mainElementId === mainElementId
    )
  }

  return [targetElement]
}

// Hilfsfunktion: Aktualisiere alle verwandten Elemente einer Library-Gruppe
export const updateLibraryElementGroup = (
  elements: ExcalidrawElement[],
  updatedLibraryData: LibraryElement,
  elementType: ElementType
): ExcalidrawElement[] => {
  return elements.map(element => {
    // Nur das Hauptelement wird mit neuen Daten aktualisiert
    if (isMainLibraryElement(element)) {
      return updateExcalidrawElementFromLibraryItem(element, updatedLibraryData, elementType)
    }
    return element
  })
}
