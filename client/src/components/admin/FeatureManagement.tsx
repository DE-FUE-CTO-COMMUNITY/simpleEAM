'use client'

import React from 'react'
import { Box, FormControlLabel, FormGroup, Switch, Typography, Divider } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useLensSettings, LENS_OPTIONS, LensKey } from '@/lib/lens-settings'

export default function FeatureManagement() {
  const t = useTranslations('admin.featureManagement')
  const tLenses = useTranslations('lenses')
  const { lensFlags, setLensFlags } = useLensSettings()

  const handleToggle = (lens: LensKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLensFlags({
      ...lensFlags,
      [lens]: event.target.checked,
    })
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        {t('lensesTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('lensesDescription')}
      </Typography>
      <FormGroup>
        {LENS_OPTIONS.map(lens => (
          <FormControlLabel
            key={lens}
            control={
              <Switch
                checked={lensFlags[lens]}
                onChange={handleToggle(lens)}
                disabled={lens === 'enterpriseArchitecture'}
              />
            }
            label={tLenses(lens)}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        {t('enterpriseLocked')}
      </Typography>
    </Box>
  )
}
