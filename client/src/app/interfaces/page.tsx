'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, isArchitect } from '@/lib/auth'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import {
  GET_APPLICATION_INTERFACES,
  CREATE_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
  DELETE_APPLICATION_INTERFACE,
} from '@/graphql/applicationInterface'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_PERSONS } from '@/graphql/person'
import ApplicationInterfaceForm, {
  ApplicationInterfaceFormValues,
} from '@/components/interfaces/ApplicationInterfaceForm'

// Importiere die ausgelagerten Komponenten
import ApplicationInterfaceTable from '@/components/interfaces/ApplicationInterfaceTable'
import ApplicationInterfaceToolbar from '@/components/interfaces/ApplicationInterfaceToolbar'
import ApplicationInterfaceFilterDialog from '@/components/interfaces/ApplicationInterfaceFilterDialog'
import { useApplicationInterfaceFilter } from '@/components/interfaces/useApplicationInterfaceFilter'
import { FilterState } from '@/components/interfaces/types'
import { DataObject } from '@/gql/generated'

function ApplicationInterfacesPage() {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Filter-Zustand
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    interfaceTypeFilter: [],
    searchFilter: '',
    updatedDateRange: ['', ''],
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // State für das neue Formular
  const [showNewApplicationInterfaceForm, setShowNewApplicationInterfaceForm] = useState(false)

  // Schnittstellen laden - Auth-Check erfolgt bereits in layout.tsx
  const { loading, error, data, refetch } = useQuery(GET_APPLICATION_INTERFACES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Datenobjekte laden für Formular-Auswahlmöglichkeiten
  const { data: dataObjectsData } = useQuery(GET_DATA_OBJECTS, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Anwendungen laden für Formular-Auswahlmöglichkeiten
  const { data: applicationsData } = useQuery(GET_APPLICATIONS, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Personen laden für Formular-Auswahlmöglichkeiten
  const { data: personsData } = useQuery(GET_PERSONS, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  const dataObjects = dataObjectsData?.dataObjects || []
  const applications = applicationsData?.applications || []
  const persons = personsData?.people || []

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Schnittstellen', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const applicationInterfaces = data?.applicationInterfaces || []

  // Filter auf Schnittstellen anwenden
  const { filteredApplicationInterfaces: filteredData, availableInterfaceTypes } =
    useApplicationInterfaceFilter({
      applicationInterfaces,
    })

  // Mutation zum Erstellen einer neuen Schnittstelle
  const [createApplicationInterface, { loading: isCreating }] = useMutation(
    CREATE_APPLICATION_INTERFACE,
    {
      onCompleted: () => {
        enqueueSnackbar('Schnittstelle erfolgreich erstellt', { variant: 'success' })
        refetch()
      },
      onError: error => {
        enqueueSnackbar(`Fehler beim Erstellen der Schnittstelle: ${error.message}`, {
          variant: 'error',
        })
      },
    }
  )

  // Mutation zum Aktualisieren einer bestehenden Schnittstelle
  const [updateApplicationInterface] = useMutation(UPDATE_APPLICATION_INTERFACE, {
    onCompleted: () => {
      enqueueSnackbar('Schnittstelle erfolgreich aktualisiert', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren der Schnittstelle: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Löschen einer Schnittstelle
  const [deleteApplicationInterface] = useMutation(DELETE_APPLICATION_INTERFACE, {
    onCompleted: () => {
      enqueueSnackbar('Schnittstelle erfolgreich gelöscht', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Löschen der Schnittstelle: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Erstellen einer neuen Schnittstelle
  const handleCreateApplicationInterfaceSubmit = async (data: ApplicationInterfaceFormValues) => {
    const input = {
      name: data.name,
      description: data.description,
      interfaceType: data.interfaceType,
      protocol: data.protocol,
      version: data.version,
      status: data.status,
      introductionDate: data.introductionDate,
      endOfLifeDate: data.endOfLifeDate,
      responsiblePerson: data.responsiblePerson
        ? {
            connect: {
              where: {
                node: { id: { eq: data.responsiblePerson } },
              },
            },
          }
        : undefined,
      sourceApplications: data.sourceApplications?.length
        ? {
            connect: data.sourceApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      targetApplications: data.targetApplications?.length
        ? {
            connect: data.targetApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
      dataObjects: data.dataObjects?.length
        ? {
            connect: data.dataObjects.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : undefined,
    }

    await createApplicationInterface({
      variables: { input: [input] },
    })

    // Formular nach dem Erstellen schließen
    setShowNewApplicationInterfaceForm(false)
  }

  // Handler für das Aktualisieren einer bestehenden Schnittstelle
  const handleUpdateApplicationInterfaceSubmit = async (
    id: string,
    data: ApplicationInterfaceFormValues
  ) => {
    // Basis-Input-Daten vorbereiten
    const input = {
      name: { set: data.name },
      description: { set: data.description },
      interfaceType: { set: data.interfaceType },
      protocol: { set: data.protocol },
      version: { set: data.version },
      status: { set: data.status },
      introductionDate: { set: data.introductionDate },
      endOfLifeDate: { set: data.endOfLifeDate },
      responsiblePerson: data.responsiblePerson
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: {
              where: {
                node: { id: { eq: data.responsiblePerson } },
              },
            },
          }
        : { disconnect: [{ where: {} }] },
      sourceApplications: data.sourceApplications?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.sourceApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      targetApplications: data.targetApplications?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.targetApplications.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
      dataObjects: data.dataObjects?.length
        ? {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: data.dataObjects.map(id => ({
              where: {
                node: { id: { eq: id } },
              },
            })),
          }
        : { disconnect: [{ where: {} }] },
    }

    await updateApplicationInterface({
      variables: { id, input },
    })
  }

  // Neue Schnittstelle erstellen
  const handleCreateApplicationInterface = () => {
    setShowNewApplicationInterfaceForm(true)
  }

  // Schnittstelle löschen
  const handleDeleteApplicationInterface = async (id: string) => {
    await deleteApplicationInterface({
      variables: { id },
    })
    // Automatisches Schließen erfolgt durch die Form selbst
  }

  // Filter-Handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Filter zurücksetzen
  const handleResetFilter = () => {
    setFilterState({
      interfaceTypeFilter: [],
      searchFilter: '',
      updatedDateRange: ['', ''],
    })
    setActiveFiltersCount(0)
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Schnittstellen
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateApplicationInterface}
          >
            Neu erstellen
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <ApplicationInterfaceToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <ApplicationInterfaceTable
            id="application-interface-table"
            applicationInterfaces={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateApplicationInterface={handleCreateApplicationInterfaceSubmit}
            onUpdateApplicationInterface={handleUpdateApplicationInterfaceSubmit}
            onDeleteApplicationInterface={handleDeleteApplicationInterface}
            dataObjects={dataObjects as DataObject[]}
            applications={applications}
            persons={persons}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <ApplicationInterfaceFilterDialog
          filterState={filterState}
          availableInterfaceTypes={availableInterfaceTypes}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Formular für neue Schnittstelle */}
      {showNewApplicationInterfaceForm && (
        <ApplicationInterfaceForm
          isOpen={showNewApplicationInterfaceForm}
          onClose={() => setShowNewApplicationInterfaceForm(false)}
          onSubmit={handleCreateApplicationInterfaceSubmit}
          mode="create"
          loading={isCreating}
          dataObjects={dataObjects as DataObject[]}
          applications={applications}
          persons={persons}
        />
      )}
    </Box>
  )
}

export default ApplicationInterfacesPage
