'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { FilterState } from './types'

export const formatDate = (dateString: string, locale: string = 'de'): string => {
  try {
    const date = new Date(dateString)
    const dateLocale = locale === 'de' ? de : enUS
    const formatPattern = locale === 'de' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
    return format(date, formatPattern, { locale: dateLocale })
  } catch {
    return '-'
  }
}

export const countActiveFilters = (filterState: FilterState): number => {
  const {
    statusFilter,
    processTypeFilter,
    categoryFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  } = filterState

  return (
    (statusFilter.length > 0 ? 1 : 0) +
    (processTypeFilter.length > 0 ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (descriptionFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (updatedDateRange[0] || updatedDateRange[1] ? 1 : 0)
  )
}
