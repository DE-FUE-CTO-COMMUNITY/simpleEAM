'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { CompanyType, CompanyFormValues } from './types'
import { CompanySize } from '../../gql/generated'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung (Export für externe Verwendung)
export const companySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000).optional(),
  address: z.string().max(500).optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  size: z.nativeEnum(CompanySize).optional(),
})

const CompaniesForm: React.FC<GenericFormProps<CompanyType, CompanyFormValues>> = ({
  data: company,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('companies')
  const tForms = useTranslations('forms')
  const tCommon = useTranslations('common')

  // Formulardaten mit useMemo initialisieren
  const defaultValues = React.useMemo<CompanyFormValues>(
    () => ({
      name: '',
      description: '',
      address: '',
      industry: '',
      website: '',
      size: undefined,
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log('📝 CompanyForm TanStack onSubmit called with:', {
        value,
        mode,
        hasCompany: !!company,
      })
      console.log('📝 onSubmit prop available:', typeof onSubmit, !!onSubmit)
      if (onSubmit) {
        console.log('🔄 Calling onSubmit prop from TanStack Form...')
        try {
          const result = await onSubmit(value)
          console.log('✅ onSubmit prop completed successfully:', result)
          return result
        } catch (error) {
          console.error('💥 onSubmit prop threw error:', error)
          throw error
        }
      } else {
        console.log('❌ No onSubmit prop provided!')
      }
    },
  })

  // Formulardaten aktualisieren, wenn sich die Entity ändert
  useEffect(() => {
    if (company) {
      form.setFieldValue('name', company.name || '')
      form.setFieldValue('description', company.description || '')
      form.setFieldValue('address', company.address || '')
      form.setFieldValue('industry', company.industry || '')
      form.setFieldValue('website', company.website || '')
      form.setFieldValue('size', company.size || undefined)
    }
  }, [company, form])

  // Feldkonfigurationen definieren
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('form.name'),
      type: 'text',
      required: true,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (!value || value.length < 3) {
            return tForms('validation.minLength', { count: 3 })
          }
          if (value.length > 100) {
            return tForms('validation.maxLength', { count: 100 })
          }
          return undefined
        },
      },
    },
    {
      name: 'description',
      label: t('form.description'),
      type: 'textarea',
      required: true,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (!value || value.length < 10) {
            return tForms('validation.minLength', { count: 10 })
          }
          if (value.length > 1000) {
            return tForms('validation.maxLength', { count: 1000 })
          }
          return undefined
        },
      },
    },
    {
      name: 'address',
      label: t('form.address'),
      type: 'textarea',
      required: false,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value.length > 500) {
            return tForms('validation.maxLength', { count: 500 })
          }
          return undefined
        },
      },
    },
    {
      name: 'industry',
      label: t('form.industry'),
      type: 'text',
      required: false,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value.length > 100) {
            return tForms('validation.maxLength', { count: 100 })
          }
          return undefined
        },
      },
    },
    {
      name: 'website',
      label: t('form.website'),
      type: 'text',
      required: false,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value !== '') {
            try {
              new URL(value.startsWith('http') ? value : `https://${value}`)
            } catch {
              return tForms('validation.url')
            }
          }
          return undefined
        },
      },
    },
    {
      name: 'size',
      label: t('form.size'),
      type: 'select',
      required: false,
      options: Object.values(CompanySize).map(size => ({
        value: size,
        label: size.charAt(0) + size.slice(1).toLowerCase(),
      })),
    },
  ]

  // Tab-Konfigurationen (falls mehrere Tabs benötigt werden)
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    // TODO: Weitere Tabs hinzufügen falls benötigt
    // { id: 'relationships', label: t('tabs.relationships') },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => {
        console.log(
          '⚠️ GenericForm onSubmit called - this should not happen because TanStack Form handles it'
        )
      }}
      enableDelete={mode === 'edit' && !!company && isArchitect()}
      onDelete={company?.id && onDelete ? () => onDelete(company.id) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      entityId={company?.id}
      entityName="Unternehmen"
      title={
        mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
      }
      fields={fields}
      tabs={tabs.length > 1 ? tabs : undefined}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={t('deleteConfirmation')}
    />
  )
}

export default CompaniesForm
