'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { useDomainLabel, useTypeLabel, countActiveFilters } from './utils'
import { ArchitectureDomain, ArchitectureType } from '../../gql/generated'
import { useTranslations } from 'next-intl'

const ArchitectureFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableDomains,
  availableTypes,
  availableTags,
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('architectures.filter')
  const tCommon = useTranslations('common')
  const getDomainLabelTranslated = useDomainLabel()
  const getTypeLabelTranslated = useTypeLabel()

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Domain filter
    {
      id: 'domainFilter',
      label: t('domain'),
      type: 'multiSelect',
      options: availableDomains.map(domain => ({
        value: domain,
        label: getDomainLabelTranslated(domain),
      })),
      valueFormatter: value => getDomainLabelTranslated(value as ArchitectureDomain),
    },
    // Typ Filter
    {
      id: 'typeFilter',
      label: t('type'),
      type: 'multiSelect',
      options: availableTypes.map(type => ({
        value: type,
        label: getTypeLabelTranslated(type),
      })),
      valueFormatter: value => getTypeLabelTranslated(value as ArchitectureType),
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
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: t('description'),
      type: 'text',
      placeholder: tCommon('contains'),
    },
    // Owner filter
    {
      id: 'ownerFilter',
      label: t('owner'),
      type: 'personSelect',
      emptyLabel: tCommon('noDataFound'),
    },
    // Aktualisiert-Filter
    {
      id: 'updatedDateRange',
      label: t('updatedDate'),
      type: 'dateRange',
      fromLabel: t('from'),
      toLabel: t('to'),
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

export default ArchitectureFilterDialog
