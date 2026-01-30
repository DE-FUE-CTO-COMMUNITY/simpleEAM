'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'

const PersonFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableDepartments,
  availableRoles,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('persons.filter')

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Abteilungs Filter
    {
      id: 'departmentFilter',
      label: t('department'),
      type: 'multiSelect',
      options: availableDepartments.map(department => ({
        value: department,
        label: department,
      })),
    },
    // Rollen Filter
    {
      id: 'roleFilter',
      label: t('role'),
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
      placeholder: t('searchPlaceholder'),
    },
    // Aktualisierungsdatum Filter
    {
      id: 'updatedDateRange',
      label: t('updatedDateRange'),
      type: 'dateRange',
      fromLabel: t('dateFrom'),
      toLabel: t('dateTo'),
    },
  ]

  return (
    <GenericFilterDialog
      title={t('title')}
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
