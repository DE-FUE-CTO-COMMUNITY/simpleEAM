'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface DataObjectToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onCreateClick?: () => void
}

/**
 * Eine Toolbar speziell für Datenobjekte, die die GenericToolbar-Komponente verwendet.
 */
const DataObjectToolbar: React.FC<DataObjectToolbarProps> = props => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Datenobjekte durchsuchen..."
      searchFieldWidth="350px"
    />
  )
}

export default DataObjectToolbar
