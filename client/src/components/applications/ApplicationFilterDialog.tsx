'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { getCriticalityLabel, countActiveFilters } from './utils'
import { CriticalityLevel, TimeCategory, SevenRStrategy } from '../../gql/generated'

const ApplicationFilterDialogWithGeneric: React.FC<FilterProps> = ({
  filterState,
  availableStatuses,
  availableCriticalities,
  availableTechStack,
  availableVendors,
  availableTimeCategories,
  availableSevenRStrategies,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('applications.filter')
  const tStatus = useTranslations('applications.statuses')
  const tTimeCategory = useTranslations('applications.timeCategories')
  const tSevenR = useTranslations('applications.sevenRStrategies')

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Status Filter
    {
      id: 'statusFilter',
      label: t('status'),
      type: 'multiSelect',
      options: availableStatuses.map(status => ({
        value: status,
        label: tStatus(status),
      })),
    },
    // Criticality filter
    {
      id: 'criticalityFilter',
      label: t('criticality'),
      type: 'multiSelect',
      options: availableCriticalities.map(criticality => ({
        value: criticality,
        label: getCriticalityLabel(criticality), // TODO: Internationalize this function
      })),
      valueFormatter: value => getCriticalityLabel(value as CriticalityLevel),
    },
    // Kosten Range Filter
    {
      id: 'costRangeFilter',
      label: t('annualCosts'),
      type: 'slider',
      min: 0,
      max: 1000000,
      step: 10000,
      valueFormatter: value => `${value.toLocaleString('de-DE')} €`,
    },
    // Technology Stack Filter
    {
      id: 'technologyStackFilter',
      label: t('technologyStack'),
      type: 'multiSelect',
      options: availableTechStack.map(tech => ({
        value: tech,
        label: tech,
      })),
    },
    // Vendor Filter
    {
      id: 'vendorFilter',
      label: t('vendor'),
      type: 'select',
      options: availableVendors.map(vendor => ({
        value: vendor,
        label: vendor,
      })),
    },
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
    },
    // Owner filter
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
    // Aktualisiert-Filter
    {
      id: 'updatedDateRange',
      label: t('updatedDateRange'),
      type: 'dateRange',
      fromLabel: t('dateFrom'),
      toLabel: t('dateTo'),
    },
    // TIME-Kategorie Filter
    {
      id: 'timeCategoryFilter',
      label: t('timeCategory'),
      type: 'multiSelect',
      options: availableTimeCategories.map(category => ({
        value: category,
        label: tTimeCategory(category),
      })),
      valueFormatter: value => tTimeCategory(value as TimeCategory),
    },
    // 7R-Strategie Filter
    {
      id: 'sevenRStrategyFilter',
      label: t('sevenRStrategy'),
      type: 'multiSelect',
      options: availableSevenRStrategies.map(strategy => ({
        value: strategy,
        label: tSevenR(strategy),
      })),
      valueFormatter: value => tSevenR(value as SevenRStrategy),
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
      countActiveFilters={fs => countActiveFilters(fs as any)}
    />
  )
}

export default ApplicationFilterDialogWithGeneric
