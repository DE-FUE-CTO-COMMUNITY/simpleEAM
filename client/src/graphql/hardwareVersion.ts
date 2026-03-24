import { gql } from '@apollo/client/core'

export const GET_HARDWARE_VERSIONS = gql`
  query GetHardwareVersions($where: HardwareVersionWhere) {
    hardwareVersions(where: $where) {
      id
      versionModelString
      normalizedVersionModel
      releaseChannel
      supportTier
      createdAt
      updatedAt
      hardwareProduct {
        id
        name
      }
      lifecycleRecords {
        id
        lifecycleStatus
        eosDate
        eolDate
      }
    }
  }
`

export const CREATE_HARDWARE_VERSION = gql`
  mutation CreateHardwareVersions($input: [HardwareVersionCreateInput!]!) {
    createHardwareVersions(input: $input) {
      hardwareVersions {
        id
        versionModelString
      }
    }
  }
`

export const UPDATE_HARDWARE_VERSION = gql`
  mutation UpdateHardwareVersions($id: ID!, $input: HardwareVersionUpdateInput!) {
    updateHardwareVersions(where: { id: { eq: $id } }, update: $input) {
      hardwareVersions {
        id
        versionModelString
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
