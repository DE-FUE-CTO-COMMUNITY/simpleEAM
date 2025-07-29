'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import GenericForm, { FieldConfig } from '@/components/common/GenericForm'
import { KeycloakUser } from '@/lib/keycloak-admin'
import { KeycloakUserAlt } from '@/lib/keycloak-admin-alt'

// Verfügbare Rollen
const AVAILABLE_ROLES = ['viewer', 'architect', 'admin'] as const

// Zod Schema für Benutzervalidierung mit Rolle
const userSchema = z.object({
  username: z.string().min(3, 'Benutzername muss mindestens 3 Zeichen lang sein'),
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  role: z.enum(AVAILABLE_ROLES, { required_error: 'Rolle ist erforderlich' }),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (userData: UserFormData) => Promise<void>
  mode: 'create' | 'edit'
  user?: (KeycloakUser | KeycloakUserAlt) | null
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
      // Primäre Validierung bei Änderungen
      onChange: userSchema,
      // Validierung beim Absenden
      onSubmit: userSchema,
    },
  })

  // Formular aktualisieren, wenn sich die Daten ändern
  useEffect(() => {
    if (!open) {
      // Dialog geschlossen - Formular zurücksetzen
      form.reset()
      return
    }

    if (mode === 'create') {
      // Im CREATE-Modus mit leeren Standardwerten initialisieren
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
  }, [form, user, open, defaultValues, mode])

  // Feldkonfiguration für das generische Formular
  const fields: FieldConfig[] = [
    {
      name: 'username',
      label: 'Benutzername',
      type: 'text',
      required: true,
      disabled: mode === 'edit', // Benutzername kann nicht geändert werden
      placeholder: 'z.B. max.mustermann',
      size: { xs: 12 },
    },
    {
      name: 'email',
      label: 'E-Mail-Adresse',
      type: 'text',
      required: true,
      placeholder: 'z.B. max.mustermann@firma.de',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'firstName',
      label: 'Vorname',
      type: 'text',
      required: true,
      placeholder: 'z.B. Max',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'lastName',
      label: 'Nachname',
      type: 'text',
      required: true,
      placeholder: 'z.B. Mustermann',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      required: true,
      options: AVAILABLE_ROLES.map(role => ({
        value: role,
        label: role.charAt(0).toUpperCase() + role.slice(1), // Erste Buchstabe groß
      })),
      size: { xs: 12, md: 6 },
    },
  ]

  return (
    <GenericForm
      title={mode === 'create' ? 'Neuen Benutzer erstellen' : 'Benutzer bearbeiten'}
      isOpen={open}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      submitButtonText={mode === 'create' ? 'Erstellen' : 'Speichern'}
      cancelButtonText="Abbrechen"
    />
  )
}
