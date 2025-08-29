'use client'

import { useMemo, useState } from 'react'
import { DataObject } from '../../gql/generated'

// Export the dialog filter state structure to match existing interface
export interface DataObjectFilterState {
  classifications: string[]
  formats: string[]
  sources: string[]
  owners: string[]
  usedByApplications: string[]
  relatedToCapabilities: string[]
  partOfArchitectures: string[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

interface UseDataObjectFilterProps {
  dataobjects: DataObject[]
}

export const useDataObjectFilter = ({ dataobjects = [] }: UseDataObjectFilterProps) => {
  // Pattern 2: Internal useState for filter state management
  const [filterState, setFilterState] = useState<DataObjectFilterState>({
    classifications: [],
    formats: [],
    sources: [],
    owners: [],
    usedByApplications: [],
    relatedToCapabilities: [],
    partOfArchitectures: [],
    descriptionFilter: '',
    updatedDateRange: ['', ''],
  })

  // Filter function for advanced filters
  const filteredDataObjects = useMemo(() => {
    return dataobjects.filter((dataobject: DataObject) => {
      // Classification Filter
      if (
        filterState.classifications.length > 0 &&
        !filterState.classifications.includes(dataobject.classification)
      ) {
        return false
      }

      // Format Filter
      if (filterState.formats.length > 0) {
        if (!dataobject.format || !filterState.formats.includes(dataobject.format)) {
          return false
        }
      }

      // Description Filter
      if (filterState.descriptionFilter) {
        const descriptionMatch = dataobject.description
          ?.toLowerCase()
          .includes(filterState.descriptionFilter.toLowerCase())
        if (!descriptionMatch) {
          return false
        }
      }

      // Owner Filter
      if (filterState.owners.length > 0 && dataobject.owners && dataobject.owners.length > 0) {
        const ownerMatch = dataobject.owners.some(owner => {
          const ownerFullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
          return filterState.owners.some(filterOwner => 
            ownerFullName.includes(filterOwner.toLowerCase())
          )
        })
        if (!ownerMatch) {
          return false
        }
      }

      // Sources Filter (dataSources)
      if (filterState.sources.length > 0) {
        if (!dataobject.dataSources || dataobject.dataSources.length === 0) {
          return false
        }
        const sourceMatch = dataobject.dataSources.some(source =>
          filterState.sources.includes(source.name)
        )
        if (!sourceMatch) {
          return false
        }
      }

      // Used By Applications Filter
      if (filterState.usedByApplications.length > 0) {
        if (!dataobject.usedByApplications || dataobject.usedByApplications.length === 0) {
          return false
        }
        const usedByAppMatch = dataobject.usedByApplications.some(app =>
          filterState.usedByApplications.includes(app.name)
        )
        if (!usedByAppMatch) {
          return false
        }
      }

      // Related To Capabilities Filter
      if (filterState.relatedToCapabilities.length > 0) {
        if (!dataobject.relatedToCapabilities || dataobject.relatedToCapabilities.length === 0) {
          return false
        }
        const relatedToCapMatch = dataobject.relatedToCapabilities.some(capability =>
          filterState.relatedToCapabilities.includes(capability.name)
        )
        if (!relatedToCapMatch) {
          return false
        }
      }

      // Part Of Architectures Filter
      if (filterState.partOfArchitectures.length > 0) {
        if (!dataobject.partOfArchitectures || dataobject.partOfArchitectures.length === 0) {
          return false
        }
        const partOfArchMatch = dataobject.partOfArchitectures.some(architecture =>
          filterState.partOfArchitectures.includes(architecture.name)
        )
        if (!partOfArchMatch) {
          return false
        }
      }

      // Updated Date Range Filter
      if (filterState.updatedDateRange[0] || filterState.updatedDateRange[1]) {
        const updatedDate = new Date(dataobject.updatedAt)
        if (filterState.updatedDateRange[0]) {
          const startDate = new Date(filterState.updatedDateRange[0])
          if (updatedDate < startDate) {
            return false
          }
        }
        if (filterState.updatedDateRange[1]) {
          const endDate = new Date(filterState.updatedDateRange[1])
          if (updatedDate > endDate) {
            return false
          }
        }
      }

      return true
    })
  }, [
    dataobjects,
    filterState.classifications,
    filterState.formats,
    filterState.sources,
    filterState.descriptionFilter,
    filterState.owners,
    filterState.usedByApplications,
    filterState.relatedToCapabilities,
    filterState.partOfArchitectures,
    filterState.updatedDateRange,
  ])

  // Extract all available classifications
  const availableClassifications = useMemo(() => {
    const classifications = dataobjects
      .map(obj => obj.classification)
      .filter(
        (classification, index, self) =>
          classification !== null && classification !== undefined && self.indexOf(classification) === index
      ) as string[]

    return classifications.sort()
  }, [dataobjects])

  // Extract all available formats
  const availableFormats = useMemo(() => {
    const formats = dataobjects
      .map(obj => obj.format)
      .filter(
        (format, index, self) =>
          format !== null && format !== undefined && self.indexOf(format) === index
      ) as string[]

    return formats.sort()
  }, [dataobjects])

  // Extract all available sources (dataSources)
  const availableSources = useMemo(() => {
    const sources = new Set<string>()
    dataobjects.forEach(obj => {
      if (obj.dataSources) {
        obj.dataSources.forEach(source => sources.add(source.name))
      }
    })
    return Array.from(sources).sort()
  }, [dataobjects])

  // Extract all available used by applications
  const availableUsedByApplications = useMemo(() => {
    const applications = new Set<string>()
    dataobjects.forEach(obj => {
      if (obj.usedByApplications) {
        obj.usedByApplications.forEach(app => applications.add(app.name))
      }
    })
    return Array.from(applications).sort()
  }, [dataobjects])

  // Extract all available related capabilities
  const availableRelatedToCapabilities = useMemo(() => {
    const capabilities = new Set<string>()
    dataobjects.forEach(obj => {
      if (obj.relatedToCapabilities) {
        obj.relatedToCapabilities.forEach(cap => capabilities.add(cap.name))
      }
    })
    return Array.from(capabilities).sort()
  }, [dataobjects])

  // Extract all available architectures
  const availablePartOfArchitectures = useMemo(() => {
    const architectures = new Set<string>()
    dataobjects.forEach(obj => {
      if (obj.partOfArchitectures) {
        obj.partOfArchitectures.forEach(arch => architectures.add(arch.name))
      }
    })
    return Array.from(architectures).sort()
  }, [dataobjects])

  // Extract all available owners
  const availableOwners = useMemo(() => {
    const owners = new Set<string>()
    dataobjects.forEach(obj => {
      if (obj.owners) {
        obj.owners.forEach(owner => 
          owners.add(`${owner.firstName} ${owner.lastName}`)
        )
      }
    })
    return Array.from(owners).sort()
  }, [dataobjects])

  // Reset function for filters
  const resetFilters = () => {
    setFilterState({
      classifications: [],
      formats: [],
      sources: [],
      owners: [],
      usedByApplications: [],
      relatedToCapabilities: [],
      partOfArchitectures: [],
      descriptionFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  // Pattern 2 API: Return consistent interface
  return {
    filterState,
    setFilterState,
    filteredDataObjects,
    resetFilters,
    availableClassifications,
    availableFormats,
    availableSources,
    availableUsedByApplications,
    availableRelatedToCapabilities,
    availablePartOfArchitectures,
    availableOwners,
  }
}
