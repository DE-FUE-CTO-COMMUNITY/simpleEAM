'use client'

import React from 'react'
import { Box, Typography, Button, Paper, Chip, Alert } from '@mui/material'
import { useAutoUserRegistration } from '@/hooks/useAutoUserRegistration'
import { useAuth } from '@/lib/auth'

export default function AutoRegistrationDebug() {
  const { keycloak, authenticated, initialized } = useAuth()
  const { registrationChecked, userExists, isChecking, isCreating, clearRegistrationCache } =
    useAutoUserRegistration()

  const userEmail = keycloak?.tokenParsed?.email

  const getStatusColor = () => {
    if (isCreating) return 'warning'
    if (isChecking) return 'info'
    if (userExists) return 'success'
    if (registrationChecked && !userExists) return 'error'
    return 'default'
  }

  const getStatusText = () => {
    if (isCreating) return 'Erstelle Person...'
    if (isChecking) return 'Prüfe Person...'
    if (userExists) return 'Person existiert'
    if (registrationChecked && !userExists) return 'Person fehlt'
    return 'Nicht geprüft'
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Auto-Registrierung Debug
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Benutzer E-Mail: <strong>{userEmail || 'Nicht verfügbar'}</strong>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`Initialisiert: ${initialized}`}
          color={initialized ? 'success' : 'default'}
          size="small"
        />
        <Chip
          label={`Authentifiziert: ${authenticated}`}
          color={authenticated ? 'success' : 'default'}
          size="small"
        />
        <Chip
          label={`Registrierung geprüft: ${registrationChecked}`}
          color={registrationChecked ? 'success' : 'default'}
          size="small"
        />
        <Chip label={getStatusText()} color={getStatusColor()} size="small" />
      </Box>

      {!userEmail && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Keine E-Mail-Adresse im Keycloak-Token gefunden
        </Alert>
      )}

      {userEmail && !userExists && registrationChecked && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Person wurde nicht automatisch erstellt! Möglicherweise liegt ein Problem vor.
        </Alert>
      )}

      {userEmail && userExists && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Person existiert und ist korrekt verknüpft
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={clearRegistrationCache} disabled={!userEmail}>
          Cache leeren & neu prüfen
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            if (userEmail) {
              sessionStorage.clear()
              window.location.reload()
            }
          }}
          disabled={!userEmail}
        >
          Session zurücksetzen
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Konsole öffnen für detaillierte Logs der Auto-Registrierung
        </Typography>
      </Box>
    </Paper>
  )
}
