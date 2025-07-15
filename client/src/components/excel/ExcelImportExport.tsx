import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  TableChart as TableIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useApolloClient } from '@apollo/client'
import { isAdmin } from '@/lib/auth'

// Import der neuen Module
import {
  ImportSettings,
  ExportSettings,
  DeleteSettings,
  ExcelImportExportProps,
  ValidationResult,
} from './types'
import {
  entityTypeLabels,
  defaultImportSettings,
  defaultExportSettings,
  defaultDeleteSettings,
  isFormatLocked,
  updateModeOptions,
} from './constants'
import {
  handleMultiTabImport,
  handleSingleTabImport,
  exportEntityData,
  deleteEntityData,
  refreshDashboardCache,
} from './operations'

// Import der bestehenden Utilities
import { exportToExcel, downloadTemplateWithRealFields } from '../../utils/excelUtils'
import { validateImportData, getTemplateWithExamples } from '../../utils/excelDataService'

const ExcelImportExport: React.FC<ExcelImportExportProps> = ({
  isOpen,
  onClose,
  defaultTab = 'import',
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const apolloClient = useApolloClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State Management
  const [currentTab, setCurrentTab] = useState<'import' | 'export' | 'management'>(defaultTab)
  const [importSettings, setImportSettings] = useState<ImportSettings>(defaultImportSettings)
  const [exportSettings, setExportSettings] = useState<ExportSettings>(defaultExportSettings)
  const [deleteSettings, setDeleteSettings] = useState<DeleteSettings>(defaultDeleteSettings)

  // Import State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  // Export State
  const [isExporting, setIsExporting] = useState(false)

  // Delete State
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteEntityType, setDeleteEntityType] = useState<string>('')

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentTab(defaultTab)
      setSelectedFile(null)
      setValidationResult(null)
      setImportProgress(0)
      setIsImporting(false)
      setIsExporting(false)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }, [isOpen, defaultTab])

  // File Upload Handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setValidationResult(null)

    try {
      if (importSettings.entityType === 'all') {
        // Multi-Tab Import Validation
        let allData: { [tabName: string]: any[] } = {}

        if (importSettings.format === 'xlsx') {
          const { importMultiTabFromExcel } = await import('../../utils/excelUtils')
          allData = await importMultiTabFromExcel(file)
        } else if (importSettings.format === 'json') {
          const { importMultiTabFromJson } = await import('../../utils/excelUtils')
          allData = await importMultiTabFromJson(file)
        }

        // Validate all tabs
        const allValidations: { [tabName: string]: any } = {}
        let totalValid = 0
        let totalErrors = 0

        Object.entries(allData).forEach(([tabName, tabData]) => {
          const entityTypeMapping: { [key: string]: string } = {
            'Business Capabilities': 'businessCapabilities',
            Applications: 'applications',
            'Data Objects': 'dataObjects',
            Interfaces: 'interfaces',
            Persons: 'persons',
            Architectures: 'architectures',
            'Architecture Principles': 'architecturePrinciples',
            Diagrams: 'diagrams',
          }

          const entityType = entityTypeMapping[tabName]
          if (entityType && Array.isArray(tabData) && tabData.length > 0) {
            const validation = validateImportData(tabData, entityType as any)
            allValidations[tabName] = validation
            totalValid += validation.summary.validRows
            totalErrors += validation.errors.length
          }
        })

        const combinedValidation = {
          isValid: totalErrors === 0,
          errors: Object.values(allValidations).flatMap((v: any) => v.errors),
          warnings: Object.values(allValidations).flatMap((v: any) => v.warnings),
          summary: {
            validRows: totalValid,
            invalidRows: totalErrors,
            totalRows: totalValid + totalErrors,
            duplicates: Object.values(allValidations).reduce(
              (sum: number, v: any) => sum + v.summary.duplicates,
              0
            ),
          },
          tabValidations: allValidations,
        }

        setValidationResult(combinedValidation)
        enqueueSnackbar(
          combinedValidation.isValid
            ? `Multi-Tab-Datei erfolgreich validiert. ${totalValid} gültige Datensätze gefunden.`
            : `Multi-Tab-Datei geladen, aber ${totalErrors} Fehler gefunden.`,
          { variant: combinedValidation.isValid ? 'success' : 'warning' }
        )
      } else {
        // Single-Tab Import Validation
        let data: any[] = []

        if (importSettings.format === 'xlsx' && importSettings.entityType !== 'diagrams') {
          const { importFromExcel } = await import('../../utils/excelUtils')
          data = await importFromExcel(file)
        } else if (importSettings.format === 'json' || importSettings.entityType === 'diagrams') {
          const { importFromJson } = await import('../../utils/excelUtils')
          data = await importFromJson(file)
        }

        const validation = validateImportData(data, importSettings.entityType as any)
        setValidationResult(validation)

        enqueueSnackbar(
          validation.isValid
            ? `Datei erfolgreich validiert. ${validation.summary.validRows} gültige Datensätze gefunden.`
            : `Datei geladen, aber ${validation.errors.length} Fehler gefunden.`,
          { variant: validation.isValid ? 'success' : 'warning' }
        )
      }
    } catch (err) {
      enqueueSnackbar(
        `Fehler beim Laden der Datei: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  // Import Handler
  const handleImport = async () => {
    if (!selectedFile || !validationResult) return

    if (importSettings.entityType === 'diagrams' && importSettings.format !== 'json') {
      enqueueSnackbar('Für Diagramme ist nur das JSON-Format verfügbar.', { variant: 'info' })
      return
    }

    setIsImporting(true)
    setImportProgress(0)

    try {
      let totalImported = 0

      if (importSettings.entityType === 'all') {
        const result = await handleMultiTabImport(apolloClient, selectedFile, importSettings.format)
        totalImported = result.totalImported
      } else {
        const result = await handleSingleTabImport(
          apolloClient,
          selectedFile,
          importSettings.entityType,
          importSettings.format
        )
        totalImported = result.imported
      }

      await refreshDashboardCache()

      const successMessage =
        importSettings.entityType === 'all'
          ? `Multi-Tab-Import erfolgreich abgeschlossen. ${totalImported} Datensätze importiert.`
          : `${entityTypeLabels[importSettings.entityType]} erfolgreich importiert. ${totalImported} Datensätze importiert.`

      enqueueSnackbar(successMessage, { variant: 'success' })

      // Reset state
      setSelectedFile(null)
      setValidationResult(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      enqueueSnackbar(
        `Fehler beim Import: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  // Export Handler
  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportEntityData(exportSettings.entityType, exportSettings.format)
      enqueueSnackbar(`${entityTypeLabels[exportSettings.entityType]} erfolgreich exportiert.`, {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar(
        `Fehler beim Export: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsExporting(false)
    }
  }

  // Delete Confirmation Handlers
  const openDeleteConfirmDialog = (entityType: string) => {
    setDeleteEntityType(entityType)
    setShowDeleteConfirm(true)
  }

  const closeDeleteConfirmDialog = () => {
    setShowDeleteConfirm(false)
    setDeleteEntityType('')
  }

  const handleDeleteConfirm = async () => {
    if (!deleteEntityType) return

    setIsDeleting(true)
    try {
      const deletedCount = await deleteEntityData(apolloClient, deleteEntityType)
      await refreshDashboardCache()

      enqueueSnackbar(
        deleteEntityType === 'all'
          ? `Alle Daten erfolgreich gelöscht. ${deletedCount} Datensätze entfernt.`
          : `${entityTypeLabels[deleteEntityType as keyof typeof entityTypeLabels]} erfolgreich gelöscht. ${deletedCount} Datensätze entfernt.`,
        { variant: 'success' }
      )

      closeDeleteConfirmDialog()
    } catch (error) {
      enqueueSnackbar(
        `Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Template Download Handlers
  const handleDownloadTemplate = async () => {
    if (importSettings.entityType === 'all') {
      enqueueSnackbar('Für Multi-Entity-Import ist kein Template verfügbar.', { variant: 'info' })
      return
    }

    try {
      await downloadTemplateWithRealFields(importSettings.entityType)
    } catch (error) {
      enqueueSnackbar(
        `Fehler beim Download der Vorlage: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  const handleDownloadTemplateWithExamples = async () => {
    if (importSettings.entityType === 'all') {
      enqueueSnackbar('Für Multi-Entity-Import ist kein Template verfügbar.', { variant: 'info' })
      return
    }

    try {
      const template = await getTemplateWithExamples(importSettings.entityType as any)
      await exportToExcel(template, {
        format: 'xlsx',
        filename: `${importSettings.entityType}-template`,
        sheetName: 'Template',
        includeHeaders: true,
      })
    } catch (error) {
      enqueueSnackbar(
        `Fehler beim Download der Vorlage: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  // Format locking logic
  const handleEntityTypeChange = (newEntityType: string) => {
    if (newEntityType === 'diagrams' && importSettings.format !== 'json') {
      enqueueSnackbar('Für Diagramme ist nur das JSON-Format verfügbar.', { variant: 'info' })
      setImportSettings({
        ...importSettings,
        entityType: newEntityType as ImportSettings['entityType'],
        format: 'json',
      })
    } else {
      setImportSettings({
        ...importSettings,
        entityType: newEntityType as ImportSettings['entityType'],
      })
    }
  }

  const handleFormatChange = (newFormat: string) => {
    if (importSettings.entityType === 'diagrams' && newFormat !== 'json') {
      enqueueSnackbar('Für Diagramme ist nur das JSON-Format verfügbar.', { variant: 'info' })
      return
    }
    setImportSettings({
      ...importSettings,
      format: newFormat as ImportSettings['format'],
    })
  }

  // Export format locking logic
  const handleExportEntityTypeChange = (newEntityType: string) => {
    // Für Diagramme: nur JSON erlaubt
    if (newEntityType === 'diagrams' && exportSettings.format !== 'json') {
      enqueueSnackbar('Für Diagramme ist nur das JSON-Format verfügbar.', { variant: 'info' })
      setExportSettings({
        ...exportSettings,
        entityType: newEntityType as ExportSettings['entityType'],
        format: 'json',
      })
    }
    // Für Alle Daten: CSV nicht erlaubt, aber Excel und JSON schon
    else if (newEntityType === 'all' && exportSettings.format === 'csv') {
      enqueueSnackbar(
        'Für den Export aller Daten ist das CSV-Format nicht verfügbar. Verwenden Sie Excel oder JSON.',
        { variant: 'info' }
      )
      setExportSettings({
        ...exportSettings,
        entityType: newEntityType as ExportSettings['entityType'],
        format: 'xlsx', // Standardmäßig auf Excel setzen
      })
    } else {
      setExportSettings({
        ...exportSettings,
        entityType: newEntityType as ExportSettings['entityType'],
      })
    }
  }

  const handleExportFormatChange = (newFormat: string) => {
    // Für Diagramme: nur JSON erlaubt
    if (exportSettings.entityType === 'diagrams' && newFormat !== 'json') {
      enqueueSnackbar('Für Diagramme ist nur das JSON-Format verfügbar.', { variant: 'info' })
      return
    }
    // Für Alle Daten: CSV nicht erlaubt
    if (exportSettings.entityType === 'all' && newFormat === 'csv') {
      enqueueSnackbar(
        'Für den Export aller Daten ist das CSV-Format nicht verfügbar. Verwenden Sie Excel oder JSON.',
        { variant: 'info' }
      )
      return
    }
    setExportSettings({
      ...exportSettings,
      format: newFormat as ExportSettings['format'],
    })
  }

  // Render Methods
  const renderImportTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Import-Einstellungen
            </Typography>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Datentyp</InputLabel>
                  <Select
                    value={importSettings.entityType}
                    label="Datentyp"
                    onChange={e => handleEntityTypeChange(e.target.value)}
                  >
                    {Object.entries(entityTypeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Dateiformat</InputLabel>
                  <Select
                    value={importSettings.format}
                    label="Dateiformat"
                    onChange={e => handleFormatChange(e.target.value)}
                  >
                    <MenuItem
                      value="xlsx"
                      disabled={isFormatLocked(importSettings.entityType, 'xlsx')}
                    >
                      Excel (.xlsx)
                      {importSettings.entityType === 'diagrams' &&
                        ' (nicht verfügbar für Diagramme)'}
                    </MenuItem>
                    <MenuItem value="json">JSON (.json)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Update-Modus</InputLabel>
                  <Select
                    value={importSettings.updateMode}
                    label="Update-Modus"
                    onChange={e =>
                      setImportSettings({
                        ...importSettings,
                        updateMode: e.target.value as ImportSettings['updateMode'],
                      })
                    }
                  >
                    {updateModeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <Box sx={{ mt: 2 }}>
                  <input
                    accept=".xlsx,.xls,.json"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      component="span"
                      fullWidth
                    >
                      Datei auswählen
                    </Button>
                  </label>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {selectedFile && (
          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Datei-Status
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Datei: {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Größe: {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>

              {validationResult && (
                <Box sx={{ mt: 2 }}>
                  <Alert
                    severity={validationResult.isValid ? 'success' : 'warning'}
                    icon={validationResult.isValid ? <InfoIcon /> : <WarningIcon />}
                  >
                    <Typography variant="body2">
                      {validationResult.summary.validRows} gültige Datensätze von{' '}
                      {validationResult.summary.totalRows} gesamt
                    </Typography>
                    {validationResult.errors.length > 0 && (
                      <Typography variant="body2" color="error">
                        {validationResult.errors.length} Fehler gefunden
                      </Typography>
                    )}
                  </Alert>

                  {validationResult.errors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Fehler:
                      </Typography>
                      <List dense>
                        {validationResult.errors.slice(0, 5).map((error, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ErrorIcon color="error" />
                            </ListItemIcon>
                            <ListItemText
                              primary={error.message || error}
                              secondary={error.row && `Zeile: ${error.row}`}
                            />
                          </ListItem>
                        ))}
                        {validationResult.errors.length > 5 && (
                          <ListItem>
                            <ListItemText
                              primary={`... und ${validationResult.errors.length - 5} weitere Fehler`}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  )}
                </Box>
              )}

              {isImporting && (
                <Box sx={{ mt: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Importiere Daten... {importProgress}%
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )

  const renderExportTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export-Einstellungen
            </Typography>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Datentyp</InputLabel>
                  <Select
                    value={exportSettings.entityType}
                    label="Datentyp"
                    onChange={e => handleExportEntityTypeChange(e.target.value)}
                  >
                    {Object.entries(entityTypeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Dateiformat</InputLabel>
                  <Select
                    value={exportSettings.format}
                    label="Dateiformat"
                    onChange={e => handleExportFormatChange(e.target.value)}
                  >
                    <MenuItem value="xlsx" disabled={exportSettings.entityType === 'diagrams'}>
                      Excel (.xlsx)
                    </MenuItem>
                    <MenuItem
                      value="csv"
                      disabled={
                        exportSettings.entityType === 'diagrams' ||
                        exportSettings.entityType === 'all'
                      }
                    >
                      CSV (.csv)
                    </MenuItem>
                    <MenuItem value="json">JSON (.json)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export-Vorschau
            </Typography>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                Export umfasst <strong>{entityTypeLabels[exportSettings.entityType]}</strong> im{' '}
                <strong>{exportSettings.format.toUpperCase()}</strong>-Format mit GraphQL-Feldnamen
                für direkten Re-Import.
              </Typography>
            </Alert>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>GraphQL-Felder (re-import-fähig):</strong>
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(() => {
                  // GraphQL-Felder für alle Entitätstypen
                  const entityFieldsMapping = {
                    businessCapabilities: [
                      'id',
                      'name',
                      'description',
                      'maturityLevel',
                      'status',
                      'businessValue',
                      'parents',
                    ],
                    applications: [
                      'id',
                      'name',
                      'description',
                      'vendor',
                      'version',
                      'status',
                      'businessCapabilities',
                      'dataObjects',
                    ],
                    dataObjects: [
                      'id',
                      'name',
                      'description',
                      'type',
                      'businessCapabilities',
                      'applications',
                      'interfaces',
                    ],
                    interfaces: [
                      'id',
                      'name',
                      'description',
                      'type',
                      'protocol',
                      'sourceApplication',
                      'targetApplication',
                    ],
                    persons: [
                      'id',
                      'name',
                      'email',
                      'role',
                      'department',
                      'businessCapabilities',
                      'applications',
                    ],
                    architectures: [
                      'id',
                      'name',
                      'description',
                      'type',
                      'status',
                      'businessCapabilities',
                      'applications',
                    ],
                    diagrams: [
                      'id',
                      'title',
                      'description',
                      'type',
                      'businessCapabilities',
                      'applications',
                    ],
                    architecturePrinciples: [
                      'id',
                      'name',
                      'description',
                      'category',
                      'status',
                      'businessCapabilities',
                    ],
                    all: [] as string[], // Für "Alle Entitäten" zeigen wir eine spezielle Behandlung
                  }

                  const fields = entityFieldsMapping[exportSettings.entityType] || []

                  if (exportSettings.entityType === 'all') {
                    return (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          Export umfasst alle Entitätstypen mit ihren jeweiligen Feldern:
                        </Typography>
                        {Object.entries(entityFieldsMapping)
                          .filter(([key]) => key !== 'all')
                          .map(([entityType, entityFields]) => (
                            <Box key={entityType} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {entityTypeLabels[entityType as keyof typeof entityTypeLabels]}:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                {entityFields.map((field, index) => (
                                  <Typography
                                    key={index}
                                    variant="body2"
                                    component="span"
                                    sx={{
                                      backgroundColor: 'primary.main',
                                      color: 'primary.contrastText',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    {field}
                                  </Typography>
                                ))}
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    )
                  }

                  return fields.map((field, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      component="span"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      {field}
                    </Typography>
                  ))
                })()}
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                ℹ️ Relationen werden als komma-getrennte IDs exportiert, um direkten Re-Import zu
                ermöglichen
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )

  const renderManagementTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={12}>
          <Alert severity="warning" icon={<WarningIcon />}>
            <Typography variant="h6" gutterBottom>
              ⚠️ Admin-Bereich - Datenverwaltung
            </Typography>
            <Typography variant="body2">
              Hier können Sie Daten aus der Datenbank löschen.{' '}
              <strong>Diese Aktionen können nicht rückgängig gemacht werden!</strong>
              Stellen Sie sicher, dass Sie ein Backup haben, bevor Sie Daten löschen.
            </Typography>
          </Alert>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Einzelne Datentypen löschen
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Datentyp auswählen</InputLabel>
              <Select
                value={deleteSettings.entityType}
                label="Datentyp auswählen"
                onChange={e =>
                  setDeleteSettings({
                    ...deleteSettings,
                    entityType: e.target.value as DeleteSettings['entityType'],
                  })
                }
              >
                {Object.entries(entityTypeLabels)
                  .filter(([key]) => key !== 'all')
                  .map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                disabled={isDeleting}
                startIcon={isDeleting ? <CircularProgress size={20} /> : <ErrorIcon />}
                onClick={() => openDeleteConfirmDialog(deleteSettings.entityType)}
              >
                {isDeleting
                  ? 'Lösche...'
                  : `${entityTypeLabels[deleteSettings.entityType]} löschen`}
              </Button>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Löscht alle Einträge des ausgewählten Datentyps aus der Datenbank.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3, border: '2px solid', borderColor: 'error.main' }}>
            <Typography variant="h6" gutterBottom color="error">
              ⚠️ Komplette Datenbank löschen
            </Typography>

            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              <Typography variant="body2">
                <strong>ACHTUNG:</strong> Diese Aktion löscht ALLE Daten aus der Datenbank! Dies
                umfasst alle Business Capabilities, Applikationen, Datenobjekte, Schnittstellen,
                Personen, Architekturen und Diagramme.
              </Typography>
            </Alert>

            <Button
              variant="contained"
              color="error"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} /> : <ErrorIcon />}
              onClick={() => openDeleteConfirmDialog('all')}
              sx={{ mt: 2 }}
            >
              {isDeleting ? 'Lösche...' : 'Alle Daten löschen'}
            </Button>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Diese Aktion kann nicht rückgängig gemacht werden. Stellen Sie sicher, dass Sie ein
              vollständiges Backup haben.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={closeDeleteConfirmDialog}>
        <DialogTitle>Löschen bestätigen</DialogTitle>
        <DialogContent>
          <Typography>
            Sind Sie sicher, dass Sie{' '}
            {deleteEntityType === 'all'
              ? 'alle Daten'
              : entityTypeLabels[deleteEntityType as keyof typeof entityTypeLabels]}{' '}
            löschen möchten?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Diese Aktion kann nicht rückgängig gemacht werden!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmDialog}>Abbrechen</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={isDeleting}>
            {isDeleting ? 'Lösche...' : 'Löschen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Dialog */}
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: 'auto',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableIcon />
            Import/Export
          </Box>
        </DialogTitle>

        <DialogContent>
          <Tabs value={currentTab} onChange={(_, newTab) => setCurrentTab(newTab)} sx={{ mb: 2 }}>
            <Tab label="Import" value="import" icon={<UploadIcon />} iconPosition="start" />
            <Tab label="Export" value="export" icon={<DownloadIcon />} iconPosition="start" />
            {isAdmin() && (
              <Tab
                label="Datenverwaltung"
                value="management"
                icon={<TableIcon />}
                iconPosition="start"
              />
            )}
          </Tabs>

          {currentTab === 'import' && renderImportTab()}
          {currentTab === 'export' && renderExportTab()}
          {currentTab === 'management' && isAdmin() && renderManagementTab()}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {currentTab === 'import' && (
              <>
                <Button
                  variant="text"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadTemplate}
                >
                  Leeres Template
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadTemplateWithExamples}
                >
                  Template mit Beispielen
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose}>Abbrechen</Button>

            {currentTab === 'import' ? (
              <>
                {selectedFile && validationResult && (
                  <Button
                    variant="contained"
                    onClick={handleImport}
                    disabled={
                      isImporting ||
                      validationResult.errors.length > 0 ||
                      validationResult.summary.validRows === 0
                    }
                    startIcon={isImporting ? <CircularProgress size={20} /> : <UploadIcon />}
                  >
                    {isImporting ? 'Importiere...' : 'Import starten'}
                  </Button>
                )}
              </>
            ) : currentTab === 'export' ? (
              <Button
                variant="contained"
                onClick={handleExport}
                disabled={isExporting}
                startIcon={isExporting ? <CircularProgress size={20} /> : <DownloadIcon />}
              >
                {isExporting ? 'Exportiere...' : 'Export starten'}
              </Button>
            ) : null}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExcelImportExport
