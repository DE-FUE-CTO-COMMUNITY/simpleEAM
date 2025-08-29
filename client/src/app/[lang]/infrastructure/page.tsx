'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { Box, Typography } from '@mui/material'
import { SortingState } from '@tanstack/react-table'
import { Infrastructure } from '../../../gql/generated'
import InfrastructureTable from '../../../components/infrastructure/InfrastructureTable'
import InfrastructureToolbar from '../../../components/infrastructure/InfrastructureToolbar'
import { useInfrastructureFilter } from '../../../components/infrastructure/useInfrastructureFilter'
import { InfrastructureFormValues } from '../../../components/infrastructure/InfrastructureForm'
import { countActiveFilters } from '../../../components/infrastructure/utils'
import {
  GET_INFRASTRUCTURES,
  CREATE_INFRASTRUCTURE,
  UPDATE_INFRASTRUCTURE,
  DELETE_INFRASTRUCTURE,
} from '../../../graphql/infrastructure'

export default function InfrastructuresPage() {
  const t = useTranslations('infrastructure')
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // GraphQL Queries & Mutations
  const { data, loading, error, refetch } = useQuery(GET_INFRASTRUCTURES)
  const [createInfrastructure] = useMutation(CREATE_INFRASTRUCTURE)
  const [updateInfrastructure] = useMutation(UPDATE_INFRASTRUCTURE)
  const [deleteInfrastructure] = useMutation(DELETE_INFRASTRUCTURE)

  // Filter Logic
  const infrastructures = data?.infrastructures || []
  const { filterState, setFilterState, filteredInfrastructures, resetFilters } = useInfrastructureFilter({
    infrastructures,
  })

  // Weitere Filterung durch globalen Suchfilter
  const finalInfrastructures = useMemo(() => {
    if (!globalFilter.trim()) return filteredInfrastructures
    const searchTerm = globalFilter.toLowerCase()
    return filteredInfrastructures.filter(
      infrastructure =>
        infrastructure.name?.toLowerCase().includes(searchTerm) ||
        infrastructure.description?.toLowerCase().includes(searchTerm)
    )
  }, [filteredInfrastructures, globalFilter])

  // CRUD Handlers
  const handleCreate = async (data: InfrastructureFormValues) => {
    try {
      await createInfrastructure({
        variables: {
          input: {
            name: data.name,
            description: data.description || '',
            infrastructureType: data.infrastructureType,
            status: data.status,
            vendor: data.vendor || '',
            version: data.version || '',
            capacity: data.capacity || '',
            location: data.location || '',
            ipAddress: data.ipAddress || '',
            operatingSystem: data.operatingSystem || '',
            specifications: data.specifications || '',
            maintenanceWindow: data.maintenanceWindow || '',
            costs: data.costs || null,
            planningDate: data.planningDate || null,
            introductionDate: data.introductionDate || null,
            endOfUseDate: data.endOfUseDate || null,
            endOfLifeDate: data.endOfLifeDate || null,
            ...(data.parentInfrastructure && {
              parentInfrastructure: {
                connect: { where: { node: { id: data.parentInfrastructure } } }
              }
            }),
            ...(data.childInfrastructures && data.childInfrastructures.length > 0 && {
              childInfrastructures: {
                connect: data.childInfrastructures.map((id: string) => ({ where: { node: { id } } }))
              }
            }),
            ...(data.hostsApplications && data.hostsApplications.length > 0 && {
              hostsApplications: {
                connect: data.hostsApplications.map((id: string) => ({ where: { node: { id } } }))
              }
            }),
            ...(data.partOfArchitectures && data.partOfArchitectures.length > 0 && {
              partOfArchitectures: {
                connect: data.partOfArchitectures.map((id: string) => ({ where: { node: { id } } }))
              }
            }),
            ...(data.depictedInDiagrams && data.depictedInDiagrams.length > 0 && {
              depictedInDiagrams: {
                connect: data.depictedInDiagrams.map((id: string) => ({ where: { node: { id } } }))
              }
            }),
          },
        },
      })
      refetch()
    } catch (error) {
      console.error('Error creating infrastructure:', error)
      throw error
    }
  }

  const handleUpdate = async (id: string, data: InfrastructureFormValues) => {
    try {
      await updateInfrastructure({
        variables: {
          where: { id },
          update: {
            name: data.name,
            description: data.description || '',
            infrastructureType: data.infrastructureType,
            status: data.status,
            vendor: data.vendor || '',
            version: data.version || '',
            capacity: data.capacity || '',
            location: data.location || '',
            ipAddress: data.ipAddress || '',
            operatingSystem: data.operatingSystem || '',
            specifications: data.specifications || '',
            maintenanceWindow: data.maintenanceWindow || '',
            costs: data.costs || null,
            planningDate: data.planningDate || null,
            introductionDate: data.introductionDate || null,
            endOfUseDate: data.endOfUseDate || null,
            endOfLifeDate: data.endOfLifeDate || null,
            // Beziehungen werden hier nicht aktualisiert - würde komplexere Logik erfordern
          },
        },
      })
      refetch()
    } catch (error) {
      console.error('Error updating infrastructure:', error)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInfrastructure({
        variables: { where: { id } },
      })
      refetch()
    } catch (error) {
      console.error('Error deleting infrastructure:', error)
      throw error
    }
  }

  const handleAddNew = () => {
    // Wird von der Tabelle gehandhabt
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{t('messages.loadError')}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <InfrastructureToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        activeFiltersCount={countActiveFilters(filterState)}
        onFilterClick={() => {
          // Filter wird über GenericToolbar verwaltet
        }}
        onResetFilters={() => {
          resetFilters()
          setGlobalFilter('')
        }}
      />

      <InfrastructureTable
        infrastructures={finalInfrastructures as Infrastructure[]}
        loading={loading}
        globalFilter={globalFilter}
        sorting={sorting}
        onSortingChange={setSorting}
        onCreateInfrastructure={handleCreate}
        onUpdateInfrastructure={handleUpdate}
        onDeleteInfrastructure={handleDelete}
      />
    </Box>
  )
}
