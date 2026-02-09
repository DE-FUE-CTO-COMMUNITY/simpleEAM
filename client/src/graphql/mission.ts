import { gql } from '@apollo/client'

export const GET_MISSIONS = gql`
  query GetGeaMissions($where: GEA_MissionWhere) {
    geaMissions(where: $where) {
      id
      name
      description
      year
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

export const GET_MISSION = gql`
  query GetGeaMission($id: ID!) {
    geaMissions(where: { id: { eq: $id } }) {
      id
      name
      description
      year
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

export const CREATE_MISSION = gql`
  mutation CreateMission($input: [GEA_MissionCreateInput!]!) {
    createGeaMissions(input: $input) {
      geaMissions {
        id
        name
        description
        year
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_MISSION = gql`
  mutation UpdateMission($id: ID!, $input: GEA_MissionUpdateInput!) {
    updateGeaMissions(where: { id: { eq: $id } }, update: $input) {
      geaMissions {
        id
        name
        description
        year
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_MISSION = gql`
  mutation DeleteMission($id: ID!) {
    deleteGeaMissions(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_MISSION_EXISTS = gql`
  query CheckMissionExists($id: ID!) {
    geaMissions(where: { id: { eq: $id } }) {
      id
    }
  }
`
