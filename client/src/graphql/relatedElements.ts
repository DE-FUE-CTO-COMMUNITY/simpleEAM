import { gql } from '@apollo/client'

/**
 * Query zum Laden verwandter Elemente für ein bestimmtes Element
 * Diese Query lädt abhängig vom Elementtyp die entsprechenden verwandten Elemente
 */

// Query für verwandte Elemente einer Business Capability
export const GET_RELATED_ELEMENTS_FOR_CAPABILITY = gql`
  query GetRelatedElementsForCapability($id: ID!) {
    businessCapabilities(where: { id: { eq: $id } }) {
      id
      name
      description
      status
      type
      # Direkt verwandte Elemente
      supportedByApplications {
        id
        name
        description
        status
        criticality
      }
      relatedDataObjects {
        id
        name
        description
        classification
      }
      parents {
        id
        name
        description
        status
        type
      }
      children {
        id
        name
        description
        status
        type
      }
    }
  }
`

// Query für verwandte Elemente einer Application
export const GET_RELATED_ELEMENTS_FOR_APPLICATION = gql`
  query GetRelatedElementsForApplication($id: ID!) {
    applications(where: { id: { eq: $id } }) {
      id
      name
      description
      status
      criticality
      # Direkt verwandte Elemente
      supportsCapabilities {
        id
        name
        description
        status
        type
        maturityLevel
        businessValue
      }
      usesDataObjects {
        id
        name
        description
        classification
      }
      sourceOfInterfaces {
        id
        name
        description
        interfaceType
      }
      targetOfInterfaces {
        id
        name
        description
        interfaceType
      }
      hostedOn {
        id
        name
        description
        infrastructureType
        status
      }
    }
  }
`

// Query für verwandte Elemente eines DataObjects
export const GET_RELATED_ELEMENTS_FOR_DATA_OBJECT = gql`
  query GetRelatedElementsForDataObject($id: ID!) {
    dataObjects(where: { id: { eq: $id } }) {
      id
      name
      description
      classification
      # Direkt verwandte Elemente
      dataSources {
        id
        name
        description
        status
        criticality
      }
      usedByApplications {
        id
        name
        description
        status
        criticality
      }
      relatedToCapabilities {
        id
        name
        description
        status
        type
        maturityLevel
        businessValue
      }
      transferredInInterfaces {
        id
        name
        description
        interfaceType
      }
    }
  }
`

// Query für verwandte Elemente einer Application Interface
export const GET_RELATED_ELEMENTS_FOR_INTERFACE = gql`
  query GetRelatedElementsForInterface($id: ID!) {
    applicationInterfaces(where: { id: { eq: $id } }) {
      id
      name
      description
      interfaceType
      # Direkt verwandte Elemente
      sourceApplications {
        id
        name
        description
        status
        criticality
      }
      targetApplications {
        id
        name
        description
        status
        criticality
      }
      dataObjects {
        id
        name
        description
        classification
      }
    }
  }
`

// Query für verwandte Elemente einer Infrastructure
export const GET_RELATED_ELEMENTS_FOR_INFRASTRUCTURE = gql`
  query GetRelatedElementsForInfrastructure($id: ID!) {
    infrastructures(where: { id: { eq: $id } }) {
      id
      name
      description
      infrastructureType
      status
      # Direkt verwandte Elemente
      hostsApplications {
        id
        name
        description
        status
        criticality
      }
    }
  }
`

// Union-Type für verwandte Elemente Response
export interface RelatedElement {
  id: string
  name: string
  description?: string
  elementType: 'businessCapability' | 'application' | 'dataObject' | 'interface' | 'infrastructure'
  // Element-spezifische Eigenschaften
  status?: string
  criticality?: string
  type?: string
  maturityLevel?: number
  businessValue?: number
  classification?: string
  interfaceType?: string
  infrastructureType?: string
}

export interface RelatedElementsResponse {
  elements: RelatedElement[]
  relationshipTypes: string[]
  totalElements: number
}
