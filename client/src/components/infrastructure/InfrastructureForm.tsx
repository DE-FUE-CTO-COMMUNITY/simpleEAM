'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import {
  Assignment as PlanningIcon,
  RocketLaunch as LaunchIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { GET_PERSONS } from '@/graphql/person'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { GET_APPLICATIONS } from '@/graphql/application'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import {
  Infrastructure,
  InfrastructureType,
  InfrastructureStatus,
  Architecture,
  Application,
} from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import ApplicationForm from '../applications/ApplicationForm'
import ArchitectureForm from '../architectures/ArchitectureForm'

// Basis-Schema ohne Validierung
const baseInfrastructureSchema = z.object({
  name: z.string().min(3, 'validation.name.min').max(100, 'validation.name.max'),
  description: z.string().max(1000, 'validation.description.max').optional().nullable(),
  infrastructureType: z.nativeEnum(InfrastructureType),
  status: z.nativeEnum(InfrastructureStatus),
  vendor: z.string().max(100, 'validation.vendor.max').optional().nullable(),
  version: z.string().max(50, 'validation.version.max').optional().nullable(),
  capacity: z.string().max(100, 'validation.capacity.max').optional().nullable(),
  location: z.string().max(100, 'validation.location.max').optional().nullable(),
  ipAddress: z.string().max(15, 'validation.ipAddress.max').optional().nullable(),
  operatingSystem: z.string().max(100, 'validation.operatingSystem.max').optional().nullable(),
  specifications: z.string().max(500, 'validation.specifications.max').optional().nullable(),
  maintenanceWindow: z.string().max(100, 'validation.maintenanceWindow.max').optional().nullable(),
  costs: z.number().min(0, 'validation.costs.min').optional().nullable(),
  introductionDate: z.date().optional().nullable(),
  endOfLifeDate: z.date().optional().nullable(),
  planningDate: z.date().optional().nullable(),
  endOfUseDate: z.date().optional().nullable(),
  ownerId: z.string().optional(),
  parentInfrastructure: z.array(z.string()).optional(),
  childInfrastructures: z.array(z.string()).optional(),
  hostsApplications: z.array(z.string()).optional(),
  partOfArchitectures: z.array(z.string()).optional(),
  depictedInDiagrams: z.array(z.string()).optional(),
})

// Schema for form validation with extended validations
export const createInfrastructureSchema = (t: any) =>
  baseInfrastructureSchema.superRefine((data, ctx) => {
    // Lifecycle date validation with individual error messages
    const dates = [
      { field: 'planningDate', date: data.planningDate, label: t('validation.planningDate') },
      {
        field: 'introductionDate',
        date: data.introductionDate,
        label: t('validation.introductionDate'),
      },
      { field: 'endOfUseDate', date: data.endOfUseDate, label: t('validation.endOfUseDate') },
      { field: 'endOfLifeDate', date: data.endOfLifeDate, label: t('validation.endOfLifeDate') },
    ] as const

    const setDates = dates.filter(d => d.date && d.date instanceof Date && !isNaN(d.date.getTime()))

    // Check chronological order between all consecutive dates
    for (let i = 0; i < setDates.length - 1; i++) {
      const currentDate = setDates[i]
      const nextDate = setDates[i + 1]

      if (currentDate.date! >= nextDate.date!) {
        // Add error message to the later date
        ctx.addIssue({
          code: 'custom',
          message: t('validation.dateOrderError', {
            nextDate: nextDate.label,
            currentDate: currentDate.label,
          }),
          path: [nextDate.field],
        })
      }
    }
  })

// TypeScript Typen basierend auf dem Schema
export type InfrastructureFormValues = z.infer<typeof baseInfrastructureSchema>

import { GenericFormProps } from '../common/GenericFormProps'

// Tab configuration with translations
const INFRASTRUCTURE_TABS = (tTabs: any) => [
  { id: 'general', label: tTabs('general') },
  { id: 'technical', label: tTabs('technical') },
  { id: 'lifecycle', label: tTabs('lifecycle') },
  { id: 'relationships', label: tTabs('relationships') },
  { id: 'architectures', label: tTabs('architectures') },
]

const InfrastructureForm: React.FC<GenericFormProps<Infrastructure, InfrastructureFormValues>> = ({
  data: infrastructure,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const t = useTranslations('infrastructure.form')
  const tTabs = useTranslations('infrastructure.tabs')
  const tTypes = useTranslations('infrastructure.infrastructureTypes')
  const tStatuses = useTranslations('infrastructure.statuses')

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
      parentInfrastructure: 'infrastructures',
      childInfrastructures: 'infrastructures',
      hostsApplications: 'applications',
      partOfArchitectures: 'architectures',
      depictedInDiagrams: 'diagrams',
    },
  })

  const handleCloseNestedForm = () => {
    setNestedFormState({ isOpen: false, entityType: null, entityId: null, mode: 'view' })
  }

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()

  // Wrapper-Funktion für Typen-Kompatibilität
  // Verwende erstmal das Basis-Schema ohne erweiterte Validierung
  const infrastructureSchema = baseInfrastructureSchema

  // Helper function for Infrastructure Type Labels
  const getInfrastructureTypeLabel = (type: InfrastructureType) => {
    switch (type) {
      case InfrastructureType.CLOUD_DATACENTER:
        return tTypes('CLOUD_DATACENTER')
      case InfrastructureType.CONTAINER_HOST:
        return tTypes('CONTAINER_HOST')
      case InfrastructureType.KUBERNETES_CLUSTER:
        return tTypes('KUBERNETES_CLUSTER')
      case InfrastructureType.ON_PREMISE_DATACENTER:
        return tTypes('ON_PREMISE_DATACENTER')
      case InfrastructureType.PHYSICAL_SERVER:
        return tTypes('PHYSICAL_SERVER')
      case InfrastructureType.VIRTUAL_MACHINE:
        return tTypes('VIRTUAL_MACHINE')
      case InfrastructureType.VIRTUALIZATION_CLUSTER:
        return tTypes('VIRTUALIZATION_CLUSTER')
      default:
        return type
    }
  }

  // Helper function for status labels
  const getStatusLabel = (status: InfrastructureStatus) => {
    switch (status) {
      case InfrastructureStatus.ACTIVE:
        return tStatuses('ACTIVE')
      case InfrastructureStatus.DECOMMISSIONED:
        return tStatuses('DECOMMISSIONED')
      case InfrastructureStatus.INACTIVE:
        return tStatuses('INACTIVE')
      case InfrastructureStatus.MAINTENANCE:
        return tStatuses('MAINTENANCE')
      case InfrastructureStatus.PLANNED:
        return tStatuses('PLANNED')
      case InfrastructureStatus.UNDER_CONSTRUCTION:
        return tStatuses('UNDER_CONSTRUCTION')
      default:
        return status
    }
  }

  const personWhere = useCompanyWhere('companies')
  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })
  // Load applications
  const companyWhere = useCompanyWhere('company')
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  // Architekturen laden
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })
  // Diagramme laden
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  // Infrastrukturen laden (für Parent-Infrastructure)
  const { data: infrastructuresData, loading: infrastructuresLoading } = useQuery(
    GET_INFRASTRUCTURES,
    {
      fetchPolicy: 'cache-and-network',
      variables: { where: companyWhere },
    }
  )

  // Nested entity queries for chip navigation (loaded on demand)
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

  const { data: nestedInfrastructureData } = useQuery(GET_INFRASTRUCTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'infrastructures',
  })

  // Initialize form data with useMemo, um unnötige Re-Renders zu vermeiden
  const defaultValues = React.useMemo<InfrastructureFormValues>(
    () => ({
      name: infrastructure?.name || '',
      description: infrastructure?.description || null,
      infrastructureType: infrastructure?.infrastructureType || InfrastructureType.VIRTUAL_MACHINE,
      status: infrastructure?.status || InfrastructureStatus.PLANNED,
      vendor: infrastructure?.vendor || null,
      version: infrastructure?.version || null,
      capacity: infrastructure?.capacity || null,
      location: infrastructure?.location || null,
      ipAddress: infrastructure?.ipAddress || null,
      operatingSystem: infrastructure?.operatingSystem || null,
      specifications: infrastructure?.specifications || null,
      maintenanceWindow: infrastructure?.maintenanceWindow || null,
      costs: infrastructure?.costs || null,
      introductionDate: infrastructure?.introductionDate
        ? new Date(infrastructure.introductionDate)
        : null,
      endOfLifeDate: infrastructure?.endOfLifeDate ? new Date(infrastructure.endOfLifeDate) : null,
      planningDate: infrastructure?.planningDate ? new Date(infrastructure.planningDate) : null,
      endOfUseDate: infrastructure?.endOfUseDate ? new Date(infrastructure.endOfUseDate) : null,
      ownerId:
        infrastructure?.owners && infrastructure.owners.length > 0
          ? infrastructure.owners[0].id
          : currentPerson?.id,
      parentInfrastructure: infrastructure?.parentInfrastructure?.map(parent => parent.id) || [],
      childInfrastructures: infrastructure?.childInfrastructures?.map(infra => infra.id) || [],
      hostsApplications: infrastructure?.hostsApplications?.map(app => app.id) || [],
      partOfArchitectures: infrastructure?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: infrastructure?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [infrastructure, currentPerson?.id]
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primary validation on changes
      onChange: infrastructureSchema,
      // Validation on submit
      onSubmit: infrastructureSchema,
    },
  })

  // Update form when data changes
  useEffect(() => {
    // Non-reactive flag for unexpected state handling
    let hasHandledForm = false

    if (!isOpen) {
      // Dialog closed - reset form
      form.reset()
      return
    }

    if (mode === 'create') {
      // Initialize with empty default values in CREATE mode
      form.reset(defaultValues)
      hasHandledForm = true
    } else if ((mode === 'view' || mode === 'edit') && infrastructure && infrastructure.id) {
      // Im edit/view Mode mit Werten aus infrastructure initialisieren
      const formValues = {
        name: infrastructure.name ?? '',
        description: infrastructure.description ?? null,
        infrastructureType: infrastructure.infrastructureType ?? InfrastructureType.VIRTUAL_MACHINE,
        status: infrastructure.status ?? InfrastructureStatus.PLANNED,
        vendor: infrastructure.vendor ?? null,
        version: infrastructure.version ?? null,
        capacity: infrastructure.capacity ?? null,
        location: infrastructure.location ?? null,
        ipAddress: infrastructure.ipAddress ?? null,
        operatingSystem: infrastructure.operatingSystem ?? null,
        specifications: infrastructure.specifications ?? null,
        maintenanceWindow: infrastructure.maintenanceWindow ?? null,
        costs: infrastructure.costs ?? null,
        introductionDate: infrastructure.introductionDate
          ? new Date(infrastructure.introductionDate)
          : null,
        endOfLifeDate: infrastructure.endOfLifeDate ? new Date(infrastructure.endOfLifeDate) : null,
        planningDate: infrastructure.planningDate ? new Date(infrastructure.planningDate) : null,
        endOfUseDate: infrastructure.endOfUseDate ? new Date(infrastructure.endOfUseDate) : null,
        ownerId:
          infrastructure.owners && infrastructure.owners.length > 0
            ? infrastructure.owners[0].id
            : undefined,
        parentInfrastructure: infrastructure.parentInfrastructure?.map(parent => parent.id) ?? [],
        childInfrastructures: infrastructure.childInfrastructures?.map(infra => infra.id) ?? [],
        hostsApplications: infrastructure.hostsApplications?.map(app => app.id) ?? [],
        partOfArchitectures: infrastructure.partOfArchitectures?.map(arch => arch.id) ?? [],
        depictedInDiagrams: infrastructure.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
      }

      // Reset form with values from existing Infrastructure
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final fallback - only execute if none of the previous conditions matched
    if (!hasHandledForm) {
      // Always reset with default values, aber Dialog nicht automatisch schließen
      form.reset(defaultValues)
    }
  }, [form, infrastructure, isOpen, defaultValues, mode])

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
      label: t('name'),
      type: 'text',
      required: true,
      validators: baseInfrastructureSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'infrastructureType',
      label: t('infrastructureType'),
      type: 'select',
      required: true,
      validators: baseInfrastructureSchema.shape.infrastructureType,
      options: Object.values(InfrastructureType).map(
        (type): SelectOption => ({
          value: type,
          label: getInfrastructureTypeLabel(type),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      required: true,
      validators: baseInfrastructureSchema.shape.status,
      options: Object.values(InfrastructureStatus).map(
        (status): SelectOption => ({
          value: status,
          label: getStatusLabel(status),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      validators: baseInfrastructureSchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'vendor',
      label: t('vendor' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.vendor,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'version',
      label: t('version' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.version,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'capacity',
      label: t('capacity' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.capacity,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'location',
      label: t('location' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.location,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'ipAddress',
      label: t('ipAddress' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.ipAddress,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'operatingSystem',
      label: t('operatingSystem' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.operatingSystem,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'specifications',
      label: t('specifications' as any),
      type: 'textarea',
      validators: baseInfrastructureSchema.shape.specifications,
      rows: 3,
      size: 12,
      tabId: 'technical',
    },
    {
      name: 'maintenanceWindow',
      label: t('maintenanceWindow' as any),
      type: 'text',
      validators: baseInfrastructureSchema.shape.maintenanceWindow,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'costs',
      label: t('costs' as any),
      type: 'number',
      validators: baseInfrastructureSchema.shape.costs,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    // Lebenszyklus (Tab: lifecycle) - in chronologischer Reihenfolge
    {
      name: 'planningDate',
      label: t('planningDate' as any),
      icon: <PlanningIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.planningDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'introductionDate',
      label: t('introductionDate' as any),
      icon: <LaunchIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.introductionDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfUseDate',
      label: t('endOfUseDate' as any),
      icon: <PauseIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.endOfUseDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfLifeDate',
      label: t('endOfLifeDate' as any),
      icon: <DeleteIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'ownerId',
      label: t('ownerId' as any),
      type: 'select',
      options: [
        { value: '', label: 'Keine' },
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
      name: 'parentInfrastructure',
      label: t('parentInfrastructure' as any),
      type: 'autocomplete',
      validators: baseInfrastructureSchema.shape.parentInfrastructure,
      size: 12,
      options:
        infrastructuresData?.infrastructures
          ?.filter((infra: Infrastructure) => infra.id !== infrastructure?.id)
          .map(
            (infra: Infrastructure): SelectOption => ({
              value: infra.id,
              label: infra.name,
            })
          ) || [],
      multiple: true,
      loadingOptions: infrastructuresLoading,
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
      tabId: 'relationships',
      onChipClick: createChipClickHandler('parentInfrastructure'),
    },
    {
      name: 'childInfrastructures',
      label: t('childInfrastructures' as any),
      type: 'autocomplete',
      validators: baseInfrastructureSchema.shape.childInfrastructures,
      size: 12,
      options:
        infrastructuresData?.infrastructures
          ?.filter((infra: Infrastructure) => infra.id !== infrastructure?.id)
          .map(
            (infra: Infrastructure): SelectOption => ({
              value: infra.id,
              label: infra.name,
            })
          ) || [],
      multiple: true,
      loadingOptions: infrastructuresLoading,
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
      tabId: 'relationships',
      onChipClick: createChipClickHandler('childInfrastructures'),
    },
    {
      name: 'hostsApplications',
      label: t('hostsApplications' as any),
      type: 'autocomplete',
      validators: baseInfrastructureSchema.shape.hostsApplications,
      multiple: true,
      options: (applicationsData?.applications || []).map((app: Application) => ({
        value: app.id,
        label: app.name,
      })),
      loadingOptions: applicationsLoading,
      size: 12,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
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
      onChipClick: createChipClickHandler('hostsApplications'),
    },
    {
      name: 'partOfArchitectures',
      label: t('partOfArchitectures' as any),
      type: 'autocomplete',
      multiple: true,
      options: (architecturesData?.architectures || []).map((arch: Architecture) => ({
        value: arch.id,
        label: arch.name,
      })),
      loadingOptions: architecturesLoading,
      size: 12,
      tabId: 'architectures',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
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
      onChipClick: createChipClickHandler('partOfArchitectures'),
    },
    {
      name: 'depictedInDiagrams',
      label: t('depictedInDiagrams' as any),
      type: 'autocomplete',
      multiple: true,
      options: (diagramsData?.diagrams || []).map((diagram: any) => ({
        value: diagram.id,
        label: diagram.title,
      })),
      loadingOptions: diagramsLoading,
      size: 12,
      tabId: 'architectures',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingDiagram = diagramsData?.diagrams?.find(
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
      onChipClick: createChipClickHandler('depictedInDiagrams'),
    },
  ]

  return (
    <>
      <GenericForm
        title={
          mode === 'create'
            ? t('createNew' as any)
            : mode === 'edit'
              ? t('edit' as any)
              : t('details' as any)
        }
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={
          loading ||
          personLoading ||
          applicationsLoading ||
          architecturesLoading ||
          diagramsLoading ||
          infrastructuresLoading
        }
        mode={mode}
        isNested={isNested}
        fields={fields}
        form={form}
        enableDelete={mode === 'edit' && !!infrastructure && isArchitect()}
        onDelete={infrastructure?.id ? () => onDelete?.(infrastructure.id) : undefined}
        onEditMode={onEditMode}
        entityId={infrastructure?.id}
        entityName={t('entityName' as any)}
        metadata={
          infrastructure
            ? {
                createdAt: infrastructure.createdAt,
                updatedAt: infrastructure.updatedAt,
              }
            : undefined
        }
        tabs={INFRASTRUCTURE_TABS(tTabs)}
      />

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

      {/* Nested Infrastructure Form (parent/child) */}
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
    </>
  )
}

export default InfrastructureForm
