'use client'

import {
  Architecture as GeneratedArchitecture,
  ArchitectureDomain,
  ArchitectureType as GeneratedArchitectureType,
} from '../../gql/generated'

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
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
  | 'diagrams'
  | 'childArchitectures'
  | 'parentArchitecture'
  | 'appliedPrinciples'
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
