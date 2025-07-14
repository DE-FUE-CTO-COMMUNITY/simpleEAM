import { gql } from '@apollo/client'

export const CHECK_INFRASTRUCTURE_EXISTS = gql`
  query CheckInfrastructureExists($id: ID!) {
    infrastructures(where: { id: { eq: $id } }) {
      id
    }
  }
`

export const GET_INFRASTRUCTURES_COUNT = gql`
  query GetInfrastructuresCount {
    infrastructuresConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_INFRASTRUCTURES = gql`
  query GetInfrastructures {
    infrastructures {
      id
      name
      description
      infrastructureType
      status
      vendor
      version
      capacity
      location
      ipAddress
      operatingSystem
      specifications
      maintenanceWindow
      costs
      planningDate
      introductionDate
      endOfUseDate
      endOfLifeDate
      owners {
        id
        firstName
        lastName
      }
      parentInfrastructure {
        id
        name
      }
      childInfrastructures {
        id
        name
      }
      hostsApplications {
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
      createdAt
      updatedAt
    }
  }
`

export const GET_INFRASTRUCTURE = gql`
  query GetInfrastructure($id: ID!) {
    infrastructure(id: $id) {
      id
      name
      description
      infrastructureType
      status
      vendor
      version
      capacity
      location
      ipAddress
      operatingSystem
      specifications
      maintenanceWindow
      costs
      planningDate
      introductionDate
      endOfUseDate
      endOfLifeDate
      owners {
        id
        firstName
        lastName
      }
      parentInfrastructure {
        id
        name
      }
      childInfrastructures {
        id
        name
      }
      hostsApplications {
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
      createdAt
      updatedAt
    }
  }
`

export const CREATE_INFRASTRUCTURE = gql`
  mutation CreateInfrastructure($input: [InfrastructureCreateInput!]!) {
    createInfrastructures(input: $input) {
      infrastructures {
        id
        name
        description
        infrastructureType
        status
        vendor
        version
        capacity
        location
        ipAddress
        operatingSystem
        specifications
        maintenanceWindow
        costs
        planningDate
        introductionDate
        endOfUseDate
        endOfLifeDate
        owners {
          id
          firstName
          lastName
        }
        parentInfrastructure {
          id
          name
        }
        childInfrastructures {
          id
          name
        }
        hostsApplications {
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
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_INFRASTRUCTURE = gql`
  mutation UpdateInfrastructure($where: InfrastructureWhere!, $update: InfrastructureUpdateInput!) {
    updateInfrastructures(where: $where, update: $update) {
      infrastructures {
        id
        name
        description
        infrastructureType
        status
        vendor
        version
        capacity
        location
        ipAddress
        operatingSystem
        specifications
        maintenanceWindow
        costs
        planningDate
        introductionDate
        endOfUseDate
        endOfLifeDate
        owners {
          id
          firstName
          lastName
        }
        parentInfrastructure {
          id
          name
        }
        childInfrastructures {
          id
          name
        }
        hostsApplications {
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
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_INFRASTRUCTURE = gql`
  mutation DeleteInfrastructure($where: InfrastructureWhere!) {
    deleteInfrastructures(where: $where) {
      nodesDeleted
    }
  }
`
