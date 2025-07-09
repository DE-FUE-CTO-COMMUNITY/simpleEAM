'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface ArchitecturePrincipleToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onAddClick?: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
}

/**
 * Eine Toolbar speziell für Architektur-Prinzipien, die die GenericToolbar-Komponente verwendet.
 */
const ArchitecturePrincipleToolbar: React.FC<ArchitecturePrincipleToolbarProps> = ({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
  onAddClick: _onAddClick,
  table,
  enableColumnVisibilityToggle,
}) => {
  return (
    <GenericToolbar
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
      activeFiltersCount={activeFiltersCount}
      onFilterClick={onFilterClick}
      onResetFilters={onResetFilters}
      searchPlaceholder="Architektur-Prinzipien durchsuchen..."
      filterTooltip="Prinzipienfilter hinzufügen"
      editFilterTooltip="Prinzipienfilter bearbeiten"
      resetFilterTooltip="Prinzipienfilter zurücksetzen"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
    />
  )
}

export default ArchitecturePrincipleToolbar
