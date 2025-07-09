'use client'

import { useMemo } from 'react'
import { ArchitecturePrincipleType, FilterState } from './types'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'

interface UseArchitecturePrincipleFilterProps {
  principles: ArchitecturePrincipleType[]
  filterState?: FilterState
}

export const useArchitecturePrincipleFilter = ({
  principles,
  filterState,
}: UseArchitecturePrincipleFilterProps) => {
  const {
    categoryFilter = [],
    priorityFilter = [],
    tagsFilter = [],
    descriptionFilter = '',
    ownerFilter = '',
    updatedDateRange = ['', ''],
    isActiveFilter = null,
  } = filterState || {}

  // Filterfunktion für erweiterte Filter
  const filteredData = useMemo(() => {
    return principles.filter((principle: ArchitecturePrincipleType) => {
      // Kategorie Filter
      if (
        categoryFilter.length > 0 &&
        !categoryFilter.includes(principle.category as PrincipleCategory)
      ) {
        return false
      }

      // Priorität Filter
      if (
        priorityFilter.length > 0 &&
        !priorityFilter.includes(principle.priority as PrinciplePriority)
      ) {
        return false
      }

      // Active Filter
      if (isActiveFilter !== null && isActiveFilter !== 'all') {
        const isActiveValue = isActiveFilter === 'true'
        if (principle.isActive !== isActiveValue) {
          return false
        }
      }

      // Tags Filter
      if (tagsFilter.length > 0) {
        const principleTags = principle.tags || []
        const hasMatchingTag = tagsFilter.some(tag => principleTags.includes(tag))
        if (!hasMatchingTag) {
          return false
        }
      }

      // Beschreibung Filter
      if (descriptionFilter && principle.description) {
        if (!principle.description.toLowerCase().includes(descriptionFilter.toLowerCase())) {
          return false
        }
      }

      // Verantwortlicher Filter
      if (ownerFilter && principle.owners && principle.owners.length > 0) {
        const ownerMatch = principle.owners.some(owner => {
          const ownerFullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
          return ownerFullName.includes(ownerFilter.toLowerCase())
        })
        if (!ownerMatch) {
          return false
        }
      }

      // Aktualisiert Datumsbereich Filter
      if (updatedDateRange[0] && principle.updatedAt) {
        const startDate = new Date(updatedDateRange[0])
        const updatedDate = new Date(principle.updatedAt)
        if (updatedDate < startDate) {
          return false
        }
      }

      if (updatedDateRange[1] && principle.updatedAt) {
        const endDate = new Date(updatedDateRange[1])
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
    categoryFilter,
    priorityFilter,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
    isActiveFilter,
  ])

  // Alle verfügbaren Kategorien extrahieren
  const availableCategories = useMemo(() => {
    const categories = principles
      .map(principle => principle.category)
      .filter(
        (category, index, self) =>
          category !== null && category !== undefined && self.indexOf(category) === index
      ) as PrincipleCategory[]

    return categories.sort()
  }, [principles])

  // Alle verfügbaren Prioritäten extrahieren
  const availablePriorities = useMemo(() => {
    const priorities = principles
      .map(principle => principle.priority)
      .filter(
        (priority, index, self) =>
          priority !== null && priority !== undefined && self.indexOf(priority) === index
      ) as PrinciplePriority[]

    return priorities.sort()
  }, [principles])

  // Alle verfügbaren Tags extrahieren
  const availableTags = useMemo(() => {
    const allTags: string[] = []
    principles.forEach(principle => {
      if (principle.tags && Array.isArray(principle.tags)) {
        allTags.push(...principle.tags)
      }
    })

    return Array.from(new Set(allTags)).sort()
  }, [principles])

  return {
    filteredPrinciples: filteredData,
    availableCategories,
    availablePriorities,
    availableTags,
  }
}
