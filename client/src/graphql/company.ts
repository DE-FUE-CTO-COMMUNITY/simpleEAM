import { gql } from '@apollo/client'

export const CHECK_COMPANY_EXISTS = gql`
  query CheckCompanyExists($id: ID!) {
    companies(where: { id: { eq: $id } }) {
      id
    }
  }
`

export const GET_COMPANIES_COUNT = gql`
  query GetCompaniesCount {
    companiesConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      description
      address
      website
      industry
      size
      createdAt
      updatedAt
    }
  }
`

export const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($id: ID!) {
    companies(where: { id: { eq: $id } }) {
      id
      name
      description
      address
      website
      industry
      size
      createdAt
      updatedAt
      organisations {
        id
        name
      }
      ownedCapabilities {
        id
        name
      }
      ownedApplications {
        id
        name
      }
    }
  }
`

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: [CompanyCreateInput!]!) {
    createCompanies(input: $input) {
      companies {
        id
        name
        description
        address
        website
        industry
        size
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($where: CompanyWhere!, $update: CompanyUpdateInput!) {
    updateCompanies(where: $where, update: $update) {
      companies {
        id
        name
        description
        address
        website
        industry
        size
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($where: CompanyWhere!) {
    deleteCompanies(where: $where) {
      nodesDeleted
    }
  }
`
