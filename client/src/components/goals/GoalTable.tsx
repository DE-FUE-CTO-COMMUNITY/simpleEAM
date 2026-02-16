'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import GoalForm, { GoalFormValues } from './GoalForm'
import { GoalType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

export const GOAL_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  owners: true,
  operationalizesVisions: false,
  supportsMissions: false,
  supportsValues: false,
  achievedByStrategies: false,
  partOfArchitectures: true,
  depictedInDiagrams: true,
  goalStatement: false,
  id: false,
  createdAt: false,
  updatedAt: false,
} as const

interface GoalTableProps {
  id?: string
  goals: GoalType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateGoal?: (data: GoalFormValues) => Promise<void>
  onUpdateGoal?: (id: string, data: GoalFormValues) => Promise<void>
  onDeleteGoal?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const GoalTable: React.FC<GoalTableProps> = ({
  goals,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  onTableReady,
}) => {
  const t = useTranslations('goals.table')
  const tEntity = useTranslations('goals')
  const locale = useLocale()
  const columnHelper = createColumnHelper<GoalType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'goals',
    defaultColumnVisibility: GOAL_DEFAULT_COLUMN_VISIBILITY,
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
      columnHelper.accessor('goalStatement', {
        header: t('goalStatement'),
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
      columnHelper.accessor('operationalizesVisions', {
        header: t('operationalizesVisions'),
        cell: info => {
          const visions = info.getValue()
          return visions && visions.length > 0 ? visions.map(vision => vision.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportsMissions', {
        header: t('supportsMissions'),
        cell: info => {
          const missions = info.getValue()
          return missions && missions.length > 0
            ? missions.map(mission => mission.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportsValues', {
        header: t('supportsValues'),
        cell: info => {
          const values = info.getValue()
          return values && values.length > 0 ? values.map(value => value.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('achievedByStrategies', {
        header: t('achievedByStrategies'),
        cell: info => {
          const strategies = info.getValue()
          return strategies && strategies.length > 0
            ? strategies.map(strategy => strategy.name).join(', ')
            : '-'
        },
        enableHiding: true,
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

  const mapToFormValues = (goal: GoalType): GoalFormValues => ({
    name: goal.name,
    goalStatement: goal.goalStatement ?? '',
    ownerId: goal.owners?.[0]?.id ?? '',
    operationalizesVisions: goal.operationalizesVisions?.map(vision => vision.id) ?? [],
    supportsMissions: goal.supportsMissions?.map(mission => mission.id) ?? [],
    supportsValues: goal.supportsValues?.map(value => value.id) ?? [],
    achievedByStrategies: goal.achievedByStrategies?.map(strategy => strategy.id) ?? [],
    partOfArchitectures: goal.partOfArchitectures?.map(arch => arch.id) ?? [],
    depictedInDiagrams: goal.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
  })

  return (
    <GenericTable<GoalType, GoalFormValues>
      data={goals}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateGoal}
      onUpdate={onUpdateGoal}
      onDelete={onDeleteGoal}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={GoalForm}
      getIdFromData={(item: GoalType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default GoalTable
