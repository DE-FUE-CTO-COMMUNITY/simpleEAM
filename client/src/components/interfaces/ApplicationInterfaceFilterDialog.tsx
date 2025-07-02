'use client'

import React from 'react'
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'
import { FilterProps } from './types'
import { InterfaceType, InterfaceProtocol, InterfaceStatus } from '../../gql/generated'
import { countActiveFilters } from './utils'
import { getInterfaceTypeLabel, getProtocolDisplayLabel, getStatusLabel } from './utils'

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
  // Konfiguration der Filterfelder
  const filterFields: FilterField[] = [
    // Schnittstellentyp-Filter
    {
      id: 'interfaceTypeFilter',
      label: 'Schnittstellentyp',
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
      label: 'Protokoll',
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
      label: 'Status',
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
      label: 'Verantwortliche Person',
      type: 'multiSelect',
      options: availableResponsiblePersons.map(person => ({
        value: person,
        label: person,
      })),
    },
    // Quell-Anwendungen-Filter
    {
      id: 'sourceApplicationsFilter',
      label: 'Quell-Anwendungen',
      type: 'multiSelect',
      options: availableSourceApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Ziel-Anwendungen-Filter
    {
      id: 'targetApplicationsFilter',
      label: 'Ziel-Anwendungen',
      type: 'multiSelect',
      options: availableTargetApplications.map(app => ({
        value: app,
        label: app,
      })),
    },
    // Datenobjekte-Filter
    {
      id: 'dataObjectsFilter',
      label: 'Datenobjekte',
      type: 'multiSelect',
      options: availableDataObjects.map(dataObject => ({
        value: dataObject,
        label: dataObject,
      })),
    },
    // Version-Filter
    {
      id: 'versionFilter',
      label: 'Version',
      type: 'text',
      placeholder: 'z.B. v1.0, 2.3.1...',
    },
    // Suchtext Filter (Name)
    {
      id: 'searchFilter',
      label: 'Name enthält',
      type: 'text',
      placeholder: 'Suche nach Schnittstellenname...',
    },
    // Beschreibungsfilter
    {
      id: 'descriptionFilter',
      label: 'Beschreibung enthält',
      type: 'text',
      placeholder: 'Geben Sie einen Text ein...',
    },
    // Aktualisierungsdatum Filter
    {
      id: 'updatedDateRange',
      label: 'Aktualisiert im Zeitraum',
      type: 'dateRange',
      fromLabel: 'Von',
      toLabel: 'Bis',
    },
  ]

  return (
    <GenericFilterDialog
      title="Filter für Schnittstellen"
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
