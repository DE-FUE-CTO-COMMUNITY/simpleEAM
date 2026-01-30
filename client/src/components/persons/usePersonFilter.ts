'use client'

import { useMemo, useState } from 'react'
import { Person, FilterState } from './types'

interface UsePersonFilterProps {
  persons: Person[]
  filterState?: FilterState
}

export const usePersonFilter = ({ persons = [] }: UsePersonFilterProps) => {
  // Default state for filters
  const [filterState, setFilterState] = useState<FilterState>({
    departmentFilter: [],
    roleFilter: [],
    searchFilter: '',
    updatedDateRange: ['', ''],
  })

  // Verfügbare Abteilungen und Rollen aus den Daten extrahieren
  const availableDepartments = useMemo(() => {
    const departments = new Set<string>()

    persons.forEach(person => {
      if (person.department) {
        departments.add(person.department)
      }
    })

    return Array.from(departments)
  }, [persons])

  const availableRoles = useMemo(() => {
    const roles = new Set<string>()

    persons.forEach(person => {
      if (person.role) {
        roles.add(person.role)
      }
    })

    return Array.from(roles)
  }, [persons])

  // Filter function for advanced filters
  const filteredPersons = useMemo(() => {
    const { departmentFilter, roleFilter, searchFilter, updatedDateRange } = filterState

    return persons.filter((person: Person) => {
      // Abteilungsfilter
      if (
        departmentFilter.length > 0 &&
        person.department &&
        !departmentFilter.includes(person.department)
      ) {
        return false
      }

      // Rollenfilter
      if (roleFilter.length > 0 && person.role && !roleFilter.includes(person.role)) {
        return false
      }

      // Suchfilter (für Name und E-Mail)
      if (searchFilter && searchFilter.trim() !== '') {
        const fullName = `${person.firstName} ${person.lastName}`.toLowerCase()
        const email = (person.email || '').toLowerCase()
        const searchTerm = searchFilter.toLowerCase()

        if (!fullName.includes(searchTerm) && !email.includes(searchTerm)) {
          return false
        }
      }

      // Aktualisierungsdatum-Bereich
      const [startDateStr, endDateStr] = updatedDateRange

      if (startDateStr && person.updatedAt) {
        const startDate = new Date(startDateStr)
        const updatedDate = new Date(person.updatedAt)

        if (updatedDate < startDate) {
          return false
        }
      }

      if (endDateStr && person.updatedAt) {
        const endDate = new Date(endDateStr)
        // Set end of day for end time
        endDate.setHours(23, 59, 59, 999)
        const updatedDate = new Date(person.updatedAt)

        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [persons, filterState])

  const resetFilters = () => {
    setFilterState({
      departmentFilter: [],
      roleFilter: [],
      searchFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredPersons,
    resetFilters,
    availableDepartments,
    availableRoles,
  }
}
