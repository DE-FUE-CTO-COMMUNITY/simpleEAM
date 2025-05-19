'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'

interface CapabilityToolbarWithGenericProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
}

/**
 * Eine Toolbar speziell für Capabilities, die die GenericToolbar-Komponente verwendet.
 */
const CapabilityToolbarWithGeneric: React.FC<CapabilityToolbarWithGenericProps> = props => {
  return (
    <GenericToolbar
      {...props}
      searchPlaceholder="Capabilities durchsuchen..."
      showClearSearchButton={true}
    />
  )
}

export default CapabilityToolbarWithGeneric
