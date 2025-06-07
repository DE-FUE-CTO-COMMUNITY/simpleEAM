'use client'

import React from 'react'
import { Container, Typography, Box, Paper, Button } from '@mui/material'
import { Settings as SettingsIcon, BugReport as BugReportIcon } from '@mui/icons-material'
import TableSettingsManager from '@/components/common/TableSettingsManager'
import SessionDebugger from '@/components/debug/SessionDebugger'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function AdminPage() {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isDebuggerOpen, setIsDebuggerOpen] = React.useState(false)

  // Prüfe Admin-Berechtigung
  React.useEffect(() => {
    if (!isAdmin()) {
      redirect('/')
    }
  }, [])

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administration
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Tabellen-Einstellungen verwalten
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hier können Sie die gespeicherten Spaltensichtbarkeits-Einstellungen für alle Tabellen
            verwalten. Sie können Einstellungen anzeigen, löschen, exportieren und importieren.
          </Typography>

          <Button
            variant="contained"
            onClick={() => setIsSettingsOpen(true)}
            startIcon={<SettingsIcon />}
            sx={{ mr: 2 }}
          >
            Tabellen-Einstellungen öffnen
          </Button>

          <Button
            variant="outlined"
            onClick={() => setIsDebuggerOpen(true)}
            startIcon={<BugReportIcon />}
            color="warning"
          >
            Session Debugger
          </Button>

          <TableSettingsManager isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

          <SessionDebugger isOpen={isDebuggerOpen} onClose={() => setIsDebuggerOpen(false)} />
        </Paper>
      </Box>
    </Container>
  )
}
