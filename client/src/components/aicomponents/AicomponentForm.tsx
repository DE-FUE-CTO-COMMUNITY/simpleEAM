'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { AicomponentType, AicomponentFormValues } from './types'
import { AiComponentType, AiComponentStatus } from '../../gql/generated'
import { useAiTypeLabel, useStatusLabel } from './utils'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

// Schema für die Formularvalidierung
export const aicomponentSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100),
  description: z.string().optional(),
  aiType: z.nativeEnum(AiComponentType),
  model: z.string().optional(),
  version: z.string().optional(),
  status: z.nativeEnum(AiComponentStatus),
  accuracy: z.number().min(0).max(100).optional(),
  trainingDate: z.string().optional(),
  lastUpdated: z.string().optional(),
  provider: z.string().optional(),
  license: z.string().optional(),
  costs: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  ownerIds: z.array(z.string()).optional(),
  companyIds: z.array(z.string()).optional(),
  supportsCapabilityIds: z.array(z.string()).optional(),
  usedByApplicationIds: z.array(z.string()).optional(),
  trainedWithDataObjectIds: z.array(z.string()).optional(),
  hostedOnIds: z.array(z.string()).optional(),
})

const AicomponentsForm: React.FC<GenericFormProps<AicomponentType, AicomponentFormValues>> = ({
  data: aicomponent,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('aicomponents')
  const tForms = useTranslations('forms')
  const tCommon = useTranslations('common')
  const getAiTypeLabel = useAiTypeLabel()
  const getStatusLabel = useStatusLabel()

  // Formulardaten mit useMemo initialisieren
  const defaultValues = React.useMemo<AicomponentFormValues>(
    () => ({
      name: '',
      description: '',
      aiType: AiComponentType.OTHER,
      status: AiComponentStatus.IN_DEVELOPMENT,
      model: '',
      version: '',
      accuracy: undefined,
      trainingDate: '',
      lastUpdated: '',
      provider: '',
      license: '',
      costs: undefined,
      tags: [],
      ownerIds: [],
      companyIds: [],
      supportsCapabilityIds: [],
      usedByApplicationIds: [],
      trainedWithDataObjectIds: [],
      hostedOnIds: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        await onSubmit(value)
      }
    },
  })

  // Formulardaten aktualisieren, wenn sich die Entity ändert
  useEffect(() => {
    if (aicomponent) {
      form.setFieldValue('name', aicomponent.name || '')
      form.setFieldValue('description', aicomponent.description || '')
      form.setFieldValue('aiType', aicomponent.aiType)
      form.setFieldValue('status', aicomponent.status)
      form.setFieldValue('model', aicomponent.model || '')
      form.setFieldValue('version', aicomponent.version || '')
      form.setFieldValue('accuracy', aicomponent.accuracy ?? undefined)
      form.setFieldValue('trainingDate', aicomponent.trainingDate || '')
      form.setFieldValue('lastUpdated', aicomponent.lastUpdated || '')
      form.setFieldValue('provider', aicomponent.provider || '')
      form.setFieldValue('license', aicomponent.license || '')
      form.setFieldValue('costs', aicomponent.costs ?? undefined)
      form.setFieldValue('tags', aicomponent.tags || [])
      form.setFieldValue('ownerIds', aicomponent.owners?.map(owner => owner.id) || [])
      form.setFieldValue('companyIds', aicomponent.company?.map(comp => comp.id) || [])
      form.setFieldValue(
        'supportsCapabilityIds',
        aicomponent.supportsCapabilities?.map(cap => cap.id) || []
      )
      form.setFieldValue(
        'usedByApplicationIds',
        aicomponent.usedByApplications?.map(app => app.id) || []
      )
      form.setFieldValue(
        'trainedWithDataObjectIds',
        aicomponent.trainedWithDataObjects?.map(obj => obj.id) || []
      )
      form.setFieldValue('hostedOnIds', aicomponent.hostedOn?.map(infra => infra.id) || [])
    }
  }, [aicomponent, form])

  // Feldkonfigurationen definieren
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('form.name'),
      type: 'text',
      required: true,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (!value || value.length < 3) {
            return tForms('validation.minLength', { count: 3 })
          }
          if (value.length > 100) {
            return tForms('validation.maxLength', { count: 100 })
          }
          return undefined
        },
      },
    },
    {
      name: 'description',
      label: t('form.description'),
      type: 'textarea',
      required: false,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value.length > 1000) {
            return tForms('validation.maxLength', { count: 1000 })
          }
          return undefined
        },
      },
    },
    {
      name: 'aiType',
      label: t('form.aiType'),
      type: 'select',
      required: true,
      options: Object.values(AiComponentType).map(type => ({
        value: type,
        label: getAiTypeLabel(type),
      })),
    },
    {
      name: 'status',
      label: t('form.status'),
      type: 'select',
      required: true,
      options: Object.values(AiComponentStatus).map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
    },
    {
      name: 'model',
      label: t('form.model'),
      type: 'text',
      required: false,
    },
    {
      name: 'version',
      label: t('form.version'),
      type: 'text',
      required: false,
    },
    {
      name: 'provider',
      label: t('form.provider'),
      type: 'text',
      required: false,
    },
    {
      name: 'license',
      label: t('form.license'),
      type: 'text',
      required: false,
    },
    {
      name: 'accuracy',
      label: t('form.accuracy'),
      type: 'number',
      required: false,
      validators: {
        onChange: ({ value }: { value: number }) => {
          if (value !== undefined && (value < 0 || value > 100)) {
            return 'Accuracy must be between 0 and 100'
          }
          return undefined
        },
      },
    },
    {
      name: 'costs',
      label: t('form.costs'),
      type: 'number',
      required: false,
      validators: {
        onChange: ({ value }: { value: number }) => {
          if (value !== undefined && value < 0) {
            return 'Costs must be positive'
          }
          return undefined
        },
      },
    },
    {
      name: 'trainingDate',
      label: t('form.trainingDate'),
      type: 'date',
      required: false,
    },
    {
      name: 'lastUpdated',
      label: t('form.lastUpdated'),
      type: 'date',
      required: false,
    },
    {
      name: 'tags',
      label: t('form.tags'),
      type: 'tags',
      required: false,
    },
  ]

  // Tab-Konfigurationen (falls mehrere Tabs benötigt werden)
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'technical', label: t('tabs.technical') },
    { id: 'training', label: t('tabs.training') },
    { id: 'relationships', label: t('tabs.relationships') },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
      onDelete={aicomponent?.id && onDelete ? () => onDelete(aicomponent.id) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      title={
        mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
      }
      fields={fields}
      tabs={tabs.length > 1 ? tabs : undefined}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={t('deleteConfirmation')}
    />
  )
}

export default AicomponentsForm
