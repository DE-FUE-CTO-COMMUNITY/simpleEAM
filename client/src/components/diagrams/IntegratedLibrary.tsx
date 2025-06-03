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

  // Generate unique IDs for the elements
  const generateId = () => Math.random().toString(36).substr(2, 9)

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
  const elements = template.elements.map((element: any) => {
    const newElement = { ...element }

    // Use the mapped ID for this element
    newElement.id = idMapping.get(element.id) || generateId()

    // For text elements, replace the text with database element name
    if (element.type === 'text') {
      newElement.text = dbElement.name
      newElement.originalText = dbElement.name
      newElement.rawText = dbElement.name
      // Set text alignment properties directly on the text element
      newElement.textAlign = 'center'
      newElement.verticalAlign = 'middle'
    }

    // Store database metadata in customData
    newElement.customData = {
      databaseId: dbElement.id,
      elementType,
      originalElement: dbElement,
      isFromDatabase: true,
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
    created: Date.now(),
    name: dbElement.name, // This should show in the library
  }

  return libraryItem
}

export default IntegratedLibrary
