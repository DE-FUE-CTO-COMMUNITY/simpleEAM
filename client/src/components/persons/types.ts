'use client'

import { Person as GeneratedPerson } from '../../gql/generated'

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
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
>

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
