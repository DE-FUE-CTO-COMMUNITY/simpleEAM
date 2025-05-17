'use client'

import React from 'react'
import {
  Typography,
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
  Slider,
  TextField,
} from '@mui/material'
import { ClearAll as ClearAllIcon } from '@mui/icons-material'
import { FilterProps } from './types'
import { getCriticalityLabel, countActiveFilters } from './utils'
import { ApplicationStatus, CriticalityLevel } from '../../gql/generated'

const ApplicationFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableStatuses,
  availableCriticalities,
  availableTechStack,
  availableVendors,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const {
    statusFilter,
    criticalityFilter,
    costRangeFilter,
    technologyStackFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
    vendorFilter,
  } = filterState

  const handleFilterReset = () => {
    onResetFilter()
    onClose()
  }

  const handleApply = () => {
    const activeCount = countActiveFilters(filterState)
    onApply(activeCount)
    onClose()
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter für Applikationen</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Status Filter */}
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              multiple
              value={statusFilter}
              onChange={e => {
                const value = e.target.value
                // Stellen Sie sicher, dass die Werte als ApplicationStatus-Enum behandelt werden
                const statusValues =
                  typeof value === 'string'
                    ? (value.split(',') as ApplicationStatus[])
                    : (value as ApplicationStatus[])

                onFilterChange({
                  statusFilter: statusValues,
                })
              }}
              input={<OutlinedInput label="Status" />}
              renderValue={selected => selected.join(', ')}
            >
              {availableStatuses.map(status => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={statusFilter.indexOf(status) > -1} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Kritikalitäts-Filter */}
          <FormControl fullWidth>
            <InputLabel id="criticality-filter-label">Kritikalität</InputLabel>
            <Select
              labelId="criticality-filter-label"
              multiple
              value={criticalityFilter}
              onChange={e => {
                const value = e.target.value
                // Stellen Sie sicher, dass die Werte als CriticalityLevel-Enum behandelt werden
                const criticalityValues =
                  typeof value === 'string'
                    ? (value.split(',') as CriticalityLevel[])
                    : (value as CriticalityLevel[])

                onFilterChange({
                  criticalityFilter: criticalityValues,
                })
              }}
              input={<OutlinedInput label="Kritikalität" />}
              renderValue={selected =>
                selected.map(level => getCriticalityLabel(level as CriticalityLevel)).join(', ')
              }
            >
              {availableCriticalities.map(criticality => (
                <MenuItem key={criticality} value={criticality}>
                  <Checkbox checked={criticalityFilter.indexOf(criticality) > -1} />
                  <ListItemText primary={getCriticalityLabel(criticality)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Kosten Range Filter */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Kosten Range
            </Typography>
            <Slider
              value={costRangeFilter}
              onChange={(_, newValue) => {
                onFilterChange({
                  costRangeFilter: newValue as [number, number],
                })
              }}
              valueLabelDisplay="auto"
              min={0}
              max={1000000}
              step={10000}
              valueLabelFormat={value => `${value.toLocaleString('de-DE')} €`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                {costRangeFilter[0].toLocaleString('de-DE')} €
              </Typography>
              <Typography variant="body2">
                {costRangeFilter[1].toLocaleString('de-DE')} €
              </Typography>
            </Box>
          </Box>

          {/* Technology Stack Filter */}
          <FormControl fullWidth>
            <InputLabel id="tech-stack-filter-label">Technology Stack</InputLabel>
            <Select
              labelId="tech-stack-filter-label"
              multiple
              value={technologyStackFilter}
              onChange={e => {
                const value = e.target.value
                // Wandeln Sie in String-Array um
                const techStackValues =
                  typeof value === 'string' ? value.split(',') : (value as string[])

                onFilterChange({
                  technologyStackFilter: techStackValues,
                })
              }}
              input={<OutlinedInput label="Technology Stack" />}
              renderValue={selected => selected.join(', ')}
            >
              {availableTechStack.map(tech => (
                <MenuItem key={tech} value={tech}>
                  <Checkbox checked={technologyStackFilter.indexOf(tech) > -1} />
                  <ListItemText primary={tech} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Vendor Filter */}
          <FormControl fullWidth>
            <InputLabel id="vendor-filter-label">Anbieter</InputLabel>
            <Select
              labelId="vendor-filter-label"
              multiple
              value={vendorFilter ? [vendorFilter] : []}
              onChange={e => {
                const value = e.target.value
                // Wir implementieren hier Single-Select
                const vendorValue =
                  Array.isArray(value) && value.length > 0
                    ? value[value.length - 1]
                    : typeof value === 'string'
                      ? value
                      : ''

                onFilterChange({
                  vendorFilter: vendorValue,
                })
              }}
              input={<OutlinedInput label="Anbieter" />}
              renderValue={selected => selected.join(', ')}
            >
              {availableVendors.map(vendor => (
                <MenuItem key={vendor} value={vendor}>
                  <Checkbox checked={vendorFilter === vendor} />
                  <ListItemText primary={vendor} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Beschreibungs-Filter */}
          <TextField
            fullWidth
            label="Beschreibung enthält"
            value={descriptionFilter}
            onChange={e => {
              onFilterChange({
                descriptionFilter: e.target.value,
              })
            }}
            margin="normal"
          />

          {/* Verantwortlicher-Filter */}
          <TextField
            fullWidth
            label="Verantwortlicher"
            value={ownerFilter}
            onChange={e => {
              onFilterChange({
                ownerFilter: e.target.value,
              })
            }}
            margin="normal"
            helperText="Vorname oder Nachname eingeben"
          />

          {/* Aktualisiert-Filter */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1">Aktualisiert (Datum)</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Von"
                type="date"
                value={updatedDateRange[0]}
                onChange={e => {
                  onFilterChange({
                    updatedDateRange: [e.target.value, updatedDateRange[1]],
                  })
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Bis"
                type="date"
                value={updatedDateRange[1]}
                onChange={e => {
                  onFilterChange({
                    updatedDateRange: [updatedDateRange[0], e.target.value],
                  })
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button
          startIcon={<ClearAllIcon />}
          onClick={handleFilterReset}
          color="secondary"
          variant="outlined"
        >
          Filter zurücksetzen
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Abbrechen
          </Button>
          <Button onClick={handleApply} color="primary" variant="contained">
            Anwenden
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ApplicationFilterDialog
