'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useAuth, isArchitect } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import {
  GET_CAPABILITIES,
  CREATE_CAPABILITY,
  UPDATE_CAPABILITY,
  DELETE_CAPABILITY,
} from '@/graphql/capability'
import { CapabilityStatus, BusinessCapability } from '@/gql/generated'
import CapabilityForm, { CapabilityFormValues } from '@/components/capabilities/CapabilityForm'

// Import the extracted components
import CapabilityTable, {
  CAPABILITY_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/capabilities/CapabilityTable'
import CapabilityToolbar from '@/components/capabilities/CapabilityToolbar'
import CapabilityFilterDialog from '@/components/capabilities/CapabilityFilterDialog'
import { useCapabilityFilter } from '@/components/capabilities/useCapabilityFilter'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

const CapabilitiesPage = () => {
  const { authenticated, initialized } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('capabilities')
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false)
  // Use filter hook (after capabilities query)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Extract list of available statuses and tags from the data
  const [availableStatuses, setAvailableStatuses] = useState<CapabilityStatus[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // State for the new capability form
  const [showNewCapabilityForm, setShowNewCapabilityForm] = useState(false)

  // Load business capabilities - auth check already done in layout.tsx
  const companyWhere = useCompanyWhere('company')
  const { loading, error, data, refetch } = useQuery(GET_CAPABILITIES, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  // Extract available statuses and tags from loaded data
  useEffect(() => {
    if (data?.businessCapabilities?.length) {
      const capabilities = data.businessCapabilities as BusinessCapability[]

      // Extract all statuses and remove duplicates
      const allStatuses: CapabilityStatus[] = capabilities
        .map((cap: BusinessCapability) => cap.status)
        .filter(Boolean) as CapabilityStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Collect all tags and remove duplicates
      const allTags: string[] = []
      capabilities.forEach((cap: BusinessCapability) => {
        if (cap.tags && Array.isArray(cap.tags)) {
          allTags.push(...cap.tags)
        }
      })

      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)
    }
  }, [data])

  // Error handling
  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const capabilities = data?.businessCapabilities || []

  // Use filter hook
  const { filterState, setFilterState, filteredCapabilities, resetFilters } = useCapabilityFilter({
    capabilities,
  })

  // Mutation for creating a new capability
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createCapability, { loading: isCreating }] = useMutation(CREATE_CAPABILITY, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.createError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation for updating an existing capability
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateCapability, { loading: isUpdating }] = useMutation(UPDATE_CAPABILITY, {
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

  // Mutation for deleting a capability
  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
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

  // Handler for creating a new business capability
  const handleCreateCapabilitySubmit = async (data: CapabilityFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }
    const {
      parentId: parent,
      ownerId,
      children,
      supportedByApplications,
      partOfArchitectures,
      ...capabilityData
    } = data

    // For CREATE, no special mutation object is needed as direct values are allowed
    const input = {
      name: capabilityData.name,
      description: capabilityData.description,
      maturityLevel: capabilityData.maturityLevel,
      businessValue: capabilityData.businessValue,
      status: capabilityData.status,
      ...(capabilityData.type ? { type: capabilityData.type } : {}),
      sequenceNumber: capabilityData.sequenceNumber,
      ...(capabilityData.introductionDate
        ? { introductionDate: capabilityData.introductionDate.toISOString().split('T')[0] }
        : {}),
      ...(capabilityData.endDate
        ? { endDate: capabilityData.endDate.toISOString().split('T')[0] }
        : {}),
      tags: capabilityData.tags,
      // If an owner was selected, use the owners structure (nur ein Owner)
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      ...(parent
        ? {
            parents: {
              connect: [{ where: { node: { id: { eq: parent } } } }],
            },
          }
        : {}),
      // Untergeordnete Capabilities
      ...(children && children.length > 0
        ? {
            children: {
              connect: children.map((childId: string) => ({
                where: { node: { id: { eq: childId } } },
              })),
            },
          }
        : {}),
      // Unterstützende Applikationen
      ...(supportedByApplications && supportedByApplications.length > 0
        ? {
            supportedByApplications: {
              connect: supportedByApplications.map((appId: string) => ({
                where: { node: { id: { eq: appId } } },
              })),
            },
          }
        : {}),
      // Architekturen
      ...(partOfArchitectures && partOfArchitectures.length > 0
        ? {
            partOfArchitectures: {
              connect: partOfArchitectures.map((archId: string) => ({
                where: { node: { id: { eq: archId } } },
              })),
            },
          }
        : {}),
      // Company assignment (required)
      company: {
        connect: [
          {
            where: { node: { id: { eq: selectedCompanyId } } },
          },
        ],
      },
    }

    await createCapability({
      variables: { input: [input] },
    })

    // Close form after creating
    setShowNewCapabilityForm(false)
  }

  // Handler for updating an existing business capability
  const handleUpdateCapabilitySubmit = async (id: string, data: CapabilityFormValues) => {
    const {
      parentId,
      ownerId,
      children,
      supportedByApplications,
      partOfArchitectures,
      ...capabilityData
    } = data

    // Prepare base input data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: Record<string, any> = {
      name: { set: capabilityData.name },
      description: { set: capabilityData.description },
      maturityLevel: { set: capabilityData.maturityLevel },
      businessValue: { set: capabilityData.businessValue },
      status: { set: capabilityData.status },
      sequenceNumber: { set: capabilityData.sequenceNumber },
      tags: { set: capabilityData.tags },
    }

    // Set lifecycle fields
    if (capabilityData.introductionDate) {
      input.introductionDate = { set: capabilityData.introductionDate.toISOString().split('T')[0] }
    }
    if (capabilityData.endDate) {
      input.endDate = { set: capabilityData.endDate.toISOString().split('T')[0] }
    }

    // Only set type if it has a value
    if (capabilityData.type) {
      input.type = { set: capabilityData.type }
    }

    // Update owner relationship if an owner was selected
    if (ownerId) {
      input.owners = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: [
          {
            where: {
              node: {
                id: { eq: ownerId },
              },
            },
          },
        ],
      }
    } else {
      input.owners = {
        disconnect: [{ where: {} }],
      }
    }

    // Update parent capability
    if (parentId) {
      input.parents = {
        disconnect: [{ where: {} }],
        connect: [
          {
            where: {
              node: {
                id: { eq: parentId },
              },
            },
          },
        ],
      }
    } else {
      input.parents = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der untergeordneten Capabilities
    if (children && children.length > 0) {
      input.children = {
        disconnect: [{ where: {} }],
        connect: children.map((childId: string) => ({
          where: {
            node: {
              id: { eq: childId },
            },
          },
        })),
      }
    } else {
      input.children = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der unterstützenden Applikationen
    if (supportedByApplications && supportedByApplications.length > 0) {
      input.supportedByApplications = {
        disconnect: [{ where: {} }],
        connect: supportedByApplications.map((appId: string) => ({
          where: {
            node: {
              id: { eq: appId },
            },
          },
        })),
      }
    } else {
      input.supportedByApplications = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Architekturen
    if (partOfArchitectures && partOfArchitectures.length > 0) {
      input.partOfArchitectures = {
        disconnect: [{ where: {} }],
        connect: partOfArchitectures.map((archId: string) => ({
          where: {
            node: {
              id: { eq: archId },
            },
          },
        })),
      }
    } else {
      input.partOfArchitectures = {
        disconnect: [{ where: {} }],
      }
    }

    await updateCapability({
      variables: { id, input },
    })
  }

  // Neue Business Capability erstellen
  const handleCreateCapability = () => {
    // Here we directly add the logic for creating a new capability,
    // instead of using a hidden button
    setShowNewCapabilityForm(true)
  }

  // Delete business capability
  const handleDeleteCapability = async (id: string) => {
    await deleteCapability({
      variables: { id },
    })
    // Close form after deleting
    // Automatic closing is handled by the CapabilityForm itself
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
            onClick={handleCreateCapability}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CapabilityToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={CAPABILITY_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <CapabilityTable
            id="capability-table"
            capabilities={filteredCapabilities}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateCapability={handleCreateCapabilitySubmit}
            onUpdateCapability={handleUpdateCapabilitySubmit}
            onDeleteCapability={handleDeleteCapability}
            availableTags={availableTags}
            availableCapabilities={capabilities as BusinessCapability[]}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <CapabilityFilterDialog
          filterState={filterState}
          availableStatuses={availableStatuses}
          availableTags={availableTags}
          onFilterChange={(newFilterValues: any) => {
            setFilterState(prev => ({ ...prev, ...newFilterValues }))
          }}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Formular für neue Capability */}
      {showNewCapabilityForm && (
        <CapabilityForm
          isOpen={showNewCapabilityForm}
          onClose={() => setShowNewCapabilityForm(false)}
          onSubmit={handleCreateCapabilitySubmit}
          mode="create"
          availableCapabilities={capabilities as BusinessCapability[]}
          availableTags={availableTags}
        />
      )}
    </Box>
  )
}

export default CapabilitiesPage
