import { gql } from '@apollo/client'

export const GET_ARCHITECTURES_COUNT = gql`
  query GetArchitecturesCount {
    architecturesConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_ARCHITECTURES = gql`
  query GetArchitectures {
    architectures {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`
