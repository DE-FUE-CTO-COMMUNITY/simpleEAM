'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'
import { getInterfaceTypeLabel } from './utils'
import { InterfaceType } from '../../gql/generated'

const ApplicationInterfaceFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableInterfaceTypes,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Schnittstellentyp-Filter
    {
      id: 'interfaceTypeFilter',
      label: 'Schnittstellentyp',
      type: 'multiSelect',
      options: availableInterfaceTypes.map(type => ({
        value: type,
        label: getInterfaceTypeLabel(type),
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
      title="Filter für Schnittstellen"
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

export default ApplicationInterfaceFilterDialog
