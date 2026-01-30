import { ApolloClient, gql } from '@apollo/client'
import { getMutationsByEntityType, getDeleteMutationByEntityType } from './graphql'
import {
  createEntityInput,
  checkEntityExists,
  transformInputForUpdate,
  mapRelationshipValues,
} from './utils'
import { createEntityInputFromJson, sanitizeJsonImportData } from '../../utils/jsonInputUtils'
import { ImportWithMappingResult, EntityMapping, ImportResult } from './types'
import { entityTypeMapping } from './constants'

/**
 * Extracts a readable error message from various error types
 * Prioritizes GraphQL error messages over generic error messages
 */
const extractErrorMessage = (error: any): string => {
  // Check for GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors.map((e: any) => e.message).join('; ')
  }

  // Check for network errors with GraphQL response body
  if (error.networkError) {
    // Apollo Client often wraps GraphQL errors in networkError.result.errors
    if (error.networkError.result?.errors && error.networkError.result.errors.length > 0) {
      return error.networkError.result.errors.map((e: any) => e.message).join('; ')
    }
    // Check for bodyText that might contain error details
    if (error.networkError.bodyText) {
      try {
        const body = JSON.parse(error.networkError.bodyText)
        if (body.errors && body.errors.length > 0) {
          return body.errors.map((e: any) => e.message).join('; ')
        }
      } catch {
        // Parsing failed, continue to fallback
      }
    }
    return `Network error: ${error.networkError.message}`
  }

  // Check for standard Error object
  if (error instanceof Error) {
    return error.message
  }

  // Fallback for unknown error types
  return 'Unknown error'
}

/**
 * Formatiert den aktuellen Timestamp für Dateinamen
 */
const formatTimestampForFilename = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

// Simplified operations that work with the existing system
export const importEntityDataWithMapping = async (
  client: ApolloClient<any>,
  data: any[],
  entityType: string,
  _skipRelationships: boolean = false,
  format: 'xlsx' | 'json' = 'xlsx',
  onProgress?: (progress: number) => void,
  selectedCompanyId?: string
): Promise<ImportWithMappingResult> => {
  const mutations = getMutationsByEntityType(entityType)
  if (!mutations) {
    throw new Error(`No mutations found for entity type: ${entityType}`)
  }

  const { create: createMutation, update: updateMutation } = mutations
  const entityMappings: EntityMapping = {}
  let imported = 0
  let failed = 0
  const errors: string[] = []

  // WICHTIG: Nur JSON-Daten sanitizen, Excel-Daten unverändert lassen
  const processedData = format === 'json' ? sanitizeJsonImportData(data) : data

  // Process items one by one to prevent browser freeze
  for (let i = 0; i < processedData.length; i++) {
    const row = processedData[i]
    const originalId = String(row.id || '')
    let input: any = null

    // Progress logging every 5 items
    if (i % 5 === 0) {
      // Update progress callback
      if (onProgress) {
        const progress = Math.round((i / processedData.length) * 100)
        onProgress(progress)
      }
    }

    try {
      // WICHTIG: Format-spezifische Input-Erstellung verwenden
      if (format === 'json') {
        input = createEntityInputFromJson(entityType, row)
      } else {
        // Für Excel: Verwende die bewährte Excel-Input-Erstellung
        input = createEntityInput(entityType, row)
      }

      let shouldUpdate = false
      if (row.id && row.id.trim() !== '') {
        shouldUpdate = await checkEntityExists(client, entityType, row.id)
      }

      if (shouldUpdate && updateMutation) {
        // Inject company relationship on update as well
        let updateInput = transformInputForUpdate(input)
        if (selectedCompanyId) {
          const companyUpdate = {
            disconnect: [{ where: {} }], // Trenne alle bestehenden Company-Verbindungen
            connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }], // Verbinde mit ausgewählter Company
          }
          switch (entityType) {
            case 'businessCapabilities':
            case 'applications':
            case 'dataObjects':
            case 'interfaces':
            case 'persons':
            case 'architectures':
            case 'diagrams':
            case 'architecturePrinciples':
            case 'infrastructures':
            case 'aicomponents':
              updateInput = { ...updateInput, company: companyUpdate }
              break
            default:
              break
          }
        }

        await client.mutate({
          mutation: updateMutation,
          variables: {
            id: row.id,
            input: updateInput,
          },
        })
        entityMappings[originalId] = row.id
        imported++
      } else {
        // Inject company relationship on create
        if (selectedCompanyId) {
          const companyConnect = {
            connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
          }
          switch (entityType) {
            case 'businessCapabilities':
            case 'applications':
            case 'dataObjects':
            case 'interfaces':
            case 'persons':
            case 'architectures':
            case 'diagrams':
            case 'architecturePrinciples':
            case 'infrastructures':
            case 'aicomponents':
              input = { ...input, company: companyConnect }
              break
            default:
              break
          }
        }
        const result = await client.mutate({
          mutation: createMutation,
          variables: {
            input: [input],
          },
        })

        if (result.data) {
          let createdEntities: any[] | undefined
          const resultData = result.data

          // Extract created entities based on mutation response
          if (resultData.createBusinessCapabilities) {
            createdEntities = resultData.createBusinessCapabilities.businessCapabilities
          } else if (resultData.createApplications) {
            createdEntities = resultData.createApplications.applications
          } else if (resultData.createDataObjects) {
            createdEntities = resultData.createDataObjects.dataObjects
          } else if (resultData.createApplicationInterfaces) {
            createdEntities = resultData.createApplicationInterfaces.applicationInterfaces
          } else if (resultData.createPeople) {
            createdEntities = resultData.createPeople.people
          } else if (resultData.createArchitectures) {
            createdEntities = resultData.createArchitectures.architectures
          } else if (resultData.createDiagrams) {
            createdEntities = resultData.createDiagrams.diagrams
          } else if (resultData.createArchitecturePrinciples) {
            createdEntities = resultData.createArchitecturePrinciples.architecturePrinciples
          } else if (resultData.createInfrastructures) {
            createdEntities = resultData.createInfrastructures.infrastructures
          } else if (resultData.createAiComponents) {
            createdEntities = resultData.createAiComponents.aiComponents
          }
          if (createdEntities && createdEntities.length > 0) {
            entityMappings[originalId] = createdEntities[0].id
            imported++
          }
        }
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error)

      // Only log detailed errors for first few items
      if (i < 3) {
        console.error(`Error importing entity at item ${i + 1} (ID: ${originalId}):`, errorMessage)
        console.error(`DEBUG: Entity type: ${entityType}, Format: ${format}`)
        console.error(`DEBUG: Full error:`, error)
      }

      errors.push(`Row ${i + 1}: ${errorMessage}`)
      failed++
    }

    // Small delay to prevent browser freeze - pause every 10 items for larger imports
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  if (errors.length > 0) {
    console.warn(`${errors.length} errors during import`)
  }

  // Final progress update
  if (onProgress) {
    onProgress(100)
  }

  return { imported, failed, entityMappings, errors }
}

export const handleMultiTabImport = async (
  client: ApolloClient<any>,
  file: File,
  format: 'xlsx' | 'json',
  onProgress?: (progress: number) => void,
  selectedCompanyId?: string
): Promise<{ totalImported: number; totalFailed: number; importResults: ImportResult[] }> => {
  let allData: { [tabName: string]: any[] } = {}

  if (format === 'xlsx') {
    const { importMultiTabFromExcel } = await import('../../utils/excelUtils')
    allData = await importMultiTabFromExcel(file)
  } else if (format === 'json') {
    const { importMultiTabFromJson } = await import('../../utils/jsonUtils')
    allData = await importMultiTabFromJson(file)
  }

  let totalImported = 0
  let totalFailed = 0
  const importResults: ImportResult[] = []
  const allEntityMappings: { [entityType: string]: EntityMapping } = {}

  const totalTabs = Object.keys(allData).filter(tabName => {
    const entityType = entityTypeMapping[tabName]
    return entityType && Array.isArray(allData[tabName]) && allData[tabName].length > 0
  }).length

  let tabsProcessed = 0

  // Phase 1: Erstelle alle Entitäten ohne Beziehungen
  for (const [tabName, tabData] of Object.entries(allData)) {
    const entityType = entityTypeMapping[tabName]

    if (entityType && Array.isArray(tabData) && tabData.length > 0) {
      try {
        const {
          imported,
          failed = 0,
          entityMappings,
          errors = [],
        } = await importEntityDataWithMapping(
          client,
          tabData,
          entityType,
          true,
          format,
          itemProgress => {
            // Calculate overall progress: 70% for Phase 1, 30% for Phase 2
            const phaseProgress =
              (tabsProcessed / totalTabs) * 70 + (itemProgress / 100) * (70 / totalTabs)
            if (onProgress) {
              onProgress(Math.round(phaseProgress))
            }
          },
          selectedCompanyId
        )
        allEntityMappings[entityType] = entityMappings
        totalImported += imported
        totalFailed += failed
        importResults.push({
          entityType: tabName,
          imported,
          failed,
          errors,
        })
        tabsProcessed++
      } catch (error) {
        console.error(`DEBUG: Error importing ${tabName}:`, error)
        const tabLength = Array.isArray(tabData) ? tabData.length : 0
        importResults.push({
          entityType: tabName,
          imported: 0,
          failed: tabLength,
          errors: [extractErrorMessage(error)],
        })
        totalFailed += tabLength
        tabsProcessed++
      }
    } else {
      console.warn(
        `DEBUG: Skipping tab "${tabName}" - entityType: ${entityType}, isArray: ${Array.isArray(tabData)}, length: ${Array.isArray(tabData) ? tabData.length : 'N/A'}`
      )
    }
  }

  // Phase 2: Update Beziehungen für alle importierten Entitäten

  const combinedEntityMappings = Object.values(allEntityMappings).reduce(
    (acc, mapping) => ({ ...acc, ...mapping }),
    {}
  )

  const relationshipTabs = Object.keys(allData).filter(tabName => {
    const entityType = entityTypeMapping[tabName]
    return (
      entityType &&
      Array.isArray(allData[tabName]) &&
      allData[tabName].length > 0 &&
      allEntityMappings[entityType]
    )
  })

  let relationshipTabsProcessed = 0

  for (const [tabName, tabData] of Object.entries(allData)) {
    const entityType = entityTypeMapping[tabName]

    if (
      entityType &&
      Array.isArray(tabData) &&
      tabData.length > 0 &&
      allEntityMappings[entityType]
    ) {
      try {
        await updateEntityRelationships(
          client,
          tabData,
          entityType,
          combinedEntityMappings,
          itemProgress => {
            // Calculate overall progress: 70% Phase 1 + 30% Phase 2
            const phaseProgress =
              70 +
              (relationshipTabsProcessed / relationshipTabs.length) * 30 +
              (itemProgress / 100) * (30 / relationshipTabs.length)
            if (onProgress) {
              onProgress(Math.round(phaseProgress))
            }
          },
          format
        )
        relationshipTabsProcessed++
      } catch (error) {
        console.error(`DEBUG: Error updating relationships for ${entityType}:`, error)
        relationshipTabsProcessed++
      }
    } else {
      console.warn(
        `DEBUG PHASE2: Skipping relationship update for "${tabName}" (${entityType}) - conditions not met`
      )
    }
  }

  // Final progress update
  if (onProgress) {
    onProgress(100)
  }

  return { totalImported, totalFailed, importResults }
}

export const handleSingleTabImport = async (
  client: ApolloClient<any>,
  file: File,
  entityType: string,
  format: 'xlsx' | 'json',
  onProgress?: (progress: number) => void,
  selectedCompanyId?: string
): Promise<{ imported: number; failed: number; errors: string[]; validationResult: any }> => {
  let data: any[] = []

  if (format === 'xlsx' && entityType !== 'diagrams') {
    const { importFromExcel } = await import('../../utils/excelUtils')
    data = await importFromExcel(file)
  } else if (format === 'json' || entityType === 'diagrams') {
    const { importFromJson } = await import('../../utils/jsonUtils')
    data = await importFromJson(file)
  }

  // Phase 1: Erstelle alle Entitäten (70% of progress)
  const {
    imported,
    failed = 0,
    entityMappings,
    errors = [],
  } = await importEntityDataWithMapping(
    client,
    data,
    entityType,
    true,
    format,
    itemProgress => {
      const phaseProgress = (itemProgress / 100) * 70
      if (onProgress) {
        onProgress(Math.round(phaseProgress))
      }
    },
    selectedCompanyId
  )

  // Phase 2: Update Beziehungen (30% of progress)
  if (imported > 0 && Object.keys(entityMappings).length > 0) {
    try {
      await updateEntityRelationships(
        client,
        data,
        entityType,
        entityMappings,
        itemProgress => {
          const phaseProgress = 70 + (itemProgress / 100) * 30
          if (onProgress) {
            onProgress(Math.round(phaseProgress))
          }
        },
        format
      )
    } catch (error) {
      console.error(`DEBUG SINGLE: Error updating relationships for ${entityType}:`, error)
    }
  }

  // Final progress update
  if (onProgress) {
    onProgress(100)
  }

  return { imported, failed, errors, validationResult: { isValid: true } }
}

export const exportEntityData = async (
  apolloClient: ApolloClient<any>,
  entityType: string,
  format: 'xlsx' | 'csv' | 'json',
  selectedCompanyId?: string
): Promise<void> => {
  try {
    // Company-Name für Dateiname auflösen (optional)
    let companySuffix = ''
    if (selectedCompanyId) {
      try {
        const { GET_COMPANIES } = await import('../../graphql/company')
        const res = await apolloClient.query({
          query: GET_COMPANIES,
          variables: { where: { id: { eq: selectedCompanyId } } },
          fetchPolicy: 'cache-first',
        })
        // Da wir nach ID filtern, sollte genau ein Unternehmen zurückkommen
        const company = res.data?.companies?.find((c: any) => c.id === selectedCompanyId)
        const name = company?.name as string | undefined
        if (name) {
          const safe = name.replace(/[^a-z0-9-_]+/gi, '_')
          companySuffix = `_Company-${safe}`
        }
      } catch {
        // Ignoriere Fehler bei der Namensauflösung
      }
    }
    if (entityType === 'all') {
      // Multi-Entity Export mit formatspezifischer Datenauswahl
      if (format === 'json') {
        const { fetchAllDataForJson } = await import('../../utils/jsonDataService')
        const { exportToJson } = await import('../../utils/jsonUtils')
        const allData = await fetchAllDataForJson(apolloClient, selectedCompanyId)

        const timestamp = formatTimestampForFilename()
        exportToJson(allData, {
          filename: `SimpleEAM_Complete_Export${companySuffix}_${timestamp}`,
          pretty: true,
        })
      } else {
        // Excel/CSV Export
        const { fetchDataByEntityTypeAndFormat } = await import('../../utils/excelDataService')
        const { exportMultiTabToExcel } = await import('../../utils/excelUtils')
        const allData = await fetchDataByEntityTypeAndFormat(
          apolloClient,
          'all',
          format,
          selectedCompanyId
        )

        if (format === 'xlsx') {
          await exportMultiTabToExcel(allData as { [tabName: string]: any[] }, {
            filename: `SimpleEAM_Complete_Export${companySuffix}`,
            format: 'xlsx',
            includeHeaders: true,
          })
        }
      }
    } else {
      // Single Entity Export mit formatspezifischer Datenauswahl
      const entityTypeLabels: { [key: string]: string } = {
        businessCapabilities: 'Business_Capabilities',
        applications: 'Applications',
        dataObjects: 'Data_Objects',
        interfaces: 'Interfaces',
        persons: 'Persons',
        architectures: 'Architectures',
        diagrams: 'Diagrams',
        architecturePrinciples: 'Architecture_Principles',
        infrastructures: 'Infrastructure',
        aicomponents: 'AI_Components',
      }

      const filename = `${entityTypeLabels[entityType] || entityType}_Export${companySuffix}`

      if (format === 'json') {
        const { fetchDataByEntityTypeForJson } = await import('../../utils/jsonDataService')
        const { exportToJson } = await import('../../utils/jsonUtils')
        const data = await fetchDataByEntityTypeForJson(
          apolloClient,
          entityType as any,
          selectedCompanyId
        )

        const timestamp = formatTimestampForFilename()
        exportToJson(data, {
          filename: `${filename}_${timestamp}`,
          pretty: true,
        })
      } else {
        // Excel/CSV Export
        const { fetchDataByEntityTypeAndFormat } = await import('../../utils/excelDataService')
        const { exportToExcel } = await import('../../utils/excelUtils')
        const data = (await fetchDataByEntityTypeAndFormat(
          apolloClient,
          entityType as any,
          format,
          selectedCompanyId
        )) as any[]

        if (format === 'xlsx') {
          await exportToExcel(data, {
            filename,
            sheetName: entityTypeLabels[entityType] || entityType,
            format: 'xlsx',
            includeHeaders: true,
          })
        } else if (format === 'csv') {
          // CSV-Export für Diagramme ist jetzt möglich (ohne diagramJson)
          await exportToExcel(data, {
            filename,
            sheetName: entityTypeLabels[entityType] || entityType,
            format: 'csv',
            includeHeaders: true,
          })
        }
      }
    }
  } catch (error) {
    console.error(`Fehler beim Export von ${entityType}:`, error)
    throw error
  }
}

export const deleteEntityData = async (
  client: ApolloClient<any>,
  entityType: string,
  selectedCompanyId?: string
): Promise<number> => {
  // Company-spezifische Where-Klausel erstellen
  const createCompanyWhere = (entityType: string): any => {
    if (!selectedCompanyId) {
      // Wenn keine Company ausgewählt ist, lösche alles (für Admins)
      return {}
    }

    // Spezielle Behandlung für Diagrams
    if (entityType === 'diagrams') {
      return {
        OR: [
          { company: { some: { id: { eq: selectedCompanyId } } } },
          { architecture: { some: { company: { some: { id: { eq: selectedCompanyId } } } } } },
        ],
      }
    }

    // Standard-Behandlung für alle anderen Entitäten
    return { company: { some: { id: { eq: selectedCompanyId } } } }
  }

  if (entityType === 'all') {
    // Lösche alle Entitätstypen (company-gefiltert)
    const entityTypes = [
      'businessCapabilities',
      'applications',
      'dataObjects',
      'interfaces',
      'persons',
      'architectures',
      'diagrams',
      'architecturePrinciples',
      'infrastructures',
      'aicomponents',
    ]

    let totalDeleted = 0

    for (const type of entityTypes) {
      try {
        const deleteMutation = getDeleteMutationByEntityType(type)
        if (deleteMutation) {
          const whereClause = createCompanyWhere(type)
          const result = await client.mutate({
            mutation: gql(deleteMutation),
            variables: { where: whereClause },
          })
          const deleted = result.data
            ? (Object.values(result.data)[0] as any)?.nodesDeleted || 0
            : 0
          totalDeleted += deleted
        }
      } catch (error) {
        console.warn(`Fehler beim Löschen von ${type}:`, error)
        // Fortfahren mit den anderen Entitätstypen
      }
    }

    return totalDeleted
  } else {
    // Lösche nur den spezifizierten Entitätstyp (company-gefiltert)
    const deleteMutation = getDeleteMutationByEntityType(entityType)
    if (!deleteMutation) {
      throw new Error(`No delete mutation found for entity type: ${entityType}`)
    }

    const whereClause = createCompanyWhere(entityType)
    const result = await client.mutate({
      mutation: gql(deleteMutation),
      variables: { where: whereClause },
    })

    return result.data ? (Object.values(result.data)[0] as any)?.nodesDeleted || 0 : 0
  }
}

export const refreshDashboardCache = async (client: ApolloClient<any>): Promise<void> => {
  // Refetch all active queries to update tables without full page reload
  // This allows users to review import results and errors while seeing updated data
  await client.refetchQueries({
    include: 'active',
  })
}

export const updateEntityRelationships = async (
  client: ApolloClient<any>,
  data: any[],
  entityType: string,
  entityMappings: EntityMapping,
  onProgress?: (progress: number) => void,
  format: 'xlsx' | 'json' = 'xlsx'
): Promise<void> => {
  const mutations = getMutationsByEntityType(entityType)
  if (!mutations?.update) {
    console.warn(`❌ NO_UPDATE_MUTATION: No update mutation found for entity type: ${entityType}`)
    console.warn(`🔥 AVAILABLE_MUTATIONS:`, mutations)
    return
  }
  const updateMutation = mutations.update
  // Nur für JSON-Format sanitize data, für Excel verwende die ursprünglichen Daten
  const processedData = format === 'json' ? sanitizeJsonImportData(data) : data
  for (let i = 0; i < processedData.length; i++) {
    const row = processedData[i]
    const originalId = String(row.id || '')
    const newId = entityMappings[originalId]

    if (!newId) {
      console.warn(`No mapping found for entity ${originalId}, skipping relationship update`)
      continue
    }

    // Progress update every 5 items
    if (i % 5 === 0 && onProgress) {
      const progress = Math.round((i / processedData.length) * 100)
      onProgress(progress)
    }

    try {
      // Verwende einheitliche Beziehungsverarbeitung für beide Formate
      const mappedRow = mapRelationshipValues(row, entityType, entityMappings)

      // Erstelle Update-Input nur mit den Beziehungsfeldern
      const relationshipInput = createRelationshipUpdateInput(entityType, mappedRow, entityMappings)

      if (Object.keys(relationshipInput).length > 0) {
        await client.mutate({
          mutation: updateMutation,
          variables: {
            id: newId,
            input: relationshipInput,
          },
        })
      }
    } catch (error) {
      console.error(`Error updating relationships for entity ${newId}:`, error)
    }

    // Pause every 5 items to prevent browser freeze
    if (i % 5 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Final progress update
  if (onProgress) {
    onProgress(100)
  }
}

/**
 * Erstellt Update-Input nur mit Beziehungsfeldern basierend auf Excel-Implementierung
 */
const createRelationshipUpdateInput = (
  entityType: string,
  row: any,
  entityMappings?: Record<string, string>
): any => {
  const input: any = {}

  // Helper function to process relationship field with connect format (KORREKTE SYNTAX aus Excel-Import)
  const processRelationshipField = (fieldName: string, value: any) => {
    // Robuste Typprüfung für verschiedene Eingabeformate
    let processedValue: string = ''

    if (!value) {
      return undefined
    }

    if (typeof value === 'string') {
      processedValue = value
    } else if (Array.isArray(value)) {
      // Arrays von IDs (häufig bei JSON-Import)
      processedValue = value
        .filter(item => item && (typeof item === 'string' || typeof item === 'object'))
        .map(item => {
          if (typeof item === 'string') {
            return item
          } else if (typeof item === 'object' && item.id) {
            return item.id
          }
          return String(item)
        })
        .join(',')
    } else if (typeof value === 'object' && value.id) {
      // Einzelnes Objekt mit ID
      processedValue = String(value.id)
    } else {
      // Fallback: Konvertiere zu String
      processedValue = String(value)
    }

    if (processedValue && processedValue.trim()) {
      return {
        connect: processedValue
          .split(',')
          .map((id: string) => ({ where: { node: { id: { eq: id.trim() } } } })),
      }
    }
    return undefined
  }

  // Helper function to process single relationship field with connect format (KORREKTE SYNTAX aus Excel-Import)
  const processSingleRelationshipField = (fieldName: string, value: any) => {
    // Robuste Typprüfung für verschiedene Eingabeformate
    let processedValue: string = ''

    if (!value) {
      return undefined
    }

    if (typeof value === 'string') {
      processedValue = value
    } else if (Array.isArray(value) && value.length > 0) {
      // Nimm das erste Element aus dem Array
      const firstItem = value[0]
      if (typeof firstItem === 'string') {
        processedValue = firstItem
      } else if (typeof firstItem === 'object' && firstItem.id) {
        processedValue = String(firstItem.id)
      } else {
        processedValue = String(firstItem)
      }
    } else if (typeof value === 'object' && value.id) {
      // Einzelnes Objekt mit ID
      processedValue = String(value.id)
    } else {
      // Fallback: Konvertiere zu String
      processedValue = String(value)
    }

    if (processedValue && processedValue.trim()) {
      return { connect: { where: { node: { id: { eq: processedValue.trim() } } } } }
    }
    return undefined
  }

  switch (entityType) {
    case 'businessCapabilities':
      if (row.owners) input.owners = processRelationshipField('owners', row.owners)
      if (row.parents) input.parents = processRelationshipField('parents', row.parents)
      if (row.children) input.children = processRelationshipField('children', row.children)
      if (row.supportedByApplications) {
        input.supportedByApplications = processRelationshipField(
          'supportedByApplications',
          row.supportedByApplications
        )
      }
      if (row.partOfArchitectures) {
        input.partOfArchitectures = processRelationshipField(
          'partOfArchitectures',
          row.partOfArchitectures
        )
      }
      if (row.relatedDataObjects) {
        input.relatedDataObjects = processRelationshipField(
          'relatedDataObjects',
          row.relatedDataObjects
        )
      }
      if (row.depictedInDiagrams) {
        input.depictedInDiagrams = processRelationshipField(
          'depictedInDiagrams',
          row.depictedInDiagrams
        )
      }
      break

    case 'applications':
      if (row.owners) input.owners = processRelationshipField('owners', row.owners)
      if (row.supportsCapabilities) {
        input.supportsCapabilities = processRelationshipField(
          'supportsCapabilities',
          row.supportsCapabilities
        )
      }
      if (row.usesDataObjects) {
        input.usesDataObjects = processRelationshipField('usesDataObjects', row.usesDataObjects)
      }
      if (row.partOfArchitectures) {
        input.partOfArchitectures = processRelationshipField(
          'partOfArchitectures',
          row.partOfArchitectures
        )
      }
      break

    case 'dataObjects':
      if (row.owners) input.owners = processRelationshipField('owners', row.owners)
      if (row.dataSources)
        input.dataSources = processRelationshipField('dataSources', row.dataSources)
      if (row.usedByApplications) {
        input.usedByApplications = processRelationshipField(
          'usedByApplications',
          row.usedByApplications
        )
      }
      if (row.relatedToCapabilities) {
        input.relatedToCapabilities = processRelationshipField(
          'relatedToCapabilities',
          row.relatedToCapabilities
        )
      }
      if (row.transferredInInterfaces) {
        input.transferredInInterfaces = processRelationshipField(
          'transferredInInterfaces',
          row.transferredInInterfaces
        )
      }
      if (row.partOfArchitectures) {
        input.partOfArchitectures = processRelationshipField(
          'partOfArchitectures',
          row.partOfArchitectures
        )
      }
      break

    case 'interfaces':
      if (row.owners) {
        input.owners = processSingleRelationshipField('owners', row.owners)
      }
      if (row.sourceApplications) {
        input.sourceApplications = processRelationshipField(
          'sourceApplications',
          row.sourceApplications
        )
      }
      if (row.targetApplications) {
        input.targetApplications = processRelationshipField(
          'targetApplications',
          row.targetApplications
        )
      }
      if (row.dataObjects) {
        input.dataObjects = processRelationshipField('dataObjects', row.dataObjects)
      }
      if (row.partOfArchitectures) {
        input.partOfArchitectures = processRelationshipField(
          'partOfArchitectures',
          row.partOfArchitectures
        )
      }
      break

    case 'architectures':
      if (row.owners) input.owners = processRelationshipField('owners', row.owners)
      if (row.containsApplications) {
        input.containsApplications = processRelationshipField(
          'containsApplications',
          row.containsApplications
        )
      }
      if (row.containsCapabilities) {
        input.containsCapabilities = processRelationshipField(
          'containsCapabilities',
          row.containsCapabilities
        )
      }
      if (row.containsDataObjects) {
        input.containsDataObjects = processRelationshipField(
          'containsDataObjects',
          row.containsDataObjects
        )
      }
      if (row.diagrams) input.diagrams = processRelationshipField('diagrams', row.diagrams)
      if (row.parentArchitecture) {
        input.parentArchitecture = processSingleRelationshipField(
          'parentArchitecture',
          row.parentArchitecture
        )
      }
      break

    case 'diagrams':
      // Update diagramJson with mapped database IDs
      if (row.diagramJson && entityMappings) {
        try {
          const diagram = JSON.parse(row.diagramJson)
          let updated = false

          // Update elements with database IDs
          if (diagram.elements && Array.isArray(diagram.elements)) {
            diagram.elements.forEach((element: any) => {
              if (element.customData?.databaseId) {
                const oldDbId = element.customData.databaseId
                const mappedId = entityMappings[oldDbId]
                if (mappedId) {
                  element.customData.databaseId = mappedId
                  updated = true
                }
              }
            })
          }

          if (updated) {
            // GraphQL expects StringScalarMutations format for diagramJson
            input.diagramJson = { set: JSON.stringify(diagram) }
          }
        } catch (error) {
          console.error('Error parsing/updating diagramJson:', error)
        }
      }

      if (row.creator) {
        input.creator = processSingleRelationshipField('creator', row.creator)
      }
      if (row.architecture) {
        input.architecture = processSingleRelationshipField('architecture', row.architecture)
      }
      break

    case 'architecturePrinciples':
      if (row.owners) input.owners = processRelationshipField('owners', row.owners)
      if (row.appliedInArchitectures) {
        input.appliedInArchitectures = processRelationshipField(
          'appliedInArchitectures',
          row.appliedInArchitectures
        )
      }
      if (row.implementedByApplications) {
        input.implementedByApplications = processRelationshipField(
          'implementedByApplications',
          row.implementedByApplications
        )
      }
      break

    case 'infrastructures':
      if (row.owners) {
        input.owners = processRelationshipField('owners', row.owners)
      }
      if (row.hostsApplications) {
        input.hostsApplications = processRelationshipField(
          'hostsApplications',
          row.hostsApplications
        )
      }
      if (row.partOfArchitectures) {
        input.partOfArchitectures = processRelationshipField(
          'partOfArchitectures',
          row.partOfArchitectures
        )
      }
      if (row.depictedInDiagrams) {
        input.depictedInDiagrams = processRelationshipField(
          'depictedInDiagrams',
          row.depictedInDiagrams
        )
      }
      if (row.parentInfrastructure) {
        input.parentInfrastructure = processSingleRelationshipField(
          'parentInfrastructure',
          row.parentInfrastructure
        )
      }
      if (row.childInfrastructures) {
        input.childInfrastructures = processRelationshipField(
          'childInfrastructures',
          row.childInfrastructures
        )
      }
      break

    // persons haben typischerweise keine ausgehenden Beziehungen
    case 'persons':
    default:
      break
  }

  return input
}
