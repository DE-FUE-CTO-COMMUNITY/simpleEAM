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
  CircularProgress,
} from '@mui/material'
import { ClearAll as ClearAllIcon } from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { GET_PERSONS } from '@/graphql/person'
import { FilterProps } from './types'
import { getLevelLabel, countActiveFilters } from './utils'
import { CapabilityStatus, Person } from '../../gql/generated'

const CapabilityFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableStatuses,
  availableTags,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const {
    statusFilter,
    maturityLevelFilter,
    businessValueRange,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  } = filterState

  // Personen aus der GraphQL-API laden
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS)
  const persons = personsData?.people || []

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
      <DialogTitle>Filter für Business Capabilities</DialogTitle>
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
                // Stellen Sie sicher, dass die Werte als CapabilityStatus-Enum behandelt werden
                const statusValues =
                  typeof value === 'string'
                    ? (value.split(',') as CapabilityStatus[])
                    : (value as CapabilityStatus[])

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

          {/* Reifegrad Filter */}
          <FormControl fullWidth>
            <InputLabel id="maturity-level-filter-label">Reifegrad</InputLabel>
            <Select
              labelId="maturity-level-filter-label"
              multiple
              value={maturityLevelFilter}
              onChange={e => {
                const value = e.target.value
                onFilterChange({
                  maturityLevelFilter:
                    typeof value === 'string' ? value.split(',').map(Number) : value,
                })
              }}
              input={<OutlinedInput label="Reifegrad" />}
              renderValue={selected => selected.map(level => getLevelLabel(level)).join(', ')}
            >
              {[0, 1, 2, 3].map(level => (
                <MenuItem key={level} value={level}>
                  <Checkbox checked={maturityLevelFilter.indexOf(level) > -1} />
                  <ListItemText primary={getLevelLabel(level)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Geschäftswert Range Filter */}
          <Box>
            <Typography gutterBottom>Geschäftswert</Typography>
            <Slider
              value={businessValueRange}
              onChange={(_, newValue) =>
                onFilterChange({ businessValueRange: newValue as [number, number] })
              }
              valueLabelDisplay="auto"
              min={0}
              max={10}
              marks={[
                { value: 0, label: '0' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
              ]}
            />
          </Box>

          {/* Tags Filter */}
          <FormControl fullWidth>
            <InputLabel id="tags-filter-label">Tags</InputLabel>
            <Select
              labelId="tags-filter-label"
              multiple
              value={tagsFilter}
              onChange={e => {
                const value = e.target.value
                onFilterChange({
                  tagsFilter: typeof value === 'string' ? value.split(',') : value,
                })
              }}
              input={<OutlinedInput label="Tags" />}
              renderValue={selected => selected.join(', ')}
            >
              {availableTags.map(tag => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={tagsFilter.indexOf(tag) > -1} />
                  <ListItemText primary={tag} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Beschreibung Filter */}
          <TextField
            label="Beschreibung enthält"
            fullWidth
            value={descriptionFilter}
            onChange={e => onFilterChange({ descriptionFilter: e.target.value })}
            placeholder="Geben Sie einen Text ein..."
          />

          {/* Verantwortlicher Filter */}
          <FormControl fullWidth>
            <InputLabel id="owner-filter-label">Verantwortlicher</InputLabel>
            <Select
              labelId="owner-filter-label"
              value={ownerFilter}
              onChange={e => onFilterChange({ ownerFilter: e.target.value })}
              input={<OutlinedInput label="Verantwortlicher" />}
              disabled={personsLoading}
              startAdornment={personsLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            >
              <MenuItem value="">
                <em>Nicht ausgewählt</em>
              </MenuItem>
              {persons.map((person: Person) => (
                <MenuItem key={person.id} value={person.id}>
                  {`${person.firstName} ${person.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Aktualisierungsdatum Filter */}
          <Box>
            <Typography gutterBottom>Aktualisiert im Zeitraum</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Von"
                type="date"
                value={updatedDateRange[0]}
                onChange={e =>
                  onFilterChange({
                    updatedDateRange: [e.target.value, updatedDateRange[1]],
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <TextField
                label="Bis"
                type="date"
                value={updatedDateRange[1]}
                onChange={e =>
                  onFilterChange({
                    updatedDateRange: [updatedDateRange[0], e.target.value],
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
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

export default CapabilityFilterDialog
