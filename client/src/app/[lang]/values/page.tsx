'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { isArchitect } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_VALUES, CREATE_VALUE, UPDATE_VALUE, DELETE_VALUE } from '@/graphql/value'
import ValueForm, { ValueFormValues } from '@/components/values/ValueForm'
import ValueTable, { VALUE_DEFAULT_COLUMN_VISIBILITY } from '@/components/values/ValueTable'
import ValueToolbar from '@/components/values/ValueToolbar'
import ValueFilterDialog from '@/components/values/ValueFilterDialog'
import { useValueFilter } from '@/components/values/useValueFilter'
import { FilterState } from '@/components/values/types'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const ValuesPage = () => {
  const t = useTranslations('values')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)
  const [showNewValueForm, setShowNewValueForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'values',
    defaultColumnVisibility: {
      name: true,
      owners: true,
      partOfArchitectures: true,
      depictedInDiagrams: true,
      createdAt: true,
      updatedAt: true,
      actions: true,
    },
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

  const companyWhere = useCompanyWhere('company')
  const { loading, error, data, refetch } = useQuery(GET_VALUES, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const values = useMemo(() => data?.geaValues || [], [data?.geaValues])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const { filterState, setFilterState, filteredValues, resetFilters } = useValueFilter({
    values,
  })

  const [createValue, { loading: isCreating }] = useMutation(CREATE_VALUE, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch({ where: companyWhere })
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.createError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const [updateValue, { loading: isUpdating }] = useMutation(UPDATE_VALUE, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.updateError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const [deleteValue] = useMutation(DELETE_VALUE, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.deleteError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const handleCreateValueSubmit = async (data: ValueFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: data.name,
      valueStatement: data.valueStatement,
      ...(data.ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
            },
          }
        : {}),
      ...(data.supportsMissions && data.supportsMissions.length > 0
        ? {
            supportsMissions: {
              connect: data.supportsMissions.map(id => ({
                edge: { score: 0 },
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(data.supportsVisions && data.supportsVisions.length > 0
        ? {
            supportsVisions: {
              connect: data.supportsVisions.map(id => ({
                edge: { score: 0 },
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(data.partOfArchitectures && data.partOfArchitectures.length > 0
        ? {
            partOfArchitectures: {
              connect: data.partOfArchitectures.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(data.depictedInDiagrams && data.depictedInDiagrams.length > 0
        ? {
            depictedInDiagrams: {
              connect: data.depictedInDiagrams.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      company: {
        connect: [
          {
            where: { node: { id: { eq: selectedCompanyId } } },
          },
        ],
      },
    }

    await createValue({
      variables: { input: [input] },
      refetchQueries: [{ query: GET_VALUES, variables: { where: companyWhere } }],
      awaitRefetchQueries: true,
    })

    setShowNewValueForm(false)
  }

  const handleUpdateValueSubmit = async (id: string, data: ValueFormValues) => {
    const input: Record<string, any> = {
      name: { set: data.name },
      valueStatement: { set: data.valueStatement },
    }

    if (data.ownerId) {
      input.owners = {
        disconnect: [{ where: {} }],
        connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
      }
    } else {
      input.owners = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.supportsMissions && data.supportsMissions.length > 0) {
      input.supportsMissions = {
        disconnect: [{ where: {} }],
        connect: data.supportsMissions.map(id => ({
          edge: { score: 0 },
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.supportsMissions = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.supportsVisions && data.supportsVisions.length > 0) {
      input.supportsVisions = {
        disconnect: [{ where: {} }],
        connect: data.supportsVisions.map(id => ({
          edge: { score: 0 },
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.supportsVisions = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.partOfArchitectures && data.partOfArchitectures.length > 0) {
      input.partOfArchitectures = {
        disconnect: [{ where: {} }],
        connect: data.partOfArchitectures.map(id => ({
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.partOfArchitectures = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.depictedInDiagrams && data.depictedInDiagrams.length > 0) {
      input.depictedInDiagrams = {
        disconnect: [{ where: {} }],
        connect: data.depictedInDiagrams.map(id => ({
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.depictedInDiagrams = {
        disconnect: [{ where: {} }],
      }
    }

    await updateValue({
      variables: { id, input },
    })
  }

  const handleDeleteValue = async (id: string) => {
    await deleteValue({
      variables: { id },
    })
  }

  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

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
            onClick={() => setShowNewValueForm(true)}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <ValueToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={VALUE_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <ValueTable
            id="value-table"
            values={filteredValues}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateValue={handleCreateValueSubmit}
            onUpdateValue={handleUpdateValueSubmit}
            onDeleteValue={handleDeleteValue}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <ValueFilterDialog
          filterState={filterState}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {showNewValueForm && (
        <ValueForm
          isOpen={showNewValueForm}
          onClose={() => setShowNewValueForm(false)}
          onSubmit={handleCreateValueSubmit}
          mode="create"
          loading={isCreating || isUpdating}
        />
      )}
    </Box>
  )
}

export default ValuesPage
