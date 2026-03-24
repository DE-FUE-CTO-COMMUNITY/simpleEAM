import { HardwareProduct, LifecycleStatus } from '@/gql/generated'

export type HardwareProductType = Pick<
  HardwareProduct,
  | 'id'
  | 'name'
  | 'productFamily'
  | 'lifecycleStatus'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
  | 'manufacturedBy'
  | 'providedBy'
  | 'maintainedBy'
  | 'versions'
  | 'usedByInfrastructure'
>

export interface FilterState {
  nameFilter: string
  lifecycleStatusFilter: LifecycleStatus | ''
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
