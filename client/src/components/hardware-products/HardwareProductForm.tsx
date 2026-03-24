'use client'

import React, { useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import {
  HardwareProduct,
  HardwareVersion,
  LifecycleStatus,
  ProductFamily,
  ProductFamilyType,
  Supplier,
} from '@/gql/generated'
import { GET_SUPPLIERS } from '@/graphql/supplier'
import { GET_HARDWARE_VERSIONS } from '@/graphql/hardwareVersion'
import { GET_PRODUCT_FAMILIES } from '@/graphql/productFamily'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { isArchitect } from '@/lib/auth'
import { useFeatureFlags } from '@/lib/feature-flags'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

const createSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t('nameMin')).max(100, t('nameMax')),
    productFamilyId: z.string().optional(),
    lifecycleStatus: z.nativeEnum(LifecycleStatus).optional().nullable(),
    isActive: z.boolean().optional(),
    manufacturedByIds: z.array(z.string()).optional(),
    providedByIds: z.array(z.string()).optional(),
    maintainedByIds: z.array(z.string()).optional(),
    versionIds: z.array(z.string()).optional(),
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
  const { featureFlags } = useFeatureFlags()
  const isSupEnabled = featureFlags.SUP

  const { data: suppliersData, loading: suppliersLoading } = useQuery(GET_SUPPLIERS, {
    variables: { where: companyWhere },
    skip: !isSupEnabled,
  })

  const { data: versionsData, loading: versionsLoading } = useQuery(GET_HARDWARE_VERSIONS, {
    variables: { where: companyWhere },
  })

  const { data: familiesData, loading: familiesLoading } = useQuery(GET_PRODUCT_FAMILIES)

  const suppliers = (suppliersData?.suppliers ?? []) as Supplier[]
  const supplierOptions = useMemo(
    () => suppliers.map(s => ({ value: s.id, label: s.name })),
    [suppliers]
  )
  const versions = (versionsData?.hardwareVersions ?? []) as HardwareVersion[]
  const versionOptions = useMemo(
    () =>
      versions.map(version => ({
        value: version.id,
        label: version.name,
      })),
    [versions]
  )
  const families = (familiesData?.productFamilies ?? []) as ProductFamily[]
  const productFamilyOptions = useMemo(
    () =>
      families
        .filter(family => family.type === ProductFamilyType.HARDWARE)
        .map(family => ({
          value: family.id,
          label: family.name,
        })),
    [families]
  )

  const schema = useMemo(() => createSchema(t), [t])

  const defaultValues = useMemo<HardwareProductFormValues>(
    () => ({
      name: '',
      productFamilyId: '',
      lifecycleStatus: null,
      isActive: true,
      manufacturedByIds: [],
      providedByIds: [],
      maintainedByIds: [],
      versionIds: [],
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
        productFamilyId: data.productFamily?.[0]?.id ?? '',
        lifecycleStatus: data.lifecycleStatus ?? null,
        isActive: data.isActive ?? true,
        manufacturedByIds: data.manufacturedBy?.map(s => s.id) ?? [],
        providedByIds: data.providedBy?.map(s => s.id) ?? [],
        maintainedByIds: data.maintainedBy?.map(s => s.id) ?? [],
        versionIds: data.versions?.map(v => v.id) ?? [],
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
      name: 'productFamilyId',
      label: t('productFamily'),
      type: 'autocomplete',
      options: productFamilyOptions,
      loadingOptions: familiesLoading,
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
      tabId: 'suppliers',
    },
    {
      name: 'providedByIds',
      label: t('providedBy'),
      type: 'autocomplete',
      options: supplierOptions,
      multiple: true,
      loadingOptions: suppliersLoading,
      tabId: 'suppliers',
    },
    {
      name: 'maintainedByIds',
      label: t('maintainedBy'),
      type: 'autocomplete',
      options: supplierOptions,
      multiple: true,
      loadingOptions: suppliersLoading,
      tabId: 'suppliers',
    },
    {
      name: 'versionIds',
      label: t('versions'),
      type: 'autocomplete',
      options: versionOptions,
      multiple: true,
      loadingOptions: versionsLoading,
      tabId: 'versions',
    },
  ]

  const visibleFields = isSupEnabled
    ? fields
    : fields.filter(
        field =>
          field.name !== 'manufacturedByIds' &&
          field.name !== 'providedByIds' &&
          field.name !== 'maintainedByIds'
      )

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
      fields={visibleFields}
      tabs={[
        { id: 'general', label: tEntity('tabs.general') },
        { id: 'versions', label: tEntity('tabs.versions') },
        ...(isSupEnabled ? [{ id: 'suppliers', label: tEntity('tabs.suppliers') }] : []),
      ]}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={tEntity('deleteConfirmation')}
    />
  )
}

export default HardwareProductForm
