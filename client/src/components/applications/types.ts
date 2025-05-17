import { Application, ApplicationStatus, CriticalityLevel } from '../../gql/generated'

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
export type ApplicationType = Pick<
  Application,
  | 'id'
  | 'name'
  | 'description'
  | 'status'
  | 'criticality'
  | 'costs'
  | 'vendor'
  | 'version'
  | 'hostingEnvironment'
  | 'technologyStack'
  | 'introductionDate'
  | 'endOfLifeDate'
  | 'owners'
  | 'createdAt'
  | 'updatedAt'
  | 'supportsCapabilities'
  | 'usesDataObjects'
  | 'interfacesToApplications'
  | 'partOfArchitectures'
>

export interface FilterState {
  statusFilter: ApplicationStatus[]
  criticalityFilter: CriticalityLevel[]
  costRangeFilter: [number, number]
  technologyStackFilter: string[]
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
  vendorFilter: string
}

export interface FilterProps {
  filterState: FilterState
  availableStatuses: ApplicationStatus[]
  availableCriticalities: CriticalityLevel[]
  availableTechStack: string[]
  availableVendors: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
