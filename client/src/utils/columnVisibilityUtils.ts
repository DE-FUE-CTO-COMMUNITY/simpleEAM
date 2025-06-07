'use client'

import { VisibilityState } from '@tanstack/react-table'

// Standard-Sichtbarkeitseinstellungen für verschiedene Tabellen
export const DEFAULT_COLUMN_VISIBILITY: Record<string, VisibilityState> = {
  applications: {
    name: true,
    status: true,
    criticality: true,
    timeCategory: true,
    sevenRStrategy: false,
    tcoCurrency: false,
    description: false,
    createdAt: false,
    updatedAt: false,
  },
  capabilities: {
    name: true,
    description: true,
    maturityLevel: true,
    status: true,
    level: false,
    parentCapability: false,
    createdAt: false,
    updatedAt: false,
  },
  dataObjects: {
    name: true,
    description: true,
    dataClassification: true,
    sourceSystem: true,
    retentionPeriod: false,
    createdAt: false,
    updatedAt: false,
  },
  interfaces: {
    name: true,
    interfaceType: true,
    protocol: true,
    sourceApplication: true,
    targetApplication: true,
    frequency: false,
    description: false,
    createdAt: false,
    updatedAt: false,
  },
  persons: {
    firstName: true,
    lastName: true,
    email: true,
    department: true,
    position: false,
    phone: false,
    createdAt: false,
    updatedAt: false,
  },
  architectures: {
    name: true,
    description: true,
    version: true,
    status: true,
    createdAt: false,
    updatedAt: false,
  },
}

// Storage-Schlüssel-Konstanten
export const STORAGE_KEYS = {
  COLUMN_VISIBILITY: 'simple-eam-column-visibility',
  TABLE_SETTINGS: 'simple-eam-table-settings',
} as const

// Typen für erweiterte Tabellen-Einstellungen
export interface TableSettings {
  columnVisibility: VisibilityState
  pageSize?: number
  sorting?: Array<{ id: string; desc: boolean }>
  filters?: Array<{ id: string; value: any }>
}

/**
 * Lädt die gespeicherten Column Visibility-Einstellungen für eine Tabelle
 */
export function loadColumnVisibility(
  tableKey: string, 
  defaultVisibility?: VisibilityState
): VisibilityState {
  if (typeof window === 'undefined') {
    return defaultVisibility || DEFAULT_COLUMN_VISIBILITY[tableKey] || {}
  }

  try {
    const storageKey = `${STORAGE_KEYS.COLUMN_VISIBILITY}-${tableKey}`
    const saved = localStorage.getItem(storageKey)
    
    if (saved) {
      const parsed = JSON.parse(saved) as VisibilityState
      const fallback = defaultVisibility || DEFAULT_COLUMN_VISIBILITY[tableKey] || {}
      
      // Merge mit Default-Werten, falls neue Spalten hinzugefügt wurden
      return { ...fallback, ...parsed }
    }
  } catch (error) {
    console.warn(`Fehler beim Laden der Column Visibility für ${tableKey}:`, error)
  }

  return defaultVisibility || DEFAULT_COLUMN_VISIBILITY[tableKey] || {}
}

/**
 * Speichert die Column Visibility-Einstellungen für eine Tabelle
 */
export function saveColumnVisibility(
  tableKey: string, 
  columnVisibility: VisibilityState
): void {
  if (typeof window === 'undefined') return

  try {
    const storageKey = `${STORAGE_KEYS.COLUMN_VISIBILITY}-${tableKey}`
    localStorage.setItem(storageKey, JSON.stringify(columnVisibility))
  } catch (error) {
    console.warn(`Fehler beim Speichern der Column Visibility für ${tableKey}:`, error)
  }
}

/**
 * Lädt alle Tabellen-Einstellungen (inkl. Column Visibility, Pagination, etc.)
 */
export function loadTableSettings(tableKey: string): TableSettings | null {
  if (typeof window === 'undefined') return null

  try {
    const storageKey = `${STORAGE_KEYS.TABLE_SETTINGS}-${tableKey}`
    const saved = localStorage.getItem(storageKey)
    
    if (saved) {
      return JSON.parse(saved) as TableSettings
    }
  } catch (error) {
    console.warn(`Fehler beim Laden der Tabellen-Einstellungen für ${tableKey}:`, error)
  }

  return null
}

/**
 * Speichert alle Tabellen-Einstellungen
 */
export function saveTableSettings(
  tableKey: string, 
  settings: TableSettings
): void {
  if (typeof window === 'undefined') return

  try {
    const storageKey = `${STORAGE_KEYS.TABLE_SETTINGS}-${tableKey}`
    localStorage.setItem(storageKey, JSON.stringify(settings))
  } catch (error) {
    console.warn(`Fehler beim Speichern der Tabellen-Einstellungen für ${tableKey}:`, error)
  }
}

/**
 * Löscht die gespeicherten Einstellungen für eine Tabelle
 */
export function clearTableSettings(tableKey: string): void {
  if (typeof window === 'undefined') return

  try {
    // Lösche Column Visibility
    const columnVisibilityKey = `${STORAGE_KEYS.COLUMN_VISIBILITY}-${tableKey}`
    localStorage.removeItem(columnVisibilityKey)
    
    // Lösche erweiterte Tabellen-Einstellungen
    const tableSettingsKey = `${STORAGE_KEYS.TABLE_SETTINGS}-${tableKey}`
    localStorage.removeItem(tableSettingsKey)
  } catch (error) {
    console.warn(`Fehler beim Löschen der Tabellen-Einstellungen für ${tableKey}:`, error)
  }
}

/**
 * Löscht alle gespeicherten Tabellen-Einstellungen (für alle Tabellen)
 */
export function clearAllTableSettings(): void {
  if (typeof window === 'undefined') return

  try {
    const keysToRemove: string[] = []
    
    // Finde alle relevanten Schlüssel
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith(STORAGE_KEYS.COLUMN_VISIBILITY) || 
        key.startsWith(STORAGE_KEYS.TABLE_SETTINGS)
      )) {
        keysToRemove.push(key)
      }
    }
    
    // Lösche alle gefundenen Schlüssel
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    console.log(`${keysToRemove.length} gespeicherte Tabellen-Einstellungen gelöscht`)
  } catch (error) {
    console.warn('Fehler beim Löschen aller Tabellen-Einstellungen:', error)
  }
}

/**
 * Exportiert alle gespeicherten Tabellen-Einstellungen als JSON
 */
export function exportTableSettings(): string {
  if (typeof window === 'undefined') return '{}'

  try {
    const settings: Record<string, any> = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith(STORAGE_KEYS.COLUMN_VISIBILITY) || 
        key.startsWith(STORAGE_KEYS.TABLE_SETTINGS)
      )) {
        const value = localStorage.getItem(key)
        if (value) {
          settings[key] = JSON.parse(value)
        }
      }
    }
    
    return JSON.stringify(settings, null, 2)
  } catch (error) {
    console.warn('Fehler beim Exportieren der Tabellen-Einstellungen:', error)
    return '{}'
  }
}

/**
 * Importiert Tabellen-Einstellungen aus JSON
 */
export function importTableSettings(jsonString: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const settings = JSON.parse(jsonString)
    
    Object.entries(settings).forEach(([key, value]) => {
      if (key.startsWith(STORAGE_KEYS.COLUMN_VISIBILITY) || 
          key.startsWith(STORAGE_KEYS.TABLE_SETTINGS)) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    })
    
    return true
  } catch (error) {
    console.warn('Fehler beim Importieren der Tabellen-Einstellungen:', error)
    return false
  }
}
