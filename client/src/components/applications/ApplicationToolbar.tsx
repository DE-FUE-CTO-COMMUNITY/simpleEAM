'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'
import { Table, VisibilityState } from '@tanstack/react-table'

interface ApplicationToolbarWithGenericProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  columnVisibility?: VisibilityState
}

/**
 * Eine Toolbar speziell für Applikationen, die die GenericToolbar-Komponente verwendet.
 */
const ApplicationToolbarWithGeneric: React.FC<ApplicationToolbarWithGenericProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  columnVisibility, // Wird benötigt, um die Prop-Signatur beizubehalten
  ...props
}) => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Applikationen durchsuchen..."
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      columnVisibility={columnVisibility} // Wird weitergegeben, aber nicht mehr direkt verwendet
    />
  )
}

export default ApplicationToolbarWithGeneric
