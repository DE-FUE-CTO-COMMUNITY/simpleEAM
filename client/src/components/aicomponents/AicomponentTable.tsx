'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { AicomponentType, AicomponentFormValues } from './types'
import { useFormatDate, useAiTypeLabel, useStatusLabel } from './utils'
import AicomponentForm from './AicomponentForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'

// Exportierte Standard-Spaltenvisibilität für die Aicomponent-Tabelle
export const Aicomponents_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  description: true,
  aiType: true,
  status: true,
  provider: true,
  version: true,
  createdAt: true,

  // Standardmäßig versteckte Spalten
  id: false,
  model: false,
  accuracy: false,
  trainingDate: false,
  lastUpdated: false,
  license: false,
  costs: false,
  tags: false,
  owners: false,
  supportsCapabilities: false,
  usedByApplications: false,
  trainedWithDataObjects: false,
  hostedOn: false,
  partOfArchitectures: false,
  implementsPrinciples: false,
  depictedInDiagrams: false,
  updatedAt: false,
} as const

interface AicomponentTableProps {
  id?: string
  aicomponents: AicomponentType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateAicomponent?: (data: AicomponentFormValues) => Promise<void>
  onUpdateAicomponent?: (id: string, data: AicomponentFormValues) => Promise<void>
  onDeleteAicomponent?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const AicomponentTableWithGenericTable: React.FC<AicomponentTableProps> = ({
  aicomponents,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateAicomponent,
  onUpdateAicomponent,
  onDeleteAicomponent,
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('aicomponents.table')
  const tEntity = useTranslations('aicomponents')
  const formatDate = useFormatDate()
  const getAiTypeLabel = useAiTypeLabel()
  const getStatusLabel = useStatusLabel()
  const columnHelper = createColumnHelper<AicomponentType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'aicomponents',
    defaultColumnVisibility: Aicomponents_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for Aicomponent-Tabelle
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
      }),
      columnHelper.accessor('aiType', {
        header: t('aiType'),
        cell: info => {
          const value = info.getValue()
          return value ? getAiTypeLabel(value) : '-'
        },
      }),
      columnHelper.accessor('status', {
        header: t('status'),
        cell: info => {
          const value = info.getValue()
          return value ? getStatusLabel(value) : '-'
        },
      }),
      columnHelper.accessor('model', {
        header: t('model'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('version', {
        header: t('version'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('provider', {
        header: t('provider'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('accuracy', {
        header: t('accuracy'),
        cell: info => {
          const value = info.getValue()
          return value !== null && value !== undefined ? `${value}%` : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('costs', {
        header: t('costs'),
        cell: info => {
          const value = info.getValue()
          return value !== null && value !== undefined
            ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('trainingDate', {
        header: t('trainingDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('lastUpdated', {
        header: t('lastUpdated'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('license', {
        header: t('license'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('tags', {
        header: t('tags'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('owners', {
        header: t('owners'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0
            ? value.map(owner => `${owner.firstName} ${owner.lastName}`).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('supportsCapabilities', {
        header: t('supportsCapabilities'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(cap => cap.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('usedByApplications', {
        header: t('usedByApplications'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(app => app.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('trainedWithDataObjects', {
        header: t('trainedWithDataObjects'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(data => data.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('hostedOn', {
        header: t('hostedOn'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(infra => infra.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: t('partOfArchitectures'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(arch => arch.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('implementsPrinciples', {
        header: t('implementsPrinciples'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(principle => principle.name).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: t('depictedInDiagrams'),
        cell: info => {
          const value = info.getValue()
          return value && value.length > 0 ? value.map(diagram => diagram.title).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value) : '-'
        },
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
    [columnHelper, t, formatDate, getAiTypeLabel, getStatusLabel]
  )

  // Mapping from AicomponentType to expected FormValues for form
  const mapToFormValues = (aicomponent: AicomponentType): AicomponentFormValues => {
    return {
      name: aicomponent.name,
      description: aicomponent.description ?? '',
      aiType: aicomponent.aiType,
      status: aicomponent.status,
      model: aicomponent.model ?? '',
      version: aicomponent.version ?? '',
      accuracy: aicomponent.accuracy ?? undefined,
      trainingDate: aicomponent.trainingDate ?? '',
      lastUpdated: aicomponent.lastUpdated ?? '',
      provider: aicomponent.provider ?? '',
      license: aicomponent.license ?? '',
      costs: aicomponent.costs ?? undefined,
      tags: Array.isArray(aicomponent.tags)
        ? aicomponent.tags
        : aicomponent.tags
          ? [aicomponent.tags]
          : [],
      ownerId: aicomponent.owners?.[0]?.id ?? '',
      supportsCapabilityIds: aicomponent.supportsCapabilities?.map(cap => cap.id) ?? [],
      usedByApplicationIds: aicomponent.usedByApplications?.map(app => app.id) ?? [],
      trainedWithDataObjectIds: aicomponent.trainedWithDataObjects?.map(obj => obj.id) ?? [],
      hostedOnIds: aicomponent.hostedOn?.map(infra => infra.id) ?? [],
      partOfArchitectureIds: aicomponent.partOfArchitectures?.map(arch => arch.id) ?? [],
      implementsPrincipleIds:
        aicomponent.implementsPrinciples?.map(principle => principle.id) ?? [],
      depictedInDiagramIds: aicomponent.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
    }
  }

  return (
    <GenericTable<AicomponentType, AicomponentFormValues>
      data={aicomponents}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateAicomponent}
      onUpdate={onUpdateAicomponent}
      onDelete={onDeleteAicomponent}
      emptyMessage={tEntity('noAicomponentsFound')}
      createButtonLabel={tEntity('addNew')}
      entityName={tEntity('title')}
      FormComponent={AicomponentForm}
      getIdFromData={(item: AicomponentType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default AicomponentTableWithGenericTable
