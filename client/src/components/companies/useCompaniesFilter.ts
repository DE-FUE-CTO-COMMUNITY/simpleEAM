'use client'

import { useMemo } from 'react'
import { CompanyType, CompanyFilterState } from './types'
import { CompanySize } from '../../gql/generated'

interface UseCompanyFilterProps {
  companies: CompanyType[]
  filterState: CompanyFilterState
}

export const useCompanyFilter = ({ companies, filterState }: UseCompanyFilterProps) => {
  const { search, industry, size } = filterState

  // Filterfunktion für Company-spezifische Filter
  const filteredData = useMemo(() => {
    return companies.filter((company: CompanyType) => {
      // Such-Filter (Name, Beschreibung, Adresse)
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        const matchesName = company.name?.toLowerCase().includes(searchLower)
        const matchesDescription = company.description?.toLowerCase().includes(searchLower)
        const matchesAddress = company.address?.toLowerCase().includes(searchLower)
        const matchesIndustry = company.industry?.toLowerCase().includes(searchLower)

        if (!matchesName && !matchesDescription && !matchesAddress && !matchesIndustry) {
          return false
        }
      }

      // Branchen-Filter
      if (industry.length > 0) {
        if (!company.industry || !industry.includes(company.industry)) {
          return false
        }
      }

      // Unternehmensgrößen-Filter
      if (size.length > 0) {
        if (!company.size || !size.includes(company.size as CompanySize)) {
          return false
        }
      }

      return true
    })
  }, [companies, search, industry, size])

  return {
    filteredData,
    totalCount: companies.length,
    filteredCount: filteredData.length,
  }
}
