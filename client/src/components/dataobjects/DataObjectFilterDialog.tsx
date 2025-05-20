'use client'

import React from 'react'
import GenericFilterDialog, { FilterField, GenericFilterState } from '../common/GenericFilterDialog'
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
  // Zähle die aktiven Filter
  const countActiveFilters = (fs: GenericFilterState) => {
    return (fs.classifications?.length || 0) + (fs.formats?.length || 0) + (fs.sources?.length || 0)
  }

  // Definiere Filterfelder für den generischen Dialog
  const filterFields: FilterField[] = [
    // Klassifikationsfilter
    {
      id: 'classifications',
      label: 'Klassifikation',
      type: 'multiSelect',
      options: Object.values(DataClassification).map(classification => ({
        value: classification,
        label: getClassificationLabel(classification),
      })),
      valueFormatter: value => getClassificationLabel(value as DataClassification),
    },
    // Formatfilter
    {
      id: 'formats',
      label: 'Format',
      type: 'multiSelect',
      options: filterOptions.availableFormats.map(format => ({
        value: format,
        label: format,
      })),
    },
    // Quellenfilter
    {
      id: 'sources',
      label: 'Quelle',
      type: 'multiSelect',
      options: filterOptions.availableSources.map(source => ({
        value: source,
        label: source,
      })),
    },
  ]

  // Handler für Änderungen der Filter
  const handleFilterChange = (partialState: Partial<GenericFilterState>) => {
    onFiltersChange({ ...filters, ...partialState })
  }

  // Wenn der Dialog nicht offen ist, nichts rendern
  if (!open) return null

  return (
    <GenericFilterDialog
      title="Filter für Datenobjekte"
      filterState={filters}
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      onResetFilter={onResetFilters}
      onClose={onClose}
      onApply={() => onClose()}
      countActiveFilters={countActiveFilters}
    />
  )
}

export default DataObjectFilterDialog
