export interface LocalStoredDiagramData {
  elements: any[]
  appState: Record<string, unknown>
  files?: Record<string, unknown>
}

export type LocalDiagramTypeValue =
  | 'ARCHITECTURE'
  | 'APPLICATION_LANDSCAPE'
  | 'CAPABILITY_MAP'
  | 'DATA_FLOW'
  | 'PROCESS'
  | 'NETWORK'
  | 'INTEGRATION_ARCHITECTURE'
  | 'SECURITY_ARCHITECTURE'
  | 'CONCEPTUAL'
  | 'OTHER'

export interface LocalStoredDiagramArchitecture {
  id: string
  name: string
  type?: string | null
  domain?: string | null
}

export interface LocalStoredDiagramMetadata {
  description?: string
  diagramType?: LocalDiagramTypeValue
  architecture?: LocalStoredDiagramArchitecture
  /**
   * Legacy field kept for backward compatibility with older local saves
   * that only stored the architecture name.
   */
  architectureName?: string
  company?: {
    id: string
    name?: string | null
  }
}

export interface LocalStoredDiagramEntry {
  name: string
  updatedAt: number
  data: LocalStoredDiagramData
  metadata?: LocalStoredDiagramMetadata
}
