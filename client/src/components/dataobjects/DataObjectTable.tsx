'use client'

import React, { useMemo, useCallback } from 'react'
import { Chip } from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import DataObjectForm, { DataObjectFormValues } from './DataObjectForm'
import { formatDate } from './utils'
import { DataClassification, DataObject } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for DataObject
export const DATAOBJECT_DEFAULT_COLUMN_VISIBILITY = {
  // Columns visible by default
  name: true,
  classification: true,
  format: true,
  dataSources: true,
  owners: true,
  usedByApplications: true,
  relatedToCapabilities: true,
  transferredInInterfaces: true,
  relatedDataObjects: true,
  // Columns hidden by default
  id: false,
  description: false,
  planningDate: false,
  introductionDate: false,
  endOfUseDate: false,
  endOfLifeDate: false,
  partOfArchitectures: false,
  depictedInDiagrams: false,
  createdAt: false,
  updatedAt: false,
}

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
  // These props are now optional as persistence is handled internally
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
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('dataObjects.table')
  const tClassifications = useTranslations('dataObjects.classifications')
  const locale = useLocale()
  const columnHelper = createColumnHelper<DataObject>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility is needed for future reset functionality
  } = usePersistentColumnVisibility({
    tableKey: 'dataobjects', // Corrected: now matches DataObjectToolbar
    defaultColumnVisibility: DATAOBJECT_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Helper function for die Anzeige der Datenschutzklasse mit farblichem Chip
  const getClassificationChip = useCallback(
    (classification: DataClassification) => {
      let color
      let label

      switch (classification) {
        case DataClassification.PUBLIC:
          color = 'success'
          label = tClassifications('PUBLIC')
          break
        case DataClassification.INTERNAL:
          color = 'info'
          label = tClassifications('INTERNAL')
          break
        case DataClassification.CONFIDENTIAL:
          color = 'warning'
          label = tClassifications('CONFIDENTIAL')
          break
        case DataClassification.STRICTLY_CONFIDENTIAL:
          color = 'error'
          label = tClassifications('STRICTLY_CONFIDENTIAL')
          break
        default:
          color = 'default'
          label = classification
      }

      return <Chip label={label} size="small" color={color as any} variant="filled" />
    },
    [tClassifications]
  )

  // Column definition for DataObject table
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
        cell: info => {
          const value = info.getValue()
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('classification', {
        header: t('classification'),
        cell: info => getClassificationChip(info.getValue()),
      }),
      columnHelper.accessor('format', {
        header: t('format'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('dataSources', {
        header: t('dataSources'),
        cell: info => {
          const dataSources = info.getValue()
          if (!dataSources || dataSources.length === 0) return '-'
          if (dataSources.length === 1) return dataSources[0].name
          return `${dataSources[0].name} (+${dataSources.length - 1} weitere)`
        },
      }),
      columnHelper.accessor('owners', {
        header: t('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      // Weitere versteckte Spalten
      columnHelper.accessor('planningDate', {
        header: t('planningDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: t('introductionDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfUseDate', {
        header: t('endOfUseDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfLifeDate', {
        header: t('endOfLifeDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('usedByApplications', {
        header: t('usedByApplications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0 ? apps.map((app: any) => app.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('relatedToCapabilities', {
        header: t('relatedToCapabilities'),
        cell: info => {
          const capabilities = info.getValue()
          return capabilities && capabilities.length > 0
            ? capabilities.map((cap: any) => cap.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('transferredInInterfaces', {
        header: t('transferredInInterfaces'),
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map((iface: any) => iface.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('relatedDataObjects', {
        header: t('relatedDataObjects'),
        cell: info => {
          const dataObjs = info.getValue()
          return dataObjs && dataObjs.length > 0
            ? dataObjs.map((obj: any) => obj.name).join(', ')
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
        cell: info => formatDate(info.getValue(), locale),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
    ],
    [columnHelper, getClassificationChip, t, locale]
  )

  // Mapping function for converting DataObject to DataObjectFormValues
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
