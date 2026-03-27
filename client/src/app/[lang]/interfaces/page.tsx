'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, isArchitect } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import {
  GET_APPLICATION_INTERFACES,
  CREATE_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
  DELETE_APPLICATION_INTERFACE,
} from '@/graphql/applicationInterface'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_PERSONS } from '@/graphql/person'
import ApplicationInterfaceForm, {
  ApplicationInterfaceFormValues,
} from '@/components/interfaces/ApplicationInterfaceForm'

// Import the extracted components
import ApplicationInterfaceTable, {
  APPLICATION_INTERFACE_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/interfaces/ApplicationInterfaceTable'
import ApplicationInterfaceToolbar from '@/components/interfaces/ApplicationInterfaceToolbar'
import ApplicationInterfaceFilterDialog from '@/components/interfaces/ApplicationInterfaceFilterDialog'
import { useApplicationInterfaceFilter } from '@/components/interfaces/useApplicationInterfaceFilter'
import { FilterState } from '@/components/interfaces/types'
import { DataObject } from '@/gql/generated'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

function ApplicationInterfacesPage() {
  const { authenticated, initialized } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('interfaces')
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // State for the new form
  const [showNewApplicationInterfaceForm, setShowNewApplicationInterfaceForm] = useState(false)

  // Load interfaces - auth check already done in layout.tsx
  const companyWhere = useCompanyWhere('company')
  const { loading, error, data, refetch } = useQuery(GET_APPLICATION_INTERFACES, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  const { data: dataObjectsData } = useQuery(GET_DATA_OBJECTS, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  // Load applications for form selection options
  const { data: applicationsData } = useQuery(GET_APPLICATIONS, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  // Load persons for form selection options
  const personWhere = useCompanyWhere('companies')
  const { data: personsData } = useQuery(GET_PERSONS, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: personWhere },
  })

  const dataObjects = dataObjectsData?.dataObjects || []
  const applications = applicationsData?.applications || []
  const persons = personsData?.people || []

  // Error handling
  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  const applicationInterfaces = data?.applicationInterfaces || []

  // Apply filter to interfaces
  const {
    filterState,
    setFilterState,
    filteredApplicationInterfaces: filteredData,
    resetFilters,
    availableInterfaceTypes,
    availableProtocols,
    availableStatuses,
    availableOwners,
    availableSourceApplications,
    availableTargetApplications,
    availableDataObjects,
    availableVersions,
  } = useApplicationInterfaceFilter({
    applicationInterfaces,
  })

  // Mutation for creating a new Interface
  const [createApplicationInterface, { loading: isCreating }] = useMutation(
    CREATE_APPLICATION_INTERFACE,
    {
      onCompleted: () => {
        enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
        refetch()
      },
      onError: error => {
        enqueueSnackbar(`${t('messages.createError')}: ${error.message}`, {
          variant: 'error',
        })
      },
    }
  )

  // Mutation for updating an existing Interface
  const [updateApplicationInterface] = useMutation(UPDATE_APPLICATION_INTERFACE, {
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

  // Mutation for deleting an Interface
  const [deleteApplicationInterface] = useMutation(DELETE_APPLICATION_INTERFACE, {
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

  // Handler for creating a new interface
  const handleCreateApplicationInterfaceSubmit = async (data: ApplicationInterfaceFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }
    const input = {
      name: data.name,
      description: data.description,
      interfaceType: data.interfaceType,
      protocol: data.protocol,
      version: data.version,
      status: data.status,
      planningDate: data.planningDate,
      introductionDate: data.introductionDate,
      endOfUseDate: data.endOfUseDate,
      endOfLifeDate: data.endOfLifeDate,
      owners: data.owners
        ? {
            connect: {
              where: {
                node: { id: { eq: data.owners } },
              },
            },
          }
        : undefined,
      sourceApplications: data.sourceApplications?.length
        ? {
            connect: data.sourceApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      targetApplications: data.targetApplications?.length
        ? {
            connect: data.targetApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      dataObjects: data.dataObjects?.length
        ? {
            connect: data.dataObjects.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      predecessors: data.predecessorIds?.length
        ? {
            connect: data.predecessorIds.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      successors: data.successorIds?.length
        ? {
            connect: data.successorIds.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      partOfArchitectures: data.partOfArchitectures?.length
        ? {
            connect: data.partOfArchitectures.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      depictedInDiagrams: data.depictedInDiagrams?.length
        ? {
            connect: data.depictedInDiagrams.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      // Company assignment (required)
      company: {
        connect: [
          {
            where: { node: { id: { eq: selectedCompanyId } } },
          },
        ],
      },
    }

    await createApplicationInterface({
      variables: { input: [input] },
    })

    // Close form after creating
    setShowNewApplicationInterfaceForm(false)
  }

  // Handler for updating an existing Interface
  const handleUpdateApplicationInterfaceSubmit = async (
    id: string,
    data: ApplicationInterfaceFormValues
  ) => {
    // Prepare base input data
    const input = {
      name: { set: data.name },
      description: { set: data.description },
      interfaceType: { set: data.interfaceType },
      protocol: { set: data.protocol },
      version: { set: data.version },
      status: { set: data.status },
      planningDate: { set: data.planningDate },
      introductionDate: { set: data.introductionDate },
      endOfUseDate: { set: data.endOfUseDate },
      endOfLifeDate: { set: data.endOfLifeDate },
      owners: data.owners
        ? {
            disconnect: [{ where: {} }], // Disconnect all existing connections
            connect: {
              where: {
                node: { id: { eq: data.owners } },
              },
            },
          }
        : { disconnect: [{ where: {} }] },
      sourceApplications: data.sourceApplications?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.sourceApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      targetApplications: data.targetApplications?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.targetApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      dataObjects: data.dataObjects?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.dataObjects.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      predecessors: data.predecessorIds?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.predecessorIds.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      successors: data.successorIds?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.successorIds.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      partOfArchitectures: data.partOfArchitectures?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.partOfArchitectures.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      depictedInDiagrams: data.depictedInDiagrams?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.depictedInDiagrams.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
    }

    await updateApplicationInterface({
      variables: { id, input },
    })
  }

  // Create new interface
  const handleCreateApplicationInterface = () => {
    setShowNewApplicationInterfaceForm(true)
  }

  // Delete interface
  const handleDeleteApplicationInterface = async (id: string) => {
    await deleteApplicationInterface({
      variables: { id },
    })
    // Automatisches Schließen erfolgt durch die Form selbst
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
            onClick={handleCreateApplicationInterface}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <ApplicationInterfaceToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={APPLICATION_INTERFACE_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <ApplicationInterfaceTable
            id="application-interface-table"
            applicationInterfaces={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateApplicationInterface={handleCreateApplicationInterfaceSubmit}
            onUpdateApplicationInterface={handleUpdateApplicationInterfaceSubmit}
            onDeleteApplicationInterface={handleDeleteApplicationInterface}
            dataObjects={dataObjects as DataObject[]}
            applications={applications}
            persons={persons}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <ApplicationInterfaceFilterDialog
          filterState={filterState}
          availableInterfaceTypes={availableInterfaceTypes}
          availableProtocols={availableProtocols}
          availableStatuses={availableStatuses}
          availableOwners={availableOwners}
          availableSourceApplications={availableSourceApplications}
          availableTargetApplications={availableTargetApplications}
          availableDataObjects={availableDataObjects}
          availableVersions={availableVersions}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Formular für neue Schnittstelle */}
      {showNewApplicationInterfaceForm && (
        <ApplicationInterfaceForm
          isOpen={showNewApplicationInterfaceForm}
          onClose={() => setShowNewApplicationInterfaceForm(false)}
          onSubmit={handleCreateApplicationInterfaceSubmit}
          mode="create"
          loading={isCreating}
          dataObjects={dataObjects as DataObject[]}
          applications={applications}
          persons={persons}
        />
      )}
    </Box>
  )
}

export default ApplicationInterfacesPage
