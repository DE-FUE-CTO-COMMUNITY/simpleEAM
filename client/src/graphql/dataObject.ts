import { gql } from '@apollo/client'

export const GET_DATA_OBJECTS_COUNT = gql`
  query GetDataObjectsCount {
    dataObjectsConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_DATA_OBJECTS = gql`
  query GetDataObjects {
    dataObjects {
      id
      name
      description
      owners {
        id
        firstName
        lastName
      }
      classification
      source
      format
      createdAt
      updatedAt
    }
  }
`

export const GET_DATA_OBJECT = gql`
  query GetDataObject($id: ID!) {
    dataObject(id: $id) {
      id
      name
      description
      owners {
        id
        firstName
        lastName
      }
      classification
      source
      format
      createdAt
      updatedAt
      usedByApplications {
        id
        name
      }
      relatedToCapabilities {
        id
        name
      }
    }
  }
`
