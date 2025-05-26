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
      } catch (error) {
        console.error('Fehler beim Laden der ArchiMate-Bibliothek:', error)
      }
    }

    loadArchimateLibrary()
  }, [])

  // Create integrated library combining ArchiMate symbols with database elements
  const integratedLibrary = useMemo(() => {
    if (!archimateLibrary || !data) return null

    // Create template elements from ArchiMate library for each type
    const templates = {
      businessCapability: findArchimateTemplate(archimateLibrary, 'Business Function'),
      application: findArchimateTemplate(archimateLibrary, 'Application Component'),
      dataObject: findArchimateTemplate(archimateLibrary, 'Data Object'),
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

    // Combine original library with new database items
    return {
      ...archimateLibrary,
      libraryItems: [...archimateLibrary.libraryItems, ...newLibraryItems],
    }
  }, [archimateLibrary, data])

  // Update library when ready
  useEffect(() => {
    if (integratedLibrary && excalidrawAPI) {
      console.log(
        '🔧 Aktualisiere Excalidraw Library mit',
        integratedLibrary.libraryItems.length,
        'Elementen'
      )
      console.log('📚 Original ArchiMate Items:', archimateLibrary?.libraryItems?.length || 0)
      console.log(
        '🗄️ Neue Datenbank Items:',
        integratedLibrary.libraryItems.length - (archimateLibrary?.libraryItems?.length || 0)
      )

      excalidrawAPI.updateLibrary(integratedLibrary)
      onLibraryUpdate(integratedLibrary)
    }
  }, [integratedLibrary, excalidrawAPI, onLibraryUpdate, archimateLibrary])

  // Debug data loading
  useEffect(() => {
    if (data) {
      console.log('📊 GraphQL Daten geladen:', {
        businessCapabilities: data.businessCapabilities?.length || 0,
        applications: data.applications?.length || 0,
        dataObjects: data.dataObjects?.length || 0,
        applicationInterfaces: data.applicationInterfaces?.length || 0,
      })
    }
  }, [data])

  return null // This component doesn't render anything
}

// Helper function to find ArchiMate template by name or type
function findArchimateTemplate(library: any, templateName: string) {
  // First try to find by exact text match
  let item = library.libraryItems.find((item: any) =>
    item.elements.some(
      (element: any) =>
        element.type === 'text' && element.text && element.text.includes(templateName)
    )
  )

  // If not found, try alternative names
  if (!item) {
    const alternatives = {
      'Business Function': ['Business Capability', 'Capability', 'Business'],
      'Application Component': ['Application', 'App Component'],
      'Data Object': ['Data', 'Object'],
      'Application Interface': ['Interface', 'API'],
    }

    const alts = alternatives[templateName as keyof typeof alternatives] || []
    for (const alt of alts) {
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
  if (!template) return null

  // Generate unique IDs for the elements
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Clone template elements with new IDs and updated content
  const elements = template.elements.map((element: any) => {
    const newElement = {
      ...element,
      id: generateId(),
      // Update text content for text elements
      text: element.type === 'text' ? dbElement.name : element.text,
      // Store database metadata in customData
      customData: {
        databaseId: dbElement.id,
        elementType,
        originalElement: dbElement,
        isFromDatabase: true,
      },
      // Update group IDs to be unique
      groupIds: element.groupIds ? element.groupIds.map(() => generateId()) : [],
      // Update bound elements if any
      boundElements: element.boundElements
        ? element.boundElements.map((bound: any) => ({
            ...bound,
            id: bound.type === 'text' ? generateId() : bound.id,
          }))
        : null,
      // Update container ID if it's a text element
      containerId: element.containerId ? generateId() : null,
    }

    // For text elements, update the container reference
    if (element.type === 'text' && element.containerId) {
      // Find the rectangle element this text belongs to
      const containerElement = template.elements.find((e: any) => e.id === element.containerId)
      if (containerElement) {
        // The container will get a new ID, so we need to track it
        newElement.containerId = `container-${dbElement.id}-${elementType}`
      }
    }

    // For rectangle elements that contain text, update their ID consistently
    if (
      element.type === 'rectangle' &&
      element.boundElements?.some((b: any) => b.type === 'text')
    ) {
      newElement.id = `container-${dbElement.id}-${elementType}`
    }

    return newElement
  })

  // Fix container references for text elements
  elements.forEach((element: any) => {
    if (element.type === 'text' && element.containerId) {
      const container = elements.find((e: any) => e.id.startsWith('container-'))
      if (container) {
        element.containerId = container.id
      }
    }
  })

  return {
    status: 'published',
    elements,
    id: `db-${elementType}-${dbElement.id}`,
    created: Date.now(),
  }
}

export default IntegratedLibrary
