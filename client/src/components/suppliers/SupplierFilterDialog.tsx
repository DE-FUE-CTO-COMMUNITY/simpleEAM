'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterState } from './types'
import { countActiveFilters } from './utils'

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

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // TODO: Definiere hier die spezifischen Filter-Felder für suppliers
    // Beispiele für verschiedene Filter-Typen:
    // 
    // Text-Filter:
    // {
    //   id: 'nameFilter',
    //   label: t('form.name'),
    //   type: 'text',
    //   placeholder: t('searchPlaceholder'),
    // },
    //
    // Multi-Select Filter:
    // {
    //   id: 'statusFilter',
    //   label: t('form.status'),
    //   type: 'multiSelect',
    //   options: availableStatuses.map(status => ({
    //     value: status,
    //     label: t(`statuses.${status}`)
    //   })),
    // },
    //
    // Datum-Bereich Filter:
    // {
    //   id: 'createdDateRange',
    //   label: 'Erstellungsdatum',
    //   type: 'dateRange',
    //   fromLabel: 'Von',
    //   toLabel: 'Bis',
    // },
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
