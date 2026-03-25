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
  CREATE_SOFTWARE_VERSION,
  DELETE_SOFTWARE_VERSION,
  GET_SOFTWARE_VERSIONS,
  UPDATE_SOFTWARE_VERSION,
} from '@/graphql/softwareVersion'
import { GET_SOFTWARE_PRODUCTS } from '@/graphql/softwareProduct'
import SoftwareVersionForm, {
  SoftwareVersionFormValues,
} from '@/components/software-versions/SoftwareVersionForm'
import SoftwareVersionTable, {
  SOFTWARE_VERSION_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/software-versions/SoftwareVersionTable'
import SoftwareVersionToolbar from '@/components/software-versions/SoftwareVersionToolbar'
import SoftwareVersionFilterDialog from '@/components/software-versions/SoftwareVersionFilterDialog'
import { useSoftwareVersionFilter } from '@/components/software-versions/useSoftwareVersionFilter'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

const SoftwareVersionsPage = () => {
  const t = useTranslations('softwareVersions')
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
    tableKey: 'software-versions',
    defaultColumnVisibility: SOFTWARE_VERSION_DEFAULT_COLUMN_VISIBILITY,
  })

  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

  const { loading, error, data, refetch } = useQuery(GET_SOFTWARE_VERSIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const { data: productsData } = useQuery(GET_SOFTWARE_PRODUCTS, {
    variables: { where: companyWhere },
  })

  const softwareVersions = useMemo(() => data?.softwareVersions || [], [data?.softwareVersions])
  const productOptions = useMemo(
    () =>
      (productsData?.softwareProducts ?? []).map((product: any) => ({
        value: product.id,
        label: product.name,
      })),
    [productsData?.softwareProducts]
  )

  const { filterState, setFilterState, filteredSoftwareVersions, resetFilters } =
    useSoftwareVersionFilter({ softwareVersions })

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

  const [createSoftwareVersion] = useMutation(CREATE_SOFTWARE_VERSION, {
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

  const [updateSoftwareVersion] = useMutation(UPDATE_SOFTWARE_VERSION, {
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

  const [deleteSoftwareVersion] = useMutation(DELETE_SOFTWARE_VERSION, {
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

  const normalizeDateValue = (value: unknown) => {
    if (!value) {
      return null
    }

    if (value instanceof Date) {
      return value.toISOString().slice(0, 10)
    }

    return String(value)
  }

  const hasLifecycleRecordData = (values: SoftwareVersionFormValues) =>
    !!(values.lifecycleStatus || values.eosDate || values.eolDate)

  const handleCreate = async (values: SoftwareVersionFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const input: Record<string, any> = {
      name: values.name,
      version: values.version || null,
      releaseChannel: values.releaseChannel || null,
      supportTier: values.supportTier || null,
      isLts: values.isLts ?? false,
      company: {
        connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
      },
    }

    if (values.softwareProductId) {
      input.softwareProduct = {
        connect: [{ where: { node: { id: { eq: values.softwareProductId } } } }],
      }
    }

    if (values.usedByApplicationIds && values.usedByApplicationIds.length > 0) {
      input.usedByApplications = {
        connect: values.usedByApplicationIds.map(id => ({ where: { node: { id: { eq: id } } } })),
      }
    }

    if (values.usedByInfrastructureIds && values.usedByInfrastructureIds.length > 0) {
      input.usedByInfrastructure = {
        connect: values.usedByInfrastructureIds.map(id => ({
          where: { node: { id: { eq: id } } },
        })),
      }
    }

    if (hasLifecycleRecordData(values)) {
      input.lifecycleRecords = {
        create: [
          {
            node: {
              lifecycleStatus: values.lifecycleStatus || null,
              eosDate: normalizeDateValue(values.eosDate),
              eolDate: normalizeDateValue(values.eolDate),
              company: {
                connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
              },
            },
          },
        ],
      }
    }

    await createSoftwareVersion({ variables: { input: [input] } })
    setShowCreateForm(false)
  }

  const handleUpdate = async (id: string, values: SoftwareVersionFormValues) => {
    const input: Record<string, any> = {
      name: { set: values.name },
      version: { set: values.version || null },
      releaseChannel: { set: values.releaseChannel || null },
      supportTier: { set: values.supportTier || null },
      isLts: { set: values.isLts ?? false },
      softwareProduct: {
        disconnect: [{ where: {} }],
        ...(values.softwareProductId
          ? {
              connect: [{ where: { node: { id: { eq: values.softwareProductId } } } }],
            }
          : {}),
      },
      usedByApplications: {
        disconnect: [{ where: {} }],
        ...(values.usedByApplicationIds && values.usedByApplicationIds.length > 0
          ? {
              connect: values.usedByApplicationIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            }
          : {}),
      },
      usedByInfrastructure: {
        disconnect: [{ where: {} }],
        ...(values.usedByInfrastructureIds && values.usedByInfrastructureIds.length > 0
          ? {
              connect: values.usedByInfrastructureIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            }
          : {}),
      },
    }

    if (values.lifecycleRecordId) {
      input.lifecycleRecords = [
        {
          update: {
            where: { node: { id: { eq: values.lifecycleRecordId } } },
            node: {
              lifecycleStatus: { set: values.lifecycleStatus || null },
              eosDate: { set: normalizeDateValue(values.eosDate) },
              eolDate: { set: normalizeDateValue(values.eolDate) },
            },
          },
        },
      ]
    } else if (hasLifecycleRecordData(values) && selectedCompanyId) {
      input.lifecycleRecords = [
        {
          create: [
            {
              node: {
                lifecycleStatus: values.lifecycleStatus || null,
                eosDate: normalizeDateValue(values.eosDate),
                eolDate: normalizeDateValue(values.eolDate),
                company: {
                  connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
                },
              },
            },
          ],
        },
      ]
    }

    await updateSoftwareVersion({ variables: { id, input } })
  }

  const handleDelete = async (id: string) => {
    await deleteSoftwareVersion({ variables: { id } })
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
        <SoftwareVersionToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={SOFTWARE_VERSION_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <SoftwareVersionTable
            softwareVersions={filteredSoftwareVersions}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateSoftwareVersion={handleCreate}
            onUpdateSoftwareVersion={handleUpdate}
            onDeleteSoftwareVersion={handleDelete}
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <SoftwareVersionFilterDialog
          filterState={filterState}
          onFilterChange={newFilter => setFilterState(prev => ({ ...prev, ...newFilter }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={() => setFilterOpen(false)}
          availableProducts={productOptions}
        />
      )}

      {showCreateForm && (
        <SoftwareVersionForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          mode="create"
          onSubmit={handleCreate}
        />
      )}
    </Box>
  )
}

export default SoftwareVersionsPage
