import { gql } from '@apollo/client'

export const GET_ARCHITECTURES_COUNT = gql`
  query GetArchitecturesCount($where: ArchitectureWhere) {
    architecturesConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_ARCHITECTURES = gql`
  query GetArchitectures($where: ArchitectureWhere) {
    architectures(where: $where) {
      id
      name
      description
      domain
      type
      timestamp
      tags
      createdAt
      updatedAt
      owners {
        id
        firstName
        lastName
        email
      }
      containsApplications {
        id
        name
      }
      containsCapabilities {
        id
        name
      }
      containsDataObjects {
        id
        name
      }
      containsInterfaces {
        id
        name
      }
      containsInfrastructure {
        id
        name
      }
      diagrams {
        id
        title
      }
      childArchitectures {
        id
        name
      }
      parentArchitecture {
        id
        name
      }
      appliedPrinciples {
        id
        name
        description
        category
        priority
      }
    }
  }
`

export const CREATE_ARCHITECTURE = gql`
  mutation CreateArchitecture($input: [ArchitectureCreateInput!]!) {
    createArchitectures(input: $input) {
      architectures {
        id
        name
        description
        domain
        type
        timestamp
        tags
        owners {
          id
          firstName
          lastName
        }
        containsApplications {
          id
          name
        }
        containsCapabilities {
          id
          name
        }
        containsDataObjects {
          id
          name
        }
        containsInterfaces {
          id
          name
        }
        containsInfrastructure {
          id
          name
        }
        appliedPrinciples {
          id
          name
          category
          priority
        }
        createdAt
      }
    }
  }
`

export const UPDATE_ARCHITECTURE = gql`
  mutation UpdateArchitecture($id: ID!, $input: ArchitectureUpdateInput!) {
    updateArchitectures(where: { id: { eq: $id } }, update: $input) {
      architectures {
        id
        name
        description
        domain
        type
        timestamp
        tags
        owners {
          id
          firstName
          lastName
        }
        containsApplications {
          id
          name
        }
        containsCapabilities {
          id
          name
        }
        containsDataObjects {
          id
          name
        }
        containsInterfaces {
          id
          name
        }
        containsInfrastructure {
          id
          name
        }
        appliedPrinciples {
          id
          name
          category
          priority
        }
        updatedAt
      }
    }
  }
`

export const DELETE_ARCHITECTURE = gql`
  mutation DeleteArchitecture($id: ID!) {
    deleteArchitectures(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_ARCHITECTURE_EXISTS = gql`
  query CheckArchitectureExists($id: ID!) {
    architectures(where: { id: { eq: $id } }) {
      id
    }
  }
`
