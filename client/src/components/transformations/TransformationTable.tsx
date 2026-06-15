'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { createColumnHelper, SortingState, VisibilityState } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { TransformationPriority } from '../../gql/generated'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'
import { GenericTable } from '../common/GenericTable'
import TransformationForm from './TransformationForm'
import { TransformationFormValues, TransformationType } from './types'
import { formatPersonName, useFormatDate, usePriorityLabel, useStatusLabel } from './utils'

export const TRANSFORMATION_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  status: true,
  priority: true,
  owners: true,
  sourceArchitecture: true,
  targetDate: true,
  targetArchitectures: true,
  goals: true,
  id: false,
  description: false,
  tags: false,
  createdAt: false,
  updatedAt: false,
} as const

interface TransformationTableProps {
  transformations: TransformationType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onUpdateTransformation?: (id: string, data: TransformationFormValues) => Promise<void>
  onDeleteTransformation?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const TransformationTable: React.FC<TransformationTableProps> = ({
  transformations,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onUpdateTransformation,
  onDeleteTransformation,
  onTableReady,
}) => {
  const t = useTranslations('transformations')
  const tTable = useTranslations('transformations.table')
  const getStatusLabel = useStatusLabel()
  const getPriorityLabel = usePriorityLabel()
  const formatDate = useFormatDate()
  const columnHelper = createColumnHelper<TransformationType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'transformations',
    defaultColumnVisibility: TRANSFORMATION_DEFAULT_COLUMN_VISIBILITY,
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

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
        header: t('form.description'),
        cell: info => {
          const description = info.getValue()
          return description && description.length > 60
            ? `${description.substring(0, 60)}...`
            : description || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('status', {
        header: tTable('status'),
        cell: info => <Chip label={getStatusLabel(info.getValue())} color="primary" size="small" />,
      }),
      columnHelper.accessor('priority', {
        header: tTable('priority'),
        cell: info => {
          const priority = info.getValue()
          if (!priority) {
            return '-'
          }

          const color =
            priority === TransformationPriority.CRITICAL
              ? 'error'
              : priority === TransformationPriority.HIGH
                ? 'warning'
                : priority === TransformationPriority.MEDIUM
                  ? 'info'
                  : 'default'

          return <Chip label={getPriorityLabel(priority)} color={color} size="small" />
        },
      }),
      columnHelper.accessor('owners', {
        header: tTable('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? formatPersonName(owners[0]) : '-'
        },
      }),
      columnHelper.accessor('sourceArchitecture', {
        header: tTable('sourceArchitecture'),
        cell: info => info.getValue()?.[0]?.name ?? '-',
      }),
      columnHelper.accessor('targetDate', {
        header: tTable('targetDate'),
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('targetArchitectures', {
        header: tTable('targets'),
        cell: info => info.getValue()?.length ?? 0,
      }),
      columnHelper.accessor('goals', {
        header: tTable('goals'),
        cell: info => info.getValue()?.length ?? 0,
      }),
      columnHelper.accessor('tags', {
        header: t('form.tags'),
        cell: info => {
          const tags = info.getValue()
          return tags && tags.length > 0 ? tags.join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('createdAt', {
        header: t('table.createdAt'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('table.updatedAt'),
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
    ],
    [columnHelper, formatDate, getPriorityLabel, getStatusLabel, t, tTable]
  )

  return (
    <GenericTable<TransformationType, TransformationFormValues>
      data={transformations}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onUpdate={onUpdateTransformation}
      onDelete={onDeleteTransformation}
      emptyMessage={t('noTransformationsFound')}
      createButtonLabel={t('addNew')}
      entityName={t('entityName')}
      FormComponent={TransformationForm}
      getIdFromData={(item: TransformationType) => item.id}
      onTableReady={handleTableReady}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default TransformationTable
