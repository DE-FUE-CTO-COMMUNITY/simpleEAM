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

export const CREATE_APPLICATION_INTERFACE = gql`
  mutation CreateApplicationInterface($input: [ApplicationInterfaceCreateInput!]!) {
    createApplicationInterfaces(input: $input) {
      applicationInterfaces {
        id
        name
        description
        interfaceType
        dataObjects {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_APPLICATION_INTERFACE = gql`
  mutation UpdateApplicationInterface($id: ID!, $input: ApplicationInterfaceUpdateInput!) {
    updateApplicationInterfaces(where: { id: { eq: $id } }, update: $input) {
      applicationInterfaces {
        id
        name
        description
        interfaceType
        dataObjects {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_APPLICATION_INTERFACE = gql`
  mutation DeleteApplicationInterface($id: ID!) {
    deleteApplicationInterfaces(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
