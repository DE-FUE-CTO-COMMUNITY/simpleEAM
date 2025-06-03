'use client'

import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { useAuth, login } from '@/lib/auth'
import UserProfileDialog from '@/components/profile/UserProfileDialog'
import { useEffect } from 'react'

function ProfilePage() {
  const { authenticated } = useAuth()

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  if (!authenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Authentifizierung erforderlich...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Benutzerprofil
        </Typography>
        <UserProfileDialog open={true} fullScreen />
      </Paper>
    </Box>
  )
}

export default ProfilePage
