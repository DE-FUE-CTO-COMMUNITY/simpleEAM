'use client'

import React from 'react'
import GenericToolbar from '../common/GenericToolbar'
import { isArchitect } from '@/lib/auth'
import { Button, Tooltip } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

interface ArchitectureToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
  onAddClick?: () => void
}

/**
 * Eine Toolbar speziell für Architekturen, die die GenericToolbar-Komponente verwendet.
 */
const ArchitectureToolbar: React.FC<ArchitectureToolbarProps> = ({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
  onAddClick,
}) => {
  const renderExtraActions = () => {
    if (isArchitect() && onAddClick) {
      return (
        <Tooltip title="Neue Architektur erstellen">
          <Button
            variant="contained"
            color="primary"
            onClick={onAddClick}
            startIcon={<AddIcon />}
            sx={{ ml: 1 }}
          >
            Neu
          </Button>
        </Tooltip>
      )
    }
    return null
  }

  return (
    <GenericToolbar
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
      activeFiltersCount={activeFiltersCount}
      onFilterClick={onFilterClick}
      onResetFilters={onResetFilters}
      searchPlaceholder="Architekturen durchsuchen..."
      filterTooltip="Architekturfilter hinzufügen"
      editFilterTooltip="Architekturfilter bearbeiten"
      resetFilterTooltip="Architekturfilter zurücksetzen"
      extraActions={renderExtraActions()}
    />
  )
}

export default ArchitectureToolbar
