'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useMutation, useQuery } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { isArchitect } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import {
  CREATE_HARDWARE_VERSION,
  DELETE_HARDWARE_VERSION,
  GET_HARDWARE_VERSIONS,
  UPDATE_HARDWARE_VERSION,
} from '@/graphql/hardwareVersion'
import { GET_HARDWARE_PRODUCTS } from '@/graphql/hardwareProduct'
import HardwareVersionForm, {
  HardwareVersionFormValues,
} from '@/components/hardware-versions/HardwareVersionForm'
import HardwareVersionTable, {
  HARDWARE_VERSION_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/hardware-versions/HardwareVersionTable'
import HardwareVersionToolbar from '@/components/hardware-versions/HardwareVersionToolbar'
import HardwareVersionFilterDialog from '@/components/hardware-versions/HardwareVersionFilterDialog'
import { useHardwareVersionFilter } from '@/components/hardware-versions/useHardwareVersionFilter'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const HardwareVersionsPage = () => {
  const t = useTranslations('hardwareVersions')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const companyWhere = useCompanyWhere('company')

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([{ id: 'versionModelString', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'hardware-versions',
    defaultColumnVisibility: HARDWARE_VERSION_DEFAULT_COLUMN_VISIBILITY,
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

  const { loading, error, data, refetch } = useQuery(GET_HARDWARE_VERSIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const { data: productsData } = useQuery(GET_HARDWARE_PRODUCTS, {
    variables: { where: companyWhere },
  })

  const hardwareVersions = useMemo(() => data?.hardwareVersions || [], [data?.hardwareVersions])
  const productOptions = useMemo(
    () =>
      (productsData?.hardwareProducts ?? []).map((product: any) => ({
        value: product.id,
        label: product.name,
      })),
    [productsData?.hardwareProducts]
  )

  const { filterState, setFilterState, filteredHardwareVersions, resetFilters } =
    useHardwareVersionFilter({ hardwareVersions })

  const activeFiltersCount = useMemo(() => {
    return (
      (filterState.versionFilter ? 1 : 0) +
      (filterState.productIdFilter ? 1 : 0) +
      (filterState.updatedDateRange[0] || filterState.updatedDateRange[1] ? 1 : 0)
    )
  }, [filterState])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [enqueueSnackbar, error, t])

  const [createHardwareVersion] = useMutation(CREATE_HARDWARE_VERSION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch({ where: companyWhere })
    },
    onError: mutationError => {
      enqueueSnackbar(`${t('messages.createError')}: ${mutationError.message}`, {
        variant: 'error',
      })
    },
  })

  const [updateHardwareVersion] = useMutation(UPDATE_HARDWARE_VERSION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      refetch()
    },
    onError: mutationError => {
      enqueueSnackbar(`${t('messages.updateError')}: ${mutationError.message}`, {
        variant: 'error',
      })
    },
  })

  const [deleteHardwareVersion] = useMutation(DELETE_HARDWARE_VERSION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
      refetch()
    },
    onError: mutationError => {
      enqueueSnackbar(`${t('messages.deleteError')}: ${mutationError.message}`, {
        variant: 'error',
      })
    },
  })

  const handleCreate = async (values: HardwareVersionFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      versionModelString: values.versionModelString,
      normalizedVersionModel: values.normalizedVersionModel || null,
      releaseChannel: values.releaseChannel || null,
      supportTier: values.supportTier || null,
      company: {
        connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
      },
    }

    if (values.hardwareProductId) {
      input.hardwareProduct = {
        connect: [{ where: { node: { id: { eq: values.hardwareProductId } } } }],
      }
    }

    await createHardwareVersion({ variables: { input: [input] } })
    setShowCreateForm(false)
  }

  const handleUpdate = async (id: string, values: HardwareVersionFormValues) => {
    const input: Record<string, any> = {
      versionModelString: { set: values.versionModelString },
      normalizedVersionModel: { set: values.normalizedVersionModel || null },
      releaseChannel: { set: values.releaseChannel || null },
      supportTier: { set: values.supportTier || null },
      hardwareProduct: {
        disconnect: [{ where: {} }],
        ...(values.hardwareProductId
          ? {
              connect: [{ where: { node: { id: { eq: values.hardwareProductId } } } }],
            }
          : {}),
      },
    }

    await updateHardwareVersion({ variables: { id, input } })
  }

  const handleDelete = async (id: string) => {
    await deleteHardwareVersion({ variables: { id } })
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
            startIcon={<AddIcon />}
            onClick={() => setShowCreateForm(true)}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <HardwareVersionToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={HARDWARE_VERSION_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <HardwareVersionTable
            hardwareVersions={filteredHardwareVersions}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateHardwareVersion={handleCreate}
            onUpdateHardwareVersion={handleUpdate}
            onDeleteHardwareVersion={handleDelete}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <HardwareVersionFilterDialog
          filterState={filterState}
          onFilterChange={newFilter => setFilterState(prev => ({ ...prev, ...newFilter }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={() => setFilterOpen(false)}
          availableProducts={productOptions}
        />
      )}

      {showCreateForm && (
        <HardwareVersionForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          mode="create"
          onSubmit={handleCreate}
        />
      )}
    </Box>
  )
}

export default HardwareVersionsPage
