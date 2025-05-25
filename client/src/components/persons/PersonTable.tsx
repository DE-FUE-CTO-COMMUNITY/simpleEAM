import React, { useMemo } from 'react'
import { GenericTable } from '../common/GenericTable'
import { Person } from './types'
import { PersonFormValues } from './PersonForm'
import PersonForm from './PersonForm'
import { createColumnHelper } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'

// Hilfsfunktion zum Formatieren von Datum
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

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
}) => {
  const columnHelper = createColumnHelper<Person>()

  // Spalten-Definition für die Person-Tabelle
  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: 'Vorname',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('lastName', {
        header: 'Nachname',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: 'E-Mail',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('department', {
        header: 'Abteilung',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('role', {
        header: 'Rolle',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('phone', {
        header: 'Telefon',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('ownedCapabilities', {
        header: 'Verantwortlich für Capabilities',
        cell: info => {
          const capabilities = info.getValue()
          return capabilities && capabilities.length > 0
            ? capabilities.map(cap => cap.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('ownedApplications', {
        header: 'Verantwortlich für Anwendungen',
        cell: info => {
          const applications = info.getValue()
          return applications && applications.length > 0
            ? applications.map(app => app.name).join(', ')
            : '-'
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Erstellt am',
        cell: info => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Aktualisiert am',
        cell: info => formatDate(info.getValue()),
      }),
    ],
    [columnHelper]
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
      emptyMessage="Keine Personen gefunden."
      createButtonLabel="Neue Person erstellen"
      entityName="Person"
      FormComponent={PersonForm}
      getIdFromData={(item: Person) => item.id}
      mapDataToFormValues={mapToFormValues}
    />
  )
}

export default PersonTableWithGenericTable
