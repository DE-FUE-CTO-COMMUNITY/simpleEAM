'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, isArchitect } from '@/lib/auth'
import { VisibilityState } from '@tanstack/react-table'
import {
  GET_CAPABILITIES,
  CREATE_CAPABILITY,
  UPDATE_CAPABILITY,
  DELETE_CAPABILITY,
} from '@/graphql/capability'
import { CapabilityStatus, BusinessCapability } from '@/gql/generated'
import CapabilityForm, { CapabilityFormValues } from '@/components/capabilities/CapabilityForm'

// Importiere die ausgelagerten Komponenten
import CapabilityTable from '@/components/capabilities/CapabilityTable'
import CapabilityToolbar from '@/components/capabilities/CapabilityToolbar'
import CapabilityFilterDialog from '@/components/capabilities/CapabilityFilterDialog'
import { useCapabilityFilter } from '@/components/capabilities/useCapabilityFilter'
import { FilterState } from '@/components/capabilities/types'

const CapabilitiesPage = () => {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

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

  // Business Capabilities laden - Auth-Check erfolgt bereits in layout.tsx
  const { loading, error, data, refetch } = useQuery(GET_CAPABILITIES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Verfügbare Status und Tags aus den geladenen Daten extrahieren
  useEffect(() => {
    if (data?.businessCapabilities?.length) {
      const capabilities = data.businessCapabilities as BusinessCapability[]

      // Alle Status extrahieren und Duplikate entfernen
      const allStatuses: CapabilityStatus[] = capabilities
        .map((cap: BusinessCapability) => cap.status)
        .filter(Boolean) as CapabilityStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Alle Tags sammeln und Duplikate entfernen
      const allTags: string[] = []
      capabilities.forEach((cap: BusinessCapability) => {
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

  // Mutation zum Löschen einer Capability
  const [deleteCapability] = useMutation(DELETE_CAPABILITY, {
    onCompleted: () => {
      enqueueSnackbar('Business Capability erfolgreich gelöscht', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Löschen der Business Capability: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Erstellen einer neuen Business Capability
  const handleCreateCapabilitySubmit = async (data: CapabilityFormValues) => {
    const {
      parentId: parent,
      ownerId,
      children,
      supportedByApplications,
      partOfArchitectures,
      ...capabilityData
    } = data

    // Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind
    const input = {
      name: capabilityData.name,
      description: capabilityData.description,
      maturityLevel: capabilityData.maturityLevel,
      businessValue: capabilityData.businessValue,
      status: capabilityData.status,
      ...(capabilityData.type ? { type: capabilityData.type } : {}),
      sequenceNumber: capabilityData.sequenceNumber,
      ...(capabilityData.introductionDate
        ? { introductionDate: capabilityData.introductionDate.toISOString().split('T')[0] }
        : {}),
      ...(capabilityData.endDate
        ? { endDate: capabilityData.endDate.toISOString().split('T')[0] }
        : {}),
      tags: capabilityData.tags,
      // Wenn ein Besitzer ausgewählt wurde, verwenden wir die neue owners-Struktur (nur ein Owner)
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      ...(parent
        ? {
            parents: {
              connect: [{ where: { node: { id: { eq: parent } } } }],
            },
          }
        : {}),
      // Untergeordnete Capabilities
      ...(children && children.length > 0
        ? {
            children: {
              connect: children.map((childId: string) => ({
                where: { node: { id: { eq: childId } } },
              })),
            },
          }
        : {}),
      // Unterstützende Applikationen
      ...(supportedByApplications && supportedByApplications.length > 0
        ? {
            supportedByApplications: {
              connect: supportedByApplications.map((appId: string) => ({
                where: { node: { id: { eq: appId } } },
              })),
            },
          }
        : {}),
      // Architekturen
      ...(partOfArchitectures && partOfArchitectures.length > 0
        ? {
            partOfArchitectures: {
              connect: partOfArchitectures.map((archId: string) => ({
                where: { node: { id: { eq: archId } } },
              })),
            },
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
    const {
      parentId,
      ownerId,
      children,
      supportedByApplications,
      partOfArchitectures,
      ...capabilityData
    } = data

    // Basis-Input-Daten vorbereiten
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: Record<string, any> = {
      name: { set: capabilityData.name },
      description: { set: capabilityData.description },
      maturityLevel: { set: capabilityData.maturityLevel },
      businessValue: { set: capabilityData.businessValue },
      status: { set: capabilityData.status },
      sequenceNumber: { set: capabilityData.sequenceNumber },
      tags: { set: capabilityData.tags },
    }

    // Lifecycle-Felder setzen
    if (capabilityData.introductionDate) {
      input.introductionDate = { set: capabilityData.introductionDate.toISOString().split('T')[0] }
    }
    if (capabilityData.endDate) {
      input.endDate = { set: capabilityData.endDate.toISOString().split('T')[0] }
    }

    // Nur type setzen, wenn es einen Wert hat
    if (capabilityData.type) {
      input.type = { set: capabilityData.type }
    }

    // Aktualisierung der Owner-Beziehung, wenn ein Besitzer ausgewählt wurde
    if (ownerId) {
      input.owners = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
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
      input.owners = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der übergeordneten Capability
    if (parentId) {
      input.parents = {
        disconnect: [{ where: {} }],
        connect: [
          {
            where: {
              node: {
                id: { eq: parentId },
              },
            },
          },
        ],
      }
    } else {
      input.parents = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der untergeordneten Capabilities
    if (children && children.length > 0) {
      input.children = {
        disconnect: [{ where: {} }],
        connect: children.map((childId: string) => ({
          where: {
            node: {
              id: { eq: childId },
            },
          },
        })),
      }
    } else {
      input.children = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der unterstützenden Applikationen
    if (supportedByApplications && supportedByApplications.length > 0) {
      input.supportedByApplications = {
        disconnect: [{ where: {} }],
        connect: supportedByApplications.map((appId: string) => ({
          where: {
            node: {
              id: { eq: appId },
            },
          },
        })),
      }
    } else {
      input.supportedByApplications = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Architekturen
    if (partOfArchitectures && partOfArchitectures.length > 0) {
      input.partOfArchitectures = {
        disconnect: [{ where: {} }],
        connect: partOfArchitectures.map((archId: string) => ({
          where: {
            node: {
              id: { eq: archId },
            },
          },
        })),
      }
    } else {
      input.partOfArchitectures = {
        disconnect: [{ where: {} }],
      }
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

  // Business Capability löschen
  const handleDeleteCapability = async (id: string) => {
    await deleteCapability({
      variables: { id },
    })
    // Formular nach dem Löschen schließen
    // Automatisches Schließen erfolgt durch die CapabilityForm selbst
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
          table={tableInstance}
          enableColumnVisibilityToggle={true}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <CapabilityTable
            id="capability-table"
            capabilities={filteredData as BusinessCapability[]}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateCapability={handleCreateCapabilitySubmit}
            onUpdateCapability={handleUpdateCapabilitySubmit}
            onDeleteCapability={handleDeleteCapability}
            availableTags={availableTags}
            availableCapabilities={capabilities as BusinessCapability[]}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
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
          availableCapabilities={capabilities as BusinessCapability[]}
          availableTags={availableTags}
        />
      )}
    </Box>
  )
}

export default CapabilitiesPage
