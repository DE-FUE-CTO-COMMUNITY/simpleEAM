/**
 * Diagramm-Optimierung für das Öffnen von Diagrammen
 * Ersetzt originalElement durch elementName für bessere Performance
 */

export interface DiagramElement {
  id: string
  type: string
  customData?: {
    databaseId?: string
    elementType?: string
    elementName?: string
    originalElement?: any
    isFromDatabase?: boolean
    isMainElement?: boolean
    mainElementId?: string
    lastSyncedName?: string
  }
  [key: string]: any
}

export interface DiagramData {
  elements: DiagramElement[]
  appState?: any
  [key: string]: any
}

/**
 * Optimiert Diagramm-Daten beim Öffnen durch Ersetzung von originalElement mit elementName
 * @param diagramData - Die Diagramm-Daten
 * @returns Optimierte Diagramm-Daten
 */
export const optimizeDiagramOnOpen = (diagramData: DiagramData): DiagramData => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return diagramData
  }

  const optimizedElements = diagramData.elements.map(element => {
    if (!element.customData) {
      return element
    }

    const customData = element.customData

    // Prüfe, ob originalElement vorhanden ist und elementName noch nicht gesetzt ist
    if (customData.originalElement && !customData.elementName) {
      // Extrahiere elementName aus originalElement
      const elementName = customData.originalElement.name

      if (elementName) {
        console.log(
          `Optimizing element ${element.id}: replacing originalElement with elementName "${elementName}"`
        )

        // Erstelle optimierte customData mit elementName und entferne originalElement
        const optimizedCustomData = {
          ...customData,
          elementName: elementName,
          // originalElement wird entfernt, um Speicherplatz zu sparen
        }

        // Entferne originalElement explizit
        delete optimizedCustomData.originalElement

        return {
          ...element,
          customData: optimizedCustomData,
        }
      }
    }

    // Prüfe, ob sowohl originalElement als auch elementName vorhanden sind
    if (customData.originalElement && customData.elementName) {
      // originalElement kann entfernt werden, da elementName bereits vorhanden ist
      console.log(
        `Optimizing element ${element.id}: removing redundant originalElement (elementName already exists)`
      )

      const optimizedCustomData = {
        ...customData,
      }

      // Entferne originalElement explizit
      delete optimizedCustomData.originalElement

      return {
        ...element,
        customData: optimizedCustomData,
      }
    }

    // Keine Optimierung erforderlich
    return element
  })

  return {
    ...diagramData,
    elements: optimizedElements,
  }
}

/**
 * Statistiken über die Optimierung
 */
export const getDiagramOptimizationStats = (
  originalData: DiagramData,
  optimizedData: DiagramData
) => {
  const originalElementsWithOriginalElement =
    originalData.elements?.filter(el => el.customData?.originalElement).length || 0

  const optimizedElementsWithOriginalElement =
    optimizedData.elements?.filter(el => el.customData?.originalElement).length || 0

  const elementsWithElementName =
    optimizedData.elements?.filter(el => el.customData?.elementName).length || 0

  return {
    originalElementsWithOriginalElement,
    optimizedElementsWithOriginalElement,
    elementsWithElementName,
    optimizedCount: originalElementsWithOriginalElement - optimizedElementsWithOriginalElement,
  }
}

/**
 * Optimiert Diagramm-Daten beim Speichern durch Entfernung von redundanten originalElement-Daten
 * @param diagramData - Die Diagramm-Daten
 * @returns Optimierte Diagramm-Daten
 */
export const optimizeDiagramOnSave = (diagramData: DiagramData): DiagramData => {
  if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
    return diagramData
  }

  const optimizedElements = diagramData.elements.map(element => {
    if (!element.customData || !element.customData.originalElement) {
      return element
    }

    const customData = element.customData

    // Prüfe, ob sowohl originalElement als auch elementName vorhanden sind
    if (customData.originalElement && customData.elementName) {
      // originalElement ist redundant, da elementName bereits vorhanden ist
      console.log(
        `Optimizing save for element ${element.id}: removing redundant originalElement (elementName: "${customData.elementName}")`
      )

      const optimizedCustomData = {
        ...customData,
      }

      // Entferne originalElement explizit
      delete optimizedCustomData.originalElement

      return {
        ...element,
        customData: optimizedCustomData,
      }
    }

    // Prüfe, ob originalElement vorhanden ist, aber elementName fehlt
    if (customData.originalElement && !customData.elementName) {
      // Extrahiere elementName aus originalElement und entferne originalElement
      const elementName = customData.originalElement.name

      if (elementName) {
        console.log(
          `Optimizing save for element ${element.id}: extracting elementName "${elementName}" from originalElement`
        )

        const optimizedCustomData = {
          ...customData,
          elementName: elementName,
        }

        // Entferne originalElement explizit
        delete optimizedCustomData.originalElement

        return {
          ...element,
          customData: optimizedCustomData,
        }
      }
    }

    // Keine Optimierung erforderlich
    return element
  })

  return {
    ...diagramData,
    elements: optimizedElements,
  }
}
