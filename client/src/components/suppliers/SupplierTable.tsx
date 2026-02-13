'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { useTranslations } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { SupplierType } from './types'
import { SupplierFormValues } from './types'
import { useFormatDate } from './utils'
import SupplierForm from './SupplierForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for supplier table
export const Suppliers_DEFAULT_COLUMN_VISIBILITY = {
  // Visible by default
  name: true,
  supplierType: true,
  status: true,
  phone: true,
  email: true,
  primaryContactPerson: true,
  annualSpend: true,
  riskClassification: true,
  strategicImportance: true,
  // Hidden by default
  id: false,
  description: false,
  address: false,
  website: false,
  contractStartDate: false,
  contractEndDate: false,
  performanceRating: false,
  complianceCertifications: false,
  tags: false,
  providesApplications: false,
  supportsApplications: false,
  maintainsApplications: false,
  providesInfrastructure: false,
  hostsInfrastructure: false,
  maintainsInfrastructure: false,
  providesAIComponents: false,
  supportsAIComponents: false,
  maintainsAIComponents: false,
  createdAt: false,
  updatedAt: false,
} as const

interface SupplierTableProps {
  id?: string
  suppliers: SupplierType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateSupplier?: (data: SupplierFormValues) => Promise<void>
  onUpdateSupplier?: (id: string, data: SupplierFormValues) => Promise<void>
  onDeleteSupplier?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onTableReady,
}) => {
  const t = useTranslations('suppliers.table')
  const tEntity = useTranslations('suppliers')
  const tSupplierType = useTranslations('suppliers.supplierTypes')
  const tStatus = useTranslations('suppliers.statuses')
  const tRisk = useTranslations('suppliers.riskClassifications')
  const tImportance = useTranslations('suppliers.strategicImportances')
  const formatDate = useFormatDate()
  const columnHelper = createColumnHelper<SupplierType>()

  // Use persistent column visibility
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'suppliers',
    defaultColumnVisibility: Suppliers_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for supplier table
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
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supplierType', {
        header: t('supplierType'),
        cell: info => <Chip label={tSupplierType(info.getValue())} size="small" />,
      }),
      columnHelper.accessor('status', {
        header: t('status'),
        cell: info => <Chip label={tStatus(info.getValue())} size="small" />,
      }),
      columnHelper.accessor('address', {
        header: t('address'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 40 ? `${value.substring(0, 40)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('phone', {
        header: t('phone'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('email', {
        header: t('email'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('website', {
        header: t('website'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('primaryContactPerson', {
        header: t('primaryContactPerson'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('contractStartDate', {
        header: t('contractStartDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('contractEndDate', {
        header: t('contractEndDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('annualSpend', {
        header: t('annualSpend'),
        cell: info => {
          const value = info.getValue()
          return value ? `€ ${value.toLocaleString()}` : '-'
        },
      }),
      columnHelper.accessor('riskClassification', {
        header: t('riskClassification'),
        cell: info => {
          const value = info.getValue()
          return value ? <Chip label={tRisk(value)} size="small" /> : '-'
        },
      }),
      columnHelper.accessor('strategicImportance', {
        header: t('strategicImportance'),
        cell: info => {
          const value = info.getValue()
          return value ? <Chip label={tImportance(value)} size="small" /> : '-'
        },
      }),
      columnHelper.accessor('performanceRating', {
        header: t('performanceRating'),
        cell: info => {
          const value = info.getValue()
          return value !== null && value !== undefined ? `${value.toFixed(1)} / 5.0` : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('complianceCertifications', {
        header: t('complianceCertifications'),
        cell: info => {
          const certs = info.getValue()
          return certs && certs.length > 0
            ? certs.slice(0, 2).join(', ') + (certs.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('tags', {
        header: t('tags'),
        cell: info => {
          const tags = info.getValue()
          return tags && tags.length > 0
            ? tags.slice(0, 2).join(', ') + (tags.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('providesApplications', {
        header: t('providesApplications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0
            ? apps
                .slice(0, 2)
                .map(app => app.name)
                .join(', ') + (apps.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportsApplications', {
        header: t('supportsApplications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0
            ? apps
                .slice(0, 2)
                .map(app => app.name)
                .join(', ') + (apps.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('maintainsApplications', {
        header: t('maintainsApplications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0
            ? apps
                .slice(0, 2)
                .map(app => app.name)
                .join(', ') + (apps.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('providesInfrastructure', {
        header: t('providesInfrastructure'),
        cell: info => {
          const infra = info.getValue()
          return infra && infra.length > 0
            ? infra
                .slice(0, 2)
                .map(i => i.name)
                .join(', ') + (infra.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('hostsInfrastructure', {
        header: t('hostsInfrastructure'),
        cell: info => {
          const infra = info.getValue()
          return infra && infra.length > 0
            ? infra
                .slice(0, 2)
                .map(i => i.name)
                .join(', ') + (infra.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('maintainsInfrastructure', {
        header: t('maintainsInfrastructure'),
        cell: info => {
          const infra = info.getValue()
          return infra && infra.length > 0
            ? infra
                .slice(0, 2)
                .map(i => i.name)
                .join(', ') + (infra.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('providesAIComponents', {
        header: t('providesAIComponents'),
        cell: info => {
          const components = info.getValue()
          return components && components.length > 0
            ? components
                .slice(0, 2)
                .map(component => component.name)
                .join(', ') + (components.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportsAIComponents', {
        header: t('supportsAIComponents'),
        cell: info => {
          const components = info.getValue()
          return components && components.length > 0
            ? components
                .slice(0, 2)
                .map(component => component.name)
                .join(', ') + (components.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('maintainsAIComponents', {
        header: t('maintainsAIComponents'),
        cell: info => {
          const components = info.getValue()
          return components && components.length > 0
            ? components
                .slice(0, 2)
                .map(component => component.name)
                .join(', ') + (components.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
    ],
    [columnHelper, t, tSupplierType, tStatus, tRisk, tImportance, formatDate]
  )

  // Map SupplierType to the expected FormValues for the form
  const mapToFormValues = (supplier: SupplierType): SupplierFormValues => {
    return {
      name: supplier.name,
      description: supplier.description ?? '',
      supplierType: supplier.supplierType,
      status: supplier.status,
      address: supplier.address ?? undefined,
      phone: supplier.phone ?? undefined,
      email: supplier.email ?? undefined,
      website: supplier.website ?? undefined,
      primaryContactPerson: supplier.primaryContactPerson ?? undefined,
      contractStartDate: supplier.contractStartDate ? new Date(supplier.contractStartDate) : null,
      contractEndDate: supplier.contractEndDate ? new Date(supplier.contractEndDate) : null,
      annualSpend: supplier.annualSpend ?? undefined,
      riskClassification: supplier.riskClassification ?? undefined,
      strategicImportance: supplier.strategicImportance ?? undefined,
      performanceRating: supplier.performanceRating ?? undefined,
      complianceCertifications: supplier.complianceCertifications ?? [],
      tags: supplier.tags ?? [],
      providesApplicationIds: supplier.providesApplications?.map(app => app.id) ?? [],
      supportsApplicationIds: supplier.supportsApplications?.map(app => app.id) ?? [],
      maintainsApplicationIds: supplier.maintainsApplications?.map(app => app.id) ?? [],
      providesInfrastructureIds: supplier.providesInfrastructure?.map(infra => infra.id) ?? [],
      hostsInfrastructureIds: supplier.hostsInfrastructure?.map(infra => infra.id) ?? [],
      maintainsInfrastructureIds: supplier.maintainsInfrastructure?.map(infra => infra.id) ?? [],
      providesAIComponentIds: supplier.providesAIComponents?.map(component => component.id) ?? [],
      supportsAIComponentIds: supplier.supportsAIComponents?.map(component => component.id) ?? [],
      maintainsAIComponentIds:
        supplier.maintainsAIComponents?.map(component => component.id) ?? [],
    }
  }

  return (
    <GenericTable<SupplierType, SupplierFormValues>
      data={suppliers}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateSupplier}
      onUpdate={onUpdateSupplier}
      onDelete={onDeleteSupplier}
      emptyMessage={t('noData')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={SupplierForm}
      getIdFromData={(item: SupplierType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default SupplierTable
