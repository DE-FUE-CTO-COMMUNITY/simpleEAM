'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterState } from './types'
import { countActiveFilters } from './utils'
import {
  SupplierType as SupplierTypeEnum,
  SupplierStatus,
  RiskClassification,
  StrategicImportance,
} from '@/gql/generated'

interface SuppliersFilterProps {
  filterState: FilterState
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}

export function SuppliersFilterDialog({
  filterState,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}: SuppliersFilterProps) {
  const t = useTranslations('suppliers')
  const tType = useTranslations('suppliers.supplierTypes')
  const tStatus = useTranslations('suppliers.statuses')
  const tRisk = useTranslations('suppliers.riskClassifications')
  const tImportance = useTranslations('suppliers.strategicImportances')
  const tCommon = useTranslations('common')

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    {
      id: 'supplierTypeFilter',
      label: t('form.supplierType'),
      type: 'multiSelect',
      options: Object.values(SupplierTypeEnum).map(value => ({
        value,
        label: tType(value),
      })),
    },
    {
      id: 'statusFilter',
      label: t('form.status'),
      type: 'multiSelect',
      options: Object.values(SupplierStatus).map(value => ({
        value,
        label: tStatus(value),
      })),
    },
    {
      id: 'riskClassificationFilter',
      label: t('form.riskClassification'),
      type: 'multiSelect',
      options: Object.values(RiskClassification).map(value => ({
        value,
        label: tRisk(value),
      })),
    },
    {
      id: 'strategicImportanceFilter',
      label: t('form.strategicImportance'),
      type: 'multiSelect',
      options: Object.values(StrategicImportance).map(value => ({
        value,
        label: tImportance(value),
      })),
    },
    {
      id: 'descriptionFilter',
      label: t('form.description'),
      type: 'text',
      placeholder: t('searchPlaceholder'),
    },
    {
      id: 'updatedDateRange',
      label: t('table.updatedAt'),
      type: 'dateRange',
      fromLabel: tCommon('from'),
      toLabel: tCommon('to'),
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

export default SuppliersFilterDialog
