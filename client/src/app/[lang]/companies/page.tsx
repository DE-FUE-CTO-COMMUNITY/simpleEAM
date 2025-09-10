'use client'

import React, { useState, useMemo } from 'react'
import { Box, Typography, Button, Paper, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

import { GET_COMPANIES, CREATE_COMPANY, UPDATE_COMPANY, DELETE_COMPANY } from '@/graphql/company'
import { CompanySize } from '@/gql/generated'
import CompanyForm from '@/components/companies/CompanyForm'

// Importiere die ausgelagerten Komponenten
import CompanyTable from '@/components/companies/CompanyTable'
import CompanyToolbar from '@/components/companies/CompanyToolbar'
import CompanyFilterDialog from '@/components/companies/CompanyFilterDialog'
import { useCompanyFilter } from '@/components/companies/useCompanyFilter'
import { CompanyType, CompanyFormValues } from '@/components/companies/types'

const CompaniesPage = () => {
  // Admin-Guard analog zur Admin-Seite
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  React.useEffect(() => {
    if (!isAdmin()) {
      redirect('/')
    } else {
      setIsAuthorized(true)
    }
  }, [])
  const t = useTranslations('companies')
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Apollo Client-Operationen
  const { data, loading, error } = useQuery(GET_COMPANIES, { skip: !isAuthorized })
  const [createCompanyMutation] = useMutation(CREATE_COMPANY)
  const [updateCompanyMutation] = useMutation(UPDATE_COMPANY)
  const [deleteCompanyMutation] = useMutation(DELETE_COMPANY)

  // Filter Hook
  const { filterState, setFilterState, filteredCompanies, resetFilters } = useCompanyFilter({
    companies: data?.companies || [],
  })

  // Dialog-States
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false)

  // Verfügbare Werte für Filter extrahieren
  const availableValues = useMemo(() => {
    const companies = data?.companies || []

    return {
      industry: Array.from(new Set(companies.map((c: any) => c.industry).filter(Boolean))).sort(),
      size: Object.values(CompanySize),
      createdAt: companies.map((c: any) => c.createdAt).filter(Boolean),
      updatedAt: companies.map((c: any) => c.updatedAt).filter(Boolean),
    }
  }, [data?.companies])

  // Company löschen - Handler für CompanyForm
  const handleDeleteCompany = async (id: string) => {
    await deleteCompanyMutation({
      variables: { id },
      refetchQueries: [{ query: GET_COMPANIES }],
    })
  }

  const handleUpdateCompany = async (company: CompanyType, values: CompanyFormValues) => {
    try {
      const employeesUpdate = values.employees
        ? [
            {
              // Erst alle bestehenden Verbindungen trennen
              disconnect: [
                {
                  where: {}, // Trennt alle aktuellen Employee-Verbindungen
                },
              ],
              // Dann neue Verbindungen hinzufügen
              connect: values.employees.map(employeeId => ({
                where: { node: { id: { eq: employeeId } } },
              })),
            },
          ]
        : [
            {
              // Wenn employees leer ist, alle Verbindungen trennen
              disconnect: [
                {
                  where: {},
                },
              ],
            },
          ]

      await updateCompanyMutation({
        variables: {
          id: company.id,
          input: {
            name: { set: values.name },
            description: { set: values.description },
            address: { set: values.address },
            industry: { set: values.industry },
            website: { set: values.website },
            size: { set: values.size },
            employees: employeesUpdate,
          },
        },
        refetchQueries: [{ query: GET_COMPANIES }],
      })
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren der Company:', error)
      enqueueSnackbar(t('messages.updateError'), { variant: 'error' })
    }
  }

  // Neue Company erstellen
  const handleCreateCompany = () => {
    // Warten, bis die Daten geladen sind, bevor das Formular geöffnet wird
    if (loading || !data?.companies) {
      enqueueSnackbar('Bitte warten Sie, bis die Daten geladen sind.', { variant: 'info' })
      return
    }
    setShowNewCompanyForm(true)
  }

  // Aktive Filter zählen
  const activeFiltersCount = useMemo(() => {
    return Object.values(filterState).filter(value => {
      if (Array.isArray(value)) return value.length > 0
      if (value === null || value === undefined) return false
      if (typeof value === 'string') return value.trim() !== ''
      return true
    }).length
  }, [filterState])

  // Error Handling
  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          {t('messages.loadError')}: {(error as any)?.message || 'Unknown error'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateCompany}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CompanyToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onAddClick={() => {
            // Create wird über GenericTable gehandhabt
          }}
          onFilterClick={() => setFilterDialogOpen(true)}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={resetFilters}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <CompanyTable
            companies={filteredCompanies}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onUpdateCompany={async (companyId, data) => {
              await handleUpdateCompany({ id: companyId } as CompanyType, data)
            }}
            onDeleteCompany={handleDeleteCompany}
          />
        </Paper>
      </Card>

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <CompanyFilterDialog
          filterState={filterState}
          onFilterChange={newFilters => setFilterState(prev => ({ ...prev, ...newFilters }))}
          availableIndustries={availableValues.industry as string[]}
          availableSizes={availableValues.size}
          onResetFilter={resetFilters}
          onClose={() => setFilterDialogOpen(false)}
          onApply={_activeCount => {
            setFilterDialogOpen(false)
          }}
        />
      )}

      {/* Company Create Form */}
      {showNewCompanyForm && (
        <CompanyForm
          isOpen={showNewCompanyForm}
          onClose={() => setShowNewCompanyForm(false)}
          mode="create"
          onSubmit={async (values: CompanyFormValues) => {
            try {
              const createInput = {
                name: values.name,
                description: values.description,
                address: values.address,
                industry: values.industry,
                website: values.website,
                size: values.size,
                employees: values.employees?.length
                  ? {
                      connect: values.employees.map(employeeId => ({
                        where: { node: { id: { eq: employeeId } } },
                      })),
                    }
                  : undefined,
              }

              await createCompanyMutation({
                variables: { input: [createInput] }, // Array für createCompanies
                refetchQueries: [{ query: GET_COMPANIES }],
              })
              enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
              setShowNewCompanyForm(false)
            } catch (error) {
              console.error('Fehler beim Erstellen der Company:', error)
              enqueueSnackbar(t('messages.createError'), { variant: 'error' })
            }
          }}
          onDelete={handleDeleteCompany}
        />
      )}
    </Box>
  )
}

export default CompaniesPage
