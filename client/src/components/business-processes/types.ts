'use client'

import { z } from 'zod'
import {
  BusinessProcess,
  ProcessStatus,
  ProcessType,
  SovereigntyMaturity,
} from '../../gql/generated'

export const businessProcessSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(2000).optional(),
  processType: z.nativeEnum(ProcessType),
  status: z.nativeEnum(ProcessStatus),
  maturityLevel: z.number().min(1).max(5).optional().nullable(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  ownerId: z.string().optional(),
  parentProcessId: z.string().optional(),
  supportsCapabilityIds: z.array(z.string()).optional(),
  supportedByApplicationIds: z.array(z.string()).optional(),
  partOfArchitectures: z.array(z.string()).optional(),
  depictedInDiagrams: z.array(z.string()).optional(),
  sovereigntyReqDataResidency: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
  sovereigntyReqJurisdictionControl: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
  sovereigntyReqOperationalControl: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
  sovereigntyReqInteroperability: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
  sovereigntyReqPortability: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
  sovereigntyReqSupplyChainTransparency: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
  sovereigntyReqWeight: z.number().optional().nullable(),
  sovereigntyReqRationale: z.string().optional().nullable(),
})

export type BusinessProcessFormValues = z.infer<typeof businessProcessSchema>

export type BusinessProcessType = Pick<
  BusinessProcess,
  | 'id'
  | 'name'
  | 'description'
  | 'processType'
  | 'status'
  | 'maturityLevel'
  | 'category'
  | 'tags'
  | 'bpmnXml'
  | 'owners'
  | 'parentProcess'
  | 'childProcesses'
  | 'supportsCapabilities'
  | 'supportedByApplications'
  | 'partOfArchitectures'
  | 'depictedInDiagrams'
  | 'sovereigntyReqDataResidency'
  | 'sovereigntyReqJurisdictionControl'
  | 'sovereigntyReqOperationalControl'
  | 'sovereigntyReqInteroperability'
  | 'sovereigntyReqPortability'
  | 'sovereigntyReqSupplyChainTransparency'
  | 'sovereigntyReqWeight'
  | 'sovereigntyReqRationale'
  | 'createdAt'
  | 'updatedAt'
>

export interface FilterState {
  statusFilter: ProcessStatus[]
  processTypeFilter: ProcessType[]
  categoryFilter: string
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
}

export interface FilterProps {
  filterState: FilterState
  availableStatuses: ProcessStatus[]
  availableProcessTypes: ProcessType[]
  availableCategories: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
