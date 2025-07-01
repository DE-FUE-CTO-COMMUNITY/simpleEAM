import type { BusinessCapability } from '@/gql/generated'
import type { ExcalidrawElement } from './CapabilityMapUtils'
import { findArchimateTemplate, loadArchimateLibrary } from './archimateLibraryUtils'

// Re-export all types and functions from the refactored modules
export type { CapabilityMapSettings, ElementCustomizations } from './capabilityMapTypes'
export { initializeIndices, getNextIndex, generateId, generateSeed } from './elementIdManager'
export {
  findTopLevelCapabilities,
  findChildCapabilities,
  findAllDescendants,
  calculateRenderedCapabilitiesCount,
  calculateTotalApplicationsCount,
  calculateSubtreeHeight,
} from './capabilityHierarchy'
export {
  createCapabilityElementsFromTemplate,
  createApplicationElementsFromTemplate,
} from './elementCreation'
export { debugCapabilityHierarchy, debugMissingCapabilities } from './debugUtils'
export { renderCapabilityHierarchy } from './capabilityRenderer'

// Import what we need for the main functions
import type { CapabilityMapSettings } from './capabilityMapTypes'
import { initializeIndices, generateId, generateSeed } from './elementIdManager'
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
    applicationTemplate = archimateLibrary.libraryItems.find(
      (item: any) => item.name && item.name.toLowerCase().includes('application')
    )
  }

  // Debug: Always log available templates and found templates in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 ArchiMate Library Templates:')
    archimateLibrary.libraryItems.forEach((item: any) => {
      console.log(`- "${item.name}" (elements: ${item.elements?.length || 0})`)
      if (item.elements && item.elements.length > 0) {
        const rectElements = item.elements.filter((el: any) => el.type === 'rectangle')
        const textElements = item.elements.filter((el: any) => el.type === 'text')
        console.log(`  → Rectangles: ${rectElements.length}, Texts: ${textElements.length}`)
        if (textElements.length > 0) {
          console.log(
            `  → Text content: ${textElements.map((el: any) => `"${el.text}"`).join(', ')}`
          )
        }
      }
    })

    console.log(`✅ Capability Template: ${capabilityTemplate ? 'Found' : 'NOT FOUND'}`)
    console.log(`✅ Application Template: ${applicationTemplate ? 'Found' : 'NOT FOUND'}`)

    if (applicationTemplate) {
      console.log('📦 Application Template Details:')
      applicationTemplate.elements.forEach((el: any, idx: number) => {
        console.log(`  ${idx}: ${el.type} (${el.x}, ${el.y}) ${el.width}x${el.height}`)
        if (el.type === 'text') console.log(`      Text: "${el.text}"`)
        if (el.backgroundColor) console.log(`      BG: ${el.backgroundColor}`)
      })
    }
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

  // Find top-level capabilities
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)

  if (topLevelCapabilities.length === 0) {
    console.warn('No top-level capabilities found')
    return elements
  }

  // Calculate total number of elements needed for index generation (recursive count)
  let totalElements = 0

  // Helper function to recursively count applications in capability tree
  const countApplicationsInCapability = (cap: BusinessCapability, level: number): number => {
    let appCount = 0

    // Count applications for this capability if we haven't exceeded maxLevels
    if (level < settings.maxLevels && settings.includeApplications && applicationTemplate) {
      const apps = cap.supportedByApplications || []
      appCount += apps.length * applicationTemplate.elements.length
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

  if (settings.maxLevels > 1) {
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
  }

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

// Fallback function that uses simple rectangles (updated to support recursive rendering)
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

  // Initialize indices for this fallback function
  initializeIndices(100)

  // Calculate uniform container height based on maximum descendant count across all top-level capabilities
  let uniformContainerHeight = baseHeight
  if (settings.maxLevels > 1) {
    let maxDescendantCount = 0

    // Find the maximum number of descendants among all top-level capabilities
    topLevelCapabilities.forEach(capability => {
      const descendants = findAllDescendants(capability.id, capabilities, 1, settings.maxLevels)
      maxDescendantCount = Math.max(maxDescendantCount, descendants.length)
    })

    // Calculate needed height for the maximum number of descendants
    uniformContainerHeight = Math.max(baseHeight, (maxDescendantCount + 1) * (baseHeight + 20) + 40)
  }

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + index * (baseWidth + settings.horizontalSpacing)
    const y = startY

    // Create main capability container
    const mainElementId = generateId()
    const textElementId = generateId()
    const capabilityGroupId = generateId()

    // Main capability rectangle
    const mainRect: ExcalidrawElement = {
      id: mainElementId,
      type: 'rectangle',
      x,
      y,
      width: baseWidth,
      height: uniformContainerHeight,
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
      index: 'a0' as any, // Simplified for fallback
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

    elements.push(mainRect)
  })

  return elements
}
