'use client'

import React from 'react'
import {
  Toolbar,
  TextField,
  Button,
  Box,
  Badge,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
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
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            color="inherit"
            onClick={onResetFilters}
            sx={{ textTransform: 'none' }}
          >
            Alle Filter zurücksetzen
          </Button>
        )}

        <Tooltip title="Filter anzeigen">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={
              <Badge badgeContent={activeFiltersCount} color="primary">
                <FilterListIcon />
              </Badge>
            }
            onClick={onFilterClick}
            sx={{ textTransform: 'none' }}
          >
            Filter
          </Button>
        </Tooltip>
      </Box>
    </Toolbar>
  )
}

export default ApplicationToolbar
