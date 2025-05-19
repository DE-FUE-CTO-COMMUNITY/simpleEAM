'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface PersonToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
}

/**
 * Eine Toolbar speziell für Personen, die die GenericToolbar-Komponente verwendet.
 */
const PersonToolbar: React.FC<PersonToolbarProps> = props => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Personen durchsuchen..."
      filterTooltip="Personenfilter hinzufügen"
      editFilterTooltip="Personenfilter bearbeiten"
      resetFilterTooltip="Personenfilter zurücksetzen"
    />
  )
}

export default PersonToolbar
