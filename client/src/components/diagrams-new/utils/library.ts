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
  dataObject: 'Data Object',
  applicationInterface: 'Application Interface',
  infrastructure: 'Infrastructure',
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
