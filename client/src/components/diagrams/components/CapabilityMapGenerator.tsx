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
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/de'
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

  const [filterDate, setFilterDate] = useState<Dayjs | null>(dayjs())

  const { data, loading, error } = useQuery(GET_CAPABILITY_MAP_DATA, {
    skip: !open,
    errorPolicy: 'all',
  })

  // Get applications count for debugging
  const { data: appCountData } = useQuery(GET_APPLICATIONS_COUNT, {
    skip: !open,
    errorPolicy: 'all',
  })

  // Filter capabilities based on the selected date
  const filterCapabilitiesByDate = (capabilities: any[], targetDate: Dayjs | null) => {
    if (!targetDate || !capabilities) return capabilities

    const targetDateString = targetDate.format('YYYY-MM-DD')

    const filterCapability = (capability: any): any | null => {
      const introDate = capability.introductionDate
      const endDate = capability.endDate

      // Check if capability is valid for the target date
      const isValidForDate =
        (!introDate || introDate <= targetDateString) && (!endDate || endDate >= targetDateString)

      if (!isValidForDate) {
        return null
      }

      // Recursively filter children
      const filteredChildren = capability.children
        ? capability.children.map(filterCapability).filter((child: any) => child !== null)
        : []

      return {
        ...capability,
        children: filteredChildren,
      }
    }

    return capabilities.map(filterCapability).filter((cap: any) => cap !== null)
  }

  const filteredCapabilities = filterCapabilitiesByDate(data?.businessCapabilities, filterDate)

  const handleGenerate = async () => {
    if (!data?.businessCapabilities) {
      console.warn('Keine Capability-Daten verfügbar')
      return
    }

    // Use filtered capabilities instead of raw data
    const capabilitiesToUse = filteredCapabilities || data.businessCapabilities

    try {
      // Debug the capability hierarchy before generation
      debugCapabilityHierarchy(capabilitiesToUse, settings)

      // Enhanced debug analysis to find missing capabilities
      debugMissingCapabilities(capabilitiesToUse, settings)

      // Debug application rollup behavior
      debugApplicationRollup(capabilitiesToUse, settings)

      let elements: any[] = []

      // Generate capability map with ArchiMate symbols
      elements = await generateCapabilityMapWithLibrary(capabilitiesToUse, settings)

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
  const renderedCapabilitiesCount = filteredCapabilities
    ? calculateRenderedCapabilitiesCount(filteredCapabilities, settings)
    : 0

  // Calculate displayed applications count (using the corrected rollup logic)
  const totalApplicationsCount = filteredCapabilities
    ? calculateDisplayedApplicationsCount(filteredCapabilities, settings)
    : 0

  // Calculate applications with capability assignment
  const applicationsWithCapabilityCount = filteredCapabilities
    ? (() => {
        const uniqueApps = new Set()
        filteredCapabilities.forEach((cap: any) => {
          if (cap.supportedByApplications) {
            cap.supportedByApplications.forEach((app: any) => uniqueApps.add(app.id))
          }
        })
        return uniqueApps.size
      })()
    : 0

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
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

            <Box sx={{ mt: 3, mb: 2 }}>
              <DatePicker
                label="Datum für Capability Map"
                value={filterDate}
                onChange={newValue => setFilterDate(newValue)}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText:
                      'Capabilities werden basierend auf diesem Datum gefiltert (aktiv zwischen Einführungs- und Enddatum)',
                  },
                }}
              />
            </Box>

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
                    {filterDate && (
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <BusinessCapabilityIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                        {filteredCapabilities?.length || 0} Capabilities für{' '}
                        {filterDate.format('DD.MM.YYYY')} gefiltert
                      </Typography>
                    )}
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
                            {appCountData.applicationsConnection.aggregate.count.nodes}{' '}
                            Applikationen gesamt gefunden
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
          </Button>{' '}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}

export default CapabilityMapGenerator
