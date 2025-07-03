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
import {
  Application,
  ApplicationStatus,
  CriticalityLevel,
  Person,
  BusinessCapability,
  DataObject,
  ApplicationInterface,
  Architecture,
  TimeCategory,
  SevenRStrategy,
} from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_APPLICATION_INTERFACES } from '@/graphql/applicationInterface'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { getValidSevenRStrategies } from './timeCategoryDependencies'
import { isArchitect } from '@/lib/auth'

// Basis-Schema ohne Validierung
const baseApplicationSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  status: z.nativeEnum(ApplicationStatus),
  criticality: z.nativeEnum(CriticalityLevel),
  costs: z.number().min(0, 'Kosten müssen 0 oder höher sein').optional().nullable(),
  vendor: z
    .string()
    .max(100, 'Der Anbieter darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  version: z
    .string()
    .max(50, 'Die Version darf maximal 50 Zeichen lang sein')
    .optional()
    .nullable(),
  hostingEnvironment: z
    .string()
    .max(100, 'Die Hosting-Umgebung darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  technologyStack: z.array(z.string()).optional().nullable(),
  introductionDate: z.date().optional().nullable(),
  endOfLifeDate: z.date().optional().nullable(),
  planningDate: z.date().optional().nullable(),
  endOfUseDate: z.date().optional().nullable(),
  ownerId: z.string().optional(),
  supportsCapabilityIds: z.array(z.string()).optional(),
  usesDataObjectIds: z.array(z.string()).optional(),
  sourceOfInterfaceIds: z.array(z.string()).optional(),
  targetOfInterfaceIds: z.array(z.string()).optional(),
  partOfArchitectures: z.array(z.string()).optional(),
  depictedInDiagrams: z.array(z.string()).optional(),
  parentIds: z.array(z.string()).optional(),
  componentIds: z.array(z.string()).optional(),
  predecessorIds: z.array(z.string()).optional(),
  successorIds: z.array(z.string()).optional(),
  timeCategory: z.nativeEnum(TimeCategory).optional().nullable().or(z.literal('')),
  sevenRStrategy: z.nativeEnum(SevenRStrategy).optional().nullable().or(z.literal('')),
})

// Schema für die Formularvalidierung mit erweiterten Validierungen
export const applicationSchema = baseApplicationSchema.superRefine((data, ctx) => {
  // Lifecycle-Datums-Validierung mit individuellen Fehlermeldungen
  const dates = [
    { field: 'planningDate', date: data.planningDate, label: 'Planungsdatum' },
    { field: 'introductionDate', date: data.introductionDate, label: 'Einführungsdatum' },
    { field: 'endOfUseDate', date: data.endOfUseDate, label: 'Ende der Nutzung' },
    { field: 'endOfLifeDate', date: data.endOfLifeDate, label: 'End-of-Life-Datum' },
  ] as const

  const setDates = dates.filter(d => d.date !== null && d.date !== undefined)

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

  // Status-Lifecycle-Validierung basierend auf dem aktuellen Datum
  const status = data.status
  const now = new Date()
  const introductionDate = data.introductionDate
  const endOfUseDate = data.endOfUseDate

  switch (status) {
    case ApplicationStatus.IN_DEVELOPMENT:
      // IN_DEVELOPMENT: Einführungsdatum muss in der Zukunft liegen (oder nicht gesetzt sein)
      if (introductionDate && introductionDate <= now) {
        ctx.addIssue({
          code: 'custom',
          message: 'Bei Status "In Entwicklung" muss das Einführungsdatum in der Zukunft liegen.',
          path: ['introductionDate'],
        })
      }
      break
    case ApplicationStatus.ACTIVE:
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
    case ApplicationStatus.RETIRED:
      // RETIRED: End-of-Use-Datum muss in der Vergangenheit liegen
      if (!endOfUseDate || endOfUseDate > now) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Bei Status "Stillgelegt" muss das Ende der Nutzung in der Vergangenheit liegen.',
          path: ['endOfUseDate'],
        })
      }
      break
  }
})

// TypeScript Typen basierend auf dem Schema
export type ApplicationFormValues = z.infer<typeof applicationSchema>

export interface ApplicationFormProps {
  application?: Application | null
  availableApplications?: Application[]
  availableTechStack?: string[]
  mode: 'create' | 'edit' | 'view'
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ApplicationFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  loading?: boolean
  onEditMode?: () => void
}

const getCriticalityLabel = (criticality: CriticalityLevel): string => {
  switch (criticality) {
    case CriticalityLevel.LOW:
      return 'Niedrig'
    case CriticalityLevel.MEDIUM:
      return 'Mittel'
    case CriticalityLevel.HIGH:
      return 'Hoch'
    case CriticalityLevel.CRITICAL:
      return 'Kritisch'
    default:
      return criticality
  }
}

const getStatusLabel = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.ACTIVE:
      return 'Aktiv'
    case ApplicationStatus.IN_DEVELOPMENT:
      return 'In Entwicklung'
    case ApplicationStatus.RETIRED:
      return 'Zurückgezogen'
    default:
      return status
  }
}

const getTimeCategoryLabel = (category: TimeCategory): string => {
  switch (category) {
    case TimeCategory.TOLERATE:
      return 'Tolerate (Tolerieren)'
    case TimeCategory.INVEST:
      return 'Invest (Investieren)'
    case TimeCategory.MIGRATE:
      return 'Migrate (Migrieren)'
    case TimeCategory.ELIMINATE:
      return 'Eliminate (Eliminieren)'
    default:
      return category
  }
}

const getSevenRStrategyLabel = (strategy: SevenRStrategy): string => {
  switch (strategy) {
    case SevenRStrategy.RETIRE:
      return 'Retire (Stilllegen)'
    case SevenRStrategy.RETAIN:
      return 'Retain (Beibehalten)'
    case SevenRStrategy.REHOST:
      return 'Rehost (Lift & Shift)'
    case SevenRStrategy.REPLATFORM:
      return 'Replatform (Lift & Reshape)'
    case SevenRStrategy.REFACTOR:
      return 'Refactor (Re-architect)'
    case SevenRStrategy.REARCHITECT:
      return 'Rearchitect (Rebuild)'
    case SevenRStrategy.REPLACE:
      return 'Replace (Buy new)'
    default:
      return strategy
  }
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  availableApplications = [],
  availableTechStack = [],
  mode,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  loading = false,
  onEditMode,
}) => {
  // Daten laden
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS)
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES)
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS)
  const { data: interfacesData, loading: interfacesLoading } = useQuery(GET_APPLICATION_INTERFACES)
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES)
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS)

  // Standardwerte für das Formular
  const defaultValues: ApplicationFormValues = {
    name: application?.name ?? '',
    description: application?.description ?? '',
    status: application?.status ?? ApplicationStatus.ACTIVE,
    criticality: application?.criticality ?? CriticalityLevel.MEDIUM,
    costs: application?.costs ?? null,
    vendor: application?.vendor ?? null,
    version: application?.version ?? null,
    hostingEnvironment: application?.hostingEnvironment ?? null,
    technologyStack: application?.technologyStack ?? [],
    introductionDate: application?.introductionDate ? new Date(application.introductionDate) : null,
    endOfLifeDate: application?.endOfLifeDate ? new Date(application.endOfLifeDate) : null,
    planningDate: application?.planningDate ? new Date(application.planningDate) : null,
    endOfUseDate: application?.endOfUseDate ? new Date(application.endOfUseDate) : null,
    ownerId:
      application?.owners && application.owners.length > 0 ? application.owners[0].id : undefined,
    supportsCapabilityIds: application?.supportsCapabilities?.map(cap => cap.id) ?? [],
    usesDataObjectIds: application?.usesDataObjects?.map(obj => obj.id) ?? [],
    sourceOfInterfaceIds: application?.sourceOfInterfaces?.map(iface => iface.id) ?? [],
    targetOfInterfaceIds: application?.targetOfInterfaces?.map(iface => iface.id) ?? [],
    partOfArchitectures: application?.partOfArchitectures?.map(arch => arch.id) ?? [],
    depictedInDiagrams: application?.depictedInDiagrams?.map(diag => diag.id) ?? [],
    parentIds: application?.parents?.map(app => app.id) ?? [],
    componentIds: application?.components?.map(app => app.id) ?? [],
    predecessorIds: application?.predecessors?.map(app => app.id) ?? [],
    successorIds: application?.successors?.map(app => app.id) ?? [],
    timeCategory: application?.timeCategory ?? null,
    sevenRStrategy: application?.sevenRStrategy ?? null,
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Konvertiere leere Strings zu null für enum-Felder
      const processedValue = {
        ...value,
        timeCategory: value.timeCategory === '' ? null : value.timeCategory,
        sevenRStrategy: value.sevenRStrategy === '' ? null : value.sevenRStrategy,
      }
      await onSubmit(processedValue)
    },
    validators: {
      // Primäre Validierung bei Änderungen
      onChange: applicationSchema,
      // Validierung beim Absenden
      onSubmit: applicationSchema,
    },
  })

  // Formular aktualisieren, wenn sich die Daten ändern
  useEffect(() => {
    if (isOpen && application) {
      setCurrentTimeCategory(application.timeCategory ?? null)
      form.reset({
        name: application.name ?? '',
        description: application.description ?? '',
        status: application.status ?? ApplicationStatus.ACTIVE,
        criticality: application.criticality ?? CriticalityLevel.MEDIUM,
        costs: application.costs ?? null,
        vendor: application.vendor ?? null,
        version: application.version ?? null,
        hostingEnvironment: application.hostingEnvironment ?? null,
        technologyStack: application.technologyStack ?? [],
        introductionDate: application.introductionDate
          ? new Date(application.introductionDate)
          : null,
        endOfLifeDate: application.endOfLifeDate ? new Date(application.endOfLifeDate) : null,
        planningDate: application.planningDate ? new Date(application.planningDate) : null,
        endOfUseDate: application.endOfUseDate ? new Date(application.endOfUseDate) : null,
        ownerId:
          application.owners && application.owners.length > 0
            ? application.owners[0].id
            : undefined,
        supportsCapabilityIds: application.supportsCapabilities?.map(cap => cap.id) ?? [],
        usesDataObjectIds: application.usesDataObjects?.map(obj => obj.id) ?? [],
        sourceOfInterfaceIds: application.sourceOfInterfaces?.map(iface => iface.id) ?? [],
        targetOfInterfaceIds: application.targetOfInterfaces?.map(iface => iface.id) ?? [],
        partOfArchitectures: application.partOfArchitectures?.map(arch => arch.id) ?? [],
        timeCategory: application.timeCategory ?? null,
        sevenRStrategy: application.sevenRStrategy ?? null,
      })
    } else if (!isOpen) {
      setCurrentTimeCategory(null)
      form.reset()
    }
  }, [form, application, isOpen])

  // Dynamisches Zurücksetzen der 7R-Strategie bei TIME-Kategorie-Änderung
  const [currentTimeCategory, setCurrentTimeCategory] = React.useState<TimeCategory | null>(
    application?.timeCategory ?? null
  )

  // Verfolge Änderungen der TIME-Kategorie und setze 7R-Strategie zurück falls nötig
  const handleTimeCategoryChange = (newTimeCategory: TimeCategory | null) => {
    setCurrentTimeCategory(newTimeCategory)

    if (newTimeCategory) {
      const currentSevenRStrategy = form.getFieldValue('sevenRStrategy')
      const validStrategies = getValidSevenRStrategies(newTimeCategory)

      // Wenn die aktuelle 7R-Strategie nicht mehr gültig ist, zurücksetzen
      if (currentSevenRStrategy && !validStrategies.includes(currentSevenRStrategy)) {
        form.setFieldValue('sevenRStrategy', null)
      }
    }
  }

  // Tabs für das Formular definieren
  const tabs: TabConfig[] = [
    { id: 'general', label: 'Allgemein' },
    { id: 'technical', label: 'Technisch' },
    { id: 'lifecycle', label: 'Lebenszyklus' },
    { id: 'relationships', label: 'Beziehungen' },
    { id: 'architectures', label: 'Architekturen' },
  ]

  // Felder für das Formular definieren
  const fields: FieldConfig[] = [
    // Allgemeine Informationen (Tab: general)
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.name,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.description,
      rows: 4,
      size: 12,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.status,
      options: Object.values(ApplicationStatus).map(status => ({
        value: status,
        label: getStatusLabel(status),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'criticality',
      label: 'Kritikalität',
      type: 'select',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.criticality,
      options: Object.values(CriticalityLevel).map(level => ({
        value: level,
        label: getCriticalityLabel(level),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'costs',
      label: 'Kosten',
      type: 'number',
      tabId: 'general',
      validators: baseApplicationSchema.shape.costs,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'timeCategory',
      label: 'TIME-Kategorie',
      type: 'select',
      tabId: 'general',
      required: false,
      options: [
        { value: '', label: 'Keine Auswahl' },
        ...Object.values(TimeCategory).map(category => ({
          value: category,
          label: getTimeCategoryLabel(category),
        })),
      ],
      size: { xs: 12, md: 6 },
      onChange: (value: TimeCategory | null) => {
        handleTimeCategoryChange(value)
      },
    },
    {
      name: 'sevenRStrategy',
      label: '7R-Strategie',
      type: 'select',
      tabId: 'general',
      required: false,
      options: [
        { value: '', label: 'Keine Auswahl' },
        ...getValidSevenRStrategies(currentTimeCategory).map(strategy => ({
          value: strategy,
          label: getSevenRStrategyLabel(strategy),
        })),
      ],
      size: { xs: 12, md: 6 },
    },
    {
      name: 'ownerId',
      label: 'Verantwortlicher',
      type: 'select',
      tabId: 'general',
      options: [
        { value: '', label: 'Keine' },
        ...(personsData?.people || []).map((person: Person) => ({
          value: person.id,
          label: `${person.firstName} ${person.lastName}`,
        })),
      ],
      loadingOptions: personsLoading,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'predecessorIds',
      label: 'Vorgänger-Anwendungen',
      type: 'autocomplete',
      tabId: 'general',
      multiple: true,
      options: (availableApplications || [])
        .filter((app: Application) => app.id !== application?.id)
        .map((app: Application) => ({
          value: app.id,
          label: app.name,
        })),
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = availableApplications?.find((app: Application) => app.id === option)
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
      name: 'successorIds',
      label: 'Nachfolger-Anwendungen',
      type: 'autocomplete',
      tabId: 'general',
      multiple: true,
      options: (availableApplications || [])
        .filter((app: Application) => app.id !== application?.id)
        .map((app: Application) => ({
          value: app.id,
          label: app.name,
        })),
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = availableApplications?.find((app: Application) => app.id === option)
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

    // Technische Informationen (Tab: technical)
    {
      name: 'vendor',
      label: 'Anbieter',
      type: 'text',
      tabId: 'technical',
      validators: baseApplicationSchema.shape.vendor,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'version',
      label: 'Version',
      type: 'text',
      tabId: 'technical',
      validators: baseApplicationSchema.shape.version,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'hostingEnvironment',
      label: 'Hosting-Umgebung',
      type: 'text',
      tabId: 'technical',
      validators: baseApplicationSchema.shape.hostingEnvironment,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'technologyStack',
      label: 'Technologie-Stack',
      type: 'tags',
      tabId: 'technical',
      options: availableTechStack.map(tech => ({ value: tech, label: tech })),
      size: { xs: 12 },
    },

    // Lebenszyklus (Tab: lifecycle) - in chronologischer Reihenfolge
    {
      name: 'planningDate',
      label: 'Planungsdatum',
      icon: <PlanningIcon />,
      type: 'date',
      tabId: 'lifecycle',
      size: { xs: 12 },
    },
    {
      name: 'introductionDate',
      label: 'Einführungsdatum',
      icon: <LaunchIcon />,
      type: 'date',
      tabId: 'lifecycle',
      size: { xs: 12 },
    },
    {
      name: 'endOfUseDate',
      label: 'Ende der Nutzung',
      icon: <PauseIcon />,
      type: 'date',
      tabId: 'lifecycle',
      size: { xs: 12 },
    },
    {
      name: 'endOfLifeDate',
      label: 'End-of-Life Datum',
      icon: <DeleteIcon />,
      type: 'date',
      tabId: 'lifecycle',
      size: { xs: 12 },
    },

    // Beziehungen (Tab: relationships)
    {
      name: 'supportsCapabilityIds',
      label: 'Unterstützte Capabilities',
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (capabilitiesData?.businessCapabilities || []).map((cap: BusinessCapability) => ({
        value: cap.id,
        label: cap.name,
      })),
      loadingOptions: capabilitiesLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingCap = capabilitiesData?.businessCapabilities?.find(
            (cap: BusinessCapability) => cap.id === option
          )
          return matchingCap?.name || option
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
      name: 'usesDataObjectIds',
      label: 'Verwendete Datenobjekte',
      type: 'autocomplete',
      tabId: 'relationships',
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
    {
      name: 'sourceOfInterfaceIds',
      label: 'Ausgehende Schnittstellen (als Quelle)',
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (interfacesData?.applicationInterfaces || []).map((iface: ApplicationInterface) => ({
        value: iface.id,
        label: iface.name,
      })),
      loadingOptions: interfacesLoading,
      size: 6,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingIface = interfacesData?.applicationInterfaces?.find(
            (iface: ApplicationInterface) => iface.id === option
          )
          return matchingIface?.name || option
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
      name: 'targetOfInterfaceIds',
      label: 'Eingehende Schnittstellen (als Ziel)',
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (interfacesData?.applicationInterfaces || []).map((iface: ApplicationInterface) => ({
        value: iface.id,
        label: iface.name,
      })),
      loadingOptions: interfacesLoading,
      size: 6,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingIface = interfacesData?.applicationInterfaces?.find(
            (iface: ApplicationInterface) => iface.id === option
          )
          return matchingIface?.name || option
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
      name: 'parentIds',
      label: 'Übergeordnete Anwendungen',
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (availableApplications || [])
        .filter((app: Application) => app.id !== application?.id)
        .map((app: Application) => ({
          value: app.id,
          label: app.name,
        })),
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = availableApplications?.find((app: Application) => app.id === option)
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
      name: 'componentIds',
      label: 'Komponenten (untergeordnete Anwendungen)',
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (availableApplications || [])
        .filter((app: Application) => app.id !== application?.id)
        .map((app: Application) => ({
          value: app.id,
          label: app.name,
        })),
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = availableApplications?.find((app: Application) => app.id === option)
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

    // Architekturen (Tab: architectures)
    {
      name: 'partOfArchitectures',
      label: 'Teil von Architekturen',
      type: 'autocomplete',
      tabId: 'architectures',
      multiple: true,
      options: (architecturesData?.architectures || []).map((arch: Architecture) => ({
        value: arch.id,
        label: arch.name,
      })),
      loadingOptions: architecturesLoading,
      size: 12,
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
    // Diagramme (Tab: architectures)
    {
      name: 'depictedInDiagrams',
      label: 'Dargestellt in Diagrammen',
      type: 'autocomplete',
      tabId: 'architectures',
      multiple: true,
      options: (diagramsData?.diagrams || []).map((diagram: any) => ({
        value: diagram.id,
        label: diagram.title,
      })),
      loadingOptions: diagramsLoading,
      size: 12,
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
          ? 'Neue Anwendung erstellen'
          : mode === 'edit'
            ? 'Anwendung bearbeiten'
            : 'Anwendungsdetails'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      tabs={tabs}
      form={form}
      enableDelete={mode === 'edit' && !!application && isArchitect()}
      onDelete={application?.id ? () => onDelete?.(application.id) : undefined}
      onEditMode={onEditMode}
      entityId={application?.id}
      entityName="Anwendung"
      metadata={
        application
          ? {
              createdAt: application.createdAt,
              updatedAt: application.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default ApplicationForm
