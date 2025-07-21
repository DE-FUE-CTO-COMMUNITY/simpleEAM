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
import {
  Application,
  ApplicationStatus,
  CriticalityLevel,
  Person,
  BusinessCapability,
  DataObject,
  ApplicationInterface,
  Architecture,
  ArchitecturePrinciple,
  Infrastructure,
  TimeCategory,
  SevenRStrategy,
} from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_APPLICATION_INTERFACES } from '@/graphql/applicationInterface'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_ARCHITECTURE_PRINCIPLES } from '@/graphql/architecturePrinciple'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
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
  implementsPrincipleIds: z.array(z.string()).optional(),
  depictedInDiagrams: z.array(z.string()).optional(),
  parentIds: z.array(z.string()).optional(),
  componentIds: z.array(z.string()).optional(),
  predecessorIds: z.array(z.string()).optional(),
  successorIds: z.array(z.string()).optional(),
  hostedOnIds: z.array(z.string()).optional(),
  timeCategory: z.nativeEnum(TimeCategory).optional().nullable().or(z.literal('')),
  sevenRStrategy: z.nativeEnum(SevenRStrategy).optional().nullable().or(z.literal('')),
})

// Schema für die Formularvalidierung mit erweiterten Validierungen
export const applicationSchema = baseApplicationSchema.superRefine((data, ctx) => {
  console.log('🔍 ApplicationSchema validation started with data:', data)

  // Lifecycle-Datums-Validierung - Prüfe spezifische Paarungen, nicht sequenziell
  // Planungsdatum < Einführungsdatum
  if (data.planningDate && data.introductionDate && data.planningDate >= data.introductionDate) {
    console.warn('⚠️ Date validation failed: planningDate >= introductionDate')
    ctx.addIssue({
      code: 'custom',
      message: 'Das Einführungsdatum muss nach dem Planungsdatum liegen.',
      path: ['introductionDate'],
    })
  }

  // Einführungsdatum < Ende der Nutzung
  if (data.introductionDate && data.endOfUseDate && data.introductionDate >= data.endOfUseDate) {
    console.warn('⚠️ Date validation failed: introductionDate >= endOfUseDate')
    ctx.addIssue({
      code: 'custom',
      message: 'Das Ende der Nutzung muss nach dem Einführungsdatum liegen.',
      path: ['endOfUseDate'],
    })
  }

  // Ende der Nutzung < End-of-Life
  if (data.endOfUseDate && data.endOfLifeDate && data.endOfUseDate >= data.endOfLifeDate) {
    console.warn('⚠️ Date validation failed: endOfUseDate >= endOfLifeDate')
    ctx.addIssue({
      code: 'custom',
      message: 'Das End-of-Life-Datum muss nach dem Ende der Nutzung liegen.',
      path: ['endOfLifeDate'],
    })
  }

  // Direkte Prüfung: Einführungsdatum < End-of-Life (falls Ende der Nutzung nicht gesetzt)
  if (
    data.introductionDate &&
    data.endOfLifeDate &&
    !data.endOfUseDate &&
    data.introductionDate >= data.endOfLifeDate
  ) {
    console.warn('⚠️ Date validation failed: introductionDate >= endOfLifeDate (no endOfUseDate)')
    ctx.addIssue({
      code: 'custom',
      message: 'Das End-of-Life-Datum muss nach dem Einführungsdatum liegen.',
      path: ['endOfLifeDate'],
    })
  }

  // Status-Lifecycle-Validierung basierend auf dem aktuellen Datum
  const status = data.status
  const now = new Date()
  console.log('🔍 Status validation for:', status, 'Current time:', now)

  switch (status) {
    case ApplicationStatus.IN_DEVELOPMENT:
      // IN_DEVELOPMENT: Einführungsdatum muss in der Zukunft liegen (oder nicht gesetzt sein)
      // Nur validieren wenn ein Einführungsdatum gesetzt ist
      if (data.introductionDate && data.introductionDate <= now) {
        console.warn('⚠️ Status validation failed: IN_DEVELOPMENT with past introductionDate')
        ctx.addIssue({
          code: 'custom',
          message: 'Bei Status "In Entwicklung" muss das Einführungsdatum in der Zukunft liegen.',
          path: ['introductionDate'],
        })
        ctx.addIssue({
          code: 'custom',
          message:
            'Status "In Entwicklung" ist nicht kompatibel mit dem gesetzten Einführungsdatum.',
          path: ['status'],
        })
      }
      break
    case ApplicationStatus.ACTIVE:
      // ACTIVE: Einführungsdatum muss in der Vergangenheit liegen
      // Nur validieren wenn ein Einführungsdatum gesetzt ist
      if (data.introductionDate && data.introductionDate > now) {
        console.warn('⚠️ Status validation failed: ACTIVE with future introductionDate')
        ctx.addIssue({
          code: 'custom',
          message: 'Bei Status "Aktiv" darf das Einführungsdatum nicht in der Zukunft liegen.',
          path: ['introductionDate'],
        })
        ctx.addIssue({
          code: 'custom',
          message: 'Status "Aktiv" ist nicht kompatibel mit dem gesetzten Einführungsdatum.',
          path: ['status'],
        })
      }
      // UND End-of-Use muss in der Zukunft liegen (oder nicht gesetzt sein)
      // Nur validieren wenn ein End-of-Use-Datum gesetzt ist
      if (data.endOfUseDate && data.endOfUseDate <= now) {
        console.warn('⚠️ Status validation failed: ACTIVE with past endOfUseDate')
        ctx.addIssue({
          code: 'custom',
          message: 'Bei Status "Aktiv" muss das Ende der Nutzung in der Zukunft liegen.',
          path: ['endOfUseDate'],
        })
        ctx.addIssue({
          code: 'custom',
          message: 'Status "Aktiv" ist nicht kompatibel mit dem gesetzten Ende der Nutzung.',
          path: ['status'],
        })
      }
      break
    case ApplicationStatus.RETIRED:
      // RETIRED: End-of-Use-Datum muss in der Vergangenheit liegen
      // Nur validieren wenn ein End-of-Use-Datum gesetzt ist
      if (data.endOfUseDate && data.endOfUseDate > now) {
        console.warn('⚠️ Status validation failed: RETIRED with future endOfUseDate')
        ctx.addIssue({
          code: 'custom',
          message:
            'Bei Status "Stillgelegt" darf das Ende der Nutzung nicht in der Zukunft liegen.',
          path: ['endOfUseDate'],
        })
        ctx.addIssue({
          code: 'custom',
          message: 'Status "Stillgelegt" ist nicht kompatibel mit dem gesetzten Ende der Nutzung.',
          path: ['status'],
        })
      }
      break
  }

  console.log('✅ ApplicationSchema validation completed')
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

const getCriticalityLabel = (criticality: CriticalityLevel, t?: any): string => {
  if (!t) {
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
  return t(criticality) || criticality
}

const getStatusLabel = (status: ApplicationStatus, t?: any): string => {
  if (!t) {
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
  return t(status) || status
}

const getTimeCategoryLabel = (category: TimeCategory, t?: any): string => {
  if (!t) {
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
  return t(category) || category
}

const getSevenRStrategyLabel = (strategy: SevenRStrategy, t?: any): string => {
  if (!t) {
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
  return t(strategy) || strategy
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
  const t = useTranslations('applications.form')
  const tStatus = useTranslations('applications.statuses')
  const tCriticality = useTranslations('applications.criticalities')
  const tTimeCategory = useTranslations('applications.timeCategories')
  const tSevenR = useTranslations('applications.sevenRStrategies')
  const tTabs = useTranslations('applications.tabs')

  // Daten laden
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS)
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES)
  const { data: dataObjectsData, loading: dataObjectsLoading } = useQuery(GET_DATA_OBJECTS)
  const { data: interfacesData, loading: interfacesLoading } = useQuery(GET_APPLICATION_INTERFACES)
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES)
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS)
  const { data: principlesData, loading: principlesLoading } = useQuery(GET_ARCHITECTURE_PRINCIPLES)
  const { data: infrastructuresData, loading: infrastructuresLoading } =
    useQuery(GET_INFRASTRUCTURES)

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
    implementsPrincipleIds: application?.implementsPrinciples?.map(principle => principle.id) ?? [],
    depictedInDiagrams: application?.depictedInDiagrams?.map(diag => diag.id) ?? [],
    parentIds: application?.parents?.map(app => app.id) ?? [],
    componentIds: application?.components?.map(app => app.id) ?? [],
    predecessorIds: application?.predecessors?.map(app => app.id) ?? [],
    successorIds: application?.successors?.map(app => app.id) ?? [],
    hostedOnIds: application?.hostedOn?.map(app => app.id) ?? [],
    timeCategory: application?.timeCategory ?? null,
    sevenRStrategy: application?.sevenRStrategy ?? null,
  }

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log('🚀 ApplicationForm: onSubmit started')
      console.log('📝 Form values:', value)

      try {
        // Validierung vor der Verarbeitung
        const validationResult = applicationSchema.safeParse(value)
        console.log('✅ Schema validation result:', validationResult)

        if (!validationResult.success) {
          console.error('❌ Validation failed:', validationResult.error.errors)
          throw new Error('Validierung fehlgeschlagen')
        }

        // Konvertiere leere Strings zu null für enum-Felder
        const processedValue = {
          ...value,
          timeCategory: value.timeCategory === '' ? null : value.timeCategory,
          sevenRStrategy: value.sevenRStrategy === '' ? null : value.sevenRStrategy,
        }

        console.log('🔄 Processed values:', processedValue)
        console.log('📤 Calling onSubmit with processed values...')

        await onSubmit(processedValue)
        console.log('✅ onSubmit completed successfully')
      } catch (error) {
        console.error('💥 ApplicationForm onSubmit error:', error)
        throw error
      }
    },
    validators: {
      // Primäre Validierung bei Änderungen - verwende das vollständige Schema
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
        implementsPrincipleIds:
          application.implementsPrinciples?.map(principle => principle.id) ?? [],
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
    { id: 'general', label: tTabs('general') },
    { id: 'technical', label: tTabs('technical') },
    { id: 'lifecycle', label: tTabs('lifecycle') },
    { id: 'relationships', label: tTabs('relationships') },
    { id: 'architectures', label: tTabs('architectures') },
    { id: 'principles', label: tTabs('principles') },
  ]

  // Felder für das Formular definieren
  const fields: FieldConfig[] = [
    // Allgemeine Informationen (Tab: general)
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.name,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: t('description'),
      type: 'textarea',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.description,
      rows: 4,
      size: 12,
    },
    {
      name: 'status',
      label: t('status'),
      type: 'select',
      required: true,
      tabId: 'general',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          // Führe die vollständige Form-Validierung durch
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, status: value }

          console.log('🔍 Status field validation with values:', updatedValues)

          const validationResult = applicationSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            // Suche nach Fehlern für das Status-Feld
            const statusErrors = validationResult.error.errors
              .filter(error => error.path.includes('status'))
              .map(error => error.message)

            console.log('❌ Status validation errors:', statusErrors)
            return statusErrors.length > 0 ? statusErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      options: Object.values(ApplicationStatus).map(status => ({
        value: status,
        label: getStatusLabel(status, tStatus),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'criticality',
      label: t('criticality'),
      type: 'select',
      required: true,
      tabId: 'general',
      validators: baseApplicationSchema.shape.criticality,
      options: Object.values(CriticalityLevel).map(level => ({
        value: level,
        label: getCriticalityLabel(level, tCriticality),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'costs',
      label: t('annualCosts'),
      type: 'number',
      tabId: 'general',
      validators: baseApplicationSchema.shape.costs,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'timeCategory',
      label: t('timeCategory'),
      type: 'select',
      tabId: 'general',
      required: false,
      options: [
        { value: '', label: t('none') },
        ...Object.values(TimeCategory).map(category => ({
          value: category,
          label: getTimeCategoryLabel(category, tTimeCategory),
        })),
      ],
      size: { xs: 12, md: 6 },
      onChange: (value: TimeCategory | null) => {
        handleTimeCategoryChange(value)
      },
    },
    {
      name: 'sevenRStrategy',
      label: t('sevenRStrategy'),
      type: 'select',
      tabId: 'general',
      required: false,
      options: [
        { value: '', label: t('none') },
        ...getValidSevenRStrategies(currentTimeCategory).map(strategy => ({
          value: strategy,
          label: getSevenRStrategyLabel(strategy, tSevenR),
        })),
      ],
      size: { xs: 12, md: 6 },
    },
    {
      name: 'ownerId',
      label: t('owner'),
      type: 'select',
      tabId: 'general',
      options: [
        { value: '', label: t('none') },
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
      label: t('predecessorApplications'),
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
      label: t('successorApplications'),
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
      label: t('vendor'),
      type: 'text',
      tabId: 'technical',
      validators: baseApplicationSchema.shape.vendor,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'version',
      label: t('version'),
      type: 'text',
      tabId: 'technical',
      validators: baseApplicationSchema.shape.version,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'hostingEnvironment',
      label: t('hostingEnvironment'),
      type: 'text',
      tabId: 'technical',
      validators: baseApplicationSchema.shape.hostingEnvironment,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'technologyStack',
      label: t('technologyStack'),
      type: 'tags',
      tabId: 'technical',
      options: availableTechStack.map(tech => ({ value: tech, label: tech })),
      size: { xs: 12 },
    },

    // Lebenszyklus (Tab: lifecycle) - in chronologischer Reihenfolge
    {
      name: 'planningDate',
      label: t('planningDate'),
      icon: <PlanningIcon />,
      type: 'date',
      tabId: 'lifecycle',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, planningDate: value }

          const validationResult = applicationSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.errors
              .filter(error => error.path.includes('planningDate'))
              .map(error => error.message)
            return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      size: { xs: 12 },
    },
    {
      name: 'introductionDate',
      label: t('introductionDate'),
      icon: <LaunchIcon />,
      type: 'date',
      tabId: 'lifecycle',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, introductionDate: value }

          const validationResult = applicationSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.errors
              .filter(error => error.path.includes('introductionDate'))
              .map(error => error.message)
            return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      size: { xs: 12 },
    },
    {
      name: 'endOfUseDate',
      label: t('endOfUseDate'),
      icon: <PauseIcon />,
      type: 'date',
      tabId: 'lifecycle',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, endOfUseDate: value }

          const validationResult = applicationSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.errors
              .filter(error => error.path.includes('endOfUseDate'))
              .map(error => error.message)
            return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      size: { xs: 12 },
    },
    {
      name: 'endOfLifeDate',
      label: t('endOfLifeDate'),
      icon: <DeleteIcon />,
      type: 'date',
      tabId: 'lifecycle',
      validators: {
        onChange: ({ value, fieldApi }: { value: any; fieldApi: any }) => {
          const currentFormValues = fieldApi.form.state.values
          const updatedValues = { ...currentFormValues, endOfLifeDate: value }

          const validationResult = applicationSchema.safeParse(updatedValues)
          if (!validationResult.success) {
            const fieldErrors = validationResult.error.errors
              .filter(error => error.path.includes('endOfLifeDate'))
              .map(error => error.message)
            return fieldErrors.length > 0 ? fieldErrors.join(', ') : undefined
          }
          return undefined
        },
      },
      size: { xs: 12 },
    },

    // Beziehungen (Tab: relationships)
    {
      name: 'supportsCapabilityIds',
      label: t('businessCapabilities'),
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
      label: t('dataObjects'),
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
      label: t('sourceOfInterfaces'),
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
      label: t('targetOfInterfaces'),
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
      label: t('parentApplications'),
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
      label: t('componentApplications'),
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
      name: 'hostedOnIds',
      label: t('hostedOn'),
      type: 'autocomplete',
      tabId: 'relationships',
      multiple: true,
      options: (infrastructuresData?.infrastructures || []).map((infra: Infrastructure) => ({
        value: infra.id,
        label: infra.name,
      })),
      loadingOptions: infrastructuresLoading,
      size: { xs: 12, md: 6 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInfra = infrastructuresData?.infrastructures?.find(
            (infra: Infrastructure) => infra.id === option
          )
          return matchingInfra?.name || option
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
      label: t('partOfArchitectures'),
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
      label: t('depictedInDiagrams'),
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

    // Prinzipien (Tab: principles)
    {
      name: 'implementsPrincipleIds',
      label: t('implementedPrinciples'),
      type: 'autocomplete',
      tabId: 'principles',
      multiple: true,
      options: (principlesData?.architecturePrinciples || []).map(
        (principle: ArchitecturePrinciple) => ({
          value: principle.id,
          label: principle.name,
        })
      ),
      loadingOptions: principlesLoading,
      size: 12,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingPrinciple = principlesData?.architecturePrinciples?.find(
            (principle: ArchitecturePrinciple) => principle.id === option
          )
          return matchingPrinciple?.name || option
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
