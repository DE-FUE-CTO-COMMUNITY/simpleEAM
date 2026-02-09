'use client'

import { useMemo, useState } from 'react'
import { MissionType, FilterState } from './types'

interface UseMissionFilterProps {
  missions: MissionType[]
  filterState?: FilterState
}

export const useMissionFilter = ({ missions = [] }: UseMissionFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
    yearRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return missions.filter((mission: MissionType) => {
      if (
        filterState.descriptionFilter &&
        (!mission.description ||
          !mission.description
            .toLowerCase()
            .includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.ownerFilter &&
        (!mission.owners || !mission.owners.some(owner => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!mission.updatedAt) {
          return false
        }
        const updatedDate = new Date(mission.updatedAt)
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

      if (filterState.yearRange[0] || filterState.yearRange[1]) {
        const missionYear = new Date(mission.year)
        if (Number.isNaN(missionYear.getTime())) {
          return false
        }

        const startYear = filterState.yearRange[0] ? new Date(filterState.yearRange[0]) : null
        const endYear = filterState.yearRange[1] ? new Date(filterState.yearRange[1]) : null

        if (startYear && missionYear < startYear) {
          return false
        }

        if (endYear) {
          const endOfDay = new Date(endYear)
          endOfDay.setHours(23, 59, 59, 999)

          if (missionYear > endOfDay) {
            return false
          }
        }
      }

      return true
    })
  }, [missions, filterState])

  const resetFilters = () => {
    setFilterState({
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
      yearRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredMissions: filteredData,
    resetFilters,
  }
}
