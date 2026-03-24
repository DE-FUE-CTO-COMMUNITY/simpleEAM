'use client'

import { useMemo, useState } from 'react'
import { FilterState, HardwareVersionType } from './types'

interface UseHardwareVersionFilterProps {
  hardwareVersions: HardwareVersionType[]
}

export const useHardwareVersionFilter = ({
  hardwareVersions = [],
}: UseHardwareVersionFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    versionFilter: '',
    productIdFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return hardwareVersions.filter(version => {
      if (
        filterState.versionFilter &&
        !version.versionModelString.toLowerCase().includes(filterState.versionFilter.toLowerCase())
      ) {
        return false
      }

      if (
        filterState.productIdFilter &&
        !version.hardwareProduct?.some(product => product.id === filterState.productIdFilter)
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!version.updatedAt) {
          return false
        }

        const updatedDate = new Date(version.updatedAt)
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
  }, [hardwareVersions, filterState])

  const resetFilters = () => {
    setFilterState({
      versionFilter: '',
      productIdFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredHardwareVersions: filteredData,
    resetFilters,
  }
}
