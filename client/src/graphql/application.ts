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
      owner
      version
      createdAt
      updatedAt
      technologyStack
    }
  }
`

export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      name
      description
      status
      criticality
      owner
      version
      hostingEnvironment
      vendor
      costs
      createdAt
      updatedAt
      technologyStack
      supportsCapabilities {
        id
        name
      }
      usesDataObjects {
        id
        name
      }
    }
  }
`
