'use client'

import { useMemo, useState } from 'react'
import { AicomponentType, FilterState } from './types'

interface UseAicomponentFilterProps {
  aicomponents: AicomponentType[]
  filterState?: FilterState
}

export const useAicomponentFilter = ({ aicomponents = [] }: UseAicomponentFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    aiTypeFilter: [],
    statusFilter: [],
    descriptionFilter: '',
    providerFilter: '',
    tagsFilter: [],
    ownerFilter: '',
    accuracyRange: [0, 100],
    costsRange: [0, 1000000],
    trainingDateRange: ['', ''],
    lastUpdatedRange: ['', ''],
  })

  // Filter function for advanced filters
  const filteredAicomponents = useMemo(() => {
    return aicomponents.filter((item: AicomponentType) => {
      // AI-Typ Filter
      if (filterState.aiTypeFilter.length > 0 && !filterState.aiTypeFilter.includes(item.aiType)) {
        return false
      }

      // Status Filter
      if (filterState.statusFilter.length > 0 && !filterState.statusFilter.includes(item.status)) {
        return false
      }

      // Beschreibungs-Filter
      if (
        filterState.descriptionFilter &&
        (!item.description ||
          !item.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Provider Filter
      if (
        filterState.providerFilter &&
        (!item.provider ||
          !item.provider.toLowerCase().includes(filterState.providerFilter.toLowerCase()))
      ) {
        return false
      }

      // Tags Filter
      if (filterState.tagsFilter.length > 0) {
        const itemTags = item.tags || []
        const hasMatchingTag = filterState.tagsFilter.some(tag =>
          itemTags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Owner Filter
      if (filterState.ownerFilter) {
        const owners = item.owners || []
        const hasMatchingOwner = owners.some(owner =>
          `${owner.firstName} ${owner.lastName}`
            .toLowerCase()
            .includes(filterState.ownerFilter.toLowerCase())
        )
        if (!hasMatchingOwner) {
          return false
        }
      }

      // Accuracy Range Filter
      if (item.accuracy !== null && item.accuracy !== undefined) {
        if (
          item.accuracy < filterState.accuracyRange[0] ||
          item.accuracy > filterState.accuracyRange[1]
        ) {
          return false
        }
      }

      // Costs Range Filter
      if (item.costs !== null && item.costs !== undefined) {
        if (item.costs < filterState.costsRange[0] || item.costs > filterState.costsRange[1]) {
          return false
        }
      }

      // Training Date Range Filter
      if (
        filterState.trainingDateRange[0] &&
        filterState.trainingDateRange[1] &&
        item.trainingDate
      ) {
        const itemDate = new Date(item.trainingDate)
        const fromDate = new Date(filterState.trainingDateRange[0])
        const toDate = new Date(filterState.trainingDateRange[1])
        if (itemDate < fromDate || itemDate > toDate) {
          return false
        }
      }

      // Last Updated Range Filter
      if (filterState.lastUpdatedRange[0] && filterState.lastUpdatedRange[1] && item.lastUpdated) {
        const itemDate = new Date(item.lastUpdated)
        const fromDate = new Date(filterState.lastUpdatedRange[0])
        const toDate = new Date(filterState.lastUpdatedRange[1])
        if (itemDate < fromDate || itemDate > toDate) {
          return false
        }
      }

      return true
    })
  }, [aicomponents, filterState])

  const resetFilters = () => {
    setFilterState({
      aiTypeFilter: [],
      statusFilter: [],
      descriptionFilter: '',
      providerFilter: '',
      tagsFilter: [],
      ownerFilter: '',
      accuracyRange: [0, 100],
      costsRange: [0, 1000000],
      trainingDateRange: ['', ''],
      lastUpdatedRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredAicomponents,
    resetFilters,
  }
}
