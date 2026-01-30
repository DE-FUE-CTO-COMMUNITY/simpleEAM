'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { CompanyType, CompanyFormValues } from './types'
import { useFormatDate, useCompanySizeLabel, formatWebsiteUrl } from './utils'
import CompanyForm from './CompanyForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for the company table
export const COMPANY_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  description: true,
  industry: true,
  size: true,
  createdAt: true,

  // Standardmäßig versteckte Spalten
  id: false,
  address: false,
  website: false,
  updatedAt: false,
} as const

interface CompanyTableProps {
  id?: string
  companies: CompanyType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateCompany?: (data: CompanyFormValues) => Promise<void>
  onUpdateCompany?: (id: string, data: CompanyFormValues) => Promise<void>
  onDeleteCompany?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const CompanyTableWithGenericTable: React.FC<CompanyTableProps> = ({
  companies,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateCompany: _onCreateCompany,
  onUpdateCompany,
  onDeleteCompany,
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('companies.table')
  const tEntity = useTranslations('companies')
  const formatDate = useFormatDate()
  const formatSize = useCompanySizeLabel()
  const columnHelper = createColumnHelper<CompanyType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'companies',
    defaultColumnVisibility: COMPANY_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for the company table
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: t('headers.id'),
        cell: info => info.getValue(),
        enableHiding: true,
      }),
      columnHelper.accessor('name', {
        header: t('headers.name'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: t('headers.description'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
      }),
      columnHelper.accessor('address', {
        header: t('headers.address'),
        cell: info => {
          const value = info.getValue()
          return value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('industry', {
        header: t('headers.industry'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('website', {
        header: t('headers.website'),
        cell: info => {
          const value = info.getValue()
          if (!value) return '-'
          const url = formatWebsiteUrl(value)
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
              {value}
            </a>
          )
        },
        enableHiding: true,
      }),
      columnHelper.accessor('size', {
        header: t('headers.size'),
        cell: info => {
          const value = info.getValue()
          return formatSize(value)
        },
      }),
      columnHelper.accessor('createdAt', {
        header: t('headers.createdAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
      }),
      columnHelper.accessor('updatedAt', {
        header: t('headers.updatedAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
    ],
    [columnHelper, t, formatDate, formatSize]
  )

  // Mapping from CompanyType to expected FormValues for the form
  const mapToFormValues = (company: CompanyType): CompanyFormValues => {
    return {
      name: company.name,
      description: company.description ?? '',
      address: company.address ?? '',
      industry: company.industry ?? '',
      website: company.website ?? '',
      size: company.size ?? undefined,
      employees: (company.employees || [])
        .map(employee => employee?.id)
        .filter(Boolean) as string[],
      primaryColor: company.primaryColor ?? '',
      secondaryColor: company.secondaryColor ?? '',
      font: company.font ?? '',
      diagramFont:
        (company.diagramFont as CompanyFormValues['diagramFont']) ??
        ('Excalifont' as CompanyFormValues['diagramFont']),
      logo: company.logo ?? '',
    }
  }

  return (
    <GenericTable<CompanyType, CompanyFormValues>
      data={companies}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onUpdate={onUpdateCompany}
      onDelete={onDeleteCompany}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={CompanyForm}
      getIdFromData={(item: CompanyType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default CompanyTableWithGenericTable
