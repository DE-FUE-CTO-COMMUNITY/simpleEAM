'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Card, Button, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useAuth, login, isArchitect } from '@/lib/auth'
import { SortingState } from '@tanstack/react-table'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import {
  GET_DATA_OBJECTS,
  CREATE_DATA_OBJECT,
  UPDATE_DATA_OBJECT,
  DELETE_DATA_OBJECT,
} from '@/graphql/dataObject'
import DataObjectTable from '@/components/dataobjects/DataObjectTable'
import DataObjectToolbar from '@/components/dataobjects/DataObjectToolbar'
import DataObjectFilterDialog from '@/components/dataobjects/DataObjectFilterDialog'
import DataObjectForm, { DataObjectFormValues } from '@/components/dataobjects/DataObjectForm'
import { DataObject } from '@/gql/generated'
import { DataObjectFilterState } from '@/components/dataobjects/DataObjectFilterDialog'

const DataObjectsPage = () => {
  const { authenticated } = useAuth()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState<DataObjectFilterState>({
    classifications: [],
    formats: [],
    sources: [],
  })

  // State für die DataObjectForm
  const [showNewDataObjectForm, setShowNewDataObjectForm] = useState(false)

  // GraphQL-Abfrage für Datenobjekte
  const { data, loading, refetch } = useQuery(GET_DATA_OBJECTS, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // GraphQL-Mutationen für Datenobjekte
  const [createDataObject, { loading: isCreating }] = useMutation(CREATE_DATA_OBJECT, {
    onCompleted: () => {
      enqueueSnackbar('Datenobjekt erfolgreich erstellt', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen des Datenobjekts: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const [updateDataObject, { loading: isUpdating }] = useMutation(UPDATE_DATA_OBJECT, {
    onCompleted: () => {
      enqueueSnackbar('Datenobjekt erfolgreich aktualisiert', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren des Datenobjekts: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const [deleteDataObject, { loading: isDeleting }] = useMutation(DELETE_DATA_OBJECT, {
    onCompleted: () => {
      enqueueSnackbar('Datenobjekt erfolgreich gelöscht', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Löschen des Datenobjekts: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  // Echte Daten aus GraphQL oder Fallback auf leeres Array
  const dataObjects: DataObject[] = useMemo(() => {
    return data?.dataObjects || []
  }, [data])

  // Gefilterte Daten basierend auf den ausgewählten Filtern
  const filteredDataObjects = useMemo(() => {
    // Wenn keine Filter aktiv sind, alle Daten zurückgeben
    if (
      filters.classifications.length === 0 &&
      filters.formats.length === 0 &&
      filters.sources.length === 0 &&
      !globalFilter
    ) {
      return dataObjects
    }

    // Daten basierend auf den Filtern filtern
    return dataObjects.filter(obj => {
      // Klassifikationsfilter anwenden
      if (
        filters.classifications.length > 0 &&
        !filters.classifications.includes(obj.classification)
      ) {
        return false
      }

      // Formatfilter anwenden
      if (filters.formats.length > 0 && (!obj.format || !filters.formats.includes(obj.format))) {
        return false
      }

      // Quellenfilter anwenden
      if (filters.sources.length > 0 && (!obj.source || !filters.sources.includes(obj.source))) {
        return false
      }

      // Globalen Filter anwenden (suche in Name, Beschreibung, Format, Quelle)
      if (globalFilter && globalFilter.trim() !== '') {
        const searchTerm = globalFilter.toLowerCase().trim()
        const matchesName = obj.name.toLowerCase().includes(searchTerm)
        const matchesDescription = obj.description
          ? obj.description.toLowerCase().includes(searchTerm)
          : false
        const matchesFormat = obj.format ? obj.format.toLowerCase().includes(searchTerm) : false
        const matchesSource = obj.source ? obj.source.toLowerCase().includes(searchTerm) : false

        if (!matchesName && !matchesDescription && !matchesFormat && !matchesSource) {
          return false
        }
      }

      return true
    })
  }, [dataObjects, filters, globalFilter])

  // Filter-Optionen ermitteln
  const filterOptions = useMemo(() => {
    const formats = new Set<string>()
    const sources = new Set<string>()

    dataObjects.forEach(obj => {
      if (obj.format) formats.add(obj.format)
      if (obj.source) sources.add(obj.source)
    })

    return {
      availableFormats: Array.from(formats),
      availableSources: Array.from(sources),
    }
  }, [dataObjects])

  // Zählt die aktiven Filter
  const activeFiltersCount = useMemo(() => {
    return filters.classifications.length + filters.formats.length + filters.sources.length
  }, [filters])

  // Handler für das Zurücksetzen der Filter
  const handleResetFilters = useCallback(() => {
    setFilters({
      classifications: [],
      formats: [],
      sources: [],
    })
  }, [])

  // Handler für das Öffnen der Form zum Erstellen eines neuen Datenobjekts
  const handleCreateDataObject = useCallback(() => {
    setShowNewDataObjectForm(true)
  }, [])

  // Handler für das Öffnen der Detailansicht eines Datenobjekts
  const handleViewDataObject = useCallback(
    (id: string) => {
      router.push(`/dataobjects/${id}`)
    },
    [router]
  )

  // Handler für das Öffnen der Form zum Bearbeiten eines Datenobjekts
  const handleEditDataObject = useCallback(
    (id: string) => {
      router.push(`/dataobjects/edit/${id}`)
    },
    [router]
  )

  // Handler für das Erstellen eines neuen Datenobjekts
  const handleCreateDataObjectSubmit = async (data: DataObjectFormValues) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        classification: data.classification,
        format: data.format,
        source: data.source,
        ...(data.ownerId
          ? { owners: { connect: [{ where: { node: { id: { eq: data.ownerId } } } }] } }
          : {}),
      }

      await createDataObject({
        variables: {
          input: [input],
        },
      })

      // Formular nach dem Erstellen schließen
      setShowNewDataObjectForm(false)
    } catch (error) {
      console.error('Fehler beim Erstellen des Datenobjekts:', error)
    }
  }

  // Handler für das Aktualisieren eines Datenobjekts
  const handleUpdateDataObjectSubmit = async (id: string, data: DataObjectFormValues) => {
    try {
      const input = {
        name: { set: data.name },
        description: { set: data.description },
        classification: { set: data.classification },
        format: { set: data.format },
        source: { set: data.source },
      }

      // Wenn ownerId vorhanden ist, fügen wir die owners-Beziehung hinzu
      if (data.ownerId) {
        Object.assign(input, {
          owners: {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: [{ where: { node: { id: { eq: data.ownerId } } } }], // Neue Verbindung herstellen
          },
        })
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

  // Handler für das Löschen eines Datenobjekts
  const handleDeleteDataObject = async (id: string) => {
    try {
      await deleteDataObject({
        variables: { id },
      })
    } catch (error) {
      console.error('Fehler beim Löschen des Datenobjekts:', error)
    }
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Datenobjekte
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDataObject}
          >
            Neu erstellen
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <DataObjectToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setIsFilterDialogOpen(true)}
          onResetFilters={handleResetFilters}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <DataObjectTable
            dataObjects={filteredDataObjects}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onRowClick={handleViewDataObject}
            onEditClick={handleEditDataObject}
            onCreateDataObject={handleCreateDataObjectSubmit}
            onUpdateDataObject={handleUpdateDataObjectSubmit}
            onDeleteDataObject={handleDeleteDataObject}
          />
        </Paper>
      </Card>

      {isFilterDialogOpen && (
        <DataObjectFilterDialog
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={handleResetFilters}
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
