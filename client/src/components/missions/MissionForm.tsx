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
import { GET_GOALS } from '@/graphql/goal'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig, TabConfig, SelectOption } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { Gea_Mission, Architecture, Gea_Vision, Gea_Value, Gea_Goal } from '../../gql/generated'
import ArchitectureForm from '../architectures/ArchitectureForm'

interface MissionGoalRelationInput {
  goalId: string
  score: number
}

interface MissionVisionRelationInput {
  visionId: string
  score: number
}

interface MissionValueRelationInput {
  valueId: string
  score: number
}

const createMissionSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    purposeStatement: z
      .string()
      .min(10, t('validation.purposeStatementMin'))
      .max(1000, t('validation.purposeStatementMax')),
    keywords: z.array(z.string()).optional(),
    year: z.date({ required_error: t('validation.yearRequired') }),
    ownerId: z.string().optional(),
    supportedByVisionsRelations: z
      .array(
        z.object({
          visionId: z.string().min(1, t('validation.visionRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    supportedByValuesRelations: z
      .array(
        z.object({
          valueId: z.string().min(1, t('validation.valueRequired')),
          score: z.number().min(-3, t('validation.scoreRange')).max(3, t('validation.scoreRange')),
        })
      )
      .optional(),
    supportedByGoalsRelations: z
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

export type MissionFormValues = z.infer<ReturnType<typeof createMissionSchema>>

const MissionForm: React.FC<GenericFormProps<Gea_Mission, MissionFormValues>> = ({
  data: mission,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const tForm = useTranslations('missions.form')
  const tTabs = useTranslations('missions.tabs')

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

  const { data: goalsData, loading: goalsLoading } = useQuery(GET_GOALS, {
    variables: { where: companyWhere },
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const missionSchema = React.useMemo(() => createMissionSchema(tForm), [tForm])

  const defaultValues = React.useMemo<MissionFormValues>(
    () => ({
      name: mission?.name || '',
      purposeStatement: mission?.purposeStatement || '',
      keywords: mission?.keywords || [],
      year: mission?.year ? new Date(mission.year) : new Date(),
      ownerId:
        mission?.owners && mission.owners.length > 0 ? mission.owners[0].id : currentPerson?.id,
      supportedByVisionsRelations:
        mission?.supportedByVisionsConnection?.edges?.map(edge => ({
          visionId: edge.node.id,
          score: edge.properties.score,
        })) ||
        mission?.supportedByVisions?.map(vision => ({ visionId: vision.id, score: 0 })) ||
        [],
      supportedByValuesRelations:
        mission?.supportedByValuesConnection?.edges?.map(edge => ({
          valueId: edge.node.id,
          score: edge.properties.score,
        })) ||
        mission?.supportedByValues?.map(value => ({ valueId: value.id, score: 0 })) ||
        [],
      supportedByGoalsRelations:
        mission?.supportedByGoalsConnection?.edges?.map(edge => ({
          goalId: edge.node.id,
          score: edge.properties.score,
        })) ||
        mission?.supportedByGoals?.map(goal => ({ goalId: goal.id, score: 0 })) ||
        [],
      partOfArchitectures: mission?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: mission?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [mission, currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: missionSchema,
      onSubmit: missionSchema,
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

    if ((mode === 'view' || mode === 'edit') && mission) {
      form.reset({
        name: mission?.name || '',
        purposeStatement: mission?.purposeStatement || '',
        keywords: mission?.keywords || [],
        year: mission?.year ? new Date(mission.year) : new Date(),
        ownerId:
          mission?.owners && mission.owners.length > 0 ? mission.owners[0].id : currentPerson?.id,
        supportedByVisionsRelations:
          mission?.supportedByVisionsConnection?.edges?.map(edge => ({
            visionId: edge.node.id,
            score: edge.properties.score,
          })) ||
          mission?.supportedByVisions?.map(vision => ({ visionId: vision.id, score: 0 })) ||
          [],
        supportedByValuesRelations:
          mission?.supportedByValuesConnection?.edges?.map(edge => ({
            valueId: edge.node.id,
            score: edge.properties.score,
          })) ||
          mission?.supportedByValues?.map(value => ({ valueId: value.id, score: 0 })) ||
          [],
        supportedByGoalsRelations:
          mission?.supportedByGoalsConnection?.edges?.map(edge => ({
            goalId: edge.node.id,
            score: edge.properties.score,
          })) ||
          mission?.supportedByGoals?.map(goal => ({ goalId: goal.id, score: 0 })) ||
          [],
        partOfArchitectures: mission?.partOfArchitectures?.map(arch => arch.id) || [],
        depictedInDiagrams: mission?.depictedInDiagrams?.map(diag => diag.id) || [],
      })
    }
  }, [form, mission, isOpen, mode, defaultValues, currentPerson?.id])

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: missionSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'year',
      label: tForm('year'),
      type: 'date',
      required: true,
      validators: missionSchema.shape.year,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'purposeStatement',
      label: tForm('purposeStatement'),
      type: 'textarea',
      required: true,
      validators: missionSchema.shape.purposeStatement,
      size: { xs: 12, md: 12 },
      tabId: 'general',
    },
    {
      name: 'keywords',
      label: tForm('keywords'),
      type: 'autocomplete',
      multiple: true,
      freeSolo: true,
      options: [],
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
      name: 'supportedByVisionsRelations',
      label: tForm('supportedByVisions'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as MissionVisionRelationInput[])
          : []
        const allVisions: Gea_Vision[] = visionsData?.geaVisions || []
        const selectedVisionIds = new Set(relations.map(relation => relation.visionId).filter(Boolean))
        const hasMoreVisionsToAdd = allVisions.some(vision => !selectedVisionIds.has(vision.id))

        const updateRelation = (
          index: number,
          key: keyof MissionVisionRelationInput,
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
      name: 'supportedByValuesRelations',
      label: tForm('supportedByValues'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as MissionValueRelationInput[])
          : []
        const allValues: Gea_Value[] = valuesData?.geaValues || []
        const selectedValueIds = new Set(relations.map(relation => relation.valueId).filter(Boolean))
        const hasMoreValuesToAdd = allValues.some(value => !selectedValueIds.has(value.id))

        const updateRelation = (
          index: number,
          key: keyof MissionValueRelationInput,
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
      name: 'supportedByGoalsRelations',
      label: tForm('supportedByGoals'),
      type: 'custom',
      size: 12,
      tabId: 'relationships',
      customRender: (formField, disabled) => {
        const relations = Array.isArray(formField.state.value)
          ? (formField.state.value as MissionGoalRelationInput[])
          : []
        const allGoals: Gea_Goal[] = goalsData?.geaGoals || []
        const selectedGoalIds = new Set(relations.map(relation => relation.goalId).filter(Boolean))
        const hasMoreGoalsToAdd = allGoals.some(goal => !selectedGoalIds.has(goal.id))

        const updateRelation = (
          index: number,
          key: keyof MissionGoalRelationInput,
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
            {relations.map((relation, index) => (
              <Stack key={`goal-relation-${index}`} direction="row" spacing={1} alignItems="center">
                {(() => {
                  const availableGoalsForRow = allGoals.filter(
                    goal => goal.id === relation.goalId || !selectedGoalIds.has(goal.id)
                  )

                  return (
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
                  )
                })()}

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
            ))}

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
        isNested={isNested}
        fields={fields}
        tabs={tabs}
        form={form}
        enableDelete={mode === 'edit' && !!mission && isArchitect()}
        onDelete={mission?.id ? () => onDelete?.(mission.id) : undefined}
        onEditMode={onEditMode}
        entityId={mission?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          mission
            ? {
                createdAt: mission.createdAt,
                updatedAt: mission.updatedAt,
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

export default MissionForm
