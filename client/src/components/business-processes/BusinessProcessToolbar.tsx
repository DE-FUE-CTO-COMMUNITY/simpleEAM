'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import GenericToolbar from '../common/GenericToolbar'

interface BusinessProcessToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

const BusinessProcessToolbar: React.FC<BusinessProcessToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('businessProcesses')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="business-processes"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default BusinessProcessToolbar
