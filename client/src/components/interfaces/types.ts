'use client'

import {
  ApplicationInterface as GeneratedApplicationInterface,
  InterfaceType,
} from '../../gql/generated'

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
export type ApplicationInterface = Pick<
  GeneratedApplicationInterface,
  'id' | 'name' | 'description' | 'interfaceType' | 'createdAt' | 'updatedAt' | 'dataObjects'
>

export interface FilterState {
  interfaceTypeFilter: InterfaceType[]
  searchFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableInterfaceTypes: InterfaceType[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
