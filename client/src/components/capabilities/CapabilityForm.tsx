'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'

// Hilfsfunktion zur korrekten Formatierung von Fehlermeldungen
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
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@mui/material'
import { GET_PERSONS } from '@/graphql/person'
import { Grid } from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { BusinessCapability, CapabilityStatus } from '../../gql/generated'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
export const capabilitySchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  maturityLevel: z
    .number()
    .int()
    .min(0, 'Level muss 0 oder höher sein')
    .max(3, 'Level darf maximal 3 sein'),
  businessValue: z
    .number()
    .int()
    .min(0, 'Geschäftswert muss 0 oder höher sein')
    .max(10, 'Geschäftswert darf maximal 10 sein'),
  status: z.nativeEnum(CapabilityStatus),
  ownerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().optional(),
})

// TypeScript Typen basierend auf dem Schema
export type CapabilityFormValues = z.infer<typeof capabilitySchema>

export interface CapabilityFormProps {
  capability?: BusinessCapability | null
  availableCapabilities?: BusinessCapability[]
  availableTags?: string[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CapabilityFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const getLevelLabel = (level: number | null | undefined): string => {
  if (level === null || level === undefined) {
    return 'Nicht definiert'
  }

  switch (level) {
    case 0:
      return 'Niedrig'
    case 1:
      return 'Mittel'
    case 2:
      return 'Hoch'
    case 3:
      return 'Sehr Hoch'
    default:
      return `Level ${level}`
  }
}

const getStatusLabel = (status: CapabilityStatus): string => {
  switch (status) {
    case CapabilityStatus.ACTIVE:
      return 'Aktiv'
    case CapabilityStatus.PLANNED:
      return 'Geplant'
    case CapabilityStatus.RETIRED:
      return 'Zurückgezogen'
    default:
      return status
  }
}

const CapabilityForm: React.FC<CapabilityFormProps> = ({
  capability,
  availableCapabilities = [],
  availableTags = [],
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  // Personen laden - jetzt sicher an der Wurzel der Komponente
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS)

  // State für den Bestätigungsdialog beim Löschen
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  // Formulardaten initialisieren
  const defaultValues: CapabilityFormValues = {
    name: capability?.name ?? '',
    description: capability?.description ?? '',
    maturityLevel: capability?.maturityLevel ?? 0,
    businessValue: capability?.businessValue ?? 0,
    status: capability?.status ?? CapabilityStatus.ACTIVE,
    ownerId: capability?.owners && capability.owners.length > 0 ? capability.owners[0]?.id : '',
    tags: capability?.tags ?? [],
    parentId: capability?.parents && capability.parents.length > 0 ? capability.parents[0]?.id : '',
  }

  // Dialog-Titel basierend auf dem Modus
  const getDialogTitle = () => {
    if (isCreateMode) return 'Neue Business Capability erstellen'
    if (isEditMode) return 'Business Capability bearbeiten'
    return 'Business Capability Details'
  }

  // Handle-Funktion für das Löschen einer Capability
  const handleDelete = async () => {
    if (capability?.id && onDelete) {
      await onDelete(capability.id)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Formularvalidierung mit Zod Schema
      onChange: capabilitySchema,
      onSubmit: capabilitySchema,
    },
  })

  // Zurücksetzen des Formulars bei Schließen des Dialogs und Aktualisieren bei neuem Capability
  // Extrahiere stabile Werte aus capability, um die Abhängigkeiten zu stabilisieren
  const capabilityName = capability?.name
  const capabilityDescription = capability?.description
  const capabilityMaturityLevel = capability?.maturityLevel
  const capabilityBusinessValue = capability?.businessValue
  const capabilityStatus = capability?.status
  const capabilityOwnerId =
    capability?.owners && capability.owners.length > 0 ? capability.owners[0]?.id : undefined
  const capabilityTags = capability?.tags
  const capabilityParentId =
    capability?.parents && capability.parents.length > 0 ? capability.parents[0]?.id : undefined

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    } else if (capability) {
      // Aktualisiere das Formular bei Änderungen am Capability-Objekt
      form.reset({
        name: capabilityName ?? '',
        description: capabilityDescription ?? '',
        maturityLevel: capabilityMaturityLevel ?? 0,
        businessValue: capabilityBusinessValue ?? 0,
        status: capabilityStatus ?? CapabilityStatus.ACTIVE,
        ownerId: capabilityOwnerId ?? '',
        tags: capabilityTags ?? [],
        parentId: capabilityParentId ?? '',
      })
    }
  }, [
    isOpen,
    form,
    capability,
    capabilityName,
    capabilityDescription,
    capabilityMaturityLevel,
    capabilityBusinessValue,
    capabilityStatus,
    capabilityOwnerId,
    capabilityTags,
    capabilityParentId,
  ])

  return (
    <Dialog open={isOpen} onClose={isViewMode ? onClose : undefined} fullWidth maxWidth="md">
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <DialogContent>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="name"
                validators={{
                  onChange: capabilitySchema.shape.name,
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
            {/* Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="status"
                validators={{
                  onChange: capabilitySchema.shape.status,
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
                      onChange={e => {
                        field.handleChange(e.target.value as CapabilityStatus)
                      }}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      select
                      error={field.state.meta.isTouched && !field.state.meta.isValid}
                    >
                      {Object.values(CapabilityStatus).map(status => (
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
            {/* Beschreibung */}
            <Grid size={{ xs: 12 }}>
              <form.Field
                name="description"
                validators={{
                  onChange: capabilitySchema.shape.description,
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
            {/* Reifegrad */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="maturityLevel"
                validators={{
                  onChange: capabilitySchema.shape.maturityLevel,
                }}
              >
                {field => (
                  <FormControl
                    fullWidth
                    error={field.state.meta.isTouched && !field.state.meta.isValid}
                  >
                    <FormLabel>Reifegrad *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      select
                      error={field.state.meta.isTouched && !field.state.meta.isValid}
                    >
                      {[0, 1, 2, 3].map(level => (
                        <MenuItem key={level} value={level}>
                          {getLevelLabel(level)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FormHelperText>
                      {field.state.meta.isTouched && !field.state.meta.isValid
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : typeof field.state.meta.errors === 'object' &&
                              field.state.meta.errors !== null
                            ? Object.values(field.state.meta.errors).join(', ')
                            : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>
            {/* Geschäftswert */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="businessValue"
                validators={{
                  onChange: capabilitySchema.shape.businessValue,
                }}
              >
                {field => (
                  <FormControl
                    fullWidth
                    error={field.state.meta.isTouched && !field.state.meta.isValid}
                  >
                    <FormLabel>Geschäftswert *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      inputProps={{ min: 0, max: 10 }}
                      error={field.state.meta.isTouched && !field.state.meta.isValid}
                      type="number"
                    />
                    <FormHelperText>
                      {field.state.meta.isTouched && field.state.meta.errors
                        ? formatValidationError(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>{' '}
            {/* Verantwortlicher */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="ownerId"
                validators={{
                  onChange: capabilitySchema.shape.ownerId,
                }}
              >
                {field => (
                  <FormControl
                    fullWidth
                    error={field.state.meta.isTouched && !field.state.meta.isValid}
                  >
                    <FormLabel>Verantwortlicher</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      error={field.state.meta.isTouched && !field.state.meta.isValid}
                      select
                    >
                      <MenuItem value="">Kein Verantwortlicher</MenuItem>
                      {personLoading ? (
                        <MenuItem value="">
                          <CircularProgress size={20} /> Lade Personen...
                        </MenuItem>
                      ) : personData?.people ? (
                        personData.people.map(
                          (person: { id: string; firstName: string; lastName: string }) => (
                            <MenuItem key={person.id} value={person.id}>
                              {`${person.firstName} ${person.lastName}`}
                            </MenuItem>
                          )
                        )
                      ) : null}
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
            {/* Übergeordnete Capability */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="parentId"
                validators={{
                  onChange: capabilitySchema.shape.parentId,
                }}
              >
                {field => (
                  <FormControl
                    fullWidth
                    error={field.state.meta.isTouched && !field.state.meta.isValid}
                  >
                    <FormLabel>Übergeordnete Capability</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      select
                      error={field.state.meta.isTouched && !field.state.meta.isValid}
                    >
                      <MenuItem value="">Keine übergeordnete Capability</MenuItem>
                      {availableCapabilities
                        .filter(cap => cap.id !== capability?.id) // Verhindere Selbstreferenz
                        .map(cap => (
                          <MenuItem key={cap.id} value={cap.id}>
                            {cap.name}
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
            {/* Tags */}
            <Grid size={{ xs: 12 }}>
              <form.Field
                name="tags"
                validators={{
                  onChange: capabilitySchema.shape.tags,
                }}
              >
                {field => (
                  <FormControl
                    fullWidth
                    error={field.state.meta.isTouched && !field.state.meta.isValid}
                  >
                    <FormLabel>Tags</FormLabel>
                    {isViewMode ? (
                      <Box sx={{ mt: 1 }}>
                        {field.state.value && field.state.value.length > 0 ? (
                          field.state.value.map(tag => (
                            <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Keine Tags vorhanden
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Autocomplete
                        multiple
                        options={availableTags}
                        freeSolo
                        value={field.state.value || []}
                        onChange={(_, newValue) => {
                          field.handleChange(newValue as string[])
                        }}
                        renderValue={(value, getItemProps) =>
                          value.map((option, index) => {
                            const itemProps = getItemProps({ index })
                            return (
                              <Chip
                                variant="outlined"
                                key={itemProps.key}
                                label={option}
                                disabled={isViewMode || loading}
                                onDelete={itemProps.onDelete}
                                data-tag-index={itemProps['data-item-index']}
                                tabIndex={itemProps.tabIndex}
                                className={itemProps.className}
                              />
                            )
                          })
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={field.state.meta.isTouched && !field.state.meta.isValid}
                            disabled={loading}
                          />
                        )}
                      />
                    )}
                    <FormHelperText>
                      {field.state.meta.isTouched && field.state.meta.errors
                        ? formatValidationError(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>
            {/* Metadaten anzeigen im View-Modus */}
            {isViewMode && capability && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Erstellt am: {new Date(capability.createdAt).toLocaleString()}
                </Typography>
                {capability.updatedAt && (
                  <Typography variant="subtitle2">
                    Aktualisiert am: {new Date(capability.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {!isViewMode && capability && onDelete && isArchitect() && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowDeleteConfirm(true)}
                startIcon={<DeleteIcon />}
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
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {isCreateMode ? 'Erstellen' : 'Speichern'}
              </Button>
            )}
            {isViewMode && capability && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (onEditMode) {
                    onEditMode()
                  } else {
                    onClose()
                  }
                }}
                startIcon={<EditIcon />}
              >
                Bearbeiten
              </Button>
            )}
          </div>
        </DialogActions>
      </form>
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Business Capability löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Möchten Sie die Business Capability wirklich löschen? Diese Aktion kann nicht rückgängig
            gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Abbrechen</Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default CapabilityForm
