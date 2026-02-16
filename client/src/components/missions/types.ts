import { Gea_Mission } from '../../gql/generated'

export type MissionType = Pick<
  Gea_Mission,
  | 'id'
  | 'name'
  | 'purposeStatement'
  | 'keywords'
  | 'year'
  | 'owners'
  | 'company'
  | 'supportedByVisions'
  | 'supportedByValues'
  | 'supportedByGoals'
  | 'partOfArchitectures'
  | 'depictedInDiagrams'
  | 'createdAt'
  | 'updatedAt'
>

export interface FilterState {
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
  yearRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
