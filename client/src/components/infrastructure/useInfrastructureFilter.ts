'use client'

import { useMemo, useState } from 'react'
import { Infrastructure, FilterState } from './types'
import { InfrastructureType, InfrastructureStatus } from '../../gql/generated'

interface UseInfrastructureFilterProps {
  infrastructures: Infrastructure[]
  filterState?: FilterState
}

export const useInfrastructureFilter = ({ infrastructures = [] }: UseInfrastructureFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [],
    typeFilter: [],
    costRangeFilter: [0, 1000000],
    vendorFilter: '',
    locationFilter: '',
    ownerFilter: '',
    descriptionFilter: '',
    updatedDateRange: ['', ''],
    operatingSystemFilter: '',
  })

  // Filter function for advanced filters
  const filteredInfrastructures = useMemo(() => {
    return infrastructures.filter((infrastructure: Infrastructure) => {
      // Status Filter
      if (
        filterState.statusFilter.length > 0 &&
        !filterState.statusFilter.includes(infrastructure.status)
      ) {
        return false
      }

      // Typ Filter
      if (
        filterState.typeFilter.length > 0 &&
        !filterState.typeFilter.includes(infrastructure.infrastructureType)
      ) {
        return false
      }

      // Kosten Range Filter
      const costs = infrastructure.costs ?? 0
      if (costs < filterState.costRangeFilter[0] || costs > filterState.costRangeFilter[1]) {
        return false
      }

      // Vendor Filter
      if (
        filterState.vendorFilter &&
        (!infrastructure.vendor ||
          !infrastructure.vendor.toLowerCase().includes(filterState.vendorFilter.toLowerCase()))
      ) {
        return false
      }

      // Location Filter
      if (
        filterState.locationFilter &&
        (!infrastructure.location ||
          !infrastructure.location.toLowerCase().includes(filterState.locationFilter.toLowerCase()))
      ) {
        return false
      }

      // Operating System Filter
      if (
        filterState.operatingSystemFilter &&
        (!infrastructure.operatingSystem ||
          !infrastructure.operatingSystem.toLowerCase().includes(filterState.operatingSystemFilter.toLowerCase()))
      ) {
        return false
      }

      // Beschreibung Filter
      if (
        filterState.descriptionFilter &&
        (!infrastructure.description ||
          !infrastructure.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Verantwortlicher Filter
      if (filterState.ownerFilter && infrastructure.owners && infrastructure.owners.length > 0) {
        const ownerMatch = infrastructure.owners.some(owner => {
          const ownerFullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
          return ownerFullName.includes(filterState.ownerFilter.toLowerCase())
        })
        if (!ownerMatch) {
          return false
        }
      }

      // Aktualisiert Datumsbereich Filter
      if (filterState.updatedDateRange[0] && infrastructure.updatedAt) {
        const startDate = new Date(filterState.updatedDateRange[0])
        const updatedDate = new Date(infrastructure.updatedAt)
        if (updatedDate < startDate) {
          return false
        }
      }

      if (filterState.updatedDateRange[1] && infrastructure.updatedAt) {
        const endDate = new Date(filterState.updatedDateRange[1])
        endDate.setHours(23, 59, 59, 999) // Ende des Tages
        const updatedDate = new Date(infrastructure.updatedAt)
        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [
    infrastructures,
    filterState.statusFilter,
    filterState.typeFilter,
    filterState.costRangeFilter,
    filterState.vendorFilter,
    filterState.locationFilter,
    filterState.ownerFilter,
    filterState.descriptionFilter,
    filterState.updatedDateRange,
    filterState.operatingSystemFilter,
  ])

  // Extract all available statuses
  const availableStatuses = useMemo(() => {
    const statuses = infrastructures
      .map(infra => infra.status)
      .filter(
        (status, index, self) =>
          status !== null && status !== undefined && self.indexOf(status) === index
      ) as InfrastructureStatus[]

    return statuses.sort()
  }, [infrastructures])

  // Extract all available types
  const availableTypes = useMemo(() => {
    const types = infrastructures
      .map(infra => infra.infrastructureType)
      .filter(
        (type, index, self) =>
          type !== null && type !== undefined && self.indexOf(type) === index
      ) as InfrastructureType[]

    return types.sort()
  }, [infrastructures])

  // Extract all available vendors
  const availableVendors = useMemo(() => {
    const vendors = infrastructures
      .map(infra => infra.vendor)
      .filter(
        (vendor, index, self) =>
          vendor !== null && vendor !== undefined && self.indexOf(vendor) === index
      ) as string[]

    return vendors.sort()
  }, [infrastructures])

  // Extract all available locations
  const availableLocations = useMemo(() => {
    const locations = infrastructures
      .map(infra => infra.location)
      .filter(
        (location, index, self) =>
          location !== null && location !== undefined && self.indexOf(location) === index
      ) as string[]

    return locations.sort()
  }, [infrastructures])

  // Extract all available operating systems
  const availableOperatingSystems = useMemo(() => {
    const operatingSystems = infrastructures
      .map(infra => infra.operatingSystem)
      .filter(
        (os, index, self) =>
          os !== null && os !== undefined && self.indexOf(os) === index
      ) as string[]

    return operatingSystems.sort()
  }, [infrastructures])

  // Reset function for filters
  const resetFilters = () => {
    setFilterState({
      statusFilter: [],
      typeFilter: [],
      costRangeFilter: [0, 1000000],
      vendorFilter: '',
      locationFilter: '',
      ownerFilter: '',
      descriptionFilter: '',
      updatedDateRange: ['', ''],
      operatingSystemFilter: '',
    })
  }

  return {
    filterState,
    setFilterState,
    filteredInfrastructures,
    resetFilters,
    availableStatuses,
    availableTypes,
    availableVendors,
    availableLocations,
    availableOperatingSystems,
  }
}
