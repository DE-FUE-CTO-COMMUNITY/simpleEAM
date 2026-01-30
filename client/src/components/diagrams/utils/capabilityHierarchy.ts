import type { BusinessCapability, CapabilityType } from '@/gql/generated'
import type { CapabilityMapSettings } from './capabilityMapTypes'

// Helper functions to find capabilities
export function findTopLevelCapabilities(capabilities: BusinessCapability[]): BusinessCapability[] {
  const topLevel = capabilities.filter(cap => !cap.parents || cap.parents.length === 0)
  return sortCapabilitiesByTypeAndSequence(topLevel)
}

export function findChildCapabilities(
  parentId: string,
  capabilities: BusinessCapability[]
): BusinessCapability[] {
  const children = capabilities.filter(
    cap => cap.parents && cap.parents.some(parent => parent.id === parentId)
  )
  return sortCapabilitiesByTypeAndSequence(children)
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
  return uniqueApplications
}

// Function to collect AI Components that should be displayed with a capability
// This function implements the correct rollup logic:
// 1. Always show AI components directly assigned to this capability
// 2. Additionally, roll up AI components from child capabilities that WON'T be displayed due to maxLevels
export function collectAiComponentsForDisplay(
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  currentLevel: number,
  maxLevels: number
): any[] {
  const aiComponents: any[] = []

  // ALWAYS add AI components directly assigned to this capability
  if (capability.supportedByAIComponents && capability.supportedByAIComponents.length > 0) {
    aiComponents.push(...capability.supportedByAIComponents)
  }

  // Check if we are at the last visible level AND have children that won't be displayed
  if (currentLevel === maxLevels - 1) {
    // We are at the last visible level (e.g., Level 2 when maxLevels = 3)
    // Any children of this capability will be hidden, so roll up their AI components
    const hiddenChildren = findChildCapabilities(capability.id, allCapabilities)

    hiddenChildren.forEach(hiddenChild => {
      // Add AI components from this hidden child
      if (hiddenChild.supportedByAIComponents && hiddenChild.supportedByAIComponents.length > 0) {
        aiComponents.push(...hiddenChild.supportedByAIComponents)
      }

      // Recursively add AI components from all descendants of this hidden child
      const hiddenDescendants = findAllDescendantsUnlimited(hiddenChild.id, allCapabilities)
      hiddenDescendants.forEach(descendant => {
        if (descendant.supportedByAIComponents && descendant.supportedByAIComponents.length > 0) {
          aiComponents.push(...descendant.supportedByAIComponents)
        }
      })
    })
  }

  // Remove duplicates - no limit on number of AI components
  const uniqueAiComponents = aiComponents.filter(
    (component, index, self) => index === self.findIndex(a => a.id === component.id)
  )

  return uniqueAiComponents.sort((a, b) => {
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

// Simplified and robust height calculation that matches the renderer exactly
export const calculateSubtreeHeight = (
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  baseHeight: number,
  currentLevel: number,
  maxLevels: number,
  settings: CapabilityMapSettings,
  applicationTemplate?: any
): number => {
  // Check if we've reached the maximum level
  if (currentLevel >= maxLevels) {
    return 0
  }

  // Find visible children (only those that will be displayed)
  const allChildren = findChildCapabilities(capability.id, allCapabilities)
  const visibleChildren = currentLevel + 1 < maxLevels ? allChildren : []

  // Find applications that should be displayed for this capability
  const applications = settings.includeApplications
    ? collectApplicationsForDisplay(capability, allCapabilities, currentLevel, maxLevels)
    : []

  // Find AI components that should be displayed for this capability
  const aiComponents = settings.includeAiComponents
    ? collectAiComponentsForDisplay(capability, allCapabilities, currentLevel, maxLevels)
    : []

  // Determine if this is a leaf node (no visible children and no applications/AI components to render)
  const isLeaf =
    visibleChildren.length === 0 && applications.length === 0 && aiComponents.length === 0

  // If this is a leaf node, return the base height
  if (isLeaf) {
    return baseHeight
  }

  // For non-leaf nodes, calculate height exactly as the renderer does
  // These constants MUST MATCH the renderer values exactly!
  const textAreaHeight = 50 // Space reserved for the capability text at the top
  const childPadding = 10 // Padding between text area and first child
  const childSpacing = 10 // Spacing between children and applications
  const bottomPadding = 10 // Padding at the bottom

  let totalContentHeight = textAreaHeight + childPadding

  // Calculate space for all visible children
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

    totalContentHeight += childHeight

    // Add spacing after EVERY child (matches renderer: currentChildY += childResult.totalHeight + childSpacing)
    totalContentHeight += childSpacing
  })

  // Calculate space for applications
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

    applications.forEach((_app, _appIndex) => {
      totalContentHeight += applicationHeight

      // Add spacing after EVERY application (matches renderer: currentChildY += appHeight + childSpacing)
      totalContentHeight += childSpacing
    })
  }

  // Calculate space for AI components (similar to applications)
  if (aiComponents.length > 0) {
    // Calculate AI component height exactly like the renderer does
    let aiComponentHeight = baseHeight * 0.8 // Default fallback
    if (applicationTemplate) {
      // Reuse application template for now
      const appTemplateRect = applicationTemplate.elements.find(
        (el: any) => el.type === 'rectangle'
      )
      if (appTemplateRect) {
        aiComponentHeight = Math.max(appTemplateRect.height, baseHeight * 0.8)
      }
    }

    aiComponents.forEach((_aiComponent, _aiIndex) => {
      totalContentHeight += aiComponentHeight

      // Add spacing after EVERY AI component (matches renderer: currentChildY += aiHeight + childSpacing)
      totalContentHeight += childSpacing
    })
  }

  // Add bottom padding
  totalContentHeight += bottomPadding

  // Return the maximum of base height and calculated content height
  // Note: The renderer calculates actualUsedHeight as currentChildY - y + bottomPadding
  // Since currentChildY includes spacing after the last element, we keep all spacing as calculated
  return Math.max(baseHeight, totalContentHeight)
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

// Function to calculate total AI components count across all capabilities (ignoring maxLevels)
export function calculateTotalAiComponentsCount(capabilities: BusinessCapability[]): number {
  if (!capabilities || capabilities.length === 0) return 0

  let totalAiComponents = 0
  capabilities.forEach(capability => {
    if (capability.supportedByAIComponents) {
      totalAiComponents += capability.supportedByAIComponents.length // No limit on AI components per capability
    }
  })

  return totalAiComponents
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

// NEW: Function to calculate how many AI components will actually be displayed on the map
// This accounts for the smart rollup logic and only counts rendered capabilities
export function calculateDisplayedAiComponentsCount(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): number {
  if (!settings.includeAiComponents) {
    return 0
  }

  const uniqueDisplayedAiComponents = new Set<string>()

  function processCapability(capability: BusinessCapability, currentLevel: number) {
    // Stop if we've exceeded the max levels
    if (currentLevel >= settings.maxLevels) {
      return
    }

    // Get AI components that will be displayed for this capability using the same logic as rendering
    const displayedAiComponents = collectAiComponentsForDisplay(
      capability,
      capabilities,
      currentLevel,
      settings.maxLevels
    )

    // Add each AI component to our set (ensures uniqueness)
    displayedAiComponents.forEach(aiComponent => {
      uniqueDisplayedAiComponents.add(aiComponent.id)
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

  return uniqueDisplayedAiComponents.size
}

// Sortierungsfunktion für Capabilities nach Typ und Sequenz
export function sortCapabilitiesByTypeAndSequence(
  capabilities: BusinessCapability[]
): BusinessCapability[] {
  return [...capabilities].sort((a, b) => {
    // Typ-Prioritäten definieren
    const getTypePriority = (type: CapabilityType | null | undefined): number => {
      switch (type) {
        case 'STRATEGIC':
          return 1
        case 'OPERATIONAL':
          return 2
        case 'SUPPORT':
          return 3
        default:
          return 2 // Für null/undefined -> default OPERATIONAL
      }
    }

    const typePriorityA = getTypePriority(a.type)
    const typePriorityB = getTypePriority(b.type)

    // Zuerst nach Typ sortieren
    if (typePriorityA !== typePriorityB) {
      return typePriorityA - typePriorityB
    }

    // Bei gleichem Typ nach Sequenz sortieren
    const sequenceA = a.sequenceNumber ?? 0
    const sequenceB = b.sequenceNumber ?? 0

    // Capabilities mit Sequenz > 0 zuerst (aufsteigend 1,2,3,...)
    const hasValidSequenceA = sequenceA > 0
    const hasValidSequenceB = sequenceB > 0

    if (hasValidSequenceA && hasValidSequenceB) {
      return sequenceA - sequenceB
    }

    if (hasValidSequenceA && !hasValidSequenceB) {
      return -1 // A hat gültige Sequenz, B nicht -> A kommt zuerst
    }

    if (!hasValidSequenceA && hasValidSequenceB) {
      return 1 // B hat gültige Sequenz, A nicht -> B kommt zuerst
    }

    // Beide haben Sequenz 0 oder null -> alphabetisch nach Name sortieren
    const nameA = a.name?.toLowerCase() || ''
    const nameB = b.name?.toLowerCase() || ''
    return nameA.localeCompare(nameB)
  })
}
