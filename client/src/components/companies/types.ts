// Template for entity types
// companies = plural (companies, capabilities, etc.)
// company = singular (company, capability, etc.)
// Companies = plural capitalized (Companies, Capabilities, etc.)
// Company = singular capitalized (Company, Capability, etc.)

'use client'

import { Company as GeneratedCompany, CompanySize } from '../../gql/generated'

// Use the generated type as basis and adapt it for our components
export type CompanyType = Pick<
  GeneratedCompany,
  | 'id'
  | 'name'
  | 'description'
  | 'address'
  | 'industry'
  | 'website'
  | 'size'
  | 'createdAt'
  | 'updatedAt'
  | 'employees'
>

export interface FilterState {
  // Grundlegende Text-Filter
  nameFilter: string
  descriptionFilter: string
  industryFilter: string
  addressFilter: string
  websiteFilter: string

  // Enum-Filter
  sizeFilter: CompanySize[]

  // Datum-Filter
  createdDateRange: [string, string] | null
  updatedDateRange: [string, string] | null
}

export interface FilterProps {
  filterState: FilterState
  availableSizes: CompanySize[]
  availableIndustries: string[]
  onFilterChange: (newFilter: Partial<FilterState>) => void
  onResetFilter: () => void
  onClose: () => void
  onApply: (activeCount: number) => void
}

export interface CompanyFormValues {
  name: string
  description?: string
  address?: string
  industry?: string
  website?: string
  size?: CompanySize
  employees?: string[] // IDs der zugeordneten Personen
}
