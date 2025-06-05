'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'
import { Table, VisibilityState } from '@tanstack/react-table'

interface DataObjectToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onCreateClick?: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  columnVisibility?: VisibilityState
}

/**
 * Eine Toolbar speziell für Datenobjekte, die die GenericToolbar-Komponente verwendet.
 */
const DataObjectToolbar: React.FC<DataObjectToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  columnVisibility,
  ...props
}) => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Datenobjekte durchsuchen..."
      searchFieldWidth="350px"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      columnVisibility={columnVisibility}
    />
  )
}

export default DataObjectToolbar
