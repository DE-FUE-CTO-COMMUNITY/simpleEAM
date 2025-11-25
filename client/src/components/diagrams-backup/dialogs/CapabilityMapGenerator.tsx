import React, { useState, useEffect, useMemo } from 'react'
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
  IconButton,
  Tooltip,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/en'
import { useTranslations, useLocale } from 'next-intl'
import {
  BusinessCapabilityIcon,
  ApplicationComponentIcon,
  AIComponentIcon,
} from '@/components/icons'
import { useQuery } from '@apollo/client'
import { GET_CAPABILITY_MAP_DATA } from '@/graphql/capability'
import { GET_APPLICATIONS_COUNT } from '@/graphql/application'
import { GET_AICOMPONENTS_COUNT } from '@/graphql/aicomponent'
import {
  generateCapabilityMapWithLibrary,
  calculateRenderedCapabilitiesCount,
  calculateDisplayedApplicationsCount,
  type CapabilityMapSettings,
} from '../utils/CapabilityMapLibraryUtils'
import {
  findTopLevelCapabilities,
  calculateDisplayedAiComponentsCount,
} from '../utils/capabilityHierarchy'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

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
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  // Get locale-appropriate date format and adapter locale
  const dateFormat = locale === 'en' ? 'MM/DD/YYYY' : 'DD.MM.YYYY'
  const adapterLocale = locale === 'en' ? 'en' : 'de'

  const [settings, setSettings] = useState<CapabilityMapSettings>({
    maxLevels: 3,
    includeApplications: true,
    includeAiComponents: false,
    horizontalSpacing: 10,
    verticalSpacing: 10,
  })

  const [filterDate, setFilterDate] = useState<Dayjs | null>(dayjs())

  // Top-Level Capability Filter States
  const [topLevelFilterDialogOpen, setTopLevelFilterDialogOpen] = useState(false)
  const [selectedTopLevelCapabilities, setSelectedTopLevelCapabilities] = useState<Set<string>>(
    new Set()
  )
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false)

  const capWhere = useCompanyWhere('company')
  const appWhere = useCompanyWhere('company')
  const { selectedCompanyId } = useCompanyContext()

  const { data, loading, error } = useQuery(GET_CAPABILITY_MAP_DATA, {
    skip: !open,
    errorPolicy: 'all',
    variables: {
      where: capWhere,
      appWhere,
    },
  })

  // Get applications count for debugging
  const { data: appCountData } = useQuery(GET_APPLICATIONS_COUNT, {
    skip: !open,
    errorPolicy: 'all',
    variables: {
      where: appWhere,
    },
  })

  // Get AI components count for debugging
  const { data: aiCountData } = useQuery(GET_AICOMPONENTS_COUNT, {
    skip: !open,
    errorPolicy: 'all',
    variables: {
      where: appWhere, // Use the same filter as applications for now
    },
  })

  // Reset Top-Level Capability filter when company changes
  useEffect(() => {
    // Close filter dialog and reset selection initialization
    setTopLevelFilterDialogOpen(false)
    setSelectedTopLevelCapabilities(new Set())
    setHasInitializedSelection(false)
  }, [selectedCompanyId])

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

  // Get all top-level capabilities from filtered data
  const allTopLevelCapabilities = useMemo(() => {
    if (!filteredCapabilities) return []
    return findTopLevelCapabilities(filteredCapabilities)
  }, [filteredCapabilities])

  // Initialize selected top-level capabilities when data changes (select all by default, only once)
  useEffect(() => {
    if (allTopLevelCapabilities.length > 0 && !hasInitializedSelection) {
      const allIds = new Set(allTopLevelCapabilities.map(cap => cap.id))
      setSelectedTopLevelCapabilities(allIds)
      setHasInitializedSelection(true)
    }
  }, [allTopLevelCapabilities, hasInitializedSelection])

  // Filter capabilities based on selected top-level capabilities
  const finalFilteredCapabilities = useMemo(() => {
    if (!filteredCapabilities || selectedTopLevelCapabilities.size === 0) {
      return filteredCapabilities
    }

    // Create a recursive function to collect all descendants of selected top-level capabilities
    const collectCapabilityTree = (capability: any, allCapabilities: any[]): any[] => {
      const result = [capability]

      // Find all children of this capability
      const children = allCapabilities.filter(
        cap => cap.parents && cap.parents.some((parent: any) => parent.id === capability.id)
      )

      // Recursively collect children and their descendants
      children.forEach(child => {
        result.push(...collectCapabilityTree(child, allCapabilities))
      })

      return result
    }

    // Collect all capabilities that should be included
    const includedCapabilities = new Set()

    // Start with selected top-level capabilities and collect their entire trees
    allTopLevelCapabilities.forEach(topLevel => {
      if (selectedTopLevelCapabilities.has(topLevel.id)) {
        const tree = collectCapabilityTree(topLevel, filteredCapabilities)
        tree.forEach(cap => includedCapabilities.add(cap.id))
      }
    })

    // Filter the original list to only include capabilities in our set
    return filteredCapabilities.filter(cap => includedCapabilities.has(cap.id))
  }, [filteredCapabilities, selectedTopLevelCapabilities, allTopLevelCapabilities])

  const handleGenerate = async () => {
    if (!data?.businessCapabilities) {
      console.warn('Keine Capability-Daten verfügbar')
      return
    }

    // Use final filtered capabilities (including top-level filter)
    const capabilitiesToUse = finalFilteredCapabilities || data.businessCapabilities

    try {
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
  const renderedCapabilitiesCount = finalFilteredCapabilities
    ? calculateRenderedCapabilitiesCount(finalFilteredCapabilities, settings)
    : 0

  // Calculate displayed applications count (using the corrected rollup logic)
  const totalApplicationsCount = finalFilteredCapabilities
    ? calculateDisplayedApplicationsCount(finalFilteredCapabilities, settings)
    : 0

  // Calculate applications with capability assignment
  const applicationsWithCapabilityCount = finalFilteredCapabilities
    ? (() => {
        const uniqueApps = new Set()
        finalFilteredCapabilities.forEach((cap: any) => {
          if (cap.supportedByApplications) {
            cap.supportedByApplications.forEach((app: any) => uniqueApps.add(app.id))
          }
        })
        return uniqueApps.size
      })()
    : 0

  // Calculate displayed AI components count (using the corrected rollup logic)
  const totalAiComponentsCount = finalFilteredCapabilities
    ? calculateDisplayedAiComponentsCount(finalFilteredCapabilities, settings)
    : 0

  // Calculate AI components with capability assignment
  const aiComponentsWithCapabilityCount = finalFilteredCapabilities
    ? (() => {
        const uniqueAiComponents = new Set()
        finalFilteredCapabilities.forEach((cap: any) => {
          if (cap.supportedByAIComponents) {
            cap.supportedByAIComponents.forEach((ai: any) => uniqueAiComponents.add(ai.id))
          }
        })
        return uniqueAiComponents.size
      })()
    : 0

  // Handler functions for the top-level filter dialog
  const handleOpenTopLevelFilter = () => {
    setTopLevelFilterDialogOpen(true)
  }

  const handleCloseTopLevelFilter = () => {
    setTopLevelFilterDialogOpen(false)
  }

  const handleTopLevelCapabilityToggle = (capabilityId: string) => {
    setSelectedTopLevelCapabilities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(capabilityId)) {
        newSet.delete(capabilityId)
      } else {
        newSet.add(capabilityId)
      }
      return newSet
    })
  }

  const handleSelectAllTopLevel = () => {
    const allIds = new Set(allTopLevelCapabilities.map(cap => cap.id))
    setSelectedTopLevelCapabilities(allIds)
  }

  const handleDeselectAllTopLevel = () => {
    setSelectedTopLevelCapabilities(new Set())
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dialogs.capabilityMap.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" gutterBottom>
              {t('dialogs.capabilityMap.description')}
            </Typography>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {t('dialogs.capabilityMap.loadingData')}
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {t('dialogs.capabilityMap.errorLoadingData')}: {error.message}
              </Alert>
            )}

            <Box sx={{ mt: 3, mb: 2 }}>
              <DatePicker
                label={t('dialogs.capabilityMap.dateLabel')}
                value={filterDate}
                onChange={newValue => setFilterDate(newValue)}
                format={dateFormat}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: t('dialogs.capabilityMap.dateHelperText'),
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
                      {data.businessCapabilities.length}{' '}
                      {t('dialogs.capabilityMap.capabilitiesTotal')}
                    </Typography>
                    {filterDate && (
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <BusinessCapabilityIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                        {filteredCapabilities?.length || 0}{' '}
                        {t('dialogs.capabilityMap.capabilitiesFiltered', {
                          date: filterDate.format(dateFormat),
                        })}
                      </Typography>
                    )}
                    {allTopLevelCapabilities.length > 0 && (
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <BusinessCapabilityIcon sx={{ color: '#9c27b0', fontSize: 16 }} />
                        {selectedTopLevelCapabilities.size}{' '}
                        {t('dialogs.capabilityMap.topLevelSelected', {
                          total: allTopLevelCapabilities.length,
                        })}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <BusinessCapabilityIcon sx={{ color: '#388e3c', fontSize: 16 }} />
                      {finalFilteredCapabilities?.length || 0}{' '}
                      {t('dialogs.capabilityMap.capabilitiesAfterFilters')}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <BusinessCapabilityIcon sx={{ color: '#388e3c', fontSize: 16 }} />
                      {renderedCapabilitiesCount} {t('dialogs.capabilityMap.capabilitiesDisplayed')}
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
                            {t('dialogs.capabilityMap.applicationsTotal')}
                          </Typography>
                        )}
                        {applicationsWithCapabilityCount > 0 && (
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <ApplicationComponentIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                            {applicationsWithCapabilityCount}{' '}
                            {t('dialogs.capabilityMap.applicationsWithCapability')}
                          </Typography>
                        )}
                        {totalApplicationsCount > 0 && (
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <ApplicationComponentIcon sx={{ color: '#388e3c', fontSize: 16 }} />
                            {totalApplicationsCount}{' '}
                            {t('dialogs.capabilityMap.applicationsDisplayed')}
                          </Typography>
                        )}
                      </>
                    )}

                    {settings.includeAiComponents && (
                      <>
                        {aiCountData && (
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <AIComponentIcon sx={{ color: '#9c27b0', fontSize: 16 }} />
                            {aiCountData.aiComponents?.length || 0}{' '}
                            {t('dialogs.capabilityMap.aiComponentsTotal')}
                          </Typography>
                        )}
                        {aiComponentsWithCapabilityCount > 0 && (
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <AIComponentIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                            {aiComponentsWithCapabilityCount}{' '}
                            {t('dialogs.capabilityMap.aiComponentsWithCapability')}
                          </Typography>
                        )}
                        {totalAiComponentsCount > 0 && (
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <AIComponentIcon sx={{ color: '#388e3c', fontSize: 16 }} />
                            {totalAiComponentsCount}{' '}
                            {t('dialogs.capabilityMap.aiComponentsDisplayed')}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Alert>

                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      label={t('dialogs.capabilityMap.maxLevelsLabel')}
                      type="number"
                      value={settings.maxLevels}
                      onChange={e =>
                        handleSettingChange('maxLevels', parseInt(e.target.value) || 1)
                      }
                      inputProps={{ min: 1, max: 5 }}
                      fullWidth
                      margin="normal"
                      helperText={t('dialogs.capabilityMap.maxLevelsHelperText')}
                    />
                    <Tooltip title={t('dialogs.capabilityMap.filterTooltip')}>
                      <IconButton
                        onClick={handleOpenTopLevelFilter}
                        sx={{ mt: 2 }}
                        color="primary"
                        disabled={allTopLevelCapabilities.length === 0}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.includeApplications}
                        onChange={e => handleSettingChange('includeApplications', e.target.checked)}
                      />
                    }
                    label={t('dialogs.capabilityMap.includeApplicationsLabel')}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.includeAiComponents}
                        onChange={e => handleSettingChange('includeAiComponents', e.target.checked)}
                      />
                    }
                    label={t('dialogs.capabilityMap.includeAiComponentsLabel')}
                  />

                  <TextField
                    label={t('dialogs.capabilityMap.horizontalSpacingLabel')}
                    type="number"
                    value={settings.horizontalSpacing}
                    onChange={e =>
                      handleSettingChange('horizontalSpacing', parseInt(e.target.value) || 10)
                    }
                    inputProps={{ min: 10, max: 500 }}
                    fullWidth
                    margin="normal"
                    helperText={t('dialogs.capabilityMap.horizontalSpacingHelperText')}
                  />

                  <TextField
                    label={t('dialogs.capabilityMap.verticalSpacingLabel')}
                    type="number"
                    value={settings.verticalSpacing}
                    onChange={e =>
                      handleSettingChange('verticalSpacing', parseInt(e.target.value) || 10)
                    }
                    inputProps={{ min: 10, max: 300 }}
                    fullWidth
                    margin="normal"
                    helperText={t('dialogs.capabilityMap.verticalSpacingHelperText')}
                  />
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{tCommon('cancel')}</Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={loading || !data?.businessCapabilities}
          >
            {t('dialogs.capabilityMap.generateButton')}
          </Button>{' '}
        </DialogActions>
      </Dialog>

      {/* Top-Level Capability Filter Dialog */}
      <Dialog
        open={topLevelFilterDialogOpen}
        onClose={handleCloseTopLevelFilter}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('dialogs.capabilityMap.topLevelFilter.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('dialogs.capabilityMap.topLevelFilter.description')}
            </Typography>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Button size="small" onClick={handleSelectAllTopLevel} sx={{ mr: 1 }}>
                {t('dialogs.capabilityMap.topLevelFilter.selectAll')}
              </Button>
              <Button size="small" onClick={handleDeselectAllTopLevel}>
                {t('dialogs.capabilityMap.topLevelFilter.deselectAll')}
              </Button>
            </Box>

            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {allTopLevelCapabilities.map(capability => (
                <Box
                  key={capability.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 1,
                  }}
                >
                  <Checkbox
                    checked={selectedTopLevelCapabilities.has(capability.id)}
                    onChange={() => handleTopLevelCapabilityToggle(capability.id)}
                    sx={{ mt: 0, pt: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0, ml: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {capability.name}
                    </Typography>
                    {capability.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        {capability.description}
                      </Typography>
                    )}
                    {capability.type && (
                      <Typography variant="caption" color="primary" display="block">
                        {t('dialogs.capabilityMap.topLevelFilter.type', { type: capability.type })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}

              {allTopLevelCapabilities.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  {t('dialogs.capabilityMap.topLevelFilter.noCapabilities')}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>
                  {t('dialogs.capabilityMap.topLevelFilter.selectedCount', {
                    selected: selectedTopLevelCapabilities.size,
                    total: allTopLevelCapabilities.length,
                  })}
                </strong>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTopLevelFilter}>
            {t('dialogs.capabilityMap.topLevelFilter.done')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}

export default CapabilityMapGenerator
