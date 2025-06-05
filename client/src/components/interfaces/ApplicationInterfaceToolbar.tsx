'use client'

import React from 'react'
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
}

/**
 * Eine Toolbar speziell für Anwendungsschnittstellen, die die GenericToolbar-Komponente verwendet.
 */
const ApplicationInterfaceToolbar: React.FC<ApplicationInterfaceToolbarProps> = ({
  table,
  enableColumnVisibilityToggle = true,
  ...props
}) => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Schnittstellen durchsuchen..."
      filterTooltip="Schnittstellenfilter hinzufügen"
      editFilterTooltip="Schnittstellenfilter bearbeiten"
      resetFilterTooltip="Schnittstellenfilter zurücksetzen"
      table={table}
      enableColumnVisibilityToggle={enableColumnVisibilityToggle}
    />
  )
}

export default ApplicationInterfaceToolbar
