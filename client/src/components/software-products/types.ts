import { LifecycleStatus, SoftwareProduct } from '@/gql/generated'

export type SoftwareProductType = Pick<
  SoftwareProduct,
  | 'id'
  | 'name'
  | 'productFamily'
  | 'lifecycleStatus'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
  | 'developedBy'
  | 'providedBy'
  | 'maintainedBy'
  | 'versions'
  | 'usedByApplications'
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
