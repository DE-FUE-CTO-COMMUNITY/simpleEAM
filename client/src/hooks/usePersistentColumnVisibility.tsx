'use client'

import { useState, useCallback, useEffect } from 'react'
import { VisibilityState, Table } from '@tanstack/react-table'
import { loadColumnVisibility, saveColumnVisibility } from '@/utils/columnVisibilityUtils'

interface UsePersistentColumnVisibilityOptions {
  /**
   * Eindeutiger Schlüssel für diese Tabelle (z.B. 'applications', 'capabilities', etc.)
   */
  tableKey: string

  /**
   * Standard-Spaltenvisibilität, falls keine gespeicherten Einstellungen vorhanden sind
   * Diese sollte bei jeder Tabelle definiert werden
   */
  defaultColumnVisibility: VisibilityState
}

/**
 * Hook für persistente Column Visibility Funktionalität in TanStack Table
 */
export default function usePersistentColumnVisibility({
  tableKey,
  defaultColumnVisibility,
}: UsePersistentColumnVisibilityOptions) {
  // Lade initiale Column Visibility (mit Default-Fallback)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    loadColumnVisibility(tableKey, defaultColumnVisibility)
  )
  const [isInitialized, setIsInitialized] = useState(false)

  // Client-Side Initialisierung (für SSR-Kompatibilität)
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized) return

    const loaded = loadColumnVisibility(tableKey, defaultColumnVisibility)
    setColumnVisibility(loaded)
    setIsInitialized(true)
  }, [defaultColumnVisibility, tableKey, isInitialized])

  // Speichere Column Visibility bei Änderungen (nur nach Initialisierung)
  useEffect(() => {
    if (!isInitialized) return
    saveColumnVisibility(tableKey, columnVisibility)
  }, [columnVisibility, tableKey, isInitialized])

  // Callback zum Aktualisieren der Column Visibility
  const onColumnVisibilityChange = useCallback(
    (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      setColumnVisibility(prev => {
        if (typeof updater === 'function') {
          return updater(prev)
        }
        return updater
      })
    },
    []
  )

  // Callback to save the table instance
  const onTableReady = useCallback((_table: Table<any>) => {
    // Here we can add additional table configuration if needed
  }, [])

  // Reset-Funktion
  const resetColumnVisibility = useCallback(() => {
    setColumnVisibility(defaultColumnVisibility)
  }, [defaultColumnVisibility])

  return {
    columnVisibility,
    onColumnVisibilityChange,
    onTableReady,
    resetColumnVisibility,
  }
}
