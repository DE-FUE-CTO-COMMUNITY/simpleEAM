'use client'

import React, { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { Add as AddIcon } from '@mui/icons-material'
import { Box, Button, Card, Paper, Typography } from '@mui/material'
import { SortingState } from '@tanstack/react-table'
import GenericFilterDialog, { FilterField } from '@/components/common/GenericFilterDialog'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { isArchitect } from '@/lib/auth'
import { useSnackbar } from 'notistack'

import InfrastructureTable, {
  INFRASTRUCTURE_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/infrastructure/InfrastructureTable'
import InfrastructureToolbar from '@/components/infrastructure/InfrastructureToolbar'
import { useInfrastructureFilter } from '@/components/infrastructure/useInfrastructureFilter'
import InfrastructureForm, {
  InfrastructureFormValues,
} from '@/components/infrastructure/InfrastructureForm'
import { countActiveFilters } from '@/components/infrastructure/utils'
import { Infrastructure } from '@/gql/generated'
import {
  GET_INFRASTRUCTURES,
  CREATE_INFRASTRUCTURE,
  UPDATE_INFRASTRUCTURE,
  DELETE_INFRASTRUCTURE,
} from '@/graphql/infrastructure'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useLensSettings } from '@/lib/lens-settings'

export default function InfrastructuresPage() {
  const t = useTranslations('infrastructure')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const { lensFlags } = useLensSettings()
  const showTechnologyManagementRelationship = lensFlags.technologyManagement
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [showNewInfrastructureForm, setShowNewInfrastructureForm] = useState(false)

  // GraphQL Queries & Mutations
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_INFRASTRUCTURES, {
    variables: { where: companyWhere },
  })
  const [createInfrastructure] = useMutation(CREATE_INFRASTRUCTURE)
  const [updateInfrastructure] = useMutation(UPDATE_INFRASTRUCTURE)
  const [deleteInfrastructure] = useMutation(DELETE_INFRASTRUCTURE)

  // Filter Logic
  const infrastructures = data?.infrastructures || []
  const {
    filterState,
    setFilterState,
    filteredInfrastructures,
    resetFilters,
    availableStatuses,
    availableTypes,
  } = useInfrastructureFilter({
    infrastructures,
  })

  // Further filtering by global search filter
  const finalInfrastructures = useMemo(() => {
    if (!globalFilter.trim()) return filteredInfrastructures
    const searchTerm = globalFilter.toLowerCase()
    return filteredInfrastructures.filter(
      infrastructure =>
        infrastructure.name?.toLowerCase().includes(searchTerm) ||
        infrastructure.description?.toLowerCase().includes(searchTerm)
    )
  }, [filteredInfrastructures, globalFilter])

  // CRUD Handlers
  const handleCreate = async (data: InfrastructureFormValues) => {
    try {
      if (!selectedCompanyId) {
        enqueueSnackbar(t('messages.selectCompanyFirst' as any), { variant: 'warning' })
        return
      }
      const parentId = Array.isArray(data.parentInfrastructure)
        ? data.parentInfrastructure[0]
        : data.parentInfrastructure
      const lastSovereigntyAssessmentAt =
        data.lastSovereigntyAssessmentAt ?? new Date().toISOString()

      const input = {
        name: data.name,
        description: data.description || '',
        sovereigntyAchDataResidency: data.sovereigntyAchDataResidency,
        sovereigntyAchJurisdictionControl: data.sovereigntyAchJurisdictionControl,
        sovereigntyAchOperationalControl: data.sovereigntyAchOperationalControl,
        sovereigntyAchInteroperability: data.sovereigntyAchInteroperability,
        sovereigntyAchPortability: data.sovereigntyAchPortability,
        sovereigntyAchSupplyChainTransparency: data.sovereigntyAchSupplyChainTransparency,
        sovereigntyEvidence: data.sovereigntyEvidence,
        lastSovereigntyAssessmentAt,
        infrastructureType: data.infrastructureType,
        status: data.status,
        vendor: data.vendor || '',
        version: data.version || '',
        capacity: data.capacity || '',
        location: data.location || '',
        ipAddress: data.ipAddress || '',
        operatingSystem: data.operatingSystem || '',
        specifications: data.specifications || '',
        maintenanceWindow: data.maintenanceWindow || '',
        costs: data.costs ?? null,
        planningDate: data.planningDate || null,
        introductionDate: data.introductionDate || null,
        endOfUseDate: data.endOfUseDate || null,
        endOfLifeDate: data.endOfLifeDate || null,
        ...(data.ownerId && {
          owners: {
            connect: [
              {
                where: { node: { id: { eq: data.ownerId } } },
              },
            ],
          },
        }),
        ...(parentId && {
          parentInfrastructure: {
            connect: [
              {
                where: { node: { id: { eq: parentId } } },
              },
            ],
          },
        }),
        ...(data.childInfrastructures &&
          data.childInfrastructures.length > 0 && {
            childInfrastructures: {
              connect: data.childInfrastructures.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(data.hostsApplications &&
          data.hostsApplications.length > 0 && {
            hostsApplications: {
              connect: data.hostsApplications.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(showTechnologyManagementRelationship &&
          data.softwareVersionIds &&
          data.softwareVersionIds.length > 0 && {
            softwareVersions: {
              connect: data.softwareVersionIds.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(showTechnologyManagementRelationship &&
          data.hardwareVersionIds &&
          data.hardwareVersionIds.length > 0 && {
            hardwareVersions: {
              connect: data.hardwareVersionIds.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(data.providedBy &&
          data.providedBy.length > 0 && {
            providedBy: {
              connect: data.providedBy.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(data.hostedBy &&
          data.hostedBy.length > 0 && {
            hostedBy: {
              connect: data.hostedBy.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(data.maintainedBy &&
          data.maintainedBy.length > 0 && {
            maintainedBy: {
              connect: data.maintainedBy.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(data.partOfArchitectures &&
          data.partOfArchitectures.length > 0 && {
            partOfArchitectures: {
              connect: data.partOfArchitectures.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        ...(data.depictedInDiagrams &&
          data.depictedInDiagrams.length > 0 && {
            depictedInDiagrams: {
              connect: data.depictedInDiagrams.map((id: string) => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }),
        // Company assignment (required)
        company: {
          connect: [
            {
              where: { node: { id: { eq: selectedCompanyId } } },
            },
          ],
        },
      }

      await createInfrastructure({
        variables: {
          input: [input],
        },
      })
      enqueueSnackbar(t('messages.createSuccess' as any), { variant: 'success' })
      setShowNewInfrastructureForm(false)
      refetch()
    } catch (error) {
      console.error('Error creating infrastructure:', error)
      enqueueSnackbar(t('messages.createError' as any), { variant: 'error' })
      throw error
    }
  }

  const handleUpdate = async (id: string, data: InfrastructureFormValues) => {
    try {
      const parentId = Array.isArray(data.parentInfrastructure)
        ? data.parentInfrastructure[0]
        : data.parentInfrastructure
      const lastSovereigntyAssessmentAt =
        data.lastSovereigntyAssessmentAt ?? new Date().toISOString()

      const updateInput = {
        name: { set: data.name },
        description: { set: data.description || '' },
        sovereigntyAchDataResidency: { set: data.sovereigntyAchDataResidency ?? null },
        sovereigntyAchJurisdictionControl: { set: data.sovereigntyAchJurisdictionControl ?? null },
        sovereigntyAchOperationalControl: { set: data.sovereigntyAchOperationalControl ?? null },
        sovereigntyAchInteroperability: { set: data.sovereigntyAchInteroperability ?? null },
        sovereigntyAchPortability: { set: data.sovereigntyAchPortability ?? null },
        sovereigntyAchSupplyChainTransparency: {
          set: data.sovereigntyAchSupplyChainTransparency ?? null,
        },
        sovereigntyEvidence: { set: data.sovereigntyEvidence ?? null },
        lastSovereigntyAssessmentAt: { set: lastSovereigntyAssessmentAt },
        infrastructureType: { set: data.infrastructureType },
        status: { set: data.status },
        vendor: { set: data.vendor || '' },
        version: { set: data.version || '' },
        capacity: { set: data.capacity || '' },
        location: { set: data.location || '' },
        ipAddress: { set: data.ipAddress || '' },
        operatingSystem: { set: data.operatingSystem || '' },
        specifications: { set: data.specifications || '' },
        maintenanceWindow: { set: data.maintenanceWindow || '' },
        costs: { set: data.costs ?? null },
        planningDate: { set: data.planningDate || null },
        introductionDate: { set: data.introductionDate || null },
        endOfUseDate: { set: data.endOfUseDate || null },
        endOfLifeDate: { set: data.endOfLifeDate || null },
        owners: [
          data.ownerId
            ? {
                disconnect: [{ where: {} }],
                connect: [
                  {
                    where: { node: { id: { eq: data.ownerId } } },
                  },
                ],
              }
            : { disconnect: [{ where: {} }] },
        ],
        parentInfrastructure: [
          parentId
            ? {
                disconnect: [{ where: {} }],
                connect: [
                  {
                    where: { node: { id: { eq: parentId } } },
                  },
                ],
              }
            : { disconnect: [{ where: {} }] },
        ],
        childInfrastructures: [
          data.childInfrastructures && data.childInfrastructures.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.childInfrastructures.map((cid: string) => ({
                  where: { node: { id: { eq: cid } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
        hostsApplications: [
          data.hostsApplications && data.hostsApplications.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.hostsApplications.map((aid: string) => ({
                  where: { node: { id: { eq: aid } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
        ...(showTechnologyManagementRelationship
          ? {
              softwareVersions: [
                data.softwareVersionIds && data.softwareVersionIds.length
                  ? {
                      disconnect: [{ where: {} }],
                      connect: data.softwareVersionIds.map((sid: string) => ({
                        where: { node: { id: { eq: sid } } },
                      })),
                    }
                  : { disconnect: [{ where: {} }] },
              ],
              hardwareVersions: [
                data.hardwareVersionIds && data.hardwareVersionIds.length
                  ? {
                      disconnect: [{ where: {} }],
                      connect: data.hardwareVersionIds.map((hid: string) => ({
                        where: { node: { id: { eq: hid } } },
                      })),
                    }
                  : { disconnect: [{ where: {} }] },
              ],
            }
          : {}),
        providedBy: [
          data.providedBy && data.providedBy.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.providedBy.map((sid: string) => ({
                  where: { node: { id: { eq: sid } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
        hostedBy: [
          data.hostedBy && data.hostedBy.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.hostedBy.map((sid: string) => ({
                  where: { node: { id: { eq: sid } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
        maintainedBy: [
          data.maintainedBy && data.maintainedBy.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.maintainedBy.map((sid: string) => ({
                  where: { node: { id: { eq: sid } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
        partOfArchitectures: [
          data.partOfArchitectures && data.partOfArchitectures.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.partOfArchitectures.map((arid: string) => ({
                  where: { node: { id: { eq: arid } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
        depictedInDiagrams: [
          data.depictedInDiagrams && data.depictedInDiagrams.length
            ? {
                disconnect: [{ where: {} }],
                connect: data.depictedInDiagrams.map((did: string) => ({
                  where: { node: { id: { eq: did } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        ],
      }

      await updateInfrastructure({
        variables: {
          id,
          input: updateInput,
        },
      })
      enqueueSnackbar(t('messages.updateSuccess' as any), { variant: 'success' })
      refetch()
    } catch (error) {
      console.error('Error updating infrastructure:', error)
      enqueueSnackbar(t('messages.updateError' as any), { variant: 'error' })
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInfrastructure({
        variables: { where: { id: { eq: id } } },
      })
      enqueueSnackbar(t('messages.deleteSuccess' as any), { variant: 'success' })
      refetch()
    } catch (error) {
      console.error('Error deleting infrastructure:', error)
      enqueueSnackbar(t('messages.deleteError' as any), { variant: 'error' })
      throw error
    }
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{t('messages.loadError')}</Typography>
      </Box>
    )
  }

  // Filterfelder für GenericFilterDialog (an Hook-State angepasst)
  const filterFields: FilterField[] = [
    {
      id: 'statusFilter',
      label: t('filter.status'),
      type: 'multiSelect',
      options: availableStatuses.map(s => ({ value: s, label: s })),
    },
    {
      id: 'typeFilter',
      label: t('filter.infrastructureType'),
      type: 'multiSelect',
      options: availableTypes.map(tp => ({ value: tp, label: tp })),
    },
    { id: 'vendorFilter', label: t('filter.vendor'), type: 'text' },
    { id: 'locationFilter', label: t('filter.location'), type: 'text' },
    { id: 'operatingSystemFilter', label: t('form.operatingSystem'), type: 'text' },
    {
      id: 'descriptionFilter',
      label: t('filter.descriptionContains'),
      type: 'text',
      placeholder: t('filter.descriptionPlaceholder') as string,
    },
    {
      id: 'updatedDateRange',
      label: t('filter.updatedInPeriod'),
      type: 'dateRange',
      fromLabel: t('filter.dateFrom') as string,
      toLabel: t('filter.dateTo') as string,
    },
  ]

  return (
    <Box sx={{ py: 2, px: 1 }}>
      {/* Header mit Create-Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowNewInfrastructureForm(true)}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <InfrastructureToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={countActiveFilters(filterState)}
          onFilterClick={() => setFilterDialogOpen(true)}
          onResetFilters={() => {
            resetFilters()
            setGlobalFilter('')
          }}
          table={tableInstance}
          enableColumnVisibilityToggle
          defaultColumnVisibility={INFRASTRUCTURE_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <InfrastructureTable
            infrastructures={finalInfrastructures as Infrastructure[]}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateInfrastructure={handleCreate}
            onUpdateInfrastructure={handleUpdate}
            onDeleteInfrastructure={handleDelete}
            onTableReady={setTableInstance}
          />
        </Paper>
      </Card>

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <GenericFilterDialog
          title={t('filter.title')}
          filterState={filterState as any}
          filterFields={filterFields}
          onFilterChange={(partial: any) => setFilterState(prev => ({ ...prev, ...partial }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterDialogOpen(false)}
          onApply={() => setFilterDialogOpen(false)}
          countActiveFilters={countActiveFilters as (s: any) => number}
        />
      )}

      {/* Create Form */}
      {showNewInfrastructureForm && (
        <InfrastructureForm
          data={null as any}
          isOpen={showNewInfrastructureForm}
          onClose={() => setShowNewInfrastructureForm(false)}
          onSubmit={handleCreate}
          mode="create"
        />
      )}
    </Box>
  )
}
