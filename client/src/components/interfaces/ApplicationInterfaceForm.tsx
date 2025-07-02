'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import {
  Assignment as PlanningIcon,
  RocketLaunch as LaunchIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import {
  ApplicationInterface,
  InterfaceType,
  InterfaceProtocol,
  InterfaceStatus,
  Application,
  Person,
} from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { DataObject } from '@/gql/generated'

// Basis-Schema für die Formularvalidierung
const baseApplicationInterfaceSchema = z.object({
  name: z
    .string()
    .min(2, 'Der Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  interfaceType: z.nativeEnum(InterfaceType, {
    errorMap: () => ({ message: 'Bitte wählen Sie einen Schnittstellentyp' }),
  }),
  protocol: z.nativeEnum(InterfaceProtocol).optional().nullable(),
  version: z
    .string()
    .max(50, 'Die Version darf maximal 50 Zeichen lang sein')
    .optional()
    .nullable(),
  status: z.nativeEnum(InterfaceStatus),
  introductionDate: z.date().optional().nullable(),
  endOfLifeDate: z.date().optional().nullable(),
  planningDate: z.date().optional().nullable(),
  endOfUseDate: z.date().optional().nullable(),
  responsiblePerson: z.string().optional().nullable(),
  sourceApplications: z.array(z.string()).optional(),
  targetApplications: z.array(z.string()).optional(),
  dataObjects: z.array(z.string()).optional(),
  partOfDiagrams: z.array(z.string()).optional(),
})

// Erweiterte Schema-Validierung mit Lifecycle-Logik
export const applicationInterfaceSchema = baseApplicationInterfaceSchema.superRefine(
  (data, ctx) => {
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

      if (currentDate.date! > nextDate.date!) {
        // Füge Fehlermeldung zum späteren Datum hinzu
        ctx.addIssue({
          code: 'custom',
          message: `${nextDate.label} muss nach ${currentDate.label} liegen.`,
          path: [nextDate.field],
        })
      }
    }

    // Status-Lifecycle-Validierung basierend auf dem aktuellen Datum
    const status = data.status
    const now = new Date()
    const introductionDate = data.introductionDate
    const endOfUseDate = data.endOfUseDate

    switch (status) {
      case InterfaceStatus.IN_DEVELOPMENT:
      case InterfaceStatus.PLANNED:
        // IN_DEVELOPMENT/PLANNED: Einführungsdatum muss in der Zukunft liegen (oder nicht gesetzt sein)
        if (introductionDate && introductionDate <= now) {
          ctx.addIssue({
            code: 'custom',
            message: `Bei Status "${status === InterfaceStatus.PLANNED ? 'Geplant' : 'In Entwicklung'}" muss das Einführungsdatum in der Zukunft liegen.`,
            path: ['introductionDate'],
          })
        }
        break
      case InterfaceStatus.ACTIVE:
        // ACTIVE: Einführungsdatum muss in der Vergangenheit liegen
        if (!introductionDate || introductionDate > now) {
          ctx.addIssue({
            code: 'custom',
            message: 'Bei Status "Aktiv" muss das Einführungsdatum in der Vergangenheit liegen.',
            path: ['introductionDate'],
          })
        }
        // UND End-of-Use muss in der Zukunft liegen (oder nicht gesetzt sein)
        if (endOfUseDate && endOfUseDate <= now) {
          ctx.addIssue({
            code: 'custom',
            message: 'Bei Status "Aktiv" muss das Ende der Nutzung in der Zukunft liegen.',
            path: ['endOfUseDate'],
          })
        }
        break
      case InterfaceStatus.DEPRECATED:
      case InterfaceStatus.OUT_OF_SERVICE:
        // DEPRECATED/OUT_OF_SERVICE: End-of-Use-Datum muss in der Vergangenheit liegen
        if (!endOfUseDate || endOfUseDate > now) {
          ctx.addIssue({
            code: 'custom',
            message: `Bei Status "${status === InterfaceStatus.DEPRECATED ? 'Veraltet' : 'Außer Betrieb'}" muss das Ende der Nutzung in der Vergangenheit liegen.`,
            path: ['endOfUseDate'],
          })
        }
        break
    }
  }
)

// TypeScript Typen basierend auf dem Schema
export type ApplicationInterfaceFormValues = z.infer<typeof applicationInterfaceSchema>

export interface ApplicationInterfaceFormProps {
  applicationInterface?: ApplicationInterface | null
  dataObjects?: DataObject[]
  applications?: Application[]
  persons?: Person[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ApplicationInterfaceFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const APPLICATION_INTERFACE_TABS = [
  { id: 'general', label: 'Allgemein' },
  { id: 'technical', label: 'Technisch' },
  { id: 'lifecycle', label: 'Lebenszyklus' },
  { id: 'relationships', label: 'Beziehungen' },
  { id: 'architectures', label: 'Architekturen' },
]

const ApplicationInterfaceForm: React.FC<ApplicationInterfaceFormProps> = ({
  applicationInterface,
  dataObjects = [],
  applications: _applications = [],
  persons: _persons = [],
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  // Daten laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS)
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS)
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS)

  // Formulardaten mit useMemo initialisieren, um unnötige Re-Renders zu vermeiden
  const defaultValues = React.useMemo<ApplicationInterfaceFormValues>(
    () => ({
      name: '',
      description: '',
      interfaceType: InterfaceType.API,
      protocol: null,
      version: null,
      status: InterfaceStatus.PLANNED,
      planningDate: null,
      introductionDate: null,
      endOfUseDate: null,
      endOfLifeDate: null,
      responsiblePerson: null,
      sourceApplications: [],
      targetApplications: [],
      dataObjects: [],
      partOfDiagrams: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Da die GenericForm jetzt automatisch die Werte aus Autocomplete-Objekten extrahiert,
      // ist keine manuelle Transformation mehr notwendig
      const formattedValues: ApplicationInterfaceFormValues = {
        name: value.name,
        description: value.description,
        interfaceType: value.interfaceType,
        protocol: value.protocol,
        version: value.version,
        status: value.status,
        planningDate: value.planningDate,
        introductionDate: value.introductionDate,
        endOfUseDate: value.endOfUseDate,
        endOfLifeDate: value.endOfLifeDate,
        responsiblePerson: value.responsiblePerson || null,
        sourceApplications: value.sourceApplications || [],
        targetApplications: value.targetApplications || [],
        dataObjects: value.dataObjects || [],
        partOfDiagrams: value.partOfDiagrams || [],
      }

      await onSubmit(formattedValues)
    },
    validators: {
      // Primäre Validierung bei Änderungen
      onChange: applicationInterfaceSchema,
      // Validierung beim Absenden
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
        interfaceType: applicationInterface.interfaceType,
        protocol: applicationInterface.protocol ?? null,
        version: applicationInterface.version ?? null,
        status: applicationInterface.status,
        planningDate: applicationInterface.planningDate
          ? new Date(applicationInterface.planningDate)
          : null,
        introductionDate: applicationInterface.introductionDate
          ? new Date(applicationInterface.introductionDate)
          : null,
        endOfUseDate: applicationInterface.endOfUseDate
          ? new Date(applicationInterface.endOfUseDate)
          : null,
        endOfLifeDate: applicationInterface.endOfLifeDate
          ? new Date(applicationInterface.endOfLifeDate)
          : null,
        responsiblePerson:
          applicationInterface.responsiblePerson &&
          applicationInterface.responsiblePerson.length > 0
            ? applicationInterface.responsiblePerson[0].id
            : null,
        sourceApplications: applicationInterface.sourceApplications?.map(app => app.id) || [],
        targetApplications: applicationInterface.targetApplications?.map(app => app.id) || [],
        dataObjects: applicationInterface.dataObjects?.map(obj => obj.id) || [],
        partOfDiagrams: [], // TODO: Das Feld existiert noch nicht im ApplicationInterface Typ
      }

      // Formular mit den Werten aus der vorhandenen Schnittstelle zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final Fallback - nur ausführen, wenn keine der vorherigen Bedingungen zutraf
    if (!hasHandledForm) {
      // Immer mit Standardwerten zurücksetzen
      form.reset(defaultValues)
    }
  }, [form, applicationInterface, isOpen, defaultValues, mode])

  // Feldkonfiguration für das generische Formular
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validators: baseApplicationInterfaceSchema.shape.name,
      size: { xs: 12 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'text',
      multiline: true,
      rows: 3,
      required: true,
      validators: baseApplicationInterfaceSchema.shape.description,
      size: { xs: 12 },
      tabId: 'general',
    },
    {
      name: 'interfaceType',
      label: 'Schnittstellentyp',
      type: 'select',
      required: true,
      validators: baseApplicationInterfaceSchema.shape.interfaceType,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
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
      name: 'protocol',
      label: 'Protokoll',
      type: 'select',
      validators: baseApplicationInterfaceSchema.shape.protocol,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
      options: [
        { value: '', label: 'Kein Protokoll' },
        ...Object.values(InterfaceProtocol).map(protocol => ({
          value: protocol,
          label: protocol,
        })),
      ],
    },
    {
      name: 'version',
      label: 'Version',
      type: 'text',
      validators: baseApplicationInterfaceSchema.shape.version,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      validators: baseApplicationInterfaceSchema.shape.status,
      size: { xs: 12, md: 6 },
      tabId: 'general',
      options: Object.values(InterfaceStatus).map(status => ({
        value: status,
        label:
          status === InterfaceStatus.ACTIVE
            ? 'Aktiv'
            : status === InterfaceStatus.IN_DEVELOPMENT
              ? 'In Entwicklung'
              : status === InterfaceStatus.OUT_OF_SERVICE
                ? 'Außer Betrieb'
                : status === InterfaceStatus.PLANNED
                  ? 'Geplant'
                  : 'Veraltet',
      })),
    },
    {
      name: 'planningDate',
      label: 'Planungsdatum',
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.planningDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <PlanningIcon />,
    },
    {
      name: 'introductionDate',
      label: 'Einführungsdatum',
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.introductionDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <LaunchIcon />,
    },
    {
      name: 'endOfUseDate',
      label: 'Ende der Nutzung',
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.endOfUseDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <PauseIcon />,
    },
    {
      name: 'endOfLifeDate',
      label: 'End-of-Life Datum',
      type: 'date',
      validators: baseApplicationInterfaceSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
      icon: <DeleteIcon />,
    },
    {
      name: 'responsiblePerson',
      label: 'Verantwortliche Person',
      type: 'autocomplete',
      size: { xs: 12 },
      tabId: 'general',
      options:
        personData?.people?.map((person: { id: string; firstName: string; lastName: string }) => ({
          value: person.id,
          label: `${person.firstName} ${person.lastName}`,
        })) || [],
      multiple: false,
      loadingOptions: personLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingPerson = personData?.people?.find(
            (person: { id: string; firstName: string; lastName: string }) => person.id === option
          )
          return matchingPerson ? `${matchingPerson.firstName} ${matchingPerson.lastName}` : option
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
      name: 'sourceApplications',
      label: 'Quellanwendungen',
      type: 'autocomplete',
      size: { xs: 12, md: 6 },
      tabId: 'relationships',
      options:
        applicationData?.applications?.map((app: { id: string; name: string }) => ({
          value: app.id,
          label: app.name,
        })) || [],
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
      name: 'targetApplications',
      label: 'Zielanwendungen',
      type: 'autocomplete',
      size: { xs: 12, md: 6 },
      tabId: 'relationships',
      options:
        applicationData?.applications?.map((app: { id: string; name: string }) => ({
          value: app.id,
          label: app.name,
        })) || [],
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
      name: 'dataObjects',
      label: 'Datenobjekte',
      type: 'autocomplete',
      size: { xs: 12 },
      tabId: 'relationships',
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
    {
      name: 'partOfDiagrams',
      label: 'Dargestellt in Diagrammen',
      type: 'autocomplete',
      size: { xs: 12, md: 6 },
      tabId: 'architectures',
      options: (diagramsData?.diagrams || []).map((diagram: any) => ({
        value: diagram.id,
        label: diagram.title,
      })),
      loadingOptions: diagramsLoading,
      multiple: true,
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
      tabs={APPLICATION_INTERFACE_TABS}
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
