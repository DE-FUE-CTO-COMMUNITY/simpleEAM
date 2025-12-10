import type { ElementType } from '@/graphql/library'
import type { ExcalidrawLibraryItem } from './library'
import { calculateCenteredTextPosition, wrapTextToFitWidth } from './library'

const DEFAULT_FONT_SIZE = 20
const TEXT_PADDING = 20

export type ArchitectureElementVerticalAlign = 'top' | 'middle'

interface ArchitectureElementMetadata {
  elementType: ElementType
  referenceId: string
  referenceType: ElementType
  referenceName: string
  verticalAlign: ArchitectureElementVerticalAlign
}

export interface CreateLibraryItemFromDatabaseElementParams<
  T extends { id: string; name: string },
> {
  template: ExcalidrawLibraryItem | null
  element: T
  elementType: ElementType
  defaultFontFamily: number
  verticalAlign?: ArchitectureElementVerticalAlign
}

export function createLibraryItemFromDatabaseElement<T extends { id: string; name: string }>(
  params: CreateLibraryItemFromDatabaseElementParams<T>
): ExcalidrawLibraryItem | null {
  const { template, element, elementType, defaultFontFamily, verticalAlign = 'middle' } = params
  if (!template?.elements?.length) {
    return null
  }

  const idMapping = new Map<string, string>()
  template.elements.forEach(templateElement => {
    idMapping.set(templateElement.id, generateElementId())
  })

  const groupIdMapping = new Map<string, string>()
  template.elements.forEach(templateElement => {
    templateElement.groupIds?.forEach((groupId: string) => {
      if (!groupIdMapping.has(groupId)) {
        groupIdMapping.set(groupId, generateElementId())
      }
    })
  })

  const templateById = new Map(template.elements.map(el => [el.id, el]))
  const cloneByOriginalId = new Map<string, any>()

  const clonedElements = template.elements.map(original => {
    const clone = deepClone(original)
    clone.id = idMapping.get(original.id) ?? generateElementId()
    if (Array.isArray(original.groupIds)) {
      clone.groupIds = original.groupIds.map(
        (groupId: string) => groupIdMapping.get(groupId) ?? groupId
      )
    }
    if (Array.isArray(original.boundElements)) {
      clone.boundElements = original.boundElements.map((bound: { id: string; type: string }) => ({
        ...bound,
        id: idMapping.get(bound.id) ?? bound.id,
      }))
    }
    if (original.containerId) {
      clone.containerId = idMapping.get(original.containerId) ?? original.containerId
    }
    cloneByOriginalId.set(original.id, clone)
    return clone
  })

  const metadata: ArchitectureElementMetadata = {
    elementType,
    referenceId: element.id,
    referenceType: elementType,
    referenceName: element.name,
    verticalAlign,
  }

  applyMetadataToContainers(template.elements, cloneByOriginalId, templateById, metadata)
  applyMetadataToTexts({
    templateElements: template.elements,
    cloneByOriginalId,
    metadata,
    defaultFontFamily,
  })
  markRemainingShapes(cloneByOriginalId, metadata)

  return {
    id: `db-${elementType}-${element.id}`,
    status: 'published',
    name: element.name,
    elements: clonedElements,
  }
}

function applyMetadataToContainers(
  templateElements: any[],
  cloneByOriginalId: Map<string, any>,
  templateById: Map<string, any>,
  metadata: ArchitectureElementMetadata
) {
  const candidates = templateElements.filter(element => isContainerRectangle(element, templateById))

  const targetRectangles = candidates.length
    ? candidates
    : templateElements.filter(element => element.type === 'rectangle')

  // Mark the first rectangle as the main element
  let isFirst = true
  targetRectangles.forEach(rectangle => {
    const clone = cloneByOriginalId.get(rectangle.id)
    if (!clone) {
      return
    }
    clone.strokeColor = '#1e1e1e'
    
    if (isFirst) {
      // Main container gets full metadata (old format for compatibility)
      clone.customData = {
        isFromDatabase: true,
        databaseId: metadata.referenceId,
        elementType: metadata.elementType,
        elementName: metadata.referenceName,
        isMainElement: true,
      }
      isFirst = false
    } else {
      // Other elements just reference the main element
      clone.customData = {
        isFromDatabase: true,
        isMainElement: false,
      }
    }
  })
}

function applyMetadataToTexts({
  templateElements,
  cloneByOriginalId,
  metadata,
  defaultFontFamily,
}: {
  templateElements: any[]
  cloneByOriginalId: Map<string, any>
  metadata: ArchitectureElementMetadata
  defaultFontFamily: number
}) {
  templateElements.forEach(original => {
    if (original.type !== 'text') {
      return
    }

    const clone = cloneByOriginalId.get(original.id)
    if (!clone) {
      return
    }

    const templateContainer = findContainerForText(templateElements, original.id)
    const containerClone = templateContainer
      ? cloneByOriginalId.get(templateContainer.id)
      : undefined

    const fontSize = clone.fontSize ?? DEFAULT_FONT_SIZE
    const availableWidth = containerClone
      ? Math.max(20, (containerClone.width ?? 0) - TEXT_PADDING)
      : (clone.width ?? 180)
    const wrappedText = wrapTextToFitWidth(metadata.referenceName ?? '', availableWidth, fontSize)

    clone.text = wrappedText
    clone.rawText = wrappedText
    clone.originalText = wrappedText
    clone.fontFamily = defaultFontFamily
    clone.textAlign = clone.textAlign || 'center'
    clone.verticalAlign = metadata.verticalAlign

    if (containerClone) {
      const centered = calculateCenteredTextPosition(wrappedText, containerClone, fontSize)
      clone.x = centered.x
      clone.y = metadata.verticalAlign === 'top' ? containerClone.y + 10 : centered.y
      clone.width = centered.width
      clone.height = centered.height
      clone.baseline = clone.y + clone.height
      clone.containerId = containerClone.id
    }

    // Text elements just reference that they're from database
    clone.customData = {
      isFromDatabase: true,
      isMainElement: false,
    }
  })
}

function markRemainingShapes(
  cloneByOriginalId: Map<string, any>,
  metadata: ArchitectureElementMetadata
) {
  cloneByOriginalId.forEach(clone => {
    if (clone.customData) {
      return // Already has customData
    }
    // Icon elements just reference that they're from database
    clone.customData = {
      isFromDatabase: true,
      isMainElement: false,
    }
  })
}

function isContainerRectangle(element: any, templateById: Map<string, any>) {
  if (element.type !== 'rectangle' || !Array.isArray(element.boundElements)) {
    return false
  }
  return element.boundElements.some(bound => templateById.get(bound.id)?.type === 'text')
}

function findContainerForText(templateElements: any[], textId: string) {
  return templateElements.find(
    element =>
      element.type === 'rectangle' &&
      element.boundElements?.some((bound: { id: string }) => bound.id === textId)
  )
}

function deepClone(element: any) {
  return JSON.parse(JSON.stringify(element))
}

function generateElementId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2, 11)}`
}
