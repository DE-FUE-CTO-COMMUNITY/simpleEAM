'use client'

import React, { useState, useMemo } from 'react'
import { Box, Typography, Button, Paper, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { isArchitect } from '@/lib/auth'

import {
  GET_SUPPLIERS,
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
} from '@/graphql/supplier'
import { SupplierFormValues } from '@/components/suppliers/types'
import SupplierForm from '@/components/suppliers/SupplierForm'
import SupplierTable, {
  Suppliers_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/suppliers/SupplierTable'
import SupplierToolbar from '@/components/suppliers/SupplierToolbar'
import SupplierFilterDialog from '@/components/suppliers/SupplierFilterDialog'
import { useSupplierFilter } from '@/components/suppliers/useSupplierFilter'
import { countActiveFilters } from '@/components/suppliers/utils'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

const SuppliersPage = () => {
  const t = useTranslations('suppliers')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)

  // Apollo Client-Operationen
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error } = useQuery(GET_SUPPLIERS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })
  const [createSupplierMutation] = useMutation(CREATE_SUPPLIER)
  const [updateSupplierMutation] = useMutation(UPDATE_SUPPLIER)
  const [deleteSupplierMutation] = useMutation(DELETE_SUPPLIER)

  // Filter Hook
  const { filterState, setFilterState, filteredSuppliers, resetFilters } = useSupplierFilter({
    suppliers: data?.suppliers || [],
  })

  // Dialog-States
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false)

  // Event Handler
  const handleCreate = () => {
    setShowNewSupplierForm(true)
  }

  const handleCreateSupplierSubmit = async (data: SupplierFormValues) => {
    try {
      if (!selectedCompanyId) {
        enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
        return
      }

      const {
        providesApplicationIds,
        supportsApplicationIds,
        maintainsApplicationIds,
        providesInfrastructureIds,
        hostsInfrastructureIds,
        maintainsInfrastructureIds,
        providesAIComponentIds,
        supportsAIComponentIds,
        maintainsAIComponentIds,
        ...supplierData
      } = data

      const input = {
        name: supplierData.name,
        description: supplierData.description,
        sovereigntyAchStrategicAutonomy: supplierData.sovereigntyAchStrategicAutonomy,
        sovereigntyAchResilience: supplierData.sovereigntyAchResilience,
        sovereigntyAchSecurity: supplierData.sovereigntyAchSecurity,
        sovereigntyAchControl: supplierData.sovereigntyAchControl,
        sovereigntyAchStrategicAutonomyEvidence:
          supplierData.sovereigntyAchStrategicAutonomyEvidence,
        lastSovereigntyAssessmentAt: supplierData.lastSovereigntyAssessmentAt,
        supplierType: supplierData.supplierType,
        status: supplierData.status,
        address: supplierData.address,
        phone: supplierData.phone,
        email: supplierData.email,
        website: supplierData.website,
        primaryContactPerson: supplierData.primaryContactPerson,
        contractStartDate: supplierData.contractStartDate,
        contractEndDate: supplierData.contractEndDate,
        annualSpend: supplierData.annualSpend,
        riskClassification: supplierData.riskClassification,
        strategicImportance: supplierData.strategicImportance,
        performanceRating: supplierData.performanceRating,
        complianceCertifications: supplierData.complianceCertifications,
        tags: supplierData.tags,
        ...(providesApplicationIds && providesApplicationIds.length > 0
          ? {
              providesApplications: {
                connect: providesApplicationIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(supportsApplicationIds && supportsApplicationIds.length > 0
          ? {
              supportsApplications: {
                connect: supportsApplicationIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(maintainsApplicationIds && maintainsApplicationIds.length > 0
          ? {
              maintainsApplications: {
                connect: maintainsApplicationIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(providesInfrastructureIds && providesInfrastructureIds.length > 0
          ? {
              providesInfrastructure: {
                connect: providesInfrastructureIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(hostsInfrastructureIds && hostsInfrastructureIds.length > 0
          ? {
              hostsInfrastructure: {
                connect: hostsInfrastructureIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(maintainsInfrastructureIds && maintainsInfrastructureIds.length > 0
          ? {
              maintainsInfrastructure: {
                connect: maintainsInfrastructureIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(providesAIComponentIds && providesAIComponentIds.length > 0
          ? {
              providesAIComponents: {
                connect: providesAIComponentIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(supportsAIComponentIds && supportsAIComponentIds.length > 0
          ? {
              supportsAIComponents: {
                connect: supportsAIComponentIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        ...(maintainsAIComponentIds && maintainsAIComponentIds.length > 0
          ? {
              maintainsAIComponents: {
                connect: maintainsAIComponentIds.map(id => ({
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

      await createSupplierMutation({
        variables: { input: [input] },
        refetchQueries: [
          {
            query: GET_SUPPLIERS,
            variables: { where: companyWhere },
          },
        ],
        awaitRefetchQueries: true,
      })
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      setShowNewSupplierForm(false)
    } catch (error) {
      console.error('Fehler beim Erstellen des supplier:', error)
      enqueueSnackbar(t('messages.createError'), { variant: 'error' })
      throw error
    }
  }

  // Delete wird i.d.R. im GenericTable/Dialog gehandhabt

  // Aktive Filter zählen
  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(filterState)
  }, [filterState])

  // Error Handling
  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          {t('messages.loadError')}: {(error as any)?.message || 'Unknown error'}
        </Typography>
      </Box>
    )
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
            onClick={handleCreate}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <SupplierToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onAddClick={handleCreate}
          onFilterClick={() => setFilterDialogOpen(true)}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={Suppliers_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <SupplierTable
            suppliers={filteredSuppliers}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onTableReady={setTableInstance}
            onCreateSupplier={handleCreateSupplierSubmit}
            onUpdateSupplier={async (id, data) => {
              try {
                // Extract relationship IDs from form data
                const {
                  providesApplicationIds,
                  supportsApplicationIds,
                  maintainsApplicationIds,
                  providesInfrastructureIds,
                  hostsInfrastructureIds,
                  maintainsInfrastructureIds,
                  providesAIComponentIds,
                  supportsAIComponentIds,
                  maintainsAIComponentIds,
                  ...supplierData
                } = data

                // Build update input with { set: value } for scalar fields
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const input: Record<string, any> = {
                  name: { set: supplierData.name },
                  description: { set: supplierData.description },
                  sovereigntyAchStrategicAutonomy: {
                    set: supplierData.sovereigntyAchStrategicAutonomy ?? null,
                  },
                  sovereigntyAchResilience: {
                    set: supplierData.sovereigntyAchResilience ?? null,
                  },
                  sovereigntyAchSecurity: {
                    set: supplierData.sovereigntyAchSecurity ?? null,
                  },
                  sovereigntyAchControl: {
                    set: supplierData.sovereigntyAchControl ?? null,
                  },
                  sovereigntyAchStrategicAutonomyEvidence: {
                    set: supplierData.sovereigntyAchStrategicAutonomyEvidence ?? null,
                  },
                  lastSovereigntyAssessmentAt: {
                    set: supplierData.lastSovereigntyAssessmentAt ?? null,
                  },
                  supplierType: { set: supplierData.supplierType },
                  status: { set: supplierData.status },
                  address: { set: supplierData.address },
                  phone: { set: supplierData.phone },
                  email: { set: supplierData.email },
                  website: { set: supplierData.website },
                  primaryContactPerson: { set: supplierData.primaryContactPerson },
                  contractStartDate: { set: supplierData.contractStartDate },
                  contractEndDate: { set: supplierData.contractEndDate },
                  annualSpend: { set: supplierData.annualSpend },
                  riskClassification: { set: supplierData.riskClassification },
                  strategicImportance: { set: supplierData.strategicImportance },
                  performanceRating: { set: supplierData.performanceRating },
                  complianceCertifications: { set: supplierData.complianceCertifications },
                  tags: { set: supplierData.tags },
                }

                // Update providesApplications relationship
                if (providesApplicationIds && providesApplicationIds.length > 0) {
                  input.providesApplications = {
                    disconnect: [{ where: {} }],
                    connect: providesApplicationIds.map(appId => ({
                      where: { node: { id: { eq: appId } } },
                    })),
                  }
                } else {
                  input.providesApplications = {
                    disconnect: [{ where: {} }],
                  }
                }

                // Update supportsApplications relationship
                if (supportsApplicationIds && supportsApplicationIds.length > 0) {
                  input.supportsApplications = {
                    disconnect: [{ where: {} }],
                    connect: supportsApplicationIds.map(appId => ({
                      where: { node: { id: { eq: appId } } },
                    })),
                  }
                } else {
                  input.supportsApplications = {
                    disconnect: [{ where: {} }],
                  }
                }

                // Update maintainsApplications relationship
                if (maintainsApplicationIds && maintainsApplicationIds.length > 0) {
                  input.maintainsApplications = {
                    disconnect: [{ where: {} }],
                    connect: maintainsApplicationIds.map(appId => ({
                      where: { node: { id: { eq: appId } } },
                    })),
                  }
                } else {
                  input.maintainsApplications = {
                    disconnect: [{ where: {} }],
                  }
                }

                // Update providesInfrastructure relationship
                if (providesInfrastructureIds && providesInfrastructureIds.length > 0) {
                  input.providesInfrastructure = {
                    disconnect: [{ where: {} }],
                    connect: providesInfrastructureIds.map(infraId => ({
                      where: { node: { id: { eq: infraId } } },
                    })),
                  }
                } else {
                  input.providesInfrastructure = {
                    disconnect: [{ where: {} }],
                  }
                }

                // Update hostsInfrastructure relationship
                if (hostsInfrastructureIds && hostsInfrastructureIds.length > 0) {
                  input.hostsInfrastructure = {
                    disconnect: [{ where: {} }],
                    connect: hostsInfrastructureIds.map(infraId => ({
                      where: { node: { id: { eq: infraId } } },
                    })),
                  }
                } else {
                  input.hostsInfrastructure = {
                    disconnect: [{ where: {} }],
                  }
                }

                // Update maintainsInfrastructure relationship
                if (maintainsInfrastructureIds && maintainsInfrastructureIds.length > 0) {
                  input.maintainsInfrastructure = {
                    disconnect: [{ where: {} }],
                    connect: maintainsInfrastructureIds.map(infraId => ({
                      where: { node: { id: { eq: infraId } } },
                    })),
                  }
                } else {
                  input.maintainsInfrastructure = {
                    disconnect: [{ where: {} }],
                  }
                }

                if (providesAIComponentIds && providesAIComponentIds.length > 0) {
                  input.providesAIComponents = {
                    disconnect: [{ where: {} }],
                    connect: providesAIComponentIds.map(componentId => ({
                      where: { node: { id: { eq: componentId } } },
                    })),
                  }
                } else {
                  input.providesAIComponents = {
                    disconnect: [{ where: {} }],
                  }
                }

                if (supportsAIComponentIds && supportsAIComponentIds.length > 0) {
                  input.supportsAIComponents = {
                    disconnect: [{ where: {} }],
                    connect: supportsAIComponentIds.map(componentId => ({
                      where: { node: { id: { eq: componentId } } },
                    })),
                  }
                } else {
                  input.supportsAIComponents = {
                    disconnect: [{ where: {} }],
                  }
                }

                if (maintainsAIComponentIds && maintainsAIComponentIds.length > 0) {
                  input.maintainsAIComponents = {
                    disconnect: [{ where: {} }],
                    connect: maintainsAIComponentIds.map(componentId => ({
                      where: { node: { id: { eq: componentId } } },
                    })),
                  }
                } else {
                  input.maintainsAIComponents = {
                    disconnect: [{ where: {} }],
                  }
                }

                await updateSupplierMutation({
                  variables: {
                    where: {
                      id: { eq: id },
                    },
                    update: input,
                  },
                  refetchQueries: [
                    {
                      query: GET_SUPPLIERS,
                      variables: { where: companyWhere },
                    },
                  ],
                  awaitRefetchQueries: true,
                })
                enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
              } catch (error) {
                console.error('Fehler beim Aktualisieren des supplier:', error)
                enqueueSnackbar(t('messages.updateError'), { variant: 'error' })
                throw error
              }
            }}
            onDeleteSupplier={async id => {
              try {
                await deleteSupplierMutation({
                  variables: {
                    where: {
                      id: { eq: id },
                    },
                  },
                })
                enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
              } catch (error) {
                console.error('Fehler beim Löschen des supplier:', error)
                enqueueSnackbar(t('messages.deleteError'), { variant: 'error' })
              }
            }}
          />
        </Paper>
      </Card>

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <SupplierFilterDialog
          filterState={filterState}
          onFilterChange={newFilters => setFilterState(prev => ({ ...prev, ...newFilters }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterDialogOpen(false)}
          onApply={activeCount => {
            console.log('Applied filters:', activeCount)
            setFilterDialogOpen(false)
          }}
        />
      )}

      {/* Create Form */}
      {showNewSupplierForm && (
        <SupplierForm
          isOpen={showNewSupplierForm}
          onClose={() => setShowNewSupplierForm(false)}
          mode="create"
          onSubmit={handleCreateSupplierSubmit}
        />
      )}
    </Box>
  )
}

export default SuppliersPage
