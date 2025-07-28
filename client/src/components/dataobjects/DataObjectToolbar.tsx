'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface DataObjectToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onCreateClick?: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  defaultColumnVisibility?: Record<string, boolean>
}

/**
 * Eine Toolbar speziell für Datenobjekte, die die GenericToolbar-Komponente verwendet.
 */
const DataObjectToolbar: React.FC<DataObjectToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('dataObjects')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      searchFieldWidth="350px"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="dataobjects" // Eindeutiger Schlüssel für die DataObjects-Tabelle
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default DataObjectToolbar
