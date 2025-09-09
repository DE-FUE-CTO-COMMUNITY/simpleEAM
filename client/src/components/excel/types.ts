// Import/Export Typen basierend auf den Anforderungen FR-IE-01 und FR-IE-02
export interface ImportSettings {
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams' // Nur für JSON-Import verfügbar
    | 'architecturePrinciples'
    | 'infrastructures'
    | 'aicomponents'
    | 'all'
  format: 'xlsx' | 'json'
  updateMode: 'overwrite' | 'merge' | 'skipExisting'
  createTemplate: boolean
}

export interface ExportSettings {
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams' // Nur für JSON-Export verfügbar
    | 'architecturePrinciples'
    | 'infrastructures'
    | 'aicomponents'
    | 'all'
  format: 'xlsx' | 'csv' | 'json'
}

export interface DeleteSettings {
  entityType: Exclude<ImportSettings['entityType'], 'all'>
}

export interface ImportExportDialogProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'import' | 'export' | 'management'
}

export interface ImportResult {
  entityType: string
  imported: number
  errors: string[]
}

export interface EntityMapping {
  [originalId: string]: string
}

export interface ImportWithMappingResult {
  imported: number
  entityMappings: EntityMapping
  errors?: string[]
}

export interface TabValidation {
  isValid: boolean
  errors: any[]
  warnings: any[]
  summary: {
    validRows: number
    invalidRows: number
    totalRows: number
    duplicates: number
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: any[]
  warnings: any[]
  summary: {
    validRows: number
    invalidRows: number
    totalRows: number
    duplicates: number
  }
  tabValidations?: { [tabName: string]: TabValidation }
}

export type EntityType = ImportSettings['entityType']
export type FileFormat = ImportSettings['format']
export type UpdateMode = ImportSettings['updateMode']
