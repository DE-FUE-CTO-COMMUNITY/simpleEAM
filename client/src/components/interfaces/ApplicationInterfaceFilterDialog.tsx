'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { InterfaceType, InterfaceProtocol, InterfaceStatus } from '../../gql/generated'
import { countActiveFilters } from './utils'

const ApplicationInterfaceFilterDialog: React.FC<FilterProps> = ({
  filterState,
  availableInterfaceTypes,
  availableProtocols,
  availableStatuses,
  availableOwners,
  availableSourceApplications,
  availableTargetApplications,
  availableDataObjects,
  availableVersions: _availableVersions, // nicht verwendet, da Version als Textfeld implementiert
  onFilterChange,
  onResetFilter,
  onClose,
  onApply,
}) => {
  const t = useTranslations('interfaces.filter')
  const tTypes = useTranslations('interfaces.interfaceTypes')
  const tStatuses = useTranslations('interfaces.statuses')
  const tProtocols = useTranslations('interfaces.protocols')

  // Helper function for interface type labels
  const getInterfaceTypeLabel = (type: InterfaceType) => {
    switch (type) {
      case InterfaceType.API:
        return tTypes('API')
      case InterfaceType.DATABASE:
        return tTypes('DATABASE')
      case InterfaceType.FILE:
        return tTypes('FILE')
      case InterfaceType.MESSAGE_QUEUE:
        return tTypes('MESSAGE_QUEUE')
      case InterfaceType.OTHER:
        return tTypes('OTHER')
      default:
        return type
    }
  }

  // Helper function for status labels
  const getStatusLabel = (status: InterfaceStatus) => {
    switch (status) {
      case InterfaceStatus.ACTIVE:
        return tStatuses('ACTIVE')
      case InterfaceStatus.IN_DEVELOPMENT:
        return tStatuses('IN_DEVELOPMENT')
      case InterfaceStatus.PLANNED:
        return tStatuses('PLANNED')
      case InterfaceStatus.DEPRECATED:
        return tStatuses('DEPRECATED')
      case InterfaceStatus.OUT_OF_SERVICE:
        return tStatuses('OUT_OF_SERVICE')
      default:
        return status
    }
  }

  // Helper function for protocol labels
  const getProtocolDisplayLabel = (protocol: InterfaceProtocol) => {
    switch (protocol) {
      case InterfaceProtocol.HTTP:
        return tProtocols('HTTP')
      case InterfaceProtocol.HTTPS:
        return tProtocols('HTTPS')
      case InterfaceProtocol.FTP:
        return tProtocols('FTP')
      case InterfaceProtocol.SFTP:
        return tProtocols('SFTP')
      case InterfaceProtocol.SOAP:
        return tProtocols('SOAP')
      case InterfaceProtocol.REST:
        return tProtocols('REST')
      case InterfaceProtocol.GRAPHQL:
        return tProtocols('GRAPHQL')
      case InterfaceProtocol.TCP:
        return tProtocols('TCP')
      case InterfaceProtocol.UDP:
        return tProtocols('UDP')
      case InterfaceProtocol.OTHER:
        return tProtocols('OTHER')
      default:
        return protocol
    }
  }

  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Interface type filter
    {
      id: 'interfaceTypeFilter',
      label: t('interfaceType'),
      type: 'multiSelect',
      options: availableInterfaceTypes.map(type => ({
        value: type,
        label: getInterfaceTypeLabel(type),
      })),
      valueFormatter: value => getInterfaceTypeLabel(value as InterfaceType),
    },
    // Protokoll-Filter
    {
      id: 'protocolFilter',
      label: t('protocol'),
      type: 'multiSelect',
      options: availableProtocols.map(protocol => ({
        value: protocol,
        label: getProtocolDisplayLabel(protocol),
      })),
      valueFormatter: value => getProtocolDisplayLabel(value as InterfaceProtocol),
    },
    // Status-Filter
    {
      id: 'statusFilter',
      label: t('status'),
      type: 'multiSelect',
      options: availableStatuses.map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
      valueFormatter: value => getStatusLabel(value as InterfaceStatus),
    },
    // Owner filter
    {
      id: 'ownersFilter',
      label: t('owners'),
      type: 'multiSelect',
      options: availableOwners.map(person => ({
        value: person,
        label: person,
      })),
    },
    // Source applications filter
    {
      id: 'sourceApplicationsFilter',
      label: t('sourceApplications'),
      type: 'multiSelect',
      options: availableSourceApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Target applications filter
    {
      id: 'targetApplicationsFilter',
      label: t('targetApplications'),
      type: 'multiSelect',
      options: availableTargetApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Data objects filter
    {
      id: 'dataObjectsFilter',
      label: t('dataObjects'),
      type: 'multiSelect',
      options: availableDataObjects.map(dataObject => ({
        value: dataObject,
        label: dataObject,
      })),
    },
    // Version-Filter
    {
      id: 'versionFilter',
      label: t('version'),
      type: 'text',
      placeholder: t('enterText'),
    },
    // Beschreibungsfilter
    {
      id: 'descriptionFilter',
      label: t('descriptionContains'),
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
    },
    // Aktualisierungsdatum Filter
    {
      id: 'updatedDateRange',
      label: t('updatedInPeriod'),
      type: 'dateRange',
      fromLabel: t('dateFrom'),
      toLabel: t('dateTo'),
    },
  ]

  return (
    <GenericFilterDialog
      title={t('title')}
      filterState={filterState}
      filterFields={filterFields}
      onFilterChange={onFilterChange}
      onResetFilter={onResetFilter}
      onClose={onClose}
      onApply={onApply}
      countActiveFilters={countActiveFilters}
    />
  )
}

export default ApplicationInterfaceFilterDialog
