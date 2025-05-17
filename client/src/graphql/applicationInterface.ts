import { gql } from '@apollo/client'

export const GET_APPLICATION_INTERFACES_COUNT = gql`
  query GetApplicationInterfacesCount {
    applicationInterfacesConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_APPLICATION_INTERFACES = gql`
  query GetApplicationInterfaces {
    applicationInterfaces {
      id
      name
      description
      interfaceType
      createdAt
      updatedAt
      dataObjects {
        id
        name
      }
    }
  }
`

export const GET_APPLICATION_INTERFACE = gql`
  query GetApplicationInterface($id: ID!) {
    applicationInterface(id: $id) {
      id
      name
      description
      interfaceType
      createdAt
      updatedAt
      dataObjects {
        id
        name
      }
    }
  }
`
