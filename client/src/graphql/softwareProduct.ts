import { gql } from '@apollo/client/core'

export const GET_SOFTWARE_PRODUCTS_COUNT = gql`
  query GetSoftwareProductsCount($where: SoftwareProductWhere) {
    softwareProductsConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_SOFTWARE_PRODUCTS = gql`
  query GetSoftwareProducts($where: SoftwareProductWhere) {
    softwareProducts(where: $where) {
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
      developedBy {
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
      usedByApplications {
        id
        name
      }
      usedByInfrastructure {
        id
        name
      }
    }
  }
`

export const CREATE_SOFTWARE_PRODUCT = gql`
  mutation CreateSoftwareProducts($input: [SoftwareProductCreateInput!]!) {
    createSoftwareProducts(input: $input) {
      softwareProducts {
        id
        name
      }
    }
  }
`

export const UPDATE_SOFTWARE_PRODUCT = gql`
  mutation UpdateSoftwareProducts($id: ID!, $input: SoftwareProductUpdateInput!) {
    updateSoftwareProducts(where: { id: { eq: $id } }, update: $input) {
      softwareProducts {
        id
        name
      }
    }
  }
`

export const DELETE_SOFTWARE_PRODUCT = gql`
  mutation DeleteSoftwareProducts($id: ID!) {
    deleteSoftwareProducts(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_SOFTWARE_PRODUCT_EXISTS = gql`
  query CheckSoftwareProductExists($id: ID!) {
    softwareProducts(where: { id: { eq: $id } }) {
      id
    }
  }
`
