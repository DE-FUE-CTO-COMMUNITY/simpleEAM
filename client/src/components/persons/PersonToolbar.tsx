'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'
import { Table, VisibilityState } from '@tanstack/react-table'

interface PersonToolbarProps {
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
 * Eine Toolbar speziell für Personen, die die GenericToolbar-Komponente verwendet.
 */
const PersonToolbar: React.FC<PersonToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  columnVisibility,
  ...props
}) => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Personen durchsuchen..."
      filterTooltip="Personenfilter hinzufügen"
      editFilterTooltip="Personenfilter bearbeiten"
      resetFilterTooltip="Personenfilter zurücksetzen"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      columnVisibility={columnVisibility}
    />
  )
}

export default PersonToolbar
