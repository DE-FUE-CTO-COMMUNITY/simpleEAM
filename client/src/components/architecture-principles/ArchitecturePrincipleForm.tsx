'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { ArchitecturePrinciple, PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_APPLICATIONS } from '@/graphql/application'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { useCategoryLabel, usePriorityLabel } from './utils'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import ArchitectureForm from '../architectures/ArchitectureForm'
import ApplicationForm from '../applications/ApplicationForm'

// Schema factory function with translations
const createArchitecturePrincipleSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .min(3, t('validation.nameMin'))
      .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
    description: z
      .string()
      .min(10, t('validation.descriptionMin'))
      .max(1000, t('validation.descriptionMax')),
    category: z.nativeEnum(PrincipleCategory),
    priority: z.nativeEnum(PrinciplePriority),
    rationale: z.string().optional(),
    implications: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean(),
    ownerId: z.string().optional(),
    appliedInArchitectureIds: z.array(z.string()).optional(),
    implementedByApplicationIds: z.array(z.string()).optional(),
  })

// TypeScript Typen basierend auf dem Schema
export type ArchitecturePrincipleFormValues = z.infer<
  ReturnType<typeof createArchitecturePrincipleSchema>
>

import { GenericFormProps } from '../common/GenericFormProps'

const ArchitecturePrincipleForm: React.FC<
  GenericFormProps<ArchitecturePrinciple, ArchitecturePrincipleFormValues>
> = ({
  data: principle,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const t = useTranslations('architecturePrinciples')
  const tForm = useTranslations('architecturePrinciples.form')
  const tCommon = useTranslations('common')
  const tForms = useTranslations('forms.validation')
  const getCategoryLabel = useCategoryLabel()
  const getPriorityLabel = usePriorityLabel()

  const [nestedFormState, setNestedFormState] = useState<{
    isOpen: boolean
    entityType: string | null
    entityId: string | null
    mode: 'view' | 'edit'
  }>({ isOpen: false, entityType: null, entityId: null, mode: 'view' })

  const { createChipClickHandler } = useChipClickHandlers({
    onOpenNestedForm: (entityType, entityId, mode) => {
      setNestedFormState({ isOpen: true, entityType, entityId, mode })
    },
    customEntityTypeMap: {
      appliedInArchitectureIds: 'architectures',
      implementedByApplicationIds: 'applications',
    },
  })

  const handleCloseNestedForm = () => {
    setNestedFormState({ isOpen: false, entityType: null, entityId: null, mode: 'view' })
  }

  // Create schema with translations
  const architecturePrincipleSchema = React.useMemo(
    () => createArchitecturePrincipleSchema(tForm),
    [tForm]
  )

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()
  const personWhere = useCompanyWhere('companies')

  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })

  // Load architectures and applications only within selected company
  const companyWhere = useCompanyWhere('company')
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })

  // Nested queries for chip navigation
  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const { data: nestedApplicationData } = useQuery(GET_APPLICATIONS, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applications',
  })

  // Initialize form data with useMemo
  const defaultValues = React.useMemo<ArchitecturePrincipleFormValues>(
    () => ({
      name: '',
      description: '',
      category: PrincipleCategory.BUSINESS,
      priority: PrinciplePriority.MEDIUM,
      rationale: '',
      implications: '',
      tags: [],
      isActive: true,
      ownerId: currentPerson?.id || '',
      appliedInArchitectureIds: [],
      implementedByApplicationIds: [],
    }),
    [currentPerson?.id]
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        // Clean all values before submission
        const submissionData = {
          ...value,
          name: value.name || '',
          description: value.description || '',
          category: value.category || PrincipleCategory.BUSINESS,
          priority: value.priority || PrinciplePriority.MEDIUM,
          rationale: value.rationale || '',
          implications: value.implications || '',
          isActive: value.isActive !== undefined ? value.isActive : true,
          // Stelle sicher, dass Arrays nicht undefined sind
          tags: Array.isArray(value.tags) ? value.tags : [],
          appliedInArchitectureIds: Array.isArray(value.appliedInArchitectureIds)
            ? value.appliedInArchitectureIds
            : [],
          implementedByApplicationIds: Array.isArray(value.implementedByApplicationIds)
            ? value.implementedByApplicationIds
            : [],
        }

        await onSubmit(submissionData)
      }
    },
    // Custom validation functions for TanStack Form
    validators: {
      // Primary validation function for changes
      onChange: formState => {
        try {
          // formState contains values in value property
          const values = formState.value

          if (!values) {
            return undefined
          }

          // Enrich form data with default values
          const validationData = {
            ...values,
            name: values.name || '',
            description: values.description || '',
            category: values.category || PrincipleCategory.BUSINESS,
            priority: values.priority || PrinciplePriority.MEDIUM,
            isActive: values.isActive !== undefined ? values.isActive : true,
          }

          // Perform schema validation
          architecturePrincipleSchema.parse(validationData)
          return undefined // No error
        } catch (e) {
          if (e instanceof z.ZodError) {
            return e.format()
          }
          return { error: tForms('validationError') }
        }
      },
      // Final validation on submit
      onSubmit: formState => {
        try {
          // formState contains values in value property
          const values = formState.value

          if (!values) {
            return { error: tForms('noFormData') }
          }

          // Enrich form data with default values
          const validationData = {
            ...values,
            name: values.name || '',
            description: values.description || '',
            category: values.category || PrincipleCategory.BUSINESS,
            priority: values.priority || PrinciplePriority.MEDIUM,
            isActive: values.isActive !== undefined ? values.isActive : true,
          }

          // Perform schema validation
          architecturePrincipleSchema.parse(validationData)
          return undefined // Kein Fehler
        } catch (e) {
          if (e instanceof z.ZodError) {
            return e.format()
          }
          return { error: 'Validierungsfehler beim Absenden' }
        }
      },
    },
  })

  // 1. useEffect for initializing and resetting form when opening/closing
  useEffect(() => {
    if (!isOpen) {
      // Dialog is being closed - reset form
      form.reset()
      return
    }

    // Dialog just opened - initialize form
    if (mode === 'create') {
      // Im Create-Modus mit defaultValues initialisieren
      form.reset(defaultValues)
    }
    // Bei 'edit' und 'view' wird das Form separat mit principle-Daten initialisiert
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]) // Only dependent on dialog status

  // 2. Separate useEffect for updating with ArchitecturePrinciple data
  // This only executes when principle changes or mode switches
  const principleId = principle?.id // Stabile ID-Referenz

  useEffect(() => {
    // If no principle object or dialog not open, do nothing
    if (!principle || !isOpen || mode === 'create') {
      return
    }

    // Update the form with principle data
    try {
      const resetValues = {
        name: principle.name || '',
        description: principle.description || '',
        category: principle.category || PrincipleCategory.BUSINESS,
        priority: principle.priority || PrinciplePriority.MEDIUM,
        rationale: principle.rationale || '',
        implications: principle.implications || '',
        tags: principle.tags || [],
        isActive: principle.isActive !== undefined ? principle.isActive : true,
        ownerId: principle.owners && principle.owners.length > 0 ? principle.owners[0].id : '',
        appliedInArchitectureIds: principle.appliedInArchitectures?.map(arch => arch.id) || [],
        implementedByApplicationIds: principle.implementedByApplications?.map(app => app.id) || [],
      }

      // Use setValues instead of reset to avoid triggering new re-renders
      Object.entries(resetValues).forEach(([key, value]) => {
        // TypeScript casting for value to fix compiler error
        form.setFieldValue(key as any, value as any)
      })
    } catch (error) {
      console.warn('Fehler beim Aktualisieren des Formulars:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principleId, isOpen, mode])

  // Tab configuration for the two tabs
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'relationships', label: t('tabs.relationships') },
  ]

  // Field configuration for the generic form
  interface SelectOption {
    value: string | number | boolean
    label: string
  }

  interface FieldConfigWithSelect extends FieldConfig {
    options?: SelectOption[]
    loadingOptions?: boolean
    rows?: number
    size?: { xs: number; md: number } | number
  }

  // General fields for first tab
  const generalFields: FieldConfigWithSelect[] = [
    {
      name: 'name',
      label: t('form.name'),
      type: 'text',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'category',
      label: t('form.category'),
      type: 'select',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: Object.values(PrincipleCategory).map(category => ({
        value: category,
        label: getCategoryLabel(category),
      })),
    },
    {
      name: 'priority',
      label: t('form.priority'),
      type: 'select',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: Object.values(PrinciplePriority).map(priority => ({
        value: priority,
        label: getPriorityLabel(priority),
      })),
    },
    {
      name: 'isActive',
      label: t('form.status'),
      type: 'select',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: [
        { value: true, label: t('states.active') },
        { value: false, label: t('states.inactive') },
      ],
    },
    {
      name: 'description',
      label: t('form.description'),
      type: 'textarea',
      required: true,
      tabId: 'general',
      size: 12,
      rows: 4,
    },
    {
      name: 'rationale',
      label: t('form.rationale'),
      type: 'textarea',
      required: false,
      tabId: 'general',
      size: 12,
      rows: 3,
    },
    {
      name: 'implications',
      label: t('form.implications'),
      type: 'textarea',
      required: false,
      tabId: 'general',
      size: 12,
      rows: 3,
    },
    {
      name: 'tags',
      label: t('form.tags'),
      type: 'tags',
      required: false,
      tabId: 'general',
      size: 12,
      options: [], // Tags sind freeSolo
    },
    {
      name: 'ownerId',
      label: t('form.owner'),
      type: 'select',
      required: false,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: [
        { value: '', label: tCommon('none') },
        ...(personData?.people || []).map(
          (person: { id: string; firstName: string; lastName: string }) => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ),
      ],
      loadingOptions: personLoading,
    },
  ]

  // Relationship fields for second tab
  const relationshipFields: FieldConfigWithSelect[] = [
    {
      name: 'appliedInArchitectureIds',
      label: t('form.appliedInArchitectures'),
      type: 'autocomplete',
      required: false,
      tabId: 'relationships',
      size: 12,
      multiple: true,
      options:
        architectureData?.architectures?.map((arch: any) => ({
          value: arch.id,
          label: arch.name,
        })) || [],
      loadingOptions: architectureLoading,
      onChipClick: createChipClickHandler('appliedInArchitectureIds'),
    },
    {
      name: 'implementedByApplicationIds',
      label: t('form.implementedByApplications'),
      type: 'autocomplete',
      required: false,
      tabId: 'relationships',
      size: 12,
      multiple: true,
      options:
        applicationData?.applications?.map((app: any) => ({
          value: app.id,
          label: app.name,
        })) || [],
      loadingOptions: applicationLoading,
      onChipClick: createChipClickHandler('implementedByApplicationIds'),
    },
  ]

  // Combine all fields
  const fields: FieldConfigWithSelect[] = [...generalFields, ...relationshipFields]

  // Provide default values for optional props
  const formMode = mode || 'view'
  const formIsOpen = isOpen !== undefined ? isOpen : true
  const formLoading = loading || false
  const handleClose = onClose || (() => {})
  const handleSubmit = onSubmit || (async () => {})

  return (
    <>
      <GenericForm
        title={
          formMode === 'create'
            ? t('addNew')
            : formMode === 'edit'
              ? t('editTitle')
              : t('viewTitle')
        }
        isOpen={formIsOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={formLoading || architectureLoading || applicationLoading || personLoading}
        mode={formMode}
        isNested={isNested}
        fields={fields}
        form={form}
        tabs={tabs}
        enableDelete={formMode === 'edit' && !!principle && isArchitect()}
        onDelete={principle?.id && onDelete ? () => onDelete(principle.id) : undefined}
        onEditMode={onEditMode}
        entityId={principle?.id}
        entityName={tForm('entityName' as any)}
        metadata={
          principle
            ? {
                createdAt: principle.createdAt,
                updatedAt: principle.updatedAt,
              }
            : undefined
        }
      />

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
    </>
  )
}

export default ArchitecturePrincipleForm
