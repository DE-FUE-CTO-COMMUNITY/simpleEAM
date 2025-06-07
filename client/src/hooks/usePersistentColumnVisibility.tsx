'use client'

import { useState, useCallback, useEffect } from 'react'
import { VisibilityState, Table } from '@tanstack/react-table'

interface UsePersistentColumnVisibilityOptions {
  /**
   * Eindeutiger Schlüssel für diese Tabelle (z.B. 'applications', 'capabilities', etc.)
   */
  tableKey: string

  /**
   * Standard-Spaltenvisibilität, falls keine gespeicherten Einstellungen vorhanden sind
   */
  defaultColumnVisibility?: VisibilityState

  /**
   * Speicher-Präfix für localStorage-Schlüssel
   * @default 'simple-eam-column-visibility'
   */
  storagePrefix?: string
}

/**
 * Hook für persistente Column Visibility Funktionalität in TanStack Table
 *
 * Dieser Hook erweitert die Column Visibility um localStorage-Persistierung,
 * sodass Benutzereinstellungen nach Seitenwechsel oder Browser-Restart erhalten bleiben.
 *
 * @param options Konfiguration für die persistente Column Visibility
 * @returns Ein Objekt mit State und Funktionen für die persistente Column Visibility
 */
export function usePersistentColumnVisibility({
  tableKey,
  defaultColumnVisibility = {},
  storagePrefix = 'simple-eam-column-visibility',
}: UsePersistentColumnVisibilityOptions) {
  // Lade gespeicherte Column Visibility beim ersten Laden
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (typeof window === 'undefined') {
      // SSR: Verwende Default-Werte
      return defaultColumnVisibility
    }

    try {
      const storageKey = `${storagePrefix}-${tableKey}`
      const saved = localStorage.getItem(storageKey)

      if (saved) {
        const parsed = JSON.parse(saved) as VisibilityState
        // Merge mit Default-Werten, falls neue Spalten hinzugefügt wurden
        return { ...defaultColumnVisibility, ...parsed }
      }
    } catch (error) {
      console.warn(`Fehler beim Laden der gespeicherten Column Visibility für ${tableKey}:`, error)
    }

    return defaultColumnVisibility
  })

  // State für die Table-Instanz
  const [tableInstance, setTableInstance] = useState<Table<any> | null>(null)

  // Speichere Column Visibility bei Änderungen
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const storageKey = `${storagePrefix}-${tableKey}`
      localStorage.setItem(storageKey, JSON.stringify(columnVisibility))
    } catch (error) {
      console.warn(`Fehler beim Speichern der Column Visibility für ${tableKey}:`, error)
    }
  }, [columnVisibility, tableKey, storagePrefix])

  // Callback zum Speichern der Table-Instanz
  const handleTableReady = useCallback((table: Table<any>) => {
    setTableInstance(table)
  }, [])

  // Column Visibility Update-Funktion
  const updateColumnVisibility = useCallback(
    (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      setColumnVisibility(prev => {
        const newState = typeof updater === 'function' ? updater(prev) : updater
        return newState
      })
    },
    []
  )

  // Responsive Column Visibility Helfer-Funktion
  const getResponsiveVisibility = useCallback(
    (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
      if (!tableInstance) return

      const columns = tableInstance.getAllLeafColumns()
      const updatedVisibility: VisibilityState = {}

      // Basierend auf Breakpoint unterschiedlich viele Spalten anzeigen
      const visibleColumnCount =
        breakpoint === 'xs'
          ? 2
          : breakpoint === 'sm'
            ? 3
            : breakpoint === 'md'
              ? 4
              : breakpoint === 'lg'
                ? 5
                : columns.length // 'xl' = alle Spalten

      columns.forEach((column, index) => {
        // Actions-Spalte immer anzeigen
        if (column.id === 'actions') {
          updatedVisibility[column.id] = true
          return
        }

        // Ersten X Spalten sichtbar machen, Rest ausblenden
        updatedVisibility[column.id] = index < visibleColumnCount
      })

      setColumnVisibility(updatedVisibility)
    },
    [tableInstance]
  )

  // Spalten-Sichtbarkeit umschalten
  const toggleColumnVisibility = useCallback(
    (columnId: string) => {
      if (!tableInstance) return

      const column = tableInstance.getColumn(columnId)
      if (!column) return

      setColumnVisibility(prev => ({
        ...prev,
        [columnId]: !column.getIsVisible(),
      }))
    },
    [tableInstance]
  )

  // Alle Spalten ein-/ausschalten
  const toggleAllColumns = useCallback(
    (visible: boolean) => {
      if (!tableInstance) return

      const columns = tableInstance.getAllLeafColumns()
      const updatedVisibility: VisibilityState = {}

      columns.forEach(column => {
        // Actions-Spalte immer sichtbar lassen
        if (column.id === 'actions') {
          updatedVisibility[column.id] = true
          return
        }

        updatedVisibility[column.id] = visible
      })

      setColumnVisibility(updatedVisibility)
    },
    [tableInstance]
  )

  // Spalten-Einstellungen zurücksetzen
  const resetColumnVisibility = useCallback(() => {
    setColumnVisibility(defaultColumnVisibility)
  }, [defaultColumnVisibility])

  // Gespeicherte Einstellungen löschen
  const clearStoredSettings = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const storageKey = `${storagePrefix}-${tableKey}`
      localStorage.removeItem(storageKey)
      setColumnVisibility(defaultColumnVisibility)
    } catch (error) {
      console.warn(
        `Fehler beim Löschen der gespeicherten Column Visibility für ${tableKey}:`,
        error
      )
    }
  }, [tableKey, storagePrefix, defaultColumnVisibility])

  return {
    // State
    columnVisibility,
    tableInstance,

    // Setter
    setColumnVisibility: updateColumnVisibility,

    // Callbacks
    onTableReady: handleTableReady,
    onColumnVisibilityChange: updateColumnVisibility,

    // Hilfsfunktionen
    getResponsiveVisibility,
    toggleColumnVisibility,
    toggleAllColumns,
    resetColumnVisibility,
    clearStoredSettings,
  }
}

export default usePersistentColumnVisibility
