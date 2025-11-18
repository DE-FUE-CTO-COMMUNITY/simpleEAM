'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField, GenericFilterState } from '../common/GenericFilterDialog'
import { DataClassification } from '../../gql/generated'
import { DataObjectFilterState } from './useDataObjectFilter'

export type { DataObjectFilterState }

export interface DataObjectFilterOptions {
  availableFormats: string[]
  availableSources: string[]
  availableOwners: string[]
  availableUsedByApplications: string[]
  availableRelatedToCapabilities: string[]
  availablePartOfArchitectures: string[]
}

interface DataObjectFilterDialogProps {
  open: boolean
  onClose: () => void
  filters: DataObjectFilterState
  onFiltersChange: (filters: DataObjectFilterState) => void
  onResetFilters: () => void
  filterOptions: DataObjectFilterOptions
}

const DataObjectFilterDialog: React.FC<DataObjectFilterDialogProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  filterOptions,
}) => {
  const t = useTranslations('dataObjects.filter')
  const tClassifications = useTranslations('dataObjects.classifications')

  // Count active filters
  const countActiveFilters = (fs: GenericFilterState) => {
    return (
      (fs.classifications?.length || 0) +
      (fs.formats?.length || 0) +
      (fs.sources?.length || 0) +
      (fs.owners?.length || 0) +
      (fs.usedByApplications?.length || 0) +
      (fs.relatedToCapabilities?.length || 0) +
      (fs.partOfArchitectures?.length || 0) +
      (fs.descriptionFilter ? 1 : 0) +
      (fs.updatedDateRange?.[0] || fs.updatedDateRange?.[1] ? 1 : 0)
    )
  }

  // Define filter fields for the generic dialog
  const filterFields: FilterField[] = [
    // Klassifikationsfilter
    {
      id: 'classifications',
      label: t('classification'),
      type: 'multiSelect',
      options: Object.values(DataClassification).map(classification => ({
        value: classification,
        label: tClassifications(classification),
      })),
      valueFormatter: value => tClassifications(value as DataClassification),
    },
    // Formatfilter
    {
      id: 'formats',
      label: t('format'),
      type: 'multiSelect',
      options: filterOptions.availableFormats.map(format => ({
        value: format,
        label: format,
      })),
    },
    // Quellenfilter
    {
      id: 'sources',
      label: t('dataSources'),
      type: 'multiSelect',
      options: filterOptions.availableSources.map(source => ({
        value: source,
        label: source,
      })),
    },
    // Verantwortliche Filter
    {
      id: 'owners',
      label: t('owner'),
      type: 'multiSelect',
      options: filterOptions.availableOwners.map(owner => ({
        value: owner,
        label: owner,
      })),
    },
    // Verwendet von Applikationen Filter
    {
      id: 'usedByApplications',
      label: t('usedByApplications'),
      type: 'multiSelect',
      options: filterOptions.availableUsedByApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Bezug zu Capabilities Filter
    {
      id: 'relatedToCapabilities',
      label: t('relatedToCapabilities'),
      type: 'multiSelect',
      options: filterOptions.availableRelatedToCapabilities.map(cap => ({
        value: cap,
        label: cap,
      })),
    },
    // Part of architectures filter
    {
      id: 'partOfArchitectures',
      label: t('partOfArchitectures'),
      type: 'multiSelect',
      options: filterOptions.availablePartOfArchitectures.map(arch => ({
        value: arch,
        label: arch,
      })),
    },
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
    },
    // Aktualisiert-Filter
    {
      id: 'updatedDateRange',
      label: t('updatedDateRange'),
      type: 'dateRange',
      fromLabel: t('dateFrom'),
      toLabel: t('dateTo'),
    },
  ]

  // Handler for filter changes
  const handleFilterChange = (partialState: Partial<GenericFilterState>) => {
    onFiltersChange({ ...filters, ...partialState })
  }

  // If dialog is not open, render nothing
  if (!open) return null

  return (
    <GenericFilterDialog
      title={t('title')}
      filterState={filters}
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      onResetFilter={onResetFilters}
      onClose={onClose}
      onApply={() => onClose()}
      countActiveFilters={countActiveFilters}
    />
  )
}

export default DataObjectFilterDialog
