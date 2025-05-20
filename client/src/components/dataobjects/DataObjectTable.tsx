'use client'

import React, { useMemo } from 'react'
import { Chip, useTheme } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import DataObjectForm, { DataObjectFormValues } from './DataObjectForm'
import { formatDate, getClassificationLabel } from './utils'
import { DataClassification, DataObject } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'

interface DataObjectTableProps {
  id?: string
  dataObjects: DataObject[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  onCreateDataObject?: (data: DataObjectFormValues) => Promise<void>
  onUpdateDataObject?: (id: string, data: DataObjectFormValues) => Promise<void>
  onDeleteDataObject?: (id: string) => Promise<void>
}

const DataObjectTable: React.FC<DataObjectTableProps> = ({
  dataObjects,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onRowClick,
  onEditClick,
  onCreateDataObject,
  onUpdateDataObject,
  onDeleteDataObject,
}) => {
  const theme = useTheme()
  const columnHelper = createColumnHelper<DataObject>()

  // Hilfsfunktion für die Anzeige der Datenschutzklasse mit farblichem Chip
  const getClassificationChip = (classification: DataClassification) => {
    let color
    let backgroundColor
    let label

    switch (classification) {
      case DataClassification.PUBLIC:
        color = theme.palette.success.dark
        backgroundColor = theme.palette.success.lighter
        label = 'Public'
        break
      case DataClassification.INTERNAL:
        color = theme.palette.info.dark
        backgroundColor = theme.palette.info.lighter
        label = 'Internal'
        break
      case DataClassification.CONFIDENTIAL:
        color = theme.palette.warning.dark
        backgroundColor = theme.palette.warning.lighter
        label = 'Confidential'
        break
      case DataClassification.STRICTLY_CONFIDENTIAL:
        color = theme.palette.error.dark
        backgroundColor = theme.palette.error.lighter
        label = 'Strictly Confidential'
        break
      default:
        color = theme.palette.grey[700]
        backgroundColor = theme.palette.grey[200]
        label = classification
    }

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          backgroundColor,
          color,
        }}
      />
    )
  }

  // Spalten-Definition für die DataObject-Tabelle
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
      columnHelper.accessor('classification', {
        header: 'Klassifikation',
        cell: info => getClassificationChip(info.getValue()),
      }),
      columnHelper.accessor('format', {
        header: 'Format',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('source', {
        header: 'Quelle',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Erstellt am',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert am',
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
      }),
    ],
    [theme, columnHelper, getClassificationChip]
  )

  // Mapping-Funktion für die Umwandlung von DataObject zu DataObjectFormValues
  const mapDataObjectToFormValues = (dataObject: DataObject): DataObjectFormValues => {
    return {
      name: dataObject.name,
      description: dataObject.description || undefined,
      classification: dataObject.classification,
      format: dataObject.format || undefined,
      source: dataObject.source || undefined,
      ownerId:
        dataObject.owners && dataObject.owners.length > 0 ? dataObject.owners[0].id : undefined,
    }
  }

  return (
    <GenericTable
      data={dataObjects}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onRowClick={onRowClick}
      onEditClick={onEditClick}
      columns={columns}
      onCreate={onCreateDataObject}
      onUpdate={onUpdateDataObject}
      onDelete={onDeleteDataObject}
      emptyMessage="Keine Datenobjekte gefunden."
      createButtonLabel="Neues Datenobjekt erstellen"
      entityName="Datenobjekt"
      FormComponent={DataObjectForm}
      getIdFromData={(item: DataObject) => item.id}
      mapDataToFormValues={mapDataObjectToFormValues}
    />
  )
}

export default DataObjectTable
