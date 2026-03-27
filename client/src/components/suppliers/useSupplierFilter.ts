'use client'

import { useMemo, useState } from 'react'
import { SupplierType, FilterState } from './types'

interface UseSupplierFilterProps {
  suppliers: SupplierType[]
  filterState?: FilterState
}

export const useSupplierFilter = ({ suppliers = [] }: UseSupplierFilterProps) => {
  // Standardzustand für Filter
  const [filterState, setFilterState] = useState<FilterState>({
    supplierTypeFilter: [],
    statusFilter: [],
    riskClassificationFilter: [],
    strategicImportanceFilter: [],
    descriptionFilter: '',
    updatedDateRange: ['', ''],
  })

  // Filterfunktion für erweiterte Filter
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((item: SupplierType) => {
      // Supplier-Type Filter
      if (
        filterState.supplierTypeFilter.length > 0 &&
        !filterState.supplierTypeFilter.includes(item.supplierType)
      ) {
        return false
      }

      // Status-Filter
      if (filterState.statusFilter.length > 0 && !filterState.statusFilter.includes(item.status)) {
        return false
      }

      // Risk-Classification Filter
      if (
        filterState.riskClassificationFilter.length > 0 &&
        (!item.riskClassification ||
          !filterState.riskClassificationFilter.includes(item.riskClassification))
      ) {
        return false
      }

      // Strategic-Importance Filter
      if (
        filterState.strategicImportanceFilter.length > 0 &&
        (!item.strategicImportance ||
          !filterState.strategicImportanceFilter.includes(item.strategicImportance))
      ) {
        return false
      }

      // Beschreibungs-Filter
      if (
        filterState.descriptionFilter &&
        !`${item.name ?? ''} ${item.description ?? ''}`
          .toLowerCase()
          .includes(filterState.descriptionFilter.toLowerCase())
      ) {
        return false
      }

      // Updated-Date-Range-Filter (inklusive Grenzen)
      const [updatedFrom, updatedTo] = filterState.updatedDateRange
      if ((updatedFrom || updatedTo) && item.updatedAt) {
        const updatedAtDate = new Date(item.updatedAt)

        if (updatedFrom) {
          const fromDate = new Date(updatedFrom)
          fromDate.setHours(0, 0, 0, 0)
          if (updatedAtDate < fromDate) {
            return false
          }
        }

        if (updatedTo) {
          const toDate = new Date(updatedTo)
          toDate.setHours(23, 59, 59, 999)
          if (updatedAtDate > toDate) {
            return false
          }
        }
      } else if ((updatedFrom || updatedTo) && !item.updatedAt) {
        return false
      }

      return true
    })
  }, [suppliers, filterState])

  const resetFilters = () => {
    setFilterState({
      supplierTypeFilter: [],
      statusFilter: [],
      riskClassificationFilter: [],
      strategicImportanceFilter: [],
      descriptionFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredSuppliers,
    resetFilters,
  }
}
