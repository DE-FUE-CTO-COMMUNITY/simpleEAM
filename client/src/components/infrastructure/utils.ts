'use client'

import { format } from 'date-fns'
import { InfrastructureType, InfrastructureStatus } from '../../gql/generated'

// Formatiert das Datum für die Anzeige
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm')
  } catch {
    return 'Unbekannt'
  }
}

// Gibt einen lesbaren deutschen Namen für den Infrastructure-Typ zurück
export const getInfrastructureTypeLabel = (type: InfrastructureType): string => {
  switch (type) {
    case InfrastructureType.CLOUD_DATACENTER:
      return 'Cloud-Rechenzentrum'
    case InfrastructureType.ON_PREMISE_DATACENTER:
      return 'On-Premise-Rechenzentrum'
    case InfrastructureType.KUBERNETES_CLUSTER:
      return 'Kubernetes-Cluster'
    case InfrastructureType.VIRTUALIZATION_CLUSTER:
      return 'Virtualisierungs-Cluster'
    case InfrastructureType.VIRTUAL_MACHINE:
      return 'Virtuelle Maschine'
    case InfrastructureType.CONTAINER_HOST:
      return 'Container-Host'
    case InfrastructureType.PHYSICAL_SERVER:
      return 'Physischer Server'
    default:
      return type
  }
}

// Gibt einen lesbaren deutschen Namen für den Infrastructure-Status zurück
export const getInfrastructureStatusLabel = (status: InfrastructureStatus): string => {
  switch (status) {
    case InfrastructureStatus.ACTIVE:
      return 'Aktiv'
    case InfrastructureStatus.INACTIVE:
      return 'Inaktiv'
    case InfrastructureStatus.MAINTENANCE:
      return 'Wartung'
    case InfrastructureStatus.PLANNED:
      return 'Geplant'
    case InfrastructureStatus.DECOMMISSIONED:
      return 'Außer Betrieb'
    case InfrastructureStatus.UNDER_CONSTRUCTION:
      return 'Im Aufbau'
    default:
      return status
  }
}

// Berechnet die Anzahl der aktiven Filter
export const countActiveFilters = (filterState: any): number => {
  if (!filterState) return 0
  
  const {
    statusFilter = [],
    typeFilter = [],
    costRangeFilter = [0, 1000000],
    vendorFilter = '',
    locationFilter = '',
    ownerFilter = '',
    descriptionFilter = '',
    updatedDateRange = ['', ''],
    operatingSystemFilter = '',
  } = filterState

  return (
    (statusFilter.length > 0 ? 1 : 0) +
    (typeFilter.length > 0 ? 1 : 0) +
    (costRangeFilter[0] > 0 || costRangeFilter[1] < 1000000 ? 1 : 0) +
    (vendorFilter ? 1 : 0) +
    (locationFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (descriptionFilter ? 1 : 0) +
    (updatedDateRange[0] || updatedDateRange[1] ? 1 : 0) +
    (operatingSystemFilter ? 1 : 0)
  )
}
