'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import GenericToolbar from '../common/GenericToolbar'

interface SoftwareProductToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

const SoftwareProductToolbar: React.FC<SoftwareProductToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('softwareProducts')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="software-products"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default SoftwareProductToolbar
