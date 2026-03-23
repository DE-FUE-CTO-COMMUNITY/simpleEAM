import { gql } from '@apollo/client/core'

export const GET_SOVEREIGNTY_CAPABILITY_DETAIL = gql`
  query GetSovereigntyCapabilityDetail($where: BusinessCapabilityWhere) {
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
  }
`

export const GET_SOVEREIGNTY_DATA_DETAIL = gql`
  query GetSovereigntyDataDetail($where: DataObjectWhere) {
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
  }
`
