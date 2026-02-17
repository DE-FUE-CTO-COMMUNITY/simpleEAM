'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { ProcessStatus, ProcessType } from '@/gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_BUSINESS_PROCESSES } from '@/graphql/businessProcess'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import GenericForm, { FieldConfig, SelectOption, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { BusinessProcessFormValues, BusinessProcessType } from './types'

const createBusinessProcessSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    description: z.string().max(2000, t('validation.descriptionMax')).optional(),
    processType: z.nativeEnum(ProcessType),
    status: z.nativeEnum(ProcessStatus),
    maturityLevel: z.number().min(1).max(5).optional().nullable(),
    category: z.string().max(100, t('validation.categoryMax')).optional(),
    tags: z.array(z.string()).optional(),
    ownerId: z.string().optional(),
    parentProcessId: z.string().optional(),
    supportsCapabilityIds: z.array(z.string()).optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
  })

type BusinessProcessFormProps = GenericFormProps<BusinessProcessType, BusinessProcessFormValues>

const BusinessProcessForm: React.FC<BusinessProcessFormProps> = ({
  data: businessProcess,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const tEntity = useTranslations('businessProcesses')
  const t = useTranslations('businessProcesses.form')
  const tTabs = useTranslations('businessProcesses.tabs')
  const tStatuses = useTranslations('businessProcesses.statuses')
  const tTypes = useTranslations('businessProcesses.processTypes')
  const tCommon = useTranslations('common')
  const { currentPerson } = useCurrentPerson()

  const personWhere = useCompanyWhere('companies')
  const companyWhere = useCompanyWhere('company')

  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })

  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES, {
    variables: { where: companyWhere },
  })

  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })

  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS, {
    variables: { where: companyWhere },
  })

  const { data: businessProcessesData } = useQuery(GET_BUSINESS_PROCESSES, {
    variables: { where: companyWhere },
  })

  const availableBusinessProcesses =
    (businessProcessesData?.businessProcesses as BusinessProcessType[] | undefined) || []

  const schema = React.useMemo(() => createBusinessProcessSchema(t), [t])

  const defaultValues = React.useMemo<BusinessProcessFormValues>(
    () => ({
      name: businessProcess?.name || '',
      description: businessProcess?.description || '',
      processType: businessProcess?.processType || ProcessType.CORE,
      status: businessProcess?.status || ProcessStatus.ACTIVE,
      maturityLevel: businessProcess?.maturityLevel || null,
      category: businessProcess?.category || '',
      tags: businessProcess?.tags || [],
      ownerId:
        businessProcess?.owners && businessProcess.owners.length > 0
          ? businessProcess.owners[0].id
          : currentPerson?.id || '',
      parentProcessId:
        businessProcess?.parentProcess && businessProcess.parentProcess.length > 0
          ? businessProcess.parentProcess[0].id
          : '',
      supportsCapabilityIds: businessProcess?.supportsCapabilities?.map(capability => capability.id) || [],
      partOfArchitectures: businessProcess?.partOfArchitectures?.map(architecture => architecture.id) || [],
      depictedInDiagrams: businessProcess?.depictedInDiagrams?.map(diagram => diagram.id) || [],
    }),
    [businessProcess, currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
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

    if ((mode === 'view' || mode === 'edit') && businessProcess) {
      form.reset(defaultValues)
    }
  }, [isOpen, mode, businessProcess, defaultValues, form])

  const processTypeOptions: SelectOption[] = [
    { value: ProcessType.CORE, label: tTypes(ProcessType.CORE) },
    { value: ProcessType.SUPPORT, label: tTypes(ProcessType.SUPPORT) },
    { value: ProcessType.MANAGEMENT, label: tTypes(ProcessType.MANAGEMENT) },
  ]

  const statusOptions: SelectOption[] = [
    { value: ProcessStatus.ACTIVE, label: tStatuses(ProcessStatus.ACTIVE) },
    { value: ProcessStatus.PLANNED, label: tStatuses(ProcessStatus.PLANNED) },
    { value: ProcessStatus.RETIRED, label: tStatuses(ProcessStatus.RETIRED) },
  ]

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      tabId: 'general',
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      rows: 4,
      tabId: 'general',
    },
    {
      name: 'processType',
      label: t('processType'),
      type: 'select',
      required: true,
      options: processTypeOptions,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      required: true,
      options: statusOptions,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'maturityLevel',
      label: t('maturityLevel'),
      type: 'select',
      options: [1, 2, 3, 4, 5].map(level => ({ value: level, label: String(level) })),
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'category',
      label: t('category'),
      type: 'text',
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'tags',
      label: t('tags'),
      type: 'tags',
      options: [],
      tabId: 'general',
    },
    {
      name: 'ownerId',
      label: t('owner'),
      type: 'select',
      options:
        personData?.people?.map((person: any) => ({
          value: person.id,
          label: `${person.firstName} ${person.lastName}`,
        })) || [],
      loadingOptions: personLoading,
      tabId: 'relationships',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'parentProcessId',
      label: t('parentProcess'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
        ...availableBusinessProcesses
          .filter(process => process.id !== businessProcess?.id)
          .map(process => ({ value: process.id, label: process.name })),
      ],
      tabId: 'relationships',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'supportsCapabilityIds',
      label: t('supportsCapabilities'),
      type: 'autocomplete',
      multiple: true,
      options:
        capabilitiesData?.businessCapabilities?.map((capability: any) => ({
          value: capability.id,
          label: capability.name,
        })) || [],
      loadingOptions: capabilitiesLoading,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matching = capabilitiesData?.businessCapabilities?.find((cap: any) => cap.id === option)
          return matching?.name || option
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
      label: t('partOfArchitectures'),
      type: 'autocomplete',
      multiple: true,
      options:
        architecturesData?.architectures?.map((architecture: any) => ({
          value: architecture.id,
          label: architecture.name,
        })) || [],
      loadingOptions: architecturesLoading,
      tabId: 'architecture',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matching = architecturesData?.architectures?.find(
            (architecture: any) => architecture.id === option
          )
          return matching?.name || option
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
      label: t('depictedInDiagrams'),
      type: 'autocomplete',
      multiple: true,
      options:
        diagramsData?.diagrams?.map((diagram: any) => ({
          value: diagram.id,
          label: diagram.title,
        })) || [],
      loadingOptions: diagramsLoading,
      tabId: 'architecture',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matching = diagramsData?.diagrams?.find((diagram: any) => diagram.id === option)
          return matching?.title || option
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
    { id: 'architecture', label: tTabs('architecture') },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
      onDelete={businessProcess?.id && onDelete ? () => onDelete(businessProcess.id) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      title={
        mode === 'create'
          ? tEntity('createTitle')
          : mode === 'edit'
            ? tEntity('editTitle')
            : tEntity('viewTitle')
      }
      fields={fields}
      tabs={tabs}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={tEntity('deleteConfirmation')}
    />
  )
}

export default BusinessProcessForm
