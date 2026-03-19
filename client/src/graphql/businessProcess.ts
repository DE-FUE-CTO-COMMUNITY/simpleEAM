import { gql } from '@apollo/client/core'

export const GET_BUSINESS_PROCESSES = gql`
  query GetBusinessProcesses($where: BusinessProcessWhere) {
    businessProcesses(where: $where) {
      id
      name
      description
      sovereigntyReqDataResidency
      sovereigntyReqJurisdictionControl
      sovereigntyReqOperationalControl
      sovereigntyReqInteroperability
      sovereigntyReqPortability
      sovereigntyReqSupplyChainTransparency
      sovereigntyReqWeight
      sovereigntyReqRationale
      processType
      status
      maturityLevel
      category
      tags
      bpmnXml
      createdAt
      updatedAt
      owners {
        id
        firstName
        lastName
      }
      company {
        id
        name
      }
      parentProcess {
        id
        name
      }
      childProcesses {
        id
        name
      }
      supportsCapabilities {
        id
        name
      }
      supportedByApplications {
        id
        name
      }
      partOfArchitectures {
        id
        name
      }
      depictedInDiagrams {
        id
        title
      }
    }
  }
`

export const GET_BUSINESS_PROCESSES_COUNT = gql`
  query GetBusinessProcessesCount($where: BusinessProcessWhere) {
    businessProcessesConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const CHECK_BUSINESS_PROCESS_EXISTS = gql`
  query CheckBusinessProcessExists($id: ID!) {
    businessProcesses(where: { id: { eq: $id } }) {
      id
    }
  }
`

export const CREATE_BUSINESS_PROCESS = gql`
  mutation CreateBusinessProcess($input: [BusinessProcessCreateInput!]!) {
    createBusinessProcesses(input: $input) {
      businessProcesses {
        id
        name
        sovereigntyReqDataResidency
        sovereigntyReqJurisdictionControl
        sovereigntyReqOperationalControl
        sovereigntyReqInteroperability
        sovereigntyReqPortability
        sovereigntyReqSupplyChainTransparency
        sovereigntyReqWeight
        sovereigntyReqRationale
        processType
        status
        maturityLevel
        category
        bpmnXml
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_BUSINESS_PROCESS = gql`
  mutation UpdateBusinessProcess($id: ID!, $input: BusinessProcessUpdateInput!) {
    updateBusinessProcesses(where: { id: { eq: $id } }, update: $input) {
      businessProcesses {
        id
        name
        sovereigntyReqDataResidency
        sovereigntyReqJurisdictionControl
        sovereigntyReqOperationalControl
        sovereigntyReqInteroperability
        sovereigntyReqPortability
        sovereigntyReqSupplyChainTransparency
        sovereigntyReqWeight
        sovereigntyReqRationale
        processType
        status
        maturityLevel
        category
        bpmnXml
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_BUSINESS_PROCESS = gql`
  mutation DeleteBusinessProcess($id: ID!) {
    deleteBusinessProcesses(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
