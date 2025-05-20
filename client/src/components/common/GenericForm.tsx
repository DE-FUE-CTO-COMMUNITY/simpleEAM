'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Tabs,
  Tab,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  FormHelperText,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Chip,
  Autocomplete,
  DialogContentText,
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import type { SxProps, Theme } from '@mui/material'
import type { FormApi } from '@tanstack/react-form'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { isArchitect } from '@/lib/auth'

/**
 * Konfiguration für Tabs in der Form
 */
export interface TabConfig {
  id: string
  label: string
}

/**
 * Feldtypen die unterstützt werden
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'autocomplete'
  | 'tags'
  | 'custom'

/**
 * Option für Select und Autocomplete Felder
 */
export interface SelectOption {
  value: string | number | boolean | null
  label: string
  [key: string]: any // Erlaubt zusätzliche Eigenschaften für komplexere Optionen
}

/**
 * Konfiguration für ein Formularfeld
 */
export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  tabId?: string // ID des Tabs, dem das Feld zugeordnet ist
  size?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  options?: SelectOption[]
  multiline?: boolean
  rows?: number
  defaultValue?: any
  placeholder?: string
  helperText?: string
  customRender?: (field: any, disabled: boolean) => React.ReactNode
  validators?: any
  fullWidth?: boolean
  freeSolo?: boolean // Für Autocomplete
  multiple?: boolean // Für Autocomplete mit mehreren Werten
  getOptionLabel?: (option: any) => string // Für Autocomplete
  isOptionEqualToValue?: (option: any, value: any) => boolean // Für korrekten Objektvergleich in Autocomplete
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: any) => React.ReactNode // Für benutzerdefinierte Darstellung von Optionen
  loadingOptions?: boolean // Für Autocomplete während des Ladens
  loadingText?: string // Text während des Ladens
}

/**
 * Props für die GenericForm-Komponente
 */
export interface GenericFormProps {
  title?: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> | void
  isLoading?: boolean
  mode: 'create' | 'edit' | 'view'
  fields: FieldConfig[]
  tabs?: TabConfig[]
  initialValues?: any
  validators?: any
  submitButtonText?: string
  cancelButtonText?: string
  formWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  enableDelete?: boolean
  onDelete?: (id?: string) => Promise<void> | void
  deleteButtonText?: string
  deleteConfirmationText?: string
  disableSubmitOnErrors?: boolean
  sx?: SxProps<Theme>
  form: FormApi<any, any, any, any, any, any, any, any, any, any>
  onEditMode?: () => void
  entityId?: string
  entityName?: string
  metadata?: {
    createdAt?: string
    updatedAt?: string
  }
}

// Helper für Tab Accessibility Props
function a11yProps(index: number) {
  return {
    id: `form-tab-${index}`,
    'aria-controls': `form-tabpanel-${index}`,
  }
}

// Tab Panel Komponente
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

/**
 * Hilfsfunktion zur Formatierung von Validierungsfehlern
 */
function formatValidationError(error: unknown): string {
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

/**
 * Generische Formular-Komponente, die Tabs und Felder dynamisch rendert
 */
const GenericForm: React.FC<GenericFormProps> = ({
  title,
  isOpen,
  onClose,
  onSubmit: _submitFn,
  isLoading = false,
  mode,
  fields,
  tabs,
  initialValues: _initialValues,
  submitButtonText,
  cancelButtonText,
  formWidth = 'md',
  enableDelete = false,
  onDelete,
  deleteButtonText = 'Löschen',
  deleteConfirmationText = 'Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?',
  disableSubmitOnErrors = true,
  sx,
  form,
  onEditMode,
  entityId,
  entityName = 'Eintrag',
  metadata,
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  // Handler für Tab-Wechsel
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  // Handler für Löschen
  const handleDelete = async () => {
    if (entityId && onDelete) {
      try {
        await onDelete(entityId)
        setShowDeleteConfirm(false)
        onClose()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fehler beim Löschen:', error)
        setShowDeleteConfirm(false)
      }
    } else if (onDelete) {
      try {
        await onDelete()
        setShowDeleteConfirm(false)
        onClose()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fehler beim Löschen:', error)
        setShowDeleteConfirm(false)
      }
    }
  }

  // Dialogtitel basierend auf dem Modus
  const getDialogTitle = () => {
    if (title) return title
    if (isCreateMode) return `Neuen ${entityName} erstellen`
    if (isEditMode) return `${entityName} bearbeiten`
    return `${entityName} Details`
  }

  // Gruppiere Felder nach Tabs oder ohne Tab-Zuordnung
  const groupFieldsByTab = () => {
    if (!tabs || tabs.length === 0) {
      return { noTab: fields }
    }

    const fieldsByTab: Record<string, FieldConfig[]> = {}

    // Initialisiere für jeden Tab eine leere Array
    tabs.forEach(tab => {
      fieldsByTab[tab.id] = []
    })

    // Füge Felder dem entsprechenden Tab hinzu
    fields.forEach(field => {
      if (field.tabId && fieldsByTab[field.tabId]) {
        fieldsByTab[field.tabId].push(field)
      } else if (!field.tabId) {
        // Felder ohne Tab-Zuordnung kommen in den ersten Tab
        const firstTabId = tabs[0]?.id
        if (firstTabId) {
          fieldsByTab[firstTabId].push(field)
        }
      }
    })

    return fieldsByTab
  }

  const fieldsByTab = groupFieldsByTab()

  // Rendert ein einzelnes Feld basierend auf dem Feld-Typ
  const renderField = (field: FieldConfig) => {
    // Berechne die Grid-Props gemäß Grid v2 API-Richtlinien
    // In Grid v2 wird 'size' statt xs/sm/md verwendet
    let sizeProps: any = {}

    if (typeof field.size === 'object') {
      // Wenn size ein Objekt ist, verwende direkt als size-Prop
      sizeProps = { size: field.size }
    } else if (typeof field.size === 'number') {
      // Wenn size eine Zahl ist, verwende sie direkt
      sizeProps = { size: field.size }
    } else {
      // Fallback auf volle Breite
      sizeProps = { size: 12 }
    }

    return (
      <Grid key={field.name} {...sizeProps}>
        {/* @ts-expect-error - TanStack Form-API-Typen sind nicht vollständig */}
        {form.Field && (
          <form.Field name={field.name} validators={field.validators}>
            {(formField: any) => {
              // Für benutzerdefinierte Rendering-Funktion
              if (field.customRender) {
                return field.customRender(formField, isViewMode || isLoading || !!field.disabled)
              }

              const disabled = isViewMode || isLoading || !!field.disabled
              const isError = formField.state.meta.isTouched && !formField.state.meta.isValid

              return (
                <FormControl fullWidth={field.fullWidth !== false} error={isError} sx={{ mb: 2 }}>
                  <FormLabel>
                    {field.label}
                    {field.required ? ' *' : ''}
                  </FormLabel>

                  {field.type === 'textarea' && (
                    <TextField
                      value={formField.state.value === null ? '' : formField.state.value}
                      onChange={e => formField.handleChange(e.target.value)}
                      onBlur={formField.handleBlur}
                      disabled={disabled}
                      multiline
                      rows={field.rows || 4}
                      error={isError}
                      placeholder={field.placeholder}
                      fullWidth={field.fullWidth !== false}
                      InputProps={{ readOnly: !!field.readOnly }}
                    />
                  )}

                  {field.type === 'select' && (
                    <TextField
                      value={formField.state.value === null ? '' : formField.state.value}
                      onChange={e => formField.handleChange(e.target.value)}
                      onBlur={formField.handleBlur}
                      disabled={disabled}
                      select
                      error={isError}
                      fullWidth={field.fullWidth !== false}
                      InputProps={{ readOnly: !!field.readOnly }}
                    >
                      {field.options?.map(option => (
                        <MenuItem key={String(option.value)} value={option.value as any}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}

                  {field.type === 'number' && (
                    <TextField
                      type="number"
                      value={formField.state.value === null ? '' : formField.state.value}
                      onChange={e => {
                        const value = e.target.value === '' ? null : Number(e.target.value)
                        formField.handleChange(value)
                      }}
                      onBlur={formField.handleBlur}
                      disabled={disabled}
                      error={isError}
                      placeholder={field.placeholder}
                      fullWidth={field.fullWidth !== false}
                      InputProps={{ readOnly: !!field.readOnly }}
                    />
                  )}

                  {field.type === 'date' && (
                    <DatePicker
                      value={formField.state.value ? dayjs(formField.state.value) : null}
                      onChange={newValue => {
                        // Statt den ISO-String zu verwenden, erstellen wir ein Date-Objekt
                        // Das passt besser zum Zod-Schema, das z.date() erwartet
                        formField.handleChange(newValue ? newValue.toDate() : null)
                      }}
                      disabled={disabled}
                      slotProps={{
                        textField: {
                          fullWidth: field.fullWidth !== false,
                          error: isError,
                          helperText: isError
                            ? formField.state.meta.errors.join(', ')
                            : field.helperText,
                          onBlur: formField.handleBlur,
                          InputProps: { readOnly: !!field.readOnly },
                          required: !!field.required,
                        },
                        field: {
                          clearable: true,
                        },
                      }}
                      format="DD.MM.YYYY"
                    />
                  )}

                  {field.type === 'datetime' && (
                    <DateTimePicker
                      label={field.label}
                      value={formField.state.value ? dayjs(formField.state.value) : null}
                      onChange={newValue => {
                        // Statt das Dayjs-Objekt direkt zu verwenden, erstellen wir ein Date-Objekt
                        // Das passt besser zum Zod-Schema, das z.date() erwartet
                        formField.handleChange(newValue ? newValue.toDate() : null)
                      }}
                      disabled={disabled}
                      slotProps={{
                        textField: {
                          fullWidth: field.fullWidth !== false,
                          error: isError,
                          helperText: isError
                            ? formField.state.meta.errors.join(', ')
                            : field.helperText,
                          onBlur: formField.handleBlur,
                          InputProps: { readOnly: !!field.readOnly },
                          required: !!field.required,
                        },
                        field: {
                          clearable: true,
                        },
                      }}
                      format="DD.MM.YYYY HH:mm"
                    />
                  )}

                  {field.type === 'autocomplete' && (
                    <Autocomplete
                      options={field.options || []}
                      value={formField.state.value}
                      onChange={(_, newValue) => formField.handleChange(newValue)}
                      disabled={disabled}
                      multiple={field.multiple}
                      freeSolo={field.freeSolo}
                      getOptionLabel={
                        field.getOptionLabel ||
                        (option => (typeof option === 'string' ? option : option?.label || ''))
                      }
                      isOptionEqualToValue={
                        field.isOptionEqualToValue ||
                        ((option, value) => {
                          // Standard-Implementierung für Objektvergleich
                          if (option === value) return true
                          if (!option || !value) return false

                          // Prüfe, ob es sich um Objekte handelt
                          const isOptionObject = typeof option === 'object' && option !== null
                          const isValueObject = typeof value === 'object' && value !== null

                          // Wenn beides Objekte sind
                          if (isOptionObject && isValueObject) {
                            // Wenn Objekte IDs haben, vergleiche nach ID
                            if ('id' in option && 'id' in value) {
                              return option.id === value.id
                            }

                            // Vergleich nach value (für SelectOption-Objekte)
                            if ('value' in option && 'value' in value) {
                              return option.value === value.value
                            }
                          }

                          // Wenn option ein Objekt ist und value ein primitiver Wert
                          if (isOptionObject && 'value' in option) {
                            return option.value === value
                          }

                          // Wenn value ein Objekt ist und option ein primitiver Wert
                          if (isValueObject && 'value' in value) {
                            return option === value.value
                          }

                          return false
                        })
                      }
                      loading={field.loadingOptions}
                      loadingText={field.loadingText || 'Wird geladen...'}
                      renderOption={field.renderOption}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={isError}
                          placeholder={field.placeholder}
                          InputProps={{
                            ...params.InputProps,
                            readOnly: !!field.readOnly,
                          }}
                          onBlur={formField.handleBlur}
                        />
                      )}
                    />
                  )}

                  {field.type === 'tags' && (
                    <Autocomplete
                      multiple
                      freeSolo
                      options={field.options?.map(o => o.label) || []}
                      value={formField.state.value || []}
                      onChange={(_, newValue) => formField.handleChange(newValue)}
                      disabled={disabled}
                      isOptionEqualToValue={(option, value) => option === value}
                      renderValue={(value, getItemProps) =>
                        value.map((option, index) => {
                          const itemProps = getItemProps({ index })
                          return (
                            <Chip
                              variant="outlined"
                              key={itemProps.key}
                              label={option}
                              disabled={isViewMode || isLoading}
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
                          error={isError}
                          placeholder={field.placeholder}
                          InputProps={{
                            ...params.InputProps,
                            readOnly: !!field.readOnly,
                          }}
                          onBlur={formField.handleBlur}
                        />
                      )}
                    />
                  )}

                  {field.type === 'text' && (
                    <TextField
                      value={formField.state.value === null ? '' : formField.state.value}
                      onChange={e => formField.handleChange(e.target.value)}
                      onBlur={formField.handleBlur}
                      disabled={disabled}
                      error={isError}
                      placeholder={field.placeholder}
                      fullWidth={field.fullWidth !== false}
                      multiline={field.multiline}
                      rows={field.rows}
                      InputProps={{ readOnly: !!field.readOnly }}
                    />
                  )}

                  <FormHelperText>
                    {isError
                      ? formatValidationError(formField.state.meta.errors)
                      : field.helperText || ''}
                  </FormHelperText>
                </FormControl>
              )
            }}
          </form.Field>
        )}
        {/* Fallback, wenn form.Field nicht vorhanden ist */}
        {!form.Field && <Typography color="error">Form field rendering error</Typography>}
      </Grid>
    )
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={isViewMode ? onClose : undefined}
        maxWidth={formWidth}
        fullWidth
        sx={sx}
      >
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            if (!isViewMode) {
              // Die Formularübermittlung erfolgt über form.handleSubmit()
              void form.handleSubmit()
            }
          }}
        >
          <DialogContent>
            {tabs && tabs.length > 0 ? (
              <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="Formular Tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {tabs.map((tab, index) => (
                      <Tab key={tab.id} label={tab.label} {...a11yProps(index)} />
                    ))}
                  </Tabs>
                </Box>

                {tabs.map((tab, index) => (
                  <TabPanel key={tab.id} value={activeTab} index={index}>
                    <Grid container spacing={2}>
                      {fieldsByTab[tab.id]?.map(field => renderField(field))}
                    </Grid>
                  </TabPanel>
                ))}
              </>
            ) : (
              <Grid container spacing={2}>
                {fields.map(field => renderField(field))}
              </Grid>
            )}

            {/* Metadaten anzeigen im View-Modus */}
            {isViewMode && metadata && (
              <Box mt={3}>
                <Divider sx={{ my: 2 }} />
                {metadata.createdAt && (
                  <Typography variant="subtitle2" gutterBottom>
                    Erstellt am: {new Date(metadata.createdAt).toLocaleString()}
                  </Typography>
                )}
                {metadata.updatedAt && (
                  <Typography variant="subtitle2">
                    Aktualisiert am: {new Date(metadata.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {enableDelete && isEditMode && isArchitect() && (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  color="error"
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  disabled={isLoading}
                >
                  {deleteButtonText}
                </Button>
              )}
            </div>
            <div>
              <Button
                onClick={onClose}
                color="inherit"
                disabled={isLoading}
                startIcon={<CancelIcon />}
              >
                {cancelButtonText || (isViewMode ? 'Schließen' : 'Abbrechen')}
              </Button>
              {!isViewMode && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isLoading ? undefined : <SaveIcon />}
                  disabled={isLoading || (disableSubmitOnErrors && !form.state.canSubmit)}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Wird gespeichert...
                    </>
                  ) : (
                    submitButtonText || (isCreateMode ? 'Erstellen' : 'Speichern')
                  )}
                </Button>
              )}
              {isViewMode && onEditMode && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onEditMode}
                  startIcon={<EditIcon />}
                >
                  Bearbeiten
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>

      {/* Lösch-Bestätigungsdialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Löschen bestätigen</DialogTitle>
        <DialogContent>
          <DialogContentText>{deleteConfirmationText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)} color="inherit">
            Abbrechen
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GenericForm
