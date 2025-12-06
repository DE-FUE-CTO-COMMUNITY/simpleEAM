/**
 * Diagram optimization helpers for opening diagrams
 * Replaces originalElement with elementName for better performance
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
 * Optimizes diagram data on open by replacing originalElement with elementName
 * @param diagramData - Diagram data payload
 * @returns Optimized diagram data
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

    // If originalElement exists and elementName is missing, derive it
    if (customData.originalElement && !customData.elementName) {
      // Extract elementName from originalElement
      const elementName = customData.originalElement.name

      if (elementName) {
        // Create optimized customData with elementName and drop originalElement
        const optimizedCustomData = {
          ...customData,
          elementName: elementName,
          // originalElement is omitted to keep storage small
        }

        // Remove originalElement explicitly
        delete optimizedCustomData.originalElement

        return {
          ...element,
          customData: optimizedCustomData,
        }
      }
    }

    // Remove redundant originalElement when both fields exist
    if (customData.originalElement && customData.elementName) {
      const optimizedCustomData = {
        ...customData,
      }

      // Remove originalElement explicitly
      delete optimizedCustomData.originalElement

      return {
        ...element,
        customData: optimizedCustomData,
      }
    }

    // No optimization required
    return element
  })

  return {
    ...diagramData,
    elements: optimizedElements,
  }
}

/**
 * Collects statistics about the performed optimization
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
 * @param diagramData - Diagram data payload
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

    // Remove redundant originalElement when both fields exist
    if (customData.originalElement && customData.elementName) {
      const optimizedCustomData = {
        ...customData,
      }

      // Remove originalElement explicitly
      delete optimizedCustomData.originalElement

      return {
        ...element,
        customData: optimizedCustomData,
      }
    }

    // If originalElement exists but elementName is missing, derive it
    if (customData.originalElement && !customData.elementName) {
      // Extract elementName from originalElement and remove originalElement
      const elementName = customData.originalElement.name

      if (elementName) {
        const optimizedCustomData = {
          ...customData,
          elementName: elementName,
        }

        // Remove originalElement explicitly
        delete optimizedCustomData.originalElement

        return {
          ...element,
          customData: optimizedCustomData,
        }
      }
    }

    // No optimization required
    return element
  })

  return {
    ...diagramData,
    elements: optimizedElements,
  }
}
