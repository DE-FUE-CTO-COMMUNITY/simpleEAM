'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, login, isArchitect } from '@/lib/auth'
import { GET_CAPABILITIES, CREATE_CAPABILITY, UPDATE_CAPABILITY } from '@/graphql/capability'
import { CapabilityStatus, BusinessCapability } from '@/gql/generated'
import CapabilityForm, { CapabilityFormValues } from '@/components/capabilities/CapabilityForm'

// Importiere die ausgelagerten Komponenten
import CapabilityTable from '@/components/capabilities/CapabilityTable'
import CapabilityToolbar from '@/components/capabilities/CapabilityToolbar'
import CapabilityFilterDialog from '@/components/capabilities/CapabilityFilterDialog'
import { useCapabilityFilter } from '@/components/capabilities/useCapabilityFilter'
import { Capability, FilterState } from '@/components/capabilities/types'

const CapabilitiesPage = () => {
  const { authenticated } = useAuth()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Filter-Zustand
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [] as CapabilityStatus[],
    maturityLevelFilter: [],
    businessValueRange: [0, 10],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Liste der verfügbaren Status und Tags aus den Daten extrahieren
  const [availableStatuses, setAvailableStatuses] = useState<CapabilityStatus[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // State für das neue Capability-Formular
  const [showNewCapabilityForm, setShowNewCapabilityForm] = useState(false)

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  // Business Capabilities laden
  const { loading, error, data, refetch } = useQuery(GET_CAPABILITIES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Verfügbare Status und Tags aus den geladenen Daten extrahieren
  useEffect(() => {
    if (data?.businessCapabilities?.length) {
      const capabilities = data.businessCapabilities as Capability[]

      // Alle Status extrahieren und Duplikate entfernen
      const allStatuses: CapabilityStatus[] = capabilities
        .map((cap: Capability) => cap.status)
        .filter(Boolean) as CapabilityStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Alle Tags sammeln und Duplikate entfernen
      const allTags: string[] = []
      capabilities.forEach((cap: Capability) => {
        if (cap.tags && Array.isArray(cap.tags)) {
          allTags.push(...cap.tags)
        }
      })

      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)
    }
  }, [data])

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Business Capabilities', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const capabilities = data?.businessCapabilities || []

  // Filter auf Capabilities anwenden
  const filteredData = useCapabilityFilter({ capabilities, filterState })

  // Mutation zum Erstellen einer neuen Capability
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createCapability, { loading: isCreating }] = useMutation(CREATE_CAPABILITY, {
    onCompleted: () => {
      enqueueSnackbar('Business Capability erfolgreich erstellt', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen der Business Capability: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Aktualisieren einer bestehenden Capability
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateCapability, { loading: isUpdating }] = useMutation(UPDATE_CAPABILITY, {
    onCompleted: () => {
      enqueueSnackbar('Business Capability erfolgreich aktualisiert', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren der Business Capability: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Erstellen einer neuen Business Capability
  const handleCreateCapabilitySubmit = async (data: CapabilityFormValues) => {
    const { parentId: parent, ...capabilityData } = data
    // Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind
    const input = {
      name: capabilityData.name,
      description: capabilityData.description,
      maturityLevel: capabilityData.maturityLevel,
      businessValue: capabilityData.businessValue,
      status: capabilityData.status,
      owner: capabilityData.owner,
      tags: capabilityData.tags,
      ...(parent
        ? {
            children: [
              {
                connect: { where: { node: { id: parent } } },
              },
            ],
          }
        : {}),
    }

    await createCapability({
      variables: { input: [input] },
    })

    // Formular nach dem Erstellen schließen
    setShowNewCapabilityForm(false)
  }

  // Handler für das Aktualisieren einer bestehenden Business Capability
  const handleUpdateCapabilitySubmit = async (id: string, data: CapabilityFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parentId, ...capabilityData } = data
    // Hier könnten wir auch die Parent-Child-Beziehung mit dem 'parentId'-Wert aktualisieren,
    // was komplex sein kann, da wir die aktuelle Beziehung prüfen müssten.
    // Für diese Implementierung beschränken wir uns auf die direkten Capability-Daten.
    const input = {
      name: { set: capabilityData.name },
      description: { set: capabilityData.description },
      maturityLevel: { set: capabilityData.maturityLevel },
      businessValue: { set: capabilityData.businessValue },
      status: { set: capabilityData.status },
      owner: { set: capabilityData.owner },
      tags: { set: capabilityData.tags },
    }

    await updateCapability({
      variables: { id, input },
    })
  }

  // Neue Business Capability erstellen
  const handleCreateCapability = () => {
    // Hier fügen wir direkt die Logik für das Erstellen einer neuen Capability ein,
    // anstatt einen versteckten Button zu verwenden
    setShowNewCapabilityForm(true)
  }

  // Business Capability Details anzeigen
  const handleViewCapability = (id: string) => {
    router.push(`/capabilities/${id}`)
  }

  // Business Capability bearbeiten
  const handleEditCapability = (id: string) => {
    router.push(`/capabilities/edit/${id}`)
  }

  // Filter-Handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Filter zurücksetzen
  const handleResetFilter = () => {
    setFilterState({
      statusFilter: [],
      maturityLevelFilter: [],
      businessValueRange: [0, 10],
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
          Business Capabilities
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateCapability}
          >
            Neu erstellen
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CapabilityToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <CapabilityTable
            id="capability-table"
            capabilities={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onRowClick={handleViewCapability}
            onEditClick={handleEditCapability}
            onCreateCapability={handleCreateCapabilitySubmit}
            onUpdateCapability={handleUpdateCapabilitySubmit}
            availableTags={availableTags}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <CapabilityFilterDialog
          filterState={filterState}
          availableStatuses={availableStatuses}
          availableTags={availableTags}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
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
          availableCapabilities={capabilities as unknown as BusinessCapability[]}
          availableTags={availableTags}
        />
      )}
    </Box>
  )
}

export default CapabilitiesPage
