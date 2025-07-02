'use client'

import React from 'react'
import GenericFilterDialog, { FilterField, GenericFilterState } from '../common/GenericFilterDialog'
import { DataClassification } from '../../gql/generated'
import { getClassificationLabel } from './utils'

export interface DataObjectFilterState {
  classifications: DataClassification[]
  formats: string[]
  sources: string[]
  owners: string[]
  usedByApplications: string[]
  relatedToCapabilities: string[]
  partOfArchitectures: string[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface DataObjectFilterOptions {
  availableFormats: string[]
  availableSources: string[]
  availableOwners: string[]
  availableUsedByApplications: string[]
  availableRelatedToCapabilities: string[]
  availablePartOfArchitectures: string[]
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
    return (
      (fs.classifications?.length || 0) +
      (fs.formats?.length || 0) +
      (fs.sources?.length || 0) +
      (fs.owners?.length || 0) +
      (fs.usedByApplications?.length || 0) +
      (fs.relatedToCapabilities?.length || 0) +
      (fs.partOfArchitectures?.length || 0) +
      (fs.descriptionFilter ? 1 : 0) +
      (fs.updatedDateRange?.[0] || fs.updatedDateRange?.[1] ? 1 : 0)
    )
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
      label: 'Datenquellen',
      type: 'multiSelect',
      options: filterOptions.availableSources.map(source => ({
        value: source,
        label: source,
      })),
    },
    // Verantwortliche Filter
    {
      id: 'owners',
      label: 'Verantwortliche',
      type: 'multiSelect',
      options: filterOptions.availableOwners.map(owner => ({
        value: owner,
        label: owner,
      })),
    },
    // Verwendet von Anwendungen Filter
    {
      id: 'usedByApplications',
      label: 'Verwendet von Anwendungen',
      type: 'multiSelect',
      options: filterOptions.availableUsedByApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Bezug zu Capabilities Filter
    {
      id: 'relatedToCapabilities',
      label: 'Bezug zu Capabilities',
      type: 'multiSelect',
      options: filterOptions.availableRelatedToCapabilities.map(cap => ({
        value: cap,
        label: cap,
      })),
    },
    // Teil von Architekturen Filter
    {
      id: 'partOfArchitectures',
      label: 'Teil von Architekturen',
      type: 'multiSelect',
      options: filterOptions.availablePartOfArchitectures.map(arch => ({
        value: arch,
        label: arch,
      })),
    },
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: 'Beschreibung enthält',
      type: 'text',
      placeholder: 'Geben Sie einen Text ein...',
    },
    // Aktualisiert-Filter
    {
      id: 'updatedDateRange',
      label: 'Aktualisiert (Datum)',
      type: 'dateRange',
      fromLabel: 'Von',
      toLabel: 'Bis',
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
