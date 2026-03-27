import { gql } from '@apollo/client/core'

export const GET_SOVEREIGNTY_CAPABILITY_DETAIL = gql`
  query GetSovereigntyCapabilityDetail(
    $where: BusinessCapabilityWhere
    $applicationWhere: ApplicationWhere
    $aiComponentWhere: AIComponentWhere
    $infrastructureWhere: InfrastructureWhere
  ) {
    businessCapabilities(where: $where) {
      id
      name
      sovereigntyReqStrategicAutonomy
      sovereigntyReqResilience
      sovereigntyReqSecurity
      sovereigntyReqControl
      sovereigntyReqWeight
      supportedByApplications {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
      }
      supportedByAIComponents {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
      }
    }
    applications(where: $applicationWhere) {
      id
      name
      sovereigntyAchStrategicAutonomy
      sovereigntyAchResilience
      sovereigntyAchSecurity
      sovereigntyAchControl
      components {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
        parentInfrastructure {
          id
          name
          sovereigntyAchStrategicAutonomy
          sovereigntyAchResilience
          sovereigntyAchSecurity
          sovereigntyAchControl
        }
      }
    }
    aiComponents(where: $aiComponentWhere) {
      id
      name
      sovereigntyAchStrategicAutonomy
      sovereigntyAchResilience
      sovereigntyAchSecurity
      sovereigntyAchControl
      usedByApplications {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
        parentInfrastructure {
          id
          name
          sovereigntyAchStrategicAutonomy
          sovereigntyAchResilience
          sovereigntyAchSecurity
          sovereigntyAchControl
        }
      }
    }
    infrastructures(where: $infrastructureWhere) {
      id
      name
      sovereigntyAchStrategicAutonomy
      sovereigntyAchResilience
      sovereigntyAchSecurity
      sovereigntyAchControl
      parentInfrastructure {
        id
      }
    }
  }
`

export const GET_SOVEREIGNTY_DATA_DETAIL = gql`
  query GetSovereigntyDataDetail(
    $where: DataObjectWhere
    $applicationWhere: ApplicationWhere
    $aiComponentWhere: AIComponentWhere
    $infrastructureWhere: InfrastructureWhere
  ) {
    dataObjects(where: $where) {
      id
      name
      sovereigntyReqStrategicAutonomy
      sovereigntyReqResilience
      sovereigntyReqSecurity
      sovereigntyReqControl
      sovereigntyReqWeight
      usedByApplications {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
      }
    }
    applications(where: $applicationWhere) {
      id
      name
      sovereigntyAchStrategicAutonomy
      sovereigntyAchResilience
      sovereigntyAchSecurity
      sovereigntyAchControl
      components {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
        parentInfrastructure {
          id
          name
          sovereigntyAchStrategicAutonomy
          sovereigntyAchResilience
          sovereigntyAchSecurity
          sovereigntyAchControl
        }
      }
    }
    aiComponents(where: $aiComponentWhere) {
      id
      name
      sovereigntyAchStrategicAutonomy
      sovereigntyAchResilience
      sovereigntyAchSecurity
      sovereigntyAchControl
      usedByApplications {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchStrategicAutonomy
        sovereigntyAchResilience
        sovereigntyAchSecurity
        sovereigntyAchControl
        parentInfrastructure {
          id
          name
          sovereigntyAchStrategicAutonomy
          sovereigntyAchResilience
          sovereigntyAchSecurity
          sovereigntyAchControl
        }
      }
    }
    infrastructures(where: $infrastructureWhere) {
      id
      name
      sovereigntyAchStrategicAutonomy
      sovereigntyAchResilience
      sovereigntyAchSecurity
      sovereigntyAchControl
      parentInfrastructure {
        id
      }
    }
  }
`
