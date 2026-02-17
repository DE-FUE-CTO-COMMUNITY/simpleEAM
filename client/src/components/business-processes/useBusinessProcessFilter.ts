'use client'

import { useMemo, useState } from 'react'
import { ProcessStatus, ProcessType } from '../../gql/generated'
import { BusinessProcessType, FilterState } from './types'

interface UseBusinessProcessFilterProps {
  businessProcesses: BusinessProcessType[]
}

export const useBusinessProcessFilter = ({
  businessProcesses,
}: UseBusinessProcessFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [] as ProcessStatus[],
    processTypeFilter: [] as ProcessType[],
    categoryFilter: '',
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredBusinessProcesses = useMemo(() => {
    return businessProcesses.filter((process: BusinessProcessType) => {
      if (
        filterState.statusFilter.length > 0 &&
        !filterState.statusFilter.includes(process.status as ProcessStatus)
      ) {
        return false
      }

      if (
        filterState.processTypeFilter.length > 0 &&
        !filterState.processTypeFilter.includes(process.processType as ProcessType)
      ) {
        return false
      }

      if (
        filterState.categoryFilter &&
        (!process.category ||
          !process.category.toLowerCase().includes(filterState.categoryFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.descriptionFilter &&
        (!process.description ||
          !process.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.ownerFilter &&
        (!process.owners || !process.owners.some(owner => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!process.updatedAt) return false

        const updatedDate = new Date(process.updatedAt)
        const startDate = filterState.updatedDateRange[0]
          ? new Date(filterState.updatedDateRange[0])
          : null
        const endDate = filterState.updatedDateRange[1]
          ? new Date(filterState.updatedDateRange[1])
          : null

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
  }, [businessProcesses, filterState])

  const resetFilters = () => {
    setFilterState({
      statusFilter: [] as ProcessStatus[],
      processTypeFilter: [] as ProcessType[],
      categoryFilter: '',
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredBusinessProcesses,
    resetFilters,
  }
}
