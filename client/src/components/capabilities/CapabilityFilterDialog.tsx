'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { getLevelLabel, countActiveFilters } from './utils'

const CapabilityFilterDialogWithGeneric: React.FC<FilterProps> = ({
  filterState,
  availableStatuses,
  availableTags,
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
    // Reifegrad Filter
    {
      id: 'maturityLevelFilter',
      label: 'Reifegrad',
      type: 'multiSelect',
      options: [0, 1, 2, 3].map(level => ({
        value: level.toString(),
        label: getLevelLabel(level),
      })),
      valueFormatter: value => getLevelLabel(Number(value)),
    },
    // Geschäftswert Range Filter
    {
      id: 'businessValueRange',
      label: 'Geschäftswert',
      type: 'slider',
      min: 0,
      max: 10,
      marks: [
        { value: 0, label: '0' },
        { value: 5, label: '5' },
        { value: 10, label: '10' },
      ],
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
    // Beschreibung Filter
    {
      id: 'descriptionFilter',
      label: 'Beschreibung enthält',
      type: 'text',
      placeholder: 'Geben Sie einen Text ein...',
    },
    // Verantwortlicher Filter
    {
      id: 'ownerFilter',
      label: 'Verantwortlicher',
      type: 'personSelect',
      emptyLabel: 'Alle Verantwortlichen',
    },
    // Aktualisierungsdatum Filter
    {
      id: 'updatedDateRange',
      label: 'Aktualisiert im Zeitraum',
      type: 'dateRange',
      fromLabel: 'Von',
      toLabel: 'Bis',
    },
  ]

  return (
    <GenericFilterDialog
      title="Filter für Business Capabilities"
      filterState={filterState}
      filterFields={filterFields}
      onFilterChange={onFilterChange}
      onResetFilter={onResetFilter}
      onClose={onClose}
      onApply={onApply}
      countActiveFilters={fs => countActiveFilters(fs as any)}
    />
  )
}

export default CapabilityFilterDialogWithGeneric
