import { EntityType, ImportSettings, ExportSettings, DeleteSettings } from './types'

// Entity Type Labels für die UI - werden durch i18n ersetzt
export const entityTypeLabels: Record<EntityType, string> = {
  businessCapabilities: 'Business Capabilities',
  businessProcesses: 'Business Processes',
  applications: 'Anwendungen',
  dataObjects: 'Datenobjekte',
  interfaces: 'Schnittstellen',
  persons: 'Personen',
  architectures: 'Architekturen',
  diagrams: 'Diagramme',
  architecturePrinciples: 'Architekturprinzipien',
  infrastructures: 'Infrastruktur',
  productFamilies: 'Produktfamilien',
  softwareProducts: 'Softwareprodukte',
  softwareVersions: 'Softwareversionen',
  hardwareProducts: 'Hardwareprodukte',
  hardwareVersions: 'Hardwareversionen',
  aicomponents: 'AI Components',
  visions: 'Visionen',
  missions: 'Missionen',
  values: 'Werte',
  goals: 'Ziele',
  strategies: 'Strategien',
  all: 'Alle Daten',
}

// Entity Type Mapping für Tab-Namen (Import/Export)
export const entityTypeMapping: Record<string, string> = {
  'Business Capabilities': 'businessCapabilities',
  'Business Processes': 'businessProcesses',
  businessCapabilities: 'businessCapabilities',
  businessProcesses: 'businessProcesses',
  BusinessCapabilities: 'businessCapabilities',
  BusinessProcesses: 'businessProcesses',
  Business_Capabilities: 'businessCapabilities',
  Business_Processes: 'businessProcesses',
  Applications: 'applications',
  applications: 'applications',
  'Data Objects': 'dataObjects',
  dataObjects: 'dataObjects',
  DataObjects: 'dataObjects',
  Data_Objects: 'dataObjects',
  Interfaces: 'interfaces',
  interfaces: 'interfaces',
  Persons: 'persons',
  persons: 'persons',
  Architectures: 'architectures',
  architectures: 'architectures',
  'Architecture Principles': 'architecturePrinciples',
  architecturePrinciples: 'architecturePrinciples',
  ArchitecturePrinciples: 'architecturePrinciples',
  Architecture_Principles: 'architecturePrinciples',
  Diagrams: 'diagrams',
  diagrams: 'diagrams',
  Infrastructure: 'infrastructures',
  infrastructure: 'infrastructures',
  Infrastructures: 'infrastructures', // Support both singular and plural
  infrastructures: 'infrastructures',
  'Product Families': 'productFamilies',
  productFamilies: 'productFamilies',
  ProductFamilies: 'productFamilies',
  Product_Families: 'productFamilies',
  'Software Products': 'softwareProducts',
  softwareProducts: 'softwareProducts',
  SoftwareProducts: 'softwareProducts',
  Software_Products: 'softwareProducts',
  'Software Versions': 'softwareVersions',
  softwareVersions: 'softwareVersions',
  SoftwareVersions: 'softwareVersions',
  Software_Versions: 'softwareVersions',
  'Hardware Products': 'hardwareProducts',
  hardwareProducts: 'hardwareProducts',
  HardwareProducts: 'hardwareProducts',
  Hardware_Products: 'hardwareProducts',
  'Hardware Versions': 'hardwareVersions',
  hardwareVersions: 'hardwareVersions',
  HardwareVersions: 'hardwareVersions',
  Hardware_Versions: 'hardwareVersions',
  'AI Components': 'aicomponents',
  aicomponents: 'aicomponents',
  aiComponents: 'aicomponents',
  AIComponents: 'aicomponents',
  AI_Components: 'aicomponents',
  Visions: 'visions',
  visions: 'visions',
  'GEA Visions': 'visions',
  geaVisions: 'visions',
  GEA_Visions: 'visions',
  Missions: 'missions',
  missions: 'missions',
  'GEA Missions': 'missions',
  geaMissions: 'missions',
  GEA_Missions: 'missions',
  Values: 'values',
  values: 'values',
  'GEA Values': 'values',
  geaValues: 'values',
  GEA_Values: 'values',
  Goals: 'goals',
  goals: 'goals',
  'GEA Goals': 'goals',
  geaGoals: 'goals',
  GEA_Goals: 'goals',
  Strategies: 'strategies',
  strategies: 'strategies',
  'GEA Strategies': 'strategies',
  geaStrategies: 'strategies',
  GEA_Strategies: 'strategies',
}

const normalizeTabName = (tabName: string): string =>
  tabName.trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase()

const normalizedEntityTypeMapping: Record<string, string> = Object.entries(
  entityTypeMapping
).reduce(
  (acc, [key, value]) => {
    acc[normalizeTabName(key)] = value
    return acc
  },
  {} as Record<string, string>
)

export const resolveEntityTypeFromTabName = (tabName: string): string | undefined => {
  if (!tabName) return undefined
  return entityTypeMapping[tabName] || normalizedEntityTypeMapping[normalizeTabName(tabName)]
}

// Umkehrung für Export-Tab-Namen
export const reverseEntityTypeMapping: Record<string, string> = {
  businessCapabilities: 'Business Capabilities',
  businessProcesses: 'Business Processes',
  applications: 'Applications',
  dataObjects: 'Data Objects',
  interfaces: 'Interfaces',
  persons: 'Persons',
  architectures: 'Architectures',
  architecturePrinciples: 'Architecture Principles',
  diagrams: 'Diagrams',
  infrastructures: 'Infrastructure',
  productFamilies: 'Product Families',
  softwareProducts: 'Software Products',
  softwareVersions: 'Software Versions',
  hardwareProducts: 'Hardware Products',
  hardwareVersions: 'Hardware Versions',
  aicomponents: 'AI Components',
  visions: 'Visions',
  missions: 'Missions',
  values: 'Values',
  goals: 'Goals',
  strategies: 'Strategies',
}

// Reihenfolge der Entity Types wie im Hauptmenü
const coreEntityTypeOrder: EntityType[] = [
  'businessCapabilities',
  'businessProcesses',
  'applications',
  'aicomponents',
  'dataObjects',
  'interfaces',
  'infrastructures',
  'productFamilies',
  'softwareProducts',
  'softwareVersions',
  'hardwareProducts',
  'hardwareVersions',
  'persons',
  'diagrams',
  'architectures',
  'architecturePrinciples',
]

export const geaEntityTypeOrder: EntityType[] = [
  'visions',
  'missions',
  'values',
  'goals',
  'strategies',
]

export const entityTypeOrder: EntityType[] = [...coreEntityTypeOrder]

const geaEntityTypeSet = new Set<EntityType>(geaEntityTypeOrder)

export const isGeaEntityType = (entityType: EntityType): boolean => geaEntityTypeSet.has(entityType)

export const getEntityTypeOrder = (isGeaEnabled: boolean): EntityType[] =>
  isGeaEnabled ? [...coreEntityTypeOrder, ...geaEntityTypeOrder] : coreEntityTypeOrder

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
  companyImportMode: 'selectedCompany',
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
