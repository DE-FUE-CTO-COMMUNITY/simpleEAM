import { z } from 'zod'
import {
  Application,
  ApplicationStatus,
  CriticalityLevel,
  TimeCategory,
  SevenRStrategy,
} from '../../gql/generated'
import { isValidCombination } from './timeCategoryDependencies'

// Base schema ohne cross-field validation
export const baseApplicationSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  status: z.nativeEnum(ApplicationStatus),
  criticality: z.nativeEnum(CriticalityLevel),
  costs: z.number().min(0, 'Kosten müssen positiv sein'),
  vendor: z.string().optional(),
  version: z.string().optional(),
  hostingEnvironment: z.string().optional(),
  technologyStack: z.array(z.string()).default([]),
  introductionDate: z.string().optional(),
  endOfLifeDate: z.string().optional(),
  planningDate: z.string().optional(),
  endOfUseDate: z.string().optional(),
  timeCategory: z.nativeEnum(TimeCategory).optional(),
  sevenRStrategy: z.nativeEnum(SevenRStrategy).optional(),
})

// Schema mit cross-field validation
export const applicationSchema = baseApplicationSchema.refine(
  data => {
    if (data.timeCategory && data.sevenRStrategy) {
      return isValidCombination(data.timeCategory, data.sevenRStrategy)
    }
    return true
  },
  {
    message: 'Ungültige Kombination von TIME-Kategorie und 7R-Strategie',
    path: ['sevenRStrategy'], // Error wird bei sevenRStrategy angezeigt
  }
)

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
  | 'planningDate'
  | 'endOfUseDate'
  | 'owners'
  | 'createdAt'
  | 'updatedAt'
  | 'supportsCapabilities'
  | 'usesDataObjects'
  | 'sourceOfInterfaces'
  | 'targetOfInterfaces'
  | 'partOfArchitectures'
  | 'depictedInDiagrams'
  | 'parents'
  | 'components'
  | 'timeCategory'
  | 'sevenRStrategy'
  | 'implementsPrinciples'
  | 'hostedOn'
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
  timeCategoryFilter: TimeCategory[]
  sevenRStrategyFilter: SevenRStrategy[]
  hostedOnFilter: string[]
}

export interface FilterProps {
  filterState: FilterState
  availableStatuses: ApplicationStatus[]
  availableCriticalities: CriticalityLevel[]
  availableTechStack: string[]
  availableVendors: string[]
  availableTimeCategories: TimeCategory[]
  availableSevenRStrategies: SevenRStrategy[]
  availableInfrastructures: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}
