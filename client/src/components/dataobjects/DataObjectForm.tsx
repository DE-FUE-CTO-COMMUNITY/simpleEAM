'use client'

import React, { useEffect, useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { DataObject, DataClassification } from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
export const dataObjectSchema = z.object({
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
  classification: z.nativeEnum(DataClassification),
  format: z.string().max(50, 'Das Format darf maximal 50 Zeichen lang sein').optional().nullable(),
  dataSources: z.array(z.string()).optional(),
  introductionDate: z.string().optional().nullable(),
  endOfLifeDate: z.string().optional().nullable(),
  ownerId: z.string().optional(),
})

// TypeScript Typen basierend auf dem Schema
export type DataObjectFormValues = z.infer<typeof dataObjectSchema>

export interface DataObjectFormProps {
  dataObject?: DataObject | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DataObjectFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const getClassificationLabel = (classification: DataClassification): string => {
  switch (classification) {
    case DataClassification.PUBLIC:
      return 'Öffentlich'
    case DataClassification.INTERNAL:
      return 'Intern'
    case DataClassification.CONFIDENTIAL:
      return 'Vertraulich'
    case DataClassification.STRICTLY_CONFIDENTIAL:
      return 'Streng vertraulich'
    default:
      return classification
  }
}

const DataObjectForm: React.FC<DataObjectFormProps> = ({
  dataObject,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS)
  // Anwendungen laden
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS)

  // Formulardaten initialisieren
  const defaultValues: DataObjectFormValues = {
    name: dataObject?.name ?? '',
    description: dataObject?.description ?? null,
    classification: dataObject?.classification ?? DataClassification.INTERNAL,
    format: dataObject?.format ?? null,
    dataSources: dataObject?.dataSources?.map(app => app.id) ?? [],
    introductionDate: dataObject?.introductionDate ?? null,
    endOfLifeDate: dataObject?.endOfLifeDate ?? null,
    ownerId:
      dataObject?.owners && dataObject.owners.length > 0 ? dataObject.owners[0].id : undefined,
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primäre Validierung bei Änderungen
      onChange: dataObjectSchema,
      // Validierung beim Absenden
      onSubmit: dataObjectSchema,
    },
  })

  // Zurücksetzen des Formulars bei Schließen des Dialogs und Aktualisieren bei neuem DataObject
  const dataObjectName = dataObject?.name
  const dataObjectDescription = dataObject?.description
  const dataObjectClassification = dataObject?.classification
  const dataObjectFormat = dataObject?.format
  const dataObjectDataSources = dataObject?.dataSources?.map(app => app.id)
  const dataObjectIntroductionDate = dataObject?.introductionDate
  const dataObjectEndOfLifeDate = dataObject?.endOfLifeDate
  const dataObjectOwnerId =
    dataObject?.owners && dataObject.owners.length > 0 ? dataObject.owners[0]?.id : undefined

  // Ref um zu verfolgen, ob das Formular bereits initialisiert wurde
  const formInitialized = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      form.reset()
      formInitialized.current = false
    } else if (dataObject && !formInitialized.current) {
      // Nur beim ersten Öffnen des Formulars zurücksetzen
      form.reset({
        name: dataObjectName ?? '',
        description: dataObjectDescription ?? null,
        classification: dataObjectClassification ?? DataClassification.INTERNAL,
        format: dataObjectFormat ?? null,
        dataSources: dataObjectDataSources ?? [],
        introductionDate: dataObjectIntroductionDate ?? null,
        endOfLifeDate: dataObjectEndOfLifeDate ?? null,
        ownerId: dataObjectOwnerId ?? '',
      })
      formInitialized.current = true
    }
  }, [
    isOpen,
    form,
    dataObject,
    dataObjectName,
    dataObjectDescription,
    dataObjectClassification,
    dataObjectFormat,
    dataObjectDataSources,
    dataObjectIntroductionDate,
    dataObjectEndOfLifeDate,
    dataObjectOwnerId,
  ])

  // Feldkonfiguration für das generische Formular
  interface SelectOption {
    value: string | number
    label: string
  }

  interface FieldConfigWithSelect extends FieldConfig {
    options?: SelectOption[]
    loadingOptions?: boolean
    rows?: number
    size?: { xs: number; md: number } | number
  }

  const fields: FieldConfigWithSelect[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validators: dataObjectSchema.shape.name,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'classification',
      label: 'Klassifizierung',
      type: 'select',
      required: true,
      validators: dataObjectSchema.shape.classification,
      options: Object.values(DataClassification).map(
        (classification): SelectOption => ({
          value: classification,
          label: getClassificationLabel(classification),
        })
      ),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      validators: dataObjectSchema.shape.description,
      rows: 4,
      size: 12,
    },
    {
      name: 'format',
      label: 'Format',
      type: 'text',
      validators: dataObjectSchema.shape.format,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'dataSources',
      label: 'Datenquellen',
      type: 'autocomplete',
      validators: dataObjectSchema.shape.dataSources,
      size: { xs: 12, md: 6 },
      options:
        applicationData?.applications?.map(
          (app: { id: string; name: string }): SelectOption => ({
            value: app.id,
            label: app.name,
          })
        ) || [],
      multiple: true,
      loadingOptions: applicationLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = applicationData?.applications?.find(
            (app: { id: string; name: string }) => app.id === option
          )
          return matchingApp?.name || option
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
    {
      name: 'introductionDate',
      label: 'Einführungsdatum',
      type: 'date',
      validators: dataObjectSchema.shape.introductionDate,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'endOfLifeDate',
      label: 'End-of-Life Datum',
      type: 'date',
      validators: dataObjectSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'ownerId',
      label: 'Verantwortlicher',
      type: 'select',
      options: [
        { value: '', label: 'Keine' },
        ...(personData?.people?.map(
          (person: { id: string; firstName: string; lastName: string }): SelectOption => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ) || []),
      ],
      size: { xs: 12, md: 6 },
      loadingOptions: personLoading,
    },
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? 'Neues Datenobjekt erstellen'
          : mode === 'edit'
            ? 'Datenobjekt bearbeiten'
            : 'Datenobjekt Details'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      enableDelete={mode === 'edit' && !!dataObject && isArchitect()}
      onDelete={dataObject?.id ? () => onDelete?.(dataObject.id) : undefined}
      onEditMode={onEditMode}
      entityId={dataObject?.id}
      entityName="Datenobjekt"
      metadata={
        dataObject
          ? {
              createdAt: dataObject.createdAt,
              updatedAt: dataObject.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default DataObjectForm
