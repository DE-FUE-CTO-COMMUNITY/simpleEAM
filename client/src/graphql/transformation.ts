import { gql } from '@apollo/client/core'

export const GET_TRANSFORMATIONS = gql`
  query GetTransformations($where: TransformationWhere) {
    transformations(where: $where) {
      id
      name
      description
      status
      targetDate
      startDate
      completionDate
      priority
      rationale
      expectedOutcome
      tags
      createdAt
      updatedAt
      company {
        id
        name
      }
      owners {
        id
        firstName
        lastName
        email
      }
      sourceArchitecture {
        id
        name
      }
      targetArchitectures {
        id
        name
      }
      goals {
        id
        name
      }
      impactsCapabilitiesConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
      impactsApplicationsConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
      impactsAIComponentsConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
      impactsDataObjectsConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
      impactsInterfacesConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
      impactsInfrastructureConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
      impactsBusinessProcessesConnection {
        edges {
          node {
            id
            name
          }
          properties {
            action
            notes
          }
        }
      }
    }
  }
`

export const CREATE_TRANSFORMATION = gql`
  mutation CreateTransformation($input: [TransformationCreateInput!]!) {
    createTransformations(input: $input) {
      transformations {
        id
        name
        status
        targetDate
        priority
        createdAt
        owners {
          id
          firstName
          lastName
        }
        company {
          id
        }
      }
    }
  }
`

export const UPDATE_TRANSFORMATION = gql`
  mutation UpdateTransformation($id: ID!, $input: TransformationUpdateInput!) {
    updateTransformations(where: { id: { eq: $id } }, update: $input) {
      transformations {
        id
        name
        status
        targetDate
        priority
        updatedAt
        owners {
          id
          firstName
          lastName
        }
        sourceArchitecture {
          id
          name
        }
        targetArchitectures {
          id
          name
        }
        goals {
          id
          name
        }
      }
    }
  }
`

export const DELETE_TRANSFORMATION = gql`
  mutation DeleteTransformation($id: ID!) {
    deleteTransformations(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
