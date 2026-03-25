import { gql } from '@apollo/client/core'

export const GET_HARDWARE_PRODUCTS_COUNT = gql`
  query GetHardwareProductsCount($where: HardwareProductWhere) {
    hardwareProductsConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_HARDWARE_PRODUCTS = gql`
  query GetHardwareProducts($where: HardwareProductWhere) {
    hardwareProducts(where: $where) {
      id
      name
      productFamily {
        id
        name
        category
        type
      }
      lifecycleStatus
      isActive
      createdAt
      updatedAt
      manufacturedBy {
        id
        name
      }
      providedBy {
        id
        name
      }
      maintainedBy {
        id
        name
      }
      versions {
        id
        name
        version
      }
      usedByInfrastructure {
        id
        name
      }
    }
  }
`

export const CREATE_HARDWARE_PRODUCT = gql`
  mutation CreateHardwareProducts($input: [HardwareProductCreateInput!]!) {
    createHardwareProducts(input: $input) {
      hardwareProducts {
        id
        name
      }
    }
  }
`

export const UPDATE_HARDWARE_PRODUCT = gql`
  mutation UpdateHardwareProducts($id: ID!, $input: HardwareProductUpdateInput!) {
    updateHardwareProducts(where: { id: { eq: $id } }, update: $input) {
      hardwareProducts {
        id
        name
      }
    }
  }
`

export const DELETE_HARDWARE_PRODUCT = gql`
  mutation DeleteHardwareProducts($id: ID!) {
    deleteHardwareProducts(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_HARDWARE_PRODUCT_EXISTS = gql`
  query CheckHardwareProductExists($id: ID!) {
    hardwareProducts(where: { id: { eq: $id } }) {
      id
    }
  }
`
