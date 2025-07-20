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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('importExport.import')
  const tEntityTypes = useTranslations('importExport.entityTypes')
  const tUpdateModes = useTranslations('importExport.updateModes')
  const tFileFormats = useTranslations('importExport.fileFormats')

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('title')}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('dataType')}</InputLabel>
                  <Select
                    value={importSettings.entityType}
                    label={t('dataType')}
                    onChange={e => onEntityTypeChange(e.target.value)}
                  >
                    {Object.entries(entityTypeLabels).map(([key, _label]) => (
                      <MenuItem key={key} value={key}>
                        {tEntityTypes(key as keyof typeof entityTypeLabels)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('fileFormat')}</InputLabel>
                  <Select
                    value={importSettings.format}
                    label={t('fileFormat')}
                    onChange={e => onFormatChange(e.target.value)}
                  >
                    <MenuItem
                      value="xlsx"
                      disabled={isFormatLocked(importSettings.entityType, 'xlsx')}
                    >
                      {tFileFormats('xlsx')}
                    </MenuItem>
                    <MenuItem value="json">{tFileFormats('json')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('updateMode')}</InputLabel>
                  <Select
                    value={importSettings.updateMode}
                    label={t('updateMode')}
                    onChange={e =>
                      setImportSettings({
                        ...importSettings,
                        updateMode: e.target.value as ImportSettings['updateMode'],
                      })
                    }
                  >
                    {updateModeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {tUpdateModes(option.value)}
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
                      {t('selectFile')}
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
                {t('fileStatus')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('fileName')}: {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('fileSize')}: {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>

              {validationResult && (
                <Box sx={{ mt: 2 }}>
                  <Alert
                    severity={validationResult.isValid ? 'success' : 'warning'}
                    icon={validationResult.isValid ? <InfoIcon /> : <WarningIcon />}
                  >
                    <Typography variant="body2">
                      {t('validRecords', {
                        count: validationResult.summary.validRows,
                        total: validationResult.summary.totalRows,
                      })}
                    </Typography>
                    {validationResult.errors.length > 0 && (
                      <Typography variant="body2" color="error">
                        {t('errorsFound', { count: validationResult.errors.length })}
                      </Typography>
                    )}
                  </Alert>

                  {validationResult.errors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('errors')}:
                      </Typography>
                      <List dense>
                        {validationResult.errors.slice(0, 5).map((error, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ErrorIcon color="error" />
                            </ListItemIcon>
                            <ListItemText
                              primary={error.message || error}
                              secondary={error.row && `${t('rowLabel')} ${error.row}`}
                            />
                          </ListItem>
                        ))}
                        {validationResult.errors.length > 5 && (
                          <ListItem>
                            <ListItemText
                              primary={t('moreErrors', {
                                count: validationResult.errors.length - 5,
                              })}
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
                    {t('importing', { progress: importProgress })}
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
