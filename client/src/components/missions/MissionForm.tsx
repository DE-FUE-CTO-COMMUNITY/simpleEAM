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
import { GET_GOALS } from '@/graphql/goal'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig, TabConfig, SelectOption } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { Gea_Mission, Architecture, Gea_Vision, Gea_Value, Gea_Goal } from '../../gql/generated'
import ArchitectureForm from '../architectures/ArchitectureForm'

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
    supportedByVisions: z.array(z.string()).optional(),
    supportedByValues: z.array(z.string()).optional(),
    supportedByGoals: z.array(z.string()).optional(),
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
      supportedByVisions: mission?.supportedByVisions?.map(vision => vision.id) || [],
      supportedByValues: mission?.supportedByValues?.map(value => value.id) || [],
      supportedByGoals: mission?.supportedByGoals?.map(goal => goal.id) || [],
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
        supportedByVisions: mission?.supportedByVisions?.map(vision => vision.id) || [],
        supportedByValues: mission?.supportedByValues?.map(value => value.id) || [],
        supportedByGoals: mission?.supportedByGoals?.map(goal => goal.id) || [],
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
      name: 'supportedByVisions',
      label: tForm('supportedByVisions'),
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
      onChipClick: createChipClickHandler('supportedByVisions'),
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
