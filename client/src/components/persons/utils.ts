'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { GenericFilterState } from '../common/GenericFilterDialog'

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

/**
 * Zählt die Anzahl der aktiven Filter im FilterState
 */
export const countActiveFilters = (filterState: GenericFilterState): number => {
  let count = 0

  // Departmentfilter
  if (filterState.departmentFilter && (filterState.departmentFilter as string[]).length > 0) {
    count++
  }

  // Rollenfilter
  if (filterState.roleFilter && (filterState.roleFilter as string[]).length > 0) {
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
