'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface ApplicationInterfaceToolbarProps {
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
 * Eine Toolbar speziell für Anwendungsschnittstellen, die die GenericToolbar-Komponente verwendet.
 */
const ApplicationInterfaceToolbar: React.FC<ApplicationInterfaceToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('interfaces')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      filterTooltip="Schnittstellenfilter hinzufügen"
      editFilterTooltip="Schnittstellenfilter bearbeiten"
      resetFilterTooltip="Schnittstellenfilter zurücksetzen"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="interfaces" // Eindeutiger Schlüssel für die Interfaces-Tabelle
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default ApplicationInterfaceToolbar
