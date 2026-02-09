'use client'

import { useMemo, useState } from 'react'
import { StrategyType, FilterState } from './types'

interface UseStrategyFilterProps {
  strategies: StrategyType[]
  filterState?: FilterState
}

export const useStrategyFilter = ({ strategies = [] }: UseStrategyFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return strategies.filter((strategy: StrategyType) => {
      if (
        filterState.descriptionFilter &&
        (!strategy.description ||
          !strategy.description
            .toLowerCase()
            .includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.ownerFilter &&
        (!strategy.owners ||
          !strategy.owners.some(owner => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!strategy.updatedAt) {
          return false
        }
        const updatedDate = new Date(strategy.updatedAt)
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
  }, [strategies, filterState])

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
    filteredStrategies: filteredData,
    resetFilters,
  }
}
