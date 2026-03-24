'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'

const SoftwareProductFilterDialog: React.FC<FilterProps> = ({
  filterState,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('softwareProducts.filter')
  const tLifecycle = useTranslations('softwareProducts.lifecycleStatuses')

  const filterFields: FilterField[] = [
    {
      id: 'nameFilter',
      label: t('nameContains'),
      type: 'text',
      placeholder: t('namePlaceholder'),
    },
    {
      id: 'lifecycleStatusFilter',
      label: t('lifecycleStatus'),
      type: 'select',
      options: [
        { value: '', label: t('allLifecycleStatuses') },
        { value: 'SUPPORTED', label: tLifecycle('SUPPORTED') },
        { value: 'APPROACHING_EOS', label: tLifecycle('APPROACHING_EOS') },
        { value: 'APPROACHING_EOL', label: tLifecycle('APPROACHING_EOL') },
        { value: 'EOS', label: tLifecycle('EOS') },
        { value: 'EOL', label: tLifecycle('EOL') },
        { value: 'UNSUPPORTED', label: tLifecycle('UNSUPPORTED') },
      ],
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

export default SoftwareProductFilterDialog
