import { ApolloClient } from '@apollo/client'
import { GET_CAPABILITIES } from '../graphql/capability'
import { GET_APPLICATIONS } from '../graphql/application'
import { GET_APPLICATION_INTERFACES } from '../graphql/applicationInterface'
import { GET_DATA_OBJECTS } from '../graphql/dataObject'
import { GET_PERSONS } from '../graphql/person'
import { GET_ARCHITECTURES } from '../graphql/architecture'
import { GET_DIAGRAMS } from '../graphql/diagram'
import { GET_ARCHITECTURE_PRINCIPLES } from '../graphql/architecturePrinciple'

export interface ExcelExportData {
  [key: string]: string | number | boolean | Date
}

export type EntityType =
  | 'businessCapabilities'
  | 'applications'
  | 'dataObjects'
  | 'interfaces'
  | 'persons'
  | 'architectures'
  // 'diagrams' - Ausgeblendet für Excel-Operationen (zu große JSON-Daten)
  | 'architecturePrinciples'
  | 'all'

/**
 * Formatiert ein Datum in ISO-Format für re-import-fähigen Export
 */
const formatDateForExport = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return ''

  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    return date.toISOString()
  } catch {
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
  } catch {
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
  } catch {
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
      classification: obj.classification || '',
      format: obj.format || '',
      introductionDate: formatDateForExport(obj.introductionDate),
      endOfLifeDate: formatDateForExport(obj.endOfLifeDate),
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
  } catch {
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
      responsiblePerson: iface.responsiblePerson?.map((person: any) => person.id).join(',') || '',
      sourceApplications: iface.sourceApplications?.map((app: any) => app.id).join(',') || '',
      targetApplications: iface.targetApplications?.map((app: any) => app.id).join(',') || '',
      dataObjects: iface.dataObjects?.map((obj: any) => obj.id).join(',') || '',
      createdAt: formatDateForExport(iface.createdAt),
      updatedAt: formatDateForExport(iface.updatedAt),
    }))
  } catch {
    throw new Error('Fehler beim Laden der Schnittstellen für Export')
  }
}

/**
 * Holt echte Personen Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchPersonsForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_PERSONS,
      fetchPolicy: 'network-only',
    })

    if (!data?.people) {
      return []
    }

    return data.people.map((person: any) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email || '',
      department: person.department || '',
      role: person.role || '',
      phone: person.phone || '',
      createdAt: formatDateForExport(person.createdAt),
      updatedAt: formatDateForExport(person.updatedAt),
      ownedCapabilities: person.ownedCapabilities?.map((cap: any) => cap.id).join(',') || '',
      ownedApplications: person.ownedApplications?.map((app: any) => app.id).join(',') || '',
      ownedDataObjects: person.ownedDataObjects?.map((obj: any) => obj.id).join(',') || '',
    }))
  } catch {
    throw new Error('Personen konnten nicht geladen werden')
  }
}

/**
 * Holt echte Architekturen Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchArchitecturesForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURES,
      fetchPolicy: 'network-only',
    })

    if (!data?.architectures) {
      return []
    }

    return data.architectures.map((arch: any) => ({
      id: arch.id,
      name: arch.name,
      description: arch.description || '',
      domain: arch.domain,
      type: arch.type,
      timestamp: formatDateForExport(arch.timestamp),
      tags: arch.tags?.join(',') || '',
      createdAt: formatDateForExport(arch.createdAt),
      updatedAt: formatDateForExport(arch.updatedAt),
      owners: arch.owners?.map((owner: any) => owner.id).join(',') || '',
      containsApplications: arch.containsApplications?.map((app: any) => app.id).join(',') || '',
      containsCapabilities: arch.containsCapabilities?.map((cap: any) => cap.id).join(',') || '',
      containsDataObjects: arch.containsDataObjects?.map((obj: any) => obj.id).join(',') || '',
      diagrams: arch.diagrams?.map((diag: any) => diag.id).join(',') || '',
      childArchitectures: arch.childArchitectures?.map((child: any) => child.id).join(',') || '',
      parentArchitecture: arch.parentArchitecture?.map((parent: any) => parent.id).join(',') || '',
    }))
  } catch {
    throw new Error('Architekturen konnten nicht geladen werden')
  }
}

/**
 * Holt echte Diagramme Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchDiagramsForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DIAGRAMS,
      fetchPolicy: 'network-only',
    })

    if (!data?.diagrams) {
      return []
    }

    return data.diagrams.map((diagram: any) => ({
      id: diagram.id,
      title: diagram.title,
      description: diagram.description || '',
      diagramType: diagram.diagramType || '',
      diagramJson: diagram.diagramJson || '',
      createdAt: formatDateForExport(diagram.createdAt),
      updatedAt: formatDateForExport(diagram.updatedAt),
      creator: diagram.creator?.map((creator: any) => creator.id).join(',') || '',
      architecture: diagram.architecture?.map((arch: any) => arch.id).join(',') || '',
    }))
  } catch {
    throw new Error('Diagramme konnten nicht geladen werden')
  }
}

/**
 * Holt echte Architekturprinzipien Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchArchitecturePrinciplesForExport = async (
  client: ApolloClient<any>
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURE_PRINCIPLES,
      fetchPolicy: 'network-only',
    })

    if (!data?.architecturePrinciples) {
      return []
    }

    return data.architecturePrinciples.map((principle: any) => ({
      id: principle.id,
      name: principle.name,
      description: principle.description || '',
      category: principle.category || '',
      priority: principle.priority || '',
      rationale: principle.rationale || '',
      implications: principle.implications || '',
      tags: Array.isArray(principle.tags) ? principle.tags.join(',') : '',
      isActive: principle.isActive || false,
      createdAt: formatDateForExport(principle.createdAt),
      updatedAt: formatDateForExport(principle.updatedAt),
      owners: principle.owners?.map((owner: any) => owner.id).join(',') || '',
      appliedInArchitectures:
        principle.appliedInArchitectures?.map((arch: any) => arch.id).join(',') || '',
      implementedByApplications:
        principle.implementedByApplications?.map((app: any) => app.id).join(',') || '',
    }))
  } catch {
    throw new Error('Architekturprinzipien konnten nicht geladen werden')
  }
}

/**
 * Holt alle Entitäten für Admin-Export (Multi-Tab Excel)
 * Hinweis: Diagramme werden beim Excel-Export ausgeblendet, da die JSON-Daten zu groß sind
 */
export const fetchAllEntitiesForExport = async (
  client: ApolloClient<any>
): Promise<{ [tabName: string]: ExcelExportData[] }> => {
  try {
    const [
      businessCapabilities,
      applications,
      dataObjects,
      interfaces,
      persons,
      architectures,
      // diagrams - Ausgeblendet für Excel (zu große JSON-Daten)
      architecturePrinciples,
    ] = await Promise.all([
      fetchBusinessCapabilitiesForExport(client),
      fetchApplicationsForExport(client),
      fetchDataObjectsForExport(client),
      fetchInterfacesForExport(client),
      fetchPersonsForExport(client),
      fetchArchitecturesForExport(client),
      // fetchDiagramsForExport(client), - Ausgeblendet für Excel
      fetchArchitecturePrinciplesForExport(client),
    ])

    return {
      'Business Capabilities': businessCapabilities,
      Applications: applications,
      'Data Objects': dataObjects,
      Interfaces: interfaces,
      Persons: persons,
      Architectures: architectures,
      // Diagrams: diagrams, - Ausgeblendet für Excel-Export
      'Architecture Principles': architecturePrinciples,
    }
  } catch {
    throw new Error('Fehler beim Laden der kompletten Datenbank')
  }
}

/**
 * Holt echte Daten basierend auf dem Entity-Typ
 */
export const fetchDataByEntityType = async (
  client: ApolloClient<any>,
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
): Promise<ExcelExportData[] | { [tabName: string]: ExcelExportData[] }> => {
  switch (entityType) {
    case 'businessCapabilities':
      return fetchBusinessCapabilitiesForExport(client)
    case 'applications':
      return fetchApplicationsForExport(client)
    case 'dataObjects':
      return fetchDataObjectsForExport(client)
    case 'interfaces':
      return fetchInterfacesForExport(client)
    case 'persons':
      return fetchPersonsForExport(client)
    case 'architectures':
      return fetchArchitecturesForExport(client)
    case 'diagrams':
      return fetchDiagramsForExport(client)
    case 'architecturePrinciples':
      return fetchArchitecturePrinciplesForExport(client)
    case 'all':
      return fetchAllEntitiesForExport(client)
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
  classification: '', // DataClassification enum: PUBLIC, INTERNAL, CONFIDENTIAL, STRICTLY_CONFIDENTIAL
  format: '',
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
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
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Personen
 */
export const getPersonsTemplate = (): ExcelExportData => ({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  ownedCapabilities: '', // Komma-getrennte Capability-IDs
  ownedApplications: '', // Komma-getrennte Application-IDs
  ownedDataObjects: '', // Komma-getrennte DataObject-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Architekturen
 */
export const getArchitecturesTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  domain: '', // BUSINESS, DATA, APPLICATION, TECHNOLOGY, SECURITY, ENTERPRISE
  type: '', // CURRENT_STATE, FUTURE_STATE, TRANSITION, CONCEPTUAL
  timestamp: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  tags: '', // Komma-getrennte Tags
  owners: '', // Komma-getrennte Owner-IDs
  containsApplications: '', // Komma-getrennte Application-IDs
  containsCapabilities: '', // Komma-getrennte Capability-IDs
  containsDataObjects: '', // Komma-getrennte DataObject-IDs
  diagrams: '', // Komma-getrennte Diagram-IDs
  childArchitectures: '', // Komma-getrennte Architecture-IDs
  parentArchitecture: '', // Komma-getrennte Parent Architecture-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Diagramme
 */
export const getDiagramsTemplate = (): ExcelExportData => ({
  id: '',
  title: '',
  description: '',
  diagramType: '', // APPLICATION_LANDSCAPE, ARCHITECTURE, CAPABILITY_MAP, CONCEPTUAL, DATA_FLOW, INTEGRATION_ARCHITECTURE, NETWORK, OTHER, PROCESS, SECURITY_ARCHITECTURE
  diagramJson: '', // Excalidraw JSON data
  creator: '', // Komma-getrennte Creator-IDs (Person)
  architecture: '', // Komma-getrennte Architecture-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Architekturprinzipien
 */
export const getArchitecturePrinciplesTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  category: '', // BUSINESS, TECHNICAL, GOVERNANCE, SECURITY, DATA
  priority: '', // LOW, MEDIUM, HIGH, CRITICAL
  rationale: '',
  implications: '',
  tags: '', // Komma-getrennte Tags
  isActive: '', // true/false
  owners: '', // Komma-getrennte Owner-IDs (Person)
  appliedInArchitectures: '', // Komma-getrennte Architecture-IDs
  implementedByApplications: '', // Komma-getrennte Application-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Holt Template-Daten basierend auf dem Entity-Typ mit echten GraphQL-Feldnamen
 * Hinweis: Diagramme sind für Excel-Operationen ausgeblendet
 */
export const getTemplateByEntityType = (
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    // 'diagrams' - Ausgeblendet für Excel-Operationen
    | 'architecturePrinciples'
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
    case 'persons':
      return getPersonsTemplate()
    case 'architectures':
      return getArchitecturesTemplate()
    // case 'diagrams': - Ausgeblendet für Excel-Operationen
    //   return getDiagramsTemplate()
    case 'architecturePrinciples':
      return getArchitecturePrinciplesTemplate()
    default:
      throw new Error(`Unbekannter Entity-Typ: ${entityType}`)
  }
}

/**
 * Holt die Feldnamen für die Export-Vorschau
 */
export const getFieldNamesByEntityType = (
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
): string[] | { [tabName: string]: string[] } => {
  if (entityType === 'all') {
    return {
      'Business Capabilities': Object.keys(getBusinessCapabilitiesTemplate()),
      Applications: Object.keys(getApplicationsTemplate()),
      'Data Objects': Object.keys(getDataObjectsTemplate()),
      Interfaces: Object.keys(getInterfacesTemplate()),
      Persons: Object.keys(getPersonsTemplate()),
      Architectures: Object.keys(getArchitecturesTemplate()),
      // diagrams: Object.keys(getDiagramsTemplate()), - Ausgeblendet für Excel-Export
      'Architecture Principles': Object.keys(getArchitecturePrinciplesTemplate()),
    }
  }

  const template = getTemplateByEntityType(entityType as Exclude<typeof entityType, 'diagrams'>)
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
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    // 'diagrams' - Ausgeblendet für Excel-Validierung
    | 'architecturePrinciples'
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
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    // 'diagrams' - Ausgeblendet für Excel-Operationen
    | 'architecturePrinciples'
): ExcelExportData[] => {
  const emptyTemplate = getTemplateByEntityType(
    entityType as Exclude<typeof entityType, 'diagrams'>
  )

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
          classification: 'CONFIDENTIAL',
          format: 'JSON',
          introductionDate: '2023-01-01T00:00:00.000Z',
          endOfLifeDate: '2028-12-31T23:59:59.000Z',
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
    case 'persons':
      return [
        emptyTemplate,
        {
          id: 'user-001',
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max.mustermann@example.com',
          phone: '+491234567890',
          role: 'admin',
          department: 'IT',
          ownedCapabilities: 'cap-001,cap-002',
          ownedApplications: 'app-001,app-002',
          ownedDataObjects: 'data-001',
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-06-01T15:30:00.000Z',
        },
      ]
    case 'architectures':
      return [
        emptyTemplate,
        {
          id: 'arch-001',
          name: 'Microservices Architecture',
          description: 'Decomposed architecture with microservices',
          domain: 'APPLICATION',
          type: 'FUTURE_STATE',
          timestamp: '2024-06-01T00:00:00.000Z',
          tags: 'microservices,scalable,cloud',
          owners: 'user-001,user-002',
          containsApplications: 'app-001,app-002',
          containsCapabilities: 'cap-001,cap-002',
          containsDataObjects: 'data-001',
          diagrams: 'diag-001',
          childArchitectures: 'arch-002',
          parentArchitecture: 'arch-parent-001',
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-06-01T15:30:00.000Z',
        },
      ]
    // case 'diagrams': - Ausgeblendet für Excel-Operationen (zu große JSON-Daten)
    case 'architecturePrinciples':
      return [
        emptyTemplate,
        {
          id: 'princ-001',
          name: 'Cloud First',
          description: 'Prioritize cloud-native solutions over on-premise alternatives',
          category: 'TECHNICAL',
          priority: 'HIGH',
          rationale: 'Cloud solutions provide better scalability, reliability, and cost efficiency',
          implications: 'New applications must justify on-premise deployment',
          tags: 'cloud,scalability,cost-efficiency',
          isActive: 'true',
          owners: 'user-001,user-002',
          appliedInArchitectures: 'arch-001,arch-002',
          implementedByApplications: 'app-001,app-003',
          createdAt: '2024-01-01T10:00:00.000Z',
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
      return ['id', 'name', 'interfaceType', 'status']
    case 'dataObjects':
      return ['id', 'name']
    case 'persons':
      return ['id', 'firstName', 'lastName']
    case 'architectures':
      return ['id', 'name', 'domain', 'type', 'timestamp']
    // case 'diagrams': - Ausgeblendet für Excel-Operationen
    //   return ['id', 'title', 'diagramJson']
    case 'architecturePrinciples':
      return ['id', 'name', 'category', 'priority']
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
        'protocol',
        'version',
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
        'classification',
        'format',
        'introductionDate',
        'endOfLifeDate',
        'owners',
        'dataSources',
        'usedByApplications',
        'relatedToCapabilities',
        'transferredInInterfaces',
        'partOfArchitectures',
        'createdAt',
        'updatedAt',
      ]
    case 'persons':
      return [
        'email',
        'phone',
        'role',
        'department',
        'ownedCapabilities',
        'ownedApplications',
        'ownedDataObjects',
        'createdAt',
        'updatedAt',
      ]
    case 'architectures':
      return [
        'description',
        'tags',
        'owners',
        'containsApplications',
        'containsCapabilities',
        'containsDataObjects',
        'diagrams',
        'childArchitectures',
        'parentArchitecture',
        'createdAt',
        'updatedAt',
      ]
    // case 'diagrams': - Ausgeblendet für Excel-Operationen
    //   return ['description', 'diagramType', 'creator', 'architecture', 'createdAt', 'updatedAt']
    case 'architecturePrinciples':
      return [
        'description',
        'rationale',
        'implications',
        'tags',
        'isActive',
        'owners',
        'appliedInArchitectures',
        'implementedByApplications',
        'createdAt',
        'updatedAt',
      ]
    default:
      return ['description', 'createdAt', 'updatedAt']
  }
}
