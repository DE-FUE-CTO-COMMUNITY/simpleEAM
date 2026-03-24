'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper, SortingState, VisibilityState } from '@tanstack/react-table'
import { GenericTable } from '../common/GenericTable'
import HardwareProductForm, { HardwareProductFormValues } from './HardwareProductForm'
import { HardwareProductType } from './types'
import { formatDate } from './utils'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

export const HARDWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  productFamily: true,
  lifecycleStatus: true,
  isActive: true,
  manufacturedBy: false,
  providedBy: false,
  maintainedBy: false,
  versions: true,
  usedByInfrastructure: false,
  createdAt: false,
  updatedAt: false,
} as const

interface HardwareProductTableProps {
  hardwareProducts: HardwareProductType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateHardwareProduct?: (data: HardwareProductFormValues) => Promise<void>
  onUpdateHardwareProduct?: (id: string, data: HardwareProductFormValues) => Promise<void>
  onDeleteHardwareProduct?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const HardwareProductTable: React.FC<HardwareProductTableProps> = ({
  hardwareProducts,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateHardwareProduct,
  onUpdateHardwareProduct,
  onDeleteHardwareProduct,
  onTableReady,
}) => {
  const t = useTranslations('hardwareProducts.table')
  const tEntity = useTranslations('hardwareProducts')
  const tLifecycle = useTranslations('hardwareProducts.lifecycleStatuses')
  const locale = useLocale()
  const columnHelper = createColumnHelper<HardwareProductType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'hardware-products',
    defaultColumnVisibility: HARDWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY,
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
      columnHelper.accessor(
        row => row.productFamily?.map(family => family.name).join(', ') || '-',
        {
          id: 'productFamily',
          header: t('productFamily'),
          cell: info => info.getValue(),
        }
      ),
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
      columnHelper.accessor('manufacturedBy', {
        header: t('manufacturedBy'),
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
            ?.map(v => v.name)
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

  const mapToFormValues = (item: HardwareProductType): HardwareProductFormValues => ({
    name: item.name,
    productFamilyId: item.productFamily?.[0]?.id ?? '',
    lifecycleStatus: item.lifecycleStatus ?? null,
    isActive: item.isActive ?? true,
    manufacturedByIds: item.manufacturedBy?.map(s => s.id) ?? [],
    providedByIds: item.providedBy?.map(s => s.id) ?? [],
    maintainedByIds: item.maintainedBy?.map(s => s.id) ?? [],
    versionIds: item.versions?.map(v => v.id) ?? [],
  })

  return (
    <GenericTable<HardwareProductType, HardwareProductFormValues>
      data={hardwareProducts}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateHardwareProduct}
      onUpdate={onUpdateHardwareProduct}
      onDelete={onDeleteHardwareProduct}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={HardwareProductForm}
      getIdFromData={item => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default HardwareProductTable
