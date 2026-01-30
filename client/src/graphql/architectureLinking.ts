import { gql } from '@apollo/client'

// Mutation zum Verknüpfen einer BusinessCapability mit einer Architektur
export const LINK_CAPABILITY_TO_ARCHITECTURE = gql`
  mutation LinkCapabilityToArchitecture($id: ID!, $architectureId: ID!) {
    updateBusinessCapabilities(
      where: { id: { eq: $id } }
      update: {
        partOfArchitectures: { connect: [{ where: { node: { id: { eq: $architectureId } } } }] }
      }
    ) {
      businessCapabilities {
        id
        name
        partOfArchitectures {
          id
          name
        }
      }
    }
  }
`

// Mutation zum Verknüpfen einer Application mit einer Architektur
export const LINK_APPLICATION_TO_ARCHITECTURE = gql`
  mutation LinkApplicationToArchitecture($id: ID!, $architectureId: ID!) {
    updateApplications(
      where: { id: { eq: $id } }
      update: {
        partOfArchitectures: { connect: [{ where: { node: { id: { eq: $architectureId } } } }] }
      }
    ) {
      applications {
        id
        name
        partOfArchitectures {
          id
          name
        }
      }
    }
  }
`

// Mutation zum Verknüpfen eines DataObjects mit einer Architektur
export const LINK_DATA_OBJECT_TO_ARCHITECTURE = gql`
  mutation LinkDataObjectToArchitecture($id: ID!, $architectureId: ID!) {
    updateDataObjects(
      where: { id: { eq: $id } }
      update: {
        partOfArchitectures: { connect: [{ where: { node: { id: { eq: $architectureId } } } }] }
      }
    ) {
      dataObjects {
        id
        name
        partOfArchitectures {
          id
          name
        }
      }
    }
  }
`

// Mutation zum Verknüpfen eines ApplicationInterface mit einer Architektur
export const LINK_APPLICATION_INTERFACE_TO_ARCHITECTURE = gql`
  mutation LinkApplicationInterfaceToArchitecture($id: ID!, $architectureId: ID!) {
    updateApplicationInterfaces(
      where: { id: { eq: $id } }
      update: {
        partOfArchitectures: { connect: [{ where: { node: { id: { eq: $architectureId } } } }] }
      }
    ) {
      applicationInterfaces {
        id
        name
        partOfArchitectures {
          id
          name
        }
      }
    }
  }
`

// Mutation zum Verknüpfen einer Infrastructure mit einer Architektur
export const LINK_INFRASTRUCTURE_TO_ARCHITECTURE = gql`
  mutation LinkInfrastructureToArchitecture($id: ID!, $architectureId: ID!) {
    updateInfrastructures(
      where: { id: { eq: $id } }
      update: {
        partOfArchitectures: { connect: [{ where: { node: { id: { eq: $architectureId } } } }] }
      }
    ) {
      infrastructures {
        id
        name
        partOfArchitectures {
          id
          name
        }
      }
    }
  }
`
