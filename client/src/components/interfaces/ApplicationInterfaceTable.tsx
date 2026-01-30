'use client'

import React, { useMemo, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { ApplicationInterface } from './types'
import { ApplicationInterfaceFormValues } from './ApplicationInterfaceForm'
import ApplicationInterfaceForm from './ApplicationInterfaceForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { Chip } from '@mui/material'
import { getProtocolLabel } from './utils'
import { DataObject, Application, Person } from '@/gql/generated'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for ApplicationInterface
export const APPLICATION_INTERFACE_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  interfaceType: true,
  protocol: true,
  owners: true,
  sourceApplications: true,
  targetApplications: true,
  // Standardmäßig versteckte Spalten
  id: false,
  description: false,
  dataObjects: false,
  version: false,
  status: false,
  planningDate: false,
  introductionDate: false,
  endOfUseDate: false,
  endOfLifeDate: false,
  predecessors: false,
  successors: false,
  partOfArchitectures: false,
  depictedInDiagrams: false,
  createdAt: false,
  updatedAt: false,
}

interface ApplicationInterfaceTableProps {
  id?: string
  applicationInterfaces: ApplicationInterface[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateApplicationInterface?: (data: ApplicationInterfaceFormValues) => Promise<void>
  onUpdateApplicationInterface?: (id: string, data: ApplicationInterfaceFormValues) => Promise<void>
  onDeleteApplicationInterface?: (id: string) => Promise<void>
  dataObjects?: DataObject[]
  applications?: Application[]
  persons?: Person[]
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ApplicationInterfaceTable: React.FC<ApplicationInterfaceTableProps> = ({
  applicationInterfaces,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateApplicationInterface,
  onUpdateApplicationInterface,
  onDeleteApplicationInterface,
  dataObjects = [],
  applications = [],
  persons = [],
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('interfaces.table')
  const tTypes = useTranslations('interfaces.interfaceTypes')
  const tStatuses = useTranslations('interfaces.statuses')
  const locale = useLocale()
  const columnHelper = createColumnHelper<ApplicationInterface>()

  // Hilfsfunktion zur internationalisierten Datumsformatierung
  const formatDate = useCallback(
    (date: string) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },
    [locale]
  )

  // Helper function for interface type labels
  const getInterfaceTypeLabel = useCallback(
    (type: any) => {
      switch (type) {
        case 'API':
          return tTypes('API')
        case 'DATABASE':
          return tTypes('DATABASE')
        case 'FILE':
          return tTypes('FILE')
        case 'MESSAGE_QUEUE':
          return tTypes('MESSAGE_QUEUE')
        case 'OTHER':
          return tTypes('OTHER')
        default:
          return type
      }
    },
    [tTypes]
  )

  // Helper function for status labels
  const getInterfaceStatusLabel = useCallback(
    (status: any) => {
      switch (status) {
        case 'ACTIVE':
          return tStatuses('ACTIVE')
        case 'IN_DEVELOPMENT':
          return tStatuses('IN_DEVELOPMENT')
        case 'PLANNED':
          return tStatuses('PLANNED')
        case 'DEPRECATED':
          return tStatuses('DEPRECATED')
        case 'OUT_OF_SERVICE':
          return tStatuses('OUT_OF_SERVICE')
        default:
          return status
      }
    },
    [tStatuses]
  )

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility is needed for future reset functionality
  } = usePersistentColumnVisibility({
    tableKey: 'interfaces', // Fixed: now matches ApplicationInterfaceToolbar
    defaultColumnVisibility: APPLICATION_INTERFACE_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for the interfaces table
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: t('id'),
        cell: info => info.getValue(),
        enableHiding: true,
      }),
      columnHelper.accessor('name', {
        header: t('name'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: t('description'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('interfaceType', {
        header: t('interfaceType'),
        cell: info => {
          const type = info.getValue()
          return (
            <Chip
              label={getInterfaceTypeLabel(type)}
              color={type === 'API' ? 'primary' : 'default'}
              size="small"
              variant="filled"
            />
          )
        },
      }),
      columnHelper.accessor('protocol', {
        header: t('protocol'),
        cell: info => {
          const protocol = info.getValue()
          return (
            <Chip
              label={getProtocolLabel(protocol)}
              color={protocol ? 'secondary' : 'default'}
              size="small"
              variant="filled"
            />
          )
        },
      }),
      columnHelper.accessor('owners', {
        header: t('owners'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0
            ? owners.map((person: any) => `${person.firstName} ${person.lastName}`).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('sourceApplications', {
        header: t('sourceApplications'),
        cell: info => {
          const sourceApps = info.getValue()
          return sourceApps && sourceApps.length > 0
            ? sourceApps.map((app: any) => app.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('targetApplications', {
        header: t('targetApplications'),
        cell: info => {
          const targetApps = info.getValue()
          return targetApps && targetApps.length > 0
            ? targetApps.map((app: any) => app.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('dataObjects', {
        header: t('dataObjects'),
        cell: info => {
          const dataObjects = info.getValue()
          return dataObjects && dataObjects.length > 0
            ? dataObjects.map(obj => obj.name).join(', ')
            : '-'
        },
      }),
      // Weitere versteckte Spalten
      columnHelper.accessor('version', {
        header: t('version'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('status', {
        header: t('status'),
        cell: info => {
          const status = info.getValue()
          return (
            <Chip
              label={getInterfaceStatusLabel(status)}
              color={status === 'ACTIVE' ? 'success' : 'default'}
              size="small"
              variant="filled"
            />
          )
        },
        enableHiding: true,
      }),
      columnHelper.accessor('planningDate', {
        header: t('planningDate'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: t('introductionDate'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('endOfUseDate', {
        header: t('endOfUseDate'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('endOfLifeDate', {
        header: t('endOfLifeDate'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('predecessors', {
        header: t('predecessors'),
        cell: info => {
          const predecessors = info.getValue()
          return predecessors && predecessors.length > 0
            ? predecessors.map((pred: any) => pred.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('successors', {
        header: t('successors'),
        cell: info => {
          const successors = info.getValue()
          return successors && successors.length > 0
            ? successors.map((succ: any) => succ.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: t('partOfArchitectures'),
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map((arch: any) => arch.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: t('depictedInDiagrams'),
        cell: info => {
          const diagrams = info.getValue()
          return diagrams && diagrams.length > 0
            ? diagrams.map((diagram: any) => diagram.title).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      // Versteckte Zeitstempel-Spalten am Ende
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
    ],
    [columnHelper, t, getInterfaceTypeLabel, getInterfaceStatusLabel, formatDate]
  )

  // Mapping from ApplicationInterface to expected FormValues for the form
  const mapToFormValues = (
    applicationInterface: ApplicationInterface
  ): ApplicationInterfaceFormValues => {
    return {
      name: applicationInterface.name ?? '',
      description: applicationInterface.description ?? '',
      interfaceType: applicationInterface.interfaceType,
      protocol: applicationInterface.protocol ?? null,
      version: applicationInterface.version ?? null,
      status: applicationInterface.status,
      introductionDate: applicationInterface.introductionDate ?? null,
      endOfLifeDate: applicationInterface.endOfLifeDate ?? null,
      owners:
        applicationInterface.owners && applicationInterface.owners.length > 0
          ? applicationInterface.owners[0].id
          : null,
      sourceApplications: applicationInterface.sourceApplications?.map((app: any) => app.id) || [],
      targetApplications: applicationInterface.targetApplications?.map((app: any) => app.id) || [],
      dataObjects: applicationInterface.dataObjects?.map(obj => obj.id) ?? [],
    }
  }

  return (
    <GenericTable<ApplicationInterface, ApplicationInterfaceFormValues>
      data={applicationInterfaces}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateApplicationInterface}
      onUpdate={onUpdateApplicationInterface}
      onDelete={onDeleteApplicationInterface}
      emptyMessage="Keine Schnittstellen gefunden."
      createButtonLabel="Create new interface"
      entityName="Schnittstelle"
      FormComponent={ApplicationInterfaceForm}
      getIdFromData={(item: ApplicationInterface) => item.id}
      mapDataToFormValues={mapToFormValues}
      onTableReady={handleTableReady}
      additionalProps={{
        dataObjects,
        applications,
        persons,
      }}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default ApplicationInterfaceTable
