'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericToolbar from '../common/GenericToolbar'
import { Table, VisibilityState } from '@tanstack/react-table'

interface PersonToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  table?: Table<any>
  enableColumnVisibilityToggle?: boolean
  columnVisibility?: VisibilityState
}

/**
 * Eine Toolbar speziell für Personen, die die GenericToolbar-Komponente verwendet.
 */
const PersonToolbar: React.FC<PersonToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  columnVisibility,
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
      columnVisibility={columnVisibility}
    />
  )
}

export default PersonToolbar
