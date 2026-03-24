'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { HardwareProduct, LifecycleStatus, Supplier } from '@/gql/generated'
import { GET_SUPPLIERS } from '@/graphql/supplier'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

const createSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t('nameMin')).max(100, t('nameMax')),
    productFamily: z.string().max(150, t('productFamilyMax')).optional(),
    lifecycleStatus: z.nativeEnum(LifecycleStatus).optional().nullable(),
    isActive: z.boolean().optional(),
    manufacturedByIds: z.array(z.string()).optional(),
    providedByIds: z.array(z.string()).optional(),
    maintainedByIds: z.array(z.string()).optional(),
  })

export type HardwareProductFormValues = z.infer<ReturnType<typeof createSchema>>

const HardwareProductForm: React.FC<
  GenericFormProps<HardwareProduct, HardwareProductFormValues>
> = ({ data, isOpen, onClose, onSubmit, onDelete, mode, loading = false, onEditMode }) => {
  const t = useTranslations('hardwareProducts.form')
  const tEntity = useTranslations('hardwareProducts')
  const tCommon = useTranslations('common')
  const tLifecycle = useTranslations('hardwareProducts.lifecycleStatuses')
  const companyWhere = useCompanyWhere('company')

  const { data: suppliersData, loading: suppliersLoading } = useQuery(GET_SUPPLIERS, {
    variables: { where: companyWhere },
  })

  const suppliers = (suppliersData?.suppliers ?? []) as Supplier[]
  const supplierOptions = useMemo(
    () => suppliers.map(s => ({ value: s.id, label: s.name })),
    [suppliers]
  )

  const schema = useMemo(() => createSchema(t), [t])

  const defaultValues = useMemo<HardwareProductFormValues>(
    () => ({
      name: '',
      productFamily: '',
      lifecycleStatus: null,
      isActive: true,
      manufacturedByIds: [],
      providedByIds: [],
      maintainedByIds: [],
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
        name: data.name ?? '',
        productFamily: data.productFamily ?? '',
        lifecycleStatus: data.lifecycleStatus ?? null,
        isActive: data.isActive ?? true,
        manufacturedByIds: data.manufacturedBy?.map(s => s.id) ?? [],
        providedByIds: data.providedBy?.map(s => s.id) ?? [],
        maintainedByIds: data.maintainedBy?.map(s => s.id) ?? [],
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
      name: 'productFamily',
      label: t('productFamily'),
      type: 'text',
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
    },
    {
      name: 'isActive',
      label: t('isActive'),
      type: 'checkbox',
    },
    {
      name: 'manufacturedByIds',
      label: t('manufacturedBy'),
      type: 'autocomplete',
      options: supplierOptions,
      multiple: true,
      loadingOptions: suppliersLoading,
      tabId: 'relationships',
    },
    {
      name: 'providedByIds',
      label: t('providedBy'),
      type: 'autocomplete',
      options: supplierOptions,
      multiple: true,
      loadingOptions: suppliersLoading,
      tabId: 'relationships',
    },
    {
      name: 'maintainedByIds',
      label: t('maintainedBy'),
      type: 'autocomplete',
      options: supplierOptions,
      multiple: true,
      loadingOptions: suppliersLoading,
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

export default HardwareProductForm
