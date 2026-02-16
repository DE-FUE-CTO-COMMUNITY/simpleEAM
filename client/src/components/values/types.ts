import { Gea_Value } from '../../gql/generated'

export type ValueType = Pick<
  Gea_Value,
  | 'id'
  | 'name'
  | 'valueStatement'
  | 'owners'
  | 'company'
  | 'supportsMissions'
  | 'supportsMissionsConnection'
  | 'supportsVisions'
  | 'supportsVisionsConnection'
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
