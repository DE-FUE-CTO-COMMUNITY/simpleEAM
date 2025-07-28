'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('architecturePrinciples')

  return (
    <GenericToolbar
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
      activeFiltersCount={activeFiltersCount}
      onFilterClick={onFilterClick}
      onResetFilters={onResetFilters}
      entityName={t('title')}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="architecture-principles" // Eindeutiger Schlüssel für die Architecture-Principles-Tabelle
    />
  )
}

export default ArchitecturePrincipleToolbar
