import { gql } from '@apollo/client'

export const GET_DIAGRAMS_COUNT = gql`
  query GetDiagramsCount {
    diagramsConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_DIAGRAMS = gql`
  query GetDiagrams {
    diagrams {
      id
      name
      description
      content
      createdAt
      updatedAt
    }
  }
`
