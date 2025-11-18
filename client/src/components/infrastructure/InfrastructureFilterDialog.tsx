'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField, GenericFilterState } from '../common/GenericFilterDialog'
import { InfrastructureType, InfrastructureStatus } from '../../gql/generated'

export interface InfrastructureFilterState {
  infrastructureTypes: InfrastructureType[]
  statuses: InfrastructureStatus[]
  vendors: string[]
  locations: string[]
  owners: string[]
  hostsApplications: string[]
  partOfArchitectures: string[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface InfrastructureFilterOptions {
  availableVendors: string[]
  availableLocations: string[]
  availableOwners: string[]
  availableHostsApplications: string[]
  availablePartOfArchitectures: string[]
}

interface InfrastructureFilterDialogProps {
  open: boolean
  onClose: () => void
  filters: InfrastructureFilterState
  onFiltersChange: (filters: InfrastructureFilterState) => void
  onResetFilters: () => void
  filterOptions: InfrastructureFilterOptions
}

const InfrastructureFilterDialog: React.FC<InfrastructureFilterDialogProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  filterOptions,
}) => {
  const t = useTranslations('infrastructure')

  // Utility functions for label translations
  const getInfrastructureTypeLabel = (type: InfrastructureType): string => {
    const translations: Record<InfrastructureType, string> = {
      [InfrastructureType.CLOUD_DATACENTER]: t('infrastructureTypes.CLOUD_DATACENTER'),
      [InfrastructureType.CONTAINER_HOST]: t('infrastructureTypes.CONTAINER_HOST'),
      [InfrastructureType.KUBERNETES_CLUSTER]: t('infrastructureTypes.KUBERNETES_CLUSTER'),
      [InfrastructureType.ON_PREMISE_DATACENTER]: t('infrastructureTypes.ON_PREMISE_DATACENTER'),
      [InfrastructureType.PHYSICAL_SERVER]: t('infrastructureTypes.PHYSICAL_SERVER'),
      [InfrastructureType.VIRTUAL_MACHINE]: t('infrastructureTypes.VIRTUAL_MACHINE'),
      [InfrastructureType.VIRTUALIZATION_CLUSTER]: t('infrastructureTypes.VIRTUALIZATION_CLUSTER'),
      [InfrastructureType.IOT_GATEWAY]: 'IoT Gateway',
      [InfrastructureType.IOT_PLATFORM]: 'IoT Platform',
    }
    return translations[type] || type
  }

  const getInfrastructureStatusLabel = (status: InfrastructureStatus): string => {
    const translations: Record<InfrastructureStatus, string> = {
      [InfrastructureStatus.ACTIVE]: t('statuses.ACTIVE'),
      [InfrastructureStatus.DECOMMISSIONED]: t('statuses.DECOMMISSIONED'),
      [InfrastructureStatus.INACTIVE]: t('statuses.INACTIVE'),
      [InfrastructureStatus.MAINTENANCE]: t('statuses.MAINTENANCE'),
      [InfrastructureStatus.PLANNED]: t('statuses.PLANNED'),
      [InfrastructureStatus.UNDER_CONSTRUCTION]: t('statuses.UNDER_CONSTRUCTION'),
    }
    return translations[status] || status
  }

  // Count active filters
  const countActiveFilters = (fs: GenericFilterState) => {
    return (
      (fs.infrastructureTypes?.length || 0) +
      (fs.statuses?.length || 0) +
      (fs.vendors?.length || 0) +
      (fs.locations?.length || 0) +
      (fs.owners?.length || 0) +
      (fs.hostsApplications?.length || 0) +
      (fs.partOfArchitectures?.length || 0) +
      (fs.descriptionFilter ? 1 : 0) +
      (fs.updatedDateRange?.[0] || fs.updatedDateRange?.[1] ? 1 : 0)
    )
  }

  // Define filter fields for the generic dialog
  const filterFields: FilterField[] = [
    // Infrastrukturtyp-Filter
    {
      id: 'infrastructureTypes',
      label: t('filter.infrastructureType'),
      type: 'multiSelect',
      options: Object.values(InfrastructureType).map(type => ({
        value: type,
        label: getInfrastructureTypeLabel(type),
      })),
      valueFormatter: value => getInfrastructureTypeLabel(value as InfrastructureType),
    },
    // Status-Filter
    {
      id: 'statuses',
      label: t('filter.status'),
      type: 'multiSelect',
      options: Object.values(InfrastructureStatus).map(status => ({
        value: status,
        label: getInfrastructureStatusLabel(status),
      })),
      valueFormatter: value => getInfrastructureStatusLabel(value as InfrastructureStatus),
    },
    // Anbieter-Filter
    {
      id: 'vendors',
      label: t('filter.vendor'),
      type: 'multiSelect',
      options: filterOptions.availableVendors.map(vendor => ({
        value: vendor,
        label: vendor,
      })),
    },
    // Standort-Filter
    {
      id: 'locations',
      label: t('filter.location'),
      type: 'multiSelect',
      options: filterOptions.availableLocations.map(location => ({
        value: location,
        label: location,
      })),
    },
    // Verantwortliche Filter
    {
      id: 'owners',
      label: t('filter.owner'),
      type: 'multiSelect',
      options: filterOptions.availableOwners.map(owner => ({
        value: owner,
        label: owner,
      })),
    },
    // Hosted applications filter
    {
      id: 'hostsApplications',
      label: t('filter.hostedApplications'),
      type: 'multiSelect',
      options: filterOptions.availableHostsApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Part of architectures filter
    {
      id: 'partOfArchitectures',
      label: t('filter.partOfArchitectures'),
      type: 'multiSelect',
      options: filterOptions.availablePartOfArchitectures.map(arch => ({
        value: arch,
        label: arch,
      })),
    },
    // Beschreibungs-Filter
    {
      id: 'descriptionFilter',
      label: t('filter.descriptionContains'),
      type: 'text',
      placeholder: t('filter.descriptionPlaceholder'),
    },
    // Aktualisiert-Filter
    {
      id: 'updatedDateRange',
      label: t('filter.updatedInPeriod'),
      type: 'dateRange',
      fromLabel: t('filter.dateFrom'),
      toLabel: t('filter.dateTo'),
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
      title={t('filter.title')}
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

export default InfrastructureFilterDialog
