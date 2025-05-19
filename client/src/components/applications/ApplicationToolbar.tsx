'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface ApplicationToolbarWithGenericProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
}

/**
 * Eine Toolbar speziell für Applikationen, die die GenericToolbar-Komponente verwendet.
 */
const ApplicationToolbarWithGeneric: React.FC<ApplicationToolbarWithGenericProps> = props => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Applikationen durchsuchen..."
      showClearSearchButton={true}
    />
  )
}

export default ApplicationToolbarWithGeneric
