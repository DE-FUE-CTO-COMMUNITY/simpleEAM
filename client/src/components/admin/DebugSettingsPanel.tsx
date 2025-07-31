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
import { useDebug } from '@/contexts/DebugContext'

export default function DebugSettingsPanel() {
  const { settings, updateSetting, resetSettings } = useDebug()

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReportIcon color="primary" />
            <Typography variant="h6">Debug-Einstellungen</Typography>
          </Box>
        }
        subheader="Entwickler-Tools und Debugging-Optionen"
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
                  Element-Koordinaten anzeigen
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Zeigt Position und Größe von selektierten Elementen im Canvas an
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
                  Pfeil-Debug-Informationen
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Zeigt detaillierte Informationen über Pfeil-Berechnungen
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
                  Performance-Metriken
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Zeigt Rendering-Zeit und Performance-Statistiken
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
              Auf Standardwerte zurücksetzen
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
