'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, CircularProgress } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, login, isArchitect } from '@/lib/auth'
import {
  GET_APPLICATION_INTERFACES,
  CREATE_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
  DELETE_APPLICATION_INTERFACE,
} from '@/graphql/applicationInterface'
import { ApplicationInterface } from '@/gql/generated'

// Importiere die Komponenten
import ApplicationInterfaceTable from '@/components/interfaces/ApplicationInterfaceTable'
import ApplicationInterfaceToolbar from '@/components/interfaces/ApplicationInterfaceToolbar'
import ApplicationInterfaceFilterDialog from '@/components/interfaces/ApplicationInterfaceFilterDialog'
import ApplicationInterfaceForm, {
  ApplicationInterfaceFormValues,
} from '@/components/interfaces/ApplicationInterfaceForm'
import { useApplicationInterfaceFilter } from '@/components/interfaces/useApplicationInterfaceFilter'

const InterfacesPage = () => {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Filter-Zustand
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // State für das neue Interface-Formular
  const [showNewInterfaceForm, setShowNewInterfaceForm] = useState(false)
  const [editingInterface, setEditingInterface] = useState<ApplicationInterface | null>(null)
  const [viewingInterface, setViewingInterface] = useState<ApplicationInterface | null>(null)

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  // Schnittstellen laden
  const { loading, error, data, refetch } = useQuery(GET_APPLICATION_INTERFACES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Schnittstellen', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const interfaces = data?.applicationInterfaces || []

  // Filter auf Schnittstellen anwenden
  const {
    filterState,
    setFilterState,
    filteredInterfaces,
    resetFilters,
    availableInterfaceTypes,
    availableDataObjects,
  } = useApplicationInterfaceFilter({ interfaces })

  // Mutations
  const [createApplicationInterface] = useMutation(CREATE_APPLICATION_INTERFACE)
  const [updateApplicationInterface] = useMutation(UPDATE_APPLICATION_INTERFACE)
  const [deleteApplicationInterface] = useMutation(DELETE_APPLICATION_INTERFACE)

  // Handler für das Erstellen einer neuen Schnittstelle
  const handleCreateInterface = async (values: ApplicationInterfaceFormValues) => {
    try {
      await createApplicationInterface({
        variables: {
          input: [
            {
              name: values.name,
              description: values.description,
              interfaceType: values.interfaceType,
              dataObjects: values.dataObjectIds?.length
                ? {
                    connect: values.dataObjectIds.map(id => ({
                      where: {
                        node: { id: { eq: id } },
                      },
                    })),
                  }
                : undefined,
            },
          ],
        },
      })
      enqueueSnackbar('Schnittstelle erfolgreich erstellt', { variant: 'success' })
      setShowNewInterfaceForm(false)
      await refetch()
    } catch {
      enqueueSnackbar('Fehler beim Erstellen der Schnittstelle', { variant: 'error' })
    }
  }

  // Handler für das Aktualisieren einer Schnittstelle
  const handleUpdateInterface = async (values: ApplicationInterfaceFormValues) => {
    if (!editingInterface?.id) return

    try {
      await updateApplicationInterface({
        variables: {
          id: editingInterface.id,
          input: {
            name: values.name,
            description: values.description,
            interfaceType: values.interfaceType,
            dataObjects: {
              disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
              connect: values.dataObjectIds?.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          },
        },
      })
      enqueueSnackbar('Schnittstelle erfolgreich aktualisiert', { variant: 'success' })
      setEditingInterface(null)
      await refetch()
    } catch {
      enqueueSnackbar('Fehler beim Aktualisieren der Schnittstelle', { variant: 'error' })
    }
  }

  // Handler für das Löschen einer Schnittstelle
  const handleDeleteInterface = async (id: string) => {
    if (!window.confirm('Möchten Sie diese Schnittstelle wirklich löschen?')) return

    try {
      await deleteApplicationInterface({
        variables: { id },
      })
      enqueueSnackbar('Schnittstelle erfolgreich gelöscht', { variant: 'success' })
      await refetch()
    } catch {
      enqueueSnackbar('Fehler beim Löschen der Schnittstelle', { variant: 'error' })
    }
  }

  // Handler für das Öffnen des Edit-Formulars
  const handleEditInterface = (iface: ApplicationInterface) => {
    setEditingInterface(iface)
  }

  // Handler für das Öffnen der Detailansicht
  const handleViewInterface = (id: string) => {
    const iface = interfaces.find((i: ApplicationInterface) => i.id === id)
    if (iface) {
      setViewingInterface(iface)
    }
  }

  // Handler für Wechsel von View zu Edit
  const handleSwitchToEdit = () => {
    if (viewingInterface) {
      setEditingInterface(viewingInterface)
      setViewingInterface(null)
    }
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
            onClick={() => setShowNewInterfaceForm(true)}
          >
            Neue Schnittstelle
          </Button>
        )}
      </Box>

      {/* Toolbar für Suche und Filter */}
      <ApplicationInterfaceToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        activeFiltersCount={activeFiltersCount}
        onFilterClick={() => setFilterOpen(true)}
        onResetFilters={resetFilters}
      />

      {/* Filter-Dialog */}
      {filterOpen && (
        <ApplicationInterfaceFilterDialog
          filterState={filterState}
          availableInterfaceTypes={availableInterfaceTypes}
          availableDataObjects={availableDataObjects}
          onFilterChange={newFilter => setFilterState(prev => ({ ...prev, ...newFilter }))}
          onResetFilter={resetFilters}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Loading-Indikator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tabelle mit Schnittstellen */}
      {!loading && filteredInterfaces.length === 0 ? (
        <Card sx={{ mb: 3, p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Keine Schnittstellen gefunden</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Es wurden keine Schnittstellen gefunden, die den Filterkriterien entsprechen.
          </Typography>
        </Card>
      ) : (
        <ApplicationInterfaceTable
          applicationInterfaces={filteredInterfaces}
          loading={loading}
          globalFilter={globalFilter}
          sorting={sorting}
          onSortingChange={setSorting}
          onRowClick={handleViewInterface}
          onEditClick={id => {
            const iface = interfaces.find((i: ApplicationInterface) => i.id === id)
            if (iface) handleEditInterface(iface)
          }}
          onDeleteApplicationInterface={handleDeleteInterface}
        />
      )}

      {/* Formular zum Erstellen einer neuen Schnittstelle */}
      {showNewInterfaceForm && (
        <ApplicationInterfaceForm
          onClose={() => setShowNewInterfaceForm(false)}
          onSubmit={handleCreateInterface}
          isOpen={showNewInterfaceForm}
          mode="create"
        />
      )}

      {/* Formular zum Bearbeiten einer Schnittstelle */}
      {editingInterface && (
        <ApplicationInterfaceForm
          onClose={() => setEditingInterface(null)}
          onSubmit={handleUpdateInterface}
          isOpen={Boolean(editingInterface)}
          mode="edit"
          applicationInterface={editingInterface}
        />
      )}

      {/* Formular zum Anzeigen einer Schnittstelle */}
      {viewingInterface && (
        <ApplicationInterfaceForm
          onClose={() => setViewingInterface(null)}
          onSubmit={handleUpdateInterface} // Wird im View-Modus nicht verwendet
          isOpen={Boolean(viewingInterface)}
          mode="view"
          applicationInterface={viewingInterface}
          onEditMode={handleSwitchToEdit}
        />
      )}
    </Box>
  )
}

export default InterfacesPage
