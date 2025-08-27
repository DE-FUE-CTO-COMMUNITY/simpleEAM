'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IconButton, Tooltip, Chip, Link as MuiLink } from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import { GenericTable } from '../generic/GenericTable'
import { CompanyType } from './types'
import { formatDate, getCompanySizeLabel, formatWebsite, formatAddress } from './utils'
import { createColumnHelper } from '@tanstack/react-table'

interface CompaniesTableProps {
  companies: CompanyType[]
  isLoading: boolean
  error: Error | null
  onEdit: (company: CompanyType) => void
  onDelete: (company: CompanyType) => void
  onView: (company: CompanyType) => void
}

export function CompaniesTable({
  companies,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
}: CompaniesTableProps) {
  const t = useTranslations('companies')

  const columnHelper = createColumnHelper<CompanyType>()

  const columns = [
    columnHelper.accessor('id', {
      header: t('table.headers.id'),
      size: 80,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: t('table.headers.name'),
      size: 200,
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: t('table.headers.description'),
      size: 300,
      cell: info => (
        <span title={info.getValue() || ''}>
          {info.getValue() ? info.getValue().substring(0, 100) + '...' : '-'}
        </span>
      ),
    }),
    columnHelper.accessor('address', {
      header: t('table.headers.address'),
      size: 200,
      cell: info => formatAddress(info.getValue()),
    }),
    columnHelper.accessor('website', {
      header: t('table.headers.website'),
      size: 150,
      cell: info => {
        const website = info.getValue()
        if (!website) return '-'
        const formattedWebsite = formatWebsite(website)
        return (
          <MuiLink
            href={formattedWebsite}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            {website}
          </MuiLink>
        )
      },
    }),
    columnHelper.accessor('industry', {
      header: t('table.headers.industry'),
      size: 150,
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('size', {
      header: t('table.headers.size'),
      size: 120,
      cell: info => {
        const size = info.getValue()
        if (!size) return '-'
        return <Chip label={getCompanySizeLabel(size)} size="small" variant="outlined" />
      },
    }),
    columnHelper.accessor('createdAt', {
      header: t('table.headers.createdAt'),
      size: 120,
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('updatedAt', {
      header: t('table.headers.updatedAt'),
      size: 120,
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table.headers.actions'),
      size: 120,
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Tooltip title={t('actions.view')}>
            <IconButton
              size="small"
              onClick={() => onView(row.original)}
              aria-label={t('actions.view')}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.edit')}>
            <IconButton
              size="small"
              onClick={() => onEdit(row.original)}
              aria-label={t('actions.edit')}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton
              size="small"
              onClick={() => onDelete(row.original)}
              aria-label={t('actions.delete')}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    }),
  ]

  return (
    <GenericTable
      data={companies}
      columns={columns}
      isLoading={isLoading}
      error={error}
      noDataMessage={t('table.noData')}
      loadingMessage={t('table.loading')}
    />
  )
}

interface CompanyTableProps {
  id?: string
  companys: CompanyType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreateCompany?: (data: CompanyFormValues) => Promise<void>
  onUpdateCompany?: (id: string, data: CompanyFormValues) => Promise<void>
  onDeleteCompany?: (id: string) => Promise<void>
  availableTechStack?: string[]
  availableCompanys?: Company[] // Hinzugefügt für die Dropdowns
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const CompanyTableWithGenericTable: React.FC<CompanyTableProps> = ({
  companys,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreateCompany,
  onUpdateCompany,
  onDeleteCompany,
  availableTechStack = [],
  availableCompanys = [], // Hinzugefügt
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('companys.table')
  const tStatus = useTranslations('companys.statuses')
  const tTimeCategory = useTranslations('companys.timeCategories')
  const tSevenR = useTranslations('companys.sevenRStrategies')
  const locale = useLocale()
  const columnHelper = createColumnHelper<CompanyType>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
    // resetColumnVisibility wird für zukünftige Reset-Funktionalität benötigt
  } = usePersistentColumnVisibility({
    tableKey: 'companys',
    defaultColumnVisibility: APPLICATION_DEFAULT_COLUMN_VISIBILITY,
  })

  // Kombiniere externe und persistente onTableReady Callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Spalten-Definition für die Company-Tabelle
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
        header: t('parentCompany'),
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

  // Mapping von CompanyType zu den erwarteten FormValues für das Formular
  const mapToFormValues = (app: CompanyType) => {
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
    <GenericTable<CompanyType, CompanyFormValues>
      data={companys}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreateCompany}
      onUpdate={onUpdateCompany}
      onDelete={onDeleteCompany}
      emptyMessage="Keine Applikationen gefunden."
      createButtonLabel="Neue Applikation erstellen"
      entityName="Company"
      FormComponent={CompanyForm}
      getIdFromData={(item: CompanyType) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      additionalProps={{
        availableTechStack,
        availableCompanys, // Hinzugefügt
      }}
      onTableReady={handleTableReady}
    />
  )
}

export default CompanyTableWithGenericTable
