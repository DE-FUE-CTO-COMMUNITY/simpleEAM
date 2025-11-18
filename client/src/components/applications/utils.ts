'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { FilterState } from './types'
import { CriticalityLevel, TimeCategory, SevenRStrategy } from '../../gql/generated'

// Formats the date for display
export const formatDate = (dateString: string, locale: string = 'de'): string => {
  try {
    // Check default date (1.1.1970) that counts as empty value
    const date = new Date(dateString)
    if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
      return '-'
    }
    const dateLocale = locale === 'de' ? de : enUS
    const formatPattern = locale === 'de' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
    return format(date, formatPattern, { locale: dateLocale })
  } catch {
    return 'Unbekannt'
  }
}

// Returns label for das Kritikalitäts-Level
export const getCriticalityLabel = (level: CriticalityLevel | null | undefined): string => {
  if (level === null || level === undefined) {
    return 'Nicht definiert'
  }

  switch (level) {
    case CriticalityLevel.LOW:
      return 'Niedrig'
    case CriticalityLevel.MEDIUM:
      return 'Mittel'
    case CriticalityLevel.HIGH:
      return 'Hoch'
    case CriticalityLevel.CRITICAL:
      return 'Kritisch'
    default:
      return `${level}`
  }
}

// Formats costs for display
export const formatCosts = (costs: number | null | undefined): string => {
  if (costs === null || costs === undefined) {
    return '-'
  }
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(costs)
}

// Berechnet die Anzahl der aktiven Filter
export const countActiveFilters = (filterState: FilterState): number => {
  const {
    statusFilter,
    criticalityFilter,
    costRangeFilter,
    technologyStackFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
    vendorFilter,
    timeCategoryFilter,
    sevenRStrategyFilter,
  } = filterState

  return (
    (statusFilter.length > 0 ? 1 : 0) +
    (criticalityFilter.length > 0 ? 1 : 0) +
    (costRangeFilter[0] > 0 || costRangeFilter[1] < 1000000 ? 1 : 0) +
    (technologyStackFilter.length > 0 ? 1 : 0) +
    (descriptionFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (updatedDateRange[0] || updatedDateRange[1] ? 1 : 0) +
    (vendorFilter ? 1 : 0) +
    (timeCategoryFilter.length > 0 ? 1 : 0) +
    (sevenRStrategyFilter.length > 0 ? 1 : 0)
  )
}

// Label functions for TIME-Kategorie
export const getTimeCategoryLabel = (category: TimeCategory): string => {
  switch (category) {
    case TimeCategory.TOLERATE:
      return 'Tolerate (Tolerieren)'
    case TimeCategory.INVEST:
      return 'Invest (Investieren)'
    case TimeCategory.MIGRATE:
      return 'Migrate (Migrieren)'
    case TimeCategory.ELIMINATE:
      return 'Eliminate (Eliminieren)'
    default:
      return category
  }
}

// Label functions for 7R-Strategie
export const getSevenRStrategyLabel = (strategy: SevenRStrategy): string => {
  switch (strategy) {
    case SevenRStrategy.RETIRE:
      return 'Retire (Stilllegen)'
    case SevenRStrategy.RETAIN:
      return 'Retain (Beibehalten)'
    case SevenRStrategy.REHOST:
      return 'Rehost (Lift & Shift)'
    case SevenRStrategy.REPLATFORM:
      return 'Replatform (Lift & Reshape)'
    case SevenRStrategy.REFACTOR:
      return 'Refactor (Re-architect)'
    case SevenRStrategy.REARCHITECT:
      return 'Rearchitect (Rebuild)'
    case SevenRStrategy.REPLACE:
      return 'Replace (Buy new)'
    default:
      return strategy
  }
}
