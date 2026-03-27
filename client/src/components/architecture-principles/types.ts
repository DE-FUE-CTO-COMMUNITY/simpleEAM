'use client'

import {
  ArchitecturePrinciple as GeneratedArchitecturePrinciple,
  PrincipleCategory,
  PrinciplePriority,
} from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
export type ArchitecturePrincipleType = Pick<
  GeneratedArchitecturePrinciple,
  | 'id'
  | 'name'
  | 'description'
  | 'category'
  | 'priority'
  | 'rationale'
  | 'implications'
  | 'tags'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
  | 'owners'
  | 'appliedInArchitectures'
  | 'implementedByApplications'
>

export interface FilterState {
  categoryFilter: PrincipleCategory[]
  priorityFilter: PrinciplePriority[]
  tagsFilter: string[]
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
  isActiveFilter: string | null // 'all', 'true', 'false'
}

export interface FilterProps {
  filterState: FilterState
  availableCategories: PrincipleCategory[]
  availablePriorities: PrinciplePriority[]
  availableTags: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
