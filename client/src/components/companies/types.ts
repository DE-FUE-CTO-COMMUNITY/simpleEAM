import { z } from 'zod'
import { Company, CompanySize } from '../../gql/generated'

// Base schema für Company validation
export const baseCompanySchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Gültige URL erforderlich').optional().or(z.literal('')),
  industry: z.string().optional(),
  size: z.nativeEnum(CompanySize).optional(),
})

// Company schema ohne additional validation (kann später erweitert werden)
export const companySchema = baseCompanySchema

// Nutze den generierten Company-Typ als Basis
export type CompanyType = Pick<
  Company,
  | 'id'
  | 'name'
  | 'description'
  | 'address'
  | 'website'
  | 'industry'
  | 'size'
  | 'createdAt'
  | 'updatedAt'
>

// Form Values für das Company-Formular
export type CompanyFormValues = z.infer<typeof companySchema>

// Filter State für Company-Filter
export interface CompanyFilterState {
  search: string
  industry: string[]
  size: CompanySize[]
  showAdvanced: boolean
}

// Initial filter state
export const initialCompanyFilterState: CompanyFilterState = {
  search: '',
  industry: [],
  size: [],
  showAdvanced: false,
}

// Helper type für Table columns
export interface CompanyTableColumn {
  key: keyof CompanyType | 'actions'
  label: string
  sortable?: boolean
  filterable?: boolean
}

// Default form values
export const defaultCompanyFormValues: CompanyFormValues = {
  name: '',
  description: '',
  address: '',
  website: '',
  industry: '',
  size: undefined,
}
