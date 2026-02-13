'use client'

import {
  Supplier,
  SupplierType as SupplierTypeEnum,
  SupplierStatus,
  RiskClassification,
  StrategicImportance,
} from '../../gql/generated'

export type SupplierType = Supplier

export interface FilterState {
  supplierTypeFilter: SupplierTypeEnum[]
  statusFilter: SupplierStatus[]
  riskClassificationFilter: RiskClassification[]
  strategicImportanceFilter: StrategicImportance[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableSupplierTypes: SupplierTypeEnum[]
  availableStatuses: SupplierStatus[]
  availableRiskClassifications: RiskClassification[]
  availableStrategicImportances: StrategicImportance[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}

export interface SupplierFormValues {
  name: string
  description: string
  supplierType: SupplierTypeEnum
  status: SupplierStatus
  address?: string
  phone?: string
  email?: string
  website?: string
  primaryContactPerson?: string
  contractStartDate?: Date | null
  contractEndDate?: Date | null
  annualSpend?: number
  riskClassification?: RiskClassification
  strategicImportance?: StrategicImportance
  performanceRating?: number
  complianceCertifications?: string[]
  tags?: string[]
  providesApplicationIds?: string[]
  supportsApplicationIds?: string[]
  maintainsApplicationIds?: string[]
  providesInfrastructureIds?: string[]
  hostsInfrastructureIds?: string[]
  maintainsInfrastructureIds?: string[]
}
