import { gql } from '@apollo/client'

export const GET_GOALS = gql`
  query GetGeaGoals($where: GEA_GoalWhere) {
    geaGoals(where: $where) {
      id
      name
      goalStatement
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
      operationalizesVisions {
        id
        name
      }
      operationalizesVisionsConnection {
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
      supportsMissions {
        id
        name
      }
      supportsMissionsConnection {
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
      supportsValues {
        id
        name
      }
      supportsValuesConnection {
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
      achievedByStrategies {
        id
        name
      }
      achievedByStrategiesConnection {
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

export const GET_GOAL = gql`
  query GetGeaGoal($id: ID!) {
    geaGoals(where: { id: { eq: $id } }) {
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

export const CREATE_GOAL = gql`
  mutation CreateGoal($input: [GEA_GoalCreateInput!]!) {
    createGeaGoals(input: $input) {
      geaGoals {
        id
        name
        goalStatement
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($id: ID!, $input: GEA_GoalUpdateInput!) {
    updateGeaGoals(where: { id: { eq: $id } }, update: $input) {
      geaGoals {
        id
        name
        goalStatement
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: ID!) {
    deleteGeaGoals(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_GOAL_EXISTS = gql`
  query CheckGoalExists($id: ID!) {
    geaGoals(where: { id: { eq: $id } }) {
      id
    }
  }
`
