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
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_APPLICATION_INTERFACES } from '@/graphql/applicationInterface'
import { GET_DATA_OBJECTS, GET_DATA_OBJECT } from '@/graphql/dataObject'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { DataObject, DataClassification, Architecture } from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import ApplicationForm from '../applications/ApplicationForm'
import CapabilityForm from '../capabilities/CapabilityForm'
import ApplicationInterfaceForm from '../interfaces/ApplicationInterfaceForm'
import ArchitectureForm from '../architectures/ArchitectureForm'

// Basis-Schema factory function with translations
const createBaseDataObjectSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('validation.nameMin')).max(100, t('validation.nameMax')),
    description: z
      .string()
      .min(10, t('validation.descriptionMin'))
      .max(1000, t('validation.descriptionMax')),
    classification: z.nativeEnum(DataClassification),
    format: z.string().max(50, t('validation.formatMax')).optional().nullable(),
    dataSources: z.array(z.string()).optional(),
    usedByApplications: z.array(z.string()).optional(),
    relatedToCapabilities: z.array(z.string()).optional(),
    transferredInInterfaces: z.array(z.string()).optional(),
    relatedDataObjects: z.array(z.string()).optional(),
    introductionDate: z.date().optional().nullable(),
    endOfLifeDate: z.date().optional().nullable(),
    planningDate: z.date().optional().nullable(),
    endOfUseDate: z.date().optional().nullable(),
    ownerId: z.string().optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
  })

// Schema factory function for form validation with extended validations
export const createDataObjectSchema = (t: any) =>
  createBaseDataObjectSchema(t).superRefine((data, ctx) => {
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
export type DataObjectFormValues = z.infer<ReturnType<typeof createDataObjectSchema>>

import { GenericFormProps } from '../common/GenericFormProps'

const DataObjectForm: React.FC<GenericFormProps<DataObject, DataObjectFormValues>> = ({
  data: dataObject,
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
  const t = useTranslations('dataObjects.form')
  const tTabs = useTranslations('dataObjects.tabs')
  const tClassifications = useTranslations('dataObjects.classifications')

  // State for nested forms opened via chip clicks
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
      dataSources: 'applications',
      usedByApplications: 'applications',
      relatedToCapabilities: 'capabilities',
      transferredInInterfaces: 'applicationInterfaces',
      relatedDataObjects: 'dataObjects',
      partOfArchitectures: 'architectures',
      depictedInDiagrams: 'diagrams',
    },
  })

  const handleCloseNestedForm = () => {
    setNestedFormState({ isOpen: false, entityType: null, entityId: null, mode: 'view' })
  }

  // Create schemas with translations
  const dataObjectSchema = React.useMemo(() => createDataObjectSchema(t), [t])
  const baseDataObjectSchema = React.useMemo(() => createBaseDataObjectSchema(t), [t])

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()

  const personWhere = useCompanyWhere('companies')
  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })
  // Load applications
  const companyWhere = useCompanyWhere('company')
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  // Capabilities laden
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES, {
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
  // Application Interfaces laden
  const { data: interfacesData, loading: interfacesLoading } = useQuery(
    GET_APPLICATION_INTERFACES,
    {
      fetchPolicy: 'cache-and-network',
      variables: { where: companyWhere },
    }
  )
  // Data Objects laden (for related data objects)
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })

  // Nested entity queries (loaded on demand via chip click)
  const { data: nestedApplicationData } = useQuery(GET_APPLICATIONS, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applications',
  })

  const { data: nestedCapabilityData } = useQuery(GET_CAPABILITIES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'capabilities',
  })

  const { data: nestedInterfaceData } = useQuery(GET_APPLICATION_INTERFACES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applicationInterfaces',
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const { data: nestedDataObjectData } = useQuery(GET_DATA_OBJECT, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'dataObjects',
  })

  // Initialize form data with useMemo to avoid unnecessary re-renders
  const defaultValues = React.useMemo<DataObjectFormValues>(
    () => ({
      name: dataObject?.name || '',
      description: dataObject?.description || '',
      classification: dataObject?.classification || DataClassification.INTERNAL,
      format: dataObject?.format || null,
      dataSources: dataObject?.dataSources?.map(source => source.id) || [],
      usedByApplications: dataObject?.usedByApplications?.map(app => app.id) || [],
      relatedToCapabilities: dataObject?.relatedToCapabilities?.map(cap => cap.id) || [],
      transferredInInterfaces: dataObject?.transferredInInterfaces?.map(inter => inter.id) || [],
      relatedDataObjects: dataObject?.relatedDataObjects?.map(obj => obj.id) || [],
      introductionDate: dataObject?.introductionDate ? new Date(dataObject.introductionDate) : null,
      endOfLifeDate: dataObject?.endOfLifeDate ? new Date(dataObject.endOfLifeDate) : null,
      planningDate: dataObject?.planningDate ? new Date(dataObject.planningDate) : null,
      endOfUseDate: dataObject?.endOfUseDate ? new Date(dataObject.endOfUseDate) : null,
      ownerId:
        dataObject?.owners && dataObject.owners.length > 0
          ? dataObject.owners[0].id
          : currentPerson?.id,
      partOfArchitectures: dataObject?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: dataObject?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [dataObject, currentPerson?.id]
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primary validation on changes
      onChange: dataObjectSchema,
      // Validation on submit
      onSubmit: dataObjectSchema,
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
    } else if ((mode === 'view' || mode === 'edit') && dataObject && dataObject.id) {
      // Im edit/view Mode mit Werten aus dataObject initialisieren
      const formValues = {
        name: dataObject.name ?? '',
        description: dataObject.description ?? '',
        classification: dataObject.classification ?? DataClassification.INTERNAL,
        format: dataObject.format ?? null,
        dataSources: dataObject.dataSources?.map(app => app.id) ?? [],
        usedByApplications: dataObject.usedByApplications?.map(app => app.id) ?? [],
        relatedToCapabilities: dataObject.relatedToCapabilities?.map(cap => cap.id) ?? [],
        transferredInInterfaces: dataObject.transferredInInterfaces?.map(inter => inter.id) ?? [],
        relatedDataObjects: dataObject.relatedDataObjects?.map(obj => obj.id) ?? [],
        introductionDate: dataObject.introductionDate
          ? new Date(dataObject.introductionDate)
          : null,
        endOfLifeDate: dataObject.endOfLifeDate ? new Date(dataObject.endOfLifeDate) : null,
        planningDate: dataObject.planningDate ? new Date(dataObject.planningDate) : null,
        endOfUseDate: dataObject.endOfUseDate ? new Date(dataObject.endOfUseDate) : null,
        ownerId:
          dataObject.owners && dataObject.owners.length > 0 ? dataObject.owners[0].id : undefined,
        partOfArchitectures: dataObject.partOfArchitectures?.map(arch => arch.id) ?? [],
        depictedInDiagrams: dataObject.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
      }

      // Reset form with values from existing DataObject
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final fallback - only execute if none of the previous conditions matched
    if (!hasHandledForm) {
      // Always reset with default values, but do not close dialog automatically
      form.reset(defaultValues)
    }
  }, [form, dataObject, isOpen, defaultValues, mode])

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

  // Dynamic tab configuration with translations
  const tabs = React.useMemo(
    () => [
      { id: 'general', label: tTabs('general') },
      { id: 'lifecycle', label: tTabs('lifecycle') },
      { id: 'relationships', label: tTabs('relationships') },
      { id: 'architectures', label: tTabs('architectures') },
    ],
    [tTabs]
  )

  const fields: FieldConfigWithSelect[] = [
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      validators: baseDataObjectSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'classification',
      label: t('classification'),
      type: 'select',
      required: true,
      validators: baseDataObjectSchema.shape.classification,
      options: Object.values(DataClassification).map(
        (classification): SelectOption => ({
          value: classification,
          label: tClassifications(classification),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      required: true,
      validators: baseDataObjectSchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'format',
      label: t('format'),
      type: 'text',
      validators: baseDataObjectSchema.shape.format,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    // Lebenszyklus (Tab: lifecycle) - in chronologischer Reihenfolge
    {
      name: 'planningDate',
      label: t('planningDate'),
      icon: <PlanningIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.planningDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'introductionDate',
      label: t('introductionDate'),
      icon: <LaunchIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.introductionDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfUseDate',
      label: t('endOfUseDate'),
      icon: <PauseIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.endOfUseDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfLifeDate',
      label: t('endOfLifeDate'),
      icon: <DeleteIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'ownerId',
      label: t('owner'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
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
      name: 'dataSources',
      label: t('dataSources'),
      type: 'autocomplete',
      validators: baseDataObjectSchema.shape.dataSources,
      size: { xs: 12, md: 6 },
      options:
        applicationData?.applications?.map(
          (app: { id: string; name: string }): SelectOption => ({
            value: app.id,
            label: app.name,
          })
        ) || [],
      multiple: true,
      loadingOptions: applicationLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = applicationData?.applications?.find(
            (app: { id: string; name: string }) => app.id === option
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
      onChipClick: createChipClickHandler('dataSources'),
      tabId: 'relationships',
    },
    {
      name: 'usedByApplications',
      label: t('usedByApplications'),
      type: 'autocomplete',
      validators: baseDataObjectSchema.shape.usedByApplications,
      size: { xs: 12, md: 6 },
      options:
        applicationData?.applications?.map(
          (app: { id: string; name: string }): SelectOption => ({
            value: app.id,
            label: app.name,
          })
        ) || [],
      multiple: true,
      loadingOptions: applicationLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = applicationData?.applications?.find(
            (app: { id: string; name: string }) => app.id === option
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
      onChipClick: createChipClickHandler('usedByApplications'),
      tabId: 'relationships',
    },
    {
      name: 'relatedToCapabilities',
      label: t('relatedToCapabilities'),
      type: 'autocomplete',
      validators: baseDataObjectSchema.shape.relatedToCapabilities,
      size: { xs: 12, md: 6 },
      options:
        capabilitiesData?.businessCapabilities?.map(
          (cap: { id: string; name: string }): SelectOption => ({
            value: cap.id,
            label: cap.name,
          })
        ) || [],
      multiple: true,
      loadingOptions: capabilitiesLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingCap = capabilitiesData?.businessCapabilities?.find(
            (cap: { id: string; name: string }) => cap.id === option
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
      onChipClick: createChipClickHandler('relatedToCapabilities'),
      tabId: 'relationships',
    },
    {
      name: 'transferredInInterfaces',
      label: t('transferredInInterfaces'),
      type: 'autocomplete',
      validators: baseDataObjectSchema.shape.transferredInInterfaces,
      size: { xs: 12, md: 6 },
      options:
        interfacesData?.applicationInterfaces?.map(
          (inter: { id: string; name: string }): SelectOption => ({
            value: inter.id,
            label: inter.name,
          })
        ) || [],
      multiple: true,
      loadingOptions: interfacesLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInterface = interfacesData?.applicationInterfaces?.find(
            (inter: { id: string; name: string }) => inter.id === option
          )
          return matchingInterface?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('transferredInInterfaces'),
      tabId: 'relationships',
    },
    {
      name: 'relatedDataObjects',
      label: t('relatedDataObjects'),
      type: 'autocomplete',
      validators: baseDataObjectSchema.shape.relatedDataObjects,
      size: { xs: 12, md: 6 },
      options:
        dataObjectsData?.dataObjects?.map(
          (obj: { id: string; name: string }): SelectOption => ({
            value: obj.id,
            label: obj.name,
          })
        ) || [],
      multiple: true,
      loadingOptions: dataObjectsLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingDataObject = dataObjectsData?.dataObjects?.find(
            (obj: { id: string; name: string }) => obj.id === option
          )
          return matchingDataObject?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('relatedDataObjects'),
      tabId: 'relationships',
    },
    {
      name: 'partOfArchitectures',
      label: t('partOfArchitectures'),
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
      label: t('depictedInDiagrams'),
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
          mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
        }
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={loading}
        mode={mode}
        isNested={isNested}
        fields={fields}
        form={form}
        enableDelete={mode === 'edit' && !!dataObject && isArchitect()}
        onDelete={dataObject?.id ? () => onDelete?.(dataObject.id) : undefined}
        onEditMode={onEditMode}
        entityId={dataObject?.id}
        entityName={t('entityName' as any)}
        metadata={
          dataObject
            ? {
                createdAt: dataObject.createdAt,
                updatedAt: dataObject.updatedAt,
              }
            : undefined
        }
        tabs={tabs}
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

      {/* Nested Application Interface Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'applicationInterfaces' &&
        nestedInterfaceData?.applicationInterfaces?.[0] && (
          <ApplicationInterfaceForm
            data={nestedInterfaceData.applicationInterfaces[0]}
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

      {/* Nested DataObject Form */}
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
    </>
  )
}

export default DataObjectForm
