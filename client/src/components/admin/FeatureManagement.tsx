'use client'

import React from 'react'
import { Box, FormControlLabel, FormGroup, Switch, Typography, Divider } from '@mui/material'
import { useTranslations } from 'next-intl'
import { LENS_OPTIONS, type LensFlags, type LensKey } from '@/lib/feature-definitions'
import { FEATURE_FLAGS, type FeatureFlagKey, type FeatureFlags } from '@/lib/feature-definitions'

interface FeatureManagementProps {
  lensFlags: LensFlags
  featureFlags: FeatureFlags
  onLensFlagsChange: (next: LensFlags) => void
  onFeatureFlagsChange: (next: FeatureFlags) => void
  disableEnterpriseLens?: boolean
  disabled?: boolean
}

export default function FeatureManagement({
  lensFlags,
  featureFlags,
  onLensFlagsChange,
  onFeatureFlagsChange,
  disableEnterpriseLens = true,
  disabled = false,
}: FeatureManagementProps) {
  const t = useTranslations('admin.featureManagement')
  const tLenses = useTranslations('lenses')

  const handleToggle = (lens: LensKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onLensFlagsChange({
      ...lensFlags,
      [lens]: event.target.checked,
    })
  }

  const handleFeatureToggle =
    (feature: FeatureFlagKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onFeatureFlagsChange({
        ...featureFlags,
        [feature]: event.target.checked,
      })
    }

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Box>
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
                    disabled={
                      disabled ||
                      (disableEnterpriseLens && lens === 'enterpriseArchitecture')
                    }
                  />
                }
                label={tLenses(lens)}
              />
            ))}
          </FormGroup>
          {disableEnterpriseLens && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                {t('enterpriseLocked')}
              </Typography>
            </>
          )}
        </Box>

        <Box>
          <Typography variant="h6" component="h3" gutterBottom>
            {t('featuresTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('featuresDescription')}
          </Typography>
          <FormGroup>
            {FEATURE_FLAGS.map(feature => (
              <FormControlLabel
                key={feature}
                control={
                  <Switch
                    checked={featureFlags[feature]}
                    onChange={handleFeatureToggle(feature)}
                    disabled={disabled}
                  />
                }
                label={t(`features.${feature}`, { prefix: `${feature}_` })}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
    </Box>
  )
}
