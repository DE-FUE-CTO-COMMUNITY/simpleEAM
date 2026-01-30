'use client'

import React from 'react'
import { Box, Typography, Button, Paper, Chip, Alert } from '@mui/material'
import { useAutoUserRegistration } from '@/hooks/useAutoUserRegistration'
import { useAuth } from '@/lib/auth'
import { useTranslations } from 'next-intl'

export default function AutoRegistrationDebug() {
  const t = useTranslations('debug.autoRegistration')
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
    if (isCreating) return t('creatingPerson')
    if (isChecking) return t('checkingPerson')
    if (userExists) return t('personExists')
    if (registrationChecked && !userExists) return t('personMissing')
    return t('notChecked')
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('title')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('userEmail')}: <strong>{userEmail || t('notAvailable')}</strong>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`${t('initialized')}: ${initialized}`}
          color={initialized ? 'success' : 'default'}
          size="small"
        />
        <Chip
          label={`${t('authenticated')}: ${authenticated}`}
          color={authenticated ? 'success' : 'default'}
          size="small"
        />
        <Chip
          label={`Registration checked: ${registrationChecked}`}
          color={registrationChecked ? 'success' : 'default'}
          size="small"
        />
        <Chip label={getStatusText()} color={getStatusColor()} size="small" />
      </Box>

      {!userEmail && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('noEmailFound')}
        </Alert>
      )}

      {userEmail && !userExists && registrationChecked && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('personNotCreated')}
        </Alert>
      )}

      {userEmail && userExists && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('personExistsCorrectly')}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={clearRegistrationCache} disabled={!userEmail}>
          {t('clearCacheAndRecheck')}
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
          {t('resetSession')}
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {t('consoleHint')}
        </Typography>
      </Box>
    </Paper>
  )
}
