'use client'

import { useMemo, useState } from 'react'
import { TransformationPriority, TransformationStatus } from '../../gql/generated'
import { FilterState, IdName, TransformationType } from './types'

const defaultFilterState: FilterState = {
  statusFilter: [],
  priorityFilter: [],
  ownerFilter: '',
  sourceArchitectureFilter: '',
  goalFilter: '',
  tagsFilter: [],
  targetDateRange: ['', ''],
}

interface UseTransformationFilterProps {
  transformations: TransformationType[]
}

export const useTransformationFilter = ({ transformations }: UseTransformationFilterProps) => {
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState)

  const filteredTransformations = useMemo(
    () =>
      transformations.filter(transformation => {
        if (
          filterState.statusFilter.length > 0 &&
          !filterState.statusFilter.includes(transformation.status)
        ) {
          return false
        }

        if (
          filterState.priorityFilter.length > 0 &&
          (!transformation.priority ||
            !filterState.priorityFilter.includes(transformation.priority))
        ) {
          return false
        }

        if (filterState.ownerFilter) {
          const matchesOwner = transformation.owners?.some(
            owner => owner.id === filterState.ownerFilter
          )
          if (!matchesOwner) {
            return false
          }
        }

        if (filterState.sourceArchitectureFilter) {
          const matchesSource = transformation.sourceArchitecture?.some(
            architecture => architecture.id === filterState.sourceArchitectureFilter
          )
          if (!matchesSource) {
            return false
          }
        }

        if (filterState.goalFilter) {
          const matchesGoal = transformation.goals?.some(goal => goal.id === filterState.goalFilter)
          if (!matchesGoal) {
            return false
          }
        }

        if (filterState.tagsFilter.length > 0) {
          const tags = transformation.tags ?? []
          const hasMatchingTag = filterState.tagsFilter.some(tag => tags.includes(tag))
          if (!hasMatchingTag) {
            return false
          }
        }

        if (filterState.targetDateRange[0] && transformation.targetDate) {
          const startDate = new Date(filterState.targetDateRange[0])
          const targetDate = new Date(transformation.targetDate)
          if (targetDate < startDate) {
            return false
          }
        }

        if (filterState.targetDateRange[1] && transformation.targetDate) {
          const endDate = new Date(filterState.targetDateRange[1])
          endDate.setHours(23, 59, 59, 999)
          const targetDate = new Date(transformation.targetDate)
          if (targetDate > endDate) {
            return false
          }
        }

        return true
      }),
    [filterState, transformations]
  )

  const availableStatuses = useMemo(
    () =>
      Array.from(
        new Set(transformations.map(transformation => transformation.status).filter(Boolean))
      ).sort() as TransformationStatus[],
    [transformations]
  )

  const availablePriorities = useMemo(
    () =>
      Array.from(
        new Set(transformations.map(transformation => transformation.priority).filter(Boolean))
      ).sort() as TransformationPriority[],
    [transformations]
  )

  const availableArchitectures = useMemo(() => {
    const items = new Map<string, IdName>()

    transformations.forEach(transformation => {
      transformation.sourceArchitecture?.forEach(architecture => {
        items.set(architecture.id, { id: architecture.id, name: architecture.name })
      })
      transformation.targetArchitectures?.forEach(architecture => {
        items.set(architecture.id, { id: architecture.id, name: architecture.name })
      })
    })

    return Array.from(items.values()).sort((left, right) => left.name.localeCompare(right.name))
  }, [transformations])

  const availableGoals = useMemo(() => {
    const items = new Map<string, IdName>()

    transformations.forEach(transformation => {
      transformation.goals?.forEach(goal => {
        items.set(goal.id, { id: goal.id, name: goal.name })
      })
    })

    return Array.from(items.values()).sort((left, right) => left.name.localeCompare(right.name))
  }, [transformations])

  const availableTags = useMemo(() => {
    const allTags = transformations.flatMap(transformation => transformation.tags ?? [])
    return Array.from(new Set(allTags)).sort()
  }, [transformations])

  const resetFilters = () => {
    setFilterState(defaultFilterState)
  }

  return {
    filterState,
    setFilterState,
    filteredTransformations,
    resetFilters,
    availableStatuses,
    availablePriorities,
    availableArchitectures,
    availableGoals,
    availableTags,
  }
}
