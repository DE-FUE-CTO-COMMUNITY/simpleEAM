'use client'

import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { useAuth } from '@/lib/auth'
import UserProfileDialog from '@/components/profile/UserProfileDialog'

function ProfilePage() {
  const { authenticated } = useAuth()

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
