'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useAuth, isArchitect } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import { GET_PERSONS, CREATE_PERSON, UPDATE_PERSON, DELETE_PERSON } from '@/graphql/person'
import PersonForm, { PersonFormValues } from '@/components/persons/PersonForm'

// Importiere die ausgelagerten Komponenten
import PersonTable, { PERSON_DEFAULT_COLUMN_VISIBILITY } from '@/components/persons/PersonTable'
import PersonToolbar from '@/components/persons/PersonToolbar'
import PersonFilterDialog from '@/components/persons/PersonFilterDialog'
import { usePersonFilter } from '@/components/persons/usePersonFilter'
import { Person, FilterState } from '@/components/persons/types'

function PersonsPage() {
  const t = useTranslations('persons')
  const { authenticated, initialized } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'lastName', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter-Zustand
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Liste der verfügbaren Abteilungen und Rollen aus den Daten extrahieren
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([])
  const [availableRoles, setAvailableRoles] = useState<string[]>([])

  // State für das neue Person-Formular
  const [showNewPersonForm, setShowNewPersonForm] = useState(false)

  // Personen laden - Auth-Check erfolgt bereits in layout.tsx
  const { loading, error, data, refetch } = useQuery(GET_PERSONS, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
  })

  // Verfügbare Abteilungen und Rollen aus den geladenen Daten extrahieren
  useEffect(() => {
    if (data?.people?.length) {
      const persons = data.people as Person[]

      // Alle Abteilungen extrahieren und Duplikate entfernen
      const allDepartments: string[] = persons
        .map((person: Person) => person.department)
        .filter(Boolean) as string[]

      const uniqueDepartments = Array.from(new Set(allDepartments)).sort()
      setAvailableDepartments(uniqueDepartments)

      // Alle Rollen extrahieren und Duplikate entfernen
      const allRoles: string[] = persons
        .map((person: Person) => person.role)
        .filter(Boolean) as string[]

      const uniqueRoles = Array.from(new Set(allRoles)).sort()
      setAvailableRoles(uniqueRoles)
    }
  }, [data])

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Personen', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const persons = data?.people || []

  // Filter-Hook verwenden (Pattern 2)
  const { filterState, setFilterState, filteredPersons: filteredData, resetFilters } = usePersonFilter({ persons })

  // Mutation zum Erstellen einer neuen Person
  const [createPerson, { loading: isCreating }] = useMutation(CREATE_PERSON, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(t('messages.createError') + `: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Aktualisieren einer bestehenden Person
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(t('messages.updateError') + `: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Löschen einer Person
  const [deletePerson] = useMutation(DELETE_PERSON, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(t('messages.deleteError') + `: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Erstellen einer neuen Person
  const handleCreatePersonSubmit = async (data: PersonFormValues) => {
    const input = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      department: data.department,
      role: data.role,
      phone: data.phone,
    }

    await createPerson({
      variables: { input: [input] },
    })

    // Formular nach dem Erstellen schließen
    setShowNewPersonForm(false)
  }

  // Handler für das Aktualisieren einer bestehenden Person
  const handleUpdatePersonSubmit = async (id: string, data: PersonFormValues) => {
    // Basis-Input-Daten vorbereiten
    const input = {
      firstName: { set: data.firstName },
      lastName: { set: data.lastName },
      email: { set: data.email },
      department: { set: data.department },
      role: { set: data.role },
      phone: { set: data.phone },
    }

    await updatePerson({
      variables: { id, input },
    })
  }

  // Neue Person erstellen
  const handleCreatePerson = () => {
    setShowNewPersonForm(true)
  }

  // Person löschen
  const handleDeletePerson = async (id: string) => {
    await deletePerson({
      variables: { id },
    })
    // Automatisches Schließen erfolgt durch die PersonForm selbst
  }

  // Filter-Handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Filter zurücksetzen
  const handleResetFilter = () => {
    resetFilters()
    setActiveFiltersCount(0)
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePerson}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <PersonToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={PERSON_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <PersonTable
            id="person-table"
            persons={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreatePerson={handleCreatePersonSubmit}
            onUpdatePerson={handleUpdatePersonSubmit}
            onDeletePerson={handleDeletePerson}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <PersonFilterDialog
          filterState={filterState}
          availableDepartments={availableDepartments}
          availableRoles={availableRoles}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Formular für neue Person */}
      {showNewPersonForm && (
        <PersonForm
          isOpen={showNewPersonForm}
          onClose={() => setShowNewPersonForm(false)}
          onSubmit={handleCreatePersonSubmit}
          mode="create"
          loading={isCreating}
        />
      )}
    </Box>
  )
}

export default PersonsPage
