import { gql } from '@apollo/client'

export const GET_ARCHITECTURE_PRINCIPLES_COUNT = gql`
  query GetArchitecturePrinciplesCount($where: ArchitecturePrincipleWhere) {
    architecturePrinciplesConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_ARCHITECTURE_PRINCIPLES = gql`
  query GetArchitecturePrinciples($where: ArchitecturePrincipleWhere) {
    architecturePrinciples(where: $where) {
      id
      name
      description
      category
      priority
      rationale
      implications
      tags
      isActive
      createdAt
      updatedAt
      company {
        id
      }
      owners {
        id
        firstName
        lastName
        email
      }
      appliedInArchitectures {
        id
        name
      }
      implementedByApplications {
        id
        name
      }
    }
  }
`

export const CREATE_ARCHITECTURE_PRINCIPLE = gql`
  mutation CreateArchitecturePrinciple($input: [ArchitecturePrincipleCreateInput!]!) {
    createArchitecturePrinciples(input: $input) {
      architecturePrinciples {
        id
        name
        description
        category
        priority
        rationale
        implications
        tags
        isActive
        company {
          id
        }
        owners {
          id
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`

export const UPDATE_ARCHITECTURE_PRINCIPLE = gql`
  mutation UpdateArchitecturePrinciple($id: ID!, $input: ArchitecturePrincipleUpdateInput!) {
    updateArchitecturePrinciples(where: { id: { eq: $id } }, update: $input) {
      architecturePrinciples {
        id
        name
        description
        category
        priority
        rationale
        implications
        tags
        isActive
        company {
          id
        }
        owners {
          id
          firstName
          lastName
        }
        updatedAt
      }
    }
  }
`

export const DELETE_ARCHITECTURE_PRINCIPLE = gql`
  mutation DeleteArchitecturePrinciple($id: ID!) {
    deleteArchitecturePrinciples(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_ARCHITECTURE_PRINCIPLE_EXISTS = gql`
  query CheckArchitecturePrincipleExists($id: ID!) {
    architecturePrinciples(where: { id: { eq: $id } }) {
      id
    }
  }
`
