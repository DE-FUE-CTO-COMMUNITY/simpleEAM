'use client'

import { useTranslations, useLocale } from 'next-intl'
import { FilterState } from './types'
import { CompanySize } from '../../gql/generated'

/**
 * Custom hook for formatting date values
 */
export const useFormatDate = () => {
  const locale = useLocale()

  return (date: string | null | undefined): string => {
    if (!date) return '-'
    try {
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString(locale)
    } catch {
      return date || '-'
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use useFormatDate hook instead
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('de-DE')
}

/**
 * Hook für Company Size Label-Übersetzungen
 */
export const useCompanySizeLabel = () => {
  const t = useTranslations('companies.sizes')

  return (size: CompanySize | null | undefined): string => {
    if (!size) return '-'

    switch (size) {
      case CompanySize.STARTUP:
        return t('startup')
      case CompanySize.SMALL:
        return t('small')
      case CompanySize.MEDIUM:
        return t('medium')
      case CompanySize.LARGE:
        return t('large')
      case CompanySize.ENTERPRISE:
        return t('enterprise')
      case CompanySize.MULTINATIONAL:
        return t('multinational')
      default:
        return size
    }
  }
}

/**
 * Counts active filters
 */
export const countActiveFilters = (filterState: FilterState): number => {
  let count = 0

  // Text-Filter
  if (filterState.nameFilter) count++
  if (filterState.descriptionFilter) count++
  if (filterState.industryFilter) count++
  if (filterState.addressFilter) count++
  if (filterState.websiteFilter) count++

  // Enum-Filter
  if (filterState.sizeFilter && filterState.sizeFilter.length > 0) count++

  // Datum-Filter
  if (filterState.createdDateRange) count++
  if (filterState.updatedDateRange) count++

  return count
}

/**
 * Hilfsfunktion zur Website-URL-Formatierung
 */
export const formatWebsiteUrl = (website: string | null | undefined): string => {
  if (!website) return '-'

  // Füge http:// hinzu, wenn kein Protokoll vorhanden ist
  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    return `https://${website}`
  }

  return website
}

/**
 * Hilfsfunktion zur Company-Größe-Sortierung
 */
export const getCompanySizeOrder = (size: CompanySize | null | undefined): number => {
  const sizeOrder = {
    STARTUP: 1,
    SMALL: 2,
    MEDIUM: 3,
    LARGE: 4,
    ENTERPRISE: 5,
    MULTINATIONAL: 6,
  }

  return size ? sizeOrder[size] || 0 : 0
}
