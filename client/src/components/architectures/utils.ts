import { ArchitectureDomain, ArchitectureType } from '../../gql/generated'
import { FilterState } from './types'

// Gibt ein menschenlesbares Label für einen Domain-Wert zurück
export const getDomainLabel = (domain: ArchitectureDomain | null): string => {
  if (!domain) return 'Unbekannt'

  switch (domain) {
    case ArchitectureDomain.ENTERPRISE:
      return 'Enterprise'
    case ArchitectureDomain.BUSINESS:
      return 'Business'
    case ArchitectureDomain.DATA:
      return 'Daten'
    case ArchitectureDomain.APPLICATION:
      return 'Applikation'
    case ArchitectureDomain.INTEGRATION:
      return 'Integration'
    case ArchitectureDomain.TECHNOLOGY:
      return 'Technologie'
    case ArchitectureDomain.SECURITY:
      return 'Sicherheit'
    default:
      return domain
  }
}

// Gibt ein menschenlesbares Label für einen Type-Wert zurück
export const getTypeLabel = (type: ArchitectureType | null): string => {
  if (!type) return 'Unbekannt'

  switch (type) {
    case ArchitectureType.CURRENT_STATE:
      return 'Ist-Zustand'
    case ArchitectureType.FUTURE_STATE:
      return 'Soll-Zustand'
    case ArchitectureType.TRANSITION:
      return 'Übergang'
    case ArchitectureType.CONCEPTUAL:
      return 'Konzeptionell'
    default:
      return type
  }
}

// Format date strings or Date objects to a user-friendly format
export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return '-'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Zählt aktive Filter
export const countActiveFilters = (filterState: FilterState): number => {
  let count = 0

  if (filterState.domainFilter && filterState.domainFilter.length > 0) count++
  if (filterState.typeFilter && filterState.typeFilter.length > 0) count++
  if (filterState.tagsFilter && filterState.tagsFilter.length > 0) count++
  if (filterState.descriptionFilter) count++
  if (filterState.ownerFilter) count++
  if (
    filterState.updatedDateRange &&
    (filterState.updatedDateRange[0] || filterState.updatedDateRange[1])
  )
    count++

  return count
}
