import { ApolloClient, gql } from '@apollo/client'
import { getMutationsByEntityType, getDeleteMutationByEntityType } from './graphql'
import {
  createEntityInput,
  checkEntityExists,
  transformInputForUpdate,
  // mapRelationshipValues, // Unused - commented out
} from './utils'
import { ImportWithMappingResult, EntityMapping, ImportResult } from './types'
import { entityTypeMapping } from './constants'

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
  _skipRelationships: boolean = false
): Promise<ImportWithMappingResult> => {
  const mutations = getMutationsByEntityType(entityType)
  if (!mutations) {
    throw new Error(`No mutations found for entity type: ${entityType}`)
  }

  const { create: createMutation, update: updateMutation } = mutations
  const entityMappings: EntityMapping = {}
  let imported = 0

  for (const row of data) {
    const originalId = String(row.id || '')
    const input = createEntityInput(entityType, row)

    try {
      let shouldUpdate = false
      if (row.id && row.id.trim() !== '') {
        shouldUpdate = await checkEntityExists(client, entityType, row.id)
      }

      if (shouldUpdate && updateMutation) {
        await client.mutate({
          mutation: updateMutation,
          variables: {
            id: row.id,
            input: transformInputForUpdate(input),
          },
        })
        entityMappings[originalId] = row.id
      } else {
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
          }

          if (createdEntities && createdEntities.length > 0) {
            entityMappings[originalId] = createdEntities[0].id
          }
        }
      }

      imported++
    } catch (error) {
      console.error(`Error importing entity ${originalId}:`, error)
      throw error
    }
  }

  return { imported, entityMappings }
}

export const handleMultiTabImport = async (
  client: ApolloClient<any>,
  file: File,
  format: 'xlsx' | 'json'
): Promise<{ totalImported: number; importResults: ImportResult[] }> => {
  let allData: { [tabName: string]: any[] } = {}

  if (format === 'xlsx') {
    const { importMultiTabFromExcel } = await import('../../utils/excelUtils')
    allData = await importMultiTabFromExcel(file)
  } else if (format === 'json') {
    const { importMultiTabFromJson } = await import('../../utils/excelUtils')
    allData = await importMultiTabFromJson(file)
  }

  let totalImported = 0
  const importResults: ImportResult[] = []

  for (const [tabName, tabData] of Object.entries(allData)) {
    const entityType = entityTypeMapping[tabName]

    if (entityType && Array.isArray(tabData) && tabData.length > 0) {
      try {
        const { imported } = await importEntityDataWithMapping(client, tabData, entityType, true)
        totalImported += imported
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
  }

  return { totalImported, importResults }
}

export const handleSingleTabImport = async (
  client: ApolloClient<any>,
  file: File,
  entityType: string,
  format: 'xlsx' | 'json'
): Promise<{ imported: number; validationResult: any }> => {
  let data: any[] = []

  if (format === 'xlsx' && entityType !== 'diagrams') {
    const { importFromExcel } = await import('../../utils/excelUtils')
    data = await importFromExcel(file)
  } else if (format === 'json' || entityType === 'diagrams') {
    const { importFromJson } = await import('../../utils/excelUtils')
    data = await importFromJson(file)
  }

  const { imported } = await importEntityDataWithMapping(client, data, entityType)
  return { imported, validationResult: { isValid: true } }
}

export const exportEntityData = async (
  apolloClient: ApolloClient<any>,
  entityType: string,
  format: 'xlsx' | 'csv' | 'json'
): Promise<void> => {
  try {
    // Dynamisch importiere die notwendigen Funktionen
    const { fetchDataByEntityType, fetchAllEntitiesForExport, fetchAllEntitiesForExcelExport } =
      await import('../../utils/excelDataService')
    const { exportToExcel, exportMultiTabToExcel } = await import('../../utils/excelUtils')

    if (entityType === 'all') {
      // Multi-Entity Export
      const allData =
        format === 'xlsx'
          ? await fetchAllEntitiesForExcelExport(apolloClient) // Ohne Diagrams für Excel
          : await fetchAllEntitiesForExport(apolloClient) // Mit Diagrams für JSON

      if (format === 'xlsx') {
        await exportMultiTabToExcel(allData, {
          filename: 'SimpleEAM_Complete_Export',
          format: 'xlsx',
          includeHeaders: true,
        })
      } else if (format === 'json') {
        const jsonData = JSON.stringify(allData, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const timestamp = formatTimestampForFilename()
        a.download = `SimpleEAM_Complete_Export_${timestamp}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } else {
      // Single Entity Export
      const data = (await fetchDataByEntityType(apolloClient, entityType as any)) as any[]

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
      }

      const filename = `${entityTypeLabels[entityType] || entityType}_Export`

      if (format === 'xlsx') {
        await exportToExcel(data, {
          filename,
          sheetName: entityTypeLabels[entityType] || entityType,
          format: 'xlsx',
          includeHeaders: true,
        })
      } else if (format === 'csv') {
        if (entityType === 'diagrams') {
          throw new Error('CSV-Export für Diagramme nicht unterstützt')
        }
        await exportToExcel(data, {
          filename,
          sheetName: entityTypeLabels[entityType] || entityType,
          format: 'csv',
          includeHeaders: true,
        })
      } else if (format === 'json') {
        const jsonData = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const timestamp = formatTimestampForFilename()
        a.download = `${filename}_${timestamp}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    }
  } catch (error) {
    console.error(`Fehler beim Export von ${entityType}:`, error)
    throw error
  }
}

export const deleteEntityData = async (
  client: ApolloClient<any>,
  entityType: string
): Promise<number> => {
  const deleteMutation = getDeleteMutationByEntityType(entityType)
  if (!deleteMutation) {
    throw new Error(`No delete mutation found for entity type: ${entityType}`)
  }

  const result = await client.mutate({
    mutation: gql(deleteMutation),
  })

  return result.data ? (Object.values(result.data)[0] as any)?.nodesDeleted || 0 : 0
}

export const refreshDashboardCache = async (): Promise<void> => {
  // Placeholder for cache refresh logic
  console.log('Dashboard cache refreshed')
}

export const updateEntityRelationships = async (
  client: ApolloClient<any>,
  data: any[],
  entityType: string
): Promise<void> => {
  // Simplified relationship update
  console.log(`Updating relationships for ${entityType}`)
}
