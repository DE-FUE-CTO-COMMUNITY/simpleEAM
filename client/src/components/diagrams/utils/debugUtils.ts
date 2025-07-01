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

// Debug function to analyze application rollup behavior
export function debugApplicationRollup(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): any {
  if (!settings.includeApplications) {
    console.log('🔍 Application rollup debug: Applications are disabled in settings')
    return { disabled: true }
  }

  console.log('🔍 Application rollup debug analysis:')
  console.log(
    `Settings: maxLevels=${settings.maxLevels}, includeApplications=${settings.includeApplications}`
  )

  const topLevelCapabilities = findTopLevelCapabilities(capabilities)
  const analysis = {
    totalUniqueApps: 0,
    directlyAssignedApps: 0,
    rolledUpApps: 0,
    details: [] as any[],
  }

  const processCapability = (capability: BusinessCapability, currentLevel: number, indent = '') => {
    // Only process if this capability will be rendered
    if (currentLevel >= settings.maxLevels) {
      return
    }

    const directApps = capability.supportedByApplications || []
    const isLastVisibleLevel = currentLevel === settings.maxLevels - 1

    console.log(`${indent}📊 ${capability.name} (Level ${currentLevel})`)
    console.log(`${indent}   Direct apps: ${directApps.length}`)

    const rolledUpApps: any[] = []
    if (isLastVisibleLevel) {
      // This capability is at the last visible level, so roll up from hidden children
      const children = findChildCapabilities(capability.id, capabilities)
      children.forEach(child => {
        const childApps = child.supportedByApplications || []
        rolledUpApps.push(...childApps)
        console.log(`${indent}   Hidden child "${child.name}": ${childApps.length} apps`)

        // Recursively collect from hidden descendants
        const collectFromDescendants = (desc: BusinessCapability, descLevel: number) => {
          const grandChildren = findChildCapabilities(desc.id, capabilities)
          grandChildren.forEach(grandChild => {
            const grandChildApps = grandChild.supportedByApplications || []
            rolledUpApps.push(...grandChildApps)
            console.log(
              `${indent}     Hidden descendant "${grandChild.name}": ${grandChildApps.length} apps`
            )
            collectFromDescendants(grandChild, descLevel + 1)
          })
        }
        collectFromDescendants(child, currentLevel + 2)
      })
    }

    const uniqueRolledUp = rolledUpApps.filter(
      (app, index, self) => index === self.findIndex(a => a.id === app.id)
    )

    const totalAppsForCapability = [...directApps, ...uniqueRolledUp].filter(
      (app, index, self) => index === self.findIndex(a => a.id === app.id)
    )

    console.log(`${indent}   Rolled up apps: ${uniqueRolledUp.length}`)
    console.log(`${indent}   Total apps to display: ${totalAppsForCapability.length}`)

    analysis.details.push({
      name: capability.name,
      level: currentLevel,
      directApps: directApps.length,
      rolledUpApps: uniqueRolledUp.length,
      totalApps: totalAppsForCapability.length,
      displayedApps: totalAppsForCapability.length,
      isLastVisibleLevel,
    })

    // Process visible children
    if (currentLevel + 1 < settings.maxLevels) {
      const children = findChildCapabilities(capability.id, capabilities)
      children.forEach(child => {
        processCapability(child, currentLevel + 1, indent + '  ')
      })
    }
  }

  topLevelCapabilities.forEach(capability => {
    processCapability(capability, 0)
  })

  // Calculate totals
  const allUniqueApps = new Set()
  capabilities.forEach(cap => {
    if (cap.supportedByApplications) {
      cap.supportedByApplications.forEach(app => allUniqueApps.add(app.id))
    }
  })

  analysis.totalUniqueApps = allUniqueApps.size
  analysis.directlyAssignedApps = analysis.details.reduce(
    (sum, detail) => sum + detail.directApps,
    0
  )
  analysis.rolledUpApps = analysis.details.reduce((sum, detail) => sum + detail.rolledUpApps, 0)

  console.log('🔍 Rollup Analysis Summary:')
  console.log(`   Total unique apps in system: ${analysis.totalUniqueApps}`)
  console.log(
    `   Apps displayed on map: ${analysis.details.reduce((sum, detail) => sum + detail.displayedApps, 0)}`
  )

  return analysis
}
