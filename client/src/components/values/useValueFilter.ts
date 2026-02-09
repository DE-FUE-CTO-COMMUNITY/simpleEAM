'use client'

import { useMemo, useState } from 'react'
import { ValueType, FilterState } from './types'

interface UseValueFilterProps {
  values: ValueType[]
  filterState?: FilterState
}

export const useValueFilter = ({ values = [] }: UseValueFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return values.filter((value: ValueType) => {
      if (
        filterState.descriptionFilter &&
        (!value.description ||
          !value.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.ownerFilter &&
        (!value.owners || !value.owners.some(owner => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!value.updatedAt) {
          return false
        }
        const updatedDate = new Date(value.updatedAt)
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
  }, [values, filterState])

  const resetFilters = () => {
    setFilterState({
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredValues: filteredData,
    resetFilters,
  }
}
