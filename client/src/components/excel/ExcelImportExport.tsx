import React, { useState, useRef, useEffect } from 'react'
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
import { useApolloClient, gql } from '@apollo/client'

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
  getRequiredFieldsByEntityType,
} from '../../utils/excelDataService'

// GraphQL Mutations für Datenlöschung
const DELETE_ALL_DATA = `
  mutation DeleteAllData {
    deleteAllBusinessCapabilities
    deleteAllApplications
    deleteAllDataObjects
    deleteAllInterfaces
    deleteAllPersons
    deleteAllArchitectures
    deleteAllDiagrams
  }
`

const DELETE_BUSINESS_CAPABILITIES = `
  mutation DeleteAllBusinessCapabilities {
    deleteAllBusinessCapabilities
  }
`

const DELETE_APPLICATIONS = `
  mutation DeleteAllApplications {
    deleteAllApplications
  }
`

const DELETE_DATA_OBJECTS = `
  mutation DeleteAllDataObjects {
    deleteAllDataObjects
  }
`

const DELETE_INTERFACES = `
  mutation DeleteAllInterfaces {
    deleteAllInterfaces
  }
`

const DELETE_PERSONS = `
  mutation DeleteAllPersons {
    deleteAllPersons
  }
`

const DELETE_ARCHITECTURES = `
  mutation DeleteAllArchitectures {
    deleteAllArchitectures
  }
`

const DELETE_DIAGRAMS = `
  mutation DeleteAllDiagrams {
    deleteAllDiagrams
  }
`

// Import/Export Typen basierend auf den Anforderungen FR-IE-01 und FR-IE-02
interface ImportSettings {
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams'
    | 'all'
  format: 'xlsx'
  updateMode: 'overwrite' | 'merge' | 'skipExisting'
  validateData: boolean
  createTemplate: boolean
}

interface ExportSettings {
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams'
    | 'all'
  format: 'xlsx' | 'csv'
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
  const [currentTab, setCurrentTab] = useState<'import' | 'export' | 'management'>(defaultTab)

  // Import State
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    entityType: 'businessCapabilities',
    format: 'xlsx',
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
    format: 'xlsx',
  })
  const [isExporting, setIsExporting] = useState(false)

  // Data Management State
  const [deleteSettings, setDeleteSettings] = useState<{
    entityType:
      | 'businessCapabilities'
      | 'applications'
      | 'dataObjects'
      | 'interfaces'
      | 'persons'
      | 'architectures'
      | 'diagrams'
      | 'all'
  }>({
    entityType: 'businessCapabilities',
  })
  const [isDeleting, setIsDeleting] = useState(false)

  // Entity Type Labels
  const entityTypeLabels = {
    businessCapabilities: 'Business Capabilities',
    applications: 'Applikationen',
    dataObjects: 'Datenobjekte',
    interfaces: 'Schnittstellen',
    persons: 'Personen',
    architectures: 'Architekturen',
    diagrams: 'Diagramme',
    all: 'Alle Entitäten (Admin)',
  }

  // Reset-Funktionen für Datei und Validierung
  const resetFileAndValidation = () => {
    setSelectedFile(null)
    setValidationResult(null)
    setImportProgress(0)

    // Input-Element zurücksetzen
    const fileInput = document.getElementById('excel-file-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Dialog initialisierung - Datei zurücksetzen
  useEffect(() => {
    if (isOpen) {
      resetFileAndValidation()
    }
  }, [isOpen])

  // Entity-Type Änderung - Datei zurücksetzen
  useEffect(() => {
    resetFileAndValidation()
  }, [importSettings.entityType])

  // File Upload Handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setValidationResult(null)

    try {
      if (importSettings.entityType === 'all') {
        // Multi-Tab Import für Admin
        const { importMultiTabFromExcel } = await import('../../utils/excelUtils')
        const allData = await importMultiTabFromExcel(file)

        // Validiere alle Tabs
        const allValidations: { [tabName: string]: any } = {}
        let totalValid = 0
        let totalErrors = 0

        Object.entries(allData).forEach(([tabName, tabData]) => {
          // Mappe Tab-Namen zu Entity-Typen
          const entityTypeMapping: { [key: string]: string } = {
            'Business Capabilities': 'businessCapabilities',
            Applications: 'applications',
            'Data Objects': 'dataObjects',
            Interfaces: 'interfaces',
            Persons: 'persons',
            Architectures: 'architectures',
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

        // Erstelle zusammengefasste Validierung
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

        const statusMessage = combinedValidation.isValid
          ? `Multi-Tab-Datei ${file.name} erfolgreich geladen und validiert. ${totalValid} gültige Datensätze in ${Object.keys(allData).length} Tabs gefunden.`
          : `Multi-Tab-Datei ${file.name} geladen, aber ${totalErrors} Fehler gefunden.`

        enqueueSnackbar(statusMessage, {
          variant: combinedValidation.isValid ? 'success' : 'warning',
        })
      } else {
        // Single-Tab Import
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
      }
    } catch (err) {
      enqueueSnackbar(
        `Fehler beim Laden der Datei: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    }
  }

  // Import Execute mit verbesserter Fehlerbehandlung
  const handleImport = async () => {
    if (!selectedFile || !validationResult) return

    setIsImporting(true)
    setImportProgress(0)

    try {
      let totalImported = 0
      const importResults: { entityType: string; imported: number; errors: string[] }[] = []

      if (importSettings.entityType === 'all') {
        // Multi-Tab Import
        const { importMultiTabFromExcel } = await import('../../utils/excelUtils')
        const allData = await importMultiTabFromExcel(selectedFile)

        setImportProgress(10)

        const entityTypeMapping: { [key: string]: string } = {
          'Business Capabilities': 'businessCapabilities',
          Applications: 'applications',
          'Data Objects': 'dataObjects',
          Interfaces: 'interfaces',
          Persons: 'persons',
          Architectures: 'architectures',
          Diagrams: 'diagrams',
        }

        const tabEntries = Object.entries(allData)
        for (let i = 0; i < tabEntries.length; i++) {
          const [tabName, tabData] = tabEntries[i]
          const entityType = entityTypeMapping[tabName]

          if (entityType && Array.isArray(tabData) && tabData.length > 0) {
            try {
              const imported = await importEntityData(tabData, entityType as any)
              totalImported += imported
              importResults.push({
                entityType: tabName,
                imported,
                errors: [],
              })
            } catch (error) {
              console.error(`Fehler beim Import von ${tabName}:`, error)
              importResults.push({
                entityType: tabName,
                imported: 0,
                errors: [error instanceof Error ? error.message : 'Unbekannter Fehler'],
              })
            }
          }

          setImportProgress(10 + ((i + 1) / tabEntries.length) * 85)
        }
      } else {
        // Single-Tab Import
        const data = await importFromExcel(selectedFile)
        setImportProgress(20)

        try {
          totalImported = await importEntityData(data, importSettings.entityType as any)
          importResults.push({
            entityType: entityTypeLabels[importSettings.entityType],
            imported: totalImported,
            errors: [],
          })
        } catch (error) {
          console.error(`Fehler beim Import:`, error)
          importResults.push({
            entityType: entityTypeLabels[importSettings.entityType],
            imported: 0,
            errors: [error instanceof Error ? error.message : 'Unbekannter Fehler'],
          })
        }
      }

      setImportProgress(100)

      // Zeige detaillierte Ergebnisse an
      if (totalImported > 0) {
        const successfulImports = importResults.filter(r => r.imported > 0)
        const failedImports = importResults.filter(r => r.errors.length > 0)

        let message = `${totalImported} Datensätze erfolgreich importiert`
        if (successfulImports.length > 1) {
          message += ` (${successfulImports.map(r => `${r.entityType}: ${r.imported}`).join(', ')})`
        }

        enqueueSnackbar(message, { variant: 'success' })

        if (failedImports.length > 0) {
          const errorMessage = `Warnung: Fehler bei ${failedImports.map(r => r.entityType).join(', ')}`
          enqueueSnackbar(errorMessage, { variant: 'warning' })
        }
      } else {
        const errorMessage =
          importResults.length > 0 && importResults[0].errors.length > 0
            ? `Import fehlgeschlagen: ${importResults[0].errors[0]}`
            : 'Keine Datensätze importiert'
        enqueueSnackbar(errorMessage, { variant: 'error' })
      }

      if (totalImported > 0) {
        onClose()
      }
    } catch (err) {
      console.error('Import error:', err)
      enqueueSnackbar(
        `Fehler beim Import: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  // Hilfsfunktion: Konvertiert kommagetrennte IDs zu GraphQL-Verbindungen
  const parseRelationshipIds = (
    relationshipString: string | undefined
  ): { connect: { where: { node: { id: string } } }[] } | undefined => {
    if (!relationshipString || relationshipString.trim() === '') {
      return undefined
    }

    const ids = relationshipString
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '')
    if (ids.length === 0) {
      return undefined
    }

    return {
      connect: ids.map(id => ({
        where: { node: { id } },
      })),
    }
  }

  // Optionale Validierung von Beziehungs-IDs (kann später erweitert werden)
  const validateRelationshipIds = async (
    relationshipString: string | undefined,
    targetEntityType: string
  ): Promise<string[]> => {
    if (!relationshipString || relationshipString.trim() === '') {
      return []
    }

    const ids = relationshipString
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '')

    // TODO: Implementiere tatsächliche ID-Validierung durch GraphQL-Queries
    // Für jetzt geben wir alle IDs zurück, aber in Zukunft könnten wir prüfen:
    // - Existenz der referenzierten Entitäten
    // - Berechtigungen für Zugriff
    // - Vermeidung von zirkulären Referenzen

    return ids
  }

  // Hilfsfunktion: Sicheres Parsen von Zahlen
  const parseNumber = (value: any, defaultValue: number = 0): number => {
    if (value === undefined || value === null || value === '') {
      return defaultValue
    }
    const parsed = typeof value === 'string' ? parseFloat(value) : Number(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  // Hilfsfunktion: Sicheres Parsen von Ganzzahlen
  const parseInt = (value: any, defaultValue: number = 0): number => {
    if (value === undefined || value === null || value === '') {
      return defaultValue
    }
    const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  // Hilfsfunktion: Sicheres Parsen von Datumswerten
  const parseDate = (value: any): Date | undefined => {
    if (!value || value === '') {
      return undefined
    }
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? undefined : date
    } catch {
      return undefined
    }
  }

  // Hilfsfunktion: Parst kommagetrennte Tags/Arrays
  const parseStringArray = (value: any): string[] => {
    if (!value || value === '') {
      return []
    }
    if (Array.isArray(value)) {
      return value.map(String)
    }
    return String(value)
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '')
  }

  // Entity-spezifische Import-Funktionen
  const importEntityData = async (
    data: any[],
    entityType:
      | 'businessCapabilities'
      | 'applications'
      | 'dataObjects'
      | 'interfaces'
      | 'persons'
      | 'architectures'
      | 'diagrams'
  ): Promise<number> => {
    // Filtere nur gültige Datensätze (haben ID und erforderliche Felder)
    const validData = data.filter(row => {
      const requiredFields = getRequiredFieldsByEntityType(entityType)
      return requiredFields.every(field => row[field] && row[field] !== '')
    })

    if (validData.length === 0) {
      return 0
    }

    switch (entityType) {
      case 'businessCapabilities':
        return await importBusinessCapabilities(validData)
      case 'applications':
        return await importApplications(validData)
      case 'dataObjects':
        return await importDataObjects(validData)
      case 'interfaces':
        return await importApplicationInterfaces(validData)
      case 'persons':
        return await importPersons(validData)
      case 'architectures':
        return await importArchitectures(validData)
      case 'diagrams':
        return await importDiagrams(validData)
      default:
        throw new Error(`Import für Entity-Typ ${entityType} noch nicht implementiert`)
    }
  }

  // Business Capabilities Import
  const importBusinessCapabilities = async (data: any[]): Promise<number> => {
    const { CREATE_CAPABILITY } = await import('../../graphql/capability')

    const inputData = data.map(row => ({
      name: row.name,
      description: row.description || '',
      maturityLevel: parseInt(row.maturityLevel, 0),
      businessValue: parseInt(row.businessValue, 0),
      status: row.status || 'ACTIVE',
      tags: parseStringArray(row.tags),
      // Beziehungen
      owners: parseRelationshipIds(row.owners),
      parents: parseRelationshipIds(row.parents),
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_CAPABILITY,
      variables: { input: inputData },
    })

    return result?.createBusinessCapabilities?.businessCapabilities?.length || 0
  }

  // Applications Import
  const importApplications = async (data: any[]): Promise<number> => {
    const { CREATE_APPLICATION } = await import('../../graphql/application')

    const inputData = data.map(row => ({
      name: row.name,
      description: row.description || '',
      status: row.status || 'ACTIVE',
      criticality: row.criticality || 'MEDIUM',
      costs: parseNumber(row.costs, 0),
      vendor: row.vendor || '',
      version: row.version || '',
      hostingEnvironment: row.hostingEnvironment || '',
      technologyStack: parseStringArray(row.technologyStack),
      introductionDate: parseDate(row.introductionDate),
      endOfLifeDate: parseDate(row.endOfLifeDate),
      // Beziehungen
      owners: parseRelationshipIds(row.owners),
      supportsCapabilities: parseRelationshipIds(row.supportsCapabilities),
      usesDataObjects: parseRelationshipIds(row.usesDataObjects),
      partOfArchitectures: parseRelationshipIds(row.partOfArchitectures),
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_APPLICATION,
      variables: { input: inputData },
    })

    return result?.createApplications?.applications?.length || 0
  }

  // Data Objects Import
  const importDataObjects = async (data: any[]): Promise<number> => {
    const { CREATE_DATA_OBJECT } = await import('../../graphql/dataObject')

    const inputData = data.map(row => ({
      name: row.name,
      description: row.description || '',
      format: row.format || '',
      classification: row.classification || 'INTERNAL',
      introductionDate: parseDate(row.introductionDate),
      endOfLifeDate: parseDate(row.endOfLifeDate),
      // Beziehungen
      owners: parseRelationshipIds(row.owners),
      dataSources: parseRelationshipIds(row.dataSources),
      usedByApplications: parseRelationshipIds(row.usedByApplications),
      relatedToCapabilities: parseRelationshipIds(row.relatedToCapabilities),
      transferredInInterfaces: parseRelationshipIds(row.transferredInInterfaces),
      partOfArchitectures: parseRelationshipIds(row.partOfArchitectures),
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_DATA_OBJECT,
      variables: { input: inputData },
    })

    return result?.createDataObjects?.dataObjects?.length || 0
  }

  // Application Interfaces Import
  const importApplicationInterfaces = async (data: any[]): Promise<number> => {
    const { CREATE_APPLICATION_INTERFACE } = await import('../../graphql/applicationInterface')

    const inputData = data.map(row => ({
      name: row.name,
      description: row.description || '',
      interfaceType: row.interfaceType || 'API',
      protocol: row.protocol || 'HTTP',
      version: row.version || '',
      status: row.status || 'ACTIVE',
      introductionDate: parseDate(row.introductionDate),
      endOfLifeDate: parseDate(row.endOfLifeDate),
      // Beziehungen
      responsiblePerson: parseRelationshipIds(row.responsiblePerson),
      sourceApplications: parseRelationshipIds(row.sourceApplications),
      targetApplications: parseRelationshipIds(row.targetApplications),
      dataObjects: parseRelationshipIds(row.dataObjects),
      partOfArchitectures: parseRelationshipIds(row.partOfArchitectures),
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_APPLICATION_INTERFACE,
      variables: { input: inputData },
    })

    return result?.createApplicationInterfaces?.applicationInterfaces?.length || 0
  }

  // Persons Import
  const importPersons = async (data: any[]): Promise<number> => {
    const { CREATE_PERSON } = await import('../../graphql/person')

    const inputData = data.map(row => ({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email || '',
      phone: row.phone || '',
      role: row.role || '',
      department: row.department || '',
      // Beziehungen werden nach der Erstellung der Person behandelt
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_PERSON,
      variables: { input: inputData },
    })

    return result?.createPeople?.people?.length || 0
  }

  // Architectures Import
  const importArchitectures = async (data: any[]): Promise<number> => {
    const { CREATE_ARCHITECTURE } = await import('../../graphql/architecture')

    const inputData = data.map(row => ({
      name: row.name,
      description: row.description || '',
      domain: row.domain || 'ENTERPRISE',
      type: row.type || 'CURRENT_STATE',
      timestamp: parseDate(row.timestamp) || new Date(),
      tags: parseStringArray(row.tags),
      // Beziehungen
      owners: parseRelationshipIds(row.owners),
      containsApplications: parseRelationshipIds(row.containsApplications),
      containsCapabilities: parseRelationshipIds(row.containsCapabilities),
      containsDataObjects: parseRelationshipIds(row.containsDataObjects),
      diagrams: parseRelationshipIds(row.diagrams),
      parentArchitecture: parseRelationshipIds(row.parentArchitecture),
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_ARCHITECTURE,
      variables: { input: inputData },
    })

    return result?.createArchitectures?.architectures?.length || 0
  }

  // Diagrams Import
  const importDiagrams = async (data: any[]): Promise<number> => {
    const { CREATE_DIAGRAM } = await import('../../graphql/diagram')

    const inputData = data.map(row => ({
      title: row.title,
      description: row.description || '',
      diagramType: row.diagramType || 'PROCESS',
      diagramJson:
        row.diagramJson ||
        '{"type":"excalidraw","version":2,"source":"","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"}}',
      // Beziehungen
      creator: parseRelationshipIds(row.creator),
      architecture: parseRelationshipIds(row.architecture),
    }))

    const { data: result } = await apolloClient.mutate({
      mutation: CREATE_DIAGRAM,
      variables: { input: inputData },
    })

    return result?.createDiagrams?.diagrams?.length || 0
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
      if (importSettings.entityType === 'all') {
        enqueueSnackbar(
          'Template mit Beispieldaten für "Alle Entitäten" ist nicht verfügbar. Verwenden Sie einzelne Entity-Typen.',
          { variant: 'warning' }
        )
        return
      }

      const exampleData = getTemplateWithExamples(importSettings.entityType as any)
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

      // Erstelle Dateiname mit Zeitstempel
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')

      if (exportSettings.entityType === 'all') {
        // Multi-Tab Export für Admin
        const allData = data as { [tabName: string]: any[] }

        if (Object.keys(allData).length === 0) {
          enqueueSnackbar('Keine Daten zum Exportieren verfügbar', { variant: 'warning' })
          return
        }

        const { exportMultiTabToExcel } = await import('../../utils/excelUtils')

        exportMultiTabToExcel(allData, {
          filename: `SimpleEAM_Complete_Export_${timestamp}`,
          format: 'xlsx',
          includeHeaders: true,
        })

        const totalRecords = Object.values(allData).reduce(
          (sum, tabData) => sum + tabData.length,
          0
        )
        enqueueSnackbar(
          `Komplette Datenbank erfolgreich exportiert (${totalRecords} Datensätze in ${Object.keys(allData).length} Tabs)`,
          { variant: 'success' }
        )
      } else {
        // Single-Tab Export
        const singleData = data as any[]

        if (singleData.length === 0) {
          enqueueSnackbar('Keine Daten zum Exportieren verfügbar', { variant: 'warning' })
          return
        }

        const filename = `${entityTypeLabels[exportSettings.entityType]}_${timestamp}`

        // Führe den Export durch
        exportToExcel(singleData, {
          filename,
          sheetName: entityTypeLabels[exportSettings.entityType],
          format: exportSettings.format,
          includeHeaders: true,
        })

        enqueueSnackbar(
          `${entityTypeLabels[exportSettings.entityType]} erfolgreich als ${exportSettings.format.toUpperCase()} exportiert (${singleData.length} Datensätze)`,
          { variant: 'success' }
        )
      }

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
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Import-Einstellungen
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Datentyp</InputLabel>
              <Select
                value={importSettings.entityType}
                label="Datentyp"
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
              <InputLabel>Dateiformat</InputLabel>
              <Select
                value={importSettings.format}
                label="Dateiformat"
                onChange={e =>
                  setImportSettings({
                    ...importSettings,
                    format: e.target.value as ImportSettings['format'],
                  })
                }
              >
                <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
              </Select>
            </FormControl>

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
              sx={{ mt: 2 }}
            />

            {/* File Upload Button */}
            <Box sx={{ mt: 3 }}>
              <input
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                id="excel-file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="excel-file-upload">
                <Button variant="contained" startIcon={<UploadIcon />} component="span" fullWidth>
                  Excel-Datei auswählen
                </Button>
              </label>
            </Box>
          </Paper>
        </Grid>

        {/* File Upload Status */}
        {selectedFile && (
          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gewählte Datei
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedFile.name}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Validierungsergebnisse */}
        {validationResult && (
          <Grid size={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Validierungsergebnis
                {(validationResult as any).tabValidations && ' (Multi-Tab)'}
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

              {/* Multi-Tab Validierungsdetails */}
              {(validationResult as any).tabValidations && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Details pro Tab:
                  </Typography>
                  {Object.entries((validationResult as any).tabValidations).map(
                    ([tabName, tabValidation]: [string, any]) => (
                      <Chip
                        key={tabName}
                        label={`${tabName}: ${tabValidation.summary.validRows}/${tabValidation.summary.totalRows} gültig`}
                        color={tabValidation.isValid ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )
                  )}
                </Box>
              )}

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
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export-Einstellungen
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Datentyp</InputLabel>
              <Select
                value={exportSettings.entityType}
                label="Datentyp"
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
                label="Dateiformat"
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
          </Paper>
        </Grid>

        {/* Vorschau */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export-Vorschau
            </Typography>

            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                {exportSettings.entityType === 'all'
                  ? 'Admin-Export umfasst alle Entitäten in separaten Excel-Tabs mit GraphQL-Feldnamen für direkten Re-Import.'
                  : `Export umfasst ${entityTypeLabels[exportSettings.entityType]} im ${exportSettings.format.toUpperCase()}-Format mit GraphQL-Feldnamen für direkten Re-Import.`}
              </Typography>
            </Alert>

            <Box sx={{ mt: 2 }}>
              {exportSettings.entityType === 'all' ? (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Multi-Tab Export (Admin-Modus):
                  </Typography>
                  {Object.entries(
                    getFieldNamesByEntityType(exportSettings.entityType) as {
                      [tabName: string]: string[]
                    }
                  ).map(([tabName, fields]) => (
                    <Box key={tabName} sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        {tabName} ({fields.length} Felder):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 2 }}>
                        {fields.slice(0, 8).map(field => (
                          <Chip
                            key={field}
                            label={field}
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                        ))}
                        {fields.length > 8 && (
                          <Chip
                            label={`+${fields.length - 8} weitere`}
                            variant="outlined"
                            size="small"
                            color="default"
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    GraphQL-Felder (re-import-fähig):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(getFieldNamesByEntityType(exportSettings.entityType) as string[]).map(
                      field => (
                        <Chip
                          key={field}
                          label={field}
                          variant="outlined"
                          size="small"
                          color="primary"
                        />
                      )
                    )}
                  </Box>
                </>
              )}
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

  // Delete functions for data management
  const handleDeleteData = async (entityType: string) => {
    if (
      !confirm(
        `Sind Sie sicher, dass Sie alle ${entityTypeLabels[entityType as keyof typeof entityTypeLabels]} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      let mutation = ''

      switch (entityType) {
        case 'businessCapabilities':
          mutation = DELETE_BUSINESS_CAPABILITIES
          break
        case 'applications':
          mutation = DELETE_APPLICATIONS
          break
        case 'dataObjects':
          mutation = DELETE_DATA_OBJECTS
          break
        case 'interfaces':
          mutation = DELETE_INTERFACES
          break
        case 'persons':
          mutation = DELETE_PERSONS
          break
        case 'architectures':
          mutation = DELETE_ARCHITECTURES
          break
        case 'diagrams':
          mutation = DELETE_DIAGRAMS
          break
        case 'all':
          mutation = DELETE_ALL_DATA
          break
        default:
          throw new Error('Unbekannter Entity-Typ')
      }

      await apolloClient.mutate({ mutation: gql(mutation) })

      enqueueSnackbar(
        entityType === 'all'
          ? 'Alle Daten erfolgreich gelöscht'
          : `${entityTypeLabels[entityType as keyof typeof entityTypeLabels]} erfolgreich gelöscht`,
        { variant: 'success' }
      )
    } catch (error) {
      console.error('Delete error:', error)
      enqueueSnackbar(
        `Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const renderManagementTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Warnung */}
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

        {/* Einzelne Entity-Typen löschen */}
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
                    entityType: e.target.value as typeof deleteSettings.entityType,
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
                onClick={() => handleDeleteData(deleteSettings.entityType)}
              >
                {isDeleting
                  ? 'Lösche...'
                  : `${entityTypeLabels[deleteSettings.entityType]} löschen`}
              </Button>
            </Box>

            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Löscht alle Einträge des ausgewählten Datentyps aus der Datenbank.
            </Typography>
          </Paper>
        </Grid>

        {/* Komplette Datenbank löschen */}
        <Grid size={12}>
          <Paper sx={{ p: 3, border: '2px solid', borderColor: 'error.main' }}>
            <Typography variant="h6" gutterBottom color="error">
              ⚠️ Komplette Datenbank löschen
            </Typography>

            <Alert severity="error" sx={{ mb: 2 }}>
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
              onClick={() => handleDeleteData('all')}
              sx={{ mt: 1 }}
            >
              {isDeleting ? 'Lösche alle Daten...' : 'ALLE DATEN LÖSCHEN'}
            </Button>

            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Diese Aktion kann nicht rückgängig gemacht werden. Stellen Sie sicher, dass Sie ein
              vollständiges Backup haben.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
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
          <Tab
            label="Datenverwaltung"
            value="management"
            icon={<TableIcon />}
            iconPosition="start"
          />
        </Tabs>

        {currentTab === 'import' && renderImportTab()}
        {currentTab === 'export' && renderExportTab()}
        {currentTab === 'management' && renderManagementTab()}
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

export default ExcelImportExport
