'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Button, Card, Paper } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { isArchitect } from '@/lib/auth'
import usePersistentColumnVisibility from '@/hooks/usePersistentColumnVisibility'

import {
  GET_APPLICATIONS,
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  DELETE_APPLICATION,
} from '@/graphql/application'
import {
  ApplicationStatus,
  CriticalityLevel,
  TimeCategory,
  SevenRStrategy,
  Application,
} from '@/gql/generated'
import ApplicationForm, { ApplicationFormValues } from '@/components/applications/ApplicationForm'

// Importiere die ausgelagerten Komponenten
import ApplicationTable, {
  APPLICATION_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/applications/ApplicationTable'
import ApplicationToolbar from '@/components/applications/ApplicationToolbar'
import ApplicationFilterDialog from '@/components/applications/ApplicationFilterDialog'
import { useApplicationFilter } from '@/components/applications/useApplicationFilter'
import { ApplicationType, FilterState } from '@/components/applications/types'

const ApplicationsPage = () => {
  const t = useTranslations('applications')
  const { enqueueSnackbar } = useSnackbar()
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }])

  // Table instance for column visibility
  const [tableInstance, setTableInstance] = useState<any>(null)

  // Verwende persistente Spaltensichtbarkeit mit den korrekten Default-Werten
  const {
    columnVisibility,
    onTableReady: persistentOnTableReady,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    resetColumnVisibility,
  } = usePersistentColumnVisibility({
    tableKey: 'applications',
    defaultColumnVisibility: {
      name: true,
      status: true,
      criticality: true,
      timeCategory: true,
      sevenRStrategy: true,
      vendor: true,
      version: true,
      owners: true,
      supportsCapabilities: true,
      usesDataObjects: true,
      costs: true,
      hostedOn: false, // Als versteckte Spalte standardmäßig ausgeblendet
      createdAt: true,
      updatedAt: true,
      actions: true,
    },
  })

  // Kombiniere externe und persistente onTableReady Callbacks
  const handleTableReady = (table: any) => {
    persistentOnTableReady(table)
    setTableInstance(table)
  }

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
    timeCategoryFilter: [] as TimeCategory[],
    sevenRStrategyFilter: [] as SevenRStrategy[],
    hostedOnFilter: [] as string[],
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0)

  // Liste der verfügbaren Status, Kritikalitäten und Technology Stack aus den Daten extrahieren
  const [availableStatuses, setAvailableStatuses] = useState<ApplicationStatus[]>([])
  const [availableCriticalities, setAvailableCriticalities] = useState<CriticalityLevel[]>([])
  const [availableTechStack, setAvailableTechStack] = useState<string[]>([])
  const [availableVendors, setAvailableVendors] = useState<string[]>([])
  const [availableTimeCategories, setAvailableTimeCategories] = useState<TimeCategory[]>([])
  const [availableSevenRStrategies, setAvailableSevenRStrategies] = useState<SevenRStrategy[]>([])
  const [availableInfrastructures, setAvailableInfrastructures] = useState<string[]>([])

  // State für das neue Application-Formular
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false)

  // Applikationen laden - Auth-Check erfolgt bereits in layout.tsx
  const { loading, error, data, refetch } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  // Verfügbare Werte aus den geladenen Daten extrahieren
  const applications = useMemo(() => data?.applications || [], [data?.applications])

  useEffect(() => {
    if (applications.length) {
      const applicationsData = applications as ApplicationType[]

      // Alle Status extrahieren und Duplikate entfernen
      const allStatuses: ApplicationStatus[] = applicationsData
        .map((app: ApplicationType) => app.status)
        .filter(Boolean) as ApplicationStatus[]

      const uniqueStatuses = Array.from(new Set(allStatuses)).sort()
      setAvailableStatuses(uniqueStatuses)

      // Alle Kritikalitäten extrahieren und Duplikate entfernen
      const allCriticalities: CriticalityLevel[] = applicationsData
        .map((app: ApplicationType) => app.criticality)
        .filter(Boolean) as CriticalityLevel[]

      const uniqueCriticalities = Array.from(new Set(allCriticalities)).sort()
      setAvailableCriticalities(uniqueCriticalities)

      // Alle Technology Stack Tags sammeln und Duplikate entfernen
      const allTechTags: string[] = []
      applicationsData.forEach((app: ApplicationType) => {
        if (app.technologyStack && Array.isArray(app.technologyStack)) {
          allTechTags.push(...app.technologyStack)
        }
      })

      const uniqueTechTags = Array.from(new Set(allTechTags)).sort()
      setAvailableTechStack(uniqueTechTags)

      // Alle Vendors sammeln und Duplikate entfernen
      const allVendors: string[] = applicationsData
        .map((app: ApplicationType) => app.vendor)
        .filter(Boolean) as string[]

      const uniqueVendors = Array.from(new Set(allVendors)).sort()
      setAvailableVendors(uniqueVendors)

      // Alle TIME-Kategorien extrahieren und Duplikate entfernen
      const allTimeCategories: TimeCategory[] = applicationsData
        .map((app: ApplicationType) => app.timeCategory)
        .filter(Boolean) as TimeCategory[]

      const uniqueTimeCategories = Array.from(new Set(allTimeCategories)).sort()
      setAvailableTimeCategories(uniqueTimeCategories)

      // Alle 7R-Strategien extrahieren und Duplikate entfernen
      const allSevenRStrategies: SevenRStrategy[] = applicationsData
        .map((app: ApplicationType) => app.sevenRStrategy)
        .filter(Boolean) as SevenRStrategy[]

      const uniqueSevenRStrategies = Array.from(new Set(allSevenRStrategies)).sort()
      setAvailableSevenRStrategies(uniqueSevenRStrategies)

      // Alle Infrastrukturen extrahieren und Duplikate entfernen
      const allInfrastructures: string[] = []
      applicationsData.forEach((app: ApplicationType) => {
        if (app.hostedOn && Array.isArray(app.hostedOn)) {
          allInfrastructures.push(...app.hostedOn.map(infra => infra.name))
        }
      })

      const uniqueInfrastructures = Array.from(new Set(allInfrastructures)).sort()
      setAvailableInfrastructures(uniqueInfrastructures)
    }
  }, [applications])

  // Fehlerbehandlung
  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [error, enqueueSnackbar, t])

  // Filter auf Applikationen anwenden
  const filteredData = useApplicationFilter({ applications, filterState })

  // Mutation zum Erstellen einer neuen Applikation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createApplication, { loading: isCreating }] = useMutation(CREATE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.createError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Aktualisieren einer bestehenden Applikation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading: isUpdating }] = useMutation(UPDATE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.updateError')}: ${error.message}`, {
        variant: 'error',
      })
    },
  })

  // Mutation zum Löschen einer Applikation
  const [deleteApplication] = useMutation(DELETE_APPLICATION, {
    onCompleted: () => {
      enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
      refetch()
    },
    onError: error => {
      enqueueSnackbar(`${t('messages.deleteError')}: ${error.message}`, {
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
      sourceOfInterfaceIds,
      targetOfInterfaceIds,
      implementsPrincipleIds,
      parentIds,
      componentIds,
      predecessorIds,
      successorIds,
      hostedOnIds,
      ...applicationData
    } = data
    // Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind
    const input = {
      name: applicationData.name,
      description: applicationData.description,
      status: applicationData.status,
      criticality: applicationData.criticality,
      timeCategory: applicationData.timeCategory,
      sevenRStrategy: applicationData.sevenRStrategy,
      costs: applicationData.costs,
      vendor: applicationData.vendor,
      version: applicationData.version,
      hostingEnvironment: applicationData.hostingEnvironment,
      technologyStack: applicationData.technologyStack,
      planningDate: applicationData.planningDate,
      introductionDate: applicationData.introductionDate,
      endOfUseDate: applicationData.endOfUseDate,
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
      ...(sourceOfInterfaceIds && sourceOfInterfaceIds.length > 0
        ? {
            sourceOfInterfaces: {
              connect: sourceOfInterfaceIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      ...(targetOfInterfaceIds && targetOfInterfaceIds.length > 0
        ? {
            targetOfInterfaces: {
              connect: targetOfInterfaceIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Parent-Applikationen ausgewählt wurden, verbinden wir sie
      ...(parentIds && parentIds.length > 0
        ? {
            parents: {
              connect: parentIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Komponenten ausgewählt wurden, verbinden wir sie
      ...(componentIds && componentIds.length > 0
        ? {
            components: {
              connect: componentIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Vorgänger-Applikationen ausgewählt wurden, verbinden wir sie
      ...(predecessorIds && predecessorIds.length > 0
        ? {
            predecessors: {
              connect: predecessorIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Nachfolger-Applikationen ausgewählt wurden, verbinden wir sie
      ...(successorIds && successorIds.length > 0
        ? {
            successors: {
              connect: successorIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Prinzipien ausgewählt wurden, verbinden wir sie mit der Applikation
      ...(implementsPrincipleIds && implementsPrincipleIds.length > 0
        ? {
            implementsPrinciples: {
              connect: implementsPrincipleIds.map(id => ({
                where: { node: { id: { eq: id } } },
              })),
            },
          }
        : {}),
      // Wenn Infrastructure ausgewählt wurde, verbinden wir sie mit der Applikation
      ...(hostedOnIds && hostedOnIds.length > 0
        ? {
            hostedOn: {
              connect: hostedOnIds.map(id => ({
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
      sourceOfInterfaceIds,
      targetOfInterfaceIds,
      implementsPrincipleIds,
      parentIds,
      componentIds,
      predecessorIds,
      successorIds,
      hostedOnIds,
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
      planningDate: { set: applicationData.planningDate },
      introductionDate: { set: applicationData.introductionDate },
      endOfUseDate: { set: applicationData.endOfUseDate },
      endOfLifeDate: { set: applicationData.endOfLifeDate },
      timeCategory: { set: applicationData.timeCategory },
      sevenRStrategy: { set: applicationData.sevenRStrategy },
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

    // Aktualisierung der Source Interface-Beziehungen
    if (sourceOfInterfaceIds && sourceOfInterfaceIds.length > 0) {
      // Wir setzen die sourceOfInterfaces-Beziehung
      input.sourceOfInterfaces = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: sourceOfInterfaceIds.map(intfId => ({
          where: {
            node: {
              id: { eq: intfId }, // ID muss als IdScalarFilters-Objekt übergeben werden
            },
          },
        })), // Verbinde mit den neuen Interfaces
      }
    } else {
      // Wenn keine Source Interfaces ausgewählt wurden, entfernen wir alle Verbindungen
      input.sourceOfInterfaces = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Target Interface-Beziehungen
    if (targetOfInterfaceIds && targetOfInterfaceIds.length > 0) {
      // Wir setzen die targetOfInterfaces-Beziehung
      input.targetOfInterfaces = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: targetOfInterfaceIds.map(intfId => ({
          where: {
            node: {
              id: { eq: intfId }, // ID muss als IdScalarFilters-Objekt übergeben werden
            },
          },
        })), // Verbinde mit den neuen Interfaces
      }
    } else {
      // Wenn keine Target Interfaces ausgewählt wurden, entfernen wir alle Verbindungen
      input.targetOfInterfaces = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Parent-Application-Beziehungen
    if (parentIds && parentIds.length > 0) {
      input.parents = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: parentIds.map(parentId => ({
          where: {
            node: {
              id: { eq: parentId },
            },
          },
        })),
      }
    } else {
      input.parents = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Component-Application-Beziehungen
    if (componentIds && componentIds.length > 0) {
      input.components = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: componentIds.map(componentId => ({
          where: {
            node: {
              id: { eq: componentId },
            },
          },
        })),
      }
    } else {
      input.components = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Predecessor-Application-Beziehungen
    if (predecessorIds && predecessorIds.length > 0) {
      input.predecessors = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: predecessorIds.map(predecessorId => ({
          where: {
            node: {
              id: { eq: predecessorId },
            },
          },
        })),
      }
    } else {
      input.predecessors = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Successor-Application-Beziehungen
    if (successorIds && successorIds.length > 0) {
      input.successors = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: successorIds.map(successorId => ({
          where: {
            node: {
              id: { eq: successorId },
            },
          },
        })),
      }
    } else {
      input.successors = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Implements-Principles-Beziehungen
    if (implementsPrincipleIds && implementsPrincipleIds.length > 0) {
      input.implementsPrinciples = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: implementsPrincipleIds.map(principleId => ({
          where: {
            node: {
              id: { eq: principleId },
            },
          },
        })),
      }
    } else {
      input.implementsPrinciples = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    // Aktualisierung der Infrastructure-Beziehungen (hostedOn)
    if (hostedOnIds && hostedOnIds.length > 0) {
      input.hostedOn = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
        connect: hostedOnIds.map(infraId => ({
          where: {
            node: {
              id: { eq: infraId },
            },
          },
        })),
      }
    } else {
      input.hostedOn = {
        disconnect: [{ where: {} }], // Trennt alle bestehenden Verbindungen
      }
    }

    await updateApplication({
      variables: { id, input },
    })
  }

  // Neue Applikation erstellen
  const handleCreateApplication = () => {
    // Warten, bis die Daten geladen sind, bevor das Formular geöffnet wird
    if (loading || !data?.applications) {
      enqueueSnackbar('Bitte warten Sie, bis die Daten geladen sind.', { variant: 'info' })
      return
    }
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
      timeCategoryFilter: [],
      sevenRStrategyFilter: [],
      hostedOnFilter: [],
    })
    setActiveFiltersCount(0)
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateApplication}
          >
            {t('addNew')}
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
          table={tableInstance}
          enableColumnVisibilityToggle={true}
          defaultColumnVisibility={APPLICATION_DEFAULT_COLUMN_VISIBILITY}
        />

        <Paper sx={{ overflow: 'hidden' }}>
          <ApplicationTable
            id="application-table"
            applications={filteredData}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onCreateApplication={handleCreateApplicationSubmit}
            onUpdateApplication={handleUpdateApplicationSubmit}
            onDeleteApplication={handleDeleteApplication}
            availableTechStack={availableTechStack}
            availableApplications={applications as unknown as Application[]} // Hinzugefügt
            onTableReady={handleTableReady}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
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
          availableTimeCategories={availableTimeCategories}
          availableSevenRStrategies={availableSevenRStrategies}
          availableInfrastructures={availableInfrastructures}
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
              createdAt: new Date(0).toISOString(), // Fixed timestamp to avoid hydration mismatch
              updatedAt: null,
              supportsCapabilities: [],
              usesDataObjects: [],
              interfacesToApplications: [],
              partOfArchitectures: [],
              implementsPrinciples: [],
              __typename: 'Application',
            } as unknown as Application
          }
          loading={loading || applications.length === 0}
        />
      )}
    </Box>
  )
}

export default ApplicationsPage
