import type { BusinessCapability } from '@/gql/generated'
import type { ExcalidrawElement } from './CapabilityMapUtils'
import type { CapabilityMapSettings, RenderResult } from './capabilityMapTypes'
import type { LibraryTemplate } from './archimateLibraryUtils'
import { findChildCapabilities, calculateSubtreeHeight } from './capabilityHierarchy'
import {
  createCapabilityElementsFromTemplate,
  createApplicationElementsFromTemplate,
} from './elementCreation'

// Recursive function to render capability hierarchy with proper layout
export const renderCapabilityHierarchy = (
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  capabilityTemplate: LibraryTemplate,
  applicationTemplate: LibraryTemplate | null,
  x: number,
  y: number,
  width: number,
  baseHeight: number,
  parentGroupId: string,
  settings: CapabilityMapSettings,
  currentLevel: number,
  uniformHeight?: number // Optional uniform height for level-0 capabilities
): RenderResult => {
  const elements: ExcalidrawElement[] = []

  // Check if we've reached the maximum level
  if (currentLevel >= settings.maxLevels) {
    return { elements, totalHeight: 0 }
  }

  // Find children
  const children = findChildCapabilities(capability.id, allCapabilities)

  // Find applications that should be included for this capability
  const applications =
    settings.includeApplications && capability.supportedByApplications
      ? capability.supportedByApplications.slice(0, 3)
      : []

  // Calculate the total height needed for this subtree
  const subtreeHeight = calculateSubtreeHeight(
    capability,
    allCapabilities,
    baseHeight,
    currentLevel,
    settings.maxLevels,
    settings
  )

  // Determine if this is a leaf node (no children and no applications to render)
  const isLeaf =
    (children.length === 0 && applications.length === 0) || currentLevel === settings.maxLevels - 1

  // Create the capability box itself
  // For level-0 capabilities, use uniform height if provided; otherwise use calculated height
  const capabilityHeight =
    currentLevel === 0 && uniformHeight ? uniformHeight : isLeaf ? baseHeight : subtreeHeight

  // Determine text alignment: leaf capabilities get centered text, parents get top-centered text
  const useTopCenteredText = !isLeaf // Only parents use top-centered text

  // Determine background color: only level 0 gets white background
  const backgroundColor = currentLevel === 0 ? '#ffffff' : undefined // Let other levels use default background

  const capabilityElements = createCapabilityElementsFromTemplate(
    capability,
    'businessCapability',
    capabilityTemplate,
    x,
    y,
    parentGroupId,
    {
      width: width,
      height: capabilityHeight,
      fontSize: currentLevel === 0 ? 14 : Math.max(10, 14 - currentLevel),
      useTopCenteredText: useTopCenteredText,
      backgroundColor: backgroundColor,
    }
  )

  elements.push(...capabilityElements)

  // If this is not a leaf, render children and applications inside the box
  if (!isLeaf && (children.length > 0 || applications.length > 0)) {
    const textAreaHeight = 50 // Increased space for text at the top - matches the calculation function
    const childPadding = 10
    const childSpacing = 10
    const childIndent = 15

    let currentChildY = y + textAreaHeight + childPadding

    // First, render all child capabilities
    children.forEach((child, _childIndex) => {
      // Calculate child dimensions
      const childWidth = width - childIndent - 10
      const childX = x + childIndent

      // Recursively render child
      const childResult = renderCapabilityHierarchy(
        child,
        allCapabilities,
        capabilityTemplate,
        applicationTemplate,
        childX,
        currentChildY,
        childWidth,
        baseHeight,
        parentGroupId,
        settings,
        currentLevel + 1,
        undefined // Children don't need uniform height, only level-0 capabilities do
      )

      elements.push(...childResult.elements)

      // Move to next child position
      currentChildY += childResult.totalHeight + childSpacing
    })

    // Then, render applications (if any and template available)
    if (applications.length > 0 && applicationTemplate) {
      applications.forEach((app, _appIndex) => {
        // Calculate application dimensions (same as child capabilities)
        const appWidth = width - childIndent - 10
        const appX = x + childIndent
        const appHeight = 40

        const appElements = createApplicationElementsFromTemplate(
          app,
          applicationTemplate,
          appX,
          currentChildY,
          parentGroupId,
          {
            width: appWidth,
            height: appHeight,
            fontSize: Math.max(10, 14 - currentLevel - 1),
            backgroundColor: '#e8f4fd',
          }
        )

        elements.push(...appElements)

        // Move to next position
        currentChildY += appHeight + childSpacing
      })
    }
  }

  return { elements, totalHeight: capabilityHeight }
}
