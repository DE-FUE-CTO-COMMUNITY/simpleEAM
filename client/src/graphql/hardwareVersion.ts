import { gql } from '@apollo/client/core'

export const GET_HARDWARE_VERSIONS_COUNT = gql`
  query GetHardwareVersionsCount($where: HardwareVersionWhere) {
    hardwareVersionsConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_HARDWARE_VERSIONS = gql`
  query GetHardwareVersions($where: HardwareVersionWhere) {
    hardwareVersions(where: $where) {
      id
      name
      version
      releaseChannel
      supportTier
      createdAt
      updatedAt
      hardwareProduct {
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

export const CREATE_HARDWARE_VERSION = gql`
  mutation CreateHardwareVersions($input: [HardwareVersionCreateInput!]!) {
    createHardwareVersions(input: $input) {
      hardwareVersions {
        id
        name
      }
    }
  }
`

export const UPDATE_HARDWARE_VERSION = gql`
  mutation UpdateHardwareVersions($id: ID!, $input: HardwareVersionUpdateInput!) {
    updateHardwareVersions(where: { id: { eq: $id } }, update: $input) {
      hardwareVersions {
        id
        name
      }
    }
  }
`

export const DELETE_HARDWARE_VERSION = gql`
  mutation DeleteHardwareVersions($id: ID!) {
    deleteHardwareVersions(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_HARDWARE_VERSION_EXISTS = gql`
  query CheckHardwareVersionExists($id: ID!) {
    hardwareVersions(where: { id: { eq: $id } }) {
      id
    }
  }
`
