'use client'

import React, { useMemo } from 'react'
import { Chip, useTheme } from '@mui/material'
import { GenericTable } from '../common/GenericTable'
import { ApplicationType } from './types'
import { formatDate, getCriticalityLabel, formatCosts } from './utils'
import { Application, CriticalityLevel } from '../../gql/generated'
import ApplicationForm, { ApplicationFormValues } from './ApplicationForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'

interface ApplicationTableProps {
  id?: string
  applications: ApplicationType[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onRowClick: (id: string) => void
  onEditClick: (id: string) => void
  onCreateApplication?: (data: ApplicationFormValues) => Promise<void>
  onUpdateApplication?: (id: string, data: ApplicationFormValues) => Promise<void>
  onDeleteApplication?: (id: string) => Promise<void>
  availableTechStack?: string[]
}

const ApplicationTableWithGenericTable: React.FC<ApplicationTableProps> = ({
  applications,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onRowClick,
  onEditClick,
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
  availableTechStack = [],
}) => {
  const theme = useTheme()
  const columnHelper = createColumnHelper<ApplicationType>()

  // Spalten-Definition für die Application-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => <Chip label={info.getValue()} size="small" />,
      }),
      columnHelper.accessor('criticality', {
        header: 'Kritikalität',
        cell: info => getCriticalityLabel(info.getValue() as CriticalityLevel),
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
      columnHelper.accessor('costs', {
        header: 'Kosten',
        cell: info => formatCosts(info.getValue()),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Erstellt',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert',
        cell: info => formatDate(info.getValue()),
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
      ownerId: app.owners && app.owners.length > 0 ? app.owners[0].id : '',
      vendor: app.vendor ?? '',
      costs: app.costs ?? 0,
      techStack: app.technologyStack ?? [],
      usesDataObjectIds: app.usesDataObjects?.map(obj => obj.id) ?? [],
      interfacesToApplicationIds: app.interfacesToApplications?.map(a => a.id) ?? [],
    }
  }

  return (
    <GenericTable
      data={applications}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onRowClick={onRowClick}
      onEditClick={onEditClick}
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
      additionalProps={{
        availableTechStack,
      }}
    />
  )
}

export default ApplicationTableWithGenericTable
