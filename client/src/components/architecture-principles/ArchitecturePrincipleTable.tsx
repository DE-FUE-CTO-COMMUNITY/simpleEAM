'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { ArchitecturePrincipleType } from './types'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { formatDate, getCategoryLabel, getPriorityLabel, formatBoolean } from './utils'
import ArchitecturePrincipleForm, {
  ArchitecturePrincipleFormValues,
} from './ArchitecturePrincipleForm'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

interface ArchitecturePrincipleTableProps {
  id?: string
  principles: ArchitecturePrincipleType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreatePrinciple?: (data: ArchitecturePrincipleFormValues) => Promise<void>
  onUpdatePrinciple?: (id: string, data: ArchitecturePrincipleFormValues) => Promise<void>
  onDeletePrinciple?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ArchitecturePrincipleTable: React.FC<ArchitecturePrincipleTableProps> = ({
  principles,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreatePrinciple,
  onUpdatePrinciple,
  onDeletePrinciple,
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const columnHelper = createColumnHelper<ArchitecturePrincipleType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'architecture-principles',
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

  // Spalten-Definition für die ArchitecturePrinciple-Tabelle
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
      columnHelper.accessor('category', {
        header: 'Kategorie',
        cell: info => (
          <Chip
            label={getCategoryLabel(info.getValue() as PrincipleCategory)}
            color="primary"
            size="small"
            variant="filled"
          />
        ),
      }),
      columnHelper.accessor('priority', {
        header: 'Priorität',
        cell: info => {
          const priority = info.getValue() as PrinciplePriority
          const color =
            priority === PrinciplePriority.CRITICAL
              ? 'error'
              : priority === PrinciplePriority.HIGH
                ? 'warning'
                : priority === PrinciplePriority.MEDIUM
                  ? 'info'
                  : 'default'
          return (
            <Chip label={getPriorityLabel(priority)} color={color} size="small" variant="filled" />
          )
        },
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: info => {
          const isActive = info.getValue()
          return (
            <Chip
              label={formatBoolean(isActive)}
              color={isActive ? 'success' : 'default'}
              size="small"
              variant="filled"
            />
          )
        },
      }),
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('appliedInArchitectures', {
        header: 'Angewendete Architekturen',
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures
                .slice(0, 2)
                .map(arch => arch.name)
                .join(', ') + (architectures.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('implementedByApplications', {
        header: 'Implementierende Apps',
        cell: info => {
          const applications = info.getValue()
          return applications && applications.length > 0
            ? applications
                .slice(0, 2)
                .map(app => app.name)
                .join(', ') + (applications.length > 2 ? '...' : '')
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

  // Mapping von ArchitecturePrincipleType zu den erwarteten FormValues für das Formular
  const mapToFormValues = (principle: ArchitecturePrincipleType) => {
    return {
      name: principle.name,
      description: principle.description ?? '',
      category: principle.category,
      priority: principle.priority,
      rationale: principle.rationale ?? '',
      implications: principle.implications ?? '',
      tags: principle.tags ?? [],
      isActive: principle.isActive !== undefined ? principle.isActive : true,
      ownerId: principle.owners && principle.owners.length > 0 ? principle.owners[0].id : undefined,
      appliedInArchitectureIds: principle.appliedInArchitectures?.map(arch => arch.id) ?? [],
      implementedByApplicationIds: principle.implementedByApplications?.map(app => app.id) ?? [],
    }
  }

  return (
    <GenericTable<ArchitecturePrincipleType, ArchitecturePrincipleFormValues>
      data={principles}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreatePrinciple}
      onUpdate={onUpdatePrinciple}
      onDelete={onDeletePrinciple}
      emptyMessage="Keine Architektur-Prinzipien gefunden."
      createButtonLabel="Neues Architektur-Prinzip erstellen"
      entityName="Architektur-Prinzip"
      FormComponent={ArchitecturePrincipleForm}
      getIdFromData={(item: ArchitecturePrincipleType) => item.id}
      mapDataToFormValues={mapToFormValues}
      onTableReady={handleTableReady}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default ArchitecturePrincipleTable
