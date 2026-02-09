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
import { GET_STRATEGIES, CREATE_STRATEGY, UPDATE_STRATEGY, DELETE_STRATEGY } from '@/graphql/strategy'
import StrategyForm, { StrategyFormValues } from '@/components/strategies/StrategyForm'
import StrategyTable, { STRATEGY_DEFAULT_COLUMN_VISIBILITY } from '@/components/strategies/StrategyTable'
import StrategyToolbar from '@/components/strategies/StrategyToolbar'
import StrategyFilterDialog from '@/components/strategies/StrategyFilterDialog'
import { useStrategyFilter } from '@/components/strategies/useStrategyFilter'
import { FilterState } from '@/components/strategies/types'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const StrategiesPage = () => {
  const t = useTranslations('strategies')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)
  const [showNewStrategyForm, setShowNewStrategyForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'strategies',
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
  const { loading, error, data, refetch } = useQuery(GET_STRATEGIES, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const strategies = useMemo(() => data?.geaStrategies || [], [data?.geaStrategies])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const { filterState, setFilterState, filteredStrategies, resetFilters } = useStrategyFilter({
    strategies,
  })

  const [createStrategy, { loading: isCreating }] = useMutation(CREATE_STRATEGY, {
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

  const [updateStrategy, { loading: isUpdating }] = useMutation(UPDATE_STRATEGY, {
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

  const [deleteStrategy] = useMutation(DELETE_STRATEGY, {
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

  const handleCreateStrategySubmit = async (data: StrategyFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: data.name,
      description: data.description,
      ...(data.ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
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

    await createStrategy({
      variables: { input: [input] },
      refetchQueries: [{ query: GET_STRATEGIES, variables: { where: companyWhere } }],
      awaitRefetchQueries: true,
    })

    setShowNewStrategyForm(false)
  }

  const handleUpdateStrategySubmit = async (id: string, data: StrategyFormValues) => {
    const input: Record<string, any> = {
      name: { set: data.name },
      description: { set: data.description },
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

    await updateStrategy({
      variables: { id, input },
    })
  }

  const handleDeleteStrategy = async (id: string) => {
    await deleteStrategy({
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
            onClick={() => setShowNewStrategyForm(true)}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <StrategyToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={STRATEGY_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <StrategyTable
            id="strategy-table"
            strategies={filteredStrategies}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateStrategy={handleCreateStrategySubmit}
            onUpdateStrategy={handleUpdateStrategySubmit}
            onDeleteStrategy={handleDeleteStrategy}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <StrategyFilterDialog
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

      {showNewStrategyForm && (
        <StrategyForm
          isOpen={showNewStrategyForm}
          onClose={() => setShowNewStrategyForm(false)}
          onSubmit={handleCreateStrategySubmit}
          mode="create"
          loading={isCreating || isUpdating}
        />
      )}
    </Box>
  )
}

export default StrategiesPage
