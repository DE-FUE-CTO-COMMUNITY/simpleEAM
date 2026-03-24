'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper, SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import SoftwareProductForm, { SoftwareProductFormValues } from './SoftwareProductForm'
import { SoftwareProductType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

export const SOFTWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  productFamily: true,
  lifecycleStatus: true,
  isActive: true,
  developedBy: false,
  providedBy: false,
  maintainedBy: false,
  versions: true,
  usedByApplications: false,
  usedByInfrastructure: false,
  createdAt: false,
  updatedAt: false,
} as const

interface SoftwareProductTableProps {
  softwareProducts: SoftwareProductType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateSoftwareProduct?: (data: SoftwareProductFormValues) => Promise<void>
  onUpdateSoftwareProduct?: (id: string, data: SoftwareProductFormValues) => Promise<void>
  onDeleteSoftwareProduct?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const SoftwareProductTable: React.FC<SoftwareProductTableProps> = ({
  softwareProducts,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateSoftwareProduct,
  onUpdateSoftwareProduct,
  onDeleteSoftwareProduct,
  onTableReady,
}) => {
  const t = useTranslations('softwareProducts.table')
  const tEntity = useTranslations('softwareProducts')
  const tLifecycle = useTranslations('softwareProducts.lifecycleStatuses')
  const locale = useLocale()
  const columnHelper = createColumnHelper<SoftwareProductType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'software-products',
    defaultColumnVisibility: SOFTWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY,
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
        header: t('name'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('productFamily', {
        header: t('productFamily'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('lifecycleStatus', {
        header: t('lifecycleStatus'),
        cell: info => {
          const value = info.getValue()
          return value ? tLifecycle(value) : '-'
        },
      }),
      columnHelper.accessor('isActive', {
        header: t('isActive'),
        cell: info => (info.getValue() ? t('active') : t('inactive')),
      }),
      columnHelper.accessor('developedBy', {
        header: t('developedBy'),
        cell: info =>
          info
            .getValue()
            ?.map(s => s.name)
            .join(', ') || '-',
      }),
      columnHelper.accessor('providedBy', {
        header: t('providedBy'),
        cell: info =>
          info
            .getValue()
            ?.map(s => s.name)
            .join(', ') || '-',
      }),
      columnHelper.accessor('maintainedBy', {
        header: t('maintainedBy'),
        cell: info =>
          info
            .getValue()
            ?.map(s => s.name)
            .join(', ') || '-',
      }),
      columnHelper.accessor('versions', {
        header: t('versions'),
        cell: info =>
          info
            .getValue()
            ?.map(v => v.versionString)
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

  const mapToFormValues = (item: SoftwareProductType): SoftwareProductFormValues => ({
    name: item.name,
    productFamily: item.productFamily ?? '',
    lifecycleStatus: item.lifecycleStatus ?? null,
    isActive: item.isActive ?? true,
    developedByIds: item.developedBy?.map(s => s.id) ?? [],
    providedByIds: item.providedBy?.map(s => s.id) ?? [],
    maintainedByIds: item.maintainedBy?.map(s => s.id) ?? [],
  })

  return (
    <GenericTable<SoftwareProductType, SoftwareProductFormValues>
      data={softwareProducts}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateSoftwareProduct}
      onUpdate={onUpdateSoftwareProduct}
      onDelete={onDeleteSoftwareProduct}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={SoftwareProductForm}
      getIdFromData={item => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default SoftwareProductTable
