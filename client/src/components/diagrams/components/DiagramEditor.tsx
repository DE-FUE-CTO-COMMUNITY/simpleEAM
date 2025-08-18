'use client'

import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react'
import { Box, Alert, Snackbar } from '@mui/material'
import { useApolloClient } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_DIAGRAM } from '@/graphql/diagram'
import SaveDiagramDialog from '../dialogs/SaveDiagramDialog'
import OpenDiagramDialog from '../dialogs/OpenDiagramDialog'
import DeleteDiagramDialog from '../dialogs/DeleteDiagramDialog'
import IntegratedLibrary from './IntegratedLibrary'
import DiagramNameDisplay from './DiagramNameDisplay'
import ExcalidrawWrapper from './ExcalidrawWrapper'
import CanvasDebugOverlay from './CanvasDebugOverlay'
import CapabilityMapGenerator from '../dialogs/CapabilityMapGenerator'
import { DiagramEditorProps } from '../types/DiagramTypes'
import { useDiagramState, useUIOptions } from '../state/DiagramState'
import { useDiagramHandlers } from '../handlers/DiagramHandlers'
import { useKeyboardShortcuts } from '../hooks/DiagramKeyboardShortcuts'
import { loadViewportStateFromStorage } from '../utils/DiagramStorageUtils'
import { isViewer } from '@/lib/auth'

const DiagramEditor: React.FC<DiagramEditorProps> = ({ className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const apolloClient = useApolloClient()
  const t = useTranslations('diagrams')

  // Collaboration status state
  const [isCollaborating, setIsCollaborating] = useState(false)

  // Custom hooks for state management
  const {
    isClient,
    excalidrawAPI,
    currentDiagram,
    // currentScene, // Not used in initialData anymore
    hasUnsavedChanges,
    lastSavedScene,
    dialogStates,
    notification,
    setExcalidrawAPI,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
    updateDialogState,
    selectedElementForRelatedElements,
    setSelectedElementForRelatedElements,
  } = useDiagramState()

  // UI Options
  const uiOptions = useUIOptions()

  // Create translated notification wrapper
  const setTranslatedNotification = useCallback(
    (notification: {
      open: boolean
      message: string
      severity: 'success' | 'error' | 'info' | 'warning'
    }) => {
      let translatedMessage = notification.message

      // Handle translation keys with parameters
      if (notification.message.includes(':')) {
        const parts = notification.message.split(':')
        const key = parts[0]

        if (key === 'messages.diagramLoaded') {
          const titleAndCorrection = parts.slice(1).join(':')
          // Check if there's correction information in parentheses
          if (titleAndCorrection.includes(' (') && titleAndCorrection.includes('korrigiert)')) {
            const [title, correction] = titleAndCorrection.split(' (')
            const correctionText = '(' + correction // Restore the opening parenthesis
            translatedMessage =
              t('messages.diagramLoaded', { title: title.trim() }) + ' ' + correctionText
          } else {
            translatedMessage = t('messages.diagramLoaded', { title: titleAndCorrection })
          }
        } else if (key === 'messages.diagramSaved') {
          translatedMessage = t('messages.diagramSaved', { title: parts[1] })
        } else if (key === 'messages.diagramSavedAs') {
          translatedMessage = t('messages.diagramSavedAs', { title: parts[1] })
        }
      } else if (notification.message.startsWith('messages.')) {
        const key = notification.message.replace('messages.', '')
        translatedMessage = t(`messages.${key}` as any)
      } else if (notification.message.startsWith('errors.')) {
        const key = notification.message.replace('errors.', '')
        translatedMessage = t(`errors.${key}` as any)
      }

      setNotification({
        ...notification,
        message: translatedMessage,
      })
    },
    [setNotification, t]
  )

  // Handlers
  const {
    handleNewDiagram,
    handleDeleteDiagram,
    handleOpenDiagram,
    handleSaveDiagram,
    handleSaveAsDiagram,
    handleChange,
    handleExportJSON,
    handleExportDrawIO,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
  } = useDiagramHandlers(
    excalidrawAPI,
    currentDiagram,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setTranslatedNotification,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    lastSavedScene
  )

  // Capability Map Generator Handler
  const handleCapabilityMapGenerator = useCallback(() => {
    updateDialogState('capabilityMapGeneratorOpen', true)
  }, [updateDialogState])

  // Handle generated capability map elements
  const handleCapabilityMapGenerated = useCallback(
    (elements: any[]) => {
      if (!excalidrawAPI) {
        return
      }

      try {
        // Update the scene with generated elements
        excalidrawAPI.updateScene({
          elements: elements,
          appState: {
            viewBackgroundColor: '#ffffff',
          },
        })

        // Mark as having unsaved changes
        setHasUnsavedChanges(true)

        // Count actual capabilities (main elements) instead of all technical elements
        const capabilityCount = elements.filter(
          (el: any) => el.customData?.isMainElement === true
        ).length

        // Show success notification
        setNotification({
          open: true,
          message: t('messages.capabilityMapSuccess', { count: capabilityCount }),
          severity: 'success',
        })
      } catch {
        // Fehlerbehandlung
        setNotification({
          open: true,
          message: t('errors.capabilityMapError'),
          severity: 'error',
        })
      }
    },
    [excalidrawAPI, setHasUnsavedChanges, setNotification, t]
  )

  // Related Elements handlers
  const handleOpenAddRelatedElementsDialog = useCallback(
    (element: any) => {
      setSelectedElementForRelatedElements(element)
      updateDialogState('addRelatedElementsDialogOpen', true)
    },
    [setSelectedElementForRelatedElements, updateDialogState]
  )

  const handleCloseAddRelatedElementsDialog = useCallback(() => {
    updateDialogState('addRelatedElementsDialogOpen', false)
    setSelectedElementForRelatedElements(null)
  }, [updateDialogState, setSelectedElementForRelatedElements])

  // Keyboard shortcuts hook
  useKeyboardShortcuts(
    handleNewDiagram,
    handleExportJSON,
    handleExportDrawIO,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
    handleCapabilityMapGenerator,
    currentDiagram,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    open => updateDialogState('openDialogOpen', open),
    open => updateDialogState('deleteDialogOpen', open)
  )

  // Excalidraw API Handler
  const handleExcalidrawAPI = useCallback(
    (api: any) => {
      // Setze eine Bereitschafts-Eigenschaft für bessere Erkennung
      if (api) {
        api.ready = true
        setExcalidrawAPI(api)
      }
    },
    [setExcalidrawAPI]
  )

  // Library Update Handler
  const handleLibraryUpdate = useCallback(
    (library: any) => {
      const itemCount = Array.isArray(library) ? library.length : library.libraryItems?.length || 0
      setNotification({
        open: true,
        message: t('messages.libraryLoaded', { count: itemCount }),
        severity: 'success',
      })
    },
    [setNotification, t]
  )

  // Get current diagram data for save operations
  const getCurrentDiagramData = () => {
    if (!excalidrawAPI) return '{}'

    const elements = excalidrawAPI.getSceneElements()
    const appState = excalidrawAPI.getAppState()

    return JSON.stringify({
      elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        currentItemFontFamily: appState.currentItemFontFamily,
      },
    })
  }

  // Handle diagram metadata updates from collaboration
  const handleCollaborationDiagramUpdate = useCallback(
    (diagram: any) => {
      if (diagram && diagram.id && diagram.title) {
        setCurrentDiagram(diagram)
      }
    },
    [setCurrentDiagram]
  )

  // Handle collaboration status changes
  const handleCollaborationStatusChange = useCallback((collaborating: boolean) => {
    setIsCollaborating(collaborating)
  }, [])

  // Create dynamic initialData that includes viewport state
  const initialData = useMemo(() => {
    // Load viewport state from storage
    let viewportState = null
    try {
      const savedViewportState = loadViewportStateFromStorage()
      if (savedViewportState) {
        viewportState = savedViewportState
      }
    } catch (error) {
      console.warn('DiagramEditor: Failed to load viewport state:', error)
    }

    // Create base app state with viewport position
    const baseAppState = {
      viewBackgroundColor: '#ffffff',
      collaborators: new Map(),
      selectedElementIds: {},
      hoveredElementIds: {},
      selectedGroupIds: {},
      selectedLinearElement: null,
      editingLinearElement: null,
      activeTool: { type: 'selection' },
      isLoading: false,
      errorMessage: null,
      currentItemFontFamily: 1,
      currentItemFontSize: 20,
      currentItemTextAlign: 'left',
      currentItemStrokeColor: '#1e1e1e',
      currentItemBackgroundColor: 'transparent',
      currentItemFillStyle: 'solid',
      currentItemStrokeWidth: 2,
      currentItemStrokeStyle: 'solid',
      currentItemRoughness: 1,
      currentItemOpacity: 100,
      // Include viewport state if available
      ...(viewportState && {
        scrollX: viewportState.scrollX,
        scrollY: viewportState.scrollY,
        zoom: { value: viewportState.zoom },
      }),
    }

    const data = {
      elements: [], // Always start with empty elements - they get loaded separately
      appState: baseAppState,
      scrollToContent: false, // Critical: preserve viewport position
    }

    return data
  }, []) // Deliberately static - viewport is applied once on init

  // Debug log for initialData

  // Diagram Update Handler for new elements
  const handleDiagramUpdate = useCallback(
    (updatedDiagramData: string) => {
      if (!excalidrawAPI) {
        console.warn('Excalidraw API nicht verfügbar für Canvas-Update')
        return
      }

      try {
        const parsedData = JSON.parse(updatedDiagramData)
        const { elements, appState } = parsedData

        // Restore scene data to ensure proper structure
        const restoreSceneData = (sceneData: any) => {
          if (!sceneData || !sceneData.appState) {
            return sceneData
          }

          // Ensure collaborators is a Map
          if (
            sceneData.appState.collaborators &&
            typeof sceneData.appState.collaborators.clear === 'function'
          ) {
            sceneData.appState.collaborators.clear()
          } else {
            sceneData.appState.collaborators = new Map()
          }

          return sceneData
        }

        // Update the canvas with the new elements
        const restoredData = restoreSceneData({ elements: elements || [], appState })
        excalidrawAPI.updateScene(restoredData)

        // Update current scene state
        setCurrentScene(restoredData)

        // Mark that there are no unsaved changes since we just saved
        setHasUnsavedChanges(false)

        setNotification({
          open: true,
          message: t('messages.elementsCreatedAndLinked'),
          severity: 'success',
        })
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Canvas:', error)
        setNotification({
          open: true,
          message: t('errors.updateElementsError'),
          severity: 'error',
        })
      }
    },
    [excalidrawAPI, setCurrentScene, setHasUnsavedChanges, setNotification, t]
  ) // LocalStorage-basiertes Diagramm laden beim Start
  useEffect(() => {
    const loadDiagramFromStorage = async () => {
      try {
        const pendingDiagram = localStorage.getItem('pendingDiagramToOpen')
        if (pendingDiagram && excalidrawAPI) {
          const diagramData = JSON.parse(pendingDiagram)

          // Entferne aus LocalStorage, damit es nur einmal geladen wird
          localStorage.removeItem('pendingDiagramToOpen')

          // Prüfe, ob diagramJson verfügbar ist
          if (diagramData.diagramJson) {
            // Diagramm hat bereits JSON-Daten, direkt laden
            handleOpenDiagram(diagramData)
          } else {
            // Diagramm benötigt noch JSON-Daten - setze erst die Metadaten
            setCurrentDiagram(diagramData)

            // Lade das komplette Diagramm über GraphQL
            try {
              const { data } = await apolloClient.query({
                query: GET_DIAGRAM,
                variables: { id: diagramData.id },
                fetchPolicy: 'network-only',
              })

              if (data?.diagrams?.[0]) {
                // Führe die vollständigen Diagrammdaten mit den bereits gesetzten Metadaten zusammen
                const fullDiagram = {
                  ...diagramData, // Metadaten aus LocalStorage
                  ...data.diagrams[0], // Vollständige Daten inklusive diagramJson aus GraphQL
                }
                handleOpenDiagram(fullDiagram)
              }
            } catch (error) {
              console.error('Fehler beim Laden der Diagramm-Daten:', error)
              setNotification({
                open: true,
                message: t('errors.loadDiagramError'),
                severity: 'error',
              })
            }
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden des Diagramms aus LocalStorage:', error)
        localStorage.removeItem('pendingDiagramToOpen') // Cleanup bei Fehler
      }
    }

    if (excalidrawAPI && isClient) {
      // Kleiner Delay um sicherzustellen, dass alles initialisiert ist
      setTimeout(loadDiagramFromStorage, 500)
    }
  }, [
    excalidrawAPI,
    isClient,
    handleOpenDiagram,
    setCurrentDiagram,
    setNotification,
    apolloClient,
    t,
  ])

  if (!isClient) {
    return null
  }

  return (
    <Box
      ref={containerRef}
      className={className}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Hauptcontainer für Excalidraw */}
      <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
        {/* Diagram Name Display - positioned next to MainMenu */}
        <DiagramNameDisplay
          currentDiagram={currentDiagram}
          hasUnsavedChanges={hasUnsavedChanges}
          onSaveClick={() => updateDialogState('saveDialogOpen', true)}
          isCollaborating={isCollaborating}
        />

        <ExcalidrawWrapper
          // Remove dynamic key to prevent controlled/uncontrolled input issues
          // The component should persist throughout the app lifecycle
          onOpenDialog={() => updateDialogState('openDialogOpen', true)}
          onSaveDialog={() => updateDialogState('saveDialogOpen', true)}
          onSaveAsDialog={() => updateDialogState('saveAsDialogOpen', true)}
          onNewDiagram={handleNewDiagram}
          onDeleteDialog={() => updateDialogState('deleteDialogOpen', true)}
          onExportJSON={handleExportJSON}
          onExportDrawIO={handleExportDrawIO}
          onImportJSON={handleImportJSON}
          onExportPNG={handleExportPNG}
          onManualSync={handleManualSync}
          onCapabilityMapGenerator={handleCapabilityMapGenerator}
          excalidrawAPI={handleExcalidrawAPI}
          onChange={handleChange}
          uiOptions={uiOptions}
          initialData={initialData}
          viewModeEnabled={isViewer()}
          currentDiagram={currentDiagram}
          onDiagramUpdate={handleCollaborationDiagramUpdate}
          onCollaborationStatusChange={handleCollaborationStatusChange}
          selectedElementForRelatedElements={selectedElementForRelatedElements}
          onOpenAddRelatedElementsDialog={handleOpenAddRelatedElementsDialog}
          onCloseAddRelatedElementsDialog={handleCloseAddRelatedElementsDialog}
          isAddRelatedElementsDialogOpen={dialogStates.addRelatedElementsDialogOpen}
        />

        {/* Integrated Library Component - only for non-viewer users */}
        {excalidrawAPI && !isViewer() && (
          <IntegratedLibrary excalidrawAPI={excalidrawAPI} onLibraryUpdate={handleLibraryUpdate} />
        )}

        {/* Canvas Debug Overlay - nur in Entwicklungsumgebung */}
        {process.env.NODE_ENV === 'development' && excalidrawAPI && (
          <CanvasDebugOverlay
            excalidrawAPI={excalidrawAPI}
            selectedElementForRelatedElements={selectedElementForRelatedElements}
          />
        )}
      </Box>

      {/* Save Dialog - only for non-viewer users */}
      {!isViewer() && (
        <SaveDiagramDialog
          open={dialogStates.saveDialogOpen}
          onClose={() => updateDialogState('saveDialogOpen', false)}
          onSave={handleSaveDiagram}
          diagramData={getCurrentDiagramData()}
          existingDiagram={currentDiagram}
          onDiagramUpdate={handleDiagramUpdate}
        />
      )}

      {/* Save As Dialog - only for non-viewer users */}
      {!isViewer() && (
        <SaveDiagramDialog
          open={dialogStates.saveAsDialogOpen}
          onClose={() => updateDialogState('saveAsDialogOpen', false)}
          onSave={handleSaveAsDiagram}
          diagramData={getCurrentDiagramData()}
          existingDiagram={currentDiagram}
          forceSaveAs={true}
          onDiagramUpdate={handleDiagramUpdate}
        />
      )}

      {/* Open Dialog - available for all users */}
      <OpenDiagramDialog
        open={dialogStates.openDialogOpen}
        onClose={() => updateDialogState('openDialogOpen', false)}
        onOpen={handleOpenDiagram}
      />

      {/* Delete Dialog - only for non-viewer users */}
      {!isViewer() && (
        <DeleteDiagramDialog
          open={dialogStates.deleteDialogOpen}
          onClose={() => updateDialogState('deleteDialogOpen', false)}
          onDelete={handleDeleteDiagram}
          diagram={currentDiagram}
        />
      )}

      {/* Capability Map Generator Dialog - only for non-viewer users */}
      {!isViewer() && (
        <CapabilityMapGenerator
          open={dialogStates.capabilityMapGeneratorOpen}
          onClose={() => updateDialogState('capabilityMapGeneratorOpen', false)}
          onElementsGenerated={handleCapabilityMapGenerated}
        />
      )}

      {/* Benachrichtigungen */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DiagramEditor
