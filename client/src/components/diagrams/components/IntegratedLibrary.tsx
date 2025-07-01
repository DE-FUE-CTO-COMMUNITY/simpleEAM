'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_LIBRARY_ELEMENTS } from '@/graphql/library'
import { wrapTextToFitWidth, calculateCenteredTextPosition } from '../utils/textContainerUtils'
import { findArchimateTemplate, loadArchimateLibrary } from '../utils/archimateLibraryUtils'

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
    const loadLibrary = async () => {
      try {
        const library = await loadArchimateLibrary()
        setArchimateLibrary(library)
      } catch {
        // Fehler beim Laden der ArchiMate-Bibliothek
      }
    }

    loadLibrary()
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

    // Add database elements as library items (sorted alphabetically within each type)
    if (data.businessCapabilities) {
      // Sort business capabilities alphabetically by name
      const sortedCapabilities = [...data.businessCapabilities].sort((a: any, b: any) =>
        a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
      )

      sortedCapabilities.forEach((capability: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          capability,
          'businessCapability',
          templates.businessCapability
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    if (data.applications) {
      // Sort applications alphabetically by name
      const sortedApplications = [...data.applications].sort((a: any, b: any) =>
        a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
      )

      sortedApplications.forEach((application: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          application,
          'application',
          templates.application
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    if (data.dataObjects) {
      // Sort data objects alphabetically by name
      const sortedDataObjects = [...data.dataObjects].sort((a: any, b: any) =>
        a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
      )

      sortedDataObjects.forEach((dataObject: any) => {
        const libraryItem = createLibraryItemFromDatabaseElement(
          dataObject,
          'dataObject',
          templates.dataObject
        )
        if (libraryItem) newLibraryItems.push(libraryItem)
      })
    }

    if (data.applicationInterfaces) {
      // Sort application interfaces alphabetically by name
      const sortedInterfaces = [...data.applicationInterfaces].sort((a: any, b: any) =>
        a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
      )

      sortedInterfaces.forEach((interface_: any) => {
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

            // Verwende die gemeinsame calculateCenteredTextPosition Funktion für konsistente Zentrierung
            const centeredPosition = calculateCenteredTextPosition(
              wrappedText,
              containerRect,
              fontSize
            )

            // Setze Position und Dimensionen aus der gemeinsamen Funktion
            newElement.x = centeredPosition.x
            newElement.y = centeredPosition.y
            newElement.width = centeredPosition.width
            newElement.height = centeredPosition.height
          }
        }
      } else {
        // Fallback für Texte ohne Container: Verwende geschätzte Dimensionen
        const lineCount = (wrappedText.match(/\n/g) || []).length + 1
        const avgLineWidth = Math.max(...wrappedText.split('\n').map(line => line.length))

        const estimatedWidth = Math.min(avgLineWidth * fontSize * 0.6, availableWidth)
        const estimatedHeight = lineCount * fontSize * 1.2

        newElement.width = element.width && element.width > 0 ? element.width : estimatedWidth
        newElement.height = element.height && element.height > 0 ? element.height : estimatedHeight
      }
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

export default IntegratedLibrary
