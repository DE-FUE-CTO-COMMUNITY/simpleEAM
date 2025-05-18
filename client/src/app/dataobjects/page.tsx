'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Card, Paper } from '@mui/material'
import { useAuth, login } from '@/lib/auth'

const DataObjectsPage = () => {
  const { authenticated } = useAuth()
  const router = useRouter()

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Datenobjekte
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Datenobjekt-Verwaltung</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Diese Funktionalität wird in Kürze implementiert.
          </Typography>
        </Paper>
      </Card>
    </Box>
  )
}

export default DataObjectsPage
