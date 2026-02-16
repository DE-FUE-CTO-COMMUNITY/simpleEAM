'use client'

import React, { useEffect, useState } from 'react'
import { Button, IconButton, MenuItem, Stack, TextField } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_PERSONS } from '@/graphql/person'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_GOALS } from '@/graphql/goal'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig, TabConfig, SelectOption } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { Gea_Strategy, Architecture, Gea_Goal } from '../../gql/generated'
import ArchitectureForm from '../architectures/ArchitectureForm'

interface StrategyGoalRelationInput {
  goalId: string
  score: number
}

const createStrategySchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    description: z
      .string()
      .min(10, t('validation.descriptionMin'))
      .max(1000, t('validation.descriptionMax')),
    ownerId: z.string().optional(),
    achievesGoalsRelations: z
      .array(
        z.object({
          goalId: z.string().min(1, t('validation.goalRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
  })

export type StrategyFormValues = z.infer<ReturnType<typeof createStrategySchema>>

const StrategyForm: React.FC<GenericFormProps<Gea_Strategy, StrategyFormValues>> = ({
  data: strategy,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const tForm = useTranslations('strategies.form')
  const tTabs = useTranslations('strategies.tabs')

  const scoreOptions: Array<{ value: number; label: string }> = [
    { value: 3, label: tForm('scoreStrongSupport') },
    { value: 2, label: tForm('scoreSupport') },
    { value: 1, label: tForm('scoreWeakSupport') },
    { value: 0, label: tForm('scoreNeutral') },
    { value: -1, label: tForm('scoreSlightContradiction') },
    { value: -2, label: tForm('scoreSignificantConflict') },
    { value: -3, label: tForm('scoreDirectContradiction') },
  ]

  const { currentPerson } = useCurrentPerson()

  const [nestedFormState, setNestedFormState] = useState<{
    isOpen: boolean
    entityType: string | null
    entityId: string | null
    mode: 'view' | 'edit'
  }>({
    isOpen: false,
    entityType: null,
    entityId: null,
    mode: 'view',
  })

  const { createChipClickHandler } = useChipClickHandlers({
    onOpenNestedForm: (entityType, entityId, formMode) => {
      setNestedFormState({
        isOpen: true,
        entityType,
        entityId,
        mode: formMode,
      })
    },
  })

  const handleCloseNestedForm = () => {
    setNestedFormState({
      isOpen: false,
      entityType: null,
      entityId: null,
      mode: 'view',
    })
  }

  const personWhere = useCompanyWhere('companies')
  const companyWhere = useCompanyWhere('company')

  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })

  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })

  const { data: diagramData, loading: diagramLoading } = useQuery(GET_DIAGRAMS, {
    variables: { where: companyWhere },
  })

  const { data: goalsData, loading: goalsLoading } = useQuery(GET_GOALS, {
    variables: { where: companyWhere },
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const strategySchema = React.useMemo(() => createStrategySchema(tForm), [tForm])

  const defaultValues = React.useMemo<StrategyFormValues>(
    () => ({
      name: strategy?.name || '',
      description: strategy?.description || '',
      ownerId:
        strategy?.owners && strategy.owners.length > 0 ? strategy.owners[0].id : currentPerson?.id,
      achievesGoalsRelations:
        strategy?.achievesGoalsConnection?.edges?.map(edge => ({
          goalId: edge?.node?.id ?? '',
          score: edge?.properties?.score ?? 0,
        })) || [],
      partOfArchitectures: strategy?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: strategy?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [strategy, currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: strategySchema,
      onSubmit: strategySchema,
    },
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset()
      return
    }

    if (mode === 'create') {
      form.reset(defaultValues)
      return
    }

    if ((mode === 'view' || mode === 'edit') && strategy) {
      form.reset({
        name: strategy?.name || '',
        description: strategy?.description || '',
        ownerId:
          strategy?.owners && strategy.owners.length > 0
            ? strategy.owners[0].id
            : currentPerson?.id,
        achievesGoalsRelations:
          strategy?.achievesGoalsConnection?.edges?.map(edge => ({
            goalId: edge?.node?.id ?? '',
            score: edge?.properties?.score ?? 0,
          })) || [],
        partOfArchitectures: strategy?.partOfArchitectures?.map(arch => arch.id) || [],
        depictedInDiagrams: strategy?.depictedInDiagrams?.map(diag => diag.id) || [],
      })
    }
  }, [form, strategy, isOpen, mode, defaultValues, currentPerson?.id])

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: strategySchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: tForm('description'),
      type: 'textarea',
      required: true,
      validators: strategySchema.shape.description,
      size: { xs: 12, md: 12 },
      tabId: 'general',
    },
    {
      name: 'ownerId',
      label: tForm('owner'),
      type: 'select',
      options: [
        { value: '', label: tForm('none') },
        ...(personData?.people?.map(
          (person: { id: string; firstName: string; lastName: string }): SelectOption => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ) || []),
      ],
      size: { xs: 12, md: 6 },
      loadingOptions: personLoading,
      tabId: 'general',
    },
    {
      name: 'achievesGoalsRelations',
      label: tForm('achievesGoals'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as StrategyGoalRelationInput[])
          : []
        const allGoals: Gea_Goal[] = goalsData?.geaGoals || []
        const selectedGoalIds = new Set(relations.map(relation => relation.goalId).filter(Boolean))
        const hasMoreGoalsToAdd = allGoals.some(goal => !selectedGoalIds.has(goal.id))

        const updateRelation = (
          index: number,
          key: keyof StrategyGoalRelationInput,
          value: string | number
        ) => {
          const nextRelations = relations.map((relation, relationIndex) =>
            relationIndex === index ? { ...relation, [key]: value } : relation
          )
          formField.handleChange(nextRelations)
        }

        const removeRelation = (index: number) => {
          const nextRelations = relations.filter((_, relationIndex) => relationIndex !== index)
          formField.handleChange(nextRelations)
        }

        const addRelation = () => {
          const nextRelations = [...relations, { goalId: '', score: 0 }]
          formField.handleChange(nextRelations)
        }

        return (
          <Stack spacing={2}>
            {relations.map((relation, index) => {
              const availableGoalsForRow = allGoals.filter(
                goal => goal.id === relation.goalId || !selectedGoalIds.has(goal.id)
              )

              return (
                <Stack
                  key={`goal-relation-${index}`}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    select
                    label={tForm('goal')}
                    value={relation.goalId}
                    onChange={event => updateRelation(index, 'goalId', event.target.value)}
                    disabled={disabled}
                    fullWidth
                  >
                    {availableGoalsForRow.map((goal: Gea_Goal) => (
                      <MenuItem key={goal.id} value={goal.id}>
                        {goal.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label={tForm('score')}
                    value={relation.score}
                    onChange={event => updateRelation(index, 'score', Number(event.target.value))}
                    disabled={disabled}
                    sx={{ minWidth: 260 }}
                  >
                    {scoreOptions.map(option => (
                      <MenuItem key={`score-${option.value}`} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <IconButton
                    onClick={() => removeRelation(index)}
                    disabled={disabled}
                    aria-label={tForm('removeGoalRelation')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )
            })}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addRelation}
              disabled={disabled || goalsLoading || !hasMoreGoalsToAdd}
              sx={{ alignSelf: 'flex-start' }}
            >
              {tForm('addGoalRelation')}
            </Button>
          </Stack>
        )
      },
    },
    {
      name: 'partOfArchitectures',
      label: tForm('partOfArchitectures'),
      type: 'autocomplete',
      multiple: true,
      options:
        architectureData?.architectures?.map(
          (arch: Architecture): SelectOption => ({
            value: arch.id,
            label: arch.name,
          })
        ) || [],
      loadingOptions: architectureLoading,
      size: 12,
      tabId: 'architectures',
      onChipClick: createChipClickHandler('partOfArchitectures'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingArch = architectureData?.architectures?.find(
            (arch: Architecture) => arch.id === option
          )
          return matchingArch?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'depictedInDiagrams',
      label: tForm('depictedInDiagrams'),
      type: 'autocomplete',
      multiple: true,
      options:
        diagramData?.diagrams?.map(
          (diagram: any): SelectOption => ({
            value: diagram.id,
            label: diagram.title,
          })
        ) || [],
      loadingOptions: diagramLoading,
      size: 12,
      tabId: 'architectures',
      onChipClick: createChipClickHandler('depictedInDiagrams'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingDiagram = diagramData?.diagrams?.find(
            (diagram: any) => diagram.id === option
          )
          return matchingDiagram?.title || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
  ]

  const tabs: TabConfig[] = [
    { id: 'general', label: tTabs('general') },
    { id: 'relationships', label: tTabs('relationships') },
    { id: 'architectures', label: tTabs('architectures') },
  ]

  return (
    <>
      <GenericForm
        title={
          mode === 'create'
            ? tForm('createTitle')
            : mode === 'edit'
              ? tForm('editTitle')
              : tForm('viewTitle')
        }
        isOpen={isOpen && !nestedFormState.isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={loading}
        mode={mode}
        fields={fields}
        tabs={tabs}
        isNested={isNested}
        form={form}
        enableDelete={mode === 'edit' && !!strategy && isArchitect()}
        onDelete={strategy?.id ? () => onDelete?.(strategy.id) : undefined}
        onEditMode={onEditMode}
        entityId={strategy?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          strategy
            ? {
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt,
              }
            : undefined
        }
      />

      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'architectures' &&
        nestedArchitectureData?.architectures?.[0] && (
          <ArchitectureForm
            data={nestedArchitectureData.architectures[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}
    </>
  )
}

export default StrategyForm
