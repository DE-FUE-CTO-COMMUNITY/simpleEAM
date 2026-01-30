'use client'

import { GenericFilterState } from '../common/GenericFilterDialog'
import { InterfaceType, InterfaceProtocol, InterfaceStatus } from '../../gql/generated'

/**
 * Helper function for date formatting
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
 * Konvertiert den InterfaceStatus-Enum in einen benutzerfreundlichen String
 */
export const getStatusLabel = (status: InterfaceStatus): string => {
  switch (status) {
    case InterfaceStatus.ACTIVE:
      return 'Aktiv'
    case InterfaceStatus.DEPRECATED:
      return 'Veraltet'
    case InterfaceStatus.IN_DEVELOPMENT:
      return 'In Entwicklung'
    case InterfaceStatus.OUT_OF_SERVICE:
      return 'Out of Service'
    case InterfaceStatus.PLANNED:
      return 'Geplant'
    default:
      return 'Unbekannt'
  }
}

/**
 * Konvertiert den InterfaceProtocol-Enum in einen benutzerfreundlichen String
 */
export const getProtocolLabel = (protocol: any): string => {
  if (!protocol) return '-'

  // Return protocol string directly as enum values are already meaningful
  return protocol
}

/**
 * Counts the number of active filters in FilterState
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

  // Protocol-Filter
  if (
    filterState.protocolFilter &&
    (filterState.protocolFilter as InterfaceProtocol[]).length > 0
  ) {
    count++
  }

  // Status-Filter
  if (filterState.statusFilter && (filterState.statusFilter as InterfaceStatus[]).length > 0) {
    count++
  }

  // Owner filter
  if (filterState.ownersFilter && (filterState.ownersFilter as string[]).length > 0) {
    count++
  }

  // Source Applications-Filter
  if (
    filterState.sourceApplicationsFilter &&
    (filterState.sourceApplicationsFilter as string[]).length > 0
  ) {
    count++
  }

  // Target Applications-Filter
  if (
    filterState.targetApplicationsFilter &&
    (filterState.targetApplicationsFilter as string[]).length > 0
  ) {
    count++
  }

  // Data Objects-Filter
  if (filterState.dataObjectsFilter && (filterState.dataObjectsFilter as string[]).length > 0) {
    count++
  }

  // Version-Filter
  if (filterState.versionFilter && (filterState.versionFilter as string).trim() !== '') {
    count++
  }

  // Beschreibungsfilter
  if (filterState.descriptionFilter && (filterState.descriptionFilter as string).trim() !== '') {
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

/**
 * Konvertiert den InterfaceProtocol-Enum in einen benutzerfreundlichen String
 */
export const getProtocolDisplayLabel = (protocol: InterfaceProtocol): string => {
  switch (protocol) {
    case InterfaceProtocol.FTP:
      return 'FTP'
    case InterfaceProtocol.GRAPHQL:
      return 'GraphQL'
    case InterfaceProtocol.HTTP:
      return 'HTTP'
    case InterfaceProtocol.HTTPS:
      return 'HTTPS'
    case InterfaceProtocol.JDBC:
      return 'JDBC'
    case InterfaceProtocol.LDAP:
      return 'LDAP'
    case InterfaceProtocol.ODBC:
      return 'ODBC'
    case InterfaceProtocol.OTHER:
      return 'Sonstige'
    case InterfaceProtocol.REST:
      return 'REST'
    case InterfaceProtocol.SFTP:
      return 'SFTP'
    case InterfaceProtocol.SMTP:
      return 'SMTP'
    case InterfaceProtocol.SOAP:
      return 'SOAP'
    case InterfaceProtocol.TCP:
      return 'TCP'
    case InterfaceProtocol.UDP:
      return 'UDP'
    default:
      return 'Unbekannt'
  }
}
