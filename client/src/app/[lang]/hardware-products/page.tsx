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
  CREATE_HARDWARE_PRODUCT,
  DELETE_HARDWARE_PRODUCT,
  GET_HARDWARE_PRODUCTS,
  UPDATE_HARDWARE_PRODUCT,
} from '@/graphql/hardwareProduct'
import HardwareProductForm, {
  HardwareProductFormValues,
} from '@/components/hardware-products/HardwareProductForm'
import HardwareProductTable, {
  HARDWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/hardware-products/HardwareProductTable'
import HardwareProductToolbar from '@/components/hardware-products/HardwareProductToolbar'
import HardwareProductFilterDialog from '@/components/hardware-products/HardwareProductFilterDialog'
import { useHardwareProductFilter } from '@/components/hardware-products/useHardwareProductFilter'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const HardwareProductsPage = () => {
  const t = useTranslations('hardwareProducts')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const companyWhere = useCompanyWhere('company')

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
  } = usePersistentColumnVisibility({
    tableKey: 'hardware-products',
    defaultColumnVisibility: HARDWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY,
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

  const { loading, error, data, refetch } = useQuery(GET_HARDWARE_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const hardwareProducts = useMemo(() => data?.hardwareProducts || [], [data?.hardwareProducts])

  const { filterState, setFilterState, filteredHardwareProducts, resetFilters } =
    useHardwareProductFilter({ hardwareProducts })

  const activeFiltersCount = useMemo(() => {
    return (
      (filterState.nameFilter ? 1 : 0) +
      (filterState.lifecycleStatusFilter ? 1 : 0) +
      (filterState.updatedDateRange[0] || filterState.updatedDateRange[1] ? 1 : 0)
    )
  }, [filterState])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [enqueueSnackbar, error, t])

  const [createHardwareProduct] = useMutation(CREATE_HARDWARE_PRODUCT, {
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

  const [updateHardwareProduct] = useMutation(UPDATE_HARDWARE_PRODUCT, {
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

  const [deleteHardwareProduct] = useMutation(DELETE_HARDWARE_PRODUCT, {
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

  const toConnectById = (ids: string[]) =>
    ids.map(id => ({
      where: { node: { id: { eq: id } } },
    }))

  const handleCreate = async (values: HardwareProductFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: values.name,
      productFamily: values.productFamily || null,
      lifecycleStatus: values.lifecycleStatus || null,
      isActive: values.isActive ?? true,
      company: {
        connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
      },
    }

    if (values.manufacturedByIds && values.manufacturedByIds.length > 0) {
      input.manufacturedBy = { connect: toConnectById(values.manufacturedByIds) }
    }
    if (values.providedByIds && values.providedByIds.length > 0) {
      input.providedBy = { connect: toConnectById(values.providedByIds) }
    }
    if (values.maintainedByIds && values.maintainedByIds.length > 0) {
      input.maintainedBy = { connect: toConnectById(values.maintainedByIds) }
    }

    await createHardwareProduct({ variables: { input: [input] } })
    setShowCreateForm(false)
  }

  const handleUpdate = async (id: string, values: HardwareProductFormValues) => {
    const input: Record<string, any> = {
      name: { set: values.name },
      productFamily: { set: values.productFamily || null },
      lifecycleStatus: { set: values.lifecycleStatus || null },
      isActive: { set: values.isActive ?? true },
      manufacturedBy: {
        disconnect: [{ where: {} }],
        ...(values.manufacturedByIds?.length
          ? { connect: toConnectById(values.manufacturedByIds) }
          : {}),
      },
      providedBy: {
        disconnect: [{ where: {} }],
        ...(values.providedByIds?.length ? { connect: toConnectById(values.providedByIds) } : {}),
      },
      maintainedBy: {
        disconnect: [{ where: {} }],
        ...(values.maintainedByIds?.length
          ? { connect: toConnectById(values.maintainedByIds) }
          : {}),
      },
    }

    await updateHardwareProduct({ variables: { id, input } })
  }

  const handleDelete = async (id: string) => {
    await deleteHardwareProduct({ variables: { id } })
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
        <HardwareProductToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={HARDWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <HardwareProductTable
            hardwareProducts={filteredHardwareProducts}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateHardwareProduct={handleCreate}
            onUpdateHardwareProduct={handleUpdate}
            onDeleteHardwareProduct={handleDelete}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <HardwareProductFilterDialog
          filterState={filterState}
          onFilterChange={newFilter => setFilterState(prev => ({ ...prev, ...newFilter }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={() => setFilterOpen(false)}
        />
      )}

      {showCreateForm && (
        <HardwareProductForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          mode="create"
          onSubmit={handleCreate}
        />
      )}
    </Box>
  )
}

export default HardwareProductsPage
