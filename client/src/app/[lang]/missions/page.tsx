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
import { GET_MISSIONS, CREATE_MISSION, UPDATE_MISSION, DELETE_MISSION } from '@/graphql/mission'
import MissionForm, { MissionFormValues } from '@/components/missions/MissionForm'
import MissionTable, { MISSION_DEFAULT_COLUMN_VISIBILITY } from '@/components/missions/MissionTable'
import MissionToolbar from '@/components/missions/MissionToolbar'
import MissionFilterDialog from '@/components/missions/MissionFilterDialog'
import { useMissionFilter } from '@/components/missions/useMissionFilter'
import { FilterState } from '@/components/missions/types'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const MissionsPage = () => {
  const t = useTranslations('missions')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)
  const [showNewMissionForm, setShowNewMissionForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'missions',
    defaultColumnVisibility: {
      name: true,
      year: true,
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
  const { loading, error, data, refetch } = useQuery(GET_MISSIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const missions = useMemo(() => data?.geaMissions || [], [data?.geaMissions])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const { filterState, setFilterState, filteredMissions, resetFilters } = useMissionFilter({
    missions,
  })

  const [createMission, { loading: isCreating }] = useMutation(CREATE_MISSION, {
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

  const [updateMission, { loading: isUpdating }] = useMutation(UPDATE_MISSION, {
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

  const [deleteMission] = useMutation(DELETE_MISSION, {
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

  const handleCreateMissionSubmit = async (data: MissionFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: data.name,
      purposeStatement: data.purposeStatement,
      keywords: data.keywords,
      year: data.year.toISOString().split('T')[0],
      ...(data.ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
            },
          }
        : {}),
      ...(data.supportedByVisions && data.supportedByVisions.length > 0
        ? {
            supportedByVisions: {
              connect: data.supportedByVisions.map(id => ({
                edge: { score: 0 },
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(data.supportedByValues && data.supportedByValues.length > 0
        ? {
            supportedByValues: {
              connect: data.supportedByValues.map(id => ({
                edge: { score: 0 },
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(data.supportedByGoals && data.supportedByGoals.length > 0
        ? {
            supportedByGoals: {
              connect: data.supportedByGoals.map(id => ({
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

    await createMission({
      variables: { input: [input] },
      refetchQueries: [{ query: GET_MISSIONS, variables: { where: companyWhere } }],
      awaitRefetchQueries: true,
    })

    setShowNewMissionForm(false)
  }

  const handleUpdateMissionSubmit = async (id: string, data: MissionFormValues) => {
    const input: Record<string, any> = {
      name: { set: data.name },
      purposeStatement: { set: data.purposeStatement },
      keywords: { set: data.keywords },
      year: { set: data.year.toISOString().split('T')[0] },
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

    if (data.supportedByVisions && data.supportedByVisions.length > 0) {
      input.supportedByVisions = {
        disconnect: [{ where: {} }],
        connect: data.supportedByVisions.map(id => ({
          edge: { score: 0 },
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.supportedByVisions = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.supportedByValues && data.supportedByValues.length > 0) {
      input.supportedByValues = {
        disconnect: [{ where: {} }],
        connect: data.supportedByValues.map(id => ({
          edge: { score: 0 },
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.supportedByValues = {
        disconnect: [{ where: {} }],
      }
    }

    if (data.supportedByGoals && data.supportedByGoals.length > 0) {
      input.supportedByGoals = {
        disconnect: [{ where: {} }],
        connect: data.supportedByGoals.map(id => ({
          edge: { score: 0 },
          where: { node: { id: { eq: id } } },
        })),
      }
    } else {
      input.supportedByGoals = {
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

    await updateMission({
      variables: { id, input },
    })
  }

  const handleDeleteMission = async (id: string) => {
    await deleteMission({
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
            onClick={() => setShowNewMissionForm(true)}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <MissionToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={MISSION_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <MissionTable
            id="mission-table"
            missions={filteredMissions}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateMission={handleCreateMissionSubmit}
            onUpdateMission={handleUpdateMissionSubmit}
            onDeleteMission={handleDeleteMission}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <MissionFilterDialog
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

      {showNewMissionForm && (
        <MissionForm
          isOpen={showNewMissionForm}
          onClose={() => setShowNewMissionForm(false)}
          onSubmit={handleCreateMissionSubmit}
          mode="create"
          loading={isCreating || isUpdating}
        />
      )}
    </Box>
  )
}

export default MissionsPage
