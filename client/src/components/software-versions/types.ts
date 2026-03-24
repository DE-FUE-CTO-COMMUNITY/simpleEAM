import { SoftwareVersion } from '@/gql/generated'

export type SoftwareVersionType = Pick<
  SoftwareVersion,
  | 'id'
  | 'versionString'
  | 'normalizedVersion'
  | 'releaseChannel'
  | 'isLts'
  | 'supportTier'
  | 'createdAt'
  | 'updatedAt'
  | 'softwareProduct'
  | 'lifecycleRecords'
>

export interface FilterState {
  versionFilter: string
  productIdFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
  availableProducts: Array<{ value: string; label: string }>
}
