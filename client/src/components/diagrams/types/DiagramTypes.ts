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
  onExportDrawIO: () => void
  onExportArchi: () => void
  onImportJSON: () => void
  onExportPNG: () => void
  onManualSync: () => void
  onCapabilityMapGenerator: () => void
  excalidrawAPI: (api: any) => void
  onChange?: (elements: any[], appState: any) => void
  uiOptions: any
  initialData: any
  viewModeEnabled?: boolean
  currentDiagram?: any
  onDiagramUpdate?: (diagram: any) => void
  onCollaborationStatusChange?: (isCollaborating: boolean) => void
  onStopCollaboration?: () => void
  onBroadcastReady?: (broadcastFn: (elements: any[], appState: any) => void) => void
  isLoadingRef?: React.MutableRefObject<boolean>
  suppressOnChangeRef?: React.MutableRefObject<boolean>
  authorizeAccess?: (diagram: any) => 'allow' | 'deny' | 'ignore'
  // Add Related Elements functionality
  selectedElementForRelatedElements?: any
  onOpenAddRelatedElementsDialog: (element: any) => void
  onCloseAddRelatedElementsDialog: () => void
  isAddRelatedElementsDialogOpen: boolean
}

export interface NotificationState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
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
  capabilityMapGeneratorOpen: boolean
  addRelatedElementsDialogOpen: boolean
}

export interface DiagramHandlers {
  handleNewDiagram: () => void
  handleDeleteDiagram: () => void
  handleOpenDiagram: (diagram: any) => void
  handleSaveDiagram: (savedDiagram: any) => void
  handleSaveAsDiagram: (savedDiagram: any) => void
  handleChange: (elements: any[], appState: any) => void
  handleExportJSON: () => void
  handleExportDrawIO: () => void
  handleExportArchi: () => void
  handleImportJSON: () => void
  handleExportPNG: () => void
  handleManualSync: () => void
  broadcastSceneUpdate?: (elements?: any[], appState?: any) => void
}

// Storage Keys
export const STORAGE_KEYS = {
  SCENE: 'excalidraw-scene',
  CURRENT_DIAGRAM: 'excalidraw-current-diagram',
  LAST_SAVED_SCENE: 'excalidraw-last-saved-scene',
  VIEWPORT_STATE: 'excalidraw-viewport-state',
} as const
