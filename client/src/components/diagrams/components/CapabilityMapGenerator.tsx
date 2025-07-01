import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material'
import { BusinessCapabilityIcon, ApplicationComponentIcon } from '@/components/icons'
import { useQuery } from '@apollo/client'
import { GET_CAPABILITY_MAP_DATA } from '@/graphql/capability'
import { GET_APPLICATIONS_COUNT } from '@/graphql/application'
import {
  generateCapabilityMapWithLibrary,
  calculateRenderedCapabilitiesCount,
  calculateDisplayedApplicationsCount,
  debugCapabilityHierarchy,
  debugMissingCapabilities,
  debugApplicationRollup,
  type CapabilityMapSettings,
} from '../utils/CapabilityMapLibraryUtils'

interface CapabilityMapGeneratorProps {
  open: boolean
  onClose: () => void
  onElementsGenerated?: (elements: any[]) => void
}

const CapabilityMapGenerator: React.FC<CapabilityMapGeneratorProps> = ({
  open,
  onClose,
  onElementsGenerated,
}) => {
  const [settings, setSettings] = useState<CapabilityMapSettings>({
    maxLevels: 3,
    includeApplications: true,
    horizontalSpacing: 10,
    verticalSpacing: 10,
  })

  const { data, loading, error } = useQuery(GET_CAPABILITY_MAP_DATA, {
    skip: !open,
    errorPolicy: 'all',
  })

  // Get applications count for debugging
  const { data: appCountData } = useQuery(GET_APPLICATIONS_COUNT, {
    skip: !open,
    errorPolicy: 'all',
  })

  const handleGenerate = async () => {
    if (!data?.businessCapabilities) {
      console.warn('Keine Capability-Daten verfügbar')
      return
    }

    try {
      // Debug the capability hierarchy before generation
      debugCapabilityHierarchy(data.businessCapabilities, settings)

      // Enhanced debug analysis to find missing capabilities
      debugMissingCapabilities(data.businessCapabilities, settings)

      // Debug application rollup behavior
      debugApplicationRollup(data.businessCapabilities, settings)

      let elements: any[] = []

      // Generate capability map with ArchiMate symbols
      elements = await generateCapabilityMapWithLibrary(data.businessCapabilities, settings)

      if (elements.length === 0) {
        console.warn('Capability Map konnte nicht generiert werden')
        return
      }

      // Pass elements to parent component if callback provided
      if (onElementsGenerated) {
        onElementsGenerated(elements)
      }

      onClose()
    } catch (error) {
      console.error('Fehler bei der Diagramm-Generierung:', error)
    }
  }

  const handleSettingChange = (field: keyof CapabilityMapSettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Calculate rendered capabilities count whenever settings change
  const renderedCapabilitiesCount = data
    ? calculateRenderedCapabilitiesCount(data.businessCapabilities, settings)
    : 0

  // Calculate displayed applications count (using the corrected rollup logic)
  const totalApplicationsCount = data
    ? calculateDisplayedApplicationsCount(data.businessCapabilities, settings)
    : 0

  // Calculate applications with capability assignment
  const applicationsWithCapabilityCount = data
    ? (() => {
        const uniqueApps = new Set()
        data.businessCapabilities.forEach((cap: any) => {
          if (cap.supportedByApplications) {
            cap.supportedByApplications.forEach((app: any) => uniqueApps.add(app.id))
          }
        })
        return uniqueApps.size
      })()
    : 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Capability Map generieren</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" gutterBottom>
            Generiere automatisch eine Capability Map aus den verfügbaren Daten.
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Lade Capability-Daten...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              Fehler beim Laden der Capability-Daten: {error.message}
            </Alert>
          )}

          {data && (
            <>
              <Alert severity="info" sx={{ my: 2 }}>
                <Box component="div">
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <BusinessCapabilityIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                    {data.businessCapabilities.length} Capabilities gesamt gefunden
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <BusinessCapabilityIcon sx={{ color: '#388e3c', fontSize: 16 }} />
                    {renderedCapabilitiesCount} Capabilities werden dargestellt
                  </Typography>
                  {settings.includeApplications && (
                    <>
                      {appCountData && (
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ApplicationComponentIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                          {appCountData.applicationsConnection.aggregate.count.nodes} Applikationen
                          gesamt gefunden
                        </Typography>
                      )}
                      {applicationsWithCapabilityCount > 0 && (
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ApplicationComponentIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                          {applicationsWithCapabilityCount} Applikationen mit Capability-Zuordnung
                        </Typography>
                      )}
                      {totalApplicationsCount > 0 && (
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <ApplicationComponentIcon sx={{ color: '#388e3c', fontSize: 16 }} />
                          {totalApplicationsCount} Applikationen werden dargestellt
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Alert>

              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Maximale Hierarchie-Ebenen"
                  type="number"
                  value={settings.maxLevels}
                  onChange={e => handleSettingChange('maxLevels', parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: 5 }}
                  fullWidth
                  margin="normal"
                  helperText="Anzahl der Hierarchie-Ebenen die dargestellt werden sollen (1-5)"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.includeApplications}
                      onChange={e => handleSettingChange('includeApplications', e.target.checked)}
                    />
                  }
                  label="Unterstützende Applikationen einbeziehen"
                />

                <TextField
                  label="Horizontaler Abstand"
                  type="number"
                  value={settings.horizontalSpacing}
                  onChange={e =>
                    handleSettingChange('horizontalSpacing', parseInt(e.target.value) || 10)
                  }
                  inputProps={{ min: 10, max: 500 }}
                  fullWidth
                  margin="normal"
                  helperText="Abstand zwischen Capabilities in Pixeln"
                />

                <TextField
                  label="Vertikaler Abstand"
                  type="number"
                  value={settings.verticalSpacing}
                  onChange={e =>
                    handleSettingChange('verticalSpacing', parseInt(e.target.value) || 10)
                  }
                  inputProps={{ min: 10, max: 300 }}
                  fullWidth
                  margin="normal"
                  helperText="Abstand zwischen Hierarchie-Ebenen in Pixeln"
                />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          disabled={loading || !data?.businessCapabilities}
        >
          Generieren
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CapabilityMapGenerator
