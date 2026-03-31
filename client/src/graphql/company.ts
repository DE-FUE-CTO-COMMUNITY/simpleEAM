// GraphQL Operations für Companies

import { gql } from '@apollo/client/core'

// Query: Alle companies abrufen
export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      description
      address
      industry
      website
      primaryColor
      secondaryColor
      font
      diagramFont
      logo
      features
      llmUrl
      llmModel
      llmKey
      expectedSovereigntyScore
      achievedSovereigntyScore
      sovereigntyScoreStatus
      size
      createdAt
      updatedAt
      employees {
        id
        firstName
        lastName
      }
    }
  }
`

// Query: Einzelne company abrufen
export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    companies(where: { id: { eq: $id } }, limit: 1) {
      id
      name
      description
      address
      industry
      website
      primaryColor
      secondaryColor
      font
      diagramFont
      logo
      features
      llmUrl
      llmModel
      llmKey
      expectedSovereigntyScore
      achievedSovereigntyScore
      sovereigntyScoreStatus
      size
      createdAt
      updatedAt
      employees {
        id
        firstName
        lastName
      }
    }
  }
`

// Mutation: Neue company erstellen
export const CREATE_COMPANY = gql`
  mutation CreateCompanies($input: [CompanyCreateInput!]!) {
    createCompanies(input: $input) {
      companies {
        id
        name
        description
        address
        industry
        website
        primaryColor
        secondaryColor
        font
        diagramFont
        logo
        features
        llmUrl
        llmModel
        llmKey
        size
        createdAt
        updatedAt
        employees {
          id
          firstName
          lastName
        }
      }
    }
  }
`

// Mutation: company aktualisieren
export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: CompanyUpdateInput!) {
    updateCompanies(where: { id: { eq: $id } }, update: $input) {
      companies {
        id
        name
        description
        address
        industry
        website
        primaryColor
        secondaryColor
        font
        diagramFont
        logo
        features
        llmUrl
        llmModel
        llmKey
        size
        createdAt
        updatedAt
        employees {
          id
          firstName
          lastName
        }
      }
    }
  }
`

// Mutation: company löschen
export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompanies(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
