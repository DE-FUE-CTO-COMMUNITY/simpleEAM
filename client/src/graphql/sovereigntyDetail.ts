import { gql } from '@apollo/client/core'

export const GET_SOVEREIGNTY_CAPABILITY_DETAIL = gql`
  query GetSovereigntyCapabilityDetail(
    $where: BusinessCapabilityWhere
    $applicationWhere: ApplicationWhere
    $aiComponentWhere: AIComponentWhere
  ) {
    businessCapabilities(where: $where) {
      id
      name
      sovereigntyReqDataResidency
      sovereigntyReqJurisdictionControl
      sovereigntyReqOperationalControl
      sovereigntyReqInteroperability
      sovereigntyReqPortability
      sovereigntyReqSupplyChainTransparency
      sovereigntyReqWeight
      supportedByApplications {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
      }
      supportedByAIComponents {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
      }
    }
    applications(where: $applicationWhere) {
      id
      name
      sovereigntyAchDataResidency
      sovereigntyAchJurisdictionControl
      sovereigntyAchOperationalControl
      sovereigntyAchInteroperability
      sovereigntyAchPortability
      sovereigntyAchSupplyChainTransparency
      components {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
        parentInfrastructure {
          id
          name
          sovereigntyAchDataResidency
          sovereigntyAchJurisdictionControl
          sovereigntyAchOperationalControl
          sovereigntyAchInteroperability
          sovereigntyAchPortability
          sovereigntyAchSupplyChainTransparency
        }
      }
    }
    aiComponents(where: $aiComponentWhere) {
      id
      name
      sovereigntyAchDataResidency
      sovereigntyAchJurisdictionControl
      sovereigntyAchOperationalControl
      sovereigntyAchInteroperability
      sovereigntyAchPortability
      sovereigntyAchSupplyChainTransparency
      usedByApplications {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
        parentInfrastructure {
          id
          name
          sovereigntyAchDataResidency
          sovereigntyAchJurisdictionControl
          sovereigntyAchOperationalControl
          sovereigntyAchInteroperability
          sovereigntyAchPortability
          sovereigntyAchSupplyChainTransparency
        }
      }
    }
  }
`

export const GET_SOVEREIGNTY_DATA_DETAIL = gql`
  query GetSovereigntyDataDetail(
    $where: DataObjectWhere
    $applicationWhere: ApplicationWhere
    $aiComponentWhere: AIComponentWhere
  ) {
    dataObjects(where: $where) {
      id
      name
      sovereigntyReqDataResidency
      sovereigntyReqJurisdictionControl
      sovereigntyReqOperationalControl
      sovereigntyReqInteroperability
      sovereigntyReqPortability
      sovereigntyReqSupplyChainTransparency
      sovereigntyReqWeight
      usedByApplications {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
      }
    }
    applications(where: $applicationWhere) {
      id
      name
      sovereigntyAchDataResidency
      sovereigntyAchJurisdictionControl
      sovereigntyAchOperationalControl
      sovereigntyAchInteroperability
      sovereigntyAchPortability
      sovereigntyAchSupplyChainTransparency
      components {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
        parentInfrastructure {
          id
          name
          sovereigntyAchDataResidency
          sovereigntyAchJurisdictionControl
          sovereigntyAchOperationalControl
          sovereigntyAchInteroperability
          sovereigntyAchPortability
          sovereigntyAchSupplyChainTransparency
        }
      }
    }
    aiComponents(where: $aiComponentWhere) {
      id
      name
      sovereigntyAchDataResidency
      sovereigntyAchJurisdictionControl
      sovereigntyAchOperationalControl
      sovereigntyAchInteroperability
      sovereigntyAchPortability
      sovereigntyAchSupplyChainTransparency
      usedByApplications {
        id
      }
      hostedOn {
        id
        name
        sovereigntyAchDataResidency
        sovereigntyAchJurisdictionControl
        sovereigntyAchOperationalControl
        sovereigntyAchInteroperability
        sovereigntyAchPortability
        sovereigntyAchSupplyChainTransparency
        parentInfrastructure {
          id
          name
          sovereigntyAchDataResidency
          sovereigntyAchJurisdictionControl
          sovereigntyAchOperationalControl
          sovereigntyAchInteroperability
          sovereigntyAchPortability
          sovereigntyAchSupplyChainTransparency
        }
      }
    }
  }
`
