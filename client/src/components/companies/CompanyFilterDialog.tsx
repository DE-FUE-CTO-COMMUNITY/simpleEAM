'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterState } from './types'
import { countActiveFilters } from './utils'
import { CompanySize } from '../../gql/generated'

interface CompanyFilterProps {
  filterState: FilterState
  availableSizes?: CompanySize[]
  availableIndustries?: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}

export function CompanyFilterDialog({
  filterState,
  availableSizes = Object.values(CompanySize),
  // availableIndustries: _availableIndustries = [],
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}: CompanyFilterProps) {
  const t = useTranslations('companies')

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    {
      id: 'nameFilter',
      label: t('form.name'),
      type: 'text',
      placeholder: t('searchPlaceholder'),
    },
    {
      id: 'descriptionFilter',
      label: t('form.description'),
      type: 'text',
      placeholder: t('filter.descriptionPlaceholder'),
    },
    {
      id: 'industryFilter',
      label: t('form.industry'),
      type: 'text',
      placeholder: t('filter.industryPlaceholder'),
    },
    {
      id: 'addressFilter',
      label: t('form.address'),
      type: 'text',
      placeholder: t('filter.addressPlaceholder'),
    },
    {
      id: 'websiteFilter',
      label: t('form.website'),
      type: 'text',
      placeholder: t('filter.websitePlaceholder'),
    },
    {
      id: 'sizeFilter',
      label: t('form.size'),
      type: 'multiSelect',
      options: availableSizes.map(size => ({
        value: size,
        label: size.charAt(0) + size.slice(1).toLowerCase(),
      })),
    },
    {
      id: 'createdDateRange',
      label: t('filter.createdAtLabel'),
      type: 'dateRange',
      fromLabel: t('filter.fromLabel'),
      toLabel: t('filter.toLabel'),
    },
    {
      id: 'updatedDateRange',
      label: t('filter.updatedAtLabel'),
      type: 'dateRange',
      fromLabel: t('filter.fromLabel'),
      toLabel: t('filter.toLabel'),
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
      countActiveFilters={countActiveFilters as (filterState: any) => number}
    />
  )
}

export default CompanyFilterDialog
