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

    // Check if originalElement exists and elementName is not yet set
    if (customData.originalElement && !customData.elementName) {
      // Extract elementName from originalElement
      const elementName = customData.originalElement.name

      if (elementName) {
        // Create optimized customData with elementName and remove originalElement
        const optimizedCustomData = {
          ...customData,
          elementName: elementName,
          // originalElement is removed to save storage space
        }

        // Explicitly remove originalElement
        delete optimizedCustomData.originalElement

        return {
          ...element,
          customData: optimizedCustomData,
        }
      }
    }

    // Check if both originalElement and elementName exist
    if (customData.originalElement && customData.elementName) {
      // originalElement can be removed since elementName already exists
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
 * Statistics about the optimization
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
 * Optimizes diagram data on save by removing redundant originalElement data
 * @param diagramData - The diagram data
 * @returns Optimized diagram data
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

    // Check if both originalElement and elementName exist
    if (customData.originalElement && customData.elementName) {
      // originalElement is redundant since elementName already exists
      const optimizedCustomData = {
        ...customData,
      }

      // Explicitly remove originalElement
      delete optimizedCustomData.originalElement

      return {
        ...element,
        customData: optimizedCustomData,
      }
    }

    // Check if originalElement exists but elementName is missing
    if (customData.originalElement && !customData.elementName) {
      // Extract elementName from originalElement and remove originalElement
      const elementName = customData.originalElement.name

      if (elementName) {
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
