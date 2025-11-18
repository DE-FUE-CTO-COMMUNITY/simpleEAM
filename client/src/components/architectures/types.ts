'use client'

import {
  Architecture as GeneratedArchitecture,
  ArchitectureDomain,
  ArchitectureType as GeneratedArchitectureType,
} from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
export type ArchitectureType = Pick<
  GeneratedArchitecture,
  | 'id'
  | 'name'
  | 'description'
  | 'domain'
  | 'type'
  | 'timestamp'
  | 'createdAt'
  | 'updatedAt'
  | 'tags'
  | 'owners'
  | 'containsApplications'
  | 'containsCapabilities'
  | 'containsDataObjects'
  | 'containsInterfaces'
  | 'diagrams'
  | 'childArchitectures'
  | 'parentArchitecture'
  | 'appliedPrinciples'
  | 'containsInfrastructure'
>

export interface FilterState {
  domainFilter: ArchitectureDomain[]
  typeFilter: GeneratedArchitectureType[]
  tagsFilter: string[]
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableDomains: ArchitectureDomain[]
  availableTypes: GeneratedArchitectureType[]
  availableTags: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
