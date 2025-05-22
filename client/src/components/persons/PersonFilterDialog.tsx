'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'
import { GenericFilterState } from '../common/GenericFilterDialog'

const PersonFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableDepartments,
  availableRoles,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Abteilungs Filter
    {
      id: 'departmentFilter',
      label: 'Abteilung',
      type: 'multiSelect',
      options: availableDepartments.map(department => ({
        value: department,
        label: department,
      })),
    },
    // Rollen Filter
    {
      id: 'roleFilter',
      label: 'Rolle',
      type: 'multiSelect',
      options: availableRoles.map(role => ({
        value: role,
        label: role,
      })),
    },
    // Suchtext Filter
    {
      id: 'searchFilter',
      label: 'Suche',
      type: 'text',
      placeholder: 'Geben Sie einen Suchtext ein...',
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
      title="Filter für Personen"
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

export default PersonFilterDialog
