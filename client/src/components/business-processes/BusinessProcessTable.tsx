'use client'

import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createColumnHelper, SortingState, VisibilityState } from '@tanstack/react-table'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'
import BusinessProcessForm from './BusinessProcessForm'
import { BusinessProcessFormValues, BusinessProcessType } from './types'
import { formatDate } from './utils'

export const BUSINESS_PROCESS_DEFAULT_COLUMN_VISIBILITY = {
  name: true,
  status: true,
  processType: true,
  maturityLevel: true,
  category: true,
  owners: true,
  supportsCapabilities: true,
  parentProcess: true,
  tags: false,
  createdAt: false,
  updatedAt: false,
  id: false,
} as const

interface BusinessProcessTableProps {
  businessProcesses: BusinessProcessType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateBusinessProcess?: (data: BusinessProcessFormValues) => Promise<void>
  onUpdateBusinessProcess?: (id: string, data: BusinessProcessFormValues) => Promise<void>
  onDeleteBusinessProcess?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const BusinessProcessTable: React.FC<BusinessProcessTableProps> = ({
  businessProcesses,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateBusinessProcess,
  onUpdateBusinessProcess,
  onDeleteBusinessProcess,
  onTableReady,
}) => {
  const t = useTranslations('businessProcesses.table')
  const tEntity = useTranslations('businessProcesses')
  const tStatuses = useTranslations('businessProcesses.statuses')
  const tTypes = useTranslations('businessProcesses.processTypes')
  const locale = useLocale()
  const columnHelper = createColumnHelper<BusinessProcessType>()

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'business-processes',
    defaultColumnVisibility: BUSINESS_PROCESS_DEFAULT_COLUMN_VISIBILITY,
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
          return value && value.length > 80 ? `${value.substring(0, 80)}...` : value || '-'
        },
      }),
      columnHelper.accessor('status', {
        header: t('status'),
        cell: info => <Chip size="small" label={tStatuses(info.getValue())} />,
      }),
      columnHelper.accessor('processType', {
        header: t('processType'),
        cell: info => tTypes(info.getValue()),
      }),
      columnHelper.accessor('maturityLevel', {
        header: t('maturityLevel'),
        cell: info => info.getValue() ?? '-',
      }),
      columnHelper.accessor('category', {
        header: t('category'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('owners', {
        header: t('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('supportsCapabilities', {
        header: t('supportsCapabilities'),
        cell: info => {
          const capabilities = info.getValue()
          return capabilities && capabilities.length > 0
            ? capabilities
                .slice(0, 3)
                .map(capability => capability.name)
                .join(', ') + (capabilities.length > 3 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('parentProcess', {
        header: t('parentProcess'),
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0 ? parents[0].name : '-'
        },
      }),
      columnHelper.accessor('tags', {
        header: t('tags'),
        cell: info => {
          const tags = info.getValue()
          return tags && tags.length > 0 ? tags.join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => (info.getValue() ? formatDate(info.getValue(), locale) : '-'),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => (info.getValue() ? formatDate(info.getValue(), locale) : '-'),
        enableHiding: true,
      }),
    ],
    [columnHelper, t, tStatuses, tTypes, locale]
  )

  const mapDataToFormValues = (
    businessProcess: BusinessProcessType
  ): BusinessProcessFormValues => ({
    name: businessProcess.name,
    description: businessProcess.description || '',
    processType: businessProcess.processType,
    status: businessProcess.status,
    maturityLevel: businessProcess.maturityLevel || null,
    category: businessProcess.category || '',
    tags: businessProcess.tags || [],
    ownerId: businessProcess.owners?.[0]?.id || '',
    parentProcessId: businessProcess.parentProcess?.[0]?.id || '',
    supportsCapabilityIds:
      businessProcess.supportsCapabilities?.map(capability => capability.id) || [],
    partOfArchitectures:
      businessProcess.partOfArchitectures?.map(architecture => architecture.id) || [],
    depictedInDiagrams: businessProcess.depictedInDiagrams?.map(diagram => diagram.id) || [],
  })

  return (
    <GenericTable<BusinessProcessType, BusinessProcessFormValues>
      data={businessProcesses}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateBusinessProcess}
      onUpdate={onUpdateBusinessProcess}
      onDelete={onDeleteBusinessProcess}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={BusinessProcessForm}
      getIdFromData={(item: BusinessProcessType) => item.id}
      mapDataToFormValues={mapDataToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default BusinessProcessTable
