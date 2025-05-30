'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Typography, Alert, Snackbar, Drawer, IconButton, Fab } from '@mui/material'
import { LibraryBooks, Close } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import SaveDiagramDialog from './SaveDiagramDialog'
import OpenDiagramDialog from './OpenDiagramDialog'
import DatabaseLibraryPanel from './DatabaseLibraryPanel'
import {
  createExcalidrawElementFromLibraryItem,
  isLibraryBasedElement,
  getLibraryElementId,
  updateExcalidrawElementFromLibraryItem,
} from './excalidrawLibraryUtils'
import { ElementType, LibraryElement } from '@/graphql/library'
import { isViewer } from '@/lib/auth'

// Dynamischer Import von Excalidraw, um Server-Side-Rendering zu vermeiden
const ExcalidrawWrapper = dynamic(
  async () => {
    // Wichtig: Zuerst das CSS importieren, dann die Komponente
    await import('@excalidraw/excalidraw/index.css')
    const { Excalidraw, MainMenu } = await import('@excalidraw/excalidraw')

    const ExcalidrawComponent: React.FC<{
      onOpenDialog: () => void
      onSaveDialog: () => void
      excalidrawAPI: (api: any) => void
      uiOptions: any
      initialData: any
      onDrop: (event: React.DragEvent) => void
      viewModeEnabled?: boolean
    }> = ({
      onOpenDialog,
      onSaveDialog,
      excalidrawAPI,
      uiOptions,
      initialData,
      onDrop,
      viewModeEnabled,
    }) => {
      return (
        <div
          style={{ height: '100%', width: '100%' }}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          <Excalidraw
            theme="light"
            name="simple-eam-diagram"
            UIOptions={uiOptions}
            initialData={initialData}
            excalidrawAPI={excalidrawAPI}
            viewModeEnabled={viewModeEnabled}
          >
            <MainMenu>
              {/* Only show menu items for non-viewer users */}
              {!viewModeEnabled && (
                <>
                  {/* Custom Open Menu Item */}
                  <MainMenu.Item
                    onSelect={onOpenDialog}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    }
                    shortcut="Ctrl+O"
                  >
                    Diagramm öffnen
                  </MainMenu.Item>

                  {/* Custom Save Menu Item */}
                  <MainMenu.Item
                    onSelect={onSaveDialog}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
                      </svg>
                    }
                    shortcut="Ctrl+S"
                  >
                    Diagramm speichern als...
                  </MainMenu.Item>

                  <MainMenu.Separator />

                  {/* Include default items but exclude social links */}
                  <MainMenu.DefaultItems.SaveAsImage />
                  <MainMenu.DefaultItems.Export />
                  <MainMenu.Separator />
                  <MainMenu.DefaultItems.ClearCanvas />
                  <MainMenu.DefaultItems.ChangeCanvasBackground />
                </>
              )}
              <MainMenu.DefaultItems.ToggleTheme />
              <MainMenu.Separator />
              <MainMenu.DefaultItems.Help />
              {/* Note: Socials are excluded - no MainMenu.DefaultItems.Socials */}
            </MainMenu>
          </Excalidraw>
        </div>
      )
    }

    return ExcalidrawComponent
  },
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
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
  const [archimateLibrary, setArchimateLibrary] = useState<any>(null)

  // Library Panel States
  const [libraryPanelOpen, setLibraryPanelOpen] = useState(false)
  const [draggedElement, setDraggedElement] = useState<{
    element: LibraryElement
    elementType: ElementType
  } | null>(null)

  // Dialog-States
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)

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

    // ArchiMate-Bibliothek laden
    const loadArchimateLibrary = async () => {
      try {
        const response = await fetch('/libraries/archimate-symbols.excalidrawlib')
        if (!response.ok) {
          throw new Error('Fehler beim Laden der ArchiMate-Bibliothek')
        }
        const libraryData = await response.json()
        setArchimateLibrary(libraryData)
      } catch (error) {
        console.error('Fehler beim Laden der ArchiMate-Bibliothek:', error)
        setNotification({
          open: true,
          message: 'Fehler beim Laden der ArchiMate-Bibliothek',
          severity: 'error',
        })
      }
    }

    loadArchimateLibrary()

    // Keyboard-Shortcuts hinzufügen
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault()
            setSaveDialogOpen(true)
            break
          case 'o':
            event.preventDefault()
            setOpenDialogOpen(true)
            break
          case 'l':
            event.preventDefault()
            setLibraryPanelOpen(prev => !prev)
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Custom App State for Excalidraw
  const initialData = React.useMemo(() => {
    return {
      appState: {
        viewBackgroundColor: '#ffffff',
        currentItemFontFamily: 1,
      },
      ...(archimateLibrary && { libraryItems: archimateLibrary.libraryItems }),
    }
  }, [archimateLibrary])

  const handleSaveDiagram = useCallback((savedDiagram: any) => {
    setCurrentDiagram(savedDiagram)
    setNotification({
      open: true,
      message: `Diagramm "${savedDiagram.title}" erfolgreich gespeichert!`,
      severity: 'success',
    })
    console.log('Diagramm gespeichert:', savedDiagram)
  }, [])

  const handleOpenDiagram = useCallback(
    (diagram: any) => {
      if (excalidrawAPI && diagram.diagramJson) {
        try {
          const diagramData = JSON.parse(diagram.diagramJson)
          excalidrawAPI.updateScene({
            elements: diagramData.elements || [],
            appState: {
              ...diagramData.appState,
              viewBackgroundColor: '#ffffff',
            },
          })
          setCurrentDiagram(diagram)
          setNotification({
            open: true,
            message: `Diagramm "${diagram.title}" erfolgreich geladen!`,
            severity: 'success',
          })
          console.log('Diagramm geladen:', diagram)
        } catch (error) {
          console.error('Fehler beim Laden des Diagramms:', error)
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

  // Initialisiert die API und ruft sie bei Bedarf auf
  const handleExcalidrawAPI = useCallback(
    (api: any) => {
      setExcalidrawAPI(api)

      // Wenn die Bibliothek bereits geladen ist, registriere sie
      if (archimateLibrary) {
        try {
          // In neueren Versionen von Excalidraw wird die Bibliothek automatisch aus initialData geladen
          console.log('ArchiMate-Bibliothek geladen und für Excalidraw verfügbar gemacht')
        } catch (error) {
          console.error('Fehler beim Registrieren der ArchiMate-Bibliothek:', error)
        }
      }
    },
    [archimateLibrary]
  )

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }))
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

  // Handle Drag Start from Library Panel
  const handleElementDragStart = useCallback(
    (element: LibraryElement, elementType: ElementType) => {
      setDraggedElement({ element, elementType })
    },
    []
  )

  // Handle Drop into Excalidraw Canvas
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!draggedElement || !excalidrawAPI) return

      // Hole die Mausposition relativ zur Canvas
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Konvertiere Screen-Koordinaten zu Scene-Koordinaten
      const sceneCoords = excalidrawAPI.getSceneCoords({ clientX: x, clientY: y })

      try {
        // Erstelle neue Excalidraw-Elemente aus dem Library-Element
        const newElements = createExcalidrawElementFromLibraryItem(
          draggedElement.element,
          draggedElement.elementType,
          { x: sceneCoords.x, y: sceneCoords.y }
        )

        // Füge die Elemente zur Scene hinzu
        const existingElements = excalidrawAPI.getSceneElements()
        excalidrawAPI.updateScene({
          elements: [...existingElements, ...newElements],
        })

        setNotification({
          open: true,
          message: `${draggedElement.element.name} erfolgreich hinzugefügt!`,
          severity: 'success',
        })

        console.log('Element hinzugefügt:', {
          libraryElement: draggedElement.element,
          excalidrawElements: newElements,
        })
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Elements:', error)
        setNotification({
          open: true,
          message: 'Fehler beim Hinzufügen des Elements',
          severity: 'error',
        })
      }

      // Reset drag state
      setDraggedElement(null)
    },
    [draggedElement, excalidrawAPI]
  )

  // UI Optionen für Excalidraw - Vollständige Anpassung des Menüs
  const uiOptions = {
    canvasActions: {
      export: false as const, // Deaktiviere Export komplett
      saveAsImage: true,
      loadScene: false, // Deaktiviere Standard-Load
      saveToActiveFile: false, // Deaktiviere Standard-Save
      toggleTheme: null, // Deaktiviere Theme-Toggle komplett
      clearCanvas: true,
      changeViewBackgroundColor: true,
    },
    tools: {
      image: true,
      text: true,
      arrow: true,
      line: true,
      rectangle: true,
      diamond: true,
      ellipse: true,
      eraser: true,
    },
    // Aktiviere Bibliotheken
    libraryReturnUrl: window.location.href, // Wichtig für Bibliotheken-Support
    // Verstecke verschiedene UI-Elemente
    dockedSidebarBreakpoint: 1000, // Aktiviere Sidebar für Bibliotheken-Unterstützung
    welcomeScreen: false, // Kein Welcome Screen
  }

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {/* Wenn nicht client-seitig, leeren Container rendern für konsistentes SSR */}
      {!isClient ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Typography variant="h5">Lade Diagram-Editor...</Typography>
        </Box>
      ) : (
        <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
          {/* Main Excalidraw Editor */}
          <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
            <ExcalidrawWrapper
              onOpenDialog={() => setOpenDialogOpen(true)}
              onSaveDialog={() => setSaveDialogOpen(true)}
              excalidrawAPI={handleExcalidrawAPI}
              uiOptions={uiOptions}
              initialData={initialData}
              onDrop={handleDrop}
              viewModeEnabled={isViewer()}
            />

            {/* Floating Library Toggle Button - only for non-viewer users */}
            {!isViewer() && (
              <Fab
                color="primary"
                aria-label="Bibliothek öffnen"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1000,
                }}
                onClick={() => setLibraryPanelOpen(true)}
                title="Architektur-Bibliothek (Strg+L)"
              >
                <LibraryBooks />
              </Fab>
            )}
          </Box>

          {/* Database Library Panel */}
          <Drawer
            anchor="right"
            open={libraryPanelOpen}
            onClose={() => setLibraryPanelOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 350,
                maxWidth: '90vw',
                height: '100%',
                boxSizing: 'border-box',
              },
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Close Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={() => setLibraryPanelOpen(false)} size="small">
                  <Close />
                </IconButton>
              </Box>

              {/* Library Panel Content */}
              <Box sx={{ flex: 1 }}>
                <DatabaseLibraryPanel onElementDragStart={handleElementDragStart} />
              </Box>
            </Box>
          </Drawer>

          {/* Save Dialog */}
          <SaveDiagramDialog
            open={saveDialogOpen}
            onClose={() => setSaveDialogOpen(false)}
            onSave={handleSaveDiagram}
            diagramData={getCurrentDiagramData()}
            existingDiagram={currentDiagram}
          />

          {/* Open Dialog */}
          <OpenDiagramDialog
            open={openDialogOpen}
            onClose={() => setOpenDialogOpen(false)}
            onOpen={handleOpenDiagram}
          />
        </Box>
      )}

      {/* Benachrichtigungen */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
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
