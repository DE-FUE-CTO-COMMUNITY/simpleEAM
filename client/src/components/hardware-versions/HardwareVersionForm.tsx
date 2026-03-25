'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { HardwareVersion, HardwareProduct, Infrastructure, LifecycleStatus } from '@/gql/generated'
import { GET_HARDWARE_PRODUCTS } from '@/graphql/hardwareProduct'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

const createSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t('nameRequired')).max(100, t('nameMax')),
    version: z.string().max(100, t('versionMax')).optional(),
    releaseChannel: z.string().max(100, t('releaseChannelMax')).optional(),
    supportTier: z.string().max(100, t('supportTierMax')).optional(),
    hardwareProductId: z.string().optional(),
    usedByInfrastructureIds: z.array(z.string()).optional(),
    lifecycleRecordId: z.string().optional(),
    lifecycleStatus: z.nativeEnum(LifecycleStatus).optional().nullable(),
    gaDate: z.any().optional().nullable(),
    mainstreamSupportEndDate: z.any().optional().nullable(),
    extendedSupportEndDate: z.any().optional().nullable(),
    eosDate: z.any().optional().nullable(),
    eolDate: z.any().optional().nullable(),
    source: z.string().optional().nullable(),
    sourceUrl: z.string().optional().nullable(),
    sourceConfidence: z.number().optional().nullable(),
    lastValidatedAt: z.any().optional().nullable(),
  })

export type HardwareVersionFormValues = z.infer<ReturnType<typeof createSchema>>

const HardwareVersionForm: React.FC<
  GenericFormProps<HardwareVersion, HardwareVersionFormValues>
> = ({ data, isOpen, onClose, onSubmit, onDelete, mode, loading = false, onEditMode }) => {
  const t = useTranslations('hardwareVersions.form')
  const tEntity = useTranslations('hardwareVersions')
  const tCommon = useTranslations('common')
  const tLifecycle = useTranslations('hardwareProducts.lifecycleStatuses')
  const companyWhere = useCompanyWhere('company')

  const { data: productsData, loading: productsLoading } = useQuery(GET_HARDWARE_PRODUCTS, {
    variables: { where: companyWhere },
  })
  const { data: infrastructuresData, loading: infrastructuresLoading } = useQuery(
    GET_INFRASTRUCTURES,
    {
      variables: { where: companyWhere },
    }
  )

  const products = (productsData?.hardwareProducts ?? []) as HardwareProduct[]
  const productOptions = useMemo(
    () => products.map(product => ({ value: product.id, label: product.name })),
    [products]
  )

  const schema = useMemo(() => createSchema(t), [t])

  const defaultValues = useMemo<HardwareVersionFormValues>(
    () => ({
      name: '',
      version: '',
      releaseChannel: '',
      supportTier: '',
      hardwareProductId: '',
      usedByInfrastructureIds: [],
      lifecycleRecordId: '',
      lifecycleStatus: null,
      gaDate: null,
      mainstreamSupportEndDate: null,
      extendedSupportEndDate: null,
      eosDate: null,
      eolDate: null,
      source: '',
      sourceUrl: '',
      sourceConfidence: null,
      lastValidatedAt: null,
    }),
    []
  )

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset()
      return
    }

    if ((mode === 'view' || mode === 'edit') && data) {
      const lifecycleRecord = data.lifecycleRecords?.[0]

      form.reset({
        name: data.name ?? '',
        version: data.version ?? '',
        releaseChannel: data.releaseChannel ?? '',
        supportTier: data.supportTier ?? '',
        hardwareProductId: data.hardwareProduct?.[0]?.id ?? '',
        usedByInfrastructureIds:
          data.usedByInfrastructure?.map(infrastructure => infrastructure.id) ?? [],
        lifecycleRecordId: lifecycleRecord?.id ?? '',
        lifecycleStatus: lifecycleRecord?.lifecycleStatus ?? null,
        gaDate: lifecycleRecord?.gaDate ?? null,
        mainstreamSupportEndDate: lifecycleRecord?.mainstreamSupportEndDate ?? null,
        extendedSupportEndDate: lifecycleRecord?.extendedSupportEndDate ?? null,
        eosDate: lifecycleRecord?.eosDate ?? null,
        eolDate: lifecycleRecord?.eolDate ?? null,
        source: lifecycleRecord?.source ?? '',
        sourceUrl: lifecycleRecord?.sourceUrl ?? '',
        sourceConfidence: lifecycleRecord?.sourceConfidence ?? null,
        lastValidatedAt: lifecycleRecord?.lastValidatedAt ?? null,
      })
    }

    if (mode === 'create') {
      form.reset(defaultValues)
    }
  }, [data, defaultValues, form, isOpen, mode])

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
    },
    {
      name: 'version',
      label: t('version'),
      type: 'text',
    },
    {
      name: 'releaseChannel',
      label: t('releaseChannel'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
        { value: 'STABLE', label: 'Stable' },
        { value: 'LTS', label: 'LTS' },
        { value: 'RC', label: 'Release Candidate' },
        { value: 'BETA', label: 'Beta' },
        { value: 'ALPHA', label: 'Alpha' },
        { value: 'PREVIEW', label: 'Preview' },
      ],
    },
    {
      name: 'supportTier',
      label: t('supportTier'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
        { value: 'STANDARD', label: 'Standard' },
        { value: 'EXTENDED', label: 'Extended' },
        { value: 'PREMIUM', label: 'Premium' },
        { value: 'COMMUNITY', label: 'Community' },
        { value: 'DEPRECATED', label: 'Deprecated' },
        { value: 'END_OF_SUPPORT', label: 'End of Support' },
      ],
    },
    {
      name: 'hardwareProductId',
      label: t('hardwareProduct'),
      type: 'select',
      options: [{ value: '', label: t('none') }, ...productOptions],
      loadingOptions: productsLoading,
      tabId: 'relationships',
    },
    {
      name: 'usedByInfrastructureIds',
      label: t('usedByInfrastructure'),
      type: 'autocomplete',
      multiple: true,
      options: (infrastructuresData?.infrastructures || []).map(
        (infrastructure: Infrastructure) => ({
          value: infrastructure.id,
          label: infrastructure.name,
        })
      ),
      loadingOptions: infrastructuresLoading,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInfrastructure = infrastructuresData?.infrastructures?.find(
            (infrastructure: Infrastructure) => infrastructure.id === option
          )
          return matchingInfrastructure?.name || option
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
      name: 'lifecycleStatus',
      label: t('lifecycleStatus'),
      type: 'select',
      options: [
        { value: null, label: t('none') },
        { value: LifecycleStatus.SUPPORTED, label: tLifecycle('SUPPORTED') },
        { value: LifecycleStatus.APPROACHING_EOS, label: tLifecycle('APPROACHING_EOS') },
        { value: LifecycleStatus.APPROACHING_EOL, label: tLifecycle('APPROACHING_EOL') },
        { value: LifecycleStatus.EOS, label: tLifecycle('EOS') },
        { value: LifecycleStatus.EOL, label: tLifecycle('EOL') },
        { value: LifecycleStatus.UNSUPPORTED, label: tLifecycle('UNSUPPORTED') },
      ],
      tabId: 'lifecycle',
    },
    {
      name: 'gaDate',
      label: t('gaDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'mainstreamSupportEndDate',
      label: t('mainstreamSupportEndDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'extendedSupportEndDate',
      label: t('extendedSupportEndDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'eosDate',
      label: t('eosDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'eolDate',
      label: t('eolDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'source',
      label: t('source'),
      type: 'text',
      tabId: 'lifecycle',
    },
    {
      name: 'sourceUrl',
      label: t('sourceUrl'),
      type: 'text',
      tabId: 'lifecycle',
    },
    {
      name: 'sourceConfidence',
      label: t('sourceConfidence'),
      type: 'number',
      tabId: 'lifecycle',
    },
    {
      name: 'lastValidatedAt',
      label: t('lastValidatedAt'),
      type: 'datetime',
      tabId: 'lifecycle',
    },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
      enableDelete={mode === 'edit' && !!data && isArchitect()}
      onDelete={data?.id && onDelete ? () => onDelete(data.id) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      title={
        mode === 'create'
          ? tEntity('createTitle')
          : mode === 'edit'
            ? tEntity('editTitle')
            : tEntity('viewTitle')
      }
      fields={fields}
      tabs={[
        { id: 'general', label: tEntity('tabs.general') },
        { id: 'relationships', label: tEntity('tabs.relationships') },
        { id: 'lifecycle', label: tEntity('tabs.lifecycle') },
      ]}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={tEntity('deleteConfirmation')}
    />
  )
}

export default HardwareVersionForm
