'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { CompanyFilterState } from './types'
import { CompanySize } from '../../gql/generated'

// Formatiert das Datum für die Anzeige
export const formatDate = (dateString: string, locale: string = 'de'): string => {
  try {
    // Standarddatum (1.1.1970) prüfen, das als leerer Wert gilt
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

// Liefert den Label für die Unternehmensgröße
export const getCompanySizeLabel = (size: CompanySize | null | undefined): string => {
  if (size === null || size === undefined) {
    return 'Nicht definiert'
  }

  switch (size) {
    case CompanySize.STARTUP:
      return 'Startup'
    case CompanySize.SMALL:
      return 'Klein'
    case CompanySize.MEDIUM:
      return 'Mittel'
    case CompanySize.LARGE:
      return 'Groß'
    case CompanySize.ENTERPRISE:
      return 'Konzern'
    case CompanySize.MULTINATIONAL:
      return 'Multinational'
    default:
      return `${size}`
  }
}

// Formatiert Website-URL für die Anzeige
export const formatWebsite = (website: string | null | undefined): string => {
  if (!website) {
    return '-'
  }
  // Entferne Protocol für bessere Anzeige
  return website.replace(/^https?:\/\//, '')
}

// Formatiert Adresse für die Anzeige (mehrzeilig -> einzeilig)
export const formatAddress = (address: string | null | undefined): string => {
  if (!address) {
    return '-'
  }
  // Ersetze Zeilenumbrüche durch Kommas
  return address.replace(/\n/g, ', ')
}

// Zählt die aktiven Filter
export const countActiveFilters = (filterState: CompanyFilterState): number => {
  let count = 0
  if (filterState.search.trim()) count++
  if (filterState.industry.length > 0) count++
  if (filterState.size.length > 0) count++
  return count
}

// Erstellt eine Company-Größen-Liste für Dropdowns
export const getCompanySizeOptions = () => {
  return Object.values(CompanySize).map(size => ({
    value: size,
    label: getCompanySizeLabel(size),
  }))
}
