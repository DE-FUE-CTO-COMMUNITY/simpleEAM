import { useState, useEffect, useRef } from 'react'
import { DialogStates, NotificationState } from '../types/DiagramTypes'
import { isViewer } from '@/lib/auth'
import { loadPersistedScene, loadPersistedDiagram } from '../utils/DiagramStorage'

// Custom Hook für den Diagram State
export const useDiagramState = () => {
  const [isClient, setIsClient] = useState(false)
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [currentDiagram, setCurrentDiagram] = useState<any>(null)
  const [currentScene, setCurrentScene] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedScene, setLastSavedScene] = useState<any>(null)

  // Track if scene has been restored to prevent multiple restorations
  const sceneRestoredRef = useRef(false)

  // Reset restoration flag when currentScene changes significantly
  useEffect(() => {
    sceneRestoredRef.current = false
  }, [currentScene?.elements?.length, currentDiagram?.id])

  // Dialog States
  const [dialogStates, setDialogStates] = useState<DialogStates>({
    saveDialogOpen: false,
    saveAsDialogOpen: false,
    openDialogOpen: false,
    deleteDialogOpen: false,
  })

  // Notification State
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  })

  // Client-side initialization effect
  useEffect(() => {
    // Ensure proper client-side initialization for Docker containers
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure DOM is ready and prevent hydration mismatches
      const initializeClient = () => {
        setIsClient(true)

        // Load persisted scene from localStorage with Docker-safe error handling
        try {
          const persistedScene = loadPersistedScene()
          if (persistedScene) {
            setCurrentScene(persistedScene)
          }
        } catch (error) {
          console.warn('Failed to load persisted scene:', error)
          localStorage.removeItem('excalidraw-scene')
        }

        try {
          const persistedDiagram = loadPersistedDiagram()
          if (persistedDiagram) {
            setCurrentDiagram(persistedDiagram)
          }
        } catch (error) {
          console.warn('Failed to load persisted diagram:', error)
          localStorage.removeItem('excalidraw-current-diagram')
        }
      }

      // Use small delay to ensure proper hydration in Docker environments
      const timeoutId = setTimeout(initializeClient, 50)
      return () => clearTimeout(timeoutId)
    }
  }, []) // Scene restoration effect - only restore once when API becomes available
  useEffect(() => {
    if (excalidrawAPI && isClient && currentScene && !sceneRestoredRef.current) {
      // Use setTimeout to ensure proper timing in Docker containers
      const restoreTimeout = setTimeout(() => {
        try {
          // Always try to restore scene if we have data, regardless of element count
          if (currentScene && (currentScene.elements || currentScene.appState)) {
            const currentElements = excalidrawAPI.getSceneElements()

            // Update scene if we have saved data and it's different from current
            const hasElements = currentScene.elements && currentScene.elements.length > 0
            const shouldRestore = hasElements || !currentElements || currentElements.length === 0

            if (shouldRestore) {
              const restoredScene = restoreSceneData(currentScene)
              excalidrawAPI.updateScene(restoredScene)
              sceneRestoredRef.current = true // Mark as restored

              console.log('Scene restored with', currentScene.elements?.length || 0, 'elements')
            }
          }
        } catch (error) {
          console.warn('Failed to restore scene:', error)
        }
      }, 150) // Increased delay for Docker timing

      return () => clearTimeout(restoreTimeout)
    }
  }, [excalidrawAPI, isClient, currentScene]) // Include currentScene but with proper loop prevention

  const updateDialogState = (dialogName: keyof DialogStates, open: boolean) => {
    setDialogStates(prev => ({
      ...prev,
      [dialogName]: open,
    }))
  }

  return {
    // State values
    isClient,
    excalidrawAPI,
    currentDiagram,
    currentScene,
    hasUnsavedChanges,
    lastSavedScene,
    dialogStates,
    notification,

    // State setters
    setExcalidrawAPI,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
    updateDialogState,
  }
}

// Helper function for scene data restoration
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

// UI Options Hook
export const useUIOptions = () => {
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

  return uiOptions
}
