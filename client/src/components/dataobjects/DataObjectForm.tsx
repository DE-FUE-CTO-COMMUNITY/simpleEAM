'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import {
  Assignment as PlanningIcon,
  RocketLaunch as LaunchIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { DataObject, DataClassification, Architecture } from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'

// Basis-Schema ohne Validierung
const baseDataObjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  classification: z.nativeEnum(DataClassification),
  format: z.string().max(50, 'Das Format darf maximal 50 Zeichen lang sein').optional().nullable(),
  dataSources: z.array(z.string()).optional(),
  introductionDate: z.date().optional().nullable(),
  endOfLifeDate: z.date().optional().nullable(),
  planningDate: z.date().optional().nullable(),
  endOfUseDate: z.date().optional().nullable(),
  ownerId: z.string().optional(),
  partOfArchitectures: z.array(z.string()).optional(),
  depictedInDiagrams: z.array(z.string()).optional(),
})

// Schema für die Formularvalidierung mit erweiterten Validierungen
export const dataObjectSchema = baseDataObjectSchema.superRefine((data, ctx) => {
  // Lifecycle-Datums-Validierung mit individuellen Fehlermeldungen
  const dates = [
    { field: 'planningDate', date: data.planningDate, label: 'Planungsdatum' },
    { field: 'introductionDate', date: data.introductionDate, label: 'Einführungsdatum' },
    { field: 'endOfUseDate', date: data.endOfUseDate, label: 'Ende der Nutzung' },
    { field: 'endOfLifeDate', date: data.endOfLifeDate, label: 'End-of-Life-Datum' },
  ] as const

  const setDates = dates.filter(d => d.date && d.date instanceof Date && !isNaN(d.date.getTime()))

  // Prüfe chronologische Reihenfolge zwischen allen aufeinanderfolgenden Daten
  for (let i = 0; i < setDates.length - 1; i++) {
    const currentDate = setDates[i]
    const nextDate = setDates[i + 1]

    if (currentDate.date! >= nextDate.date!) {
      // Füge Fehlermeldung zum späteren Datum hinzu
      ctx.addIssue({
        code: 'custom',
        message: `${nextDate.label} muss nach ${currentDate.label} liegen.`,
        path: [nextDate.field],
      })
    }
  }
})

// TypeScript Typen basierend auf dem Schema
export type DataObjectFormValues = z.infer<typeof dataObjectSchema>

import { GenericFormProps } from '../common/GenericFormProps'

export interface DataObjectFormProps extends GenericFormProps<DataObject, DataObjectFormValues> {
  // Zusätzliche entity-spezifische Props können hier hinzugefügt werden
}

const DataObjectForm: React.FC<DataObjectFormProps> = ({
  data: dataObject,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('dataObjects.form')
  const tTabs = useTranslations('dataObjects.tabs')
  const tClassifications = useTranslations('dataObjects.classifications')

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()

  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS)
  // Applikationen laden
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
  })
  // Architekturen laden
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES)
  // Diagramme laden
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS, {
    fetchPolicy: 'cache-and-network',
  })

  // Formulardaten mit useMemo initialisieren, um unnötige Re-Renders zu vermeiden
  const defaultValues = React.useMemo<DataObjectFormValues>(
    () => ({
      name: dataObject?.name || '',
      description: dataObject?.description || '',
      classification: dataObject?.classification || DataClassification.INTERNAL,
      format: dataObject?.format || null,
      dataSources: dataObject?.dataSources?.map(source => source.id) || [],
      introductionDate: dataObject?.introductionDate ? new Date(dataObject.introductionDate) : null,
      endOfLifeDate: dataObject?.endOfLifeDate ? new Date(dataObject.endOfLifeDate) : null,
      planningDate: dataObject?.planningDate ? new Date(dataObject.planningDate) : null,
      endOfUseDate: dataObject?.endOfUseDate ? new Date(dataObject.endOfUseDate) : null,
      ownerId:
        dataObject?.owners && dataObject.owners.length > 0
          ? dataObject.owners[0].id
          : currentPerson?.id,
      partOfArchitectures: dataObject?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: dataObject?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [dataObject, currentPerson?.id]
  )

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
    } else if ((mode === 'view' || mode === 'edit') && dataObject && dataObject.id) {
      // Im edit/view Mode mit Werten aus dataObject initialisieren
      const formValues = {
        name: dataObject.name ?? '',
        description: dataObject.description ?? '',
        classification: dataObject.classification ?? DataClassification.INTERNAL,
        format: dataObject.format ?? null,
        dataSources: dataObject.dataSources?.map(app => app.id) ?? [],
        introductionDate: dataObject.introductionDate
          ? new Date(dataObject.introductionDate)
          : null,
        endOfLifeDate: dataObject.endOfLifeDate ? new Date(dataObject.endOfLifeDate) : null,
        planningDate: dataObject.planningDate ? new Date(dataObject.planningDate) : null,
        endOfUseDate: dataObject.endOfUseDate ? new Date(dataObject.endOfUseDate) : null,
        ownerId:
          dataObject.owners && dataObject.owners.length > 0 ? dataObject.owners[0].id : undefined,
        partOfArchitectures: dataObject.partOfArchitectures?.map(arch => arch.id) ?? [],
        depictedInDiagrams: dataObject.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
      }

      // Formular mit den Werten aus dem vorhandenen DataObject zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final Fallback - nur ausführen, wenn keine der vorherigen Bedingungen zutraf
    if (!hasHandledForm) {
      // Immer mit Standardwerten zurücksetzen, aber Dialog nicht automatisch schließen
      form.reset(defaultValues)
    }
  }, [form, dataObject, isOpen, defaultValues, mode])

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

  // Dynamische Tab-Konfiguration mit Übersetzungen
  const tabs = React.useMemo(
    () => [
      { id: 'general', label: tTabs('general') },
      { id: 'lifecycle', label: tTabs('lifecycle') },
      { id: 'relationships', label: tTabs('relationships') },
      { id: 'architectures', label: tTabs('architectures') },
    ],
    [tTabs]
  )

  const fields: FieldConfigWithSelect[] = [
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      validators: baseDataObjectSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'classification',
      label: t('classification'),
      type: 'select',
      required: true,
      validators: baseDataObjectSchema.shape.classification,
      options: Object.values(DataClassification).map(
        (classification): SelectOption => ({
          value: classification,
          label: tClassifications(classification),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      required: true,
      validators: baseDataObjectSchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'format',
      label: t('format'),
      type: 'text',
      validators: baseDataObjectSchema.shape.format,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    // Lebenszyklus (Tab: lifecycle) - in chronologischer Reihenfolge
    {
      name: 'planningDate',
      label: t('planningDate'),
      icon: <PlanningIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.planningDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'introductionDate',
      label: t('introductionDate'),
      icon: <LaunchIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.introductionDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfUseDate',
      label: t('endOfUseDate'),
      icon: <PauseIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.endOfUseDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfLifeDate',
      label: t('endOfLifeDate'),
      icon: <DeleteIcon />,
      type: 'date',
      validators: baseDataObjectSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'ownerId',
      label: t('owner'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
        ...(personData?.people?.map(
          (person: { id: string; firstName: string; lastName: string }): SelectOption => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ) || []),
      ],
      size: { xs: 12, md: 6 },
      loadingOptions: personLoading,
      tabId: 'general',
    },
    {
      name: 'dataSources',
      label: t('dataSources'),
      type: 'autocomplete',
      validators: baseDataObjectSchema.shape.dataSources,
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
      tabId: 'relationships',
    },
    {
      name: 'partOfArchitectures',
      label: t('partOfArchitectures'),
      type: 'autocomplete',
      multiple: true,
      options: (architecturesData?.architectures || []).map((arch: Architecture) => ({
        value: arch.id,
        label: arch.name,
      })),
      loadingOptions: architecturesLoading,
      size: 12,
      tabId: 'architectures',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingArch = architecturesData?.architectures?.find(
            (arch: Architecture) => arch.id === option
          )
          return matchingArch?.name || option
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
      name: 'depictedInDiagrams',
      label: t('depictedInDiagrams'),
      type: 'autocomplete',
      multiple: true,
      options: (diagramsData?.diagrams || []).map((diagram: any) => ({
        value: diagram.id,
        label: diagram.title,
      })),
      loadingOptions: diagramsLoading,
      size: 12,
      tabId: 'architectures',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingDiagram = diagramsData?.diagrams?.find(
            (diagram: any) => diagram.id === option
          )
          return matchingDiagram?.title || option
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
        mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
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
      tabs={tabs}
    />
  )
}

export default DataObjectForm
