'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { ApplicationInterface, InterfaceType, DataObject } from '../../gql/generated'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { getInterfaceTypeLabel } from '../../types/applicationInterface'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
export const applicationInterfaceSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional()
    .nullable(),
  interfaceType: z.nativeEnum(InterfaceType),
  dataObjectIds: z.array(z.string()).optional(),
})

// TypeScript-Typ basierend auf dem Schema
export type ApplicationInterfaceFormValues = z.infer<typeof applicationInterfaceSchema>

export interface ApplicationInterfaceFormProps {
  applicationInterface?: ApplicationInterface | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ApplicationInterfaceFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const ApplicationInterfaceForm: React.FC<ApplicationInterfaceFormProps> = ({
  applicationInterface,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  // Sicherheitsmaßnahme: Stelle sicher, dass wir immer ein gültiges Objekt haben
  const ensuredAppInterface = React.useMemo(() => {
    if (!applicationInterface && (mode === 'view' || mode === 'edit')) {
      return null
    }
    return applicationInterface
  }, [applicationInterface, mode])

  // Datenobjekte laden
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS)

  // Formulardaten initialisieren - leere Standardwerte für neues Formular
  const defaultValues: ApplicationInterfaceFormValues = {
    name: '',
    description: '',
    interfaceType: InterfaceType.API,
    dataObjectIds: [],
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Formatierung der Daten vor dem Absenden
      const formattedValues: ApplicationInterfaceFormValues = {
        name: value.name,
        description: value.description,
        interfaceType: value.interfaceType,
        dataObjectIds: value.dataObjectIds || [],
      }

      await onSubmit(formattedValues)
    },
    validators: {
      // Formularvalidierung mit Zod Schema
      onChange: applicationInterfaceSchema,
      onSubmit: applicationInterfaceSchema,
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
    } else if (
      (mode === 'view' || mode === 'edit') &&
      applicationInterface &&
      applicationInterface.id
    ) {
      // Im edit/view Mode mit Werten aus applicationInterface initialisieren
      const formValues = {
        name: applicationInterface.name ?? '',
        description: applicationInterface.description ?? '',
        interfaceType: applicationInterface.interfaceType ?? InterfaceType.API,
        dataObjectIds: applicationInterface.dataObjects?.map(obj => obj.id) ?? [],
      }

      // Formular mit den Werten aus dem vorhandenen Interface zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final Fallback - nur ausführen, wenn keine der vorherigen Bedingungen zutraf
    if (!hasHandledForm) {
      if (mode === 'view' || mode === 'edit') {
        // Bei Fehlern im View/Edit-Modus Dialog schließen, da keine sinnvolle Darstellung möglich ist
        if (onClose) {
          form.reset(defaultValues) // Formular trotzdem mit Standardwerten zurücksetzen
          setTimeout(onClose, 100)
          return
        }
      }

      // Fallback für alle anderen Fälle
      form.reset(defaultValues)
    }
  }, [form, applicationInterface, isOpen, defaultValues, mode, onClose])

  // Feldkonfiguration für das generische Formular
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validators: applicationInterfaceSchema.shape.name,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      validators: applicationInterfaceSchema.shape.description,
      rows: 4,
      size: 12,
    },
    {
      name: 'interfaceType',
      label: 'Schnittstellentyp',
      type: 'select',
      required: true,
      validators: applicationInterfaceSchema.shape.interfaceType,
      options: Object.values(InterfaceType).map(type => ({
        value: type,
        label: getInterfaceTypeLabel(type),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'dataObjectIds',
      label: 'Datenobjekte',
      type: 'autocomplete',
      multiple: true,
      options: (dataObjectsData?.dataObjects || []).map((obj: DataObject) => ({
        value: obj.id,
        label: obj.name,
      })),
      loadingOptions: dataObjectsLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        // Wenn die Option ein String ist (ID), suchen wir nach dem passenden Objekt
        if (typeof option === 'string') {
          const matchingObj = dataObjectsData?.dataObjects?.find(
            (obj: DataObject) => obj.id === option
          )
          // Wenn wir das Objekt gefunden haben, den Namen zurückgeben
          return matchingObj?.name || option
        }
        // Bei einem Objekt entweder das Label oder leeren String zurückgeben
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        // Verbesserte Logik für den Vergleich von Optionen
        // Falls value ein String ist (eine ID), mit option.value vergleichen
        if (typeof value === 'string') {
          return option.value === value
        }

        // Falls option und value beide definiert sind
        if (option && value) {
          // Direkter Vergleich
          if (option === value) return true

          // Vergleich der value-Eigenschaft
          if ('value' in option && 'value' in value) {
            return option.value === value.value
          }

          // Falls option ein Objekt mit value-Eigenschaft ist und value ein primitiver Wert
          if ('value' in option) {
            return option.value === value
          }
        }

        return false
      },
    },
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? 'Neue Schnittstelle erstellen'
          : mode === 'edit'
            ? 'Schnittstelle bearbeiten'
            : 'Schnittstellendetails'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={form.handleSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      enableDelete={mode === 'edit' && !!applicationInterface && isArchitect()}
      onDelete={applicationInterface?.id ? () => onDelete?.(applicationInterface.id) : undefined}
      onEditMode={onEditMode}
      entityId={applicationInterface?.id}
      entityName="Schnittstelle"
      metadata={
        applicationInterface
          ? {
              createdAt: applicationInterface.createdAt,
              updatedAt: applicationInterface.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default ApplicationInterfaceForm
