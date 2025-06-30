// Shared utility functions for ArchiMate library integration
// Extracted from IntegratedLibrary.tsx for reuse across the application

export interface LibraryTemplate {
  elements: any[]
}

export interface ArchiMateLibrary {
  libraryItems: any[]
}

// Helper function to find ArchiMate template by name or type
export function findArchimateTemplate(
  library: ArchiMateLibrary,
  templateName: string
): LibraryTemplate | null {
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

  return item || null
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

// Helper function to calculate centered text position
export function calculateCenteredTextPosition(text: string, containerRect: any, fontSize: number) {
  const lineCount = (text.match(/\n/g) || []).length + 1
  const textHeight = lineCount * fontSize * 1.2
  const textWidth = Math.max(...text.split('\n').map(line => line.length * fontSize * 0.6))

  return {
    x: containerRect.x + (containerRect.width - textWidth) / 2,
    y: containerRect.y + (containerRect.height - textHeight) / 2,
    width: textWidth,
    height: textHeight,
  }
}

// Function to load ArchiMate library
export async function loadArchimateLibrary(): Promise<ArchiMateLibrary | null> {
  try {
    const response = await fetch('/libraries/archimate-symbols.excalidrawlib')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const library = await response.json()

    console.log('📚 ArchiMate library loaded successfully')
    return library
  } catch (error) {
    console.warn('Fehler beim Laden der ArchiMate-Bibliothek:', error)
    return null
  }
}
