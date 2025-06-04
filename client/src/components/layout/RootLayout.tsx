// filepath: /home/mf2admin/simple-eam/client/src/components/layout/RootLayout.tsx
import React, { useState } from 'react'
import { Box, CssBaseline, Toolbar, styled } from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Architecture as ArchitectureIcon,
  AccountTree as DiagramIcon,
} from '@mui/icons-material'
import {
  BusinessCapabilityIcon,
  ApplicationComponentIcon,
  ApplicationInterfaceIcon,
  BusinessObjectIcon,
} from '@/components/icons'
import { usePathname } from 'next/navigation'
import { useAuth, isAdmin } from '@/lib/auth'

import AppHeader from './AppHeader'
import Sidebar, { drawerWidth } from './Sidebar'
import ExcelIcon from '../icons/ExcelIcon'
import ExcelImportExport from '../excel/ExcelImportExport'

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
  const [excelDialogOpen, setExcelDialogOpen] = useState(false)

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleExcelDialogOpen = () => {
    setExcelDialogOpen(true)
  }

  const handleExcelDialogClose = () => {
    setExcelDialogOpen(false)
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
    { text: 'Business Capabilities', icon: <BusinessCapabilityIcon />, href: '/capabilities' },
    { text: 'Applikationen', icon: <ApplicationComponentIcon />, href: '/applications' },
    { text: 'Datenobjekte', icon: <BusinessObjectIcon />, href: '/dataobjects' },
    { text: 'Schnittstellen', icon: <ApplicationInterfaceIcon />, href: '/interfaces' },
    { text: 'Personen', icon: <PersonIcon />, href: '/persons' },
    // Import/Export nur für Admin-Benutzer
    ...(isAdmin()
      ? [
          { isDivider: true, text: 'divider', icon: null },
          { text: 'Import/Export', icon: <ExcelIcon />, onClick: handleExcelDialogOpen },
        ]
      : []),
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

      {/* Excel Import/Export Dialog - nur für Admin-Benutzer */}
      {isAdmin() && <ExcelImportExport isOpen={excelDialogOpen} onClose={handleExcelDialogClose} />}
    </Box>
  )
}

export default RootLayout
