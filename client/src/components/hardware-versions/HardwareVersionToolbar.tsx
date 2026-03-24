'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import GenericToolbar from '../common/GenericToolbar'

interface HardwareVersionToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

const HardwareVersionToolbar: React.FC<HardwareVersionToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('hardwareVersions')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="hardware-versions"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default HardwareVersionToolbar
