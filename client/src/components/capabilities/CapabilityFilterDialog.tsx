'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('capabilities.filter')
  const tStatus = useTranslations('capabilities.statuses')
  const tMaturity = useTranslations('capabilities.maturityLevels')

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
    // Reifegrad Filter
    {
      id: 'maturityLevelFilter',
      label: t('maturityLevel'),
      type: 'multiSelect',
      options: [1, 2, 3, 4, 5].map(level => ({
        value: level.toString(),
        label: getLevelLabel(level, tMaturity),
      })),
      valueFormatter: value => getLevelLabel(Number(value), tMaturity),
    },
    // Business value range filter
    {
      id: 'businessValueRange',
      label: t('businessValue'),
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
      label: t('tags'),
      type: 'multiSelect',
      options: availableTags.map(tag => ({
        value: tag,
        label: tag,
      })),
    },
    // Beschreibung Filter
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
    },
    // Verantwortlicher Filter
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
    // Aktualisierungsdatum Filter
    {
      id: 'updatedDateRange',
      label: t('updatedInPeriod'),
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
      countActiveFilters={fs => countActiveFilters(fs as any)}
    />
  )
}

export default CapabilityFilterDialogWithGeneric
