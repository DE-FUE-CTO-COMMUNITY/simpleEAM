'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface InterfaceToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
}

/**
 * Eine Toolbar speziell für Schnittstellen, die die GenericToolbar-Komponente verwendet.
 */
const InterfaceToolbar: React.FC<InterfaceToolbarProps> = props => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Schnittstellen durchsuchen..."
      showClearSearchButton={false} // Ohne Clear-Button als Variante
    />
  )
}

export default InterfaceToolbar
