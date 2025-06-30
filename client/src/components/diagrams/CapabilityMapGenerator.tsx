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
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useQuery } from '@apollo/client'
import { GET_CAPABILITY_MAP_DATA } from '@/graphql/capability'
import {
  generateCapabilityMapElements,
  type CapabilityMapSettings,
} from './utils/CapabilityMapGenerator'

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
    horizontalSpacing: 200,
    verticalSpacing: 100,
  })

  const { data, loading, error } = useQuery(GET_CAPABILITY_MAP_DATA, {
    skip: !open,
    errorPolicy: 'all',
  })

  const handleGenerate = () => {
    if (!data?.businessCapabilities) {
      console.warn('Keine Capability-Daten verfügbar')
      return
    }

    try {
      // Generate elements using the utility function
      const elements = generateCapabilityMapElements(data.businessCapabilities, settings)

      console.log('Capability Map Generator erfolgreich:', {
        settings,
        capabilitiesCount: data.businessCapabilities.length,
        elementsGenerated: elements.length,
      })

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
                {data.businessCapabilities.length} Capabilities gefunden
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
                  label="Unterstützende Anwendungen einbeziehen"
                />

                <TextField
                  label="Horizontaler Abstand"
                  type="number"
                  value={settings.horizontalSpacing}
                  onChange={e =>
                    handleSettingChange('horizontalSpacing', parseInt(e.target.value) || 200)
                  }
                  inputProps={{ min: 100, max: 500 }}
                  fullWidth
                  margin="normal"
                  helperText="Abstand zwischen Capabilities in Pixeln"
                />

                <TextField
                  label="Vertikaler Abstand"
                  type="number"
                  value={settings.verticalSpacing}
                  onChange={e =>
                    handleSettingChange('verticalSpacing', parseInt(e.target.value) || 100)
                  }
                  inputProps={{ min: 50, max: 300 }}
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
