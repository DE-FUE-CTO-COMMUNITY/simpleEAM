import type { BusinessCapability } from '@/gql/generated'
import { generateNKeysBetween } from "fractional-indexing"

export interface CapabilityMapSettings {
  maxLevels: number
  includeApplications: boolean
  horizontalSpacing: number
  verticalSpacing: number
}

export interface ExcalidrawElement {
  id: string
  type: 'rectangle' | 'text'
  x: number
  y: number
  width: number
  height: number
  angle: number
  strokeColor: string
  backgroundColor: string
  fillStyle: string
  strokeWidth: number
  strokeStyle: string
  roughness: number
  opacity: number
  groupIds: string[]
  frameId: null
  index: string
  roundness: null
  seed: number
  version: number
  versionNonce: number
  isDeleted: boolean
  boundElements?: Array<{ id: string; type: string }>
  updated: number
  link: null
  locked: boolean
  customData?: {
    databaseId?: string
    elementType?: string
    originalElement?: any
    isFromDatabase?: boolean
    isMainElement?: boolean
    mainElementId?: string
  }
  // Text-specific properties
  text?: string
  fontSize?: number
  fontFamily?: number
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  containerId?: string
  originalText?: string
  autoResize?: boolean
  lineHeight?: number
  rawText?: string
}

// Helper function to generate unique IDs (alternative to Excalidraw's generateId)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Helper function to generate random seed
export const generateSeed = (): number => {
  return Math.floor(Math.random() * 2 ** 31)
}

// Index generation for proper z-ordering using Excalidraw's fractional indexing
export const generateIndices = (count: number, after?: string, before?: string): string[] => {
  try {
    return generateNKeysBetween(after || null, before || null, count) as string[]
  } catch (error) {
    console.warn('Failed to generate fractional indices, falling back to simple generation:', error)
    // Fallback to simple sequential generation
    const indices: string[] = []
    for (let i = 0; i < count; i++) {
      indices.push(`a${i.toString().padStart(2, '0')}`)
    }
    return indices
  }
}

// Helper function to calculate text width (approximation)
export const calculateTextWidth = (text: string, fontSize: number = 20): number => {
  // Rough approximation: each character is about 0.6 * fontSize wide
  return Math.max(text.length * fontSize * 0.6, 50) // Minimum width of 50
}

// Helper function to calculate text position for centering
export const calculateCenteredTextPosition = (
  containerX: number,
  containerWidth: number,
  textWidth: number
): number => {
  return containerX + (containerWidth - textWidth) / 2
}

// Helper function to find top-level capabilities (no parents)
export const findTopLevelCapabilities = (capabilities: BusinessCapability[]): BusinessCapability[] => {
  return capabilities.filter(cap => !cap.parents || cap.parents.length === 0)
}

// Helper function to find children of a capability
export const findChildCapabilities = (
  parentId: string,
  capabilities: BusinessCapability[]
): BusinessCapability[] => {
  return capabilities.filter(cap => 
    cap.parents && cap.parents.some(parent => parent.id === parentId)
  )
}

// Main function to generate capability map
export const generateCapabilityMapElements = (
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): ExcalidrawElement[] => {
  const elements: ExcalidrawElement[] = []
  
  // Find top-level capabilities
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)
  
  if (topLevelCapabilities.length === 0) {
    console.warn('No top-level capabilities found')
    return elements
  }

  const startX = 100
  const startY = 100
  const baseWidth = 250
  const baseHeight = 80

  // Calculate total number of elements to generate proper indices
  let totalElements = 0
  topLevelCapabilities.forEach(capability => {
    totalElements += 2 // rectangle + text
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)
      totalElements += childrenToShow.length * 2 // each child has rectangle + text
      
      if (settings.includeApplications) {
        childrenToShow.forEach(child => {
          if (child.supportedByApplications) {
            totalElements += Math.min(child.supportedByApplications.length, 3) // max 3 apps per child
          }
        })
      }
    }
  })

  // Generate indices for all elements
  const indices = generateIndices(totalElements)
  let currentIndex = 0

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + (index * (baseWidth + settings.horizontalSpacing))
    const y = startY

    // Create main capability container
    const mainElementId = generateId()
    const textElementId = generateId()
    const capabilityGroupId = generateId()

    // Calculate height based on children if we're showing multiple levels
    let containerHeight = baseHeight
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)
      containerHeight = Math.max(baseHeight, (childrenToShow.length + 1) * (baseHeight + 20) + 40)
    }

    // Main capability rectangle
    const mainRect: ExcalidrawElement = {
      id: mainElementId,
      type: 'rectangle',
      x,
      y,
      width: baseWidth,
      height: containerHeight,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [capabilityGroupId],
      frameId: null,
      index: indices[currentIndex++],
      roundness: null,
      seed: generateSeed(),
      version: 1,
      versionNonce: generateSeed(),
      isDeleted: false,
      boundElements: [{ id: textElementId, type: 'text' }],
      updated: Date.now(),
      link: null,
      locked: false,
      customData: {
        databaseId: capability.id,
        elementType: 'businessCapability',
        originalElement: capability,
        isFromDatabase: true,
        isMainElement: true,
      },
    }

    // Main capability text
    const textWidth = calculateTextWidth(capability.name)
    const textX = calculateCenteredTextPosition(x, baseWidth, textWidth)
    const textY = y + 5

    const mainText: ExcalidrawElement = {
      id: textElementId,
      type: 'text',
      x: textX,
      y: textY,
      width: textWidth,
      height: 25,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [capabilityGroupId],
      frameId: null,
      index: indices[currentIndex++],
      roundness: null,
      seed: generateSeed(),
      version: 1,
      versionNonce: generateSeed(),
      isDeleted: false,
      boundElements: [],
      updated: Date.now(),
      link: null,
      locked: false,
      text: capability.name,
      fontSize: 20,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'top',
      containerId: mainElementId,
      originalText: capability.name,
      autoResize: true,
      lineHeight: 1.25,
      rawText: capability.name,
      customData: {
        isFromDatabase: true,
        isMainElement: false,
        mainElementId: mainElementId,
      },
    }

    elements.push(mainRect, mainText)

    // Generate child capabilities if maxLevels > 1
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)

      childrenToShow.forEach((child, childIndex) => {
        const childX = x + 10
        const childY = y + baseHeight + 20 + (childIndex * (50 + 10))
        const childWidth = baseWidth - 20
        const childHeight = 40

        const childRectId = generateId()
        const childTextId = generateId()

        // Child capability rectangle
        const childRect: ExcalidrawElement = {
          id: childRectId,
          type: 'rectangle',
          x: childX,
          y: childY,
          width: childWidth,
          height: childHeight,
          angle: 0,
          strokeColor: '#1e1e1e',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 1,
          opacity: 100,
          groupIds: [capabilityGroupId],
          frameId: null,
          index: indices[currentIndex++],
          roundness: null,
          seed: generateSeed(),
          version: 1,
          versionNonce: generateSeed(),
          isDeleted: false,
          boundElements: [{ id: childTextId, type: 'text' }],
          updated: Date.now(),
          link: null,
          locked: false,
          customData: {
            databaseId: child.id,
            elementType: 'businessCapability',
            originalElement: child,
            isFromDatabase: true,
            isMainElement: true,
          },
        }

        // Child capability text
        const childTextWidth = calculateTextWidth(child.name, 16)
        const childTextX = childX + (childWidth - childTextWidth) / 2
        const childTextY = childY + 5

        const childText: ExcalidrawElement = {
          id: childTextId,
          type: 'text',
          x: childTextX,
          y: childTextY,
          width: childTextWidth,
          height: 20,
          angle: 0,
          strokeColor: '#1e1e1e',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 1,
          opacity: 100,
          groupIds: [capabilityGroupId],
          frameId: null,
          index: indices[currentIndex++],
          roundness: null,
          seed: generateSeed(),
          version: 1,
          versionNonce: generateSeed(),
          isDeleted: false,
          boundElements: [],
          updated: Date.now(),
          link: null,
          locked: false,
          text: child.name,
          fontSize: 16,
          fontFamily: 1,
          textAlign: 'center',
          verticalAlign: 'top',
          containerId: childRectId,
          originalText: child.name,
          autoResize: true,
          lineHeight: 1.25,
          rawText: child.name,
          customData: {
            isFromDatabase: true,
            isMainElement: false,
            mainElementId: childRectId,
          },
        }

        elements.push(childRect, childText)

        // Add applications if enabled
        if (settings.includeApplications && child.supportedByApplications && child.supportedByApplications.length > 0) {
          child.supportedByApplications.slice(0, 3).forEach((app, appIndex) => {
            const appX = childX + 5
            const appY = childY + childHeight + 5 + (appIndex * 15)
            const appTextId = generateId()

            const appText: ExcalidrawElement = {
              id: appTextId,
              type: 'text',
              x: appX,
              y: appY,
              width: calculateTextWidth(app.name, 12),
              height: 15,
              angle: 0,
              strokeColor: '#666666',
              backgroundColor: 'transparent',
              fillStyle: 'solid',
              strokeWidth: 1,
              strokeStyle: 'solid',
              roughness: 1,
              opacity: 100,
              groupIds: [capabilityGroupId],
              frameId: null,
              index: indices[currentIndex++],
              roundness: null,
              seed: generateSeed(),
              version: 1,
              versionNonce: generateSeed(),
              isDeleted: false,
              boundElements: [],
              updated: Date.now(),
              link: null,
              locked: false,
              text: `• ${app.name}`,
              fontSize: 12,
              fontFamily: 1,
              textAlign: 'left',
              verticalAlign: 'top',
              originalText: `• ${app.name}`,
              autoResize: true,
              lineHeight: 1.25,
              rawText: `• ${app.name}`,
              customData: {
                databaseId: app.id,
                elementType: 'application',
                originalElement: app,
                isFromDatabase: true,
                isMainElement: false,
              },
            }

            elements.push(appText)
          })
        }
      })
    }
  })

  console.log(`Generated ${elements.length} elements for capability map`)
  return elements
}
