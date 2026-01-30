import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { GenericTable } from '../common/GenericTable'
import { Person as BasePerson } from './types'
import { PersonFormValues } from './PersonForm'
import PersonForm from './PersonForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import usePersistentColumnVisibility from '../../hooks/usePersistentColumnVisibility'
import { formatDate } from './utils'

// Exported default column visibility for Person
export const PERSON_DEFAULT_COLUMN_VISIBILITY = {
  // Standardmäßig sichtbare Spalten
  firstName: true,
  lastName: true,
  email: true,
  department: true,
  role: true,
  phone: true,
  // Standardmäßig versteckte Spalten
  id: false,
  companies: false,
  ownedCapabilities: false,
  ownedApplications: false,
  ownedDataObjects: false,
  ownedArchitectures: false,
  ownedDiagrams: false,
  ownedInfrastructure: false,
  ownedInterfaces: false,
  createdAt: false,
  updatedAt: false,
}

interface PersonTableProps {
  id?: string
  persons: PersonWithCompany[]
  loading: boolean
  globalFilter: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onCreatePerson?: (data: PersonFormValues) => Promise<void>
  onUpdatePerson?: (id: string, data: PersonFormValues) => Promise<void>
  onDeletePerson?: (id: string) => Promise<void>
  onTableReady?: (table: any) => void
  // These props are now optional as persistence is handled internally
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void
}

type PersonWithCompany = BasePerson

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
  // columnVisibility: _externalColumnVisibility,
  // onColumnVisibilityChange: _externalOnColumnVisibilityChange,
}) => {
  const t = useTranslations('persons.table')
  const tPersons = useTranslations('persons')
  const locale = useLocale()
  const columnHelper = createColumnHelper<PersonWithCompany>()

  // Verwende persistente Spaltensichtbarkeit
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'persons',
    defaultColumnVisibility: PERSON_DEFAULT_COLUMN_VISIBILITY,
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    if (onTableReady) {
      onTableReady(table)
    }
  }

  // Column definition for Person-Tabelle
  const columns = useMemo(
    () => [
      // ID (versteckt per Default)
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
        enableHiding: true,
      }),
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
      // Companies (versteckt per Default)
      columnHelper.accessor('companies', {
        header: 'Companies',
        cell: info => {
          const companies = info.getValue() as Array<{ id: string; name: string }> | undefined
          return companies && companies.length > 0 ? companies.map(c => c.name).join(', ') : '-'
        },
        enableHiding: true,
        enableSorting: false,
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
      columnHelper.accessor('ownedInterfaces', {
        header: t('ownedInterfaces'),
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

  // Mapping from Person to expected FormValues for form
  const mapToFormValues = (person: PersonWithCompany): PersonFormValues => {
    return {
      firstName: person.firstName ?? '',
      lastName: person.lastName ?? '',
      email: person.email ?? null,
      department: person.department ?? null,
      role: person.role ?? null,
      phone: person.phone ?? null,
      // Für Admin-Form: initiale Company IDs
      companyIds: person.companies ? person.companies.map(c => c.id) : [],
    }
  }

  return (
    <GenericTable<PersonWithCompany, PersonFormValues>
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
      getIdFromData={(item: PersonWithCompany) => item.id}
      mapDataToFormValues={mapToFormValues}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onTableReady={handleTableReady}
    />
  )
}

export default PersonTableWithGenericTable
