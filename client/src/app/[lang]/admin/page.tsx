'use client'

import React from 'react'
import { Typography, Box, Paper, Button, Tabs, Tab } from '@mui/material'
import { BugReport as BugReportIcon, People as PeopleIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import SessionDebugger from '@/components/debug/SessionDebugger'
import UserManagement from '@/components/admin/UserManagement'
import DebugSettingsPanel from '@/components/admin/DebugSettingsPanel'
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
  const t = useTranslations('admin')
  const [isDebuggerOpen, setIsDebuggerOpen] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState(0)
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  // Prüfe Admin-Berechtigung
  React.useEffect(() => {
    if (!isAdmin()) {
      redirect('/')
    } else {
      setIsAuthorized(true)
    }
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  // Show nothing until authorization is checked
  if (!isAuthorized) {
    return null
  }

  return (
    <Box sx={{ mt: 4, mb: 4, mx: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="Administration Tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={t('tabs.userManagement')}
            icon={<PeopleIcon />}
            iconPosition="start"
            id="admin-tab-0"
            aria-controls="admin-tabpanel-0"
          />
          <Tab
            label={t('tabs.debugTools')}
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
            {t('debugTools.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('debugTools.description')}
          </Typography>

          <DebugSettingsPanel />

          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button
              variant="outlined"
              onClick={() => setIsDebuggerOpen(true)}
              startIcon={<BugReportIcon />}
              color="warning"
            >
              {t('debugTools.sessionDebugger')}
            </Button>
          </Box>

          <SessionDebugger isOpen={isDebuggerOpen} onClose={() => setIsDebuggerOpen(false)} />
        </TabPanel>
      </Paper>
    </Box>
  )
}
