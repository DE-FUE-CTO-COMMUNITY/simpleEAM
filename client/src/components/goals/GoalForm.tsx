'use client'

import React, { useEffect, useState } from 'react'
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

const createGoalSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    goalStatement: z
      .string()
      .min(10, t('validation.goalStatementMin'))
      .max(1000, t('validation.goalStatementMax')),
    ownerId: z.string().optional(),
    operationalizesVisions: z.array(z.string()).optional(),
    supportsMissions: z.array(z.string()).optional(),
    supportsValues: z.array(z.string()).optional(),
    achievedByStrategies: z.array(z.string()).optional(),
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
      operationalizesVisions: goal?.operationalizesVisions?.map(vision => vision.id) || [],
      supportsMissions: goal?.supportsMissions?.map(mission => mission.id) || [],
      supportsValues: goal?.supportsValues?.map(value => value.id) || [],
      achievedByStrategies: goal?.achievedByStrategies?.map(strategy => strategy.id) || [],
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
        operationalizesVisions: goal?.operationalizesVisions?.map(vision => vision.id) || [],
        supportsMissions: goal?.supportsMissions?.map(mission => mission.id) || [],
        supportsValues: goal?.supportsValues?.map(value => value.id) || [],
        achievedByStrategies: goal?.achievedByStrategies?.map(strategy => strategy.id) || [],
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
      name: 'operationalizesVisions',
      label: tForm('operationalizesVisions'),
      type: 'autocomplete',
      multiple: true,
      options:
        visionsData?.geaVisions?.map(
          (vision: Gea_Vision): SelectOption => ({
            value: vision.id,
            label: vision.name,
          })
        ) || [],
      loadingOptions: visionsLoading,
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('operationalizesVisions'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingVision = visionsData?.geaVisions?.find(
            (vision: Gea_Vision) => vision.id === option
          )
          return matchingVision?.name || option
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
      name: 'supportsMissions',
      label: tForm('supportsMissions'),
      type: 'autocomplete',
      multiple: true,
      options:
        missionsData?.geaMissions?.map(
          (mission: Gea_Mission): SelectOption => ({
            value: mission.id,
            label: mission.name,
          })
        ) || [],
      loadingOptions: missionsLoading,
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('supportsMissions'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingMission = missionsData?.geaMissions?.find(
            (mission: Gea_Mission) => mission.id === option
          )
          return matchingMission?.name || option
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
      name: 'supportsValues',
      label: tForm('supportsValues'),
      type: 'autocomplete',
      multiple: true,
      options:
        valuesData?.geaValues?.map(
          (value: Gea_Value): SelectOption => ({
            value: value.id,
            label: value.name,
          })
        ) || [],
      loadingOptions: valuesLoading,
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('supportsValues'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingValue = valuesData?.geaValues?.find(
            (value: Gea_Value) => value.id === option
          )
          return matchingValue?.name || option
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
      name: 'achievedByStrategies',
      label: tForm('achievedByStrategies'),
      type: 'autocomplete',
      multiple: true,
      options:
        strategiesData?.geaStrategies?.map(
          (strategy: Gea_Strategy): SelectOption => ({
            value: strategy.id,
            label: strategy.name,
          })
        ) || [],
      loadingOptions: strategiesLoading,
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('achievedByStrategies'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingStrategy = strategiesData?.geaStrategies?.find(
            (strategy: Gea_Strategy) => strategy.id === option
          )
          return matchingStrategy?.name || option
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
