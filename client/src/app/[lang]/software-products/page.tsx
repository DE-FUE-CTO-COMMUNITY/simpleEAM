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
  CREATE_SOFTWARE_PRODUCT,
  DELETE_SOFTWARE_PRODUCT,
  GET_SOFTWARE_PRODUCTS,
  UPDATE_SOFTWARE_PRODUCT,
} from '@/graphql/softwareProduct'
import SoftwareProductForm, {
  SoftwareProductFormValues,
} from '@/components/software-products/SoftwareProductForm'
import SoftwareProductTable, {
  SOFTWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/software-products/SoftwareProductTable'
import SoftwareProductToolbar from '@/components/software-products/SoftwareProductToolbar'
import SoftwareProductFilterDialog from '@/components/software-products/SoftwareProductFilterDialog'
import { useSoftwareProductFilter } from '@/components/software-products/useSoftwareProductFilter'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const SoftwareProductsPage = () => {
  const t = useTranslations('softwareProducts')
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
    tableKey: 'software-products',
    defaultColumnVisibility: SOFTWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY,
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

  const { loading, error, data, refetch } = useQuery(GET_SOFTWARE_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const softwareProducts = useMemo(() => data?.softwareProducts || [], [data?.softwareProducts])

  const { filterState, setFilterState, filteredSoftwareProducts, resetFilters } =
    useSoftwareProductFilter({ softwareProducts })

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

  const [createSoftwareProduct] = useMutation(CREATE_SOFTWARE_PRODUCT, {
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

  const [updateSoftwareProduct] = useMutation(UPDATE_SOFTWARE_PRODUCT, {
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

  const [deleteSoftwareProduct] = useMutation(DELETE_SOFTWARE_PRODUCT, {
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

  const handleCreate = async (values: SoftwareProductFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: values.name,
      lifecycleStatus: values.lifecycleStatus || null,
      isActive: values.isActive ?? true,
      company: {
        connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
      },
    }

    if (values.developedByIds && values.developedByIds.length > 0) {
      input.developedBy = { connect: toConnectById(values.developedByIds) }
    }
    if (values.providedByIds && values.providedByIds.length > 0) {
      input.providedBy = { connect: toConnectById(values.providedByIds) }
    }
    if (values.maintainedByIds && values.maintainedByIds.length > 0) {
      input.maintainedBy = { connect: toConnectById(values.maintainedByIds) }
    }
    if (values.versionIds && values.versionIds.length > 0) {
      input.versions = { connect: toConnectById(values.versionIds) }
    }
    if (values.productFamilyId) {
      input.productFamily = { connect: toConnectById([values.productFamilyId]) }
    }

    await createSoftwareProduct({ variables: { input: [input] } })
    setShowCreateForm(false)
  }

  const handleUpdate = async (id: string, values: SoftwareProductFormValues) => {
    const input: Record<string, any> = {
      name: { set: values.name },
      lifecycleStatus: { set: values.lifecycleStatus || null },
      isActive: { set: values.isActive ?? true },
      productFamily: {
        disconnect: [{ where: {} }],
        ...(values.productFamilyId ? { connect: toConnectById([values.productFamilyId]) } : {}),
      },
      developedBy: {
        disconnect: [{ where: {} }],
        ...(values.developedByIds?.length ? { connect: toConnectById(values.developedByIds) } : {}),
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
      versions: {
        disconnect: [{ where: {} }],
        ...(values.versionIds?.length ? { connect: toConnectById(values.versionIds) } : {}),
      },
    }

    await updateSoftwareProduct({ variables: { id, input } })
  }

  const handleDelete = async (id: string) => {
    await deleteSoftwareProduct({ variables: { id } })
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
        <SoftwareProductToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={SOFTWARE_PRODUCT_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <SoftwareProductTable
            softwareProducts={filteredSoftwareProducts}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateSoftwareProduct={handleCreate}
            onUpdateSoftwareProduct={handleUpdate}
            onDeleteSoftwareProduct={handleDelete}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <SoftwareProductFilterDialog
          filterState={filterState}
          onFilterChange={newFilter => setFilterState(prev => ({ ...prev, ...newFilter }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={() => setFilterOpen(false)}
        />
      )}

      {showCreateForm && (
        <SoftwareProductForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          mode="create"
          onSubmit={handleCreate}
        />
      )}
    </Box>
  )
}

export default SoftwareProductsPage
