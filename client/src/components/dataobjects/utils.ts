'use client'

import { format } from 'date-fns'
import { DataClassification } from '../../gql/generated'

// Formatiert das Datum für die Anzeige
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm')
  } catch {
    return 'Unbekannt'
  }
}

// Gibt einen lesbaren deutschen Namen für die Klassifikation zurück
export const getClassificationLabel = (classification: DataClassification): string => {
  switch (classification) {
    case DataClassification.PUBLIC:
      return 'Öffentlich'
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
