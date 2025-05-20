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
  mutation CreateDataObject(
    $name: String!
    $description: String
    $classification: DataClassification!
    $format: String
    $source: String
    $ownerId: ID
  ) {
    createDataObject(
      data: {
        name: $name
        description: $description
        classification: $classification
        format: $format
        source: $source
        ownerId: $ownerId
      }
    ) {
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

export const UPDATE_DATA_OBJECT = gql`
  mutation UpdateDataObject(
    $id: ID!
    $name: String!
    $description: String
    $classification: DataClassification!
    $format: String
    $source: String
    $ownerId: ID
  ) {
    updateDataObject(
      id: $id
      data: {
        name: $name
        description: $description
        classification: $classification
        format: $format
        source: $source
        ownerId: $ownerId
      }
    ) {
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
