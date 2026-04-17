import { gql } from '@apollo/client/core'

export const GET_ANALYTICS_REPORTS = gql`
  query GetAnalyticsReports($companyId: ID!, $creatorId: ID!) {
    analyticsReports(
      where: {
        company: { some: { id: { eq: $companyId } } }
        createdBy: { some: { id: { eq: $creatorId } } }
      }
      sort: { updatedAt: DESC }
    ) {
      id
      name
      elementType
      chartType
      dimension
      measure
      createdAt
      updatedAt
      company {
        id
      }
      createdBy {
        id
      }
    }
  }
`

export const CREATE_ANALYTICS_REPORT = gql`
  mutation CreateAnalyticsReports($input: [AnalyticsReportCreateInput!]!) {
    createAnalyticsReports(input: $input) {
      analyticsReports {
        id
        name
        elementType
        chartType
        dimension
        measure
        createdAt
        updatedAt
        company {
          id
        }
        createdBy {
          id
        }
      }
    }
  }
`

export const UPDATE_ANALYTICS_REPORT = gql`
  mutation UpdateAnalyticsReport($id: ID!, $input: AnalyticsReportUpdateInput!) {
    updateAnalyticsReports(where: { id: { eq: $id } }, update: $input) {
      analyticsReports {
        id
        name
        elementType
        chartType
        dimension
        measure
        createdAt
        updatedAt
        company {
          id
        }
        createdBy {
          id
        }
      }
    }
  }
`

export const DELETE_ANALYTICS_REPORT = gql`
  mutation DeleteAnalyticsReport($id: ID!) {
    deleteAnalyticsReports(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
