'use client'

import React from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import { ClearAll as ClearAllIcon } from '@mui/icons-material'
import { DataClassification } from '../../gql/generated'
import { getClassificationLabel } from './utils'

export interface DataObjectFilterState {
  classifications: DataClassification[]
  formats: string[]
  sources: string[]
}

export interface DataObjectFilterOptions {
  availableFormats: string[]
  availableSources: string[]
}

interface DataObjectFilterDialogProps {
  open: boolean
  onClose: () => void
  filters: DataObjectFilterState
  onFiltersChange: (filters: DataObjectFilterState) => void
  onResetFilters: () => void
  filterOptions: DataObjectFilterOptions
}

const DataObjectFilterDialog: React.FC<DataObjectFilterDialogProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  filterOptions,
}) => {
  // Handler für die Änderung der Klassifikationsfilter
  const handleClassificationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as DataClassification[]
    onFiltersChange({ ...filters, classifications: value })
  }

  // Handler für die Änderung der Format-Filter
  const handleFormatChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[]
    onFiltersChange({ ...filters, formats: value })
  }

  // Handler für die Änderung der Quellen-Filter
  const handleSourceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[]
    onFiltersChange({ ...filters, sources: value })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter für Datenobjekte</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Klassifikation Filter */}
          <FormControl fullWidth>
            <InputLabel id="classification-filter-label">Klassifikation</InputLabel>
            <Select
              labelId="classification-filter-label"
              id="classification-filter"
              multiple
              value={filters.classifications}
              onChange={handleClassificationChange as any}
              input={<OutlinedInput label="Klassifikation" />}
              renderValue={(selected: DataClassification[]) =>
                selected.map(c => getClassificationLabel(c)).join(', ')
              }
            >
              {Object.values(DataClassification).map(classification => (
                <MenuItem key={classification} value={classification}>
                  <Checkbox checked={filters.classifications.includes(classification)} />
                  <ListItemText primary={getClassificationLabel(classification)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Format Filter */}
          <FormControl fullWidth>
            <InputLabel id="format-filter-label">Format</InputLabel>
            <Select
              labelId="format-filter-label"
              id="format-filter"
              multiple
              value={filters.formats}
              onChange={handleFormatChange as any}
              input={<OutlinedInput label="Format" />}
              renderValue={(selected: string[]) => selected.join(', ')}
            >
              {filterOptions.availableFormats.map(format => (
                <MenuItem key={format} value={format}>
                  <Checkbox checked={filters.formats.includes(format)} />
                  <ListItemText primary={format} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quelle Filter */}
          <FormControl fullWidth>
            <InputLabel id="source-filter-label">Quelle</InputLabel>
            <Select
              labelId="source-filter-label"
              id="source-filter"
              multiple
              value={filters.sources}
              onChange={handleSourceChange as any}
              input={<OutlinedInput label="Quelle" />}
              renderValue={(selected: string[]) => selected.join(', ')}
            >
              {filterOptions.availableSources.map(source => (
                <MenuItem key={source} value={source}>
                  <Checkbox checked={filters.sources.includes(source)} />
                  <ListItemText primary={source} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ClearAllIcon />} onClick={onResetFilters} color="secondary">
          Filter zurücksetzen
        </Button>
        <Button onClick={onClose} color="primary">
          Anwenden
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DataObjectFilterDialog
