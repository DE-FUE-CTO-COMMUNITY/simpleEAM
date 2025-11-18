import { ArchitectureDomain, ArchitectureType } from '../../gql/generated'
import { FilterState } from './types'
import { useTranslations, useLocale } from 'next-intl'

// Hook for domain labels with translations
export const useDomainLabel = () => {
  const t = useTranslations('architectures.domains')

  return (domain: ArchitectureDomain | null): string => {
    if (!domain) return t('unknown')

    switch (domain) {
      case ArchitectureDomain.ENTERPRISE:
        return t('enterprise')
      case ArchitectureDomain.BUSINESS:
        return t('business')
      case ArchitectureDomain.DATA:
        return t('data')
      case ArchitectureDomain.APPLICATION:
        return t('application')
      case ArchitectureDomain.INTEGRATION:
        return t('integration')
      case ArchitectureDomain.TECHNOLOGY:
        return t('technology')
      case ArchitectureDomain.SECURITY:
        return t('security')
      default:
        return domain
    }
  }
}

// Hook for type labels with translations
export const useTypeLabel = () => {
  const t = useTranslations('architectures.types')

  return (type: ArchitectureType | null): string => {
    if (!type) return t('unknown')

    switch (type) {
      case ArchitectureType.CURRENT_STATE:
        return t('currentState')
      case ArchitectureType.FUTURE_STATE:
        return t('futureState')
      case ArchitectureType.TRANSITION:
        return t('transition')
      case ArchitectureType.CONCEPTUAL:
        return t('conceptual')
      default:
        return type
    }
  }
}

// Fallback functions for compatibility (deprecated - use the hooks)
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

// Returns a human-readable label for a type value
export const getTypeLabel = (type: ArchitectureType | null): string => {
  if (!type) return 'Unbekannt'

  switch (type) {
    case ArchitectureType.CURRENT_STATE:
      return 'Ist-Zustand'
    case ArchitectureType.FUTURE_STATE:
      return 'Soll-Zustand'
    case ArchitectureType.TRANSITION:
      return 'Transition'
    case ArchitectureType.CONCEPTUAL:
      return 'Konzeptionell'
    default:
      return type
  }
}

// Hook for internationalized date formatting
export const useFormatDate = () => {
  const locale = useLocale()

  return (dateString?: string | Date | null): string => {
    if (!dateString) return '-'
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
}

// Legacy format date function (deprecated - use useFormatDate hook instead)
export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return '-'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Count active filters
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
