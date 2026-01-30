'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Person } from './types'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect, isAdmin } from '@/lib/auth'
import { useQuery } from '@apollo/client'
import { GET_COMPANIES } from '@/graphql/company'

// Schema for form validation
export const personSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Der Vorname muss mindestens 2 Zeichen lang sein')
    .max(100, 'Der Vorname darf maximal 100 Zeichen lang sein'),
  lastName: z
    .string()
    .min(2, 'Der Nachname muss mindestens 2 Zeichen lang sein')
    .max(100, 'Der Nachname darf maximal 100 Zeichen lang sein'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein').optional().nullable(),
  department: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  // Admin-only Feld: ausgewählte Company-IDs
  companyIds: z.array(z.string()).optional().default([]),
})

// TypeScript Typen basierend auf dem Schema
export type PersonFormValues = z.infer<typeof personSchema>

import { GenericFormProps } from '../common/GenericFormProps'

const PersonForm: React.FC<GenericFormProps<Person, PersonFormValues>> = ({
  data: person,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('persons.form')
  // Companies laden für Admin-Zuordnung
  const { data: companiesData } = useQuery(GET_COMPANIES, { skip: !isAdmin() })
  const companyOptions = (companiesData?.companies || []).map((c: any) => ({
    value: c.id,
    label: c.name,
  }))

  // Formulardaten initialisieren - leere Standardwerte für neues Formular
  const defaultValues = React.useMemo<PersonFormValues>(
    () => ({
      firstName: '',
      lastName: '',
      email: null,
      department: null,
      role: null,
      phone: null,
      companyIds: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Formatierung der Daten vor dem Absenden
      const formattedValues: PersonFormValues = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        department: value.department,
        role: value.role,
        phone: value.phone,
        companyIds: value.companyIds || [],
      }

      await onSubmit(formattedValues)
    },
    validators: {
      // Primary validation on changes
      onChange: personSchema as any,
      // Validation on submit
      onSubmit: personSchema as any,
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
    } else if ((mode === 'view' || mode === 'edit') && person && person.id) {
      // Im edit/view Mode mit Werten aus person initialisieren
      const formValues = {
        firstName: person.firstName ?? '',
        lastName: person.lastName ?? '',
        email: person.email ?? null,
        department: person.department ?? null,
        role: person.role ?? null,
        phone: person.phone ?? null,
        companyIds: (person.companies || []).map(c => c.id),
      }

      // Formular mit den Werten aus der vorhandenen Person zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final fallback - only execute if none of the previous conditions matched
    if (!hasHandledForm) {
      // Always reset with default values, aber Dialog nicht automatisch schließen
      form.reset(defaultValues)
    }
  }, [form, person, isOpen, defaultValues, mode, onClose])

  // Field configuration for the generic form
  const fields: FieldConfig[] = [
    {
      name: 'firstName',
      label: t('firstName'),
      type: 'text',
      required: true,
      validators: personSchema.shape.firstName,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'lastName',
      label: t('lastName'),
      type: 'text',
      required: true,
      validators: personSchema.shape.lastName,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      validators: personSchema.shape.email,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'phone',
      label: t('phoneNumber'),
      type: 'text',
      validators: personSchema.shape.phone,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'department',
      label: t('department'),
      type: 'text',
      validators: personSchema.shape.department,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'role',
      label: t('role'),
      type: 'text',
      validators: personSchema.shape.role,
      size: { xs: 12, md: 6 },
    },
    // Nur Admins dürfen die Company-Zuordnung bearbeiten
    ...(isAdmin()
      ? ([
          {
            name: 'companyIds',
            label: 'Companies',
            type: 'autocomplete',
            multiple: true,
            options: companyOptions,
            size: { xs: 12 },
            helperText: 'Unternehmen zuordnen',
          } as FieldConfig,
        ] as FieldConfig[])
      : []),
  ]

  return (
    <GenericForm
      title={
        mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      enableDelete={mode === 'edit' && !!person && isArchitect()}
      onDelete={person?.id ? () => onDelete?.(person.id) : undefined}
      onEditMode={onEditMode}
      entityId={person?.id}
      entityName={t('viewTitle')}
      metadata={
        person
          ? {
              createdAt: person.createdAt,
              updatedAt: person.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default PersonForm
