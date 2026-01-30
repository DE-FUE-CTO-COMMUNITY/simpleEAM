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
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_APPLICATION_INTERFACES } from '@/graphql/applicationInterface'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import {
  ApplicationInterface,
  InterfaceType,
  InterfaceProtocol,
  InterfaceStatus,
  Application,
  Person,
} from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { DataObject } from '@/gql/generated'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import ApplicationForm from '../applications/ApplicationForm'
import DataObjectForm from '../dataobjects/DataObjectForm'
import ArchitectureForm from '../architectures/ArchitectureForm'

// Base schema factory function that accepts translations
const createBaseApplicationInterfaceSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t('validation.nameMin')).max(100, t('validation.nameMax')),
    description: z
      .string()
      .min(10, t('validation.descriptionMin'))
      .max(1000, t('validation.descriptionMax')),
    interfaceType: z.nativeEnum(InterfaceType, {
      errorMap: () => ({ message: t('validation.interfaceTypeRequired') }),
    }),
    protocol: z.nativeEnum(InterfaceProtocol).optional().nullable(),
    version: z.string().max(50, t('validation.versionMax')).optional().nullable(),
    status: z.nativeEnum(InterfaceStatus),
    introductionDate: z.date().optional().nullable(),
    endOfLifeDate: z.date().optional().nullable(),
    planningDate: z.date().optional().nullable(),
    endOfUseDate: z.date().optional().nullable(),
    owners: z.string().optional().nullable(),
    sourceApplications: z.array(z.string()).optional(),
    targetApplications: z.array(z.string()).optional(),
    dataObjects: z.array(z.string()).optional(),
    partOfArchitectures: z.array(z.string()).optional(),
    depictedInDiagrams: z.array(z.string()).optional(),
    predecessorIds: z.array(z.string()).optional(),
    successorIds: z.array(z.string()).optional(),
  })

// Extended schema factory function with lifecycle logic
export const createApplicationInterfaceSchema = (t: any, tForm: any) =>
  createBaseApplicationInterfaceSchema(t).superRefine((data, ctx) => {
    // Lifecycle date validation with individual error messages
    const dates = [
      { field: 'planningDate', date: data.planningDate, label: tForm('planningDate') },
      { field: 'introductionDate', date: data.introductionDate, label: tForm('introductionDate') },
      { field: 'endOfUseDate', date: data.endOfUseDate, label: tForm('endOfUseDate') },
      { field: 'endOfLifeDate', date: data.endOfLifeDate, label: tForm('endOfLifeDate') },
    ] as const

    const setDates = dates.filter(d => d.date && d.date instanceof Date && !isNaN(d.date.getTime()))

    // Check chronological order between all consecutive dates
    for (let i = 0; i < setDates.length - 1; i++) {
      const currentDate = setDates[i]
      const nextDate = setDates[i + 1]

      if (currentDate.date! > nextDate.date!) {
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

    // Status-Lifecycle-Validierung basierend auf dem aktuellen Datum
    const status = data.status
    const now = new Date()
    const introductionDate = data.introductionDate
    const endOfUseDate = data.endOfUseDate

    switch (status) {
      case InterfaceStatus.IN_DEVELOPMENT:
        if (introductionDate && introductionDate <= now) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.inDevelopmentFutureIntroduction'),
            path: ['introductionDate'],
          })
        }
        break
      case InterfaceStatus.PLANNED:
        if (introductionDate && introductionDate <= now) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.plannedFutureIntroduction'),
            path: ['introductionDate'],
          })
        }
        break
      case InterfaceStatus.ACTIVE:
        // ACTIVE: If introduction date is set, it must be in the past
        if (introductionDate && introductionDate > now) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.activePastIntroduction'),
            path: ['introductionDate'],
          })
        }
        // AND end-of-use must be in the future (or not set)
        if (endOfUseDate && endOfUseDate <= now) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.activeFutureEndOfUse'),
            path: ['endOfUseDate'],
          })
        }
        break
      case InterfaceStatus.DEPRECATED:
        if (!endOfUseDate || endOfUseDate > now) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.deprecatedPastEndOfUse'),
            path: ['endOfUseDate'],
          })
        }
        break
      case InterfaceStatus.OUT_OF_SERVICE:
        if (!endOfUseDate || endOfUseDate > now) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.outOfServicePastEndOfUse'),
            path: ['endOfUseDate'],
          })
        }
        break
    }
  })

// TypeScript Typen basierend auf dem Schema
export type ApplicationInterfaceFormValues = z.infer<
  ReturnType<typeof createApplicationInterfaceSchema>
>

import { GenericFormProps } from '../common/GenericFormProps'

export interface ApplicationInterfaceFormProps
  extends GenericFormProps<ApplicationInterface, ApplicationInterfaceFormValues> {
  dataObjects?: DataObject[]
  applications?: Application[]
  persons?: Person[]
}

const ApplicationInterfaceForm: React.FC<ApplicationInterfaceFormProps> = ({
  data: applicationInterface,
  dataObjects = [],
  applications: _applications = [],
  persons: _persons = [],
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
  const t = useTranslations('interfaces.form')
  const tTabs = useTranslations('interfaces.tabs')
  const tTypes = useTranslations('interfaces.interfaceTypes')
  const tStatuses = useTranslations('interfaces.statuses')

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
      predecessorIds: 'applicationInterfaces',
      successorIds: 'applicationInterfaces',
      sourceApplications: 'applications',
      targetApplications: 'applications',
      dataObjects: 'dataObjects',
      partOfArchitectures: 'architectures',
      depictedInDiagrams: 'diagrams',
    },
  })

  const handleCloseNestedForm = () => {
    setNestedFormState({ isOpen: false, entityType: null, entityId: null, mode: 'view' })
  }

  // Create schemas with translations
  const applicationInterfaceSchema = React.useMemo(
    () => createApplicationInterfaceSchema(t, t),
    [t]
  )
  const baseApplicationInterfaceSchema = React.useMemo(
    () => createBaseApplicationInterfaceSchema(t),
    [t]
  )

  // Get current user as default owner
  const { currentPerson } = useCurrentPerson()
  const personWhere = useCompanyWhere('companies')

  // Helper function for interface type labels
  const getInterfaceTypeLabel = (type: InterfaceType) => {
    switch (type) {
      case InterfaceType.API:
        return tTypes('API')
      case InterfaceType.DATABASE:
        return tTypes('DATABASE')
      case InterfaceType.FILE:
        return tTypes('FILE')
      case InterfaceType.MESSAGE_QUEUE:
        return tTypes('MESSAGE_QUEUE')
      case InterfaceType.OTHER:
        return tTypes('OTHER')
      default:
        return type
    }
  }

  // Helper function for status labels
  const getStatusLabel = (status: InterfaceStatus) => {
    switch (status) {
      case InterfaceStatus.ACTIVE:
        return tStatuses('ACTIVE')
      case InterfaceStatus.IN_DEVELOPMENT:
        return tStatuses('IN_DEVELOPMENT')
      case InterfaceStatus.PLANNED:
        return tStatuses('PLANNED')
      case InterfaceStatus.DEPRECATED:
        return tStatuses('DEPRECATED')
      case InterfaceStatus.OUT_OF_SERVICE:
        return tStatuses('OUT_OF_SERVICE')
      default:
        return status
    }
  }

  // Tab configuration with translations
  const APPLICATION_INTERFACE_TABS = [
    { id: 'general', label: tTabs('general') },
    { id: 'technical', label: tTabs('technical') },
    { id: 'lifecycle', label: tTabs('lifecycle') },
    { id: 'relationships', label: tTabs('relationships') },
    { id: 'architectures', label: tTabs('architectures') },
  ]

  // Load data with cache-and-network policy for fresh data
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })
  const companyWhere = useCompanyWhere('company')
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: { where: companyWhere },
  })
  const { data: applicationInterfacesData, loading: applicationInterfacesLoading } = useQuery(
    GET_APPLICATION_INTERFACES,
    {
      fetchPolicy: 'cache-and-network',
      variables: { where: companyWhere },
    }
  )

  // Nested entity queries for chip navigation
  const { data: nestedApplicationData } = useQuery(GET_APPLICATIONS, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applications',
  })

  const { data: nestedDataObjectData } = useQuery(GET_DATA_OBJECTS, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'dataObjects',
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  const { data: nestedInterfaceData } = useQuery(GET_APPLICATION_INTERFACES, {
    variables: {
      where: { id: { eq: nestedFormState.entityId }, ...companyWhere },
    },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applicationInterfaces',
  })

  // Initialize form data with useMemo to avoid unnecessary re-renders
  const defaultValues = React.useMemo<ApplicationInterfaceFormValues>(
    () => ({
      name: applicationInterface?.name || '',
      description: applicationInterface?.description || '',
      interfaceType: applicationInterface?.interfaceType || InterfaceType.API,
      protocol: applicationInterface?.protocol || null,
      version: applicationInterface?.version || null,
      status: applicationInterface?.status || InterfaceStatus.PLANNED,
      planningDate: applicationInterface?.planningDate
        ? new Date(applicationInterface.planningDate)
        : null,
      introductionDate: applicationInterface?.introductionDate
        ? new Date(applicationInterface.introductionDate)
        : null,
      endOfUseDate: applicationInterface?.endOfUseDate
        ? new Date(applicationInterface.endOfUseDate)
        : null,
      endOfLifeDate: applicationInterface?.endOfLifeDate
        ? new Date(applicationInterface.endOfLifeDate)
        : null,
      owners: applicationInterface?.owners?.[0]?.id || currentPerson?.id || null,
      sourceApplications: applicationInterface?.sourceApplications?.map(app => app.id) || [],
      targetApplications: applicationInterface?.targetApplications?.map(app => app.id) || [],
      dataObjects: applicationInterface?.dataObjects?.map(obj => obj.id) || [],
      partOfArchitectures: applicationInterface?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: applicationInterface?.depictedInDiagrams?.map(diag => diag.id) || [],
      predecessorIds: applicationInterface?.predecessors?.map(pred => pred.id) || [],
      successorIds: applicationInterface?.successors?.map(succ => succ.id) || [],
    }),
    [applicationInterface, currentPerson?.id]
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value)
      } catch (error) {
        console.error('ApplicationInterfaceForm: onSubmit failed:', error)
        throw error
      }
    },
    validators: {
      // Primary validation on changes
      onChange: applicationInterfaceSchema,
      // Validation on submit
      onSubmit: applicationInterfaceSchema,
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
    } else if (
      (mode === 'view' || mode === 'edit') &&
      applicationInterface &&
      applicationInterface.id
    ) {
      // Initialize with values from applicationInterface in edit/view mode
      const formValues = {
        name: applicationInterface.name ?? '',
        description: applicationInterface.description ?? '',
        interfaceType: applicationInterface.interfaceType,
        protocol: applicationInterface.protocol ?? null,
        version: applicationInterface.version ?? null,
        status: applicationInterface.status,
        planningDate: applicationInterface.planningDate
          ? new Date(applicationInterface.planningDate)
          : null,
        introductionDate: applicationInterface.introductionDate
          ? new Date(applicationInterface.introductionDate)
          : null,
        endOfUseDate: applicationInterface.endOfUseDate
          ? new Date(applicationInterface.endOfUseDate)
          : null,
        endOfLifeDate: applicationInterface.endOfLifeDate
          ? new Date(applicationInterface.endOfLifeDate)
          : null,
        owners:
          applicationInterface.owners && applicationInterface.owners.length > 0
            ? applicationInterface.owners[0].id
            : null,
        sourceApplications: applicationInterface.sourceApplications?.map(app => app.id) || [],
        targetApplications: applicationInterface.targetApplications?.map(app => app.id) || [],
        dataObjects: applicationInterface.dataObjects?.map(obj => obj.id) || [],
        partOfArchitectures: applicationInterface.partOfArchitectures?.map(arch => arch.id) || [],
        depictedInDiagrams: applicationInterface.depictedInDiagrams?.map(diag => diag.id) || [],
        predecessorIds: applicationInterface.predecessors?.map(iface => iface.id) || [],
        successorIds: applicationInterface.successors?.map(iface => iface.id) || [],
      }

      // Reset form with values from existing interface
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final fallback - only execute if none of the previous conditions matched
    if (!hasHandledForm) {
      // Always reset with default values
      form.reset(defaultValues)
    }
  }, [form, applicationInterface, isOpen, defaultValues, mode])

  // Field configuration for the generic form
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      validators: baseApplicationInterfaceSchema.shape.name,
      size: { xs: 12 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: t('description'),
      type: 'text',
      multiline: true,
      rows: 3,
      required: true,
      validators: baseApplicationInterfaceSchema.shape.description,
      size: { xs: 12 },
      tabId: 'general',
    },
    {
      name: 'interfaceType',
      label: t('interfaceType'),
      type: 'select',
      required: true,
      validators: baseApplicationInterfaceSchema.shape.interfaceType,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
      options: Object.values(InterfaceType).map(type => ({
        value: type,
        label: getInterfaceTypeLabel(type),
      })),
    },
    {
      name: 'protocol',
      label: t('protocol'),
      type: 'select',
      validators: baseApplicationInterfaceSchema.shape.protocol,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
      options: [
        { value: '', label: t('none') },
        ...Object.values(InterfaceProtocol).map(protocol => ({
          value: protocol,
          label: protocol,
        })),
      ],
    },
    {
      name: 'version',
      label: t('version'),
      type: 'text',
      validators: baseApplicationInterfaceSchema.shape.version,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      required: true,
      validators: baseApplicationInterfaceSchema.shape.status,
      size: { xs: 12, md: 6 },
      tabId: 'general',
      options: Object.values(InterfaceStatus).map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
    },
    {
      name: 'planningDate',
      label: t('planningDate'),
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.planningDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <PlanningIcon />,
    },
    {
      name: 'introductionDate',
      label: t('introductionDate'),
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.introductionDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <LaunchIcon />,
    },
    {
      name: 'endOfUseDate',
      label: t('endOfUseDate'),
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.endOfUseDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <PauseIcon />,
    },
    {
      name: 'endOfLifeDate',
      label: t('endOfLifeDate'),
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <DeleteIcon />,
    },
    {
      name: 'owners',
      label: t('owners'),
      type: 'autocomplete',
      size: { xs: 12 },
      tabId: 'general',
      options:
        personData?.people?.map((person: { id: string; firstName: string; lastName: string }) => ({
          value: person.id,
          label: `${person.firstName} ${person.lastName}`,
        })) || [],
      multiple: false,
      loadingOptions: personLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingPerson = personData?.people?.find(
            (person: { id: string; firstName: string; lastName: string }) => person.id === option
          )
          return matchingPerson ? `${matchingPerson.firstName} ${matchingPerson.lastName}` : option
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
      name: 'predecessorIds',
      label: t('predecessors'),
      type: 'autocomplete',
      tabId: 'general',
      multiple: true,
      options:
        applicationInterfacesData?.applicationInterfaces
          ?.filter((iface: ApplicationInterface) => iface.id !== applicationInterface?.id) // Exclude self
          ?.map((iface: ApplicationInterface) => ({
            value: iface.id,
            label: iface.name,
          })) || [],
      size: { xs: 12, md: 6 },
      loadingOptions: applicationInterfacesLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInterface = applicationInterfacesData?.applicationInterfaces?.find(
            (iface: ApplicationInterface) => iface.id === option
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
      onChipClick: createChipClickHandler('predecessorIds'),
    },
    {
      name: 'successorIds',
      label: t('successors'),
      type: 'autocomplete',
      tabId: 'general',
      multiple: true,
      options:
        applicationInterfacesData?.applicationInterfaces
          ?.filter((iface: ApplicationInterface) => iface.id !== applicationInterface?.id) // Exclude self
          ?.map((iface: ApplicationInterface) => ({
            value: iface.id,
            label: iface.name,
          })) || [],
      size: { xs: 12, md: 6 },
      loadingOptions: applicationInterfacesLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInterface = applicationInterfacesData?.applicationInterfaces?.find(
            (iface: ApplicationInterface) => iface.id === option
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
      onChipClick: createChipClickHandler('successorIds'),
    },
    {
      name: 'sourceApplications',
      label: t('sourceApplications'),
      type: 'autocomplete',
      size: { xs: 12, md: 6 },
      tabId: 'relationships',
      options:
        applicationData?.applications?.map((app: { id: string; name: string }) => ({
          value: app.id,
          label: app.name,
        })) || [],
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
      onChipClick: createChipClickHandler('sourceApplications'),
    },
    {
      name: 'targetApplications',
      label: t('targetApplications'),
      type: 'autocomplete',
      size: { xs: 12, md: 6 },
      tabId: 'relationships',
      options:
        applicationData?.applications?.map((app: { id: string; name: string }) => ({
          value: app.id,
          label: app.name,
        })) || [],
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
      onChipClick: createChipClickHandler('targetApplications'),
    },
    {
      name: 'dataObjects',
      label: t('dataObjects'),
      type: 'autocomplete',
      size: { xs: 12 },
      tabId: 'relationships',
      options:
        dataObjectsData?.dataObjects?.map((obj: any) => ({
          value: obj.id,
          label: obj.name,
        })) || [],
      multiple: true,
      loadingOptions: dataObjectsLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingObj = dataObjectsData?.dataObjects?.find((obj: any) => obj.id === option)
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
      onChipClick: createChipClickHandler('dataObjects'),
    },
    {
      name: 'partOfArchitectures',
      label: t('partOfArchitectures'),
      type: 'autocomplete',
      size: 12,
      tabId: 'architectures',
      options:
        architectureData?.architectures?.map((arch: any) => ({
          value: arch.id,
          label: arch.name,
        })) || [],
      loadingOptions: architectureLoading,
      multiple: true,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingArch = architectureData?.architectures?.find(
            (arch: any) => arch.id === option
          )
          return matchingArch?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        if (typeof option === 'string') {
          return option === value
        }
        return option?.value === value?.value || option?.value === value
      },
      onChipClick: createChipClickHandler('partOfArchitectures'),
    },
    {
      name: 'depictedInDiagrams',
      label: t('depictedInDiagrams'),
      type: 'autocomplete',
      size: 12,
      tabId: 'architectures',
      options: (diagramsData?.diagrams || []).map((diagram: any) => ({
        value: diagram.id,
        label: diagram.title,
      })),
      loadingOptions: diagramsLoading,
      multiple: true,
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
        if (typeof option === 'string') {
          return option === value
        }
        return option?.value === value?.value || option?.value === value
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
        isLoading={
          loading ||
          personLoading ||
          applicationLoading ||
          architectureLoading ||
          diagramsLoading ||
          applicationInterfacesLoading ||
          dataObjectsLoading
        }
        mode={mode}
        isNested={isNested}
        fields={fields}
        tabs={APPLICATION_INTERFACE_TABS}
        form={form}
        enableDelete={mode === 'edit' && !!applicationInterface && isArchitect()}
        onDelete={applicationInterface?.id ? () => onDelete?.(applicationInterface.id) : undefined}
        onEditMode={onEditMode}
        entityId={applicationInterface?.id}
        entityName={t('entityName' as any)}
        metadata={
          applicationInterface
            ? {
                createdAt: applicationInterface.createdAt,
                updatedAt: applicationInterface.updatedAt,
              }
            : undefined
        }
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

      {/* Nested Application Interface Form (for predecessors/successors) */}
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
    </>
  )
}

export default ApplicationInterfaceForm
