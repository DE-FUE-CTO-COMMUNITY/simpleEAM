'use client'

import { VisibilityState } from '@tanstack/react-table'

// Storage-Schlüssel-Konstanten
export const STORAGE_KEYS = {
  COLUMN_VISIBILITY: 'simple-eam-column-visibility',
} as const

/**
 * Lädt die gespeicherten Column Visibility-Einstellungen für eine Tabelle
 */
export function loadColumnVisibility(
  tableKey: string,
  defaultVisibility: VisibilityState
): VisibilityState {
  if (typeof window === 'undefined') {
    return defaultVisibility
  }

  try {
    const storageKey = `${STORAGE_KEYS.COLUMN_VISIBILITY}-${tableKey}`
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      const parsed = JSON.parse(saved) as VisibilityState

      // Merge with default values if new columns were added
      return { ...defaultVisibility, ...parsed }
    }
  } catch (error) {
    console.warn(`Fehler beim Laden der Column Visibility für ${tableKey}:`, error)
  }

  return defaultVisibility
}

/**
 * Speichert die Column Visibility-Einstellungen für eine Tabelle
 */
export function saveColumnVisibility(tableKey: string, columnVisibility: VisibilityState): void {
  if (typeof window === 'undefined') return

  try {
    const storageKey = `${STORAGE_KEYS.COLUMN_VISIBILITY}-${tableKey}`
    localStorage.setItem(storageKey, JSON.stringify(columnVisibility))
  } catch (error) {
    console.warn(`Fehler beim Speichern der Column Visibility für ${tableKey}:`, error)
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
  } catch (error) {
    console.warn(`Fehler beim Löschen der Tabellen-Einstellungen für ${tableKey}:`, error)
  }
}
