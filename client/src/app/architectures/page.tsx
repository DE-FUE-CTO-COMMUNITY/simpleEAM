'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, isArchitect } from '@/lib/auth'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import {
  GET_ARCHITECTURES,
  CREATE_ARCHITECTURE,
  UPDATE_ARCHITECTURE,
  DELETE_ARCHITECTURE,
} from '@/graphql/architecture'
import { ArchitectureDomain, ArchitectureType as ArchitectureEnumType } from '@/gql/generated'
import ArchitectureForm, {
  ArchitectureFormValues,
} from '@/components/architectures/ArchitectureForm'

// Importiere die ausgelagerten Komponenten
import ArchitectureTable from '@/components/architectures/ArchitectureTable'
import ArchitectureToolbar from '@/components/architectures/ArchitectureToolbar'
import ArchitectureFilterDialog from '@/components/architectures/ArchitectureFilterDialog'
import { useArchitectureFilter } from '@/components/architectures/useArchitectureFilter'
import { ArchitectureType, FilterState } from '@/components/architectures/types'

const ArchitecturesPage = () => {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter-Zustand
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    domainFilter: [] as ArchitectureDomain[],
    typeFilter: [] as ArchitectureEnumType[],
    tagsFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Liste der verfügbaren Domains, Types und Tags aus den Daten extrahieren
  const [availableDomains, setAvailableDomains] = useState<ArchitectureDomain[]>([])
  const [availableTypes, setAvailableTypes] = useState<ArchitectureEnumType[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // State für das neue Architecture-Formular
  const [showNewArchitectureForm, setShowNewArchitectureForm] = useState(false)

  // Architekturen laden - Auth-Check erfolgt bereits in layout.tsx
  const { loading, error, data, refetch } = useQuery(GET_ARCHITECTURES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Verfügbare Werte aus den geladenen Daten extrahieren
  useEffect(() => {
    if (data?.architectures?.length) {
      const architectures = data.architectures as ArchitectureType[]

      // Alle Domains extrahieren und Duplikate entfernen
      const allDomains: ArchitectureDomain[] = architectures
        .map((arch: ArchitectureType) => arch.domain)
        .filter(Boolean) as ArchitectureDomain[]

      const uniqueDomains = Array.from(new Set(allDomains)).sort()
      setAvailableDomains(uniqueDomains)

      // Alle Typen extrahieren und Duplikate entfernen
      const allTypes: ArchitectureEnumType[] = architectures
        .map((arch: ArchitectureType) => arch.type)
        .filter(Boolean) as ArchitectureEnumType[]

      const uniqueTypes = Array.from(new Set(allTypes)).sort()
      setAvailableTypes(uniqueTypes)

      // Alle Tags sammeln und Duplikate entfernen
      const allTags: string[] = []
      architectures.forEach((arch: ArchitectureType) => {
        if (arch.tags && Array.isArray(arch.tags)) {
          allTags.push(...arch.tags)
        }
      })

      const uniqueTags = Array.from(new Set(allTags)).sort()
      setAvailableTags(uniqueTags)
    }
  }, [data])

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Architekturen', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const architectures = data?.architectures || []

  // Filter auf Architekturen anwenden
  const { filteredArchitectures } = useArchitectureFilter({ architectures, filterState })

  // Mutation zum Erstellen einer neuen Architektur
  const [createArchitecture, { loading: isCreating }] = useMutation(CREATE_ARCHITECTURE, {
    onCompleted: () => {
      enqueueSnackbar('Architektur erfolgreich erstellt', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen der Architektur: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Aktualisieren einer bestehenden Architektur
  const [updateArchitecture] = useMutation(UPDATE_ARCHITECTURE, {
    onCompleted: data => {
      // Überprüfe das Ergebnis der Mutation
      if (data?.updateArchitectures?.architectures?.length > 0) {
        enqueueSnackbar('Architektur erfolgreich aktualisiert', { variant: 'success' })
      } else {
        enqueueSnackbar(
          'Architektur wurde aktualisiert, aber die Daten wurden nicht zurückgegeben',
          {
            variant: 'warning',
          }
        )
      }

      // Wir laden explizit neu, um die Änderungen zu sehen
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren der Architektur: ${error.message}`, {
        variant: 'error',
      })
    },
    // Vollständige Aktualisierung der Apollo-Cache nach Mutation
    refetchQueries: [{ query: GET_ARCHITECTURES }],
    awaitRefetchQueries: true,
  })

  // Mutation zum Löschen einer Architektur
  const [deleteArchitecture] = useMutation(DELETE_ARCHITECTURE, {
    onCompleted: () => {
      enqueueSnackbar('Architektur erfolgreich gelöscht', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Löschen der Architektur: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Erstellen einer neuen Architektur
  const handleCreateArchitectureSubmit = async (data: ArchitectureFormValues) => {
    const {
      ownerId,
      containsApplicationIds,
      containsCapabilityIds,
      containsDataObjectIds,
      diagramIds,
      parentArchitectureId,
      ...architectureData
    } = data

    // Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind
    const input = {
      name: architectureData.name,
      description: architectureData.description,
      domain: architectureData.domain,
      type: architectureData.type,
      tags: architectureData.tags,
      timestamp: architectureData.timestamp.toISOString(), // Verwende das vom Benutzer ausgewählte Gültigkeitsdatum
      // Wenn ein Besitzer ausgewählt wurde, verwenden wir die owners-Struktur
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      // Wenn Applikationen ausgewählt wurden, verbinden wir sie mit der Architektur
      ...(containsApplicationIds && containsApplicationIds.length > 0
        ? {
            containsApplications: {
              connect: containsApplicationIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Capabilities ausgewählt wurden, verbinden wir sie mit der Architektur
      ...(containsCapabilityIds && containsCapabilityIds.length > 0
        ? {
            containsCapabilities: {
              connect: containsCapabilityIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Datenobjekte ausgewählt wurden, verbinden wir sie mit der Architektur
      ...(containsDataObjectIds && containsDataObjectIds.length > 0
        ? {
            containsDataObjects: {
              connect: containsDataObjectIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Diagramme ausgewählt wurden, verbinden wir sie mit der Architektur
      ...(diagramIds && diagramIds.length > 0
        ? {
            diagrams: {
              connect: diagramIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn eine Elternarchitektur ausgewählt wurde, verbinden wir sie mit der Architektur
      ...(parentArchitectureId
        ? {
            parentArchitecture: {
              connect: { where: { node: { id: { eq: parentArchitectureId } } } },
            },
          }
        : {}),
    }

    await createArchitecture({
      variables: { input: [input] },
    })

    // Formular nach dem Erstellen schließen
    setShowNewArchitectureForm(false)
  }

  // Handler für das Aktualisieren einer bestehenden Architektur
  const handleUpdateArchitectureSubmit = async (id: string, data: ArchitectureFormValues) => {
    const {
      ownerId,
      containsApplicationIds,
      containsCapabilityIds,
      containsDataObjectIds,
      diagramIds,
      parentArchitectureId,
      ...architectureData
    } = data

    // Sicherstellen, dass ein gültiges Datum verwendet wird
    let timestamp: Date

    if (architectureData.timestamp instanceof Date) {
      timestamp = architectureData.timestamp
    } else if (typeof architectureData.timestamp === 'string') {
      try {
        timestamp = new Date(architectureData.timestamp)
      } catch {
        timestamp = new Date()
      }
    } else {
      timestamp = new Date()
    }

    // Basis-Input-Daten vorbereiten
    const input: Record<string, any> = {
      name: { set: architectureData.name },
      description: { set: architectureData.description },
      domain: { set: architectureData.domain },
      type: { set: architectureData.type },
      tags: { set: Array.isArray(architectureData.tags) ? architectureData.tags : [] },
      timestamp: { set: timestamp.toISOString() }, // Verwende das vom Benutzer ausgewählte Datum
    }

    // Aktualisierung der Owner-Beziehung, wenn ein Besitzer ausgewählt wurde
    if (ownerId) {
      // Wir setzen die owners-Beziehung
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
      // Wenn kein Besitzer ausgewählt wurde, entfernen wir alle Besitzer
      input.owners = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Application-Beziehungen
    if (containsApplicationIds && containsApplicationIds.length > 0) {
      input.containsApplications = {
        disconnect: [{ where: {} }],
        connect: containsApplicationIds.map(appId => ({
          where: {
            node: {
              id: { eq: appId },
            },
          },
        })),
      }
    } else {
      input.containsApplications = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Capability-Beziehungen
    if (containsCapabilityIds && containsCapabilityIds.length > 0) {
      input.containsCapabilities = {
        disconnect: [{ where: {} }],
        connect: containsCapabilityIds.map(capId => ({
          where: {
            node: {
              id: { eq: capId },
            },
          },
        })),
      }
    } else {
      input.containsCapabilities = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der DataObject-Beziehungen
    if (containsDataObjectIds && containsDataObjectIds.length > 0) {
      input.containsDataObjects = {
        disconnect: [{ where: {} }],
        connect: containsDataObjectIds.map(doId => ({
          where: {
            node: {
              id: { eq: doId },
            },
          },
        })),
      }
    } else {
      input.containsDataObjects = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der Diagram-Beziehungen
    if (diagramIds && diagramIds.length > 0) {
      input.diagrams = {
        disconnect: [{ where: {} }],
        connect: diagramIds.map(diagId => ({
          where: {
            node: {
              id: { eq: diagId },
            },
          },
        })),
      }
    } else {
      input.diagrams = {
        disconnect: [{ where: {} }],
      }
    }

    // Aktualisierung der ParentArchitecture-Beziehung
    if (parentArchitectureId) {
      input.parentArchitecture = {
        disconnect: [{ where: {} }],
        connect: {
          where: {
            node: {
              id: { eq: parentArchitectureId },
            },
          },
        },
      }
    } else {
      input.parentArchitecture = {
        disconnect: [{ where: {} }],
      }
    }

    await updateArchitecture({
      variables: { id, input },
    })
  }

  // Neue Architektur erstellen
  const handleCreateArchitecture = () => {
    setShowNewArchitectureForm(true)
  }

  // Architektur löschen
  const handleDeleteArchitecture = async (id: string) => {
    await deleteArchitecture({
      variables: { id },
    })
  }

  // Filter-Handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Filter zurücksetzen
  const handleResetFilter = () => {
    setFilterState({
      domainFilter: [],
      typeFilter: [],
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
          Architekturen
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateArchitecture}
          >
            Neue Architektur
          </Button>
        )}
      </Box>

      {/* Architektur-Erstellungsformular */}
      {showNewArchitectureForm && (
        <Card sx={{ mb: 3 }}>
          <ArchitectureForm
            mode="create"
            isOpen={true}
            onSubmit={handleCreateArchitectureSubmit}
            onClose={() => setShowNewArchitectureForm(false)}
            loading={isCreating}
            architecture={null}
            availableArchitectures={architectures}
          />
        </Card>
      )}

      {/* Filter-Dialog */}
      {isFilterDialogOpen && (
        <ArchitectureFilterDialog
          filterState={filterState}
          availableDomains={availableDomains}
          availableTypes={availableTypes}
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
        <ArchitectureToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          onFilterClick={() => setIsFilterDialogOpen(true)}
          onAddClick={handleCreateArchitecture}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
        />

        {/* Tabelle der Architekturen */}
        <ArchitectureTable
          architectures={filteredArchitectures || []}
          loading={loading}
          globalFilter={globalFilter}
          sorting={sorting}
          onSortingChange={setSorting}
          onCreateArchitecture={handleCreateArchitectureSubmit}
          onUpdateArchitecture={handleUpdateArchitectureSubmit}
          onDeleteArchitecture={handleDeleteArchitecture}
          availableArchitectures={architectures}
          onTableReady={setTableInstance}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </Card>
    </Box>
  )
}

export default ArchitecturesPage
