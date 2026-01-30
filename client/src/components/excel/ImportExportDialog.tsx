import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  CircularProgress,
} from '@mui/material'
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  TableChart as TableIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useApolloClient } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { clearDiagramStorage } from '../diagrams/utils/DiagramStorageUtils'
import { isAdmin } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'

// Import der Tab-Komponenten
import ImportDialog from './ImportDialog'
import ExportDialog from './ExportDialog'
import ManagementDialog from './ManagementDialog'

// Import der Typen und Konstanten
import { ImportSettings, ExportSettings, DeleteSettings, ValidationResult } from './types'
import {
  entityTypeLabels,
  defaultImportSettings,
  defaultExportSettings,
  defaultDeleteSettings,
} from './constants'
import {
  handleMultiTabImport,
  handleSingleTabImport,
  exportEntityData,
  deleteEntityData,
  refreshDashboardCache,
} from './operations'

// Import der Utilities
import { exportToExcel, downloadTemplateWithRealFields } from '../../utils/excelUtils'
import { validateImportData, getTemplateWithExamples } from '../../utils/excelDataService'
import { validateJsonImportData } from '../../utils/jsonDataService'

interface ImportExportDialogProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'import' | 'export' | 'management'
}

const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  isOpen,
  onClose,
  defaultTab = 'import',
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const apolloClient = useApolloClient()
  const t = useTranslations('importExport')
  const tCommon = useTranslations('common')
  const tEntityTypes = useTranslations('importExport.entityTypes')
  const { selectedCompanyId } = useCompanyContext()

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
  const [importSummary, setImportSummary] = useState<{
    imported: number
    failed: number
    results?: any[]
  } | null>(null)

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
      setImportSummary(null)
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
          const { importMultiTabFromJson } = await import('../../utils/jsonUtils')
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
            Infrastructures: 'infrastructures',
            Infrastructure: 'infrastructures', // Fallback for singular form
          }

          const entityType = entityTypeMapping[tabName]
          if (entityType && Array.isArray(tabData) && tabData.length > 0) {
            // Verwende JSON-spezifische Validierung für JSON-Format
            if (importSettings.format === 'json') {
              const validation = validateJsonImportData(tabData, entityType as any)
              allValidations[tabName] = validation
              totalValid += validation.summary.validRows
              totalErrors += validation.errors.length
            } else {
              // Für Excel-Format verwende Excel-spezifische Validierung
              const validation = validateImportData(tabData, entityType as any)
              allValidations[tabName] = validation
              totalValid += validation.summary.validRows
              totalErrors += validation.errors.length
            }
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
            ? t('import.messages.multiTabValidated', { count: totalValid })
            : t('import.messages.multiTabWarnings', { count: totalErrors }),
          { variant: combinedValidation.isValid ? 'success' : 'warning' }
        )
      } else {
        // Single-Tab Import Validation mit formatspezifischer Validierung
        let data: any[] = []

        if (importSettings.format === 'xlsx' && importSettings.entityType !== 'diagrams') {
          const { importFromExcel } = await import('../../utils/excelUtils')
          data = await importFromExcel(file)
        } else if (importSettings.format === 'json' || importSettings.entityType === 'diagrams') {
          const { importFromJson } = await import('../../utils/jsonUtils')
          data = await importFromJson(file)
        }

        // Verwende formatspezifische Validierung
        let validation
        if (importSettings.format === 'json') {
          validation = validateJsonImportData(data, importSettings.entityType as any)
        } else {
          validation = validateImportData(data, importSettings.entityType as any)
        }

        setValidationResult(validation)

        enqueueSnackbar(
          validation.isValid
            ? t('import.messages.singleTabValidated', { count: validation.summary.validRows })
            : t('import.messages.singleTabWarnings', { count: validation.errors.length }),
          { variant: validation.isValid ? 'success' : 'warning' }
        )
      }
    } catch (err) {
      enqueueSnackbar(
        t('import.messages.fileLoadError', {
          error: err instanceof Error ? err.message : tCommon('unknownError'),
        }),
        { variant: 'error' }
      )
    }
  }

  // Import Handler
  const handleImport = async () => {
    if (!selectedFile || !validationResult) return

    setIsImporting(true)
    setImportProgress(0)
    setImportSummary(null)

    try {
      let totalImported = 0
      let totalFailed = 0
      let importResults: any[] = []

      if (importSettings.entityType === 'all') {
        const result = await handleMultiTabImport(
          apolloClient,
          selectedFile,
          importSettings.format,
          progress => {
            setImportProgress(progress)
          },
          selectedCompanyId ?? undefined
        )
        totalImported = result.totalImported
        totalFailed = result.totalFailed
        importResults = result.importResults
      } else {
        const result = await handleSingleTabImport(
          apolloClient,
          selectedFile,
          importSettings.entityType,
          importSettings.format,
          progress => {
            setImportProgress(progress)
          },
          selectedCompanyId ?? undefined
        )
        totalImported = result.imported
        totalFailed = result.failed
        importResults = [
          {
            entityType: importSettings.entityType,
            imported: result.imported,
            failed: result.failed,
            errors: result.errors || [],
          },
        ]
      }

      await refreshDashboardCache(apolloClient)

      // Store import summary
      setImportSummary({
        imported: totalImported,
        failed: totalFailed,
        results: importResults,
      })

      // Show success message
      const successMessage =
        importSettings.entityType === 'all'
          ? totalFailed > 0
            ? t('import.messages.multiTabImportPartial', {
                imported: totalImported,
                failed: totalFailed,
              })
            : t('import.messages.multiTabImportSuccess', { count: totalImported })
          : totalFailed > 0
            ? t('import.messages.singleTabImportPartial', {
                entityType: tEntityTypes(importSettings.entityType) || importSettings.entityType,
                imported: totalImported,
                failed: totalFailed,
              })
            : t('import.messages.singleTabImportSuccess', {
                entityType: tEntityTypes(importSettings.entityType) || importSettings.entityType,
                count: totalImported,
              })

      enqueueSnackbar(successMessage, {
        variant: totalFailed > 0 ? 'warning' : 'success',
      })

      // Only reset file/validation if fully successful
      if (totalFailed === 0) {
        setSelectedFile(null)
        setValidationResult(null)
        setImportSummary(null)
        // Close dialog after successful import with no errors
        onClose()
      }
    } catch (error) {
      enqueueSnackbar(
        t('import.messages.importError', {
          error: error instanceof Error ? error.message : tCommon('unknownError'),
        }),
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
      await exportEntityData(
        apolloClient,
        exportSettings.entityType,
        exportSettings.format,
        selectedCompanyId ?? undefined
      )
      enqueueSnackbar(
        t('export.messages.exportSuccess', {
          entityType: tEntityTypes(exportSettings.entityType) || exportSettings.entityType,
        }),
        { variant: 'success' }
      )
    } catch (error) {
      enqueueSnackbar(
        t('export.messages.exportError', {
          error: error instanceof Error ? error.message : tCommon('unknownError'),
        }),
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
      const deletedCount = await deleteEntityData(
        apolloClient,
        deleteEntityType,
        selectedCompanyId ?? undefined
      )
      await refreshDashboardCache(apolloClient)

      // If all data or only diagrams are deleted, also clear the diagram localStorage
      if (deleteEntityType === 'all' || deleteEntityType === 'diagrams') {
        clearDiagramStorage()
      }

      enqueueSnackbar(
        deleteEntityType === 'all'
          ? t('management.messages.deleteAllSuccess', { count: deletedCount })
          : t('management.messages.deleteSuccess', {
              entityType:
                tEntityTypes(deleteEntityType as keyof typeof entityTypeLabels) || deleteEntityType,
              count: deletedCount,
            }),
        { variant: 'success' }
      )

      closeDeleteConfirmDialog()
    } catch (error) {
      enqueueSnackbar(
        t('management.messages.deleteError', {
          error: error instanceof Error ? error.message : tCommon('unknownError'),
        }),
        { variant: 'error' }
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Template Download Handlers
  const handleDownloadTemplate = async () => {
    if (importSettings.entityType === 'all') {
      enqueueSnackbar(t('import.messages.templateNotAvailable'), { variant: 'info' })
      return
    }

    try {
      await downloadTemplateWithRealFields(importSettings.entityType)
    } catch (error) {
      enqueueSnackbar(
        t('import.messages.templateDownloadError', {
          error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        }),
        { variant: 'error' }
      )
    }
  }

  const handleDownloadTemplateWithExamples = async () => {
    if (importSettings.entityType === 'all') {
      enqueueSnackbar(t('import.messages.templateNotAvailable'), { variant: 'info' })
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
        t('import.messages.templateDownloadError', {
          error: error instanceof Error ? error.message : tCommon('unknownError'),
        }),
        { variant: 'error' }
      )
    }
  }

  // Format locking logic
  const handleEntityTypeChange = (newEntityType: string) => {
    setImportSettings({
      ...importSettings,
      entityType: newEntityType as ImportSettings['entityType'],
    })
  }

  const handleFormatChange = (newFormat: string) => {
    setImportSettings({
      ...importSettings,
      format: newFormat as ImportSettings['format'],
    })
  }

  // Export format locking logic
  const handleExportEntityTypeChange = (newEntityType: string) => {
    // Für Alle Daten: CSV nicht erlaubt, aber Excel und JSON schon
    if (newEntityType === 'all' && exportSettings.format === 'csv') {
      enqueueSnackbar(t('export.messages.csvNotAvailable'), { variant: 'info' })
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
    // Für Alle Daten: CSV nicht erlaubt
    if (exportSettings.entityType === 'all' && newFormat === 'csv') {
      enqueueSnackbar(t('export.messages.csvNotAvailable'), { variant: 'info' })
      return
    }
    setExportSettings({
      ...exportSettings,
      format: newFormat as ExportSettings['format'],
    })
  }

  return (
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
          {t('title')}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={currentTab} onChange={(_, newTab) => setCurrentTab(newTab)} sx={{ mb: 2 }}>
          <Tab label={t('tabs.import')} value="import" icon={<UploadIcon />} iconPosition="start" />
          <Tab
            label={t('tabs.export')}
            value="export"
            icon={<DownloadIcon />}
            iconPosition="start"
          />
          {isAdmin() && (
            <Tab
              label={t('tabs.management')}
              value="management"
              icon={<TableIcon />}
              iconPosition="start"
            />
          )}
        </Tabs>

        {currentTab === 'import' && (
          <ImportDialog
            importSettings={importSettings}
            setImportSettings={setImportSettings}
            selectedFile={selectedFile}
            validationResult={validationResult}
            isImporting={isImporting}
            importProgress={importProgress}
            importSummary={importSummary}
            onFileUpload={handleFileUpload}
            onEntityTypeChange={handleEntityTypeChange}
            onFormatChange={handleFormatChange}
          />
        )}

        {currentTab === 'export' && (
          <ExportDialog
            exportSettings={exportSettings}
            onEntityTypeChange={handleExportEntityTypeChange}
            onFormatChange={handleExportFormatChange}
          />
        )}

        {currentTab === 'management' && isAdmin() && (
          <ManagementDialog
            deleteSettings={deleteSettings}
            setDeleteSettings={setDeleteSettings}
            isDeleting={isDeleting}
            showDeleteConfirm={showDeleteConfirm}
            deleteEntityType={deleteEntityType}
            onDeleteConfirm={handleDeleteConfirm}
            onOpenDeleteConfirmDialog={openDeleteConfirmDialog}
            onCloseDeleteConfirmDialog={closeDeleteConfirmDialog}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {currentTab === 'import' && (
            <>
              <Button variant="text" startIcon={<DownloadIcon />} onClick={handleDownloadTemplate}>
                {t('templates.emptyTemplate')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplateWithExamples}
              >
                {t('templates.templateWithExamples')}
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>{t('actions.cancel')}</Button>

          {currentTab === 'import' ? (
            <>
              {selectedFile && validationResult && (
                <Button
                  variant="contained"
                  onClick={handleImport}
                  disabled={
                    isImporting ||
                    validationResult.errors.length > 0 ||
                    validationResult.summary.validRows === 0 ||
                    !selectedCompanyId
                  }
                  title={!selectedCompanyId ? 'Bitte zuerst eine Company auswählen' : undefined}
                  startIcon={isImporting ? <CircularProgress size={20} /> : <UploadIcon />}
                >
                  {isImporting ? t('import.importing_') : t('import.startImport')}
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
              {isExporting ? t('export.exporting') : t('export.startExport')}
            </Button>
          ) : null}
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ImportExportDialog
