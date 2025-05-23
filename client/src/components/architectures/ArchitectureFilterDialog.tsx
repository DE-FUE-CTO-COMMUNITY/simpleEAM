'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { getDomainLabel, getTypeLabel, countActiveFilters } from './utils'
import { ArchitectureDomain, ArchitectureType } from '../../gql/generated'

const ArchitectureFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableDomains,
  availableTypes,
  availableTags,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Domain Filter
    {
      id: 'domainFilter',
      label: 'Domain',
      type: 'multiSelect',
      options: availableDomains.map(domain => ({
        value: domain,
        label: getDomainLabel(domain),
      })),
      valueFormatter: value => getDomainLabel(value as ArchitectureDomain),
    },
    // Typ Filter
    {
      id: 'typeFilter',
      label: 'Typ',
      type: 'multiSelect',
      options: availableTypes.map(type => ({
        value: type,
        label: getTypeLabel(type),
      })),
      valueFormatter: value => getTypeLabel(value as ArchitectureType),
    },
    // Tags Filter
    {
      id: 'tagsFilter',
      label: 'Tags',
      type: 'multiSelect',
      options: availableTags.map(tag => ({
        value: tag,
        label: tag,
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
      title="Filter für Architekturen"
      filterState={filterState}
      filterFields={filterFields}
      countActiveFilters={countActiveFilters}
      onFilterChange={onFilterChange}
      onResetFilter={onResetFilter}
      onClose={onClose}
      onApply={onApply}
    />
  )
}

export default ArchitectureFilterDialog
