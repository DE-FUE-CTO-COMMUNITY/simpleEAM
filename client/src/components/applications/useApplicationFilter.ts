'use client'

import { useMemo, useState } from 'react'
import { ApplicationType, FilterState } from './types'
import {
  ApplicationStatus,
  CriticalityLevel,
  TimeCategory,
  SevenRStrategy,
} from '../../gql/generated'

interface UseApplicationFilterProps {
  applications: ApplicationType[]
  filterState?: FilterState
}

export const useApplicationFilter = ({ applications = [] }: UseApplicationFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [] as ApplicationStatus[],
    criticalityFilter: [] as CriticalityLevel[],
    costRangeFilter: [0, 1000000],
    technologyStackFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
    vendorFilter: '',
    timeCategoryFilter: [] as TimeCategory[],
    sevenRStrategyFilter: [] as SevenRStrategy[],
    hostedOnFilter: [] as string[],
  })

  // Filter function for advanced filters
  const filteredData = useMemo(() => {
    return applications.filter((application: ApplicationType) => {
      // Status-Filter
      if (
        filterState.statusFilter &&
        filterState.statusFilter.length > 0 &&
        !filterState.statusFilter.includes(application.status as ApplicationStatus)
      ) {
        return false
      }

      // Criticality filter
      if (
        filterState.criticalityFilter &&
        filterState.criticalityFilter.length > 0 &&
        !filterState.criticalityFilter.includes(application.criticality as CriticalityLevel)
      ) {
        return false
      }

      // Kostenbereich-Filter
      if (
        filterState.costRangeFilter &&
        application.costs !== null &&
        application.costs !== undefined
      ) {
        const cost = application.costs as number
        if (cost < filterState.costRangeFilter[0] || cost > filterState.costRangeFilter[1]) {
          return false
        }
      }

      // Technology Stack Filter
      if (
        filterState.technologyStackFilter &&
        filterState.technologyStackFilter.length > 0 &&
        (!application.technologyStack ||
          !filterState.technologyStackFilter.some((tech: string) =>
            application.technologyStack?.includes(tech)
          ))
      ) {
        return false
      }

      // Beschreibungs-Filter
      if (
        filterState.descriptionFilter &&
        (!application.description ||
          !application.description
            .toLowerCase()
            .includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Owner filter
      if (
        filterState.ownerFilter &&
        (!application.owners ||
          !application.owners.some((owner: any) => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      // Vendor-Filter
      if (
        filterState.vendorFilter &&
        (!application.vendor ||
          !application.vendor.toLowerCase().includes(filterState.vendorFilter.toLowerCase()))
      ) {
        return false
      }

      // Time Category Filter
      if (
        filterState.timeCategoryFilter &&
        filterState.timeCategoryFilter.length > 0 &&
        !filterState.timeCategoryFilter.includes(application.timeCategory as TimeCategory)
      ) {
        return false
      }

      // Seven R Strategy Filter
      if (
        filterState.sevenRStrategyFilter &&
        filterState.sevenRStrategyFilter.length > 0 &&
        !filterState.sevenRStrategyFilter.includes(application.sevenRStrategy as SevenRStrategy)
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

        if (!application.updatedAt) {
          return false
        }

        const updatedDate = new Date(application.updatedAt)

        if (startDate && updatedDate < startDate) {
          return false
        }

        if (endDate) {
          const endOfDay = new Date(endDate)
          endOfDay.setHours(23, 59, 59, 999)

          if (updatedDate > endOfDay) {
            return false
          }
        }
      }

      return true
    })
  }, [applications, filterState])

  const resetFilters = () => {
    setFilterState({
      statusFilter: [] as ApplicationStatus[],
      criticalityFilter: [] as CriticalityLevel[],
      costRangeFilter: [0, 1000000],
      technologyStackFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
      vendorFilter: '',
      timeCategoryFilter: [] as TimeCategory[],
      sevenRStrategyFilter: [] as SevenRStrategy[],
      hostedOnFilter: [] as string[],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredApplications: filteredData,
    resetFilters,
  }
}
