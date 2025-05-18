'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, login, isArchitect } from '@/lib/auth'
import {
  GET_APPLICATIONS,
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  DELETE_APPLICATION,
} from '@/graphql/application'
import { ApplicationStatus, CriticalityLevel, Application } from '@/gql/generated'
import ApplicationForm, { ApplicationFormValues } from '@/components/applications/ApplicationForm'

// Importiere die ausgelagerten Komponenten
import ApplicationTable from '@/components/applications/ApplicationTable'
import ApplicationToolbar from '@/components/applications/ApplicationToolbar'
import ApplicationFilterDialog from '@/components/applications/ApplicationFilterDialog'
import { useApplicationFilter } from '@/components/applications/useApplicationFilter'
import { ApplicationType, FilterState } from '@/components/applications/types'

const ApplicationsPage = () => {
  const { authenticated } = useAuth()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Filter-Zustand
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    statusFilter: [] as ApplicationStatus[],
    criticalityFilter: [] as CriticalityLevel[],
    costRangeFilter: [0, 1000000],
    technologyStackFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
    vendorFilter: '',
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Liste der verfügbaren Status, Kritikalitäten und Technology Stack aus den Daten extrahieren
  const [availableStatuses, setAvailableStatuses] = useState<ApplicationStatus[]>([])
  const [availableCriticalities, setAvailableCriticalities] = useState<CriticalityLevel[]>([])
  const [availableTechStack, setAvailableTechStack] = useState<string[]>([])
  const [availableVendors, setAvailableVendors] = useState<string[]>([])

  // State für das neue Application-Formular
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false)

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  // Applikationen laden
  const { loading, error, data, refetch } = useQuery(GET_APPLICATIONS, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  })

  // Verfügbare Werte aus den geladenen Daten extrahieren
  useEffect(() => {
    if (data?.applications?.length) {
      const applications = data.applications as ApplicationType[]

      // Alle Status extrahieren und Duplikate entfernen
      const allStatuses: ApplicationStatus[] = applications
        .map((app: ApplicationType) => app.status)
        .filter(Boolean) as ApplicationStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Alle Kritikalitäten extrahieren und Duplikate entfernen
      const allCriticalities: CriticalityLevel[] = applications
        .map((app: ApplicationType) => app.criticality)
        .filter(Boolean) as CriticalityLevel[]

      const uniqueCriticalities = Array.from(new Set(allCriticalities)).sort()
      setAvailableCriticalities(uniqueCriticalities)

      // Alle Technology Stack Tags sammeln und Duplikate entfernen
      const allTechTags: string[] = []
      applications.forEach((app: ApplicationType) => {
        if (app.technologyStack && Array.isArray(app.technologyStack)) {
          allTechTags.push(...app.technologyStack)
        }
      })

      const uniqueTechTags = Array.from(new Set(allTechTags)).sort()
      setAvailableTechStack(uniqueTechTags)

      // Alle Vendors sammeln und Duplikate entfernen
      const allVendors: string[] = applications
        .map((app: ApplicationType) => app.vendor)
        .filter(Boolean) as string[]

      const uniqueVendors = Array.from(new Set(allVendors)).sort()
      setAvailableVendors(uniqueVendors)
    }
  }, [data])

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Fehler beim Laden der Applikationen', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const applications = data?.applications || []

  // Filter auf Applikationen anwenden
  const filteredData = useApplicationFilter({ applications, filterState })

  // Mutation zum Erstellen einer neuen Applikation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createApplication, { loading: isCreating }] = useMutation(CREATE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar('Applikation erfolgreich erstellt', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen der Applikation: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Aktualisieren einer bestehenden Applikation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading: isUpdating }] = useMutation(UPDATE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar('Applikation erfolgreich aktualisiert', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Aktualisieren der Applikation: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Löschen einer Applikation
  const [deleteApplication] = useMutation(DELETE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar('Applikation erfolgreich gelöscht', { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Löschen der Applikation: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Handler für das Erstellen einer neuen Applikation
  const handleCreateApplicationSubmit = async (data: ApplicationFormValues) => {
    const {
      ownerId,
      supportsCapabilityIds,
      usesDataObjectIds,
      interfacesToApplicationIds,
      ...applicationData
    } = data
    // Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind
    const input = {
      name: applicationData.name,
      description: applicationData.description,
      status: applicationData.status,
      criticality: applicationData.criticality,
      costs: applicationData.costs,
      vendor: applicationData.vendor,
      version: applicationData.version,
      hostingEnvironment: applicationData.hostingEnvironment,
      technologyStack: applicationData.technologyStack,
      introductionDate: applicationData.introductionDate,
      endOfLifeDate: applicationData.endOfLifeDate,
      // Wenn ein Besitzer ausgewählt wurde, verwenden wir die neue owners-Struktur
      ...(ownerId
        ? {
            owners: {
              connect: [{ where: { node: { id: { eq: ownerId } } } }],
            },
          }
        : {}),
      // Wenn Capabilities ausgewählt wurden, verbinden wir sie mit der Applikation
      ...(supportsCapabilityIds && supportsCapabilityIds.length > 0
        ? {
            supportsCapabilities: {
              connect: supportsCapabilityIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Datenobjekte ausgewählt wurden, verbinden wir sie mit der Applikation
      ...(usesDataObjectIds && usesDataObjectIds.length > 0
        ? {
            usesDataObjects: {
              connect: usesDataObjectIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Schnittstellen ausgewählt wurden, verbinden wir sie mit der Applikation
      ...(interfacesToApplicationIds && interfacesToApplicationIds.length > 0
        ? {
            interfacesToApplications: {
              connect: interfacesToApplicationIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
    }

    await createApplication({
      variables: { input: [input] },
    })

    // Formular nach dem Erstellen schließen
    setShowNewApplicationForm(false)
  }

  // Handler für das Aktualisieren einer bestehenden Applikation
  const handleUpdateApplicationSubmit = async (id: string, data: ApplicationFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      ownerId,
      supportsCapabilityIds,
      usesDataObjectIds,
      interfacesToApplicationIds,
      ...applicationData
    } = data

    // Basis-Input-Daten vorbereiten
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: Record<string, any> = {
      name: { set: applicationData.name },
      description: { set: applicationData.description },
      status: { set: applicationData.status },
      criticality: { set: applicationData.criticality },
      costs: { set: applicationData.costs },
      vendor: { set: applicationData.vendor },
      version: { set: applicationData.version },
      hostingEnvironment: { set: applicationData.hostingEnvironment },
      technologyStack: { set: applicationData.technologyStack },
      introductionDate: { set: applicationData.introductionDate },
      endOfLifeDate: { set: applicationData.endOfLifeDate },
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
                id: { eq: ownerId }, // ID muss als IdScalarFilters-Objekt übergeben werden
              },
            },
          },
        ], // Verbinde mit dem neuen Besitzer
      }
    } else {
      // Wenn kein Besitzer ausgewählt wurde, entfernen wir alle Besitzer
      input.owners = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Capability-Beziehungen
    if (supportsCapabilityIds && supportsCapabilityIds.length > 0) {
      // Wir setzen die supportsCapabilities-Beziehung
      input.supportsCapabilities = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: supportsCapabilityIds.map(capId => ({
          where: {
            node: {
              id: { eq: capId }, // ID muss als IdScalarFilters-Objekt übergeben werden
            },
          },
        })), // Verbinde mit den neuen Capabilities
      }
    } else {
      // Wenn keine Capabilities ausgewählt wurden, entfernen wir alle Verbindungen
      input.supportsCapabilities = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der DataObject-Beziehungen
    if (usesDataObjectIds && usesDataObjectIds.length > 0) {
      // Wir setzen die usesDataObjects-Beziehung
      input.usesDataObjects = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: usesDataObjectIds.map(doId => ({
          where: {
            node: {
              id: { eq: doId }, // ID muss als IdScalarFilters-Objekt übergeben werden
            },
          },
        })), // Verbinde mit den neuen DataObjects
      }
    } else {
      // Wenn keine DataObjects ausgewählt wurden, entfernen wir alle Verbindungen
      input.usesDataObjects = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der ApplicationInterface-Beziehungen
    if (interfacesToApplicationIds && interfacesToApplicationIds.length > 0) {
      // Wir setzen die interfacesToApplications-Beziehung
      input.interfacesToApplications = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: interfacesToApplicationIds.map(intfId => ({
          where: {
            node: {
              id: { eq: intfId }, // ID muss als IdScalarFilters-Objekt übergeben werden
            },
          },
        })), // Verbinde mit den neuen Interfaces
      }
    } else {
      // Wenn keine Interfaces ausgewählt wurden, entfernen wir alle Verbindungen
      input.interfacesToApplications = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    await updateApplication({
      variables: { id, input },
    })
  }

  // Neue Applikation erstellen
  const handleCreateApplication = () => {
    // Hier fügen wir direkt die Logik für das Erstellen einer neuen Applikation ein,
    // anstatt einen versteckten Button zu verwenden
    setShowNewApplicationForm(true)
  }

  // Applikation löschen
  const handleDeleteApplication = async (id: string) => {
    await deleteApplication({
      variables: { id },
    })
    // Formular nach dem Löschen schließen
    // Automatisches Schließen erfolgt durch die ApplicationForm selbst
  }

  // Applikation Details anzeigen
  const handleViewApplication = (id: string) => {
    router.push(`/applications/${id}`)
  }

  // Applikation bearbeiten
  const handleEditApplication = (id: string) => {
    router.push(`/applications/edit/${id}`)
  }

  // Filter-Handler
  const handleFilterChange = (newFilterValues: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilterValues }))
  }

  // Filter zurücksetzen
  const handleResetFilter = () => {
    setFilterState({
      statusFilter: [],
      criticalityFilter: [],
      costRangeFilter: [0, 1000000],
      technologyStackFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
      vendorFilter: '',
    })
    setActiveFiltersCount(0)
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Applikationen
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateApplication}
          >
            Neu erstellen
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <ApplicationToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterClick={() => setFilterOpen(true)}
          onResetFilters={handleResetFilter}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <ApplicationTable
            id="application-table"
            applications={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onRowClick={handleViewApplication}
            onEditClick={handleEditApplication}
            onCreateApplication={handleCreateApplicationSubmit}
            onUpdateApplication={handleUpdateApplicationSubmit}
            onDeleteApplication={handleDeleteApplication}
            availableTechStack={availableTechStack}
          />
        </Paper>
      </Card>

      {filterOpen && (
        <ApplicationFilterDialog
          filterState={filterState}
          availableStatuses={availableStatuses}
          availableCriticalities={availableCriticalities}
          availableTechStack={availableTechStack}
          availableVendors={availableVendors}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
          onClose={() => setFilterOpen(false)}
          onApply={count => {
            setActiveFiltersCount(count)
            setFilterOpen(false)
          }}
        />
      )}

      {/* Formular für neue Applikation */}
      {showNewApplicationForm && (
        <ApplicationForm
          isOpen={showNewApplicationForm}
          onClose={() => setShowNewApplicationForm(false)}
          onSubmit={handleCreateApplicationSubmit}
          mode="create"
          availableApplications={applications as unknown as Application[]}
          availableTechStack={availableTechStack}
          application={
            {
              id: '',
              name: '',
              description: '',
              status: ApplicationStatus.ACTIVE,
              criticality: CriticalityLevel.MEDIUM,
              costs: null,
              vendor: '',
              version: '',
              hostingEnvironment: '',
              technologyStack: [],
              introductionDate: null,
              endOfLifeDate: null,
              owners: [],
              createdAt: new Date().toISOString(),
              updatedAt: null,
              supportsCapabilities: [],
              usesDataObjects: [],
              interfacesToApplications: [],
              partOfArchitectures: [],
              __typename: 'Application',
            } as unknown as Application
          }
        />
      )}
    </Box>
  )
}

export default ApplicationsPage
