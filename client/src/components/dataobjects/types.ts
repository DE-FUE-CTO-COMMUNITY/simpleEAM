import { DataClassification, SovereigntyMaturity } from '../../gql/generated'

/**
 * Simplified version of Owner type for example data
 */
export interface SimplePerson {
  id: string
  firstName: string
  lastName: string
}

/**
 * Extended type for DataObjects with additional fields or adjusted types
 */
export interface DataObject {
  id: string
  name: string
  description?: string | null
  classification: DataClassification
  format?: string | null
  source?: string | null
  sovereigntyReqStrategicAutonomy?: SovereigntyMaturity | null
  sovereigntyReqResilience?: SovereigntyMaturity | null
  sovereigntyReqSecurity?: SovereigntyMaturity | null
  sovereigntyReqControl?: SovereigntyMaturity | null
  sovereigntyReqWeight?: number | null
  sovereigntyReqStrategicAutonomyRationale?: string | null
  owners: SimplePerson[]
  createdAt: string
  updatedAt?: string | null
}

/**
 * Type for form inputs for DataObjects
 */
export interface DataObjectFormValues {
  name: string
  description?: string
  classification: DataClassification
  format?: string
  source?: string
  sovereigntyReqStrategicAutonomy?: SovereigntyMaturity | null
  sovereigntyReqResilience?: SovereigntyMaturity | null
  sovereigntyReqSecurity?: SovereigntyMaturity | null
  sovereigntyReqControl?: SovereigntyMaturity | null
  sovereigntyReqWeight?: number | null
  sovereigntyReqStrategicAutonomyRationale?: string
  ownerId?: string
}

/**
 * Filter state for DataObjects
 */
export interface FilterState {
  classificationFilter: DataClassification[]
  formatFilter: string[]
  sourceFilter: string[]
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
}
