'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useQuery } from '@apollo/client'
import { z } from 'zod'
import { isArchitect } from '@/lib/auth'
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

interface AicomponentFormProps extends GenericFormProps<any, AicomponentFormValues> {}

export default function AicomponentForm({
  data: aicomponent,
  mode,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  loading = false,
  onEditMode,
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

  // Standardwerte für das Formular
  const defaultValues: AicomponentFormValues = {
    name: aicomponent?.name ?? '',
    description: aicomponent?.description ?? '',
    aiType: aicomponent?.aiType ?? AiComponentType.OTHER,
    model: aicomponent?.model ?? '',
    version: aicomponent?.version ?? '',
    status: aicomponent?.status ?? AiComponentStatus.IN_DEVELOPMENT,
    accuracy: aicomponent?.accuracy ?? undefined,
    trainingDate: aicomponent?.trainingDate ?? '',
    provider: aicomponent?.provider ?? '',
    license: aicomponent?.license ?? '',
    costs: aicomponent?.costs ?? undefined,
    tags: aicomponent?.tags ?? '',
    ownerId: aicomponent?.owners?.[0]?.id ?? '',
    supportsCapabilityIds: aicomponent?.supportsCapabilities?.map((cap: any) => cap.id) ?? [],
    usedByApplicationIds: aicomponent?.usedByApplications?.map((app: any) => app.id) ?? [],
    trainedWithDataObjectIds: aicomponent?.trainedWithDataObjects?.map((obj: any) => obj.id) ?? [],
    hostedOnIds: aicomponent?.hostedOn?.map((infra: any) => infra.id) ?? [],
    partOfArchitectureIds: aicomponent?.partOfArchitectures?.map((arch: any) => arch.id) ?? [],
    implementsPrincipleIds:
      aicomponent?.implementsPrinciples?.map((principle: any) => principle.id) ?? [],
    depictedInDiagramIds: aicomponent?.depictedInDiagrams?.map((diag: any) => diag.id) ?? [],
  }

  // Form erstellen
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        // Validierung vor der Verarbeitung
        const validationResult = aicomponentSchema.safeParse(value)

        if (!validationResult.success) {
          console.error('❌ Validation failed:', validationResult.error.errors)
          throw new Error('Validierung fehlgeschlagen')
        }

        await onSubmit(value)
      } catch (error) {
        console.error('💥 AicomponentForm onSubmit error:', error)
        throw error
      }
    },
    validators: {
      onChange: aicomponentSchema,
      onSubmit: aicomponentSchema,
    },
  })

  // Form-Werte bei Änderung der AI Component zurücksetzen
  useEffect(() => {
    if (aicomponent && isOpen) {
      const resetValues = {
        name: aicomponent.name ?? '',
        description: aicomponent.description ?? '',
        aiType: aicomponent.aiType ?? AiComponentType.OTHER,
        model: aicomponent.model ?? '',
        version: aicomponent.version ?? '',
        status: aicomponent.status ?? AiComponentStatus.IN_DEVELOPMENT,
        accuracy: aicomponent.accuracy ?? undefined,
        trainingDate: aicomponent.trainingDate ?? '',
        provider: aicomponent.provider ?? '',
        license: aicomponent.license ?? '',
        costs: aicomponent.costs ?? undefined,
        tags: aicomponent.tags ?? '',
        ownerId: aicomponent.owners?.[0]?.id ?? '',
        supportsCapabilityIds: aicomponent.supportsCapabilities?.map((cap: any) => cap.id) ?? [],
        usedByApplicationIds: aicomponent.usedByApplications?.map((app: any) => app.id) ?? [],
        trainedWithDataObjectIds:
          aicomponent.trainedWithDataObjects?.map((obj: any) => obj.id) ?? [],
        hostedOnIds: aicomponent.hostedOn?.map((infra: any) => infra.id) ?? [],
        partOfArchitectureIds: aicomponent.partOfArchitectures?.map((arch: any) => arch.id) ?? [],
        implementsPrincipleIds:
          aicomponent.implementsPrinciples?.map((principle: any) => principle.id) ?? [],
        depictedInDiagramIds: aicomponent.depictedInDiagrams?.map((diag: any) => diag.id) ?? [],
      }

      form.reset(resetValues)
    } else if (!isOpen) {
      form.reset()
    }
  }, [form, aicomponent, isOpen])

  // Tabs für das Formular definieren
  const tabs: TabConfig[] = [
    { id: 'general', label: tTabs('general') },
    { id: 'technical', label: tTabs('technical') },
    { id: 'training', label: tTabs('training') },
    { id: 'relationships', label: tTabs('relationships') },
    { id: 'architectures', label: tTabs('architectures') },
    { id: 'principles', label: tTabs('principles') },
  ]
  // Felder für das Formular definieren
  const fields: FieldConfig[] = [
    // Allgemeine Informationen (Tab: general)
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      tabId: 'general',
      validators: aicomponentSchema.shape.name,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'aiType',
      label: t('aiType'),
      type: 'select',
      tabId: 'general',
      options: Object.values(AiComponentType).map(type => ({
        value: type,
        label: getAiTypeLabel(type),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      tabId: 'general',
      rows: 4,
      size: 12,
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      tabId: 'general',
      options: Object.values(AiComponentStatus).map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'ownerId',
      label: t('owner'),
      type: 'autocomplete',
      tabId: 'general',
      options: (personsData?.people || []).map((person: Person) => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName}`,
      })),
      loadingOptions: personsLoading,
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingPerson = personsData?.people?.find((person: Person) => person.id === option)
          return matchingPerson ? `${matchingPerson.firstName} ${matchingPerson.lastName}` : option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        return option?.value === value || option === value
      },
    },

    // Technische Informationen (Tab: technical)
    {
      name: 'model',
      label: t('model'),
      type: 'text',
      tabId: 'technical',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'version',
      label: t('version'),
      type: 'text',
      tabId: 'technical',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'accuracy',
      label: t('accuracy'),
      type: 'number',
      tabId: 'technical',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'provider',
      label: t('provider'),
      type: 'text',
      tabId: 'technical',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'license',
      label: t('license'),
      type: 'text',
      tabId: 'technical',
      size: { xs: 12, md: 6 },
    },

    // Training Informationen (Tab: training)
    {
      name: 'trainingDate',
      label: t('trainingDate'),
      type: 'date',
      tabId: 'training',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'costs',
      label: t('costs'),
      type: 'number',
      tabId: 'training',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'tags',
      label: t('tags'),
      type: 'text',
      tabId: 'training',
      size: 12,
    },
    {
      name: 'trainedWithDataObjectIds',
      label: t('trainedWithDataObjects'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'training',
      options:
        dataObjectsData?.dataObjects?.map((dataObject: DataObject) => ({
          value: dataObject.id,
          label: dataObject.name,
        })) || [],
      size: 12,
    },

    // Beziehungen (Tab: relationships)
    {
      name: 'supportsCapabilityIds',
      label: t('supportsCapabilities'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'relationships',
      options:
        capabilitiesData?.businessCapabilities?.map((capability: BusinessCapability) => ({
          value: capability.id,
          label: capability.name,
        })) || [],
      size: 12,
    },
    {
      name: 'usedByApplicationIds',
      label: t('usedByApplications'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'relationships',
      options:
        applicationsData?.applications?.map((application: Application) => ({
          value: application.id,
          label: application.name,
        })) || [],
      size: 12,
    },
    {
      name: 'hostedOnIds',
      label: t('hostedOn'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'relationships',
      options:
        infrastructuresData?.infrastructures?.map((infrastructure: Infrastructure) => ({
          value: infrastructure.id,
          label: infrastructure.name,
        })) || [],
      size: 12,
    },

    // Architekturen (Tab: architectures)
    {
      name: 'partOfArchitectureIds',
      label: t('partOfArchitectures'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'architectures',
      options:
        architecturesData?.architectures?.map((architecture: Architecture) => ({
          value: architecture.id,
          label: architecture.name,
        })) || [],
      size: 12,
    },
    {
      name: 'depictedInDiagramIds',
      label: t('depictedInDiagrams'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'architectures',
      options:
        diagramsData?.diagrams?.map((diagram: Diagram) => ({
          value: diagram.id,
          label: diagram.title,
        })) || [],
      size: 12,
    },

    // Prinzipien (Tab: principles)
    {
      name: 'implementsPrincipleIds',
      label: t('implementsPrinciples'),
      type: 'autocomplete',
      multiple: true,
      tabId: 'principles',
      options:
        principlesData?.architecturePrinciples?.map((principle: ArchitecturePrinciple) => ({
          value: principle.id,
          label: principle.name,
        })) || [],
      size: 12,
    },
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? 'Neue AI Komponente erstellen'
          : mode === 'edit'
            ? 'AI Komponente bearbeiten'
            : 'AI Komponenten-Details'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      tabs={tabs}
      form={form}
      enableDelete={mode === 'edit' && !!aicomponent && isArchitect()}
      onDelete={aicomponent?.id ? () => onDelete?.(aicomponent.id) : undefined}
      onEditMode={onEditMode}
      entityId={aicomponent?.id}
      entityName="AI Komponente"
      metadata={
        aicomponent
          ? {
              createdAt: aicomponent.createdAt,
              updatedAt: aicomponent.updatedAt,
            }
          : undefined
      }
    />
  )
}
