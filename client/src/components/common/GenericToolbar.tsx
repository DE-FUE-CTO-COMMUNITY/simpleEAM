'use client'

import React from 'react'
import { Box, TextField, InputAdornment, IconButton, Tooltip, Badge, Toolbar } from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ClearAll as ClearAllIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'

export interface GenericToolbarProps {
  /**
   * Der aktuelle Suchbegriff für die globale Suche
   */
  globalFilter: string

  /**
   * Callback-Funktion, die aufgerufen wird, wenn sich der globale Suchbegriff ändert
   */
  onGlobalFilterChange: (value: string) => void

  /**
   * Die Anzahl der aktiven Filter
   */
  activeFiltersCount: number

  /**
   * Callback-Funktion, die aufgerufen wird, wenn auf die Filter-Schaltfläche geklickt wird
   */
  onFilterClick: () => void

  /**
   * Callback-Funktion, die aufgerufen wird, wenn die Filter zurückgesetzt werden sollen
   */
  onResetFilters: () => void

  /**
   * Platzhaltertext für das Suchfeld
   * @default "Suchen..."
   */
  searchPlaceholder?: string

  /**
   * Tooltiptext für den Filter-Button, wenn keine aktiven Filter vorhanden sind
   * @default "Filter hinzufügen"
   */
  filterTooltip?: string

  /**
   * Tooltiptext für den Filter-Button, wenn aktive Filter vorhanden sind
   * @default "Filter bearbeiten"
   */
  editFilterTooltip?: string

  /**
   * Tooltiptext für den Reset-Button
   * @default "Filter zurücksetzen"
   */
  resetFilterTooltip?: string

  /**
   * Ob ein Löschen-Button im Suchfeld angezeigt werden soll
   * @default true
   */
  showClearSearchButton?: boolean

  /**
   * Die Mindestbreite des Suchfelds
   * @default "300px"
   */
  searchFieldWidth?: string
}

/**
 * Eine generische Toolbar-Komponente für Entitäten-Tabellen, die eine Suchfunktion und Filteroptionen bietet.
 */
const GenericToolbar: React.FC<GenericToolbarProps> = ({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
  searchPlaceholder = 'Suchen...',
  filterTooltip = 'Filter hinzufügen',
  editFilterTooltip = 'Filter bearbeiten',
  resetFilterTooltip = 'Filter zurücksetzen',
  showClearSearchButton = true,
  searchFieldWidth = '300px',
}) => {
  return (
    <Toolbar
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        placeholder={searchPlaceholder}
        variant="outlined"
        size="small"
        value={globalFilter || ''}
        onChange={e => onGlobalFilterChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment:
            showClearSearchButton && globalFilter ? (
              <InputAdornment position="end">
                <IconButton onClick={() => onGlobalFilterChange('')} size="small" edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        sx={{ minWidth: searchFieldWidth }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={activeFiltersCount > 0 ? editFilterTooltip : filterTooltip}>
          <IconButton
            onClick={onFilterClick}
            color={activeFiltersCount > 0 ? 'primary' : 'default'}
          >
            {activeFiltersCount > 0 ? (
              <Badge badgeContent={activeFiltersCount} color="primary">
                <FilterIcon />
              </Badge>
            ) : (
              <FilterIcon />
            )}
          </IconButton>
        </Tooltip>
        {activeFiltersCount > 0 && (
          <Tooltip title={resetFilterTooltip}>
            <IconButton onClick={onResetFilters}>
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Toolbar>
  )
}

export default GenericToolbar
