'use client'

import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { DataClassification } from '../../gql/generated'

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

// Returns a readable name for the classification
export const getClassificationLabel = (classification: DataClassification): string => {
  switch (classification) {
    case DataClassification.PUBLIC:
      return 'Public'
    case DataClassification.INTERNAL:
      return 'Intern'
    case DataClassification.CONFIDENTIAL:
      return 'Vertraulich'
    case DataClassification.STRICTLY_CONFIDENTIAL:
      return 'Streng vertraulich'
    default:
      return 'Unbekannt'
  }
}
