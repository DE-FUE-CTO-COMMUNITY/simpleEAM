'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, isArchitect } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import {
  GET_ARCHITECTURE_PRINCIPLES,
  CREATE_ARCHITECTURE_PRINCIPLE,
  UPDATE_ARCHITECTURE_PRINCIPLE,
  DELETE_ARCHITECTURE_PRINCIPLE,
} from '@/graphql/architecturePrinciple'
import { PrincipleCategory, PrinciplePriority } from '@/gql/generated'
import ArchitecturePrincipleForm, {
  ArchitecturePrincipleFormValues,
} from '@/components/architecture-principles/ArchitecturePrincipleForm'

// Importiere die ausgelagerten Komponenten
import ArchitecturePrincipleTable from '@/components/architecture-principles/ArchitecturePrincipleTable'
import ArchitecturePrincipleToolbar from '@/components/architecture-principles/ArchitecturePrincipleToolbar'
import ArchitecturePrincipleFilterDialog from '@/components/architecture-principles/ArchitecturePrincipleFilterDialog'
import { useArchitecturePrincipleFilter } from '@/components/architecture-principles/useArchitecturePrincipleFilter'
import { FilterState } from '@/components/architecture-principles/types'

const ArchitecturePrinciplesPage = () => {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter-Zustand
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    categoryFilter: [] as PrincipleCategory[],
    priorityFilter: [] as PrinciplePriority[],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
    isActiveFilter: null,
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Liste der verfügbaren Categories, Priorities und Tags aus den Daten extrahieren
  const [availableCategories, setAvailableCategories] = useState<PrincipleCategory[]>([])
  const [availablePriorities, setAvailablePriorities] = useState<PrinciplePriority[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // State für das neue Architektur-Prinzip-Formular
  const [showNewPrincipleForm, setShowNewPrincipleForm] = useState(false)

  // GraphQL-Query für Architektur-Prinzipien
  const {
    data: principleData,
    loading,
    error,
    refetch,
  } = useQuery(GET_ARCHITECTURE_PRINCIPLES, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  })

  // GraphQL-Mutationen
  const [createPrincipleMutation, { loading: isCreating }] = useMutation(
    CREATE_ARCHITECTURE_PRINCIPLE,
    {
      refetchQueries: [{ query: GET_ARCHITECTURE_PRINCIPLES }],
      onCompleted: () => {
        enqueueSnackbar('Architektur-Prinzip erfolgreich erstellt', { variant: 'success' })
      },
      onError: error => {
        console.error('Fehler beim Erstellen des Architektur-Prinzips:', error)
        enqueueSnackbar(`Fehler beim Erstellen: ${error.message}`, { variant: 'error' })
      },
    }
  )

  const [updatePrincipleMutation] = useMutation(UPDATE_ARCHITECTURE_PRINCIPLE, {
    refetchQueries: [{ query: GET_ARCHITECTURE_PRINCIPLES }],
    onCompleted: () => {
      enqueueSnackbar('Architektur-Prinzip erfolgreich aktualisiert', { variant: 'success' })
    },
    onError: error => {
      console.error('Fehler beim Aktualisieren des Architektur-Prinzips:', error)
      enqueueSnackbar(`Fehler beim Aktualisieren: ${error.message}`, { variant: 'error' })
    },
  })

  const [deletePrincipleMutation] = useMutation(DELETE_ARCHITECTURE_PRINCIPLE, {
    refetchQueries: [{ query: GET_ARCHITECTURE_PRINCIPLES }],
    onCompleted: () => {
      enqueueSnackbar('Architektur-Prinzip erfolgreich gelöscht', { variant: 'success' })
    },
    onError: error => {
      console.error('Fehler beim Löschen des Architektur-Prinzips:', error)
      enqueueSnackbar(`Fehler beim Löschen: ${error.message}`, { variant: 'error' })
    },
  })

  // Verfügbare Werte extrahieren, wenn sich Daten ändern
  useEffect(() => {
    if (principleData?.architecturePrinciples) {
      const principles = principleData.architecturePrinciples

      // Kategorien extrahieren
      const categories = Array.from(
        new Set(principles.map((principle: any) => principle.category).filter(Boolean))
      ).sort() as PrincipleCategory[]
      setAvailableCategories(categories)

      // Prioritäten extrahieren
      const priorities = Array.from(
        new Set(principles.map((principle: any) => principle.priority).filter(Boolean))
      ).sort() as PrinciplePriority[]
      setAvailablePriorities(priorities)

      // Tags extrahieren
      const allTags: string[] = []
      principles.forEach((principle: any) => {
        if (principle.tags && Array.isArray(principle.tags)) {
          allTags.push(...principle.tags)
        }
      })
      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)
    }
  }, [principleData])

  // Filter anwenden
  const { filteredPrinciples } = useArchitecturePrincipleFilter({
    principles: principleData?.architecturePrinciples || [],
    filterState,
  })

  // Aktive Filter zählen und State aktualisieren
  useEffect(() => {
    let count = 0
    if (filterState.categoryFilter && filterState.categoryFilter.length > 0) count++
    if (filterState.priorityFilter && filterState.priorityFilter.length > 0) count++
    if (filterState.tagsFilter && filterState.tagsFilter.length > 0) count++
    if (filterState.descriptionFilter) count++
    if (filterState.ownerFilter) count++
    if (filterState.isActiveFilter !== null && filterState.isActiveFilter !== 'all') count++
    if (
      filterState.updatedDateRange &&
      (filterState.updatedDateRange[0] || filterState.updatedDateRange[1])
    )
      count++

    setActiveFiltersCount(count)
  }, [filterState])

  // Handler-Funktionen
  const handleCreatePrinciple = async (data: ArchitecturePrincipleFormValues) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        category: data.category,
        priority: data.priority,
        rationale: data.rationale || '',
        implications: data.implications || '',
        tags: data.tags || [],
        isActive: data.isActive,
        // Wenn ein Besitzer ausgewählt wurde, verwenden wir die owners-Struktur
        ...(data.ownerId
          ? {
              owners: {
                connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
              },
            }
          : {}),
        // Wenn Architekturen ausgewählt wurden, verbinden wir sie
        ...(data.appliedInArchitectureIds && data.appliedInArchitectureIds.length > 0
          ? {
              appliedInArchitectures: {
                connect: data.appliedInArchitectureIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        // Wenn Applikationen ausgewählt wurden, verbinden wir sie
        ...(data.implementedByApplicationIds && data.implementedByApplicationIds.length > 0
          ? {
              implementedByApplications: {
                connect: data.implementedByApplicationIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
      }

      const result = await createPrincipleMutation({
        variables: { input: [input] },
      })

      // Formular nach dem Erstellen schließen
      setShowNewPrincipleForm(false)
    } catch (error) {
      console.error('🚨 Fehler beim Erstellen des Architektur-Prinzips:', error)
    }
  }

  const handleUpdatePrinciple = async (id: string, data: ArchitecturePrincipleFormValues) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        category: data.category,
        priority: data.priority,
        rationale: data.rationale || '',
        implications: data.implications || '',
        tags: data.tags || [],
        isActive: data.isActive,
        // Aktualisierung der Owner-Beziehung
        owners: data.ownerId
          ? {
              disconnect: [{ where: {} }],
              connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
            }
          : { disconnect: [{ where: {} }] },
        // Aktualisierung der Architecture-Beziehungen
        appliedInArchitectures: {
          disconnect: [{ where: {} }],
          connect:
            data.appliedInArchitectureIds && data.appliedInArchitectureIds.length > 0
              ? data.appliedInArchitectureIds.map(archId => ({
                  where: { node: { id: { eq: archId } } },
                }))
              : [],
        },
        // Aktualisierung der Application-Beziehungen
        implementedByApplications: {
          disconnect: [{ where: {} }],
          connect:
            data.implementedByApplicationIds && data.implementedByApplicationIds.length > 0
              ? data.implementedByApplicationIds.map(appId => ({
                  where: { node: { id: { eq: appId } } },
                }))
              : [],
        },
      }

      await updatePrincipleMutation({
        variables: { id, input },
      })
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Architektur-Prinzips:', error)
    }
  }

  const handleDeletePrinciple = async (id: string) => {
    try {
      await deletePrincipleMutation({
        variables: { id },
      })
    } catch (error) {
      console.error('Fehler beim Löschen des Architektur-Prinzips:', error)
    }
  }

  // Neues Architektur-Prinzip erstellen
  const handleCreatePrincipleClick = () => {
    setShowNewPrincipleForm(true)
  }

  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }))
  }

  const handleResetFilter = () => {
    setFilterState({
      categoryFilter: [],
      priorityFilter: [],
      tagsFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
      isActiveFilter: null,
    })
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          Fehler beim Laden der Architektur-Prinzipien: {error.message}
        </Typography>
        <Button onClick={() => refetch()} variant="contained" sx={{ mt: 2 }}>
          Erneut versuchen
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Architektur-Prinzipien
        </Typography>
        {authenticated && isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePrincipleClick}
          >
            Neues Architektur-Prinzip
          </Button>
        )}
      </Box>

      {/* Architektur-Prinzip-Erstellungsformular */}
      {showNewPrincipleForm && (
        <Card sx={{ mb: 3 }}>
          <ArchitecturePrincipleForm
            mode="create"
            isOpen={true}
            onSubmit={handleCreatePrinciple}
            onClose={() => setShowNewPrincipleForm(false)}
            loading={isCreating}
          />
        </Card>
      )}

      {/* Filter-Dialog */}
      {isFilterDialogOpen && (
        <ArchitecturePrincipleFilterDialog
          filterState={filterState}
          availableCategories={availableCategories}
          availablePriorities={availablePriorities}
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
        <ArchitecturePrincipleToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onFilterClick={() => setIsFilterDialogOpen(true)}
          onAddClick={handleCreatePrincipleClick}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
        />

        {/* Tabelle der Architektur-Prinzipien */}
        <ArchitecturePrincipleTable
          principles={filteredPrinciples}
          loading={loading}
          globalFilter={globalFilter}
          sorting={sorting}
          onSortingChange={setSorting}
          onCreatePrinciple={handleCreatePrinciple}
          onUpdatePrinciple={handleUpdatePrinciple}
          onDeletePrinciple={handleDeletePrinciple}
          onTableReady={setTableInstance}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </Card>
    </Box>
  )
}

export default ArchitecturePrinciplesPage
