'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import StrategyForm, { StrategyFormValues } from './StrategyForm'
import { StrategyType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

export const STRATEGY_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  owners: true,
  partOfArchitectures: true,
  depictedInDiagrams: true,
  description: false,
  id: false,
  createdAt: false,
  updatedAt: false,
} as const

interface StrategyTableProps {
  id?: string
  strategies: StrategyType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateStrategy?: (data: StrategyFormValues) => Promise<void>
  onUpdateStrategy?: (id: string, data: StrategyFormValues) => Promise<void>
  onDeleteStrategy?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const StrategyTable: React.FC<StrategyTableProps> = ({
  strategies,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateStrategy,
  onUpdateStrategy,
  onDeleteStrategy,
  onTableReady,
}) => {
  const t = useTranslations('strategies.table')
  const tEntity = useTranslations('strategies')
  const locale = useLocale()
  const columnHelper = createColumnHelper<StrategyType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'strategies',
    defaultColumnVisibility: STRATEGY_DEFAULT_COLUMN_VISIBILITY,
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

  const mapToFormValues = (strategy: StrategyType): StrategyFormValues => ({
    name: strategy.name,
    description: strategy.description ?? '',
    ownerId: strategy.owners?.[0]?.id ?? '',
    partOfArchitectures: strategy.partOfArchitectures?.map(arch => arch.id) ?? [],
    depictedInDiagrams: strategy.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
  })

  return (
    <GenericTable<StrategyType, StrategyFormValues>
      data={strategies}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateStrategy}
      onUpdate={onUpdateStrategy}
      onDelete={onDeleteStrategy}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={StrategyForm}
      getIdFromData={(item: StrategyType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default StrategyTable
