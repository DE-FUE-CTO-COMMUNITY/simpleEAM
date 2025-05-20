'use client'

import { useState, useEffect } from 'react'
import { ApplicationInterface, InterfaceType } from '../../gql/generated'

export interface ApplicationInterfaceFilterState {
  interfaceTypeFilter: InterfaceType[]
  dataObjectFilter: string[]
  updatedDateRange?: {
    from: string | null
    to: string | null
  }
}

interface UseApplicationInterfaceFilterProps {
  interfaces: ApplicationInterface[]
}

/**
 * Hook für die Filterlogik der Schnittstellen-Übersicht
 */
export const useApplicationInterfaceFilter = ({
  interfaces,
}: UseApplicationInterfaceFilterProps) => {
  // State für die Filterwerte
  const [filterState, setFilterState] = useState<ApplicationInterfaceFilterState>({
    interfaceTypeFilter: [],
    dataObjectFilter: [],
    updatedDateRange: {
      from: null,
      to: null,
    },
  })

  // Extrahiere alle verfügbaren Interface-Typen aus den Daten
  const [availableInterfaceTypes, setAvailableInterfaceTypes] = useState<InterfaceType[]>([])

  // Extrahiere alle verfügbaren Datenobjekte aus den Daten
  const [availableDataObjects, setAvailableDataObjects] = useState<{ id: string; name: string }[]>(
    []
  )

  // Aktualisiere die verfügbaren Filter-Optionen, wenn neue Daten vorliegen
  useEffect(() => {
    if (interfaces && interfaces.length > 0) {
      // Extrahiere alle InterfaceTypes und entferne Duplikate
      const allInterfaceTypes = interfaces
        .map(iface => iface.interfaceType)
        .filter(Boolean) as InterfaceType[]

      const uniqueInterfaceTypes = Array.from(new Set(allInterfaceTypes)).sort()
      setAvailableInterfaceTypes(uniqueInterfaceTypes)

      // Extrahiere alle Datenobjekte und entferne Duplikate
      const allDataObjects: { id: string; name: string }[] = []
      interfaces.forEach(iface => {
        if (iface.dataObjects && Array.isArray(iface.dataObjects)) {
          iface.dataObjects.forEach(dataObj => {
            if (dataObj && dataObj.id && dataObj.name) {
              allDataObjects.push({
                id: dataObj.id,
                name: dataObj.name,
              })
            }
          })
        }
      })

      // Duplikate entfernen und nach Namen sortieren
      const uniqueDataObjects = allDataObjects
        .filter((obj, index, self) => index === self.findIndex(o => o.id === obj.id))
        .sort((a, b) => a.name.localeCompare(b.name))

      setAvailableDataObjects(uniqueDataObjects)
    }
  }, [interfaces])

  // Filter-Funktion für Schnittstellen
  const filteredInterfaces = interfaces.filter(iface => {
    // Interface-Typ filtern
    if (
      filterState.interfaceTypeFilter.length > 0 &&
      !filterState.interfaceTypeFilter.includes(iface.interfaceType)
    ) {
      return false
    }

    // Datenobjekte filtern
    if (filterState.dataObjectFilter.length > 0) {
      // Prüfen, ob die Schnittstelle eines der ausgewählten Datenobjekte hat
      const hasMatchingDataObject = iface.dataObjects?.some(dataObj =>
        filterState.dataObjectFilter.includes(dataObj.id)
      )
      if (!hasMatchingDataObject) {
        return false
      }
    }

    // Datumsbereich filtern
    if (filterState.updatedDateRange?.from || filterState.updatedDateRange?.to) {
      const updatedDate = iface.updatedAt ? new Date(iface.updatedAt) : null

      if (!updatedDate) {
        return false
      }

      if (
        filterState.updatedDateRange.from &&
        updatedDate < new Date(filterState.updatedDateRange.from)
      ) {
        return false
      }

      if (
        filterState.updatedDateRange.to &&
        updatedDate > new Date(filterState.updatedDateRange.to)
      ) {
        return false
      }
    }

    return true
  })

  // Reset-Funktion für die Filter
  const resetFilters = () => {
    setFilterState({
      interfaceTypeFilter: [],
      dataObjectFilter: [],
      updatedDateRange: {
        from: null,
        to: null,
      },
    })
  }

  return {
    filterState,
    setFilterState,
    filteredInterfaces,
    resetFilters,
    availableInterfaceTypes,
    availableDataObjects,
  }
}
