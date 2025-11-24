import { ApolloClient } from '@apollo/client'
import { GET_CAPABILITIES } from '../graphql/capability'
import { GET_APPLICATIONS } from '../graphql/application'
import { GET_APPLICATION_INTERFACES } from '../graphql/applicationInterface'
import { GET_DATA_OBJECTS } from '../graphql/dataObject'
import { GET_PERSONS } from '../graphql/person'
import { GET_ARCHITECTURES } from '../graphql/architecture'
import { GET_DIAGRAMS } from '../graphql/diagram'
import { GET_ARCHITECTURE_PRINCIPLES } from '../graphql/architecturePrinciple'
import { GET_INFRASTRUCTURES } from '../graphql/infrastructure'
import { GET_Aicomponents } from '../graphql/aicomponent'

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
  | 'diagrams'
  | 'architecturePrinciples'
  | 'infrastructures'
  | 'aicomponents'
  | 'all'

// Hilfsfunktion: Company-Filter (inkl. Diagramm-OR-Sonderfall)
const companyWhere = (entityType: EntityType, companyId?: string): any | undefined => {
  if (!companyId) return undefined
  if (entityType === 'diagrams') {
    return {
      OR: [
        { company: { some: { id: { eq: companyId } } } },
        { architecture: { some: { company: { some: { id: { eq: companyId } } } } } },
      ],
    }
  }
  return { company: { some: { id: { eq: companyId } } } }
}

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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_CAPABILITIES,
      variables: { where: companyWhere('businessCapabilities', selectedCompanyId) },
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
      type: cap.type || '',
      businessValue: cap.businessValue || 0,
      sequenceNumber: cap.sequenceNumber || 0,
      introductionDate: formatDateForExport(cap.introductionDate),
      endDate: formatDateForExport(cap.endDate),
      owners: cap.owners?.map((owner: any) => owner.id).join(',') || '',
      tags: cap.tags?.join(',') || '',
      createdAt: formatDateForExport(cap.createdAt),
      updatedAt: formatDateForExport(cap.updatedAt),
      children: cap.children?.map((child: any) => child.id).join(',') || '',
      parents: cap.parents?.map((parent: any) => parent.id).join(',') || '',
      supportedByApplications:
        cap.supportedByApplications?.map((app: any) => app.id).join(',') || '',
      partOfArchitectures: cap.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      relatedDataObjects: cap.relatedDataObjects?.map((obj: any) => obj.id).join(',') || '',
      depictedInDiagrams: cap.depictedInDiagrams?.map((diag: any) => diag.id).join(',') || '',
    }))
  } catch {
    throw new Error('Error loading business capabilities für Export')
  }
}

/**
 * Holt echte Anwendungs-Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchApplicationsForExport = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATIONS,
      variables: { where: companyWhere('applications', selectedCompanyId) },
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
      timeCategory: app.timeCategory || '',
      sevenRStrategy: app.sevenRStrategy || '',
      costs: app.costs || 0,
      vendor: app.vendor || '',
      version: app.version || '',
      hostingEnvironment: app.hostingEnvironment || '',
      technologyStack: app.technologyStack?.join(',') || '',
      planningDate: formatDateForExport(app.planningDate),
      introductionDate: formatDateForExport(app.introductionDate),
      endOfUseDate: formatDateForExport(app.endOfUseDate),
      endOfLifeDate: formatDateForExport(app.endOfLifeDate),
      owners: app.owners?.map((owner: any) => owner.id).join(',') || '',
      createdAt: formatDateForExport(app.createdAt),
      updatedAt: formatDateForExport(app.updatedAt),
      supportsCapabilities: app.supportsCapabilities?.map((cap: any) => cap.id).join(',') || '',
      usesDataObjects: app.usesDataObjects?.map((obj: any) => obj.id).join(',') || '',
      sourceOfInterfaces: app.sourceOfInterfaces?.map((iface: any) => iface.id).join(',') || '',
      targetOfInterfaces: app.targetOfInterfaces?.map((iface: any) => iface.id).join(',') || '',
      partOfArchitectures: app.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      depictedInDiagrams: app.depictedInDiagrams?.map((diag: any) => diag.id).join(',') || '',
      parents: app.parents?.map((parent: any) => parent.id).join(',') || '',
      components: app.components?.map((comp: any) => comp.id).join(',') || '',
      predecessors: app.predecessors?.map((pred: any) => pred.id).join(',') || '',
      successors: app.successors?.map((succ: any) => succ.id).join(',') || '',
      implementsPrinciples: app.implementsPrinciples?.map((prin: any) => prin.id).join(',') || '',
      hostedOn: app.hostedOn?.map((infra: any) => infra.id).join(',') || '',
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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DATA_OBJECTS,
      variables: { where: companyWhere('dataObjects', selectedCompanyId) },
      fetchPolicy: 'network-only',
    })

    if (!data?.dataObjects) {
      return []
    }

    return data.dataObjects.map((obj: any) => ({
      id: obj.id,
      name: obj.name,
      description: obj.description || '',
      owners: obj.owners?.map((owner: any) => owner.id).join(',') || '',
      classification: obj.classification || '',
      format: obj.format || '',
      planningDate: formatDateForExport(obj.planningDate),
      introductionDate: formatDateForExport(obj.introductionDate),
      endOfUseDate: formatDateForExport(obj.endOfUseDate),
      endOfLifeDate: formatDateForExport(obj.endOfLifeDate),
      dataSources: obj.dataSources?.map((app: any) => app.id).join(',') || '',
      usedByApplications: obj.usedByApplications?.map((app: any) => app.id).join(',') || '',
      relatedToCapabilities: obj.relatedToCapabilities?.map((cap: any) => cap.id).join(',') || '',
      partOfArchitectures: obj.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      depictedInDiagrams: obj.depictedInDiagrams?.map((diag: any) => diag.id).join(',') || '',
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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_APPLICATION_INTERFACES,
      variables: { where: companyWhere('interfaces', selectedCompanyId) },
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
      planningDate: formatDateForExport(iface.planningDate),
      introductionDate: formatDateForExport(iface.introductionDate),
      endOfUseDate: formatDateForExport(iface.endOfUseDate),
      endOfLifeDate: formatDateForExport(iface.endOfLifeDate),
      createdAt: formatDateForExport(iface.createdAt),
      updatedAt: formatDateForExport(iface.updatedAt),
      owners: iface.owners?.map((person: any) => person.id).join(',') || '',
      sourceApplications: iface.sourceApplications?.map((app: any) => app.id).join(',') || '',
      targetApplications: iface.targetApplications?.map((app: any) => app.id).join(',') || '',
      dataObjects: iface.dataObjects?.map((obj: any) => obj.id).join(',') || '',
      predecessors: iface.predecessors?.map((pred: any) => pred.id).join(',') || '',
      successors: iface.successors?.map((succ: any) => succ.id).join(',') || '',
      partOfArchitectures: iface.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      depictedInDiagrams: iface.depictedInDiagrams?.map((diag: any) => diag.id).join(',') || '',
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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_PERSONS,
      variables: { where: companyWhere('persons', selectedCompanyId) },
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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURES,
      variables: { where: companyWhere('architectures', selectedCompanyId) },
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
      containsInterfaces: arch.containsInterfaces?.map((iface: any) => iface.id).join(',') || '',
      containsInfrastructure:
        arch.containsInfrastructure?.map((infra: any) => infra.id).join(',') || '',
      diagrams: arch.diagrams?.map((diag: any) => diag.id).join(',') || '',
      childArchitectures: arch.childArchitectures?.map((child: any) => child.id).join(',') || '',
      parentArchitecture: arch.parentArchitecture?.map((parent: any) => parent.id).join(',') || '',
      appliedPrinciples: arch.appliedPrinciples?.map((prin: any) => prin.id).join(',') || '',
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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DIAGRAMS,
      variables: { where: companyWhere('diagrams', selectedCompanyId) },
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
      containsCapabilities: diagram.containsCapabilities?.map((cap: any) => cap.id).join(',') || '',
      containsApplications: diagram.containsApplications?.map((app: any) => app.id).join(',') || '',
      containsDataObjects: diagram.containsDataObjects?.map((obj: any) => obj.id).join(',') || '',
      containsInterfaces: diagram.containsInterfaces?.map((iface: any) => iface.id).join(',') || '',
      containsInfrastructure:
        diagram.containsInfrastructure?.map((infra: any) => infra.id).join(',') || '',
    }))
  } catch {
    throw new Error('Diagramme konnten nicht geladen werden')
  }
}

/**
 * Holt echte Diagramme Daten für Excel Export OHNE Diagramminhalte
 * DiagramJson wird ausgeschlossen, da es zu groß für Excel-Zellen ist
 */
export const fetchDiagramsForExcelExport = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_DIAGRAMS,
      variables: { where: companyWhere('diagrams', selectedCompanyId) },
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
      // diagramJson is excluded from Excel export
      createdAt: formatDateForExport(diagram.createdAt),
      updatedAt: formatDateForExport(diagram.updatedAt),
      creator: diagram.creator?.map((creator: any) => creator.id).join(',') || '',
      architecture: diagram.architecture?.map((arch: any) => arch.id).join(',') || '',
      containsCapabilities: diagram.containsCapabilities?.map((cap: any) => cap.id).join(',') || '',
      containsApplications: diagram.containsApplications?.map((app: any) => app.id).join(',') || '',
      containsDataObjects: diagram.containsDataObjects?.map((obj: any) => obj.id).join(',') || '',
      containsInterfaces: diagram.containsInterfaces?.map((iface: any) => iface.id).join(',') || '',
      containsInfrastructure:
        diagram.containsInfrastructure?.map((infra: any) => infra.id).join(',') || '',
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
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_ARCHITECTURE_PRINCIPLES,
      variables: { where: companyWhere('architecturePrinciples', selectedCompanyId) },
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
 * Holt echte Infrastruktur-Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchInfrastructuresForExport = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_INFRASTRUCTURES,
      variables: { where: companyWhere('infrastructures', selectedCompanyId) },
      fetchPolicy: 'network-only',
    })

    if (!data?.infrastructures) {
      return []
    }

    return data.infrastructures.map((infra: any) => ({
      id: infra.id,
      name: infra.name,
      description: infra.description || '',
      infrastructureType: infra.infrastructureType || '',
      status: infra.status || '',
      vendor: infra.vendor || '',
      version: infra.version || '',
      capacity: infra.capacity || '',
      location: infra.location || '',
      ipAddress: infra.ipAddress || '',
      operatingSystem: infra.operatingSystem || '',
      specifications: infra.specifications || '',
      maintenanceWindow: infra.maintenanceWindow || '',
      costs: infra.costs || 0,
      planningDate: formatDateForExport(infra.planningDate),
      introductionDate: formatDateForExport(infra.introductionDate),
      endOfUseDate: formatDateForExport(infra.endOfUseDate),
      endOfLifeDate: formatDateForExport(infra.endOfLifeDate),
      owners: infra.owners?.map((owner: any) => owner.id).join(',') || '',
      parentInfrastructure: infra.parentInfrastructure?.id || '',
      childInfrastructures:
        infra.childInfrastructures?.map((child: any) => child.id).join(',') || '',
      hostsApplications: infra.hostsApplications?.map((app: any) => app.id).join(',') || '',
      partOfArchitectures: infra.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      depictedInDiagrams: infra.depictedInDiagrams?.map((diag: any) => diag.id).join(',') || '',
      createdAt: formatDateForExport(infra.createdAt),
      updatedAt: formatDateForExport(infra.updatedAt),
    }))
  } catch {
    throw new Error('Infrastruktur konnten nicht geladen werden')
  }
}

/**
 * Holt echte AI Components Daten für Excel Export
 * Verwendet GraphQL-Feldnamen als Spaltenüberschriften und IDs für Relationen
 */
export const fetchAicomponentsForExport = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<ExcelExportData[]> => {
  try {
    const { data } = await client.query({
      query: GET_Aicomponents,
      variables: { where: companyWhere('aicomponents', selectedCompanyId) },
      fetchPolicy: 'network-only',
    })

    if (!data?.aiComponents) {
      return []
    }

    return data.aiComponents.map((ai: any) => ({
      id: ai.id,
      name: ai.name,
      description: ai.description || '',
      aiType: ai.aiType || '',
      model: ai.model || '',
      version: ai.version || '',
      status: ai.status || '',
      accuracy: ai.accuracy || '',
      trainingDate: formatDateForExport(ai.trainingDate),
      lastUpdated: formatDateForExport(ai.lastUpdated),
      provider: ai.provider || '',
      license: ai.license || '',
      costs: ai.costs || '',
      tags: ai.tags?.join(',') || '',
      owners: ai.owners?.map((owner: any) => owner.id).join(',') || '',
      supportsCapabilities: ai.supportsCapabilities?.map((cap: any) => cap.id).join(',') || '',
      usedByApplications: ai.usedByApplications?.map((app: any) => app.id).join(',') || '',
      trainedWithDataObjects: ai.trainedWithDataObjects?.map((obj: any) => obj.id).join(',') || '',
      hostedOn: ai.hostedOn?.map((infra: any) => infra.id).join(',') || '',
      partOfArchitectures: ai.partOfArchitectures?.map((arch: any) => arch.id).join(',') || '',
      implementsPrinciples: ai.implementsPrinciples?.map((prin: any) => prin.id).join(',') || '',
      depictedInDiagrams: ai.depictedInDiagrams?.map((diag: any) => diag.id).join(',') || '',
      createdAt: formatDateForExport(ai.createdAt),
      updatedAt: formatDateForExport(ai.updatedAt),
    }))
  } catch {
    throw new Error('AI Components konnten nicht geladen werden')
  }
}

/**
 * Holt alle Entitäten für Admin-Export (Multi-Tab Excel)
 * Hinweis: Diagramme werden beim Excel-Export ausgeblendet, da die JSON-Daten zu groß sind
 */
export const fetchAllEntitiesForExport = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<{ [tabName: string]: ExcelExportData[] }> => {
  try {
    const [
      businessCapabilities,
      applications,
      dataObjects,
      interfaces,
      persons,
      architectures,
      diagrams, // Für JSON-Export verfügbar
      architecturePrinciples,
      infrastructures,
      aicomponents,
    ] = await Promise.all([
      fetchBusinessCapabilitiesForExport(client, selectedCompanyId),
      fetchApplicationsForExport(client, selectedCompanyId),
      fetchDataObjectsForExport(client, selectedCompanyId),
      fetchInterfacesForExport(client, selectedCompanyId),
      fetchPersonsForExport(client, selectedCompanyId),
      fetchArchitecturesForExport(client, selectedCompanyId),
      fetchDiagramsForExport(client, selectedCompanyId), // Für JSON-Export verfügbar
      fetchArchitecturePrinciplesForExport(client, selectedCompanyId),
      fetchInfrastructuresForExport(client, selectedCompanyId),
      fetchAicomponentsForExport(client, selectedCompanyId),
    ])

    return {
      'Business Capabilities': businessCapabilities,
      Applications: applications,
      'Data Objects': dataObjects,
      Interfaces: interfaces,
      Persons: persons,
      Architectures: architectures,
      Diagrams: diagrams, // Für JSON-Export verfügbar
      'Architecture Principles': architecturePrinciples,
      Infrastructures: infrastructures,
      'AI Components': aicomponents,
    }
  } catch {
    throw new Error('Fehler beim Laden der kompletten Datenbank')
  }
}

/**
 * Holt alle Entitäten für Excel-Export (mit Diagrammen ohne Inhalte)
 * Diagrams werden mit allen Metadaten aber ohne diagramJson exportiert
 */
export const fetchAllEntitiesForExcelExport = async (
  client: ApolloClient<any>,
  selectedCompanyId?: string
): Promise<{ [tabName: string]: ExcelExportData[] }> => {
  try {
    const [
      businessCapabilities,
      applications,
      dataObjects,
      interfaces,
      persons,
      architectures,
      diagrams, // Für Excel-Export ohne Inhalte
      architecturePrinciples,
      infrastructures,
      aicomponents,
    ] = await Promise.all([
      fetchBusinessCapabilitiesForExport(client, selectedCompanyId),
      fetchApplicationsForExport(client, selectedCompanyId),
      fetchDataObjectsForExport(client, selectedCompanyId),
      fetchInterfacesForExport(client, selectedCompanyId),
      fetchPersonsForExport(client, selectedCompanyId),
      fetchArchitecturesForExport(client, selectedCompanyId),
      fetchDiagramsForExcelExport(client, selectedCompanyId), // Ohne diagramJson
      fetchArchitecturePrinciplesForExport(client, selectedCompanyId),
      fetchInfrastructuresForExport(client, selectedCompanyId),
      fetchAicomponentsForExport(client, selectedCompanyId),
    ])

    return {
      'Business Capabilities': businessCapabilities,
      Applications: applications,
      'Data Objects': dataObjects,
      Interfaces: interfaces,
      Persons: persons,
      Architectures: architectures,
      Diagrams: diagrams, // Mit Metadaten aber ohne diagramJson
      'Architecture Principles': architecturePrinciples,
      Infrastructures: infrastructures,
      'AI Components': aicomponents,
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
    | 'infrastructures'
    | 'all',
  selectedCompanyId?: string
): Promise<ExcelExportData[] | { [tabName: string]: ExcelExportData[] }> => {
  switch (entityType) {
    case 'businessCapabilities':
      return fetchBusinessCapabilitiesForExport(client, selectedCompanyId)
    case 'applications':
      return fetchApplicationsForExport(client, selectedCompanyId)
    case 'dataObjects':
      return fetchDataObjectsForExport(client, selectedCompanyId)
    case 'interfaces':
      return fetchInterfacesForExport(client, selectedCompanyId)
    case 'persons':
      return fetchPersonsForExport(client, selectedCompanyId)
    case 'architectures':
      return fetchArchitecturesForExport(client, selectedCompanyId)
    case 'diagrams':
      return fetchDiagramsForExport(client, selectedCompanyId)
    case 'architecturePrinciples':
      return fetchArchitecturePrinciplesForExport(client, selectedCompanyId)
    case 'infrastructures':
      return fetchInfrastructuresForExport(client, selectedCompanyId)
    case 'all':
      return fetchAllEntitiesForExport(client, selectedCompanyId)
    default:
      throw new Error(`Unbekannter Entity-Typ: ${entityType}`)
  }
}

/**
 * Holt echte Daten basierend auf dem Entity-Typ und Export-Format
 */
export const fetchDataByEntityTypeAndFormat = async (
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
    | 'infrastructures'
    | 'aicomponents'
    | 'all',
  _format: 'xlsx' | 'csv',
  selectedCompanyId?: string
): Promise<ExcelExportData[] | { [tabName: string]: ExcelExportData[] }> => {
  switch (entityType) {
    case 'businessCapabilities':
      return fetchBusinessCapabilitiesForExport(client, selectedCompanyId)
    case 'applications':
      return fetchApplicationsForExport(client, selectedCompanyId)
    case 'dataObjects':
      return fetchDataObjectsForExport(client, selectedCompanyId)
    case 'interfaces':
      return fetchInterfacesForExport(client, selectedCompanyId)
    case 'persons':
      return fetchPersonsForExport(client, selectedCompanyId)
    case 'architectures':
      return fetchArchitecturesForExport(client, selectedCompanyId)
    case 'diagrams':
      return fetchDiagramsForExcelExport(client, selectedCompanyId)
    case 'architecturePrinciples':
      return fetchArchitecturePrinciplesForExport(client, selectedCompanyId)
    case 'infrastructures':
      return fetchInfrastructuresForExport(client, selectedCompanyId)
    case 'aicomponents':
      return fetchAicomponentsForExport(client, selectedCompanyId)
    case 'all':
      return fetchAllEntitiesForExcelExport(client, selectedCompanyId)
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
  type: '',
  businessValue: 0,
  sequenceNumber: 0,
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  owners: '', // Komma-getrennte IDs
  tags: '', // Komma-getrennte Tags
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  children: '', // Komma-getrennte Child-IDs
  parents: '', // Komma-getrennte Parent-IDs
  supportedByApplications: '', // Komma-getrennte Application-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  relatedDataObjects: '', // Komma-getrennte DataObject-IDs
  depictedInDiagrams: '', // Komma-getrennte Diagram-IDs
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
  timeCategory: '',
  sevenRStrategy: '',
  costs: 0,
  vendor: '',
  version: '',
  hostingEnvironment: '',
  technologyStack: '', // Komma-getrennte Technologien
  planningDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfUseDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  owners: '', // Komma-getrennte Owner-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  supportsCapabilities: '', // Komma-getrennte Capability-IDs
  usesDataObjects: '', // Komma-getrennte DataObject-IDs
  sourceOfInterfaces: '', // Komma-getrennte Interface-IDs
  targetOfInterfaces: '', // Komma-getrennte Interface-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  depictedInDiagrams: '', // Komma-getrennte Diagram-IDs
  parents: '', // Komma-getrennte Parent-IDs
  components: '', // Komma-getrennte Component-IDs
  predecessors: '', // Komma-getrennte Predecessor-IDs
  successors: '', // Komma-getrennte Successor-IDs
  implementsPrinciples: '', // Komma-getrennte Principle-IDs
  hostedOn: '', // Komma-getrennte Infrastructure-IDs
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Data Objects
 */
export const getDataObjectsTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  owners: '', // Komma-getrennte Owner-IDs
  classification: '', // DataClassification enum: PUBLIC, INTERNAL, CONFIDENTIAL, STRICTLY_CONFIDENTIAL
  format: '',
  planningDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfUseDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  dataSources: '', // Komma-getrennte Application-IDs
  usedByApplications: '', // Komma-getrennte Application-IDs
  relatedToCapabilities: '', // Komma-getrennte Capability-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  depictedInDiagrams: '', // Komma-getrennte Diagram-IDs
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
  planningDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfUseDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  owners: '', // Person-ID
  sourceApplications: '', // Komma-getrennte Application-IDs
  targetApplications: '', // Komma-getrennte Application-IDs
  dataObjects: '', // Komma-getrennte DataObject-IDs
  predecessors: '', // Komma-getrennte Predecessor-IDs
  successors: '', // Komma-getrennte Successor-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  depictedInDiagrams: '', // Komma-getrennte Diagram-IDs
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
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  owners: '', // Komma-getrennte Owner-IDs
  containsApplications: '', // Komma-getrennte Application-IDs
  containsCapabilities: '', // Komma-getrennte Capability-IDs
  containsDataObjects: '', // Komma-getrennte DataObject-IDs
  containsInterfaces: '', // Komma-getrennte Interface-IDs
  containsInfrastructure: '', // Komma-getrennte Infrastructure-IDs
  diagrams: '', // Komma-getrennte Diagram-IDs
  childArchitectures: '', // Komma-getrennte Architecture-IDs
  parentArchitecture: '', // Komma-getrennte Parent Architecture-IDs
  appliedPrinciples: '', // Komma-getrennte Principle-IDs
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
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  creator: '', // Komma-getrennte Creator-IDs (Person)
  architecture: '', // Komma-getrennte Architecture-IDs
  containsCapabilities: '', // Komma-getrennte Capability-IDs
  containsApplications: '', // Komma-getrennte Application-IDs
  containsDataObjects: '', // Komma-getrennte DataObject-IDs
  containsInterfaces: '', // Komma-getrennte Interface-IDs
  containsInfrastructure: '', // Komma-getrennte Infrastructure-IDs
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Diagramme (Excel-Export ohne Inhalte)
 */
export const getDiagramsForExcelTemplate = (): ExcelExportData => ({
  id: '',
  title: '',
  description: '',
  diagramType: '', // APPLICATION_LANDSCAPE, ARCHITECTURE, CAPABILITY_MAP, CONCEPTUAL, DATA_FLOW, INTEGRATION_ARCHITECTURE, NETWORK, OTHER, PROCESS, SECURITY_ARCHITECTURE
  // diagramJson is excluded from Excel export
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  creator: '', // Komma-getrennte Creator-IDs (Person)
  architecture: '', // Komma-getrennte Architecture-IDs
  containsCapabilities: '', // Komma-getrennte Capability-IDs
  containsApplications: '', // Komma-getrennte Application-IDs
  containsDataObjects: '', // Komma-getrennte DataObject-IDs
  containsInterfaces: '', // Komma-getrennte Interface-IDs
  containsInfrastructure: '', // Komma-getrennte Infrastructure-IDs
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
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für Infrastruktur
 */
export const getInfrastructuresTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  infrastructureType: '', // PHYSICAL_SERVER, VIRTUAL_SERVER, CLOUD_SERVICE, NETWORK_COMPONENT, STORAGE, DATABASE, OTHER
  status: '', // ACTIVE, INACTIVE, PLANNED, DECOMMISSIONED
  vendor: '',
  version: '',
  capacity: '', // Numerischer Wert
  location: '',
  ipAddress: '',
  operatingSystem: '',
  specifications: '',
  maintenanceWindow: '',
  costs: '', // Numerischer Wert
  planningDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  introductionDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfUseDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  endOfLifeDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  owners: '', // Komma-getrennte Owner-IDs (Person)
  parentInfrastructure: '', // Parent Infrastructure-ID
  childInfrastructures: '', // Komma-getrennte Child Infrastructure-IDs
  hostsApplications: '', // Komma-getrennte Application-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  depictedInDiagrams: '', // Komma-getrennte Diagram-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Erstellt Template-Daten mit echten GraphQL-Feldnamen für AI Components
 */
export const getAicomponentsTemplate = (): ExcelExportData => ({
  id: '',
  name: '',
  description: '',
  aiType: '',
  model: '',
  version: '',
  status: '',
  accuracy: '',
  trainingDate: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  lastUpdated: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  provider: '',
  license: '',
  costs: '',
  tags: '', // Komma-getrennte Tags
  owners: '', // Komma-getrennte Owner-IDs (Person)
  supportsCapabilities: '', // Komma-getrennte Capability-IDs
  usedByApplications: '', // Komma-getrennte Application-IDs
  trainedWithDataObjects: '', // Komma-getrennte DataObject-IDs
  hostedOn: '', // Komma-getrennte Infrastructure-IDs
  partOfArchitectures: '', // Komma-getrennte Architecture-IDs
  implementsPrinciples: '', // Komma-getrennte Principle-IDs
  depictedInDiagrams: '', // Komma-getrennte Diagram-IDs
  createdAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
  updatedAt: '', // ISO-Format: 2024-01-01T12:00:00.000Z
})

/**
 * Holt Template-Daten basierend auf dem Entity-Typ mit echten GraphQL-Feldnamen
 */
export const getTemplateByEntityType = (
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams' // Für JSON-Import verfügbar
    | 'architecturePrinciples'
    | 'infrastructures'
    | 'aicomponents'
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
    case 'diagrams':
      return getDiagramsTemplate()
    case 'architectures':
      return getArchitecturesTemplate()
    case 'architecturePrinciples':
      return getArchitecturePrinciplesTemplate()
    case 'infrastructures':
      return getInfrastructuresTemplate()
    case 'aicomponents':
      return getAicomponentsTemplate()
    default:
      throw new Error(`Unbekannter Entity-Typ: ${entityType}`)
  }
}

/**
 * Holt Template-Daten basierend auf dem Entity-Typ und Export-Format
 */
export const getTemplateByEntityTypeAndFormat = (
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams'
    | 'architecturePrinciples'
    | 'infrastructures'
    | 'aicomponents',
  format: 'xlsx' | 'csv' | 'json'
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
    case 'diagrams':
      // Für Excel und CSV ohne diagramJson, für JSON mit diagramJson
      return format === 'json' ? getDiagramsTemplate() : getDiagramsForExcelTemplate()
    case 'architectures':
      return getArchitecturesTemplate()
    case 'architecturePrinciples':
      return getArchitecturePrinciplesTemplate()
    case 'infrastructures':
      return getInfrastructuresTemplate()
    case 'aicomponents':
      return getAicomponentsTemplate()
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
    | 'infrastructures'
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
      Diagrams: Object.keys(getDiagramsTemplate()), // Vollständig für JSON-Export
      'Architecture Principles': Object.keys(getArchitecturePrinciplesTemplate()),
      Infrastructures: Object.keys(getInfrastructuresTemplate()),
    }
  }

  const template = getTemplateByEntityType(entityType as Exclude<typeof entityType, 'all'>)
  return Object.keys(template)
}

/**
 * Holt die Feldnamen für die Export-Vorschau basierend auf Format
 */
export const getFieldNamesByEntityTypeAndFormat = (
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams'
    | 'architecturePrinciples'
    | 'infrastructures'
    | 'all',
  format: 'xlsx' | 'csv' | 'json'
): string[] | { [tabName: string]: string[] } => {
  if (entityType === 'all') {
    return {
      'Business Capabilities': Object.keys(getBusinessCapabilitiesTemplate()),
      Applications: Object.keys(getApplicationsTemplate()),
      'Data Objects': Object.keys(getDataObjectsTemplate()),
      Interfaces: Object.keys(getInterfacesTemplate()),
      Persons: Object.keys(getPersonsTemplate()),
      Architectures: Object.keys(getArchitecturesTemplate()),
      // Für Excel ohne diagramJson, für JSON mit diagramJson
      Diagrams:
        format === 'json'
          ? Object.keys(getDiagramsTemplate())
          : Object.keys(getDiagramsForExcelTemplate()),
      'Architecture Principles': Object.keys(getArchitecturePrinciplesTemplate()),
      Infrastructures: Object.keys(getInfrastructuresTemplate()),
    }
  }

  const template = getTemplateByEntityTypeAndFormat(
    entityType as Exclude<typeof entityType, 'all'>,
    format
  )
  return Object.keys(template)
}

export interface FieldCoverage {
  mandatoryFieldsPresent: string[]
  mandatoryFieldsMissing: string[]
  optionalFieldsPresent: string[]
  optionalFieldsMissing: string[]
  unmappedColumns: string[]
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
  fieldCoverage?: FieldCoverage
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
    | 'diagrams'
    | 'architecturePrinciples'
    | 'infrastructures'
): ValidationResult => {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  let validRows = 0

  const requiredFields = getRequiredFieldsByEntityType(entityType)
  const optionalFields = getOptionalFieldsByEntityType(entityType)
  const allValidFields = ['id', ...requiredFields, ...optionalFields]

  // Analyze field coverage from the first row (assuming all rows have same structure)
  const fileColumns = data.length > 0 ? Object.keys(data[0]) : []
  const mandatoryFieldsPresent = requiredFields.filter(field => fileColumns.includes(field))
  const mandatoryFieldsMissing = requiredFields.filter(field => !fileColumns.includes(field))
  const optionalFieldsPresent = optionalFields.filter(field => fileColumns.includes(field))
  const optionalFieldsMissing = optionalFields.filter(field => !fileColumns.includes(field))
  const unmappedColumns = fileColumns.filter(col => !allValidFields.includes(col))

  data.forEach((row, index) => {
    const rowNumber = index + 2 // Excel row numbers start at 1, plus header row
    let rowIsValid = true

    // Prüfe erforderliche Felder
    requiredFields.forEach((field: string) => {
      if (!row[field] || (typeof row[field] === 'string' && row[field].trim() === '')) {
        errors.push({
          row: rowNumber,
          field,
          message: `Required field '${field}' is empty`,
          severity: 'error',
        })
        rowIsValid = false
      }
    })

    // Check unknown fields
    Object.keys(row).forEach(field => {
      if (!allValidFields.includes(field)) {
        warnings.push({
          row: rowNumber,
          field,
          message: `Unknown field '${field}' will be ignored`,
          suggestion: `Valid fields: ${allValidFields.join(', ')}`,
        })
      }
    })

    // Prüfe ID-Format (falls vorhanden)
    if (row.id && !/^[a-zA-Z0-9-_]+$/.test(row.id)) {
      warnings.push({
        row: rowNumber,
        field: 'id',
        message: 'ID contains invalid characters',
        suggestion: 'Use only letters, numbers, hyphens and underscores',
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
            message: 'Invalid date format',
            suggestion: 'Use ISO format: 2024-01-01T12:00:00.000Z',
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
      duplicates: 0, // ID duplicates are no longer checked
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
          owners: 'user-123',
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
      return ['name']
    case 'applications':
      return ['name', 'status']
    case 'interfaces':
      return ['name', 'interfaceType', 'status']
    case 'dataObjects':
      return ['name']
    case 'persons':
      return ['firstName', 'lastName']
    case 'architectures':
      return ['name', 'domain', 'type', 'timestamp']
    case 'diagrams':
      return ['title'] // Diagramme verwenden 'title' anstatt 'name'
    case 'architecturePrinciples':
      return ['name', 'category', 'priority']
    case 'infrastructures':
      return ['name', 'infrastructureType', 'status']
    case 'aicomponents':
      return ['name']
    default:
      return ['name']
  }
}

export function getOptionalFieldsByEntityType(entityType: EntityType): string[] {
  switch (entityType) {
    case 'businessCapabilities':
      return [
        'description',
        'maturityLevel',
        'status',
        'type',
        'businessValue',
        'sequenceNumber',
        'introductionDate',
        'endDate',
        'owners',
        'tags',
        'children',
        'parents',
        'supportedByApplications',
        'partOfArchitectures',
        'relatedDataObjects',
        'depictedInDiagrams',
        'createdAt',
        'updatedAt',
      ]
    case 'applications':
      return [
        'description',
        'criticality',
        'timeCategory',
        'sevenRStrategy',
        'costs',
        'vendor',
        'version',
        'hostingEnvironment',
        'technologyStack',
        'planningDate',
        'introductionDate',
        'endOfUseDate',
        'endOfLifeDate',
        'owners',
        'supportsCapabilities',
        'usesDataObjects',
        'sourceOfInterfaces',
        'targetOfInterfaces',
        'partOfArchitectures',
        'depictedInDiagrams',
        'parents',
        'components',
        'predecessors',
        'successors',
        'implementsPrinciples',
        'hostedOn',
        'createdAt',
        'updatedAt',
      ]
    case 'interfaces':
      return [
        'description',
        'protocol',
        'version',
        'planningDate',
        'introductionDate',
        'endOfUseDate',
        'endOfLifeDate',
        'owners',
        'sourceApplications',
        'targetApplications',
        'dataObjects',
        'predecessors',
        'successors',
        'partOfArchitectures',
        'depictedInDiagrams',
        'createdAt',
        'updatedAt',
      ]
    case 'dataObjects':
      return [
        'description',
        'classification',
        'format',
        'planningDate',
        'introductionDate',
        'endOfUseDate',
        'endOfLifeDate',
        'owners',
        'dataSources',
        'usedByApplications',
        'relatedToCapabilities',
        'transferredInInterfaces',
        'partOfArchitectures',
        'depictedInDiagrams',
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
        'containsInterfaces',
        'containsInfrastructure',
        'diagrams',
        'childArchitectures',
        'parentArchitecture',
        'appliedPrinciples',
        'createdAt',
        'updatedAt',
      ]
    case 'diagrams':
      return [
        'description',
        'diagramType',
        'creator',
        'architecture',
        'containsCapabilities',
        'containsApplications',
        'containsDataObjects',
        'containsInterfaces',
        'containsInfrastructure',
        'createdAt',
        'updatedAt',
      ]
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
    case 'infrastructures':
      return [
        'description',
        'vendor',
        'version',
        'capacity',
        'location',
        'ipAddress',
        'operatingSystem',
        'specifications',
        'maintenanceWindow',
        'costs',
        'planningDate',
        'introductionDate',
        'endOfUseDate',
        'endOfLifeDate',
        'owners',
        'parentInfrastructure',
        'childInfrastructures',
        'hostsApplications',
        'partOfArchitectures',
        'depictedInDiagrams',
        'createdAt',
        'updatedAt',
      ]
    case 'aicomponents':
      return [
        'description',
        'aiType',
        'model',
        'version',
        'status',
        'accuracy',
        'trainingDate',
        'lastUpdated',
        'provider',
        'license',
        'costs',
        'tags',
        'owners',
        'supportsCapabilities',
        'usedByApplications',
        'trainedWithDataObjects',
        'hostedOn',
        'partOfArchitectures',
        'implementsPrinciples',
        'depictedInDiagrams',
        'createdAt',
        'updatedAt',
      ]
    default:
      return ['description', 'createdAt', 'updatedAt']
  }
}

/**
 * Erstellt Template für Diagramme (für JSON-Import)
 */
export const getDiagramTemplate = (): ExcelExportData => {
  return {
    id: '',
    name: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    creator: '',
    architecture: '',
    diagramData: '',
  }
}
