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
  defaultColumnVisibility?: Record<string, boolean>
}

/**
 * A toolbar specifically for architecture principles that uses the GenericToolbar component.
 */
const ArchitecturePrincipleToolbar: React.FC<ArchitecturePrincipleToolbarProps> = ({
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
      tableKey="architecture-principles" // Unique key for architecture principles table
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default ArchitecturePrincipleToolbar
