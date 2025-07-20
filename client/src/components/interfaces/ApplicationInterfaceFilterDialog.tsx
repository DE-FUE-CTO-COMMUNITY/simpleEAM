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
  availableResponsiblePersons,
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

  // Hilfsfunktion für Interface Type Labels
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

  // Hilfsfunktion für Status Labels
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

  // Hilfsfunktion für Protokoll Labels
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
    // Schnittstellentyp-Filter
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
    // Verantwortliche Person-Filter
    {
      id: 'responsiblePersonFilter',
      label: t('responsiblePerson'),
      type: 'multiSelect',
      options: availableResponsiblePersons.map(person => ({
        value: person,
        label: person,
      })),
    },
    // Quell-Applikationen-Filter
    {
      id: 'sourceApplicationsFilter',
      label: t('sourceApplications'),
      type: 'multiSelect',
      options: availableSourceApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Ziel-Applikationen-Filter
    {
      id: 'targetApplicationsFilter',
      label: t('targetApplications'),
      type: 'multiSelect',
      options: availableTargetApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Datenobjekte-Filter
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
    // Suchtext Filter (Name)
    {
      id: 'searchFilter',
      label: 'Name enthält',
      type: 'text',
      placeholder: t('descriptionPlaceholder'),
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
