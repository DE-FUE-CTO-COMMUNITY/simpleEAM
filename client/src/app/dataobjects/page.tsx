'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Box, Typography, Card, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useAuth, login } from '@/lib/auth'
import { SortingState } from '@tanstack/react-table'
import { useQuery, useMutation } from '@apollo/client'
import { GET_DATA_OBJECTS, CREATE_DATA_OBJECT, UPDATE_DATA_OBJECT } from '@/graphql/dataObject'
import DataObjectTable from '@/components/dataobjects/DataObjectTable'
import DataObjectToolbar from '@/components/dataobjects/DataObjectToolbar'
import DataObjectFilterDialog from '@/components/dataobjects/DataObjectFilterDialog'
import DataObjectDialog from '@/components/dataobjects/DataObjectDialog'
import { DataObject, DataObjectFormValues } from '@/components/dataobjects/types'
import { DataObjectFilterState } from '@/components/dataobjects/DataObjectFilterDialog'

const DataObjectsPage = () => {
  const { authenticated } = useAuth()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState<DataObjectFilterState>({
    classifications: [],
    formats: [],
    sources: [],
  })

  // State für den Dialog
  const [selectedDataObject, setSelectedDataObject] = useState<DataObject | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // GraphQL-Abfrage für Datenobjekte
  const { data, loading } = useQuery(GET_DATA_OBJECTS)

  // GraphQL-Mutationen für Datenobjekte
  const [createDataObject, { loading: createLoading }] = useMutation(CREATE_DATA_OBJECT, {
    refetchQueries: [{ query: GET_DATA_OBJECTS }],
  })

  const [updateDataObject, { loading: updateLoading }] = useMutation(UPDATE_DATA_OBJECT, {
    refetchQueries: [{ query: GET_DATA_OBJECTS }],
  })

  // Debug-Ausgabe der empfangenen Daten entfernen, da sie nicht benötigt wird
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

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

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

  // Handler für das Öffnen des Dialogs zum Erstellen eines neuen Datenobjekts
  const handleCreateClick = useCallback(() => {
    setSelectedDataObject(null)
    setDialogMode('create')
    setIsDialogOpen(true)
  }, [])

  // Handler für das Öffnen des Dialogs zum Anzeigen eines Datenobjekts
  const handleRowClick = useCallback(
    (id: string) => {
      const dataObject = dataObjects.find(obj => obj.id === id)
      if (dataObject) {
        setSelectedDataObject(dataObject)
        setDialogMode('view')
        setIsDialogOpen(true)
      }
    },
    [dataObjects]
  )

  // Handler für das Öffnen des Dialogs zum Bearbeiten eines Datenobjekts
  const handleEditClick = useCallback(
    (id: string) => {
      const dataObject = dataObjects.find(obj => obj.id === id)
      if (dataObject) {
        setSelectedDataObject(dataObject)
        setDialogMode('edit')
        setIsDialogOpen(true)
      }
    },
    [dataObjects]
  )

  // Handler für das Schließen des Dialogs
  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false)
  }, [])

  // Handler für das Speichern eines Datenobjekts
  const handleSubmit = useCallback(
    async (formData: DataObjectFormValues) => {
      try {
        if (dialogMode === 'create') {
          await createDataObject({
            variables: {
              name: formData.name,
              description: formData.description,
              classification: formData.classification,
              format: formData.format,
              source: formData.source,
              ownerId: formData.ownerId,
            },
          })
        } else if (dialogMode === 'edit' && selectedDataObject) {
          await updateDataObject({
            variables: {
              id: selectedDataObject.id,
              name: formData.name,
              description: formData.description,
              classification: formData.classification,
              format: formData.format,
              source: formData.source,
              ownerId: formData.ownerId,
            },
          })
        }
        setIsDialogOpen(false)
      } catch (err) {
        // Fehlerbehandlung hier einfügen, wenn nötig
        console.error('Fehler beim Speichern:', err)
      }
    },
    [createDataObject, updateDataObject, dialogMode, selectedDataObject]
  )

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Datenobjekte ({dataObjects.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Neues Datenobjekt
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <DataObjectToolbar
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            activeFiltersCount={activeFiltersCount}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onResetFilters={handleResetFilters}
          />
        </Box>

        <DataObjectTable
          dataObjects={filteredDataObjects}
          loading={loading}
          globalFilter={globalFilter}
          sorting={sorting}
          onSortingChange={setSorting}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
        />

        <DataObjectFilterDialog
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={handleResetFilters}
          filterOptions={filterOptions}
        />

        {/* DataObject Dialog */}
        {isDialogOpen && (
          <DataObjectDialog
            dataObject={selectedDataObject}
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onSubmit={handleSubmit}
            isLoading={dialogMode === 'create' ? createLoading : updateLoading}
            mode={dialogMode}
          />
        )}
      </Card>
    </Box>
  )
}

export default DataObjectsPage
