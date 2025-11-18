'use client'

import { useMemo, useState } from 'react'
import { CompanyType, FilterState } from './types'

interface UseCompanyFilterProps {
  companies: CompanyType[]
  filterState?: FilterState
}

export const useCompanyFilter = ({ companies = [] }: UseCompanyFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    nameFilter: '',
    descriptionFilter: '',
    industryFilter: '',
    addressFilter: '',
    websiteFilter: '',
    sizeFilter: [],
    createdDateRange: null,
    updatedDateRange: null,
  })

  // Filter function for advanced filters
  const filteredCompanies = useMemo(() => {
    return companies.filter((company: CompanyType) => {
      // Name-Filter
      if (
        filterState.nameFilter &&
        !company.name.toLowerCase().includes(filterState.nameFilter.toLowerCase())
      ) {
        return false
      }

      // Beschreibungs-Filter
      if (
        filterState.descriptionFilter &&
        (!company.description ||
          !company.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Industry-Filter
      if (
        filterState.industryFilter &&
        (!company.industry ||
          !company.industry.toLowerCase().includes(filterState.industryFilter.toLowerCase()))
      ) {
        return false
      }

      // Address-Filter
      if (
        filterState.addressFilter &&
        (!company.address ||
          !company.address.toLowerCase().includes(filterState.addressFilter.toLowerCase()))
      ) {
        return false
      }

      // Website-Filter
      if (
        filterState.websiteFilter &&
        (!company.website ||
          !company.website.toLowerCase().includes(filterState.websiteFilter.toLowerCase()))
      ) {
        return false
      }

      // Size-Filter
      if (filterState.sizeFilter.length > 0 && company.size) {
        if (!filterState.sizeFilter.includes(company.size)) {
          return false
        }
      }

      // Created Date Range Filter
      if (filterState.createdDateRange) {
        const createdDate = new Date(company.createdAt)
        const [startDate, endDate] = filterState.createdDateRange
        if (createdDate < new Date(startDate) || createdDate > new Date(endDate)) {
          return false
        }
      }

      // Updated Date Range Filter
      if (filterState.updatedDateRange && company.updatedAt) {
        const updatedDate = new Date(company.updatedAt)
        const [startDate, endDate] = filterState.updatedDateRange
        if (updatedDate < new Date(startDate) || updatedDate > new Date(endDate)) {
          return false
        }
      }

      return true
    })
  }, [companies, filterState])

  const resetFilters = () => {
    setFilterState({
      nameFilter: '',
      descriptionFilter: '',
      industryFilter: '',
      addressFilter: '',
      websiteFilter: '',
      sizeFilter: [],
      createdDateRange: null,
      updatedDateRange: null,
    })
  }

  return {
    filterState,
    setFilterState,
    filteredCompanies,
    resetFilters,
  }
}
