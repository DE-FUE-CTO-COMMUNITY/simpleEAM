'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { isArchitect } from '@/lib/auth'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

import {
  GET_APPLICATIONS,
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  DELETE_APPLICATION,
} from '@/graphql/application'
import {
  ApplicationStatus,
  CriticalityLevel,
  TimeCategory,
  SevenRStrategy,
  Application,
} from '@/gql/generated'
import ApplicationForm, { ApplicationFormValues } from '@/components/applications/ApplicationForm'

// Import the extracted components
import ApplicationTable, {
  APPLICATION_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/applications/ApplicationTable'
import ApplicationToolbar from '@/components/applications/ApplicationToolbar'
import ApplicationFilterDialog from '@/components/applications/ApplicationFilterDialog'
import { useApplicationFilter } from '@/components/applications/useApplicationFilter'
import { ApplicationType, FilterState } from '@/components/applications/types'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

const ApplicationsPage = () => {
  const t = useTranslations('applications')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Table instance for column visibility
  const [tableInstance, setTableInstance] = useState<any>(null)

  // Use persistent column visibility with correct default values
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    // resetColumnVisibility,
  } = usePersistentColumnVisibility({
    tableKey: 'applications',
    defaultColumnVisibility: {
      name: true,
      status: true,
      criticality: true,
      timeCategory: true,
      sevenRStrategy: true,
      vendor: true,
      version: true,
      owners: true,
      supportsCapabilities: true,
      usesDataObjects: true,
      costs: true,
      hostedOn: false, // Hidden column by default
      createdAt: true,
      updatedAt: true,
      actions: true,
    },
  })

  // Combine external and persistent onTableReady callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

  // Filter state (now managed by hook)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Extract list of available values from the data
  const [availableStatuses, setAvailableStatuses] = useState<ApplicationStatus[]>([])
  const [availableCriticalities, setAvailableCriticalities] = useState<CriticalityLevel[]>([])
  const [availableTechStack, setAvailableTechStack] = useState<string[]>([])
  const [availableVendors, setAvailableVendors] = useState<string[]>([])
  const [availableTimeCategories, setAvailableTimeCategories] = useState<TimeCategory[]>([])
  const [availableSevenRStrategies, setAvailableSevenRStrategies] = useState<SevenRStrategy[]>([])
  const [availableInfrastructures, setAvailableInfrastructures] = useState<string[]>([])

  // State for the new Application form
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false)

  // Load applications - auth check already done in layout.tsx
  const companyWhere = useCompanyWhere('company')
  const { loading, error, data, refetch } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  // Extract available values from loaded data
  const applications = useMemo(() => data?.applications || [], [data?.applications])

  useEffect(() => {
    if (applications.length) {
      const applicationsData = applications as ApplicationType[]

      // Extract all statuses and remove duplicates
      const allStatuses: ApplicationStatus[] = applicationsData
        .map((app: ApplicationType) => app.status)
        .filter(Boolean) as ApplicationStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Extract all values and remove duplicates
      const allCriticalities: CriticalityLevel[] = applicationsData
        .map((app: ApplicationType) => app.criticality)
        .filter(Boolean) as CriticalityLevel[]

      const uniqueCriticalities = Array.from(new Set(allCriticalities)).sort()
      setAvailableCriticalities(uniqueCriticalities)

      // Collect all values and remove duplicates
      const allTechTags: string[] = []
      applicationsData.forEach((app: ApplicationType) => {
        if (app.technologyStack && Array.isArray(app.technologyStack)) {
          allTechTags.push(...app.technologyStack)
        }
      })

      const uniqueTechTags = Array.from(new Set(allTechTags)).sort()
      setAvailableTechStack(uniqueTechTags)

      // Collect all values and remove duplicates
      const allVendors: string[] = applicationsData
        .map((app: ApplicationType) => app.vendor)
        .filter(Boolean) as string[]

      const uniqueVendors = Array.from(new Set(allVendors)).sort()
      setAvailableVendors(uniqueVendors)

      // Extract all values and remove duplicates
      const allTimeCategories: TimeCategory[] = applicationsData
        .map((app: ApplicationType) => app.timeCategory)
        .filter(Boolean) as TimeCategory[]

      const uniqueTimeCategories = Array.from(new Set(allTimeCategories)).sort()
      setAvailableTimeCategories(uniqueTimeCategories)

      // Extract all values and remove duplicates
      const allSevenRStrategies: SevenRStrategy[] = applicationsData
        .map((app: ApplicationType) => app.sevenRStrategy)
        .filter(Boolean) as SevenRStrategy[]

      const uniqueSevenRStrategies = Array.from(new Set(allSevenRStrategies)).sort()
      setAvailableSevenRStrategies(uniqueSevenRStrategies)

      // Extract all values and remove duplicates
      const allInfrastructures: string[] = []
      applicationsData.forEach((app: ApplicationType) => {
        if (app.hostedOn && Array.isArray(app.hostedOn)) {
          allInfrastructures.push(...app.hostedOn.map(infra => infra.name))
        }
      })

      const uniqueInfrastructures = Array.from(new Set(allInfrastructures)).sort()
      setAvailableInfrastructures(uniqueInfrastructures)
    }
  }, [applications])

  // Error handling
  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  // Apply filter to applications
  const { filterState, setFilterState, filteredApplications, resetFilters } = useApplicationFilter({
    applications,
  })

  // Mutation for creating a new Application
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createApplication, { loading: isCreating }] = useMutation(CREATE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      // Refetch with active company filter so newly created items are immediately visible
      refetch({ where: companyWhere })
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.createError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation for updating an existing Application
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading: isUpdating }] = useMutation(UPDATE_APPLICATION, {
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

  // Mutation for deleting an Application
  const [deleteApplication] = useMutation(DELETE_APPLICATION, {
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

  // Handler for creating a new Application
  const handleCreateApplicationSubmit = async (data: ApplicationFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }
    const {
      ownerId,
      supportsCapabilityIds,
      usesDataObjectIds,
      sourceOfInterfaceIds,
      targetOfInterfaceIds,
      implementsPrincipleIds,
      parentIds,
      componentIds,
      predecessorIds,
      successorIds,
      hostedOnIds,
      ...applicationData
    } = data
    // For CREATE, no special mutation object is needed as direct values are allowed
    const input = {
      name: applicationData.name,
      description: applicationData.description,
      status: applicationData.status,
      criticality: applicationData.criticality,
      timeCategory: applicationData.timeCategory,
      sevenRStrategy: applicationData.sevenRStrategy,
      costs: applicationData.costs,
      vendor: applicationData.vendor,
      version: applicationData.version,
      hostingEnvironment: applicationData.hostingEnvironment,
      technologyStack: applicationData.technologyStack,
      planningDate: applicationData.planningDate,
      introductionDate: applicationData.introductionDate,
      endOfUseDate: applicationData.endOfUseDate,
      endOfLifeDate: applicationData.endOfLifeDate,
      // If an owner was selected, use the owners structure
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      // If values were selected, connect them to the Application
      ...(supportsCapabilityIds && supportsCapabilityIds.length > 0
        ? {
            supportsCapabilities: {
              connect: supportsCapabilityIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Application
      ...(usesDataObjectIds && usesDataObjectIds.length > 0
        ? {
            usesDataObjects: {
              connect: usesDataObjectIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Application
      ...(sourceOfInterfaceIds && sourceOfInterfaceIds.length > 0
        ? {
            sourceOfInterfaces: {
              connect: sourceOfInterfaceIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(targetOfInterfaceIds && targetOfInterfaceIds.length > 0
        ? {
            targetOfInterfaces: {
              connect: targetOfInterfaceIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them
      ...(parentIds && parentIds.length > 0
        ? {
            parents: {
              connect: parentIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them
      ...(componentIds && componentIds.length > 0
        ? {
            components: {
              connect: componentIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them
      ...(predecessorIds && predecessorIds.length > 0
        ? {
            predecessors: {
              connect: predecessorIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them
      ...(successorIds && successorIds.length > 0
        ? {
            successors: {
              connect: successorIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If values were selected, connect them to the Application
      ...(implementsPrincipleIds && implementsPrincipleIds.length > 0
        ? {
            implementsPrinciples: {
              connect: implementsPrincipleIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // If Infrastructure was selected, connect it to the Application
      ...(hostedOnIds && hostedOnIds.length > 0
        ? {
            hostedOn: {
              connect: hostedOnIds.map(id => ({
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

    await createApplication({
      variables: { input: [input] },
      // For safety: also update the list in cache via refetch query with filter
      refetchQueries: [
        {
          query: GET_APPLICATIONS,
          variables: { where: companyWhere },
        },
      ],
      awaitRefetchQueries: true,
    })

    // Close form after creating
    setShowNewApplicationForm(false)
  }

  // Handler for updating an existing Application
  const handleUpdateApplicationSubmit = async (id: string, data: ApplicationFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      ownerId,
      supportsCapabilityIds,
      usesDataObjectIds,
      sourceOfInterfaceIds,
      targetOfInterfaceIds,
      implementsPrincipleIds,
      parentIds,
      componentIds,
      predecessorIds,
      successorIds,
      hostedOnIds,
      ...applicationData
    } = data

    // Prepare base input data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: Record<string, any> = {
      name: { set: applicationData.name },
      description: { set: applicationData.description },
      status: { set: applicationData.status },
      criticality: { set: applicationData.criticality },
      costs: { set: applicationData.costs },
      vendor: { set: applicationData.vendor },
      version: { set: applicationData.version },
      hostingEnvironment: { set: applicationData.hostingEnvironment },
      technologyStack: { set: applicationData.technologyStack },
      planningDate: { set: applicationData.planningDate },
      introductionDate: { set: applicationData.introductionDate },
      endOfUseDate: { set: applicationData.endOfUseDate },
      endOfLifeDate: { set: applicationData.endOfLifeDate },
      timeCategory: { set: applicationData.timeCategory },
      sevenRStrategy: { set: applicationData.sevenRStrategy },
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
                id: { eq: ownerId }, // ID must be passed as IdScalarFilters object
              },
            },
          },
        ], // Connect to new owner
      }
    } else {
      // If no owner was selected, remove all owners
      input.owners = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update capability relationships
    if (supportsCapabilityIds && supportsCapabilityIds.length > 0) {
      // Set the supportsCapabilities relationship
      input.supportsCapabilities = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: supportsCapabilityIds.map(capId => ({
          where: {
            node: {
              id: { eq: capId }, // ID must be passed as IdScalarFilters object
            },
          },
        })), // Connect to new capabilities
      }
    } else {
      // If no Capabilities were selected, remove all connections
      input.supportsCapabilities = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update DataObject relationships
    if (usesDataObjectIds && usesDataObjectIds.length > 0) {
      // Set the usesDataObjects relationship
      input.usesDataObjects = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: usesDataObjectIds.map(doId => ({
          where: {
            node: {
              id: { eq: doId }, // ID must be passed as IdScalarFilters object
            },
          },
        })), // Connect to new DataObjects
      }
    } else {
      // If no DataObjects were selected, remove all connections
      input.usesDataObjects = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Source Interface relationships
    if (sourceOfInterfaceIds && sourceOfInterfaceIds.length > 0) {
      // Set the sourceOfInterfaces relationship
      input.sourceOfInterfaces = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: sourceOfInterfaceIds.map(intfId => ({
          where: {
            node: {
              id: { eq: intfId }, // ID must be passed as IdScalarFilters object
            },
          },
        })), // Connect to new Interfaces
      }
    } else {
      // If no Source Interfaces were selected, remove all connections
      input.sourceOfInterfaces = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Target Interface relationships
    if (targetOfInterfaceIds && targetOfInterfaceIds.length > 0) {
      // Set the targetOfInterfaces relationship
      input.targetOfInterfaces = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: targetOfInterfaceIds.map(intfId => ({
          where: {
            node: {
              id: { eq: intfId }, // ID must be passed as IdScalarFilters object
            },
          },
        })), // Connect to new Interfaces
      }
    } else {
      // If no Target Interfaces were selected, remove all connections
      input.targetOfInterfaces = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Parent-Application relationships
    if (parentIds && parentIds.length > 0) {
      input.parents = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: parentIds.map(parentId => ({
          where: {
            node: {
              id: { eq: parentId },
            },
          },
        })),
      }
    } else {
      input.parents = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Component-Application relationships
    if (componentIds && componentIds.length > 0) {
      input.components = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: componentIds.map(componentId => ({
          where: {
            node: {
              id: { eq: componentId },
            },
          },
        })),
      }
    } else {
      input.components = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Predecessor-Application relationships
    if (predecessorIds && predecessorIds.length > 0) {
      input.predecessors = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: predecessorIds.map(predecessorId => ({
          where: {
            node: {
              id: { eq: predecessorId },
            },
          },
        })),
      }
    } else {
      input.predecessors = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Successor-Application relationships
    if (successorIds && successorIds.length > 0) {
      input.successors = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: successorIds.map(successorId => ({
          where: {
            node: {
              id: { eq: successorId },
            },
          },
        })),
      }
    } else {
      input.successors = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Implements-Principles relationships
    if (implementsPrincipleIds && implementsPrincipleIds.length > 0) {
      input.implementsPrinciples = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: implementsPrincipleIds.map(principleId => ({
          where: {
            node: {
              id: { eq: principleId },
            },
          },
        })),
      }
    } else {
      input.implementsPrinciples = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    // Update Infrastructure relationships (hostedOn)
    if (hostedOnIds && hostedOnIds.length > 0) {
      input.hostedOn = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
        connect: hostedOnIds.map(infraId => ({
          where: {
            node: {
              id: { eq: infraId },
            },
          },
        })),
      }
    } else {
      input.hostedOn = {
        disconnect: [{ where: {} }], // Disconnect all existing connections
      }
    }

    await updateApplication({
      variables: { id, input },
    })
  }

  // Create new application
  const handleCreateApplication = () => {
    // Wait until data is loaded before opening the form
    if (loading || !data?.applications) {
      enqueueSnackbar(t('messages.waitForData'), { variant: 'info' })
      return
    }
    setShowNewApplicationForm(true)
  }

  // Delete application
  const handleDeleteApplication = async (id: string) => {
    await deleteApplication({
      variables: { id },
    })
    // Close form after deleting
    // Automatic closing is handled by ApplicationForm itself
  }

  // Filter handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Reset filter
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
            onClick={handleCreateApplication}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <ApplicationToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={APPLICATION_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <ApplicationTable
            id="application-table"
            applications={filteredApplications}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateApplication={handleCreateApplicationSubmit}
            onUpdateApplication={handleUpdateApplicationSubmit}
            onDeleteApplication={handleDeleteApplication}
            availableTechStack={availableTechStack}
            availableApplications={applications as unknown as Application[]} // Added
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <ApplicationFilterDialog
          filterState={filterState}
          availableStatuses={availableStatuses}
          availableCriticalities={availableCriticalities}
          availableTechStack={availableTechStack}
          availableVendors={availableVendors}
          availableTimeCategories={availableTimeCategories}
          availableSevenRStrategies={availableSevenRStrategies}
          availableInfrastructures={availableInfrastructures}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Form for new application */}
      {showNewApplicationForm && (
        <ApplicationForm
          isOpen={showNewApplicationForm}
          onClose={() => setShowNewApplicationForm(false)}
          onSubmit={handleCreateApplicationSubmit}
          mode="create"
          availableApplications={applications as unknown as Application[]}
          availableTechStack={availableTechStack}
          application={
            {
              id: '',
              name: '',
              description: '',
              status: ApplicationStatus.ACTIVE,
              criticality: CriticalityLevel.MEDIUM,
              costs: null,
              vendor: '',
              version: '',
              hostingEnvironment: '',
              technologyStack: [],
              introductionDate: null,
              endOfLifeDate: null,
              owners: [],
              createdAt: new Date(0).toISOString(), // Fixed timestamp to avoid hydration mismatch
              updatedAt: null,
              supportsCapabilities: [],
              usesDataObjects: [],
              interfacesToApplications: [],
              partOfArchitectures: [],
              implementsPrinciples: [],
              __typename: 'Application',
            } as unknown as Application
          }
          loading={isCreating}
        />
      )}
    </Box>
  )
}

export default ApplicationsPage
