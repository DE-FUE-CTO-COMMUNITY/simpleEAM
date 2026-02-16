'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import VisionForm, { VisionFormValues } from './VisionForm'
import { VisionType } from './types'
import { formatDate, formatYear } from './utils'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

export const VISION_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  year: true,
  owners: true,
  supportsMissions: false,
  supportedByValues: false,
  supportedByGoals: false,
  partOfArchitectures: true,
  depictedInDiagrams: true,
  visionStatement: false,
  timeHorizon: false,
  id: false,
  createdAt: false,
  updatedAt: false,
} as const

interface VisionTableProps {
  id?: string
  visions: VisionType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateVision?: (data: VisionFormValues) => Promise<void>
  onUpdateVision?: (id: string, data: VisionFormValues) => Promise<void>
  onDeleteVision?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const VisionTable: React.FC<VisionTableProps> = ({
  visions,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateVision,
  onUpdateVision,
  onDeleteVision,
  onTableReady,
}) => {
  const t = useTranslations('visions.table')
  const tEntity = useTranslations('visions')
  const locale = useLocale()
  const columnHelper = createColumnHelper<VisionType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'visions',
    defaultColumnVisibility: VISION_DEFAULT_COLUMN_VISIBILITY,
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
      columnHelper.accessor('visionStatement', {
        header: t('visionStatement'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('timeHorizon', {
        header: t('timeHorizon'),
        cell: info => info.getValue() || '-',
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

  const mapToFormValues = (vision: VisionType): VisionFormValues => ({
    name: vision.name,
    visionStatement: vision.visionStatement ?? '',
    timeHorizon: vision.timeHorizon ?? '',
    year: vision.year ? new Date(vision.year) : new Date(),
    ownerId: vision.owners?.[0]?.id ?? '',
    supportsMissionsRelations:
      vision.supportsMissionsConnection?.edges?.map(edge => ({
        missionId: edge?.node?.id ?? '',
        score: edge?.properties?.score ?? 0,
      })) ?? [],
    supportedByValuesRelations:
      vision.supportedByValuesConnection?.edges?.map(edge => ({
        valueId: edge?.node?.id ?? '',
        score: edge?.properties?.score ?? 0,
      })) ?? [],
    supportedByGoalsRelations:
      vision.supportedByGoalsConnection?.edges?.map(edge => ({
        goalId: edge?.node?.id ?? '',
        score: edge?.properties?.score ?? 0,
      })) ?? [],
    partOfArchitectures: vision.partOfArchitectures?.map(arch => arch.id) ?? [],
    depictedInDiagrams: vision.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
  })

  return (
    <GenericTable<VisionType, VisionFormValues>
      data={visions}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateVision}
      onUpdate={onUpdateVision}
      onDelete={onDeleteVision}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={VisionForm}
      getIdFromData={(item: VisionType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default VisionTable
