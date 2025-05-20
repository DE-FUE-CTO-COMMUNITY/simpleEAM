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
  // Datenobjekte laden
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS)

  // Formulardaten initialisieren
  const defaultValues: ApplicationInterfaceFormValues = {
    name: applicationInterface?.name ?? '',
    description: applicationInterface?.description ?? '',
    interfaceType: applicationInterface?.interfaceType ?? InterfaceType.API,
    dataObjectIds: applicationInterface?.dataObjects?.map(obj => obj.id) ?? [],
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Eine Validierung der Formulardaten vor dem Absenden
      try {
        await onSubmit(value)
      } catch (error) {
        // Fehlerbehandlung erfolgt auf Page-Ebene
      }
    },
    validators: {
      // Formularvalidierung mit Zod Schema
      onChange: applicationInterfaceSchema,
      onSubmit: applicationInterfaceSchema,
    },
  })

  // Formular zurücksetzen bei Schließen oder Änderung der Daten
  useEffect(() => {
    if (isOpen && applicationInterface) {
      // Sicherstellen, dass alle Felder korrekt initialisiert werden, insbesondere für view/edit
      form.reset({
        name: applicationInterface.name,
        description: applicationInterface.description || '',
        interfaceType: applicationInterface.interfaceType,
        dataObjectIds: applicationInterface.dataObjects?.map(obj => obj.id) ?? [],
      })
    } else if (!isOpen) {
      form.reset(defaultValues)
    }
  }, [form, applicationInterface, isOpen, defaultValues])

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
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingObj = dataObjectsData?.dataObjects?.find(
            (obj: DataObject) => obj.id === option
          )
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
