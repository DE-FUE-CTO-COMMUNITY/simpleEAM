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
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { GET_APPLICATIONS } from '@/graphql/application'
import {
  Infrastructure,
  InfrastructureType,
  InfrastructureStatus,
  Architecture,
  Application,
} from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'

// Basis-Schema ohne Validierung
const baseInfrastructureSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional()
    .nullable(),
  infrastructureType: z.nativeEnum(InfrastructureType),
  status: z.nativeEnum(InfrastructureStatus),
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
  capacity: z
    .string()
    .max(100, 'Die Kapazität darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, 'Der Standort darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  ipAddress: z
    .string()
    .max(15, 'Die IP-Adresse darf maximal 15 Zeichen lang sein')
    .optional()
    .nullable(),
  operatingSystem: z
    .string()
    .max(100, 'Das Betriebssystem darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  specifications: z
    .string()
    .max(500, 'Die Spezifikationen dürfen maximal 500 Zeichen lang sein')
    .optional()
    .nullable(),
  maintenanceWindow: z
    .string()
    .max(100, 'Das Wartungsfenster darf maximal 100 Zeichen lang sein')
    .optional()
    .nullable(),
  costs: z.number().min(0, 'Kosten müssen 0 oder höher sein').optional().nullable(),
  introductionDate: z.date().optional().nullable(),
  endOfLifeDate: z.date().optional().nullable(),
  planningDate: z.date().optional().nullable(),
  endOfUseDate: z.date().optional().nullable(),
  ownerId: z.string().optional(),
  parentInfrastructure: z.array(z.string()).optional(),
  childInfrastructures: z.array(z.string()).optional(),
  hostsApplications: z.array(z.string()).optional(),
  partOfArchitectures: z.array(z.string()).optional(),
  depictedInDiagrams: z.array(z.string()).optional(),
})

// Schema für die Formularvalidierung mit erweiterten Validierungen
export const infrastructureSchema = baseInfrastructureSchema.superRefine((data, ctx) => {
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
export type InfrastructureFormValues = z.infer<typeof infrastructureSchema>

export interface InfrastructureFormProps {
  infrastructure?: Infrastructure | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InfrastructureFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const getInfrastructureTypeLabel = (type: InfrastructureType): string => {
  switch (type) {
    case InfrastructureType.CLOUD_DATACENTER:
      return 'Cloud-Rechenzentrum'
    case InfrastructureType.ON_PREMISE_DATACENTER:
      return 'On-Premise-Rechenzentrum'
    case InfrastructureType.KUBERNETES_CLUSTER:
      return 'Kubernetes-Cluster'
    case InfrastructureType.VIRTUAL_MACHINE:
      return 'Virtuelle Maschine'
    case InfrastructureType.CONTAINER_HOST:
      return 'Container-Host'
    case InfrastructureType.PHYSICAL_SERVER:
      return 'Physischer Server'
    default:
      return type
  }
}

const getInfrastructureStatusLabel = (status: InfrastructureStatus): string => {
  switch (status) {
    case InfrastructureStatus.ACTIVE:
      return 'Aktiv'
    case InfrastructureStatus.INACTIVE:
      return 'Inaktiv'
    case InfrastructureStatus.MAINTENANCE:
      return 'Wartung'
    case InfrastructureStatus.PLANNED:
      return 'Geplant'
    case InfrastructureStatus.DECOMMISSIONED:
      return 'Außer Betrieb'
    case InfrastructureStatus.UNDER_CONSTRUCTION:
      return 'Im Aufbau'
    default:
      return status
  }
}

const INFRASTRUCTURE_TABS = [
  { id: 'general', label: 'Allgemein' },
  { id: 'technical', label: 'Technisch' },
  { id: 'lifecycle', label: 'Lebenszyklus' },
  { id: 'relationships', label: 'Beziehungen' },
  { id: 'architectures', label: 'Architekturen' },
]

const InfrastructureForm: React.FC<InfrastructureFormProps> = ({
  infrastructure,
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
  // Applikationen laden
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
  })
  // Architekturen laden
  const { data: architecturesData, loading: architecturesLoading } = useQuery(GET_ARCHITECTURES)
  // Diagramme laden
  const { data: diagramsData, loading: diagramsLoading } = useQuery(GET_DIAGRAMS, {
    fetchPolicy: 'cache-and-network',
  })
  // Infrastrukturen laden (für Parent-Infrastructure)
  const { data: infrastructuresData, loading: infrastructuresLoading } = useQuery(
    GET_INFRASTRUCTURES,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  // Formulardaten mit useMemo initialisieren, um unnötige Re-Renders zu vermeiden
  const defaultValues = React.useMemo<InfrastructureFormValues>(
    () => ({
      name: infrastructure?.name || '',
      description: infrastructure?.description || null,
      infrastructureType: infrastructure?.infrastructureType || InfrastructureType.VIRTUAL_MACHINE,
      status: infrastructure?.status || InfrastructureStatus.PLANNED,
      vendor: infrastructure?.vendor || null,
      version: infrastructure?.version || null,
      capacity: infrastructure?.capacity || null,
      location: infrastructure?.location || null,
      ipAddress: infrastructure?.ipAddress || null,
      operatingSystem: infrastructure?.operatingSystem || null,
      specifications: infrastructure?.specifications || null,
      maintenanceWindow: infrastructure?.maintenanceWindow || null,
      costs: infrastructure?.costs || null,
      introductionDate: infrastructure?.introductionDate
        ? new Date(infrastructure.introductionDate)
        : null,
      endOfLifeDate: infrastructure?.endOfLifeDate ? new Date(infrastructure.endOfLifeDate) : null,
      planningDate: infrastructure?.planningDate ? new Date(infrastructure.planningDate) : null,
      endOfUseDate: infrastructure?.endOfUseDate ? new Date(infrastructure.endOfUseDate) : null,
      ownerId:
        infrastructure?.owners && infrastructure.owners.length > 0
          ? infrastructure.owners[0].id
          : undefined,
      parentInfrastructure: infrastructure?.parentInfrastructure?.map(parent => parent.id) || [],
      childInfrastructures: infrastructure?.childInfrastructures?.map(infra => infra.id) || [],
      hostsApplications: infrastructure?.hostsApplications?.map(app => app.id) || [],
      partOfArchitectures: infrastructure?.partOfArchitectures?.map(arch => arch.id) || [],
      depictedInDiagrams: infrastructure?.depictedInDiagrams?.map(diag => diag.id) || [],
    }),
    [infrastructure]
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primäre Validierung bei Änderungen
      onChange: infrastructureSchema,
      // Validierung beim Absenden
      onSubmit: infrastructureSchema,
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
    } else if ((mode === 'view' || mode === 'edit') && infrastructure && infrastructure.id) {
      // Im edit/view Mode mit Werten aus infrastructure initialisieren
      const formValues = {
        name: infrastructure.name ?? '',
        description: infrastructure.description ?? null,
        infrastructureType: infrastructure.infrastructureType ?? InfrastructureType.VIRTUAL_MACHINE,
        status: infrastructure.status ?? InfrastructureStatus.PLANNED,
        vendor: infrastructure.vendor ?? null,
        version: infrastructure.version ?? null,
        capacity: infrastructure.capacity ?? null,
        location: infrastructure.location ?? null,
        ipAddress: infrastructure.ipAddress ?? null,
        operatingSystem: infrastructure.operatingSystem ?? null,
        specifications: infrastructure.specifications ?? null,
        maintenanceWindow: infrastructure.maintenanceWindow ?? null,
        costs: infrastructure.costs ?? null,
        introductionDate: infrastructure.introductionDate
          ? new Date(infrastructure.introductionDate)
          : null,
        endOfLifeDate: infrastructure.endOfLifeDate ? new Date(infrastructure.endOfLifeDate) : null,
        planningDate: infrastructure.planningDate ? new Date(infrastructure.planningDate) : null,
        endOfUseDate: infrastructure.endOfUseDate ? new Date(infrastructure.endOfUseDate) : null,
        ownerId:
          infrastructure.owners && infrastructure.owners.length > 0
            ? infrastructure.owners[0].id
            : undefined,
        parentInfrastructure: infrastructure.parentInfrastructure?.map(parent => parent.id) ?? [],
        childInfrastructures: infrastructure.childInfrastructures?.map(infra => infra.id) ?? [],
        hostsApplications: infrastructure.hostsApplications?.map(app => app.id) ?? [],
        partOfArchitectures: infrastructure.partOfArchitectures?.map(arch => arch.id) ?? [],
        depictedInDiagrams: infrastructure.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
      }

      // Formular mit den Werten aus der vorhandenen Infrastructure zurücksetzen
      form.reset(formValues)
      hasHandledForm = true
    }

    // Final Fallback - nur ausführen, wenn keine der vorherigen Bedingungen zutraf
    if (!hasHandledForm) {
      // Immer mit Standardwerten zurücksetzen, aber Dialog nicht automatisch schließen
      form.reset(defaultValues)
    }
  }, [form, infrastructure, isOpen, defaultValues, mode])

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
      validators: baseInfrastructureSchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'infrastructureType',
      label: 'Infrastruktur-Typ',
      type: 'select',
      required: true,
      validators: baseInfrastructureSchema.shape.infrastructureType,
      options: Object.values(InfrastructureType).map(
        (type): SelectOption => ({
          value: type,
          label: getInfrastructureTypeLabel(type),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      validators: baseInfrastructureSchema.shape.status,
      options: Object.values(InfrastructureStatus).map(
        (status): SelectOption => ({
          value: status,
          label: getInfrastructureStatusLabel(status),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      validators: baseInfrastructureSchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'vendor',
      label: 'Hersteller',
      type: 'text',
      validators: baseInfrastructureSchema.shape.vendor,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'version',
      label: 'Version',
      type: 'text',
      validators: baseInfrastructureSchema.shape.version,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'capacity',
      label: 'Kapazität',
      type: 'text',
      validators: baseInfrastructureSchema.shape.capacity,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'location',
      label: 'Standort',
      type: 'text',
      validators: baseInfrastructureSchema.shape.location,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'ipAddress',
      label: 'IP-Adresse',
      type: 'text',
      validators: baseInfrastructureSchema.shape.ipAddress,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'operatingSystem',
      label: 'Betriebssystem',
      type: 'text',
      validators: baseInfrastructureSchema.shape.operatingSystem,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'specifications',
      label: 'Spezifikationen',
      type: 'textarea',
      validators: baseInfrastructureSchema.shape.specifications,
      rows: 3,
      size: 12,
      tabId: 'technical',
    },
    {
      name: 'maintenanceWindow',
      label: 'Wartungsfenster',
      type: 'text',
      validators: baseInfrastructureSchema.shape.maintenanceWindow,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    {
      name: 'costs',
      label: 'Kosten',
      type: 'number',
      validators: baseInfrastructureSchema.shape.costs,
      size: { xs: 12, md: 6 },
      tabId: 'technical',
    },
    // Lebenszyklus (Tab: lifecycle) - in chronologischer Reihenfolge
    {
      name: 'planningDate',
      label: 'Planungsdatum',
      icon: <PlanningIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.planningDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'introductionDate',
      label: 'Einführungsdatum',
      icon: <LaunchIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.introductionDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfUseDate',
      label: 'Ende der Nutzung',
      icon: <PauseIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.endOfUseDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
    },
    {
      name: 'endOfLifeDate',
      label: 'End-of-Life Datum',
      icon: <DeleteIcon />,
      type: 'date',
      validators: baseInfrastructureSchema.shape.endOfLifeDate,
      size: { xs: 12, md: 12 },
      tabId: 'lifecycle',
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
      tabId: 'general',
    },
    {
      name: 'parentInfrastructure',
      label: 'Übergeordnete Infrastruktur',
      type: 'autocomplete',
      validators: baseInfrastructureSchema.shape.parentInfrastructure,
      size: 12,
      options:
        infrastructuresData?.infrastructures
          ?.filter((infra: Infrastructure) => infra.id !== infrastructure?.id)
          .map(
            (infra: Infrastructure): SelectOption => ({
              value: infra.id,
              label: infra.name,
            })
          ) || [],
      multiple: true,
      loadingOptions: infrastructuresLoading,
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
      tabId: 'relationships',
    },
    {
      name: 'childInfrastructures',
      label: 'Untergeordnete Infrastrukturen',
      type: 'autocomplete',
      validators: baseInfrastructureSchema.shape.childInfrastructures,
      size: 12,
      options:
        infrastructuresData?.infrastructures
          ?.filter((infra: Infrastructure) => infra.id !== infrastructure?.id)
          .map(
            (infra: Infrastructure): SelectOption => ({
              value: infra.id,
              label: infra.name,
            })
          ) || [],
      multiple: true,
      loadingOptions: infrastructuresLoading,
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
      tabId: 'relationships',
    },
    {
      name: 'hostsApplications',
      label: 'Gehostete Applikationen',
      type: 'autocomplete',
      validators: baseInfrastructureSchema.shape.hostsApplications,
      multiple: true,
      options: (applicationsData?.applications || []).map((app: Application) => ({
        value: app.id,
        label: app.name,
      })),
      loadingOptions: applicationsLoading,
      size: 12,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingApp = applicationsData?.applications?.find(
            (app: Application) => app.id === option
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
      name: 'partOfArchitectures',
      label: 'Teil von Architekturen',
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
      label: 'Dargestellt in Diagrammen',
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
        mode === 'create'
          ? 'Neue Infrastruktur erstellen'
          : mode === 'edit'
            ? 'Infrastruktur bearbeiten'
            : 'Infrastruktur Details'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      form={form}
      enableDelete={mode === 'edit' && !!infrastructure && isArchitect()}
      onDelete={infrastructure?.id ? () => onDelete?.(infrastructure.id) : undefined}
      onEditMode={onEditMode}
      entityId={infrastructure?.id}
      entityName="Infrastruktur"
      metadata={
        infrastructure
          ? {
              createdAt: infrastructure.createdAt,
              updatedAt: infrastructure.updatedAt,
            }
          : undefined
      }
      tabs={INFRASTRUCTURE_TABS}
    />
  )
}

export default InfrastructureForm
