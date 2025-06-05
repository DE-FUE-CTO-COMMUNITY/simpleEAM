'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface ArchitectureToolbarProps {
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
 * Eine Toolbar speziell für Architekturen, die die GenericToolbar-Komponente verwendet.
 */
const ArchitectureToolbar: React.FC<ArchitectureToolbarProps> = ({
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
      searchPlaceholder="Architekturen durchsuchen..."
      filterTooltip="Architekturfilter hinzufügen"
      editFilterTooltip="Architekturfilter bearbeiten"
      resetFilterTooltip="Architekturfilter zurücksetzen"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
    />
  )
}

export default ArchitectureToolbar
