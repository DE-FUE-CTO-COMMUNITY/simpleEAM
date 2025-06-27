import type { BusinessCapability } from '@/gql/generated'
import { generateNKeysBetween } from "fractional-indexing"

export interface CapabilityMapSettings {
  maxLevels: number
  includeApplications: boolean
  horizontalSpacing: number
  verticalSpacing: number
}

export interface ExcalidrawElement {
  id: string
  type: 'rectangle' | 'text'
  x: number
  y: number
  width: number
  height: number
  angle: number
  strokeColor: string
  backgroundColor: string
  fillStyle: string
  strokeWidth: number
  strokeStyle: string
  roughness: number
  opacity: number
  groupIds: string[]
  frameId: null
  index: string
  roundness: null
  seed: number
  version: number
  versionNonce: number
  isDeleted: boolean
  boundElements?: Array<{ id: string; type: string }>
  updated: number
  link: null
  locked: boolean
  customData?: {
    databaseId?: string
    elementType?: string
    originalElement?: any
    isFromDatabase?: boolean
    isMainElement?: boolean
    mainElementId?: string
  }
  // Text-specific properties
  text?: string
  fontSize?: number
  fontFamily?: number
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  containerId?: string
  originalText?: string
  autoResize?: boolean
  lineHeight?: number
  rawText?: string
}

// Interface for ArchiMate Library Templates
export interface LibraryTemplate {
  elements: ExcalidrawElement[]
}

// Interface for ArchiMate Library
export interface ArchiMateLibrary {
  libraryItems: Array<{
    name?: string
    elements: ExcalidrawElement[]
  }>
}

// Helper function to generate unique IDs (alternative to Excalidraw's generateId)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Helper function to generate random seed
export const generateSeed = (): number => {
  return Math.floor(Math.random() * 2 ** 31)
}

// Index generation for proper z-ordering using Excalidraw's fractional indexing
export const generateIndices = (count: number, after?: string, before?: string): string[] => {
  try {
    return generateNKeysBetween(after || null, before || null, count) as string[]
  } catch (error) {
    console.warn('Failed to generate fractional indices, falling back to simple generation:', error)
    // Fallback to simple sequential generation
    const indices: string[] = []
    for (let i = 0; i < count; i++) {
      indices.push(`a${i.toString().padStart(2, '0')}`)
    }
    return indices
  }
}

// Index provider for generating indices during element creation
let preGeneratedIndices: string[] = []
let currentIndexPosition = 0

export const initializeIndices = (count: number) => {
  preGeneratedIndices = generateIndices(count)
  currentIndexPosition = 0
}

export const getNextIndex = (): string => {
  if (currentIndexPosition >= preGeneratedIndices.length) {
    // Generate more indices if needed
    const additionalIndices = generateIndices(10, preGeneratedIndices[preGeneratedIndices.length - 1])
    preGeneratedIndices.push(...additionalIndices)
  }
  return preGeneratedIndices[currentIndexPosition++]
}

// Helper function to find ArchiMate template by name
export function findArchimateTemplate(library: ArchiMateLibrary, templateName: string): LibraryTemplate | null {
  // First try to find by name property
  let item = library.libraryItems.find((item: any) => item.name === templateName)

  // If not found, try to find by text content
  if (!item) {
    item = library.libraryItems.find((item: any) =>
      item.elements.some(
        (element: any) =>
          element.type === 'text' && element.text && element.text.includes(templateName)
      )
    )
  }

  // If not found, try alternative names
  if (!item) {
    const alternatives = {
      Capability: ['Business Function', 'Business Capability', 'Business'],
      'Application Component': ['Application', 'App Component'],
      'Business Object': ['Data Object', 'Data', 'Object'],
      'Application Interface': ['Interface', 'API'],
    }

    const alts = alternatives[templateName as keyof typeof alternatives] || []
    for (const alt of alts) {
      // Try by name first
      item = library.libraryItems.find((libItem: any) => libItem.name === alt)
      if (item) break

      // Then try by text content
      item = library.libraryItems.find((libItem: any) =>
        libItem.elements.some(
          (element: any) => element.type === 'text' && element.text && element.text.includes(alt)
        )
      )
      if (item) break
    }
  }

  // If still not found, use the first rectangular item as fallback
  if (!item) {
    item = library.libraryItems.find((libItem: any) =>
      libItem.elements.some((element: any) => element.type === 'rectangle')
    )
  }

  return item ? { elements: item.elements } : null
}

// Helper function to wrap text to fit container width
export function wrapTextToFitWidth(text: string, maxWidth: number, fontSize: number = 20): string {
  const avgCharWidth = fontSize * 0.6
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth)
  
  if (text.length <= maxCharsPerLine) {
    return text
  }
  
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
      }
      currentLine = word
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines.join('\n')
}

// Helper function to create library item from database element using template
export function createLibraryElementFromTemplate(
  dbElement: BusinessCapability,
  elementType: string,
  template: LibraryTemplate,
  targetX: number,
  targetY: number,
  groupId?: string
): ExcalidrawElement[] {
  if (!template) {
    console.warn(`⚠️ Kein Template gefunden für Element-Typ: ${elementType}`)
    return []
  }

  // Create a mapping from old IDs to new IDs to maintain relationships
  const idMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    idMapping.set(element.id, generateId())
  })

  // Find the main container rectangle from template
  const mainRect = template.elements.find(el => 
    el.type === 'rectangle' && 
    (el.boundElements?.length || 0) > 0
  ) || template.elements.find(el => el.type === 'rectangle')

  if (!mainRect) {
    console.warn('Kein Hauptrechteck im Template gefunden')
    return []
  }

  // Calculate offset to position template at target coordinates
  const offsetX = targetX - mainRect.x
  const offsetY = targetY - mainRect.y

  // Clone template elements with new IDs and updated content
  const elements = template.elements.map((element: any) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateId()

    // Apply position offset
    newElement.x = element.x + offsetX
    newElement.y = element.y + offsetY

    // Add to group if specified
    if (groupId) {
      newElement.groupIds = [groupId]
    }

    // Update index
    newElement.index = getNextIndex()
    
    // Update timestamps and version
    newElement.updated = Date.now()
    newElement.version = 1
    newElement.versionNonce = generateSeed()
    newElement.seed = generateSeed()

    // Reset stroke color to black for database elements
    if (element.type === 'rectangle') {
      newElement.strokeColor = '#1e1e1e'
    }

    // For text elements, replace the text with database element name
    if (element.type === 'text') {
      // Update text content
      newElement.text = dbElement.name
      newElement.originalText = dbElement.name
      newElement.rawText = dbElement.name

      // Update container binding
      const containerElement = template.elements.find(
        (el: any) => el.boundElements?.some((bound: any) => bound.id === element.id)
      )

      if (containerElement) {
        const newContainerId = idMapping.get(containerElement.id)
        if (newContainerId) {
          newElement.containerId = newContainerId
        }
      }
    }

    // Update bound elements references
    if (element.boundElements) {
      newElement.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || bound.id
      }))
    }

    // Add custom data
    newElement.customData = {
      databaseId: dbElement.id,
      elementType: elementType,
      originalElement: dbElement,
      isFromDatabase: true,
      isMainElement: element.type === 'rectangle' && element === mainRect,
    }

    return newElement
  })

  return elements
}

// Helper function to find top-level capabilities (no parents)
export const findTopLevelCapabilities = (capabilities: BusinessCapability[]): BusinessCapability[] => {
  return capabilities.filter(cap => !cap.parents || cap.parents.length === 0)
}

// Helper function to find children of a capability
export const findChildCapabilities = (
  parentId: string,
  capabilities: BusinessCapability[]
): BusinessCapability[] => {
  return capabilities.filter(cap => 
    cap.parents && cap.parents.some(parent => parent.id === parentId)
  )
}

// Load ArchiMate library
export async function loadArchimateLibrary(): Promise<ArchiMateLibrary | null> {
  try {
    const response = await fetch('/libraries/archimate-symbols.excalidrawlib')
    if (!response.ok) {
      throw new Error('Fehler beim Laden der ArchiMate-Bibliothek')
    }
    const library = await response.json()
    return library
  } catch (error) {
    console.error('Fehler beim Laden der ArchiMate-Bibliothek:', error)
    return null
  }
}

// Main function to generate capability map with ArchiMate symbols
export const generateCapabilityMapWithLibrary = async (
  capabilities: BusinessCapability[],
  settings: CapabilityMapSettings
): Promise<ExcalidrawElement[]> => {
  const elements: ExcalidrawElement[] = []
  
  // Load ArchiMate library
  const archimateLibrary = await loadArchimateLibrary()
  if (!archimateLibrary) {
    console.warn('ArchiMate-Bibliothek konnte nicht geladen werden, verwende einfache Rechtecke')
    // Fallback to simple rectangles (call original function)
    return []
  }

  // Get templates from library
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

  // Calculate total number of elements needed for index generation
  let totalElements = 0
  topLevelCapabilities.forEach(capability => {
    totalElements += 5 // Rough estimate per capability (template elements)
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)
      totalElements += childrenToShow.length * 5 // Each child has template elements
      
      if (settings.includeApplications) {
        childrenToShow.forEach(child => {
          if (child.supportedByApplications) {
            totalElements += Math.min(child.supportedByApplications.length, 3) * 5 // max 3 apps per child
          }
        })
      }
    }
  })

  // Initialize indices for all elements
  initializeIndices(totalElements)

  const startX = 100
  const startY = 100
  const baseWidth = 250
  const baseHeight = 80

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + (index * (baseWidth + settings.horizontalSpacing))
    const y = startY
    const capabilityGroupId = generateId()

    // Calculate height based on children if we're showing multiple levels
    let containerHeight = baseHeight
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)
      containerHeight = Math.max(baseHeight, (childrenToShow.length + 1) * (baseHeight + 20) + 40)
    }

    // Create main capability using ArchiMate template
    const capabilityElements = createLibraryElementFromTemplate(
      capability,
      'businessCapability',
      capabilityTemplate,
      x,
      y,
      capabilityGroupId
    )

    // Update container height if needed
    if (capabilityElements.length > 0) {
      const mainRect = capabilityElements.find(el => el.type === 'rectangle')
      if (mainRect && containerHeight > baseHeight) {
        mainRect.height = containerHeight
      }
    }

    elements.push(...capabilityElements)

    // Generate child capabilities if maxLevels > 1
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)

      childrenToShow.forEach((child, childIndex) => {
        const childX = x + 10
        const childY = y + baseHeight + 20 + (childIndex * (60 + 10))
        const childWidth = baseWidth - 20

        // Create child capability using ArchiMate template
        const childElements = createLibraryElementFromTemplate(
          child,
          'businessCapability',
          capabilityTemplate,
          childX,
          childY,
          capabilityGroupId
        )

        // Adjust size for child elements
        if (childElements.length > 0) {
          const childRect = childElements.find(el => el.type === 'rectangle')
          if (childRect) {
            childRect.width = childWidth
            childRect.height = 50
          }
          
          const childText = childElements.find(el => el.type === 'text')
          if (childText) {
            childText.fontSize = 16
          }
        }

        elements.push(...childElements)

        // Add applications if enabled and template available
        if (settings.includeApplications && child.supportedByApplications && child.supportedByApplications.length > 0 && applicationTemplate) {
          child.supportedByApplications.slice(0, 3).forEach((app, appIndex) => {
            const appX = childX + childWidth + 10
            const appY = childY + (appIndex * 30)

            // Create application using ArchiMate template
            const appElements = createLibraryElementFromTemplate(
              app as any, // Cast since Application might have different interface
              'application',
              applicationTemplate,
              appX,
              appY,
              capabilityGroupId
            )

            // Adjust size for application elements
            if (appElements.length > 0) {
              const appRect = appElements.find(el => el.type === 'rectangle')
              if (appRect) {
                appRect.width = 120
                appRect.height = 25
              }
              
              const appText = appElements.find(el => el.type === 'text')
              if (appText) {
                appText.fontSize = 12
              }
            }

            elements.push(...appElements)
          })
        }
      })
    }
  })

  console.log(`Generated ${elements.length} elements for capability map with ArchiMate symbols`)
  return elements
}

// Fallback function that uses simple rectangles (original implementation)
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

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + (index * (baseWidth + settings.horizontalSpacing))
    const y = startY

    // Create main capability container
    const mainElementId = generateId()
    const textElementId = generateId()
    const capabilityGroupId = generateId()

    // Calculate height based on children if we're showing multiple levels
    let containerHeight = baseHeight
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)
      containerHeight = Math.max(baseHeight, (childrenToShow.length + 1) * (baseHeight + 20) + 40)
    }

    // Main capability rectangle
    const mainRect: ExcalidrawElement = {
      id: mainElementId,
      type: 'rectangle',
      x,
      y,
      width: baseWidth,
      height: containerHeight,
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

    // Main capability text
    const textWidth = Math.max(capability.name.length * 12, 50)
    const textX = x + (baseWidth - textWidth) / 2
    const textY = y + 5

    const mainText: ExcalidrawElement = {
      id: textElementId,
      type: 'text',
      x: textX,
      y: textY,
      width: textWidth,
      height: 25,
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
      boundElements: [],
      updated: Date.now(),
      link: null,
      locked: false,
      text: capability.name,
      fontSize: 20,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'top',
      containerId: mainElementId,
      originalText: capability.name,
      autoResize: true,
      lineHeight: 1.25,
      rawText: capability.name,
      customData: {
        isFromDatabase: true,
        isMainElement: false,
        mainElementId: mainElementId,
      },
    }

    elements.push(mainRect, mainText)

    // Generate child capabilities if maxLevels > 1
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)

      childrenToShow.forEach((child, childIndex) => {
        const childX = x + 10
        const childY = y + baseHeight + 20 + (childIndex * (50 + 10))
        const childWidth = baseWidth - 20
        const childHeight = 40

        const childRectId = generateId()
        const childTextId = generateId()

        // Child capability rectangle
        const childRect: ExcalidrawElement = {
          id: childRectId,
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
          groupIds: [capabilityGroupId],
          frameId: null,
          index: getNextIndex(),
          roundness: null,
          seed: generateSeed(),
          version: 1,
          versionNonce: generateSeed(),
          isDeleted: false,
          boundElements: [{ id: childTextId, type: 'text' }],
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

        // Child capability text
        const childTextWidth = Math.max(child.name.length * 9.6, 40)
        const childTextX = childX + (childWidth - childTextWidth) / 2
        const childTextY = childY + 5

        const childText: ExcalidrawElement = {
          id: childTextId,
          type: 'text',
          x: childTextX,
          y: childTextY,
          width: childTextWidth,
          height: 20,
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
          boundElements: [],
          updated: Date.now(),
          link: null,
          locked: false,
          text: child.name,
          fontSize: 16,
          fontFamily: 1,
          textAlign: 'center',
          verticalAlign: 'top',
          containerId: childRectId,
          originalText: child.name,
          autoResize: true,
          lineHeight: 1.25,
          rawText: child.name,
          customData: {
            isFromDatabase: true,
            isMainElement: false,
            mainElementId: childRectId,
          },
        }

        elements.push(childRect, childText)

        // Add applications if enabled
        if (settings.includeApplications && child.supportedByApplications && child.supportedByApplications.length > 0) {
          child.supportedByApplications.slice(0, 3).forEach((app, appIndex) => {
            const appX = childX + 5
            const appY = childY + childHeight + 5 + (appIndex * 15)
            const appTextId = generateId()

            const appText: ExcalidrawElement = {
              id: appTextId,
              type: 'text',
              x: appX,
              y: appY,
              width: Math.max(app.name.length * 7.2, 30),
              height: 15,
              angle: 0,
              strokeColor: '#666666',
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
              boundElements: [],
              updated: Date.now(),
              link: null,
              locked: false,
              text: `• ${app.name}`,
              fontSize: 12,
              fontFamily: 1,
              textAlign: 'left',
              verticalAlign: 'top',
              originalText: `• ${app.name}`,
              autoResize: true,
              lineHeight: 1.25,
              rawText: `• ${app.name}`,
              customData: {
                databaseId: app.id,
                elementType: 'application',
                originalElement: app,
                isFromDatabase: true,
                isMainElement: false,
              },
            }

            elements.push(appText)
          })
        }
      })
    }
  })

  console.log(`Generated ${elements.length} elements for capability map (fallback)`)
  return elements
}
