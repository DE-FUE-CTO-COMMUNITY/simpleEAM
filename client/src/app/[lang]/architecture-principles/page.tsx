'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
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

// Import the extracted components
import ArchitecturePrincipleTable, {
  ARCHITECTURE_PRINCIPLE_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/architecture-principles/ArchitecturePrincipleTable'
import ArchitecturePrincipleToolbar from '@/components/architecture-principles/ArchitecturePrincipleToolbar'
import ArchitecturePrincipleFilterDialog from '@/components/architecture-principles/ArchitecturePrincipleFilterDialog'
import { useArchitecturePrincipleFilter } from '@/components/architecture-principles/useArchitecturePrincipleFilter'
import { FilterState } from '@/components/architecture-principles/types'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

const ArchitecturePrinciplesPage = () => {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('architecturePrinciples')
  const { selectedCompanyId } = useCompanyContext()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter-Zustand
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Extract list of available values from the data
  const [availableCategories, setAvailableCategories] = useState<PrincipleCategory[]>([])
  const [availablePriorities, setAvailablePriorities] = useState<PrinciplePriority[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // State for the new Architecture Principle form
  const [showNewPrincipleForm, setShowNewPrincipleForm] = useState(false)

  // GraphQL-Query für Architektur-Prinzipien
  const companyWhere = useCompanyWhere('company')
  const {
    data: principleData,
    loading,
    error,
    refetch,
  } = useQuery(GET_ARCHITECTURE_PRINCIPLES, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    variables: { where: companyWhere },
  })

  // GraphQL-Mutationen
  const [createPrincipleMutation, { loading: isCreating }] = useMutation(
    CREATE_ARCHITECTURE_PRINCIPLE,
    {
      // After CREATE reliably reload list with current company filter
      refetchQueries: [{ query: GET_ARCHITECTURE_PRINCIPLES, variables: { where: companyWhere } }],
      onCompleted: () => {
        enqueueSnackbar('Architektur-Prinzip erfolgreich erstellt', { variant: 'success' })
        // Zusätzlich sicherstellen, dass die aktive Query neu lädt
        refetch()
      },
      onError: error => {
        console.error('Fehler beim Erstellen des Architektur-Prinzips:', error)
        enqueueSnackbar(`Fehler beim Erstellen: ${error.message}`, { variant: 'error' })
      },
    }
  )

  const [updatePrincipleMutation] = useMutation(UPDATE_ARCHITECTURE_PRINCIPLE, {
    // After UPDATE reliably reload list with current company filter
    refetchQueries: [{ query: GET_ARCHITECTURE_PRINCIPLES, variables: { where: companyWhere } }],
    onCompleted: () => {
      enqueueSnackbar('Architektur-Prinzip erfolgreich aktualisiert', { variant: 'success' })
      refetch()
    },
    onError: error => {
      console.error('Fehler beim Aktualisieren des Architektur-Prinzips:', error)
      enqueueSnackbar(`Fehler beim Aktualisieren: ${error.message}`, { variant: 'error' })
    },
  })

  const [deletePrincipleMutation] = useMutation(DELETE_ARCHITECTURE_PRINCIPLE, {
    // After DELETE reliably reload list with current company filter
    refetchQueries: [{ query: GET_ARCHITECTURE_PRINCIPLES, variables: { where: companyWhere } }],
    onCompleted: () => {
      enqueueSnackbar('Architektur-Prinzip erfolgreich gelöscht', { variant: 'success' })
      refetch()
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

  const principles = principleData?.architecturePrinciples || []

  // Filter-Hook verwenden (Pattern 2)
  const { filterState, setFilterState, filteredPrinciples, resetFilters } =
    useArchitecturePrincipleFilter({ principles })

  // Count active filters und State aktualisieren
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
      if (!selectedCompanyId) {
        enqueueSnackbar('Please select a company first.', { variant: 'warning' })
        return
      }
      const input = {
        name: data.name,
        description: data.description,
        category: data.category,
        priority: data.priority,
        rationale: data.rationale || '',
        implications: data.implications || '',
        tags: data.tags || [],
        isActive: data.isActive,
        // If an owner was selected, use the owners structure
        ...(data.ownerId
          ? {
              owners: {
                connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
              },
            }
          : {}),
        // If values were selected, connect them
        ...(data.appliedInArchitectureIds && data.appliedInArchitectureIds.length > 0
          ? {
              appliedInArchitectures: {
                connect: data.appliedInArchitectureIds.map(id => ({
                  where: { node: { id: { eq: id } } },
                })),
              },
            }
          : {}),
        // If values were selected, connect them
        ...(data.implementedByApplicationIds && data.implementedByApplicationIds.length > 0
          ? {
              implementedByApplications: {
                connect: data.implementedByApplicationIds.map(id => ({
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

      await createPrincipleMutation({
        variables: { input: [input] },
      })

      // Close form after creating
      setShowNewPrincipleForm(false)
    } catch (error) {
      console.error('🚨 Fehler beim Erstellen des Architektur-Prinzips:', error)
    }
  }

  const handleUpdatePrinciple = async (id: string, data: ArchitecturePrincipleFormValues) => {
    try {
      const input: Record<string, any> = {
        // Scalar-Felder als Mutations-Wrapper übergeben
        name: { set: data.name },
        description: { set: data.description },
        category: { set: data.category },
        priority: { set: data.priority },
        rationale: { set: data.rationale || '' },
        implications: { set: data.implications || '' },
        tags: { set: data.tags || [] },
        isActive: { set: data.isActive },
        // Aktualisierung der Owner-Beziehung
        owners:
          data.ownerId && data.ownerId !== ''
            ? {
                disconnect: [{ where: {} }],
                connect: [{ where: { node: { id: { eq: data.ownerId } } } }],
              }
            : { disconnect: [{ where: {} }] },
        // Aktualisierung der Architecture-Beziehungen
        appliedInArchitectures:
          data.appliedInArchitectureIds && data.appliedInArchitectureIds.length > 0
            ? {
                disconnect: [{ where: {} }],
                connect: data.appliedInArchitectureIds.map(archId => ({
                  where: { node: { id: { eq: archId } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
        // Aktualisierung der Application-Beziehungen
        implementedByApplications:
          data.implementedByApplicationIds && data.implementedByApplicationIds.length > 0
            ? {
                disconnect: [{ where: {} }],
                connect: data.implementedByApplicationIds.map(appId => ({
                  where: { node: { id: { eq: appId } } },
                })),
              }
            : { disconnect: [{ where: {} }] },
      }

      await updatePrincipleMutation({
        variables: { id, input },
        awaitRefetchQueries: true,
        refetchQueries: [
          { query: GET_ARCHITECTURE_PRINCIPLES, variables: { where: companyWhere } },
        ],
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
    resetFilters()
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
          {t('title')}
        </Typography>
        {authenticated && isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreatePrincipleClick}
            disabled={!selectedCompanyId}
          >
            {t('addNew')}
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
          defaultColumnVisibility={ARCHITECTURE_PRINCIPLE_DEFAULT_COLUMN_VISIBILITY}
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
