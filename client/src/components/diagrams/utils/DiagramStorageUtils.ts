import { STORAGE_KEYS } from '../types/DiagramTypes'
import { optimizeDiagramOnOpen, optimizeDiagramOnSave } from './diagramOptimizationUtils'

// Viewport State Interface
export interface ViewportState {
  scrollX: number
  scrollY: number
  zoom: number
}

/**
 * Helper function to restore Maps and fix serialization issues
 */
export const restoreSceneData = (sceneData: any) => {
  if (!sceneData || !sceneData.appState) {
    return sceneData
  }

  // Optimize diagram data by replacing originalElement with elementName
  const optimizedSceneData = optimizeDiagramOnOpen(sceneData)

  // Remove problematic properties that can cause issues in Docker environments
  if (
    optimizedSceneData.appState.collaborators &&
    typeof optimizedSceneData.appState.collaborators.clear === 'function'
  ) {
    optimizedSceneData.appState.collaborators.clear()
  } else {
    optimizedSceneData.appState.collaborators = new Map()
  }

  // Initialize editing states ONLY if they are undefined/null to prevent controlled/uncontrolled issues
  // DO NOT reset existing valid values as this causes React warnings
  if (
    optimizedSceneData.appState.selectedElementIds === undefined ||
    optimizedSceneData.appState.selectedElementIds === null
  ) {
    optimizedSceneData.appState.selectedElementIds = {}
  }
  if (
    optimizedSceneData.appState.hoveredElementIds === undefined ||
    optimizedSceneData.appState.hoveredElementIds === null
  ) {
    optimizedSceneData.appState.hoveredElementIds = {}
  }
  if (
    optimizedSceneData.appState.selectedGroupIds === undefined ||
    optimizedSceneData.appState.selectedGroupIds === null
  ) {
    optimizedSceneData.appState.selectedGroupIds = {}
  }
  if (optimizedSceneData.appState.selectedLinearElement === undefined) {
    optimizedSceneData.appState.selectedLinearElement = null
  }
  if (optimizedSceneData.appState.editingLinearElement === undefined) {
    optimizedSceneData.appState.editingLinearElement = null
  }
  // Ensure proper timing-independent state
  if (
    optimizedSceneData.appState.isLoading === undefined ||
    optimizedSceneData.appState.isLoading === null
  ) {
    optimizedSceneData.appState.isLoading = false
  }
  if (optimizedSceneData.appState.errorMessage === undefined) {
    optimizedSceneData.appState.errorMessage = null
  }

  return optimizedSceneData
}

/**
 * Load persisted scene from localStorage with error handling
 */
export const loadPersistedScene = (): any | null => {
  try {
    const persistedScene = localStorage.getItem(STORAGE_KEYS.SCENE)
    if (persistedScene) {
      const sceneData = JSON.parse(persistedScene)
      return restoreSceneData(sceneData)
    }
  } catch (error) {
    console.warn('Failed to load persisted scene:', error)
    localStorage.removeItem(STORAGE_KEYS.SCENE)
  }
  return null
}

/**
 * Load persisted diagram from localStorage with error handling
 */
export const loadPersistedDiagram = (): any | null => {
  try {
    const persistedDiagram = localStorage.getItem(STORAGE_KEYS.CURRENT_DIAGRAM)
    if (persistedDiagram) {
      return JSON.parse(persistedDiagram)
    }
  } catch (error) {
    console.warn('Failed to load persisted diagram:', error)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DIAGRAM)
  }
  return null
}

/**
 * Load last saved scene from localStorage with error handling
 */
export const loadLastSavedScene = (): any | null => {
  try {
    const lastSaved = localStorage.getItem(STORAGE_KEYS.LAST_SAVED_SCENE)
    if (lastSaved) {
      return JSON.parse(lastSaved)
    }
  } catch (error) {
    console.warn('Failed to load last saved scene:', error)
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_SCENE)
  }
  return null
}

/**
 * Save scene to localStorage
 */
export const saveSceneToStorage = (sceneData: any): void => {
  try {
    // Optimize scene data before saving by removing redundant originalElement data
    const optimizedSceneData = optimizeDiagramOnSave(sceneData)
    localStorage.setItem(STORAGE_KEYS.SCENE, JSON.stringify(optimizedSceneData))
  } catch (error) {
    console.warn('Failed to save scene to localStorage:', error)
  }
}

/**
 * Save diagram to localStorage
 */
export const saveDiagramToStorage = (diagram: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DIAGRAM, JSON.stringify(diagram))
  } catch (error) {
    console.warn('Failed to save diagram to localStorage:', error)
  }
}

/**
 * Save last saved scene to localStorage
 */
export const saveLastSavedSceneToStorage = (sceneData: any): void => {
  try {
    // Optimize scene data before saving by removing redundant originalElement data
    const optimizedSceneData = optimizeDiagramOnSave(sceneData)
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED_SCENE, JSON.stringify(optimizedSceneData))
  } catch (error) {
    console.warn('Failed to save last saved scene to localStorage:', error)
  }
}

/**
 * Clear all diagram storage
 */
export const clearDiagramStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SCENE)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DIAGRAM)
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED_SCENE)
    localStorage.removeItem(STORAGE_KEYS.VIEWPORT_STATE)
  } catch (error) {
    console.warn('Failed to clear diagram storage:', error)
  }
}

/**
 * Save viewport state (position and zoom) to localStorage
 */
export const saveViewportStateToStorage = (viewportState: ViewportState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.VIEWPORT_STATE, JSON.stringify(viewportState))
  } catch (error) {
    console.warn('Failed to save viewport state to localStorage:', error)
  }
}

/**
 * Load viewport state from localStorage
 */
export const loadViewportStateFromStorage = (): ViewportState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEWPORT_STATE)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate the structure
      if (
        typeof parsed.scrollX === 'number' &&
        typeof parsed.scrollY === 'number' &&
        typeof parsed.zoom === 'number'
      ) {
        return parsed
      } else {
        console.warn('Invalid viewport state structure:', parsed)
      }
    }
  } catch (error) {
    console.warn('Failed to load viewport state:', error)
    localStorage.removeItem(STORAGE_KEYS.VIEWPORT_STATE)
  }
  return null
}

/**
 * Clear only viewport state from localStorage
 */
export const clearViewportStateFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.VIEWPORT_STATE)
  } catch (error) {
    console.warn('Failed to clear viewport state:', error)
  }
}
