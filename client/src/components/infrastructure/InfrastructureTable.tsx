'use client'

import React, { useMemo, useCallback } from 'react'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import InfrastructureForm, { InfrastructureFormValues } from './InfrastructureForm'
import { formatDate } from './utils'
import { Infrastructure, InfrastructureType, InfrastructureStatus } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

interface InfrastructureTableProps {
  id?: string
  infrastructures: Infrastructure[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateInfrastructure?: (data: InfrastructureFormValues) => Promise<void>
  onUpdateInfrastructure?: (id: string, data: InfrastructureFormValues) => Promise<void>
  onDeleteInfrastructure?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const InfrastructureTable: React.FC<InfrastructureTableProps> = ({
  infrastructures,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateInfrastructure,
  onUpdateInfrastructure,
  onDeleteInfrastructure,
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const columnHelper = createColumnHelper<Infrastructure>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'infrastructures',
    defaultColumnVisibility: {
      description: false,
      vendor: false,
      version: false,
      capacity: false,
      ipAddress: false,
      operatingSystem: false,
      specifications: false,
      maintenanceWindow: false,
      costs: false,
      planningDate: false,
      introductionDate: false,
      endOfUseDate: false,
      endOfLifeDate: false,
      parentInfrastructure: false,
      childInfrastructures: false,
      hostsApplications: false,
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

  // Hilfsfunktion für die Anzeige des Infrastruktur-Typs mit farblichem Chip
  const getTypeChip = useCallback((type: InfrastructureType) => {
    let color
    let label

    switch (type) {
      case InfrastructureType.CLOUD_DATACENTER:
        color = 'primary'
        label = 'Cloud Datacenter'
        break
      case InfrastructureType.ON_PREMISE_DATACENTER:
        color = 'secondary'
        label = 'On-Premise Datacenter'
        break
      case InfrastructureType.KUBERNETES_CLUSTER:
        color = 'info'
        label = 'Kubernetes Cluster'
        break
      case InfrastructureType.VIRTUAL_MACHINE:
        color = 'success'
        label = 'Virtual Machine'
        break
      case InfrastructureType.CONTAINER_HOST:
        color = 'warning'
        label = 'Container Host'
        break
      case InfrastructureType.PHYSICAL_SERVER:
        color = 'error'
        label = 'Physical Server'
        break
      default:
        color = 'default'
        label = type
    }

    return <Chip label={label} size="small" color={color as any} variant="filled" />
  }, [])

  // Hilfsfunktion für die Anzeige des Status mit farblichem Chip
  const getStatusChip = useCallback((status: InfrastructureStatus) => {
    let color
    let label

    switch (status) {
      case InfrastructureStatus.ACTIVE:
        color = 'success'
        label = 'Aktiv'
        break
      case InfrastructureStatus.INACTIVE:
        color = 'default'
        label = 'Inaktiv'
        break
      case InfrastructureStatus.MAINTENANCE:
        color = 'warning'
        label = 'Wartung'
        break
      case InfrastructureStatus.PLANNED:
        color = 'info'
        label = 'Geplant'
        break
      case InfrastructureStatus.DECOMMISSIONED:
        color = 'error'
        label = 'Außer Betrieb'
        break
      case InfrastructureStatus.UNDER_CONSTRUCTION:
        color = 'secondary'
        label = 'In Bau'
        break
      default:
        color = 'default'
        label = status
    }

    return <Chip label={label} size="small" color={color as any} variant="filled" />
  }, [])

  // Spalten-Definition für die Infrastructure-Tabelle
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
      columnHelper.accessor('infrastructureType', {
        header: 'Typ',
        cell: info => getTypeChip(info.getValue()),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => getStatusChip(info.getValue()),
      }),
      columnHelper.accessor('location', {
        header: 'Standort',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('vendor', {
        header: 'Anbieter',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('version', {
        header: 'Version',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('capacity', {
        header: 'Kapazität',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('ipAddress', {
        header: 'IP-Adresse',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('operatingSystem', {
        header: 'Betriebssystem',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('specifications', {
        header: 'Spezifikationen',
        cell: info => {
          const value = info.getValue()
          return value && value.length > 30 ? `${value.substring(0, 30)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('maintenanceWindow', {
        header: 'Wartungsfenster',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('costs', {
        header: 'Kosten',
        cell: info => {
          const value = info.getValue()
          return value ? `${value.toLocaleString('de-DE')} €` : '-'
        },
        enableHiding: true,
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
      columnHelper.accessor('parentInfrastructure', {
        header: 'Übergeordnete Infrastruktur',
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0
            ? parents.map((parent: any) => parent.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('childInfrastructures', {
        header: 'Untergeordnete Infrastrukturen',
        cell: info => {
          const children = info.getValue()
          return children && children.length > 0
            ? children.map((child: any) => child.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('hostsApplications', {
        header: 'Gehostete Applikationen',
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
    [columnHelper, getTypeChip, getStatusChip]
  )

  return (
    <GenericTable<Infrastructure, InfrastructureFormValues>
      data={infrastructures}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateInfrastructure}
      onUpdate={onUpdateInfrastructure}
      onDelete={onDeleteInfrastructure}
      emptyMessage="Keine Infrastrukturen gefunden."
      createButtonLabel="Neue Infrastruktur erstellen"
      entityName="Infrastruktur"
      FormComponent={InfrastructureForm}
      getIdFromData={(item: Infrastructure) => item.id}
      // mapDataToFormValues entfernt - die InfrastructureForm arbeitet direkt mit der infrastructure Prop
      onTableReady={handleTableReady}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default InfrastructureTable
