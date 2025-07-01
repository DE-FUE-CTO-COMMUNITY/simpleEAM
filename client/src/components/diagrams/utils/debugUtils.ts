import type { BusinessCapability } from '@/gql/generated'
import type {
  CapabilityMapSettings,
  HierarchyAnalysis,
  MissingCapabilitiesAnalysis,
} from './capabilityMapTypes'
import { findTopLevelCapabilities, findChildCapabilities } from './capabilityHierarchy'

// Debug function to analyze capability hierarchy (debug output reduced)
export function debugCapabilityHierarchy(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): HierarchyAnalysis {
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)

  let totalChildrenToRender = 0
  if (settings.maxLevels > 1) {
    topLevelCapabilities.forEach(capability => {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children
      totalChildrenToRender += childrenToShow.length
    })
  }

  const expectedTotal = topLevelCapabilities.length + totalChildrenToRender

  return {
    totalCapabilities: capabilities.length,
    topLevelCapabilities: topLevelCapabilities.length,
    childrenToRender: totalChildrenToRender,
    expectedTotal,
  }
}

// Enhanced debug function to identify missing capabilities (production-ready)
export function debugMissingCapabilities(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): MissingCapabilitiesAnalysis {
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)

  // Find all capabilities that would be rendered
  const renderedCapabilities = new Set<string>()

  // Add top-level capabilities
  topLevelCapabilities.forEach(cap => {
    renderedCapabilities.add(cap.id)
  })

  // Add child capabilities (if maxLevels > 1)
  if (settings.maxLevels > 1) {
    topLevelCapabilities.forEach(topLevel => {
      const children = findChildCapabilities(topLevel.id, capabilities)
      children.forEach(child => {
        renderedCapabilities.add(child.id)
      })
    })
  }

  // Only log missing capabilities analysis in development mode
  if (process.env.NODE_ENV === 'development') {
    const missingCapabilities = capabilities.filter(cap => !renderedCapabilities.has(cap.id))

    if (missingCapabilities.length > 0) {
      console.warn(
        `${missingCapabilities.length} von ${capabilities.length} Capabilities wurden nicht gerendert`
      )
    }
  }

  return {
    totalCapabilities: capabilities.length,
    topLevelCapabilities: topLevelCapabilities.length,
    childrenToRender: 0,
    expectedTotal: renderedCapabilities.size,
    renderedCapabilities: renderedCapabilities.size,
    missingCapabilities: capabilities.length - renderedCapabilities.size,
    shouldRender: renderedCapabilities.size,
    hierarchyLevels: new Map(),
    missingDetails: [],
  }
}
