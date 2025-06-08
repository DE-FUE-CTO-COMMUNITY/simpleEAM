'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_LIBRARY_ELEMENTS } from '@/graphql/library'

interface IntegratedLibraryProps {
  excalidrawAPI: any
  onLibraryUpdate: (library: any) => void
}

const IntegratedLibrary: React.FC<IntegratedLibraryProps> = ({
  excalidrawAPI,
  onLibraryUpdate,
}) => {
  const [archimateLibrary, setArchimateLibrary] = useState<any>(null)

  const { data } = useQuery(GET_LIBRARY_ELEMENTS, {
    errorPolicy: 'all',
    pollInterval: 30000,
  })

  // Load original ArchiMate library
  useEffect(() => {
    const loadArchimateLibrary = async () => {
      try {
        const response = await fetch('/libraries/archimate-symbols.excalidrawlib')
        if (!response.ok) {
          throw new Error('Fehler beim Laden der ArchiMate-Bibliothek')
        }
        const library = await response.json()
        setArchimateLibrary(library)
      } catch {
        // Fehler beim Laden der ArchiMate-Bibliothek
      }
    }

    loadArchimateLibrary()
  }, [])

  // Create integrated library combining ArchiMate symbols with database elements
  const integratedLibrary = useMemo(() => {
    if (!archimateLibrary || !data) return null

    // Create template elements from ArchiMate library for each type
    const templates = {
      businessCapability: findArchimateTemplate(archimateLibrary, 'Capability'),
      application: findArchimateTemplate(archimateLibrary, 'Application Component'),
      dataObject: findArchimateTemplate(archimateLibrary, 'Business Object'),
      applicationInterface: findArchimateTemplate(archimateLibrary, 'Application Interface'),
    }

    const newLibraryItems: any[] = []

    // Add database elements as library items
    if (data.businessCapabilities) {
      data.businessCapabilities.forEach((capability: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          capability,
          'businessCapability',
          templates.businessCapability
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    if (data.applications) {
      data.applications.forEach((application: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          application,
          'application',
          templates.application
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    if (data.dataObjects) {
      data.dataObjects.forEach((dataObject: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          dataObject,
          'dataObject',
          templates.dataObject
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    if (data.applicationInterfaces) {
      data.applicationInterfaces.forEach((interface_: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          interface_,
          'applicationInterface',
          templates.applicationInterface
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    // Combine original ArchiMate library items with new database items
    // For Excalidraw 0.18, we need to pass just the libraryItems array
    const combinedLibraryItems = [...archimateLibrary.libraryItems, ...newLibraryItems]

    return combinedLibraryItems
  }, [archimateLibrary, data])

  // Update library when ready
  useEffect(() => {
    if (integratedLibrary && excalidrawAPI) {
      // Use the correct Excalidraw 0.18 API
      excalidrawAPI
        .updateLibrary({
          libraryItems: integratedLibrary,
          merge: false, // Replace existing library completely
          prompt: false, // Don't prompt user
          openLibraryMenu: true, // Open library menu to show the updated items
          defaultStatus: 'published', // Set default status to published
        })
        .then(() => {
          // Library erfolgreich aktualisiert
          // Also open the library sidebar to show the updated items
          excalidrawAPI.updateScene({
            appState: { openSidebar: 'library' },
          })

          onLibraryUpdate({ libraryItems: integratedLibrary })
        })
        .catch(() => {
          // Fehler beim Aktualisieren der Library
        })
    }
  }, [integratedLibrary, excalidrawAPI, onLibraryUpdate, archimateLibrary])

  return null // This component doesn't render anything
}

// Helper function to find ArchiMate template by name or type
function findArchimateTemplate(library: any, templateName: string) {
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

// Helper function to create library item from database element
function createLibraryItemFromDatabaseElement(dbElement: any, elementType: string, template: any) {
  if (!template) {
    console.warn(`⚠️ Kein Template gefunden für Element-Typ: ${elementType}`)
    return null
  }

  // Generate unique IDs for the elements - only client-side to avoid hydration issues
  const generateId = () => {
    if (typeof window !== 'undefined') {
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36).substr(-4)
    }
    return 'temp-' + Date.now().toString(36).substr(-6)
  }

  // Create a mapping from old IDs to new IDs to maintain relationships
  const idMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    idMapping.set(element.id, generateId())
  })

  // Generate new group IDs while preserving grouping relationships
  const groupIdMapping = new Map<string, string>()
  template.elements.forEach((element: any) => {
    if (element.groupIds && element.groupIds.length > 0) {
      element.groupIds.forEach((groupId: string) => {
        if (!groupIdMapping.has(groupId)) {
          groupIdMapping.set(groupId, generateId())
        }
      })
    }
  })

  // Clone template elements with new IDs and updated content
  const elements = template.elements.map((element: any, index: number) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateId()

    // Reset stroke color to black for database elements (override green ArchiMate template color)
    // Look for the main container rectangle (largest rectangle or rectangle with bound text elements)
    if (element.type === 'rectangle') {
      const isMainContainer =
        (element.boundElements && element.boundElements.length > 0) || // Has bound text elements
        (element.width > 100 && element.height > 50) || // Large enough to be main container
        index === 0 // Fallback: first rectangle

      if (isMainContainer) {
        newElement.strokeColor = '#1e1e1e'
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
      const availableWidth = containerRect ? containerRect.width - 20 : 180 // Default 180px if no container found

      // Get font size (with special handling for Application Interface)
      const fontSize = elementType === 'applicationInterface' ? 16 : element.fontSize || 20

      // Auto-wrap text to fit within available width
      const wrappedText = wrapTextToFitWidth(dbElement.name, availableWidth, fontSize)

      newElement.text = wrappedText
      newElement.originalText = wrappedText
      newElement.rawText = wrappedText
      // Set text alignment properties directly on the text element
      newElement.textAlign = 'center'
      newElement.verticalAlign = 'middle'

      // Set font size
      newElement.fontSize = fontSize
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

    // Preserve group IDs using the mapping to maintain grouping
    if (element.groupIds && element.groupIds.length > 0) {
      newElement.groupIds = element.groupIds.map(
        (groupId: string) => groupIdMapping.get(groupId) || generateId()
      )
    }

    // Handle bound elements with mapped IDs
    if (element.boundElements && element.boundElements.length > 0) {
      newElement.boundElements = element.boundElements.map((bound: any) => ({
        ...bound,
        id: idMapping.get(bound.id) || generateId(),
      }))
    }

    return newElement
  })

  // Create the library item according to Excalidraw 0.18 format
  const libraryItem = {
    status: 'published' as const,
    elements,
    id: `db-${elementType}-${dbElement.id}`,
    created: typeof window !== 'undefined' ? Date.now() : 0, // Avoid hydration mismatch
    name: dbElement.name, // This should show in the library
  }

  return libraryItem
}

// Helper function to wrap text to fit within a specific width
function wrapTextToFitWidth(text: string, maxWidth: number, fontSize: number = 20): string {
  // Approximate character width based on font size (rough estimation)
  // Most fonts have a character width of approximately 0.5-0.6 times the font size
  const avgCharWidth = fontSize * 0.55

  // Calculate maximum characters per line
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth)

  // If text fits in one line, return as is
  if (text.length <= maxCharsPerLine) {
    return text
  }

  // Split text into words (considering various separators)
  const words = text.split(/(\s+|-|_)/).filter(part => part.trim() || part === ' ')
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Skip pure whitespace unless it's a space between words
    if (word.trim() === '' && word !== ' ') continue

    // Check if adding this word would exceed the line length
    const testLine = currentLine + word

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      // If current line has content, push it and start new line
      if (currentLine.trim()) {
        lines.push(currentLine.trim())
        currentLine = word.trim() === '' ? '' : word
      } else {
        // If single word is too long, break it
        if (word.length > maxCharsPerLine) {
          // Break long word into chunks
          let remainingWord = word
          while (remainingWord.length > maxCharsPerLine) {
            lines.push(remainingWord.substring(0, maxCharsPerLine - 1) + '-')
            remainingWord = remainingWord.substring(maxCharsPerLine - 1)
          }
          currentLine = remainingWord
        } else {
          currentLine = word
        }
      }
    }
  }

  // Add the last line if it has content
  if (currentLine.trim()) {
    lines.push(currentLine.trim())
  }

  // Limit to maximum 3 lines to prevent boxes from becoming too tall
  if (lines.length > 3) {
    const lastLine = lines[2]
    const maxLastLineLength = Math.max(0, maxCharsPerLine - 3)
    lines[2] =
      lastLine.length > maxLastLineLength
        ? lastLine.substring(0, maxLastLineLength) + '...'
        : lastLine
    return lines.slice(0, 3).join('\n')
  }

  return lines.join('\n')
}

export default IntegratedLibrary
