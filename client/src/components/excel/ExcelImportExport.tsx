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
import { isAdmin } from '@/lib/auth'

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

// GraphQL Mutations imports
import {
  CREATE_CAPABILITY,
  UPDATE_CAPABILITY,
  CHECK_CAPABILITY_EXISTS,
  GET_CAPABILITIES_COUNT,
} from '../../graphql/capability'
import {
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  CHECK_APPLICATION_EXISTS,
  GET_APPLICATIONS_COUNT,
} from '../../graphql/application'
import {
  CREATE_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
  CHECK_APPLICATION_INTERFACE_EXISTS,
  GET_APPLICATION_INTERFACES_COUNT,
} from '../../graphql/applicationInterface'
import {
  CREATE_DATA_OBJECT,
  UPDATE_DATA_OBJECT,
  CHECK_DATA_OBJECT_EXISTS,
  GET_DATA_OBJECTS_COUNT,
} from '../../graphql/dataObject'
import {
  CREATE_PERSON,
  UPDATE_PERSON,
  CHECK_PERSON_EXISTS,
  GET_PERSONS_COUNT,
} from '../../graphql/person'
import {
  CREATE_ARCHITECTURE,
  UPDATE_ARCHITECTURE,
  CHECK_ARCHITECTURE_EXISTS,
  GET_ARCHITECTURES_COUNT,
} from '../../graphql/architecture'
import {
  CREATE_DIAGRAM,
  UPDATE_DIAGRAM,
  CHECK_DIAGRAM_EXISTS,
  GET_DIAGRAMS_COUNT,
} from '../../graphql/diagram'
import {
  CREATE_ARCHITECTURE_PRINCIPLE,
  UPDATE_ARCHITECTURE_PRINCIPLE,
  CHECK_ARCHITECTURE_PRINCIPLE_EXISTS,
  GET_ARCHITECTURE_PRINCIPLES_COUNT,
} from '../../graphql/architecturePrinciple'

// GraphQL enums
import {
  ApplicationStatus,
  CriticalityLevel,
  DataClassification,
  InterfaceType,
  InterfaceStatus,
  ArchitectureDomain,
  ArchitectureType,
  PrincipleCategory,
  PrinciplePriority,
} from '../../gql/generated'

// GraphQL Mutations für Datenlöschung
const DELETE_BUSINESS_CAPABILITIES = `
  mutation DeleteAllBusinessCapabilities {
    deleteBusinessCapabilities(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_APPLICATIONS = `
  mutation DeleteAllApplications {
    deleteApplications(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_DATA_OBJECTS = `
  mutation DeleteAllDataObjects {
    deleteDataObjects(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_INTERFACES = `
  mutation DeleteAllInterfaces {
    deleteApplicationInterfaces(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_PERSONS = `
  mutation DeleteAllPersons {
    deletePeople(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_ARCHITECTURES = `
  mutation DeleteAllArchitectures {
    deleteArchitectures(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_DIAGRAMS = `
  mutation DeleteAllDiagrams {
    deleteDiagrams(where: {}) {
      nodesDeleted
    }
  }
`

const DELETE_ARCHITECTURE_PRINCIPLES = `
  mutation DeleteAllArchitecturePrinciples {
    deleteArchitecturePrinciples(where: {}) {
      nodesDeleted
    }
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
    | 'architecturePrinciples'
    | 'all'
  format: 'xlsx'
  updateMode: 'overwrite' | 'merge' | 'skipExisting'
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
    | 'architecturePrinciples'
    | 'all'
  format: 'xlsx' | 'csv'
}

interface ExcelImportExportProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'import' | 'export'
}

// Helper function to parse comma-separated relationship IDs
const parseRelationshipIds = (value: string | undefined | null): string[] => {
  if (!value || typeof value !== 'string') return []
  return value
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0)
}

// Helper function to get relationship field names for each entity type
const getRelationshipFields = (entityType: string): string[] => {
  switch (entityType) {
    case 'businessCapabilities':
      return ['owners', 'parents']
    case 'applications':
      return ['owners', 'supportsCapabilities', 'usesDataObjects', 'partOfArchitectures']
    case 'dataObjects':
      return [
        'owners',
        'dataSources',
        'usedByApplications',
        'relatedToCapabilities',
        'transferredInInterfaces',
        'partOfArchitectures',
      ]
    case 'interfaces':
      return [
        'responsiblePerson',
        'sourceApplications',
        'targetApplications',
        'dataObjects',
        'partOfArchitectures',
      ]
    case 'persons':
      return [] // Persons typically don't have relationships in our model
    case 'architectures':
      return [
        'owners',
        'containsApplications',
        'containsCapabilities',
        'containsDataObjects',
        'diagrams',
        'parentArchitecture',
      ]
    case 'diagrams':
      return ['creator', 'architecture']
    case 'architecturePrinciples':
      return ['owners', 'appliedInArchitectures', 'implementedByApplications']
    default:
      return []
  }
}

// Helper function to transform input for UPDATE mutations (wrap scalars in { set: value })
const transformInputForUpdate = (input: any): any => {
  const transformed: any = {}

  for (const [key, value] of Object.entries(input)) {
    if (key.includes('connect') || key.includes('disconnect') || key.includes('create')) {
      // Relationship fields - keep as is
      transformed[key] = value
    } else if (Array.isArray(value)) {
      // Array fields - wrap in { set: array }
      transformed[key] = { set: value }
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      // Scalar fields - wrap in { set: value }
      transformed[key] = { set: value }
    } else {
      // Other types - keep as is
      transformed[key] = value
    }
  }

  return transformed
}

// Helper function to check if entity exists in database
const checkEntityExists = async (client: any, entityType: string, id: string): Promise<boolean> => {
  const queryMap = {
    businessCapabilities: CHECK_CAPABILITY_EXISTS,
    applications: CHECK_APPLICATION_EXISTS,
    dataObjects: CHECK_DATA_OBJECT_EXISTS,
    interfaces: CHECK_APPLICATION_INTERFACE_EXISTS,
    persons: CHECK_PERSON_EXISTS,
    architectures: CHECK_ARCHITECTURE_EXISTS,
    diagrams: CHECK_DIAGRAM_EXISTS,
    architecturePrinciples: CHECK_ARCHITECTURE_PRINCIPLE_EXISTS,
  }

  const query = queryMap[entityType as keyof typeof queryMap]
  if (!query) {
    throw new Error(`No existence check query found for entity type: ${entityType}`)
  }

  try {
    const result = await client.query({
      query,
      variables: { id },
      fetchPolicy: 'network-only', // Always fetch from server to get latest data
    })

    // Check if any entities were returned
    const entities = Object.values(result.data)[0] as any[]
    return entities && entities.length > 0
  } catch {
    return false // If there's an error, assume entity doesn't exist and try to create
  }
}

// Helper function to import entity data with GraphQL mutations and return ID mappings
const importEntityDataWithMapping = async (
  client: any,
  data: any[],
  entityType: string,
  _skipRelationships: boolean = false
): Promise<{ imported: number; entityMappings: { [originalId: string]: string } }> => {
  let importedCount = 0
  const entityMappings: { [originalId: string]: string } = {}
  
  const mutationMap = {
    businessCapabilities: CREATE_CAPABILITY,
    applications: CREATE_APPLICATION,
    dataObjects: CREATE_DATA_OBJECT,
    interfaces: CREATE_APPLICATION_INTERFACE,
    persons: CREATE_PERSON,
    architectures: CREATE_ARCHITECTURE,
    diagrams: CREATE_DIAGRAM,
    architecturePrinciples: CREATE_ARCHITECTURE_PRINCIPLE,
  }

  const updateMutationMap = {
    businessCapabilities: UPDATE_CAPABILITY,
    applications: UPDATE_APPLICATION,
    dataObjects: UPDATE_DATA_OBJECT,
    interfaces: UPDATE_APPLICATION_INTERFACE,
    persons: UPDATE_PERSON,
    architectures: UPDATE_ARCHITECTURE,
    diagrams: UPDATE_DIAGRAM,
    architecturePrinciples: UPDATE_ARCHITECTURE_PRINCIPLE,
  }

  const createMutation = mutationMap[entityType as keyof typeof mutationMap]
  const updateMutation = updateMutationMap[entityType as keyof typeof updateMutationMap]

  if (!createMutation) {
    throw new Error(`No mutation found for entity type: ${entityType}`)
  }

  for (const row of data) {
    // Store original ID before processing and validate it
    const originalId = String(row.id || '').trim()

    // Skip rows with empty or invalid Excel IDs - this prevents mapping issues
    if (!originalId || originalId === '') {
      continue
    }

    // Prepare input data based on entity type (same logic as before)
    let input: any = {}

    switch (entityType) {
      case 'businessCapabilities':
        input = {
          name: row.name || '',
          description: row.description || '',
          maturityLevel: row.maturityLevel ? parseInt(String(row.maturityLevel), 10) : undefined,
          status: row.status || '',
          businessValue: row.businessValue ? parseInt(String(row.businessValue), 10) : undefined,
          tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
        }
        break

      case 'applications': {
        const validStatus = Object.values(ApplicationStatus).includes(
          row.status as ApplicationStatus
        )
          ? (row.status as ApplicationStatus)
          : ApplicationStatus.ACTIVE
        const validCriticality = Object.values(CriticalityLevel).includes(
          row.criticality as CriticalityLevel
        )
          ? (row.criticality as CriticalityLevel)
          : CriticalityLevel.MEDIUM

        input = {
          name: row.name || '',
          description: row.description || '',
          version: row.version || '',
          status: validStatus,
          criticality: validCriticality,
          vendor: row.vendor || '',
          hostingEnvironment: row.hostingEnvironment || '',
          costs: row.costs ? parseFloat(row.costs) : undefined,
          technologyStack: row.technologyStack
            ? row.technologyStack.split(',').map((tech: string) => tech.trim())
            : [],
          introductionDate: row.introductionDate || undefined,
          endOfLifeDate: row.endOfLifeDate || undefined,
        }
        break
      }

      case 'dataObjects': {
        // Validate classification enum value
        const validClassification = Object.values(DataClassification).includes(
          row.classification as DataClassification
        )
          ? (row.classification as DataClassification)
          : DataClassification.INTERNAL // Default fallback

        input = {
          name: row.name || '',
          description: row.description || '',
          format: row.format || '',
          classification: validClassification,
        }
        break
      }

      case 'interfaces': {
        // Validate interfaceType enum value
        const validInterfaceType = Object.values(InterfaceType).includes(
          row.interfaceType as InterfaceType
        )
          ? (row.interfaceType as InterfaceType)
          : InterfaceType.API // Default fallback

        // Validate status enum value
        const validStatus = Object.values(InterfaceStatus).includes(row.status as InterfaceStatus)
          ? (row.status as InterfaceStatus)
          : InterfaceStatus.PLANNED // Default fallback

        input = {
          name: row.name || '',
          description: row.description || '',
          interfaceType: validInterfaceType,
          protocol: row.protocol || '',
          version: row.version || '',
          status: validStatus,
          introductionDate: row.introductionDate || undefined,
          endOfLifeDate: row.endOfLifeDate || undefined,
        }
        break
      }

      case 'persons':
        input = {
          firstName: row.firstName || '',
          lastName: row.lastName || '',
          email: row.email || '',
          role: row.role || '',
          department: row.department || '',
        }
        break

      case 'architectures': {
        // Validate enum values
        const domainValue = row.domain?.toUpperCase()
        const typeValue = row.type?.toUpperCase()

        // Validate domain enum
        const validDomain = Object.values(ArchitectureDomain).includes(
          domainValue as ArchitectureDomain
        )
          ? (domainValue as ArchitectureDomain)
          : ArchitectureDomain.ENTERPRISE // default

        // Validate type enum
        const validType = Object.values(ArchitectureType).includes(typeValue as ArchitectureType)
          ? (typeValue as ArchitectureType)
          : ArchitectureType.CURRENT_STATE // default

        // Ensure timestamp is provided or use current timestamp
        const timestamp = row.timestamp
          ? new Date(row.timestamp).toISOString()
          : new Date(Date.now()).toISOString() // Use explicit timestamp for consistency

        input = {
          name: row.name || '',
          description: row.description || '',
          domain: validDomain,
          type: validType,
          timestamp: timestamp,
        }
        break
      }

      case 'diagrams':
        input = {
          title: row.title || row.name || '',
          description: row.description || '',
          diagramJson: row.diagramJson || row.content || '{}',
        }
        break

      case 'architecturePrinciples': {
        // Validate enum values
        const categoryValue = row.category?.toUpperCase()
        const priorityValue = row.priority?.toUpperCase()

        // Validate category enum
        const validCategory = Object.values(PrincipleCategory).includes(
          categoryValue as PrincipleCategory
        )
          ? (categoryValue as PrincipleCategory)
          : PrincipleCategory.BUSINESS // default

        // Validate priority enum
        const validPriority = Object.values(PrinciplePriority).includes(
          priorityValue as PrinciplePriority
        )
          ? (priorityValue as PrinciplePriority)
          : PrinciplePriority.MEDIUM // default

        // Parse tags from comma-separated string
        const tags = row.tags
          ? row.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag.length > 0)
          : []

        // Parse boolean value for isActive
        const isActive = row.isActive === 'true' || row.isActive === true || row.isActive === 1

        input = {
          name: row.name || '',
          description: row.description || '',
          category: validCategory,
          priority: validPriority,
          rationale: row.rationale || '',
          implications: row.implications || '',
          tags: tags,
          isActive: isActive,
        }
        break
      }

      default:
        throw new Error(`Unsupported entity type: ${entityType}`)
    }

    // Execute the mutation
    let shouldUpdate = false
    if (row.id && row.id.trim() !== '') {
      shouldUpdate = await checkEntityExists(client, entityType, row.id)
    }

    if (shouldUpdate && updateMutation) {
      // Update existing record - keep original ID mapping
      await client.mutate({
        mutation: updateMutation,
        variables: {
          id: row.id,
          input: transformInputForUpdate(input),
        },
      })
      // For updates, map original ID to itself (since we're keeping the same ID)
      entityMappings[originalId] = row.id
    } else {
      // Create new record and capture the created ID
      const result = await client.mutate({
        mutation: createMutation,
        variables: {
          input: [input],
        },
      })

      // Extract the actual database ID from the response
      if (result.data) {
        // Get the mutation response object based on entity type
        let createdEntities: any[] | undefined

        switch (entityType) {
          case 'businessCapabilities':
            createdEntities = result.data.createBusinessCapabilities?.businessCapabilities
            break
          case 'applications':
            createdEntities = result.data.createApplications?.applications
            break
          case 'dataObjects':
            createdEntities = result.data.createDataObjects?.dataObjects
            break
          case 'interfaces':
            createdEntities = result.data.createApplicationInterfaces?.applicationInterfaces
            break
          case 'persons':
            createdEntities = result.data.createPeople?.people
            break
          case 'architectures':
            createdEntities = result.data.createArchitectures?.architectures
            break
          case 'diagrams':
            createdEntities = result.data.createDiagrams?.diagrams
            break
          case 'architecturePrinciples':
            createdEntities = result.data.createArchitecturePrinciples?.architecturePrinciples
            break
          default:
            break
        }

        if (createdEntities && createdEntities.length > 0) {
          const createdEntity = createdEntities[0]
          if (createdEntity && createdEntity.id) {
            const actualDbId = createdEntity.id

            // Map original Excel ID to actual database ID (originalId is guaranteed to be valid due to validation above)
            entityMappings[originalId] = actualDbId
          }
        }
      }
    }

    importedCount++
  }

  return { imported: importedCount, entityMappings }
}

const ExcelImportExport: React.FC<ExcelImportExportProps> = ({
  isOpen,
  onClose,
  defaultTab = 'import',
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const apolloClient = useApolloClient()

  // Function to refresh dashboard cache after successful imports
  const refreshDashboardCache = async () => {
    try {
      // Import main entity queries to also refresh entity table data
      const { GET_CAPABILITIES } = await import('../../graphql/capability')
      const { GET_APPLICATIONS } = await import('../../graphql/application')
      const { GET_DATA_OBJECTS } = await import('../../graphql/dataObject')
      const { GET_ARCHITECTURES } = await import('../../graphql/architecture')
      const { GET_DIAGRAMS } = await import('../../graphql/diagram')
      const { GET_APPLICATION_INTERFACES } = await import('../../graphql/applicationInterface')
      const { GET_PERSONS } = await import('../../graphql/person')
      const { GET_ARCHITECTURE_PRINCIPLES } = await import('../../graphql/architecturePrinciple')

      // Refetch all dashboard count queries AND main entity list queries to update both dashboard and entity tables
      await apolloClient.refetchQueries({
        include: [
          // Dashboard count queries
          GET_CAPABILITIES_COUNT,
          GET_APPLICATIONS_COUNT,
          GET_DATA_OBJECTS_COUNT,
          GET_ARCHITECTURES_COUNT,
          GET_DIAGRAMS_COUNT,
          GET_APPLICATION_INTERFACES_COUNT,
          GET_PERSONS_COUNT,
          GET_ARCHITECTURE_PRINCIPLES_COUNT,
          // Main entity list queries for table refresh
          GET_CAPABILITIES,
          GET_APPLICATIONS,
          GET_DATA_OBJECTS,
          GET_ARCHITECTURES,
          GET_DIAGRAMS,
          GET_APPLICATION_INTERFACES,
          GET_PERSONS,
          GET_ARCHITECTURE_PRINCIPLES,
        ],
      })
    } catch {
      // Error refreshing dashboard cache - continue silently
    }
  }

  // Tab-Management
  const [currentTab, setCurrentTab] = useState<'import' | 'export' | 'management'>(defaultTab)

  // Import State
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    entityType: 'businessCapabilities',
    format: 'xlsx',
    updateMode: 'merge',
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

  // Delete Confirmation Dialog State
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean
    entityType: string | null
    entityLabel: string
  }>({
    isOpen: false,
    entityType: null,
    entityLabel: '',
  })

  // Ref für das Datei-Input-Element
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Entity Type Labels
  const entityTypeLabels = {
    businessCapabilities: 'Business Capabilities',
    applications: 'Applikationen',
    dataObjects: 'Datenobjekte',
    interfaces: 'Schnittstellen',
    persons: 'Personen',
    architectures: 'Architekturen',
    diagrams: 'Diagramme',
    architecturePrinciples: 'Architekturprinzipien',
    ...(isAdmin() && { all: 'Alle Entitäten (Admin)' }),
  }

  // Reset-Funktionen für Datei und Validierung
  const resetFileAndValidation = () => {
    setSelectedFile(null)
    setValidationResult(null)
    setImportProgress(0)

    // Input-Element zurücksetzen mit React Ref
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Dialog initialisierung - Datei zurücksetzen
  useEffect(() => {
    if (isOpen) {
      resetFileAndValidation()
    }
  }, [isOpen])

  // Entity-Type Änderung - Datei zurücksetzen und Format anpassen
  useEffect(() => {
    resetFileAndValidation()

    // Automatisch auf XLSX umstellen, wenn 'all' ausgewählt wird (CSV unterstützt keine Multi-Tabs)
    if (exportSettings.entityType === 'all' && exportSettings.format === 'csv') {
      setExportSettings(prev => ({
        ...prev,
        format: 'xlsx',
      }))
    }
  }, [importSettings.entityType, exportSettings.entityType, exportSettings.format])

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
        // Multi-Tab Import with Two-Phase Approach
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
          'Architecture Principles': 'architecturePrinciples',
        }

        // Mapping for import functions that expect display names
        const displayNameMapping: { [key: string]: string } = {
          'Business Capabilities': 'Business Capabilities',
          Applications: 'Applications',
          'Data Objects': 'Data Objects',
          Interfaces: 'Interfaces',
          Persons: 'Persons',
          Architectures: 'Architectures',
          Diagrams: 'Diagrams',
          'Architecture Principles': 'Architecture Principles',
        }

        const tabEntries = Object.entries(allData)
        const createdEntityMappings: { [tabName: string]: { [originalId: string]: string } } = {}

        // PHASE 1: Import all entities without relationships
        for (let i = 0; i < tabEntries.length; i++) {
          const [tabName, tabData] = tabEntries[i]
          const entityType = entityTypeMapping[tabName]
          const displayName = displayNameMapping[tabName]

          if (entityType && displayName && Array.isArray(tabData) && tabData.length > 0) {
            try {
              const { imported, entityMappings } = await importEntityDataWithMapping(
                apolloClient,
                tabData,
                displayName,
                true
              ) // true = skipRelationships
              totalImported += imported
              createdEntityMappings[tabName] = entityMappings
              importResults.push({
                entityType: tabName,
                imported,
                errors: [],
              })
            } catch (error) {
              importResults.push({
                entityType: tabName,
                imported: 0,
                errors: [error instanceof Error ? error.message : 'Unbekannter Fehler'],
              })
            }
          }

          setImportProgress(10 + ((i + 1) / tabEntries.length) * 40) // First half for phase 1
        }

        // PHASE 2: Update entities with relationships using actual database IDs

        // Create comprehensive mapping from all entity types
        const allEntityMappings: { [originalId: string]: string } = {}
        Object.values(createdEntityMappings).forEach(entityTypeMapping => {
          Object.assign(allEntityMappings, entityTypeMapping)
        })

        for (let i = 0; i < tabEntries.length; i++) {
          const [tabName, tabData] = tabEntries[i]
          const entityType = entityTypeMapping[tabName]

          if (entityType && Array.isArray(tabData) && tabData.length > 0) {
            try {
              // Update tabData with actual database IDs from Phase 1 AND map relationship field values
              const updatedTabData = tabData.map(row => {
                const originalId = String(row.id || '')
                const actualDbId = createdEntityMappings[tabName]?.[originalId]

                // Update the main entity ID
                const updatedRow: any = actualDbId ? { ...row, id: actualDbId } : { ...row }

                // Map all relationship field values to actual database UUIDs
                const relationshipFields = getRelationshipFields(entityType as any)
                relationshipFields.forEach((fieldName: string) => {
                  if (updatedRow[fieldName]) {
                    const originalIds = parseRelationshipIds(updatedRow[fieldName])
                    const mappedIds = originalIds
                      .map(originalId => allEntityMappings[originalId] || originalId)
                      .filter(id => id) // Remove any null/undefined values

                    if (mappedIds.length > 0) {
                      updatedRow[fieldName] = mappedIds.join(',')
                    }
                  }
                })
                return updatedRow
              })

              await updateEntityRelationships(
                updatedTabData,
                entityType as
                  | 'businessCapabilities'
                  | 'applications'
                  | 'dataObjects'
                  | 'interfaces'
                  | 'persons'
                  | 'architectures'
                  | 'diagrams'
                  | 'architecturePrinciples'
              )
            } catch (error) {
              // Update error in existing result
              const existingResult = importResults.find(r => r.entityType === tabName)
              if (existingResult) {
                existingResult.errors.push(
                  `Relationship update failed: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
                )
              }
            }
          }

          setImportProgress(50 + ((i + 1) / tabEntries.length) * 45) // Second half for phase 2
        }
      } else {
        // Single-Tab Import with Two-Phase Approach
        const data = await importFromExcel(selectedFile)
        setImportProgress(20)

        try {
          // PHASE 1: Import entities without relationships
          const { imported, entityMappings } = await importEntityDataWithMapping(
            apolloClient,
            data,
            importSettings.entityType,
            true
          ) // true = skipRelationships
          totalImported = imported
          setImportProgress(60)

          // PHASE 2: Update entities with relationships using actual database IDs
          const updatedData = data.map(row => {
            const originalId = String(row.id || '')
            const actualDbId = entityMappings[originalId]

            // Update the main entity ID
            const updatedRow: any = actualDbId ? { ...row, id: actualDbId } : { ...row }

            // Map all relationship field values to actual database UUIDs
            const relationshipFields = getRelationshipFields(importSettings.entityType)
            relationshipFields.forEach((fieldName: string) => {
              if (updatedRow[fieldName]) {
                const originalIds = parseRelationshipIds(updatedRow[fieldName])
                const mappedIds = originalIds
                  .map(originalId => entityMappings[originalId] || originalId)
                  .filter(id => id) // Remove any null/undefined values

                if (mappedIds.length > 0) {
                  updatedRow[fieldName] = mappedIds.join(',')
                }
              }
            })

            return updatedRow
          })

          await updateEntityRelationships(
            updatedData,
            importSettings.entityType as
              | 'businessCapabilities'
              | 'applications'
              | 'dataObjects'
              | 'interfaces'
              | 'persons'
              | 'architectures'
              | 'diagrams'
              | 'architecturePrinciples'
          )
          setImportProgress(90)

          importResults.push({
            entityType: entityTypeLabels[importSettings.entityType],
            imported: totalImported,
            errors: [],
          })
        } catch (error) {
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

        // Refresh dashboard cache to show updated counts
        await refreshDashboardCache()

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
      enqueueSnackbar(
        `Fehler beim Import: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        { variant: 'error' }
      )
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  // Phase 2: Update entities with relationships after all entities exist
  const updateEntityRelationships = async (
    data: any[],
    entityType:
      | 'businessCapabilities'
      | 'applications'
      | 'dataObjects'
      | 'interfaces'
      | 'persons'
      | 'architectures'
      | 'diagrams'
      | 'architecturePrinciples'
  ): Promise<void> => {
    // Filter only rows that have relationships to update
    const rowsWithRelationships = data.filter(row => {
      switch (entityType) {
        case 'businessCapabilities':
          return row.owners || row.parents
        case 'applications':
          return (
            row.owners || row.supportsCapabilities || row.usesDataObjects || row.partOfArchitectures
          )
        case 'dataObjects':
          return (
            row.owners ||
            row.dataSources ||
            row.usedByApplications ||
            row.relatedToCapabilities ||
            row.transferredInInterfaces ||
            row.partOfArchitectures
          )
        case 'interfaces':
          return (
            row.responsiblePerson ||
            row.sourceApplications ||
            row.targetApplications ||
            row.dataObjects ||
            row.partOfArchitectures
          )
        case 'persons':
          return false // Persons typically don't have relationships to update
        case 'architectures':
          return (
            row.owners ||
            row.containsApplications ||
            row.containsCapabilities ||
            row.containsDataObjects ||
            row.diagrams ||
            row.parentArchitecture
          )
        case 'diagrams':
          return row.creator || row.architecture
        case 'architecturePrinciples':
          return row.owners || row.appliedInArchitectures || row.implementedByApplications
        default:
          return false
      }
    })

    if (rowsWithRelationships.length === 0) {
      return
    }

    // Update relationships using GraphQL update mutations
    switch (entityType) {
      case 'businessCapabilities':
        await updateBusinessCapabilityRelationships(rowsWithRelationships)
        break
      case 'applications':
        await updateApplicationRelationships(rowsWithRelationships)
        break
      case 'dataObjects':
        await updateDataObjectRelationships(rowsWithRelationships)
        break
      case 'interfaces':
        await updateInterfaceRelationships(rowsWithRelationships)
        break
      case 'architectures':
        await updateArchitectureRelationships(rowsWithRelationships)
        break
      case 'diagrams':
        await updateDiagramRelationships(rowsWithRelationships)
        break
      case 'architecturePrinciples':
        await updateArchitecturePrincipleRelationships(rowsWithRelationships)
        break
      default:
    }
  }

  // Helper functions for updating relationships per entity type
  const updateBusinessCapabilityRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_CAPABILITY } = await import('../../graphql/capability')
    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.owners) {
        const ownerIds = parseRelationshipIds(row.owners)
        if (ownerIds.length > 0) {
          updateInput.owners = [
            {
              connect: ownerIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.parents) {
        const parentIds = parseRelationshipIds(row.parents)
        if (parentIds.length > 0) {
          updateInput.parents = [
            {
              connect: parentIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_CAPABILITY,
            variables: { id: row.id, input: updateInput },
          })
        } catch {
          // Relationship update failed, but continue processing
        }
      }
    }
  }

  const updateApplicationRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_APPLICATION } = await import('../../graphql/application')

    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.owners) {
        const ownerIds = parseRelationshipIds(row.owners)
        if (ownerIds.length > 0) {
          updateInput.owners = [
            {
              connect: ownerIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.supportsCapabilities) {
        const capabilityIds = parseRelationshipIds(row.supportsCapabilities)
        if (capabilityIds.length > 0) {
          updateInput.supportsCapabilities = [
            {
              connect: capabilityIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.usesDataObjects) {
        const dataObjectIds = parseRelationshipIds(row.usesDataObjects)
        if (dataObjectIds.length > 0) {
          updateInput.usesDataObjects = [
            {
              connect: dataObjectIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.partOfArchitectures) {
        const architectureIds = parseRelationshipIds(row.partOfArchitectures)
        if (architectureIds.length > 0) {
          updateInput.partOfArchitectures = [
            {
              connect: architectureIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_APPLICATION,
            variables: { id: row.id, input: updateInput },
          })
        } catch (error) {
          console.error(`Failed to update relationships for application ${row.id}:`, error)
        }
      }
    }
  }

  const updateDataObjectRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_DATA_OBJECT } = await import('../../graphql/dataObject')

    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.owners) {
        const ownerIds = parseRelationshipIds(row.owners)
        if (ownerIds) {
          updateInput.owners = [
            {
              connect: ownerIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.dataSources) {
        const dataSourceIds = parseRelationshipIds(row.dataSources)
        if (dataSourceIds) {
          updateInput.dataSources = [
            {
              connect: dataSourceIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.usedByApplications) {
        const appIds = parseRelationshipIds(row.usedByApplications)
        if (appIds) {
          updateInput.usedByApplications = [
            {
              connect: appIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.relatedToCapabilities) {
        const capabilityIds = parseRelationshipIds(row.relatedToCapabilities)
        if (capabilityIds) {
          updateInput.relatedToCapabilities = [
            {
              connect: capabilityIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.transferredInInterfaces) {
        const interfaceIds = parseRelationshipIds(row.transferredInInterfaces)
        if (interfaceIds) {
          updateInput.transferredInInterfaces = [
            {
              connect: interfaceIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.partOfArchitectures) {
        const architectureIds = parseRelationshipIds(row.partOfArchitectures)
        if (architectureIds) {
          updateInput.partOfArchitectures = [
            {
              connect: architectureIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }
      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_DATA_OBJECT,
            variables: { id: row.id, input: updateInput },
          })
        } catch (error) {
          console.error(`Failed to update relationships for data object ${row.id}:`, error)
        }
      }
    }
  }

  const updateInterfaceRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_APPLICATION_INTERFACE } = await import('../../graphql/applicationInterface')

    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.responsiblePerson) {
        const personIds = parseRelationshipIds(row.responsiblePerson)
        if (personIds && personIds.length > 0) {
          updateInput.responsiblePerson = [
            {
              connect: personIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.sourceApplications) {
        const sourceAppIds = parseRelationshipIds(row.sourceApplications)
        if (sourceAppIds) {
          updateInput.sourceApplications = [
            {
              connect: sourceAppIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.targetApplications) {
        const targetAppIds = parseRelationshipIds(row.targetApplications)
        if (targetAppIds) {
          updateInput.targetApplications = [
            {
              connect: targetAppIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.dataObjects) {
        const dataObjectIds = parseRelationshipIds(row.dataObjects)
        if (dataObjectIds) {
          updateInput.dataObjects = [
            {
              connect: dataObjectIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_APPLICATION_INTERFACE,
            variables: { id: row.id, input: updateInput },
          })
        } catch (error) {
          console.error(`Failed to update relationships for interface ${row.id}:`, error)
        }
      }
    }
  }

  const updateArchitectureRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_ARCHITECTURE } = await import('../../graphql/architecture')

    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.owners) {
        const ownerIds = parseRelationshipIds(row.owners)
        if (ownerIds) {
          updateInput.owners = [
            {
              connect: ownerIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.containsApplications) {
        const appIds = parseRelationshipIds(row.containsApplications)
        if (appIds) {
          updateInput.containsApplications = [
            {
              connect: appIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.containsCapabilities) {
        const capabilityIds = parseRelationshipIds(row.containsCapabilities)
        if (capabilityIds) {
          updateInput.containsCapabilities = [
            {
              connect: capabilityIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.containsDataObjects) {
        const dataObjectIds = parseRelationshipIds(row.containsDataObjects)
        if (dataObjectIds) {
          updateInput.containsDataObjects = [
            {
              connect: dataObjectIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.diagrams) {
        const diagramIds = parseRelationshipIds(row.diagrams)
        if (diagramIds) {
          updateInput.diagrams = [
            {
              connect: diagramIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.parentArchitecture) {
        const parentIds = parseRelationshipIds(row.parentArchitecture)
        if (parentIds && parentIds.length > 0) {
          // Parent architecture should be single relationship
          updateInput.parentArchitecture = [
            {
              connect: [{ where: { node: { id: { eq: parentIds[0] } } } }],
            },
          ]
        }
      }

      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_ARCHITECTURE,
            variables: { id: row.id, input: updateInput },
          })
        } catch (error) {
          console.error(`Failed to update relationships for architecture ${row.id}:`, error)
        }
      }
    }
  }

  const updateDiagramRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_DIAGRAM } = await import('../../graphql/diagram')

    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.creator) {
        const creatorIds = parseRelationshipIds(row.creator)
        if (creatorIds && creatorIds.length > 0) {
          // Creator should be single relationship
          updateInput.creator = [
            {
              connect: [{ where: { node: { id: { eq: creatorIds[0] } } } }],
            },
          ]
        }
      }

      if (row.architecture) {
        const architectureIds = parseRelationshipIds(row.architecture)
        if (architectureIds && architectureIds.length > 0) {
          // Architecture should be single relationship
          updateInput.architecture = [
            {
              connect: [{ where: { node: { id: { eq: architectureIds[0] } } } }],
            },
          ]
        }
      }

      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_DIAGRAM,
            variables: { id: row.id, input: updateInput },
          })
        } catch (error) {
          console.error(`Failed to update relationships for diagram ${row.id}:`, error)
        }
      }
    }
  }

  const updateArchitecturePrincipleRelationships = async (data: any[]): Promise<void> => {
    const { UPDATE_ARCHITECTURE_PRINCIPLE } = await import('../../graphql/architecturePrinciple')

    for (const row of data) {
      if (!row.id) continue

      const updateInput: any = {}

      if (row.owners) {
        const ownerIds = parseRelationshipIds(row.owners)
        if (ownerIds.length > 0) {
          updateInput.owners = [
            {
              connect: ownerIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.appliedInArchitectures) {
        const architectureIds = parseRelationshipIds(row.appliedInArchitectures)
        if (architectureIds.length > 0) {
          updateInput.appliedInArchitectures = [
            {
              connect: architectureIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (row.implementedByApplications) {
        const applicationIds = parseRelationshipIds(row.implementedByApplications)
        if (applicationIds.length > 0) {
          updateInput.implementedByApplications = [
            {
              connect: applicationIds.map(id => ({ where: { node: { id: { eq: id } } } })),
            },
          ]
        }
      }

      if (Object.keys(updateInput).length > 0) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_ARCHITECTURE_PRINCIPLE,
            variables: { id: row.id, input: updateInput },
          })
        } catch (error) {
          console.error(
            `Failed to update relationships for architecture principle ${row.id}:`,
            error
          )
        }
      }
    }
  }

  // Template Download
  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateWithRealFields(importSettings.entityType)
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
  const handleDownloadTemplateWithExamples = async () => {
    try {
      if (importSettings.entityType === 'all') {
        enqueueSnackbar(
          'Template mit Beispieldaten für "Alle Entitäten" ist nicht verfügbar. Verwenden Sie einzelne Entity-Typen.',
          { variant: 'warning' }
        )
        return
      }

      const exampleData = getTemplateWithExamples(
        importSettings.entityType as Exclude<typeof importSettings.entityType, 'all'>
      )
      await exportToExcel(exampleData, {
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
    // Validierung: CSV-Format für Multi-Tab-Export verhindern
    if (exportSettings.entityType === 'all' && exportSettings.format === 'csv') {
      enqueueSnackbar(
        'CSV-Format wird für Multi-Tab-Export nicht unterstützt. Bitte wählen Sie XLSX.',
        { variant: 'error' }
      )
      return
    }

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

        await exportMultiTabToExcel(allData, {
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
        await exportToExcel(singleData, {
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

            {/* Validierung wird immer durchgeführt */}

            {/* File Upload Button */}
            <Box sx={{ mt: 3 }}>
              <input
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                id="excel-file-upload"
                type="file"
                onChange={handleFileUpload}
                ref={fileInputRef}
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
                <Typography variant="body2">{importProgress.toFixed(1)}% abgeschlossen</Typography>
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
                <MenuItem
                  value="csv"
                  disabled={exportSettings.entityType === 'all'}
                  sx={{ color: exportSettings.entityType === 'all' ? 'text.disabled' : 'inherit' }}
                >
                  CSV (.csv){' '}
                  {exportSettings.entityType === 'all' && '- nicht verfügbar für Multi-Tab-Export'}
                </MenuItem>
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
  const openDeleteConfirmDialog = (entityType: string) => {
    const label = entityTypeLabels[entityType as keyof typeof entityTypeLabels]
    setDeleteConfirmDialog({
      isOpen: true,
      entityType,
      entityLabel: label || '',
    })
  }

  const closeDeleteConfirmDialog = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      entityType: null,
      entityLabel: '',
    })
  }

  const handleDeleteData = async (entityType: string) => {
    setIsDeleting(true)

    try {
      if (entityType === 'all') {
        // Delete all data types sequentially to avoid compound mutation authorization issues
        const deleteOperations = [
          { mutation: DELETE_BUSINESS_CAPABILITIES, name: 'Business Capabilities' },
          { mutation: DELETE_APPLICATIONS, name: 'Applications' },
          { mutation: DELETE_DATA_OBJECTS, name: 'Data Objects' },
          { mutation: DELETE_INTERFACES, name: 'Interfaces' },
          { mutation: DELETE_PERSONS, name: 'Persons' },
          { mutation: DELETE_ARCHITECTURES, name: 'Architectures' },
          { mutation: DELETE_DIAGRAMS, name: 'Diagrams' },
          { mutation: DELETE_ARCHITECTURE_PRINCIPLES, name: 'Architecture Principles' },
        ]

        for (const operation of deleteOperations) {
          try {
            await apolloClient.mutate({ mutation: gql(operation.mutation) })
          } catch (error) {
            console.warn(`Failed to delete ${operation.name}:`, error)
            // Continue with other deletions even if one fails
          }
        }
      } else {
        // Single entity type deletion
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
          case 'architecturePrinciples':
            mutation = DELETE_ARCHITECTURE_PRINCIPLES
            break
          default:
            throw new Error('Unbekannter Entity-Typ')
        }

        await apolloClient.mutate({ mutation: gql(mutation) })
      }

      enqueueSnackbar(
        entityType === 'all'
          ? 'Alle Daten erfolgreich gelöscht'
          : `${entityTypeLabels[entityType as keyof typeof entityTypeLabels]} erfolgreich gelöscht`,
        { variant: 'success' }
      )

      // Refresh dashboard cache to show updated counts
      await refreshDashboardCache()

      // Dialog schließen nach erfolgreichem Löschen
      closeDeleteConfirmDialog()
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
                onClick={() => openDeleteConfirmDialog(deleteSettings.entityType)}
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
              onClick={() => openDeleteConfirmDialog('all')}
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

  // Delete Confirmation Dialog Component
  const renderDeleteConfirmDialog = () => (
    <Dialog
      open={deleteConfirmDialog.isOpen}
      onClose={closeDeleteConfirmDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          Löschen bestätigen
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Sind Sie sicher?
          </Typography>
          <Typography variant="body2">
            {deleteConfirmDialog.entityType === 'all' ? (
              <>
                Sie sind dabei, <strong>ALLE DATEN</strong> aus der Datenbank zu löschen!
                <br />
                Dies umfasst alle Business Capabilities, Applikationen, Datenobjekte,
                Schnittstellen, Personen, Architekturen und Diagramme.
              </>
            ) : (
              <>
                Sie sind dabei, alle <strong>{deleteConfirmDialog.entityLabel}</strong> zu löschen.
              </>
            )}
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          Diese Aktion kann nicht rückgängig gemacht werden. Stellen Sie sicher, dass Sie ein Backup
          haben, bevor Sie fortfahren.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeDeleteConfirmDialog} variant="outlined">
          Abbrechen
        </Button>
        <Button
          onClick={() => {
            if (deleteConfirmDialog.entityType) {
              handleDeleteData(deleteConfirmDialog.entityType)
            }
          }}
          variant="contained"
          color="error"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : <ErrorIcon />}
        >
          {isDeleting ? 'Lösche...' : 'Endgültig löschen'}
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      {/* Delete Confirmation Dialog */}
      {renderDeleteConfirmDialog()}

      {/* Main Dialog */}
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
