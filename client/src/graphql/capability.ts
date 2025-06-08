import { gql } from '@apollo/client'

export const GET_CAPABILITIES_COUNT = gql`
  query GetBusinessCapabilitiesCount {
    businessCapabilitiesConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_CAPABILITIES = gql`
  query GetCapabilities {
    businessCapabilities {
      id
      name
      description
      maturityLevel
      status
      businessValue
      owners {
        id
        firstName
        lastName
      }
      tags
      createdAt
      updatedAt
      children {
        id
        name
      }
      parents {
        id
        name
      }
      supportedByApplications {
        id
        name
      }
      partOfArchitectures {
        id
        name
      }
    }
  }
`

export const GET_CAPABILITY = gql`
  query GetCapability($id: ID!) {
    businessCapability(where: { id: $id }) {
      id
      name
      description
      maturityLevel
      status
      businessValue
      owners {
        id
        firstName
        lastName
      }
      tags
      createdAt
      updatedAt
      children {
        id
        name
      }
      parents {
        id
        name
      }
      supportedByApplications {
        id
        name
      }
      partOfArchitectures {
        id
        name
      }
    }
  }
`

export const CREATE_CAPABILITY = gql`
  mutation CreateCapability($input: [BusinessCapabilityCreateInput!]!) {
    createBusinessCapabilities(input: $input) {
      businessCapabilities {
        id
        name
        description
        maturityLevel
        status
        businessValue
        createdAt
      }
    }
  }
`

export const UPDATE_CAPABILITY = gql`
  mutation UpdateCapability($id: ID!, $input: BusinessCapabilityUpdateInput!) {
    updateBusinessCapabilities(where: { id: { eq: $id } }, update: $input) {
      businessCapabilities {
        id
        name
        description
        maturityLevel
        status
        businessValue
        updatedAt
      }
    }
  }
`

export const DELETE_CAPABILITY = gql`
  mutation DeleteCapability($id: ID!) {
    deleteBusinessCapabilities(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_CAPABILITY_EXISTS = gql`
  query CheckCapabilityExists($id: ID!) {
    businessCapabilities(where: { id: { eq: $id } }) {
      id
    }
  }
`
