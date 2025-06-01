import { gql } from '@apollo/client'

export const GET_APPLICATIONS_COUNT = gql`
  query GetApplicationsCount {
    applicationsConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_APPLICATIONS = gql`
  query GetApplications {
    applications {
      id
      name
      description
      status
      criticality
      costs
      vendor
      version
      hostingEnvironment
      technologyStack
      introductionDate
      endOfLifeDate
      owners {
        id
        firstName
        lastName
      }
      createdAt
      updatedAt
      supportsCapabilities {
        id
        name
      }
      usesDataObjects {
        id
        name
      }
      sourceOfInterfaces {
        id
        name
      }
      targetOfInterfaces {
        id
        name
      }
      partOfArchitectures {
        id
        name
      }
    }
  }
`

export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    application(where: { id: $id }) {
      id
      name
      description
      status
      criticality
      costs
      vendor
      version
      hostingEnvironment
      technologyStack
      introductionDate
      endOfLifeDate
      owners {
        id
        firstName
        lastName
      }
      createdAt
      updatedAt
      supportsCapabilities {
        id
        name
      }
      usesDataObjects {
        id
        name
      }
      sourceOfInterfaces {
        id
        name
      }
      targetOfInterfaces {
        id
        name
      }
      partOfArchitectures {
        id
        name
      }
    }
  }
`

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: [ApplicationCreateInput!]!) {
    createApplications(input: $input) {
      applications {
        id
        name
        description
        status
        criticality
        vendor
        version
        createdAt
      }
    }
  }
`

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($id: ID!, $input: ApplicationUpdateInput!) {
    updateApplications(where: { id: { eq: $id } }, update: $input) {
      applications {
        id
        name
        description
        status
        criticality
        vendor
        version
        updatedAt
      }
    }
  }
`

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: ID!) {
    deleteApplications(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
