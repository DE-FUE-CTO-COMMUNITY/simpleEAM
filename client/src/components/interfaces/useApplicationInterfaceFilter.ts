'use client'

import { useMemo, useState } from 'react'
import { ApplicationInterface, FilterState } from './types'
import { InterfaceType } from '@/gql/generated'

interface UseApplicationInterfaceFilterProps {
  applicationInterfaces: ApplicationInterface[]
  filterState?: FilterState
}

export const useApplicationInterfaceFilter = ({
  applicationInterfaces = [],
}: UseApplicationInterfaceFilterProps) => {
  // Standardzustand für Filter
  const [filterState, setFilterState] = useState<FilterState>({
    interfaceTypeFilter: [],
    searchFilter: '',
    updatedDateRange: ['', ''],
  })

  // Alle verfügbaren Schnittstellentypen
  const availableInterfaceTypes = useMemo(() => {
    return Object.values(InterfaceType)
  }, [])

  // Filterfunktion für erweiterte Filter
  const filteredApplicationInterfaces = useMemo(() => {
    const { interfaceTypeFilter, searchFilter, updatedDateRange } = filterState

    return applicationInterfaces.filter((applicationInterface: ApplicationInterface) => {
      // Schnittstellentyp-Filter
      if (
        interfaceTypeFilter.length > 0 &&
        !interfaceTypeFilter.includes(applicationInterface.interfaceType)
      ) {
        return false
      }

      // Suchfilter (für Name und Beschreibung)
      if (searchFilter && searchFilter.trim() !== '') {
        const name = (applicationInterface.name || '').toLowerCase()
        const description = (applicationInterface.description || '').toLowerCase()
        const searchTerm = searchFilter.toLowerCase()

        if (!name.includes(searchTerm) && !description.includes(searchTerm)) {
          return false
        }
      }

      // Aktualisierungsdatum-Bereich
      const [startDateStr, endDateStr] = updatedDateRange

      if (startDateStr && applicationInterface.updatedAt) {
        const startDate = new Date(startDateStr)
        const updatedDate = new Date(applicationInterface.updatedAt)

        if (updatedDate < startDate) {
          return false
        }
      }

      if (endDateStr && applicationInterface.updatedAt) {
        const endDate = new Date(endDateStr)
        // Setze das Ende des Tages für den Endzeitpunkt
        endDate.setHours(23, 59, 59, 999)
        const updatedDate = new Date(applicationInterface.updatedAt)

        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [applicationInterfaces, filterState])

  const resetFilters = () => {
    setFilterState({
      interfaceTypeFilter: [],
      searchFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredApplicationInterfaces,
    resetFilters,
    availableInterfaceTypes,
  }
}
