'use client'

import React from 'react'
import GenericFilterDialog, { FilterField, GenericFilterState } from '../common/GenericFilterDialog'
import { InfrastructureType, InfrastructureStatus } from '../../gql/generated'
import { getInfrastructureTypeLabel, getInfrastructureStatusLabel } from './utils'

export interface InfrastructureFilterState {
  infrastructureTypes: InfrastructureType[]
  statuses: InfrastructureStatus[]
  vendors: string[]
  locations: string[]
  owners: string[]
  hostsApplications: string[]
  partOfArchitectures: string[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface InfrastructureFilterOptions {
  availableVendors: string[]
  availableLocations: string[]
  availableOwners: string[]
  availableHostsApplications: string[]
  availablePartOfArchitectures: string[]
}

interface InfrastructureFilterDialogProps {
  open: boolean
  onClose: () => void
  filters: InfrastructureFilterState
  onFiltersChange: (filters: InfrastructureFilterState) => void
  onResetFilters: () => void
  filterOptions: InfrastructureFilterOptions
}

const InfrastructureFilterDialog: React.FC<InfrastructureFilterDialogProps> = ({
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
      (fs.infrastructureTypes?.length || 0) +
      (fs.statuses?.length || 0) +
      (fs.vendors?.length || 0) +
      (fs.locations?.length || 0) +
      (fs.owners?.length || 0) +
      (fs.hostsApplications?.length || 0) +
      (fs.partOfArchitectures?.length || 0) +
      (fs.descriptionFilter ? 1 : 0) +
      (fs.updatedDateRange?.[0] || fs.updatedDateRange?.[1] ? 1 : 0)
    )
  }

  // Definiere Filterfelder für den generischen Dialog
  const filterFields: FilterField[] = [
    // Infrastrukturtyp-Filter
    {
      id: 'infrastructureTypes',
      label: 'Infrastrukturtyp',
      type: 'multiSelect',
      options: Object.values(InfrastructureType).map(type => ({
        value: type,
        label: getInfrastructureTypeLabel(type),
      })),
      valueFormatter: value => getInfrastructureTypeLabel(value as InfrastructureType),
    },
    // Status-Filter
    {
      id: 'statuses',
      label: 'Status',
      type: 'multiSelect',
      options: Object.values(InfrastructureStatus).map(status => ({
        value: status,
        label: getInfrastructureStatusLabel(status),
      })),
      valueFormatter: value => getInfrastructureStatusLabel(value as InfrastructureStatus),
    },
    // Anbieter-Filter
    {
      id: 'vendors',
      label: 'Anbieter',
      type: 'multiSelect',
      options: filterOptions.availableVendors.map(vendor => ({
        value: vendor,
        label: vendor,
      })),
    },
    // Standort-Filter
    {
      id: 'locations',
      label: 'Standort',
      type: 'multiSelect',
      options: filterOptions.availableLocations.map(location => ({
        value: location,
        label: location,
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
    // Gehostete Applikationen Filter
    {
      id: 'hostsApplications',
      label: 'Gehostete Applikationen',
      type: 'multiSelect',
      options: filterOptions.availableHostsApplications.map(app => ({
        value: app,
        label: app,
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
      title="Filter für Infrastruktur"
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

export default InfrastructureFilterDialog
