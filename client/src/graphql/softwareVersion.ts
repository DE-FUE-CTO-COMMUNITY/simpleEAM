import { gql } from '@apollo/client/core'

export const GET_SOFTWARE_VERSIONS_COUNT = gql`
  query GetSoftwareVersionsCount($where: SoftwareVersionWhere) {
    softwareVersionsConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_SOFTWARE_VERSIONS = gql`
  query GetSoftwareVersions($where: SoftwareVersionWhere) {
    softwareVersions(where: $where) {
      id
      name
      version
      releaseChannel
      isLts
      supportTier
      createdAt
      updatedAt
      softwareProduct {
        id
        name
      }
      usedByApplications {
        id
        name
      }
      usedByInfrastructure {
        id
        name
      }
      lifecycleRecords {
        id
        gaDate
        mainstreamSupportEndDate
        extendedSupportEndDate
        lifecycleStatus
        eosDate
        eolDate
        source
        sourceUrl
        sourceConfidence
        lastValidatedAt
      }
    }
  }
`

export const CREATE_SOFTWARE_VERSION = gql`
  mutation CreateSoftwareVersions($input: [SoftwareVersionCreateInput!]!) {
    createSoftwareVersions(input: $input) {
      softwareVersions {
        id
        name
      }
    }
  }
`

export const UPDATE_SOFTWARE_VERSION = gql`
  mutation UpdateSoftwareVersions($id: ID!, $input: SoftwareVersionUpdateInput!) {
    updateSoftwareVersions(where: { id: { eq: $id } }, update: $input) {
      softwareVersions {
        id
        name
      }
    }
  }
`

export const DELETE_SOFTWARE_VERSION = gql`
  mutation DeleteSoftwareVersions($id: ID!) {
    deleteSoftwareVersions(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
