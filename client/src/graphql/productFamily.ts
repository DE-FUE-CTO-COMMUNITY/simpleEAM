import { gql } from '@apollo/client/core'

export const GET_PRODUCT_FAMILIES = gql`
  query GetProductFamilies {
    productFamilies {
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
