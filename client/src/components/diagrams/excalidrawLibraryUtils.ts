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
    // Speichere Datenbank-Informationen in customData
    customData: {
      libraryElementId: libraryElement.id,
      elementType: elementType,
      originalName: libraryElement.name,
      originalDescription: libraryElement.description,
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
  }

  // Typ-spezifische Icons
  switch (elementType) {
    case 'capability':
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

    default:
      return null
  }
}

// Ermittle sekundären Text basierend auf Element-Typ
const getSecondaryText = (element: LibraryElement, elementType: ElementType): string => {
  switch (elementType) {
    case 'capability': {
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
    case 'capability': {
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

    default:
      return {}
  }
}

// Hilfsfunktion: Prüfe ob ein Excalidraw-Element von der Datenbank stammt
export const isLibraryBasedElement = (element: ExcalidrawElement): boolean => {
  return !!(element.customData?.libraryElementId && element.customData?.elementType)
}

// Hilfsfunktion: Extrahiere Datenbank-ID aus Excalidraw-Element
export const getLibraryElementId = (element: ExcalidrawElement): string | null => {
  return element.customData?.libraryElementId || null
}

// Hilfsfunktion: Extrahiere Element-Typ aus Excalidraw-Element
export const getLibraryElementType = (element: ExcalidrawElement): ElementType | null => {
  return element.customData?.elementType || null
}

// Aktualisiere ein bestehendes Excalidraw-Element mit neuen Datenbank-Daten
export const updateExcalidrawElementFromLibraryItem = (
  excalidrawElement: ExcalidrawElement,
  libraryElement: LibraryElement,
  elementType: ElementType
): ExcalidrawElement => {
  const secondaryText = getSecondaryText(libraryElement, elementType)
  const displayText = secondaryText
    ? `${libraryElement.name}\n${secondaryText}`
    : libraryElement.name

  return {
    ...excalidrawElement,
    customData: {
      ...excalidrawElement.customData,
      originalName: libraryElement.name,
      originalDescription: libraryElement.description,
      ...getTypeSpecificMetadata(libraryElement, elementType),
    },
    // Wenn es ein Text-Element ist, aktualisiere den Text
    ...(excalidrawElement.type === 'text' && {
      text: displayText,
      originalText: displayText,
    }),
    updated: typeof window !== 'undefined' ? Date.now() : 0, // Avoid hydration mismatch
  }
}
