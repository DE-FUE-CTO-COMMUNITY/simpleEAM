import { Gea_Strategy } from '../../gql/generated'

export type StrategyType = Pick<
  Gea_Strategy,
  | 'id'
  | 'name'
  | 'description'
  | 'owners'
  | 'company'
  | 'achievesGoals'
  | 'achievesGoalsConnection'
  | 'partOfArchitectures'
  | 'depictedInDiagrams'
  | 'createdAt'
  | 'updatedAt'
>

export interface FilterState {
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
