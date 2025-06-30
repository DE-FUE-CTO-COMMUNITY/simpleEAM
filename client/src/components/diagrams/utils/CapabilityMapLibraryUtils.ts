import type { BusinessCapability } from '@/gql/generated'
import { generateNKeysBetween } from 'fractional-indexing'
import {
  findArchimateTemplate,
  wrapTextToFitWidth,
  loadArchimateLibrary,
  type LibraryTemplate,
} from './archimateLibraryUtils'
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

  // Since the library is now normalized to start at (0,0),
  // we can directly position the template at the target coordinates
  const offsetX = targetX
  const offsetY = targetY

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
          }
        }
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

// Function to load ArchiMate library (this should match the implementation from IntegratedLibrary)
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

  // Get templates from library using the proven helper function
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
    totalElements += capabilityTemplate.elements.length // Actual template elements count
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)
      totalElements += childrenToShow.length * capabilityTemplate.elements.length

      if (settings.includeApplications && applicationTemplate) {
        childrenToShow.forEach(child => {
          if (child.supportedByApplications) {
            totalElements +=
              Math.min(child.supportedByApplications.length, 3) *
              applicationTemplate.elements.length
          }
        })
      }
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

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + index * (baseWidth + settings.horizontalSpacing)
    const y = startY
    const capabilityGroupId = generateId()

    // Calculate container height based on children if we're showing multiple levels
    let containerHeight = baseHeight
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)

      // Calculate needed height for children (each child uses template height + spacing)
      const childSpacing = 10
      const childAreaHeight = childrenToShow.length * (baseHeight + childSpacing)
      containerHeight = Math.max(baseHeight, baseHeight + childAreaHeight + 40)
    }

    // Create main capability using the refactored helper function
    const capabilityElements = createCapabilityElementsFromTemplate(
      capability,
      'businessCapability',
      capabilityTemplate,
      x,
      y,
      capabilityGroupId,
      {
        height: containerHeight,
        backgroundColor: '#ffffff',
      }
    )

    elements.push(...capabilityElements)

    // Generate child capabilities if maxLevels > 1
    if (settings.maxLevels > 1) {
      const children = findChildCapabilities(capability.id, capabilities)
      const childrenToShow = children.slice(0, settings.maxLevels > 2 ? 10 : children.length)

      childrenToShow.forEach((child, childIndex) => {
        const childX = x + 10
        const childY = y + baseHeight + 20 + childIndex * (baseHeight + 10)

        // Create child capability using the refactored helper function
        const childElements = createCapabilityElementsFromTemplate(
          child,
          'businessCapability',
          capabilityTemplate,
          childX,
          childY,
          capabilityGroupId,
          {
            width: baseWidth - 20, // Fit within parent with padding
            height: Math.min(60, baseHeight), // Limit height for child capabilities
            fontSize: 14,
          }
        )

        elements.push(...childElements)

        // Add applications if enabled and template available
        if (
          settings.includeApplications &&
          applicationTemplate &&
          child.supportedByApplications &&
          child.supportedByApplications.length > 0
        ) {
          const appsToShow = child.supportedByApplications.slice(0, 3)

          appsToShow.forEach((app, appIndex) => {
            const appX = childX + (baseWidth - 20) + 10
            const appY = childY + appIndex * 45

            // Applications erhalten KEINE zusätzliche Gruppierung - nur ihre interne ArchiMate-Gruppierung
            const appElements = createCapabilityElementsFromTemplate(
              app as any, // Cast to BusinessCapability for compatibility
              'application',
              applicationTemplate,
              appX,
              appY,
              undefined, // WICHTIG: Keine externe Gruppierung für Applications
              {
                width: Math.min(160, baseWidth - 40),
                height: 40,
                fontSize: 12,
              }
            )

            elements.push(...appElements)
          })
        }
      })
    }
  })

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

  // Initialize indices for this fallback function
  initializeIndices(100)

  // Generate top-level capabilities horizontally
  topLevelCapabilities.forEach((capability, index) => {
    const x = startX + index * (baseWidth + settings.horizontalSpacing)
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
        const childY = y + baseHeight + 20 + childIndex * (50 + 10)
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
        if (
          settings.includeApplications &&
          child.supportedByApplications &&
          child.supportedByApplications.length > 0
        ) {
          child.supportedByApplications.slice(0, 3).forEach((app, appIndex) => {
            const appX = childX + 5
            const appY = childY + childHeight + 5 + appIndex * 15
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

  return elements
}
