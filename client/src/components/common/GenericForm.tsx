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
  FormLabel,
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
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
// FormApi-Typ wird nicht mehr direkt verwendet; Import entfernt für Kompatibilität
import { isViewer } from '@/lib/auth'
import { Field, useStore } from '@tanstack/react-form'
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
  | 'displayText'

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
  icon?: React.ReactNode // Icon vor dem Feld
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
  getOptionBackgroundColor?: (option: any) => string | undefined // Für farbliche Markierung von Optionen (wird für Chip-Hintergrund verwendet)
  loadingOptions?: boolean // Für Autocomplete während des Ladens
  loadingText?: string // Text während des Ladens
  onChange?: (value: any) => void // Callback für Feldwert-Änderungen
  // Eigenschaften für displayText
  variant?:
    | 'body1'
    | 'body2'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'caption'
    | 'overline' // Typography-Variante für displayText
  preserveWhitespace?: boolean // Leerzeichen in displayText beibehalten
  emptyText?: string // Text, der angezeigt wird, wenn der Wert leer ist
  sx?: SxProps<Theme> // Zusätzliche Styling-Eigenschaften
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
  _disableSubmitOnErrors?: boolean // Nicht mehr verwendet - behalten für abwärtskompatibilität
  sx?: SxProps<Theme>
  // Lockerer Typ, um Kompatibilität mit unterschiedlichen TanStack Form Versionen sicherzustellen
  // (FormApi/ReactFormExtendedApi Generics variieren je nach Version stark)
  form: any
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
  deleteButtonText,
  deleteConfirmationText,
  _disableSubmitOnErrors = true, // Nicht mehr verwendet - behalten für abwärtskompatibilität
  sx,
  form,
  onEditMode,
  entityId,
  entityName,
  metadata,
}) => {
  const t = useTranslations('common')
  const locale = useLocale()

  // Helper function for locale-aware date formatting
  const formatLocaleDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(locale)
  }

  // Get locale-appropriate date format
  const getDateFormat = () => {
    return locale === 'en' ? 'MM/DD/YYYY' : 'DD.MM.YYYY'
  }

  const getDateTimeFormat = () => {
    return locale === 'en' ? 'MM/DD/YYYY HH:mm' : 'DD.MM.YYYY HH:mm'
  }
  const [activeTab, setActiveTab] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Helper-Funktion um die Chip-Farbe zu bestimmen
  const getChipBackgroundColor = (field: FieldConfig, option: any): string | undefined => {
    if (field.getOptionBackgroundColor) {
      // Hier müssen wir sicherstellen, dass wir die ID richtig extrahieren
      const optionValue =
        typeof option === 'object' && 'value' in option
          ? option.value // Wenn option ein Objekt mit value-Property ist
          : option // Sonst direkt option verwenden (String)

      const backgroundColor = field.getOptionBackgroundColor(optionValue)
      if (backgroundColor) {
        // Wenn eine benutzerdefinierte Farbe zurückgegeben wird, verwende sie
        return backgroundColor
      }
    }
    return undefined
  }

  // Reactive form state tracking using useStore für bessere Performance
  const formState = useStore(form.store as any, (state: any) => ({
    isSubmitting: state.isSubmitting,
    // Wir verwenden die manuelle Validierung statt canSubmit, da canSubmit bei Autocomplete-Feldern problematisch ist
  }))
  const { isSubmitting } = formState

  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  // Memoized handlers für bessere Performance
  const handleFormSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isViewMode) {
        // Die Formularübermittlung erfolgt über form.handleSubmit()
        // TanStack Form validiert automatisch vor der Übermittlung
        // und führt dann onSubmit aus, wenn die Validierung erfolgreich ist
        form.handleSubmit()
      }
    },
    [form, isViewMode]
  )

  // Konsistente Implementierung mit handleFormSubmit
  // Beide Handler verwenden denselben Ansatz
  const handleSubmitClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      if (!isViewMode) {
        // TanStack Form kümmert sich um Validierung und Fehlerbehandlung
        form.handleSubmit()
      }
    },
    [form, isViewMode]
  )

  // Initiale Validierung für Create-Modus
  // Im Create-Modus sollen ungültige Felder sofort als ungültig angezeigt werden
  React.useEffect(() => {
    if (isOpen && form && isCreateMode) {
      // Im Create-Modus führen wir eine initiale Validierung durch
      // Wir verwenden einen kleinen Timeout, um sicherzustellen, dass die Form vollständig initialisiert ist
      const timer = setTimeout(() => {
        try {
          // Validiere alle Felder mit dem 'change' Event-Typ
          form.validateAllFields('change')
        } catch (error) {
          console.warn('Initiale Validierung fehlgeschlagen:', error)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [form, isOpen, isCreateMode])

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
        console.error('Error deleting (with ID):', error)
        setShowDeleteConfirm(false)
      }
    } else if (onDelete) {
      try {
        await onDelete()
        setShowDeleteConfirm(false)
        onClose()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error deleting (without ID):', error)
        setShowDeleteConfirm(false)
      }
    }
  }

  // Dialogtitel basierend auf dem Modus
  const getDialogTitle = () => {
    if (title) return title
    const entity = entityName || t('entity')
    if (isCreateMode) return t('createNew', { entity })
    if (isEditMode) return t('editEntity', { entity })
    return `${entity} Details`
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
        <Field form={form} name={field.name} validators={field.validators}>
          {(formField: any) => {
            // Für benutzerdefinierte Rendering-Funktion
            if (field.customRender) {
              return field.customRender(formField, isViewMode || isLoading || !!field.disabled)
            }

            const disabled = isViewMode || isLoading || !!field.disabled

            // Erweiterte Validierungslogik für bessere UX im Create-Modus
            // Im Create-Modus zeigen wir Validierungsfehler für ungültige Felder sofort an,
            // auch wenn sie noch nicht berührt wurden. Im Edit-Modus verwenden wir das Standard-Verhalten.
            const shouldShowError = isCreateMode
              ? !formField.state.meta.isValid
              : !formField.state.meta.isValid &&
                (formField.state.meta.isTouched || formField.state.meta.isDirty)

            // Im Create-Modus forcieren wir die Anzeige von Validierungsfehlern für Pflichtfelder
            // die noch keinen Wert haben, unabhängig vom Touch-Status
            const forceShowErrorInCreateMode =
              isCreateMode &&
              field.required &&
              (formField.state.value === '' ||
                formField.state.value === null ||
                formField.state.value === undefined)

            const finalShouldShowError = shouldShowError || forceShowErrorInCreateMode

            // Helper text logic: Korrekte Error-Behandlung für TanStack Form
            // TanStack Form errors können Objekte sein, daher müssen wir sie korrekt extrahieren
            const getHelperText = () => {
              if (finalShouldShowError && formField.state.meta.errors.length > 0) {
                // Fehler korrekt als Strings extrahieren
                return formField.state.meta.errors
                  .map((error: any) => {
                    // Wenn der Fehler ein String ist, verwende ihn direkt
                    if (typeof error === 'string') {
                      return error
                    }
                    // Wenn der Fehler ein Objekt ist, versuche message oder toString()
                    if (error && typeof error === 'object') {
                      return error.message || error.toString() || 'Validierungsfehler'
                    }
                    return 'Validierungsfehler'
                  })
                  .join(', ')
              }

              // Im Create-Modus zeigen wir für Pflichtfelder ohne Wert eine Standardmeldung
              if (forceShowErrorInCreateMode) {
                return `${field.label} ist ein Pflichtfeld`
              }

              return field.helperText || ''
            }

            return (
              <Box sx={{ mb: field.type === 'displayText' ? 0.25 : 2 }}>
                {/* FormLabel nur für Felder anzeigen, die kein eigenes Label haben */}
                {![
                  'date',
                  'datetime',
                  'text',
                  'textarea',
                  'select',
                  'number',
                  'autocomplete',
                  'tags',
                  'displayText',
                ].includes(field.type) && (
                  <FormLabel sx={{ mb: 1, display: 'block' }}>
                    {field.label}
                    {field.required ? ' *' : ''}
                  </FormLabel>
                )}

                {field.type === 'textarea' && (
                  <TextField
                    label={field.label + (field.required ? ' *' : '')}
                    value={formField.state.value === null ? '' : formField.state.value}
                    onChange={e => {
                      const value = e.target.value
                      formField.handleChange(value)
                      field.onChange?.(value)
                    }}
                    onBlur={formField.handleBlur}
                    disabled={disabled}
                    multiline
                    rows={field.rows || 4}
                    error={finalShouldShowError}
                    placeholder={field.placeholder}
                    fullWidth={field.fullWidth !== false}
                    InputProps={{
                      readOnly: !!field.readOnly,
                      ...(field.icon && {
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {field.icon}
                          </Box>
                        ),
                      }),
                    }}
                    helperText={getHelperText()}
                  />
                )}

                {field.type === 'select' && (
                  <TextField
                    label={field.label + (field.required ? ' *' : '')}
                    value={formField.state.value === null ? '' : formField.state.value}
                    onChange={e => {
                      const value = e.target.value
                      formField.handleChange(value)
                      field.onChange?.(value)
                    }}
                    onBlur={formField.handleBlur}
                    disabled={disabled}
                    select
                    error={finalShouldShowError}
                    fullWidth={field.fullWidth !== false}
                    InputProps={{
                      readOnly: !!field.readOnly,
                      ...(field.icon && {
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {field.icon}
                          </Box>
                        ),
                      }),
                    }}
                    helperText={getHelperText()}
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
                    label={field.label + (field.required ? ' *' : '')}
                    type="number"
                    value={formField.state.value === null ? '' : formField.state.value}
                    onChange={e => {
                      const value = e.target.value === '' ? null : Number(e.target.value)
                      formField.handleChange(value)
                      field.onChange?.(value)
                    }}
                    onBlur={formField.handleBlur}
                    disabled={disabled}
                    error={finalShouldShowError}
                    placeholder={field.placeholder}
                    fullWidth={field.fullWidth !== false}
                    InputProps={{
                      readOnly: !!field.readOnly,
                      ...(field.icon && {
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {field.icon}
                          </Box>
                        ),
                      }),
                    }}
                    helperText={getHelperText()}
                  />
                )}

                {field.type === 'date' && (
                  <DatePicker
                    label={field.label + (field.required ? ' *' : '')}
                    value={formField.state.value ? dayjs(formField.state.value) : null}
                    onChange={newValue => {
                      const value = newValue ? newValue.toDate() : null
                      formField.handleChange(value)
                      field.onChange?.(value)
                    }}
                    disabled={disabled}
                    slotProps={{
                      textField: {
                        fullWidth: field.fullWidth !== false,
                        error: finalShouldShowError,
                        helperText: getHelperText(),
                        onBlur: formField.handleBlur,
                        InputProps: {
                          readOnly: !!field.readOnly,
                          ...(field.icon && {
                            startAdornment: (
                              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                {field.icon}
                              </Box>
                            ),
                          }),
                        },
                      },
                      field: {
                        clearable: true,
                      },
                    }}
                    format={getDateFormat()}
                  />
                )}

                {field.type === 'datetime' && (
                  <DateTimePicker
                    label={field.label + (field.required ? ' *' : '')}
                    value={formField.state.value ? dayjs(formField.state.value) : null}
                    onChange={newValue => {
                      const value = newValue ? newValue.toDate() : null
                      formField.handleChange(value)
                      field.onChange?.(value)
                    }}
                    disabled={disabled}
                    slotProps={{
                      textField: {
                        fullWidth: field.fullWidth !== false,
                        error: finalShouldShowError,
                        helperText: getHelperText(),
                        onBlur: formField.handleBlur,
                        InputProps: { readOnly: !!field.readOnly },
                      },
                      field: {
                        clearable: true,
                      },
                    }}
                    format={getDateTimeFormat()}
                  />
                )}

                {field.type === 'autocomplete' && (
                  <Autocomplete
                    options={(field.options || []).slice().sort((a, b) => {
                      const labelA = typeof a === 'string' ? a : a?.label || ''
                      const labelB = typeof b === 'string' ? b : b?.label || ''
                      return labelA.localeCompare(labelB, 'de', { sensitivity: 'base' })
                    })}
                    value={formField.state.value}
                    onChange={(_, newValue) => {
                      // Extrahiere IDs/Werte aus Objekten bei Multiple-Auswahl
                      let processedValue = newValue

                      if (field.multiple && Array.isArray(newValue)) {
                        // Bei Multiple-Auswahl: Extrahiere value-Property aus Objekten
                        processedValue = newValue.map(item => {
                          if (typeof item === 'object' && item !== null && 'value' in item) {
                            return item.value
                          }
                          return item
                        })
                      } else if (
                        !field.multiple &&
                        newValue !== null &&
                        typeof newValue === 'object' &&
                        'value' in newValue
                      ) {
                        // Bei Single-Auswahl: Extrahiere value-Property wenn es ein Objekt ist
                        processedValue = newValue.value
                      }

                      formField.handleChange(processedValue)
                      field.onChange?.(processedValue)
                    }}
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
                        // Vereinfachte und robustere Implementierung
                        if (option === value) return true
                        if (!option || !value) return false

                        // Für String-Vergleiche
                        if (typeof option === 'string' && typeof value === 'string') {
                          return option === value
                        }

                        // Für Objekte mit value-Property (SelectOption)
                        if (
                          typeof option === 'object' &&
                          typeof value === 'object' &&
                          'value' in option &&
                          'value' in value
                        ) {
                          return option.value === value.value
                        }

                        // Für Option-Objekt und String-Value
                        if (
                          typeof option === 'object' &&
                          'value' in option &&
                          typeof value === 'string'
                        ) {
                          return option.value === value
                        }

                        // Für String-Option und Value-Objekt
                        if (
                          typeof option === 'string' &&
                          typeof value === 'object' &&
                          'value' in value
                        ) {
                          return option === value.value
                        }

                        return false
                      })
                    }
                    loading={field.loadingOptions}
                    loadingText={field.loadingText || 'Wird geladen...'}
                    renderOption={
                      field.renderOption ||
                      ((props, option) => {
                        // Standard-Rendering für Options ohne Farbhinterlegung
                        // Extrahiere key prop aus props, da React keys direkt übergeben werden müssen
                        const { key, ...restProps } = props
                        return (
                          <li key={key} {...restProps}>
                            {typeof option === 'object' && 'label' in option
                              ? option.label
                              : option}
                          </li>
                        )
                      })
                    }
                    renderTags={
                      field.multiple
                        ? (value, getTagProps) =>
                            value.map((option, index) => {
                              const tagProps = getTagProps({ index })
                              // Für die Farbbestimmung und Label-Anzeige müssen wir das ursprüngliche Option-Objekt finden
                              const originalOption = field.options?.find(opt => {
                                if (typeof opt === 'object' && 'value' in opt) {
                                  // Vergleiche die Werte direkt
                                  if (typeof option === 'object' && 'value' in option) {
                                    return opt.value === option.value
                                  }
                                  return opt.value === option
                                }
                                return opt === option
                              })

                              // Für die Farbmarkierung verwenden wir die ID (value oder direkter String)
                              const optionId =
                                typeof option === 'object' && 'value' in option
                                  ? option.value
                                  : option

                              // Hier liegt der Schlüssel - wir müssen die ID direkt verwenden, nicht das Objekt
                              let chipBackgroundColor = undefined
                              if (field.getOptionBackgroundColor) {
                                try {
                                  chipBackgroundColor = field.getOptionBackgroundColor(optionId)
                                } catch (error) {
                                  console.error('Error getting background color:', error)
                                }
                              }

                              // Label richtig extrahieren - entweder aus dem Original-Option Objekt oder über getOptionLabel
                              let chipLabel = option
                              if (originalOption) {
                                chipLabel =
                                  typeof originalOption === 'object' && 'label' in originalOption
                                    ? originalOption.label
                                    : originalOption
                              } else if (field.getOptionLabel) {
                                chipLabel = field.getOptionLabel(option)
                              }

                              return (
                                <Chip
                                  variant="outlined"
                                  key={tagProps.key}
                                  label={chipLabel}
                                  disabled={tagProps.disabled}
                                  onDelete={tagProps.onDelete}
                                  sx={{
                                    backgroundColor: chipBackgroundColor || 'transparent',
                                  }}
                                />
                              )
                            })
                        : undefined
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={field.label + (field.required ? ' *' : '')}
                        error={finalShouldShowError}
                        placeholder={field.placeholder}
                        fullWidth={field.fullWidth !== false}
                        InputProps={{
                          ...params.InputProps,
                          readOnly: !!field.readOnly,
                        }}
                        onBlur={formField.handleBlur}
                        helperText={getHelperText()}
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
                    onChange={(_, newValue) => {
                      formField.handleChange(newValue)
                      field.onChange?.(newValue)
                    }}
                    disabled={disabled}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderValue={(value, getItemProps) =>
                      value.map((option, index) => {
                        const itemProps = getItemProps({ index })
                        const chipBackgroundColor = getChipBackgroundColor(field, option)
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
                            sx={{
                              backgroundColor: chipBackgroundColor || 'transparent',
                            }}
                          />
                        )
                      })
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={field.label + (field.required ? ' *' : '')}
                        error={finalShouldShowError}
                        placeholder={field.placeholder}
                        InputProps={{
                          ...params.InputProps,
                          readOnly: !!field.readOnly,
                        }}
                        onBlur={formField.handleBlur}
                        helperText={getHelperText()}
                      />
                    )}
                  />
                )}

                {field.type === 'text' && (
                  <TextField
                    label={field.label + (field.required ? ' *' : '')}
                    value={formField.state.value === null ? '' : formField.state.value}
                    onChange={e => {
                      const value = e.target.value
                      formField.handleChange(value)
                      field.onChange?.(value)
                    }}
                    onBlur={formField.handleBlur}
                    disabled={disabled}
                    error={finalShouldShowError}
                    placeholder={field.placeholder}
                    fullWidth={field.fullWidth !== false}
                    multiline={field.multiline}
                    rows={field.rows}
                    InputProps={{
                      readOnly: !!field.readOnly,
                      ...(field.icon && {
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {field.icon}
                          </Box>
                        ),
                      }),
                    }}
                    helperText={getHelperText()}
                  />
                )}

                {field.type === 'displayText' && (
                  <Box>
                    {field.label && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.25, mt: 0 }}
                      >
                        {field.label}
                      </Typography>
                    )}
                    <Typography
                      variant={field.variant || 'body1'}
                      sx={{
                        ...field.sx,
                        wordBreak: 'break-word',
                        whiteSpace: field.preserveWhitespace ? 'pre-wrap' : 'normal',
                        margin: 0,
                      }}
                    >
                      {formField.state.value === null || formField.state.value === ''
                        ? field.emptyText || '-'
                        : formField.state.value}
                    </Typography>
                    {field.helperText && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, mb: 0 }}>
                        {field.helperText}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )
          }}
        </Field>
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
        <form onSubmit={handleFormSubmit}>
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
                    {t('createdAt')} {formatLocaleDateTime(metadata.createdAt)}
                  </Typography>
                )}
                {metadata.updatedAt && (
                  <Typography variant="subtitle2">
                    {t('updatedAt')} {formatLocaleDateTime(metadata.updatedAt)}
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
                  {deleteButtonText || t('delete')}
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
                {cancelButtonText || (isViewMode ? t('close') : t('cancel'))}
              </Button>
              {!isViewMode && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isLoading || isSubmitting ? undefined : <SaveIcon />}
                  disabled={isLoading || isSubmitting}
                  onClick={handleSubmitClick}
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      {t('loading')}
                    </>
                  ) : (
                    submitButtonText || (isCreateMode ? t('create') : t('save'))
                  )}
                </Button>
              )}
              {isViewMode && onEditMode && !isViewer() && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onEditMode}
                  startIcon={<EditIcon />}
                >
                  {t('edit')}
                </Button>
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>

      {/* Lösch-Bestätigungsdialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{deleteConfirmationText || t('deleteConfirmation')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)} color="inherit">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            {deleteButtonText || t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GenericForm
