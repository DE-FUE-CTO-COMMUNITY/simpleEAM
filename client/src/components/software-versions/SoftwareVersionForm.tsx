'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { SoftwareVersion, SoftwareProduct } from '@/gql/generated'
import { GET_SOFTWARE_PRODUCTS } from '@/graphql/softwareProduct'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

const createSchema = (t: any) =>
  z.object({
    versionString: z.string().min(1, t('versionStringRequired')).max(100, t('versionStringMax')),
    normalizedVersion: z.string().max(100, t('normalizedVersionMax')).optional(),
    releaseChannel: z.string().max(100, t('releaseChannelMax')).optional(),
    supportTier: z.string().max(100, t('supportTierMax')).optional(),
    isLts: z.boolean().optional(),
    softwareProductId: z.string().optional(),
  })

export type SoftwareVersionFormValues = z.infer<ReturnType<typeof createSchema>>

const SoftwareVersionForm: React.FC<
  GenericFormProps<SoftwareVersion, SoftwareVersionFormValues>
> = ({ data, isOpen, onClose, onSubmit, onDelete, mode, loading = false, onEditMode }) => {
  const t = useTranslations('softwareVersions.form')
  const tEntity = useTranslations('softwareVersions')
  const tCommon = useTranslations('common')
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
      versionString: '',
      normalizedVersion: '',
      releaseChannel: '',
      supportTier: '',
      isLts: false,
      softwareProductId: '',
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
        versionString: data.versionString ?? '',
        normalizedVersion: data.normalizedVersion ?? '',
        releaseChannel: data.releaseChannel ?? '',
        supportTier: data.supportTier ?? '',
        isLts: data.isLts ?? false,
        softwareProductId: data.softwareProduct?.[0]?.id ?? '',
      })
    }

    if (mode === 'create') {
      form.reset(defaultValues)
    }
  }, [data, defaultValues, form, isOpen, mode])

  const fields: FieldConfig[] = [
    {
      name: 'versionString',
      label: t('versionString'),
      type: 'text',
      required: true,
    },
    {
      name: 'normalizedVersion',
      label: t('normalizedVersion'),
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

export default SoftwareVersionForm
