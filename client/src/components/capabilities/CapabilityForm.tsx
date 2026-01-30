'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_PERSONS } from '@/graphql/person'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_CAPABILITIES } from '@/graphql/capability'
import {
  BusinessCapability,
  CapabilityStatus,
  CapabilityType,
  Application,
  Architecture,
} from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import ApplicationForm from '../applications/ApplicationForm'
import ArchitectureForm from '../architectures/ArchitectureForm'

// Schema factory function with translations
const createCapabilitySchema = (t: any) =>
  z.object({
    name: z
      .string()
      .min(3, t('validation.nameMin'))
      .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
    description: z
      .string()
      .min(10, t('validation.descriptionMin'))
      .max(1000, t('validation.descriptionMax')),
    maturityLevel: z
      .number()
      .int()
      .min(1, 'Level muss zwischen 1 und 5 sein')
      .max(5, 'Level muss zwischen 1 und 5 sein'),
    status: z.nativeEnum(CapabilityStatus),
    type: z.nativeEnum(CapabilityType).optional(),
    businessValue: z
      .number()
      .int()
      .min(0, t('validation.businessValueMin'))
      .max(10, 'Business value may be at most 10'),
    sequenceNumber: z.number().int().min(0, t('validation.sequenceNumberMin')).optional(),
    introductionDate: z.date().optional(),
    endDate: z.date().optional(),
    ownerId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    parentId: z.string().optional(),
    children: z.array(z.string()).optional(),
    supportedByApplications: z.array(z.string()).optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    partOfDiagrams: z.array(z.string()).optional(),
  })

// TypeScript Typen basierend auf dem Schema
export type CapabilityFormValues = z.infer<ReturnType<typeof createCapabilitySchema>>

import { GenericFormProps } from '../common/GenericFormProps'

export interface CapabilityFormProps
  extends GenericFormProps<BusinessCapability, CapabilityFormValues> {
  availableCapabilities?: BusinessCapability[]
  availableTags?: string[]
}

const getLevelLabel = (level: number | null | undefined, t: any): string => {
  if (level === null || level === undefined) {
    return t('capabilities.maturityLevels.undefined')
  }

  return t(`capabilities.maturityLevels.${level}`)
}

const getStatusLabel = (status: CapabilityStatus, t: any): string => {
  return t(`capabilities.statuses.${status}`)
}

const getTypeLabel = (type: CapabilityType, t: any): string => {
  return t(`capabilities.types.${type}`)
}

const CapabilityForm: React.FC<CapabilityFormProps> = ({
  data: capability,
  availableCapabilities = [],
  availableTags = [],
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
  ...restProps
}) => {
  const t = useTranslations()
  const tForm = useTranslations('capabilities.form')
  const tTabs = useTranslations('capabilities.tabs')

  // Create schema with translations
  const capabilitySchema = React.useMemo(() => createCapabilitySchema(tForm), [tForm])

  // State for nested entity forms and parent dialog visibility
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

  // Initialize chip click handlers
  const { createChipClickHandler } = useChipClickHandlers({
    onOpenNestedForm: (entityType, entityId, mode) => {
      setNestedFormState({
        isOpen: true,
        entityType,
        entityId,
        mode,
      })
    },
  })

  // Handler to close nested form and show parent again
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

  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })

  // Load applications
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })

  // Architekturen laden
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })

  // Diagramme laden
  const { data: diagramData, loading: diagramLoading } = useQuery(GET_DIAGRAMS, {
    variables: { where: companyWhere },
  })

  // Queries for individual nested entities
  const { data: nestedCapabilityData } = useQuery(GET_CAPABILITIES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'capabilities',
  })

  const { data: nestedApplicationData } = useQuery(GET_APPLICATIONS, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applications',
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  // Initialize form data with useMemo to avoid unnecessary re-renders
  const defaultValues = React.useMemo<CapabilityFormValues>(
    () => ({
      name: '',
      description: '',
      maturityLevel: 1, // Korrigiert: 1-5 statt 0
      businessValue: 0,
      status: CapabilityStatus.ACTIVE,
      type: CapabilityType.OPERATIONAL,
      sequenceNumber: 0,
      introductionDate: undefined,
      endDate: undefined,
      ownerId: '', // Leer lassen, wird von currentPerson bei Bedarf gesetzt
      tags: [],
      parentId: '',
      children: [],
      supportedByApplications: [],
      partOfArchitectures: [],
      partOfDiagrams: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primary validation on changes
      onChange: capabilitySchema,
      // Validation on submit
      onSubmit: capabilitySchema,
    },
  })

  useEffect(() => {
    if (isOpen && capability) {
      // Use setFieldValue for each field individually - following proven pattern of CompanyForm
      form.setFieldValue('name', capability?.name ?? '')
      form.setFieldValue('description', capability?.description ?? '')
      form.setFieldValue('maturityLevel', capability?.maturityLevel ?? 1)
      form.setFieldValue('businessValue', capability?.businessValue ?? 0)
      form.setFieldValue('status', capability?.status ?? CapabilityStatus.ACTIVE)
      form.setFieldValue('type', capability?.type ?? CapabilityType.OPERATIONAL)
      form.setFieldValue('sequenceNumber', capability?.sequenceNumber ?? 0)
      form.setFieldValue(
        'introductionDate',
        capability?.introductionDate ? new Date(capability.introductionDate) : undefined
      )
      form.setFieldValue('endDate', capability?.endDate ? new Date(capability.endDate) : undefined)
      form.setFieldValue('ownerId', capability?.owners?.[0]?.id ?? '')
      form.setFieldValue('tags', capability?.tags ?? [])
      form.setFieldValue('parentId', capability?.parents?.[0]?.id ?? '')
      form.setFieldValue('children', capability?.children?.map((child: any) => child.id) ?? [])
      form.setFieldValue(
        'supportedByApplications',
        capability?.supportedByApplications?.map((app: any) => app.id) ?? []
      )
      form.setFieldValue(
        'partOfArchitectures',
        capability?.partOfArchitectures?.map((arch: any) => arch.id) ?? []
      )
      form.setFieldValue(
        'partOfDiagrams',
        capability?.depictedInDiagrams?.map((diagram: any) => diagram.id) ?? []
      )
    } else if (!isOpen) {
      form.reset()
    }
  }, [form, capability, isOpen])

  // Field configuration for the generic form
  interface SelectOption {
    value: string | number
    label: string
  }

  interface FieldConfigWithSelect extends FieldConfig {
    options?: SelectOption[]
    loadingOptions?: boolean
    rows?: number
    size?: { xs: number; md: number } | number
  }

  const fields: FieldConfigWithSelect[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: capabilitySchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'status',
      label: tForm('status'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.status,
      options: Object.values(CapabilityStatus).map(
        (status): SelectOption => ({
          value: status,
          label: getStatusLabel(status, t),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'type',
      label: tForm('type'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.type,
      options: Object.values(CapabilityType).map(
        (type): SelectOption => ({
          value: type,
          label: getTypeLabel(type, t),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'sequenceNumber',
      label: tForm('sequenceNumber'),
      type: 'number',
      validators: capabilitySchema.shape.sequenceNumber,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: tForm('description'),
      type: 'textarea',
      required: true,
      validators: capabilitySchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'maturityLevel',
      label: tForm('maturityLevel'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.maturityLevel,
      options: [1, 2, 3, 4, 5].map(
        (level): SelectOption => ({
          value: level,
          label: getLevelLabel(level, t),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'businessValue',
      label: tForm('businessValue'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.businessValue,
      options: Array.from(
        { length: 11 },
        (_, i): SelectOption => ({
          value: i,
          label: i.toString(),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'tags',
      label: tForm('tags'),
      type: 'tags',
      options: availableTags.map((tag): SelectOption => ({ value: tag, label: tag })),
      size: 12,
      tabId: 'general',
    },
    {
      name: 'ownerId',
      label: tForm('owner'),
      type: 'select',
      options:
        personData?.people?.map(
          (person: { id: string; firstName: string; lastName: string }): SelectOption => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ) || [],
      size: { xs: 12, md: 6 },
      loadingOptions: personLoading,
      tabId: 'general',
    },
    {
      name: 'parentId',
      label: tForm('parentCapability'),
      type: 'select',
      options: [
        { value: '', label: tForm('none') },
        ...availableCapabilities
          .filter(cap => cap.id !== capability?.id)
          .map(
            (cap): SelectOption => ({
              value: cap.id,
              label: cap.name,
            })
          ),
      ],
      size: 12,
      tabId: 'relationships',
    },
    {
      name: 'children',
      label: tForm('childCapabilities'),
      type: 'autocomplete',
      multiple: true,
      options: availableCapabilities
        .filter(cap => cap.id !== capability?.id)
        .map(
          (cap): SelectOption => ({
            value: cap.id,
            label: cap.name,
          })
        ),
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('children'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingCap = availableCapabilities.find(cap => cap.id === option)
          return matchingCap?.name || option
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
      name: 'supportedByApplications',
      label: tForm('supportedByApplications'),
      type: 'autocomplete',
      multiple: true,
      options:
        applicationData?.applications?.map(
          (app: Application): SelectOption => ({
            value: app.id,
            label: app.name,
          })
        ) || [],
      loadingOptions: applicationLoading,
      size: 12,
      tabId: 'relationships',
      onChipClick: createChipClickHandler('supportedByApplications'),
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = applicationData?.applications?.find(
            (app: Application) => app.id === option
          )
          return matchingApp?.name || option
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
      name: 'partOfDiagrams',
      label: tForm('partOfDiagrams'),
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
      onChipClick: createChipClickHandler('partOfDiagrams'),
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
    {
      name: 'introductionDate',
      label: tForm('introductionDate'),
      type: 'date',
      validators: capabilitySchema.shape.introductionDate,
      size: { xs: 12, md: 6 },
      tabId: 'lifecycle',
    },
    {
      name: 'endDate',
      label: tForm('endDate'),
      type: 'date',
      validators: capabilitySchema.shape.endDate,
      size: { xs: 12, md: 6 },
      tabId: 'lifecycle',
    },
  ]

  // Tabs-Konfiguration
  const tabs = [
    { id: 'general', label: tTabs('general') },
    { id: 'lifecycle', label: tTabs('lifecycle') },
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
        enableDelete={mode === 'edit' && !!capability && isArchitect()}
        onDelete={capability?.id ? () => onDelete?.(capability.id) : undefined}
        onEditMode={onEditMode}
        entityId={capability?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          capability
            ? {
                createdAt: capability.createdAt,
                updatedAt: capability.updatedAt,
              }
            : undefined
        }
      />

      {/* Nested Capability Form (for child capabilities) */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'capabilities' &&
        nestedCapabilityData?.businessCapabilities?.[0] && (
          <CapabilityForm
            data={nestedCapabilityData.businessCapabilities[0]}
            availableCapabilities={availableCapabilities}
            availableTags={availableTags}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Application Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'applications' &&
        nestedApplicationData?.applications?.[0] && (
          <ApplicationForm
            data={nestedApplicationData.applications[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Architecture Form */}
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

export default CapabilityForm
