import { gql } from '@apollo/client'
import { ElementType } from './relationshipValidation'

// GraphQL-Queries zum Laden verwandter Elemente für jeden Typ

export const GET_BUSINESS_CAPABILITY_RELATIONSHIPS = gql`
  query GetBusinessCapabilityRelationships($id: ID!) {
    businessCapability(id: $id) {
      id
      name
      displayText
      # Outgoing relationships
      relatedDataObjects {
        id
        name
        displayText
      }
      parents {
        id
        name
        displayText
      }
      # Incoming relationships
      supportedByApplications {
        id
        name
        displayText
      }
    }
  }
`

export const GET_APPLICATION_RELATIONSHIPS = gql`
  query GetApplicationRelationships($id: ID!) {
    application(id: $id) {
      id
      name
      displayText
      # Outgoing relationships
      supportsCapabilities {
        id
        name
        displayText
      }
      usesDataObjects {
        id
        name
        displayText
      }
      sourceOfInterfaces {
        id
        name
        displayText
      }
      targetOfInterfaces {
        id
        name
        displayText
      }
      hostedOn {
        id
        name
        displayText
      }
      parents {
        id
        name
        displayText
      }
      predecessors {
        id
        name
        displayText
      }
    }
  }
`

export const GET_DATA_OBJECT_RELATIONSHIPS = gql`
  query GetDataObjectRelationships($id: ID!) {
    dataObject(id: $id) {
      id
      name
      displayText
      # Outgoing relationships
      dataSources {
        id
        name
        displayText
      }
      # Incoming relationships
      transferredInInterfaces {
        id
        name
        displayText
      }
      relatedToCapabilities {
        id
        name
        displayText
      }
      usedByApplications {
        id
        name
        displayText
      }
    }
  }
`

export const GET_APPLICATION_INTERFACE_RELATIONSHIPS = gql`
  query GetApplicationInterfaceRelationships($id: ID!) {
    applicationInterface(id: $id) {
      id
      name
      displayText
      # Outgoing relationships
      dataObjects {
        id
        name
        displayText
      }
      predecessors {
        id
        name
        displayText
      }
      # Incoming relationships
      sourceApplications {
        id
        name
        displayText
      }
      targetApplications {
        id
        name
        displayText
      }
    }
  }
`

export const GET_INFRASTRUCTURE_RELATIONSHIPS = gql`
  query GetInfrastructureRelationships($id: ID!) {
    infrastructure(id: $id) {
      id
      name
      displayText
      # Outgoing relationships
      parentInfrastructure {
        id
        name
        displayText
      }
      # Incoming relationships
      hostsApplications {
        id
        name
        displayText
      }
    }
  }
`

// Union-Typ für alle möglichen verwandten Elemente
export interface RelatedElement {
  id: string
  name: string
  displayText: string
  elementType: ElementType
  relationshipType: string
  direction: 'IN' | 'OUT'
  reverseArrow: boolean
}

// Mapping from ElementType zu GraphQL-Query
export const RELATIONSHIP_QUERIES = {
  businessCapability: GET_BUSINESS_CAPABILITY_RELATIONSHIPS,
  application: GET_APPLICATION_RELATIONSHIPS,
  dataObject: GET_DATA_OBJECT_RELATIONSHIPS,
  applicationInterface: GET_APPLICATION_INTERFACE_RELATIONSHIPS,
  infrastructure: GET_INFRASTRUCTURE_RELATIONSHIPS,
} as const

/**
 * Konvertiert GraphQL-Antworten zu RelatedElement-Objekten
 */
export const transformGraphQLResponse = (
  data: any,
  elementType: ElementType,
  elementId: string
): RelatedElement[] => {
  const relatedElements: RelatedElement[] = []

  if (!data || !data[elementType]) {
    return relatedElements
  }

  const element = data[elementType]

  // Hilfsfunktion zum Hinzufügen von verwandten Elementen
  const addRelatedElements = (
    items: any[],
    targetType: ElementType,
    relationshipType: string,
    direction: 'IN' | 'OUT',
    reverseArrow: boolean
  ) => {
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        if (item && item.id && item.id !== elementId) {
          // Selbst-Referenzen ausschließen
          relatedElements.push({
            id: item.id,
            name: item.name || '',
            displayText: item.displayText || item.name || '',
            elementType: targetType,
            relationshipType,
            direction,
            reverseArrow,
          })
        }
      })
    }
  }

  // Spezifische Mappings für jeden Elementtyp
  switch (elementType) {
    case 'businessCapability':
      addRelatedElements(element.relatedDataObjects, 'dataObject', 'RELATED_TO', 'OUT', false)
      addRelatedElements(element.parents, 'businessCapability', 'HAS_PARENT', 'OUT', false)
      addRelatedElements(element.supportedByApplications, 'application', 'SUPPORTS', 'IN', true)
      break

    case 'application':
      addRelatedElements(
        element.supportsCapabilities,
        'businessCapability',
        'SUPPORTS',
        'OUT',
        true
      )
      addRelatedElements(element.usesDataObjects, 'dataObject', 'USES', 'OUT', false)
      addRelatedElements(
        element.sourceOfInterfaces,
        'applicationInterface',
        'INTERFACE_SOURCE',
        'OUT',
        false
      )
      addRelatedElements(
        element.targetOfInterfaces,
        'applicationInterface',
        'INTERFACE_TARGET',
        'OUT',
        true
      )
      addRelatedElements(element.hostedOn, 'infrastructure', 'HOSTED_ON', 'OUT', false)
      addRelatedElements(element.parents, 'application', 'HAS_PARENT_APPLICATION', 'OUT', false)
      addRelatedElements(element.predecessors, 'application', 'SUCCESSOR_OF', 'OUT', false)
      break

    case 'dataObject':
      addRelatedElements(element.dataSources, 'application', 'DATA_SOURCE', 'OUT', false)
      addRelatedElements(
        element.transferredInInterfaces,
        'applicationInterface',
        'TRANSFERS',
        'IN',
        true
      )
      addRelatedElements(
        element.relatedToCapabilities,
        'businessCapability',
        'RELATED_TO',
        'IN',
        false
      )
      addRelatedElements(element.usedByApplications, 'application', 'USES', 'IN', false)
      break

    case 'applicationInterface':
      addRelatedElements(element.dataObjects, 'dataObject', 'TRANSFERS', 'OUT', true)
      addRelatedElements(
        element.predecessors,
        'applicationInterface',
        'SUCCESSOR_OF_INTERFACE',
        'OUT',
        false
      )
      addRelatedElements(element.sourceApplications, 'application', 'INTERFACE_SOURCE', 'IN', false)
      addRelatedElements(element.targetApplications, 'application', 'INTERFACE_TARGET', 'IN', true)
      break

    case 'infrastructure':
      addRelatedElements(
        element.parentInfrastructure ? [element.parentInfrastructure] : [],
        'infrastructure',
        'HAS_PARENT_INFRASTRUCTURE',
        'OUT',
        false
      )
      addRelatedElements(element.hostsApplications, 'application', 'HOSTED_ON', 'IN', false)
      break
  }

  return relatedElements
}
