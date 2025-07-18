'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
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
import InfrastructureTable from '@/components/infrastructure/InfrastructureTable'
import InfrastructureToolbar from '@/components/infrastructure/InfrastructureToolbar'
import InfrastructureFilterDialog from '@/components/infrastructure/InfrastructureFilterDialog'
import InfrastructureForm, { InfrastructureFormValues } from '@/components/infrastructure/InfrastructureForm'
import { Infrastructure } from '@/gql/generated'
import { InfrastructureFilterState } from '@/components/infrastructure/InfrastructureFilterDialog'

const InfrastructurePage = () => {
  const { authenticated } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState<InfrastructureFilterState>({
    infrastructureTypes: [],
    statuses: [],
    vendors: [],
    locations: [],
    owners: [],
    hostsApplications: [],
    partOfArchitectures: [],
    descriptionFilter: '',
    updatedDateRange: ['', ''],
  })

  // State für das neue Formular
  const [showNewInfrastructureForm, setShowNewInfrastructureForm] = useState(false)

  // GraphQL-Abfrage für Infrastrukturen
  const { data, loading, refetch } = useQuery(GET_INFRASTRUCTURES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

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

  // Echte Daten aus GraphQL oder Fallback auf leeres Array - Auth-Check erfolgt bereits in layout.tsx
  const infrastructures: Infrastructure[] = useMemo(() => {
    return data?.infrastructures || []
  }, [data])

  // Gefilterte Daten basierend auf den ausgewählten Filtern
  const filteredInfrastructures = useMemo(() => {
    // Wenn keine Filter aktiv sind, alle Daten zurückgeben
    if (
      filters.infrastructureTypes.length === 0 &&
      filters.statuses.length === 0 &&
      filters.vendors.length === 0 &&
      filters.locations.length === 0 &&
      filters.owners.length === 0 &&
      filters.hostsApplications.length === 0 &&
      filters.partOfArchitectures.length === 0 &&
      !filters.descriptionFilter &&
      !filters.updatedDateRange[0] &&
      !filters.updatedDateRange[1] &&
      !globalFilter
    ) {
      return infrastructures
    }

    // Daten basierend auf den Filtern filtern
    return infrastructures.filter(infrastructure => {
      // Infrastruktur-Typ Filter anwenden
      if (
        filters.infrastructureTypes.length > 0 &&
        !filters.infrastructureTypes.includes(infrastructure.infrastructureType)
      ) {
        return false
      }

      // Status Filter anwenden
      if (filters.statuses.length > 0 && !filters.statuses.includes(infrastructure.status)) {
        return false
      }

      // Anbieter Filter anwenden
      if (
        filters.vendors.length > 0 &&
        (!infrastructure.vendor || !filters.vendors.includes(infrastructure.vendor))
      ) {
        return false
      }

      // Standort Filter anwenden
      if (
        filters.locations.length > 0 &&
        (!infrastructure.location || !filters.locations.includes(infrastructure.location))
      ) {
        return false
      }

      // Verantwortliche Filter anwenden
      if (filters.owners.length > 0) {
        if (!infrastructure.owners || infrastructure.owners.length === 0) return false
        const hasMatchingOwner = infrastructure.owners.some(owner =>
          filters.owners.includes(`${owner.firstName} ${owner.lastName}`)
        )
        if (!hasMatchingOwner) return false
      }

      // Gehostete Applikationen Filter anwenden
      if (filters.hostsApplications.length > 0) {
        if (!infrastructure.hostsApplications || infrastructure.hostsApplications.length === 0)
          return false
        const hasMatchingApp = infrastructure.hostsApplications.some(app =>
          filters.hostsApplications.includes(app.name)
        )
        if (!hasMatchingApp) return false
      }

      // Teil von Architekturen Filter anwenden
      if (filters.partOfArchitectures.length > 0) {
        if (!infrastructure.partOfArchitectures || infrastructure.partOfArchitectures.length === 0)
          return false
        const hasMatchingArchitecture = infrastructure.partOfArchitectures.some(arch =>
          filters.partOfArchitectures.includes(arch.name)
        )
        if (!hasMatchingArchitecture) return false
      }

      // Beschreibungsfilter anwenden
      if (filters.descriptionFilter && filters.descriptionFilter.trim() !== '') {
        const searchTerm = filters.descriptionFilter.toLowerCase().trim()
        if (
          !infrastructure.description ||
          !infrastructure.description.toLowerCase().includes(searchTerm)
        ) {
          return false
        }
      }

      // Datum Aktualisiert Filter anwenden
      if (filters.updatedDateRange[0] || filters.updatedDateRange[1]) {
        const infraDate = infrastructure.updatedAt
          ? new Date(infrastructure.updatedAt).getTime()
          : 0
        if (filters.updatedDateRange[0]) {
          const fromDate = new Date(filters.updatedDateRange[0]).getTime()
          if (infraDate < fromDate) return false
        }
        if (filters.updatedDateRange[1]) {
          const toDate = new Date(filters.updatedDateRange[1]).getTime()
          if (infraDate > toDate) return false
        }
      }

      // Globalen Filter anwenden (suche in Name, Beschreibung, Anbieter, Standort)
      if (globalFilter && globalFilter.trim() !== '') {
        const searchTerm = globalFilter.toLowerCase().trim()
        const matchesName = infrastructure.name.toLowerCase().includes(searchTerm)
        const matchesDescription = infrastructure.description
          ? infrastructure.description.toLowerCase().includes(searchTerm)
          : false
        const matchesVendor = infrastructure.vendor
          ? infrastructure.vendor.toLowerCase().includes(searchTerm)
          : false
        const matchesLocation = infrastructure.location
          ? infrastructure.location.toLowerCase().includes(searchTerm)
          : false

        if (!matchesName && !matchesDescription && !matchesVendor && !matchesLocation) {
          return false
        }
      }

      return true
    })
  }, [infrastructures, filters, globalFilter])

  // Filter-Optionen ermitteln
  const filterOptions = useMemo(() => {
    const infrastructureTypes = new Set<string>()
    const statuses = new Set<string>()
    const vendors = new Set<string>()
    const locations = new Set<string>()
    const owners = new Set<string>()
    const hostsApplications = new Set<string>()
    const partOfArchitectures = new Set<string>()

    infrastructures.forEach(infrastructure => {
      infrastructureTypes.add(infrastructure.infrastructureType)
      statuses.add(infrastructure.status)
      if (infrastructure.vendor) vendors.add(infrastructure.vendor)
      if (infrastructure.location) locations.add(infrastructure.location)
      if (infrastructure.owners) {
        infrastructure.owners.forEach(owner => owners.add(`${owner.firstName} ${owner.lastName}`))
      }
      if (infrastructure.hostsApplications) {
        infrastructure.hostsApplications.forEach(app => hostsApplications.add(app.name))
      }
      if (infrastructure.partOfArchitectures) {
        infrastructure.partOfArchitectures.forEach(arch => partOfArchitectures.add(arch.name))
      }
    })

    return {
      availableInfrastructureTypes: Array.from(infrastructureTypes),
      availableStatuses: Array.from(statuses),
      availableVendors: Array.from(vendors),
      availableLocations: Array.from(locations),
      availableOwners: Array.from(owners),
      availableHostsApplications: Array.from(hostsApplications),
      availablePartOfArchitectures: Array.from(partOfArchitectures),
    }
  }, [infrastructures])

  // Zählt die aktiven Filter
  const activeFiltersCount = useMemo(() => {
    return (
      filters.infrastructureTypes.length +
      filters.statuses.length +
      filters.vendors.length +
      filters.locations.length +
      filters.owners.length +
      filters.hostsApplications.length +
      filters.partOfArchitectures.length +
      (filters.descriptionFilter ? 1 : 0) +
      (filters.updatedDateRange[0] || filters.updatedDateRange[1] ? 1 : 0)
    )
  }, [filters])

  // Handler für das Zurücksetzen der Filter
  const handleResetFilters = useCallback(() => {
    setFilters({
      infrastructureTypes: [],
      statuses: [],
      vendors: [],
      locations: [],
      owners: [],
      hostsApplications: [],
      partOfArchitectures: [],
      descriptionFilter: '',
      updatedDateRange: ['', ''],
    })
  }, [])

  // Handler für das Öffnen der Form zum Erstellen einer neuen Infrastruktur - ENTFERNT
  // Handler für das Öffnen des Formulars zur Erstellung einer neuen Infrastruktur
  const handleCreateInfrastructure = useCallback(() => {
    setShowNewInfrastructureForm(true)
  }, [])

  // Handler für das Erstellen einer neuen Infrastruktur
  const handleCreateInfrastructureSubmit = async (data: InfrastructureFormValues) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        infrastructureType: data.infrastructureType,
        status: data.status,
        vendor: data.vendor,
        version: data.version,
        capacity: data.capacity,
        location: data.location,
        ipAddress: data.ipAddress,
        operatingSystem: data.operatingSystem,
        specifications: data.specifications,
        maintenanceWindow: data.maintenanceWindow,
        costs: data.costs,
        planningDate: data.planningDate,
        introductionDate: data.introductionDate,
        endOfUseDate: data.endOfUseDate,
        endOfLifeDate: data.endOfLifeDate,
        parentInfrastructure: data.parentInfrastructure?.length
          ? {
              connect: data.parentInfrastructure.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        childInfrastructures: data.childInfrastructures?.length
          ? {
              connect: data.childInfrastructures.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        hostsApplications: data.hostsApplications?.length
          ? {
              connect: data.hostsApplications.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        partOfArchitectures: data.partOfArchitectures?.length
          ? {
              connect: data.partOfArchitectures.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            }
          : undefined,
        depictedInDiagrams: data.depictedInDiagrams?.length
          ? {
              connect: data.depictedInDiagrams.map(id => ({
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

      await createInfrastructure({
        variables: {
          input: [input],
        },
      })

      // Formular nach dem Erstellen schließen
      setShowNewInfrastructureForm(false)
    } catch (error) {
      console.error('Fehler beim Erstellen der Infrastruktur:', error)
    }
  }

  // Handler für das Aktualisieren einer Infrastruktur
  const handleUpdateInfrastructureSubmit = async (id: string, data: InfrastructureFormValues) => {
    try {
      // Find the current infrastructure to compare changes
      const currentInfrastructure = infrastructures.find(infra => infra.id === id)
      if (!currentInfrastructure) {
        console.error('Infrastructure not found for update')
        return
      }

      const input: any = {
        name: { set: data.name },
        description: { set: data.description },
        infrastructureType: { set: data.infrastructureType },
        status: { set: data.status },
        vendor: { set: data.vendor },
        version: { set: data.version },
        capacity: { set: data.capacity },
        location: { set: data.location },
        ipAddress: { set: data.ipAddress },
        operatingSystem: { set: data.operatingSystem },
        specifications: { set: data.specifications },
        maintenanceWindow: { set: data.maintenanceWindow },
        costs: { set: data.costs },
        planningDate: { set: data.planningDate },
        introductionDate: { set: data.introductionDate },
        endOfUseDate: { set: data.endOfUseDate },
        endOfLifeDate: { set: data.endOfLifeDate },
      }

      // Parent Infrastructure Update - only update if changed
      const currentParentIds =
        currentInfrastructure.parentInfrastructure?.map(parent => parent.id).sort() || []
      const newParentIds = data.parentInfrastructure?.sort() || []

      if (JSON.stringify(currentParentIds) !== JSON.stringify(newParentIds)) {
        if (newParentIds.length > 0) {
          input.parentInfrastructure = [
            {
              disconnect: [{ where: {} }],
              connect: newParentIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          input.parentInfrastructure = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // Child Infrastructures Update - only update if changed
      const currentChildIds =
        currentInfrastructure.childInfrastructures?.map(child => child.id).sort() || []
      const newChildIds = data.childInfrastructures?.sort() || []

      if (JSON.stringify(currentChildIds) !== JSON.stringify(newChildIds)) {
        if (newChildIds.length > 0) {
          input.childInfrastructures = [
            {
              disconnect: [{ where: {} }],
              connect: newChildIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          input.childInfrastructures = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // Hosted Applications Update - only update if changed
      const currentHostedAppIds =
        currentInfrastructure.hostsApplications?.map(app => app.id).sort() || []
      const newHostedAppIds = data.hostsApplications?.sort() || []

      if (JSON.stringify(currentHostedAppIds) !== JSON.stringify(newHostedAppIds)) {
        if (newHostedAppIds.length > 0) {
          input.hostsApplications = [
            {
              disconnect: [{ where: {} }],
              connect: newHostedAppIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          input.hostsApplications = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // Part of Architectures Update - only update if changed
      const currentArchIds =
        currentInfrastructure.partOfArchitectures?.map(arch => arch.id).sort() || []
      const newArchIds = data.partOfArchitectures?.sort() || []

      if (JSON.stringify(currentArchIds) !== JSON.stringify(newArchIds)) {
        if (newArchIds.length > 0) {
          input.partOfArchitectures = [
            {
              disconnect: [{ where: {} }],
              connect: newArchIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          input.partOfArchitectures = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // DepictedInDiagrams Update - only update if changed
      const currentDepictedInDiagramIds =
        currentInfrastructure.depictedInDiagrams?.map(diag => diag.id).sort() || []
      const newDepictedInDiagramIds = data.depictedInDiagrams?.sort() || []

      if (JSON.stringify(currentDepictedInDiagramIds) !== JSON.stringify(newDepictedInDiagramIds)) {
        if (newDepictedInDiagramIds.length > 0) {
          input.depictedInDiagrams = [
            {
              disconnect: [{ where: {} }],
              connect: newDepictedInDiagramIds.map(id => ({
                where: {
                  node: { id: { eq: id } },
                },
              })),
            },
          ]
        } else {
          input.depictedInDiagrams = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      // Owners Update - only update if changed
      const currentOwnerId = currentInfrastructure.owners?.[0]?.id || ''
      const newOwnerId = data.ownerId || ''

      if (currentOwnerId !== newOwnerId) {
        if (newOwnerId) {
          input.owners = [
            {
              disconnect: [{ where: {} }],
              connect: [{ where: { node: { id: { eq: newOwnerId } } } }],
            },
          ]
        } else {
          input.owners = [
            {
              disconnect: [{ where: {} }],
            },
          ]
        }
      }

      await updateInfrastructure({
        variables: {
          where: { id: { eq: id } },
          update: input,
        },
      })
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Infrastruktur:', error)
    }
  }

  // Handler für das Löschen einer Infrastruktur
  const handleDeleteInfrastructure = async (id: string) => {
    try {
      await deleteInfrastructure({
        variables: { where: { id: { eq: id } } },
      })
    } catch (error) {
      console.error('Fehler beim Löschen der Infrastruktur:', error)
    }
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Infrastrukturen
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateInfrastructure}
          >
            Neu erstellen
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <InfrastructureToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setIsFilterDialogOpen(true)}
          onResetFilters={handleResetFilters}
          table={tableInstance}
          enableColumnVisibilityToggle={true}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <InfrastructureTable
            infrastructures={filteredInfrastructures}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateInfrastructure={handleCreateInfrastructureSubmit}
            onUpdateInfrastructure={handleUpdateInfrastructureSubmit}
            onDeleteInfrastructure={handleDeleteInfrastructure}
            onTableReady={setTableInstance}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </Paper>
      </Card>

      {isFilterDialogOpen && (
        <InfrastructureFilterDialog
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={handleResetFilters}
          filterOptions={filterOptions}
        />
      )}

      {/* Formular für neue Infrastruktur */}
      {showNewInfrastructureForm && (
        <InfrastructureForm
          isOpen={showNewInfrastructureForm}
          onClose={() => setShowNewInfrastructureForm(false)}
          onSubmit={handleCreateInfrastructureSubmit}
          mode="create"
          loading={false}
        />
      )}
    </Box>
  )
}

export default InfrastructurePage
