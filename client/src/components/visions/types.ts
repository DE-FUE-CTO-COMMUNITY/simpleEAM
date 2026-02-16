import { Gea_Vision } from '../../gql/generated'

export type VisionType = Pick<
  Gea_Vision,
  | 'id'
  | 'name'
  | 'visionStatement'
  | 'timeHorizon'
  | 'year'
  | 'owners'
  | 'company'
  | 'supportsMissions'
  | 'supportsMissionsConnection'
  | 'supportedByValues'
  | 'supportedByValuesConnection'
  | 'supportedByGoals'
  | 'supportedByGoalsConnection'
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
