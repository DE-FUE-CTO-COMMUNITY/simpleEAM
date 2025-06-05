'use client'

import { useMemo } from 'react'
import { ApplicationType, FilterState } from './types'
import {
  ApplicationStatus,
  CriticalityLevel,
  TimeCategory,
  SevenRStrategy,
} from '../../gql/generated'

interface UseApplicationFilterProps {
  applications: ApplicationType[]
  filterState: FilterState
}

export const useApplicationFilter = ({ applications, filterState }: UseApplicationFilterProps) => {
  const {
    statusFilter,
    criticalityFilter,
    costRangeFilter,
    technologyStackFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
    vendorFilter,
    timeCategoryFilter,
    sevenRStrategyFilter,
  } = filterState

  // Filterfunktion für erweiterte Filter
  const filteredData = useMemo(() => {
    return applications.filter((application: ApplicationType) => {
      // Status Filter
      if (
        statusFilter.length > 0 &&
        !statusFilter.includes(application.status as ApplicationStatus)
      ) {
        return false
      }

      // Kritikalitäts-Filter
      if (
        criticalityFilter.length > 0 &&
        application.criticality !== null &&
        application.criticality !== undefined &&
        !criticalityFilter.includes(application.criticality as CriticalityLevel)
      ) {
        return false
      }

      // Kosten-Range Filter
      const costs = application.costs ?? 0
      if (costs < costRangeFilter[0] || costs > costRangeFilter[1]) {
        return false
      }

      // Technology Stack Filter
      if (
        technologyStackFilter.length > 0 &&
        (!application.technologyStack ||
          !application.technologyStack.some(tech => technologyStackFilter.includes(tech)))
      ) {
        return false
      }

      // Beschreibungs-Filter
      if (
        descriptionFilter &&
        (!application.description ||
          !application.description.toLowerCase().includes(descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Verantwortlicher-Filter
      if (
        ownerFilter &&
        (!application.owners || !application.owners.some(owner => owner.id === ownerFilter))
      ) {
        return false
      }

      // Vendor-Filter
      if (
        vendorFilter &&
        (!application.vendor ||
          !application.vendor.toLowerCase().includes(vendorFilter.toLowerCase()))
      ) {
        return false
      }

      // Aktualisierungsdatum-Filter
      if (updatedDateRange[0] || updatedDateRange[1]) {
        const startDate = updatedDateRange[0] ? new Date(updatedDateRange[0]) : null
        const endDate = updatedDateRange[1] ? new Date(updatedDateRange[1]) : null

        if (!application.updatedAt) {
          return false
        }

        const updatedDate = new Date(application.updatedAt)

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

      // TIME-Kategorie Filter
      if (
        timeCategoryFilter.length > 0 &&
        application.timeCategory !== null &&
        application.timeCategory !== undefined &&
        !timeCategoryFilter.includes(application.timeCategory as TimeCategory)
      ) {
        return false
      }

      // 7R-Strategie Filter
      if (
        sevenRStrategyFilter.length > 0 &&
        application.sevenRStrategy !== null &&
        application.sevenRStrategy !== undefined &&
        !sevenRStrategyFilter.includes(application.sevenRStrategy as SevenRStrategy)
      ) {
        return false
      }

      return true
    })
  }, [
    applications,
    statusFilter,
    criticalityFilter,
    costRangeFilter,
    technologyStackFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
    vendorFilter,
    timeCategoryFilter,
    sevenRStrategyFilter,
  ])

  return filteredData
}
