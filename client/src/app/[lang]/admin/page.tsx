'use client'

import React from 'react'
import { Container, Typography, Box, Paper, Button, Tabs, Tab } from '@mui/material'
import { BugReport as BugReportIcon, People as PeopleIcon } from '@mui/icons-material'
import SessionDebugger from '@/components/debug/SessionDebugger'
import UserManagement from '@/components/admin/UserManagement'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminPage() {
  const [isDebuggerOpen, setIsDebuggerOpen] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState(0)

  // Prüfe Admin-Berechtigung
  React.useEffect(() => {
    if (!isAdmin()) {
      redirect('/')
    }
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administration
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            aria-label="Administration Tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Benutzerverwaltung" 
              icon={<PeopleIcon />} 
              iconPosition="start"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab 
              label="Debug-Tools" 
              icon={<BugReportIcon />} 
              iconPosition="start"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <UserManagement />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Typography variant="h5" component="h2" gutterBottom>
              Debug-Tools
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Hier können Sie Debug-Tools für die Anwendung verwenden.
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setIsDebuggerOpen(true)}
              startIcon={<BugReportIcon />}
              color="warning"
            >
              Session Debugger
            </Button>

            <SessionDebugger isOpen={isDebuggerOpen} onClose={() => setIsDebuggerOpen(false)} />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  )
}
