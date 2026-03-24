'use client'

import { useMemo, useState } from 'react'
import { HardwareProductType, FilterState } from './types'

interface UseHardwareProductFilterProps {
  hardwareProducts: HardwareProductType[]
}

export const useHardwareProductFilter = ({
  hardwareProducts = [],
}: UseHardwareProductFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    nameFilter: '',
    lifecycleStatusFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return hardwareProducts.filter(product => {
      if (
        filterState.nameFilter &&
        !product.name.toLowerCase().includes(filterState.nameFilter.toLowerCase())
      ) {
        return false
      }

      if (
        filterState.lifecycleStatusFilter &&
        product.lifecycleStatus !== filterState.lifecycleStatusFilter
      ) {
        return false
      }

      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        if (!product.updatedAt) {
          return false
        }
        const updatedDate = new Date(product.updatedAt)
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
  }, [hardwareProducts, filterState])

  const resetFilters = () => {
    setFilterState({
      nameFilter: '',
      lifecycleStatusFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredHardwareProducts: filteredData,
    resetFilters,
  }
}
