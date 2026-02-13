'use client'

import { useMemo, useState } from 'react'
import { VisionType, FilterState } from './types'

interface UseVisionFilterProps {
  visions: VisionType[]
  filterState?: FilterState
}

export const useVisionFilter = ({ visions = [] }: UseVisionFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
    yearRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return visions.filter((vision: VisionType) => {
      if (
        filterState.descriptionFilter &&
        (!vision.visionStatement ||
          !vision.visionStatement
            .toLowerCase()
            .includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      if (
        filterState.ownerFilter &&
        (!vision.owners || !vision.owners.some(owner => owner.id === filterState.ownerFilter))
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!vision.updatedAt) {
          return false
        }
        const updatedDate = new Date(vision.updatedAt)
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
        const visionYear = new Date(vision.year)
        if (Number.isNaN(visionYear.getTime())) {
          return false
        }

        const startYear = filterState.yearRange[0] ? new Date(filterState.yearRange[0]) : null
        const endYear = filterState.yearRange[1] ? new Date(filterState.yearRange[1]) : null

        if (startYear && visionYear < startYear) {
          return false
        }

        if (endYear) {
          const endOfDay = new Date(endYear)
          endOfDay.setHours(23, 59, 59, 999)

          if (visionYear > endOfDay) {
            return false
          }
        }
      }

      return true
    })
  }, [visions, filterState])

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
    filteredVisions: filteredData,
    resetFilters,
  }
}
