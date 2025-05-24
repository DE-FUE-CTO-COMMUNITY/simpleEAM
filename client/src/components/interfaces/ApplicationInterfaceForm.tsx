'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { ApplicationInterface, InterfaceType } from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { DataObject } from '@/gql/generated'

// Schema für die Formularvalidierung
export const applicationInterfaceSchema = z.object({
  name: z
    .string()
    .min(2, 'Der Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z.string().nullable().optional(),
  interfaceType: z.nativeEnum(InterfaceType, {
    errorMap: () => ({ message: 'Bitte wählen Sie einen Schnittstellentyp' }),
  }),
  dataObjects: z.array(z.string()).optional(),
})

// TypeScript Typen basierend auf dem Schema
export type ApplicationInterfaceFormValues = z.infer<typeof applicationInterfaceSchema>

export interface ApplicationInterfaceFormProps {
  applicationInterface?: ApplicationInterface | null
  dataObjects?: DataObject[]
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
  dataObjects = [],
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  // Formulardaten initialisieren - leere Standardwerte für neues Formular
  const defaultValues = React.useMemo<ApplicationInterfaceFormValues>(
    () => ({
      name: '',
      description: null,
      interfaceType: InterfaceType.API,
      dataObjects: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Formatierung der Daten vor dem Absenden
      const formattedValues: ApplicationInterfaceFormValues = {
        name: value.name,
        description: value.description,
        interfaceType: value.interfaceType,
        // Sicherstellen, dass dataObjects korrekt formatiert sind (String-Array von IDs)
        dataObjects: Array.isArray(value.dataObjects)
          ? value.dataObjects.map((obj: any) => {
              // Wenn obj ein Objekt mit value-Eigenschaft ist (aus Autocomplete)
              if (obj && typeof obj === 'object' && 'value' in obj) {
                return obj.value
              }
              // Wenn obj bereits ein String ist (ID)
              if (typeof obj === 'string') {
                return obj
              }
              // Fallback
              return obj
            })
          : [],
      }

      await onSubmit(formattedValues)
    },
    validators: {
      // Validierung bei allen Ereignissen durchführen
      onChange: applicationInterfaceSchema,
      onBlur: applicationInterfaceSchema, // Validieren beim Verlassen eines Feldes
      onSubmit: applicationInterfaceSchema, // Validieren beim Absenden
      // Initiale Validierung beim Laden des Formulars
      onMount: applicationInterfaceSchema,
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
      // Für Autocomplete müssen wir die dataObjects als String-IDs übergeben
      const dataObjectIds = applicationInterface.dataObjects?.map(obj => obj.id) || []

      const formValues = {
        name: applicationInterface.name ?? '',
        description: applicationInterface.description ?? null,
        interfaceType: applicationInterface.interfaceType,
        dataObjects: dataObjectIds,
      }

      // Formular mit den Werten aus der vorhandenen Schnittstelle zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final Fallback - nur ausführen, wenn keine der vorherigen Bedingungen zutraf
    if (!hasHandledForm) {
      // Immer mit Standardwerten zurücksetzen, aber Dialog nicht automatisch schließen
      form.reset(defaultValues)

      // Log für Debugging-Zwecke
      console.log('ApplicationInterfaceForm: Formular mit Standardwerten zurückgesetzt', {
        mode,
        applicationInterface,
      })
    }
  }, [form, applicationInterface, isOpen, defaultValues, mode])

  // Feldkonfiguration für das generische Formular
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validators: applicationInterfaceSchema.shape.name,
      size: { xs: 12 },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'text',
      multiline: true,
      rows: 3,
      validators: applicationInterfaceSchema.shape.description,
      size: { xs: 12 },
    },
    {
      name: 'interfaceType',
      label: 'Schnittstellentyp',
      type: 'select',
      required: true,
      validators: applicationInterfaceSchema.shape.interfaceType,
      size: { xs: 12, md: 6 },
      options: Object.values(InterfaceType).map(type => ({
        value: type,
        label:
          type === InterfaceType.API
            ? 'API'
            : type === InterfaceType.DATABASE
              ? 'Datenbank'
              : type === InterfaceType.FILE
                ? 'Datei'
                : type === InterfaceType.MESSAGE_QUEUE
                  ? 'Nachrichtenwarteschlange'
                  : 'Sonstige',
      })),
    },
    {
      name: 'dataObjects',
      label: 'Datenobjekte',
      type: 'autocomplete',
      size: { xs: 12 },
      options: dataObjects.map(obj => ({
        value: obj.id,
        label: obj.name,
      })),
      multiple: true,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingObj = dataObjects.find(obj => obj.id === option)
          return matchingObj?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
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
      onSubmit={onSubmit}
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
