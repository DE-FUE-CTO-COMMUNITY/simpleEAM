'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { getCategoryLabel, getPriorityLabel, countActiveFilters } from './utils'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'

const ArchitecturePrincipleFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableCategories,
  availablePriorities,
  availableTags,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Kategorie Filter
    {
      id: 'categoryFilter',
      label: 'Kategorie',
      type: 'multiSelect',
      options: availableCategories.map(category => ({
        value: category,
        label: getCategoryLabel(category),
      })),
      valueFormatter: value => getCategoryLabel(value as PrincipleCategory),
    },
    // Priorität Filter
    {
      id: 'priorityFilter',
      label: 'Priorität',
      type: 'multiSelect',
      options: availablePriorities.map(priority => ({
        value: priority,
        label: getPriorityLabel(priority),
      })),
      valueFormatter: value => getPriorityLabel(value as PrinciplePriority),
    },
    // Status Filter
    {
      id: 'isActiveFilter',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'Alle' },
        { value: 'true', label: 'Aktiv' },
        { value: 'false', label: 'Inaktiv' },
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
      title="Filter für Architektur-Prinzipien"
      filterState={filterState}
      filterFields={filterFields}
      countActiveFilters={countActiveFilters as (filterState: any) => number}
      onFilterChange={onFilterChange}
      onResetFilter={onResetFilter}
      onClose={onClose}
      onApply={onApply}
    />
  )
}

export default ArchitecturePrincipleFilterDialog
