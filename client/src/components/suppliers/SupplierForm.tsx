'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import {
  Supplier,
  SupplierType as SupplierTypeEnum,
  SupplierStatus,
  RiskClassification,
  StrategicImportance,
  Application,
  Infrastructure,
  AiComponent,
  SovereigntyMaturity,
} from '@/gql/generated'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { GET_Aicomponents } from '@/graphql/aicomponent'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import { useFeatureFlags } from '@/lib/feature-flags'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { SupplierFormValues } from './types'
import { buildSovereigntyAchievedFields } from '../common/SovereigntyFields'

// Schema factory function that accepts translations
const createBaseSupplierSchema = (t: any) =>
  z.object({
    name: z.string().min(3, t('nameMin')).max(100, t('nameMax')),
    description: z.string().min(10, t('descriptionMin')).max(1000, t('descriptionMax')),
    supplierType: z.nativeEnum(SupplierTypeEnum),
    status: z.nativeEnum(SupplierStatus),
    address: z.string().max(500, t('addressMax')).optional(),
    phone: z.string().max(50, t('phoneMax')).optional(),
    email: z.string().email(t('emailInvalid')).optional().or(z.literal('')),
    website: z.string().url(t('websiteInvalid')).optional().or(z.literal('')),
    primaryContactPerson: z.string().max(100, t('contactMax')).optional(),
    contractStartDate: z.date().optional().nullable(),
    contractEndDate: z.date().optional().nullable(),
    annualSpend: z.number().min(0, t('spendMin')).optional(),
    riskClassification: z.nativeEnum(RiskClassification).optional(),
    strategicImportance: z.nativeEnum(StrategicImportance).optional(),
    performanceRating: z.number().min(0, t('ratingMin')).max(5, t('ratingMax')).optional(),
    complianceCertifications: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    providesApplicationIds: z.array(z.string()).optional(),
    supportsApplicationIds: z.array(z.string()).optional(),
    maintainsApplicationIds: z.array(z.string()).optional(),
    providesInfrastructureIds: z.array(z.string()).optional(),
    hostsInfrastructureIds: z.array(z.string()).optional(),
    maintainsInfrastructureIds: z.array(z.string()).optional(),
    providesAIComponentIds: z.array(z.string()).optional(),
    supportsAIComponentIds: z.array(z.string()).optional(),
    maintainsAIComponentIds: z.array(z.string()).optional(),
    sovereigntyAchDataResidency: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
    sovereigntyAchJurisdictionControl: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
    sovereigntyAchOperationalControl: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
    sovereigntyAchInteroperability: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
    sovereigntyAchPortability: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
    sovereigntyAchSupplyChainTransparency: z.nativeEnum(SovereigntyMaturity).optional().nullable(),
    sovereigntyEvidence: z.string().optional(),
    lastSovereigntyAssessmentAt: z.date().optional().nullable(),
  })

// Schema factory for form validation
export const createSupplierSchema = (t: any) =>
  createBaseSupplierSchema(t).superRefine((data, ctx) => {
    // Contract date validation
    if (
      data.contractStartDate &&
      data.contractEndDate &&
      data.contractStartDate >= data.contractEndDate
    ) {
      ctx.addIssue({
        code: 'custom',
        message: t('contractEndAfterStart'),
        path: ['contractEndDate'],
      })
    }
  })

// TypeScript types based on schema
export type SupplierFormValuesType = z.infer<ReturnType<typeof createSupplierSchema>>

const SupplierForm: React.FC<GenericFormProps<Supplier, SupplierFormValues>> = ({
  data: supplier,
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
  const t = useTranslations('suppliers.form')
  const tTitle = useTranslations('suppliers')
  const tValidation = useTranslations('suppliers.validation')
  const tSupplierType = useTranslations('suppliers.supplierTypes')
  const tStatus = useTranslations('suppliers.statuses')
  const tRisk = useTranslations('suppliers.riskClassifications')
  const tImportance = useTranslations('suppliers.strategicImportances')
  const tTabs = useTranslations('suppliers.tabs')
  const tCommon = useTranslations('common')
  const { featureFlags } = useFeatureFlags()
  const isSovereigntyEnabled = featureFlags.Sovereignty

  const companyWhere = useCompanyWhere('company')

  // Load related entities
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })
  const { data: infrastructuresData, loading: infrastructuresLoading } = useQuery(
    GET_INFRASTRUCTURES,
    { variables: { where: companyWhere } }
  )
  const { data: aiComponentsData, loading: aiComponentsLoading } = useQuery(GET_Aicomponents, {
    variables: { where: companyWhere },
  })

  // Initialize chip click handlers
  const { createChipClickHandler } = useChipClickHandlers({
    onOpenNestedForm: () => {
      // Nested form handling can be added if needed
    },
  })

  // Create schema with translations
  const supplierSchema = React.useMemo(() => createSupplierSchema(tValidation), [tValidation])
  const baseSupplierSchema = React.useMemo(
    () => createBaseSupplierSchema(tValidation),
    [tValidation]
  )

  // Initialize form values
  const defaultValues = React.useMemo<SupplierFormValues>(
    () => ({
      name: '',
      description: '',
      supplierType: SupplierTypeEnum.SOFTWARE_VENDOR,
      status: SupplierStatus.POTENTIAL,
      address: undefined,
      phone: undefined,
      email: undefined,
      website: undefined,
      primaryContactPerson: undefined,
      contractStartDate: null,
      contractEndDate: null,
      annualSpend: undefined,
      riskClassification: undefined,
      strategicImportance: undefined,
      performanceRating: undefined,
      complianceCertifications: [],
      tags: [],
      providesApplicationIds: [],
      supportsApplicationIds: [],
      maintainsApplicationIds: [],
      providesInfrastructureIds: [],
      hostsInfrastructureIds: [],
      maintainsInfrastructureIds: [],
      providesAIComponentIds: [],
      supportsAIComponentIds: [],
      maintainsAIComponentIds: [],
      sovereigntyAchDataResidency: null,
      sovereigntyAchJurisdictionControl: null,
      sovereigntyAchOperationalControl: null,
      sovereigntyAchInteroperability: null,
      sovereigntyAchPortability: null,
      sovereigntyAchSupplyChainTransparency: null,
      sovereigntyEvidence: '',
      lastSovereigntyAssessmentAt: null,
    }),
    []
  )

  // Initialize Tanstack Form
  const form = useForm({
    defaultValues,
    validators: {
      onChange: supplierSchema,
      onSubmit: supplierSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  // Reset form values when dialog opens/closes or supplier data changes
  useEffect(() => {
    if (isOpen && supplier) {
      const resetValues = {
        name: supplier?.name ?? '',
        description: supplier?.description ?? '',
        supplierType: supplier?.supplierType ?? SupplierTypeEnum.SOFTWARE_VENDOR,
        status: supplier?.status ?? SupplierStatus.POTENTIAL,
        address: supplier?.address ?? undefined,
        phone: supplier?.phone ?? undefined,
        email: supplier?.email ?? undefined,
        website: supplier?.website ?? undefined,
        primaryContactPerson: supplier?.primaryContactPerson ?? undefined,
        contractStartDate: supplier?.contractStartDate
          ? new Date(supplier.contractStartDate)
          : null,
        contractEndDate: supplier?.contractEndDate ? new Date(supplier.contractEndDate) : null,
        annualSpend: supplier?.annualSpend ?? undefined,
        riskClassification: supplier?.riskClassification ?? undefined,
        strategicImportance: supplier?.strategicImportance ?? undefined,
        performanceRating: supplier?.performanceRating ?? undefined,
        complianceCertifications: supplier?.complianceCertifications ?? [],
        tags: supplier?.tags ?? [],
        providesApplicationIds: supplier?.providesApplications?.map((app: any) => app.id) ?? [],
        supportsApplicationIds: supplier?.supportsApplications?.map((app: any) => app.id) ?? [],
        maintainsApplicationIds: supplier?.maintainsApplications?.map((app: any) => app.id) ?? [],
        providesInfrastructureIds:
          supplier?.providesInfrastructure?.map((infra: any) => infra.id) ?? [],
        hostsInfrastructureIds: supplier?.hostsInfrastructure?.map((infra: any) => infra.id) ?? [],
        maintainsInfrastructureIds:
          supplier?.maintainsInfrastructure?.map((infra: any) => infra.id) ?? [],
        providesAIComponentIds:
          supplier?.providesAIComponents?.map((component: any) => component.id) ?? [],
        supportsAIComponentIds:
          supplier?.supportsAIComponents?.map((component: any) => component.id) ?? [],
        maintainsAIComponentIds:
          supplier?.maintainsAIComponents?.map((component: any) => component.id) ?? [],
        sovereigntyAchDataResidency: supplier?.sovereigntyAchDataResidency ?? null,
        sovereigntyAchJurisdictionControl: supplier?.sovereigntyAchJurisdictionControl ?? null,
        sovereigntyAchOperationalControl: supplier?.sovereigntyAchOperationalControl ?? null,
        sovereigntyAchInteroperability: supplier?.sovereigntyAchInteroperability ?? null,
        sovereigntyAchPortability: supplier?.sovereigntyAchPortability ?? null,
        sovereigntyAchSupplyChainTransparency:
          supplier?.sovereigntyAchSupplyChainTransparency ?? null,
        sovereigntyEvidence: supplier?.sovereigntyEvidence ?? '',
        lastSovereigntyAssessmentAt: supplier?.lastSovereigntyAssessmentAt
          ? new Date(supplier.lastSovereigntyAssessmentAt)
          : null,
      }
      form.reset(resetValues)
    } else if (!isOpen) {
      form.reset()
    }
  }, [form, supplier, isOpen])

  // Define tabs
  const tabs: TabConfig[] = [
    { id: 'general', label: tTabs('general') },
    { id: 'contact', label: tTabs('contact') },
    { id: 'contract', label: tTabs('contract') },
    { id: 'assessment', label: tTabs('assessment') },
    { id: 'relationships', label: tTabs('relationships') },
    ...(isSovereigntyEnabled ? [{ id: 'sovereignty', label: tCommon('sovereignty.tab') }] : []),
  ]

  // Define fields
  const fields: FieldConfig[] = [
    // General tab
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      tabId: 'general',
      validators: baseSupplierSchema.shape.name,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'supplierType',
      label: t('supplierType'),
      type: 'select',
      required: true,
      tabId: 'general',
      validators: baseSupplierSchema.shape.supplierType,
      options: Object.values(SupplierTypeEnum).map(type => ({
        value: type,
        label: tSupplierType(type),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      required: true,
      tabId: 'general',
      validators: baseSupplierSchema.shape.status,
      options: Object.values(SupplierStatus).map(status => ({
        value: status,
        label: tStatus(status),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      tabId: 'general',
      validators: baseSupplierSchema.shape.description,
      rows: 4,
      size: 12,
    },
    {
      name: 'tags',
      label: t('tags'),
      type: 'tags',
      tabId: 'general',
      size: 12,
    },

    // Contact tab
    {
      name: 'address',
      label: t('address'),
      type: 'textarea',
      tabId: 'contact',
      validators: baseSupplierSchema.shape.address,
      rows: 3,
      size: 12,
    },
    {
      name: 'phone',
      label: t('phone'),
      type: 'text',
      tabId: 'contact',
      validators: baseSupplierSchema.shape.phone,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      tabId: 'contact',
      validators: baseSupplierSchema.shape.email,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'website',
      label: t('website'),
      type: 'text',
      tabId: 'contact',
      validators: baseSupplierSchema.shape.website,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'primaryContactPerson',
      label: t('primaryContactPerson'),
      type: 'text',
      tabId: 'contact',
      validators: baseSupplierSchema.shape.primaryContactPerson,
      size: { xs: 12, md: 6 },
    },

    // Contract tab
    {
      name: 'contractStartDate',
      label: t('contractStartDate'),
      type: 'date',
      tabId: 'contract',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, contractStartDate: value }

          const validationResult = supplierSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.errors
              .filter(error => error.path.includes('contractStartDate'))
              .map(error => error.message)
            return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      size: { xs: 12, md: 6 },
    },
    {
      name: 'contractEndDate',
      label: t('contractEndDate'),
      type: 'date',
      tabId: 'contract',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, contractEndDate: value }

          const validationResult = supplierSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.errors
              .filter(error => error.path.includes('contractEndDate'))
              .map(error => error.message)
            return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      size: { xs: 12, md: 6 },
    },
    {
      name: 'annualSpend',
      label: t('annualSpend'),
      type: 'number',
      tabId: 'contract',
      validators: baseSupplierSchema.shape.annualSpend,
      size: { xs: 12, md: 6 },
    },

    // Assessment tab
    {
      name: 'riskClassification',
      label: t('riskClassification'),
      type: 'select',
      tabId: 'assessment',
      options: [
        { value: '', label: t('none') },
        ...Object.values(RiskClassification).map(risk => ({
          value: risk,
          label: tRisk(risk),
        })),
      ],
      size: { xs: 12, md: 6 },
    },
    {
      name: 'strategicImportance',
      label: t('strategicImportance'),
      type: 'select',
      tabId: 'assessment',
      options: [
        { value: '', label: t('none') },
        ...Object.values(StrategicImportance).map(importance => ({
          value: importance,
          label: tImportance(importance),
        })),
      ],
      size: { xs: 12, md: 6 },
    },
    {
      name: 'performanceRating',
      label: t('performanceRating'),
      type: 'number',
      tabId: 'assessment',
      validators: baseSupplierSchema.shape.performanceRating,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'complianceCertifications',
      label: t('complianceCertifications'),
      type: 'tags',
      tabId: 'assessment',
      size: 12,
    },

    // Relationships tab
    {
      name: 'providesApplicationIds',
      label: t('providesApplications'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (applicationsData?.applications || []).map((app: Application) => ({
        value: app.id,
        label: app.name,
      })),
      loadingOptions: applicationsLoading,
      size: { xs: 12, md: 6 },
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
      onChipClick: createChipClickHandler('providesApplicationIds'),
    },
    {
      name: 'supportsApplicationIds',
      label: t('supportsApplications'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (applicationsData?.applications || []).map((app: Application) => ({
        value: app.id,
        label: app.name,
      })),
      loadingOptions: applicationsLoading,
      size: { xs: 12, md: 6 },
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
      onChipClick: createChipClickHandler('supportsApplicationIds'),
    },
    {
      name: 'maintainsApplicationIds',
      label: t('maintainsApplications'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (applicationsData?.applications || []).map((app: Application) => ({
        value: app.id,
        label: app.name,
      })),
      loadingOptions: applicationsLoading,
      size: { xs: 12, md: 6 },
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
      onChipClick: createChipClickHandler('maintainsApplicationIds'),
    },
    {
      name: 'providesInfrastructureIds',
      label: t('providesInfrastructure'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (infrastructuresData?.infrastructures || []).map((infra: Infrastructure) => ({
        value: infra.id,
        label: infra.name,
      })),
      loadingOptions: infrastructuresLoading,
      size: { xs: 12, md: 6 },
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
      onChipClick: createChipClickHandler('providesInfrastructureIds'),
    },
    {
      name: 'hostsInfrastructureIds',
      label: t('hostsInfrastructure'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (infrastructuresData?.infrastructures || []).map((infra: Infrastructure) => ({
        value: infra.id,
        label: infra.name,
      })),
      loadingOptions: infrastructuresLoading,
      size: { xs: 12, md: 6 },
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
      onChipClick: createChipClickHandler('hostsInfrastructureIds'),
    },
    {
      name: 'maintainsInfrastructureIds',
      label: t('maintainsInfrastructure'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (infrastructuresData?.infrastructures || []).map((infra: Infrastructure) => ({
        value: infra.id,
        label: infra.name,
      })),
      loadingOptions: infrastructuresLoading,
      size: { xs: 12, md: 6 },
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
      onChipClick: createChipClickHandler('maintainsInfrastructureIds'),
    },
    {
      name: 'providesAIComponentIds',
      label: t('providesAIComponents'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (aiComponentsData?.aiComponents || []).map((component: AiComponent) => ({
        value: component.id,
        label: component.name,
      })),
      loadingOptions: aiComponentsLoading,
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingComponent = aiComponentsData?.aiComponents?.find(
            (component: AiComponent) => component.id === option
          )
          return matchingComponent?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('providesAIComponentIds'),
    },
    {
      name: 'supportsAIComponentIds',
      label: t('supportsAIComponents'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (aiComponentsData?.aiComponents || []).map((component: AiComponent) => ({
        value: component.id,
        label: component.name,
      })),
      loadingOptions: aiComponentsLoading,
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingComponent = aiComponentsData?.aiComponents?.find(
            (component: AiComponent) => component.id === option
          )
          return matchingComponent?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('supportsAIComponentIds'),
    },
    {
      name: 'maintainsAIComponentIds',
      label: t('maintainsAIComponents'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (aiComponentsData?.aiComponents || []).map((component: AiComponent) => ({
        value: component.id,
        label: component.name,
      })),
      loadingOptions: aiComponentsLoading,
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingComponent = aiComponentsData?.aiComponents?.find(
            (component: AiComponent) => component.id === option
          )
          return matchingComponent?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('maintainsAIComponentIds'),
    },
    ...(isSovereigntyEnabled
      ? buildSovereigntyAchievedFields((key: string) => tCommon(key as any))
      : []),
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? tTitle('createTitle')
          : mode === 'edit'
            ? tTitle('editTitle')
            : tTitle('viewTitle')
      }
      form={form}
      fields={fields}
      tabs={tabs}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      onDelete={onDelete ? id => onDelete(id!) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      isNested={isNested}
      entityId={supplier?.id}
      entityName="suppliers"
      enableDelete={mode === 'edit' && !!supplier}
      metadata={
        supplier
          ? {
              createdAt: supplier.createdAt,
              updatedAt: supplier.updatedAt,
            }
          : undefined
      }
      {...restProps}
    />
  )
}

export default SupplierForm
