'use client'

import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from '@mui/material'
import {
  Architecture as ArchitectureIcon,
  AccountTree as DiagramIcon,
  Person as PersonIcon,
  Construction as ConstructionIcon,
  Rule as PrincipleIcon,
} from '@mui/icons-material'
import {
  BusinessCapabilityIcon,
  ApplicationComponentIcon,
  ApplicationInterfaceIcon,
  BusinessObjectIcon,
} from '@/components/icons'
import { useQuery } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useAuth, login } from '@/lib/auth'
import { GET_CAPABILITIES_COUNT } from '@/graphql/capability'
import { GET_APPLICATIONS_COUNT } from '@/graphql/application'
import { GET_DATA_OBJECTS_COUNT } from '@/graphql/dataObject'
import { GET_ARCHITECTURES_COUNT } from '@/graphql/architecture'
import { GET_DIAGRAMS_COUNT } from '@/graphql/diagram'
import { GET_APPLICATION_INTERFACES_COUNT } from '@/graphql/applicationInterface'
import { GET_PERSONS_COUNT } from '@/graphql/person'
import { GET_ARCHITECTURE_PRINCIPLES_COUNT } from '@/graphql/architecturePrinciple'
import RecentDiagramsSection from '@/components/dashboard/RecentDiagramsSection'

const Dashboard = () => {
  const { authenticated, initialized } = useAuth()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    // Nur ausführen, wenn Keycloak fertig initialisiert ist
    if (initialized && authenticated === false) {
      login()
    }
  }, [authenticated, initialized])

  // Daten für Dashboard laden
  const {
    data: capabilitiesData,
    loading: capabilitiesLoading,
    error: capabilitiesError,
  } = useQuery(GET_CAPABILITIES_COUNT, { skip: !authenticated })

  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
  } = useQuery(GET_APPLICATIONS_COUNT, { skip: !authenticated })

  const {
    data: dataObjectsData,
    loading: dataObjectsLoading,
    error: dataObjectsError,
  } = useQuery(GET_DATA_OBJECTS_COUNT, { skip: !authenticated })

  const {
    data: architecturesData,
    loading: architecturesLoading,
    error: architecturesError,
  } = useQuery(GET_ARCHITECTURES_COUNT, { skip: !authenticated })

  const {
    data: diagramsData,
    loading: diagramsLoading,
    error: diagramsError,
  } = useQuery(GET_DIAGRAMS_COUNT, { skip: !authenticated })

  const {
    data: interfacesData,
    loading: interfacesLoading,
    error: interfacesError,
  } = useQuery(GET_APPLICATION_INTERFACES_COUNT, { skip: !authenticated })

  const {
    data: personsData,
    loading: personsLoading,
    error: personsError,
  } = useQuery(GET_PERSONS_COUNT, { skip: !authenticated })

  const {
    data: principlesData,
    loading: principlesLoading,
    error: principlesError,
  } = useQuery(GET_ARCHITECTURE_PRINCIPLES_COUNT, { skip: !authenticated })

  // Fehlerbehandlung
  useEffect(() => {
    if (capabilitiesError) {
      enqueueSnackbar('Fehler beim Laden der Business Capabilities', { variant: 'error' })
    }
    if (applicationsError) {
      enqueueSnackbar('Fehler beim Laden der Applikationen', { variant: 'error' })
    }
    if (dataObjectsError) {
      enqueueSnackbar('Fehler beim Laden der Datenobjekte', { variant: 'error' })
    }
    if (architecturesError) {
      enqueueSnackbar('Fehler beim Laden der Architekturen', { variant: 'error' })
    }
    if (diagramsError) {
      enqueueSnackbar('Fehler beim Laden der Diagramme', { variant: 'error' })
    }
    if (interfacesError) {
      enqueueSnackbar('Fehler beim Laden der Schnittstellen', { variant: 'error' })
    }
    if (personsError) {
      enqueueSnackbar('Fehler beim Laden der Personen', { variant: 'error' })
    }
    if (principlesError) {
      enqueueSnackbar('Fehler beim Laden der Architekturprinzipien', { variant: 'error' })
    }
  }, [
    capabilitiesError,
    applicationsError,
    dataObjectsError,
    architecturesError,
    diagramsError,
    interfacesError,
    personsError,
    principlesError,
    enqueueSnackbar,
  ])

  // Anzahl der Elemente - angepasst für die neue Datenstruktur
  const capabilitiesCount =
    capabilitiesData?.businessCapabilitiesConnection?.aggregate?.count?.nodes || 0
  const applicationsCount = applicationsData?.applicationsConnection?.aggregate?.count?.nodes || 0
  const dataObjectsCount = dataObjectsData?.dataObjectsConnection?.aggregate?.count?.nodes || 0
  const architecturesCount =
    architecturesData?.architecturesConnection?.aggregate?.count?.nodes || 0
  const diagramsCount = diagramsData?.diagramsConnection?.aggregate?.count?.nodes || 0
  const interfacesCount =
    interfacesData?.applicationInterfacesConnection?.aggregate?.count?.nodes || 0
  const personsCount = personsData?.peopleConnection?.aggregate?.count?.nodes || 0
  const principlesCount =
    principlesData?.architecturePrinciplesConnection?.aggregate?.count?.nodes || 0

  const totalCount = capabilitiesCount + applicationsCount + dataObjectsCount + interfacesCount

  const isLoading =
    capabilitiesLoading ||
    applicationsLoading ||
    dataObjectsLoading ||
    architecturesLoading ||
    diagramsLoading ||
    interfacesLoading ||
    personsLoading ||
    principlesLoading

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'capability':
        return <BusinessCapabilityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      case 'application':
        return (
          <ApplicationComponentIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
        )
      case 'dataObject':
        return <BusinessObjectIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
      case 'architecture':
        return <ArchitectureIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
      case 'diagram':
        return <DiagramIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
      case 'interface':
        return <ApplicationInterfaceIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
      case 'person':
        return <PersonIcon sx={{ fontSize: 40, color: theme.palette.grey[800] }} />
      case 'principle':
        return <PrincipleIcon sx={{ fontSize: 40, color: theme.palette.text.primary }} />
      default:
        return <ConstructionIcon sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
    }
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Architekturelemente */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Business Capabilities
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : capabilitiesCount}</Typography>
              </Box>
              {getCardIcon('capability')}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Applikationen
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : applicationsCount}</Typography>
              </Box>
              {getCardIcon('application')}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Datenobjekte
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : dataObjectsCount}</Typography>
              </Box>
              {getCardIcon('dataObject')}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Schnittstellen
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : interfacesCount}</Typography>
              </Box>
              {getCardIcon('interface')}
            </CardContent>
          </Card>
        </Grid>

        {/* Nicht-Architekturelemente */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Architekturen
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : architecturesCount}</Typography>
              </Box>
              {getCardIcon('architecture')}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Architektur Prinzipien
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : principlesCount}</Typography>
              </Box>
              {getCardIcon('principle')}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Diagramme
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : diagramsCount}</Typography>
              </Box>
              {getCardIcon('diagram')}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Personen
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : personsCount}</Typography>
              </Box>
              {getCardIcon('person')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Letzte Diagramme */}
      <RecentDiagramsSection />

      <Card sx={{ mt: 4 }}>
        <CardHeader title="Architekturlandschaft" />
        <Divider />
        <CardContent>
          <Typography variant="body1" paragraph>
            Die Enterprise-Architektur-Management-Plattform zeigt Ihnen einen Überblick über die
            vollständige IT-Landschaft.
          </Typography>
          <Typography variant="body1" paragraph>
            Es wurden insgesamt <strong>{totalCount}</strong> Architekturelemente (Business
            Capabilities, Applikationen, Schnittstellen und Datenobjekte) erfasst. Darüber hinaus
            gibt es {architecturesCount} Architekturen, {principlesCount} Architektur Prinzipien,
            {diagramsCount} Diagramme und {personsCount} Personen.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Verwenden Sie die Navigation auf der linken Seite, um detaillierte Informationen zu
              den einzelnen Architekturkomponenten zu erhalten.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
