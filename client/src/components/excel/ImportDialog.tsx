import React, { useRef } from 'react'
import {
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
  Button,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  Upload as UploadIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

import { ImportSettings, ValidationResult } from './types'
import { entityTypeLabels, isFormatLocked, updateModeOptions } from './constants'

interface ImportDialogProps {
  importSettings: ImportSettings
  setImportSettings: (settings: ImportSettings) => void
  selectedFile: File | null
  validationResult: ValidationResult | null
  isImporting: boolean
  importProgress: number
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onEntityTypeChange: (entityType: string) => void
  onFormatChange: (format: string) => void
}

const ImportDialog: React.FC<ImportDialogProps> = ({
  importSettings,
  setImportSettings,
  selectedFile,
  validationResult,
  isImporting,
  importProgress,
  onFileUpload,
  onEntityTypeChange,
  onFormatChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
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
                    onChange={e => onEntityTypeChange(e.target.value)}
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
                    onChange={e => onFormatChange(e.target.value)}
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
                    onChange={onFileUpload}
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
}

export default ImportDialog
