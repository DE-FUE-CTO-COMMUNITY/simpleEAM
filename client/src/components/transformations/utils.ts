'use client'

import { useLocale, useTranslations } from 'next-intl'
import {
  Person,
  TransformationImpactAction,
  TransformationPriority,
  TransformationStatus,
} from '../../gql/generated'
import {
  FilterState,
  ImpactRelation,
  TransformationFormValues,
  TransformationImpactEdge,
} from './types'

export const defaultImpactAction = TransformationImpactAction.MODIFIED

export const createEmptyTransformationFormValues = (ownerId = ''): TransformationFormValues => ({
  name: '',
  description: '',
  status: TransformationStatus.IDEA,
  targetDate: null,
  startDate: null,
  completionDate: null,
  priority: '',
  rationale: '',
  expectedOutcome: '',
  tags: '',
  ownerId,
  sourceArchitectureId: '',
  targetArchitectureIds: [],
  goalIds: [],
  impactsCapabilities: [],
  impactsApplications: [],
  impactsAIComponents: [],
  impactsDataObjects: [],
  impactsInterfaces: [],
  impactsInfrastructure: [],
  impactsBusinessProcesses: [],
})

export const createImpactRelation = (id: string): ImpactRelation => ({
  id,
  action: defaultImpactAction,
  notes: '',
})

export const formatPersonName = (person: Pick<Person, 'firstName' | 'lastName' | 'email'>) => {
  const fullName = `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim()
  return fullName || person.email || ''
}

export const parseTags = (value: string) =>
  value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

export const mapImpactEdges = (edges?: TransformationImpactEdge[] | null): ImpactRelation[] =>
  (edges ?? [])
    .filter(edge => edge?.node?.id)
    .map(edge => ({
      id: edge.node!.id,
      action: edge.properties?.action ?? defaultImpactAction,
      notes: edge.properties?.notes ?? '',
    }))

export const normalizeDateValue = (value?: string | Date | null): Date | null => {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDateForMutation = (value?: Date | null): string | null => {
  if (!value) {
    return null
  }

  return value.toISOString().split('T')[0]
}

export const useStatusLabel = () => {
  const t = useTranslations('transformations.statuses')

  return (status: TransformationStatus | null | undefined): string => {
    if (!status) {
      return ''
    }

    return t(status)
  }
}

export const usePriorityLabel = () => {
  const t = useTranslations('transformations.priorities')

  return (priority: TransformationPriority | null | undefined): string => {
    if (!priority) {
      return ''
    }

    return t(priority)
  }
}

export const useImpactActionLabel = () => {
  const t = useTranslations('transformations.impactActions')

  return (action: TransformationImpactAction | null | undefined): string => {
    if (!action) {
      return ''
    }

    return t(action)
  }
}

export const useFormatDate = () => {
  const locale = useLocale()

  return (date: string | null | undefined): string => {
    if (!date) {
      return '-'
    }

    const parsed = new Date(date)
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString(locale)
  }
}

export const countActiveFilters = (filterState: FilterState): number => {
  let count = 0

  if (filterState.statusFilter.length > 0) count++
  if (filterState.priorityFilter.length > 0) count++
  if (filterState.ownerFilter) count++
  if (filterState.sourceArchitectureFilter) count++
  if (filterState.goalFilter) count++
  if (filterState.tagsFilter.length > 0) count++
  if (filterState.targetDateRange[0] || filterState.targetDateRange[1]) count++

  return count
}
