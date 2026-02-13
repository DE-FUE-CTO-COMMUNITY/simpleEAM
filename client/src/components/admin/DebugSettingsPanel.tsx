'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useTranslations } from 'next-intl'
import { useDebug } from '@/contexts/DebugContext'

export default function DebugSettingsPanel() {
  const t = useTranslations('admin.debugTools.settings')
  const { settings, updateSetting, resetSettings } = useDebug()

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReportIcon color="primary" />
            <Typography variant="h6">{t('title')}</Typography>
          </Box>
        }
        subheader={t('subtitle')}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.showElementCoordinates}
                onChange={e => updateSetting('showElementCoordinates', e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t('showElementCoordinates')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('showElementCoordinatesDesc')}
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showArrowDebugInfo}
                onChange={e => updateSetting('showArrowDebugInfo', e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t('showArrowDebugInfo')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('showArrowDebugInfoDesc')}
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showPerformanceMetrics}
                onChange={e => updateSetting('showPerformanceMetrics', e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t('showPerformanceMetrics')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('showPerformanceMetricsDesc')}
                </Typography>
              </Box>
            }
          />

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showDiagramSaveLogs}
                onChange={e => updateSetting('showDiagramSaveLogs', e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {t('showDiagramSaveLogs')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('showDiagramSaveLogsDesc')}
                </Typography>
              </Box>
            }
          />

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<RestartAltIcon />}
              onClick={resetSettings}
              variant="outlined"
              size="small"
            >
              {t('resetToDefaults')}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
