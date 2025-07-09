'use client'

import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { ApplicationType } from './types'
import { formatDate, getCriticalityLabel, formatCosts } from './utils'
import { CriticalityLevel } from '../../gql/generated'
import ApplicationForm, { ApplicationFormValues } from './ApplicationForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'
import { Application } from '../../gql/generated'

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
  availableApplications?: Application[] // Hinzugefügt für die Dropdowns
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
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
  availableApplications = [], // Hinzugefügt
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const columnHelper = createColumnHelper<ApplicationType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'applications',
    defaultColumnVisibility: {
      description: false,
      timeCategory: false,
      sevenRStrategy: false,
      hostingEnvironment: false,
      technologyStack: false,
      planningDate: false,
      introductionDate: false,
      endOfUseDate: false,
      endOfLifeDate: false,
      sourceOfInterfaces: false,
      targetOfInterfaces: false,
      partOfArchitectures: false,
      depictedInDiagrams: false,
      parents: false,
      components: false,
      createdAt: false,
      updatedAt: false,
    },
  })

  // Kombiniere externe und persistente onTableReady Callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Spalten-Definition für die Application-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: info => {
          const value = info.getValue()
          return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => <Chip label={info.getValue()} size="small" />,
      }),
      columnHelper.accessor('criticality', {
        header: 'Kritikalität',
        cell: info => getCriticalityLabel(info.getValue() as CriticalityLevel),
      }),
      columnHelper.accessor('timeCategory', {
        header: 'TIME-Kategorie',
        cell: info => {
          const category = info.getValue()
          if (!category) return '-'
          switch (category) {
            case 'TOLERATE':
              return 'Tolerate'
            case 'INVEST':
              return 'Invest'
            case 'MIGRATE':
              return 'Migrate'
            case 'ELIMINATE':
              return 'Eliminate'
            default:
              return category
          }
        },
        enableHiding: true,
      }),
      columnHelper.accessor('sevenRStrategy', {
        header: '7R-Strategie',
        cell: info => {
          const strategy = info.getValue()
          if (!strategy) return '-'
          switch (strategy) {
            case 'RETIRE':
              return 'Retire'
            case 'RETAIN':
              return 'Retain'
            case 'REHOST':
              return 'Rehost'
            case 'REPLATFORM':
              return 'Replatform'
            case 'REFACTOR':
              return 'Refactor'
            case 'REARCHITECT':
              return 'Rearchitect'
            case 'REPLACE':
              return 'Replace'
            default:
              return strategy
          }
        },
        enableHiding: true,
      }),
      columnHelper.accessor('vendor', {
        header: 'Anbieter',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('version', {
        header: 'Version',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('owners', {
        header: 'Verantwortlicher',
        cell: info => {
          const owners = info.getValue()
          return owners && owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : '-'
        },
      }),
      columnHelper.accessor('supportsCapabilities', {
        header: 'Capabilities',
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
        header: 'Datenobjekte',
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
        header: 'Kosten',
        cell: info => formatCosts(info.getValue()),
      }),
      // Weitere versteckte Spalten
      columnHelper.accessor('hostingEnvironment', {
        header: 'Hosting-Umgebung',
        cell: info => info.getValue() || '-',
        enableHiding: true,
      }),
      columnHelper.accessor('technologyStack', {
        header: 'Technologie-Stack',
        cell: info => {
          const stack = info.getValue()
          return stack && stack.length > 0 ? stack.join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('planningDate', {
        header: 'Planungsdatum',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('introductionDate', {
        header: 'Einführungsdatum',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfUseDate', {
        header: 'Ende der Nutzung',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('endOfLifeDate', {
        header: 'Ende der Lebenszeit',
        cell: info => {
          const date = info.getValue()
          return date ? new Date(date).toLocaleDateString('de-DE') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('sourceOfInterfaces', {
        header: 'Quell-Schnittstellen',
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map((iface: any) => iface.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('targetOfInterfaces', {
        header: 'Ziel-Schnittstellen',
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map((iface: any) => iface.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('partOfArchitectures', {
        header: 'Teil von Architekturen',
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map((arch: any) => arch.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('depictedInDiagrams', {
        header: 'Dargestellt in Diagrammen',
        cell: info => {
          const diagrams = info.getValue()
          return diagrams && diagrams.length > 0
            ? diagrams.map((diagram: any) => diagram.title).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('parents', {
        header: 'Übergeordnete Anwendungen',
        cell: info => {
          const parents = info.getValue()
          return parents && parents.length > 0
            ? parents.map((parent: any) => parent.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('components', {
        header: 'Komponenten',
        cell: info => {
          const components = info.getValue()
          return components && components.length > 0
            ? components.map((component: any) => component.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      // Versteckte Zeitstempel-Spalten am Ende
      columnHelper.accessor('createdAt', {
        header: 'Erstellt am',
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert am',
        cell: info => formatDate(info.getValue()),
        enableHiding: true,
      }),
    ],
    [columnHelper]
  )

  // Mapping von ApplicationType zu den erwarteten FormValues für das Formular
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
        availableApplications, // Hinzugefügt
      }}
      onTableReady={handleTableReady}
    />
  )
}

export default ApplicationTableWithGenericTable
