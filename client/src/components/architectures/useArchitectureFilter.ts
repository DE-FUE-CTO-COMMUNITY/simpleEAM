'use client'

import { useMemo, useState } from 'react'
import { ArchitectureType, FilterState } from './types'
import {
  ArchitectureDomain,
  ArchitectureType as GeneratedArchitectureType,
} from '../../gql/generated'

interface UseArchitectureFilterProps {
  architectures: ArchitectureType[]
  filterState?: FilterState
}

export const useArchitectureFilter = ({ architectures = [] }: UseArchitectureFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    domainFilter: [],
    typeFilter: [],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  // Filter function for advanced filters
  const filteredData = useMemo(() => {
    return architectures.filter((architecture: ArchitectureType) => {
      // Domain filter
      if (
        filterState.domainFilter.length > 0 &&
        !filterState.domainFilter.includes(architecture.domain as ArchitectureDomain)
      ) {
        return false
      }

      // Typ Filter
      if (
        filterState.typeFilter.length > 0 &&
        !filterState.typeFilter.includes(architecture.type as GeneratedArchitectureType)
      ) {
        return false
      }

      // Tags Filter
      if (filterState.tagsFilter.length > 0) {
        const architectureTags = architecture.tags || []
        const hasMatchingTag = filterState.tagsFilter.some((tag: string) => architectureTags.includes(tag))
        if (!hasMatchingTag) {
          return false
        }
      }

      // Beschreibung Filter
      if (filterState.descriptionFilter && architecture.description) {
        if (!architecture.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase())) {
          return false
        }
      }

      // Verantwortlicher Filter
      if (filterState.ownerFilter && architecture.owners && architecture.owners.length > 0) {
        const ownerMatch = architecture.owners.some(owner => {
          const ownerFullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
          return ownerFullName.includes(filterState.ownerFilter.toLowerCase())
        })
        if (!ownerMatch) {
          return false
        }
      }

      // Aktualisiert Datumsbereich Filter
      if (filterState.updatedDateRange[0] && architecture.updatedAt) {
        const startDate = new Date(filterState.updatedDateRange[0])
        const updatedDate = new Date(architecture.updatedAt)
        if (updatedDate < startDate) {
          return false
        }
      }

      if (filterState.updatedDateRange[1] && architecture.updatedAt) {
        const endDate = new Date(filterState.updatedDateRange[1])
        endDate.setHours(23, 59, 59, 999) // Ende des Tages
        const updatedDate = new Date(architecture.updatedAt)
        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [
    architectures,
    filterState.domainFilter,
    filterState.typeFilter,
    filterState.tagsFilter,
    filterState.descriptionFilter,
    filterState.ownerFilter,
    filterState.updatedDateRange,
  ])

  // Extract all available domains
  const availableDomains = useMemo(() => {
    const domains = architectures
      .map(arch => arch.domain)
      .filter(
        (domain, index, self) =>
          domain !== null && domain !== undefined && self.indexOf(domain) === index
      ) as ArchitectureDomain[]

    return domains.sort()
  }, [architectures])

  // Extract all available types
  const availableTypes = useMemo(() => {
    const types = architectures
      .map(arch => arch.type)
      .filter(
        (type, index, self) => type !== null && type !== undefined && self.indexOf(type) === index
      ) as GeneratedArchitectureType[]

    return types.sort()
  }, [architectures])

  // Extract all available tags
  const availableTags = useMemo(() => {
    const allTags: string[] = []
    architectures.forEach(arch => {
      if (arch.tags && Array.isArray(arch.tags)) {
        allTags.push(...arch.tags)
      }
    })

    return Array.from(new Set(allTags)).sort()
  }, [architectures])

  // Reset function for filters
  const resetFilters = () => {
    setFilterState({
      domainFilter: [],
      typeFilter: [],
      tagsFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredArchitectures: filteredData,
    resetFilters,
    availableDomains,
    availableTypes,
    availableTags,
  }
}
