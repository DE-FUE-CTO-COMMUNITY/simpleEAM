'use client'

import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { FilterState } from './types'

/**
 * Hilfsfunktion zum Formatieren von Daten
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('de-DE')
}

/**
 * Hilfsfunktion zum Formatieren von Prioritäten mit deutschen Labels
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
 * Hilfsfunktion zum Formatieren von Kategorien mit deutschen Labels
 */
export const getCategoryLabel = (category: PrincipleCategory): string => {
  const labels: Record<PrincipleCategory, string> = {
    [PrincipleCategory.BUSINESS]: 'Business',
    [PrincipleCategory.DATA]: 'Daten',
    [PrincipleCategory.APPLICATION]: 'Anwendung',
    [PrincipleCategory.TECHNOLOGY]: 'Technologie',
    [PrincipleCategory.SECURITY]: 'Sicherheit',
    [PrincipleCategory.INTEGRATION]: 'Integration',
    [PrincipleCategory.GOVERNANCE]: 'Governance',
    [PrincipleCategory.COMPLIANCE]: 'Compliance',
    [PrincipleCategory.PERFORMANCE]: 'Performance',
    [PrincipleCategory.SCALABILITY]: 'Skalierbarkeit',
    [PrincipleCategory.RELIABILITY]: 'Zuverlässigkeit',
    [PrincipleCategory.MAINTAINABILITY]: 'Wartbarkeit',
    [PrincipleCategory.INTEROPERABILITY]: 'Interoperabilität',
    [PrincipleCategory.REUSABILITY]: 'Wiederverwendbarkeit',
    [PrincipleCategory.FLEXIBILITY]: 'Flexibilität',
    [PrincipleCategory.COST_OPTIMIZATION]: 'Kostenoptimierung',
  }
  return labels[category] || category
}

/**
 * Hilfsfunktion zum Formatieren von Boolean-Werten
 */
export const formatBoolean = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return value ? 'Aktiv' : 'Inaktiv'
}

/**
 * Zählt aktive Filter
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
