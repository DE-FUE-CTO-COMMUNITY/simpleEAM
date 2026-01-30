'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { useTranslations } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { ArchitectureType } from './types'
import {
  ArchitectureDomain,
  ArchitectureType as GeneratedArchitectureType,
} from '../../gql/generated'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { useDomainLabel, useTypeLabel, useFormatDate } from './utils'
import ArchitectureForm, { ArchitectureFormValues } from './ArchitectureForm'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exported default column visibility for Architecture
export const ARCHITECTURE_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  domain: true,
  type: true,
  timestamp: true,
  owners: true,
  tags: true,
  // Standardmäßig versteckte Spalten
  id: false,
  description: false,
  containsCapabilities: false,
  containsApplications: false,
  containsDataObjects: false,
  containsInterfaces: false,
  containsInfrastructure: false,
  appliedPrinciples: false,
  createdAt: false,
  updatedAt: false,
}

interface ArchitectureTableProps {
  id?: string
  architectures: ArchitectureType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateArchitecture?: (data: ArchitectureFormValues) => Promise<void>
  onUpdateArchitecture?: (id: string, data: ArchitectureFormValues) => Promise<void>
  onDeleteArchitecture?: (id: string) => Promise<void>
  availableArchitectures?: ArchitectureType[]
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ArchitectureTable: React.FC<ArchitectureTableProps> = ({
  architectures,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateArchitecture,
  onUpdateArchitecture,
  onDeleteArchitecture,
  availableArchitectures = [],
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('architectures')
  const getDomainLabelTranslated = useDomainLabel()
  const getTypeLabelTranslated = useTypeLabel()
  const formatDateTranslated = useFormatDate()
  const columnHelper = createColumnHelper<ArchitectureType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'architectures',
    defaultColumnVisibility: ARCHITECTURE_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for the architecture table
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
        enableHiding: true,
      }),
      columnHelper.accessor('name', {
        header: t('table.name'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: t('table.description'),
        cell: info => {
          const description = info.getValue()
          return description && description.length > 50
            ? `${description.substring(0, 50)}...`
            : description || '-'
        },
      }),
      columnHelper.accessor('domain', {
        header: t('table.domain'),
        cell: info => (
          <Chip
            label={getDomainLabelTranslated(info.getValue() as ArchitectureDomain)}
            color="primary"
            size="small"
            variant="filled"
          />
        ),
      }),
      columnHelper.accessor('type', {
        header: t('table.type'),
        cell: info => getTypeLabelTranslated(info.getValue() as GeneratedArchitectureType),
      }),
      columnHelper.accessor('timestamp', {
        header: t('table.timestamp'),
        cell: info => formatDateTranslated(info.getValue()),
      }),
      columnHelper.accessor('owners', {
        header: t('table.owner'),
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('containsCapabilities', {
        header: t('table.capabilities'),
        cell: info => {
          const caps = info.getValue()
          return caps && caps.length > 0
            ? caps
                .slice(0, 2)
                .map(cap => cap.name)
                .join(', ') + (caps.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('containsApplications', {
        header: t('table.applications'),
        cell: info => {
          const apps = info.getValue()
          return apps && apps.length > 0
            ? apps
                .slice(0, 2)
                .map(app => app.name)
                .join(', ') + (apps.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('containsDataObjects', {
        header: t('table.dataObjects'),
        cell: info => {
          const objs = info.getValue()
          return objs && objs.length > 0
            ? objs
                .slice(0, 2)
                .map(obj => obj.name)
                .join(', ') + (objs.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('containsInterfaces', {
        header: t('table.interfaces'),
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces
                .slice(0, 2)
                .map(intf => intf.name)
                .join(', ') + (interfaces.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('containsInfrastructure', {
        header: t('table.infrastructure'),
        cell: info => {
          const infrastructure = info.getValue()
          return infrastructure && infrastructure.length > 0
            ? infrastructure
                .slice(0, 2)
                .map(infra => infra.name)
                .join(', ') + (infrastructure.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('tags', {
        header: t('table.tags'),
        cell: info => {
          const tags = info.getValue()
          return tags && tags.length > 0
            ? tags
                .slice(0, 3)
                .map(tag => <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
            : '-'
        },
      }),
      columnHelper.accessor('appliedPrinciples', {
        header: t('table.appliedPrinciples'),
        cell: info => {
          const principles = info.getValue()
          return principles && principles.length > 0
            ? principles
                .slice(0, 2)
                .map(principle => principle.name)
                .join(', ') + (principles.length > 2 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('createdAt', {
        header: t('table.createdAt'),
        cell: info => formatDateTranslated(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: t('table.updatedAt'),
        cell: info => formatDateTranslated(info.getValue()),
      }),
    ],
    [columnHelper, t, getDomainLabelTranslated, getTypeLabelTranslated, formatDateTranslated]
  )

  // Mapping from ArchitectureType to expected FormValues for the form
  const mapToFormValues = (arch: ArchitectureType) => {
    return {
      name: arch.name,
      description: arch.description ?? '',
      domain: arch.domain,
      type: arch.type,
      timestamp: arch.timestamp ? new Date(arch.timestamp) : new Date(1735689600000), // Fixed timestamp for SSR consistency
      tags: arch.tags ?? [],
      ownerId: arch.owners && arch.owners.length > 0 ? arch.owners[0].id : undefined,
      containsApplicationIds: arch.containsApplications?.map(app => app.id) ?? [],
      containsCapabilityIds: arch.containsCapabilities?.map(cap => cap.id) ?? [],
      containsDataObjectIds: arch.containsDataObjects?.map(obj => obj.id) ?? [],
      containsInterfaceIds: arch.containsInterfaces?.map(intf => intf.id) ?? [],
      diagramIds: arch.diagrams?.map(diagram => diagram.id) ?? [],
      parentArchitectureId:
        arch.parentArchitecture && arch.parentArchitecture.length > 0
          ? arch.parentArchitecture[0].id
          : undefined,
      appliedPrincipleIds: arch.appliedPrinciples?.map(principle => principle.id) ?? [],
      containsInfrastructureIds: arch.containsInfrastructure?.map(infra => infra.id) ?? [],
    }
  }

  return (
    <GenericTable<ArchitectureType, ArchitectureFormValues>
      data={architectures}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateArchitecture}
      onUpdate={onUpdateArchitecture}
      onDelete={onDeleteArchitecture}
      emptyMessage={t('noData')}
      createButtonLabel={t('createNew')}
      entityName={t('form.entityName')}
      FormComponent={ArchitectureForm}
      getIdFromData={(item: ArchitectureType) => item.id}
      mapDataToFormValues={mapToFormValues}
      onTableReady={handleTableReady}
      additionalProps={{
        availableArchitectures,
      }}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  )
}

export default ArchitectureTable
