'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

const ExcalidrawLoading: React.FC = () => {
  const t = useTranslations('diagrams')

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Typography variant="h5">{t('messages.loadingEditor')}</Typography>
    </Box>
  )
}

export default ExcalidrawLoading
