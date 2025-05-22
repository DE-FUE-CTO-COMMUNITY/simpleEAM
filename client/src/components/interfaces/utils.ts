'use client'

import { GenericFilterState } from '../common/GenericFilterDialog'
import { InterfaceType } from '../../gql/generated'

/**
 * Hilfsfunktion zur Formatierung von Datum
 */
export const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Konvertiert den InterfaceType-Enum in einen benutzerfreundlichen String
 */
export const getInterfaceTypeLabel = (type: InterfaceType): string => {
  switch (type) {
    case InterfaceType.API:
      return 'API'
    case InterfaceType.DATABASE:
      return 'Datenbank'
    case InterfaceType.FILE:
      return 'Datei'
    case InterfaceType.MESSAGE_QUEUE:
      return 'Nachrichtenwarteschlange'
    case InterfaceType.OTHER:
      return 'Sonstige'
    default:
      return 'Unbekannt'
  }
}

/**
 * Zählt die Anzahl der aktiven Filter im FilterState
 */
export const countActiveFilters = (filterState: GenericFilterState): number => {
  let count = 0

  // InterfaceType-Filter
  if (
    filterState.interfaceTypeFilter &&
    (filterState.interfaceTypeFilter as InterfaceType[]).length > 0
  ) {
    count++
  }

  // Suchfilter
  if (filterState.searchFilter && (filterState.searchFilter as string).trim() !== '') {
    count++
  }

  // Aktualisierungsdatum Filter
  const updatedDateRange = filterState.updatedDateRange as [string, string] | undefined
  if (
    updatedDateRange &&
    ((updatedDateRange[0] && updatedDateRange[0].trim() !== '') ||
      (updatedDateRange[1] && updatedDateRange[1].trim() !== ''))
  ) {
    count++
  }

  return count
}
