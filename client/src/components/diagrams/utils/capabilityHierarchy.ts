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

  // Find children
  const children = findChildCapabilities(capability.id, allCapabilities)

  // Find applications that should be included
  const applications =
    settings.includeApplications && capability.supportedByApplications
      ? capability.supportedByApplications.slice(0, 3)
      : []

  // If no children and no applications, return base height
  if (children.length === 0 && applications.length === 0) {
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

  // Calculate height for all children recursively
  let childrenTotalHeight = 0
  children.forEach(child => {
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

  // Total height = text area + padding + all children heights + all application heights
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
