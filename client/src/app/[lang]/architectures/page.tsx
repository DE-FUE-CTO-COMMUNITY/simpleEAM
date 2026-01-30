'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useAuth, isArchitect } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import {
  GET_ARCHITECTURES,
  CREATE_ARCHITECTURE,
  UPDATE_ARCHITECTURE,
  DELETE_ARCHITECTURE,
} from '@/graphql/architecture'
import { ArchitectureDomain, ArchitectureType as ArchitectureEnumType } from '@/gql/generated'
import ArchitectureForm, {
  ArchitectureFormValues,
} from '@/components/architectures/ArchitectureForm'

// Import the extracted components
import ArchitectureTable, {
  ARCHITECTURE_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/architectures/ArchitectureTable'
import ArchitectureToolbar from '@/components/architectures/ArchitectureToolbar'
import ArchitectureFilterDialog from '@/components/architectures/ArchitectureFilterDialog'
import { useArchitectureFilter } from '@/components/architectures/useArchitectureFilter'
import { ArchitectureType, FilterState } from '@/components/architectures/types'
import { useCompanyContext } from '@/contexts/CompanyContext'

const ArchitecturesPage = () => {
  const { authenticated, initialized } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('architectures')
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter state
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Extract list of available values from the data
  const [availableDomains, setAvailableDomains] = useState<ArchitectureDomain[]>([])
  const [availableTypes, setAvailableTypes] = useState<ArchitectureEnumType[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // State for the new Architecture form
  const [showNewArchitectureForm, setShowNewArchitectureForm] = useState(false)

  // Load architectures - auth check already done in layout.tsx
  const companyWhere = useCompanyWhere('company')
  const { loading, error, data, refetch } = useQuery(GET_ARCHITECTURES, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  // Extract available values from loaded data
  useEffect(() => {
    if (data?.architectures?.length) {
      const architectures = data.architectures as ArchitectureType[]

      // Extract all values and remove duplicates
      const allDomains: ArchitectureDomain[] = architectures
        .map((arch: ArchitectureType) => arch.domain)
        .filter(Boolean) as ArchitectureDomain[]

      const uniqueDomains = Array.from(new Set(allDomains)).sort()
      setAvailableDomains(uniqueDomains)

      // Extract all values and remove duplicates
      const allTypes: ArchitectureEnumType[] = architectures
        .map((arch: ArchitectureType) => arch.type)
        .filter(Boolean) as ArchitectureEnumType[]

      const uniqueTypes = Array.from(new Set(allTypes)).sort()
      setAvailableTypes(uniqueTypes)

      // Collect all tags and remove duplicates
      const allTags: string[] = []
      architectures.forEach((arch: ArchitectureType) => {
        if (arch.tags && Array.isArray(arch.tags)) {
          allTags.push(...arch.tags)
        }
      })

      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)
    }
  }, [data])

  // Error handling
  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('loadingError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const architectures = data?.architectures || []

  // Use filter hook (Pattern 2)
  const { filterState, setFilterState, filteredArchitectures } = useArchitectureFilter({
    architectures,
  })

  // Mutation for creating a new Architecture
  const [createArchitecture, { loading: isCreating }] = useMutation(CREATE_ARCHITECTURE, {
    onCompleted: () => {
      enqueueSnackbar(t('createSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('createError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation for updating an existing Architecture
  const [updateArchitecture] = useMutation(UPDATE_ARCHITECTURE, {
    onCompleted: data => {
      // Check the result of the mutation
      if (data?.updateArchitectures?.architectures?.length > 0) {
        enqueueSnackbar(t('updateSuccess'), { variant: 'success' })
      } else {
        enqueueSnackbar(t('updateWarning'), {
          variant: 'warning',
        })
      }

      // Explicitly reload to see the changes
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('updateError')}: ${error.message}`, {
        variant: 'error',
      })
    },
    // Complete update of Apollo cache after mutation
    refetchQueries: [{ query: GET_ARCHITECTURES }],
    awaitRefetchQueries: true,
  })

  // Mutation for deleting an Architecture
  const [deleteArchitecture] = useMutation(DELETE_ARCHITECTURE, {
    onCompleted: () => {
      enqueueSnackbar(t('deleteSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('deleteError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler for creating a new Architecture
  const handleCreateArchitectureSubmit = async (data: ArchitectureFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('selectCompanyFirst'), { variant: 'warning' })
      return
    }
    const {
      ownerId,
      containsApplicationIds,
      containsCapabilityIds,
      containsDataObjectIds,
      containsInterfaceIds,
      containsInfrastructureIds,
      diagramIds,
      parentArchitectureId,
      appliedPrincipleIds,
      ...architectureData
    } = data

    // For CREATE, no special mutation object is needed as direct values are allowed
    const input = {
      name: architectureData.name,
      description: architectureData.description,
      domain: architectureData.domain,
      type: architectureData.type,
      tags: architectureData.tags,
      timestamp: architectureData.timestamp.toISOString(), // Use the validity date selected by the user
      // If an owner was selected, use the owners structure
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      // If values were selected, connect them to the Architecture
      ...(containsApplicationIds && containsApplicationIds.length > 0
        ? {
            containsApplications: {
              connect: containsApplicationIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Architecture
      ...(containsCapabilityIds && containsCapabilityIds.length > 0
        ? {
            containsCapabilities: {
              connect: containsCapabilityIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Architecture
      ...(containsDataObjectIds && containsDataObjectIds.length > 0
        ? {
            containsDataObjects: {
              connect: containsDataObjectIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Architecture
      ...(containsInterfaceIds && containsInterfaceIds.length > 0
        ? {
            containsInterfaces: {
              connect: containsInterfaceIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If Infrastructure was selected, connect it to the Architecture
      ...(containsInfrastructureIds && containsInfrastructureIds.length > 0
        ? {
            containsInfrastructure: {
              connect: containsInfrastructureIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Architecture
      ...(diagramIds && diagramIds.length > 0
        ? {
            diagrams: {
              connect: diagramIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If a parent architecture was selected, connect it to the Architecture
      ...(parentArchitectureId
        ? {
            parentArchitecture: {
              connect: { where: { node: { id: { eq: parentArchitectureId } } } },
            },
          }
        : {}),
      // If values were selected, connect them to the Architecture
      ...(appliedPrincipleIds && appliedPrincipleIds.length > 0
        ? {
            appliedPrinciples: {
              connect: appliedPrincipleIds.map(id => ({
                where: { node: { id: { eq: id } } },
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

    await createArchitecture({
      variables: { input: [input] },
    })

    // Close form after creating
    setShowNewArchitectureForm(false)
  }

  // Handler for updating an existing Architecture
  const handleUpdateArchitectureSubmit = async (id: string, data: ArchitectureFormValues) => {
    const {
      ownerId,
      containsApplicationIds,
      containsCapabilityIds,
      containsDataObjectIds,
      containsInterfaceIds,
      containsInfrastructureIds,
      diagramIds,
      parentArchitectureId,
      appliedPrincipleIds,
      ...architectureData
    } = data

    // Ensure a valid date is used
    let timestamp: Date

    if (architectureData.timestamp instanceof Date) {
      timestamp = architectureData.timestamp
    } else if (typeof architectureData.timestamp === 'string') {
      try {
        timestamp = new Date(architectureData.timestamp)
      } catch {
        timestamp = new Date(1735689600000) // Fixed timestamp for SSR consistency
      }
    } else {
      timestamp = new Date(1735689600000) // Fixed timestamp for SSR consistency
    }

    // Prepare base input data
    const input: Record<string, any> = {
      name: { set: architectureData.name },
      description: { set: architectureData.description },
      domain: { set: architectureData.domain },
      type: { set: architectureData.type },
      tags: { set: Array.isArray(architectureData.tags) ? architectureData.tags : [] },
      timestamp: { set: timestamp.toISOString() }, // Use the date selected by the user
    }

    // Update owner relationship if an owner was selected
    if (ownerId) {
      // Set the owners relationship
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
      // If no owner was selected, remove all owners
      input.owners = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Application-Beziehungen
    if (containsApplicationIds && containsApplicationIds.length > 0) {
      input.containsApplications = {
        disconnect: [{ where: {} }],
        connect: containsApplicationIds.map(appId => ({
          where: {
            node: {
              id: { eq: appId },
            },
          },
        })),
      }
    } else {
      input.containsApplications = {
        disconnect: [{ where: {} }],
      }
    }

    // Update capability relationships
    if (containsCapabilityIds && containsCapabilityIds.length > 0) {
      input.containsCapabilities = {
        disconnect: [{ where: {} }],
        connect: containsCapabilityIds.map(capId => ({
          where: {
            node: {
              id: { eq: capId },
            },
          },
        })),
      }
    } else {
      input.containsCapabilities = {
        disconnect: [{ where: {} }],
      }
    }

    // Update DataObject relationships
    if (containsDataObjectIds && containsDataObjectIds.length > 0) {
      input.containsDataObjects = {
        disconnect: [{ where: {} }],
        connect: containsDataObjectIds.map(doId => ({
          where: {
            node: {
              id: { eq: doId },
            },
          },
        })),
      }
    } else {
      input.containsDataObjects = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Interface-Beziehungen
    if (containsInterfaceIds && containsInterfaceIds.length > 0) {
      input.containsInterfaces = {
        disconnect: [{ where: {} }],
        connect: containsInterfaceIds.map(intId => ({
          where: {
            node: {
              id: { eq: intId },
            },
          },
        })),
      }
    } else {
      input.containsInterfaces = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Infrastructure-Beziehungen
    if (containsInfrastructureIds && containsInfrastructureIds.length > 0) {
      input.containsInfrastructure = {
        disconnect: [{ where: {} }],
        connect: containsInfrastructureIds.map(infId => ({
          where: {
            node: {
              id: { eq: infId },
            },
          },
        })),
      }
    } else {
      input.containsInfrastructure = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Diagram-Beziehungen
    if (diagramIds && diagramIds.length > 0) {
      input.diagrams = {
        disconnect: [{ where: {} }],
        connect: diagramIds.map(diagId => ({
          where: {
            node: {
              id: { eq: diagId },
            },
          },
        })),
      }
    } else {
      input.diagrams = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der ParentArchitecture-Beziehung
    if (parentArchitectureId) {
      input.parentArchitecture = {
        disconnect: [{ where: {} }],
        connect: {
          where: {
            node: {
              id: { eq: parentArchitectureId },
            },
          },
        },
      }
    } else {
      input.parentArchitecture = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der AppliedPrinciples-Beziehungen
    if (appliedPrincipleIds && appliedPrincipleIds.length > 0) {
      input.appliedPrinciples = {
        disconnect: [{ where: {} }],
        connect: appliedPrincipleIds.map(principleId => ({
          where: {
            node: {
              id: { eq: principleId },
            },
          },
        })),
      }
    } else {
      input.appliedPrinciples = {
        disconnect: [{ where: {} }],
      }
    }

    await updateArchitecture({
      variables: { id, input },
    })
  }

  // Create new architecture
  const handleCreateArchitecture = () => {
    setShowNewArchitectureForm(true)
  }

  // Delete architecture
  const handleDeleteArchitecture = async (id: string) => {
    await deleteArchitecture({
      variables: { id },
    })
  }

  // Filter handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Reset filter
  const handleResetFilter = () => {
    setFilterState({
      domainFilter: [],
      typeFilter: [],
      tagsFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
    })
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
            onClick={handleCreateArchitecture}
            disabled={!selectedCompanyId}
          >
            {t('createNew')}
          </Button>
        )}
      </Box>

      {/* Architektur-Erstellungsformular */}
      {showNewArchitectureForm && (
        <Card sx={{ mb: 3 }}>
          <ArchitectureForm
            mode="create"
            isOpen={true}
            onSubmit={handleCreateArchitectureSubmit}
            onClose={() => setShowNewArchitectureForm(false)}
            loading={isCreating}
            architecture={null}
            availableArchitectures={architectures}
          />
        </Card>
      )}

      {/* Filter-Dialog */}
      {isFilterDialogOpen && (
        <ArchitectureFilterDialog
          filterState={filterState}
          availableDomains={availableDomains}
          availableTypes={availableTypes}
          availableTags={availableTags}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setIsFilterDialogOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setIsFilterDialogOpen(false)
          }}
        />
      )}

      <Card>
        {/* Toolbar für Suche und Filter */}
        <ArchitectureToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onFilterClick={() => setIsFilterDialogOpen(true)}
          onAddClick={handleCreateArchitecture}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={ARCHITECTURE_DEFAULT_COLUMN_VISIBILITY}
        />

        {/* Tabelle der Architekturen */}
        <ArchitectureTable
          architectures={filteredArchitectures || []}
          loading={loading}
          globalFilter={globalFilter}
          sorting={sorting}
          onSortingChange={setSorting}
          onCreateArchitecture={handleCreateArchitectureSubmit}
          onUpdateArchitecture={handleUpdateArchitectureSubmit}
          onDeleteArchitecture={handleDeleteArchitecture}
          availableArchitectures={architectures}
          onTableReady={setTableInstance}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </Card>
    </Box>
  )
}

export default ArchitecturesPage
