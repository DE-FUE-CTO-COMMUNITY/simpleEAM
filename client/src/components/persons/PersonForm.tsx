'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Person } from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
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
})

// TypeScript Typen basierend auf dem Schema
export type PersonFormValues = z.infer<typeof personSchema>

export interface PersonFormProps {
  person?: Person | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PersonFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const PersonForm: React.FC<PersonFormProps> = ({
  person,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  // Formulardaten initialisieren - leere Standardwerte für neues Formular
  const defaultValues = React.useMemo<PersonFormValues>(
    () => ({
      firstName: '',
      lastName: '',
      email: null,
      department: null,
      role: null,
      phone: null,
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
      }

      await onSubmit(formattedValues)
    },
    validators: {
      // Primäre Validierung bei Änderungen
      onChange: personSchema,
      // Validierung beim Absenden
      onSubmit: personSchema,
    },
  })

  // Formular aktualisieren, wenn sich die Daten ändern
  useEffect(() => {
    // Nicht-reaktives Flag für unerwartete Zustandsbehandlung
    let hasHandledForm = false

    if (!isOpen) {
      // Dialog geschlossen - Formular zurücksetzen
      form.reset()
      return
    }

    if (mode === 'create') {
      // Im CREATE-Modus mit leeren Standardwerten initialisieren
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
      }

      // Formular mit den Werten aus der vorhandenen Person zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final Fallback - nur ausführen, wenn keine der vorherigen Bedingungen zutraf
    if (!hasHandledForm) {
      // Immer mit Standardwerten zurücksetzen, aber Dialog nicht automatisch schließen
      form.reset(defaultValues)
    }
  }, [form, person, isOpen, defaultValues, mode, onClose])

  // Feldkonfiguration für das generische Formular
  const fields: FieldConfig[] = [
    {
      name: 'firstName',
      label: 'Vorname',
      type: 'text',
      required: true,
      validators: personSchema.shape.firstName,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'lastName',
      label: 'Nachname',
      type: 'text',
      required: true,
      validators: personSchema.shape.lastName,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'email',
      label: 'E-Mail',
      type: 'text',
      validators: personSchema.shape.email,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'phone',
      label: 'Telefonnummer',
      type: 'text',
      validators: personSchema.shape.phone,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'department',
      label: 'Abteilung',
      type: 'text',
      validators: personSchema.shape.department,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'role',
      label: 'Rolle',
      type: 'text',
      validators: personSchema.shape.role,
      size: { xs: 12, md: 6 },
    },
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? 'Neue Person erstellen'
          : mode === 'edit'
            ? 'Person bearbeiten'
            : 'Personendetails'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={form.handleSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      enableDelete={mode === 'edit' && !!person && isArchitect()}
      onDelete={person?.id ? () => onDelete?.(person.id) : undefined}
      onEditMode={onEditMode}
      entityId={person?.id}
      entityName="Person"
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
