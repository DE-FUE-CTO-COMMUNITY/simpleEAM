'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import GenericForm, { FieldConfig } from '@/components/common/GenericForm'
import { KeycloakUser } from '@/lib/keycloak-types'

// Available roles
const AVAILABLE_ROLES = ['viewer', 'architect', 'admin'] as const

type UserFormData = {
  username: string
  email: string
  firstName: string
  lastName: string
  role: (typeof AVAILABLE_ROLES)[number]
}

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (userData: UserFormData) => Promise<void>
  mode: 'create' | 'edit'
  user?: KeycloakUser | null
  loading?: boolean
}

export default function UserFormDialog({
  open,
  onClose,
  onSubmit,
  mode,
  user,
  loading = false,
}: UserFormDialogProps) {
  const t = useTranslations('admin.userManagement.form')

  // Zod Schema für Benutzervalidierung mit internationalisierten Fehlermeldungen
  // useMemo verwenden, damit das Schema nur neu erstellt wird, wenn sich Übersetzungen ändern
  const userSchema = React.useMemo(
    () =>
      z.object({
        username: z.string().min(3, t('validation.usernameMinLength')),
        email: z.string().email(t('validation.emailInvalid')),
        firstName: z.string().min(1, t('validation.firstNameRequired')),
        lastName: z.string().min(1, t('validation.lastNameRequired')),
        role: z.enum(AVAILABLE_ROLES, { required_error: t('validation.roleRequired') }),
      }),
    [t]
  )

  // Formulardaten initialisieren - leere Standardwerte für neues Formular
  const defaultValues = React.useMemo<UserFormData>(
    () => ({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'viewer', // Standardrolle
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primary validation on changes
      onChange: userSchema,
      // Validation on submit
      onSubmit: userSchema,
    },
  })

  // Update form validators when schema changes
  React.useEffect(() => {
    form.options.validators = {
      onChange: userSchema,
      onSubmit: userSchema,
    }
  }, [form, userSchema])

  // Update form when data changes
  useEffect(() => {
    if (!open) {
      // Dialog closed - reset form
      form.reset()
      return
    }

    if (mode === 'create') {
      // Initialize with empty default values in CREATE mode
      form.reset(defaultValues)
    } else if (mode === 'edit' && user) {
      // Im edit Mode mit Werten aus user initialisieren
      const formValues: UserFormData = {
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role:
          ((user.realmRoles &&
            user.realmRoles.find(role => AVAILABLE_ROLES.includes(role as any))) as any) ||
          'viewer',
      }

      // Formular mit den Werten aus dem vorhandenen Benutzer zurücksetzen
      form.reset(formValues)
    }
  }, [form, user, open, defaultValues, mode, userSchema])

  // Field configuration for the generic form
  const fields: FieldConfig[] = [
    {
      name: 'username',
      label: t('username'),
      type: 'text',
      required: true,
      disabled: mode === 'edit', // Benutzername kann nicht geändert werden
      placeholder: t('placeholders.username'),
      size: { xs: 12 },
    },
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      required: true,
      placeholder: t('placeholders.email'),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'firstName',
      label: t('firstName'),
      type: 'text',
      required: true,
      placeholder: t('placeholders.firstName'),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'lastName',
      label: t('lastName'),
      type: 'text',
      required: true,
      placeholder: t('placeholders.lastName'),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'role',
      label: t('role'),
      type: 'select',
      required: true,
      options: AVAILABLE_ROLES.map(role => ({
        value: role,
        label: t(`roleLabels.${role}` as any),
      })),
      size: { xs: 12, md: 6 },
    },
  ]

  return (
    <GenericForm
      title={mode === 'create' ? t('createTitle') : t('editTitle')}
      isOpen={open}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      submitButtonText={mode === 'create' ? t('buttons.create') : t('buttons.save')}
      cancelButtonText={t('buttons.cancel')}
    />
  )
}
