'use client'

import { useMemo, useState } from 'react'
import { FilterState } from './types'
import { CapabilityStatus, BusinessCapability } from '../../gql/generated'

interface UseCapabilityFilterProps {
  capabilities: BusinessCapability[]
  filterState?: FilterState
}

export const useCapabilityFilter = ({ capabilities = [] }: UseCapabilityFilterProps) => {
  // Standardzustand für Filter
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [] as CapabilityStatus[],
    maturityLevelFilter: [],
    businessValueRange: [0, 10],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  // Filterfunktion für erweiterte Filter
  const filteredData = useMemo(() => {
    console.log('Filter applied with state:', filterState)
    console.log('Input capabilities:', capabilities.length)

    const result = capabilities.filter((capability: BusinessCapability) => {
      // Status Filter
      if (
        filterState.statusFilter.length > 0 &&
        !filterState.statusFilter.includes(capability.status as CapabilityStatus)
      ) {
        console.log(
          'Filtered out by status:',
          capability.status,
          'expected:',
          filterState.statusFilter
        )
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
        console.log(
          'Filtered out by maturityLevel:',
          capability.maturityLevel,
          'expected:',
          filterState.maturityLevelFilter.map(level => Number(level))
        )
        return false
      }

      // Geschäftswert Range Filter
      const businessValue = capability.businessValue ?? 0
      if (
        filterState.businessValueRange &&
        (businessValue < filterState.businessValueRange[0] ||
          businessValue > filterState.businessValueRange[1])
      ) {
        console.log(
          'Filtered out by businessValue:',
          businessValue,
          'range:',
          filterState.businessValueRange
        )
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

      // Verantwortlicher-Filter
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
          // Setze das Ende des Tages für einen inklusiven Vergleich
          const endOfDay = new Date(endDate)
          endOfDay.setHours(23, 59, 59, 999)

          if (updatedDate > endOfDay) {
            return false
          }
        }
      }

      return true
    })

    console.log('Filtered capabilities:', result.length)
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
