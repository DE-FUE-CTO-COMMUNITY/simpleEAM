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
import { ValidationResult } from '../components/excel/types'

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
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_CAPABILITIES,
      fetchPolicy: 'cache-first',
    })

    return data.businessCapabilities?.map((cap: any) => ({
      id: cap.id,
      name: cap.name || '',
      description: cap.description || '',
      level: cap.level || '',
      status: cap.status || '',
      createdAt: formatDateForJsonExport(cap.createdAt),
      updatedAt: formatDateForJsonExport(cap.updatedAt),
      // Beziehungen als verschachtelte Objekte (nicht als ID-Strings)
      supportedByApplications: cap.supportedByApplications || [],
      ownedByOrganizations: cap.ownedByOrganizations || [],
      partOfArchitectures: cap.partOfArchitectures || [],
      depictedInDiagrams: cap.depictedInDiagrams || [],
      parents: cap.parents || [],
      children: cap.children || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Business Capabilities für JSON-Export')
  }
}

/**
 * Holt Applications für JSON-Export mit vollständigen Daten
 */
export const fetchApplicationsForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATIONS,
      fetchPolicy: 'cache-first',
    })

    return data.applications?.map((app: any) => ({
      id: app.id,
      name: app.name || '',
      description: app.description || '',
      version: app.version || '',
      status: app.status || '',
      type: app.type || '',
      criticality: app.criticality || '',
      technology: app.technology || '',
      vendor: app.vendor || '',
      license: app.license || '',
      introductionDate: formatDateForJsonExport(app.introductionDate),
      endOfLifeDate: formatDateForJsonExport(app.endOfLifeDate),
      createdAt: formatDateForJsonExport(app.createdAt),
      updatedAt: formatDateForJsonExport(app.updatedAt),
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
    }))
  } catch {
    throw new Error('Fehler beim Laden der Applications für JSON-Export')
  }
}

/**
 * Holt Data Objects für JSON-Export mit vollständigen Daten
 */
export const fetchDataObjectsForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DATA_OBJECTS,
      fetchPolicy: 'cache-first',
    })

    return data.dataObjects?.map((obj: any) => ({
      id: obj.id,
      name: obj.name || '',
      description: obj.description || '',
      type: obj.type || '',
      format: obj.format || '',
      classification: obj.classification || '',
      retentionPeriod: obj.retentionPeriod || '',
      createdAt: formatDateForJsonExport(obj.createdAt),
      updatedAt: formatDateForJsonExport(obj.updatedAt),
      // Beziehungen als verschachtelte Objekte
      usedByApplications: obj.usedByApplications || [],
      transferredByInterfaces: obj.transferredByInterfaces || [],
      ownedByOrganizations: obj.ownedByOrganizations || [],
      partOfArchitectures: obj.partOfArchitectures || [],
      depictedInDiagrams: obj.depictedInDiagrams || [],
      storedOn: obj.storedOn || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Data Objects für JSON-Export')
  }
}

/**
 * Holt Interfaces für JSON-Export mit vollständigen Daten
 */
export const fetchInterfacesForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATION_INTERFACES,
      fetchPolicy: 'cache-first',
    })

    return data.applicationInterfaces?.map((iface: any) => ({
      id: iface.id,
      name: iface.name || '',
      description: iface.description || '',
      type: iface.type || '',
      protocol: iface.protocol || '',
      frequency: iface.frequency || '',
      dataFormat: iface.dataFormat || '',
      security: iface.security || '',
      createdAt: formatDateForJsonExport(iface.createdAt),
      updatedAt: formatDateForJsonExport(iface.updatedAt),
      // Beziehungen als verschachtelte Objekte
      sourceApplication: iface.sourceApplication || null,
      targetApplications: iface.targetApplications || [],
      transfersDataObjects: iface.transfersDataObjects || [],
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
export const fetchPersonsForJson = async (client: ApolloClient<any>): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_PERSONS,
      fetchPolicy: 'cache-first',
    })

    return data.people?.map((person: any) => ({
      id: person.id,
      name: person.name || '',
      email: person.email || '',
      role: person.role || '',
      department: person.department || '',
      phone: person.phone || '',
      location: person.location || '',
      createdAt: formatDateForJsonExport(person.createdAt),
      updatedAt: formatDateForJsonExport(person.updatedAt),
      // Beziehungen als verschachtelte Objekte
      ownsApplications: person.ownsApplications || [],
      ownsDataObjects: person.ownsDataObjects || [],
      ownsCapabilities: person.ownsCapabilities || [],
      partOfArchitectures: person.partOfArchitectures || [],
      depictedInDiagrams: person.depictedInDiagrams || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Persons für JSON-Export')
  }
}

/**
 * Holt Architectures für JSON-Export mit vollständigen Daten
 */
export const fetchArchitecturesForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURES,
      fetchPolicy: 'cache-first',
    })

    return data.architectures?.map((arch: any) => ({
      id: arch.id,
      name: arch.name || '',
      description: arch.description || '',
      type: arch.type || '',
      status: arch.status || '',
      version: arch.version || '',
      createdAt: formatDateForJsonExport(arch.createdAt),
      updatedAt: formatDateForJsonExport(arch.updatedAt),
      // Beziehungen als verschachtelte Objekte
      includesApplications: arch.includesApplications || [],
      includesCapabilities: arch.includesCapabilities || [],
      includesDataObjects: arch.includesDataObjects || [],
      includesInterfaces: arch.includesInterfaces || [],
      includesPeople: arch.includesPeople || [],
      depictedInDiagrams: arch.depictedInDiagrams || [],
      includesInfrastructures: arch.includesInfrastructures || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Architectures für JSON-Export')
  }
}

/**
 * Holt Diagrams für JSON-Export mit vollständigen Daten (inklusive diagramJson)
 */
export const fetchDiagramsForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DIAGRAMS,
      fetchPolicy: 'cache-first',
    })

    return data.diagrams?.map((diagram: any) => ({
      id: diagram.id,
      name: diagram.name || '',
      description: diagram.description || '',
      type: diagram.type || '',
      version: diagram.version || '',
      status: diagram.status || '',
      createdAt: formatDateForJsonExport(diagram.createdAt),
      updatedAt: formatDateForJsonExport(diagram.updatedAt),
      diagramJson: diagram.diagramJson || '', // Vollständige Excalidraw-Daten für JSON
      // Beziehungen als verschachtelte Objekte
      depictsApplications: diagram.depictsApplications || [],
      depictsCapabilities: diagram.depictsCapabilities || [],
      depictsDataObjects: diagram.depictsDataObjects || [],
      depictsInterfaces: diagram.depictsInterfaces || [],
      depictsPeople: diagram.depictsPeople || [],
      depictsArchitectures: diagram.depictsArchitectures || [],
      depictsInfrastructures: diagram.depictsInfrastructures || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Diagrams für JSON-Export')
  }
}

/**
 * Holt Architecture Principles für JSON-Export mit vollständigen Daten
 */
export const fetchArchitecturePrinciplesForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURE_PRINCIPLES,
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
      status: principle.status || '',
      createdAt: formatDateForJsonExport(principle.createdAt),
      updatedAt: formatDateForJsonExport(principle.updatedAt),
      // Beziehungen als verschachtelte Objekte
      implementedByApplications: principle.implementedByApplications || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Architecture Principles für JSON-Export')
  }
}

/**
 * Holt Infrastructures für JSON-Export mit vollständigen Daten
 */
export const fetchInfrastructuresForJson = async (
  client: ApolloClient<any>
): Promise<JsonExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_INFRASTRUCTURES,
      fetchPolicy: 'cache-first',
    })

    return data.infrastructures?.map((infra: any) => ({
      id: infra.id,
      name: infra.name || '',
      description: infra.description || '',
      type: infra.type || '',
      status: infra.status || '',
      location: infra.location || '',
      capacity: infra.capacity || '',
      technology: infra.technology || '',
      vendor: infra.vendor || '',
      installationDate: formatDateForJsonExport(infra.installationDate),
      endOfLifeDate: formatDateForJsonExport(infra.endOfLifeDate),
      createdAt: formatDateForJsonExport(infra.createdAt),
      updatedAt: formatDateForJsonExport(infra.updatedAt),
      // Beziehungen als verschachtelte Objekte
      hostsApplications: infra.hostsApplications || [],
      storesDataObjects: infra.storesDataObjects || [],
      partOfArchitectures: infra.partOfArchitectures || [],
      depictedInDiagrams: infra.depictedInDiagrams || [],
    }))
  } catch {
    throw new Error('Fehler beim Laden der Infrastructures für JSON-Export')
  }
}

/**
 * Holt alle Daten für JSON-Export mit vollständigen Beziehungsinformationen
 */
export const fetchAllDataForJson = async (
  client: ApolloClient<any>
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
    ] = await Promise.all([
      fetchBusinessCapabilitiesForJson(client),
      fetchApplicationsForJson(client),
      fetchDataObjectsForJson(client),
      fetchInterfacesForJson(client),
      fetchPersonsForJson(client),
      fetchArchitecturesForJson(client),
      fetchDiagramsForJson(client),
      fetchArchitecturePrinciplesForJson(client),
      fetchInfrastructuresForJson(client),
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
      Infrastructures: infrastructures,
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
  entityType: JsonEntityType | 'all'
): Promise<JsonExportData[] | { [tabName: string]: JsonExportData[] }> => {
  if (entityType === 'all') {
    return await fetchAllDataForJson(client)
  }

  switch (entityType) {
    case 'businessCapabilities':
      return await fetchBusinessCapabilitiesForJson(client)
    case 'applications':
      return await fetchApplicationsForJson(client)
    case 'dataObjects':
      return await fetchDataObjectsForJson(client)
    case 'interfaces':
      return await fetchInterfacesForJson(client)
    case 'persons':
      return await fetchPersonsForJson(client)
    case 'architectures':
      return await fetchArchitecturesForJson(client)
    case 'diagrams':
      return await fetchDiagramsForJson(client)
    case 'architecturePrinciples':
      return await fetchArchitecturePrinciplesForJson(client)
    case 'infrastructures':
      return await fetchInfrastructuresForJson(client)
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
      message: 'JSON-Daten müssen ein Array sein',
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
    }
  }

  console.log(`DEBUG JSON Validation: Starting validation for ${entityType}`)
  console.log(`DEBUG JSON Validation: Data length: ${data.length}`)
  console.log(`DEBUG JSON Validation: First 2 items:`, data.slice(0, 2))

  data.forEach((row, index) => {
    const rowNumber = index + 1
    let rowIsValid = true

    // Grundlegende Struktur-Checks
    if (typeof row !== 'object' || row === null) {
      errors.push({
        row: rowNumber,
        field: 'structure',
        message: 'Jede Zeile muss ein Objekt sein',
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
        message: 'ID ist erforderlich',
        severity: 'error',
      })
      rowIsValid = false
    } else if (seenIds.has(row.id)) {
      duplicates++
      errors.push({
        row: rowNumber,
        field: 'id',
        message: 'Duplikate ID gefunden',
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
        hasValidName = !!(
          (row.firstName && typeof row.firstName === 'string' && row.firstName.trim() !== '') ||
          (row.lastName && typeof row.lastName === 'string' && row.lastName.trim() !== '')
        )
        break
      default:
        hasValidName = !!(row.name && typeof row.name === 'string' && row.name.trim() !== '')
        break
    }

    console.log(`DEBUG JSON Validation: Row ${rowNumber} - name check for ${entityType}:`, {
      nameField,
      hasValidName,
      actualValue:
        entityType === 'diagrams'
          ? row.title
          : entityType === 'persons'
            ? `${row.firstName || ''} ${row.lastName || ''}`
            : row.name,
    })

    if (!hasValidName) {
      console.log(
        `DEBUG JSON Validation: Row ${rowNumber} - NAME VALIDATION FAILED for ${entityType}`,
        row
      )
      errors.push({
        row: rowNumber,
        field: nameField,
        message: `${nameField} ist erforderlich`,
        severity: 'error',
      })
      rowIsValid = false
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
              message: 'DiagramJson enthält ungültiges JSON',
              suggestion: 'Überprüfen Sie die JSON-Syntax des Diagramms',
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
            message: 'Ungültiger Criticality-Wert',
            suggestion: 'Verwenden Sie: Low, Medium, High, Critical',
          })
        }
        break
      // Weitere spezifische Validierungen können hier hinzugefügt werden
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
  }
}
