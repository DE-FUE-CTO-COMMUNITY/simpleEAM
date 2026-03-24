'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { LifecycleStatus, SoftwareVersion, SoftwareProduct } from '@/gql/generated'
import { GET_SOFTWARE_PRODUCTS } from '@/graphql/softwareProduct'
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
    isLts: z.boolean().optional(),
    softwareProductId: z.string().optional(),
    lifecycleRecordId: z.string().optional(),
    lifecycleStatus: z.nativeEnum(LifecycleStatus).optional().nullable(),
    eosDate: z.any().optional().nullable(),
    eolDate: z.any().optional().nullable(),
  })

export type SoftwareVersionFormValues = z.infer<ReturnType<typeof createSchema>>

const SoftwareVersionForm: React.FC<
  GenericFormProps<SoftwareVersion, SoftwareVersionFormValues>
> = ({ data, isOpen, onClose, onSubmit, onDelete, mode, loading = false, onEditMode }) => {
  const t = useTranslations('softwareVersions.form')
  const tEntity = useTranslations('softwareVersions')
  const tCommon = useTranslations('common')
  const tLifecycle = useTranslations('softwareProducts.lifecycleStatuses')
  const companyWhere = useCompanyWhere('company')

  const { data: productsData, loading: productsLoading } = useQuery(GET_SOFTWARE_PRODUCTS, {
    variables: { where: companyWhere },
  })

  const products = (productsData?.softwareProducts ?? []) as SoftwareProduct[]
  const productOptions = useMemo(
    () => products.map(product => ({ value: product.id, label: product.name })),
    [products]
  )

  const schema = useMemo(() => createSchema(t), [t])

  const defaultValues = useMemo<SoftwareVersionFormValues>(
    () => ({
      name: '',
      version: '',
      releaseChannel: '',
      supportTier: '',
      isLts: false,
      softwareProductId: '',
      lifecycleRecordId: '',
      lifecycleStatus: null,
      eosDate: null,
      eolDate: null,
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
        isLts: data.isLts ?? false,
        softwareProductId: data.softwareProduct?.[0]?.id ?? '',
        lifecycleRecordId: lifecycleRecord?.id ?? '',
        lifecycleStatus: lifecycleRecord?.lifecycleStatus ?? null,
        eosDate: lifecycleRecord?.eosDate ?? null,
        eolDate: lifecycleRecord?.eolDate ?? null,
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
      name: 'isLts',
      label: t('isLts'),
      type: 'checkbox',
    },
    {
      name: 'softwareProductId',
      label: t('softwareProduct'),
      type: 'select',
      options: [{ value: '', label: t('none') }, ...productOptions],
      loadingOptions: productsLoading,
      tabId: 'relationships',
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

export default SoftwareVersionForm
