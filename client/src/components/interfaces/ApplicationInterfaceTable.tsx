'use client'

import React, { useMemo } from 'react'
import { GenericTable } from '../common/GenericTable'
import { ApplicationInterface } from './types'
import { ApplicationInterfaceFormValues } from './ApplicationInterfaceForm'
import ApplicationInterfaceForm from './ApplicationInterfaceForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'
import { Chip } from '@mui/material'
import { getInterfaceTypeLabel, formatDate } from './utils'
import { DataObject, Application, Person } from '@/gql/generated'

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
}) => {
  const columnHelper = createColumnHelper<ApplicationInterface>()

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
      columnHelper.accessor('createdAt', {
        header: 'Erstellt am',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert am',
        cell: info => formatDate(info.getValue()),
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
      description: applicationInterface.description ?? null,
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
      additionalProps={{
        dataObjects,
        applications,
        persons,
      }}
    />
  )
}

export default ApplicationInterfaceTable
