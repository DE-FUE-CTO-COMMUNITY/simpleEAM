'use client'

import { useState, useCallback } from 'react'
import { VisibilityState, Table } from '@tanstack/react-table'

/**
 * Hook für die Verwaltung der Column Visibility Funktionalität in TanStack Table
 *
 * Dieser Hook vereinfacht die Implementierung der Column Visibility für alle Tabellen-Komponenten
 *
 * @returns Ein Objekt mit State und Funktionen für die Column Visibility
 */
export function useColumnVisibility() {
  // State für Column Visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // State für die Table-Instanz
  const [tableInstance, setTableInstance] = useState<Table<any> | null>(null)

  // Callback zum Speichern der Table-Instanz
  const handleTableReady = useCallback((table: Table<any>) => {
    setTableInstance(table)
  }, [])

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

  return {
    // State
    columnVisibility,
    tableInstance,

    // Setter
    setColumnVisibility,

    // Callbacks
    onTableReady: handleTableReady,

    // Hilfsfunktionen
    getResponsiveVisibility,
    toggleColumnVisibility,
    toggleAllColumns,
  }
}

export default useColumnVisibility
