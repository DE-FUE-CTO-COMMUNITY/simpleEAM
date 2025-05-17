'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'

// Hilfsfunktion zur Formatierung von Fehlermeldungen
const formatValidationError = (error: unknown): string => {
  if (!error) return ''
  if (Array.isArray(error)) return error.join(', ')
  if (typeof error === 'object' && error !== null) {
    // Rekursiv verschachtelte Objekte durchlaufen
    const messages: string[] = []
    const processObject = (obj: Record<string, unknown>) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'string') {
          messages.push(value)
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string') {
              messages.push(item)
            } else if (typeof item === 'object' && item !== null) {
              processObject(item as Record<string, unknown>)
            }
          })
        } else if (typeof value === 'object' && value !== null) {
          processObject(value as Record<string, unknown>)
        }
      })
    }

    processObject(error as Record<string, unknown>)
    return messages.join(', ')
  }
  return String(error)
}

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Dialog,
  Tabs,
  Tab,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { GET_PERSONS } from '@/graphql/person'
import { GET_CAPABILITIES } from '@/graphql/capability'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Application, ApplicationStatus, CriticalityLevel } from '../../gql/generated'
import { Person, BusinessCapability } from '../../gql/generated'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
export const applicationSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  status: z.nativeEnum(ApplicationStatus),
  criticality: z.nativeEnum(CriticalityLevel),
  costs: z.number().min(0, 'Kosten müssen 0 oder höher sein').optional().nullable(),
  vendor: z
    .string()
    .max(100, 'Der Anbieter darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  version: z
    .string()
    .max(50, 'Die Version darf maximal 50 Zeichen lang sein')
    .optional()
    .nullable(),
  hostingEnvironment: z
    .string()
    .max(100, 'Die Hosting-Umgebung darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  technologyStack: z.array(z.string()).optional().nullable(),
  introductionDate: z.date().optional().nullable(),
  endOfLifeDate: z.date().optional().nullable(),
  ownerId: z.string().optional(),
  supportsCapabilityIds: z.array(z.string()).optional(),
})

// TypeScript Typen basierend auf dem Schema
export type ApplicationFormValues = z.infer<typeof applicationSchema>

export interface ApplicationFormProps {
  application?: Application | null
  availableApplications?: Application[]
  availableTechStack?: string[]
  mode: 'create' | 'edit' | 'view'
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ApplicationFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  loading?: boolean
  onEditMode?: () => void
}

// Interface für Tab-Panel
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// TabPanel-Komponente
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`application-tabpanel-${index}`}
      aria-labelledby={`application-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

// a11y-Hilfsfunktion für Tabs
function a11yProps(index: number) {
  return {
    id: `application-tab-${index}`,
    'aria-controls': `application-tabpanel-${index}`,
  }
}

const getCriticalityLabel = (criticality: CriticalityLevel): string => {
  switch (criticality) {
    case CriticalityLevel.LOW:
      return 'Niedrig'
    case CriticalityLevel.MEDIUM:
      return 'Mittel'
    case CriticalityLevel.HIGH:
      return 'Hoch'
    case CriticalityLevel.CRITICAL:
      return 'Kritisch'
    default:
      return criticality
  }
}

const getStatusLabel = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.ACTIVE:
      return 'Aktiv'
    case ApplicationStatus.IN_DEVELOPMENT:
      return 'In Entwicklung'
    case ApplicationStatus.RETIRED:
      return 'Zurückgezogen'
    default:
      return status
  }
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  availableTechStack = [],
  mode,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  loading = false,
  onEditMode,
}) => {
  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  // GraphQL-Abfrage für Personen (für Owner-Auswahl)
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS)
  const persons = personsData?.people || []

  // GraphQL-Abfrage für Capabilities (für Capability-Auswahl)
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES)
  const capabilities = capabilitiesData?.businessCapabilities || []

  // Zustand für Delete-Dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  // Default-Werte für das Formular
  const defaultValues: ApplicationFormValues = {
    name: application?.name ?? '',
    description: application?.description ?? '',
    status: application?.status ?? ApplicationStatus.ACTIVE,
    criticality: application?.criticality ?? CriticalityLevel.MEDIUM,
    costs: application?.costs ?? null,
    vendor: application?.vendor ?? '',
    version: application?.version ?? '',
    hostingEnvironment: application?.hostingEnvironment ?? '',
    technologyStack: application?.technologyStack ?? [],
    introductionDate: application?.introductionDate ? new Date(application.introductionDate) : null,
    endOfLifeDate: application?.endOfLifeDate ? new Date(application.endOfLifeDate) : null,
    ownerId: application?.owners && application.owners.length > 0 ? application.owners[0].id : '',
    supportsCapabilityIds:
      application?.supportsCapabilities && application.supportsCapabilities.length > 0
        ? application.supportsCapabilities.map(cap => cap.id)
        : [],
  }

  // Titel für den Dialog basierend auf dem Modus
  const getDialogTitle = () => {
    if (isCreateMode) return 'Neue Applikation erstellen'
    if (isEditMode) return 'Applikation bearbeiten'
    return 'Applikation Details'
  }

  // Handler für das Löschen
  const handleDelete = async () => {
    if (application?.id && onDelete) {
      try {
        await onDelete(application.id)
      } catch (error) {
        console.error('Error deleting application:', error)
      } finally {
        setShowDeleteConfirm(false)
        onClose()
      }
    }
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value)
        onClose() // Dialog schließen nach erfolgreicher Übermittlung
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
    validators: {
      // Formularvalidierung mit Zod Schema
      onChange: applicationSchema,
    },
  })

  // Wenn die Anwendungsdaten aktualisiert werden, aktualisiere auch die Formular-Werte
  useEffect(() => {
    if (application) {
      form.reset({
        name: application.name,
        description: application.description || '',
        status: application.status,
        criticality: application.criticality,
        costs: application.costs || null,
        vendor: application.vendor || '',
        version: application.version || '',
        hostingEnvironment: application.hostingEnvironment || '',
        technologyStack: application.technologyStack || [],
        introductionDate: application.introductionDate
          ? new Date(application.introductionDate)
          : null,
        endOfLifeDate: application.endOfLifeDate ? new Date(application.endOfLifeDate) : null,
        ownerId:
          application.owners && application.owners.length > 0 ? application.owners[0].id : '',
        supportsCapabilityIds:
          application.supportsCapabilities && application.supportsCapabilities.length > 0
            ? application.supportsCapabilities.map(cap => cap.id)
            : [],
      })
    }
  }, [application, form])

  // State für aktiven Tab
  const [activeTab, setActiveTab] = useState(0)

  // Handler für Tab-Wechsel
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <Dialog open={isOpen} onClose={isViewMode ? onClose : undefined} maxWidth="md" fullWidth>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            if (!isViewMode) {
              void form.handleSubmit()
            }
          }}
        >
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Applikation Formulartabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Allgemeine Informationen" {...a11yProps(0)} />
                <Tab label="Technische Details" {...a11yProps(1)} />
                <Tab label="Zeitliche Informationen" {...a11yProps(2)} />
                <Tab label="Beziehungen" {...a11yProps(3)} />
              </Tabs>
            </Box>

            {/* Tab 1: Allgemeine Informationen */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="name"
                    validators={{
                      onChange: applicationSchema.shape.name,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Name *</FormLabel>
                        <TextField
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="status"
                    validators={{
                      onChange: applicationSchema.shape.status,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Status *</FormLabel>
                        <TextField
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value as ApplicationStatus)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          select
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        >
                          {Object.values(ApplicationStatus).map(status => (
                            <MenuItem key={status} value={status}>
                              {getStatusLabel(status)}
                            </MenuItem>
                          ))}
                        </TextField>
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={12}>
                  <form.Field
                    name="description"
                    validators={{
                      onChange: applicationSchema.shape.description,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Beschreibung *</FormLabel>
                        <TextField
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          multiline
                          rows={4}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="criticality"
                    validators={{
                      onChange: applicationSchema.shape.criticality,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Kritikalität *</FormLabel>
                        <TextField
                          value={field.state.value}
                          onChange={e => field.handleChange(e.target.value as CriticalityLevel)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          select
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        >
                          {Object.values(CriticalityLevel).map(level => (
                            <MenuItem key={level} value={level}>
                              {getCriticalityLabel(level)}
                            </MenuItem>
                          ))}
                        </TextField>
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="costs"
                    validators={{
                      onChange: applicationSchema.shape.costs,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Kosten</FormLabel>
                        <TextField
                          type="number"
                          value={field.state.value === null ? '' : field.state.value}
                          onChange={e => {
                            const value = e.target.value === '' ? null : Number(e.target.value)
                            field.handleChange(value)
                          }}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="ownerId"
                    validators={{
                      onChange: applicationSchema.shape.ownerId,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Verantwortlicher</FormLabel>
                        <TextField
                          value={field.state.value || ''}
                          onChange={e => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading || personsLoading}
                          select
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        >
                          <MenuItem value="">
                            <em>Keiner</em>
                          </MenuItem>
                          {persons.map((person: Person) => (
                            <MenuItem key={person.id} value={person.id}>
                              {person.firstName} {person.lastName}
                            </MenuItem>
                          ))}
                        </TextField>
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 2: Technische Details */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="vendor"
                    validators={{
                      onChange: applicationSchema.shape.vendor,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Hersteller</FormLabel>
                        <TextField
                          value={field.state.value === null ? '' : field.state.value}
                          onChange={e => field.handleChange(e.target.value || null)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="version"
                    validators={{
                      onChange: applicationSchema.shape.version,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Version</FormLabel>
                        <TextField
                          value={field.state.value === null ? '' : field.state.value}
                          onChange={e => field.handleChange(e.target.value || null)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={12}>
                  <form.Field
                    name="hostingEnvironment"
                    validators={{
                      onChange: applicationSchema.shape.hostingEnvironment,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Hosting-Umgebung</FormLabel>
                        <TextField
                          value={field.state.value === null ? '' : field.state.value}
                          onChange={e => field.handleChange(e.target.value || null)}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={12}>
                  <form.Field
                    name="technologyStack"
                    validators={{
                      onChange: applicationSchema.shape.technologyStack,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Technologie-Stack</FormLabel>
                        <Autocomplete
                          multiple
                          options={availableTechStack}
                          value={field.state.value || []}
                          onChange={(_, newValue) => field.handleChange(newValue)}
                          disabled={isViewMode || loading}
                          freeSolo
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                                disabled={isViewMode || loading}
                              />
                            ))
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={field.state.meta.isTouched && !field.state.meta.isValid}
                            />
                          )}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 3: Zeitliche Informationen */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="introductionDate"
                    validators={{
                      onChange: applicationSchema.shape.introductionDate,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Einführungsdatum</FormLabel>
                        <TextField
                          type="date"
                          value={
                            field.state.value
                              ? new Date(field.state.value).toISOString().split('T')[0]
                              : ''
                          }
                          onChange={e => {
                            const date = e.target.value ? new Date(e.target.value) : null
                            field.handleChange(date)
                          }}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <form.Field
                    name="endOfLifeDate"
                    validators={{
                      onChange: applicationSchema.shape.endOfLifeDate,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>End-of-Life-Datum</FormLabel>
                        <TextField
                          type="date"
                          value={
                            field.state.value
                              ? new Date(field.state.value).toISOString().split('T')[0]
                              : ''
                          }
                          onChange={e => {
                            const date = e.target.value ? new Date(e.target.value) : null
                            field.handleChange(date)
                          }}
                          onBlur={field.handleBlur}
                          disabled={isViewMode || loading}
                          error={field.state.meta.isTouched && !field.state.meta.isValid}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 4: Beziehungen */}
            <TabPanel value={activeTab} index={3}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <form.Field
                    name="supportsCapabilityIds"
                    validators={{
                      onChange: applicationSchema.shape.supportsCapabilityIds,
                    }}
                  >
                    {field => (
                      <FormControl
                        fullWidth
                        error={field.state.meta.isTouched && !field.state.meta.isValid}
                      >
                        <FormLabel>Unterstützte Business Capabilities</FormLabel>
                        <Autocomplete
                          multiple
                          options={capabilities || []}
                          getOptionLabel={option =>
                            typeof option === 'string'
                              ? option
                              : option.name || 'Unbenannte Capability'
                          }
                          value={
                            field.state.value
                              ? capabilities.filter((cap: BusinessCapability) =>
                                  field.state.value?.includes(cap.id)
                                )
                              : []
                          }
                          onChange={(_, newValue) => {
                            field.handleChange(newValue.map(item => item.id))
                          }}
                          disabled={isViewMode || loading || capabilitiesLoading}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option.name}
                                {...getTagProps({ index })}
                                disabled={isViewMode || loading}
                              />
                            ))
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={field.state.meta.isTouched && !field.state.meta.isValid}
                            />
                          )}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                        <FormHelperText>
                          {field.state.meta.isTouched && field.state.meta.errors
                            ? formatValidationError(field.state.meta.errors)
                            : ''}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </form.Field>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Zeige Erstellungs- und Aktualisierungsdaten im View-Modus an */}
            {isViewMode && application && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Erstellt am: {new Date(application.createdAt).toLocaleString()}
                </Typography>
                {application.updatedAt && (
                  <Typography variant="subtitle2">
                    Aktualisiert am: {new Date(application.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {isEditMode && onDelete && isArchitect() && (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  color="secondary"
                >
                  Löschen
                </Button>
              )}
            </div>
            <div>
              <Button onClick={onClose} startIcon={<CancelIcon />}>
                {isViewMode ? 'Schließen' : 'Abbrechen'}
              </Button>
              {!isViewMode && (
                <Button
                  type="submit"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {isCreateMode ? 'Erstellen' : 'Speichern'}
                </Button>
              )}
              {isViewMode && application && (
                <Button
                  onClick={() => {
                    if (onEditMode) {
                      onEditMode()
                    } else {
                      onClose()
                    }
                  }}
                  startIcon={<EditIcon />}
                  variant="contained"
                  color="primary"
                >
                  Bearbeiten
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>

      {/* Bestätigungsdialog für das Löschen */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Applikation löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sind Sie sicher, dass Sie die Applikation "{application?.name}" löschen möchten? Diese
            Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)} variant="outlined">
            Abbrechen
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            disabled={loading}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ApplicationForm
