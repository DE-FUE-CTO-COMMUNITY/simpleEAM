import type { BusinessCapability } from '@/gql/generated'
import type { CapabilityMapSettings } from './capabilityMapTypes'

// Helper functions to find capabilities
export function findTopLevelCapabilities(capabilities: BusinessCapability[]): BusinessCapability[] {
  return capabilities.filter(cap => !cap.parents || cap.parents.length === 0)
}

export function findChildCapabilities(
  parentId: string,
  capabilities: BusinessCapability[]
): BusinessCapability[] {
  return capabilities.filter(
    cap => cap.parents && cap.parents.some(parent => parent.id === parentId)
  )
}

// Helper function to recursively find all descendants up to maxLevels
export function findAllDescendants(
  parentId: string,
  capabilities: BusinessCapability[],
  currentLevel: number,
  maxLevels: number
): BusinessCapability[] {
  if (currentLevel >= maxLevels) {
    return []
  }

  const directChildren = findChildCapabilities(parentId, capabilities)
  const allDescendants = [...directChildren]

  // Recursively add descendants from each child
  directChildren.forEach(child => {
    const childDescendants = findAllDescendants(child.id, capabilities, currentLevel + 1, maxLevels)
    allDescendants.push(...childDescendants)
  })

  return allDescendants
}

// Helper function to find all descendants without level restriction (for applications)
export function findAllDescendantsUnlimited(
  parentId: string,
  capabilities: BusinessCapability[]
): BusinessCapability[] {
  const directChildren = findChildCapabilities(parentId, capabilities)
  const allDescendants = [...directChildren]

  // Recursively add descendants from each child without level restriction
  directChildren.forEach(child => {
    const childDescendants = findAllDescendantsUnlimited(child.id, capabilities)
    allDescendants.push(...childDescendants)
  })

  return allDescendants
}

// Function to collect applications that should be displayed with a capability
// This function implements the correct rollup logic:
// 1. Always show applications directly assigned to this capability
// 2. Additionally, roll up applications from child capabilities that WON'T be displayed due to maxLevels
export function collectApplicationsForDisplay(
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  currentLevel: number,
  maxLevels: number
): any[] {
  const applications: any[] = []

  // ALWAYS add applications directly assigned to this capability
  if (capability.supportedByApplications && capability.supportedByApplications.length > 0) {
    applications.push(...capability.supportedByApplications)
  }

  // Check if we are at the last visible level AND have children that won't be displayed
  if (currentLevel === maxLevels - 1) {
    // We are at the last visible level (e.g., Level 2 when maxLevels = 3)
    // Any children of this capability will be hidden, so roll up their applications
    const hiddenChildren = findChildCapabilities(capability.id, allCapabilities)

    hiddenChildren.forEach(hiddenChild => {
      // Add applications from this hidden child
      if (hiddenChild.supportedByApplications && hiddenChild.supportedByApplications.length > 0) {
        applications.push(...hiddenChild.supportedByApplications)
      }

      // Recursively add applications from all descendants of this hidden child
      const hiddenDescendants = findAllDescendantsUnlimited(hiddenChild.id, allCapabilities)
      hiddenDescendants.forEach(descendant => {
        if (descendant.supportedByApplications && descendant.supportedByApplications.length > 0) {
          applications.push(...descendant.supportedByApplications)
        }
      })
    })
  }

  // Remove duplicates - no limit on number of applications
  const uniqueApplications = applications.filter(
    (app, index, self) => index === self.findIndex(a => a.id === app.id)
  )

  // Sort applications alphabetically by name
  return uniqueApplications.sort((a, b) => {
    const nameA = a.name?.toLowerCase() || ''
    const nameB = b.name?.toLowerCase() || ''
    return nameA.localeCompare(nameB)
  })
}

// Function to calculate the actual number of capabilities that will be rendered on the map
export function calculateRenderedCapabilitiesCount(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): number {
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)
  let count = topLevelCapabilities.length

  if (settings.maxLevels > 1) {
    topLevelCapabilities.forEach(capability => {
      const descendants = findAllDescendants(capability.id, capabilities, 1, settings.maxLevels)
      count += descendants.length
    })
  }

  return count
}

// Helper function to calculate the total height needed for a capability subtree
export const calculateSubtreeHeight = (
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  baseHeight: number,
  currentLevel: number,
  maxLevels: number,
  settings: CapabilityMapSettings,
  applicationTemplate?: any // Add applicationTemplate parameter
): number => {
  // Check if we've reached the maximum level
  if (currentLevel >= maxLevels) {
    return 0
  }

  // Find visible children (only those that will be displayed)
  const allChildren = findChildCapabilities(capability.id, allCapabilities)
  const visibleChildren = currentLevel + 1 < maxLevels ? allChildren : []

  // Find applications that should be displayed for this capability (using the same logic as rendering)
  const applications = settings.includeApplications
    ? collectApplicationsForDisplay(capability, allCapabilities, currentLevel, maxLevels)
    : []

  // Determine if this is a leaf node (no visible children and no applications to render)
  const isLeaf = visibleChildren.length === 0 && applications.length === 0

  // If this is a leaf node, return the base height
  if (isLeaf) {
    return baseHeight
  }

  // Special case: For maxLevels = 1, we need to ensure applications are properly sized
  // Even if there are no visible children, applications need space
  if (maxLevels === 1 && visibleChildren.length === 0 && applications.length > 0) {
    // Calculate height needed for applications only (no children)
    let applicationHeight = baseHeight * 0.8 // Default fallback
    if (applicationTemplate) {
      const appTemplateRect = applicationTemplate.elements.find(
        (el: any) => el.type === 'rectangle'
      )
      if (appTemplateRect) {
        applicationHeight = Math.max(appTemplateRect.height, baseHeight * 0.8)
      }
    }

    // Calculate total height for applications
    const textAreaHeight = 50
    const childPadding = 10
    const childSpacing = 10
    const bottomPadding = 10

    let totalApplicationHeight = textAreaHeight + childPadding
    applications.forEach(() => {
      totalApplicationHeight += applicationHeight + childSpacing
    })
    totalApplicationHeight += bottomPadding

    return Math.max(baseHeight, totalApplicationHeight)
  }

  // For non-leaf nodes, calculate height exactly as the renderer does
  // These constants MUST MATCH the renderer values exactly!
  const textAreaHeight = 50 // Space reserved for the capability text at the top
  const childPadding = 10 // Padding between text area and first child
  const childSpacing = 10 // Spacing between children and applications (matches renderer)
  const bottomPadding = 10 // Padding at the bottom (matches renderer)

  // Start position calculation exactly like in renderer
  let currentChildY = textAreaHeight + childPadding

  // First, calculate space for all visible children
  visibleChildren.forEach((child, _childIndex) => {
    const childHeight = calculateSubtreeHeight(
      child,
      allCapabilities,
      baseHeight,
      currentLevel + 1,
      maxLevels,
      settings,
      applicationTemplate
    )

    currentChildY += childHeight

    // Add spacing after each child (matches renderer: currentChildY += childResult.totalHeight + childSpacing)
    currentChildY += childSpacing
  })

  // Then, calculate space for applications (if any and template available)
  if (applications.length > 0) {
    // Calculate application height exactly like the renderer does
    let applicationHeight = baseHeight * 0.8 // Default fallback
    if (applicationTemplate) {
      const appTemplateRect = applicationTemplate.elements.find(
        (el: any) => el.type === 'rectangle'
      )
      if (appTemplateRect) {
        applicationHeight = Math.max(appTemplateRect.height, baseHeight * 0.8)
      }
    }

    applications.forEach(_app => {
      currentChildY += applicationHeight

      // Add spacing after each application (matches renderer: currentChildY += appHeight + childSpacing)
      currentChildY += childSpacing
    })
  }

  // Calculate the total height including bottom padding
  const contentHeight = currentChildY + bottomPadding

  // Dynamic adjustment buffer based on level depth, content type and complexity
  let adjustmentBuffer = 0

  // Base buffer calculation
  if (maxLevels === 1) {
    // For single level, minimal buffer needed since it's mostly applications
    adjustmentBuffer = applications.length > 0 ? 5 : 0
  } else if (maxLevels === 2) {
    // For two levels, need significantly more buffer
    if (visibleChildren.length > 0 && applications.length > 0) {
      adjustmentBuffer = 40 // Both children and apps - increased from 25
    } else if (visibleChildren.length > 0 || applications.length > 0) {
      adjustmentBuffer = 35 // Either children or apps - increased from 20
    } else {
      adjustmentBuffer = 0 // Neither
    }
  } else if (maxLevels === 3) {
    // For three levels, the originally tuned buffer
    adjustmentBuffer = 20
  } else {
    // For 4+ levels, reduce buffer as it was too much
    const baseBuffer = 15 // Reduced from 25
    const complexityFactor = (maxLevels - 4) * 3 // Reduced from 5
    const contentComplexity =
      (visibleChildren.length > 2 ? 3 : 0) + (applications.length > 2 ? 3 : 0) // Reduced from 5
    adjustmentBuffer = baseBuffer + complexityFactor + contentComplexity
  }

  const totalHeight = Math.max(baseHeight, contentHeight + adjustmentBuffer)

  return totalHeight
}

// DEPRECATED: This function doesn't account for rollup behavior
export function calculateTotalApplicationsCount(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): number {
  if (!settings.includeApplications) {
    return 0
  }

  let totalApplications = 0
  capabilities.forEach(capability => {
    if (capability.supportedByApplications) {
      totalApplications += capability.supportedByApplications.length // No limit on applications per capability
    }
  })

  return totalApplications
}

// NEW: Function to calculate how many applications will actually be displayed on the map
// This accounts for the smart rollup logic and only counts rendered capabilities
export function calculateDisplayedApplicationsCount(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): number {
  if (!settings.includeApplications) {
    return 0
  }

  const uniqueDisplayedApps = new Set<string>()

  // Helper function to process a capability and count its displayed applications
  const processCapability = (capability: BusinessCapability, currentLevel: number) => {
    // Only process if this capability will be rendered (within maxLevels)
    if (currentLevel >= settings.maxLevels) {
      return
    }

    // Get applications that will be displayed for this capability using the same logic as rendering
    const displayedApps = collectApplicationsForDisplay(
      capability,
      capabilities,
      currentLevel,
      settings.maxLevels
    )

    // Add each application to our set (ensures uniqueness)
    displayedApps.forEach(app => {
      uniqueDisplayedApps.add(app.id)
    })

    // Process visible child capabilities
    if (currentLevel + 1 < settings.maxLevels) {
      const children = findChildCapabilities(capability.id, capabilities)
      children.forEach(child => {
        processCapability(child, currentLevel + 1)
      })
    }
  }

  // Start with top-level capabilities
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)
  topLevelCapabilities.forEach(capability => {
    processCapability(capability, 0)
  })

  return uniqueDisplayedApps.size
}
