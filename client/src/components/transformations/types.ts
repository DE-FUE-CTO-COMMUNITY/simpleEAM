'use client'

import {
  Transformation as GeneratedTransformation,
  TransformationImpactAction,
  TransformationPriority,
  TransformationStatus,
} from '../../gql/generated'

export interface IdName {
  id: string
  name: string
}

export interface ImpactRelation {
  id: string
  action: TransformationImpactAction
  notes: string
}

export type ImpactFieldKey =
  | 'capabilities'
  | 'applications'
  | 'aiComponents'
  | 'dataObjects'
  | 'interfaces'
  | 'infrastructure'
  | 'businessProcesses'

export interface TransformationImpactEdge {
  node?: { id: string; name: string } | null
  properties?: {
    action?: TransformationImpactAction | null
    notes?: string | null
  } | null
}

export type TransformationType = Pick<
  GeneratedTransformation,
  | 'id'
  | 'name'
  | 'description'
  | 'status'
  | 'targetDate'
  | 'startDate'
  | 'completionDate'
  | 'priority'
  | 'rationale'
  | 'expectedOutcome'
  | 'tags'
  | 'createdAt'
  | 'updatedAt'
  | 'owners'
  | 'sourceArchitecture'
  | 'targetArchitectures'
  | 'goals'
> & {
  impactsCapabilitiesConnection?: { edges?: TransformationImpactEdge[] | null } | null
  impactsApplicationsConnection?: { edges?: TransformationImpactEdge[] | null } | null
  impactsAIComponentsConnection?: { edges?: TransformationImpactEdge[] | null } | null
  impactsDataObjectsConnection?: { edges?: TransformationImpactEdge[] | null } | null
  impactsInterfacesConnection?: { edges?: TransformationImpactEdge[] | null } | null
  impactsInfrastructureConnection?: { edges?: TransformationImpactEdge[] | null } | null
  impactsBusinessProcessesConnection?: { edges?: TransformationImpactEdge[] | null } | null
}

export interface TransformationFormValues {
  name: string
  description: string
  status: TransformationStatus
  targetDate: Date | null
  startDate: Date | null
  completionDate: Date | null
  priority: '' | TransformationPriority
  rationale: string
  expectedOutcome: string
  tags: string
  ownerId: string
  sourceArchitectureId: string
  targetArchitectureIds: string[]
  goalIds: string[]
  impactsCapabilities: ImpactRelation[]
  impactsApplications: ImpactRelation[]
  impactsAIComponents: ImpactRelation[]
  impactsDataObjects: ImpactRelation[]
  impactsInterfaces: ImpactRelation[]
  impactsInfrastructure: ImpactRelation[]
  impactsBusinessProcesses: ImpactRelation[]
}

export interface FilterState {
  statusFilter: TransformationStatus[]
  priorityFilter: TransformationPriority[]
  ownerFilter: string
  sourceArchitectureFilter: string
  goalFilter: string
  tagsFilter: string[]
  targetDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableStatuses: TransformationStatus[]
  availablePriorities: TransformationPriority[]
  availableArchitectures: IdName[]
  availableGoals: IdName[]
  availableTags: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
