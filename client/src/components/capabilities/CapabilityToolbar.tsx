'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface CapabilityToolbarWithGenericProps {
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
 * A toolbar specifically for capabilities that uses the GenericToolbar component.
 */
const CapabilityToolbarWithGeneric: React.FC<CapabilityToolbarWithGenericProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('capabilities')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="capabilities" // Unique key for capabilities table
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default CapabilityToolbarWithGeneric
