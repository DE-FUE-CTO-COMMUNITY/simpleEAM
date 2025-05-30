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
      title
      description
      diagramType
      diagramJson
      createdAt
      updatedAt
      creator {
        id
        firstName
        lastName
      }
      architecture {
        id
        name
        type
        domain
      }
    }
  }
`

export const GET_DIAGRAM = gql`
  query GetDiagram($id: ID!) {
    diagrams(where: { id: { eq: $id } }) {
      id
      title
      description
      diagramType
      diagramJson
      createdAt
      updatedAt
      creator {
        id
        firstName
        lastName
      }
      architecture {
        id
        name
        type
        domain
      }
    }
  }
`

export const CREATE_DIAGRAM = gql`
  mutation CreateDiagram($input: [DiagramCreateInput!]!) {
    createDiagrams(input: $input) {
      diagrams {
        id
        title
        description
        diagramType
        diagramJson
        createdAt
        creator {
          id
          firstName
          lastName
        }
        architecture {
          id
          name
        }
      }
    }
  }
`

export const UPDATE_DIAGRAM = gql`
  mutation UpdateDiagram($id: ID!, $input: DiagramUpdateInput!) {
    updateDiagrams(where: { id: { eq: $id } }, update: $input) {
      diagrams {
        id
        title
        description
        diagramType
        diagramJson
        updatedAt
        creator {
          id
          firstName
          lastName
        }
        architecture {
          id
          name
        }
      }
    }
  }
`

export const DELETE_DIAGRAM = gql`
  mutation DeleteDiagram($id: ID!) {
    deleteDiagrams(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const GET_ARCHITECTURES_FOR_DIAGRAM = gql`
  query GetArchitecturesForDiagram {
    architectures {
      id
      name
      type
      domain
      description
    }
  }
`
