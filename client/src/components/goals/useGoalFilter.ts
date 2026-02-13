'use client'

import { useMemo, useState } from 'react'
import { GoalType, FilterState } from './types'

interface UseGoalFilterProps {
  goals: GoalType[]
  filterState?: FilterState
}

export const useGoalFilter = ({ goals = [] }: UseGoalFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return goals.filter((goal: GoalType) => {
      if (
        filterState.descriptionFilter &&
        (!goal.goalStatement ||
          !goal.goalStatement
            .toLowerCase()
            .includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.ownerFilter &&
        (!goal.owners || !goal.owners.some(owner => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!goal.updatedAt) {
          return false
        }
        const updatedDate = new Date(goal.updatedAt)
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
  }, [goals, filterState])

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
    filteredGoals: filteredData,
    resetFilters,
  }
}
