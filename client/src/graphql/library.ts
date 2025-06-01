import { gql } from '@apollo/client'

// Query für alle Architektur-Elemente in der Bibliothek
export const GET_LIBRARY_ELEMENTS = gql`
  query GetLibraryElements {
    businessCapabilities {
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
    applications {
      id
      name
      description
      status
      criticality
      vendor
      version
    }
    dataObjects {
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
    applicationInterfaces {
      id
      name
      description
      interfaceType
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

export interface LibraryElementsResponse {
  businessCapabilities: LibraryCapability[]
  applications: LibraryApplication[]
  dataObjects: LibraryDataObject[]
  applicationInterfaces: LibraryInterface[]
}

export type LibraryElement =
  | LibraryCapability
  | LibraryApplication
  | LibraryDataObject
  | LibraryInterface

export const ELEMENT_TYPE_CONFIG = {
  capability: {
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
    color: '#ffec99',
    iconType: 'rounded-rectangle',
  },
  interface: {
    label: 'Interfaces',
    color: '#a5d8ff',
    iconType: 'rectangle',
  },
} as const

export type ElementType = keyof typeof ELEMENT_TYPE_CONFIG
