import type { BusinessCapability } from '@/gql/generated'
import type { LibraryTemplate } from './archimateLibraryUtils'
import type { ExcalidrawElement } from './CapabilityMapUtils'
import type { ElementCustomizations } from './capabilityMapTypes'
import { generateElementId, generateSeed, getNextIndex } from './elementIdManager'
import {
  wrapTextToFitWidth,
  calculateCenteredTextPosition,
  calculateTopCenteredTextPosition,
} from './textContainerUtils'

// Specialized function to create capability elements from template
export function createCapabilityElementsFromTemplate(
  dbElement: BusinessCapability,
  elementType: string,
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string,
  customizations?: ElementCustomizations
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`Kein Template gefunden für Element-Typ: ${elementType}`)
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
  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateElementId()

    // Apply position offset
    newElement.x = element.x + offsetX
    newElement.y = element.y + offsetY

    // Apply customizations for rectangles
    if (element.type === 'rectangle') {
      const isMainContainer =
        (element.boundElements && element.boundElements.length > 0) || // Has bound text elements
        (element.width > 100 && element.height > 50) || // Large enough to be main container
        index === 0 // Fallback: first rectangle

      // Only apply custom background color if provided, otherwise keep template color
      if (customizations?.backgroundColor) {
        newElement.backgroundColor = customizations.backgroundColor
      } else {
        // Keep the original template background color
        newElement.backgroundColor = element.backgroundColor || 'transparent'
      }

      if (isMainContainer) {
        // Always use black stroke color for main containers (Capabilities and Applications)
        newElement.strokeColor = '#1e1e1e'

        // Apply custom dimensions if provided
        if (customizations?.width) {
          newElement.width = customizations.width
        }
        if (customizations?.height) {
          newElement.height = customizations.height
        }
      } else {
        // Handle icon repositioning for resized containers
        const mainContainer = template.elements.find(
          (el: any, idx: number) =>
            el.type === 'rectangle' &&
            ((el.boundElements && el.boundElements.length > 0) ||
              (el.width > 100 && el.height > 50) ||
              idx === 0)
        )

        if (mainContainer && customizations?.width) {
          // Calculate the original distance from the right edge of the main container
          const originalRightEdge = mainContainer.x + mainContainer.width
          const originalDistanceFromRight = originalRightEdge - (element.x + (element.width || 0))
          
          // Calculate the new right edge position with custom width
          const newRightEdge = targetX + customizations.width
          
          // Position the element to maintain the same distance from the right edge
          newElement.x = newRightEdge - originalDistanceFromRight - (element.width || 0)
        }
      }
    }

    // For text elements, replace the text with database element name
    if (element.type === 'text') {
      // Get the containing rectangle to determine available width
      const containerRect = template.elements.find(
        (el: any) =>
          el.type === 'rectangle' && el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      // Calculate available width for text (with some padding)
      let availableWidth = containerRect ? containerRect.width - 20 : 180 // Default 180px if no container found

      // Apply custom width if provided
      if (customizations?.width && containerRect) {
        availableWidth = customizations.width - 20
      }

      // Get font size (apply custom fontSize if provided)
      const fontSize = customizations?.fontSize || element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(dbElement.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText

      // Preserve the original template's text alignment if it exists, otherwise set defaults
      newElement.textAlign = element.textAlign || 'center'
      newElement.verticalAlign = element.verticalAlign || 'middle'

      // Set font size and ensure it's properly applied
      newElement.fontSize = fontSize

      // CRITICAL: Maintain container binding for proper text rendering
      if (containerRect) {
        // Find the new container ID from the mapping
        const containerElement = template.elements.find(
          (el: any) =>
            el.type === 'rectangle' &&
            el.boundElements?.some((bound: any) => bound.id === element.id)
        )

        if (containerElement) {
          const newContainerId = idMapping.get(containerElement.id)
          if (newContainerId) {
            // Set the containerId to establish the bound text relationship
            newElement.containerId = newContainerId

            // Use the appropriate text positioning function based on customization
            const containerWithCustomizations = {
              ...containerElement,
              x: containerElement.x + offsetX,
              y: containerElement.y + offsetY,
              width: customizations?.width || containerElement.width,
              height: customizations?.height || containerElement.height,
            }

            let textPosition
            if (customizations?.useTopCenteredText) {
              // Use top-centered positioning for top-level capabilities
              textPosition = calculateTopCenteredTextPosition(
                wrappedText,
                containerWithCustomizations,
                fontSize,
                10 // 10px top padding
              )
            } else {
              // Use center positioning for child capabilities and applications
              textPosition = calculateCenteredTextPosition(
                wrappedText,
                containerWithCustomizations,
                fontSize
              )
            }

            // Set position and dimensions from the positioning function
            newElement.x = textPosition.x
            newElement.y = textPosition.y
            newElement.width = textPosition.width
            newElement.height = textPosition.height
          }
        }
      } else {
        // Fallback for texts without container: Use estimated dimensions
        const lineCount = (wrappedText.match(/\n/g) || []).length + 1
        const avgLineWidth = Math.max(...wrappedText.split('\n').map(line => line.length))

        const estimatedWidth = Math.min(avgLineWidth * fontSize * 0.6, availableWidth)
        const estimatedHeight = lineCount * fontSize * 1.2

        newElement.width = element.width && element.width > 0 ? element.width : estimatedWidth
        newElement.height = element.height && element.height > 0 ? element.height : estimatedHeight
      }
    }

    // Handle grouping correctly
    // 1. First maintain original template grouping (ArchiMate symbol grouping)
    if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map(
        (gId: string) => groupIdMapping.get(gId) || generateElementId()
      )
    } else {
      newElement.groupIds = []
    }

    // 2. Then add the parent capability grouping (if specified)
    if (groupId) {
      newElement.groupIds = [...(newElement.groupIds || []), groupId]
    }

    // Store database metadata in customData - ONLY in the first element to avoid redundancy
    if (index === 0) {
      newElement.customData = {
        databaseId: dbElement.id,
        elementType,
        originalElement: dbElement,
        isFromDatabase: true,
        isMainElement: true,
      }
    } else {
      newElement.customData = {
        isFromDatabase: true,
        isMainElement: false,
        mainElementId: idMapping.get(template.elements[0]?.id),
      }
    }

    // Handle bound elements with mapped IDs
    if (element.boundElements && element.boundElements.length > 0) {
      newElement.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || generateElementId(),
      }))
    }

    // Update index for proper z-ordering
    newElement.index = getNextIndex()

    // Update timestamps and version
    newElement.updated = Date.now()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.seed = generateSeed()

    return newElement
  })

  // Update boundElements references to use new IDs for proper text-container binding
  elements.forEach((element: any) => {
    if (element.type === 'rectangle' && element.boundElements) {
      element.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || bound.id,
      }))
    }
  })

  // Validate and ensure text-container relationships are properly established
  const textElements = elements.filter((el: any) => el.type === 'text')
  const rectangleElements = elements.filter((el: any) => el.type === 'rectangle')

  textElements.forEach((textEl: any) => {
    if (textEl.containerId) {
      // Find the corresponding rectangle
      const container = rectangleElements.find((rect: any) => rect.id === textEl.containerId)
      if (container) {
        // Ensure the container has the text in its boundElements
        if (!container.boundElements) {
          container.boundElements = []
        }
        const hasTextBinding = container.boundElements.some((bound: any) => bound.id === textEl.id)
        if (!hasTextBinding) {
          container.boundElements.push({
            type: 'text',
            id: textEl.id,
          })
        }
      }
    }
  })

  return elements
}

// Specialized function to create application elements from template
export function createApplicationElementsFromTemplate(
  application: any, // Application object
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string,
  customizations?: ElementCustomizations
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`Kein Template gefunden für Application: ${application.name}`)
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
  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateElementId()

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
        // Always use black stroke color for Applications (same as Capabilities)
        newElement.strokeColor = '#1e1e1e'

        // Apply custom dimensions if provided
        if (customizations?.width) {
          newElement.width = customizations.width
        }
        if (customizations?.height) {
          newElement.height = customizations.height
        }

        // CRITICAL: Only override background color if explicitly provided, otherwise keep template color
        if (customizations?.backgroundColor) {
          newElement.backgroundColor = customizations.backgroundColor
        } else {
          // Keep the original template background color
          newElement.backgroundColor = element.backgroundColor || 'transparent'
        }
      } else {
        // Handle icon repositioning for resized containers (same logic as Capabilities)
        const mainContainer = template.elements.find(
          (el: any, idx: number) =>
            el.type === 'rectangle' &&
            ((el.boundElements && el.boundElements.length > 0) ||
              (el.width > 100 && el.height > 50) ||
              idx === 0)
        )

        if (mainContainer && customizations?.width) {
          // Calculate the original distance from the right edge of the main container
          const originalRightEdge = mainContainer.x + mainContainer.width
          const originalDistanceFromRight = originalRightEdge - (element.x + (element.width || 0))
          
          // Calculate the new right edge position with custom width
          const newRightEdge = targetX + customizations.width
          
          // Position the element to maintain the same distance from the right edge
          newElement.x = newRightEdge - originalDistanceFromRight - (element.width || 0)
        }
      }
    }

    // Handle text elements - replace with application name and apply proper formatting
    if (element.type === 'text') {
      // Get the containing rectangle to determine available width
      const containerRect = template.elements.find(
        (el: any) =>
          el.type === 'rectangle' && el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      // Calculate available width for text (with padding)
      let availableWidth = containerRect ? containerRect.width - 20 : 180
      if (customizations?.width && containerRect) {
        availableWidth = customizations.width - 20
      }

      // Get font size
      const fontSize = customizations?.fontSize || element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(application.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText

      // Set text alignment - applications always use center alignment
      newElement.textAlign = 'center'
      newElement.verticalAlign = 'middle'
      newElement.fontSize = fontSize

      // Maintain container binding for proper text rendering
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

            // Use center positioning for applications
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

            newElement.x = textPosition.x
            newElement.y = textPosition.y
            newElement.width = textPosition.width
            newElement.height = textPosition.height
          }
        }
      }
    }

    // Handle grouping
    if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map(
        (gId: string) => groupIdMapping.get(gId) || generateElementId()
      )
    } else {
      newElement.groupIds = []
    }

    // Add to parent group if specified
    if (groupId) {
      newElement.groupIds = [...(newElement.groupIds || []), groupId]
    }

    // Store application metadata in the first element
    if (index === 0) {
      newElement.customData = {
        databaseId: application.id,
        elementType: 'application',
        originalElement: application,
        isFromDatabase: true,
        isMainElement: true,
      }
    } else {
      newElement.customData = {
        isFromDatabase: true,
        isMainElement: false,
        mainElementId: idMapping.get(template.elements[0]?.id),
      }
    }

    // Handle bound elements with mapped IDs
    if (element.boundElements && element.boundElements.length > 0) {
      newElement.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || generateElementId(),
      }))
    }

    // Update index and metadata
    newElement.index = getNextIndex()
    newElement.updated = Date.now()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.seed = generateSeed()

    return newElement
  })

  // Update boundElements references to use new IDs
  elements.forEach((element: any) => {
    if (element.type === 'rectangle' && element.boundElements) {
      element.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || bound.id,
      }))
    }
  })

  // Ensure text-container relationships are properly established
  const textElements = elements.filter((el: any) => el.type === 'text')
  const rectangleElements = elements.filter((el: any) => el.type === 'rectangle')

  textElements.forEach((textEl: any) => {
    if (textEl.containerId) {
      const container = rectangleElements.find((rect: any) => rect.id === textEl.containerId)
      if (container) {
        if (!container.boundElements) {
          container.boundElements = []
        }
        const hasTextBinding = container.boundElements.some((bound: any) => bound.id === textEl.id)
        if (!hasTextBinding) {
          container.boundElements.push({
            type: 'text',
            id: textEl.id,
          })
        }
      }
    }
  })

  return elements
}
