// filepath: /home/mf2admin/simple-eam/client/src/components/layout/RootLayout.tsx
import React, { useState } from 'react'
import { Box, CssBaseline, Toolbar, styled } from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Apps as AppsIcon,
  DataObject as DataObjectIcon,
  Person as PersonIcon,
  Architecture as ArchitectureIcon,
  AccountTree as DiagramIcon,
  Api as ApiIcon,
} from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'

import AppHeader from './AppHeader'
import Sidebar, { drawerWidth } from './Sidebar'

// Styled-Komponenten für das Layout
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

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  // Wenn Keycloak initialisiert ist, aber der Benutzer nicht authentifiziert ist,
  // wird eine leere Seite angezeigt, um Flash of Content zu vermeiden
  if (initialized && !authenticated) {
    return <Box sx={{ display: 'flex', minHeight: '100vh' }} />
  }

  const userName = (authenticated && keycloak?.tokenParsed?.preferred_username) || 'Benutzer'

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
    { text: 'Diagram-Editor', icon: <DiagramIcon />, href: '/diagrams' },
    { text: 'Architekturen', icon: <ArchitectureIcon />, href: '/architectures' },
    { text: 'Business Capabilities', icon: <BusinessIcon />, href: '/capabilities' },
    { text: 'Applikationen', icon: <AppsIcon />, href: '/applications' },
    { text: 'Datenobjekte', icon: <DataObjectIcon />, href: '/dataobjects' },
    { text: 'Schnittstellen', icon: <ApiIcon />, href: '/interfaces' },
    { text: 'Personen', icon: <PersonIcon />, href: '/persons' },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

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
        <Toolbar /> {/* Spacer für die AppBar */}
        {children}
      </Main>
    </Box>
  )
}

export default RootLayout
