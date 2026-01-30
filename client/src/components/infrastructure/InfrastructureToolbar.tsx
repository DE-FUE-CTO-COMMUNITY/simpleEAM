'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface InfrastructureToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onCreateClick?: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

/**
 * A toolbar specifically for infrastructures that uses the GenericToolbar component.
 */
const InfrastructureToolbar: React.FC<InfrastructureToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
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
      tableKey="infrastructure" // Unique key for the infrastructure table
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default InfrastructureToolbar
