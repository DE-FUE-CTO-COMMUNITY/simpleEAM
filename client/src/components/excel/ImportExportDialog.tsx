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
import { isAdmin } from '@/lib/auth'

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
      await exportEntityData(apolloClient, exportSettings.entityType, exportSettings.format)
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

        {currentTab === 'import' && (
          <ImportDialog
            importSettings={importSettings}
            setImportSettings={setImportSettings}
            selectedFile={selectedFile}
            validationResult={validationResult}
            isImporting={isImporting}
            importProgress={importProgress}
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
  )
}

export default ImportExportDialog
