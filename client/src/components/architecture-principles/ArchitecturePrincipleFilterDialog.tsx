'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { countActiveFilters, useCategoryLabel, usePriorityLabel } from './utils'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'

const ArchitecturePrincipleFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableCategories,
  availablePriorities,
  availableTags,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('architecturePrinciples.filter')
  const getCategoryLabel = useCategoryLabel()
  const getPriorityLabel = usePriorityLabel()

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Kategorie Filter
    {
      id: 'categoryFilter',
      label: t('category'),
      type: 'multiSelect',
      options: availableCategories.map(category => ({
        value: category,
        label: getCategoryLabel(category),
      })),
      valueFormatter: value => getCategoryLabel(value as PrincipleCategory),
    },
    // Priority filter
    {
      id: 'priorityFilter',
      label: t('priority'),
      type: 'multiSelect',
      options: availablePriorities.map(priority => ({
        value: priority,
        label: getPriorityLabel(priority),
      })),
      valueFormatter: value => getPriorityLabel(value as PrinciplePriority),
    },
    // Status Filter
    {
      id: 'isActiveFilter',
      label: t('status'),
      type: 'select',
      options: [
        { value: 'all', label: 'Alle' },
        { value: 'true', label: 'Aktiv' },
        { value: 'false', label: 'Inaktiv' },
      ],
    },
    // Tags Filter
    {
      id: 'tagsFilter',
      label: 'Tags',
      type: 'multiSelect',
      options: availableTags.map(tag => ({
        value: tag,
        label: tag,
      })),
    },
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: 'Geben Sie einen Text ein...',
    },
    // Owner filter
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: t('allOwners'),
    },
    // Aktualisiert-Filter
    {
      id: 'updatedDateRange',
      label: t('updatedAt'),
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

export default ArchitecturePrincipleFilterDialog
