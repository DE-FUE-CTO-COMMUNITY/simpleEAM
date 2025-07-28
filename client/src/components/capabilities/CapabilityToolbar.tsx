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
}

/**
 * Eine Toolbar speziell für Capabilities, die die GenericToolbar-Komponente verwendet.
 */
const CapabilityToolbarWithGeneric: React.FC<CapabilityToolbarWithGenericProps> = ({
  table,
  enableColumnVisibilityToggle = true,
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
      tableKey="capabilities" // Eindeutiger Schlüssel für die Capabilities-Tabelle
    />
  )
}

export default CapabilityToolbarWithGeneric
