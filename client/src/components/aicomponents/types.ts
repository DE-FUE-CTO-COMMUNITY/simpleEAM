// Types für AI Components Entity

'use client'

import {
  AiComponent as GeneratedAiComponent,
  AiComponentType,
  AiComponentStatus,
  Person,
  BusinessCapability,
  Application,
  DataObject,
  Infrastructure,
  Architecture,
  ArchitecturePrinciple,
  Diagram,
  Company,
} from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
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
  createdAt: Date
  updatedAt: Date
  owners?: Person[]
  company?: Company[]
  supportsCapabilities?: BusinessCapability[]
  usedByApplications?: Application[]
  trainedWithDataObjects?: DataObject[]
  hostedOn?: Infrastructure[]
  partOfArchitectures?: Architecture[]
  implementsPrinciples?: ArchitecturePrinciple[]
  depictedInDiagrams?: Diagram[]
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
  ownerId?: string
  supportsCapabilityIds?: string[]
  usedByApplicationIds?: string[]
  trainedWithDataObjectIds?: string[]
  hostedOnIds?: string[]
  partOfArchitectureIds?: string[]
  implementsPrincipleIds?: string[]
  depictedInDiagramIds?: string[]
}

// Column Visibility für Tables
export type AicomponentTableColumnId =
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
  | 'owners'
  | 'company'
  | 'supportsCapabilities'
  | 'usedByApplications'
  | 'trainedWithDataObjects'
  | 'hostedOn'
  | 'partOfArchitectures'
  | 'implementsPrinciples'
  | 'depictedInDiagrams'
  | 'createdAt'
  | 'updatedAt'
  | 'actions'

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
