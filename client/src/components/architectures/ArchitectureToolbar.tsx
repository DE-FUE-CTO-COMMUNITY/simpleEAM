'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface ArchitectureToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onAddClick?: () => void
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
    />
  )
}

export default ArchitectureToolbar
