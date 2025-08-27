'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { CompanyType } from './types'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

// Schema für die Formularvalidierung
export const companySchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  // TODO: Weitere entity-spezifische Felder hinzufügen
})

// TypeScript Typen basierend auf dem Schema
export type CompanyFormValues = z.infer<typeof companySchema>

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
  const tCommon = useTranslations('common')

  // Formulardaten mit useMemo initialisieren
  const defaultValues = React.useMemo<CompanyFormValues>(
    () => ({
      name: '',
      description: '',
      // TODO: Weitere Standardwerte hinzufügen
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        // Bereinige alle Werte vor der Übermittlung
        const submissionData = {
          ...value,
          name: value.name || '',
          description: value.description || '',
        }
        await onSubmit(submissionData)
      }
    },
  })

  // Formulardaten aktualisieren, wenn sich die Entity ändert
  useEffect(() => {
    if (company) {
      form.setFieldValue('name', company.name || '')
      form.setFieldValue('description', company.description || '')
      // TODO: Weitere Felder setzen
    }
  }, [company, form])

  // Feldkonfigurationen definieren
  const fieldConfigs: FieldConfig[] = [
    {
      name: 'name',
      label: t('form.name'),
      type: 'text',
      required: true,
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (!value || value.length < 3) {
            return t('form.validation.nameMinLength', { min: 3 })
          }
          if (value.length > 100) {
            return t('form.validation.nameMaxLength', { max: 100 })
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
            return t('form.validation.descriptionMinLength', { min: 10 })
          }
          if (value.length > 1000) {
            return t('form.validation.descriptionMaxLength', { max: 1000 })
          }
          return undefined
        },
      },
    },
    // TODO: Weitere Feldkonfigurationen hinzufügen
  ]

  // Tab-Konfigurationen (falls mehrere Tabs benötigt werden)
  const tabConfigs: TabConfig[] = [
    { id: 'general', label: t('form.tabs.general') },
    // TODO: Weitere Tabs hinzufügen falls benötigt
    // { id: 'relationships', label: t('form.tabs.relationships') },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onDelete={company?.id && onDelete ? () => onDelete(company.id) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      title={
        mode === 'create'
          ? t('form.createTitle')
          : mode === 'edit'
            ? t('form.editTitle')
            : t('form.viewTitle')
      }
      fieldConfigs={fieldConfigs}
      tabConfigs={tabConfigs.length > 1 ? tabConfigs : undefined}
      saveLabel={tCommon('save')}
      cancelLabel={tCommon('cancel')}
      editLabel={tCommon('edit')}
      deleteLabel={tCommon('delete')}
      deleteConfirmMessage={t('form.deleteConfirmation')}
    />
  )
}

export default CompaniesForm
