'use client'

import { useMemo } from 'react'
import { Capability, FilterState } from './types'
import { CapabilityStatus } from '../../gql/generated'

interface UseCapabilityFilterProps {
  capabilities: Capability[]
  filterState: FilterState
}

export const useCapabilityFilter = ({ capabilities, filterState }: UseCapabilityFilterProps) => {
  const {
    statusFilter,
    maturityLevelFilter,
    businessValueRange,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  } = filterState

  // Filterfunktion für erweiterte Filter
  const filteredData = useMemo(() => {
    return capabilities.filter((capability: Capability) => {
      // Status Filter
      if (
        statusFilter.length > 0 &&
        !statusFilter.includes(capability.status as CapabilityStatus)
      ) {
        return false
      }

      // Reifegrad Filter
      if (
        maturityLevelFilter.length > 0 &&
        capability.maturityLevel !== null &&
        capability.maturityLevel !== undefined &&
        !maturityLevelFilter.includes(capability.maturityLevel)
      ) {
        return false
      }

      // Geschäftswert Range Filter
      const businessValue = capability.businessValue ?? 0
      if (businessValue < businessValueRange[0] || businessValue > businessValueRange[1]) {
        return false
      }

      // Tags Filter
      if (
        tagsFilter.length > 0 &&
        (!capability.tags || !capability.tags.some(tag => tagsFilter.includes(tag)))
      ) {
        return false
      }

      // Beschreibungs-Filter
      if (
        descriptionFilter &&
        (!capability.description ||
          !capability.description.toLowerCase().includes(descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Verantwortlicher-Filter
      if (
        ownerFilter &&
        (!capability.owners ||
          !capability.owners.some(owner => owner.id === ownerFilter))
      ) {
        return false
      }

      // Aktualisierungsdatum-Filter
      if (updatedDateRange[0] || updatedDateRange[1]) {
        const startDate = updatedDateRange[0] ? new Date(updatedDateRange[0]) : null
        const endDate = updatedDateRange[1] ? new Date(updatedDateRange[1]) : null

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
  }, [
    capabilities,
    statusFilter,
    maturityLevelFilter,
    businessValueRange,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  ])

  return filteredData
}
