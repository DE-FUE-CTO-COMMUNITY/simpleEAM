'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_PERSONS } from '@/graphql/person'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_MISSIONS } from '@/graphql/mission'
import { GET_VALUES } from '@/graphql/value'
import { GET_GOALS } from '@/graphql/goal'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig, TabConfig, SelectOption } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { Gea_Vision, Architecture, Gea_Mission, Gea_Value, Gea_Goal } from '../../gql/generated'
import ArchitectureForm from '../architectures/ArchitectureForm'
import MissionForm from '../missions/MissionForm'
import ValueForm from '../values/ValueForm'
import GoalForm from '../goals/GoalForm'

const createVisionSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    visionStatement: z
      .string()
      .min(10, t('validation.visionStatementMin'))
      .max(1000, t('validation.visionStatementMax')),
    timeHorizon: z.string().optional(),
    year: z.date({ required_error: t('validation.yearRequired') }),
    ownerId: z.string().optional(),
    supportsMissions: z.array(z.string()).optional(),
    supportedByValues: z.array(z.string()).optional(),
    supportedByGoals: z.array(z.string()).optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
  })

export type VisionFormValues = z.infer<ReturnType<typeof createVisionSchema>>

interface VisionFormProps extends GenericFormProps<Gea_Vision, VisionFormValues> {}

const VisionForm: React.FC<VisionFormProps> = ({
  data: vision,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const tForm = useTranslations('visions.form')
  const tTabs = useTranslations('visions.tabs')

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

  const { data: missionsData, loading: missionsLoading } = useQuery(GET_MISSIONS, {
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

  const visionSchema = React.useMemo(() => createVisionSchema(tForm), [tForm])

  const defaultValues = React.useMemo<VisionFormValues>(
    () => ({
      name: vision?.name || '',
      visionStatement: vision?.visionStatement || '',
      timeHorizon: vision?.timeHorizon || '',
      year: vision?.year ? new Date(vision.year) : new Date(),
      ownerId: vision?.owners && vision.owners.length > 0 ? vision.owners[0].id : currentPerson?.id,
      supportsMissions: vision?.supportsMissions?.map(m => m.id) || [],
      supportedByValues: vision?.supportedByValues?.map(v => v.id) || [],
      supportedByGoals: vision?.supportedByGoals?.map(g => g.id) || [],
      partOfArchitectures: vision?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: vision?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [vision, currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: visionSchema,
      onSubmit: visionSchema,
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

    if ((mode === 'view' || mode === 'edit') && vision) {
      form.reset({
        name: vision?.name || '',
        visionStatement: vision?.visionStatement || '',
        timeHorizon: vision?.timeHorizon || '',
        year: vision?.year ? new Date(vision.year) : new Date(),
        ownerId:
          vision?.owners && vision.owners.length > 0 ? vision.owners[0].id : currentPerson?.id,
        supportsMissions: vision?.supportsMissions?.map(m => m.id) || [],
        supportedByValues: vision?.supportedByValues?.map(v => v.id) || [],
        supportedByGoals: vision?.supportedByGoals?.map(g => g.id) || [],
        partOfArchitectures: vision?.partOfArchitectures?.map(arch => arch.id) || [],
        depictedInDiagrams: vision?.depictedInDiagrams?.map(diag => diag.id) || [],
      })
    }
  }, [form, vision, isOpen, mode, defaultValues, currentPerson?.id])

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: visionSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'year',
      label: tForm('year'),
      type: 'date',
      required: true,
      validators: visionSchema.shape.year,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'visionStatement',
      label: tForm('visionStatement'),
      type: 'textarea',
      required: true,
      validators: visionSchema.shape.visionStatement,
      size: { xs: 12, md: 12 },
      tabId: 'general',
    },
    {
      name: 'timeHorizon',
      label: tForm('timeHorizon'),
      type: 'text',
      validators: visionSchema.shape.timeHorizon,
      size: { xs: 12, md: 6 },
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
      name: 'supportedByValues',
      label: tForm('supportedByValues'),
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
      onChipClick: createChipClickHandler('supportedByValues'),
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
      name: 'supportedByGoals',
      label: tForm('supportedByGoals'),
      type: 'autocomplete',
      multiple: true,
      options:
        goalsData?.geaGoals?.map(
          (goal: Gea_Goal): SelectOption => ({
            value: goal.id,
            label: goal.name,
          })
        ) || [],
      loadingOptions: goalsLoading,
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('supportedByGoals'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingGoal = goalsData?.geaGoals?.find((goal: Gea_Goal) => goal.id === option)
          return matchingGoal?.name || option
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
        isNested={isNested}
        fields={fields}
        tabs={tabs}
        form={form}
        enableDelete={mode === 'edit' && !!vision && isArchitect()}
        onDelete={vision?.id ? () => onDelete?.(vision.id) : undefined}
        onEditMode={onEditMode}
        entityId={vision?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          vision
            ? {
                createdAt: vision.createdAt,
                updatedAt: vision.updatedAt,
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

export default VisionForm
