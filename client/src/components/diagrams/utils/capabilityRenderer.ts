import type { BusinessCapability } from '@/gql/generated'
import type { ExcalidrawElement } from './capabilityMapTypes'
import type { CapabilityMapSettings, RenderResult } from './capabilityMapTypes'
import type { ExcalidrawLibraryItem } from './architectureElements'
import {
  findChildCapabilities,
  calculateSubtreeHeight,
  collectApplicationsForDisplay,
  collectAiComponentsForDisplay,
} from './capabilityHierarchy'
import { createCanvasElementsFromTemplate } from './architectureElements'
import type { ElementType } from '@/graphql/library'

// Recursive function to render capability hierarchy with proper layout
export const renderCapabilityHierarchy = (
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  capabilityTemplate: ExcalidrawLibraryItem,
  applicationTemplate: ExcalidrawLibraryItem | null,
  aiComponentTemplate: ExcalidrawLibraryItem | null,
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

  // Find visible children (only render children that are within maxLevels)
  const allChildren = findChildCapabilities(capability.id, allCapabilities)
  const visibleChildren = currentLevel + 1 < settings.maxLevels ? allChildren : []

  // Find applications that should be displayed for this capability (smart rollup logic)
  const applications = settings.includeApplications
    ? collectApplicationsForDisplay(capability, allCapabilities, currentLevel, settings.maxLevels)
    : []

  // Find AI components that should be displayed for this capability (smart rollup logic)
  const aiComponents = settings.includeAiComponents
    ? collectAiComponentsForDisplay(capability, allCapabilities, currentLevel, settings.maxLevels)
    : []

  // Calculate the total height needed for this subtree
  const subtreeHeight = calculateSubtreeHeight(
    capability,
    allCapabilities,
    baseHeight,
    currentLevel,
    settings.maxLevels,
    settings,
    applicationTemplate // Pass the applicationTemplate for consistent height calculations
  )

  // Determine if this is a leaf node (no visible children, no applications, and no AI components to render)
  // A capability is a leaf ONLY if it has neither visible children NOR applications NOR AI components to display
  const isLeaf =
    visibleChildren.length === 0 && applications.length === 0 && aiComponents.length === 0

  // Create the capability box itself
  // For level-0 capabilities, use uniform height if provided; otherwise use calculated height
  const capabilityHeight =
    currentLevel === 0 && uniformHeight ? uniformHeight : isLeaf ? baseHeight : subtreeHeight

  // Determine text alignment:
  // - Level-0 capabilities ALWAYS get top-centered text
  // - Other levels: leaf capabilities get centered text, parents get top-centered text
  const useTopCenteredText = currentLevel === 0 || !isLeaf

  // Determine background color: Level-0 capabilities get white background
  const backgroundColor = currentLevel === 0 ? '#ffffff' : undefined

  const capabilityElements = createCanvasElementsFromTemplate({
    template: capabilityTemplate,
    element: capability,
    elementType: 'businessCapability' as ElementType,
    targetX: x,
    targetY: y,
    groupId: parentGroupId,
    customizations: {
      width: width,
      height: capabilityHeight,
      fontSize: currentLevel === 0 ? 14 : Math.max(10, 14 - currentLevel),
      useTopCenteredText: useTopCenteredText,
      backgroundColor: backgroundColor,
    },
  })

  elements.push(...capabilityElements)

  // If this is not a leaf, render visible children and applications/AI components inside the box
  if (
    !isLeaf &&
    (visibleChildren.length > 0 || applications.length > 0 || aiComponents.length > 0)
  ) {
    const textAreaHeight = 50 // Increased space for text at the top - matches the calculation function
    const childPadding = 10
    const childSpacing = 10
    const childIndent = 15

    let currentChildY = y + textAreaHeight + childPadding

    // First, render all visible child capabilities
    visibleChildren.forEach((child, _childIndex) => {
      // Calculate child dimensions - reduce width less aggressively
      const childWidth = width - childIndent - 5
      const childX = x + childIndent

      // Recursively render child
      const childResult = renderCapabilityHierarchy(
        child,
        allCapabilities,
        capabilityTemplate,
        applicationTemplate,
        aiComponentTemplate,
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
        // Use the same positioning and sizing logic as capabilities
        const appWidth = width - childIndent - 5
        const appX = x + childIndent

        // Get template dimensions like we do for capabilities
        const appTemplateRect = applicationTemplate.elements.find(el => el.type === 'rectangle')
        const appTemplateHeight = appTemplateRect ? appTemplateRect.height : baseHeight

        // Use template height but ensure minimum height
        const appHeight = Math.max(appTemplateHeight, baseHeight * 0.8) // Applications slightly smaller than capabilities

        const appElements = createCanvasElementsFromTemplate({
          template: applicationTemplate,
          element: app,
          elementType: 'application' as ElementType,
          targetX: appX,
          targetY: currentChildY,
          groupId: parentGroupId,
          customizations: {
            width: appWidth,
            height: appHeight,
            fontSize: Math.max(10, 14 - currentLevel - 1),
            // backgroundColor: removed to use template's original color
          },
        })

        elements.push(...appElements)

        // Move to next position
        currentChildY += appHeight + childSpacing
      })
    }

    // Then, render AI components (if any and template available)
    if (aiComponents.length > 0 && aiComponentTemplate) {
      aiComponents.forEach((aiComponent, _aiIndex) => {
        // Use the same positioning and sizing logic as applications
        const aiWidth = width - childIndent - 5
        const aiX = x + childIndent

        // Calculate AI component height exactly like applications
        let aiHeight = baseHeight * 0.8 // Default fallback
        const aiTemplateRect = aiComponentTemplate.elements.find(
          (el: any) => el.type === 'rectangle'
        )
        if (aiTemplateRect) {
          aiHeight = Math.max(aiTemplateRect.height, baseHeight * 0.8)
        }

        const aiElements = createCanvasElementsFromTemplate({
          template: aiComponentTemplate,
          element: aiComponent,
          elementType: 'aiComponent' as ElementType,
          targetX: aiX,
          targetY: currentChildY,
          groupId: parentGroupId,
          customizations: {
            width: aiWidth,
            height: aiHeight,
            fontSize: Math.max(10, 14 - currentLevel - 1),
            // backgroundColor: removed to use template's original color
          },
        })

        elements.push(...aiElements)

        // Move to next position
        currentChildY += aiHeight + childSpacing
      })
    }

    // Calculate the actual used height including content and padding
    const actualUsedHeight = Math.max(
      capabilityHeight, // Minimum height is the calculated capability height
      currentChildY - y + 10 // Actual content height plus bottom padding
    )

    return { elements, totalHeight: actualUsedHeight }
  } else {
    // Leaf capability - no content to render inside
  }

  return { elements, totalHeight: capabilityHeight }
}
