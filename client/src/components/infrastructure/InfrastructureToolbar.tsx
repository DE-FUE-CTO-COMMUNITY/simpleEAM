'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table, VisibilityState } from '@tanstack/react-table'

interface InfrastructureToolbarProps {
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
 * Eine Toolbar speziell für Infrastrukturen, die die GenericToolbar-Komponente verwendet.
 */
const InfrastructureToolbar: React.FC<InfrastructureToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  columnVisibility,
  ...props
}) => {
  const t = useTranslations('infrastructure')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      searchFieldWidth="350px"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      columnVisibility={columnVisibility}
    />
  )
}

export default InfrastructureToolbar
