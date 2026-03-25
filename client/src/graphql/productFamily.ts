import { gql } from '@apollo/client/core'

export const GET_PRODUCT_FAMILIES = gql`
  query GetProductFamilies($where: ProductFamilyWhere) {
    productFamilies(where: $where) {
      id
      name
      category
      type
      createdAt
      updatedAt
      softwareProducts {
        id
      }
      hardwareProducts {
        id
      }
    }
  }
`

export const CHECK_PRODUCT_FAMILY_EXISTS = gql`
  query CheckProductFamilyExists($id: ID!) {
    productFamilies(where: { id: { eq: $id } }) {
      id
    }
  }
`

export const CREATE_PRODUCT_FAMILY = gql`
  mutation CreateProductFamilies($input: [ProductFamilyCreateInput!]!) {
    createProductFamilies(input: $input) {
      productFamilies {
        id
        name
      }
    }
  }
`

export const UPDATE_PRODUCT_FAMILY = gql`
  mutation UpdateProductFamilies($id: ID!, $input: ProductFamilyUpdateInput!) {
    updateProductFamilies(where: { id: { eq: $id } }, update: $input) {
      productFamilies {
        id
        name
      }
    }
  }
`

export const DELETE_PRODUCT_FAMILY = gql`
  mutation DeleteProductFamilies($id: ID!) {
    deleteProductFamilies(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
