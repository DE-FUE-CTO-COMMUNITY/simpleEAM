import { EntityType, ImportSettings, ExportSettings, DeleteSettings } from './types'

// Entity Type Labels für die UI - werden durch i18n ersetzt
export const entityTypeLabels: Record<EntityType, string> = {
  businessCapabilities: 'Business Capabilities',
  applications: 'Anwendungen',
  dataObjects: 'Datenobjekte',
  interfaces: 'Schnittstellen',
  persons: 'Personen',
  architectures: 'Architekturen',
  diagrams: 'Diagramme',
  architecturePrinciples: 'Architekturprinzipien',
  infrastructures: 'Infrastruktur',
  aicomponents: 'AI Components',
  all: 'Alle Daten',
}

// Entity Type Mapping für Tab-Namen (Import/Export)
export const entityTypeMapping: Record<string, string> = {
  'Business Capabilities': 'businessCapabilities',
  Applications: 'applications',
  'Data Objects': 'dataObjects',
  Interfaces: 'interfaces',
  Persons: 'persons',
  Architectures: 'architectures',
  'Architecture Principles': 'architecturePrinciples',
  Diagrams: 'diagrams',
  Infrastructure: 'infrastructures',
  Infrastructures: 'infrastructures', // Support both singular and plural
  'AI Components': 'aicomponents',
}

// Umkehrung für Export-Tab-Namen
export const reverseEntityTypeMapping: Record<string, string> = {
  businessCapabilities: 'Business Capabilities',
  applications: 'Applications',
  dataObjects: 'Data Objects',
  interfaces: 'Interfaces',
  persons: 'Persons',
  architectures: 'Architectures',
  architecturePrinciples: 'Architecture Principles',
  diagrams: 'Diagrams',
  infrastructures: 'Infrastructure',
  aicomponents: 'AI Components',
}

// Reihenfolge der Entity Types wie im Hauptmenü
export const entityTypeOrder: EntityType[] = [
  'businessCapabilities',
  'applications',
  'aicomponents',
  'dataObjects',
  'interfaces',
  'infrastructures',
  'persons',
  'diagrams',
  'architectures',
  'architecturePrinciples',
]

// Format-Optionen
export const formatOptions = {
  import: ['xlsx', 'json'] as const,
  export: ['xlsx', 'csv', 'json'] as const,
}

// Update-Modus-Optionen - werden durch i18n ersetzt
export const updateModeOptions = [
  { value: 'overwrite', label: 'Überschreiben' },
  { value: 'merge', label: 'Zusammenführen' },
  { value: 'skipExisting', label: 'Bestehende überspringen' },
] as const

// Standard-Einstellungen
export const defaultImportSettings: ImportSettings = {
  entityType: 'businessCapabilities',
  format: 'xlsx',
  updateMode: 'overwrite',
  createTemplate: false,
}

export const defaultExportSettings: ExportSettings = {
  entityType: 'businessCapabilities',
  format: 'xlsx',
}

export const defaultDeleteSettings: DeleteSettings = {
  entityType: 'businessCapabilities',
}

// Helper-Funktion: Prüft ob ein Format für einen Entity-Type gesperrt ist
export const isFormatLocked = (_entityType: EntityType, _format: string): boolean => {
  // Keine Formate sind mehr gesperrt - alle Entity-Types können in allen Formaten exportiert werden
  return false
}
