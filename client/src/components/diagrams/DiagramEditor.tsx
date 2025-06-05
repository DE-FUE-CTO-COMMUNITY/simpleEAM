'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Typography, Alert, Snackbar } from '@mui/material'
import dynamic from 'next/dynamic'
import SaveDiagramDialog from './SaveDiagramDialog'
import OpenDiagramDialog from './OpenDiagramDialog'
import DeleteDiagramDialog from './DeleteDiagramDialog'
import IntegratedLibrary from './IntegratedLibrary'
import { isViewer } from '@/lib/auth'

// Dynamischer Import von Excalidraw, um Server-Side-Rendering zu vermeiden
const ExcalidrawWrapper = dynamic(
  async () => {
    // Wichtig: Zuerst das CSS importieren, dann die Komponente
    await import('@excalidraw/excalidraw/index.css')
    // Import Material UI theme customizations for Excalidraw
    await import('@/styles/excalidraw-material-theme.css')
    // Import additional overrides to ensure our styles take priority
    await import('@/styles/excalidraw-override.css')
    const { Excalidraw, MainMenu } = await import('@excalidraw/excalidraw')

    interface ExcalidrawComponentProps {
      onOpenDialog: () => void
      onSaveDialog: () => void
      onSaveAsDialog: () => void
      onNewDiagram: () => void
      onDeleteDialog: () => void
      excalidrawAPI: (api: any) => void
      uiOptions: any
      initialData: any
      viewModeEnabled?: boolean
      currentDiagram?: any
    }

    const ExcalidrawComponent = ({
      onOpenDialog,
      onSaveDialog,
      onSaveAsDialog,
      onNewDiagram,
      onDeleteDialog,
      excalidrawAPI,
      uiOptions,
      initialData,
      viewModeEnabled,
      currentDiagram,
    }: ExcalidrawComponentProps) => {
      // Type cast to avoid TypeScript errors with MemoExoticComponent
      const ExcalidrawTyped = Excalidraw as React.ComponentType<any>
      const MainMenuTyped = MainMenu as React.ComponentType<any> & {
        Item: React.ComponentType<any>
      }

      return (
        <div style={{ height: '100%', width: '100%' }}>
          <ExcalidrawTyped
            theme="light"
            name="simple-eam-diagram"
            UIOptions={uiOptions}
            initialData={initialData}
            excalidrawAPI={excalidrawAPI}
            viewModeEnabled={viewModeEnabled}
          >
            <MainMenuTyped>
              {/* Custom New Diagram Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onNewDiagram}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                  }
                  shortcut="Ctrl+N"
                >
                  Neues Diagramm
                </MainMenuTyped.Item>
              )}

              {/* Custom Open Menu Item - available for all users */}
              <MainMenuTyped.Item
                onSelect={onOpenDialog}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                }
                shortcut="Ctrl+O"
              >
                Öffnen
              </MainMenuTyped.Item>

              {/* Custom Save Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onSaveDialog}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
                    </svg>
                  }
                  shortcut="Ctrl+S"
                >
                  {currentDiagram ? 'Speichern' : 'Speichern als...'}
                </MainMenuTyped.Item>
              )}

              {/* Custom Save As Menu Item - only for non-viewer users and when a diagram is loaded */}
              {!viewModeEnabled && currentDiagram && (
                <MainMenuTyped.Item
                  onSelect={onSaveAsDialog}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M17,7H19V19H5V5H14V7H17M10,17L14,13L10.5,9.5L9.08,10.92L11.5,13.33L12.92,11.92L17,16V17H10Z" />
                    </svg>
                  }
                  shortcut="Ctrl+Shift+S"
                >
                  Speichern unter...
                </MainMenuTyped.Item>
              )}

              {/* Custom Delete Menu Item - only for non-viewer users and when a diagram is loaded */}
              {!viewModeEnabled && currentDiagram && (
                <MainMenuTyped.Item
                  onSelect={onDeleteDialog}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                  }
                  shortcut="Del"
                >
                  Löschen
                </MainMenuTyped.Item>
              )}
            </MainMenuTyped>
          </ExcalidrawTyped>
        </div>
      )
    }

    return ExcalidrawComponent
  },
  {
    ssr: false,
    loading: () => (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="h5">Lade Diagram-Editor...</Typography>
      </Box>
    ),
  }
)

export interface DiagramEditorProps {
  className?: string
  style?: React.CSSProperties
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ className, style }) => {
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [currentDiagram, setCurrentDiagram] = useState<any>(null)
  const [currentScene, setCurrentScene] = useState<any>(null)

  // Dialog-States
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Notification-States
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  useEffect(() => {
    // Nur Client-seitig rendern
    setIsClient(true)

    // Load persisted scene from localStorage
    const persistedScene = localStorage.getItem('excalidraw-scene')
    if (persistedScene) {
      try {
        const sceneData = JSON.parse(persistedScene)
        setCurrentScene(sceneData)
      } catch {
        // Fehler beim Laden der gespeicherten Szene
      }
    }
  }, [])

  const handleSaveDiagram = useCallback((savedDiagram: any) => {
    setCurrentDiagram(savedDiagram)
    setNotification({
      open: true,
      message: `Diagramm "${savedDiagram.title}" erfolgreich gespeichert!`,
      severity: 'success',
    })
  }, [])

  const handleOpenDiagram = useCallback(
    (diagram: any) => {
      if (excalidrawAPI && diagram.diagramJson) {
        try {
          const diagramData = JSON.parse(diagram.diagramJson)
          const sceneData = {
            elements: diagramData.elements || [],
            appState: {
              ...diagramData.appState,
              viewBackgroundColor: '#ffffff',
            },
          }
          excalidrawAPI.updateScene(sceneData)
          setCurrentDiagram(diagram)
          setCurrentScene(sceneData)
          // Persist to localStorage
          localStorage.setItem('excalidraw-scene', JSON.stringify(sceneData))
          setNotification({
            open: true,
            message: `Diagramm "${diagram.title}" erfolgreich geladen!`,
            severity: 'success',
          })
        } catch {
          setNotification({
            open: true,
            message: 'Fehler beim Laden des Diagramms',
            severity: 'error',
          })
        }
      }
    },
    [excalidrawAPI]
  )

  const handleNewDiagram = useCallback(() => {
    if (excalidrawAPI) {
      // Canvas leeren
      const emptyScene = {
        elements: [],
        appState: {
          viewBackgroundColor: '#ffffff',
        },
      }
      excalidrawAPI.updateScene(emptyScene)
      setCurrentDiagram(null)
      setCurrentScene(emptyScene)
      // Clear localStorage
      localStorage.removeItem('excalidraw-scene')
      setNotification({
        open: true,
        message: 'Neues Diagramm erstellt',
        severity: 'info',
      })
    }
  }, [excalidrawAPI])

  const handleDeleteDiagram = useCallback(() => {
    // Reset the current diagram and clear canvas
    setCurrentDiagram(null)
    const emptyScene = {
      elements: [],
      appState: {
        viewBackgroundColor: '#ffffff',
      },
    }
    if (excalidrawAPI) {
      excalidrawAPI.updateScene(emptyScene)
    }
    setCurrentScene(emptyScene)
    // Clear localStorage
    localStorage.removeItem('excalidraw-scene')
    setNotification({
      open: true,
      message: 'Diagramm erfolgreich gelöscht',
      severity: 'success',
    })
  }, [excalidrawAPI])

  const handleSaveAsDiagram = useCallback((savedDiagram: any) => {
    setCurrentDiagram(savedDiagram)
    setNotification({
      open: true,
      message: `Diagramm "${savedDiagram.title}" erfolgreich als Kopie gespeichert!`,
      severity: 'success',
    })
  }, [])

  // Initialisiert die API und ruft sie bei Bedarf auf
  const handleExcalidrawAPI = useCallback((api: any) => {
    setExcalidrawAPI(api)

    // Set up auto-save to localStorage
    let saveTimeout: NodeJS.Timeout
    const autoSaveScene = () => {
      if (api) {
        const scene = api.getSceneElements()
        const appState = api.getAppState()
        const sceneData = {
          elements: scene,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
            // Only save essential app state properties
          },
        }
        localStorage.setItem('excalidraw-scene', JSON.stringify(sceneData))
        setCurrentScene(sceneData)
      }
    }

    // Set up onChange listener for auto-save
    const onChangeHandler = () => {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(autoSaveScene, 1000) // Save after 1 second of no changes
    }

    // Store the change handler reference for cleanup
    if (api && api.onChange) {
      api.onChange(onChangeHandler)
    }
  }, [])

  // Load persisted scene when API becomes available
  useEffect(() => {
    if (excalidrawAPI && currentScene && currentScene.elements) {
      // Only load if there are actually elements to load
      if (currentScene.elements.length > 0) {
        excalidrawAPI.updateScene(currentScene)
      }
    }
  }, [excalidrawAPI, currentScene])

  // Keyboard shortcuts handling
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Only handle shortcuts for non-viewer users
      if (isViewer()) return

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault()
            handleNewDiagram()
            break
          case 'o':
            event.preventDefault()
            setOpenDialogOpen(true)
            break
          case 's':
            event.preventDefault()
            if (event.shiftKey && currentDiagram) {
              // Ctrl+Shift+S - Save As (only when diagram exists)
              setSaveAsDialogOpen(true)
            } else {
              // Ctrl+S - Save
              setSaveDialogOpen(true)
            }
            break
        }
      } else if (event.key === 'Delete' && currentDiagram && !isViewer()) {
        event.preventDefault()
        setDeleteDialogOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts)
    }
  }, [handleNewDiagram, currentDiagram])

  const handleLibraryUpdate = useCallback((library: any) => {
    const itemCount = Array.isArray(library) ? library.length : library.libraryItems?.length || 0
    setNotification({
      open: true,
      message: `Architektur-Bibliothek erfolgreich geladen! (${itemCount} Elemente)`,
      severity: 'success',
    })
  }, [])

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

  // UI Optionen für Excalidraw - Anpassung basierend auf Benutzerrolle
  const uiOptions = {
    canvasActions: {
      export: isViewer() ? (false as const) : { saveFileToDisk: true }, // Export nur für Viewer deaktivieren
      saveAsImage: true,
      loadScene: false, // Deaktiviere Standard-Load
      saveToActiveFile: false, // Deaktiviere Standard-Save
      toggleTheme: null, // Deaktiviere Theme-Toggle komplett
      clearCanvas: !isViewer(), // Nur non-Viewer können Canvas löschen
      changeViewBackgroundColor: true,
    },
    tools: {
      image: true,
    },
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
        <ExcalidrawWrapper
          onOpenDialog={() => setOpenDialogOpen(true)}
          onSaveDialog={() => setSaveDialogOpen(true)}
          onSaveAsDialog={() => setSaveAsDialogOpen(true)}
          onNewDiagram={handleNewDiagram}
          onDeleteDialog={() => setDeleteDialogOpen(true)}
          excalidrawAPI={handleExcalidrawAPI}
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
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          onSave={handleSaveDiagram}
          diagramData={getCurrentDiagramData()}
          existingDiagram={currentDiagram}
        />
      )}

      {/* Save As Dialog - only for non-viewer users */}
      {!isViewer() && (
        <SaveDiagramDialog
          open={saveAsDialogOpen}
          onClose={() => setSaveAsDialogOpen(false)}
          onSave={handleSaveAsDiagram}
          diagramData={getCurrentDiagramData()}
          existingDiagram={currentDiagram}
          forceSaveAs={true}
        />
      )}

      {/* Open Dialog - available for all users */}
      <OpenDiagramDialog
        open={openDialogOpen}
        onClose={() => setOpenDialogOpen(false)}
        onOpen={handleOpenDiagram}
      />

      {/* Delete Dialog - only for non-viewer users */}
      {!isViewer() && (
        <DeleteDiagramDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
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
