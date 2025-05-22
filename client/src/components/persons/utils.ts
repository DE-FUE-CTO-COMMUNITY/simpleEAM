'use client'

import { GenericFilterState } from '../common/GenericFilterDialog'

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
