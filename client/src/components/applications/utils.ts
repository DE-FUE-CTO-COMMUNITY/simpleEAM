'use client'

import { format } from 'date-fns'
import { FilterState } from './types'
import { CriticalityLevel } from '../../gql/generated'

// Formatiert das Datum für die Anzeige
export const formatDate = (dateString: string): string => {
  try {
    // Standarddatum (1.1.1970) prüfen, das als leerer Wert gilt
    const date = new Date(dateString)
    if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
      return '-'
    }
    return format(date, 'dd.MM.yyyy HH:mm')
  } catch (e) {
    return 'Unbekannt'
  }
}

// Liefert den Label für das Kritikalitäts-Level
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

// Formatiert Kosten für die Anzeige
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
  } = filterState

  return (
    (statusFilter.length > 0 ? 1 : 0) +
    (criticalityFilter.length > 0 ? 1 : 0) +
    (costRangeFilter[0] > 0 || costRangeFilter[1] < 1000000 ? 1 : 0) +
    (technologyStackFilter.length > 0 ? 1 : 0) +
    (descriptionFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (updatedDateRange[0] || updatedDateRange[1] ? 1 : 0) +
    (vendorFilter ? 1 : 0)
  )
}
