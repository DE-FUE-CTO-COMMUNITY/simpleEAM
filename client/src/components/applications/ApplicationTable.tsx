'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { ApplicationType } from './types'
import { formatDate, getCriticalityLabel, formatCosts } from './utils'
import { CriticalityLevel } from '../../gql/generated'
import ApplicationForm, { ApplicationFormValues } from './ApplicationForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'
import { Application } from '../../gql/generated'

// Exported default column visibility for application table
export const APPLICATION_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  name: true,
  status: true,
  criticality: true,
  vendor: true,
  version: true,
  owners: true,
  costs: true,
  // Standardmäßig versteckte Spalten
  id: false,
  description: false,
  timeCategory: false,
  sevenRStrategy: false,
  supportsCapabilities: false,
  usesDataObjects: false,
  hostingEnvironment: false,
  technologyStack: false,
  planningDate: false,
  introductionDate: false,
  endOfUseDate: false,
  endOfLifeDate: false,
  sourceOfInterfaces: false,
  targetOfInterfaces: false,
  partOfArchitectures: false,
  implementsPrinciples: false,
  depictedInDiagrams: false,
  parents: false,
  components: false,
  hostedOn: false,
  createdAt: false,
  updatedAt: false,
} as const

interface ApplicationTableProps {
  id?: string
  applications: ApplicationType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateApplication?: (data: ApplicationFormValues) => Promise<void>
  onUpdateApplication?: (id: string, data: ApplicationFormValues) => Promise<void>
  onDeleteApplication?: (id: string) => Promise<void>
  availableTechStack?: string[]
  availableApplications?: Application[] // Added for dropdowns
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const ApplicationTableWithGenericTable: React.FC<ApplicationTableProps> = ({
  applications,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
  availableTechStack = [],
  availableApplications = [], // Added
  onTableReady,
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('applications.table')
  const tStatus = useTranslations('applications.statuses')
  const tTimeCategory = useTranslations('applications.timeCategories')
  const tSevenR = useTranslations('applications.sevenRStrategies')
  const locale = useLocale()
  const columnHelper = createColumnHelper<ApplicationType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility is needed for future reset functionality
  } = usePersistentColumnVisibility({
    tableKey: 'applications',
    defaultColumnVisibility: APPLICATION_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for application table
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
      columnHelper.accessor('status', {
        header: t('status'),
        cell: info => <Chip label={tStatus(info.getValue())} size="small" />,
      }),
      columnHelper.accessor('criticality', {
        header: t('criticality'),
        cell: info => getCriticalityLabel(info.getValue() as CriticalityLevel),
      }),
      columnHelper.accessor('timeCategory', {
        header: t('timeCategory'),
        cell: info => {
          const category = info.getValue()
          if (!category) return '-'
          return tTimeCategory(category)
        },
        enableHiding: true,
      }),
      columnHelper.accessor('sevenRStrategy', {
        header: t('sevenRStrategy'),
        cell: info => {
          const strategy = info.getValue()
          if (!strategy) return '-'
          return tSevenR(strategy)
        },
        enableHiding: true,
      }),
      columnHelper.accessor('vendor', {
        header: t('vendor'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('version', {
        header: t('version'),
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
        header: t('businessCapabilities'),
        cell: info => {
          const caps = info.getValue()
          return caps && caps.length > 0
            ? caps
                .slice(0, 3)
                .map(cap => cap.name)
                .join(', ') + (caps.length > 3 ? '...' : '')
            : '-'
        },
      }),
      columnHelper.accessor('usesDataObjects', {
        header: t('dataObjects'),
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
      columnHelper.accessor('costs', {
        header: t('annualCosts'),
        cell: info => formatCosts(info.getValue()),
      }),
      // Weitere versteckte Spalten
      columnHelper.accessor('hostingEnvironment', {
        header: t('hostingEnvironment'),
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('technologyStack', {
        header: t('technologyStack'),
        cell: info => {
          const stack = info.getValue()
          return stack && stack.length > 0 ? stack.join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('planningDate', {
        header: t('planningDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: t('introductionDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfUseDate', {
        header: t('endOfUseDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfLifeDate', {
        header: t('endOfLifeDate'),
        cell: info => {
          const value = info.getValue()
          return value ? formatDate(value, locale) : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('sourceOfInterfaces', {
        header: t('sourceOfInterfaces'),
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map((iface: any) => iface.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('targetOfInterfaces', {
        header: t('targetOfInterfaces'),
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map((iface: any) => iface.name).join(', ')
            : '-'
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
      columnHelper.accessor('implementsPrinciples', {
        header: t('implementedPrinciples'),
        cell: info => {
          const principles = info.getValue()
          return principles && principles.length > 0
            ? principles
                .slice(0, 2)
                .map((principle: any) => principle.name)
                .join(', ') + (principles.length > 2 ? '...' : '')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: t('depictedInDiagrams'),
        cell: info => {
          const diagrams = info.getValue()
          return diagrams && diagrams.length > 0
            ? diagrams.map((diagram: any) => diagram.title).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('parents', {
        header: t('parentApplication'),
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0
            ? parents.map((parent: any) => parent.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('components', {
        header: t('components'),
        cell: info => {
          const components = info.getValue()
          return components && components.length > 0
            ? components.map((component: any) => component.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('hostedOn', {
        header: t('hostedOn'),
        cell: info => {
          const infrastructure = info.getValue()
          return infrastructure && infrastructure.length > 0
            ? infrastructure.map((infra: any) => infra.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      // Versteckte Zeitstempel-Spalten am Ende
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => formatDate(info.getValue(), locale),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => formatDate(info.getValue(), locale),
        enableHiding: true,
      }),
    ],
    [columnHelper, t, tStatus, tTimeCategory, tSevenR, locale]
  )

  // Mapping from ApplicationType to expected FormValues for form
  const mapToFormValues = (app: ApplicationType) => {
    return {
      name: app.name,
      description: app.description ?? '',
      status: app.status,
      criticality: app.criticality,
      version: app.version ?? '',
      ownerId: app.owners && app.owners.length > 0 ? app.owners[0].id : undefined,
      vendor: app.vendor ?? '',
      costs: app.costs ?? 0,
      technologyStack: app.technologyStack ?? [],
      usesDataObjectIds: app.usesDataObjects?.map(obj => obj.id) ?? [],
      sourceOfInterfaceIds: app.sourceOfInterfaces?.map(iface => iface.id) ?? [],
      targetOfInterfaceIds: app.targetOfInterfaces?.map(iface => iface.id) ?? [],
      supportsCapabilityIds: app.supportsCapabilities?.map(cap => cap.id) ?? [],
      timeCategory: app.timeCategory ?? null,
      sevenRStrategy: app.sevenRStrategy ?? null,
      hostedOnIds: app.hostedOn?.map(infra => infra.id) ?? [],
      introductionDate: app.introductionDate ? new Date(app.introductionDate) : null,
      endOfLifeDate: app.endOfLifeDate ? new Date(app.endOfLifeDate) : null,
      planningDate: app.planningDate ? new Date(app.planningDate) : null,
      endOfUseDate: app.endOfUseDate ? new Date(app.endOfUseDate) : null,
      partOfArchitectures: app.partOfArchitectures?.map(arch => arch.id) ?? [],
      implementsPrincipleIds: app.implementsPrinciples?.map(principle => principle.id) ?? [],
      depictedInDiagrams: app.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
      parentIds: app.parents?.map(parent => parent.id) ?? [],
      componentIds: app.components?.map(component => component.id) ?? [],
      predecessorIds: app.predecessors?.map(pred => pred.id) ?? [],
      successorIds: app.successors?.map(succ => succ.id) ?? [],
    }
  }

  return (
    <GenericTable<ApplicationType, ApplicationFormValues>
      data={applications}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateApplication}
      onUpdate={onUpdateApplication}
      onDelete={onDeleteApplication}
      emptyMessage="Keine Applikationen gefunden."
      createButtonLabel="Neue Applikation erstellen"
      entityName="Application"
      FormComponent={ApplicationForm}
      getIdFromData={(item: ApplicationType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      additionalProps={{
        availableTechStack,
        availableApplications, // Added
      }}
      onTableReady={handleTableReady}
    />
  )
}

export default ApplicationTableWithGenericTable
