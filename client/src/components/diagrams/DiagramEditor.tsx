'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Typography, Alert, Snackbar } from '@mui/material'
import dynamic from 'next/dynamic'
import SaveDiagramDialog from './SaveDiagramDialog'
import OpenDiagramDialog from './OpenDiagramDialog'

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
    }> = ({ onOpenDialog, onSaveDialog, excalidrawAPI, uiOptions, initialData }) => {
      return (
        <Excalidraw
          theme="light"
          name="simple-eam-diagram"
          UIOptions={uiOptions}
          initialData={initialData}
          excalidrawAPI={excalidrawAPI}
        >
          <MainMenu>
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
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.SaveToActiveFile />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.Export />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.Help />
            {/* Note: Socials are excluded - no MainMenu.DefaultItems.Socials */}
          </MainMenu>
        </Excalidraw>
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
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Custom App State for Excalidraw
  const initialData = {
    appState: {
      viewBackgroundColor: '#ffffff',
      currentItemFontFamily: 1,
    },
  }

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
    // Verstecke verschiedene UI-Elemente
    dockedSidebarBreakpoint: 0, // Deaktiviere Sidebar komplett
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
        <div style={{ height: '100%', width: '100%' }}>
          <ExcalidrawWrapper
            onOpenDialog={() => setOpenDialogOpen(true)}
            onSaveDialog={() => setSaveDialogOpen(true)}
            excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
            uiOptions={uiOptions}
            initialData={initialData}
          />

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
        </div>
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
