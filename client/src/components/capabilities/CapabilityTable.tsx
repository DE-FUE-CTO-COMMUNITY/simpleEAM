'use client'

import React, { useMemo } from 'react'
import { Chip, useTheme } from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { formatDate, getLevelLabel } from './utils'
import { CapabilityStatus, CapabilityType, BusinessCapability } from '../../gql/generated'
import CapabilityForm, { CapabilityFormValues } from './CapabilityForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for capability table
export const CAPABILITY_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  description: true,
  maturityLevel: true,
  status: true,
  businessValue: true,
  owners: true,
  tags: true,
  // Standardmäßig versteckte Spalten
  id: false,
  type: false,
  sequenceNumber: false,
  introductionDate: false,
  endDate: false,
  parents: false,
  children: false,
  relatedDataObjects: false,
  supportedByApplications: false,
  partOfArchitectures: false,
  createdAt: false,
  updatedAt: false,
} as const

interface CapabilityTableProps {
  id?: string
  capabilities: BusinessCapability[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateCapability?: (data: CapabilityFormValues) => Promise<void>
  onUpdateCapability?: (id: string, data: CapabilityFormValues) => Promise<void>
  onDeleteCapability?: (id: string) => Promise<void>
  availableTags?: string[]
  availableCapabilities?: BusinessCapability[]
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const CapabilityTable: React.FC<CapabilityTableProps> = ({
  capabilities,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateCapability,
  onUpdateCapability,
  onDeleteCapability,
  availableTags = [],
  availableCapabilities = [],
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const theme = useTheme()
  const t = useTranslations('capabilities.table')
  const locale = useLocale()
  const tStatus = useTranslations('capabilities.statuses')
  const tType = useTranslations('capabilities.types')
  const tMaturity = useTranslations('capabilities.maturityLevels')
  const columnHelper = createColumnHelper<BusinessCapability>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility is needed for future reset functionality
  } = usePersistentColumnVisibility({
    tableKey: 'capabilities',
    defaultColumnVisibility: CAPABILITY_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for capability table
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
      columnHelper.accessor('maturityLevel', {
        header: t('maturityLevel'),
        cell: info => {
          const level = info.getValue()
          return (
            <Chip
              label={getLevelLabel(level, tMaturity)}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.lighter,
                color: theme.palette.primary.dark,
              }}
            />
          )
        },
      }),
      columnHelper.accessor('status', {
        header: t('status'),
        cell: info => {
          const status = info.getValue() as CapabilityStatus
          return tStatus(status)
        },
      }),
      columnHelper.accessor('businessValue', {
        header: t('businessValue'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('owners', {
        header: t('owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('tags', {
        header: t('tags'),
        cell: info => {
          const tags = info.getValue()
          return tags ? tags.join(', ') : '-'
        },
      }),
      columnHelper.accessor('parents', {
        header: t('parentCapabilities'),
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0
            ? parents.map((parent: BusinessCapability) => parent.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('children', {
        header: t('childCapabilities'),
        cell: info => {
          const children = info.getValue()
          return children ? children.map((child: BusinessCapability) => child.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      // Hidden columns for type and sequenceNumber
      columnHelper.accessor('type', {
        header: t('type'),
        cell: info => {
          const type = info.getValue() as CapabilityType
          return type ? tType(type) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('sequenceNumber', {
        header: t('sequenceNumber'),
        cell: info => {
          const sequence = info.getValue()
          return sequence !== null && sequence !== undefined ? sequence.toString() : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: t('introductionDate'),
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endDate', {
        header: t('endDate'),
        cell: info => {
          const date = info.getValue()
          return date ? formatDate(date, locale) : '-'
        },
        enableHiding: true,
      }),
      // Additional hidden columns for relationships
      columnHelper.accessor('relatedDataObjects', {
        header: t('relatedDataObjects'),
        cell: info => {
          const relatedDataObjects = info.getValue()
          return relatedDataObjects && relatedDataObjects.length > 0
            ? relatedDataObjects.map((obj: any) => obj.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportedByApplications', {
        header: t('supportedByApplications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0 ? apps.map((app: any) => app.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: t('partOfArchitectures'),
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map((arch: any) => arch.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      // Hidden columns for timestamps at end
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => formatDate(info.getValue(), locale),
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
    [
      theme.palette.primary.lighter,
      theme.palette.primary.dark,
      columnHelper,
      t,
      tMaturity,
      tStatus,
      tType,
      locale,
    ]
  )

  // Mapping from Capability to expected FormValues for the form
  const mapToFormValues = (capability: BusinessCapability): CapabilityFormValues => {
    return {
      name: capability.name ?? '',
      description: capability.description ?? '',
      maturityLevel: capability.maturityLevel ?? 0,
      businessValue: capability.businessValue ?? 0,
      status: capability.status ?? CapabilityStatus.ACTIVE,
      type: capability.type ?? CapabilityType.OPERATIONAL,
      ownerId: capability.owners && capability.owners.length > 0 ? capability.owners[0].id : '',
      tags: capability.tags ?? [],
      parentId: capability.parents && capability.parents.length > 0 ? capability.parents[0].id : '',
      children: capability.children?.map((child: BusinessCapability) => child.id) ?? [],
      supportedByApplications: capability.supportedByApplications?.map((app: any) => app.id) ?? [],
      partOfArchitectures: capability.partOfArchitectures?.map((arch: any) => arch.id) ?? [],
      partOfDiagrams: [], // Temporarily empty array
      sequenceNumber: capability.sequenceNumber ?? 0,
      introductionDate: capability.introductionDate
        ? new Date(capability.introductionDate)
        : undefined,
      endDate: capability.endDate ? new Date(capability.endDate) : undefined,
    }
  }

  return (
    <GenericTable<BusinessCapability, CapabilityFormValues>
      data={capabilities}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateCapability}
      onUpdate={onUpdateCapability}
      onDelete={onDeleteCapability}
      emptyMessage="Keine Business Capabilities gefunden."
      createButtonLabel="Neue Business Capability erstellen"
      entityName="Capability"
      FormComponent={CapabilityForm}
      getIdFromData={(item: BusinessCapability) => item.id}
      mapDataToFormValues={mapToFormValues}
      onTableReady={handleTableReady}
      additionalProps={{
        availableTags,
        availableCapabilities,
      }}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default CapabilityTable
