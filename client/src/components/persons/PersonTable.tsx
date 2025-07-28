import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { Person } from './types'
import { PersonFormValues } from './PersonForm'
import PersonForm from './PersonForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'
import { formatDate } from './utils'

interface PersonTableProps {
  id?: string
  persons: Person[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreatePerson?: (data: PersonFormValues) => Promise<void>
  onUpdatePerson?: (id: string, data: PersonFormValues) => Promise<void>
  onDeletePerson?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // Diese Props sind jetzt optional, da die Persistierung intern verwaltet wird
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

const PersonTableWithGenericTable: React.FC<PersonTableProps> = ({
  persons,
  loading,
  globalFilter,
  sorting,
  onSortingChange,
  onCreatePerson,
  onUpdatePerson,
  onDeletePerson,
  onTableReady,
  columnVisibility: _externalColumnVisibility,
  onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('persons.table')
  const tPersons = useTranslations('persons')
  const locale = useLocale()
  const columnHelper = createColumnHelper<Person>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'persons',
    defaultColumnVisibility: {
      // Standardmäßig sichtbare Spalten
      firstName: true,
      lastName: true,
      email: true,
      department: true,
      role: true,
      phone: true,
      // Standardmäßig versteckte Spalten
      ownedCapabilities: false,
      ownedApplications: false,
      ownedDataObjects: false,
      ownedArchitectures: false,
      ownedDiagrams: false,
      ownedInfrastructure: false,
      responsibleForInterfaces: false,
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

  // Spalten-Definition für die Person-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: t('firstName'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('lastName', {
        header: t('lastName'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: t('email'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('department', {
        header: t('department'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('role', {
        header: t('role'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('phone', {
        header: t('phoneNumber'),
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('ownedCapabilities', {
        header: t('ownedCapabilities'),
        cell: info => {
          const capabilities = info.getValue()
          return capabilities && capabilities.length > 0
            ? capabilities.map(cap => cap.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('ownedApplications', {
        header: t('ownedApplications'),
        cell: info => {
          const applications = info.getValue()
          return applications && applications.length > 0
            ? applications.map(app => app.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('ownedDataObjects', {
        header: t('ownedDataObjects'),
        cell: info => {
          const dataObjects = info.getValue()
          return dataObjects && dataObjects.length > 0
            ? dataObjects.map(obj => obj.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('ownedArchitectures', {
        header: t('ownedArchitectures'),
        cell: info => {
          const architectures = info.getValue()
          return architectures && architectures.length > 0
            ? architectures.map(arch => arch.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('ownedDiagrams', {
        header: t('ownedDiagrams'),
        cell: info => {
          const diagrams = info.getValue()
          return diagrams && diagrams.length > 0 ? diagrams.map(diag => diag.title).join(', ') : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('ownedInfrastructure', {
        header: t('ownedInfrastructure'),
        cell: info => {
          const infrastructure = info.getValue()
          return infrastructure && infrastructure.length > 0
            ? infrastructure.map(infra => infra.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('responsibleForInterfaces', {
        header: t('responsibleForInterfaces'),
        cell: info => {
          const interfaces = info.getValue()
          return interfaces && interfaces.length > 0
            ? interfaces.map(int => int.name).join(', ')
            : '-'
        },
        enableHiding: true,
      }),
      columnHelper.accessor('createdAt', {
        header: t('createdAt'),
        cell: info => formatDate(info.getValue(), locale),
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updatedAt'),
        cell: info => formatDate(info.getValue(), locale),
      }),
    ],
    [columnHelper, t, locale]
  )

  // Mapping von Person zu den erwarteten FormValues für das Formular
  const mapToFormValues = (person: Person): PersonFormValues => {
    return {
      firstName: person.firstName ?? '',
      lastName: person.lastName ?? '',
      email: person.email ?? null,
      department: person.department ?? null,
      role: person.role ?? null,
      phone: person.phone ?? null,
    }
  }

  return (
    <GenericTable<Person, PersonFormValues>
      data={persons}
      loading={loading}
      globalFilter={globalFilter}
      sorting={sorting}
      onSortingChange={onSortingChange}
      columns={columns}
      onCreate={onCreatePerson}
      onUpdate={onUpdatePerson}
      onDelete={onDeletePerson}
      emptyMessage={tPersons('noPersonsFound')}
      createButtonLabel={tPersons('addNew')}
      entityName={tPersons('title')}
      FormComponent={PersonForm}
      getIdFromData={(item: Person) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default PersonTableWithGenericTable
