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
  CREATE_BUSINESS_PROCESS,
  DELETE_BUSINESS_PROCESS,
  GET_BUSINESS_PROCESSES,
  UPDATE_BUSINESS_PROCESS,
} from '@/graphql/businessProcess'
import { ProcessStatus, ProcessType } from '@/gql/generated'
import BusinessProcessForm from '@/components/business-processes/BusinessProcessForm'
import {
  BUSINESS_PROCESS_DEFAULT_COLUMN_VISIBILITY,
  default as BusinessProcessTable,
} from '@/components/business-processes/BusinessProcessTable'
import BusinessProcessToolbar from '@/components/business-processes/BusinessProcessToolbar'
import BusinessProcessFilterDialog from '@/components/business-processes/BusinessProcessFilterDialog'
import { useBusinessProcessFilter } from '@/components/business-processes/useBusinessProcessFilter'
import { BusinessProcessFormValues, BusinessProcessType } from '@/components/business-processes/types'

const BusinessProcessesPage = () => {
  const t = useTranslations('businessProcesses')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()

  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)
  const [showNewBusinessProcessForm, setShowNewBusinessProcessForm] = useState(false)

  const companyWhere = useCompanyWhere('company')

  const { loading, error, data, refetch } = useQuery(GET_BUSINESS_PROCESSES, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const businessProcesses = useMemo(
    () => (data?.businessProcesses || []) as BusinessProcessType[],
    [data?.businessProcesses]
  )

  const [availableStatuses, setAvailableStatuses] = useState<ProcessStatus[]>([])
  const [availableProcessTypes, setAvailableProcessTypes] = useState<ProcessType[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  useEffect(() => {
    if (businessProcesses.length === 0) return

    setAvailableStatuses(
      Array.from(new Set(businessProcesses.map(process => process.status).filter(Boolean))).sort() as ProcessStatus[]
    )

    setAvailableProcessTypes(
      Array.from(
        new Set(businessProcesses.map(process => process.processType).filter(Boolean))
      ).sort() as ProcessType[]
    )

    setAvailableCategories(
      Array.from(new Set(businessProcesses.map(process => process.category).filter(Boolean) as string[])).sort()
    )
  }, [businessProcesses])

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const { filterState, setFilterState, filteredBusinessProcesses, resetFilters } =
    useBusinessProcessFilter({
      businessProcesses,
    })

  const [createBusinessProcess] = useMutation(CREATE_BUSINESS_PROCESS, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch({ where: companyWhere })
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.createError')}: ${error.message}`, { variant: 'error' })
    },
  })

  const [updateBusinessProcess] = useMutation(UPDATE_BUSINESS_PROCESS, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      refetch({ where: companyWhere })
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.updateError')}: ${error.message}`, { variant: 'error' })
    },
  })

  const [deleteBusinessProcess] = useMutation(DELETE_BUSINESS_PROCESS, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
      refetch({ where: companyWhere })
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.deleteError')}: ${error.message}`, { variant: 'error' })
    },
  })

  const buildCreateInput = (values: BusinessProcessFormValues) => {
    const {
      ownerId,
      parentProcessId,
      supportsCapabilityIds,
      name,
      description,
      processType,
      status,
      maturityLevel,
      category,
      tags,
      partOfArchitectures,
      depictedInDiagrams,
    } = values

    return {
      name,
      description,
      processType,
      status,
      ...(maturityLevel ? { maturityLevel } : {}),
      ...(category ? { category } : {}),
      ...(tags ? { tags } : {}),
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      ...(parentProcessId
        ? {
            parentProcess: {
              connect: [{ where: { node: { id: { eq: parentProcessId } } } }],
            },
          }
        : {}),
      ...(supportsCapabilityIds && supportsCapabilityIds.length > 0
        ? {
            supportsCapabilities: {
              connect: supportsCapabilityIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(partOfArchitectures && partOfArchitectures.length > 0
        ? {
            partOfArchitectures: {
              connect: partOfArchitectures.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(depictedInDiagrams && depictedInDiagrams.length > 0
        ? {
            depictedInDiagrams: {
              connect: depictedInDiagrams.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      company: {
        connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
      },
    }
  }

  const handleCreateBusinessProcessSubmit = async (values: BusinessProcessFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    await createBusinessProcess({
      variables: {
        input: [buildCreateInput(values)],
      },
    })

    setShowNewBusinessProcessForm(false)
  }

  const handleUpdateBusinessProcessSubmit = async (id: string, values: BusinessProcessFormValues) => {
    const {
      ownerId,
      parentProcessId,
      supportsCapabilityIds,
      name,
      description,
      processType,
      status,
      maturityLevel,
      category,
      tags,
      partOfArchitectures,
      depictedInDiagrams,
    } = values

    const input: Record<string, any> = {
      name: { set: name },
      description: { set: description || '' },
      processType: { set: processType },
      status: { set: status },
      category: { set: category || '' },
      tags: { set: tags || [] },
      maturityLevel: { set: maturityLevel || null },
      owners: [
        {
          disconnect: [{ where: {} }],
          ...(ownerId
            ? {
                connect: [{ where: { node: { id: { eq: ownerId } } } }],
              }
            : {}),
        },
      ],
      parentProcess: [
        {
          disconnect: [{ where: {} }],
          ...(parentProcessId
            ? {
                connect: [{ where: { node: { id: { eq: parentProcessId } } } }],
              }
            : {}),
        },
      ],
      supportsCapabilities: [
        {
          disconnect: [{ where: {} }],
          ...(supportsCapabilityIds && supportsCapabilityIds.length > 0
            ? {
                connect: supportsCapabilityIds.map(capabilityId => ({
                  where: { node: { id: { eq: capabilityId } } },
                })),
              }
            : {}),
        },
      ],
      partOfArchitectures: [
        {
          disconnect: [{ where: {} }],
          ...(partOfArchitectures && partOfArchitectures.length > 0
            ? {
                connect: partOfArchitectures.map(architectureId => ({
                  where: { node: { id: { eq: architectureId } } },
                })),
              }
            : {}),
        },
      ],
      depictedInDiagrams: [
        {
          disconnect: [{ where: {} }],
          ...(depictedInDiagrams && depictedInDiagrams.length > 0
            ? {
                connect: depictedInDiagrams.map(diagramId => ({
                  where: { node: { id: { eq: diagramId } } },
                })),
              }
            : {}),
        },
      ],
    }

    await updateBusinessProcess({
      variables: {
        id,
        input,
      },
    })
  }

  const handleDeleteBusinessProcess = async (id: string) => {
    await deleteBusinessProcess({ variables: { id } })
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
            onClick={() => setShowNewBusinessProcessForm(true)}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <BusinessProcessToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onFilterClick={() => setFilterOpen(true)}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={BUSINESS_PROCESS_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <BusinessProcessTable
            businessProcesses={filteredBusinessProcesses}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateBusinessProcess={handleCreateBusinessProcessSubmit}
            onUpdateBusinessProcess={handleUpdateBusinessProcessSubmit}
            onDeleteBusinessProcess={handleDeleteBusinessProcess}
            onTableReady={setTableInstance}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <BusinessProcessFilterDialog
          filterState={filterState}
          availableStatuses={availableStatuses}
          availableProcessTypes={availableProcessTypes}
          availableCategories={availableCategories}
          onFilterChange={newFilters => setFilterState(prev => ({ ...prev, ...newFilters }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={activeCount => {
            setActiveFiltersCount(activeCount)
            setFilterOpen(false)
          }}
        />
      )}

      {showNewBusinessProcessForm && (
        <BusinessProcessForm
          isOpen={showNewBusinessProcessForm}
          onClose={() => setShowNewBusinessProcessForm(false)}
          mode="create"
          onSubmit={handleCreateBusinessProcessSubmit}
        />
      )}
    </Box>
  )
}

export default BusinessProcessesPage
