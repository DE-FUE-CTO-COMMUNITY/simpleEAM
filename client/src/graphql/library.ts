import { gql } from '@apollo/client'

// Query für alle Architektur-Elemente in der Bibliothek
export const GET_LIBRARY_ELEMENTS = gql`
  query GetLibraryElements(
    $capWhere: BusinessCapabilityWhere
    $appWhere: ApplicationWhere
    $dataWhere: DataObjectWhere
    $ifaceWhere: ApplicationInterfaceWhere
    $infraWhere: InfrastructureWhere
    $aiWhere: AIComponentWhere
  ) {
    businessCapabilities(where: $capWhere) {
      id
      name
      description
      status
      maturityLevel
      businessValue
      parents {
        id
        name
      }
    }
    applications(where: $appWhere) {
      id
      name
      description
      status
      criticality
      vendor
      version
    }
    dataObjects(where: $dataWhere) {
      id
      name
      description
      classification
      dataSources {
        id
        name
      }
      format
    }
    applicationInterfaces(where: $ifaceWhere) {
      id
      name
      description
      interfaceType
    }
    infrastructures(where: $infraWhere) {
      id
      name
      description
      infrastructureType
      status
      vendor
      version
      location
    }
    aiComponents(where: $aiWhere) {
      id
      name
      description
      aiType
      model
      version
      provider
      status
      company {
        id
        name
      }
    }
  }
`

// Typen für die GraphQL-Responses
export interface LibraryCapability {
  id: string
  name: string
  description?: string
  status?: string
  maturityLevel?: number
  businessValue?: string
  parents?: Array<{
    id: string
    name: string
  }>
}

export interface LibraryApplication {
  id: string
  name: string
  description?: string
  status?: string
  criticality?: string
  vendor?: string
  version?: string
}

export interface LibraryDataObject {
  id: string
  name: string
  description?: string
  classification?: string
  dataSources?: Array<{
    id: string
    name: string
  }>
  format?: string
}

export interface LibraryInterface {
  id: string
  name: string
  description?: string
  interfaceType?: string
}

export interface LibraryInfrastructure {
  id: string
  name: string
  description?: string
  infrastructureType?: string
  status?: string
  vendor?: string
  version?: string
  location?: string
}

export interface LibraryAiComponent {
  id: string
  name: string
  description?: string
  aiType?: string
  model?: string
  version?: string
  provider?: string
  status?: string
  company?: {
    id: string
    name: string
  }
}

export interface LibraryElementsResponse {
  businessCapabilities: LibraryCapability[]
  applications: LibraryApplication[]
  dataObjects: LibraryDataObject[]
  applicationInterfaces: LibraryInterface[]
  infrastructures: LibraryInfrastructure[]
  aiComponents: LibraryAiComponent[]
}

export type LibraryElement =
  | LibraryCapability
  | LibraryApplication
  | LibraryDataObject
  | LibraryInterface
  | LibraryInfrastructure
  | LibraryAiComponent

export const ELEMENT_TYPE_CONFIG = {
  businessCapability: {
    label: 'Business Capabilities',
    color: '#f0e68c',
    iconType: 'rounded-rectangle',
  },
  application: {
    label: 'Applications',
    color: '#a5d8ff',
    iconType: 'rectangle',
  },
  dataObject: {
    label: 'Data Objects',
    color: '#a5d8ff',
    iconType: 'rounded-rectangle',
  },
  interface: {
    label: 'Interfaces',
    color: '#a5d8ff',
    iconType: 'rectangle',
  },
  applicationInterface: {
    label: 'Application Interfaces',
    color: '#a5d8ff',
    iconType: 'rectangle',
  },
  infrastructure: {
    label: 'Infrastruktur',
    color: '#2f9e44',
    iconType: 'cube',
  },
  aiComponent: {
    label: 'AI Components',
    color: '#e6ccff',
    iconType: 'ai-brain',
  },
} as const

export type ElementType = keyof typeof ELEMENT_TYPE_CONFIG
