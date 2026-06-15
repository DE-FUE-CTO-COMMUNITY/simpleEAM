'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { TransformationPriority, TransformationStatus } from '../../gql/generated'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters, usePriorityLabel, useStatusLabel } from './utils'

const TransformationFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableStatuses,
  availablePriorities,
  availableArchitectures,
  availableGoals,
  availableTags,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('transformations.filter')
  const getStatusLabel = useStatusLabel()
  const getPriorityLabel = usePriorityLabel()

  const filterFields: FilterField[] = [
    {
      id: 'statusFilter',
      label: t('status'),
      type: 'multiSelect',
      options: availableStatuses.map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
      valueFormatter: value => getStatusLabel(value as TransformationStatus),
    },
    {
      id: 'priorityFilter',
      label: t('priority'),
      type: 'multiSelect',
      options: availablePriorities.map(priority => ({
        value: priority,
        label: getPriorityLabel(priority),
      })),
      valueFormatter: value => getPriorityLabel(value as TransformationPriority),
    },
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
    {
      id: 'sourceArchitectureFilter',
      label: t('sourceArchitecture'),
      type: 'select',
      options: [
        { value: '', label: t('allArchitectures') },
        ...availableArchitectures.map(architecture => ({
          value: architecture.id,
          label: architecture.name,
        })),
      ],
    },
    {
      id: 'goalFilter',
      label: t('goal'),
      type: 'select',
      options: [
        { value: '', label: t('allGoals') },
        ...availableGoals.map(goal => ({ value: goal.id, label: goal.name })),
      ],
    },
    {
      id: 'tagsFilter',
      label: t('tags'),
      type: 'multiSelect',
      options: availableTags.map(tag => ({ value: tag, label: tag })),
    },
    {
      id: 'targetDateRange',
      label: t('targetDate'),
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
      countActiveFilters={countActiveFilters as (filterState: any) => number}
      onFilterChange={onFilterChange}
      onResetFilter={onResetFilter}
      onClose={onClose}
      onApply={onApply}
    />
  )
}

export default TransformationFilterDialog
