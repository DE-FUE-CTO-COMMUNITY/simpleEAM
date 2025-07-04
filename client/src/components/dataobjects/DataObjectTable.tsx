'use client'

import React, { useMemo, useCallback } from 'react'
import { Chip, useTheme } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import DataObjectForm, { DataObjectFormValues } from './DataObjectForm'
import { formatDate } from './utils'
import { DataClassification, DataObject } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

interface DataObjectTableProps {
  id?: string
  dataObjects: DataObject[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateDataObject?: (data: DataObjectFormValues) => Promise<void>
  onUpdateDataObject?: (id: string, data: DataObjectFormValues) => Promise<void>
  onDeleteDataObject?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const DataObjectTable: React.FC<DataObjectTableProps> = ({
  dataObjects,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateDataObject,
  onUpdateDataObject,
  onDeleteDataObject,
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const theme = useTheme()
  const columnHelper = createColumnHelper<DataObject>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'dataObjects',
  })

  // Kombiniere externe und persistente onTableReady Callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Hilfsfunktion für die Anzeige der Datenschutzklasse mit farblichem Chip
  const getClassificationChip = useCallback((classification: DataClassification) => {
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
  }, [theme])

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
      columnHelper.accessor('dataSources', {
        header: 'Datenquellen',
        cell: info => {
          const dataSources = info.getValue()
          if (!dataSources || dataSources.length === 0) return '-'
          if (dataSources.length === 1) return dataSources[0].name
          return `${dataSources[0].name} (+${dataSources.length - 1} weitere)`
        },
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
    [columnHelper, getClassificationChip]
  )

  // Mapping-Funktion für die Umwandlung von DataObject zu DataObjectFormValues
  const mapDataObjectToFormValues = (dataObject: DataObject): DataObjectFormValues => {
    return {
      name: dataObject.name,
      description: dataObject.description || '',
      classification: dataObject.classification,
      format: dataObject.format || undefined,
      dataSources: dataObject.dataSources?.map(app => app.id) || [],
      introductionDate: dataObject.introductionDate || undefined,
      endOfLifeDate: dataObject.endOfLifeDate || undefined,
      ownerId:
        dataObject.owners && dataObject.owners.length > 0 ? dataObject.owners[0].id : undefined,
    }
  }

  return (
    <GenericTable<DataObject, DataObjectFormValues>
      data={dataObjects}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
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
      onTableReady={handleTableReady}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default DataObjectTable
