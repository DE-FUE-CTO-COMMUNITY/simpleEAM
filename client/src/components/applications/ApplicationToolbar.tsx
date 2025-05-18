'use client'

import React from 'react'
import { Toolbar, TextField, Box, Badge, InputAdornment, IconButton, Tooltip } from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ClearAll as ClearAllIcon,
} from '@mui/icons-material'

interface ApplicationToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  activeFiltersCount: number
  onFilterClick: () => void
  onResetFilters: () => void
}

const ApplicationToolbar: React.FC<ApplicationToolbarProps> = ({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
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
        variant="outlined"
        size="small"
        placeholder="Applikationen durchsuchen..."
        value={globalFilter || ''}
        onChange={e => onGlobalFilterChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: globalFilter ? (
            <InputAdornment position="end">
              <IconButton onClick={() => onGlobalFilterChange('')} size="small" edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{ minWidth: '300px' }}
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={activeFiltersCount > 0 ? 'Filter bearbeiten' : 'Weitere Filter'}>
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
          <Tooltip title="Filter zurücksetzen">
            <IconButton onClick={onResetFilters}>
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Toolbar>
  )
}

export default ApplicationToolbar
