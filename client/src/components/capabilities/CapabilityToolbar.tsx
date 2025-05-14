'use client';

import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Tooltip, Badge } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ClearAll as ClearAllIcon,
} from '@mui/icons-material';

interface CapabilityToolbarProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  activeFiltersCount: number;
  onFilterClick: () => void;
  onResetFilters: () => void;
}

const CapabilityToolbar: React.FC<CapabilityToolbarProps> = ({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
}) => {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
      <TextField
        placeholder="Capabilities durchsuchen..."
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
        }}
        sx={{ width: '300px' }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={activeFiltersCount > 0 ? 'Filter bearbeiten' : 'Weitere Filter'}>
          <IconButton
            onClick={onFilterClick}
            color={activeFiltersCount > 0 ? 'primary' : 'default'}
          >
            {activeFiltersCount > 0 ? (
              <Badge badgeContent={activeFiltersCount} color="error">
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
    </Box>
  );
};

export default CapabilityToolbar;
