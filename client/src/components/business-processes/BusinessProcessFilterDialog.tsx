'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { ProcessStatus, ProcessType } from '../../gql/generated'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'

const BusinessProcessFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableStatuses,
  availableProcessTypes,
  availableCategories,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('businessProcesses.filter')
  const tStatuses = useTranslations('businessProcesses.statuses')
  const tTypes = useTranslations('businessProcesses.processTypes')

  const filterFields: FilterField[] = [
    {
      id: 'statusFilter',
      label: t('status'),
      type: 'multiSelect',
      options: availableStatuses.map(status => ({
        value: status,
        label: tStatuses(status),
      })),
      valueFormatter: value => tStatuses(value as ProcessStatus),
    },
    {
      id: 'processTypeFilter',
      label: t('processType'),
      type: 'multiSelect',
      options: availableProcessTypes.map(processType => ({
        value: processType,
        label: tTypes(processType),
      })),
      valueFormatter: value => tTypes(value as ProcessType),
    },
    {
      id: 'categoryFilter',
      label: t('category'),
      type: 'select',
      options: availableCategories.map(category => ({ value: category, label: category })),
    },
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
    },
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
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
      countActiveFilters={fs => countActiveFilters(fs as any)}
    />
  )
}

export default BusinessProcessFilterDialog
