import { HardwareVersion } from '@/gql/generated'

export type HardwareVersionType = Pick<
  HardwareVersion,
  | 'id'
  | 'versionModelString'
  | 'normalizedVersionModel'
  | 'releaseChannel'
  | 'supportTier'
  | 'createdAt'
  | 'updatedAt'
  | 'hardwareProduct'
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
