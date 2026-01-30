import { gql } from '@apollo/client'

export const CHECK_APPLICATION_INTERFACE_EXISTS = gql`
  query CheckApplicationInterfaceExists($id: ID!) {
    applicationInterfaces(where: { id: { eq: $id } }) {
      id
    }
  }
`

export const GET_APPLICATION_INTERFACES_COUNT = gql`
  query GetApplicationInterfacesCount($where: ApplicationInterfaceWhere) {
    applicationInterfacesConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_APPLICATION_INTERFACES = gql`
  query GetApplicationInterfaces($where: ApplicationInterfaceWhere) {
    applicationInterfaces(where: $where) {
      id
      name
      description
      interfaceType
      protocol
      version
      status
      planningDate
      introductionDate
      endOfUseDate
      endOfLifeDate
      createdAt
      updatedAt
      owners {
        id
        firstName
        lastName
      }
      sourceApplications {
        id
        name
      }
      targetApplications {
        id
        name
      }
      dataObjects {
        id
        name
      }
      predecessors {
        id
        name
      }
      successors {
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

export const GET_APPLICATION_INTERFACE = gql`
  query GetApplicationInterface($id: ID!) {
    applicationInterfaces(where: { id: { eq: $id } }) {
      id
      name
      description
      interfaceType
      protocol
      version
      status
      planningDate
      introductionDate
      endOfUseDate
      endOfLifeDate
      createdAt
      updatedAt
      owners {
        id
        firstName
        lastName
      }
      sourceApplications {
        id
        name
      }
      targetApplications {
        id
        name
      }
      dataObjects {
        id
        name
      }
      predecessors {
        id
        name
      }
      successors {
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

export const CREATE_APPLICATION_INTERFACE = gql`
  mutation CreateApplicationInterface($input: [ApplicationInterfaceCreateInput!]!) {
    createApplicationInterfaces(input: $input) {
      applicationInterfaces {
        id
        name
        description
        interfaceType
        protocol
        version
        status
        planningDate
        introductionDate
        endOfUseDate
        endOfLifeDate
        createdAt
        updatedAt
        owners {
          id
          firstName
          lastName
        }
        sourceApplications {
          id
          name
        }
        targetApplications {
          id
          name
        }
        dataObjects {
          id
          name
        }
        predecessors {
          id
          name
        }
        successors {
          id
          name
        }
        depictedInDiagrams {
          id
          title
        }
      }
    }
  }
`

export const UPDATE_APPLICATION_INTERFACE = gql`
  mutation UpdateApplicationInterface($id: ID!, $input: ApplicationInterfaceUpdateInput!) {
    updateApplicationInterfaces(where: { id: { eq: $id } }, update: $input) {
      applicationInterfaces {
        id
        name
        description
        interfaceType
        protocol
        version
        status
        planningDate
        introductionDate
        endOfUseDate
        endOfLifeDate
        createdAt
        updatedAt
        owners {
          id
          firstName
          lastName
        }
        sourceApplications {
          id
          name
        }
        targetApplications {
          id
          name
        }
        dataObjects {
          id
          name
        }
        predecessors {
          id
          name
        }
        successors {
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
  }
`

export const DELETE_APPLICATION_INTERFACE = gql`
  mutation DeleteApplicationInterface($id: ID!) {
    deleteApplicationInterfaces(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`
