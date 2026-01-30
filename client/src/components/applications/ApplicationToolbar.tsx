'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface ApplicationToolbarWithGenericProps {
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
 * A toolbar specifically for applications that uses the GenericToolbar component.
 */
const ApplicationToolbarWithGeneric: React.FC<ApplicationToolbarWithGenericProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('applications')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="applications" // Unique key for applications table
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default ApplicationToolbarWithGeneric
