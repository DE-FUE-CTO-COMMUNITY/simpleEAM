'use client'

import React, { useMemo, useCallback } from 'react'
import { Chip } from '@mui/material'
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
  const columnHelper = createColumnHelper<DataObject>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'dataObjects',
    defaultColumnVisibility: {
      description: false,
      planningDate: false,
      introductionDate: false,
      endOfUseDate: false,
      endOfLifeDate: false,
      usedByApplications: false,
      relatedToCapabilities: false,
      transferredInInterfaces: false,
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

  // Hilfsfunktion für die Anzeige der Datenschutzklasse mit farblichem Chip
  const getClassificationChip = useCallback((classification: DataClassification) => {
    let color
    let label

    switch (classification) {
      case DataClassification.PUBLIC:
        color = 'success'
        label = 'Public'
        break
      case DataClassification.INTERNAL:
        color = 'info'
        label = 'Internal'
        break
      case DataClassification.CONFIDENTIAL:
        color = 'warning'
        label = 'Confidential'
        break
      case DataClassification.STRICTLY_CONFIDENTIAL:
        color = 'error'
        label = 'Strictly Confidential'
        break
      default:
        color = 'default'
        label = classification
    }

    return <Chip label={label} size="small" color={color as any} variant="filled" />
  }, [])

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
        enableHiding: true,
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
      // Weitere versteckte Spalten
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
      columnHelper.accessor('usedByApplications', {
        header: 'Genutzt von Anwendungen',
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0 ? apps.map((app: any) => app.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('relatedToCapabilities', {
        header: 'Verwandte Capabilities',
        cell: info => {
          const capabilities = info.getValue()
          return capabilities && capabilities.length > 0
            ? capabilities.map((cap: any) => cap.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('transferredInInterfaces', {
        header: 'Übertragen in Schnittstellen',
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map((iface: any) => iface.name).join(', ')
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
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
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
