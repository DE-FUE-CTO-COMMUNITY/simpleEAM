import type { BusinessCapability } from '@/gql/generated'
import type { ExcalidrawElement } from './capabilityMapTypes'
import { findArchimateTemplate, loadArchimateLibrary } from './architectureElements'

// Re-export all types and functions from the refactored modules
export type { CapabilityMapSettings, ElementCustomizations } from './capabilityMapTypes'
export { initializeIndices, getNextIndex, generateId, generateSeed } from './elementIdManager'
export {
  findTopLevelCapabilities,
  findChildCapabilities,
  findAllDescendants,
  calculateRenderedCapabilitiesCount,
  calculateTotalApplicationsCount,
  calculateDisplayedApplicationsCount,
  calculateTotalAiComponentsCount,
  calculateDisplayedAiComponentsCount,
  calculateSubtreeHeight,
  collectAiComponentsForDisplay,
  sortCapabilitiesByTypeAndSequence,
} from './capabilityHierarchy'
export { renderCapabilityHierarchy } from './capabilityRenderer'

// Import what we need for the main functions
import type { CapabilityMapSettings } from './capabilityMapTypes'
import { initializeIndices, generateId } from './elementIdManager'
import {
  findTopLevelCapabilities,
  findChildCapabilities,
  findAllDescendants,
  calculateSubtreeHeight,
} from './capabilityHierarchy'
import { renderCapabilityHierarchy } from './capabilityRenderer'

// Main function to generate capability map with ArchiMate symbols (REFACTORED)
export const generateCapabilityMapWithLibrary = async (
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): Promise<ExcalidrawElement[]> => {
  const elements: ExcalidrawElement[] = []

  // Load ArchiMate library
  const archimateLibrary = await loadArchimateLibrary()
  if (!archimateLibrary) {
    console.warn('ArchiMate-Bibliothek konnte nicht geladen werden, verwende einfache Rechtecke')
    return []
  }

  // Get templates from library using the proven helper
  const capabilityTemplate = findArchimateTemplate(archimateLibrary, 'Capability')

  // Try comprehensive search for application template with multiple name variants
  let applicationTemplate = findArchimateTemplate(archimateLibrary, 'Application Component')
  if (!applicationTemplate) {
    applicationTemplate = findArchimateTemplate(archimateLibrary, 'Application')
  }
  if (!applicationTemplate) {
    applicationTemplate = findArchimateTemplate(archimateLibrary, 'ApplicationComponent')
  }
  if (!applicationTemplate) {
    applicationTemplate = findArchimateTemplate(archimateLibrary, 'App Component')
  }
  if (!applicationTemplate) {
    // Try to find any template that contains "Application" in the name
    applicationTemplate =
      archimateLibrary.libraryItems.find(
        (item: any) => item.name && item.name.toLowerCase().includes('application')
      ) ?? null
  }

  // Try comprehensive search for AI component template
  let aiComponentTemplate = findArchimateTemplate(archimateLibrary, 'AI Component')
  if (!aiComponentTemplate) {
    aiComponentTemplate = findArchimateTemplate(archimateLibrary, 'AIComponent')
  }
  if (!aiComponentTemplate) {
    aiComponentTemplate = findArchimateTemplate(
      archimateLibrary,
      'Artificial Intelligence Component'
    )
  }
  if (!aiComponentTemplate) {
    // Fallback: use application template for AI components if no specific template found
    aiComponentTemplate = applicationTemplate
  }

  if (!capabilityTemplate) {
    console.warn('Capability-Template nicht gefunden in ArchiMate-Bibliothek')
    return []
  }

  if (settings.includeApplications && !applicationTemplate) {
    console.warn(
      'Applications sind aktiviert, aber Application Component Template wurde nicht gefunden'
    )
  }

  if (settings.includeAiComponents && !aiComponentTemplate) {
    console.warn('AI Components sind aktiviert, aber AI Component Template wurde nicht gefunden')
  }

  // Find top-level capabilities
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)

  if (topLevelCapabilities.length === 0) {
    console.warn('No top-level capabilities found')
    return elements
  }

  // Calculate total number of elements needed for index generation (recursive count)
  let totalElements = 0

  // Helper function to recursively count applications and AI components in capability tree
  const countApplicationsInCapability = (cap: BusinessCapability, level: number): number => {
    let appCount = 0

    // Count applications for this capability if we haven't exceeded maxLevels
    if (level < settings.maxLevels && settings.includeApplications && applicationTemplate) {
      const apps = cap.supportedByApplications || []
      appCount += apps.length * applicationTemplate.elements.length
    }

    // Count AI components for this capability if we haven't exceeded maxLevels
    if (level < settings.maxLevels && settings.includeAiComponents && aiComponentTemplate) {
      const aiComponents = cap.supportedByAIComponents || []
      appCount += aiComponents.length * aiComponentTemplate.elements.length
    }

    // Recursively count applications in child capabilities
    if (level + 1 < settings.maxLevels) {
      const children = findChildCapabilities(cap.id, capabilities)
      children.forEach(child => {
        appCount += countApplicationsInCapability(child, level + 1)
      })
    }

    return appCount
  }

  topLevelCapabilities.forEach(capability => {
    totalElements += capabilityTemplate.elements.length // Actual template elements count

    // Count all descendants recursively
    const allDescendants = findAllDescendants(capability.id, capabilities, 1, settings.maxLevels)
    totalElements += allDescendants.length * capabilityTemplate.elements.length

    // Count all applications in the capability tree recursively
    totalElements += countApplicationsInCapability(capability, 0)
  })

  // Initialize indices for all elements
  initializeIndices(totalElements)

  const startX = 100
  const startY = 100

  // Get original template dimensions to maintain proper sizing
  const templateRect = capabilityTemplate.elements.find(el => el.type === 'rectangle')
  const templateWidth = templateRect ? templateRect.width : 250
  const templateHeight = templateRect ? templateRect.height : 80

  const baseWidth = templateWidth
  const baseHeight = templateHeight

  // Calculate uniform height for all top-level capabilities
  // Find the maximum height needed among all top-level capabilities
  let maxRequiredHeight = baseHeight

  // Always calculate height, even for Level 1 (applications need space)
  topLevelCapabilities.forEach(capability => {
    const requiredHeight = calculateSubtreeHeight(
      capability,
      capabilities,
      baseHeight,
      0,
      settings.maxLevels,
      settings,
      applicationTemplate // Pass the applicationTemplate
    )
    maxRequiredHeight = Math.max(maxRequiredHeight, requiredHeight)
  })

  // Generate top-level capabilities horizontally using the new recursive approach
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + index * (baseWidth + settings.horizontalSpacing)
    const y = startY
    const capabilityGroupId = generateId()

    // Use the new recursive rendering function with uniform height for level-0
    const result = renderCapabilityHierarchy(
      capability,
      capabilities,
      capabilityTemplate,
      applicationTemplate,
      aiComponentTemplate,
      x,
      y,
      baseWidth,
      baseHeight,
      capabilityGroupId,
      settings,
      0, // Start at level 0 for top-level capabilities
      maxRequiredHeight // Pass the uniform height for level-0 capabilities
    )

    elements.push(...result.elements)
  })

  return elements
}
