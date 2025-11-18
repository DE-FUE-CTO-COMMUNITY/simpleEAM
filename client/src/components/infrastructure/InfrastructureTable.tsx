'use client'

import React, { useMemo, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import InfrastructureForm, { InfrastructureFormValues } from './InfrastructureForm'
import { Infrastructure, InfrastructureType, InfrastructureStatus } from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for Infrastructure
export const INFRASTRUCTURE_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  infrastructureType: true,
  status: true,
  location: true,
  owners: true,
  // Standardmäßig versteckte Spalten
  id: false,
  description: false,
  vendor: false,
  version: false,
  capacity: false,
  ipAddress: false,
  operatingSystem: false,
  specifications: false,
  maintenanceWindow: false,
  costs: false,
  planningDate: false,
  introductionDate: false,
  endOfUseDate: false,
  endOfLifeDate: false,
  parentInfrastructure: false,
  childInfrastructures: false,
  hostsApplications: false,
  partOfArchitectures: false,
  depictedInDiagrams: false,
  createdAt: false,
  updatedAt: false,
}

interface InfrastructureTableProps {
  id?: string
  infrastructures: Infrastructure[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateInfrastructure?: (data: InfrastructureFormValues) => Promise<void>
  onUpdateInfrastructure?: (id: string, data: InfrastructureFormValues) => Promise<void>
  onDeleteInfrastructure?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const InfrastructureTable: React.FC<InfrastructureTableProps> = ({
  infrastructures,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateInfrastructure,
  onUpdateInfrastructure,
  onDeleteInfrastructure,
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('infrastructure')
  const locale = useLocale()

  // Utility functions for date formatting and translations
  const formatDate = (date: string | null | undefined, locale: string): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getInfrastructureTypeTranslation = (type: InfrastructureType, t: any): string => {
    const translations: Record<InfrastructureType, string> = {
      [InfrastructureType.CLOUD_DATACENTER]: t('infrastructureTypes.CLOUD_DATACENTER'),
      [InfrastructureType.CONTAINER_HOST]: t('infrastructureTypes.CONTAINER_HOST'),
      [InfrastructureType.KUBERNETES_CLUSTER]: t('infrastructureTypes.KUBERNETES_CLUSTER'),
      [InfrastructureType.ON_PREMISE_DATACENTER]: t('infrastructureTypes.ON_PREMISE_DATACENTER'),
      [InfrastructureType.PHYSICAL_SERVER]: t('infrastructureTypes.PHYSICAL_SERVER'),
      [InfrastructureType.VIRTUAL_MACHINE]: t('infrastructureTypes.VIRTUAL_MACHINE'),
      [InfrastructureType.VIRTUALIZATION_CLUSTER]: t('infrastructureTypes.VIRTUALIZATION_CLUSTER'),
      [InfrastructureType.IOT_GATEWAY]: 'IoT Gateway',
      [InfrastructureType.IOT_PLATFORM]: 'IoT Platform',
    }
    return translations[type] || type
  }

  const getInfrastructureStatusTranslation = (status: InfrastructureStatus, t: any): string => {
    const translations: Record<InfrastructureStatus, string> = {
      [InfrastructureStatus.ACTIVE]: t('statuses.ACTIVE'),
      [InfrastructureStatus.DECOMMISSIONED]: t('statuses.DECOMMISSIONED'),
      [InfrastructureStatus.INACTIVE]: t('statuses.INACTIVE'),
      [InfrastructureStatus.MAINTENANCE]: t('statuses.MAINTENANCE'),
      [InfrastructureStatus.PLANNED]: t('statuses.PLANNED'),
      [InfrastructureStatus.UNDER_CONSTRUCTION]: t('statuses.UNDER_CONSTRUCTION'),
    }
    return translations[status] || status
  }

  const columnHelper = createColumnHelper<Infrastructure>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility is needed for future reset functionality
  } = usePersistentColumnVisibility({
    tableKey: 'infrastructure', // Fixed: now matches InfrastructureToolbar
    defaultColumnVisibility: INFRASTRUCTURE_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Helper function for displaying infrastructure type with colored chip
  const getTypeChip = useCallback(
    (type: InfrastructureType) => {
      let color
      let label

      switch (type) {
        case InfrastructureType.CLOUD_DATACENTER:
          color = 'primary'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.ON_PREMISE_DATACENTER:
          color = 'secondary'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.KUBERNETES_CLUSTER:
          color = 'info'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.VIRTUALIZATION_CLUSTER:
          color = 'primary'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.VIRTUAL_MACHINE:
          color = 'success'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.CONTAINER_HOST:
          color = 'warning'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.PHYSICAL_SERVER:
          color = 'error'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.IOT_GATEWAY:
          color = 'info'
          label = getInfrastructureTypeTranslation(type, t)
          break
        case InfrastructureType.IOT_PLATFORM:
          color = 'info'
          label = getInfrastructureTypeTranslation(type, t)
          break
        default:
          color = 'default'
          label = type
      }

      return <Chip label={label} size="small" color={color as any} variant="filled" />
    },
    [t]
  )

  // Helper function for displaying status with colored chip
  const getStatusChip = useCallback(
    (status: InfrastructureStatus) => {
      let color
      let label

      switch (status) {
        case InfrastructureStatus.ACTIVE:
          color = 'success'
          label = getInfrastructureStatusTranslation(status, t)
          break
        case InfrastructureStatus.INACTIVE:
          color = 'default'
          label = getInfrastructureStatusTranslation(status, t)
          break
        case InfrastructureStatus.MAINTENANCE:
          color = 'warning'
          label = getInfrastructureStatusTranslation(status, t)
          break
        case InfrastructureStatus.PLANNED:
          color = 'info'
          label = getInfrastructureStatusTranslation(status, t)
          break
        case InfrastructureStatus.DECOMMISSIONED:
          color = 'error'
          label = getInfrastructureStatusTranslation(status, t)
          break
        case InfrastructureStatus.UNDER_CONSTRUCTION:
          color = 'secondary'
          label = getInfrastructureStatusTranslation(status, t)
          break
        default:
          color = 'default'
          label = status
      }

      return <Chip label={label} size="small" color={color as any} variant="filled" />
    },
    [t]
  )

  // Column definition for the infrastructure table
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: t('table.id'),
        cell: info => info.getValue(),
        enableHiding: true,
      }),
      columnHelper.accessor('name', {
        header: t('form.name'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: t('form.description'),
        cell: info => {
          const description = info.getValue()
          return description || '-'
        },
      }),
      columnHelper.accessor('infrastructureType', {
        header: t('form.infrastructureType'),
        cell: info => getTypeChip(info.getValue()),
      }),
      columnHelper.accessor('status', {
        header: t('form.status'),
        cell: info => getStatusChip(info.getValue()),
      }),
      columnHelper.accessor('location', {
        header: t('form.location'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('vendor', {
        header: t('form.vendor'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('version', {
        header: t('form.version'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('capacity', {
        header: t('form.capacity'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('ipAddress', {
        header: t('form.ipAddress'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('operatingSystem', {
        header: t('form.operatingSystem'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('specifications', {
        header: t('form.specifications'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 30 ? `${value.substring(0, 30)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('maintenanceWindow', {
        header: t('form.maintenanceWindow'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('costs', {
        header: t('form.costs'),
        cell: info => {
          const value = info.getValue()
          return value ? `${value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US')} €` : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('owners', {
        header: t('form.owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      // Weitere versteckte Spalten
      columnHelper.accessor('planningDate', {
        header: t('form.planningDate'),
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: t('form.introductionDate'),
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfUseDate', {
        header: t('form.endOfUseDate'),
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfLifeDate', {
        header: t('form.endOfLifeDate'),
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('parentInfrastructure', {
        header: t('form.parentInfrastructure'),
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0
            ? parents.map((parent: any) => parent.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('childInfrastructures', {
        header: t('form.childInfrastructures'),
        cell: info => {
          const children = info.getValue()
          return children && children.length > 0
            ? children.map((child: any) => child.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('hostsApplications', {
        header: t('form.hostsApplications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0 ? apps.map((app: any) => app.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: t('form.partOfArchitectures'),
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map((arch: any) => arch.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: t('form.depictedInDiagrams'),
        cell: info => {
          const diagrams = info.getValue()
          return diagrams && diagrams.length > 0
            ? diagrams.map((diagram: any) => diagram.title).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      // Versteckte Zeitstempel-Spalten am Ende
      columnHelper.accessor('createdAt', {
        header: t('table.createdAt'),
        cell: info => formatDate(info.getValue(), locale),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('table.updatedAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
    ],
    [columnHelper, getTypeChip, getStatusChip, t, locale]
  )

  return (
    <GenericTable<Infrastructure, InfrastructureFormValues>
      data={infrastructures}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateInfrastructure}
      onUpdate={onUpdateInfrastructure}
      onDelete={onDeleteInfrastructure}
      emptyMessage={t('noInfrastructureFound')}
      createButtonLabel={t('addNew')}
      entityName={t('title')}
      FormComponent={InfrastructureForm}
      getIdFromData={(item: Infrastructure) => item.id}
      // mapDataToFormValues removed - InfrastructureForm works directly with infrastructure prop
      onTableReady={handleTableReady}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default InfrastructureTable
