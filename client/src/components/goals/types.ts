import { Gea_Goal } from '../../gql/generated'

export type GoalType = Pick<
  Gea_Goal,
  | 'id'
  | 'name'
  | 'goalStatement'
  | 'owners'
  | 'company'
  | 'operationalizesVisions'
  | 'supportsValues'
  | 'achievedByStrategies'
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
