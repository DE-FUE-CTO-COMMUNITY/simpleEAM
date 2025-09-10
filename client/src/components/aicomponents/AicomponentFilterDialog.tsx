'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { useAiTypeLabel, useStatusLabel, countActiveFilters } from './utils'
import { AiComponentType, AiComponentStatus } from '../../gql/generated'

const AicomponentFilterDialogWithGeneric: React.FC<FilterProps> = ({
  filterState,
  availableAiTypes,
  availableStatuses,
  availableProviders,
  availableTags,
  // availableOwners, // TODO: Implement when personSelect supports options
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('aicomponents.filter')
  const getAiTypeLabel = useAiTypeLabel()
  const getStatusLabel = useStatusLabel()

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // AI Type Filter
    {
      id: 'aiTypeFilter',
      label: t('aiType'),
      type: 'multiSelect',
      options: availableAiTypes.map(type => ({
        value: type,
        label: getAiTypeLabel(type),
      })),
      valueFormatter: value => getAiTypeLabel(value as AiComponentType),
    },
    // Status Filter
    {
      id: 'statusFilter',
      label: t('status'),
      type: 'multiSelect',
      options: availableStatuses.map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
      valueFormatter: value => getStatusLabel(value as AiComponentStatus),
    },
    // Accuracy Range Filter
    {
      id: 'accuracyRange',
      label: t('accuracyRange'),
      type: 'slider',
      min: 0,
      max: 100,
      step: 1,
      valueFormatter: value => `${value}%`,
    },
    // Provider Filter
    {
      id: 'providerFilter',
      label: t('provider'),
      type: 'select',
      options: availableProviders.map(provider => ({
        value: provider,
        label: provider,
      })),
    },
    // Costs Range Filter
    {
      id: 'costsRange',
      label: t('costsRange'),
      type: 'slider',
      min: 0,
      max: 1000000,
      step: 1000,
      valueFormatter: value => `${value.toLocaleString('de-DE')} €`,
    },
    // Description Filter
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
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
    // Owner Filter
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
    // Training Date Range Filter
    {
      id: 'trainingDateRange',
      label: t('trainingDateRange'),
      type: 'dateRange',
      fromLabel: t('dateFrom'),
      toLabel: t('dateTo'),
    },
    // Last Updated Range Filter
    {
      id: 'lastUpdatedRange',
      label: t('lastUpdatedRange'),
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

export default AicomponentFilterDialogWithGeneric
