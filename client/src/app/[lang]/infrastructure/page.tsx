'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useAuth, isArchitect } from '@/lib/auth'
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import {
  GET_INFRASTRUCTURES,
  CREATE_INFRASTRUCTURE,
  UPDATE_INFRASTRUCTURE,
  DELETE_INFRASTRUCTURE,
} from '@/graphql/infrastructure'
import InfrastructureTable, {
  INFRASTRUCTURE_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/infrastructure/InfrastructureTable'
import InfrastructureToolbar from '@/components/infrastructure/InfrastructureToolbar'
import InfrastructureFilterDialog from '@/components/infrastructure/InfrastructureFilterDialog'
import InfrastructureForm, {
  InfrastructureFormValues,
} from '@/components/infrastructure/InfrastructureForm'
import { Infrastructure } from '@/gql/generated'
import { useInfrastructureFilter } from '@/components/infrastructure/useInfrastructureFilter'

const InfrastructurePage = () => {
  const { authenticated, initialized } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('infrastructure')
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [showNewInfrastructureForm, setShowNewInfrastructureForm] = useState(false)

  // GraphQL-Abfrage für Infrastrukturen
  const { data, loading, refetch } = useQuery(GET_INFRASTRUCTURES, {
    skip: !authenticated || !initialized,
    fetchPolicy: 'cache-and-network',
  })

  // Echte Daten aus GraphQL oder Fallback auf leeres Array
  const infrastructures: Infrastructure[] = useMemo(() => {
    return data?.infrastructures || []
  }, [data])

  // Filter Hook mit Pattern 2
  const {
    filterState,
    setFilterState,
    filteredInfrastructures,
    resetFilters,
    availableTypes,
    availableStatuses,
    availableVendors,
    availableLocations,
    availableOperatingSystems,
  } = useInfrastructureFilter({ infrastructures })

  // GraphQL-Mutationen für Infrastrukturen
  const [createInfrastructure] = useMutation(CREATE_INFRASTRUCTURE, {
    onCompleted: () => {
      enqueueSnackbar('Infrastruktur erfolgreich erstellt', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen der Infrastruktur: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const [updateInfrastructure] = useMutation(UPDATE_INFRASTRUCTURE, {
    onCompleted: () => {
      enqueueSnackbar('Infrastruktur erfolgreich aktualisiert', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren der Infrastruktur: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  const [deleteInfrastructure] = useMutation(DELETE_INFRASTRUCTURE, {
    onCompleted: () => {
      enqueueSnackbar('Infrastruktur erfolgreich gelöscht', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Löschen der Infrastruktur: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Hinzufügen neuer Infrastrukturen
  const handleAddInfrastructure = useCallback(() => {
    setShowNewInfrastructureForm(true)
  }, [])

  // Handler für das Erstellen einer neuen Infrastruktur
  const handleCreateInfrastructure = useCallback(
    async (values: InfrastructureFormValues) => {
      try {
        await createInfrastructure({
          variables: {
            input: {
              name: values.name,
              description: values.description || '',
              infrastructureType: values.infrastructureType,
              status: values.status,
              vendor: values.vendor || '',
              version: values.version || '',
              location: values.location || '',
              ipAddress: values.ipAddress || '',
              operatingSystem: values.operatingSystem || '',
              maintenanceWindow: values.maintenanceWindow || '',
              endOfLifeDate: values.endOfLifeDate || null,
              ownerId: values.ownerId || null,
              parentInfrastructureId: values.parentInfrastructureId || null,
              childInfrastructureIds: values.childInfrastructureIds || [],
              hostsApplicationIds: values.hostsApplicationIds || [],
              partOfArchitectureIds: values.partOfArchitectureIds || [],
              depictedInDiagramIds: values.depictedInDiagramIds || [],
            },
          },
        })
        setShowNewInfrastructureForm(false)
      } catch (error) {
        console.error('Fehler beim Erstellen der Infrastruktur:', error)
      }
    },
    [createInfrastructure]
  )

  // Handler für das Bearbeiten einer Infrastruktur
  const handleEditInfrastructure = useCallback(
    async (id: string, values: InfrastructureFormValues) => {
      try {
        await updateInfrastructure({
          variables: {
            id: id,
            input: {
              name: values.name,
              description: values.description || '',
              infrastructureType: values.infrastructureType,
              status: values.status,
              vendor: values.vendor || '',
              version: values.version || '',
              location: values.location || '',
              ipAddress: values.ipAddress || '',
              operatingSystem: values.operatingSystem || '',
              maintenanceWindow: values.maintenanceWindow || '',
              endOfLifeDate: values.endOfLifeDate || null,
              ownerId: values.ownerId || null,
              parentInfrastructureId: values.parentInfrastructureId || null,
              childInfrastructureIds: values.childInfrastructureIds || [],
              hostsApplicationIds: values.hostsApplicationIds || [],
              partOfArchitectureIds: values.partOfArchitectureIds || [],
              depictedInDiagramIds: values.depictedInDiagramIds || [],
            },
          },
        })
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Infrastruktur:', error)
      }
    },
    [updateInfrastructure]
  )

  // Handler für das Löschen einer Infrastruktur
  const handleDeleteInfrastructure = useCallback(
    async (id: string) => {
      try {
        await deleteInfrastructure({
          variables: { id },
        })
      } catch (error) {
        console.error('Fehler beim Löschen der Infrastruktur:', error)
      }
    },
    [deleteInfrastructure]
  )

  // Handler für den Export
  const handleExport = useCallback(() => {
    if (!tableInstance) return
    // Export-Logik hier implementieren
    console.log('Export wird implementiert...')
  }, [tableInstance])

  // Handler für den Excel-Export
  const handleExcelExport = useCallback(() => {
    if (!tableInstance) return
    // Excel-Export-Logik hier implementieren
    console.log('Excel-Export wird implementiert...')
  }, [tableInstance])

  // Wenn nicht authentifiziert oder noch nicht initialisiert, nichts anzeigen
  if (!authenticated || !initialized) {
    return null
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddInfrastructure}
            sx={{ ml: 'auto' }}
          >
            {t('addInfrastructure')}
          </Button>
        )}
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <InfrastructureToolbar
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            tableInstance={tableInstance}
            onExport={handleExport}
            onExcelExport={handleExcelExport}
            onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
            onResetFilters={resetFilters}
          />
        </Box>

        <Box sx={{ overflow: 'auto' }}>
          <InfrastructureTable
            data={filteredInfrastructures}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            onTableInstanceChange={setTableInstance}
            onEdit={handleEditInfrastructure}
            onDelete={handleDeleteInfrastructure}
            isLoading={loading}
            defaultColumnVisibility={INFRASTRUCTURE_DEFAULT_COLUMN_VISIBILITY}
          />
        </Box>
      </Card>

      {/* Filter Dialog */}
      <InfrastructureFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={filterState}
        onFiltersChange={setFilterState}
        onResetFilters={resetFilters}
        filterOptions={{
          infrastructureTypes: availableTypes,
          statuses: availableStatuses,
          vendors: availableVendors,
          locations: availableLocations,
          operatingSystems: availableOperatingSystems,
          owners: [], // Falls benötigt, könnte aus dem Hook hinzugefügt werden
          hostsApplications: [], // Falls benötigt, könnte aus dem Hook hinzugefügt werden
          partOfArchitectures: [], // Falls benötigt, könnte aus dem Hook hinzugefügt werden
        }}
      />

      {/* Neues Infrastruktur Formular */}
      {showNewInfrastructureForm && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 1300,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('addInfrastructure')}
          </Typography>
          <InfrastructureForm
            onSubmit={handleCreateInfrastructure}
            onCancel={() => setShowNewInfrastructureForm(false)}
          />
        </Paper>
      )}

      {/* Backdrop für das Formular */}
      {showNewInfrastructureForm && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
          }}
          onClick={() => setShowNewInfrastructureForm(false)}
        />
      )}
    </Box>
  )
}

export default InfrastructurePage
