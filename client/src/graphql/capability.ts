import { gql } from '@apollo/client';

export const GET_CAPABILITIES_COUNT = gql`
  query GetBusinessCapabilitiesCount {
    businessCapabilitiesConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`;

export const GET_CAPABILITIES = gql`
  query GetCapabilities {
    businessCapabilities {
      id
      name
      description
      maturityLevel
      status
      businessValue
      owner
      tags
      createdAt
      updatedAt
      children {
        id
        name
      }
    }
  }
`;

export const GET_CAPABILITY = gql`
  query GetCapability($id: ID!) {
    businessCapability(id: $id) {
      id
      name
      description
      maturityLevel
      status
      businessValue
      tags
      createdAt
      updatedAt
      children {
        id
        name
      }
      supportedByApplications {
        id
        name
      }
    }
  }
`;

export const CREATE_CAPABILITY = gql`
  mutation CreateCapability($input: [BusinessCapabilityCreateInput!]!) {
    createBusinessCapabilities(input: $input) {
      businessCapabilities {
        id
        name
        description
        maturityLevel
        status
        businessValue
        createdAt
      }
    }
  }
`;

export const UPDATE_CAPABILITY = gql`
  mutation UpdateCapability($id: ID!, $input: BusinessCapabilityUpdateInput!) {
    updateBusinessCapabilities(where: { id: $id }, update: $input) {
      businessCapabilities {
        id
        name
        description
        maturityLevel
        status
        businessValue
        updatedAt
      }
    }
  }
`;

export const DELETE_CAPABILITY = gql`
  mutation DeleteCapability($id: ID!) {
    deleteBusinessCapabilities(where: { id: $id }) {
      nodesDeleted
    }
  }
`;
