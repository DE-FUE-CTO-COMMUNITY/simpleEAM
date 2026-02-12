import { gql } from '@apollo/client'

export const GET_VALUES = gql`
  query GetGeaValues($where: GEA_ValueWhere) {
    geaValues(where: $where) {
      id
      name
      valueStatement
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
      supportsMissions {
        id
        name
      }
      supportsVisions {
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

export const GET_VALUE = gql`
  query GetGeaValue($id: ID!) {
    geaValues(where: { id: { eq: $id } }) {
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

export const CREATE_VALUE = gql`
  mutation CreateValue($input: [GEA_ValueCreateInput!]!) {
    createGeaValues(input: $input) {
      geaValues {
        id
        name
        valueStatement
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_VALUE = gql`
  mutation UpdateValue($id: ID!, $input: GEA_ValueUpdateInput!) {
    updateGeaValues(where: { id: { eq: $id } }, update: $input) {
      geaValues {
        id
        name
        valueStatement
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_VALUE = gql`
  mutation DeleteValue($id: ID!) {
    deleteGeaValues(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_VALUE_EXISTS = gql`
  query CheckValueExists($id: ID!) {
    geaValues(where: { id: { eq: $id } }) {
      id
    }
  }
`
