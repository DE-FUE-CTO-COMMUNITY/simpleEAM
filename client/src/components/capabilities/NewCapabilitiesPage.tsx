'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, login, isArchitect } from '@/lib/auth'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { CapabilityStatus } from '@/gql/generated'

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
    statusFilter: [],
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

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  // Business Capabilities laden
  const { loading, error, data } = useQuery(GET_CAPABILITIES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Verfügbare Status und Tags aus den geladenen Daten extrahieren
  useEffect(() => {
    if (data?.businessCapabilities?.length) {
      const capabilities = data.businessCapabilities as Capability[]

      // Alle Status extrahieren und Duplikate entfernen
      const allStatuses = capabilities
        .map((cap: Capability) => cap.status)
        .filter(Boolean) as CapabilityStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort() as CapabilityStatus[]
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

  // Neue Business Capability erstellen
  const handleCreateCapability = () => {
    router.push('/capabilities/create')
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
            capabilities={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onRowClick={handleViewCapability}
            onEditClick={handleEditCapability}
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
    </Box>
  )
}

export default CapabilitiesPage
