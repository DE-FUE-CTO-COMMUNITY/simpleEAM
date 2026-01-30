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
  Button,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Upload as UploadIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

import { ImportSettings, ValidationResult } from './types'
import { entityTypeLabels, entityTypeOrder, isFormatLocked, updateModeOptions } from './constants'

interface ImportDialogProps {
  importSettings: ImportSettings
  setImportSettings: (settings: ImportSettings) => void
  selectedFile: File | null
  validationResult: ValidationResult | null
  isImporting: boolean
  importProgress: number
  importSummary: { imported: number; failed: number; results?: any[] } | null
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
  importSummary,
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
                    {entityTypeOrder.map(entityType => (
                      <MenuItem key={entityType} value={entityType}>
                        {tEntityTypes(entityType as keyof typeof entityTypeLabels) || entityType}
                      </MenuItem>
                    ))}
                    <MenuItem key="all" value="all">
                      {tEntityTypes('all')}
                    </MenuItem>
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
                    accept={importSettings.format === 'json' ? '.json' : '.xlsx,.xls'}
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

                  {/* Field Coverage Information */}
                  {validationResult.fieldCoverage && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('fieldCoverage')}:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {/* Mandatory Fields Present */}
                        {validationResult.fieldCoverage.mandatoryFieldsPresent.length > 0 && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              ✓ {t('mandatoryFieldsPresent')}:
                            </Typography>
                            <Typography variant="caption" sx={{ pl: 2 }}>
                              {validationResult.fieldCoverage.mandatoryFieldsPresent.join(', ')}
                            </Typography>
                          </Box>
                        )}

                        {/* Mandatory Fields Missing */}
                        {validationResult.fieldCoverage.mandatoryFieldsMissing.length > 0 ? (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="error.main" fontWeight="bold">
                              ✗ {t('mandatoryFieldsMissing')}:
                            </Typography>
                            <Typography variant="caption" sx={{ pl: 2 }} color="error">
                              {validationResult.fieldCoverage.mandatoryFieldsMissing.join(', ')}
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="success.main">
                              ✓ {t('allMandatoryFieldsPresent')}
                            </Typography>
                          </Box>
                        )}

                        {/* Optional Fields Present */}
                        {validationResult.fieldCoverage.optionalFieldsPresent.length > 0 && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="info.main" fontWeight="bold">
                              ℹ {t('optionalFieldsPresent')} (
                              {validationResult.fieldCoverage.optionalFieldsPresent.length}):
                            </Typography>
                            <Typography variant="caption" sx={{ pl: 2 }}>
                              {validationResult.fieldCoverage.optionalFieldsPresent.join(', ')}
                            </Typography>
                          </Box>
                        )}

                        {/* Optional Fields Missing */}
                        {validationResult.fieldCoverage.optionalFieldsMissing.length > 0 && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight="bold">
                              ○ {t('optionalFieldsMissing')} (
                              {validationResult.fieldCoverage.optionalFieldsMissing.length}):
                            </Typography>
                            <Typography variant="caption" sx={{ pl: 2 }} color="text.secondary">
                              {validationResult.fieldCoverage.optionalFieldsMissing.join(', ')}
                            </Typography>
                          </Box>
                        )}

                        {/* Unmapped Columns */}
                        {validationResult.fieldCoverage.unmappedColumns.length > 0 ? (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="warning.main" fontWeight="bold">
                              ⚠ {t('unmappedColumns')}:
                            </Typography>
                            <Typography variant="caption" sx={{ pl: 2 }} color="warning.main">
                              {validationResult.fieldCoverage.unmappedColumns.join(', ')}
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="success.main">
                              ✓ {t('noUnmappedColumns')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Import Progress Indicator */}
                  {isImporting && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {t('importing', { progress: importProgress })}
                      </Typography>
                    </Box>
                  )}

                  {/* Multi-Tab Validierungsdetails */}
                  {validationResult.tabValidations &&
                    Object.keys(validationResult.tabValidations).length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Details pro Tab:
                        </Typography>
                        {Object.entries(validationResult.tabValidations).map(
                          ([tabName, tabValidation]: [string, any]) => (
                            <Box
                              key={tabName}
                              sx={{
                                mb: 1,
                                p: 1,
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {tabName}: {tabValidation.summary.validRows} von{' '}
                                {tabValidation.summary.totalRows} Datensätzen gültig
                              </Typography>
                              {tabValidation.errors.length > 0 && (
                                <Typography variant="body2" color="error">
                                  {tabValidation.errors.length} Fehler gefunden
                                </Typography>
                              )}
                            </Box>
                          )
                        )}
                      </Box>
                    )}

                  {validationResult.errors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('errors')}:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {validationResult.errors.map((error, index) => (
                          <Typography
                            key={index}
                            variant="caption"
                            component="div"
                            color="error"
                            sx={{ mb: 0.5 }}
                          >
                            {error.row ? `Row ${error.row}: ` : ''}
                            {error.message || error}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Import Summary - shown after import completes */}
              {importSummary && (
                <Box sx={{ mt: 2 }}>
                  <Alert
                    severity={importSummary.failed > 0 ? 'warning' : 'success'}
                    icon={importSummary.failed > 0 ? <WarningIcon /> : <InfoIcon />}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {t('importComplete')}
                    </Typography>
                    <Typography variant="body2">
                      {t('importedCount', { count: importSummary.imported })}
                    </Typography>
                    {importSummary.failed > 0 && (
                      <Typography variant="body2" color="error">
                        {t('failedCount', { count: importSummary.failed })}
                      </Typography>
                    )}
                  </Alert>

                  {/* Detailed results per entity type */}
                  {importSummary.results && importSummary.results.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('detailedResults')}:
                      </Typography>
                      {importSummary.results.map((result: any, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 1,
                            p: 1,
                            border: 1,
                            borderColor: result.failed > 0 ? 'warning.main' : 'divider',
                            borderRadius: 1,
                            bgcolor: result.failed > 0 ? 'warning.light' : 'transparent',
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {result.entityType}: {result.imported} {t('imported')}
                            {result.failed > 0 && `, ${result.failed} ${t('failed')}`}
                          </Typography>
                          {result.errors && result.errors.length > 0 && (
                            <Box sx={{ mt: 1, pl: 1 }}>
                              {result.errors.map((error: string, errIdx: number) => (
                                <Typography
                                  key={errIdx}
                                  variant="caption"
                                  component="div"
                                  color="error"
                                  sx={{ mb: 0.5 }}
                                >
                                  {error}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
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
