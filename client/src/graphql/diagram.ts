import { gql } from '@apollo/client'

export const GET_DIAGRAMS_COUNT = gql`
  query GetDiagramsCount($where: DiagramWhere) {
    diagramsConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_RECENT_DIAGRAMS = gql`
  query GetRecentDiagrams($limit: Int, $where: DiagramWhere) {
    diagrams(sort: { updatedAt: DESC }, limit: $limit, where: $where) {
      id
      title
      description
      diagramType
      diagramPng
      diagramPngDark
      diagramJson
      createdAt
      updatedAt
      company {
        id
        name
      }
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

export const GET_DIAGRAMS = gql`
  query GetDiagrams($where: DiagramWhere) {
    diagrams(where: $where) {
      id
      title
      description
      diagramType
      diagramJson
      createdAt
      updatedAt
      company {
        id
        name
      }
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
      containsCapabilities {
        id
        name
      }
      containsApplications {
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
      company {
        id
        name
      }
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
      containsCapabilities {
        id
        name
      }
      containsApplications {
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
        containsCapabilities {
          id
          name
        }
        containsApplications {
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
        containsCapabilities {
          id
          name
        }
        containsApplications {
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
  query GetArchitecturesForDiagram($where: ArchitectureWhere) {
    architectures(where: $where) {
      id
      name
      type
      domain
      description
    }
  }
`

export const CHECK_DIAGRAM_EXISTS = gql`
  query CheckDiagramExists($id: ID!) {
    diagrams(where: { id: { eq: $id } }) {
      id
    }
  }
`
