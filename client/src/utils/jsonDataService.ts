import { ApolloClient } from '@apollo/client'
import { GET_CAPABILITIES } from '../graphql/capability'
import { GET_APPLICATIONS } from '../graphql/application'
import { GET_DATA_OBJECTS } from '../graphql/dataObject'
import { GET_APPLICATION_INTERFACES } from '../graphql/applicationInterface'
import { GET_PERSONS } from '../graphql/person'
import { GET_ARCHITECTURES } from '../graphql/architecture'
import { GET_DIAGRAMS } from '../graphql/diagram'
import { GET_ARCHITECTURE_PRINCIPLES } from '../graphql/architecturePrinciple'
import { GET_INFRASTRUCTURES } from '../graphql/infrastructure'
import { GET_Aicomponents } from '../graphql/aicomponent'
import { ValidationResult } from '../components/excel/types'
import { getRequiredFieldsByEntityType, getOptionalFieldsByEntityType } from './excelDataService'

/**
 * Typen für JSON-Export
 */
export interface JsonExportData {
  [key: string]: any
}

export type JsonEntityType =
  | 'businessCapabilities'
  | 'applications'
  | 'dataObjects'
  | 'interfaces'
  | 'persons'
  | 'architectures'
  | 'diagrams'
  | 'architecturePrinciples'
  | 'infrastructures'
  | 'aicomponents'

// Hilfsfunktion: Company-Filter (inkl. Diagramm-OR-Sonderfall)
const companyWhere = (entityType: JsonEntityType | 'all', companyId?: string): any | undefined => {
  if (!companyId) return undefined

  if (entityType === 'diagrams') {
    return {
      OR: [
        { company: { some: { id: { eq: companyId } } } },
        { architecture: { some: { company: { some: { id: { eq: companyId } } } } } },
      ],
    }
  }

  if (entityType === 'persons') {
    return { companies: { some: { id: { eq: companyId } } } }
  }

  return { company: { some: { id: { eq: companyId } } } }
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
 * Formatiert Datum für JSON-Export (behält ursprüngliches ISO-Format bei)
 */
const formatDateForJsonExport = (date: string | null | undefined): string => {
  if (!date) return ''
  return date // JSON behält ISO-Format bei
}

/**
 * Holt Business Capabilities für JSON-Export mit vollständigen Daten
 */
export const fetchBusinessCapabilitiesForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_CAPABILITIES,
      variables: { where: companyWhere('businessCapabilities', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.businessCapabilities?.map((cap: any) => ({
      id: cap.id,
      name: cap.name || '',
      description: cap.description || '',
      status: cap.status || '',
      type: cap.type || undefined,
      // Numeric fields
      businessValue: cap.businessValue || undefined,
      maturityLevel: cap.maturityLevel || undefined,
      sequenceNumber: cap.sequenceNumber || undefined,
      // Date fields
      introductionDate: formatDateForJsonExport(cap.introductionDate),
      endDate: formatDateForJsonExport(cap.endDate),
      createdAt: formatDateForJsonExport(cap.createdAt),
      updatedAt: formatDateForJsonExport(cap.updatedAt),
      // Array fields
      tags: cap.tags || [],
      // Beziehungen als verschachtelte Objekte (nicht als ID-Strings)
      owners: cap.owners || [],
      supportedByApplications: cap.supportedByApplications || [],
      partOfArchitectures: cap.partOfArchitectures || [],
      relatedDataObjects: cap.relatedDataObjects || [],
      depictedInDiagrams: cap.depictedInDiagrams || [],
      parents: cap.parents || [],
      children: cap.children || [],
    }))
  } catch {
    throw new Error('Error loading business capabilities für JSON-Export')
  }
}

/**
 * Holt Applications für JSON-Export mit vollständigen Daten
 */
export const fetchApplicationsForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATIONS,
      variables: { where: companyWhere('applications', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.applications?.map((app: any) => ({
      id: app.id,
      name: app.name || '',
      description: app.description || '',
      version: app.version || '',
      status: app.status || '',
      criticality: app.criticality || '',
      vendor: app.vendor || '',
      hostingEnvironment: app.hostingEnvironment || '',
      // Numeric fields
      costs: app.costs || undefined,
      // Date fields - alle wichtigen Datums-Felder hinzufügen
      introductionDate: formatDateForJsonExport(app.introductionDate),
      endOfLifeDate: formatDateForJsonExport(app.endOfLifeDate),
      endOfUseDate: formatDateForJsonExport(app.endOfUseDate),
      planningDate: formatDateForJsonExport(app.planningDate),
      createdAt: formatDateForJsonExport(app.createdAt),
      updatedAt: formatDateForJsonExport(app.updatedAt),
      // Array fields
      technologyStack: app.technologyStack || [],
      // Enum fields
      sevenRStrategy: app.sevenRStrategy || undefined,
      timeCategory: app.timeCategory || undefined,
      // Beziehungen als verschachtelte Objekte
      owners: app.owners || [],
      supportsCapabilities: app.supportsCapabilities || [],
      usesDataObjects: app.usesDataObjects || [],
      sourceOfInterfaces: app.sourceOfInterfaces || [],
      targetOfInterfaces: app.targetOfInterfaces || [],
      partOfArchitectures: app.partOfArchitectures || [],
      depictedInDiagrams: app.depictedInDiagrams || [],
      parents: app.parents || [],
      components: app.components || [],
      predecessors: app.predecessors || [],
      successors: app.successors || [],
      implementsPrinciples: app.implementsPrinciples || [],
      hostedOn: app.hostedOn || [],
      isDataSourceFor: app.isDataSourceFor || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Applications für JSON-Export')
  }
}

/**
 * Holt Data Objects für JSON-Export mit vollständigen Daten
 */
export const fetchDataObjectsForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DATA_OBJECTS,
      variables: { where: companyWhere('dataObjects', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.dataObjects?.map((obj: any) => ({
      id: obj.id,
      name: obj.name || '',
      description: obj.description || '',
      classification: obj.classification || '',
      format: obj.format || '',
      // Date fields
      introductionDate: formatDateForJsonExport(obj.introductionDate),
      endOfLifeDate: formatDateForJsonExport(obj.endOfLifeDate),
      endOfUseDate: formatDateForJsonExport(obj.endOfUseDate),
      planningDate: formatDateForJsonExport(obj.planningDate),
      createdAt: formatDateForJsonExport(obj.createdAt),
      updatedAt: formatDateForJsonExport(obj.updatedAt),
      // Beziehungen als verschachtelte Objekte
      owners: obj.owners || [],
      dataSources: obj.dataSources || [],
      usedByApplications: obj.usedByApplications || [],
      relatedToCapabilities: obj.relatedToCapabilities || [],
      transferredInInterfaces: obj.transferredInInterfaces || [],
      partOfArchitectures: obj.partOfArchitectures || [],
      depictedInDiagrams: obj.depictedInDiagrams || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Data Objects für JSON-Export')
  }
}

/**
 * Holt Interfaces für JSON-Export mit vollständigen Daten
 */
export const fetchInterfacesForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATION_INTERFACES,
      variables: { where: companyWhere('interfaces', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.applicationInterfaces?.map((iface: any) => ({
      id: iface.id,
      name: iface.name || '',
      description: iface.description || '',
      interfaceType: iface.interfaceType || '',
      status: iface.status || '',
      protocol: iface.protocol || '',
      version: iface.version || '',
      // Date fields
      introductionDate: formatDateForJsonExport(iface.introductionDate),
      planningDate: formatDateForJsonExport(iface.planningDate),
      endOfUseDate: formatDateForJsonExport(iface.endOfUseDate),
      endOfLifeDate: formatDateForJsonExport(iface.endOfLifeDate),
      createdAt: formatDateForJsonExport(iface.createdAt),
      updatedAt: formatDateForJsonExport(iface.updatedAt),
      // Beziehungen als verschachtelte Objekte
      sourceApplications: iface.sourceApplications || [],
      targetApplications: iface.targetApplications || [],
      dataObjects: iface.dataObjects || [],
      owners: iface.owners || [],
      predecessors: iface.predecessors || [],
      successors: iface.successors || [],
      partOfArchitectures: iface.partOfArchitectures || [],
      depictedInDiagrams: iface.depictedInDiagrams || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Interfaces für JSON-Export')
  }
}

/**
 * Holt Persons für JSON-Export mit vollständigen Daten
 */
export const fetchPersonsForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_PERSONS,
      variables: { where: companyWhere('persons', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.people?.map((person: any) => ({
      id: person.id,
      firstName: person.firstName || '',
      lastName: person.lastName || '',
      // Temporäres name-Feld für Export-Kompatibilität (kombiniert firstName + lastName)
      name: `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Unbenannt',
      email: person.email || '',
      role: person.role || '',
      department: person.department || '',
      phone: person.phone || '',
      avatarUrl: person.avatarUrl || '',
      createdAt: formatDateForJsonExport(person.createdAt),
      updatedAt: formatDateForJsonExport(person.updatedAt),
      // Beziehungen als verschachtelte Objekte
      ownedApplications: person.ownedApplications || [],
      ownedDataObjects: person.ownedDataObjects || [],
      ownedCapabilities: person.ownedCapabilities || [],
      ownedArchitectures: person.ownedArchitectures || [],
      ownedDiagrams: person.ownedDiagrams || [],
      ownedInfrastructure: person.ownedInfrastructure || [],
      ownedInterfaces: person.ownedInterfaces || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Persons für JSON-Export')
  }
}

/**
 * Holt Architectures für JSON-Export mit vollständigen Daten
 */
export const fetchArchitecturesForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURES,
      variables: { where: companyWhere('architectures', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.architectures?.map((arch: any) => ({
      id: arch.id,
      name: arch.name || '',
      description: arch.description || '',
      domain: arch.domain || '',
      type: arch.type || '',
      tags: arch.tags || [],
      timestamp: formatDateForJsonExport(arch.timestamp),
      createdAt: formatDateForJsonExport(arch.createdAt),
      updatedAt: formatDateForJsonExport(arch.updatedAt),
      // Beziehungen als verschachtelte Objekte
      containsApplications: arch.containsApplications || [],
      containsCapabilities: arch.containsCapabilities || [],
      containsDataObjects: arch.containsDataObjects || [],
      containsInterfaces: arch.containsInterfaces || [],
      containsInfrastructure: arch.containsInfrastructure || [],
      owners: arch.owners || [],
      diagrams: arch.diagrams || [],
      appliedPrinciples: arch.appliedPrinciples || [],
      parentArchitecture: arch.parentArchitecture || null,
      childArchitectures: arch.childArchitectures || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Architectures für JSON-Export')
  }
}

/**
 * Holt Diagrams für JSON-Export mit vollständigen Daten (inklusive diagramJson)
 */
export const fetchDiagramsForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DIAGRAMS,
      variables: { where: companyWhere('diagrams', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.diagrams?.map((diagram: any) => ({
      id: diagram.id,
      title: diagram.title || '',
      description: diagram.description || '',
      diagramType: diagram.diagramType || '',
      diagramJson: diagram.diagramJson || '', // Vollständige Excalidraw-Daten für JSON
      diagramPng: diagram.diagramPng || '',
      createdAt: formatDateForJsonExport(diagram.createdAt),
      updatedAt: formatDateForJsonExport(diagram.updatedAt),
      // Beziehungen als verschachtelte Objekte
      containsApplications: diagram.containsApplications || [],
      containsCapabilities: diagram.containsCapabilities || [],
      containsDataObjects: diagram.containsDataObjects || [],
      containsInterfaces: diagram.containsInterfaces || [],
      containsInfrastructure: diagram.containsInfrastructure || [],
      creator: diagram.creator || null,
      architecture: diagram.architecture || null,
    }))
  } catch {
    throw new Error('Fehler beim Laden der Diagrams für JSON-Export')
  }
}

/**
 * Holt Architecture Principles für JSON-Export mit vollständigen Daten
 */
export const fetchArchitecturePrinciplesForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURE_PRINCIPLES,
      variables: { where: companyWhere('architecturePrinciples', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.architecturePrinciples?.map((principle: any) => ({
      id: principle.id,
      name: principle.name || '',
      description: principle.description || '',
      rationale: principle.rationale || '',
      implications: principle.implications || '',
      category: principle.category || '',
      priority: principle.priority || '',
      isActive: principle.isActive || false,
      tags: principle.tags || [],
      createdAt: formatDateForJsonExport(principle.createdAt),
      updatedAt: formatDateForJsonExport(principle.updatedAt),
      // Beziehungen als verschachtelte Objekte
      appliedInArchitectures: principle.appliedInArchitectures || [],
      implementedByApplications: principle.implementedByApplications || [],
      owners: principle.owners || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Architecture Principles für JSON-Export')
  }
}

/**
 * Holt Infrastructures für JSON-Export mit vollständigen Daten
 */
export const fetchInfrastructuresForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_INFRASTRUCTURES,
      variables: { where: companyWhere('infrastructures', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.infrastructures?.map((infra: any) => ({
      id: infra.id,
      name: infra.name || '',
      description: infra.description || '',
      infrastructureType: infra.infrastructureType || '',
      status: infra.status || '',
      location: infra.location || '',
      capacity: infra.capacity || '',
      costs: infra.costs || 0,
      vendor: infra.vendor || '',
      operatingSystem: infra.operatingSystem || '',
      ipAddress: infra.ipAddress || '',
      specifications: infra.specifications || '',
      maintenanceWindow: infra.maintenanceWindow || '',
      // Date fields
      introductionDate: formatDateForJsonExport(infra.introductionDate),
      planningDate: formatDateForJsonExport(infra.planningDate),
      endOfUseDate: formatDateForJsonExport(infra.endOfUseDate),
      endOfLifeDate: formatDateForJsonExport(infra.endOfLifeDate),
      createdAt: formatDateForJsonExport(infra.createdAt),
      updatedAt: formatDateForJsonExport(infra.updatedAt),
      // Beziehungen als verschachtelte Objekte
      hostsApplications: infra.hostsApplications || [],
      owners: infra.owners || [],
      partOfArchitectures: infra.partOfArchitectures || [],
      depictedInDiagrams: infra.depictedInDiagrams || [],
      parentInfrastructure: infra.parentInfrastructure || null,
      childInfrastructures: infra.childInfrastructures || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Infrastructures für JSON-Export')
  }
}

/**
 * Holt AI Components für JSON-Export mit vollständigen Daten
 */
export const fetchAicomponentsForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_Aicomponents,
      variables: { where: companyWhere('aicomponents', selectedCompanyId) },
      fetchPolicy: 'cache-first',
    })

    return data.aiComponents?.map((ai: any) => ({
      id: ai.id,
      name: ai.name || '',
      description: ai.description || '',
      aiType: ai.aiType || '',
      model: ai.model || '',
      version: ai.version || '',
      status: ai.status || '',
      accuracy: ai.accuracy || '',
      provider: ai.provider || '',
      license: ai.license || '',
      costs: ai.costs || '',
      // Date fields
      trainingDate: formatDateForJsonExport(ai.trainingDate),
      lastUpdated: formatDateForJsonExport(ai.lastUpdated),
      createdAt: formatDateForJsonExport(ai.createdAt),
      updatedAt: formatDateForJsonExport(ai.updatedAt),
      // Array fields
      tags: ai.tags || [],
      // Beziehungen als verschachtelte Objekte
      owners: ai.owners || [],
      supportsCapabilities: ai.supportsCapabilities || [],
      usedByApplications: ai.usedByApplications || [],
      trainedWithDataObjects: ai.trainedWithDataObjects || [],
      hostedOn: ai.hostedOn || [],
      partOfArchitectures: ai.partOfArchitectures || [],
      implementsPrinciples: ai.implementsPrinciples || [],
      depictedInDiagrams: ai.depictedInDiagrams || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der AI Components für JSON-Export')
  }
}

/**
 * Holt alle Daten für JSON-Export mit vollständigen Beziehungsinformationen
 */
export const fetchAllDataForJson = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<{ [tabName: string]: JsonExportData[] }> => {
  try {
    const [
      businessCapabilities,
      applications,
      dataObjects,
      interfaces,
      persons,
      architectures,
      diagrams,
      architecturePrinciples,
      infrastructures,
      aicomponents,
    ] = await Promise.all([
      fetchBusinessCapabilitiesForJson(client, selectedCompanyId),
      fetchApplicationsForJson(client, selectedCompanyId),
      fetchDataObjectsForJson(client, selectedCompanyId),
      fetchInterfacesForJson(client, selectedCompanyId),
      fetchPersonsForJson(client, selectedCompanyId),
      fetchArchitecturesForJson(client, selectedCompanyId),
      fetchDiagramsForJson(client, selectedCompanyId),
      fetchArchitecturePrinciplesForJson(client, selectedCompanyId),
      fetchInfrastructuresForJson(client, selectedCompanyId),
      fetchAicomponentsForJson(client, selectedCompanyId),
    ])

    return {
      'Business Capabilities': businessCapabilities,
      Applications: applications,
      'Data Objects': dataObjects,
      Interfaces: interfaces,
      Persons: persons,
      Architectures: architectures,
      Diagrams: diagrams, // Vollständige Diagramme mit JSON-Daten
      'Architecture Principles': architecturePrinciples,
      Infrastructure: infrastructures,
      'AI Components': aicomponents,
    }
  } catch (error) {
    console.error('Fehler beim Laden aller Daten für JSON-Export:', error)
    throw error
  }
}

/**
 * Holt Daten für spezifischen Entity-Type für JSON-Export
 */
export const fetchDataByEntityTypeForJson = async (
  client: ApolloClient<any>,
  entityType: JsonEntityType | 'all',
  selectedCompanyId?: string
): Promise<JsonExportData[] | { [tabName: string]: JsonExportData[] }> => {
  if (entityType === 'all') {
    return await fetchAllDataForJson(client, selectedCompanyId)
  }

  switch (entityType) {
    case 'businessCapabilities':
      return await fetchBusinessCapabilitiesForJson(client, selectedCompanyId)
    case 'applications':
      return await fetchApplicationsForJson(client, selectedCompanyId)
    case 'dataObjects':
      return await fetchDataObjectsForJson(client, selectedCompanyId)
    case 'interfaces':
      return await fetchInterfacesForJson(client, selectedCompanyId)
    case 'persons':
      return await fetchPersonsForJson(client, selectedCompanyId)
    case 'architectures':
      return await fetchArchitecturesForJson(client, selectedCompanyId)
    case 'diagrams':
      return await fetchDiagramsForJson(client, selectedCompanyId)
    case 'architecturePrinciples':
      return await fetchArchitecturePrinciplesForJson(client, selectedCompanyId)
    case 'infrastructures':
      return await fetchInfrastructuresForJson(client, selectedCompanyId)
    case 'aicomponents':
      return await fetchAicomponentsForJson(client, selectedCompanyId)
    default:
      throw new Error(`Unbekannter Entity-Type: ${entityType}`)
  }
}

/**
 * Validiert JSON-Import-Daten gegen Schema
 */
export const validateJsonImportData = (
  data: any[],
  entityType: JsonEntityType
): ValidationResult => {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const seenIds = new Set<string>()
  let validRows = 0
  let duplicates = 0

  // Grundlegende JSON-Struktur-Validierung
  if (!Array.isArray(data)) {
    errors.push({
      row: 1,
      field: 'structure',
      message: 'JSON data must be an array',
      severity: 'error',
    })
    return {
      isValid: false,
      errors,
      warnings,
      summary: {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        duplicates: 0,
      },
      fieldCoverage: {
        mandatoryFieldsPresent: [],
        mandatoryFieldsMissing: [],
        optionalFieldsPresent: [],
        optionalFieldsMissing: [],
        unmappedColumns: [],
      },
    }
  }

  // Get required and optional fields for this entity type
  const requiredFields = getRequiredFieldsByEntityType(entityType)
  const optionalFields = getOptionalFieldsByEntityType(entityType)
  const allValidFields = ['id', ...requiredFields, ...optionalFields]

  // Analyze field coverage from the first row
  const fileColumns = data.length > 0 ? Object.keys(data[0]) : []
  const mandatoryFieldsPresent = requiredFields.filter((field: string) =>
    fileColumns.includes(field)
  )
  const mandatoryFieldsMissing = requiredFields.filter(
    (field: string) => !fileColumns.includes(field)
  )
  const optionalFieldsPresent = optionalFields.filter((field: string) =>
    fileColumns.includes(field)
  )
  const optionalFieldsMissing = optionalFields.filter(
    (field: string) => !fileColumns.includes(field)
  )
  const unmappedColumns = fileColumns.filter((col: string) => !allValidFields.includes(col))

  data.forEach((row, index) => {
    const rowNumber = index + 1
    let rowIsValid = true

    // Grundlegende Struktur-Checks
    if (typeof row !== 'object' || row === null) {
      errors.push({
        row: rowNumber,
        field: 'structure',
        message: 'Each row must be an object',
        severity: 'error',
      })
      rowIsValid = false
      return
    }

    // ID-Checks
    if (!row.id) {
      errors.push({
        row: rowNumber,
        field: 'id',
        message: 'ID is required',
        severity: 'error',
      })
      rowIsValid = false
    } else if (seenIds.has(row.id)) {
      duplicates++
      errors.push({
        row: rowNumber,
        field: 'id',
        message: 'Duplicate ID found',
        severity: 'error',
      })
      rowIsValid = false
    } else {
      seenIds.add(row.id)
    }

    // Entitätsspezifische Name-Validierung
    let nameField = 'name'
    let hasValidName = false

    switch (entityType) {
      case 'diagrams':
        nameField = 'title'
        hasValidName = !!(row.title && typeof row.title === 'string' && row.title.trim() !== '')
        break
      case 'persons':
        nameField = 'firstName oder lastName'
        // Validierung: firstName ODER lastName ODER name-Feld (für Export-Kompatibilität)
        hasValidName = !!(
          (row.firstName && typeof row.firstName === 'string' && row.firstName.trim() !== '') ||
          (row.lastName && typeof row.lastName === 'string' && row.lastName.trim() !== '') ||
          (row.name && typeof row.name === 'string' && row.name.trim() !== '')
        )
        break
      default:
        hasValidName = !!(row.name && typeof row.name === 'string' && row.name.trim() !== '')
        break
    }

    if (!hasValidName) {
      // Für Personen: Versuche zusätzliche Fallback-Strategien
      if (entityType === 'persons') {
        // Falls email vorhanden ist, verwende den ersten Teil als Fallback
        if (row.email && typeof row.email === 'string' && row.email.includes('@')) {
          const emailUser = row.email.split('@')[0]
          warnings.push({
            row: rowNumber,
            field: 'name',
            message: `No name found, using email username as fallback: "${emailUser}"`,
            suggestion: 'Add firstName and/or lastName',
          })
          // Akzeptiere diese Zeile trotzdem
          hasValidName = true
        }
      }

      if (!hasValidName) {
        errors.push({
          row: rowNumber,
          field: nameField,
          message: `${nameField} is required`,
          severity: 'error',
        })
        rowIsValid = false
      }
    }

    // Validierung für spezifische Entity-Types
    switch (entityType) {
      case 'diagrams':
        // Spezielle Validierung für Diagramme
        if (row.diagramJson && typeof row.diagramJson === 'string') {
          try {
            JSON.parse(row.diagramJson)
          } catch {
            warnings.push({
              row: rowNumber,
              field: 'diagramJson',
              message: 'DiagramJson contains invalid JSON',
              suggestion: 'Check the JSON syntax of the diagram',
            })
          }
        }
        break
      case 'applications':
        // Spezielle Validierung für Applications
        if (row.criticality && !['Low', 'Medium', 'High', 'Critical'].includes(row.criticality)) {
          warnings.push({
            row: rowNumber,
            field: 'criticality',
            message: 'Invalid criticality value',
            suggestion: 'Use: Low, Medium, High, Critical',
          })
        }
        break
      // Additional specific validations can be added here
    }

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
    fieldCoverage: {
      mandatoryFieldsPresent,
      mandatoryFieldsMissing,
      optionalFieldsPresent,
      optionalFieldsMissing,
      unmappedColumns,
    },
  }
}
