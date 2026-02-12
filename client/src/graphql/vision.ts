import { gql } from '@apollo/client'

export const GET_VISIONS = gql`
  query GetGeaVisions($where: GEA_VisionWhere) {
    geaVisions(where: $where) {
      id
      name
      visionStatement
      timeHorizon
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
      supportsMissions {
        id
        name
      }
      supportedByGoals {
        id
        name
      }
      supportedByValues {
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

export const GET_VISION = gql`
  query GetGeaVision($id: ID!) {
    geaVisions(where: { id: { eq: $id } }) {
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

export const CREATE_VISION = gql`
  mutation CreateVision($input: [GEA_VisionCreateInput!]!) {
    createGeaVisions(input: $input) {
      geaVisions {
        id
        name
        visionStatement
        timeHorizon
        year
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_VISION = gql`
  mutation UpdateVision($id: ID!, $input: GEA_VisionUpdateInput!) {
    updateGeaVisions(where: { id: { eq: $id } }, update: $input) {
      geaVisions {
        id
        name
        visionStatement
        timeHorizon
        year
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_VISION = gql`
  mutation DeleteVision($id: ID!) {
    deleteGeaVisions(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_VISION_EXISTS = gql`
  query CheckVisionExists($id: ID!) {
    geaVisions(where: { id: { eq: $id } }) {
      id
    }
  }
`
