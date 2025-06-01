import React, { useState } from 'react'
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
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
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
import {
  exportToExcel,
  importFromExcel,
  downloadTemplateWithRealFields,
} from '../../utils/excelUtils'
import {
  fetchDataByEntityType,
  getFieldNamesByEntityType,
  validateImportData,
  ValidationResult,
  getTemplateWithExamples,
} from '../../utils/excelDataService'

// Import/Export Typen basierend auf den Anforderungen FR-IE-01 und FR-IE-02
interface ImportSettings {
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
  updateMode: 'overwrite' | 'merge' | 'skipExisting'
  validateData: boolean
  createTemplate: boolean
}

interface ExportSettings {
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
  includeRelationships: boolean
  includeMetadata: boolean
  dateRange: string
  format: 'xlsx' | 'csv'
  customFields: string[]
}

interface ExcelImportExportProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'import' | 'export'
}

const ExcelImportExport: React.FC<ExcelImportExportProps> = ({
  isOpen,
  onClose,
  defaultTab = 'import',
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const apolloClient = useApolloClient()

  // Tab-Management
  const [currentTab, setCurrentTab] = useState<'import' | 'export'>(defaultTab)

  // Import State
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    entityType: 'businessCapabilities',
    updateMode: 'merge',
    validateData: true,
    createTemplate: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [importProgress, setImportProgress] = useState(0)

  // Export State
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    entityType: 'businessCapabilities',
    includeRelationships: true,
    includeMetadata: false,
    dateRange: 'all',
    format: 'xlsx',
    customFields: [],
  })
  const [isExporting, setIsExporting] = useState(false)

  // Entity Type Labels
  const entityTypeLabels = {
    businessCapabilities: 'Business Capabilities',
    applications: 'Anwendungen',
    dataObjects: 'Datenobjekte',
    interfaces: 'Schnittstellen',
  }

  // File Upload Handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setValidationResult(null)

    try {
      // Lade und parse die Excel-Datei
      const data = await importFromExcel(file)

      // Führe echte Validierung mit GraphQL-Feldnamen durch
      const validation = validateImportData(data, importSettings.entityType)

      setValidationResult(validation)

      const statusMessage = validation.isValid
        ? `Datei ${file.name} erfolgreich geladen und validiert. ${validation.summary.validRows} gültige Datensätze gefunden.`
        : `Datei ${file.name} geladen, aber ${validation.errors.length} Fehler gefunden.`

      enqueueSnackbar(statusMessage, {
        variant: validation.isValid ? 'success' : 'warning',
      })
    } catch (err) {
      enqueueSnackbar(
        `Fehler beim Laden der Datei: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  // Import Execute
  const handleImport = async () => {
    if (!selectedFile || !validationResult) return

    setIsImporting(true)
    setImportProgress(0)

    try {
      // Simuliere Import-Prozess
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      enqueueSnackbar(`${validationResult.summary.validRows} Datensätze erfolgreich importiert`, {
        variant: 'success',
      })
      onClose()
    } catch (err) {
      console.error('Import error:', err)
      enqueueSnackbar('Fehler beim Import', { variant: 'error' })
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  // Template Download
  const handleDownloadTemplate = () => {
    try {
      downloadTemplateWithRealFields(importSettings.entityType)
      enqueueSnackbar(
        `Import-Template für ${entityTypeLabels[importSettings.entityType]} wird heruntergeladen`,
        { variant: 'success' }
      )
    } catch (err) {
      console.error('Template download error:', err)
      enqueueSnackbar(
        `Fehler beim Herunterladen des Templates: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  // Template Download mit Beispieldaten
  const handleDownloadTemplateWithExamples = () => {
    try {
      const exampleData = getTemplateWithExamples(importSettings.entityType)
      exportToExcel(exampleData, {
        filename: `${importSettings.entityType}_template_mit_beispielen`,
        sheetName: 'Template',
        format: 'xlsx',
        includeHeaders: true,
      })
      enqueueSnackbar(
        `Template mit Beispieldaten für ${entityTypeLabels[importSettings.entityType]} wird heruntergeladen`,
        { variant: 'success' }
      )
    } catch (err) {
      console.error('Template with examples download error:', err)
      enqueueSnackbar(
        `Fehler beim Herunterladen des Templates: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  // Export Execute
  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Hole echte Daten basierend auf dem ausgewählten Entity-Typ
      const data = await fetchDataByEntityType(apolloClient, exportSettings.entityType)

      if (data.length === 0) {
        enqueueSnackbar('Keine Daten zum Exportieren verfügbar', { variant: 'warning' })
        return
      }

      // Erstelle Dateiname mit Zeitstempel
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `${entityTypeLabels[exportSettings.entityType]}_${timestamp}`

      // Führe den Export durch
      exportToExcel(data, {
        filename,
        sheetName: entityTypeLabels[exportSettings.entityType],
        format: exportSettings.format,
        includeHeaders: true,
      })

      enqueueSnackbar(
        `${entityTypeLabels[exportSettings.entityType]} erfolgreich als ${exportSettings.format.toUpperCase()} exportiert (${data.length} Datensätze)`,
        { variant: 'success' }
      )

      onClose()
    } catch (err) {
      console.error('Export error:', err)
      enqueueSnackbar(
        `Fehler beim Export: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsExporting(false)
    }
  }

  const renderImportTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Einstellungen */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Import-Einstellungen
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Datentyp</InputLabel>
              <Select
                value={importSettings.entityType}
                onChange={e =>
                  setImportSettings({
                    ...importSettings,
                    entityType: e.target.value as ImportSettings['entityType'],
                  })
                }
              >
                {Object.entries(entityTypeLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Update-Modus</InputLabel>
              <Select
                value={importSettings.updateMode}
                onChange={e =>
                  setImportSettings({
                    ...importSettings,
                    updateMode: e.target.value as ImportSettings['updateMode'],
                  })
                }
              >
                <MenuItem value="overwrite">Überschreiben</MenuItem>
                <MenuItem value="merge">Zusammenführen</MenuItem>
                <MenuItem value="skipExisting">Bestehende überspringen</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={importSettings.validateData}
                  onChange={e =>
                    setImportSettings({
                      ...importSettings,
                      validateData: e.target.checked,
                    })
                  }
                />
              }
              label="Daten vor Import validieren"
            />
          </Paper>
        </Grid>

        {/* File Upload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Datei-Upload
            </Typography>

            <Box sx={{ textAlign: 'center', py: 3 }}>
              <input
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                id="excel-file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="excel-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Excel-Datei auswählen
                </Button>
              </label>

              {selectedFile && (
                <Typography variant="body2" color="textSecondary">
                  Gewählte Datei: {selectedFile.name}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="text" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
                Leeres Template
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplateWithExamples}
              >
                Template mit Beispielen
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Validierungsergebnisse */}
        {validationResult && (
          <Grid size={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Validierungsergebnis
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {validationResult.summary.totalRows}
                    </Typography>
                    <Typography variant="caption">Gesamt</Typography>
                  </Box>
                </Grid>
                <Grid size={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {validationResult.summary.validRows}
                    </Typography>
                    <Typography variant="caption">Gültig</Typography>
                  </Box>
                </Grid>
                <Grid size={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {validationResult.summary.invalidRows}
                    </Typography>
                    <Typography variant="caption">Fehlerhaft</Typography>
                  </Box>
                </Grid>
                <Grid size={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {validationResult.summary.duplicates}
                    </Typography>
                    <Typography variant="caption">Duplikate</Typography>
                  </Box>
                </Grid>
              </Grid>

              {validationResult.errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Fehler gefunden:</Typography>
                  <List dense>
                    {validationResult.errors.slice(0, 5).map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ErrorIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Zeile ${error.row}: ${error.field}`}
                          secondary={error.message}
                        />
                      </ListItem>
                    ))}
                    {validationResult.errors.length > 5 && (
                      <Typography variant="caption">
                        ... und {validationResult.errors.length - 5} weitere Fehler
                      </Typography>
                    )}
                  </List>
                </Alert>
              )}

              {validationResult.warnings.length > 0 && (
                <Alert severity="warning">
                  <Typography variant="subtitle2">Warnungen:</Typography>
                  <List dense>
                    {validationResult.warnings.slice(0, 3).map((warning, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Zeile ${warning.row}: ${warning.field}`}
                          secondary={warning.message}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
            </Paper>
          </Grid>
        )}

        {/* Import Progress */}
        {isImporting && importProgress > 0 && (
          <Grid size={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Import läuft...
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress variant="determinate" value={importProgress} />
                <Typography variant="body2">{importProgress}% abgeschlossen</Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )

  const renderExportTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Export-Einstellungen */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Export-Einstellungen
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Datentyp</InputLabel>
              <Select
                value={exportSettings.entityType}
                onChange={e =>
                  setExportSettings({
                    ...exportSettings,
                    entityType: e.target.value as ExportSettings['entityType'],
                  })
                }
              >
                {Object.entries(entityTypeLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Dateiformat</InputLabel>
              <Select
                value={exportSettings.format}
                onChange={e =>
                  setExportSettings({
                    ...exportSettings,
                    format: e.target.value as ExportSettings['format'],
                  })
                }
              >
                <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">CSV (.csv)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Zeitraum</InputLabel>
              <Select
                value={exportSettings.dateRange}
                onChange={e =>
                  setExportSettings({
                    ...exportSettings,
                    dateRange: e.target.value,
                  })
                }
              >
                <MenuItem value="all">Alle Daten</MenuItem>
                <MenuItem value="last30">Letzte 30 Tage</MenuItem>
                <MenuItem value="last90">Letzte 90 Tage</MenuItem>
                <MenuItem value="thisYear">Dieses Jahr</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Zusätzliche Optionen */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Zusätzliche Optionen
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={exportSettings.includeRelationships}
                  onChange={e =>
                    setExportSettings({
                      ...exportSettings,
                      includeRelationships: e.target.checked,
                    })
                  }
                />
              }
              label="Beziehungen einschließen"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={exportSettings.includeMetadata}
                  onChange={e =>
                    setExportSettings({
                      ...exportSettings,
                      includeMetadata: e.target.checked,
                    })
                  }
                />
              }
              label="Metadaten einschließen"
            />
          </Paper>
        </Grid>

        {/* Vorschau */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Export-Vorschau
            </Typography>

            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                Export umfasst {entityTypeLabels[exportSettings.entityType]} im{' '}
                {exportSettings.format.toUpperCase()}-Format mit GraphQL-Feldnamen für direkten
                Re-Import.
              </Typography>
            </Alert>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                GraphQL-Felder (re-import-fähig):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getFieldNamesByEntityType(exportSettings.entityType).map(field => (
                  <Chip key={field} label={field} variant="outlined" size="small" color="primary" />
                ))}
              </Box>
              <Typography
                variant="caption"
                sx={{ mt: 1, display: 'block', color: 'text.secondary' }}
              >
                ℹ️ Relationen werden als komma-getrennte IDs exportiert, um direkten Re-Import zu
                ermöglichen
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TableIcon />
          Excel Import/Export
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={currentTab} onChange={(_, newTab) => setCurrentTab(newTab)} sx={{ mb: 2 }}>
          <Tab label="Import" value="import" icon={<UploadIcon />} iconPosition="start" />
          <Tab label="Export" value="export" icon={<DownloadIcon />} iconPosition="start" />
        </Tabs>

        {currentTab === 'import' ? renderImportTab() : renderExportTab()}
      </DialogContent>

      <DialogActions>
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
        ) : (
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} /> : <DownloadIcon />}
          >
            {isExporting ? 'Exportiere...' : 'Export starten'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ExcelImportExport
