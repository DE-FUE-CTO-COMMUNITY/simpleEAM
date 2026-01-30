'use client'

import React, { useState } from 'react'
import { Box, Container, Paper, Typography, Button, Alert } from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'
import SessionDebugger from '@/components/debug/SessionDebugger'

export default function DebugPage() {
  const [debuggerOpen, setDebuggerOpen] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BugReportIcon color="primary" />
          <Typography variant="h4" component="h1">
            Debug-Tools
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          Diese Debug-Tools sind nur für die Entwicklungsumgebung bestimmt und sollten nicht in der
          production.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<BugReportIcon />}
            onClick={() => setDebuggerOpen(true)}
            size="large"
          >
            Session Debugger öffnen
          </Button>

          <Typography variant="body2" color="text.secondary">
            Der Session Debugger hilft bei der Diagnose von Authentifizierungs- und
            Session-Problemen. Er zeigt detaillierte Informationen über Keycloak-Status,
            Token-Gültigkeit und Umgebungskonfiguration an.
          </Typography>
        </Box>

        <SessionDebugger isOpen={debuggerOpen} onClose={() => setDebuggerOpen(false)} />
      </Paper>
    </Container>
  )
}
