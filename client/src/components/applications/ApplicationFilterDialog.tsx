'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { getCriticalityLabel, countActiveFilters } from './utils'
import { ApplicationStatus, CriticalityLevel } from '../../gql/generated'

const ApplicationFilterDialogWithGeneric: React.FC<FilterProps> = ({
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
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Status Filter
    {
      id: 'statusFilter',
      label: 'Status',
      type: 'multiSelect',
      options: availableStatuses.map(status => ({
        value: status,
        label: status,
      })),
    },
    // Kritikalitäts-Filter
    {
      id: 'criticalityFilter',
      label: 'Kritikalität',
      type: 'multiSelect',
      options: availableCriticalities.map(criticality => ({
        value: criticality,
        label: getCriticalityLabel(criticality),
      })),
      valueFormatter: value => getCriticalityLabel(value as CriticalityLevel),
    },
    // Kosten Range Filter
    {
      id: 'costRangeFilter',
      label: 'Kosten Range',
      type: 'slider',
      min: 0,
      max: 1000000,
      step: 10000,
      valueFormatter: value => `${value.toLocaleString('de-DE')} €`,
    },
    // Technology Stack Filter
    {
      id: 'technologyStackFilter',
      label: 'Technology Stack',
      type: 'multiSelect',
      options: availableTechStack.map(tech => ({
        value: tech,
        label: tech,
      })),
    },
    // Vendor Filter
    {
      id: 'vendorFilter',
      label: 'Anbieter',
      type: 'select',
      options: availableVendors.map(vendor => ({
        value: vendor,
        label: vendor,
      })),
    },
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: 'Beschreibung enthält',
      type: 'text',
      placeholder: 'Geben Sie einen Text ein...',
    },
    // Verantwortlicher-Filter
    {
      id: 'ownerFilter',
      label: 'Verantwortlicher',
      type: 'personSelect',
      emptyLabel: 'Alle Verantwortlichen',
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

  return (
    <GenericFilterDialog
      title="Filter für Applikationen"
      filterState={filterState}
      filterFields={filterFields}
      onFilterChange={onFilterChange}
      onResetFilter={onResetFilter}
      onClose={onClose}
      onApply={onApply}
      countActiveFilters={countActiveFilters}
    />
  )
}

export default ApplicationFilterDialogWithGeneric
