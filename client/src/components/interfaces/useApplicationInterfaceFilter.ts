'use client'

import { useMemo, useState } from 'react'
import { ApplicationInterface, FilterState } from './types'
import { InterfaceType, InterfaceProtocol, InterfaceStatus } from '@/gql/generated'

interface UseApplicationInterfaceFilterProps {
  applicationInterfaces: ApplicationInterface[]
  filterState?: FilterState
}

export const useApplicationInterfaceFilter = ({
  applicationInterfaces = [],
}: UseApplicationInterfaceFilterProps) => {
  // Standardzustand für Filter
  const [filterState, setFilterState] = useState<FilterState>({
    interfaceTypeFilter: [],
    protocolFilter: [],
    statusFilter: [],
    responsiblePersonFilter: [],
    sourceApplicationsFilter: [],
    targetApplicationsFilter: [],
    dataObjectsFilter: [],
    versionFilter: '',
    searchFilter: '',
    descriptionFilter: '',
    updatedDateRange: ['', ''],
  })

  // Alle verfügbaren Schnittstellentypen
  const availableInterfaceTypes = useMemo(() => {
    return Object.values(InterfaceType)
  }, [])

  // Alle verfügbaren Protokolle
  const availableProtocols = useMemo(() => {
    return Object.values(InterfaceProtocol)
  }, [])

  // Alle verfügbaren Status
  const availableStatuses = useMemo(() => {
    return Object.values(InterfaceStatus)
  }, [])

  // Alle verfügbaren verantwortlichen Personen
  const availableResponsiblePersons = useMemo(() => {
    const persons = new Set<string>()
    applicationInterfaces.forEach(iface => {
      if (iface.responsiblePerson) {
        iface.responsiblePerson.forEach(person => {
          const fullName = `${person.firstName} ${person.lastName}`.trim()
          persons.add(fullName)
        })
      }
    })
    return Array.from(persons).sort()
  }, [applicationInterfaces])

  // Alle verfügbaren Quell-Anwendungen
  const availableSourceApplications = useMemo(() => {
    const apps = new Set<string>()
    applicationInterfaces.forEach(iface => {
      if (iface.sourceApplications) {
        iface.sourceApplications.forEach(app => {
          if (app.name) {
            apps.add(app.name)
          }
        })
      }
    })
    return Array.from(apps).sort()
  }, [applicationInterfaces])

  // Alle verfügbaren Ziel-Anwendungen
  const availableTargetApplications = useMemo(() => {
    const apps = new Set<string>()
    applicationInterfaces.forEach(iface => {
      if (iface.targetApplications) {
        iface.targetApplications.forEach(app => {
          if (app.name) {
            apps.add(app.name)
          }
        })
      }
    })
    return Array.from(apps).sort()
  }, [applicationInterfaces])

  // Alle verfügbaren Datenobjekte
  const availableDataObjects = useMemo(() => {
    const objects = new Set<string>()
    applicationInterfaces.forEach(iface => {
      if (iface.dataObjects) {
        iface.dataObjects.forEach(obj => {
          if (obj.name) {
            objects.add(obj.name)
          }
        })
      }
    })
    return Array.from(objects).sort()
  }, [applicationInterfaces])

  // Alle verfügbaren Versionen
  const availableVersions = useMemo(() => {
    const versions = new Set<string>()
    applicationInterfaces.forEach(iface => {
      if (iface.version) {
        versions.add(iface.version)
      }
    })
    return Array.from(versions).sort()
  }, [applicationInterfaces])

  // Filterfunktion für erweiterte Filter
  const filteredApplicationInterfaces = useMemo(() => {
    const {
      interfaceTypeFilter,
      protocolFilter,
      statusFilter,
      responsiblePersonFilter,
      sourceApplicationsFilter,
      targetApplicationsFilter,
      dataObjectsFilter,
      versionFilter,
      searchFilter,
      descriptionFilter,
      updatedDateRange,
    } = filterState

    return applicationInterfaces.filter((applicationInterface: ApplicationInterface) => {
      // Schnittstellentyp-Filter
      if (
        interfaceTypeFilter.length > 0 &&
        !interfaceTypeFilter.includes(applicationInterface.interfaceType)
      ) {
        return false
      }

      // Protokoll-Filter
      if (
        protocolFilter.length > 0 &&
        (!applicationInterface.protocol || !protocolFilter.includes(applicationInterface.protocol))
      ) {
        return false
      }

      // Status-Filter
      if (
        statusFilter.length > 0 &&
        (!applicationInterface.status || !statusFilter.includes(applicationInterface.status))
      ) {
        return false
      }

      // Verantwortliche Person-Filter
      if (
        responsiblePersonFilter.length > 0 &&
        (!applicationInterface.responsiblePerson ||
          !responsiblePersonFilter.some(personName =>
            applicationInterface.responsiblePerson?.some(person => {
              const fullName = `${person.firstName} ${person.lastName}`.trim()
              return (
                fullName === personName ||
                person.firstName === personName ||
                person.lastName === personName
              )
            })
          ))
      ) {
        return false
      }

      // Quell-Anwendungen-Filter
      if (sourceApplicationsFilter.length > 0) {
        const sourceApps = applicationInterface.sourceApplications || []
        const hasMatchingSource = sourceApps.some(app =>
          sourceApplicationsFilter.includes(app.name || '')
        )
        if (!hasMatchingSource) {
          return false
        }
      }

      // Ziel-Anwendungen-Filter
      if (targetApplicationsFilter.length > 0) {
        const targetApps = applicationInterface.targetApplications || []
        const hasMatchingTarget = targetApps.some(app =>
          targetApplicationsFilter.includes(app.name || '')
        )
        if (!hasMatchingTarget) {
          return false
        }
      }

      // Datenobjekte-Filter
      if (dataObjectsFilter.length > 0) {
        const dataObjects = applicationInterface.dataObjects || []
        const hasMatchingDataObject = dataObjects.some(obj =>
          dataObjectsFilter.includes(obj.name || '')
        )
        if (!hasMatchingDataObject) {
          return false
        }
      }

      // Version-Filter
      if (versionFilter && versionFilter.trim() !== '') {
        const version = (applicationInterface.version || '').toLowerCase()
        const versionSearchTerm = versionFilter.toLowerCase()
        if (!version.includes(versionSearchTerm)) {
          return false
        }
      }

      // Suchfilter (für Name)
      if (searchFilter && searchFilter.trim() !== '') {
        const name = (applicationInterface.name || '').toLowerCase()
        const searchTerm = searchFilter.toLowerCase()
        if (!name.includes(searchTerm)) {
          return false
        }
      }

      // Beschreibungsfilter
      if (descriptionFilter && descriptionFilter.trim() !== '') {
        const description = (applicationInterface.description || '').toLowerCase()
        const descriptionSearchTerm = descriptionFilter.toLowerCase()
        if (!description.includes(descriptionSearchTerm)) {
          return false
        }
      }

      // Aktualisierungsdatum-Bereich
      const [startDateStr, endDateStr] = updatedDateRange

      if (startDateStr && applicationInterface.updatedAt) {
        const startDate = new Date(startDateStr)
        const updatedDate = new Date(applicationInterface.updatedAt)

        if (updatedDate < startDate) {
          return false
        }
      }

      if (endDateStr && applicationInterface.updatedAt) {
        const endDate = new Date(endDateStr)
        // Setze das Ende des Tages für den Endzeitpunkt
        endDate.setHours(23, 59, 59, 999)
        const updatedDate = new Date(applicationInterface.updatedAt)

        if (updatedDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [applicationInterfaces, filterState])

  const resetFilters = () => {
    setFilterState({
      interfaceTypeFilter: [],
      protocolFilter: [],
      statusFilter: [],
      responsiblePersonFilter: [],
      sourceApplicationsFilter: [],
      targetApplicationsFilter: [],
      dataObjectsFilter: [],
      versionFilter: '',
      searchFilter: '',
      descriptionFilter: '',
      updatedDateRange: ['', ''],
    })
  }

  return {
    filterState,
    setFilterState,
    filteredApplicationInterfaces,
    resetFilters,
    availableInterfaceTypes,
    availableProtocols,
    availableStatuses,
    availableResponsiblePersons,
    availableSourceApplications,
    availableTargetApplications,
    availableDataObjects,
    availableVersions,
  }
}
