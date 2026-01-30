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
  businessCapability: 'Capability',
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
