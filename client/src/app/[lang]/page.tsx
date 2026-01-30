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
  AIComponentIcon,
  ApplicationInterfaceIcon,
  BusinessObjectIcon,
  InfrastructureIcon,
} from '@/components/icons'
import { useQuery } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useAuth, login } from '@/lib/auth'
import { GET_CAPABILITIES_COUNT } from '@/graphql/capability'
import { GET_APPLICATIONS_COUNT } from '@/graphql/application'
import { GET_AICOMPONENTS_COUNT } from '@/graphql/aicomponent'
import { GET_DATA_OBJECTS_COUNT } from '@/graphql/dataObject'
import { GET_ARCHITECTURES_COUNT } from '@/graphql/architecture'
import { GET_DIAGRAMS_COUNT } from '@/graphql/diagram'
import { GET_APPLICATION_INTERFACES_COUNT } from '@/graphql/applicationInterface'
import { GET_INFRASTRUCTURES_COUNT } from '@/graphql/infrastructure'
import { GET_PERSONS_COUNT } from '@/graphql/person'
import { GET_ARCHITECTURE_PRINCIPLES_COUNT } from '@/graphql/architecturePrinciple'
import RecentDiagramsSection from '@/components/dashboard/RecentDiagramsSection'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'

const Dashboard = () => {
  const { authenticated, initialized } = useAuth()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')

  // Company-Filter für alle Architektur-Elemente
  const capWhere = useCompanyWhere('company')
  const appWhere = capWhere
  const dataWhere = capWhere
  const archWhere = capWhere
  const diagWhere = capWhere
  const personsWhere = useCompanyWhere('companies') // Person type uses 'companies' (plural)

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    // Only execute when Keycloak is fully initialized
    if (initialized && authenticated === false) {
      login()
    }
  }, [authenticated, initialized])

  // Daten für Dashboard laden
  const {
    data: capabilitiesData,
    loading: capabilitiesLoading,
    error: capabilitiesError,
  } = useQuery(GET_CAPABILITIES_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: capWhere },
  })

  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
  } = useQuery(GET_APPLICATIONS_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: appWhere },
  })

  const {
    data: aiComponentsData,
    loading: aiComponentsLoading,
    error: aiComponentsError,
  } = useQuery(GET_AICOMPONENTS_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: appWhere },
  })

  const {
    data: dataObjectsData,
    loading: dataObjectsLoading,
    error: dataObjectsError,
  } = useQuery(GET_DATA_OBJECTS_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: dataWhere },
  })

  const {
    data: architecturesData,
    loading: architecturesLoading,
    error: architecturesError,
  } = useQuery(GET_ARCHITECTURES_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: archWhere },
  })

  const {
    data: diagramsData,
    loading: diagramsLoading,
    error: diagramsError,
  } = useQuery(GET_DIAGRAMS_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: diagWhere },
  })

  const {
    data: interfacesData,
    loading: interfacesLoading,
    error: interfacesError,
  } = useQuery(GET_APPLICATION_INTERFACES_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: capWhere },
  })

  const {
    data: personsData,
    loading: personsLoading,
    error: personsError,
  } = useQuery(GET_PERSONS_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: personsWhere },
  })

  const {
    data: principlesData,
    loading: principlesLoading,
    error: principlesError,
  } = useQuery(GET_ARCHITECTURE_PRINCIPLES_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: capWhere },
  })

  const {
    data: infrastructuresData,
    loading: infrastructuresLoading,
    error: infrastructuresError,
  } = useQuery(GET_INFRASTRUCTURES_COUNT, {
    skip: !authenticated || !initialized,
    variables: { where: capWhere },
  })

  // Error handling
  useEffect(() => {
    if (capabilitiesError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (applicationsError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (aiComponentsError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (dataObjectsError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (architecturesError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (diagramsError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (interfacesError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (personsError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (principlesError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
    if (infrastructuresError) {
      enqueueSnackbar(tCommon('error'), { variant: 'error' })
    }
  }, [
    capabilitiesError,
    applicationsError,
    aiComponentsError,
    dataObjectsError,
    architecturesError,
    diagramsError,
    interfacesError,
    personsError,
    principlesError,
    infrastructuresError,
    enqueueSnackbar,
    tCommon,
  ])

  // Anzahl der Elemente - angepasst für die neue Datenstruktur
  const capabilitiesCount =
    capabilitiesData?.businessCapabilitiesConnection?.aggregate?.count?.nodes || 0
  const applicationsCount = applicationsData?.applicationsConnection?.aggregate?.count?.nodes || 0
  const aiComponentsCount = aiComponentsData?.aiComponents?.length || 0
  const dataObjectsCount = dataObjectsData?.dataObjectsConnection?.aggregate?.count?.nodes || 0
  const architecturesCount =
    architecturesData?.architecturesConnection?.aggregate?.count?.nodes || 0
  const diagramsCount = diagramsData?.diagramsConnection?.aggregate?.count?.nodes || 0
  const interfacesCount =
    interfacesData?.applicationInterfacesConnection?.aggregate?.count?.nodes || 0
  const personsCount = personsData?.peopleConnection?.aggregate?.count?.nodes || 0
  const principlesCount =
    principlesData?.architecturePrinciplesConnection?.aggregate?.count?.nodes || 0
  const infrastructuresCount =
    infrastructuresData?.infrastructuresConnection?.aggregate?.count?.nodes || 0

  const totalCount =
    capabilitiesCount +
    applicationsCount +
    aiComponentsCount +
    dataObjectsCount +
    interfacesCount +
    infrastructuresCount

  const isLoading =
    capabilitiesLoading ||
    applicationsLoading ||
    aiComponentsLoading ||
    dataObjectsLoading ||
    architecturesLoading ||
    diagramsLoading ||
    interfacesLoading ||
    personsLoading ||
    principlesLoading ||
    infrastructuresLoading

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'capability':
        return <BusinessCapabilityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      case 'application':
        return (
          <ApplicationComponentIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
        )
      case 'aiComponent':
        return <AIComponentIcon sx={{ fontSize: 40, color: theme.palette.secondary.dark }} />
      case 'dataObject':
        return <BusinessObjectIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
      case 'interface':
        return <ApplicationInterfaceIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
      case 'infrastructure':
        return <InfrastructureIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
      case 'architecture':
        return <ArchitectureIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
      case 'diagram':
        return <DiagramIcon sx={{ fontSize: 40, color: theme.palette.text.primary }} />
      case 'person':
        return <PersonIcon sx={{ fontSize: 40, color: theme.palette.grey[800] }} />
      case 'principle':
        return <PrincipleIcon sx={{ fontSize: 40, color: theme.palette.grey[600] }} />
      default:
        return <ConstructionIcon sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
    }
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('title')}
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
                  {t('businessCapabilities')}
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
                  {t('applications')}
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
                  {t('aiComponents')}
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : aiComponentsCount}</Typography>
              </Box>
              {getCardIcon('aiComponent')}
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
                  {t('dataObjects')}
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
                  {t('interfaces')}
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : interfacesCount}</Typography>
              </Box>
              {getCardIcon('interface')}
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
                  {t('infrastructure')}
                </Typography>
                <Typography variant="h4">{isLoading ? '...' : infrastructuresCount}</Typography>
              </Box>
              {getCardIcon('infrastructure')}
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
                  {t('architectures')}
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
                  {t('architecturePrinciples')}
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
                  {t('diagrams')}
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
                  {t('persons')}
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
        <CardHeader title={t('architectureLandscape')} />
        <Divider />
        <CardContent>
          <Typography variant="body1" paragraph>
            {t('overview')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('totalElements', {
              count: totalCount,
              capabilitiesCount,
              applicationsCount,
              aiComponentsCount,
              dataObjectsCount,
              interfacesCount,
              infrastructuresCount,
              architecturesCount,
              principlesCount,
              diagramsCount,
              personsCount,
            })}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {t('navigationHint')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
