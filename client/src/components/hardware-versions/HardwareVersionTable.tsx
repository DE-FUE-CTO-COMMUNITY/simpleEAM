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
  name: true,
  version: true,
  releaseChannel: true,
  supportTier: true,
  hardwareProduct: true,
  gaDate: true,
  mainstreamSupportEndDate: true,
  extendedSupportEndDate: true,
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

  const getReleaseChannelLabel = (value?: string | null): string => {
    if (!value) {
      return '-'
    }

    const labels: Record<string, string> = {
      STABLE: tEntity('releaseChannels.STABLE'),
      LTS: tEntity('releaseChannels.LTS'),
      RC: tEntity('releaseChannels.RC'),
      BETA: tEntity('releaseChannels.BETA'),
      ALPHA: tEntity('releaseChannels.ALPHA'),
      PREVIEW: tEntity('releaseChannels.PREVIEW'),
    }

    return labels[value] ?? value
  }

  const getSupportTierLabel = (value?: string | null): string => {
    if (!value) {
      return '-'
    }

    const labels: Record<string, string> = {
      STANDARD: tEntity('supportTiers.STANDARD'),
      EXTENDED: tEntity('supportTiers.EXTENDED'),
      PREMIUM: tEntity('supportTiers.PREMIUM'),
      COMMUNITY: tEntity('supportTiers.COMMUNITY'),
      DEPRECATED: tEntity('supportTiers.DEPRECATED'),
      END_OF_SUPPORT: tEntity('supportTiers.END_OF_SUPPORT'),
    }

    return labels[value] ?? value
  }

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
      columnHelper.accessor('name', {
        header: t('versionModelString'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('version', {
        header: t('normalizedVersionModel'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('releaseChannel', {
        header: t('releaseChannel'),
        cell: info => getReleaseChannelLabel(info.getValue()),
      }),
      columnHelper.accessor('supportTier', {
        header: t('supportTier'),
        cell: info => getSupportTierLabel(info.getValue()),
      }),
      columnHelper.accessor('hardwareProduct', {
        header: t('hardwareProduct'),
        cell: info =>
          info
            .getValue()
            ?.map(product => product.name)
            .join(', ') || '-',
      }),
      columnHelper.accessor(row => row.lifecycleRecords?.[0]?.gaDate ?? null, {
        id: 'gaDate',
        header: t('gaDate'),
        cell: info => (info.getValue() ? formatDate(info.getValue() as string, locale) : '-'),
      }),
      columnHelper.accessor(row => row.lifecycleRecords?.[0]?.mainstreamSupportEndDate ?? null, {
        id: 'mainstreamSupportEndDate',
        header: t('mainstreamSupportEndDate'),
        cell: info => (info.getValue() ? formatDate(info.getValue() as string, locale) : '-'),
      }),
      columnHelper.accessor(row => row.lifecycleRecords?.[0]?.extendedSupportEndDate ?? null, {
        id: 'extendedSupportEndDate',
        header: t('extendedSupportEndDate'),
        cell: info => (info.getValue() ? formatDate(info.getValue() as string, locale) : '-'),
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
    [columnHelper, locale, t, tEntity, tLifecycle]
  )

  const mapToFormValues = (item: HardwareVersionType): HardwareVersionFormValues => ({
    lifecycleRecordId: item.lifecycleRecords?.[0]?.id ?? '',
    lifecycleStatus: item.lifecycleRecords?.[0]?.lifecycleStatus ?? null,
    eosDate: item.lifecycleRecords?.[0]?.eosDate ?? null,
    eolDate: item.lifecycleRecords?.[0]?.eolDate ?? null,
    name: item.name,
    version: item.version ?? '',
    releaseChannel: item.releaseChannel ?? '',
    supportTier: item.supportTier ?? '',
    hardwareProductId: item.hardwareProduct?.[0]?.id ?? '',
    usedByInfrastructureIds:
      item.usedByInfrastructure?.map(infrastructure => infrastructure.id) ?? [],
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
