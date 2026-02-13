'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'

const VisionFilterDialog: React.FC<FilterProps> = ({
  filterState,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('visions.filter')

  const filterFields: FilterField[] = [
    {
      id: 'descriptionFilter',
      label: t('visionStatementContains'),
      type: 'text',
      placeholder: t('visionStatementPlaceholder'),
    },
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
    {
      id: 'yearRange',
      label: t('yearRange'),
      type: 'dateRange',
      fromLabel: t('dateFrom'),
      toLabel: t('dateTo'),
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

export default VisionFilterDialog
