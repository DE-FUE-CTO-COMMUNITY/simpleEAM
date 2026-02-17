'use client'

import React, { useEffect } from 'react'
import {
  ButtonBase,
  Chip,
  Box,
  Tooltip,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Architecture as ArchitectureIcon,
  AccountTree as DiagramIcon,
  Person as PersonIcon,
  Construction as ConstructionIcon,
  Rule as PrincipleIcon,
  Visibility as VisionIcon,
  Flag as MissionIcon,
  Favorite as ValuesIcon,
  TrackChanges as GoalsIcon,
  Insights as StrategiesIcon,
  Lightbulb as LightbulbIcon,
  ModelTraining as ModelTrainingIcon,
  Hub as CollaborationIcon,
  Functions as FunctionIcon,
  AccountTree as ProcessIcon,
  ConnectWithoutContact as InteractionIcon,
  Event as EventIcon,
  MiscellaneousServices as ServiceIcon,
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
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useAuth, login } from '@/lib/auth'
import { useFeatureFlags } from '@/lib/feature-flags'
import { type LensKey, useLensSelection } from '@/lib/lens-settings'
import { useCompanyContext } from '@/contexts/CompanyContext'
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
import { GET_MISSIONS } from '@/graphql/mission'
import { GET_VISIONS } from '@/graphql/vision'
import { GET_VALUES } from '@/graphql/value'
import { GET_GOALS } from '@/graphql/goal'
import { GET_STRATEGIES } from '@/graphql/strategy'
import { GET_BUSINESS_PROCESSES_COUNT } from '@/graphql/businessProcess'
import RecentDiagramsSection from '@/components/dashboard/RecentDiagramsSection'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { calculateGeaTotalScorePercent } from '@/components/matrix-editor/scoreUtils'

const Dashboard = () => {
  const router = useRouter()
  const { authenticated, initialized } = useAuth()
  const { selectedCompany } = useCompanyContext()
  const { featureFlags } = useFeatureFlags()
  const { selectedLens } = useLensSelection()
  const isGeaEnabled = featureFlags.GEA
  const isBmcEnabled = featureFlags.BMC
  const isAbhEnabled = featureFlags.ABH
  const isApsEnabled = featureFlags.APS
  const isAasEnabled = featureFlags.AAS
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')
  const tNavigation = useTranslations('navigation')

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

  const { data: geaMissionsData, loading: geaMissionsLoading } = useQuery(GET_MISSIONS, {
    skip: !authenticated || !initialized || !isGeaEnabled,
    variables: { where: capWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const { data: geaVisionsData, loading: geaVisionsLoading } = useQuery(GET_VISIONS, {
    skip: !authenticated || !initialized || !isGeaEnabled,
    variables: { where: capWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const { data: geaValuesData, loading: geaValuesLoading } = useQuery(GET_VALUES, {
    skip: !authenticated || !initialized || !isGeaEnabled,
    variables: { where: capWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const { data: geaGoalsData, loading: geaGoalsLoading } = useQuery(GET_GOALS, {
    skip: !authenticated || !initialized || !isGeaEnabled,
    variables: { where: capWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const { data: geaStrategiesData, loading: geaStrategiesLoading } = useQuery(GET_STRATEGIES, {
    skip: !authenticated || !initialized || !isGeaEnabled,
    variables: { where: capWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const {
    data: businessProcessesData,
    loading: businessProcessesLoading,
    error: businessProcessesError,
  } = useQuery(GET_BUSINESS_PROCESSES_COUNT, {
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
    if (businessProcessesError) {
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
    businessProcessesError,
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
  const missionsCount = geaMissionsData?.geaMissions?.length || 0
  const visionsCount = geaVisionsData?.geaVisions?.length || 0
  const valuesCount = geaValuesData?.geaValues?.length || 0
  const goalsCount = geaGoalsData?.geaGoals?.length || 0
  const strategiesCount = geaStrategiesData?.geaStrategies?.length || 0
  const businessProcessesCount =
    businessProcessesData?.businessProcessesConnection?.aggregate?.count?.nodes || 0
  const valuePropositionsCount = 0
  const businessCasesCount = 0

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
    infrastructuresLoading ||
    businessProcessesLoading

  const geaScoreLoading =
    isGeaEnabled &&
    (geaMissionsLoading ||
      geaVisionsLoading ||
      geaValuesLoading ||
      geaGoalsLoading ||
      geaStrategiesLoading)

  const geaElementsLoading = geaScoreLoading

  type CardKey =
    | 'businessCapabilities'
    | 'applications'
    | 'aiComponents'
    | 'dataObjects'
    | 'interfaces'
    | 'infrastructure'
    | 'applicationCollaboration'
    | 'applicationFunction'
    | 'applicationProcess'
    | 'applicationInteraction'
    | 'applicationEvent'
    | 'applicationService'
    | 'missions'
    | 'visions'
    | 'values'
    | 'goals'
    | 'strategies'
    | 'businessProcesses'
    | 'valuePropositions'
    | 'businessCases'

  const lensToElementKeys: Record<LensKey, CardKey[]> = {
    enterpriseArchitecture: [
      'businessCapabilities',
      'applications',
      'aiComponents',
      'dataObjects',
      'interfaces',
      'infrastructure',
    ],
    businessArchitecture: [
      ...(isGeaEnabled
        ? (['missions', 'visions', 'values', 'goals', 'strategies'] as CardKey[])
        : []),
      ...(isBmcEnabled ? (['valuePropositions', 'businessCases'] as CardKey[]) : []),
      'businessCapabilities',
    ],
    processArchitecture: ['businessCapabilities', 'businessProcesses'],
    dataArchitecture: ['dataObjects'],
    aiArchitecture: ['aiComponents'],
    solutionArchitecture: [
      'applications',
      ...(isAasEnabled ? (['applicationCollaboration'] as CardKey[]) : []),
      ...(isAbhEnabled
        ? ([
            'applicationFunction',
            'applicationProcess',
            'applicationInteraction',
            'applicationEvent',
            'applicationService',
          ] as CardKey[])
        : []),
      ...(isApsEnabled ? (['dataObjects'] as CardKey[]) : []),
      'interfaces',
    ],
    infrastructureArchitecture: ['applications', 'infrastructure'],
    transformationArchitecture: [
      'businessCapabilities',
      'applications',
      'aiComponents',
      'dataObjects',
      'interfaces',
      'infrastructure',
    ],
    technologyManagement: ['applications', 'infrastructure'],
  }

  const cardDefinitions: Record<
    CardKey,
    {
      label: string
      count: number
      iconType: string
      loading: boolean
    }
  > = {
    businessCapabilities: {
      label: t('businessCapabilities'),
      count: capabilitiesCount,
      iconType: 'capability',
      loading: isLoading,
    },
    applications: {
      label: t('applications'),
      count: applicationsCount,
      iconType: 'application',
      loading: isLoading,
    },
    aiComponents: {
      label: t('aiComponents'),
      count: aiComponentsCount,
      iconType: 'aiComponent',
      loading: isLoading,
    },
    dataObjects: {
      label: t('dataObjects'),
      count: dataObjectsCount,
      iconType: 'dataObject',
      loading: isLoading,
    },
    interfaces: {
      label: t('interfaces'),
      count: interfacesCount,
      iconType: 'interface',
      loading: isLoading,
    },
    infrastructure: {
      label: t('infrastructure'),
      count: infrastructuresCount,
      iconType: 'infrastructure',
      loading: isLoading,
    },
    applicationCollaboration: {
      label: tNavigation('applicationCollaboration'),
      count: 0,
      iconType: 'applicationCollaboration',
      loading: false,
    },
    applicationFunction: {
      label: tNavigation('applicationFunction'),
      count: 0,
      iconType: 'applicationFunction',
      loading: false,
    },
    applicationProcess: {
      label: tNavigation('applicationProcess'),
      count: 0,
      iconType: 'applicationProcess',
      loading: false,
    },
    applicationInteraction: {
      label: tNavigation('applicationInteraction'),
      count: 0,
      iconType: 'applicationInteraction',
      loading: false,
    },
    applicationEvent: {
      label: tNavigation('applicationEvent'),
      count: 0,
      iconType: 'applicationEvent',
      loading: false,
    },
    applicationService: {
      label: tNavigation('applicationService'),
      count: 0,
      iconType: 'applicationService',
      loading: false,
    },
    missions: {
      label: tNavigation('missions'),
      count: missionsCount,
      iconType: 'mission',
      loading: geaElementsLoading,
    },
    visions: {
      label: tNavigation('visions'),
      count: visionsCount,
      iconType: 'vision',
      loading: geaElementsLoading,
    },
    values: {
      label: tNavigation('values'),
      count: valuesCount,
      iconType: 'value',
      loading: geaElementsLoading,
    },
    goals: {
      label: tNavigation('goals'),
      count: goalsCount,
      iconType: 'goal',
      loading: geaElementsLoading,
    },
    strategies: {
      label: tNavigation('strategies'),
      count: strategiesCount,
      iconType: 'strategy',
      loading: geaElementsLoading,
    },
    businessProcesses: {
      label: tNavigation('businessProcesses'),
      count: businessProcessesCount,
      iconType: 'businessProcess',
      loading: isLoading,
    },
    valuePropositions: {
      label: tNavigation('valuePropositions'),
      count: valuePropositionsCount,
      iconType: 'valueProposition',
      loading: false,
    },
    businessCases: {
      label: tNavigation('businessCases'),
      count: businessCasesCount,
      iconType: 'businessCase',
      loading: false,
    },
  }

  const visibleCardKeys = lensToElementKeys[selectedLens] ?? []

  const geaTotalScorePercent = React.useMemo(
    () =>
      calculateGeaTotalScorePercent({
        missions: geaMissionsData?.geaMissions ?? [],
        values: geaValuesData?.geaValues ?? [],
        goals: geaGoalsData?.geaGoals ?? [],
        strategies: geaStrategiesData?.geaStrategies ?? [],
      }),
    [
      geaMissionsData?.geaMissions,
      geaValuesData?.geaValues,
      geaGoalsData?.geaGoals,
      geaStrategiesData?.geaStrategies,
    ]
  )

  const formatSignedPercent = (value: number) => {
    const rounded = Math.round(value * 10) / 10
    return `${rounded}%`
  }

  const getGeaScoreBackground = (percent: number) => {
    const score = (percent / 100) * 3
    if (score > 0) {
      return alpha(theme.palette.success.main, (Math.min(score, 3) / 3) * 0.5)
    }
    if (score < 0) {
      return alpha(theme.palette.error.main, (Math.min(Math.abs(score), 3) / 3) * 0.5)
    }
    return theme.palette.background.paper
  }

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
      case 'mission':
        return <MissionIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
      case 'vision':
        return <VisionIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
      case 'value':
        return <ValuesIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
      case 'goal':
        return <GoalsIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
      case 'strategy':
        return <StrategiesIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
      case 'valueProposition':
        return <LightbulbIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      case 'businessCase':
        return <ModelTrainingIcon sx={{ fontSize: 40, color: theme.palette.secondary.dark }} />
      case 'applicationCollaboration':
        return <CollaborationIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      case 'applicationFunction':
        return <FunctionIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
      case 'applicationProcess':
        return <ProcessIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
      case 'businessProcess':
        return <ProcessIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
      case 'applicationInteraction':
        return <InteractionIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
      case 'applicationEvent':
        return <EventIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
      case 'applicationService':
        return <ServiceIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
      default:
        return <ConstructionIcon sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
    }
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {t('title')}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {selectedCompany?.name || t('companyNotSelected')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedCompany?.description || t('description_placeholder')}
            </Typography>
          </Box>

          {isGeaEnabled && (
            <Tooltip title={t('geaScoreTooltip')} arrow>
              <ButtonBase
                onClick={() => router.push('/matrix-editor')}
                sx={{
                  borderRadius: 2,
                  textAlign: 'right',
                  display: 'block',
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 2,
                    minWidth: 180,
                    textAlign: 'right',
                    backgroundColor: getGeaScoreBackground(geaTotalScorePercent),
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                    transition: 'transform 120ms ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('geaTotalScore')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {geaScoreLoading ? '...' : formatSignedPercent(geaTotalScorePercent)}
                  </Typography>
                </Box>
              </ButtonBase>
            </Tooltip>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 6, mt: 3 }}>
        {visibleCardKeys.map(cardKey => {
          const card = cardDefinitions[cardKey]
          return (
            <Grid key={cardKey} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
              <Card>
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h4">{card.loading ? '...' : card.count}</Typography>
                  </Box>
                  {getCardIcon(card.iconType)}
                </CardContent>
              </Card>
            </Grid>
          )
        })}

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
    </Box>
  )
}

export default Dashboard
