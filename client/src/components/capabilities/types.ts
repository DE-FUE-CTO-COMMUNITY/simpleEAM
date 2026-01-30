import { BusinessCapability, CapabilityStatus } from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
export type Capability = Pick<
  BusinessCapability,
  | 'id'
  | 'name'
  | 'description'
  | 'maturityLevel'
  | 'status'
  | 'businessValue'
  | 'owners'
  | 'tags'
  | 'createdAt'
  | 'updatedAt'
  | 'children'
  | 'parents'
  | 'supportedByApplications'
  | 'partOfArchitectures'
>

export interface FilterState {
  statusFilter: CapabilityStatus[]
  maturityLevelFilter: string[]
  businessValueRange: [number, number]
  tagsFilter: string[]
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableStatuses: CapabilityStatus[]
  availableTags: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
