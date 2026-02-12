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
import { GET_VISIONS } from '@/graphql/vision'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig, TabConfig, SelectOption } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { Gea_Value, Architecture, Gea_Mission, Gea_Vision } from '../../gql/generated'
import ArchitectureForm from '../architectures/ArchitectureForm'

const createValueSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    valueStatement: z
      .string()
      .min(10, t('validation.valueStatementMin'))
      .max(1000, t('validation.valueStatementMax')),
    ownerId: z.string().optional(),
    supportsMissions: z.array(z.string()).optional(),
    supportsVisions: z.array(z.string()).optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
  })

export type ValueFormValues = z.infer<ReturnType<typeof createValueSchema>>

const ValueForm: React.FC<GenericFormProps<Gea_Value, ValueFormValues>> = ({
  data: value,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const tForm = useTranslations('values.form')
  const tTabs = useTranslations('values.tabs')

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

  const { data: visionsData, loading: visionsLoading } = useQuery(GET_VISIONS, {
    variables: { where: companyWhere },
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const valueSchema = React.useMemo(() => createValueSchema(tForm), [tForm])

  const defaultValues = React.useMemo<ValueFormValues>(
    () => ({
      name: value?.name || '',
      valueStatement: value?.valueStatement || '',
      ownerId: value?.owners && value.owners.length > 0 ? value.owners[0].id : currentPerson?.id,
      supportsMissions: value?.supportsMissions?.map(mission => mission.id) || [],
      supportsVisions: value?.supportsVisions?.map(vision => vision.id) || [],
      partOfArchitectures: value?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: value?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [value, currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: valueSchema,
      onSubmit: valueSchema,
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

    if ((mode === 'view' || mode === 'edit') && value) {
      form.reset({
        name: value?.name || '',
        valueStatement: value?.valueStatement || '',
        ownerId: value?.owners && value.owners.length > 0 ? value.owners[0].id : currentPerson?.id,
        supportsMissions: value?.supportsMissions?.map(mission => mission.id) || [],
        supportsVisions: value?.supportsVisions?.map(vision => vision.id) || [],
        partOfArchitectures: value?.partOfArchitectures?.map(arch => arch.id) || [],
        depictedInDiagrams: value?.depictedInDiagrams?.map(diag => diag.id) || [],
      })
    }
  }, [form, value, isOpen, mode, defaultValues, currentPerson?.id])

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: valueSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'valueStatement',
      label: tForm('valueStatement'),
      type: 'textarea',
      required: true,
      validators: valueSchema.shape.valueStatement,
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
      name: 'supportsVisions',
      label: tForm('supportsVisions'),
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
      onChipClick: createChipClickHandler('supportsVisions'),
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
        enableDelete={mode === 'edit' && !!value && isArchitect()}
        onDelete={value?.id ? () => onDelete?.(value.id) : undefined}
        onEditMode={onEditMode}
        entityId={value?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          value
            ? {
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
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

export default ValueForm
