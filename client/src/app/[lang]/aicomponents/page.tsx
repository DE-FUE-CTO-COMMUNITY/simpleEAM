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
  const { data, loading, error } = useQuery(GET_Aicomponents)
  const [createAicomponentMutation] = useMutation(CREATE_Aicomponent)
  const [updateAicomponentMutation] = useMutation(UPDATE_Aicomponent)
  const [deleteAicomponentMutation] = useMutation(DELETE_Aicomponent)

  // Filter Hook
  const { filterState, setFilterState, filteredAicomponents, resetFilters } = useAicomponentFilter({
    aicomponents: data?.aiComponents || [],
  })

  // Liste der verfügbaren Werte aus den Daten extrahieren
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

  // Table-Instanz State für Column Visibility
  const [tableInstance, setTableInstance] = useState<Table<AicomponentType> | null>(null)

  // Verfügbare Werte aus den geladenen Daten extrahieren
  const aicomponents = useMemo(() => data?.aiComponents || [], [data?.aiComponents])

  useEffect(() => {
    if (aicomponents.length) {
      const aicomponentsData = aicomponents as AicomponentType[]

      // Alle AI Types extrahieren und Duplikate entfernen
      const allAiTypes: AiComponentType[] = aicomponentsData
        .map((ai: AicomponentType) => ai.aiType)
        .filter(Boolean) as AiComponentType[]

      const uniqueAiTypes = Array.from(new Set(allAiTypes)).sort()
      setAvailableAiTypes(uniqueAiTypes)

      // Alle Status extrahieren und Duplikate entfernen
      const allStatuses: AiComponentStatus[] = aicomponentsData
        .map((ai: AicomponentType) => ai.status)
        .filter(Boolean) as AiComponentStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Alle Provider sammeln und Duplikate entfernen
      const allProviders: string[] = aicomponentsData
        .map((ai: AicomponentType) => ai.provider)
        .filter(Boolean) as string[]

      const uniqueProviders = Array.from(new Set(allProviders)).sort()
      setAvailableProviders(uniqueProviders)

      // Alle Tags sammeln und Duplikate entfernen
      const allTags: string[] = []
      aicomponentsData.forEach((ai: AicomponentType) => {
        if (ai.tags) {
          allTags.push(...ai.tags)
        }
      })
      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)

      // Alle Owners sammeln und Duplikate entfernen
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

  const handleCreate = () => {
    setShowNewAicomponentForm(true)
  }

  // Delete wird i.d.R. im GenericTable/Dialog gehandhabt

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
                await createAicomponentMutation({
                  // Most create mutations expect an array input per generated schema
                  variables: { input: [data] },
                  refetchQueries: [{ query: GET_Aicomponents }],
                })
                enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
              } catch (error) {
                console.error('Fehler beim Erstellen des aicomponent:', error)
                enqueueSnackbar(t('messages.createError'), { variant: 'error' })
                throw error // Re-throw damit GenericTable den Fehler handhaben kann
              }
            }}
            onUpdateAicomponent={async (id, data) => {
              try {
                // Separate relationship IDs from base data
                const {
                  ownerIds,
                  companyIds,
                  supportsCapabilityIds,
                  usedByApplicationIds,
                  trainedWithDataObjectIds,
                  hostedOnIds,
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

                if (baseData.lastUpdated && baseData.lastUpdated.trim() !== '') {
                  updateInput.lastUpdated = { set: baseData.lastUpdated }
                }

                // Handle accuracy separately as it might be a number
                if (baseData.accuracy !== undefined) {
                  updateInput.accuracy = { set: baseData.accuracy }
                }

                // Handle costs separately as it might be a number
                if (baseData.costs !== undefined) {
                  updateInput.costs = { set: baseData.costs }
                }

                // Handle owners relationship
                if (ownerIds !== undefined) {
                  if (ownerIds.length > 0) {
                    updateInput.owners = [
                      {
                        disconnect: [{ where: {} }],
                        connect: ownerIds.map(ownerId => ({
                          where: { node: { id: { eq: ownerId } } },
                        })),
                      },
                    ]
                  } else {
                    updateInput.owners = [{ disconnect: [{ where: {} }] }]
                  }
                }

                // Handle company relationship
                if (companyIds !== undefined) {
                  if (companyIds.length > 0) {
                    updateInput.company = [
                      {
                        disconnect: [{ where: {} }],
                        connect: [{ where: { node: { id: { eq: companyIds[0] } } } }],
                      },
                    ]
                  } else {
                    updateInput.company = [{ disconnect: [{ where: {} }] }]
                  }
                }

                // Handle supportsCapabilities relationship
                if (supportsCapabilityIds !== undefined) {
                  if (supportsCapabilityIds.length > 0) {
                    updateInput.supportsCapabilities = [
                      {
                        disconnect: [{ where: {} }],
                        connect: supportsCapabilityIds.map(capId => ({
                          where: { node: { id: { eq: capId } } },
                        })),
                      },
                    ]
                  } else {
                    updateInput.supportsCapabilities = [{ disconnect: [{ where: {} }] }]
                  }
                }

                // Handle usedByApplications relationship
                if (usedByApplicationIds !== undefined) {
                  if (usedByApplicationIds.length > 0) {
                    updateInput.usedByApplications = [
                      {
                        disconnect: [{ where: {} }],
                        connect: usedByApplicationIds.map(appId => ({
                          where: { node: { id: { eq: appId } } },
                        })),
                      },
                    ]
                  } else {
                    updateInput.usedByApplications = [{ disconnect: [{ where: {} }] }]
                  }
                }

                // Handle trainedWithDataObjects relationship
                if (trainedWithDataObjectIds !== undefined) {
                  if (trainedWithDataObjectIds.length > 0) {
                    updateInput.trainedWithDataObjects = [
                      {
                        disconnect: [{ where: {} }],
                        connect: trainedWithDataObjectIds.map(dataId => ({
                          where: { node: { id: { eq: dataId } } },
                        })),
                      },
                    ]
                  } else {
                    updateInput.trainedWithDataObjects = [{ disconnect: [{ where: {} }] }]
                  }
                }

                // Handle hostedOn relationship
                if (hostedOnIds !== undefined) {
                  if (hostedOnIds.length > 0) {
                    updateInput.hostedOn = [
                      {
                        disconnect: [{ where: {} }],
                        connect: hostedOnIds.map(infraId => ({
                          where: { node: { id: { eq: infraId } } },
                        })),
                      },
                    ]
                  } else {
                    updateInput.hostedOn = [{ disconnect: [{ where: {} }] }]
                  }
                }

                await updateAicomponentMutation({
                  variables: {
                    where: { id: { eq: id } },
                    update: updateInput,
                  },
                  refetchQueries: [{ query: GET_Aicomponents }],
                })
                enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
              } catch (error) {
                console.error('Fehler beim Aktualisieren der AI-Komponente:', error)
                enqueueSnackbar(t('messages.updateError'), { variant: 'error' })
                throw error // Re-throw damit GenericTable den Fehler handhaben kann
              }
            }}
            onDeleteAicomponent={async id => {
              try {
                await deleteAicomponentMutation({
                  variables: {
                    where: { id: id },
                  },
                  refetchQueries: [{ query: GET_Aicomponents }],
                })
                enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
              } catch (error) {
                console.error('Fehler beim Löschen der AI-Komponente:', error)
                enqueueSnackbar(t('messages.deleteError'), { variant: 'error' })
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
          isOpen={showNewAicomponentForm}
          onClose={() => setShowNewAicomponentForm(false)}
          mode="create"
          onSubmit={async (values: AicomponentFormValues) => {
            try {
              if (!selectedCompanyId) {
                enqueueSnackbar('Bitte zuerst ein Unternehmen auswählen.', { variant: 'warning' })
                return
              }

              const {
                ownerIds,
                supportsCapabilityIds,
                usedByApplicationIds,
                trainedWithDataObjectIds,
                hostedOnIds,
                ...aiComponentData
              } = values

              // Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind
              const input = {
                name: aiComponentData.name,
                description: aiComponentData.description,
                aiType: aiComponentData.aiType,
                model: aiComponentData.model,
                version: aiComponentData.version,
                status: aiComponentData.status,
                accuracy: aiComponentData.accuracy,
                trainingDate: aiComponentData.trainingDate || null,
                lastUpdated: aiComponentData.lastUpdated || null,
                provider: aiComponentData.provider,
                license: aiComponentData.license,
                costs: aiComponentData.costs,
                tags: aiComponentData.tags,

                // Wenn Besitzer ausgewählt wurden, verwenden wir die owners-Struktur
                ...(ownerIds && ownerIds.length > 0
                  ? {
                      owners: {
                        connect: ownerIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // Wenn Capabilities ausgewählt wurden, verbinden wir sie
                ...(supportsCapabilityIds && supportsCapabilityIds.length > 0
                  ? {
                      supportsCapabilities: {
                        connect: supportsCapabilityIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // Wenn Applications ausgewählt wurden, verbinden wir sie
                ...(usedByApplicationIds && usedByApplicationIds.length > 0
                  ? {
                      usedByApplications: {
                        connect: usedByApplicationIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // Wenn Data Objects ausgewählt wurden, verbinden wir sie
                ...(trainedWithDataObjectIds && trainedWithDataObjectIds.length > 0
                  ? {
                      trainedWithDataObjects: {
                        connect: trainedWithDataObjectIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // Wenn Infrastructure ausgewählt wurde, verbinden wir sie
                ...(hostedOnIds && hostedOnIds.length > 0
                  ? {
                      hostedOn: {
                        connect: hostedOnIds.map(id => ({
                          where: { node: { id: { eq: id } } },
                        })),
                      },
                    }
                  : {}),

                // Company-Zuordnung (Pflicht)
                company: {
                  connect: [
                    {
                      where: { node: { id: { eq: selectedCompanyId } } },
                    },
                  ],
                },
              }

              await createAicomponentMutation({
                variables: { input: [input] },
                refetchQueries: [{ query: GET_Aicomponents }],
              })
              enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
              setShowNewAicomponentForm(false)
            } catch (error) {
              console.error('Fehler beim Erstellen der/des aicomponent:', error)
              enqueueSnackbar(t('messages.createError'), { variant: 'error' })
            }
          }}
        />
      )}
    </Box>
  )
}

export default AicomponentsPage
