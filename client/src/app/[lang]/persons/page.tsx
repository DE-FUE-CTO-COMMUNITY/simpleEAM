'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useAuth, isArchitect, isAdmin } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import { GET_PERSONS, CREATE_PERSON, UPDATE_PERSON, DELETE_PERSON } from '@/graphql/person'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import PersonForm, { PersonFormValues } from '@/components/persons/PersonForm'

// Import the extracted components
import PersonTable, { PERSON_DEFAULT_COLUMN_VISIBILITY } from '@/components/persons/PersonTable'
import PersonToolbar from '@/components/persons/PersonToolbar'
import PersonFilterDialog from '@/components/persons/PersonFilterDialog'
import { usePersonFilter } from '@/components/persons/usePersonFilter'
import { Person, FilterState } from '@/components/persons/types'
import { useCompanyContext } from '@/contexts/CompanyContext'

function PersonsPage() {
  const t = useTranslations('persons')
  const { authenticated, initialized, keycloak } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'lastName', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter-Zustand
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Extract list of available values from the data
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([])
  const [availableRoles, setAvailableRoles] = useState<string[]>([])

  // State for the new Person form
  const [showNewPersonForm, setShowNewPersonForm] = useState(false)

  // Personen laden - Auth-Check erfolgt bereits in layout.tsx
  const companyWhere = useCompanyWhere('company')
  // Admins sollen zusätzlich Personen ohne Company sehen: OR(companyWhere, company: { none: {} })
  const where = React.useMemo(() => {
    if (isAdmin()) {
      const noCompany = {
        companyConnection: { aggregate: { count: { nodes: { eq: 0 } } } },
      } as const
      return companyWhere ? { OR: [companyWhere as any, noCompany] } : (noCompany as any)
    }
    return companyWhere as any
  }, [companyWhere])

  const { loading, error, data, refetch } = useQuery(GET_PERSONS, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where },
  })

  // Extract available values from loaded data
  useEffect(() => {
    if (data?.people?.length) {
      const persons = data.people as Person[]

      // Extract all values and remove duplicates
      const allDepartments: string[] = persons
        .map((person: Person) => person.department)
        .filter(Boolean) as string[]

      const uniqueDepartments = Array.from(new Set(allDepartments)).sort()
      setAvailableDepartments(uniqueDepartments)

      // Extract all values and remove duplicates
      const allRoles: string[] = persons
        .map((person: Person) => person.role)
        .filter(Boolean) as string[]

      const uniqueRoles = Array.from(new Set(allRoles)).sort()
      setAvailableRoles(uniqueRoles)
    }
  }, [data])

  // Error handling
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Personen', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const persons = data?.people || []

  // Filter-Hook verwenden (Pattern 2)
  const {
    filterState,
    setFilterState,
    filteredPersons: filteredData,
    resetFilters,
  } = usePersonFilter({ persons })

  // Mutation for creating a new Person
  const [createPerson, { loading: isCreating }] = useMutation(CREATE_PERSON, {
    onCompleted: async res => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch()
      // Nach erfolgreichem Erstellen: company_ids in Keycloak anhand der E-Mail synchronisieren
      try {
        const email: string | undefined = res?.createPeople?.people?.[0]?.email
        if (email && isAdmin() && keycloak?.token) {
          await fetch('/api/admin/sync-company-ids/by-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keycloak.token}`,
            },
            body: JSON.stringify({ email }),
          })
        }
      } catch (e) {
        console.error('Fehler bei company_ids Sync (create):', e)
      }
    },
    onError: error => {
      enqueueSnackbar(t('messages.createError') + `: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation for updating an existing Person
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    onCompleted: async res => {
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      refetch()
      // Nach erfolgreichem Update: company_ids in Keycloak anhand der (ggf. geänderten) E-Mail synchronisieren
      try {
        const email: string | undefined = res?.updatePeople?.people?.[0]?.email
        if (email && isAdmin() && keycloak?.token) {
          await fetch('/api/admin/sync-company-ids/by-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keycloak.token}`,
            },
            body: JSON.stringify({ email }),
          })
        }
      } catch (e) {
        console.error('Fehler bei company_ids Sync (update):', e)
      }
    },
    onError: error => {
      enqueueSnackbar(t('messages.updateError') + `: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation for deleting a Person
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

  // Handler for creating a new Person
  const handleCreatePersonSubmit = async (data: PersonFormValues) => {
    const input = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      department: data.department,
      role: data.role,
      phone: data.phone,
    }

    // Admin: Companies zuordnen (optional)
    if (isAdmin() && (data as any).companyIds && (data as any).companyIds.length > 0) {
      const companyIds: string[] = (data as any).companyIds
      const inputAny = input as any
      inputAny.company = {
        connect: companyIds.map(id => ({ where: { node: { id: { eq: id } } } })),
      }
    } else if (selectedCompanyId) {
      // Nicht-Admin: Immer aktuelle Company verbinden
      const inputAny = input as any
      inputAny.company = {
        connect: [
          {
            where: { node: { id: { eq: selectedCompanyId } } },
          },
        ],
      }
    } else {
      enqueueSnackbar('Please select a company first.', { variant: 'warning' })
      return
    }

    await createPerson({
      variables: { input: [input] },
    })

    // Close form after creating
    setShowNewPersonForm(false)
  }

  // Handler for updating an existing Person
  const handleUpdatePersonSubmit = async (id: string, data: PersonFormValues) => {
    // Prepare base input data
    const input = {
      firstName: { set: data.firstName },
      lastName: { set: data.lastName },
      email: { set: data.email },
      department: { set: data.department },
      role: { set: data.role },
      phone: { set: data.phone },
    }

    // Admin: Company-Zuordnung setzen (ersetzen)
    if (isAdmin()) {
      const companyIds: string[] = ((data as any).companyIds || []) as string[]
      const inputAny = input as any
      inputAny.company = [
        {
          disconnect: [{ where: {} }],
        },
      ]
      if (companyIds.length > 0) {
        inputAny.company.push({
          connect: companyIds.map(id => ({ where: { node: { id: { eq: id } } } })),
        })
      }
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

  // Filter handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Reset filter
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
            disabled={!selectedCompanyId && !isAdmin()}
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
