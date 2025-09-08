'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useQuery } from '@apollo/client'
import { z } from 'zod'
import {
  AiComponentType,
  AiComponentStatus,
  Person,
  BusinessCapability,
  Application,
  DataObject,
  Infrastructure,
  Architecture,
  ArchitecturePrinciple,
  Diagram,
} from '../../gql/generated'
import { useAiTypeLabel, useStatusLabel } from './utils'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { GET_PERSONS } from '@/graphql/person'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_ARCHITECTURE_PRINCIPLES } from '@/graphql/architecturePrinciple'
import { GET_DIAGRAMS } from '@/graphql/diagram'

// Schema für die Formularvalidierung
export const aicomponentSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().optional(),
  aiType: z.string().optional(),
  model: z.string().optional(),
  version: z.string().optional(),
  status: z.string().optional(),
  accuracy: z.number().min(0).max(100).optional(),
  trainingDate: z.string().optional(),
  provider: z.string().optional(),
  license: z.string().optional(),
  costs: z.number().min(0).optional(),
  tags: z.string().optional(),
  ownerId: z.string().optional(),
  supportsCapabilityIds: z.array(z.string()).optional(),
  usedByApplicationIds: z.array(z.string()).optional(),
  trainedWithDataObjectIds: z.array(z.string()).optional(),
  hostedOnIds: z.array(z.string()).optional(),
  partOfArchitectureIds: z.array(z.string()).optional(),
  implementsPrincipleIds: z.array(z.string()).optional(),
  depictedInDiagramIds: z.array(z.string()).optional(),
})

export type AicomponentFormValues = z.infer<typeof aicomponentSchema>

interface AicomponentFormProps extends GenericFormProps<AicomponentFormValues> {
  aicomponent?: any
}

export default function AicomponentForm({
  aicomponent,
  isViewMode = false,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
  showViewModeToggle = true,
}: AicomponentFormProps) {
  const t = useTranslations('aicomponents.form')
  const tTabs = useTranslations('aicomponents.tabs')
  const getAiTypeLabel = useAiTypeLabel()
  const getStatusLabel = useStatusLabel()

  // GraphQL Queries für Relationship-Daten
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS)
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES)
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS)
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS)
  const { data: infrastructuresData, loading: infrastructuresLoading } =
    useQuery(GET_INFRASTRUCTURES)
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES)
  const { data: principlesData, loading: principlesLoading } = useQuery(GET_ARCHITECTURE_PRINCIPLES)
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS)

  // Form erstellen
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      aiType: '',
      model: '',
      version: '',
      status: '',
      accuracy: undefined,
      trainingDate: '',
      provider: '',
      license: '',
      costs: undefined,
      tags: '',
      ownerId: '',
      supportsCapabilityIds: [],
      usedByApplicationIds: [],
      trainedWithDataObjectIds: [],
      hostedOnIds: [],
      partOfArchitectureIds: [],
      implementsPrincipleIds: [],
      depictedInDiagramIds: [],
    } as AicomponentFormValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: aicomponentSchema,
    },
  })

  // Formulardaten aus aicomponent setzen
  useEffect(() => {
    if (aicomponent) {
      form.setFieldValue('name', aicomponent.name || '')
      form.setFieldValue('description', aicomponent.description || '')
      form.setFieldValue('aiType', aicomponent.aiType || '')
      form.setFieldValue('model', aicomponent.model || '')
      form.setFieldValue('version', aicomponent.version || '')
      form.setFieldValue('status', aicomponent.status || '')
      form.setFieldValue('accuracy', aicomponent.accuracy || undefined)
      form.setFieldValue('trainingDate', aicomponent.trainingDate || '')
      form.setFieldValue('provider', aicomponent.provider || '')
      form.setFieldValue('license', aicomponent.license || '')
      form.setFieldValue('costs', aicomponent.costs || undefined)
      form.setFieldValue('tags', aicomponent.tags || '')
      form.setFieldValue('ownerId', aicomponent.owners?.[0]?.id || '')
      form.setFieldValue(
        'supportsCapabilityIds',
        aicomponent.supportsCapabilities?.map((cap: any) => cap.id) || []
      )
      form.setFieldValue(
        'usedByApplicationIds',
        aicomponent.usedByApplications?.map((app: any) => app.id) || []
      )
      form.setFieldValue(
        'trainedWithDataObjectIds',
        aicomponent.trainedWithDataObjects?.map((obj: any) => obj.id) || []
      )
      form.setFieldValue('hostedOnIds', aicomponent.hostedOn?.map((infra: any) => infra.id) || [])
      form.setFieldValue(
        'partOfArchitectureIds',
        aicomponent.partOfArchitectures?.map((arch: any) => arch.id) || []
      )
      form.setFieldValue(
        'implementsPrincipleIds',
        aicomponent.implementsPrinciples?.map((principle: any) => principle.id) || []
      )
      form.setFieldValue(
        'depictedInDiagramIds',
        aicomponent.depictedInDiagrams?.map((diagram: any) => diagram.id) || []
      )
    }
  }, [aicomponent, form])

  // Tab-Konfigurationen entsprechend dem Applications-Pattern
  const tabs: TabConfig[] = [
    {
      id: 'general',
      label: tTabs('general'),
      fields: ['name', 'description', 'ownerId'],
    },
    {
      id: 'technical',
      label: tTabs('technical'),
      fields: ['aiType', 'model', 'version', 'status', 'accuracy', 'provider', 'license'],
    },
    {
      id: 'training',
      label: tTabs('training'),
      fields: ['trainingDate', 'costs', 'tags'],
    },
    {
      id: 'relationships',
      label: tTabs('relationships'),
      fields: [
        'supportsCapabilityIds',
        'usedByApplicationIds',
        'trainedWithDataObjectIds',
        'hostedOnIds',
      ],
    },
    {
      id: 'architectures',
      label: tTabs('architectures'),
      fields: ['partOfArchitectureIds'],
    },
    {
      id: 'principles',
      label: tTabs('principles'),
      fields: ['implementsPrincipleIds', 'depictedInDiagramIds'],
    },
  ]

  // Feld-Konfigurationen
  const fields: FieldConfig[] = [
    // General Tab
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      multiline: true,
    },
    {
      name: 'ownerId',
      label: t('owner'),
      type: 'select',
      required: false,
      loading: personsLoading,
      options: (personsData?.people || []).map((person: Person) => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName}`,
      })),
    },

    // Technical Tab
    {
      name: 'aiType',
      label: t('aiType'),
      type: 'select',
      options: Object.values(AiComponentType).map(type => ({
        value: type,
        label: getAiTypeLabel(type),
      })),
    },
    {
      name: 'model',
      label: t('model'),
      type: 'text',
    },
    {
      name: 'version',
      label: t('version'),
      type: 'text',
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      options: Object.values(AiComponentStatus).map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
    },
    {
      name: 'accuracy',
      label: t('accuracy'),
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'provider',
      label: t('provider'),
      type: 'text',
    },
    {
      name: 'license',
      label: t('license'),
      type: 'text',
    },

    // Training Tab
    {
      name: 'trainingDate',
      label: t('trainingDate'),
      type: 'date',
    },
    {
      name: 'costs',
      label: t('costs'),
      type: 'number',
      min: 0,
    },
    {
      name: 'tags',
      label: t('tags'),
      type: 'text',
    },

    // Relationships Tab
    {
      name: 'supportsCapabilityIds',
      label: t('supportsCapabilities'),
      type: 'multiselect',
      loading: capabilitiesLoading,
      options: (capabilitiesData?.businessCapabilities || []).map(
        (capability: BusinessCapability) => ({
          value: capability.id,
          label: capability.name,
        })
      ),
    },
    {
      name: 'usedByApplicationIds',
      label: t('usedByApplications'),
      type: 'multiselect',
      loading: applicationsLoading,
      options: (applicationsData?.applications || []).map((application: Application) => ({
        value: application.id,
        label: application.name,
      })),
    },
    {
      name: 'trainedWithDataObjectIds',
      label: t('trainedWithDataObjects'),
      type: 'multiselect',
      loading: dataObjectsLoading,
      options: (dataObjectsData?.dataObjects || []).map((dataObject: DataObject) => ({
        value: dataObject.id,
        label: dataObject.name,
      })),
    },
    {
      name: 'hostedOnIds',
      label: t('hostedOn'),
      type: 'multiselect',
      loading: infrastructuresLoading,
      options: (infrastructuresData?.infrastructures || []).map(
        (infrastructure: Infrastructure) => ({
          value: infrastructure.id,
          label: infrastructure.name,
        })
      ),
    },

    // Architectures Tab
    {
      name: 'partOfArchitectureIds',
      label: t('partOfArchitectures'),
      type: 'multiselect',
      loading: architecturesLoading,
      options: (architecturesData?.architectures || []).map((architecture: Architecture) => ({
        value: architecture.id,
        label: architecture.name,
      })),
    },

    // Principles Tab
    {
      name: 'implementsPrincipleIds',
      label: t('implementsPrinciples'),
      type: 'multiselect',
      loading: principlesLoading,
      options: (principlesData?.architecturePrinciples || []).map(
        (principle: ArchitecturePrinciple) => ({
          value: principle.id,
          label: principle.name,
        })
      ),
    },
    {
      name: 'depictedInDiagramIds',
      label: t('depictedInDiagrams'),
      type: 'multiselect',
      loading: diagramsLoading,
      options: (diagramsData?.diagrams || []).map((diagram: Diagram) => ({
        value: diagram.id,
        label: diagram.title,
      })),
    },
  ]

  return (
    <GenericForm
      form={form}
      fields={fields}
      tabs={tabs}
      isViewMode={isViewMode}
      onCancel={onCancel}
      onEdit={onEdit}
      onDelete={onDelete}
      showViewModeToggle={showViewModeToggle}
      loading={
        personsLoading ||
        capabilitiesLoading ||
        applicationsLoading ||
        dataObjectsLoading ||
        infrastructuresLoading ||
        architecturesLoading ||
        principlesLoading ||
        diagramsLoading
      }
    />
  )
}
