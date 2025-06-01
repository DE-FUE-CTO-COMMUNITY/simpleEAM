import { ApolloClient } from '@apollo/client'
import { GET_CAPABILITIES } from '../graphql/capability'
import { GET_APPLICATIONS } from '../graphql/application'
import { GET_APPLICATION_INTERFACES } from '../graphql/applicationInterface'
import { GET_DATA_OBJECTS } from '../graphql/dataObject'

export interface ExcelExportData {
  [key: string]: string | number | boolean | Date
}

export type EntityType = 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'

/**
 * Formatiert ein Datum in ISO-Format für re-import-fähigen Export
 */
const formatDateForExport = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return ''

  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    return date.toISOString()
  } catch {
    console.warn('Ungültiges Datum:', dateValue)
    return ''
  }
}

/**
 * Holt echte Business Capabilities Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchBusinessCapabilitiesForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_CAPABILITIES,
      fetchPolicy: 'network-only',
    })

    if (!data?.businessCapabilities) {
      return []
    }

    return data.businessCapabilities.map((cap: any) => ({
      id: cap.id,
      name: cap.name,
      description: cap.description || '',
      maturityLevel: cap.maturityLevel || 0,
      status: cap.status || '',
      businessValue: cap.businessValue || 0,
      owners: cap.owners?.map((owner: any) => owner.id).join(',') || '',
      tags: cap.tags?.join(',') || '',
      createdAt: formatDateForExport(cap.createdAt),
      updatedAt: formatDateForExport(cap.updatedAt),
      parents: cap.parents?.map((parent: any) => parent.id).join(',') || '',
    }))
  } catch (error) {
    console.error('Fehler beim Laden der Business Capabilities:', error)
    throw new Error('Fehler beim Laden der Business Capabilities für Export')
  }
}

/**
 * Holt echte Anwendungs-Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchApplicationsForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATIONS,
      fetchPolicy: 'network-only',
    })

    if (!data?.applications) {
      return []
    }

    return data.applications.map((app: any) => ({
      id: app.id,
      name: app.name,
      description: app.description || '',
      status: app.status || '',
      criticality: app.criticality || '',
      costs: app.costs || 0,
      vendor: app.vendor || '',
      version: app.version || '',
      hostingEnvironment: app.hostingEnvironment || '',
      technologyStack: app.technologyStack?.join(',') || '',
      introductionDate: formatDateForExport(app.introductionDate),
      endOfLifeDate: formatDateForExport(app.endOfLifeDate),
      owners: app.owners?.map((owner: any) => owner.id).join(',') || '',
      supportsCapabilities: app.supportsCapabilities?.map((cap: any) => cap.id).join(',') || '',
      usesDataObjects: app.usesDataObjects?.map((obj: any) => obj.id).join(',') || '',
      sourceOfInterfaces: app.sourceOfInterfaces?.map((iface: any) => iface.id).join(',') || '',
      targetOfInterfaces: app.targetOfInterfaces?.map((iface: any) => iface.id).join(',') || '',
      partOfArchitectures: app.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      createdAt: formatDateForExport(app.createdAt),
      updatedAt: formatDateForExport(app.updatedAt),
    }))
  } catch (error) {
    console.error('Fehler beim Laden der Anwendungen:', error)
    throw new Error('Fehler beim Laden der Anwendungen für Export')
  }
}

/**
 * Holt echte Datenobjekte für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchDataObjectsForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DATA_OBJECTS,
      fetchPolicy: 'network-only',
    })

    if (!data?.dataObjects) {
      return []
    }

    return data.dataObjects.map((obj: any) => ({
      id: obj.id,
      name: obj.name,
      description: obj.description || '',
      format: obj.format || '',
      owners: obj.owners?.map((owner: any) => owner.id).join(',') || '',
      dataSources: obj.dataSources?.map((app: any) => app.id).join(',') || '',
      usedByApplications: obj.usedByApplications?.map((app: any) => app.id).join(',') || '',
      relatedToCapabilities: obj.relatedToCapabilities?.map((cap: any) => cap.id).join(',') || '',
      transferredInInterfaces:
        obj.transferredInInterfaces?.map((iface: any) => iface.id).join(',') || '',
      partOfArchitectures: obj.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      createdAt: formatDateForExport(obj.createdAt),
      updatedAt: formatDateForExport(obj.updatedAt),
    }))
  } catch (error) {
    console.error('Fehler beim Laden der Datenobjekte:', error)
    throw new Error('Fehler beim Laden der Datenobjekte für Export')
  }
}

/**
 * Holt echte Schnittstellen-Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchInterfacesForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATION_INTERFACES,
      fetchPolicy: 'network-only',
    })

    if (!data?.applicationInterfaces) {
      return []
    }

    return data.applicationInterfaces.map((iface: any) => ({
      id: iface.id,
      name: iface.name,
      description: iface.description || '',
      interfaceType: iface.interfaceType || '',
      protocol: iface.protocol || '',
      version: iface.version || '',
      status: iface.status || '',
      introductionDate: formatDateForExport(iface.introductionDate),
      endOfLifeDate: formatDateForExport(iface.endOfLifeDate),
      responsiblePerson: iface.responsiblePerson?.id || '',
      sourceApplications: iface.sourceApplications?.map((app: any) => app.id).join(',') || '',
      targetApplications: iface.targetApplications?.map((app: any) => app.id).join(',') || '',
      dataObjects: iface.dataObjects?.map((obj: any) => obj.id).join(',') || '',
      createdAt: formatDateForExport(iface.createdAt),
      updatedAt: formatDateForExport(iface.updatedAt),
    }))
  } catch (error) {
    console.error('Fehler beim Laden der Schnittstellen:', error)
    throw new Error('Fehler beim Laden der Schnittstellen für Export')
  }
}

/**
 * Holt echte Daten basierend auf dem Entity-Typ
 */
export const fetchDataByEntityType = async (
  client: ApolloClient<any>,
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): Promise<ExcelExportData[]> => {
  switch (entityType) {
    case 'businessCapabilities':
      return fetchBusinessCapabilitiesForExport(client)
    case 'applications':
      return fetchApplicationsForExport(client)
    case 'dataObjects':
      return fetchDataObjectsForExport(client)
    case 'interfaces':
      return fetchInterfacesForExport(client)
    default:
      throw new Error(`Unbekannter Entity-Typ: ${entityType}`)
  }
}

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Business Capabilities
 */
export const getBusinessCapabilitiesTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  maturityLevel: 0,
  status: '',
  businessValue: 0,
  owners: '', // Komma-getrennte IDs
  tags: '', // Komma-getrennte Tags
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  parents: '', // Komma-getrennte Parent-IDs
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Applications
 */
export const getApplicationsTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  status: '',
  criticality: '',
  costs: 0,
  vendor: '',
  version: '',
  hostingEnvironment: '',
  technologyStack: '', // Komma-getrennte Technologien
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  owners: '', // Komma-getrennte Owner-IDs
  supportsCapabilities: '', // Komma-getrennte Capability-IDs
  usesDataObjects: '', // Komma-getrennte DataObject-IDs
  sourceOfInterfaces: '', // Komma-getrennte Interface-IDs
  targetOfInterfaces: '', // Komma-getrennte Interface-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Data Objects
 */
export const getDataObjectsTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  format: '',
  owners: '', // Komma-getrennte Owner-IDs
  dataSources: '', // Komma-getrennte Application-IDs
  usedByApplications: '', // Komma-getrennte Application-IDs
  relatedToCapabilities: '', // Komma-getrennte Capability-IDs
  transferredInInterfaces: '', // Komma-getrennte Interface-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Interfaces
 */
export const getInterfacesTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  interfaceType: '',
  protocol: '',
  version: '',
  status: '',
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  responsiblePerson: '', // Person-ID
  sourceApplications: '', // Komma-getrennte Application-IDs
  targetApplications: '', // Komma-getrennte Application-IDs
  dataObjects: '', // Komma-getrennte DataObject-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Holt Template-Daten basierend auf dem Entity-Typ mit echten GraphQL-Feldnamen
 */
export const getTemplateByEntityType = (
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): ExcelExportData => {
  switch (entityType) {
    case 'businessCapabilities':
      return getBusinessCapabilitiesTemplate()
    case 'applications':
      return getApplicationsTemplate()
    case 'dataObjects':
      return getDataObjectsTemplate()
    case 'interfaces':
      return getInterfacesTemplate()
    default:
      throw new Error(`Unbekannter Entity-Typ: ${entityType}`)
  }
}

/**
 * Holt die Feldnamen für die Export-Vorschau
 */
export const getFieldNamesByEntityType = (
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): string[] => {
  const template = getTemplateByEntityType(entityType)
  return Object.keys(template)
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  summary: {
    totalRows: number
    validRows: number
    invalidRows: number
    duplicates: number
  }
}

export interface ValidationError {
  row: number
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  row: number
  field: string
  message: string
  suggestion?: string
}

/**
 * Validiert Import-Daten gegen GraphQL-Schema
 */
export const validateImportData = (
  data: any[],
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): ValidationResult => {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const seenIds = new Set<string>()
  let validRows = 0
  let duplicates = 0

  const requiredFields = getRequiredFieldsByEntityType(entityType)
  const optionalFields = getOptionalFieldsByEntityType(entityType)
  const allValidFields = [...requiredFields, ...optionalFields]

  data.forEach((row, index) => {
    const rowNumber = index + 2 // Excel row numbers start at 1, plus header row
    let rowIsValid = true

    // Prüfe ID-Duplikate
    if (row.id && seenIds.has(row.id)) {
      duplicates++
      errors.push({
        row: rowNumber,
        field: 'id',
        message: 'Duplikate ID gefunden',
        severity: 'error',
      })
      rowIsValid = false
    } else if (row.id) {
      seenIds.add(row.id)
    }

    // Prüfe erforderliche Felder
    requiredFields.forEach((field: string) => {
      if (!row[field] || (typeof row[field] === 'string' && row[field].trim() === '')) {
        errors.push({
          row: rowNumber,
          field,
          message: `Erforderliches Feld '${field}' ist leer`,
          severity: 'error',
        })
        rowIsValid = false
      }
    })

    // Prüfe unbekannte Felder
    Object.keys(row).forEach(field => {
      if (!allValidFields.includes(field)) {
        warnings.push({
          row: rowNumber,
          field,
          message: `Unbekanntes Feld '${field}' wird ignoriert`,
          suggestion: `Gültige Felder: ${allValidFields.join(', ')}`,
        })
      }
    })

    // Prüfe ID-Format (falls vorhanden)
    if (row.id && !/^[a-zA-Z0-9-_]+$/.test(row.id)) {
      warnings.push({
        row: rowNumber,
        field: 'id',
        message: 'ID enthält ungültige Zeichen',
        suggestion: 'Verwenden Sie nur Buchstaben, Zahlen, Bindestriche und Unterstriche',
      })
    }

    // Prüfe Datumsfelder
    const dateFields = ['createdAt', 'updatedAt', 'introductionDate', 'endOfLifeDate']
    dateFields.forEach(field => {
      if (row[field] && typeof row[field] === 'string' && row[field].trim() !== '') {
        const dateValue = row[field].trim()
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(dateValue)) {
          warnings.push({
            row: rowNumber,
            field,
            message: 'Ungültiges Datumsformat',
            suggestion: 'Verwenden Sie ISO-Format: 2024-01-01T12:00:00.000Z',
          })
        }
      }
    })

    if (rowIsValid) {
      validRows++
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalRows: data.length,
      validRows,
      invalidRows: data.length - validRows,
      duplicates,
    },
  }
}

/**
 * Erstellt ein Template mit Beispieldaten für bessere Benutzer-Guidance
 */
export const getTemplateWithExamples = (
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): ExcelExportData[] => {
  const emptyTemplate = getTemplateByEntityType(entityType)

  switch (entityType) {
    case 'businessCapabilities':
      return [
        emptyTemplate,
        {
          id: 'cap-001',
          name: 'Customer Management',
          description: 'Manage customer data and relationships',
          maturityLevel: 3,
          status: 'active',
          businessValue: 85,
          owners: 'user-123,user-456',
          tags: 'customer,management,core',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-06-01T14:45:00.000Z',
          parents: 'cap-parent-001',
        },
      ]
    case 'applications':
      return [
        emptyTemplate,
        {
          id: 'app-001',
          name: 'CRM System',
          description: 'Customer Relationship Management System',
          status: 'production',
          criticality: 'high',
          costs: 50000,
          vendor: 'Salesforce',
          version: '2024.1',
          hostingEnvironment: 'cloud',
          technologyStack: 'Java,React,PostgreSQL',
          introductionDate: '2023-01-01T00:00:00.000Z',
          endOfLifeDate: '2028-12-31T23:59:59.000Z',
          owners: 'user-123',
          supportsCapabilities: 'cap-001,cap-002',
          usesDataObjects: 'data-001,data-002',
          sourceOfInterfaces: 'int-001',
          targetOfInterfaces: 'int-002',
          partOfArchitectures: 'arch-001',
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2024-06-01T15:30:00.000Z',
        },
      ]
    case 'dataObjects':
      return [
        emptyTemplate,
        {
          id: 'data-001',
          name: 'Customer Data',
          description: 'Core customer information',
          format: 'JSON',
          owners: 'user-123',
          dataSources: 'app-001',
          usedByApplications: 'app-001,app-002',
          relatedToCapabilities: 'cap-001',
          transferredInInterfaces: 'int-001',
          partOfArchitectures: 'arch-001',
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2024-06-01T15:30:00.000Z',
        },
      ]
    case 'interfaces':
      return [
        emptyTemplate,
        {
          id: 'int-001',
          name: 'Customer API',
          description: 'REST API for customer data access',
          interfaceType: 'REST',
          protocol: 'HTTPS',
          version: 'v2.1',
          status: 'active',
          introductionDate: '2023-03-15T00:00:00.000Z',
          endOfLifeDate: '2026-12-31T23:59:59.000Z',
          responsiblePerson: 'user-123',
          sourceApplications: 'app-001',
          targetApplications: 'app-002,app-003',
          dataObjects: 'data-001,data-002',
          createdAt: '2023-03-15T10:00:00.000Z',
          updatedAt: '2024-06-01T15:30:00.000Z',
        },
      ]
    default:
      return [emptyTemplate]
  }
}

// Helper functions for field validation
export function getRequiredFieldsByEntityType(entityType: EntityType): string[] {
  switch (entityType) {
    case 'businessCapabilities':
      return ['id', 'name']
    case 'applications':
      return ['id', 'name', 'status']
    case 'interfaces':
      return ['id', 'name', 'protocol']
    case 'dataObjects':
      return ['id', 'name']
    default:
      return ['id', 'name']
  }
}

export function getOptionalFieldsByEntityType(entityType: EntityType): string[] {
  switch (entityType) {
    case 'businessCapabilities':
      return [
        'description',
        'maturityLevel',
        'status',
        'businessValue',
        'owners',
        'tags',
        'parents',
        'createdAt',
        'updatedAt',
      ]
    case 'applications':
      return [
        'description',
        'criticality',
        'costs',
        'vendor',
        'version',
        'hostingEnvironment',
        'technologyStack',
        'introductionDate',
        'endOfLifeDate',
        'owners',
        'supportsCapabilities',
        'usesDataObjects',
        'sourceOfInterfaces',
        'targetOfInterfaces',
        'partOfArchitectures',
        'createdAt',
        'updatedAt',
      ]
    case 'interfaces':
      return [
        'description',
        'interfaceType',
        'version',
        'status',
        'introductionDate',
        'endOfLifeDate',
        'responsiblePerson',
        'sourceApplications',
        'targetApplications',
        'dataObjects',
        'createdAt',
        'updatedAt',
      ]
    case 'dataObjects':
      return [
        'description',
        'format',
        'owners',
        'dataSources',
        'usedByApplications',
        'relatedToCapabilities',
        'transferredInInterfaces',
        'partOfArchitectures',
        'createdAt',
        'updatedAt',
      ]
    default:
      return ['description', 'createdAt', 'updatedAt']
  }
}
