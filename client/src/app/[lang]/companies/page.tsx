'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { Box, Typography } from '@mui/material'
import { SortingState } from '@tanstack/react-table'
import CompanyTable from '../../../components/companies/CompanyTable'
import CompanyToolbar from '../../../components/companies/CompanyToolbar'
import CompanyFilterDialog from '../../../components/companies/CompanyFilterDialog'
import { useCompanyFilter } from '../../../components/companies/useCompanyFilter'
import { CompanyFormValues } from '../../../components/companies/types'
import { countActiveFilters } from '../../../components/companies/utils'
import {
  GET_Companies,
  CREATE_Company,
  UPDATE_Company,
  DELETE_Company,
} from '../../../graphql/company'

export default function CompaniesPage() {
  const t = useTranslations('companies')
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  // GraphQL Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_Companies)
  const [createCompany] = useMutation(CREATE_Company)
  const [updateCompany] = useMutation(UPDATE_Company)
  const [deleteCompany] = useMutation(DELETE_Company)

  // Filter Logic
  const companies = data?.companies || []
  const { filter, setFilter, filteredCompanies, resetFilter } = useCompanyFilter({
    companies,
  })

  // Weitere Filterung durch globalen Suchfilter
  const finalCompanies = useMemo(() => {
    if (!globalFilter.trim()) return filteredCompanies
    const searchTerm = globalFilter.toLowerCase()
    return filteredCompanies.filter(
      company =>
        company.name?.toLowerCase().includes(searchTerm) ||
        company.description?.toLowerCase().includes(searchTerm)
    )
  }, [filteredCompanies, globalFilter])

  // CRUD Handlers
  const handleCreate = async (data: CompanyFormValues) => {
    try {
      await createCompany({
        variables: {
          input: {
            name: data.name,
            description: data.description,
            // TODO: Weitere Felder hinzufügen
          },
        },
        refetchQueries: [{ query: GET_Companies }],
      })
    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  }

  const handleUpdate = async (id: string, data: CompanyFormValues) => {
    try {
      await updateCompany({
        variables: {
          id,
          input: {
            name: data.name,
            description: data.description,
            // TODO: Weitere Felder hinzufügen
          },
        },
        refetchQueries: [{ query: GET_Companies }],
      })
    } catch (error) {
      console.error('Error updating company:', error)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany({
        variables: { id },
        refetchQueries: [{ query: GET_Companies }],
      })
    } catch (error) {
      console.error('Error deleting company:', error)
      throw error
    }
  }

  // UI Event Handlers
  const handleAddNew = () => {
    // Die GenericTable zeigt automatisch das Formular an
  }

  const handleFilterOpen = () => {
    setShowFilterDialog(true)
  }

  const handleFilterClose = () => {
    setShowFilterDialog(false)
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          {t('messages.loadError')}: {error.message}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <CompanyToolbar
        onAdd={handleAddNew}
        onFilter={handleFilterOpen}
        totalCount={ companies.length}
        filteredCount={finalCompanies.length}
        activeFiltersCount={countActiveFilters(filter)}
      />

      <CompanyTable
        companies={finalCompanies}
        loading={loading}
        globalFilter={globalFilter}
        sorting={sorting}
        onSortingChange={setSorting}
        onCreateCompany={handleCreate}
        onUpdateCompany={handleUpdate}
        onDeleteCompany={handleDelete}
      />

      <CompanyFilterDialog
        open={showFilterDialog}
        onClose={handleFilterClose}
        filter={filter}
        onFilterChange={setFilter}
        onReset={resetFilter}
      />
    </Box>
  )
}
