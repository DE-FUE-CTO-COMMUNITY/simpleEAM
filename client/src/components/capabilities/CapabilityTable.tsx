'use client'

import React, { useMemo } from 'react'
import { Chip, useTheme } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { formatDate, getLevelLabel } from './utils'
import { CapabilityStatus, CapabilityType, BusinessCapability } from '../../gql/generated'
import CapabilityForm, { CapabilityFormValues } from './CapabilityForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

interface CapabilityTableProps {
  id?: string
  capabilities: BusinessCapability[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateCapability?: (data: CapabilityFormValues) => Promise<void>
  onUpdateCapability?: (id: string, data: CapabilityFormValues) => Promise<void>
  onDeleteCapability?: (id: string) => Promise<void>
  availableTags?: string[]
  availableCapabilities?: BusinessCapability[]
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const CapabilityTable: React.FC<CapabilityTableProps> = ({
  capabilities,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateCapability,
  onUpdateCapability,
  onDeleteCapability,
  availableTags = [],
  availableCapabilities = [],
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const theme = useTheme()
  const columnHelper = createColumnHelper<BusinessCapability>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'capabilities',
    defaultColumnVisibility: {
      description: false,
      type: false,
      sequenceNumber: false,
      introductionDate: false,
      endDate: false,
      relatedDataObjects: false,
      parents: false,
      supportedByApplications: false,
      partOfArchitectures: false,
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

  // Spalten-Definition für die Capability-Tabelle
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
      columnHelper.accessor('maturityLevel', {
        header: 'Reifegrad',
        cell: info => {
          const level = info.getValue()
          return (
            <Chip
              label={getLevelLabel(level)}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.lighter,
                color: theme.palette.primary.dark,
              }}
            />
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue() as CapabilityStatus
          return status
        },
      }),
      columnHelper.accessor('businessValue', {
        header: 'Geschäftswert',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        cell: info => {
          const tags = info.getValue()
          return tags ? tags.join(', ') : '-'
        },
      }),
      columnHelper.accessor('parents', {
        header: 'Übergeordnete Capabilities',
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0
            ? parents.map((parent: BusinessCapability) => parent.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('children', {
        header: 'Untergeordnete Capabilities',
        cell: info => {
          const children = info.getValue()
          return children ? children.map((child: BusinessCapability) => child.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      // Versteckte Spalten für type und sequenceNumber
      columnHelper.accessor('type', {
        header: 'Typ',
        cell: info => {
          const type = info.getValue()
          return type || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('sequenceNumber', {
        header: 'Sequenz',
        cell: info => {
          const sequence = info.getValue()
          return sequence !== null && sequence !== undefined ? sequence.toString() : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: 'Einführungsdatum',
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endDate', {
        header: 'Enddatum',
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date) : '-'
        },
        enableHiding: true,
      }),
      // Weitere versteckte Spalten für Beziehungen
      columnHelper.accessor('relatedDataObjects', {
        header: 'Verwandte Datenobjekte',
        cell: info => {
          const relatedDataObjects = info.getValue()
          return relatedDataObjects && relatedDataObjects.length > 0
            ? relatedDataObjects.map((obj: any) => obj.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportedByApplications', {
        header: 'Unterstützende Applikationen',
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0 ? apps.map((app: any) => app.name).join(', ') : '-'
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
      // Versteckte Spalten für Zeitstempel am Ende
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
    [theme.palette.primary.lighter, theme.palette.primary.dark, columnHelper]
  )

  // Mapping von Capability zu den erwarteten FormValues für das Formular
  const mapToFormValues = (capability: BusinessCapability): CapabilityFormValues => {
    return {
      name: capability.name ?? '',
      description: capability.description ?? '',
      maturityLevel: capability.maturityLevel ?? 0,
      businessValue: capability.businessValue ?? 0,
      status: capability.status ?? CapabilityStatus.ACTIVE,
      type: capability.type ?? CapabilityType.OPERATIONAL,
      ownerId: capability.owners && capability.owners.length > 0 ? capability.owners[0].id : '',
      tags: capability.tags ?? [],
      parentId: capability.parents && capability.parents.length > 0 ? capability.parents[0].id : '',
      children: capability.children?.map((child: BusinessCapability) => child.id) ?? [],
      supportedByApplications: capability.supportedByApplications?.map((app: any) => app.id) ?? [],
      partOfArchitectures: capability.partOfArchitectures?.map((arch: any) => arch.id) ?? [],
      partOfDiagrams: [], // Vorläufig leerer Array
      sequenceNumber: capability.sequenceNumber ?? 0,
      introductionDate: capability.introductionDate
        ? new Date(capability.introductionDate)
        : undefined,
      endDate: capability.endDate ? new Date(capability.endDate) : undefined,
    }
  }

  return (
    <GenericTable<BusinessCapability, CapabilityFormValues>
      data={capabilities}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateCapability}
      onUpdate={onUpdateCapability}
      onDelete={onDeleteCapability}
      emptyMessage="Keine Business Capabilities gefunden."
      createButtonLabel="Neue Business Capability erstellen"
      entityName="Capability"
      FormComponent={CapabilityForm}
      getIdFromData={(item: BusinessCapability) => item.id}
      mapDataToFormValues={mapToFormValues}
      onTableReady={handleTableReady}
      additionalProps={{
        availableTags,
        availableCapabilities,
      }}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default CapabilityTable
