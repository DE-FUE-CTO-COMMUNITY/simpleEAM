'use client'

import {
  ApplicationInterface as GeneratedApplicationInterface,
  InterfaceType,
  InterfaceProtocol,
  InterfaceStatus,
} from '../../gql/generated'

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
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
  | 'responsiblePerson'
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
  responsiblePersonFilter: string[]
  sourceApplicationsFilter: string[]
  targetApplicationsFilter: string[]
  dataObjectsFilter: string[]
  versionFilter: string
  searchFilter: string
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableInterfaceTypes: InterfaceType[]
  availableProtocols: InterfaceProtocol[]
  availableStatuses: InterfaceStatus[]
  availableResponsiblePersons: string[]
  availableSourceApplications: string[]
  availableTargetApplications: string[]
  availableDataObjects: string[]
  availableVersions: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
