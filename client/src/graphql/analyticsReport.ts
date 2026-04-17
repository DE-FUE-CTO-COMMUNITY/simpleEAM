import { gql } from '@apollo/client/core'

export const GET_ALL_ANALYTICS_REPORTS = gql`
  query GetAllAnalyticsReports($companyId: ID!, $creatorId: ID!) {
    analyticsReports(
      where: {
        company: { some: { id: { eq: $companyId } } }
        OR: [{ isPublic: { eq: true } }, { createdBy: { some: { id: { eq: $creatorId } } } }]
      }
      sort: { updatedAt: DESC }
    ) {
      id
      name
      isPublic
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
        firstName
        lastName
      }
      folder {
        id
        name
      }
    }
  }
`

export const GET_MY_ANALYTICS_REPORTS = gql`
  query GetMyAnalyticsReports($companyId: ID!, $creatorId: ID!) {
    analyticsReports(
      where: {
        company: { some: { id: { eq: $companyId } } }
        createdBy: { some: { id: { eq: $creatorId } } }
      }
      sort: { updatedAt: DESC }
    ) {
      id
      name
      isPublic
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
        firstName
        lastName
      }
      folder {
        id
        name
      }
    }
  }
`

export const GET_REPORT_FOLDERS = gql`
  query GetReportFolders($companyId: ID!) {
    reportFolders(where: { company: { some: { id: { eq: $companyId } } } }, sort: { name: ASC }) {
      id
      name
      createdAt
      updatedAt
      parent {
        id
      }
      children {
        id
      }
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
        isPublic
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
          firstName
          lastName
        }
        folder {
          id
          name
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
        isPublic
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
          firstName
          lastName
        }
        folder {
          id
          name
        }
      }
    }
  }
`

export const CREATE_REPORT_FOLDER = gql`
  mutation CreateReportFolder($input: [ReportFolderCreateInput!]!) {
    createReportFolders(input: $input) {
      reportFolders {
        id
        name
        createdAt
        updatedAt
        parent {
          id
        }
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

export const UPDATE_REPORT_FOLDER = gql`
  mutation UpdateReportFolder($id: ID!, $input: ReportFolderUpdateInput!) {
    updateReportFolders(where: { id: { eq: $id } }, update: $input) {
      reportFolders {
        id
        name
        createdAt
        updatedAt
        parent {
          id
        }
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

export const DELETE_REPORT_FOLDER = gql`
  mutation DeleteReportFolder($id: ID!) {
    deleteReportFolders(where: { id: { eq: $id } }) {
      nodesDeleted
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
