'use client'

import { Person as GeneratedPerson } from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
export type Person = Pick<
  GeneratedPerson,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'department'
  | 'role'
  | 'phone'
  | 'createdAt'
  | 'updatedAt'
  | 'ownedCapabilities'
  | 'ownedApplications'
  | 'ownedDataObjects'
  | 'ownedArchitectures'
  | 'ownedDiagrams'
  | 'ownedInfrastructure'
  | 'ownedInterfaces'
> & {
  // API returns `companies` even though generated base type uses `company`
  companies?: Array<{ id: string; name: string }>
}

export interface FilterState {
  departmentFilter: string[]
  roleFilter: string[]
  searchFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableDepartments: string[]
  availableRoles: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
