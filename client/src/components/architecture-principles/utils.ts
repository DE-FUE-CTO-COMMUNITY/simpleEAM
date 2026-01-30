'use client'

import { useTranslations, useLocale } from 'next-intl'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { FilterState } from './types'

/**
 * Custom hook for translating PrincipleCategory enum values
 */
export const useCategoryLabel = () => {
  const t = useTranslations('architecturePrinciples.categories')

  return (category: PrincipleCategory | null | undefined): string => {
    if (!category) return ''
    return t(category as any)
  }
}

/**
 * Custom hook for translating PrinciplePriority enum values
 */
export const usePriorityLabel = () => {
  const t = useTranslations('architecturePrinciples.priorities')

  return (priority: PrinciplePriority | null | undefined): string => {
    if (!priority) return ''
    return t(priority as any)
  }
}

/**
 * Custom hook for formatting date values in architecture principles
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
 * Legacy function for backward compatibility
 * @deprecated Use usePriorityLabel hook instead
 */
export const getPriorityLabel = (priority: PrinciplePriority): string => {
  const labels: Record<PrinciplePriority, string> = {
    [PrinciplePriority.LOW]: 'Niedrig',
    [PrinciplePriority.MEDIUM]: 'Mittel',
    [PrinciplePriority.HIGH]: 'Hoch',
    [PrinciplePriority.CRITICAL]: 'Kritisch',
  }
  return labels[priority] || priority
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use useCategoryLabel hook instead
 */
export const getCategoryLabel = (category: PrincipleCategory): string => {
  const labels: Record<PrincipleCategory, string> = {
    [PrincipleCategory.APPLICATION]: 'Anwendung',
    [PrincipleCategory.BUSINESS]: 'Business',
    [PrincipleCategory.COMPLIANCE]: 'Compliance',
    [PrincipleCategory.COST_OPTIMIZATION]: 'Kostenoptimierung',
    [PrincipleCategory.DATA]: 'Daten',
    [PrincipleCategory.FLEXIBILITY]: 'Flexibility',
    [PrincipleCategory.GOVERNANCE]: 'Governance',
    [PrincipleCategory.INTEGRATION]: 'Integration',
    [PrincipleCategory.INTEROPERABILITY]: 'Interoperability',
    [PrincipleCategory.MAINTAINABILITY]: 'Wartbarkeit',
    [PrincipleCategory.PERFORMANCE]: 'Performance',
    [PrincipleCategory.RELIABILITY]: 'Reliability',
    [PrincipleCategory.REUSABILITY]: 'Wiederverwendbarkeit',
    [PrincipleCategory.SCALABILITY]: 'Skalierbarkeit',
    [PrincipleCategory.SECURITY]: 'Sicherheit',
    [PrincipleCategory.TECHNOLOGY]: 'Technologie',
  }
  return labels[category] || category
}

/**
 * Hook zum Formatieren von Boolean-Werten mit Internationalisierung
 */
export const useFormatBoolean = () => {
  const t = useTranslations('architecturePrinciples.states')

  return (value: boolean | null | undefined): string => {
    if (value === null || value === undefined) return '-'
    return value ? t('active') : t('inactive')
  }
}

/**
 * @deprecated Legacy-Funktion - verwenden Sie useFormatBoolean() Hook stattdessen
 */
export const formatBoolean = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return value ? 'Aktiv' : 'Inaktiv'
}

/**
 * Counts active filters
 */
export const countActiveFilters = (filterState: FilterState): number => {
  let count = 0

  if (filterState.categoryFilter && filterState.categoryFilter.length > 0) count++
  if (filterState.priorityFilter && filterState.priorityFilter.length > 0) count++
  if (filterState.tagsFilter && filterState.tagsFilter.length > 0) count++
  if (filterState.descriptionFilter) count++
  if (filterState.ownerFilter) count++
  if (filterState.isActiveFilter !== null && filterState.isActiveFilter !== 'all') count++
  if (
    filterState.updatedDateRange &&
    (filterState.updatedDateRange[0] || filterState.updatedDateRange[1])
  )
    count++

  return count
}
