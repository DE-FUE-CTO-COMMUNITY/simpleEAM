'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Box, Typography, Card, Button, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useAuth, isArchitect } from '@/lib/auth'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import {
  GET_DATA_OBJECTS,
  CREATE_DATA_OBJECT,
  UPDATE_DATA_OBJECT,
  DELETE_DATA_OBJECT,
} from '@/graphql/dataObject'
import DataObjectTable, {
  DATAOBJECT_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/dataobjects/DataObjectTable'
import DataObjectToolbar from '@/components/dataobjects/DataObjectToolbar'
import DataObjectFilterDialog from '@/components/dataobjects/DataObjectFilterDialog'
import DataObjectForm, { DataObjectFormValues } from '@/components/dataobjects/DataObjectForm'
import { useDataObjectFilter } from '@/components/dataobjects/useDataObjectFilter'
import { DataObject } from '@/gql/generated'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

const DataObjectsPage = () => {
  const { authenticated, initialized } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('dataObjects')
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  // State for the DataObject form
  const [showNewDataObjectForm, setShowNewDataObjectForm] = useState(false)

  // GraphQL query for data objects
  const companyWhere = useCompanyWhere('company')
  const { data, loading, refetch } = useQuery(GET_DATA_OBJECTS, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  // GraphQL mutations for data objects
  const [createDataObject, { loading: isCreating }] = useMutation(CREATE_DATA_OBJECT, {
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

  const [updateDataObject] = useMutation(UPDATE_DATA_OBJECT, {
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

  const [deleteDataObject] = useMutation(DELETE_DATA_OBJECT, {
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

  // Real data from GraphQL or fallback to empty array - auth check already done in layout.tsx
  const dataObjects: DataObject[] = useMemo(() => {
    return data?.dataObjects || []
  }, [data])

  // Use filter hook (Pattern 2)
  const {
    filterState,
    setFilterState,
    filteredDataObjects,
    resetFilters: resetHookFilters,
    availableFormats,
    availableSources,
    availableUsedByApplications,
    availableRelatedToCapabilities,
    availablePartOfArchitectures,
    availableOwners,
  } = useDataObjectFilter({ dataobjects: dataObjects })

  // Filter-Optionen direkt vom Hook verwenden (Pattern 2)
  const filterOptions = useMemo(
    () => ({
      availableFormats,
      availableSources,
      availableOwners,
      availableUsedByApplications,
      availableRelatedToCapabilities,
      availablePartOfArchitectures,
    }),
    [
      availableFormats,
      availableSources,
      availableOwners,
      availableUsedByApplications,
      availableRelatedToCapabilities,
      availablePartOfArchitectures,
    ]
  )

  // Counts active filters
  const activeFiltersCount = useMemo(() => {
    return (
      filterState.classifications.length +
      filterState.formats.length +
      filterState.sources.length +
      filterState.owners.length +
      filterState.usedByApplications.length +
      filterState.relatedToCapabilities.length +
      filterState.partOfArchitectures.length +
      (filterState.descriptionFilter ? 1 : 0) +
      (filterState.updatedDateRange[0] || filterState.updatedDateRange[1] ? 1 : 0)
    )
  }, [filterState])

  // Handler for resetting filters
  const resetFilters = useCallback(() => {
    resetHookFilters()
    setGlobalFilter('')
  }, [resetHookFilters])

  // Handler for opening form to create new data object
  const handleCreateDataObject = useCallback(() => {
    setShowNewDataObjectForm(true)
  }, [])

  // Handler for creating new data object
  const handleCreateDataObjectSubmit = async (data: DataObjectFormValues) => {
    try {
      if (!selectedCompanyId) {
        enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
        return
      }
      const input = {
        name: data.name,
        description: data.description,
        classification: data.classification,
        format: data.format,
        planningDate: data.planningDate,
        introductionDate: data.introductionDate,
        endOfUseDate: data.endOfUseDate,
        endOfLifeDate: data.endOfLifeDate,
        dataSources: data.dataSources?.length
          ? {
              connect: data.dataSources.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        usedByApplications: data.usedByApplications?.length
          ? {
              connect: data.usedByApplications.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        relatedToCapabilities: data.relatedToCapabilities?.length
          ? {
              connect: data.relatedToCapabilities.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        transferredInInterfaces: data.transferredInInterfaces?.length
          ? {
              connect: data.transferredInInterfaces.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        relatedDataObjects: data.relatedDataObjects?.length
          ? {
              connect: data.relatedDataObjects.map(id => ({
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
        ...(data.ownerId
          ? { owners: { connect: [{ where: { node: { id: { eq: data.ownerId } } } }] } }
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

      await createDataObject({
        variables: {
          input: [input],
        },
      })

      // Close form after creating
      setShowNewDataObjectForm(false)
    } catch (error) {
      console.error('Error creating data object:', error)
    }
  }

  // Handler for updating data object
  const handleUpdateDataObjectSubmit = async (id: string, data: DataObjectFormValues) => {
    try {
      // Find the current data object to compare changes
      const currentDataObject = dataObjects.find(obj => obj.id === id)
      if (!currentDataObject) {
        console.error('DataObject not found for update')
        return
      }

      const input: any = {
        name: { set: data.name },
        description: { set: data.description },
        classification: { set: data.classification },
        format: { set: data.format },
        planningDate: { set: data.planningDate },
        introductionDate: { set: data.introductionDate },
        endOfUseDate: { set: data.endOfUseDate },
        endOfLifeDate: { set: data.endOfLifeDate },
      }

      // DataSources Update - only update if changed
      const currentDataSourceIds = currentDataObject.dataSources?.map(app => app.id).sort() || []
      const newDataSourceIds = data.dataSources?.sort() || []

      const dataSourcesChanged =
        JSON.stringify(currentDataSourceIds) !== JSON.stringify(newDataSourceIds)

      if (dataSourcesChanged) {
        if (newDataSourceIds.length > 0) {
          input.dataSources = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newDataSourceIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no DataSources are selected, disconnect all connections
          input.dataSources = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // Owners Update - only update if changed
      const currentOwnerId = currentDataObject.owners?.[0]?.id || ''
      const newOwnerId = data.ownerId || ''

      const ownerChanged = currentOwnerId !== newOwnerId

      if (ownerChanged) {
        if (newOwnerId) {
          input.owners = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: [{ where: { node: { id: { eq: newOwnerId } } } }], // Neue Verbindung herstellen
            },
          ]
        } else {
          input.owners = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            },
          ]
        }
      }

      // DepictedInDiagrams Update - only update if changed
      const currentDepictedInDiagramIds =
        currentDataObject.depictedInDiagrams?.map(diag => diag.id).sort() || []
      const newDepictedInDiagramIds = data.depictedInDiagrams?.sort() || []

      const depictedInDiagramsChanged =
        JSON.stringify(currentDepictedInDiagramIds) !== JSON.stringify(newDepictedInDiagramIds)

      if (depictedInDiagramsChanged) {
        if (newDepictedInDiagramIds.length > 0) {
          input.depictedInDiagrams = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newDepictedInDiagramIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no Diagrams are selected, disconnect all connections
          input.depictedInDiagrams = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // UsedByApplications Update - only update if changed
      const currentUsedByApplicationIds =
        currentDataObject.usedByApplications?.map(app => app.id).sort() || []
      const newUsedByApplicationIds = data.usedByApplications?.sort() || []

      const usedByApplicationsChanged =
        JSON.stringify(currentUsedByApplicationIds) !== JSON.stringify(newUsedByApplicationIds)

      if (usedByApplicationsChanged) {
        if (newUsedByApplicationIds.length > 0) {
          input.usedByApplications = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newUsedByApplicationIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no Applications are selected, disconnect all connections
          input.usedByApplications = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // RelatedToCapabilities Update - only update if changed
      const currentRelatedToCapabilityIds =
        currentDataObject.relatedToCapabilities?.map(cap => cap.id).sort() || []
      const newRelatedToCapabilityIds = data.relatedToCapabilities?.sort() || []

      const relatedToCapabilitiesChanged =
        JSON.stringify(currentRelatedToCapabilityIds) !== JSON.stringify(newRelatedToCapabilityIds)

      if (relatedToCapabilitiesChanged) {
        if (newRelatedToCapabilityIds.length > 0) {
          input.relatedToCapabilities = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newRelatedToCapabilityIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no Capabilities are selected, disconnect all connections
          input.relatedToCapabilities = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // TransferredInInterfaces Update - only update if changed
      const currentTransferredInInterfaceIds =
        currentDataObject.transferredInInterfaces?.map(inter => inter.id).sort() || []
      const newTransferredInInterfaceIds = data.transferredInInterfaces?.sort() || []

      const transferredInInterfacesChanged =
        JSON.stringify(currentTransferredInInterfaceIds) !==
        JSON.stringify(newTransferredInInterfaceIds)

      if (transferredInInterfacesChanged) {
        if (newTransferredInInterfaceIds.length > 0) {
          input.transferredInInterfaces = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newTransferredInInterfaceIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no Interfaces are selected, disconnect all connections
          input.transferredInInterfaces = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // RelatedDataObjects Update - only update if changed
      const currentRelatedDataObjectIds =
        currentDataObject.relatedDataObjects?.map(obj => obj.id).sort() || []
      const newRelatedDataObjectIds = data.relatedDataObjects?.sort() || []

      const relatedDataObjectsChanged =
        JSON.stringify(currentRelatedDataObjectIds) !== JSON.stringify(newRelatedDataObjectIds)

      if (relatedDataObjectsChanged) {
        if (newRelatedDataObjectIds.length > 0) {
          input.relatedDataObjects = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newRelatedDataObjectIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no DataObjects are selected, disconnect all connections
          input.relatedDataObjects = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // PartOfArchitectures Update - only update if changed
      const currentPartOfArchitectureIds =
        currentDataObject.partOfArchitectures?.map(arch => arch.id).sort() || []
      const newPartOfArchitectureIds = data.partOfArchitectures?.sort() || []

      const partOfArchitecturesChanged =
        JSON.stringify(currentPartOfArchitectureIds) !== JSON.stringify(newPartOfArchitectureIds)

      if (partOfArchitecturesChanged) {
        if (newPartOfArchitectureIds.length > 0) {
          input.partOfArchitectures = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newPartOfArchitectureIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // If no Architectures are selected, disconnect all connections
          input.partOfArchitectures = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      await updateDataObject({
        variables: {
          id,
          input,
        },
      })
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Datenobjekts:', error)
    }
  }

  // Handler for deleting data object
  const handleDeleteDataObject = async (id: string) => {
    try {
      await deleteDataObject({
        variables: { id },
      })
    } catch (error) {
      console.error('Error deleting data object:', error)
    }
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
            onClick={handleCreateDataObject}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <DataObjectToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setIsFilterDialogOpen(true)}
          onResetFilters={resetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={DATAOBJECT_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <DataObjectTable
            dataObjects={filteredDataObjects}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateDataObject={handleCreateDataObjectSubmit}
            onUpdateDataObject={handleUpdateDataObjectSubmit}
            onDeleteDataObject={handleDeleteDataObject}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </Paper>
      </Card>

      {isFilterDialogOpen && (
        <DataObjectFilterDialog
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          filters={filterState}
          onFiltersChange={setFilterState}
          onResetFilters={resetFilters}
          filterOptions={filterOptions}
        />
      )}

      {/* Formular für neues Datenobjekt */}
      {showNewDataObjectForm && (
        <DataObjectForm
          isOpen={showNewDataObjectForm}
          onClose={() => setShowNewDataObjectForm(false)}
          onSubmit={handleCreateDataObjectSubmit}
          mode="create"
          loading={isCreating}
        />
      )}
    </Box>
  )
}

export default DataObjectsPage
