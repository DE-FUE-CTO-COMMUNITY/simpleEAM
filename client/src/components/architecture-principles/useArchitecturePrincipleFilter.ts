'use client'

import { useMemo, useState } from 'react'
import { ArchitecturePrincipleType, FilterState } from './types'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'

interface UseArchitecturePrincipleFilterProps {
  principles: ArchitecturePrincipleType[]
  filterState?: FilterState
}

export const useArchitecturePrincipleFilter = ({ principles = [] }: UseArchitecturePrincipleFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    categoryFilter: [],
    priorityFilter: [],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
    isActiveFilter: null,
  })

  // Filter function for advanced filters
  const filteredData = useMemo(() => {
    return principles.filter((principle: ArchitecturePrincipleType) => {
      // Kategorie Filter
      if (
        filterState.categoryFilter.length > 0 &&
        !filterState.categoryFilter.includes(principle.category as PrincipleCategory)
      ) {
        return false
      }

      // Priority filter
      if (
        filterState.priorityFilter.length > 0 &&
        !filterState.priorityFilter.includes(principle.priority as PrinciplePriority)
      ) {
        return false
      }

      // Aktiv/Inaktiv Filter
      if (filterState.isActiveFilter !== null && filterState.isActiveFilter !== 'all') {
        const isActiveValue = filterState.isActiveFilter === 'true'
        if (principle.isActive !== isActiveValue) {
          return false
        }
      }

      // Tags Filter
      if (filterState.tagsFilter.length > 0) {
        const principleTags = principle.tags || []
        const hasMatchingTag = filterState.tagsFilter.some((tag: string) => principleTags.includes(tag))
        if (!hasMatchingTag) {
          return false
        }
      }

      // Beschreibung Filter
      if (filterState.descriptionFilter && principle.description) {
        if (!principle.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase())) {
          return false
        }
      }

      // Verantwortlicher Filter
      if (filterState.ownerFilter && principle.owners && principle.owners.length > 0) {
        const ownerMatch = principle.owners.some(owner => owner.id === filterState.ownerFilter)
        if (!ownerMatch) {
          return false
        }
      }

      // Aktualisiert Datumsbereich Filter
      if (filterState.updatedDateRange[0] && principle.updatedAt) {
        const startDate = new Date(filterState.updatedDateRange[0])
        const updatedDate = new Date(principle.updatedAt)
        if (updatedDate < startDate) {
          return false
        }
      }

      if (filterState.updatedDateRange[1] && principle.updatedAt) {
        const endDate = new Date(filterState.updatedDateRange[1])
        endDate.setHours(23, 59, 59, 999) // Ende des Tages
        const updatedDate = new Date(principle.updatedAt)
        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [
    principles,
    filterState.categoryFilter,
    filterState.priorityFilter,
    filterState.tagsFilter,
    filterState.descriptionFilter,
    filterState.ownerFilter,
    filterState.updatedDateRange,
    filterState.isActiveFilter,
  ])

  // Extract all available categories
  const availableCategories = useMemo(() => {
    const categories = principles
      .map(principle => principle.category)
      .filter(
        (category, index, self) =>
          category !== null && category !== undefined && self.indexOf(category) === index
      ) as PrincipleCategory[]

    return categories.sort()
  }, [principles])

  // Extract all available priorities
  const availablePriorities = useMemo(() => {
    const priorities = principles
      .map(principle => principle.priority)
      .filter(
        (priority, index, self) =>
          priority !== null && priority !== undefined && self.indexOf(priority) === index
      ) as PrinciplePriority[]

    return priorities.sort()
  }, [principles])

  // Extract all available tags
  const availableTags = useMemo(() => {
    const allTags: string[] = []
    principles.forEach(principle => {
      if (principle.tags && Array.isArray(principle.tags)) {
        allTags.push(...principle.tags)
      }
    })

    return Array.from(new Set(allTags)).sort()
  }, [principles])

  // Reset function for filters
  const resetFilters = () => {
    setFilterState({
      categoryFilter: [],
      priorityFilter: [],
      tagsFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
      isActiveFilter: null,
    })
  }

  return {
    filterState,
    setFilterState,
    filteredPrinciples: filteredData,
    resetFilters,
    availableCategories,
    availablePriorities,
    availableTags,
  }
}
