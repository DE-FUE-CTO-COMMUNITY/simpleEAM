'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { FilterState } from './types'

// Formats the date for display
export const formatDate = (dateString: string, locale: string = 'de'): string => {
  try {
    const date = new Date(dateString)
    const dateLocale = locale === 'de' ? de : enUS
    const formatPattern = locale === 'de' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
    return format(date, formatPattern, { locale: dateLocale })
  } catch {
    return 'Unbekannt'
  }
}

// Returns label for maturity level
export const getLevelLabel = (level: number | null | undefined, t?: any): string => {
  if (level === null || level === undefined) {
    return t ? t('undefined') : 'Nicht definiert'
  }

  switch (level) {
    case 1:
      return t ? t('1') : 'Sehr niedrig'
    case 2:
      return t ? t('2') : 'Niedrig'
    case 3:
      return t ? t('3') : 'Mittel'
    case 4:
      return t ? t('4') : 'Hoch'
    case 5:
      return t ? t('5') : 'Sehr hoch'
    default:
      return `Level ${level}`
  }
}

// Berechnet die Anzahl der aktiven Filter
export const countActiveFilters = (filterState: FilterState): number => {
  const {
    statusFilter,
    maturityLevelFilter,
    businessValueRange,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  } = filterState

  return (
    (statusFilter.length > 0 ? 1 : 0) +
    (maturityLevelFilter.length > 0 ? 1 : 0) +
    (businessValueRange[0] > 0 || businessValueRange[1] < 10 ? 1 : 0) +
    (tagsFilter.length > 0 ? 1 : 0) +
    (descriptionFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (updatedDateRange[0] || updatedDateRange[1] ? 1 : 0)
  )
}
