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
import { GET_VISIONS, CREATE_VISION, UPDATE_VISION, DELETE_VISION } from '@/graphql/vision'
import VisionForm, { VisionFormValues } from '@/components/visions/VisionForm'
import VisionTable, { VISION_DEFAULT_COLUMN_VISIBILITY } from '@/components/visions/VisionTable'
import VisionToolbar from '@/components/visions/VisionToolbar'
import VisionFilterDialog from '@/components/visions/VisionFilterDialog'
import { useVisionFilter } from '@/components/visions/useVisionFilter'
import { FilterState } from '@/components/visions/types'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const VisionsPage = () => {
  const t = useTranslations('visions')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)
  const [showNewVisionForm, setShowNewVisionForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'visions',
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
  const { loading, error, data, refetch } = useQuery(GET_VISIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const visions = useMemo(() => data?.geaVisions || [], [data?.geaVisions])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const { filterState, setFilterState, filteredVisions, resetFilters } = useVisionFilter({
    visions,
  })

  const [createVision, { loading: isCreating }] = useMutation(CREATE_VISION, {
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

  const [updateVision, { loading: isUpdating }] = useMutation(UPDATE_VISION, {
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

  const [deleteVision] = useMutation(DELETE_VISION, {
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

  const handleCreateVisionSubmit = async (data: VisionFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: data.name,
      description: data.description,
      year: data.year.toISOString().split('T')[0],
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

    await createVision({
      variables: { input: [input] },
      refetchQueries: [{ query: GET_VISIONS, variables: { where: companyWhere } }],
      awaitRefetchQueries: true,
    })

    setShowNewVisionForm(false)
  }

  const handleUpdateVisionSubmit = async (id: string, data: VisionFormValues) => {
    const input: Record<string, any> = {
      name: { set: data.name },
      description: { set: data.description },
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

    await updateVision({
      variables: { id, input },
    })
  }

  const handleDeleteVision = async (id: string) => {
    await deleteVision({
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
            onClick={() => setShowNewVisionForm(true)}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <VisionToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={VISION_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <VisionTable
            id="vision-table"
            visions={filteredVisions}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateVision={handleCreateVisionSubmit}
            onUpdateVision={handleUpdateVisionSubmit}
            onDeleteVision={handleDeleteVision}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <VisionFilterDialog
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

      {showNewVisionForm && (
        <VisionForm
          isOpen={showNewVisionForm}
          onClose={() => setShowNewVisionForm(false)}
          onSubmit={handleCreateVisionSubmit}
          mode="create"
          loading={isCreating || isUpdating}
        />
      )}
    </Box>
  )
}

export default VisionsPage
