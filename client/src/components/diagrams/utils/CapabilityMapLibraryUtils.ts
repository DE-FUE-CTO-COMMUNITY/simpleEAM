import type { BusinessCapability } from '@/gql/generated'
import { generateNKeysBetween } from 'fractional-indexing'
import {
  findArchimateTemplate,
  wrapTextToFitWidth,
  loadArchimateLibrary,
  type LibraryTemplate,
} from './archimateLibraryUtils'
import {
  calculateCenteredTextPosition,
  calculateTopCenteredTextPosition,
} from './textContainerUtils'
import type { ExcalidrawElement } from './CapabilityMapUtils'

export interface CapabilityMapSettings {
  maxLevels: number
  includeApplications: boolean
  horizontalSpacing: number
  verticalSpacing: number
}

// Global variables for index management
let preGeneratedIndices: string[] = []
let currentIndexPosition = 0

const generateIndices = (count: number, startAfter?: string): string[] => {
  return generateNKeysBetween(startAfter || null, null, count)
}

const generateSeed = (): number => {
  return Math.floor(Math.random() * 2 ** 31)
}

const generateId = (): string => {
  if (typeof window !== 'undefined') {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
  }
  return 'temp-id-' + Date.now().toString(36)
}

export const initializeIndices = (count: number) => {
  preGeneratedIndices = generateIndices(count)
  currentIndexPosition = 0
}

export const getNextIndex = (): string => {
  if (currentIndexPosition >= preGeneratedIndices.length) {
    // Generate more indices if needed
    const additionalIndices = generateIndices(
      10,
      preGeneratedIndices[preGeneratedIndices.length - 1]
    )
    preGeneratedIndices.push(...additionalIndices)
  }
  return preGeneratedIndices[currentIndexPosition++]
}

// Helper function to create capability elements using proven IntegratedLibrary pattern
export function createCapabilityElementsFromTemplate(
  dbElement: BusinessCapability,
  elementType: string,
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string,
  customizations?: {
    width?: number
    height?: number
    backgroundColor?: string
    fontSize?: number
    useTopCenteredText?: boolean // Neue Option für oben mittige Textausrichtung
  }
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`⚠️ Kein Template gefunden für Element-Typ: ${elementType}`)
    return []
  }

  // Generate unique IDs for the elements - only client-side to avoid hydration issues
  const generateElementId = () => {
    if (typeof window !== 'undefined') {
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36).substr(-4)
    }
    return 'temp-' + Date.now().toString(36).substr(-6)
  }

  // Create a mapping from old IDs to new IDs to maintain relationships
  const idMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    idMapping.set(element.id, generateElementId())
  })

  // Generate new group IDs while preserving grouping relationships
  const groupIdMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    if (element.groupIds && element.groupIds.length > 0) {
      element.groupIds.forEach((gId: string) => {
        if (!groupIdMapping.has(gId)) {
          groupIdMapping.set(gId, generateElementId())
        }
      })
    }
  })

  // Calculate template bounding box for proper positioning
  const templateBounds = {
    minX: Math.min(...template.elements.map((el: any) => el.x)),
    minY: Math.min(...template.elements.map((el: any) => el.y)),
    maxX: Math.max(...template.elements.map((el: any) => el.x + (el.width || 0))),
    maxY: Math.max(...template.elements.map((el: any) => el.y + (el.height || 0))),
  }

  // Calculate offset to position template at target coordinates
  // We want the template's top-left corner to be at (targetX, targetY)
  const offsetX = targetX - templateBounds.minX
  const offsetY = targetY - templateBounds.minY

  // Debug: Log template positioning calculations
  if (
    typeof window !== 'undefined' &&
    (elementType === 'capability' || elementType === 'businessCapability')
  ) {
    console.log('📐 Template bounding box:', templateBounds)
    console.log('🎯 Target position:', { targetX, targetY })
    console.log('📍 Calculated offset:', { offsetX, offsetY })
    console.log(
      '📋 Template elements before positioning:',
      template.elements.map(el => ({
        id: el.id,
        type: el.type,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        groupIds: el.groupIds,
        text: el.type === 'text' ? el.text : undefined,
      }))
    )
  }

  // Clone template elements with new IDs and updated content
  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateElementId()

    // Apply position offset
    newElement.x = element.x + offsetX
    newElement.y = element.y + offsetY

    // Apply customizations for rectangles
    if (element.type === 'rectangle') {
      const isMainContainer =
        (element.boundElements && element.boundElements.length > 0) || // Has bound text elements
        (element.width > 100 && element.height > 50) || // Large enough to be main container
        index === 0 // Fallback: first rectangle

      if (isMainContainer) {
        // Reset stroke color to black for database elements (override green ArchiMate template color)
        newElement.strokeColor = '#1e1e1e'

        // Apply custom dimensions if provided
        if (customizations?.width) {
          newElement.width = customizations.width
        }
        if (customizations?.height) {
          newElement.height = customizations.height
        }
        if (customizations?.backgroundColor) {
          newElement.backgroundColor = customizations.backgroundColor
        }
      } else {
        // This is likely an icon element - check if it needs repositioning
        const mainContainer = template.elements.find(
          (el: any, idx: number) =>
            el.type === 'rectangle' &&
            ((el.boundElements && el.boundElements.length > 0) ||
              (el.width > 100 && el.height > 50) ||
              idx === 0)
        )

        if (mainContainer && element.id.includes('icon')) {
          // Calculate the relative position of the icon within the main container
          const relativeX = element.x - mainContainer.x
          const relativeY = element.y - mainContainer.y

          // Apply the custom width adjustment if provided
          const containerWidth = customizations?.width || mainContainer.width
          const containerHeight = customizations?.height || mainContainer.height

          // If icon is positioned beyond the original container width, adjust it
          if (relativeX > mainContainer.width - 30) {
            // Icons should be within 30px of right edge
            const iconOffsetFromRight = mainContainer.width - relativeX
            newElement.x = targetX + containerWidth - iconOffsetFromRight
          }

          // Debug: Log icon repositioning
          if (
            typeof window !== 'undefined' &&
            (elementType === 'capability' || elementType === 'businessCapability')
          ) {
            console.log(`🔧 Icon ${element.id} repositioning:`, {
              original: { x: element.x, y: element.y },
              relative: { x: relativeX, y: relativeY },
              mainContainer: { width: mainContainer.width, height: mainContainer.height },
              customContainer: { width: containerWidth, height: containerHeight },
              final: { x: newElement.x, y: newElement.y },
            })
          }
        }
      }
    }

    // For text elements, replace the text with database element name
    if (element.type === 'text') {
      // Get the containing rectangle to determine available width
      const containerRect = template.elements.find(
        (el: any) =>
          el.type === 'rectangle' && el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      // Calculate available width for text (with some padding)
      let availableWidth = containerRect ? containerRect.width - 20 : 180 // Default 180px if no container found

      // Apply custom width if provided
      if (customizations?.width && containerRect) {
        availableWidth = customizations.width - 20
      }

      // Get font size (apply custom fontSize if provided)
      const fontSize = customizations?.fontSize || element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(dbElement.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText

      // Preserve the original template's text alignment if it exists, otherwise set defaults
      newElement.textAlign = element.textAlign || 'center'
      newElement.verticalAlign = element.verticalAlign || 'middle'

      // Set font size and ensure it's properly applied
      newElement.fontSize = fontSize

      // CRITICAL: Maintain container binding for proper text rendering
      if (containerRect) {
        // Find the new container ID from the mapping
        const containerElement = template.elements.find(
          (el: any) =>
            el.type === 'rectangle' &&
            el.boundElements?.some((bound: any) => bound.id === element.id)
        )

        if (containerElement) {
          const newContainerId = idMapping.get(containerElement.id)
          if (newContainerId) {
            // Set the containerId to establish the bound text relationship
            newElement.containerId = newContainerId

            // CRITICAL: Use the appropriate text positioning function based on customization
            // Top-level capabilities use top-centered alignment, others use center alignment
            const containerWithCustomizations = {
              ...containerElement,
              x: containerElement.x + offsetX,
              y: containerElement.y + offsetY,
              width: customizations?.width || containerElement.width,
              height: customizations?.height || containerElement.height,
            }

            let textPosition
            if (customizations?.useTopCenteredText) {
              // Use top-centered positioning for top-level capabilities
              textPosition = calculateTopCenteredTextPosition(
                wrappedText,
                containerWithCustomizations,
                fontSize,
                10 // 10px top padding
              )
            } else {
              // Use center positioning for child capabilities and applications
              textPosition = calculateCenteredTextPosition(
                wrappedText,
                containerWithCustomizations,
                fontSize
              )
            }

            // Set position and dimensions from the positioning function
            newElement.x = textPosition.x
            newElement.y = textPosition.y
            newElement.width = textPosition.width
            newElement.height = textPosition.height
          }
        }
      } else {
        // Fallback for texts without container: Use estimated dimensions
        const lineCount = (wrappedText.match(/\n/g) || []).length + 1
        const avgLineWidth = Math.max(...wrappedText.split('\n').map(line => line.length))

        const estimatedWidth = Math.min(avgLineWidth * fontSize * 0.6, availableWidth)
        const estimatedHeight = lineCount * fontSize * 1.2

        newElement.width = element.width && element.width > 0 ? element.width : estimatedWidth
        newElement.height = element.height && element.height > 0 ? element.height : estimatedHeight
      }
    }

    // WICHTIG: Gruppierung korrekt handhaben
    // 1. Zuerst die ursprüngliche Template-Gruppierung beibehalten (ArchiMate-Symbol-Gruppierung)
    if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map(
        (gId: string) => groupIdMapping.get(gId) || generateElementId()
      )
    } else {
      newElement.groupIds = []
    }

    // 2. Dann die übergeordnete Capability-Gruppierung hinzufügen (falls angegeben)
    if (groupId) {
      // Füge die Capability-Gruppen-ID zu den bestehenden Gruppen hinzu, anstatt sie zu ersetzen
      newElement.groupIds = [...(newElement.groupIds || []), groupId]
    }

    // Store database metadata in customData - ONLY in the first element to avoid redundancy
    if (index === 0) {
      // Das erste Element (Hauptelement) erhält alle Datenbank-Metadaten
      newElement.customData = {
        databaseId: dbElement.id,
        elementType,
        originalElement: dbElement,
        isFromDatabase: true,
        isMainElement: true, // Markiere als Hauptelement
      }
    } else {
      // Andere Elemente erhalten nur einen Verweis auf das Hauptelement
      newElement.customData = {
        isFromDatabase: true,
        isMainElement: false,
        mainElementId: idMapping.get(template.elements[0]?.id), // Verweis auf das Hauptelement-ID
      }
    }

    // Handle bound elements with mapped IDs
    if (element.boundElements && element.boundElements.length > 0) {
      newElement.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || generateElementId(),
      }))
    }

    // Update index for proper z-ordering
    newElement.index = getNextIndex()

    // Update timestamps and version
    newElement.updated = Date.now()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.seed = generateSeed()

    return newElement
  })

  // Debug: Log final positioned elements
  if (
    typeof window !== 'undefined' &&
    (elementType === 'capability' || elementType === 'businessCapability')
  ) {
    console.log(
      '🔧 Final positioned elements:',
      elements.map(el => ({
        id: el.id.slice(0, 8) + '...',
        type: el.type,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        groupIds: el.groupIds?.length || 0,
        text: el.type === 'text' ? el.text : undefined,
      }))
    )

    // Verify relative positioning is maintained
    const finalBounds = {
      minX: Math.min(...elements.map((el: any) => el.x)),
      minY: Math.min(...elements.map((el: any) => el.y)),
      maxX: Math.max(...elements.map((el: any) => el.x + (el.width || 0))),
      maxY: Math.max(...elements.map((el: any) => el.y + (el.height || 0))),
    }
    console.log('📦 Final element bounds:', finalBounds)
    console.log('✅ Top-left should be at:', { x: targetX, y: targetY })
  }

  // CRITICAL: Update boundElements references to use new IDs for proper text-container binding
  elements.forEach((element: any) => {
    if (element.type === 'rectangle' && element.boundElements) {
      element.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || bound.id,
      }))
    }
  })

  // Validate and ensure text-container relationships are properly established
  const textElements = elements.filter((el: any) => el.type === 'text')
  const rectangleElements = elements.filter((el: any) => el.type === 'rectangle')

  textElements.forEach((textEl: any) => {
    if (textEl.containerId) {
      // Find the corresponding rectangle
      const container = rectangleElements.find((rect: any) => rect.id === textEl.containerId)
      if (container) {
        // Ensure the container has the text in its boundElements
        if (!container.boundElements) {
          container.boundElements = []
        }
        const hasTextBinding = container.boundElements.some((bound: any) => bound.id === textEl.id)
        if (!hasTextBinding) {
          container.boundElements.push({
            type: 'text',
            id: textEl.id,
          })
        }
      }
    }
  })

  return elements
}

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
function findAllDescendants(
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

// Debug function to analyze capability hierarchy
export function debugCapabilityHierarchy(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
) {
  console.log('🔍 DEBUG: Capability Hierarchy Analysis')
  console.log('Total capabilities in data:', capabilities.length)

  const topLevelCapabilities = findTopLevelCapabilities(capabilities)
  console.log('Top-level capabilities found:', topLevelCapabilities.length)
  console.log(
    'Top-level capability names:',
    topLevelCapabilities.map(cap => cap.name)
  )

  const allParents = capabilities.filter(cap => cap.parents && cap.parents.length > 0)
  console.log('Capabilities with parents:', allParents.length)
  console.log(
    'Child capability names:',
    allParents.map(
      cap => `${cap.name} (parents: ${cap.parents?.map(p => p.name || p.id).join(', ')})`
    )
  )

  let totalChildrenToRender = 0
  if (settings.maxLevels > 1) {
    topLevelCapabilities.forEach(capability => {
      const children = findChildCapabilities(capability.id, capabilities)
      // Show all children regardless of maxLevels setting
      const childrenToShow = children
      console.log(
        `Parent "${capability.name}": ${children.length} children total, ${childrenToShow.length} will be shown (maxLevels: ${settings.maxLevels})`
      )
      totalChildrenToRender += childrenToShow.length
    })
  }

  const expectedTotal = topLevelCapabilities.length + totalChildrenToRender
  console.log('Expected total capabilities on map:', expectedTotal)
  console.log('Settings:', settings)

  return {
    totalCapabilities: capabilities.length,
    topLevelCapabilities: topLevelCapabilities.length,
    childrenToRender: totalChildrenToRender,
    expectedTotal,
  }
}

// Enhanced debug function to identify missing capabilities
export function debugMissingCapabilities(
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
) {
  console.log('🔍 ENHANCED DEBUG: Missing Capabilities Analysis')
  console.log('=' .repeat(50))
  
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)
  console.log(`Total capabilities in data: ${capabilities.length}`)
  console.log(`Top-level capabilities: ${topLevelCapabilities.length}`)
  
  // Find all capabilities that would be rendered
  const renderedCapabilities = new Set<string>()
  
  // Add top-level capabilities
  topLevelCapabilities.forEach(cap => {
    renderedCapabilities.add(cap.id)
    console.log(`✅ Top-level: "${cap.name}" (ID: ${cap.id})`)
  })
  
  // Add child capabilities (if maxLevels > 1)
  if (settings.maxLevels > 1) {
    topLevelCapabilities.forEach(topLevel => {
      const children = findChildCapabilities(topLevel.id, capabilities)
      
      children.forEach(child => {
        renderedCapabilities.add(child.id)
        console.log(`✅ Child of "${topLevel.name}": "${child.name}" (ID: ${child.id})`)
      })
      
      if (children.length === 0) {
        console.log(`⚠️ No children found for top-level: "${topLevel.name}"`)
      }
    })
  }
  
  console.log(`\nRendered capabilities: ${renderedCapabilities.size}`)
  console.log(`Missing capabilities: ${capabilities.length - renderedCapabilities.size}`)
  
  // Find and analyze missing capabilities
  const missingCapabilities = capabilities.filter(cap => !renderedCapabilities.has(cap.id))
  
  if (missingCapabilities.length > 0) {
    console.log('\n❌ MISSING CAPABILITIES:')
    missingCapabilities.forEach(cap => {
      console.log(`❌ Missing: "${cap.name}" (ID: ${cap.id})`)
      
      // Analyze why it's missing
      if (!cap.parents || cap.parents.length === 0) {
        console.log(`   ⚠️ This appears to be a top-level capability but wasn't found by findTopLevelCapabilities`)
      } else {
        console.log(`   📋 Has ${cap.parents.length} parent(s):`)
        cap.parents.forEach(parent => {
          console.log(`      - Parent: "${parent.name || parent.id}" (ID: ${parent.id})`)
          
          // Check if parent exists in data
          const parentExists = capabilities.find(c => c.id === parent.id)
          if (!parentExists) {
            console.log(`        ❌ Parent not found in data!`)
          } else {
            // Check if parent is top-level
            const isParentTopLevel = topLevelCapabilities.find(tl => tl.id === parent.id)
            if (isParentTopLevel) {
              console.log(`        ✅ Parent is top-level`)
            } else {
              console.log(`        ⚠️ Parent is not top-level - this could be a multi-level hierarchy`)
            }
          }
        })
      }
      
      // Check if it has children
      const children = findChildCapabilities(cap.id, capabilities)
      if (children.length > 0) {
        console.log(`   👥 Has ${children.length} children - might be a middle-level capability`)
      }
    })
  }
  
  // Analyze hierarchy levels
  console.log('\n📊 HIERARCHY ANALYSIS:')
  const hierarchyLevels = new Map<number, BusinessCapability[]>()
  
  // Level 0: Top-level capabilities
  hierarchyLevels.set(0, topLevelCapabilities)
  
  // Find deeper levels
  let currentLevel = 0
  let hasMoreLevels = true
  
  while (hasMoreLevels && currentLevel < 5) { // Max 5 levels to prevent infinite loop
    const currentLevelCapabilities = hierarchyLevels.get(currentLevel) || []
    const nextLevelCapabilities: BusinessCapability[] = []
    
    currentLevelCapabilities.forEach(cap => {
      const children = findChildCapabilities(cap.id, capabilities)
      nextLevelCapabilities.push(...children)
    })
    
    if (nextLevelCapabilities.length > 0) {
      hierarchyLevels.set(currentLevel + 1, nextLevelCapabilities)
      console.log(`Level ${currentLevel + 1}: ${nextLevelCapabilities.length} capabilities`)
      nextLevelCapabilities.forEach(cap => {
        console.log(`  - "${cap.name}" (ID: ${cap.id})`)
      })
    } else {
      hasMoreLevels = false
    }
    
    currentLevel++
  }
  
  // Calculate what should be rendered based on maxLevels
  let shouldRender = 0
  for (let level = 0; level < settings.maxLevels && level < hierarchyLevels.size; level++) {
    const levelCaps = hierarchyLevels.get(level) || []
    shouldRender += levelCaps.length
    console.log(`Should render Level ${level}: ${levelCaps.length} capabilities`)
  }
  
  console.log(`\nShould render total: ${shouldRender} capabilities (maxLevels: ${settings.maxLevels})`)
  console.log(`Actually renders: ${renderedCapabilities.size} capabilities`)
  console.log(`Difference: ${shouldRender - renderedCapabilities.size}`)
  
  return {
    totalCapabilities: capabilities.length,
    renderedCapabilities: renderedCapabilities.size,
    missingCapabilities: missingCapabilities.length,
    shouldRender,
    hierarchyLevels,
    missingDetails: missingCapabilities
  }
}

// Helper function to calculate the total height needed for a capability subtree
const calculateSubtreeHeight = (
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  baseHeight: number,
  currentLevel: number,
  maxLevels: number
): number => {
  // Base height for the capability itself
  let totalHeight = baseHeight

  // If we've reached max levels, return just the base height
  if (currentLevel >= maxLevels) {
    return totalHeight
  }

  // Find children
  const children = findChildCapabilities(capability.id, allCapabilities)
  
  if (children.length === 0) {
    return totalHeight
  }

  // Add space for text area and padding - increased for better text display
  const textAreaHeight = 50 // Increased from 30 to 50 for better text visibility
  const childSpacing = 10
  
  // Calculate height for all children recursively
  let childrenTotalHeight = 0
  children.forEach(child => {
    const childHeight = calculateSubtreeHeight(child, allCapabilities, baseHeight, currentLevel + 1, maxLevels)
    childrenTotalHeight += childHeight + childSpacing
  })

  // Total height = text area + padding + all children heights
  totalHeight = textAreaHeight + 10 + childrenTotalHeight + 10

  return totalHeight
}

// Recursive function to render capability hierarchy with proper layout
const renderCapabilityHierarchy = (
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  capabilityTemplate: any,
  applicationTemplate: any,
  x: number,
  y: number,
  width: number,
  baseHeight: number,
  parentGroupId: string,
  settings: CapabilityMapSettings,
  currentLevel: number,
  uniformHeight?: number // Optional uniform height for level-0 capabilities
): { elements: ExcalidrawElement[], totalHeight: number } => {
  const elements: ExcalidrawElement[] = []

  // Check if we've reached the maximum level
  if (currentLevel >= settings.maxLevels) {
    return { elements, totalHeight: 0 }
  }

  // Find children
  const children = findChildCapabilities(capability.id, allCapabilities)
  
  // Calculate the total height needed for this subtree
  const subtreeHeight = calculateSubtreeHeight(capability, allCapabilities, baseHeight, currentLevel, settings.maxLevels)
  
  // Determine if this is a leaf node (no children to render)
  const isLeaf = children.length === 0 || currentLevel === settings.maxLevels - 1

  // Create the capability box itself
  // For level-0 capabilities, use uniform height if provided; otherwise use calculated height
  const capabilityHeight = currentLevel === 0 && uniformHeight ? uniformHeight : (isLeaf ? baseHeight : subtreeHeight)

  console.log(`🔄 Rendering Level ${currentLevel}: "${capability.name}" (${children.length} children, isLeaf: ${isLeaf}, calculated height: ${subtreeHeight}, final height: ${capabilityHeight})`)
  
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

  // If this is not a leaf, render children inside the box
  if (!isLeaf && children.length > 0) {
    const textAreaHeight = 50 // Increased space for text at the top - matches the calculation function
    const childPadding = 10
    const childSpacing = 10
    const childIndent = 15

    let currentChildY = y + textAreaHeight + childPadding

    children.forEach((child, _childIndex) => {
      // Calculate child dimensions
      const childWidth = width - childIndent - 10
      const childX = x + childIndent

      console.log(`📍 Positioning Level ${currentLevel + 1} child "${child.name}" at (${childX}, ${currentChildY})`)

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

      // Add applications for direct children only (level 1)
      if (
        currentLevel === 0 && // Only for direct children of top-level
        settings.includeApplications &&
        applicationTemplate &&
        child.supportedByApplications &&
        child.supportedByApplications.length > 0
      ) {
        const appsToShow = child.supportedByApplications.slice(0, 3)

        appsToShow.forEach((app, appIndex) => {
          const appX = childX + childWidth + 10
          const appY = currentChildY + appIndex * 45

          const appElements = createCapabilityElementsFromTemplate(
            app as any,
            'application',
            applicationTemplate,
            appX,
            appY,
            undefined,
            {
              width: Math.min(160, width - 40),
              height: 40,
              fontSize: 12,
            }
          )

          elements.push(...appElements)
        })
      }

      // Move to next child position
      currentChildY += childResult.totalHeight + childSpacing
    })
  }

  return { elements, totalHeight: capabilityHeight }
}

// Function to load ArchiMate library (this should match the implementation from IntegratedLibrary)
// Main function to generate capability map with ArchiMate symbols (REFACTORED)
export const generateCapabilityMapWithLibrary = async (
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): Promise<ExcalidrawElement[]> => {
  const elements: ExcalidrawElement[] = []

  // Debug capability hierarchy
  debugCapabilityHierarchy(capabilities, settings)

  // Load ArchiMate library
  const archimateLibrary = await loadArchimateLibrary()
  if (!archimateLibrary) {
    console.warn('ArchiMate-Bibliothek konnte nicht geladen werden, verwende einfache Rechtecke')
    return []
  }

  // Get templates from library using the proven helper
  const capabilityTemplate = findArchimateTemplate(archimateLibrary, 'Capability')
  const applicationTemplate = findArchimateTemplate(archimateLibrary, 'Application Component')

  if (!capabilityTemplate) {
    console.warn('Capability-Template nicht gefunden in ArchiMate-Bibliothek')
    return []
  }

  // Find top-level capabilities
  const topLevelCapabilities = findTopLevelCapabilities(capabilities)

  if (topLevelCapabilities.length === 0) {
    console.warn('No top-level capabilities found')
    return elements
  }

  // Calculate total number of elements needed for index generation (recursive count)
  let totalElements = 0
  topLevelCapabilities.forEach(capability => {
    totalElements += capabilityTemplate.elements.length // Actual template elements count
    // Count all descendants recursively
    const allDescendants = findAllDescendants(capability.id, capabilities, 1, settings.maxLevels)
    totalElements += allDescendants.length * capabilityTemplate.elements.length

    if (settings.includeApplications && applicationTemplate) {
      // Only count applications for direct children (level 1)
      const directChildren = findChildCapabilities(capability.id, capabilities)
      directChildren.forEach(child => {
        if (child.supportedByApplications) {
          totalElements +=
            Math.min(child.supportedByApplications.length, 3) *
            applicationTemplate.elements.length
        }
      })
    }
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
      const requiredHeight = calculateSubtreeHeight(capability, capabilities, baseHeight, 0, settings.maxLevels)
      maxRequiredHeight = Math.max(maxRequiredHeight, requiredHeight)
    })
    
    console.log('📏 Uniform height calculation for Level-0 capabilities:', {
      baseHeight,
      maxRequiredHeight,
      topLevelCount: topLevelCapabilities.length,
    })
  }

  // Generate top-level capabilities horizontally using the new recursive approach
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + index * (baseWidth + settings.horizontalSpacing)
    const y = startY
    const capabilityGroupId = generateId()

    console.log(`🚀 Rendering top-level capability: "${capability.name}" at (${x}, ${y}) with uniform height: ${maxRequiredHeight}`)

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

    console.log(`✅ Completed rendering "${capability.name}" with uniform height: ${maxRequiredHeight}`)
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
      const allDescendants = findAllDescendants(capability.id, capabilities, 1, settings.maxLevels)
      maxDescendantCount = Math.max(maxDescendantCount, allDescendants.length)
    })

    // Calculate needed height for the maximum number of descendants
    uniformContainerHeight = Math.max(baseHeight, (maxDescendantCount + 1) * (baseHeight + 20) + 40)

    console.log('📏 Fallback uniform height calculation (recursive):', {
      maxDescendantCount,
      baseHeight,
      uniformContainerHeight,
    })
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
      index: getNextIndex(),
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

    // Calculate centered text position using the proven approach
    const centerPosition = calculateTopCenteredTextPosition(
      capability.name,
      mainRect,
      16
    )

    // Main capability text
    const mainText: ExcalidrawElement = {
      id: textElementId,
      type: 'text',
      x: centerPosition.x,
      y: centerPosition.y,
      width: centerPosition.width,
      height: centerPosition.height,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [capabilityGroupId],
      frameId: null,
      index: getNextIndex(),
      roundness: null,
      seed: generateSeed(),
      version: 1,
      versionNonce: generateSeed(),
      isDeleted: false,
      text: capability.name,
      fontSize: 16,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: mainElementId,
      originalText: capability.name,
      autoResize: true,
      lineHeight: 1.25,
      updated: Date.now(),
      link: null,
      locked: false,
      customData: {
        databaseId: capability.id,
        elementType: 'businessCapability',
        originalElement: capability,
        isFromDatabase: true,
      },
    }

    elements.push(mainRect, mainText)

    // Generate child capabilities recursively if maxLevels > 1
    if (settings.maxLevels > 1) {
      const childElements = generateChildCapabilitiesRecursivelyFallback(
        capability,
        capabilities,
        x,
        y,
        baseWidth,
        baseHeight,
        capabilityGroupId,
        settings,
        1 // Current level (top level is 0, children start at 1)
      )
      elements.push(...childElements)
    }
  })

  return elements
}

// Recursive function for fallback rendering (simple rectangles)
const generateChildCapabilitiesRecursivelyFallback = (
  parentCapability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  parentX: number,
  parentY: number,
  baseWidth: number,
  baseHeight: number,
  parentGroupId: string,
  settings: CapabilityMapSettings,
  currentLevel: number
): ExcalidrawElement[] => {
  const elements: ExcalidrawElement[] = []

  // Check if we've reached the maximum level
  if (currentLevel >= settings.maxLevels) {
    return elements
  }

  // Find children of the current parent
  const children = findChildCapabilities(parentCapability.id, allCapabilities)
  
  if (children.length === 0) {
    return elements
  }

  console.log(`🔄 Fallback Rendering Level ${currentLevel}: ${children.length} capabilities under "${parentCapability.name}"`)

  // Calculate positioning for children
  const childIndent = 10 + (currentLevel - 1) * 15 // Increase indent for deeper levels
  const childWidth = baseWidth - childIndent - 10 // Decrease width for deeper levels
  const childHeight = Math.max(40, baseHeight - currentLevel * 10) // Decrease height for deeper levels
  const fontSize = Math.max(10, 14 - currentLevel * 2) // Decrease font size for deeper levels

  children.forEach((child, childIndex) => {
    const childX = parentX + childIndent
    const childY = parentY + baseHeight + 20 + childIndex * (childHeight + 10)

    // Create child capability elements (rectangle + text)
    const childElementId = generateId()
    const childTextElementId = generateId()

    // Child capability rectangle
    const childRect: ExcalidrawElement = {
      id: childElementId,
      type: 'rectangle',
      x: childX,
      y: childY,
      width: childWidth,
      height: childHeight,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [parentGroupId],
      frameId: null,
      index: getNextIndex(),
      roundness: null,
      seed: generateSeed(),
      version: 1,
      versionNonce: generateSeed(),
      isDeleted: false,
      boundElements: [{ id: childTextElementId, type: 'text' }],
      updated: Date.now(),
      link: null,
      locked: false,
      customData: {
        databaseId: child.id,
        elementType: 'businessCapability',
        originalElement: child,
        isFromDatabase: true,
        isMainElement: true,
      },
    }

    // Calculate centered text position
    const centerPosition = calculateCenteredTextPosition(
      child.name,
      childRect,
      fontSize
    )

    // Child capability text
    const childText: ExcalidrawElement = {
      id: childTextElementId,
      type: 'text',
      x: centerPosition.x,
      y: centerPosition.y,
      width: centerPosition.width,
      height: centerPosition.height,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [parentGroupId],
      frameId: null,
      index: getNextIndex(),
      roundness: null,
      seed: generateSeed(),
      version: 1,
      versionNonce: generateSeed(),
      isDeleted: false,
      text: child.name,
      fontSize: fontSize,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: childElementId,
      originalText: child.name,
      autoResize: true,
      lineHeight: 1.25,
      updated: Date.now(),
      link: null,
      locked: false,
      customData: {
        databaseId: child.id,
        elementType: 'businessCapability',
        originalElement: child,
        isFromDatabase: true,
      },
    }

    elements.push(childRect, childText)

    // Recursively generate children of this child
    const grandChildElements = generateChildCapabilitiesRecursivelyFallback(
      child,
      allCapabilities,
      childX,
      childY,
      baseWidth,
      baseHeight,
      parentGroupId,
      settings,
      currentLevel + 1
    )

    elements.push(...grandChildElements)
  })

  return elements
}
