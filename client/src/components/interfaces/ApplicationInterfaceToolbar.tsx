'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface ApplicationInterfaceToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

/**
 * A toolbar specifically for application interfaces that uses the GenericToolbar component.
 */
const ApplicationInterfaceToolbar: React.FC<ApplicationInterfaceToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('interfaces')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      filterTooltip="Add interface filter"
      editFilterTooltip="Schnittstellenfilter bearbeiten"
      resetFilterTooltip="Reset interface filter"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="interfaces" // Unique key for the interfaces table
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default ApplicationInterfaceToolbar
