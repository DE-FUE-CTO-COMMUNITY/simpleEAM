import type { BusinessCapability } from '@/gql/generated'
import { generateNKeysBetween } from 'fractional-indexing'
import { generateElementId, generateSeed as generateRandomSeed } from './elementIdManager'

export interface CapabilityMapSettings {
  maxLevels: number
  includeApplications: boolean
  includeAiComponents: boolean
  horizontalSpacing: number
  verticalSpacing: number
}

type ExcalidrawElement = {
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
    elementName?: string // Optimization: Only the name instead of complete originalElement
    originalElement?: any // Kept for backward compatibility
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

// Simple but robust index generation for z-ordering
let indexCounter = 0

export const generateIndex = (): string => {
  try {
    // Try to use Excalidraw's fractional indexing API if available
    if (typeof generateNKeysBetween === 'function') {
      const indices = generateNKeysBetween(null, null, 1)
      if (indices && indices.length > 0) {
        return indices[0]
      }
    }
  } catch (error) {
    console.warn('Fractional indexing failed, using fallback:', error)
  }

  // Fallback to simple, reliable index generation
  indexCounter++
  return `a${indexCounter.toString(36)}`
}

// Reset index generation for new batches
export const resetIndexGeneration = (): void => {
  indexCounter = 0
}

// Legacy function for compatibility
export const generateIndices = (count: number, _after?: string, _before?: string): string[] => {
  const indices: string[] = []
  for (let i = 0; i < count; i++) {
    indices.push(generateIndex())
  }
  return indices
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
export const findTopLevelCapabilities = (
  capabilities: BusinessCapability[]
): BusinessCapability[] => {
  return capabilities.filter(cap => !cap.parents || cap.parents.length === 0)
}

// Helper function to find children of a capability
export const findChildCapabilities = (
  parentId: string,
  capabilities: BusinessCapability[]
): BusinessCapability[] => {
  return capabilities.filter(
    cap => cap.parents && cap.parents.some(parent => parent.id === parentId)
  )
}

// Main function to generate capability map
export const generateCapabilityMapElements = (
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): ExcalidrawElement[] => {
  const elements: ExcalidrawElement[] = []

  // Reset index generation for consistent ordering
  resetIndexGeneration()

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

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + index * (baseWidth + settings.horizontalSpacing)
    const y = startY

    // Create main capability container
    const mainElementId = generateElementId()
    const textElementId = generateElementId()
    const capabilityGroupId = generateElementId()

    // Calculate height based on children if we're showing multiple levels
    let containerHeight = baseHeight
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      // Show all children regardless of maxLevels setting
      const childrenToShow = children
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
      index: generateIndex(),
      roundness: null,
      seed: generateRandomSeed(),
      version: 1,
      versionNonce: generateRandomSeed(),
      isDeleted: false,
      boundElements: [{ id: textElementId, type: 'text' }],
      updated: Date.now(),
      link: null,
      locked: false,
      customData: {
        databaseId: capability.id,
        elementType: 'businessCapability',
        elementName: capability.name, // Optimierung: Nur der Name statt kompletter originalElement
        isFromDatabase: true,
        isMainElement: true,
      },
    }

    // Main capability text
    // Icon width for capability elements (calculated from library template)
    const CAPABILITY_ICON_WIDTH = 24 // Approximate icon width based on library
    const TEXT_PADDING = 10 // Left and right padding

    // For top-aligned text with icon, reduce width and center in available space
    const textWidth = baseWidth - TEXT_PADDING - CAPABILITY_ICON_WIDTH
    const availableSpace = baseWidth - CAPABILITY_ICON_WIDTH
    const textX = x + (availableSpace - textWidth) / 2
    const textY = y + 10

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
      index: generateIndex(),
      roundness: null,
      seed: generateRandomSeed(),
      version: 1,
      versionNonce: generateRandomSeed(),
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
      // Show all children regardless of maxLevels setting
      const childrenToShow = children

      childrenToShow.forEach((child, childIndex) => {
        const childX = x + 10
        const childY = y + baseHeight + 20 + childIndex * (50 + 10)
        const childWidth = baseWidth - 20
        const childHeight = 40

        const childRectId = generateElementId()
        const childTextId = generateElementId()

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
          index: generateIndex(),
          roundness: null,
          seed: generateRandomSeed(),
          version: 1,
          versionNonce: generateRandomSeed(),
          isDeleted: false,
          boundElements: [{ id: childTextId, type: 'text' }],
          updated: Date.now(),
          link: null,
          locked: false,
          customData: {
            databaseId: child.id,
            elementType: 'businessCapability',
            elementName: child.name, // Optimierung: Nur der Name statt kompletter originalElement
            isFromDatabase: true,
            isMainElement: true,
          },
        }

        // Child capability text
        // For child capabilities, also account for icon width
        const childTextWidth = childWidth - TEXT_PADDING - CAPABILITY_ICON_WIDTH
        const childAvailableSpace = childWidth - CAPABILITY_ICON_WIDTH
        const childTextX = childX + (childAvailableSpace - childTextWidth) / 2
        const childTextY = childY + 10

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
          index: generateIndex(),
          roundness: null,
          seed: generateRandomSeed(),
          version: 1,
          versionNonce: generateRandomSeed(),
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
      })
    }

    // Note: Applications and AI Components are handled in capabilityRenderer.ts for proper hierarchical rendering
  })

  // Generated capability map elements
  return elements
}
