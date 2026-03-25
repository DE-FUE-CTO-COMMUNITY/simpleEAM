'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper, SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import SoftwareVersionForm, { SoftwareVersionFormValues } from './SoftwareVersionForm'
import { SoftwareVersionType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

export const SOFTWARE_VERSION_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  version: true,
  releaseChannel: true,
  supportTier: true,
  isLts: true,
  softwareProduct: true,
  gaDate: true,
  mainstreamSupportEndDate: true,
  extendedSupportEndDate: true,
  lifecycleRecords: true,
  createdAt: false,
  updatedAt: false,
} as const

interface SoftwareVersionTableProps {
  softwareVersions: SoftwareVersionType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateSoftwareVersion?: (data: SoftwareVersionFormValues) => Promise<void>
  onUpdateSoftwareVersion?: (id: string, data: SoftwareVersionFormValues) => Promise<void>
  onDeleteSoftwareVersion?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const SoftwareVersionTable: React.FC<SoftwareVersionTableProps> = ({
  softwareVersions,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateSoftwareVersion,
  onUpdateSoftwareVersion,
  onDeleteSoftwareVersion,
  onTableReady,
}) => {
  const t = useTranslations('softwareVersions.table')
  const tEntity = useTranslations('softwareVersions')
  const tLifecycle = useTranslations('softwareProducts.lifecycleStatuses')
  const locale = useLocale()
  const columnHelper = createColumnHelper<SoftwareVersionType>()

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
    tableKey: 'software-versions',
    defaultColumnVisibility: SOFTWARE_VERSION_DEFAULT_COLUMN_VISIBILITY,
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
        header: t('versionString'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('version', {
        header: t('normalizedVersion'),
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
      columnHelper.accessor('isLts', {
        header: t('isLts'),
        cell: info => (info.getValue() ? t('yes') : t('no')),
      }),
      columnHelper.accessor('softwareProduct', {
        header: t('softwareProduct'),
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

  const mapToFormValues = (item: SoftwareVersionType): SoftwareVersionFormValues => ({
    lifecycleRecordId: item.lifecycleRecords?.[0]?.id ?? '',
    lifecycleStatus: item.lifecycleRecords?.[0]?.lifecycleStatus ?? null,
    eosDate: item.lifecycleRecords?.[0]?.eosDate ?? null,
    eolDate: item.lifecycleRecords?.[0]?.eolDate ?? null,
    name: item.name,
    version: item.version ?? '',
    releaseChannel: item.releaseChannel ?? '',
    supportTier: item.supportTier ?? '',
    isLts: item.isLts ?? false,
    softwareProductId: item.softwareProduct?.[0]?.id ?? '',
    usedByApplicationIds: item.usedByApplications?.map(application => application.id) ?? [],
    usedByInfrastructureIds:
      item.usedByInfrastructure?.map(infrastructure => infrastructure.id) ?? [],
  })

  return (
    <GenericTable<SoftwareVersionType, SoftwareVersionFormValues>
      data={softwareVersions}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateSoftwareVersion}
      onUpdate={onUpdateSoftwareVersion}
      onDelete={onDeleteSoftwareVersion}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={SoftwareVersionForm}
      getIdFromData={item => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default SoftwareVersionTable
