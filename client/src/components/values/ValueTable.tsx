'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import ValueForm, { ValueFormValues } from './ValueForm'
import { ValueType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

export const VALUE_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  owners: true,
  partOfArchitectures: true,
  depictedInDiagrams: true,
  description: false,
  id: false,
  createdAt: false,
  updatedAt: false,
} as const

interface ValueTableProps {
  id?: string
  values: ValueType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateValue?: (data: ValueFormValues) => Promise<void>
  onUpdateValue?: (id: string, data: ValueFormValues) => Promise<void>
  onDeleteValue?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ValueTable: React.FC<ValueTableProps> = ({
  values,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateValue,
  onUpdateValue,
  onDeleteValue,
  onTableReady,
}) => {
  const t = useTranslations('values.table')
  const tEntity = useTranslations('values')
  const locale = useLocale()
  const columnHelper = createColumnHelper<ValueType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'values',
    defaultColumnVisibility: VALUE_DEFAULT_COLUMN_VISIBILITY,
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
      columnHelper.accessor('owners', {
        header: t('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: t('partOfArchitectures'),
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map(arch => arch.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: t('depictedInDiagrams'),
        cell: info => {
          const diagrams = info.getValue()
          return diagrams && diagrams.length > 0
            ? diagrams.map(diagram => diagram.title).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
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
    [columnHelper, t, locale]
  )

  const mapToFormValues = (value: ValueType): ValueFormValues => ({
    name: value.name,
    description: value.description ?? '',
    ownerId: value.owners?.[0]?.id ?? '',
    partOfArchitectures: value.partOfArchitectures?.map(arch => arch.id) ?? [],
    depictedInDiagrams: value.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
  })

  return (
    <GenericTable<ValueType, ValueFormValues>
      data={values}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateValue}
      onUpdate={onUpdateValue}
      onDelete={onDeleteValue}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={ValueForm}
      getIdFromData={(item: ValueType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default ValueTable
