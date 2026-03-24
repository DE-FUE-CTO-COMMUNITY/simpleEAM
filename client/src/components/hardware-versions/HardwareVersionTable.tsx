'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper, SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import HardwareVersionForm, { HardwareVersionFormValues } from './HardwareVersionForm'
import { HardwareVersionType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

export const HARDWARE_VERSION_DEFAULT_COLUMN_VISIBILITY = {
  versionModelString: true,
  normalizedVersionModel: true,
  releaseChannel: true,
  supportTier: true,
  hardwareProduct: true,
  lifecycleRecords: true,
  createdAt: false,
  updatedAt: false,
} as const

interface HardwareVersionTableProps {
  hardwareVersions: HardwareVersionType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateHardwareVersion?: (data: HardwareVersionFormValues) => Promise<void>
  onUpdateHardwareVersion?: (id: string, data: HardwareVersionFormValues) => Promise<void>
  onDeleteHardwareVersion?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const HardwareVersionTable: React.FC<HardwareVersionTableProps> = ({
  hardwareVersions,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateHardwareVersion,
  onUpdateHardwareVersion,
  onDeleteHardwareVersion,
  onTableReady,
}) => {
  const t = useTranslations('hardwareVersions.table')
  const tEntity = useTranslations('hardwareVersions')
  const tLifecycle = useTranslations('hardwareProducts.lifecycleStatuses')
  const locale = useLocale()
  const columnHelper = createColumnHelper<HardwareVersionType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'hardware-versions',
    defaultColumnVisibility: HARDWARE_VERSION_DEFAULT_COLUMN_VISIBILITY,
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('versionModelString', {
        header: t('versionModelString'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('normalizedVersionModel', {
        header: t('normalizedVersionModel'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('releaseChannel', {
        header: t('releaseChannel'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('supportTier', {
        header: t('supportTier'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('hardwareProduct', {
        header: t('hardwareProduct'),
        cell: info =>
          info
            .getValue()
            ?.map(product => product.name)
            .join(', ') || '-',
      }),
      columnHelper.accessor('lifecycleRecords', {
        header: t('lifecycleRecords'),
        cell: info =>
          info
            .getValue()
            ?.map(record => (record.lifecycleStatus ? tLifecycle(record.lifecycleStatus) : '-'))
            .join(', ') || '-',
      }),
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => (info.getValue() ? formatDate(info.getValue() as string, locale) : '-'),
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => (info.getValue() ? formatDate(info.getValue() as string, locale) : '-'),
      }),
    ],
    [columnHelper, locale, t, tLifecycle]
  )

  const mapToFormValues = (item: HardwareVersionType): HardwareVersionFormValues => ({
    versionModelString: item.versionModelString,
    normalizedVersionModel: item.normalizedVersionModel ?? '',
    releaseChannel: item.releaseChannel ?? '',
    supportTier: item.supportTier ?? '',
    hardwareProductId: item.hardwareProduct?.[0]?.id ?? '',
  })

  return (
    <GenericTable<HardwareVersionType, HardwareVersionFormValues>
      data={hardwareVersions}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateHardwareVersion}
      onUpdate={onUpdateHardwareVersion}
      onDelete={onDeleteHardwareVersion}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={HardwareVersionForm}
      getIdFromData={item => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default HardwareVersionTable
