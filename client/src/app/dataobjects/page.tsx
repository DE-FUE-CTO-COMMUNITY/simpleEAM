'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
      if (filters.sources.length > 0) {
        if (!obj.dataSources || obj.dataSources.length === 0) return false
        const hasMatchingSource = obj.dataSources.some(source =>
          filters.sources.includes(source.name)
        )
        if (!hasMatchingSource) return false
      }

      // Globalen Filter anwenden (suche in Name, Beschreibung, Format, Datenquellen)
      if (globalFilter && globalFilter.trim() !== '') {
        const searchTerm = globalFilter.toLowerCase().trim()
        const matchesName = obj.name.toLowerCase().includes(searchTerm)
        const matchesDescription = obj.description
          ? obj.description.toLowerCase().includes(searchTerm)
          : false
        const matchesFormat = obj.format ? obj.format.toLowerCase().includes(searchTerm) : false
        const matchesDataSources = obj.dataSources
          ? obj.dataSources.some(source => source.name.toLowerCase().includes(searchTerm))
          : false

        if (!matchesName && !matchesDescription && !matchesFormat && !matchesDataSources) {
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
      if (obj.dataSources) {
        obj.dataSources.forEach(source => sources.add(source.name))
      }
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

  // Handler für das Erstellen eines neuen Datenobjekts
  const handleCreateDataObjectSubmit = async (data: DataObjectFormValues) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        classification: data.classification,
        format: data.format,
        introductionDate: data.introductionDate,
        endOfLifeDate: data.endOfLifeDate,
        dataSources: data.dataSources?.length
          ? {
              connect: data.dataSources.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
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
      // Find the current data object to compare changes
      const currentDataObject = dataObjects.find(obj => obj.id === id)
      if (!currentDataObject) {
        console.error('DataObject not found for update')
        return
      }

      const input: any = {
        name: { set: data.name },
        description: { set: data.description },
        classification: { set: data.classification },
        format: { set: data.format },
        introductionDate: { set: data.introductionDate },
        endOfLifeDate: { set: data.endOfLifeDate },
      }

      // DataSources Update - only update if changed
      const currentDataSourceIds = currentDataObject.dataSources?.map(app => app.id).sort() || []
      const newDataSourceIds = data.dataSources?.sort() || []
      
      // Debug-Ausgabe für DataSources-Vergleich
      console.log('DataSources comparison:', {
        current: currentDataSourceIds,
        new: newDataSourceIds,
        currentString: JSON.stringify(currentDataSourceIds),
        newString: JSON.stringify(newDataSourceIds)
      })
      
      const dataSourcesChanged = JSON.stringify(currentDataSourceIds) !== JSON.stringify(newDataSourceIds)
      
      if (dataSourcesChanged) {
        console.log('DataSources changed - updating:', {
          current: currentDataSourceIds,
          new: newDataSourceIds
        })
        
        if (newDataSourceIds.length > 0) {
          input.dataSources = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: newDataSourceIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          // Wenn keine DataSources ausgewählt sind, alle Verbindungen trennen
          input.dataSources = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // Owners Update - only update if changed
      const currentOwnerId = currentDataObject.owners?.[0]?.id || ''
      const newOwnerId = data.ownerId || ''
      
      // Debug-Ausgabe für Owner-Vergleich
      console.log('Owner comparison:', {
        current: currentOwnerId,
        new: newOwnerId,
        currentType: typeof currentOwnerId,
        newType: typeof newOwnerId,
        currentOwnerObject: currentDataObject.owners?.[0],
        formOwnerId: data.ownerId
      })
      
      const ownerChanged = currentOwnerId !== newOwnerId
      
      if (ownerChanged) {
        console.log('Owner changed - updating:', {
          current: currentOwnerId,
          new: newOwnerId
        })
        
        if (newOwnerId) {
          input.owners = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: [{ where: { node: { id: { eq: newOwnerId } } } }], // Neue Verbindung herstellen
            },
          ]
        } else {
          input.owners = [
            {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            },
          ]
        }
      }

      // Debug-Ausgabe vor Update
      console.log('Current DataObject:', {
        id: currentDataObject.id,
        name: currentDataObject.name,
        classification: currentDataObject.classification,
        dataSources: currentDataObject.dataSources,
        owners: currentDataObject.owners
      })
      console.log('Form Data:', data)

      // Debug-Ausgabe
      console.log('DataObject Update Input:', JSON.stringify(input, null, 2))
      console.log('DataSources changed:', dataSourcesChanged)
      console.log('Owner changed:', ownerChanged)

      await updateDataObject({
        variables: {
          id,
          input,
        },
      })
      
      console.log('DataObject update completed successfully')
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
