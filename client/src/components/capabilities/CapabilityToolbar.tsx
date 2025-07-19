'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table, VisibilityState } from '@tanstack/react-table'

interface CapabilityToolbarWithGenericProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  columnVisibility?: VisibilityState
}

/**
 * Eine Toolbar speziell für Capabilities, die die GenericToolbar-Komponente verwendet.
 */
const CapabilityToolbarWithGeneric: React.FC<CapabilityToolbarWithGenericProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  columnVisibility,
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
      columnVisibility={columnVisibility}
    />
  )
}

export default CapabilityToolbarWithGeneric
