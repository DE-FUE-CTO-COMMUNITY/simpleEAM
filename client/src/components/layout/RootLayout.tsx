'use client'

import React, { useState } from 'react'
import { Box, Toolbar, styled } from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Architecture as ArchitectureIcon,
  AccountTree as DiagramIcon,
  Rule as RuleIcon,
  Settings as SettingsIcon,
  Business as CompanyIcon,
  BusinessCenter as SupplierIcon,
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
  GridOn as GridOnIcon,
  SmartToy as SmartToyIcon,
  ConnectWithoutContact as InteractionIcon,
  Event as EventIcon,
  MiscellaneousServices as ServiceIcon,
  Category as SoftwareProductIcon,
  Sell as SoftwareVersionIcon,
  PrecisionManufacturing as HardwareProductIcon,
  SettingsInputComponent as HardwareVersionIcon,
} from '@mui/icons-material'
import {
  BusinessCapabilityIcon,
  BusinessProcessIcon,
  ApplicationComponentIcon,
  ApplicationInterfaceIcon,
  BusinessObjectIcon,
  InfrastructureIcon,
  AIComponentIcon,
} from '@/components/icons'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth, isAdmin, isArchitect } from '@/lib/auth'
import { useLensSelection, type LensKey } from '@/lib/lens-settings'
import { useFeatureFlags } from '@/lib/feature-flags'
import { useRuntimeConfig } from '@/lib/runtime-config'

import AppHeader from './AppHeader'
import Sidebar, { drawerWidth } from './Sidebar'
import ExcelIcon from '../icons/ExcelIcon'
import { ImportExportDialog } from '../excel'

// Styled components for layout
const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  minWidth: 0,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
}))

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const { keycloak, authenticated, initialized } = useAuth()
  const [open, setOpen] = useState(true)
  const [importExportDialogOpen, setImportExportDialogOpen] = useState(false)
  const t = useTranslations('navigation')
  const { selectedLens } = useLensSelection()
  const runtimeConfig = useRuntimeConfig()
  const { featureFlags } = useFeatureFlags()
  const isGeaEnabled = featureFlags.GEA
  const isBmcEnabled = featureFlags.BMC
  const isAbhEnabled = featureFlags.ABH
  const isApsEnabled = featureFlags.APS
  const isAasEnabled = featureFlags.AAS
  const isSupEnabled = featureFlags.SUP
  const hasAiSupport = Boolean(runtimeConfig.ai.llmUrl.trim())

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleImportExportDialogOpen = () => {
    setImportExportDialogOpen(true)
  }

  const handleImportExportDialogClose = () => {
    setImportExportDialogOpen(false)
  }

  // If Keycloak is initialized but user is not authenticated,
  // wird eine leere Seite angezeigt, um Flash of Content zu vermeiden
  if (initialized && !authenticated) {
    return <Box sx={{ display: 'flex', minHeight: '100vh' }} />
  }

  const userName = (authenticated && keycloak?.tokenParsed?.preferred_username) || 'Benutzer'

  const architectureElementItems = [
    {
      key: 'businessCapabilities',
      text: t('businessCapabilities'),
      icon: <BusinessCapabilityIcon />,
      href: '/capabilities',
    },
    {
      key: 'applications',
      text: t('applications'),
      icon: <ApplicationComponentIcon />,
      href: '/applications',
    },
    {
      key: 'aiComponents',
      text: t('aiComponents'),
      icon: <AIComponentIcon />,
      href: '/aicomponents',
    },
    {
      key: 'dataObjects',
      text: t('dataObjects'),
      icon: <BusinessObjectIcon />,
      href: '/dataobjects',
    },
    {
      key: 'interfaces',
      text: t('interfaces'),
      icon: <ApplicationInterfaceIcon />,
      href: '/interfaces',
    },
    {
      key: 'infrastructure',
      text: t('infrastructure'),
      icon: <InfrastructureIcon />,
      href: '/infrastructure',
    },
    {
      key: 'softwareProducts',
      text: t('softwareProducts'),
      icon: <SoftwareProductIcon />,
      href: '/software-products',
    },
    {
      key: 'softwareVersions',
      text: t('softwareVersions'),
      icon: <SoftwareVersionIcon />,
      href: '/software-versions',
    },
    {
      key: 'hardwareProducts',
      text: t('hardwareProducts'),
      icon: <HardwareProductIcon />,
      href: '/hardware-products',
    },
    {
      key: 'hardwareVersions',
      text: t('hardwareVersions'),
      icon: <HardwareVersionIcon />,
      href: '/hardware-versions',
    },
  ]

  const geaBusinessItems = [
    { key: 'missions', text: t('missions'), icon: <MissionIcon />, href: '/missions' },
    { key: 'visions', text: t('visions'), icon: <VisionIcon />, href: '/visions' },
    { key: 'values', text: t('values'), icon: <ValuesIcon />, href: '/values' },
    { key: 'goals', text: t('goals'), icon: <GoalsIcon />, href: '/goals' },
    { key: 'strategies', text: t('strategies'), icon: <StrategiesIcon />, href: '/strategies' },
  ]

  const bmcItems = [
    {
      key: 'valuePropositions',
      text: t('valuePropositions'),
      icon: <LightbulbIcon />,
      href: '/value-propositions',
    },
    {
      key: 'businessModels',
      text: t('businessModels'),
      icon: <ModelTrainingIcon />,
      href: '/business-models',
    },
  ]

  const solutionArchitectureItems = [
    ...(isAasEnabled
      ? [
          {
            key: 'applicationCollaboration',
            text: t('applicationCollaboration'),
            icon: <CollaborationIcon />,
            href: '/application-collaboration',
          },
        ]
      : []),
    ...(isAbhEnabled
      ? [
          {
            key: 'applicationFunction',
            text: t('applicationFunction'),
            icon: <FunctionIcon />,
            href: '/application-function',
          },
          {
            key: 'applicationProcess',
            text: t('applicationProcess'),
            icon: <ProcessIcon />,
            href: '/application-process',
          },
          {
            key: 'applicationInteraction',
            text: t('applicationInteraction'),
            icon: <InteractionIcon />,
            href: '/application-interaction',
          },
          {
            key: 'applicationEvent',
            text: t('applicationEvent'),
            icon: <EventIcon />,
            href: '/application-event',
          },
          {
            key: 'applicationService',
            text: t('applicationService'),
            icon: <ServiceIcon />,
            href: '/application-service',
          },
        ]
      : []),
  ]

  const processArchitectureItems = [
    {
      key: 'businessProcesses',
      text: t('businessProcesses'),
      icon: <BusinessProcessIcon />,
      href: '/business-processes',
    },
  ]

  const technologyManagementItemKeys = new Set([
    'softwareProducts',
    'softwareVersions',
    'hardwareProducts',
    'hardwareVersions',
  ])

  const nonTechnologyArchitectureItemKeys = architectureElementItems
    .map(item => item.key)
    .filter(key => !technologyManagementItemKeys.has(key))

  const lensToElementKeys: Record<LensKey, string[]> = {
    enterpriseArchitecture: nonTechnologyArchitectureItemKeys,
    businessArchitecture: [
      ...(isGeaEnabled ? (geaBusinessItems.map(item => item.key) as string[]) : []),
      ...(isBmcEnabled ? (bmcItems.map(item => item.key) as string[]) : []),
      'businessCapabilities',
    ],
    processArchitecture: ['businessCapabilities', 'businessProcesses', 'applications'],
    dataArchitecture: ['dataObjects'],
    aiArchitecture: ['aiComponents'],
    solutionArchitecture: [
      'applications',
      ...(solutionArchitectureItems.map(item => item.key) as string[]),
      ...(isApsEnabled ? ['dataObjects'] : []),
      'interfaces',
    ],
    cybersecurityArchitecture: ['applications', 'aiComponents', 'dataObjects', 'interfaces'],
    infrastructureArchitecture: ['applications', 'infrastructure'],
    transformationArchitecture: nonTechnologyArchitectureItemKeys,
    technologyManagement: [
      'applications',
      'infrastructure',
      'softwareProducts',
      'softwareVersions',
      'hardwareProducts',
      'hardwareVersions',
    ],
  }

  const allArchitectureItems = [
    ...architectureElementItems,
    ...processArchitectureItems,
    ...(isGeaEnabled ? geaBusinessItems : []),
    ...(isBmcEnabled ? bmcItems : []),
    ...solutionArchitectureItems,
  ]

  const itemByKey = new Map(allArchitectureItems.map(item => [item.key, item]))
  const visibleArchitectureItems = (lensToElementKeys[selectedLens] ?? []).reduce(
    (acc, key) => {
      const item = itemByKey.get(key)
      if (item) acc.push(item)
      return acc
    },
    [] as typeof allArchitectureItems
  )

  const menuItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, href: '/' },
    { text: t('diagramEditor'), icon: <DiagramIcon />, href: '/diagrams' },
    ...(isGeaEnabled && selectedLens === 'businessArchitecture'
      ? [{ text: t('matrixEditor'), icon: <GridOnIcon />, href: '/matrix-editor' }]
      : []),
    ...(selectedLens === 'processArchitecture'
      ? [{ text: t('processEditor'), icon: <GridOnIcon />, href: '/process-editor' }]
      : []),
    ...(initialized && hasAiSupport && (isAdmin() || isArchitect())
      ? [{ text: t('aiSupport'), icon: <SmartToyIcon />, href: '/ai-support' }]
      : []),
    { text: t('architectures'), icon: <ArchitectureIcon />, href: '/architectures' },
    {
      text: t('architecturePrinciples'),
      icon: <RuleIcon />,
      href: '/architecture-principles',
    },
    { isDivider: true, text: 'divider', icon: null },
    ...visibleArchitectureItems,
    // Abschnitt: Organisation & Personen
    { isDivider: true, text: 'divider', icon: null },
    // Companies management only visible for admins
    ...(initialized && isAdmin()
      ? [{ text: t('companies'), icon: <CompanyIcon />, href: '/companies' }]
      : []),
    // Suppliers visible for all users when SUP feature is enabled
    ...(initialized && isSupEnabled
      ? [{ text: t('suppliers'), icon: <SupplierIcon />, href: '/suppliers' }]
      : []),
    { text: t('persons'), icon: <PersonIcon />, href: '/persons' },
    // Import/Export for Admin and Architect users (Hydration fix: only when initialized)
    ...(initialized && (isAdmin() || isArchitect())
      ? [
          { isDivider: true, text: 'divider', icon: null },
          { text: t('importExport'), icon: <ExcelIcon />, onClick: handleImportExportDialogOpen },
        ]
      : []),
    // Administration only for admins - at the bottom
    ...(initialized && isAdmin()
      ? [
          { isDivider: true, text: 'divider', icon: null },
          { text: t('administration'), icon: <SettingsIcon />, href: '/admin' },
        ]
      : []),
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* CssBaseline is already used in layout.tsx */}

      <AppHeader
        open={open}
        drawerWidth={drawerWidth}
        authenticated={authenticated || false}
        userName={userName}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Sidebar
        open={open}
        menuItems={menuItems}
        handleDrawerToggle={handleDrawerToggle}
        isActive={isActive}
      />

      <Main>
        <Toolbar /> {/* Spacer for the AppBar */}
        {children}
      </Main>

      {/* Excel Import/Export Dialog - für Admin- und Architect-Benutzer */}
      {/* Hydration fix: Only render when auth is initialized */}
      {initialized && (isAdmin() || isArchitect()) && (
        <ImportExportDialog
          isOpen={importExportDialogOpen}
          onClose={handleImportExportDialogClose}
        />
      )}
    </Box>
  )
}

export default RootLayout
