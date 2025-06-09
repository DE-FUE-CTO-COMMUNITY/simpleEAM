'use client'

import React, { useRef, useCallback } from 'react'
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
import { isViewer } from '@/lib/auth'

const DiagramEditor: React.FC<DiagramEditorProps> = ({ className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Custom hooks for state management
  const {
    isClient,
    excalidrawAPI,
    currentDiagram,
    currentScene,
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

  const initialData = currentScene || {
    appState: { viewBackgroundColor: '#ffffff' },
    scrollToContent: true,
  }

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
