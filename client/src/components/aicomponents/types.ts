// Types für AI Components Entity

'use client'

import {
  AiComponent as GeneratedAiComponent,
  AiComponentType,
  AiComponentStatus,
  Person,
  Company,
  BusinessCapability,
  Application,
  DataObject,
  Infrastructure,
} from '../../gql/generated'

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
export type AicomponentType = Pick<
  GeneratedAiComponent,
  | 'id'
  | 'name'
  | 'description'
  | 'aiType'
  | 'model'
  | 'version'
  | 'status'
  | 'accuracy'
  | 'trainingDate'
  | 'lastUpdated'
  | 'provider'
  | 'license'
  | 'costs'
  | 'tags'
  | 'createdAt'
  | 'updatedAt'
> & {
  owners?: Person[]
  company?: Company[]
  supportsCapabilities?: BusinessCapability[]
  usedByApplications?: Application[]
  trainedWithDataObjects?: DataObject[]
  hostedOn?: Infrastructure[]
}

// Form Values für AI Component Formulare
export interface AicomponentFormValues {
  name: string
  description?: string
  aiType: AiComponentType
  model?: string
  version?: string
  status: AiComponentStatus
  accuracy?: number
  trainingDate?: string
  lastUpdated?: string
  provider?: string
  license?: string
  costs?: number
  tags?: string[]
  ownerIds?: string[]
  companyIds?: string[]
  supportsCapabilityIds?: string[]
  usedByApplicationIds?: string[]
  trainedWithDataObjectIds?: string[]
  hostedOnIds?: string[]
}

export interface FilterState {
  aiTypeFilter: AiComponentType[]
  statusFilter: AiComponentStatus[]
  descriptionFilter: string
  providerFilter: string
  tagsFilter: string[]
  ownerFilter: string
  accuracyRange: [number, number]
  costsRange: [number, number]
  trainingDateRange: [string, string]
  lastUpdatedRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableAiTypes: AiComponentType[]
  availableStatuses: AiComponentStatus[]
  availableProviders: string[]
  availableTags: string[]
  availableOwners: Person[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
