'use client'

import React from 'react'
import { Container, Typography, Box, Paper, Button } from '@mui/material'
import { BugReport as BugReportIcon } from '@mui/icons-material'
import SessionDebugger from '@/components/debug/SessionDebugger'
import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function AdminPage() {
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
        </Paper>
      </Box>
    </Container>
  )
}
