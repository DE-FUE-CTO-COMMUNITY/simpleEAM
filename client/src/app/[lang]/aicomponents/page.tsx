'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Box, Typography, Button, Paper, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import { isArchitect } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'

import {
  GET_Aicomponents,
  CREATE_Aicomponent,
  UPDATE_Aicomponent,
  DELETE_Aicomponent,
} from '@/graphql/aicomponent'
import { AicomponentFormValues, AicomponentType } from '@/components/aicomponents/types'
import { AiComponentType, AiComponentStatus, Person } from '@/gql/generated'
import AicomponentForm from '@/components/aicomponents/AicomponentForm'
import AicomponentTable, {
  Aicomponents_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/aicomponents/AicomponentTable'
import AicomponentToolbar from '@/components/aicomponents/AicomponentToolbar'
import AicomponentFilterDialog from '@/components/aicomponents/AicomponentFilterDialog'
import { useAicomponentFilter } from '@/components/aicomponents/useAicomponentFilter'

const AicomponentsPage = () => {
  const t = useTranslations('aicomponents')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Apollo Client-Operationen
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_Aicomponents, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  // Mutation for creating a new AI Component
  const [createAicomponent] = useMutation(CREATE_Aicomponent, {
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

  // Mutation for updating an existing AI Component
  const [updateAicomponent] = useMutation(UPDATE_Aicomponent, {
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

  // Mutation for deleting a AI Component
  const [deleteAicomponent] = useMutation(DELETE_Aicomponent, {
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

  // Filter Hook
  const { filterState, setFilterState, filteredAicomponents, resetFilters } = useAicomponentFilter({
    aicomponents: data?.aiComponents || [],
  })

  // Extract list of available values from the data
  const [availableAiTypes, setAvailableAiTypes] = useState<AiComponentType[]>([])
  const [availableStatuses, setAvailableStatuses] = useState<AiComponentStatus[]>([])
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableOwners, setAvailableOwners] = useState<Person[]>([])

  // Filter-Zustand
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Dialog-States
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [showNewAicomponentForm, setShowNewAicomponentForm] = useState(false)

  // Table instance state for column visibility
  const [tableInstance, setTableInstance] = useState<Table<AicomponentType> | null>(null)

  // Extract available values from loaded data
  const aicomponents = useMemo(() => data?.aiComponents || [], [data?.aiComponents])

  useEffect(() => {
    if (aicomponents.length) {
      const aicomponentsData = aicomponents as AicomponentType[]

      // Extract all values and remove duplicates
      const allAiTypes: AiComponentType[] = aicomponentsData
        .map((ai: AicomponentType) => ai.aiType)
        .filter(Boolean) as AiComponentType[]

      const uniqueAiTypes = Array.from(new Set(allAiTypes)).sort()
      setAvailableAiTypes(uniqueAiTypes)

      // Extract all statuses and remove duplicates
      const allStatuses: AiComponentStatus[] = aicomponentsData
        .map((ai: AicomponentType) => ai.status)
        .filter(Boolean) as AiComponentStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Collect all values and remove duplicates
      const allProviders: string[] = aicomponentsData
        .map((ai: AicomponentType) => ai.provider)
        .filter(Boolean) as string[]

      const uniqueProviders = Array.from(new Set(allProviders)).sort()
      setAvailableProviders(uniqueProviders)

      // Collect all tags and remove duplicates
      const allTags: string[] = []
      aicomponentsData.forEach((ai: AicomponentType) => {
        if (ai.tags) {
          allTags.push(...ai.tags)
        }
      })
      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)

      // Collect all values and remove duplicates
      const allOwners: Person[] = []
      aicomponentsData.forEach((ai: AicomponentType) => {
        if (ai.owners) {
          allOwners.push(...ai.owners)
        }
      })
      // Eindeutige Owners anhand der ID filtern
      const uniqueOwners = allOwners.filter(
        (owner, index, self) => index === self.findIndex(o => o.id === owner.id)
      )
      setAvailableOwners(uniqueOwners)
    }
  }, [aicomponents])

  // Handler for updating an existing AI Component
  const handleUpdateAicomponentSubmit = async (id: string, data: AicomponentFormValues) => {
    try {
      // Separate relationship IDs from base data
      const {
        ownerId,
        supportsCapabilityIds,
        usedByApplicationIds,
        trainedWithDataObjectIds,
        hostedOnIds,
        partOfArchitectureIds,
        implementsPrincipleIds,
        depictedInDiagramIds,
        ...baseData
      } = data

      // Prepare update input with proper scalar mutations
      const updateInput: Record<string, any> = {
        name: { set: baseData.name },
        description: { set: baseData.description },
        aiType: { set: baseData.aiType },
        status: { set: baseData.status },
        tags: { set: baseData.tags || [] },
      }

      // Handle optional string fields - only set if not empty
      if (baseData.model && baseData.model.trim() !== '') {
        updateInput.model = { set: baseData.model }
      }

      if (baseData.version && baseData.version.trim() !== '') {
        updateInput.version = { set: baseData.version }
      }

      if (baseData.provider && baseData.provider.trim() !== '') {
        updateInput.provider = { set: baseData.provider }
      }

      if (baseData.license && baseData.license.trim() !== '') {
        updateInput.license = { set: baseData.license }
      }

      // Handle date fields - only set if not empty
      if (baseData.trainingDate && baseData.trainingDate.trim() !== '') {
        updateInput.trainingDate = { set: baseData.trainingDate }
      }

      // Handle accuracy separately as it might be a number
      if (baseData.accuracy !== undefined) {
        updateInput.accuracy = { set: baseData.accuracy }
      }

      // Handle costs separately as it might be a number
      if (baseData.costs !== undefined) {
        updateInput.costs = { set: baseData.costs }
      }

      // Handle owners relationship (single owner)
      if (ownerId !== undefined) {
        if (ownerId) {
          updateInput.owners = [
            {
              disconnect: [{ where: {} }],
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          ]
        } else {
          updateInput.owners = [{ disconnect: [{ where: {} }] }]
        }
      }

      // Handle supportsCapabilities relationship
      if (supportsCapabilityIds !== undefined) {
        updateInput.supportsCapabilities = [
          {
            disconnect: [{ where: {} }],
            ...(supportsCapabilityIds.length > 0
              ? {
                  connect: supportsCapabilityIds.map(capabilityId => ({
                    where: { node: { id: { eq: capabilityId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      // Handle usedByApplications relationship
      if (usedByApplicationIds !== undefined) {
        updateInput.usedByApplications = [
          {
            disconnect: [{ where: {} }],
            ...(usedByApplicationIds.length > 0
              ? {
                  connect: usedByApplicationIds.map(applicationId => ({
                    where: { node: { id: { eq: applicationId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      // Handle trainedWithDataObjects relationship
      if (trainedWithDataObjectIds !== undefined) {
        updateInput.trainedWithDataObjects = [
          {
            disconnect: [{ where: {} }],
            ...(trainedWithDataObjectIds.length > 0
              ? {
                  connect: trainedWithDataObjectIds.map(dataObjectId => ({
                    where: { node: { id: { eq: dataObjectId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      // Handle hostedOn relationship
      if (hostedOnIds !== undefined) {
        updateInput.hostedOn = [
          {
            disconnect: [{ where: {} }],
            ...(hostedOnIds.length > 0
              ? {
                  connect: hostedOnIds.map(infrastructureId => ({
                    where: { node: { id: { eq: infrastructureId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      // Handle partOfArchitectures relationship
      if (partOfArchitectureIds !== undefined) {
        updateInput.partOfArchitectures = [
          {
            disconnect: [{ where: {} }],
            ...(partOfArchitectureIds.length > 0
              ? {
                  connect: partOfArchitectureIds.map(architectureId => ({
                    where: { node: { id: { eq: architectureId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      // Handle implementsPrinciples relationship
      if (implementsPrincipleIds !== undefined) {
        updateInput.implementsPrinciples = [
          {
            disconnect: [{ where: {} }],
            ...(implementsPrincipleIds.length > 0
              ? {
                  connect: implementsPrincipleIds.map(principleId => ({
                    where: { node: { id: { eq: principleId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      // Handle depictedInDiagrams relationship
      if (depictedInDiagramIds !== undefined) {
        updateInput.depictedInDiagrams = [
          {
            disconnect: [{ where: {} }],
            ...(depictedInDiagramIds.length > 0
              ? {
                  connect: depictedInDiagramIds.map(diagramId => ({
                    where: { node: { id: { eq: diagramId } } },
                  })),
                }
              : {}),
          },
        ]
      }

      await updateAicomponent({
        variables: {
          where: { id: { eq: id } },
          update: updateInput,
        },
        refetchQueries: [{ query: GET_Aicomponents }],
      })
    } catch (error) {
      console.error('Fehler beim Aktualisieren der AI Component:', error)
      throw error
    }
  }

  const handleCreate = () => {
    setShowNewAicomponentForm(true)
  }

  // Delete is usually handled in GenericTable/Dialog

  // Reset Filter Handler
  const handleResetFilter = () => {
    resetFilters()
    setActiveFiltersCount(0)
  }

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
        <AicomponentToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterDialogOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance || undefined}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={Aicomponents_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <AicomponentTable
            aicomponents={filteredAicomponents}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onTableReady={table => setTableInstance(table)}
            onCreateAicomponent={async data => {
              try {
                await createAicomponent({
                  // Most create mutations expect an array input per generated schema
                  variables: { input: [data] },
                  refetchQueries: [{ query: GET_Aicomponents }],
                })
              } catch (error) {
                console.error('Fehler beim Erstellen des aicomponent:', error)
                throw error // Re-throw so GenericTable can handle the error
              }
            }}
            onUpdateAicomponent={handleUpdateAicomponentSubmit}
            onDeleteAicomponent={async id => {
              try {
                await deleteAicomponent({
                  variables: {
                    id: id,
                  },
                  refetchQueries: [{ query: GET_Aicomponents }],
                })
              } catch (error) {
                console.error('Error deleting AI Component:', error)
                throw error
              }
            }}
          />
        </Paper>
      </Card>

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <AicomponentFilterDialog
          filterState={filterState}
          availableAiTypes={availableAiTypes}
          availableStatuses={availableStatuses}
          availableProviders={availableProviders}
          availableTags={availableTags}
          availableOwners={availableOwners}
          onFilterChange={newFilters => setFilterState(prev => ({ ...prev, ...newFilters }))}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterDialogOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterDialogOpen(false)
          }}
        />
      )}

      {/* Create Form */}
      {showNewAicomponentForm && (
        <AicomponentForm
          data={
            {
              id: '',
              name: '',
              description: '',
              aiType: AiComponentType.OTHER,
              model: '',
              version: '',
              status: AiComponentStatus.IN_DEVELOPMENT,
              accuracy: null,
              trainingDate: null,
              provider: '',
              license: '',
              costs: null,
              tags: '',
              owners: [],
              createdAt: new Date(0).toISOString(),
              updatedAt: null,
              supportsCapabilities: [],
              usedByApplications: [],
              trainedWithDataObjects: [],
              hostedOn: [],
              partOfArchitectures: [],
              implementsPrinciples: [],
              depictedInDiagrams: [],
              __typename: 'AIComponent',
            } as any
          }
          isOpen={showNewAicomponentForm}
          onClose={() => setShowNewAicomponentForm(false)}
          mode="create"
          onSubmit={async values => {
            try {
              if (!selectedCompanyId) {
                enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
                return
              }

              const {
                ownerId,
                supportsCapabilityIds,
                usedByApplicationIds,
                trainedWithDataObjectIds,
                hostedOnIds,
                partOfArchitectureIds,
                implementsPrincipleIds,
                depictedInDiagramIds,
                ...aiComponentData
              } = values

              // For CREATE, no special mutation object is needed as direct values are allowed
              const input = {
                name: aiComponentData.name,
                description: aiComponentData.description,
                aiType: aiComponentData.aiType,
                model: aiComponentData.model,
                version: aiComponentData.version,
                status: aiComponentData.status,
                accuracy: aiComponentData.accuracy,
                trainingDate: aiComponentData.trainingDate || null,
                provider: aiComponentData.provider,
                license: aiComponentData.license,
                costs: aiComponentData.costs,
                tags: aiComponentData.tags,

                // If an owner was selected, use the owners structure
                ...(ownerId
                  ? {
                      owners: {
                        connect: [{ where: { node: { id: { eq: ownerId } } } }],
                      },
                    }
                  : {}),

                // If values were selected, connect them
                ...(supportsCapabilityIds && supportsCapabilityIds.length > 0
                  ? {
                      supportsCapabilities: {
                        connect: supportsCapabilityIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // If values were selected, connect them
                ...(usedByApplicationIds && usedByApplicationIds.length > 0
                  ? {
                      usedByApplications: {
                        connect: usedByApplicationIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // If values were selected, connect them
                ...(trainedWithDataObjectIds && trainedWithDataObjectIds.length > 0
                  ? {
                      trainedWithDataObjects: {
                        connect: trainedWithDataObjectIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // If Infrastructure was selected, connect it
                ...(hostedOnIds && hostedOnIds.length > 0
                  ? {
                      hostedOn: {
                        connect: hostedOnIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // If values were selected, connect them
                ...(partOfArchitectureIds && partOfArchitectureIds.length > 0
                  ? {
                      partOfArchitectures: {
                        connect: partOfArchitectureIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // If values were selected, connect them
                ...(implementsPrincipleIds && implementsPrincipleIds.length > 0
                  ? {
                      implementsPrinciples: {
                        connect: implementsPrincipleIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // If values were selected, connect them
                ...(depictedInDiagramIds && depictedInDiagramIds.length > 0
                  ? {
                      depictedInDiagrams: {
                        connect: depictedInDiagramIds.map(id => ({
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

              await createAicomponent({
                variables: { input: [input] },
                // For safety: also update the list in cache via refetch query with filter
                refetchQueries: [
                  {
                    query: GET_Aicomponents,
                    variables: { where: companyWhere },
                  },
                ],
                awaitRefetchQueries: true,
              })
              setShowNewAicomponentForm(false)
            } catch (error) {
              console.error('Fehler beim Erstellen der/des aicomponent:', error)
              throw error // Re-throw so GenericTable can handle the error
            }
          }}
        />
      )}
    </Box>
  )
}

export default AicomponentsPage
