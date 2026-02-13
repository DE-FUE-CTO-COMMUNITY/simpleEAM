'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface SuppliersToolbarProps {
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

export function SuppliersToolbar({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
  onAddClick: _onAddClick,
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
}: SuppliersToolbarProps) {
  const t = useTranslations('suppliers')

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
      tableKey="suppliers"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default SuppliersToolbar
