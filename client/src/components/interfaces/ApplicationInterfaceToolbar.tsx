'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface ApplicationInterfaceToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
}

/**
 * Eine Toolbar speziell für Anwendungsschnittstellen, die die GenericToolbar-Komponente verwendet.
 */
const ApplicationInterfaceToolbar: React.FC<ApplicationInterfaceToolbarProps> = props => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Schnittstellen durchsuchen..."
      filterTooltip="Schnittstellenfilter hinzufügen"
      editFilterTooltip="Schnittstellenfilter bearbeiten"
      resetFilterTooltip="Schnittstellenfilter zurücksetzen"
    />
  )
}

export default ApplicationInterfaceToolbar
