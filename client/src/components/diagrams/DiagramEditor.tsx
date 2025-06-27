'use client'

import React, { useRef, useCallback, useMemo } from 'react'
import { Box, Alert, Snackbar } from '@mui/material'
import SaveDiagramDialog from './SaveDiagramDialog'
import OpenDiagramDialog from './OpenDiagramDialog'
import DeleteDiagramDialog from './DeleteDiagramDialog'
import IntegratedLibrary from './IntegratedLibrary'
import DiagramNameDisplay from './DiagramNameDisplay'
import ExcalidrawWrapper from './components/ExcalidrawWrapper'
import { DiagramEditorProps } from './types/DiagramTypes'
import { useDiagramState, useUIOptions } from './state/DiagramState'
import { useDiagramHandlers } from './handlers/DiagramHandlers'
import { useKeyboardShortcuts } from './hooks/DiagramKeyboardShortcuts'
import { loadViewportStateFromStorage } from './utils/DiagramStorage'
import { isViewer } from '@/lib/auth'

const DiagramEditor: React.FC<DiagramEditorProps> = ({ className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)

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
  } = useDiagramState()

  // UI Options
  const uiOptions = useUIOptions()

  // Handlers
  const {
    handleNewDiagram,
    handleDeleteDiagram,
    handleOpenDiagram,
    handleSaveDiagram,
    handleSaveAsDiagram,
    handleChange,
    handleExportJSON,
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
    setNotification,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    lastSavedScene
  )

  // Keyboard shortcuts
  useKeyboardShortcuts(
    handleNewDiagram,
    handleExportJSON,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
    currentDiagram,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    open => updateDialogState('openDialogOpen', open),
    open => updateDialogState('deleteDialogOpen', open)
  )

  // Excalidraw API Handler
  const handleExcalidrawAPI = useCallback(
    (api: any) => {
      setExcalidrawAPI(api)
    },
    [setExcalidrawAPI]
  )

  // Library Update Handler
  const handleLibraryUpdate = useCallback(
    (library: any) => {
      const itemCount = Array.isArray(library) ? library.length : library.libraryItems?.length || 0
      setNotification({
        open: true,
        message: `Architektur-Bibliothek erfolgreich geladen! (${itemCount} Elemente)`,
        severity: 'success',
      })
    },
    [setNotification]
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

  // Create dynamic initialData that includes viewport state
  const initialData = useMemo(() => {
    console.log('DiagramEditor: Creating initialData with viewport state')

    // Load viewport state from storage
    let viewportState = null
    try {
      const savedViewportState = loadViewportStateFromStorage()
      if (savedViewportState) {
        viewportState = savedViewportState
        console.log('DiagramEditor: Loaded viewport state from storage', viewportState)
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

    console.log('DiagramEditor: initialData created with viewport', {
      scrollX: baseAppState.scrollX,
      scrollY: baseAppState.scrollY,
      zoom: baseAppState.zoom?.value,
    })

    return data
  }, []) // Deliberately static - viewport is applied once on init

  // Debug log for initialData
  console.log('DiagramEditor: Stable initialData created')

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

        console.log('Aktualisiere Canvas mit neuen Elementen:', elements?.length || 0)

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
          message:
            'Neue Elemente wurden erfolgreich in der Datenbank erstellt und sind nun verknüpft!',
          severity: 'success',
        })
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Canvas:', error)
        setNotification({
          open: true,
          message: 'Fehler beim Aktualisieren der Elementdarstellung',
          severity: 'error',
        })
      }
    },
    [excalidrawAPI, setCurrentScene, setHasUnsavedChanges, setNotification]
  )

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
          onImportJSON={handleImportJSON}
          onExportPNG={handleExportPNG}
          onManualSync={handleManualSync}
          excalidrawAPI={handleExcalidrawAPI}
          onChange={handleChange}
          uiOptions={uiOptions}
          initialData={initialData}
          viewModeEnabled={isViewer()}
          currentDiagram={currentDiagram}
        />

        {/* Integrated Library Component - only for non-viewer users */}
        {excalidrawAPI && !isViewer() && (
          <IntegratedLibrary excalidrawAPI={excalidrawAPI} onLibraryUpdate={handleLibraryUpdate} />
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
