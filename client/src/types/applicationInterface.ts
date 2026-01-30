import { ApplicationInterface, InterfaceType } from '../gql/generated'

export type ApplicationInterfaceData = ApplicationInterface

export const getInterfaceTypeLabel = (type: InterfaceType | null): string => {
  if (!type) return 'Unbekannt'

  switch (type) {
    case InterfaceType.API:
      return 'API'
    case InterfaceType.FILE:
      return 'Datei'
    case InterfaceType.DATABASE:
      return 'Datenbank'
    case InterfaceType.MESSAGE_QUEUE:
      return 'Nachricht'
    case InterfaceType.OTHER:
      return 'Sonstige'
    default:
      return type
  }
}

// Format date strings or Date objects to a user-friendly format
export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return '-'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
