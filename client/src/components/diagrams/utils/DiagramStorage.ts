import { STORAGE_KEYS } from '../types/DiagramTypes'

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
  } catch (error) {
    console.warn('Failed to clear diagram storage:', error)
  }
}
