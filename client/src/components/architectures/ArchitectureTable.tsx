'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { ArchitectureType } from './types'
import {
  ArchitectureDomain,
  ArchitectureType as GeneratedArchitectureType,
} from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { formatDate, getDomainLabel, getTypeLabel } from './utils'
import ArchitectureForm, { ArchitectureFormValues } from './ArchitectureForm'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

interface ArchitectureTableProps {
  id?: string
  architectures: ArchitectureType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateArchitecture?: (data: ArchitectureFormValues) => Promise<void>
  onUpdateArchitecture?: (id: string, data: ArchitectureFormValues) => Promise<void>
  onDeleteArchitecture?: (id: string) => Promise<void>
  availableArchitectures?: ArchitectureType[]
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ArchitectureTable: React.FC<ArchitectureTableProps> = ({
  architectures,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateArchitecture,
  onUpdateArchitecture,
  onDeleteArchitecture,
  availableArchitectures = [],
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const columnHelper = createColumnHelper<ArchitectureType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'architectures',
    defaultColumnVisibility: {
      description: false, // Beschreibung standardmäßig ausblenden
    },
  })

  // Kombiniere externe und persistente onTableReady Callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Spalten-Definition für die Architecture-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: info => {
          const description = info.getValue()
          return description && description.length > 50
            ? `${description.substring(0, 50)}...`
            : description || '-'
        },
      }),
      columnHelper.accessor('domain', {
        header: 'Domäne',
        cell: info => (
          <Chip
            label={getDomainLabel(info.getValue() as ArchitectureDomain)}
            color="primary"
            size="small"
            variant="outlined"
          />
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Typ',
        cell: info => getTypeLabel(info.getValue() as GeneratedArchitectureType),
      }),
      columnHelper.accessor('timestamp', {
        header: 'Architekturdatum',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('containsApplications', {
        header: 'Applikationen',
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0
            ? apps
                .slice(0, 2)
                .map(app => app.name)
                .join(', ') + (apps.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('containsCapabilities', {
        header: 'Capabilities',
        cell: info => {
          const caps = info.getValue()
          return caps && caps.length > 0
            ? caps
                .slice(0, 2)
                .map(cap => cap.name)
                .join(', ') + (caps.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        cell: info => {
          const tags = info.getValue()
          return tags && tags.length > 0
            ? tags
                .slice(0, 3)
                .map(tag => <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
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

  // Mapping von ArchitectureType zu den erwarteten FormValues für das Formular
  const mapToFormValues = (arch: ArchitectureType) => {
    return {
      name: arch.name,
      description: arch.description ?? '',
      domain: arch.domain,
      type: arch.type,
      timestamp: arch.timestamp ? new Date(arch.timestamp) : new Date(1735689600000), // Fixed timestamp for SSR consistency
      tags: arch.tags ?? [],
      ownerId: arch.owners && arch.owners.length > 0 ? arch.owners[0].id : undefined,
      containsApplicationIds: arch.containsApplications?.map(app => app.id) ?? [],
      containsCapabilityIds: arch.containsCapabilities?.map(cap => cap.id) ?? [],
      containsDataObjectIds: arch.containsDataObjects?.map(obj => obj.id) ?? [],
      diagramIds: arch.diagrams?.map(diagram => diagram.id) ?? [],
      parentArchitectureId:
        arch.parentArchitecture && arch.parentArchitecture.length > 0
          ? arch.parentArchitecture[0].id
          : undefined,
    }
  }

  return (
    <GenericTable<ArchitectureType, ArchitectureFormValues>
      data={architectures}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateArchitecture}
      onUpdate={onUpdateArchitecture}
      onDelete={onDeleteArchitecture}
      emptyMessage="Keine Architekturen gefunden."
      createButtonLabel="Neue Architektur erstellen"
      entityName="Architektur"
      FormComponent={ArchitectureForm}
      getIdFromData={(item: ArchitectureType) => item.id}
      mapDataToFormValues={mapToFormValues}
      onTableReady={handleTableReady}
      additionalProps={{
        availableArchitectures,
      }}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default ArchitectureTable
