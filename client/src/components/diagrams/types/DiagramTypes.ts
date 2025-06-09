// Types and interfaces for diagram components
export interface DiagramEditorProps {
  className?: string
  style?: React.CSSProperties
}

export interface ExcalidrawComponentProps {
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

export interface NotificationState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info'
}

export interface DiagramState {
  isClient: boolean
  excalidrawAPI: any
  currentDiagram: any
  currentScene: any
  hasUnsavedChanges: boolean
  lastSavedScene: any
}

export interface DialogStates {
  saveDialogOpen: boolean
  saveAsDialogOpen: boolean
  openDialogOpen: boolean
  deleteDialogOpen: boolean
}

export interface DiagramHandlers {
  handleNewDiagram: () => void
  handleDeleteDiagram: () => void
  handleOpenDiagram: (diagram: any) => void
  handleSaveDiagram: (savedDiagram: any) => void
  handleSaveAsDiagram: (savedDiagram: any) => void
  handleChange: (elements: any[], appState: any) => void
  handleExportJSON: () => void
  handleImportJSON: () => void
  handleExportPNG: () => void
  handleManualSync: () => void
}

// Storage Keys
export const STORAGE_KEYS = {
  SCENE: 'excalidraw-scene',
  CURRENT_DIAGRAM: 'excalidraw-current-diagram',
  LAST_SAVED_SCENE: 'excalidraw-last-saved-scene',
} as const
