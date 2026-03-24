'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import GenericToolbar from '../common/GenericToolbar'

interface HardwareProductToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

const HardwareProductToolbar: React.FC<HardwareProductToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('hardwareProducts')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="hardware-products"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default HardwareProductToolbar
