'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import MissionForm, { MissionFormValues } from './MissionForm'
import { MissionType } from './types'
import { formatDate, formatYear } from './utils'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

export const MISSION_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  year: true,
  owners: true,
  supportedByVisions: false,
  supportedByValues: false,
  supportedByGoals: false,
  partOfArchitectures: true,
  depictedInDiagrams: true,
  purposeStatement: false,
  keywords: false,
  id: false,
  createdAt: false,
  updatedAt: false,
} as const

interface MissionTableProps {
  id?: string
  missions: MissionType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateMission?: (data: MissionFormValues) => Promise<void>
  onUpdateMission?: (id: string, data: MissionFormValues) => Promise<void>
  onDeleteMission?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const MissionTable: React.FC<MissionTableProps> = ({
  missions,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateMission,
  onUpdateMission,
  onDeleteMission,
  onTableReady,
}) => {
  const t = useTranslations('missions.table')
  const tEntity = useTranslations('missions')
  const locale = useLocale()
  const columnHelper = createColumnHelper<MissionType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'missions',
    defaultColumnVisibility: MISSION_DEFAULT_COLUMN_VISIBILITY,
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
      columnHelper.accessor('purposeStatement', {
        header: t('purposeStatement'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('keywords', {
        header: t('keywords'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('year', {
        header: t('year'),
        cell: info => formatYear(info.getValue()),
      }),
      columnHelper.accessor('owners', {
        header: t('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('supportedByVisions', {
        header: t('supportedByVisions'),
        cell: info => {
          const visions = info.getValue()
          return visions && visions.length > 0 ? visions.map(vision => vision.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportedByValues', {
        header: t('supportedByValues'),
        cell: info => {
          const values = info.getValue()
          return values && values.length > 0 ? values.map(value => value.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportedByGoals', {
        header: t('supportedByGoals'),
        cell: info => {
          const goals = info.getValue()
          return goals && goals.length > 0 ? goals.map(goal => goal.name).join(', ') : '-'
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

  const mapToFormValues = (mission: MissionType): MissionFormValues => ({
    name: mission.name,
    purposeStatement: mission.purposeStatement ?? '',
    keywords: mission.keywords ?? [],
    year: mission.year ? new Date(mission.year) : new Date(),
    ownerId: mission.owners?.[0]?.id ?? '',
    supportedByVisions: mission.supportedByVisions?.map(vision => vision.id) ?? [],
    supportedByValues: mission.supportedByValues?.map(value => value.id) ?? [],
    supportedByGoals: mission.supportedByGoals?.map(goal => goal.id) ?? [],
    partOfArchitectures: mission.partOfArchitectures?.map(arch => arch.id) ?? [],
    depictedInDiagrams: mission.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
  })

  return (
    <GenericTable<MissionType, MissionFormValues>
      data={missions}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateMission}
      onUpdate={onUpdateMission}
      onDelete={onDeleteMission}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={MissionForm}
      getIdFromData={(item: MissionType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default MissionTable
