import { useCallback } from 'react'
import { useApolloClient } from '@apollo/client'
import { NotificationState } from '../types/DiagramTypes'
import {
  syncDiagramOnOpen,
  syncDiagramOnSave,
  clearMissingElementMarkers,
} from '../databaseSyncUtils'
import {
  saveSceneToStorage,
  saveDiagramToStorage,
  saveLastSavedSceneToStorage,
  clearDiagramStorage,
  saveViewportStateToStorage,
  loadViewportStateFromStorage,
} from '../utils/DiagramStorage'

// Handlers für alle Diagram-Operationen
export const useDiagramHandlers = (
  excalidrawAPI: any,
  currentDiagram: any,
  setCurrentDiagram: (diagram: any) => void,
  setCurrentScene: (scene: any) => void,
  setHasUnsavedChanges: (hasChanges: boolean) => void,
  setLastSavedScene: (scene: any) => void,
  setNotification: (notification: NotificationState) => void,
  setSaveDialogOpen: (open: boolean) => void,
  setSaveAsDialogOpen: (open: boolean) => void,
  lastSavedScene: any
) => {
  const apolloClient = useApolloClient()
  // New Diagram Handler
  const handleNewDiagram = useCallback(() => {
    if (!excalidrawAPI) return

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
      clearDiagramStorage()
    }, 0)

    setNotification({
      open: true,
      message: 'Neues Diagramm erstellt',
      severity: 'info',
    })
  }, [
    excalidrawAPI,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
  ])

  // Delete Diagram Handler
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
    clearDiagramStorage()

    setNotification({
      open: true,
      message: 'Diagramm erfolgreich gelöscht',
      severity: 'success',
    })
  }, [excalidrawAPI, setCurrentDiagram, setCurrentScene, setNotification])

  // Open Diagram Handler
  const handleOpenDiagram = useCallback(
    async (diagram: any) => {
      console.log('handleOpenDiagram: Starting to open diagram', {
        diagramId: diagram.id,
        diagramTitle: diagram.title,
        hasJson: !!diagram.diagramJson,
      })

      if (!excalidrawAPI || !diagram.diagramJson) {
        console.warn('Cannot open diagram: missing API or diagram data')
        setNotification({
          open: true,
          message: 'Diagramm kann nicht geöffnet werden - fehlende Daten',
          severity: 'error',
        })
        return
      }

      try {
        // Parse the diagram JSON data
        const diagramData = JSON.parse(diagram.diagramJson)
        console.log('handleOpenDiagram: Parsed diagram data', {
          elementsCount: diagramData.elements?.length || 0,
        })

        // Try to sync from database with Docker-safe error handling
        let syncedDiagramData
        try {
          syncedDiagramData = await syncDiagramOnOpen(apolloClient, diagramData)
          console.log('handleOpenDiagram: Synced from database', {
            elementsCount: syncedDiagramData?.elements?.length || 0,
          })
        } catch (syncError) {
          console.warn('Database sync failed, using local data:', syncError)
          syncedDiagramData = diagramData
          console.log('handleOpenDiagram: Using local data', {
            elementsCount: syncedDiagramData?.elements?.length || 0,
          })
        }

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

        // Restore viewport state (position and zoom) if available
        const savedViewportState = loadViewportStateFromStorage()
        if (savedViewportState) {
          console.log('handleOpenDiagram: Applying saved viewport state', savedViewportState)
          sceneData.appState.scrollX = savedViewportState.scrollX
          sceneData.appState.scrollY = savedViewportState.scrollY
          sceneData.appState.zoom = { value: savedViewportState.zoom }
        }

        const restoredScene = restoreSceneData(sceneData)

        console.log('handleOpenDiagram: Scene prepared', {
          elementsCount: restoredScene.elements?.length || 0,
          hasAppState: !!restoredScene.appState,
          scrollX: restoredScene.appState?.scrollX,
          scrollY: restoredScene.appState?.scrollY,
          zoom: restoredScene.appState?.zoom?.value,
        })

        // Sofort die Excalidraw-Szene aktualisieren (mit integrierter Viewport-Position)
        console.log('handleOpenDiagram: Updating scene immediately')
        excalidrawAPI.updateScene(restoredScene)

        // Apply viewport state with delay to ensure it takes effect after Excalidraw initialization
        if (savedViewportState) {
          setTimeout(() => {
            console.log('handleOpenDiagram: Re-applying viewport state with delay', savedViewportState)
            excalidrawAPI.updateScene({
              appState: {
                scrollX: savedViewportState.scrollX,
                scrollY: savedViewportState.scrollY,
                zoom: { value: savedViewportState.zoom },
              },
            })
          }, 100) // Small delay to ensure Excalidraw has finished its initial setup
        }

        // State-Updates können asynchron erfolgen
        setTimeout(() => {
          console.log('handleOpenDiagram: Updating React state')
          setCurrentDiagram(diagram)
          setCurrentScene(restoredScene)
          setHasUnsavedChanges(false)
          setLastSavedScene(restoredScene)

          // Persist to localStorage
          saveSceneToStorage(restoredScene)
          saveDiagramToStorage(diagram)
        }, 0)

        setNotification({
          open: true,
          message: `Diagramm "${diagram.title}" erfolgreich geladen!`,
          severity: 'success',
        })
      } catch (err) {
        console.error('Error opening diagram:', err)
        setNotification({
          open: true,
          message: 'Fehler beim Öffnen des Diagramms',
          severity: 'error',
        })
      }
    },
    [
      apolloClient,
      excalidrawAPI,
      setCurrentDiagram,
      setCurrentScene,
      setHasUnsavedChanges,
      setLastSavedScene,
      setNotification,
    ]
  )

  // Save Diagram Handler
  const handleSaveDiagram = useCallback(
    async (savedDiagram: any) => {
      if (!excalidrawAPI) return

      try {
        const elements = excalidrawAPI.getSceneElements()
        const appState = excalidrawAPI.getAppState()

        const sceneData = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        }

        // Try to sync to database with error handling
        try {
          await syncDiagramOnSave(apolloClient, sceneData)
        } catch (syncError) {
          console.warn('Database sync failed during save:', syncError)
          // Continue with local saving even if sync fails
        }

        setCurrentDiagram(savedDiagram)
        setHasUnsavedChanges(false)
        setLastSavedScene(sceneData)

        // Persist to localStorage
        saveSceneToStorage(sceneData)
        saveDiagramToStorage(savedDiagram)
        saveLastSavedSceneToStorage(sceneData)

        setNotification({
          open: true,
          message: `Diagramm "${savedDiagram.title}" erfolgreich gespeichert!`,
          severity: 'success',
        })
      } catch (err) {
        console.error('Error saving diagram:', err)
        setNotification({
          open: true,
          message: 'Fehler beim Speichern des Diagramms',
          severity: 'error',
        })
      }
    },
    [
      apolloClient,
      excalidrawAPI,
      setCurrentDiagram,
      setHasUnsavedChanges,
      setLastSavedScene,
      setNotification,
    ]
  )

  // Save As Diagram Handler
  const handleSaveAsDiagram = useCallback(
    (savedDiagram: any) => {
      setCurrentDiagram(savedDiagram)

      // Persist current diagram to localStorage
      saveDiagramToStorage(savedDiagram)

      setNotification({
        open: true,
        message: `Diagramm "${savedDiagram.title}" erfolgreich als Kopie gespeichert!`,
        severity: 'success',
      })
    },
    [setCurrentDiagram, setNotification]
  )

  // Change Handler - tracks changes and detects unsaved state
  const handleChange = useCallback(
    (elements: any[], appState: any) => {
      // Save viewport state (scrollX, scrollY, zoom) to localStorage whenever it changes
      // Use a debounced approach to avoid excessive localStorage writes
      if (appState && 
          typeof appState.scrollX === 'number' && 
          typeof appState.scrollY === 'number' && 
          appState.zoom?.value) {
        
        const viewportState = {
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
          zoom: appState.zoom.value, // Extract the actual zoom value
        }
        
        // Only save if viewport has actually changed to avoid excessive writes
        const existingState = loadViewportStateFromStorage()
        if (!existingState || 
            Math.abs(existingState.scrollX - viewportState.scrollX) > 1 ||
            Math.abs(existingState.scrollY - viewportState.scrollY) > 1 ||
            Math.abs(existingState.zoom - viewportState.zoom) > 0.01) {
          saveViewportStateToStorage(viewportState)
        }
      }

      // Only track changes if we have a current diagram loaded
      if (currentDiagram && lastSavedScene) {
        // Compare current state with last saved state
        const currentElementsStr = JSON.stringify(elements)
        const lastSavedElementsStr = JSON.stringify(lastSavedScene.elements || [])

        const hasChanges = currentElementsStr !== lastSavedElementsStr
        setHasUnsavedChanges(hasChanges)

        // Create scene data for persistence without triggering state update
        const currentScene = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        }

        // Persist current state to localStorage for crash recovery only
        // Do NOT call setCurrentScene here to prevent infinite loops
        saveSceneToStorage(currentScene)
      }
    },
    [currentDiagram, lastSavedScene, setHasUnsavedChanges]
  )

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
          },
        }

        const dataStr = JSON.stringify(exportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const exportFileDefaultName = currentDiagram
          ? `${currentDiagram.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.excalidraw`
          : 'diagram.excalidraw'

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()

        setNotification({
          open: true,
          message: 'JSON erfolgreich exportiert!',
          severity: 'success',
        })
      } catch (err) {
        console.error('Error exporting JSON:', err)
        setNotification({
          open: true,
          message: 'Fehler beim JSON Export',
          severity: 'error',
        })
      }
    }
  }, [excalidrawAPI, currentDiagram, setNotification])

  // JSON Import Handler
  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.excalidraw,.json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          try {
            const importedData = JSON.parse(e.target.result)
            if (importedData.elements && excalidrawAPI) {
              const restoredScene = restoreSceneData({
                elements: importedData.elements,
                appState: importedData.appState || { viewBackgroundColor: '#ffffff' },
              })
              excalidrawAPI.updateScene(restoredScene)
              setCurrentScene(restoredScene)

              // Clear current diagram since this is an import
              setCurrentDiagram(null)
              clearDiagramStorage()

              setNotification({
                open: true,
                message: 'JSON erfolgreich importiert!',
                severity: 'success',
              })
            } else {
              throw new Error('Invalid file format')
            }
          } catch (err) {
            console.error('Error importing JSON:', err)
            setNotification({
              open: true,
              message: 'Fehler beim JSON Import - ungültiges Format',
              severity: 'error',
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [excalidrawAPI, setCurrentScene, setCurrentDiagram, setNotification])

  // PNG Export Handler
  const handleExportPNG = useCallback(() => {
    if (excalidrawAPI) {
      try {
        // Use the built-in export function from Excalidraw
        excalidrawAPI.getSceneElementsIncludingDeleted()
        setNotification({
          open: true,
          message: 'PNG Export gestartet...',
          severity: 'info',
        })
      } catch (err) {
        console.error('Error exporting PNG:', err)
        setNotification({
          open: true,
          message: 'Fehler beim PNG Export',
          severity: 'error',
        })
      }
    }
  }, [excalidrawAPI, setNotification])

  // Manual Sync Handler
  const handleManualSync = useCallback(async () => {
    if (!excalidrawAPI) {
      setNotification({
        open: true,
        message: 'Excalidraw API nicht verfügbar',
        severity: 'error',
      })
      return
    }

    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()

      const sceneData = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
        },
      }

      console.log('Starting manual database synchronization...')

      // Use syncDiagramOnOpen for manual synchronization (loads fresh data from database)
      const syncedDiagramData = await syncDiagramOnOpen(apolloClient, sceneData)

      // Clear any missing element markers if no missing elements found
      const cleanedElements = clearMissingElementMarkers(syncedDiagramData.elements)

      // Update the scene with synced and cleaned elements
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({
          elements: cleanedElements,
          appState: {
            ...syncedDiagramData.appState,
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        })
      }

      setNotification({
        open: true,
        message: 'Datenbankssynchronisation erfolgreich abgeschlossen!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Manual sync failed:', err)
      setNotification({
        open: true,
        message: `Fehler bei der Datenbank-Synchronisation: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        severity: 'error',
      })
    }
  }, [apolloClient, excalidrawAPI, setNotification])

  return {
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
  }
}

// Helper function that was in the original component
const restoreSceneData = (sceneData: any) => {
  if (!sceneData || !sceneData.appState) {
    return sceneData
  }

  // Remove problematic properties that can cause issues in Docker environments
  if (
    sceneData.appState.collaborators &&
    typeof sceneData.appState.collaborators.clear === 'function'
  ) {
    sceneData.appState.collaborators.clear()
  } else {
    sceneData.appState.collaborators = new Map()
  }

  // Initialize editing states ONLY if they are undefined/null to prevent controlled/uncontrolled issues
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

  return sceneData
}
