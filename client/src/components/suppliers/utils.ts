'use client'

import { useTranslations, useLocale } from 'next-intl'
import { FilterState, SupplierType } from './types'

/**
 * Custom hook for formatting date values
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
 * Hook zum Formatieren von Boolean-Werten mit Internationalisierung
 */
export const useFormatBoolean = () => {
  const t = useTranslations('suppliers.states')

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
 * Zählt aktive Filter
 */
export const countActiveFilters = (filterState: FilterState): number => {
  let count = 0

  if (filterState.supplierTypeFilter && filterState.supplierTypeFilter.length > 0) count++
  if (filterState.statusFilter && filterState.statusFilter.length > 0) count++
  if (filterState.riskClassificationFilter && filterState.riskClassificationFilter.length > 0)
    count++
  if (filterState.strategicImportanceFilter && filterState.strategicImportanceFilter.length > 0)
    count++
  if (filterState.descriptionFilter) count++
  if (filterState.updatedDateRange[0] && filterState.updatedDateRange[1]) count++

  return count
}

/**
 * Hook zum Formatieren von Supplier Type
 */
export const useSupplierTypeLabel = () => {
  const t = useTranslations('suppliers.supplierTypes')

  return (type: string | null | undefined): string => {
    if (!type) return '-'
    return t(type)
  }
}

/**
 * Hook zum Formatieren von Supplier Status
 */
export const useSupplierStatusLabel = () => {
  const t = useTranslations('suppliers.statuses')

  return (status: string | null | undefined): string => {
    if (!status) return '-'
    return t(status)
  }
}

/**
 * Hook zum Formatieren von Risk Classification
 */
export const useRiskClassificationLabel = () => {
  const t = useTranslations('suppliers.riskClassifications')

  return (risk: string | null | undefined): string => {
    if (!risk) return '-'
    return t(risk)
  }
}

/**
 * Hook zum Formatieren von Strategic Importance
 */
export const useStrategicImportanceLabel = () => {
  const t = useTranslations('suppliers.strategicImportances')

  return (importance: string | null | undefined): string => {
    if (!importance) return '-'
    return t(importance)
  }
}
