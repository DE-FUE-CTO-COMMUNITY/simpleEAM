'use client'

import React, { ReactNode } from 'react'
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { ClearAll as ClearAllIcon } from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { GET_PERSONS } from '@/graphql/person'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { Person } from '../../gql/generated'
import { useTranslations } from 'next-intl'

// Definiere einen generischen Typ für die Filter
export interface FilterOption<T = string> {
  value: T
  label: string
}

export type FilterConfigType =
  | 'select'
  | 'multiSelect'
  | 'slider'
  | 'text'
  | 'date'
  | 'dateRange'
  | 'personSelect'

// Basis-Interface für alle Filterfelder
export interface BaseFilterField {
  id: string
  label: string
  type: FilterConfigType
}

// Multi-Select Filterfeld
export interface MultiSelectFilterField extends BaseFilterField {
  type: 'multiSelect'
  options: FilterOption[]
  valueFormatter?: (value: string) => string
}

// Single-Select Filterfeld
export interface SelectFilterField extends BaseFilterField {
  type: 'select'
  options: FilterOption[]
}

// Slider Filterfeld für Bereiche
export interface SliderFilterField extends BaseFilterField {
  type: 'slider'
  min: number
  max: number
  step?: number
  minLabel?: string
  maxLabel?: string
  marks?: { value: number; label: string }[]
  valueFormatter?: (value: number) => string
}

// Textfeld Filter
export interface TextFilterField extends BaseFilterField {
  type: 'text'
  placeholder?: string
}

// Datumsfeld Filter
export interface DateFilterField extends BaseFilterField {
  type: 'date'
}

// Datumsbereich Filter
export interface DateRangeFilterField extends BaseFilterField {
  type: 'dateRange'
  fromLabel?: string
  toLabel?: string
}

// Person-Auswahl Filter
export interface PersonSelectFilterField extends BaseFilterField {
  type: 'personSelect'
  emptyLabel?: string
}

// Union-Typ für alle möglichen Filterfelder
export type FilterField =
  | MultiSelectFilterField
  | SelectFilterField
  | SliderFilterField
  | TextFilterField
  | DateFilterField
  | DateRangeFilterField
  | PersonSelectFilterField

// Der generische Filterstand, der dynamisch je nach FilterFields aufgebaut wird
export type GenericFilterState = Record<string, any>

// Props für den generischen FilterDialog
export interface GenericFilterProps {
  title: string
  filterState: GenericFilterState
  filterFields: FilterField[]
  onFilterChange: (newFilter: Partial<GenericFilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
  countActiveFilters: (filterState: GenericFilterState) => number
}

/**
 * Ein generischer FilterDialog, der dynamisch basierend auf den angegebenen Filterfeldern erzeugt wird.
 *
 * Beispiel:
 * ```tsx
 * const fields: FilterField[] = [
 *   {
 *     id: 'statusFilter',
 *     label: 'Status',
 *     type: 'multiSelect',
 *     options: [
 *       { value: 'ACTIVE', label: 'Aktiv' },
 *       { value: 'INACTIVE', label: 'Inaktiv' }
 *     ]
 *   },
 *   {
 *     id: 'businessValueRange',
 *     label: 'Geschäftswert',
 *     type: 'slider',
 *     min: 0,
 *     max: 10,
 *     marks: [
 *       { value: 0, label: '0' },
 *       { value: 5, label: '5' },
 *       { value: 10, label: '10' }
 *     ]
 *   }
 * ];
 * ```
 */
const GenericFilterDialog: React.FC<GenericFilterProps> = ({
  title,
  filterState,
  filterFields,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
  countActiveFilters,
}) => {
  const t = useTranslations('common')
  // Lade Personen für den PersonSelect-Filter
  const personWhere = useCompanyWhere('companies')
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })
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

  // Rendert ein einzelnes Filterfeld basierend auf seinem Typ
  const renderFilterField = (field: FilterField): ReactNode => {
    const value = filterState[field.id]

    switch (field.type) {
      case 'multiSelect':
        return (
          <FormControl fullWidth key={field.id}>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              multiple
              value={value || []}
              onChange={e => {
                const newValue = e.target.value
                const filterValues = typeof newValue === 'string' ? newValue.split(',') : newValue
                onFilterChange({ [field.id]: filterValues })
              }}
              input={<OutlinedInput label={field.label} />}
              renderValue={selected => {
                if (Array.isArray(selected)) {
                  return selected
                    .map(val => {
                      const option = field.options.find(opt => opt.value === val)
                      return option
                        ? field.valueFormatter
                          ? field.valueFormatter(String(option.value))
                          : option.label
                        : val
                    })
                    .join(', ')
                }
                return selected
              }}
            >
              {field.options.map(option => (
                <MenuItem key={String(option.value)} value={option.value}>
                  <Checkbox
                    checked={Array.isArray(value) ? value.indexOf(option.value) > -1 : false}
                  />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      case 'select':
        return (
          <FormControl fullWidth key={field.id}>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              value={value || ''}
              onChange={e => {
                onFilterChange({ [field.id]: e.target.value })
              }}
              input={<OutlinedInput label={field.label} />}
            >
              <MenuItem value="">
                <em>Nicht ausgewählt</em>
              </MenuItem>
              {field.options.map(option => (
                <MenuItem key={String(option.value)} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      case 'slider':
        return (
          <Box key={field.id}>
            <Typography gutterBottom>{field.label}</Typography>
            <Slider
              value={value || [field.min, field.max]}
              onChange={(_, newValue) => {
                onFilterChange({ [field.id]: newValue })
              }}
              valueLabelDisplay="auto"
              min={field.min}
              max={field.max}
              step={field.step || 1}
              marks={field.marks}
              valueLabelFormat={
                field.valueFormatter ? val => field.valueFormatter!(val as number) : undefined
              }
            />
            {Array.isArray(value) && value.length === 2 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {field.valueFormatter ? field.valueFormatter(value[0]) : value[0]}
                </Typography>
                <Typography variant="body2">
                  {field.valueFormatter ? field.valueFormatter(value[1]) : value[1]}
                </Typography>
              </Box>
            )}
          </Box>
        )

      case 'text':
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={e => {
              onFilterChange({ [field.id]: e.target.value })
            }}
            placeholder={field.placeholder}
            margin="normal"
          />
        )

      case 'date':
        return (
          <DatePicker
            key={field.id}
            label={field.label}
            value={value ? dayjs(value) : null}
            onChange={newValue => {
              const dateValue = newValue ? newValue.format('YYYY-MM-DD') : ''
              onFilterChange({ [field.id]: dateValue })
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
              },
            }}
          />
        )

      case 'dateRange':
        return (
          <Box key={field.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1">{field.label}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label={field.fromLabel || t('from')}
                value={
                  Array.isArray(value) && value.length >= 1 && value[0] ? dayjs(value[0]) : null
                }
                onChange={newValue => {
                  const dateValue = newValue ? newValue.format('YYYY-MM-DD') : ''
                  onFilterChange({
                    [field.id]: [
                      dateValue,
                      Array.isArray(value) && value.length >= 2 ? value[1] : '',
                    ],
                  })
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <DatePicker
                label={field.toLabel || t('to')}
                value={
                  Array.isArray(value) && value.length >= 2 && value[1] ? dayjs(value[1]) : null
                }
                onChange={newValue => {
                  const dateValue = newValue ? newValue.format('YYYY-MM-DD') : ''
                  onFilterChange({
                    [field.id]: [
                      Array.isArray(value) && value.length >= 1 ? value[0] : '',
                      dateValue,
                    ],
                  })
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </Box>
        )

      case 'personSelect':
        return (
          <FormControl fullWidth key={field.id}>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              value={value || ''}
              onChange={e => {
                onFilterChange({ [field.id]: e.target.value })
              }}
              input={<OutlinedInput label={field.label} />}
              disabled={personsLoading}
              startAdornment={personsLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            >
              <MenuItem value="">
                <em>{field.emptyLabel || 'Nicht ausgewählt'}</em>
              </MenuItem>
              {persons.map((person: Person) => (
                <MenuItem key={person.id} value={person.id}>
                  {`${person.firstName} ${person.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filterFields.map(field => renderFilterField(field))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button
          startIcon={<ClearAllIcon />}
          onClick={handleFilterReset}
          color="secondary"
          variant="outlined"
        >
          {t('resetFilter')}
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            {t('cancel')}
          </Button>
          <Button onClick={handleApply} color="primary" variant="contained">
            {t('applyFilter')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default GenericFilterDialog
