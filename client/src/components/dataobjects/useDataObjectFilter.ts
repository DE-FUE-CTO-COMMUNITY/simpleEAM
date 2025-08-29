'use client'

import { useMemo, useState } from 'react'
import { DataObject, FilterState } from './types'
import { DataClassification } from '../../gql/generated'

interface UseDataObjectFilterProps {
  dataobjects: DataObject[]
  filterState?: FilterState
}

export const useDataObjectFilter = ({ dataobjects = [] }: UseDataObjectFilterProps) => {
  // Standardzustand für Filter
  const [filterState, setFilterState] = useState<FilterState>({
    classificationFilter: [],
    formatFilter: [],
    sourceFilter: [],
    descriptionFilter: '',
    ownerFilter: '',
    updatedDateRange: ['', ''],
  })

  // Filterfunktion für erweiterte Filter
  const filteredDataObjects = useMemo(() => {
    return dataobjects.filter((dataobject: DataObject) => {
      // Klassifikation Filter
      if (
        filterState.classificationFilter.length > 0 &&
        !filterState.classificationFilter.includes(dataobject.classification)
      ) {
        return false
      }

      // Format Filter
      if (filterState.formatFilter.length > 0) {
        if (!dataobject.format || !filterState.formatFilter.includes(dataobject.format)) {
          return false
        }
      }

      // Source Filter
      if (filterState.sourceFilter.length > 0) {
        if (!dataobject.source || !filterState.sourceFilter.includes(dataobject.source)) {
          return false
        }
      }

      // Beschreibung Filter
      if (
        filterState.descriptionFilter &&
        (!dataobject.description ||
          !dataobject.description.toLowerCase().includes(filterState.descriptionFilter.toLowerCase()))
      ) {
        return false
      }

      // Verantwortlicher Filter
      if (filterState.ownerFilter && dataobject.owners && dataobject.owners.length > 0) {
        const ownerMatch = dataobject.owners.some(owner => {
          const ownerFullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
          return ownerFullName.includes(filterState.ownerFilter.toLowerCase())
        })
        if (!ownerMatch) {
          return false
        }
      }

      // Aktualisiert Datumsbereich Filter
      if (filterState.updatedDateRange[0] && dataobject.updatedAt) {
        const startDate = new Date(filterState.updatedDateRange[0])
        const updatedDate = new Date(dataobject.updatedAt)
        if (updatedDate < startDate) {
          return false
        }
      }

      if (filterState.updatedDateRange[1] && dataobject.updatedAt) {
        const endDate = new Date(filterState.updatedDateRange[1])
        endDate.setHours(23, 59, 59, 999) // Ende des Tages
        const updatedDate = new Date(dataobject.updatedAt)
        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [
    dataobjects,
    filterState.classificationFilter,
    filterState.formatFilter,
    filterState.sourceFilter,
    filterState.descriptionFilter,
    filterState.ownerFilter,
    filterState.updatedDateRange,
  ])

  // Alle verfügbaren Klassifikationen extrahieren
  const availableClassifications = useMemo(() => {
    const classifications = dataobjects
      .map(obj => obj.classification)
      .filter(
        (classification, index, self) =>
          classification !== null && classification !== undefined && self.indexOf(classification) === index
      ) as DataClassification[]

    return classifications.sort()
  }, [dataobjects])

  // Alle verfügbaren Formate extrahieren
  const availableFormats = useMemo(() => {
    const formats = dataobjects
      .map(obj => obj.format)
      .filter(
        (format, index, self) =>
          format !== null && format !== undefined && self.indexOf(format) === index
      ) as string[]

    return formats.sort()
  }, [dataobjects])

  // Alle verfügbaren Sources extrahieren
  const availableSources = useMemo(() => {
    const sources = dataobjects
      .map(obj => obj.source)
      .filter(
        (source, index, self) =>
          source !== null && source !== undefined && self.indexOf(source) === index
      ) as string[]

    return sources.sort()
  }, [dataobjects])

  // Reset-Funktion für Filter
  const resetFilters = () => {
    setFilterState({
      classificationFilter: [],
      formatFilter: [],
      sourceFilter: [],
      descriptionFilter: '',
      ownerFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredDataObjects,
    resetFilters,
    availableClassifications,
    availableFormats,
    availableSources,
  }
}
