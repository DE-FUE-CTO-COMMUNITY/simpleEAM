'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import GenericToolbar from '../common/GenericToolbar'

interface SoftwareVersionToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

const SoftwareVersionToolbar: React.FC<SoftwareVersionToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('softwareVersions')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="software-versions"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default SoftwareVersionToolbar
