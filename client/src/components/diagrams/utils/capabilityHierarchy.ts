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

  // Remove duplicates and limit to max 3 applications
  const uniqueApplications = applications.filter((app, index, self) => 
    index === self.findIndex(a => a.id === app.id)
  )
  
  return uniqueApplications.slice(0, 3)
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
  // Base height for the capability itself
  let totalHeight = baseHeight

  // If we've reached max levels, return just the base height
  if (currentLevel >= maxLevels) {
    return totalHeight
  }

  // Find visible children (only those that will be displayed)
  const allChildren = findChildCapabilities(capability.id, allCapabilities)
  const visibleChildren = currentLevel + 1 < maxLevels ? allChildren : []

  // Find applications that should be displayed for this capability (using the same logic as rendering)
  const applications = settings.includeApplications 
    ? collectApplicationsForDisplay(capability, allCapabilities, currentLevel, maxLevels)
    : []

  // If no visible children and no applications, return base height
  if (visibleChildren.length === 0 && applications.length === 0) {
    return totalHeight
  }

  // Add space for text area and padding - increased for better text display
  const textAreaHeight = 50 // Increased from 30 to 50 for better text visibility
  const childSpacing = 10

  // Calculate application height from template or use fallback
  let applicationHeight = baseHeight * 0.8 // Default fallback
  if (applicationTemplate) {
    const appTemplateRect = applicationTemplate.elements.find((el: any) => el.type === 'rectangle')
    if (appTemplateRect) {
      applicationHeight = Math.max(appTemplateRect.height, baseHeight * 0.8)
    }
  }

  // Calculate height for visible children recursively
  let childrenTotalHeight = 0
  visibleChildren.forEach(child => {
    const childHeight = calculateSubtreeHeight(
      child,
      allCapabilities,
      baseHeight,
      currentLevel + 1,
      maxLevels,
      settings,
      applicationTemplate // Pass the applicationTemplate down
    )
    childrenTotalHeight += childHeight + childSpacing
  })

  // Calculate height for applications (if any)
  let applicationsTotalHeight = 0
  if (applications.length > 0) {
    applicationsTotalHeight = applications.length * (applicationHeight + childSpacing)
  }

  // Total height = text area + padding + all visible children heights + all application heights
  totalHeight = textAreaHeight + 10 + childrenTotalHeight + applicationsTotalHeight + 10

  return totalHeight
}

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
      totalApplications += Math.min(capability.supportedByApplications.length, 3) // Max 3 applications per capability
    }
  })

  return totalApplications
}
