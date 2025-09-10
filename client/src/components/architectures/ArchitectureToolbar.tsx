'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
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
  defaultColumnVisibility?: Record<string, boolean>
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
  // onAddClick: _onAddClick,
  table,
  enableColumnVisibilityToggle,
  defaultColumnVisibility,
}) => {
  const tArch = useTranslations('architectures')

  return (
    <GenericToolbar
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
      activeFiltersCount={activeFiltersCount}
      onFilterClick={onFilterClick}
      onResetFilters={onResetFilters}
      entityName={tArch('form.entityName')}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="architectures" // Eindeutiger Schlüssel für die Architectures-Tabelle
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default ArchitectureToolbar
