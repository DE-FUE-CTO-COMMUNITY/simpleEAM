'use client'

import React from 'react'
import { Box, Typography, Paper, Container } from '@mui/material'
import { Construction as ConstructionIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

const ProcessEditorPage = () => {
  const t = useTranslations('processEditor')

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('title')}
        </Typography>
        
        <Paper
          sx={{
            p: 6,
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            bgcolor: 'background.paper',
          }}
        >
          <ConstructionIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {t('comingSoon')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            {t('description')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default ProcessEditorPage
