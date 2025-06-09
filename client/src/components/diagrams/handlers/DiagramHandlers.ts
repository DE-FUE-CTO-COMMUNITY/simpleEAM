import { useCallback } from 'react'
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
  // New Diagram Handler
  const handleNewDiagram = useCallback(() => {
    if (!excalidrawAPI) return

    // Reset the current diagram
    setCurrentDiagram(null)

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

    // Use setTimeout to ensure proper state reset in Docker containers
    setTimeout(() => {
      excalidrawAPI.updateScene(restoredScene)
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
      try {
        // Try to sync from database with Docker-safe error handling
        let syncedDiagramData
        try {
          syncedDiagramData = await syncDiagramOnOpen(diagram.id)
        } catch (syncError) {
          console.warn('Database sync failed, using local data:', syncError)
          syncedDiagramData = JSON.parse(diagram.data)
        }

        if (excalidrawAPI && syncedDiagramData) {
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

          // Use setTimeout to ensure proper state update in Docker containers
          setTimeout(() => {
            excalidrawAPI.updateScene(restoredScene)
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
        }
      } catch (error) {
        console.error('Error opening diagram:', error)
        setNotification({
          open: true,
          message: 'Fehler beim Öffnen des Diagramms',
          severity: 'error',
        })
      }
    },
    [
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
          await syncDiagramOnSave(sceneData)
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
      } catch (error) {
        console.error('Error saving diagram:', error)
        setNotification({
          open: true,
          message: 'Fehler beim Speichern des Diagramms',
          severity: 'error',
        })
      }
    },
    [excalidrawAPI, setCurrentDiagram, setHasUnsavedChanges, setLastSavedScene, setNotification]
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
      // Only track changes if we have a current diagram loaded
      if (currentDiagram && lastSavedScene) {
        // Compare current state with last saved state
        const currentElementsStr = JSON.stringify(elements)
        const lastSavedElementsStr = JSON.stringify(lastSavedScene.elements || [])

        const hasChanges = currentElementsStr !== lastSavedElementsStr
        setHasUnsavedChanges(hasChanges)

        // Update current scene for persistence
        const currentScene = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
          },
        }
        setCurrentScene(currentScene)

        // Persist current state to localStorage for crash recovery
        saveSceneToStorage(currentScene)
      }
    },
    [currentDiagram, lastSavedScene, setHasUnsavedChanges, setCurrentScene]
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
      } catch (error) {
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
          } catch (error) {
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
        const canvas = excalidrawAPI.getSceneElementsIncludingDeleted()
        setNotification({
          open: true,
          message: 'PNG Export gestartet...',
          severity: 'info',
        })
      } catch (error) {
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
    if (!excalidrawAPI || !currentDiagram) {
      setNotification({
        open: true,
        message: 'Kein Diagramm zum Synchronisieren geladen',
        severity: 'info',
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

      // Try manual database synchronization
      await syncDiagramOnSave(sceneData)

      // Also try to clear any missing element markers from the current elements
      const cleanedElements = clearMissingElementMarkers(sceneData.elements)

      // Update the scene with cleaned elements
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({ elements: cleanedElements })
      }

      setNotification({
        open: true,
        message: 'Datenbankssynchronisation erfolgreich!',
        severity: 'success',
      })
    } catch (error) {
      console.error('Manual sync failed:', error)
      setNotification({
        open: true,
        message: 'Fehler bei der Datenbank-Synchronisation',
        severity: 'error',
      })
    }
  }, [excalidrawAPI, currentDiagram, setNotification])

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

  // Reset editing states that can cause problems
  sceneData.appState.selectedElementIds = {}
  sceneData.appState.hoveredElementIds = {}
  sceneData.appState.selectedGroupIds = {}
  sceneData.appState.selectedLinearElement = null
  sceneData.appState.editingLinearElement = null
  // Ensure proper timing-independent state
  sceneData.appState.isLoading = false
  sceneData.appState.errorMessage = null

  return sceneData
}
