'use client'

import { GenericFilterState } from '../common/GenericFilterDialog'
import { InterfaceType, InterfaceProtocol, InterfaceStatus } from '../../gql/generated'

export const INTERFACE_PROTOCOLS_BY_TYPE: Record<InterfaceType, InterfaceProtocol[]> = {
  [InterfaceType.API]: [
    InterfaceProtocol.REST,
    InterfaceProtocol.SOAP,
    InterfaceProtocol.GRAPHQL,
    InterfaceProtocol.GRPC,
    InterfaceProtocol.ODATA,
    InterfaceProtocol.HTTP,
    InterfaceProtocol.HTTPS,
  ],
  [InterfaceType.FILE]: [
    InterfaceProtocol.FTP,
    InterfaceProtocol.SFTP,
    InterfaceProtocol.FTPS,
    InterfaceProtocol.SCP,
    InterfaceProtocol.NFS,
    InterfaceProtocol.SMB,
    InterfaceProtocol.WEBDAV,
    InterfaceProtocol.AS2,
  ],
  [InterfaceType.DATABASE]: [
    InterfaceProtocol.JDBC,
    InterfaceProtocol.ODBC,
    InterfaceProtocol.ORACLE,
  ],
  [InterfaceType.MESSAGE_QUEUE]: [InterfaceProtocol.AMQP, InterfaceProtocol.JMS],
  [InterfaceType.EVENT_STREAM]: [InterfaceProtocol.KAFKA, InterfaceProtocol.MQTT],
  [InterfaceType.BATCH]: [
    InterfaceProtocol.JDBC,
    InterfaceProtocol.ODBC,
    InterfaceProtocol.FTP,
    InterfaceProtocol.SFTP,
  ],
  [InterfaceType.UI]: [InterfaceProtocol.HTTP, InterfaceProtocol.HTTPS],
  [InterfaceType.IDENTITY]: [
    InterfaceProtocol.LDAP,
    InterfaceProtocol.LDAPS,
    InterfaceProtocol.OAUTH2,
    InterfaceProtocol.OPENID_CONNECT,
    InterfaceProtocol.SAML,
  ],
  [InterfaceType.INTEGRATION_PLATFORM]: [
    InterfaceProtocol.JMS,
    InterfaceProtocol.AMQP,
    InterfaceProtocol.HTTP,
    InterfaceProtocol.HTTPS,
    InterfaceProtocol.SOAP,
    InterfaceProtocol.REST,
  ],
  [InterfaceType.OTHER]: [
    InterfaceProtocol.SMTP,
    InterfaceProtocol.IMAP,
    InterfaceProtocol.POP3,
    InterfaceProtocol.SAP_IDOC,
    InterfaceProtocol.EDI,
    InterfaceProtocol.OTHER,
  ],
}

export const getAllowedProtocolsForInterfaceType = (interfaceType?: InterfaceType | null) => {
  if (!interfaceType) {
    return []
  }

  return INTERFACE_PROTOCOLS_BY_TYPE[interfaceType] ?? []
}

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
    case InterfaceType.BATCH:
      return 'Batch'
    case InterfaceType.DATABASE:
      return 'Datenbank'
    case InterfaceType.EVENT_STREAM:
      return 'Event Stream'
    case InterfaceType.FILE:
      return 'Datei'
    case InterfaceType.IDENTITY:
      return 'Identitaet'
    case InterfaceType.INTEGRATION_PLATFORM:
      return 'Integrationsplattform'
    case InterfaceType.MESSAGE_QUEUE:
      return 'Nachrichtenwarteschlange'
    case InterfaceType.OTHER:
      return 'Sonstige'
    case InterfaceType.UI:
      return 'UI'
    default:
      return type
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
    case InterfaceProtocol.AMQP:
      return 'AMQP'
    case InterfaceProtocol.AS2:
      return 'AS2'
    case InterfaceProtocol.EDI:
      return 'EDI'
    case InterfaceProtocol.FTP:
      return 'FTP'
    case InterfaceProtocol.FTPS:
      return 'FTPS'
    case InterfaceProtocol.GRAPHQL:
      return 'GraphQL'
    case InterfaceProtocol.GRPC:
      return 'gRPC'
    case InterfaceProtocol.HTTP:
      return 'HTTP'
    case InterfaceProtocol.HTTPS:
      return 'HTTPS'
    case InterfaceProtocol.IMAP:
      return 'IMAP'
    case InterfaceProtocol.JDBC:
      return 'JDBC'
    case InterfaceProtocol.JMS:
      return 'JMS'
    case InterfaceProtocol.KAFKA:
      return 'Kafka'
    case InterfaceProtocol.LDAP:
      return 'LDAP'
    case InterfaceProtocol.LDAPS:
      return 'LDAPS'
    case InterfaceProtocol.MQTT:
      return 'MQTT'
    case InterfaceProtocol.NFS:
      return 'NFS'
    case InterfaceProtocol.ODBC:
      return 'ODBC'
    case InterfaceProtocol.OAUTH2:
      return 'OAuth 2.0'
    case InterfaceProtocol.ODATA:
      return 'OData'
    case InterfaceProtocol.OPENID_CONNECT:
      return 'OpenID Connect'
    case InterfaceProtocol.ORACLE:
      return 'Oracle'
    case InterfaceProtocol.OTHER:
      return 'Sonstige'
    case InterfaceProtocol.POP3:
      return 'POP3'
    case InterfaceProtocol.REST:
      return 'REST'
    case InterfaceProtocol.SAML:
      return 'SAML'
    case InterfaceProtocol.SAP_IDOC:
      return 'SAP IDoc'
    case InterfaceProtocol.SCP:
      return 'SCP'
    case InterfaceProtocol.SFTP:
      return 'SFTP'
    case InterfaceProtocol.SMB:
      return 'SMB'
    case InterfaceProtocol.SMTP:
      return 'SMTP'
    case InterfaceProtocol.SOAP:
      return 'SOAP'
    case InterfaceProtocol.WEBDAV:
      return 'WebDAV'
    default:
      return protocol
  }
}
