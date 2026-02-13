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
      // Beschreibungs-Filter
      if (
        filterState.descriptionFilter &&
        (!item.description ||
          !item.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // TODO: Entity-spezifische Filter-Logik hinzufügen
      // Beispiel:
      // if (filterState.statusFilter && item.status !== filterState.statusFilter) {
      //   return false
      // }

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
