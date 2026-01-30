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
} from '@mui/icons-material'
import {
  BusinessCapabilityIcon,
  ApplicationComponentIcon,
  ApplicationInterfaceIcon,
  BusinessObjectIcon,
  InfrastructureIcon,
  AIComponentIcon,
} from '@/components/icons'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth, isAdmin, isArchitect } from '@/lib/auth'

import AppHeader from './AppHeader'
import Sidebar, { drawerWidth } from './Sidebar'
import ExcelIcon from '../icons/ExcelIcon'
import { ImportExportDialog } from '../excel'

// Styled components for layout
const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
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

  const menuItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, href: '/' },
    { text: t('diagramEditor'), icon: <DiagramIcon />, href: '/diagrams' },
    { text: t('architectures'), icon: <ArchitectureIcon />, href: '/architectures' },
    {
      text: t('architecturePrinciples'),
      icon: <RuleIcon />,
      href: '/architecture-principles',
    },
    { isDivider: true, text: 'divider', icon: null },
    { text: t('businessCapabilities'), icon: <BusinessCapabilityIcon />, href: '/capabilities' },
    { text: t('applications'), icon: <ApplicationComponentIcon />, href: '/applications' },
    { text: t('aiComponents'), icon: <AIComponentIcon />, href: '/aicomponents' },
    { text: t('dataObjects'), icon: <BusinessObjectIcon />, href: '/dataobjects' },
    { text: t('interfaces'), icon: <ApplicationInterfaceIcon />, href: '/interfaces' },
    { text: t('infrastructure'), icon: <InfrastructureIcon />, href: '/infrastructure' },
    // Abschnitt: Organisation & Personen
    { isDivider: true, text: 'divider', icon: null },
    // Companies management only visible for admins
    ...(initialized && isAdmin()
      ? [{ text: t('companies'), icon: <CompanyIcon />, href: '/companies' }]
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
