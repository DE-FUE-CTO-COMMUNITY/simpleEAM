import { gql } from '@apollo/client'

export const GET_SUPPLIERS_COUNT = gql`
  query GetSuppliersCount($where: SupplierWhere) {
    suppliersConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_SUPPLIERS = gql`
  query GetSuppliers($where: SupplierWhere) {
    suppliers(where: $where) {
      id
      name
      description
      supplierType
      status
      address
      phone
      email
      website
      primaryContactPerson
      contractStartDate
      contractEndDate
      annualSpend
      riskClassification
      strategicImportance
      performanceRating
      complianceCertifications
      tags
      createdAt
      updatedAt
      providesApplications {
        id
        name
      }
      supportsApplications {
        id
        name
      }
      maintainsApplications {
        id
        name
      }
      providesInfrastructure {
        id
        name
      }
      hostsInfrastructure {
        id
        name
      }
      maintainsInfrastructure {
        id
        name
      }
    }
  }
`

export const GET_SUPPLIER = gql`
  query GetSupplier($where: SupplierWhere) {
    suppliers(where: $where) {
      id
      name
      description
      supplierType
      status
      address
      phone
      email
      website
      primaryContactPerson
      contractStartDate
      contractEndDate
      annualSpend
      riskClassification
      strategicImportance
      performanceRating
      complianceCertifications
      tags
      createdAt
      updatedAt
      providesApplications {
        id
        name
      }
      supportsApplications {
        id
        name
      }
      maintainsApplications {
        id
        name
      }
      providesInfrastructure {
        id
        name
      }
      hostsInfrastructure {
        id
        name
      }
      maintainsInfrastructure {
        id
        name
      }
    }
  }
`

export const CREATE_SUPPLIER = gql`
  mutation CreateSuppliers($input: [SupplierCreateInput!]!) {
    createSuppliers(input: $input) {
      suppliers {
        id
        name
        description
        supplierType
        status
        address
        phone
        email
        website
        primaryContactPerson
        contractStartDate
        contractEndDate
        annualSpend
        riskClassification
        strategicImportance
        performanceRating
        complianceCertifications
        tags
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_SUPPLIER = gql`
  mutation UpdateSuppliers($where: SupplierWhere!, $update: SupplierUpdateInput!) {
    updateSuppliers(where: $where, update: $update) {
      suppliers {
        id
        name
        description
        supplierType
        status
        address
        phone
        email
        website
        primaryContactPerson
        contractStartDate
        contractEndDate
        annualSpend
        riskClassification
        strategicImportance
        performanceRating
        complianceCertifications
        tags
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_SUPPLIER = gql`
  mutation DeleteSuppliers($where: SupplierWhere!) {
    deleteSuppliers(where: $where) {
      nodesDeleted
    }
  }
`
