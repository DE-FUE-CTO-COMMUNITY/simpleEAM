'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Typography, Alert, Snackbar } from '@mui/material'
import { useApolloClient } from '@apollo/client'
import dynamic from 'next/dynamic'
import SaveDiagramDialog from './SaveDiagramDialog'
import OpenDiagramDialog from './OpenDiagramDialog'
import DeleteDiagramDialog from './DeleteDiagramDialog'
import IntegratedLibrary from './IntegratedLibrary'
import DiagramNameDisplay from './DiagramNameDisplay'
import { isViewer } from '@/lib/auth'
import {
  syncDiagramOnOpen,
  syncDiagramOnSave,
  clearMissingElementMarkers,
} from './databaseSyncUtils'

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
      onExportJSON: () => void
      onImportJSON: () => void
      onExportPNG: () => void
      onManualSync: () => void
      excalidrawAPI: (api: any) => void
      onChange?: (elements: any[], appState: any) => void
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
      onExportJSON,
      onImportJSON,
      onExportPNG,
      onManualSync,
      excalidrawAPI,
      onChange,
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
            onChange={onChange}
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
                  shortcut="Shift+Del"
                >
                  Löschen
                </MainMenuTyped.Item>
              )}

              {/* Manual Sync Menu Item - available for all users */}
              <MainMenuTyped.Item
                onSelect={onManualSync}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                  </svg>
                }
                shortcut="Ctrl+R"
              >
                DB Synchronisieren
              </MainMenuTyped.Item>

              {/* Separator */}
              <MainMenuTyped.Item onSelect={() => {}} className="hr" />

              {/* Export JSON Menu Item */}
              <MainMenuTyped.Item
                onSelect={onExportJSON}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V14H16V12H8Z" />
                  </svg>
                }
                shortcut="Ctrl+E"
              >
                JSON exportieren
              </MainMenuTyped.Item>

              {/* Export PNG Menu Item */}
              <MainMenuTyped.Item
                onSelect={onExportPNG}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,16L16,12H13.5V9H10.5V12H8L12,16Z" />
                  </svg>
                }
                shortcut="Ctrl+P"
              >
                PNG exportieren
              </MainMenuTyped.Item>

              {/* Import JSON Menu Item - only for non-viewer users */}
              {!viewModeEnabled && (
                <MainMenuTyped.Item
                  onSelect={onImportJSON}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V14H16V12H8Z M10,10V16H14V10H10Z" />
                    </svg>
                  }
                  shortcut="Ctrl+I"
                >
                  JSON importieren
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
  const apolloClient = useApolloClient()
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [currentDiagram, setCurrentDiagram] = useState<any>(null)
  const [currentScene, setCurrentScene] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedScene, setLastSavedScene] = useState<any>(null)

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

  // Helper function to restore Maps and fix serialization issues
  const restoreSceneData = (sceneData: any) => {
    if (sceneData && sceneData.appState) {
      // Ensure collaborators is always a Map, not a plain object
      sceneData.appState.collaborators = new Map()

      // Initialize properties ONLY if they are undefined/null to prevent controlled/uncontrolled issues
      // DO NOT reset existing valid values as this causes React warnings
      if (
        sceneData.appState.selectedElementIds === undefined ||
        sceneData.appState.selectedElementIds === null
      ) {
        sceneData.appState.selectedElementIds = {}
      }
      if (
        sceneData.appState.hoveredElementIds === undefined ||
        sceneData.appState.hoveredElementIds === null
      ) {
        sceneData.appState.hoveredElementIds = {}
      }
      if (
        sceneData.appState.selectedGroupIds === undefined ||
        sceneData.appState.selectedGroupIds === null
      ) {
        sceneData.appState.selectedGroupIds = {}
      }
      if (sceneData.appState.activeTool === undefined || sceneData.appState.activeTool === null) {
        sceneData.appState.activeTool = { type: 'selection' }
      }
      // Force reset of linear element selection states to prevent Docker container issues
      if (sceneData.appState.selectedLinearElement === undefined) {
        sceneData.appState.selectedLinearElement = null
      }
      if (sceneData.appState.editingLinearElement === undefined) {
        sceneData.appState.editingLinearElement = null
      }
      // Ensure proper timing-independent state
      if (sceneData.appState.isLoading === undefined || sceneData.appState.isLoading === null) {
        sceneData.appState.isLoading = false
      }
      if (sceneData.appState.errorMessage === undefined) {
        sceneData.appState.errorMessage = null
      }
    }
    return sceneData
  }

  useEffect(() => {
    // Ensure proper client-side initialization for Docker containers
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure DOM is ready and prevent hydration mismatches
      const initializeClient = () => {
        setIsClient(true)

        // Load persisted scene from localStorage with Docker-safe error handling
        try {
          const persistedScene = localStorage.getItem('excalidraw-scene')
          if (persistedScene) {
            const sceneData = JSON.parse(persistedScene)
            const restoredScene = restoreSceneData(sceneData)
            setCurrentScene(restoredScene)
          }
        } catch (error) {
          console.warn('Failed to load persisted scene:', error)
          localStorage.removeItem('excalidraw-scene')
        }

        try {
          const persistedDiagram = localStorage.getItem('excalidraw-current-diagram')
          if (persistedDiagram) {
            const diagramData = JSON.parse(persistedDiagram)
            setCurrentDiagram(diagramData)
          }
        } catch (error) {
          console.warn('Failed to load persisted diagram:', error)
          localStorage.removeItem('excalidraw-current-diagram')
        }

        try {
          const persistedLastSaved = localStorage.getItem('excalidraw-last-saved-scene')
          if (persistedLastSaved) {
            const lastSavedData = JSON.parse(persistedLastSaved)
            setLastSavedScene(lastSavedData)
          }
        } catch (error) {
          console.warn('Failed to load last saved scene:', error)
          localStorage.removeItem('excalidraw-last-saved-scene')
        }
      }

      // Use setTimeout to prevent hydration issues in Docker containers
      const timeoutId = setTimeout(initializeClient, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  const handleSaveDiagram = useCallback(
    async (savedDiagram: any) => {
      setCurrentDiagram(savedDiagram)
      setHasUnsavedChanges(false) // Reset unsaved changes flag

      // Synchronisiere Änderungen zurück zur Datenbank
      if (excalidrawAPI) {
        try {
          const currentElements = excalidrawAPI.getSceneElements()
          const currentAppState = excalidrawAPI.getAppState()
          const diagramData = { elements: currentElements, appState: currentAppState }

          const syncResult = await syncDiagramOnSave(apolloClient, diagramData)

          if (syncResult.updatedCount > 0) {
            setNotification({
              open: true,
              message: `Diagramm gespeichert und ${syncResult.updatedCount} Datenbank-Elemente aktualisiert!`,
              severity: 'success',
            })
          } else {
            setNotification({
              open: true,
              message: `Diagramm "${savedDiagram.title}" erfolgreich gespeichert!`,
              severity: 'success',
            })
          }

          // Store current scene as last saved state
          const sceneToSave = { elements: currentElements, appState: currentAppState }
          setLastSavedScene(sceneToSave)
          localStorage.setItem('excalidraw-last-saved-scene', JSON.stringify(sceneToSave))
        } catch (error) {
          console.error('Error syncing database elements:', error)
          setNotification({
            open: true,
            message: `Diagramm "${savedDiagram.title}" gespeichert, aber Datenbank-Synchronisation fehlgeschlagen`,
            severity: 'error',
          })
        }
      }

      // Persist current diagram to localStorage
      localStorage.setItem('excalidraw-current-diagram', JSON.stringify(savedDiagram))
    },
    [apolloClient, excalidrawAPI]
  )

  const handleOpenDiagram = useCallback(
    async (diagram: any) => {
      if (excalidrawAPI && diagram.diagramJson) {
        try {
          const diagramData = JSON.parse(diagram.diagramJson)

          // Synchronisiere Elemente mit der Datenbank
          const syncedDiagramData = await syncDiagramOnOpen(apolloClient, diagramData)

          const sceneData = {
            elements: syncedDiagramData.elements || [],
            appState: {
              ...syncedDiagramData.appState,
              viewBackgroundColor: syncedDiagramData.appState?.viewBackgroundColor || '#ffffff',
              // Docker-safe state restoration - reset problematic properties
              collaborators: new Map(),
              selectedElementIds: {},
              hoveredElementIds: {},
              selectedGroupIds: {},
              selectedLinearElement: null,
              editingLinearElement: null,
              activeTool: { type: 'selection' },
              isLoading: false,
              errorMessage: null,
            },
          }
          const restoredScene = restoreSceneData(sceneData)

          // Sofort die Excalidraw-Szene aktualisieren
          excalidrawAPI.updateScene(restoredScene)

          // State-Updates können asynchron erfolgen
          setTimeout(() => {
            setCurrentDiagram(diagram)
            setCurrentScene(restoredScene)
            setHasUnsavedChanges(false)
            setLastSavedScene(restoredScene)

            // Persist to localStorage
            localStorage.setItem('excalidraw-scene', JSON.stringify(restoredScene))
            localStorage.setItem('excalidraw-current-diagram', JSON.stringify(diagram))
          }, 0)

          setNotification({
            open: true,
            message: `Diagramm "${diagram.title}" erfolgreich geladen!`,
            severity: 'success',
          })
        } catch (error) {
          console.error('Error loading diagram:', error)
          setNotification({
            open: true,
            message: 'Fehler beim Laden des Diagramms',
            severity: 'error',
          })
        }
      }
    },
    [apolloClient, excalidrawAPI]
  )

  // Manual sync handler
  const handleManualSync = useCallback(async () => {
    if (!excalidrawAPI) return

    try {
      const currentElements = excalidrawAPI.getSceneElements()
      const currentAppState = excalidrawAPI.getAppState()
      const diagramData = { elements: currentElements, appState: currentAppState }

      // Sync with database
      const syncedDiagramData = await syncDiagramOnOpen(apolloClient, diagramData)

      // Clear missing element markers if requested
      const cleanedElements = clearMissingElementMarkers(syncedDiagramData.elements)

      // Update scene
      const updatedScene = {
        elements: cleanedElements,
        appState: currentAppState,
      }

      excalidrawAPI.updateScene(updatedScene)
      setCurrentScene(updatedScene)

      setNotification({
        open: true,
        message: 'Diagramm erfolgreich mit Datenbank synchronisiert!',
        severity: 'success',
      })
    } catch (error) {
      console.error('Manual sync error:', error)
      setNotification({
        open: true,
        message: 'Fehler bei der Datenbank-Synchronisation',
        severity: 'error',
      })
    }
  }, [apolloClient, excalidrawAPI])

  const handleNewDiagram = useCallback(() => {
    if (excalidrawAPI) {
      // Canvas leeren - Docker-safe empty scene
      const emptyScene = {
        elements: [],
        appState: {
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
        },
      }
      const restoredScene = restoreSceneData(emptyScene)

      // Sofort die Excalidraw-Szene aktualisieren
      excalidrawAPI.updateScene(restoredScene)

      // State-Updates können asynchron erfolgen
      setTimeout(() => {
        setCurrentDiagram(null)
        setCurrentScene(restoredScene)
        setHasUnsavedChanges(false)
        setLastSavedScene(restoredScene)

        // Clear localStorage
        localStorage.removeItem('excalidraw-scene')
        localStorage.removeItem('excalidraw-current-diagram')
      }, 0)

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
        collaborators: new Map(),
        selectedElementIds: {},
        hoveredElementIds: {},
        selectedGroupIds: {},
        activeTool: { type: 'selection' },
      },
    }
    const restoredScene = restoreSceneData(emptyScene)
    if (excalidrawAPI) {
      excalidrawAPI.updateScene(restoredScene)
    }
    setCurrentScene(restoredScene)
    // Clear localStorage
    localStorage.removeItem('excalidraw-scene')
    localStorage.removeItem('excalidraw-current-diagram')
    setNotification({
      open: true,
      message: 'Diagramm erfolgreich gelöscht',
      severity: 'success',
    })
  }, [excalidrawAPI])

  // JSON Export Handler
  const handleExportJSON = useCallback(() => {
    if (excalidrawAPI) {
      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        const exportData = {
          type: 'excalidraw',
          version: 2,
          source: 'simple-eam',
          elements: elements,
          appState: {
            // Only include essential and serializable app state properties
            viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: appState.currentItemFontFamily,
            currentItemFontSize: appState.currentItemFontSize,
            currentItemTextAlign: appState.currentItemTextAlign,
            currentItemStrokeColor: appState.currentItemStrokeColor,
            currentItemBackgroundColor: appState.currentItemBackgroundColor,
            currentItemFillStyle: appState.currentItemFillStyle,
            currentItemStrokeWidth: appState.currentItemStrokeWidth,
            currentItemStrokeStyle: appState.currentItemStrokeStyle,
            currentItemRoughness: appState.currentItemRoughness,
            currentItemOpacity: appState.currentItemOpacity,
            gridSize: appState.gridSize,
            showGrid: appState.showGrid,
            zenModeEnabled: appState.zenModeEnabled,
            theme: appState.theme,
            // Exclude problematic properties
            // collaborators, selectedElementIds, etc. are intentionally omitted
          },
        }

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)

        // Generate filename with diagram name if available
        const timestamp = new Date().toISOString().split('T')[0]
        let filename = `diagram-export-${timestamp}.json`

        if (currentDiagram && currentDiagram.title) {
          // Sanitize the diagram name for use in filename
          const sanitizedTitle = currentDiagram.title
            .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Remove special characters except spaces, hyphens, underscores
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase()
          filename = `${sanitizedTitle}-${timestamp}.json`
        }

        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setNotification({
          open: true,
          message: 'Diagramm erfolgreich als JSON exportiert',
          severity: 'success',
        })
      } catch (error) {
        console.error('JSON Export Error:', error)
        setNotification({
          open: true,
          message: 'Fehler beim JSON-Export',
          severity: 'error',
        })
      }
    }
  }, [excalidrawAPI, currentDiagram])

  // JSON Import Handler
  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (event: any) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        // Validate the JSON structure
        if (!data.elements || !Array.isArray(data.elements)) {
          throw new Error('Ungültiges Diagramm-Format: Elemente fehlen oder sind kein Array')
        }

        // Ensure each element has required properties
        const validElements = data.elements.filter(
          (el: any) => el && typeof el === 'object' && el.type && el.id
        )

        if (validElements.length !== data.elements.length) {
          console.warn('Einige Elemente wurden gefiltert aufgrund ungültiger Struktur')
        }

        const sceneData = {
          elements: validElements,
          appState: {
            viewBackgroundColor: data.appState?.viewBackgroundColor || '#ffffff',
            // Only include safe, basic app state properties
            currentItemFontFamily: data.appState?.currentItemFontFamily,
            currentItemFontSize: data.appState?.currentItemFontSize,
            gridSize: data.appState?.gridSize,
            showGrid: data.appState?.showGrid,
            theme: data.appState?.theme || 'light',
            // Ensure all problematic properties are reset to safe defaults
            collaborators: new Map(),
            isLoading: false,
            errorMessage: null,
            selectedElementIds: {},
            hoveredElementIds: {},
            selectedGroupIds: {},
            activeTool: { type: 'selection' },
          },
        }

        // Synchronize with database before importing
        const syncedSceneData = await syncDiagramOnOpen(apolloClient, sceneData)

        const restoredScene = restoreSceneData(syncedSceneData)

        if (excalidrawAPI) {
          excalidrawAPI.updateScene(restoredScene)
          setCurrentScene(restoredScene)
          // Clear current diagram as this is imported data
          setCurrentDiagram(null)
          // Persist to localStorage
          localStorage.setItem('excalidraw-scene', JSON.stringify(restoredScene))
          localStorage.removeItem('excalidraw-current-diagram')
        }

        setNotification({
          open: true,
          message: 'Diagramm erfolgreich aus JSON importiert',
          severity: 'success',
        })
      } catch (error) {
        setNotification({
          open: true,
          message: `Fehler beim JSON-Import: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
          severity: 'error',
        })
      }
    }

    input.click()
  }, [apolloClient, excalidrawAPI])

  // PNG Export Handler
  const handleExportPNG = useCallback(async () => {
    if (excalidrawAPI) {
      try {
        const { exportToBlob } = await import('@excalidraw/excalidraw')
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        const blob = await exportToBlob({
          elements,
          appState,
          files: excalidrawAPI.getFiles(),
          mimeType: 'image/png',
          quality: 1.0,
          exportBackground: true,
          exportPadding: 10,
        })

        const url = URL.createObjectURL(blob)

        // Generate filename with diagram name if available
        const timestamp = new Date().toISOString().split('T')[0]
        let filename = `diagram-export-${timestamp}.png`

        if (currentDiagram && currentDiagram.title) {
          // Sanitize the diagram name for use in filename
          const sanitizedTitle = currentDiagram.title
            .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Remove special characters except spaces, hyphens, underscores
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase()
          filename = `${sanitizedTitle}-${timestamp}.png`
        }

        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setNotification({
          open: true,
          message: 'Diagramm erfolgreich als PNG exportiert',
          severity: 'success',
        })
      } catch (error) {
        console.error('PNG Export Error:', error)
        setNotification({
          open: true,
          message: 'Fehler beim PNG-Export',
          severity: 'error',
        })
      }
    }
  }, [excalidrawAPI, currentDiagram])

  const handleSaveAsDiagram = useCallback((savedDiagram: any) => {
    setCurrentDiagram(savedDiagram)
    // Persist current diagram to localStorage
    localStorage.setItem('excalidraw-current-diagram', JSON.stringify(savedDiagram))
    setNotification({
      open: true,
      message: `Diagramm "${savedDiagram.title}" erfolgreich als Kopie gespeichert!`,
      severity: 'success',
    })
  }, [])

  // Handler to track changes and detect unsaved state
  const handleChange = useCallback(
    (elements: any[], appState: any) => {
      // Only track changes if we have a current diagram loaded
      if (currentDiagram && lastSavedScene) {
        // Compare current state with last saved state
        const currentElementsStr = JSON.stringify(elements)
        const lastSavedElementsStr = JSON.stringify(lastSavedScene.elements || [])

        const hasChanges = currentElementsStr !== lastSavedElementsStr
        setHasUnsavedChanges(hasChanges)
      } else if (!currentDiagram && elements.length > 0) {
        // If no diagram is loaded but there are elements, mark as unsaved
        setHasUnsavedChanges(true)
      } else if (!currentDiagram && elements.length === 0) {
        // If no diagram and no elements, no unsaved changes
        setHasUnsavedChanges(false)
      }

      // Auto-save to localStorage
      const sceneData = { elements, appState }
      localStorage.setItem('excalidraw-scene', JSON.stringify(sceneData))
    },
    [currentDiagram, lastSavedScene]
  )

  // Initialisiert die API und ruft sie bei Bedarf auf
  const handleExcalidrawAPI = useCallback((api: any) => {
    setExcalidrawAPI(api)
  }, [])

  // Load persisted scene when API becomes available
  useEffect(() => {
    if (excalidrawAPI && currentScene && currentScene.elements) {
      // Only load if there are actually elements to load
      if (currentScene.elements.length > 0) {
        const restoredScene = restoreSceneData(currentScene)
        excalidrawAPI.updateScene(restoredScene)
      }
    }
  }, [excalidrawAPI, currentScene])

  // Keyboard shortcuts handling
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Only handle shortcuts for non-viewer users
      if (isViewer()) return

      // Handle Shift+Delete for diagram deletion
      if (event.key === 'Delete' && event.shiftKey && currentDiagram) {
        event.preventDefault()
        setDeleteDialogOpen(true)
        return
      }

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
          case 'e':
            event.preventDefault()
            // Ctrl+E - Export JSON
            handleExportJSON()
            break
          case 'i':
            event.preventDefault()
            // Ctrl+I - Import JSON
            handleImportJSON()
            break
          case 'p':
            event.preventDefault()
            // Ctrl+P - Export PNG
            handleExportPNG()
            break
          case 'r':
            event.preventDefault()
            // Ctrl+R - Manual Database Sync
            handleManualSync()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts)
    }
  }, [
    handleNewDiagram,
    currentDiagram,
    handleExportJSON,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
  ])

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
        {/* Diagram Name Display - positioned next to MainMenu */}
        <DiagramNameDisplay
          currentDiagram={currentDiagram}
          hasUnsavedChanges={hasUnsavedChanges}
          onSaveClick={() => setSaveDialogOpen(true)}
        />

        <ExcalidrawWrapper
          onOpenDialog={() => setOpenDialogOpen(true)}
          onSaveDialog={() => setSaveDialogOpen(true)}
          onSaveAsDialog={() => setSaveAsDialogOpen(true)}
          onNewDiagram={handleNewDiagram}
          onDeleteDialog={() => setDeleteDialogOpen(true)}
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
