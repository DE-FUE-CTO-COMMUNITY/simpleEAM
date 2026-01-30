'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { z } from 'zod'
import { isArchitect } from '@/lib/auth'
import {
  AiComponent,
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
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import CapabilityForm from '../capabilities/CapabilityForm'
import ApplicationForm from '../applications/ApplicationForm'
import DataObjectForm from '../dataobjects/DataObjectForm'
import InfrastructureForm from '../infrastructure/InfrastructureForm'
import ArchitectureForm from '../architectures/ArchitectureForm'
import ArchitecturePrincipleForm from '../architecture-principles/ArchitecturePrincipleForm'

export type AicomponentFormValues = {
  name: string
  description?: string
  aiType: AiComponentType
  model?: string
  version?: string
  status: AiComponentStatus
  accuracy?: number
  trainingDate?: string
  provider?: string
  license?: string
  costs?: number
  tags?: string
  ownerId?: string
  supportsCapabilityIds?: string[]
  usedByApplicationIds?: string[]
  trainedWithDataObjectIds?: string[]
  hostedOnIds?: string[]
  partOfArchitectureIds?: string[]
  implementsPrincipleIds?: string[]
  depictedInDiagramIds?: string[]
}

export type AicomponentFormProps = GenericFormProps<AiComponent, AicomponentFormValues>

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
  const tGeneral = useTranslations('aicomponents')
  const tTabs = useTranslations('aicomponents.tabs')
  const tValidation = useTranslations('forms.validation')
  const getAiTypeLabel = useAiTypeLabel()
  const getStatusLabel = useStatusLabel()

  // State for nested entity forms
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

  // Handler to close nested form
  const handleCloseNestedForm = () => {
    setNestedFormState({
      isOpen: false,
      entityType: null,
      entityId: null,
      mode: 'view',
    })
  }

  const companyWhere = useCompanyWhere('company')

  // Schema for form validation mit internationalisierten Fehlermeldungen
  const aicomponentSchema = z.object({
    name: z.string().min(1, tValidation('required')),
    description: z.string().optional(),
    aiType: z.nativeEnum(AiComponentType),
    model: z.string().optional(),
    version: z.string().optional(),
    status: z.nativeEnum(AiComponentStatus),
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

  // GraphQL Queries für Relationship-Daten
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS)
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES, {
    variables: { where: companyWhere },
  })
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS, {
    variables: { where: companyWhere },
  })
  const { data: infrastructuresData, loading: infrastructuresLoading } = useQuery(
    GET_INFRASTRUCTURES,
    { variables: { where: companyWhere } }
  )
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })
  const { data: principlesData, loading: principlesLoading } = useQuery(
    GET_ARCHITECTURE_PRINCIPLES,
    { variables: { where: companyWhere } }
  )
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS, {
    variables: { where: companyWhere },
  })

  // Queries for nested entity forms
  const { data: nestedCapabilityData } = useQuery(
    gql`
      query GetNestedCapability($where: BusinessCapabilityWhere) {
        businessCapabilities(where: $where) {
          id
          name
          description
          maturityLevel
          businessValue
          status
          type
          sequenceNumber
          introductionDate
          endDate
          owners {
            id
            firstName
            lastName
          }
          tags
          parents {
            id
            name
          }
          children {
            id
            name
          }
          relatedDataObjects {
            id
            name
          }
          supportedByApplications {
            id
            name
          }
          partOfArchitectures {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: {
        where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
      },
      skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'capabilities',
    }
  )

  const { data: nestedApplicationData } = useQuery(
    gql`
      query GetNestedApplication($where: ApplicationWhere) {
        applications(where: $where) {
          id
          name
          description
          status
          criticality
          costs
          vendor
          version
          hostingEnvironment
          technologyStack
          introductionDate
          endOfLifeDate
          planningDate
          endOfUseDate
          timeCategory
          sevenRStrategy
          owners {
            id
            firstName
            lastName
          }
          supportsCapabilities {
            id
            name
          }
          usesDataObjects {
            id
            name
          }
          sourceOfInterfaces {
            id
            name
          }
          targetOfInterfaces {
            id
            name
          }
          partOfArchitectures {
            id
            name
          }
          implementsPrinciples {
            id
            name
          }
          depictedInDiagrams {
            id
            title
          }
          parents {
            id
            name
          }
          components {
            id
            name
          }
          predecessors {
            id
            name
          }
          successors {
            id
            name
          }
          hostedOn {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: {
        where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
      },
      skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applications',
    }
  )

  const { data: nestedDataObjectData } = useQuery(
    gql`
      query GetNestedDataObject($where: DataObjectWhere) {
        dataObjects(where: $where) {
          id
          name
          description
          classification
          format
          dataSources
          planningDate
          introductionDate
          endOfUseDate
          endOfLifeDate
          owners {
            id
            firstName
            lastName
          }
          tags
          usedByApplications {
            id
            name
          }
          relatedToCapabilities {
            id
            name
          }
          transferredInInterfaces {
            id
            name
          }
          partOfArchitectures {
            id
            name
          }
          depictedInDiagrams {
            id
            title
          }
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: {
        where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
      },
      skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'dataObjects',
    }
  )

  const { data: nestedInfrastructureData } = useQuery(
    gql`
      query GetNestedInfrastructure($where: InfrastructureWhere) {
        infrastructures(where: $where) {
          id
          name
          description
          infrastructureType
          status
          vendor
          version
          location
          capacity
          ipAddress
          operatingSystem
          specifications
          maintenanceWindow
          costs
          planningDate
          introductionDate
          endOfUseDate
          endOfLifeDate
          owners {
            id
            firstName
            lastName
          }
          parentInfrastructure {
            id
            name
          }
          childInfrastructures {
            id
            name
          }
          hostsApplications {
            id
            name
          }
          partOfArchitectures {
            id
            name
          }
          depictedInDiagrams {
            id
            title
          }
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: {
        where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
      },
      skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'infrastructures',
    }
  )

  const { data: nestedArchitectureData } = useQuery(
    gql`
      query GetNestedArchitecture($where: ArchitectureWhere) {
        architectures(where: $where) {
          id
          name
          description
          type
          domain
          status
          owners {
            id
            firstName
            lastName
          }
          includedApplications {
            id
            name
          }
          includedCapabilities {
            id
            name
          }
          includedDataObjects {
            id
            name
          }
          includedInfrastructures {
            id
            name
          }
          includedInterfaces {
            id
            name
          }
          appliedPrinciples {
            id
            name
          }
          diagrams {
            id
            title
          }
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: {
        where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
      },
      skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
    }
  )

  const { data: nestedPrincipleData } = useQuery(
    gql`
      query GetNestedPrinciple($where: ArchitecturePrincipleWhere) {
        architecturePrinciples(where: $where) {
          id
          name
          description
          category
          priority
          rationale
          implications
          isActive
          tags
          owners {
            id
            firstName
            lastName
          }
          appliedInArchitectures {
            id
            name
          }
          implementedByApplications {
            id
            name
          }
          implementedByAIComponents {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
    `,
    {
      variables: {
        where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
      },
      skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architecturePrinciples',
    }
  )

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
    tags: Array.isArray(aicomponent?.tags)
      ? aicomponent.tags.join(', ')
      : (aicomponent?.tags ?? ''),
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
          console.error('❌ Failed value:', value)
          throw new Error('Validation failed')
        }
        await onSubmit(value)
      } catch (error) {
        console.error('💥 AicomponentForm onSubmit error:', error)
        throw error
      }
    },
    validators: {
      // Verwende nur onChange-Validierung, nicht onSubmit um doppelte Validierung zu vermeiden
      onChange: aicomponentSchema,
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
        tags: Array.isArray(aicomponent.tags)
          ? aicomponent.tags.join(', ')
          : (aicomponent.tags ?? ''),
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
      loadingOptions: dataObjectsLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingObj = dataObjectsData?.dataObjects?.find(
            (obj: DataObject) => obj.id === option
          )
          return matchingObj?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('trainedWithDataObjectIds'),
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
      loadingOptions: capabilitiesLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingCap = capabilitiesData?.businessCapabilities?.find(
            (cap: BusinessCapability) => cap.id === option
          )
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
      onChipClick: createChipClickHandler('supportsCapabilityIds'),
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
      loadingOptions: applicationsLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = applicationsData?.applications?.find(
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
      onChipClick: createChipClickHandler('usedByApplicationIds'),
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
      loadingOptions: infrastructuresLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInfra = infrastructuresData?.infrastructures?.find(
            (infra: Infrastructure) => infra.id === option
          )
          return matchingInfra?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('hostedOnIds'),
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
      loadingOptions: architecturesLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingArch = architecturesData?.architectures?.find(
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
      onChipClick: createChipClickHandler('partOfArchitectureIds'),
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
      loadingOptions: diagramsLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingDiag = diagramsData?.diagrams?.find((diag: any) => diag.id === option)
          return matchingDiag?.title || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('depictedInDiagramIds'),
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
      loadingOptions: principlesLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingPrinciple = principlesData?.architecturePrinciples?.find(
            (principle: ArchitecturePrinciple) => principle.id === option
          )
          return matchingPrinciple?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('implementsPrincipleIds'),
    },
  ]

  return (
    <>
      <GenericForm
        title={
          mode === 'create'
            ? tGeneral('createTitle')
            : mode === 'edit'
              ? tGeneral('editTitle')
              : tGeneral('viewTitle')
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
        entityName={tGeneral('entityName')}
        metadata={
          aicomponent
            ? {
                createdAt: aicomponent.createdAt,
                updatedAt: aicomponent.updatedAt,
              }
            : undefined
        }
      />

      {/* Nested Capability Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'capabilities' &&
        nestedCapabilityData?.businessCapabilities?.[0] && (
          <CapabilityForm
            data={nestedCapabilityData.businessCapabilities[0]}
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

      {/* Nested Data Object Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'dataObjects' &&
        nestedDataObjectData?.dataObjects?.[0] && (
          <DataObjectForm
            data={nestedDataObjectData.dataObjects[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Infrastructure Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'infrastructures' &&
        nestedInfrastructureData?.infrastructures?.[0] && (
          <InfrastructureForm
            data={nestedInfrastructureData.infrastructures[0]}
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

      {/* Nested Architecture Principle Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'architecturePrinciples' &&
        nestedPrincipleData?.architecturePrinciples?.[0] && (
          <ArchitecturePrincipleForm
            data={nestedPrincipleData.architecturePrinciples[0]}
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
