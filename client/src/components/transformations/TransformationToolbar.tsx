'use client'

import React from 'react'
import { Table } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'

interface TransformationToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

const TransformationToolbar: React.FC<TransformationToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('transformations')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      showClearSearchButton={true}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="transformations"
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default TransformationToolbar
