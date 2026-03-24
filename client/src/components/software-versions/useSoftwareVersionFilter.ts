'use client'

import { useMemo, useState } from 'react'
import { FilterState, SoftwareVersionType } from './types'

interface UseSoftwareVersionFilterProps {
  softwareVersions: SoftwareVersionType[]
}

export const useSoftwareVersionFilter = ({
  softwareVersions = [],
}: UseSoftwareVersionFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    versionFilter: '',
    productIdFilter: '',
    updatedDateRange: ['', ''],
  })

  const filteredData = useMemo(() => {
    return softwareVersions.filter(version => {
      if (
        filterState.versionFilter &&
        !version.name.toLowerCase().includes(filterState.versionFilter.toLowerCase())
      ) {
        return false
      }

      if (
        filterState.productIdFilter &&
        !version.softwareProduct?.some(product => product.id === filterState.productIdFilter)
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
  }, [softwareVersions, filterState])

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
    filteredSoftwareVersions: filteredData,
    resetFilters,
  }
}
