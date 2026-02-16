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
import { GET_GOALS, CREATE_GOAL, UPDATE_GOAL, DELETE_GOAL } from '@/graphql/goal'
import GoalForm, { GoalFormValues } from '@/components/goals/GoalForm'
import GoalTable, { GOAL_DEFAULT_COLUMN_VISIBILITY } from '@/components/goals/GoalTable'
import GoalToolbar from '@/components/goals/GoalToolbar'
import GoalFilterDialog from '@/components/goals/GoalFilterDialog'
import { useGoalFilter } from '@/components/goals/useGoalFilter'
import { FilterState } from '@/components/goals/types'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const GoalsPage = () => {
  const t = useTranslations('goals')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'goals',
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
  const { loading, error, data, refetch } = useQuery(GET_GOALS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const goals = useMemo(() => data?.geaGoals || [], [data?.geaGoals])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const { filterState, setFilterState, filteredGoals, resetFilters } = useGoalFilter({
    goals,
  })

  const [createGoal, { loading: isCreating }] = useMutation(CREATE_GOAL, {
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

  const [updateGoal, { loading: isUpdating }] = useMutation(UPDATE_GOAL, {
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

  const [deleteGoal] = useMutation(DELETE_GOAL, {
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

  const handleCreateGoalSubmit = async (data: GoalFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: data.name,
      goalStatement: data.goalStatement,
      ...(data.ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
            },
          }
        : {}),
      ...(data.operationalizesVisionsRelations && data.operationalizesVisionsRelations.length > 0
        ? {
            operationalizesVisions: {
              connect: data.operationalizesVisionsRelations.map(relation => ({
                edge: { score: relation.score },
                where: { node: { id: { eq: relation.visionId } } },
              })),
            },
          }
        : {}),
      ...(data.supportsMissionsRelations && data.supportsMissionsRelations.length > 0
        ? {
            supportsMissions: {
              connect: data.supportsMissionsRelations.map(relation => ({
                edge: { score: relation.score },
                where: { node: { id: { eq: relation.missionId } } },
              })),
            },
          }
        : {}),
      ...(data.supportsValuesRelations && data.supportsValuesRelations.length > 0
        ? {
            supportsValues: {
              connect: data.supportsValuesRelations.map(relation => ({
                edge: { score: relation.score },
                where: { node: { id: { eq: relation.valueId } } },
              })),
            },
          }
        : {}),
      ...(data.achievedByStrategiesRelations && data.achievedByStrategiesRelations.length > 0
        ? {
            achievedByStrategies: {
              connect: data.achievedByStrategiesRelations.map(relation => ({
                edge: { score: relation.score },
                where: { node: { id: { eq: relation.strategyId } } },
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

    await createGoal({
      variables: { input: [input] },
      refetchQueries: [{ query: GET_GOALS, variables: { where: companyWhere } }],
      awaitRefetchQueries: true,
    })

    setShowNewGoalForm(false)
  }

  const handleUpdateGoalSubmit = async (id: string, data: GoalFormValues) => {
    const input: Record<string, any> = {
      name: { set: data.name },
      goalStatement: { set: data.goalStatement },
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

    if (data.operationalizesVisionsRelations && data.operationalizesVisionsRelations.length > 0) {
      input.operationalizesVisions = {
        disconnect: [{ where: {} }],
        connect: data.operationalizesVisionsRelations.map(relation => ({
          edge: { score: relation.score },
          where: { node: { id: { eq: relation.visionId } } },
        })),
      }
    } else {
      input.operationalizesVisions = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.supportsMissionsRelations && data.supportsMissionsRelations.length > 0) {
      input.supportsMissions = {
        disconnect: [{ where: {} }],
        connect: data.supportsMissionsRelations.map(relation => ({
          edge: { score: relation.score },
          where: { node: { id: { eq: relation.missionId } } },
        })),
      }
    } else {
      input.supportsMissions = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.supportsValuesRelations && data.supportsValuesRelations.length > 0) {
      input.supportsValues = {
        disconnect: [{ where: {} }],
        connect: data.supportsValuesRelations.map(relation => ({
          edge: { score: relation.score },
          where: { node: { id: { eq: relation.valueId } } },
        })),
      }
    } else {
      input.supportsValues = {
        disconnect: [{ where: {} }],
      }
    }

    if (
      data.achievedByStrategiesRelations &&
      data.achievedByStrategiesRelations.length > 0
    ) {
      input.achievedByStrategies = {
        disconnect: [{ where: {} }],
        connect: data.achievedByStrategiesRelations.map(relation => ({
          edge: { score: relation.score },
          where: { node: { id: { eq: relation.strategyId } } },
        })),
      }
    } else {
      input.achievedByStrategies = {
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

    await updateGoal({
      variables: { id, input },
    })
  }

  const handleDeleteGoal = async (id: string) => {
    await deleteGoal({
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
            onClick={() => setShowNewGoalForm(true)}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <GoalToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={GOAL_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <GoalTable
            id="goal-table"
            goals={filteredGoals}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateGoal={handleCreateGoalSubmit}
            onUpdateGoal={handleUpdateGoalSubmit}
            onDeleteGoal={handleDeleteGoal}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <GoalFilterDialog
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

      {showNewGoalForm && (
        <GoalForm
          isOpen={showNewGoalForm}
          onClose={() => setShowNewGoalForm(false)}
          onSubmit={handleCreateGoalSubmit}
          mode="create"
          loading={isCreating || isUpdating}
        />
      )}
    </Box>
  )
}

export default GoalsPage
