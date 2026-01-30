import { InfrastructureType, InfrastructureStatus } from '../../gql/generated'

/**
 * Simplified version of Owner type for example data
 */
export interface SimplePerson {
  id: string
  firstName: string
  lastName: string
}

/**
 * Extended type for Infrastructure with additional fields or adjusted types
 */
export interface Infrastructure {
  id: string
  name: string
  description?: string | null
  infrastructureType: InfrastructureType
  status: InfrastructureStatus
  vendor?: string | null
  version?: string | null
  capacity?: string | null
  location?: string | null
  ipAddress?: string | null
  operatingSystem?: string | null
  specifications?: string | null
  maintenanceWindow?: string | null
  costs?: number | null
  planningDate?: string | null
  introductionDate?: string | null
  endOfUseDate?: string | null
  endOfLifeDate?: string | null
  owners: SimplePerson[]
  createdAt: string
  updatedAt?: string | null
}

/**
 * Type for form inputs for Infrastructure
 */
export interface InfrastructureFormValues {
  name: string
  description?: string
  infrastructureType: InfrastructureType
  status: InfrastructureStatus
  vendor?: string
  version?: string
  capacity?: string
  location?: string
  ipAddress?: string
  operatingSystem?: string
  specifications?: string
  maintenanceWindow?: string
  costs?: number
  planningDate?: string
  introductionDate?: string
  endOfUseDate?: string
  endOfLifeDate?: string
  ownerId?: string
  parentInfrastructureId?: string
  childInfrastructureIds?: string[]
  hostsApplicationIds?: string[]
  partOfArchitectureIds?: string[]
  depictedInDiagramIds?: string[]
}

/**
 * Filter state for Infrastructure
 */
export interface FilterState {
  statusFilter: InfrastructureStatus[]
  typeFilter: InfrastructureType[]
  costRangeFilter: [number, number]
  vendorFilter: string
  locationFilter: string
  ownerFilter: string
  descriptionFilter: string
  updatedDateRange: [string, string]
  operatingSystemFilter: string
}
