'use client'

import React, { useMemo } from 'react'
import { GenericTable } from '../common/GenericTable'
import { ApplicationInterface } from './types'
import { ApplicationInterfaceFormValues } from './ApplicationInterfaceForm'
import ApplicationInterfaceForm from './ApplicationInterfaceForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { Chip } from '@mui/material'
import { getInterfaceTypeLabel, getProtocolLabel, formatDate } from './utils'
import { DataObject, Application, Person } from '@/gql/generated'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

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
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
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
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const columnHelper = createColumnHelper<ApplicationInterface>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'applicationInterfaces',
    defaultColumnVisibility: {
      description: false,
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
    },
  })

  // Kombiniere externe und persistente onTableReady Callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Spalten-Definition für die Schnittstellen-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('interfaceType', {
        header: 'Schnittstellentyp',
        cell: info => {
          const type = info.getValue()
          return (
            <Chip
              label={getInterfaceTypeLabel(type)}
              color={type === 'API' ? 'primary' : 'default'}
              size="small"
              variant="outlined"
            />
          )
        },
      }),
      columnHelper.accessor('protocol', {
        header: 'Protokoll',
        cell: info => {
          const protocol = info.getValue()
          return (
            <Chip
              label={getProtocolLabel(protocol)}
              color={protocol ? 'secondary' : 'default'}
              size="small"
              variant="outlined"
            />
          )
        },
      }),
      columnHelper.accessor('responsiblePerson', {
        header: 'Verantwortlicher',
        cell: info => {
          const responsiblePersons = info.getValue()
          return responsiblePersons && responsiblePersons.length > 0
            ? responsiblePersons
                .map((person: any) => `${person.firstName} ${person.lastName}`)
                .join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('sourceApplications', {
        header: 'Quellanwendungen',
        cell: info => {
          const sourceApps = info.getValue()
          return sourceApps && sourceApps.length > 0
            ? sourceApps.map((app: any) => app.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('targetApplications', {
        header: 'Zielanwendungen',
        cell: info => {
          const targetApps = info.getValue()
          return targetApps && targetApps.length > 0
            ? targetApps.map((app: any) => app.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('dataObjects', {
        header: 'Datenobjekte',
        cell: info => {
          const dataObjects = info.getValue()
          return dataObjects && dataObjects.length > 0
            ? dataObjects.map(obj => obj.name).join(', ')
            : '-'
        },
      }),
      // Weitere versteckte Spalten
      columnHelper.accessor('version', {
        header: 'Version',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue()
          return (
            <Chip
              label={status}
              color={status === 'ACTIVE' ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
          )
        },
        enableHiding: true,
      }),
      columnHelper.accessor('planningDate', {
        header: 'Planungsdatum',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: 'Einführungsdatum',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfUseDate', {
        header: 'Ende der Nutzung',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfLifeDate', {
        header: 'Ende der Lebenszeit',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('predecessors', {
        header: 'Vorgänger',
        cell: info => {
          const predecessors = info.getValue()
          return predecessors && predecessors.length > 0
            ? predecessors.map((pred: any) => pred.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('successors', {
        header: 'Nachfolger',
        cell: info => {
          const successors = info.getValue()
          return successors && successors.length > 0
            ? successors.map((succ: any) => succ.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: 'Teil von Architekturen',
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map((arch: any) => arch.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: 'Dargestellt in Diagrammen',
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
        header: 'Erstellt am',
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert am',
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
    ],
    [columnHelper]
  )

  // Mapping von ApplicationInterface zu den erwarteten FormValues für das Formular
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
      responsiblePerson:
        applicationInterface.responsiblePerson && applicationInterface.responsiblePerson.length > 0
          ? applicationInterface.responsiblePerson[0].id
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
      createButtonLabel="Neue Schnittstelle erstellen"
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
