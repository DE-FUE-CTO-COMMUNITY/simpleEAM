'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table } from '@tanstack/react-table'

interface PersonToolbarProps {
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
 * Eine Toolbar speziell für Personen, die die GenericToolbar-Komponente verwendet.
 */
const PersonToolbar: React.FC<PersonToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  defaultColumnVisibility,
  ...props
}) => {
  const t = useTranslations('persons')
  const tToolbar = useTranslations('persons.toolbar')

  return (
    <GenericToolbar
      {...props}
      searchPlaceholder={t('searchPlaceholder')}
      filterTooltip={tToolbar('filterTooltip')}
      editFilterTooltip={tToolbar('editFilterTooltip')}
      resetFilterTooltip={tToolbar('resetFilterTooltip')}
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
      tableKey="persons" // Eindeutiger Schlüssel für die Persons-Tabelle
      defaultColumnVisibility={defaultColumnVisibility}
    />
  )
}

export default PersonToolbar
