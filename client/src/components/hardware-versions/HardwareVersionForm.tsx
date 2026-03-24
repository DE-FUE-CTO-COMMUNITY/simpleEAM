'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { HardwareVersion, HardwareProduct } from '@/gql/generated'
import { GET_HARDWARE_PRODUCTS } from '@/graphql/hardwareProduct'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

const createSchema = (t: any) =>
  z.object({
    versionModelString: z
      .string()
      .min(1, t('versionModelStringRequired'))
      .max(100, t('versionModelStringMax')),
    normalizedVersionModel: z.string().max(100, t('normalizedVersionModelMax')).optional(),
    releaseChannel: z.string().max(100, t('releaseChannelMax')).optional(),
    supportTier: z.string().max(100, t('supportTierMax')).optional(),
    hardwareProductId: z.string().optional(),
  })

export type HardwareVersionFormValues = z.infer<ReturnType<typeof createSchema>>

const HardwareVersionForm: React.FC<
  GenericFormProps<HardwareVersion, HardwareVersionFormValues>
> = ({ data, isOpen, onClose, onSubmit, onDelete, mode, loading = false, onEditMode }) => {
  const t = useTranslations('hardwareVersions.form')
  const tEntity = useTranslations('hardwareVersions')
  const tCommon = useTranslations('common')
  const companyWhere = useCompanyWhere('company')

  const { data: productsData, loading: productsLoading } = useQuery(GET_HARDWARE_PRODUCTS, {
    variables: { where: companyWhere },
  })

  const products = (productsData?.hardwareProducts ?? []) as HardwareProduct[]
  const productOptions = useMemo(
    () => products.map(product => ({ value: product.id, label: product.name })),
    [products]
  )

  const schema = useMemo(() => createSchema(t), [t])

  const defaultValues = useMemo<HardwareVersionFormValues>(
    () => ({
      versionModelString: '',
      normalizedVersionModel: '',
      releaseChannel: '',
      supportTier: '',
      hardwareProductId: '',
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
      form.reset({
        versionModelString: data.versionModelString ?? '',
        normalizedVersionModel: data.normalizedVersionModel ?? '',
        releaseChannel: data.releaseChannel ?? '',
        supportTier: data.supportTier ?? '',
        hardwareProductId: data.hardwareProduct?.[0]?.id ?? '',
      })
    }

    if (mode === 'create') {
      form.reset(defaultValues)
    }
  }, [data, defaultValues, form, isOpen, mode])

  const fields: FieldConfig[] = [
    {
      name: 'versionModelString',
      label: t('versionModelString'),
      type: 'text',
      required: true,
    },
    {
      name: 'normalizedVersionModel',
      label: t('normalizedVersionModel'),
      type: 'text',
    },
    {
      name: 'releaseChannel',
      label: t('releaseChannel'),
      type: 'text',
    },
    {
      name: 'supportTier',
      label: t('supportTier'),
      type: 'text',
    },
    {
      name: 'hardwareProductId',
      label: t('hardwareProduct'),
      type: 'select',
      options: [{ value: '', label: t('none') }, ...productOptions],
      loadingOptions: productsLoading,
      tabId: 'relationships',
    },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
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
      ]}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={tEntity('deleteConfirmation')}
    />
  )
}

export default HardwareVersionForm
