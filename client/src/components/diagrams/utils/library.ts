import type { ElementType } from '@/graphql/library'

export interface ExcalidrawLibraryItem {
  id: string
  status?: 'unpublished' | 'published'
  name?: string
  elements: any[]
  [key: string]: any
}

export interface ArchiMateLibrary {
  libraryItems: ExcalidrawLibraryItem[]
  [key: string]: any
}

export const TEMPLATE_NAME_BY_TYPE: Partial<Record<ElementType, string>> = {
  capability: 'Capability',
  application: 'Application Component',
  dataObject: 'Business Object',
  applicationInterface: 'Application Interface',
  infrastructure: 'Infrastruktur',
  aiComponent: 'AI Component',
}

export const EXCALIDRAW_LIBRARY_MIME = 'application/vnd.excalidrawlib+json'
const EXCALIDRAW_SOURCE = 'simple-eam'

export function buildLibraryDropPayload(libraryItem: ExcalidrawLibraryItem) {
  return JSON.stringify({
    type: 'excalidrawlib',
    version: 2,
    source: EXCALIDRAW_SOURCE,
    libraryItems: [libraryItem],
  })
}

export async function loadArchimateLibrary(): Promise<ArchiMateLibrary | null> {
  try {
    const response = await fetch('/libraries/archimate-symbols.excalidrawlib')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (await response.json()) as ArchiMateLibrary
  } catch (error) {
    console.warn('Failed to load ArchiMate library:', error)
    return null
  }
}

export function findArchimateTemplate(
  library: ArchiMateLibrary | null,
  templateName: string
): ExcalidrawLibraryItem | null {
  if (!library?.libraryItems?.length) {
    return null
  }

  let item = library.libraryItems.find(libItem => libItem.name === templateName)

  if (!item) {
    item = library.libraryItems.find(libItem =>
      libItem.elements?.some(
        (element: any) => element.type === 'text' && element.text?.includes(templateName)
      )
    )
  }

  if (!item) {
    const alternatives: Record<string, string[]> = {
      Capability: ['Business Function', 'Business Capability', 'Business'],
      'Application Component': [
        'Application',
        'App Component',
        'ApplicationComponent',
        'App',
        'Software Component',
        'System Component',
      ],
      'Business Object': ['Data Object', 'Data', 'Object'],
      'Application Interface': ['Interface', 'API'],
      Infrastruktur: ['Infrastructure', 'Server', 'Device', 'Technology Node', 'System Software', 'Node'],
    }

    const altNames = alternatives[templateName]
    if (altNames) {
      for (const alt of altNames) {
        item = library.libraryItems.find(libItem => libItem.name === alt)
        if (item) break
        item = library.libraryItems.find(libItem =>
          libItem.elements?.some(
            (element: any) => element.type === 'text' && element.text?.includes(alt)
          )
        )
        if (item) break
      }
    }
  }

  if (!item) {
    item = library.libraryItems.find(libItem =>
      libItem.elements?.some((element: any) => element.type === 'rectangle')
    )
  }

  return item || null
}

export function normalizeTemplateFonts(
  library: ArchiMateLibrary,
  targetFontFamily: number
): ArchiMateLibrary {
  return {
    ...library,
    libraryItems: library.libraryItems.map(item => {
      if (!Array.isArray(item.elements)) {
        return item
      }
      const patchedElements = item.elements.map(element => {
        if (element?.type === 'text' && element.fontFamily !== targetFontFamily) {
          return {
            ...element,
            fontFamily: targetFontFamily,
          }
        }
        return element
      })
      return {
        ...item,
        elements: patchedElements,
      }
    }),
  }
}

export interface CreateLibraryItemParams<T extends { id: string; name: string }> {
  template: ExcalidrawLibraryItem | null
  element: T
  elementType: ElementType
  defaultFontFamily: number
}

export function createLibraryItemFromDatabaseElement<T extends { id: string; name: string }>(
  params: CreateLibraryItemParams<T>
): ExcalidrawLibraryItem | null {
  const { template, element, elementType, defaultFontFamily } = params
  if (!template?.elements?.length) {
    return null
  }

  const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `id-${Math.random().toString(36).slice(2, 11)}`
  }

  const idMapping = new Map<string, string>()
  template.elements.forEach(el => {
    idMapping.set(el.id, generateId())
  })

  const groupIdMapping = new Map<string, string>()
  template.elements.forEach(el => {
    el.groupIds?.forEach((groupId: string) => {
      if (!groupIdMapping.has(groupId)) {
        groupIdMapping.set(groupId, generateId())
      }
    })
  })

  const clonedElements = template.elements.map((templateElement, index) => {
    const clone = JSON.parse(JSON.stringify(templateElement))
    clone.id = idMapping.get(templateElement.id) ?? generateId()

    if (Array.isArray(clone.groupIds)) {
      clone.groupIds = clone.groupIds.map((groupId: string) => groupIdMapping.get(groupId) ?? groupId)
    }

    if (Array.isArray(clone.boundElements)) {
      clone.boundElements = clone.boundElements.map((bound: { id: string; type: string }) => ({
        ...bound,
        id: idMapping.get(bound.id) ?? bound.id,
      }))
    }

    if (clone.containerId) {
      clone.containerId = idMapping.get(clone.containerId) ?? clone.containerId
    }

    if (index === 0) {
      clone.customData = {
        ...(clone.customData ?? {}),
        elementType,
        referenceId: element.id,
        referenceType: elementType,
        referenceName: element.name,
      }
      clone.strokeColor = '#1e1e1e'
    }

    if (clone.type === 'text') {
      const containerRect = template.elements.find(
        originalElement =>
          originalElement.type === 'rectangle' &&
          originalElement.boundElements?.some((bound: { id: string }) => bound.id === templateElement.id)
      )

      const availableWidth = containerRect ? containerRect.width - 20 : clone.width ?? 180
      const fontSize = clone.fontSize ?? 20
      const wrappedText = wrapTextToFitWidth(element.name ?? '', availableWidth, fontSize)

      clone.text = wrappedText
      clone.originalText = wrappedText
      clone.rawText = wrappedText
      clone.fontFamily = defaultFontFamily
      clone.textAlign = clone.textAlign || 'center'
      clone.verticalAlign = clone.verticalAlign || 'middle'

      if (containerRect) {
        const centered = calculateCenteredTextPosition(wrappedText, containerRect, fontSize)
        clone.x = centered.x
        clone.y = centered.y
        clone.width = centered.width
        clone.height = centered.height
        const mappedContainerId = idMapping.get(containerRect.id)
        if (mappedContainerId) {
          clone.containerId = mappedContainerId
        }
      }
    }

    return clone
  })

  return {
    id: `db-${elementType}-${element.id}`,
    status: 'published',
    name: element.name,
    elements: clonedElements,
  }
}

export function wrapTextToFitWidth(text: string, maxWidth: number, fontSize: number = 20): string {
  const avgCharWidth = fontSize * 0.6
  const maxCharsPerLine = Math.max(1, Math.floor(maxWidth / avgCharWidth))

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

export function calculateCenteredTextPosition(text: string, containerRect: any, fontSize: number) {
  const lineCount = (text.match(/\n/g) || []).length + 1
  const textHeight = lineCount * fontSize * 1.2
  const longestLineLength = Math.max(...text.split('\n').map(line => line.length))
  const textWidth = longestLineLength * fontSize * 0.6

  return {
    x: containerRect.x + (containerRect.width - textWidth) / 2,
    y: containerRect.y + (containerRect.height - textHeight) / 2,
    width: textWidth,
    height: textHeight,
  }
}
