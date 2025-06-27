import { STORAGE_KEYS } from '../types/DiagramTypes'

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
    localStorage.setItem(STORAGE_KEYS.SCENE, JSON.stringify(sceneData))
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
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED_SCENE, JSON.stringify(sceneData))
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
    console.log('Saving viewport state:', viewportState)
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
      if (typeof parsed.scrollX === 'number' && typeof parsed.scrollY === 'number' && typeof parsed.zoom === 'number') {
        console.log('Loaded viewport state:', parsed)
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
