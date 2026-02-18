import { gql } from '@apollo/client/core'

export const GET_STRATEGIES = gql`
  query GetGeaStrategies($where: GEA_StrategyWhere) {
    geaStrategies(where: $where) {
      id
      name
      description
      createdAt
      updatedAt
      owners {
        id
        firstName
        lastName
      }
      company {
        id
        name
      }
      achievesGoals {
        id
        name
      }
      achievesGoalsConnection {
        edges {
          node {
            id
            name
          }
          properties {
            score
          }
        }
      }
      partOfArchitectures {
        id
        name
      }
      depictedInDiagrams {
        id
        title
      }
    }
  }
`

export const GET_STRATEGY = gql`
  query GetGeaStrategy($id: ID!) {
    geaStrategies(where: { id: { eq: $id } }) {
      id
      name
      description
      createdAt
      updatedAt
      owners {
        id
        firstName
        lastName
      }
      company {
        id
        name
      }
      partOfArchitectures {
        id
        name
      }
      depictedInDiagrams {
        id
        title
      }
    }
  }
`

export const CREATE_STRATEGY = gql`
  mutation CreateStrategy($input: [GEA_StrategyCreateInput!]!) {
    createGeaStrategies(input: $input) {
      geaStrategies {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_STRATEGY = gql`
  mutation UpdateStrategy($id: ID!, $input: GEA_StrategyUpdateInput!) {
    updateGeaStrategies(where: { id: { eq: $id } }, update: $input) {
      geaStrategies {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_STRATEGY = gql`
  mutation DeleteStrategy($id: ID!) {
    deleteGeaStrategies(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_STRATEGY_EXISTS = gql`
  query CheckStrategyExists($id: ID!) {
    geaStrategies(where: { id: { eq: $id } }) {
      id
    }
  }
`
