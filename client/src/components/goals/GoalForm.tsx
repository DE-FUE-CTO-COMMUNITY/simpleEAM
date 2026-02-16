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
import { GET_VISIONS } from '@/graphql/vision'
import { GET_VALUES } from '@/graphql/value'
import { GET_STRATEGIES } from '@/graphql/strategy'
import { GET_MISSIONS } from '@/graphql/mission'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig, TabConfig, SelectOption } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import {
  Gea_Goal,
  Architecture,
  Gea_Vision,
  Gea_Value,
  Gea_Strategy,
  Gea_Mission,
} from '../../gql/generated'
import ArchitectureForm from '../architectures/ArchitectureForm'

interface GoalVisionRelationInput {
  visionId: string
  score: number
}

interface GoalMissionRelationInput {
  missionId: string
  score: number
}

interface GoalValueRelationInput {
  valueId: string
  score: number
}

interface GoalStrategyRelationInput {
  strategyId: string
  score: number
}

const createGoalSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    goalStatement: z
      .string()
      .min(10, t('validation.goalStatementMin'))
      .max(1000, t('validation.goalStatementMax')),
    ownerId: z.string().optional(),
    operationalizesVisionsRelations: z
      .array(
        z.object({
          visionId: z.string().min(1, t('validation.visionRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    supportsMissionsRelations: z
      .array(
        z.object({
          missionId: z.string().min(1, t('validation.missionRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    supportsValuesRelations: z
      .array(
        z.object({
          valueId: z.string().min(1, t('validation.valueRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    achievedByStrategiesRelations: z
      .array(
        z.object({
          strategyId: z.string().min(1, t('validation.strategyRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
  })

export type GoalFormValues = z.infer<ReturnType<typeof createGoalSchema>>

const GoalForm: React.FC<GenericFormProps<Gea_Goal, GoalFormValues>> = ({
  data: goal,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const tForm = useTranslations('goals.form')
  const tTabs = useTranslations('goals.tabs')

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

  const { data: visionsData, loading: visionsLoading } = useQuery(GET_VISIONS, {
    variables: { where: companyWhere },
  })

  const { data: valuesData, loading: valuesLoading } = useQuery(GET_VALUES, {
    variables: { where: companyWhere },
  })

  const { data: missionsData, loading: missionsLoading } = useQuery(GET_MISSIONS, {
    variables: { where: companyWhere },
  })

  const { data: strategiesData, loading: strategiesLoading } = useQuery(GET_STRATEGIES, {
    variables: { where: companyWhere },
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const goalSchema = React.useMemo(() => createGoalSchema(tForm), [tForm])

  const defaultValues = React.useMemo<GoalFormValues>(
    () => ({
      name: goal?.name || '',
      goalStatement: goal?.goalStatement || '',
      ownerId: goal?.owners && goal.owners.length > 0 ? goal.owners[0].id : currentPerson?.id,
      operationalizesVisionsRelations:
        goal?.operationalizesVisionsConnection?.edges?.map(edge => ({
          visionId: edge?.node?.id ?? '',
          score: edge?.properties?.score ?? 0,
        })) || [],
      supportsMissionsRelations:
        goal?.supportsMissionsConnection?.edges?.map(edge => ({
          missionId: edge?.node?.id ?? '',
          score: edge?.properties?.score ?? 0,
        })) || [],
      supportsValuesRelations:
        goal?.supportsValuesConnection?.edges?.map(edge => ({
          valueId: edge?.node?.id ?? '',
          score: edge?.properties?.score ?? 0,
        })) || [],
      achievedByStrategiesRelations:
        goal?.achievedByStrategiesConnection?.edges?.map(edge => ({
          strategyId: edge?.node?.id ?? '',
          score: edge?.properties?.score ?? 0,
        })) || [],
      partOfArchitectures: goal?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: goal?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [goal, currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: goalSchema,
      onSubmit: goalSchema,
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

    if ((mode === 'view' || mode === 'edit') && goal) {
      form.reset({
        name: goal?.name || '',
        goalStatement: goal?.goalStatement || '',
        ownerId: goal?.owners && goal.owners.length > 0 ? goal.owners[0].id : currentPerson?.id,
        operationalizesVisionsRelations:
          goal?.operationalizesVisionsConnection?.edges?.map(edge => ({
            visionId: edge?.node?.id ?? '',
            score: edge?.properties?.score ?? 0,
          })) || [],
        supportsMissionsRelations:
          goal?.supportsMissionsConnection?.edges?.map(edge => ({
            missionId: edge?.node?.id ?? '',
            score: edge?.properties?.score ?? 0,
          })) || [],
        supportsValuesRelations:
          goal?.supportsValuesConnection?.edges?.map(edge => ({
            valueId: edge?.node?.id ?? '',
            score: edge?.properties?.score ?? 0,
          })) || [],
        achievedByStrategiesRelations:
          goal?.achievedByStrategiesConnection?.edges?.map(edge => ({
            strategyId: edge?.node?.id ?? '',
            score: edge?.properties?.score ?? 0,
          })) || [],
        partOfArchitectures: goal?.partOfArchitectures?.map(arch => arch.id) || [],
        depictedInDiagrams: goal?.depictedInDiagrams?.map(diag => diag.id) || [],
      })
    }
  }, [form, goal, isOpen, mode, defaultValues, currentPerson?.id])

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: goalSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'goalStatement',
      label: tForm('goalStatement'),
      type: 'textarea',
      required: true,
      validators: goalSchema.shape.goalStatement,
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
      name: 'operationalizesVisionsRelations',
      label: tForm('operationalizesVisions'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as GoalVisionRelationInput[])
          : []
        const allVisions: Gea_Vision[] = visionsData?.geaVisions || []
        const selectedVisionIds = new Set(
          relations.map(relation => relation.visionId).filter(Boolean)
        )
        const hasMoreVisionsToAdd = allVisions.some(vision => !selectedVisionIds.has(vision.id))

        const updateRelation = (
          index: number,
          key: keyof GoalVisionRelationInput,
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
          const nextRelations = [...relations, { visionId: '', score: 0 }]
          formField.handleChange(nextRelations)
        }

        return (
          <Stack spacing={2}>
            {relations.map((relation, index) => {
              const availableVisionsForRow = allVisions.filter(
                vision => vision.id === relation.visionId || !selectedVisionIds.has(vision.id)
              )

              return (
                <Stack
                  key={`vision-relation-${index}`}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    select
                    label={tForm('vision')}
                    value={relation.visionId}
                    onChange={event => updateRelation(index, 'visionId', event.target.value)}
                    disabled={disabled}
                    fullWidth
                  >
                    {availableVisionsForRow.map((vision: Gea_Vision) => (
                      <MenuItem key={vision.id} value={vision.id}>
                        {vision.name}
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
                    aria-label={tForm('removeVisionRelation')}
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
              disabled={disabled || visionsLoading || !hasMoreVisionsToAdd}
              sx={{ alignSelf: 'flex-start' }}
            >
              {tForm('addVisionRelation')}
            </Button>
          </Stack>
        )
      },
    },
    {
      name: 'supportsMissionsRelations',
      label: tForm('supportsMissions'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as GoalMissionRelationInput[])
          : []
        const allMissions: Gea_Mission[] = missionsData?.geaMissions || []
        const selectedMissionIds = new Set(
          relations.map(relation => relation.missionId).filter(Boolean)
        )
        const hasMoreMissionsToAdd = allMissions.some(
          mission => !selectedMissionIds.has(mission.id)
        )

        const updateRelation = (
          index: number,
          key: keyof GoalMissionRelationInput,
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
          const nextRelations = [...relations, { missionId: '', score: 0 }]
          formField.handleChange(nextRelations)
        }

        return (
          <Stack spacing={2}>
            {relations.map((relation, index) => {
              const availableMissionsForRow = allMissions.filter(
                mission => mission.id === relation.missionId || !selectedMissionIds.has(mission.id)
              )

              return (
                <Stack
                  key={`mission-relation-${index}`}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    select
                    label={tForm('mission')}
                    value={relation.missionId}
                    onChange={event => updateRelation(index, 'missionId', event.target.value)}
                    disabled={disabled}
                    fullWidth
                  >
                    {availableMissionsForRow.map((mission: Gea_Mission) => (
                      <MenuItem key={mission.id} value={mission.id}>
                        {mission.name}
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
                    aria-label={tForm('removeMissionRelation')}
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
              disabled={disabled || missionsLoading || !hasMoreMissionsToAdd}
              sx={{ alignSelf: 'flex-start' }}
            >
              {tForm('addMissionRelation')}
            </Button>
          </Stack>
        )
      },
    },
    {
      name: 'supportsValuesRelations',
      label: tForm('supportsValues'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as GoalValueRelationInput[])
          : []
        const allValues: Gea_Value[] = valuesData?.geaValues || []
        const selectedValueIds = new Set(
          relations.map(relation => relation.valueId).filter(Boolean)
        )
        const hasMoreValuesToAdd = allValues.some(value => !selectedValueIds.has(value.id))

        const updateRelation = (
          index: number,
          key: keyof GoalValueRelationInput,
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
          const nextRelations = [...relations, { valueId: '', score: 0 }]
          formField.handleChange(nextRelations)
        }

        return (
          <Stack spacing={2}>
            {relations.map((relation, index) => {
              const availableValuesForRow = allValues.filter(
                value => value.id === relation.valueId || !selectedValueIds.has(value.id)
              )

              return (
                <Stack
                  key={`value-relation-${index}`}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    select
                    label={tForm('value')}
                    value={relation.valueId}
                    onChange={event => updateRelation(index, 'valueId', event.target.value)}
                    disabled={disabled}
                    fullWidth
                  >
                    {availableValuesForRow.map((value: Gea_Value) => (
                      <MenuItem key={value.id} value={value.id}>
                        {value.name}
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
                    aria-label={tForm('removeValueRelation')}
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
              disabled={disabled || valuesLoading || !hasMoreValuesToAdd}
              sx={{ alignSelf: 'flex-start' }}
            >
              {tForm('addValueRelation')}
            </Button>
          </Stack>
        )
      },
    },
    {
      name: 'achievedByStrategiesRelations',
      label: tForm('achievedByStrategies'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as GoalStrategyRelationInput[])
          : []
        const allStrategies: Gea_Strategy[] = strategiesData?.geaStrategies || []
        const selectedStrategyIds = new Set(
          relations.map(relation => relation.strategyId).filter(Boolean)
        )
        const hasMoreStrategiesToAdd = allStrategies.some(
          strategy => !selectedStrategyIds.has(strategy.id)
        )

        const updateRelation = (
          index: number,
          key: keyof GoalStrategyRelationInput,
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
          const nextRelations = [...relations, { strategyId: '', score: 0 }]
          formField.handleChange(nextRelations)
        }

        return (
          <Stack spacing={2}>
            {relations.map((relation, index) => {
              const availableStrategiesForRow = allStrategies.filter(
                strategy =>
                  strategy.id === relation.strategyId || !selectedStrategyIds.has(strategy.id)
              )

              return (
                <Stack
                  key={`strategy-relation-${index}`}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    select
                    label={tForm('strategy')}
                    value={relation.strategyId}
                    onChange={event => updateRelation(index, 'strategyId', event.target.value)}
                    disabled={disabled}
                    fullWidth
                  >
                    {availableStrategiesForRow.map((strategy: Gea_Strategy) => (
                      <MenuItem key={strategy.id} value={strategy.id}>
                        {strategy.name}
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
                    aria-label={tForm('removeStrategyRelation')}
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
              disabled={disabled || strategiesLoading || !hasMoreStrategiesToAdd}
              sx={{ alignSelf: 'flex-start' }}
            >
              {tForm('addStrategyRelation')}
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
        enableDelete={mode === 'edit' && !!goal && isArchitect()}
        onDelete={goal?.id ? () => onDelete?.(goal.id) : undefined}
        onEditMode={onEditMode}
        entityId={goal?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          goal
            ? {
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
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

export default GoalForm
