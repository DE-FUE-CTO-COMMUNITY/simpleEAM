'use client'

import { useEffect, useMemo, useState } from 'react'
import { Add as AddIcon } from '@mui/icons-material'
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material'
import { SortingState } from '@tanstack/react-table'
import { useMutation, useQuery } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useCompanyContext } from '@/contexts/CompanyContext'
import TransformationFilterDialog from '@/components/transformations/TransformationFilterDialog'
import TransformationForm from '@/components/transformations/TransformationForm'
import TransformationTable, {
  TRANSFORMATION_DEFAULT_COLUMN_VISIBILITY,
} from '@/components/transformations/TransformationTable'
import TransformationToolbar from '@/components/transformations/TransformationToolbar'
import {
  ImpactRelation,
  TransformationFormValues,
  TransformationType,
} from '@/components/transformations/types'
import { useTransformationFilter } from '@/components/transformations/useTransformationFilter'
import {
  countActiveFilters,
  formatDateForMutation,
  parseTags,
} from '@/components/transformations/utils'
import {
  CREATE_TRANSFORMATION,
  DELETE_TRANSFORMATION,
  GET_TRANSFORMATIONS,
  UPDATE_TRANSFORMATION,
} from '@/graphql/transformation'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { isArchitect } from '@/lib/auth'
import { useLensSettings } from '@/lib/lens-settings'

const addImpactCreateField = (
  input: Record<string, unknown>,
  fieldName: string,
  relations: ImpactRelation[]
) => {
  if (relations.length === 0) {
    return
  }

  input[fieldName] = {
    connect: relations.map(relation => ({
      edge: {
        action: relation.action,
        notes: relation.notes.trim() || null,
      },
      where: { node: { id: { eq: relation.id } } },
    })),
  }
}

const addImpactUpdateField = (
  input: Record<string, unknown>,
  fieldName: string,
  relations: ImpactRelation[]
) => {
  input[fieldName] = {
    disconnect: [{ where: {} }],
    connect: relations.map(relation => ({
      edge: {
        action: relation.action,
        notes: relation.notes.trim() || null,
      },
      where: { node: { id: { eq: relation.id } } },
    })),
  }
}

export default function TransformationsPage() {
  const t = useTranslations('transformations')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId } = useCompanyContext()
  const { currentPerson } = useCurrentPerson()
  const { lensFlags } = useLensSettings()
  const isTransformationLensEnabled = lensFlags.transformationArchitecture
  const canEdit = isArchitect()

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const [tableInstance, setTableInstance] = useState<any>(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [showNewTransformationForm, setShowNewTransformationForm] = useState(false)

  const transformationWhere = useCompanyWhere('company')
  const {
    data: transformationData,
    loading,
    error,
    refetch,
  } = useQuery(GET_TRANSFORMATIONS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !isTransformationLensEnabled,
    variables: { where: transformationWhere },
  })

  const [createTransformationMutation, { loading: isCreating }] = useMutation(CREATE_TRANSFORMATION)
  const [updateTransformationMutation, { loading: isUpdating }] = useMutation(UPDATE_TRANSFORMATION)
  const [deleteTransformationMutation] = useMutation(DELETE_TRANSFORMATION)

  useEffect(() => {
    if (error) {
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    }
  }, [enqueueSnackbar, error, t])

  const transformations = useMemo(
    () => (transformationData?.transformations as TransformationType[] | undefined) ?? [],
    [transformationData?.transformations]
  )

  const {
    filterState,
    setFilterState,
    filteredTransformations,
    resetFilters,
    availableStatuses,
    availablePriorities,
    availableArchitectures,
    availableGoals,
    availableTags,
  } = useTransformationFilter({ transformations })

  const activeFiltersCount = useMemo(() => countActiveFilters(filterState), [filterState])

  if (!isTransformationLensEnabled) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">{t('messages.lensDisabled')}</Alert>
      </Box>
    )
  }

  const handleCreateTransformation = async (data: TransformationFormValues) => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      throw new Error(t('messages.selectCompanyFirst'))
    }

    const ownerId = data.ownerId || currentPerson?.id || ''
    if (!ownerId) {
      enqueueSnackbar(t('messages.ownerRequired'), { variant: 'warning' })
      throw new Error(t('messages.ownerRequired'))
    }

    const input: Record<string, unknown> = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      status: data.status,
      targetDate: formatDateForMutation(data.targetDate) || undefined,
      startDate: formatDateForMutation(data.startDate) || undefined,
      completionDate: formatDateForMutation(data.completionDate) || undefined,
      priority: data.priority || undefined,
      rationale: data.rationale.trim() || undefined,
      expectedOutcome: data.expectedOutcome.trim() || undefined,
      tags: parseTags(data.tags),
      company: {
        connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
      },
      owners: {
        connect: [{ where: { node: { id: { eq: ownerId } } } }],
      },
    }

    if (data.sourceArchitectureId) {
      input.sourceArchitecture = {
        connect: [{ where: { node: { id: { eq: data.sourceArchitectureId } } } }],
      }
    }

    if (data.targetArchitectureIds.length > 0) {
      input.targetArchitectures = {
        connect: data.targetArchitectureIds.map(id => ({ where: { node: { id: { eq: id } } } })),
      }
    }

    if (data.goalIds.length > 0) {
      input.goals = {
        connect: data.goalIds.map(id => ({ where: { node: { id: { eq: id } } } })),
      }
    }

    addImpactCreateField(input, 'impactsCapabilities', data.impactsCapabilities)
    addImpactCreateField(input, 'impactsApplications', data.impactsApplications)
    addImpactCreateField(input, 'impactsAIComponents', data.impactsAIComponents)
    addImpactCreateField(input, 'impactsDataObjects', data.impactsDataObjects)
    addImpactCreateField(input, 'impactsInterfaces', data.impactsInterfaces)
    addImpactCreateField(input, 'impactsInfrastructure', data.impactsInfrastructure)
    addImpactCreateField(input, 'impactsBusinessProcesses', data.impactsBusinessProcesses)

    try {
      await createTransformationMutation({ variables: { input: [input] } })
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      await refetch({ where: transformationWhere })
      setShowNewTransformationForm(false)
    } catch (mutationError: any) {
      enqueueSnackbar(`${t('messages.createError')}: ${mutationError.message}`, {
        variant: 'error',
      })
      throw mutationError
    }
  }

  const handleUpdateTransformation = async (id: string, data: TransformationFormValues) => {
    const ownerId = data.ownerId || currentPerson?.id || ''
    if (!ownerId) {
      enqueueSnackbar(t('messages.ownerRequired'), { variant: 'warning' })
      throw new Error(t('messages.ownerRequired'))
    }

    const input: Record<string, unknown> = {
      name: { set: data.name.trim() },
      description: { set: data.description.trim() || null },
      status: { set: data.status },
      targetDate: { set: formatDateForMutation(data.targetDate) },
      startDate: { set: formatDateForMutation(data.startDate) },
      completionDate: { set: formatDateForMutation(data.completionDate) },
      priority: data.priority ? { set: data.priority } : { set: null },
      rationale: { set: data.rationale.trim() || null },
      expectedOutcome: { set: data.expectedOutcome.trim() || null },
      tags: { set: parseTags(data.tags) },
      owners: {
        disconnect: [{ where: {} }],
        connect: [{ where: { node: { id: { eq: ownerId } } } }],
      },
      sourceArchitecture: data.sourceArchitectureId
        ? {
            disconnect: [{ where: {} }],
            connect: [{ where: { node: { id: { eq: data.sourceArchitectureId } } } }],
          }
        : { disconnect: [{ where: {} }] },
      targetArchitectures: {
        disconnect: [{ where: {} }],
        connect: data.targetArchitectureIds.map(entityId => ({
          where: { node: { id: { eq: entityId } } },
        })),
      },
      goals: {
        disconnect: [{ where: {} }],
        connect: data.goalIds.map(entityId => ({
          where: { node: { id: { eq: entityId } } },
        })),
      },
    }

    addImpactUpdateField(input, 'impactsCapabilities', data.impactsCapabilities)
    addImpactUpdateField(input, 'impactsApplications', data.impactsApplications)
    addImpactUpdateField(input, 'impactsAIComponents', data.impactsAIComponents)
    addImpactUpdateField(input, 'impactsDataObjects', data.impactsDataObjects)
    addImpactUpdateField(input, 'impactsInterfaces', data.impactsInterfaces)
    addImpactUpdateField(input, 'impactsInfrastructure', data.impactsInfrastructure)
    addImpactUpdateField(input, 'impactsBusinessProcesses', data.impactsBusinessProcesses)

    try {
      await updateTransformationMutation({ variables: { id, input } })
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
      await refetch({ where: transformationWhere })
    } catch (mutationError: any) {
      enqueueSnackbar(`${t('messages.updateError')}: ${mutationError.message}`, {
        variant: 'error',
      })
      throw mutationError
    }
  }

  const handleDeleteTransformation = async (id: string) => {
    try {
      await deleteTransformationMutation({ variables: { id } })
      enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
      await refetch({ where: transformationWhere })
    } catch (mutationError: any) {
      enqueueSnackbar(`${t('messages.deleteError')}: ${mutationError.message}`, {
        variant: 'error',
      })
      throw mutationError
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">{t('title')}</Typography>
          <Typography variant="body1" color="text.secondary">
            {t('subtitle')}
          </Typography>
        </Box>
        {canEdit ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowNewTransformationForm(true)}
          >
            {t('addNew')}
          </Button>
        ) : null}
      </Box>

      {!selectedCompanyId ? (
        <Alert severity="info">{t('messages.selectCompanyFirst')}</Alert>
      ) : null}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TransformationToolbar
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            activeFiltersCount={activeFiltersCount}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onResetFilters={resetFilters}
            table={tableInstance}
            enableColumnVisibilityToggle={true}
            defaultColumnVisibility={TRANSFORMATION_DEFAULT_COLUMN_VISIBILITY}
          />
          <TransformationTable
            transformations={filteredTransformations}
            loading={loading}
            globalFilter={globalFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onUpdateTransformation={handleUpdateTransformation}
            onDeleteTransformation={handleDeleteTransformation}
            onTableReady={setTableInstance}
          />
        </CardContent>
      </Card>

      <TransformationForm
        data={null}
        mode="create"
        isOpen={showNewTransformationForm}
        onClose={() => setShowNewTransformationForm(false)}
        onSubmit={handleCreateTransformation}
        loading={isCreating || isUpdating}
      />

      {isFilterDialogOpen ? (
        <TransformationFilterDialog
          filterState={filterState}
          availableStatuses={availableStatuses}
          availablePriorities={availablePriorities}
          availableArchitectures={availableArchitectures}
          availableGoals={availableGoals}
          availableTags={availableTags}
          onFilterChange={newFilter => setFilterState(current => ({ ...current, ...newFilter }))}
          onResetFilter={resetFilters}
          onClose={() => setIsFilterDialogOpen(false)}
          onApply={() => setIsFilterDialogOpen(false)}
        />
      ) : null}
    </Box>
  )
}
