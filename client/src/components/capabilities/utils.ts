'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { FilterState } from './types'

// Formatiert das Datum für die Anzeige
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

// Liefert den Label für den Reifegrad
export const getLevelLabel = (level: number | null | undefined, t?: any): string => {
  if (level === null || level === undefined) {
    return t ? t('undefined') : 'Nicht definiert'
  }

  switch (level) {
    case 0:
      return t ? t('low') : 'Niedrig'
    case 1:
      return t ? t('medium') : 'Mittel'
    case 2:
      return t ? t('high') : 'Hoch'
    case 3:
      return t ? t('veryHigh') : 'Sehr Hoch'
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
