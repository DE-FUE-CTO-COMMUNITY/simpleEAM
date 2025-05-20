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

export const CREATE_DATA_OBJECT = gql`
  mutation CreateDataObject($input: [DataObjectCreateInput!]!) {
    createDataObjects(input: $input) {
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
  }
`

export const UPDATE_DATA_OBJECT = gql`
  mutation UpdateDataObject($id: ID!, $input: DataObjectUpdateInput!) {
    updateDataObjects(where: { id: { eq: $id } }, update: $input) {
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
  }
`

export const DELETE_DATA_OBJECT = gql`
  mutation DeleteDataObject($id: ID!) {
    deleteDataObjects(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
