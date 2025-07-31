// Temporary file for the three missing specialized functions
// These will be moved to elementCreation.ts

import type { ExcalidrawElement } from './capabilityMapTypes'
import type { LibraryTemplate } from './archimateLibraryUtils'
import { generateElementId, generateSeed } from './elementIdManager'
import { wrapTextToFitWidth, calculateCenteredTextPosition } from './textContainerUtils'

interface ElementCustomizations {
  width?: number
  height?: number
  backgroundColor?: string
  fontSize?: number
}

// Specialized function to create data object elements from template
export function createDataObjectElementsFromTemplate(
  dataObject: any, // Data Object
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string,
  customizations?: ElementCustomizations
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`Kein Template gefunden für Data Object: ${dataObject.name}`)
    return []
  }

  // Create a mapping from old IDs to new IDs to maintain relationships
  const idMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    idMapping.set(element.id, generateElementId())
  })

  // Generate new group IDs while preserving grouping relationships
  const groupIdMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    if (element.groupIds && element.groupIds.length > 0) {
      element.groupIds.forEach((gId: string) => {
        if (!groupIdMapping.has(gId)) {
          groupIdMapping.set(gId, generateElementId())
        }
      })
    }
  })

  // Calculate template bounding box for proper positioning
  const templateBounds = {
    minX: Math.min(...template.elements.map((el: any) => el.x)),
    minY: Math.min(...template.elements.map((el: any) => el.y)),
    maxX: Math.max(...template.elements.map((el: any) => el.x + (el.width || 0))),
    maxY: Math.max(...template.elements.map((el: any) => el.y + (el.height || 0))),
  }

  // Calculate offset to position template at target coordinates
  const offsetX = targetX - templateBounds.minX
  const offsetY = targetY - templateBounds.minY

  // Clone template elements with new IDs and updated content
  let dataObjectMainElementNewId: string | undefined = undefined

  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateElementId()

    // Store the main element's new ID (first element)
    if (index === 0) {
      dataObjectMainElementNewId = newElement.id
    }

    // Apply position offset
    newElement.x = element.x + offsetX
    newElement.y = element.y + offsetY

    // Handle rectangles - apply customizations but preserve template styling
    if (element.type === 'rectangle') {
      const isMainContainer =
        (element.boundElements && element.boundElements.length > 0) || // Has bound text elements
        (element.width > 100 && element.height > 50) || // Large enough to be main container
        index === 0 // Fallback: first rectangle

      if (isMainContainer) {
        // Always use black stroke color for Data Objects
        newElement.strokeColor = '#1e1e1e'

        // Apply custom dimensions if provided
        if (customizations?.width) {
          newElement.width = customizations.width
        }
        if (customizations?.height) {
          newElement.height = customizations.height
        }

        // Keep the original template background color
        if (customizations?.backgroundColor) {
          newElement.backgroundColor = customizations.backgroundColor
        } else {
          newElement.backgroundColor = element.backgroundColor || 'transparent'
        }
      }
    }

    // For text elements, replace the text with data object name
    if (element.type === 'text') {
      // Get the containing rectangle to determine available width
      const containerRect = template.elements.find(
        (el: any) =>
          el.type === 'rectangle' && el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      // Calculate available width for text (with some padding)
      let availableWidth = containerRect ? containerRect.width - 20 : 180

      // Apply custom width if provided
      if (customizations?.width && containerRect) {
        availableWidth = customizations.width - 20
      }

      // Get font size
      const fontSize = customizations?.fontSize || element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(dataObject.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText

      // Preserve the original template's text alignment
      newElement.textAlign = element.textAlign || 'center'
      newElement.verticalAlign = element.verticalAlign || 'middle'
      newElement.fontSize = fontSize

      // CRITICAL: Maintain container binding for proper text rendering
      if (containerRect) {
        const containerElement = template.elements.find(
          (el: any) =>
            el.type === 'rectangle' &&
            el.boundElements?.some((bound: any) => bound.id === element.id)
        )

        if (containerElement) {
          const newContainerId = idMapping.get(containerElement.id)
          if (newContainerId) {
            newElement.containerId = newContainerId

            const containerWithCustomizations = {
              ...containerElement,
              x: containerElement.x + offsetX,
              y: containerElement.y + offsetY,
              width: customizations?.width || containerElement.width,
              height: customizations?.height || containerElement.height,
            }

            const textPosition = calculateCenteredTextPosition(
              wrappedText,
              containerWithCustomizations,
              fontSize
            )

            // Set position and dimensions from the positioning function
            newElement.x = textPosition.x
            newElement.y = textPosition.y
            newElement.width = textPosition.width
            newElement.height = textPosition.height
          }
        }
      }
    }

    // Apply group IDs if provided or mapped
    if (groupId) {
      newElement.groupIds = [groupId]
    } else if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map((gId: string) => groupIdMapping.get(gId) || gId)
    }

    // Update container ID references
    if (element.containerId && idMapping.has(element.containerId)) {
      newElement.containerId = idMapping.get(element.containerId)
    }

    // Update bound element references
    if (element.boundElements) {
      newElement.boundElements = element.boundElements.map((boundEl: any) => ({
        ...boundEl,
        id: idMapping.get(boundEl.id) || boundEl.id,
      }))
    }

    // Add database metadata
    newElement.customData = {
      ...newElement.customData,
      databaseId: dataObject.id,
      elementType: 'dataObject',
      elementName: dataObject.name,
      isFromDatabase: true,
      isMainElement: newElement.id === dataObjectMainElementNewId,
      mainElementId: dataObjectMainElementNewId,
    }

    // Update other standard properties
    newElement.seed = generateSeed()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.updated = Date.now()
    newElement.isDeleted = false

    return newElement
  })

  return elements
}

// Specialized function to create interface elements from template
export function createInterfaceElementsFromTemplate(
  interfaceObj: any, // Interface Object
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string,
  customizations?: ElementCustomizations
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`Kein Template gefunden für Interface: ${interfaceObj.name}`)
    return []
  }

  // Create a mapping from old IDs to new IDs to maintain relationships
  const idMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    idMapping.set(element.id, generateElementId())
  })

  // Generate new group IDs while preserving grouping relationships
  const groupIdMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    if (element.groupIds && element.groupIds.length > 0) {
      element.groupIds.forEach((gId: string) => {
        if (!groupIdMapping.has(gId)) {
          groupIdMapping.set(gId, generateElementId())
        }
      })
    }
  })

  // Calculate template bounding box for proper positioning
  const templateBounds = {
    minX: Math.min(...template.elements.map((el: any) => el.x)),
    minY: Math.min(...template.elements.map((el: any) => el.y)),
    maxX: Math.max(...template.elements.map((el: any) => el.x + (el.width || 0))),
    maxY: Math.max(...template.elements.map((el: any) => el.y + (el.height || 0))),
  }

  // Calculate offset to position template at target coordinates
  const offsetX = targetX - templateBounds.minX
  const offsetY = targetY - templateBounds.minY

  // Clone template elements with new IDs and updated content
  let interfaceMainElementNewId: string | undefined = undefined

  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateElementId()

    // Store the main element's new ID (first element)
    if (index === 0) {
      interfaceMainElementNewId = newElement.id
    }

    // Apply position offset
    newElement.x = element.x + offsetX
    newElement.y = element.y + offsetY

    // Handle rectangles - apply customizations but preserve template styling
    if (element.type === 'rectangle') {
      const isMainContainer =
        (element.boundElements && element.boundElements.length > 0) || // Has bound text elements
        (element.width > 100 && element.height > 50) || // Large enough to be main container
        index === 0 // Fallback: first rectangle

      if (isMainContainer) {
        // Always use black stroke color for Interfaces
        newElement.strokeColor = '#1e1e1e'

        // Apply custom dimensions if provided
        if (customizations?.width) {
          newElement.width = customizations.width
        }
        if (customizations?.height) {
          newElement.height = customizations.height
        }

        // Keep the original template background color
        if (customizations?.backgroundColor) {
          newElement.backgroundColor = customizations.backgroundColor
        } else {
          newElement.backgroundColor = element.backgroundColor || 'transparent'
        }
      }
    }

    // For text elements, replace the text with interface name
    if (element.type === 'text') {
      // Get the containing rectangle to determine available width
      const containerRect = template.elements.find(
        (el: any) =>
          el.type === 'rectangle' && el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      // Calculate available width for text (with some padding)
      let availableWidth = containerRect ? containerRect.width - 20 : 180

      // Apply custom width if provided
      if (customizations?.width && containerRect) {
        availableWidth = customizations.width - 20
      }

      // Get font size
      const fontSize = customizations?.fontSize || element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(interfaceObj.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText

      // Preserve the original template's text alignment
      newElement.textAlign = element.textAlign || 'center'
      newElement.verticalAlign = element.verticalAlign || 'middle'
      newElement.fontSize = fontSize

      // CRITICAL: Maintain container binding for proper text rendering
      if (containerRect) {
        const containerElement = template.elements.find(
          (el: any) =>
            el.type === 'rectangle' &&
            el.boundElements?.some((bound: any) => bound.id === element.id)
        )

        if (containerElement) {
          const newContainerId = idMapping.get(containerElement.id)
          if (newContainerId) {
            newElement.containerId = newContainerId

            const containerWithCustomizations = {
              ...containerElement,
              x: containerElement.x + offsetX,
              y: containerElement.y + offsetY,
              width: customizations?.width || containerElement.width,
              height: customizations?.height || containerElement.height,
            }

            const textPosition = calculateCenteredTextPosition(
              wrappedText,
              containerWithCustomizations,
              fontSize
            )

            // Set position and dimensions from the positioning function
            newElement.x = textPosition.x
            newElement.y = textPosition.y
            newElement.width = textPosition.width
            newElement.height = textPosition.height
          }
        }
      }
    }

    // Apply group IDs if provided or mapped
    if (groupId) {
      newElement.groupIds = [groupId]
    } else if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map((gId: string) => groupIdMapping.get(gId) || gId)
    }

    // Update container ID references
    if (element.containerId && idMapping.has(element.containerId)) {
      newElement.containerId = idMapping.get(element.containerId)
    }

    // Update bound element references
    if (element.boundElements) {
      newElement.boundElements = element.boundElements.map((boundEl: any) => ({
        ...boundEl,
        id: idMapping.get(boundEl.id) || boundEl.id,
      }))
    }

    // Add database metadata
    newElement.customData = {
      ...newElement.customData,
      databaseId: interfaceObj.id,
      elementType: 'interface',
      elementName: interfaceObj.name,
      isFromDatabase: true,
      isMainElement: newElement.id === interfaceMainElementNewId,
      mainElementId: interfaceMainElementNewId,
    }

    // Update other standard properties
    newElement.seed = generateSeed()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.updated = Date.now()
    newElement.isDeleted = false

    return newElement
  })

  return elements
}

// Specialized function to create infrastructure elements from template
export function createInfrastructureElementsFromTemplate(
  infrastructure: any, // Infrastructure Object
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string,
  customizations?: ElementCustomizations
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`Kein Template gefunden für Infrastructure: ${infrastructure.name}`)
    return []
  }

  // Create a mapping from old IDs to new IDs to maintain relationships
  const idMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    idMapping.set(element.id, generateElementId())
  })

  // Generate new group IDs while preserving grouping relationships
  const groupIdMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    if (element.groupIds && element.groupIds.length > 0) {
      element.groupIds.forEach((gId: string) => {
        if (!groupIdMapping.has(gId)) {
          groupIdMapping.set(gId, generateElementId())
        }
      })
    }
  })

  // Calculate template bounding box for proper positioning
  const templateBounds = {
    minX: Math.min(...template.elements.map((el: any) => el.x)),
    minY: Math.min(...template.elements.map((el: any) => el.y)),
    maxX: Math.max(...template.elements.map((el: any) => el.x + (el.width || 0))),
    maxY: Math.max(...template.elements.map((el: any) => el.y + (el.height || 0))),
  }

  // Calculate offset to position template at target coordinates
  const offsetX = targetX - templateBounds.minX
  const offsetY = targetY - templateBounds.minY

  // Clone template elements with new IDs and updated content
  let infrastructureMainElementNewId: string | undefined = undefined

  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateElementId()

    // Store the main element's new ID (first element)
    if (index === 0) {
      infrastructureMainElementNewId = newElement.id
    }

    // Apply position offset
    newElement.x = element.x + offsetX
    newElement.y = element.y + offsetY

    // Handle rectangles - apply customizations but preserve template styling
    if (element.type === 'rectangle') {
      const isMainContainer =
        (element.boundElements && element.boundElements.length > 0) || // Has bound text elements
        (element.width > 100 && element.height > 50) || // Large enough to be main container
        index === 0 // Fallback: first rectangle

      if (isMainContainer) {
        // Always use black stroke color for Infrastructure
        newElement.strokeColor = '#1e1e1e'

        // Apply custom dimensions if provided
        if (customizations?.width) {
          newElement.width = customizations.width
        }
        if (customizations?.height) {
          newElement.height = customizations.height
        }

        // Keep the original template background color
        if (customizations?.backgroundColor) {
          newElement.backgroundColor = customizations.backgroundColor
        } else {
          newElement.backgroundColor = element.backgroundColor || 'transparent'
        }
      }
    }

    // For text elements, replace the text with infrastructure name
    if (element.type === 'text') {
      // Get the containing rectangle to determine available width
      const containerRect = template.elements.find(
        (el: any) =>
          el.type === 'rectangle' && el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      // Calculate available width for text (with some padding)
      let availableWidth = containerRect ? containerRect.width - 20 : 180

      // Apply custom width if provided
      if (customizations?.width && containerRect) {
        availableWidth = customizations.width - 20
      }

      // Get font size
      const fontSize = customizations?.fontSize || element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(infrastructure.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText

      // Preserve the original template's text alignment
      newElement.textAlign = element.textAlign || 'center'
      newElement.verticalAlign = element.verticalAlign || 'middle'
      newElement.fontSize = fontSize

      // CRITICAL: Maintain container binding for proper text rendering
      if (containerRect) {
        const containerElement = template.elements.find(
          (el: any) =>
            el.type === 'rectangle' &&
            el.boundElements?.some((bound: any) => bound.id === element.id)
        )

        if (containerElement) {
          const newContainerId = idMapping.get(containerElement.id)
          if (newContainerId) {
            newElement.containerId = newContainerId

            const containerWithCustomizations = {
              ...containerElement,
              x: containerElement.x + offsetX,
              y: containerElement.y + offsetY,
              width: customizations?.width || containerElement.width,
              height: customizations?.height || containerElement.height,
            }

            const textPosition = calculateCenteredTextPosition(
              wrappedText,
              containerWithCustomizations,
              fontSize
            )

            // Set position and dimensions from the positioning function
            newElement.x = textPosition.x
            newElement.y = textPosition.y
            newElement.width = textPosition.width
            newElement.height = textPosition.height
          }
        }
      }
    }

    // Apply group IDs if provided or mapped
    if (groupId) {
      newElement.groupIds = [groupId]
    } else if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map((gId: string) => groupIdMapping.get(gId) || gId)
    }

    // Update container ID references
    if (element.containerId && idMapping.has(element.containerId)) {
      newElement.containerId = idMapping.get(element.containerId)
    }

    // Update bound element references
    if (element.boundElements) {
      newElement.boundElements = element.boundElements.map((boundEl: any) => ({
        ...boundEl,
        id: idMapping.get(boundEl.id) || boundEl.id,
      }))
    }

    // Add database metadata
    newElement.customData = {
      ...newElement.customData,
      databaseId: infrastructure.id,
      elementType: 'infrastructure',
      elementName: infrastructure.name,
      isFromDatabase: true,
      isMainElement: newElement.id === infrastructureMainElementNewId,
      mainElementId: infrastructureMainElementNewId,
    }

    // Update other standard properties
    newElement.seed = generateSeed()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.updated = Date.now()
    newElement.isDeleted = false

    return newElement
  })

  return elements
}
