'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { ArchitecturePrincipleType } from './types'
import { PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { useCategoryLabel, usePriorityLabel, useFormatDate, useFormatBoolean } from './utils'
import ArchitecturePrincipleForm, {
  ArchitecturePrincipleFormValues,
} from './ArchitecturePrincipleForm'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for ArchitecturePrinciple
export const ARCHITECTURE_PRINCIPLE_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  category: true,
  priority: true,
  isActive: true,
  owners: true,
  // Standardmäßig versteckte Spalten
  id: false,
  description: false,
  appliedInArchitectures: false,
  implementedByApplications: false,
  tags: false,
  createdAt: false,
  updatedAt: false,
}

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
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ArchitecturePrincipleTable: React.FC<ArchitecturePrincipleTableProps> = ({
  // id: _id,
  principles,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreatePrinciple,
  onUpdatePrinciple,
  onDeletePrinciple,
  onTableReady,
}) => {
  const t = useTranslations('architecturePrinciples')
  const tTable = useTranslations('architecturePrinciples.table')
  const getCategoryLabel = useCategoryLabel()
  const getPriorityLabel = usePriorityLabel()
  const formatBooleanLabel = useFormatBoolean()
  const formatDate = useFormatDate()

  // Column helper for type safety
  const columnHelper = createColumnHelper<ArchitecturePrincipleType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility is needed for future reset functionality
  } = usePersistentColumnVisibility({
    tableKey: 'architecture-principles',
    defaultColumnVisibility: ARCHITECTURE_PRINCIPLE_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for ArchitecturePrinciple-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
        enableHiding: true,
      }),
      columnHelper.accessor('name', {
        header: tTable('name'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: tTable('description'),
        cell: info => {
          const description = info.getValue()
          return description && description.length > 50
            ? `${description.substring(0, 50)}...`
            : description || '-'
        },
      }),
      columnHelper.accessor('category', {
        header: tTable('category'),
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
        header: tTable('priority'),
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
        header: tTable('status'),
        cell: info => {
          const isActive = info.getValue()
          return (
            <Chip
              label={formatBooleanLabel(isActive)}
              color={isActive ? 'success' : 'default'}
              size="small"
              variant="filled"
            />
          )
        },
      }),
      columnHelper.accessor('owners', {
        header: tTable('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('appliedInArchitectures', {
        header: tTable('appliedInArchitectures'),
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
        header: tTable('implementedByApplications'),
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
        header: tTable('createdAt'),
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: tTable('updatedAt'),
        cell: info => formatDate(info.getValue()),
      }),
    ],
    [columnHelper, tTable, getCategoryLabel, getPriorityLabel, formatDate, formatBooleanLabel]
  )

  // Mapping from ArchitecturePrincipleType to expected FormValues for form
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
      emptyMessage={t('noArchitecturePrinciplesFound')}
      createButtonLabel={t('addNew')}
      entityName={t('title')}
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
