'use client'

import { useMemo, useState } from 'react'
import { FilterState } from './types'
import { CapabilityStatus, BusinessCapability } from '../../gql/generated'

interface UseCapabilityFilterProps {
  capabilities: BusinessCapability[]
  filterState?: FilterState
}

export const useCapabilityFilter = ({ capabilities = [] }: UseCapabilityFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [] as CapabilityStatus[],
    maturityLevelFilter: [],
    businessValueRange: [0, 10],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  // Filter function for advanced filters
  const filteredData = useMemo(() => {
    const result = capabilities.filter((capability: BusinessCapability) => {
      // Status Filter
      if (
        filterState.statusFilter.length > 0 &&
        !filterState.statusFilter.includes(capability.status as CapabilityStatus)
      ) {
        return false
      }

      // Reifegrad Filter
      if (
        filterState.maturityLevelFilter.length > 0 &&
        (!capability.maturityLevel ||
          !filterState.maturityLevelFilter
            .map(level => Number(level))
            .includes(capability.maturityLevel))
      ) {
        return false
      }

      // Business value range filter
      const businessValue = capability.businessValue ?? 0
      if (
        filterState.businessValueRange &&
        (businessValue < filterState.businessValueRange[0] ||
          businessValue > filterState.businessValueRange[1])
      ) {
        return false
      }

      // Tags Filter
      if (
        filterState.tagsFilter.length > 0 &&
        (!capability.tags ||
          !capability.tags.some((tag: string) => filterState.tagsFilter.includes(tag)))
      ) {
        return false
      }

      // Beschreibungs-Filter
      if (
        filterState.descriptionFilter &&
        (!capability.description ||
          !capability.description
            .toLowerCase()
            .includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Owner filter
      if (
        filterState.ownerFilter &&
        (!capability.owners ||
          !capability.owners.some((owner: any) => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      // Aktualisierungsdatum-Filter
      if (
        filterState.updatedDateRange &&
        (filterState.updatedDateRange[0] || filterState.updatedDateRange[1])
      ) {
        const startDate = filterState.updatedDateRange[0]
          ? new Date(filterState.updatedDateRange[0])
          : null
        const endDate = filterState.updatedDateRange[1]
          ? new Date(filterState.updatedDateRange[1])
          : null

        if (!capability.updatedAt) {
          return false
        }

        const updatedDate = new Date(capability.updatedAt)

        if (startDate && updatedDate < startDate) {
          return false
        }

        if (endDate) {
          // Set end of day for inclusive comparison
          const endOfDay = new Date(endDate)
          endOfDay.setHours(23, 59, 59, 999)

          if (updatedDate > endOfDay) {
            return false
          }
        }
      }

      return true
    })

    return result
  }, [capabilities, filterState])

  const resetFilters = () => {
    setFilterState({
      statusFilter: [] as CapabilityStatus[],
      maturityLevelFilter: [],
      businessValueRange: [0, 10],
      tagsFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredCapabilities: filteredData,
    resetFilters,
  }
}
