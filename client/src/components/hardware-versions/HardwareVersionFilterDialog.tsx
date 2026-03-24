'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters } from './utils'

const HardwareVersionFilterDialog: React.FC<FilterProps> = ({
  filterState,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
  availableProducts,
}) => {
  const t = useTranslations('hardwareVersions.filter')

  const filterFields: FilterField[] = [
    {
      id: 'versionFilter',
      label: t('versionContains'),
      type: 'text',
      placeholder: t('versionPlaceholder'),
    },
    {
      id: 'productIdFilter',
      label: t('hardwareProduct'),
      type: 'select',
      options: [{ value: '', label: t('allProducts') }, ...availableProducts],
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

export default HardwareVersionFilterDialog
