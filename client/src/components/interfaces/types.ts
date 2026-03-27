'use client'

import {
  ApplicationInterface as GeneratedApplicationInterface,
  InterfaceType,
  InterfaceProtocol,
  InterfaceStatus,
} from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
export type ApplicationInterface = Pick<
  GeneratedApplicationInterface,
  | 'id'
  | 'name'
  | 'description'
  | 'interfaceType'
  | 'protocol'
  | 'version'
  | 'status'
  | 'introductionDate'
  | 'endOfLifeDate'
  | 'planningDate'
  | 'endOfUseDate'
  | 'owners'
  | 'sourceApplications'
  | 'targetApplications'
  | 'dataObjects'
  | 'predecessors'
  | 'successors'
  | 'partOfArchitectures'
  | 'depictedInDiagrams'
  | 'createdAt'
  | 'updatedAt'
>

export interface FilterState {
  interfaceTypeFilter: InterfaceType[]
  protocolFilter: InterfaceProtocol[]
  statusFilter: InterfaceStatus[]
  ownersFilter: string[]
  sourceApplicationsFilter: string[]
  targetApplicationsFilter: string[]
  dataObjectsFilter: string[]
  versionFilter: string
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableInterfaceTypes: InterfaceType[]
  availableProtocols: InterfaceProtocol[]
  availableStatuses: InterfaceStatus[]
  availableOwners: string[]
  availableSourceApplications: string[]
  availableTargetApplications: string[]
  availableDataObjects: string[]
  availableVersions: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
