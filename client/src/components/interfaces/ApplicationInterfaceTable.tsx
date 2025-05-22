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
import { DataObject } from '@/gql/generated'

interface ApplicationInterfaceTableProps {
  id?: string
  applicationInterfaces: ApplicationInterface[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  onCreateApplicationInterface?: (data: ApplicationInterfaceFormValues) => Promise<void>
  onUpdateApplicationInterface?: (id: string, data: ApplicationInterfaceFormValues) => Promise<void>
  onDeleteApplicationInterface?: (id: string) => Promise<void>
  dataObjects?: DataObject[]
}

const ApplicationInterfaceTable: React.FC<ApplicationInterfaceTableProps> = ({
  applicationInterfaces,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onRowClick,
  onEditClick,
  onCreateApplicationInterface,
  onUpdateApplicationInterface,
  onDeleteApplicationInterface,
  dataObjects = [],
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
    // Für autocomplete-Felder müssen wir sicherstellen, dass die IDs als reine Strings übergeben werden
    const dataObjectIds = applicationInterface.dataObjects?.map(obj => obj.id) ?? []

    return {
      name: applicationInterface.name ?? '',
      description: applicationInterface.description ?? null,
      interfaceType: applicationInterface.interfaceType,
      dataObjects: dataObjectIds,
    }
  }

  return (
    <GenericTable
      data={applicationInterfaces}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onRowClick={onRowClick}
      onEditClick={onEditClick}
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
      }}
    />
  )
}

export default ApplicationInterfaceTable
