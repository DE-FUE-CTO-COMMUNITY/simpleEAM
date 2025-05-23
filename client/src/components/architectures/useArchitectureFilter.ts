'use client'

import { useMemo } from 'react'
import { ArchitectureType, FilterState } from './types'
import {
  ArchitectureDomain,
  ArchitectureType as GeneratedArchitectureType,
} from '../../gql/generated'

interface UseArchitectureFilterProps {
  architectures: ArchitectureType[]
  filterState?: FilterState
}

export const useArchitectureFilter = ({
  architectures,
  filterState,
}: UseArchitectureFilterProps) => {
  const {
    domainFilter = [],
    typeFilter = [],
    tagsFilter = [],
    descriptionFilter = '',
    ownerFilter = '',
    updatedDateRange = ['', ''],
  } = filterState || {}

  // Filterfunktion für erweiterte Filter
  const filteredData = useMemo(() => {
    return architectures.filter((architecture: ArchitectureType) => {
      // Domain Filter
      if (
        domainFilter.length > 0 &&
        !domainFilter.includes(architecture.domain as ArchitectureDomain)
      ) {
        return false
      }

      // Typ Filter
      if (
        typeFilter.length > 0 &&
        !typeFilter.includes(architecture.type as GeneratedArchitectureType)
      ) {
        return false
      }

      // Tags Filter
      if (tagsFilter.length > 0) {
        const architectureTags = architecture.tags || []
        const hasMatchingTag = tagsFilter.some(tag => architectureTags.includes(tag))
        if (!hasMatchingTag) {
          return false
        }
      }

      // Beschreibung Filter
      if (descriptionFilter && architecture.description) {
        if (!architecture.description.toLowerCase().includes(descriptionFilter.toLowerCase())) {
          return false
        }
      }

      // Verantwortlicher Filter
      if (ownerFilter && architecture.owners && architecture.owners.length > 0) {
        const ownerMatch = architecture.owners.some(owner => {
          const ownerFullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
          return ownerFullName.includes(ownerFilter.toLowerCase())
        })
        if (!ownerMatch) {
          return false
        }
      }

      // Aktualisiert Datumsbereich Filter
      if (updatedDateRange[0] && architecture.updatedAt) {
        const startDate = new Date(updatedDateRange[0])
        const updatedDate = new Date(architecture.updatedAt)
        if (updatedDate < startDate) {
          return false
        }
      }

      if (updatedDateRange[1] && architecture.updatedAt) {
        const endDate = new Date(updatedDateRange[1])
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
    domainFilter,
    typeFilter,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  ])

  // Alle verfügbaren Domains extrahieren
  const availableDomains = useMemo(() => {
    const domains = architectures
      .map(arch => arch.domain)
      .filter(
        (domain, index, self) =>
          domain !== null && domain !== undefined && self.indexOf(domain) === index
      ) as ArchitectureDomain[]

    return domains.sort()
  }, [architectures])

  // Alle verfügbaren Typen extrahieren
  const availableTypes = useMemo(() => {
    const types = architectures
      .map(arch => arch.type)
      .filter(
        (type, index, self) => type !== null && type !== undefined && self.indexOf(type) === index
      ) as GeneratedArchitectureType[]

    return types.sort()
  }, [architectures])

  // Alle verfügbaren Tags extrahieren
  const availableTags = useMemo(() => {
    const allTags: string[] = []
    architectures.forEach(arch => {
      if (arch.tags && Array.isArray(arch.tags)) {
        allTags.push(...arch.tags)
      }
    })

    return Array.from(new Set(allTags)).sort()
  }, [architectures])

  return {
    filteredArchitectures: filteredData,
    availableDomains,
    availableTypes,
    availableTags,
  }
}
