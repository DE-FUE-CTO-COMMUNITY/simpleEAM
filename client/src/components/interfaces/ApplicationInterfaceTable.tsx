'use client'

import React, { useMemo } from 'react'
import { Chip, useTheme } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { ApplicationInterfaceData } from '../../types/applicationInterface'
import { formatDate, getInterfaceTypeLabel } from '../../types/applicationInterface'
import { InterfaceType } from '../../gql/generated'
import ApplicationInterfaceForm, {
  ApplicationInterfaceFormValues,
} from './ApplicationInterfaceForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'

interface ApplicationInterfaceTableProps {
  id?: string
  applicationInterfaces: ApplicationInterfaceData[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  onCreateApplicationInterface?: (data: ApplicationInterfaceFormValues) => Promise<void>
  onUpdateApplicationInterface?: (id: string, data: ApplicationInterfaceFormValues) => Promise<void>
  onDeleteApplicationInterface?: (id: string) => Promise<void>
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
}) => {
  const theme = useTheme()
  const columnHelper = createColumnHelper<ApplicationInterfaceData>()

  // Hilfsfunktion für die Anzeige des Schnittstellentyps mit farblichem Chip
  const getInterfaceTypeChip = (type: InterfaceType) => {
    let color
    let backgroundColor

    switch (type) {
      case InterfaceType.API:
        color = theme.palette.info.dark
        backgroundColor = theme.palette.info.lighter
        break
      case InterfaceType.FILE:
        color = theme.palette.secondary.dark
        backgroundColor = theme.palette.secondary.lighter
        break
      case InterfaceType.DATABASE:
        color = theme.palette.error.dark
        backgroundColor = theme.palette.error.lighter
        break
      case InterfaceType.MESSAGE_QUEUE:
        color = theme.palette.primary.dark
        backgroundColor = theme.palette.primary.lighter
        break
      case InterfaceType.OTHER:
        color = theme.palette.warning.dark
        backgroundColor = theme.palette.warning.lighter
        break
      default:
        color = theme.palette.grey[700]
        backgroundColor = theme.palette.grey[200]
    }

    return (
      <Chip
        label={getInterfaceTypeLabel(type)}
        size="small"
        sx={{
          backgroundColor,
          color,
        }}
      />
    )
  }

  // Spalten-Definition für die ApplicationInterface-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: info => {
          const value = info.getValue()
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
      }),
      columnHelper.accessor('interfaceType', {
        header: 'Typ',
        cell: info => getInterfaceTypeChip(info.getValue()),
      }),
      columnHelper.accessor('dataObjects', {
        header: 'Datenobjekte',
        cell: info => {
          const objs = info.getValue()
          return objs && objs.length > 0
            ? objs
                .slice(0, 2)
                .map(obj => obj.name)
                .join(', ') + (objs.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Erstellt',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert',
        cell: info => formatDate(info.getValue()),
      }),
    ],
    [columnHelper, getInterfaceTypeChip]
  )

  // Mapping von ApplicationInterface zu den erwarteten FormValues für das Formular
  const mapToFormValues = (iface: ApplicationInterfaceData): ApplicationInterfaceFormValues => {
    return {
      name: iface.name ?? '',
      description: iface.description ?? '',
      interfaceType: iface.interfaceType,
      dataObjectIds: iface.dataObjects?.map(obj => obj.id) ?? [],
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
      getIdFromData={(item: ApplicationInterfaceData) => item.id}
      mapDataToFormValues={mapToFormValues}
    />
  )
}

export default ApplicationInterfaceTable
