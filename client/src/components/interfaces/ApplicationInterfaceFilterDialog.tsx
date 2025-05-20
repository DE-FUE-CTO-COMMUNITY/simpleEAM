'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { getInterfaceTypeLabel } from '../../types/applicationInterface'
import { InterfaceType } from '../../gql/generated'
import { ApplicationInterfaceFilterState } from './useApplicationInterfaceFilter'

interface FilterProps {
  filterState: ApplicationInterfaceFilterState
  availableInterfaceTypes: InterfaceType[]
  availableDataObjects: { id: string; name: string }[]
  onFilterChange: (newFilter: Partial<ApplicationInterfaceFilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}

/**
 * Zählt die Anzahl der aktiven Filter
 */
export const countActiveFilters = (filterState: ApplicationInterfaceFilterState): number => {
  let count = 0

  if (filterState.interfaceTypeFilter?.length) count++
  if (filterState.dataObjectFilter?.length) count++
  if (filterState.updatedDateRange?.from || filterState.updatedDateRange?.to) count++

  return count
}

const ApplicationInterfaceFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableInterfaceTypes,
  availableDataObjects,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Schnittstellentyp Filter
    {
      id: 'interfaceTypeFilter',
      label: 'Schnittstellentyp',
      type: 'multiSelect',
      options: availableInterfaceTypes.map(type => ({
        value: type,
        label: getInterfaceTypeLabel(type),
      })),
      valueFormatter: value => getInterfaceTypeLabel(value as InterfaceType),
    },
    // Datenobjekte Filter
    {
      id: 'dataObjectFilter',
      label: 'Datenobjekte',
      type: 'multiSelect',
      options: availableDataObjects.map(obj => ({
        value: obj.id,
        label: obj.name,
      })),
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
      title="Filter für Schnittstellen"
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

export default ApplicationInterfaceFilterDialog
