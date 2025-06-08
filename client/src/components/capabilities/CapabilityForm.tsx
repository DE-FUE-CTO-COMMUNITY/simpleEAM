'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import {
  BusinessCapability,
  CapabilityStatus,
  Application,
  Architecture,
} from '../../gql/generated'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
export const capabilitySchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  maturityLevel: z
    .number()
    .int()
    .min(0, 'Level muss 0 oder höher sein')
    .max(3, 'Level darf maximal 3 sein'),
  businessValue: z
    .number()
    .int()
    .min(0, 'Geschäftswert muss 0 oder höher sein')
    .max(10, 'Geschäftswert darf maximal 10 sein'),
  status: z.nativeEnum(CapabilityStatus),
  ownerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().optional(),
  children: z.array(z.string()).optional(),
  supportedByApplications: z.array(z.string()).optional(),
  partOfArchitectures: z.array(z.string()).optional(),
})

// TypeScript Typen basierend auf dem Schema
export type CapabilityFormValues = z.infer<typeof capabilitySchema>

export interface CapabilityFormProps {
  capability?: BusinessCapability | null
  availableCapabilities?: BusinessCapability[]
  availableTags?: string[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CapabilityFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  loading?: boolean
  onEditMode?: () => void
}

const getLevelLabel = (level: number | null | undefined): string => {
  if (level === null || level === undefined) {
    return 'Nicht definiert'
  }

  switch (level) {
    case 0:
      return 'Niedrig'
    case 1:
      return 'Mittel'
    case 2:
      return 'Hoch'
    case 3:
      return 'Sehr Hoch'
    default:
      return `Level ${level}`
  }
}

const getStatusLabel = (status: CapabilityStatus): string => {
  switch (status) {
    case CapabilityStatus.ACTIVE:
      return 'Aktiv'
    case CapabilityStatus.PLANNED:
      return 'Geplant'
    case CapabilityStatus.RETIRED:
      return 'Zurückgezogen'
    default:
      return status
  }
}

const CapabilityForm: React.FC<CapabilityFormProps> = ({
  capability,
  availableCapabilities = [],
  availableTags = [],
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
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS)

  // Architekturen laden
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES)

  // Formulardaten mit useMemo initialisieren, um unnötige Re-Renders zu vermeiden
  const defaultValues = React.useMemo<CapabilityFormValues>(
    () => ({
      name: '',
      description: '',
      maturityLevel: 0,
      businessValue: 0,
      status: CapabilityStatus.ACTIVE,
      ownerId: '',
      tags: [],
      parentId: '',
      children: [],
      supportedByApplications: [],
      partOfArchitectures: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      // Primäre Validierung bei Änderungen
      onChange: capabilitySchema,
      // Validierung beim Absenden
      onSubmit: capabilitySchema,
    },
  })

  // Zurücksetzen des Formulars bei Schließen des Dialogs und Aktualisieren bei neuem Capability
  // Extrahiere stabile Werte aus capability, um die Abhängigkeiten zu stabilisieren
  const capabilityName = capability?.name
  const capabilityDescription = capability?.description
  const capabilityMaturityLevel = capability?.maturityLevel
  const capabilityBusinessValue = capability?.businessValue
  const capabilityStatus = capability?.status
  const capabilityOwnerId =
    capability?.owners && capability.owners.length > 0 ? capability.owners[0]?.id : undefined
  const capabilityTags = capability?.tags
  const capabilityParentId =
    capability?.parents && capability.parents.length > 0 ? capability.parents[0]?.id : undefined
  const capabilityChildren = React.useMemo(
    () => capability?.children?.map(child => child.id) ?? [],
    [capability?.children]
  )
  const capabilitySupportedByApplications = React.useMemo(
    () => capability?.supportedByApplications?.map(app => app.id) ?? [],
    [capability?.supportedByApplications]
  )
  const capabilityPartOfArchitectures = React.useMemo(
    () => capability?.partOfArchitectures?.map(arch => arch.id) ?? [],
    [capability?.partOfArchitectures]
  )

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    } else if (capability) {
      // Aktualisiere das Formular bei Änderungen am Capability-Objekt
      form.reset({
        name: capabilityName ?? '',
        description: capabilityDescription ?? '',
        maturityLevel: capabilityMaturityLevel ?? 0,
        businessValue: capabilityBusinessValue ?? 0,
        status: capabilityStatus ?? CapabilityStatus.ACTIVE,
        ownerId: capabilityOwnerId ?? '',
        tags: capabilityTags ?? [],
        parentId: capabilityParentId ?? '',
        children: capabilityChildren,
        supportedByApplications: capabilitySupportedByApplications,
        partOfArchitectures: capabilityPartOfArchitectures,
      })
    }
  }, [
    isOpen,
    form,
    capability,
    capabilityName,
    capabilityDescription,
    capabilityMaturityLevel,
    capabilityBusinessValue,
    capabilityStatus,
    capabilityOwnerId,
    capabilityTags,
    capabilityParentId,
    capabilityChildren,
    capabilitySupportedByApplications,
    capabilityPartOfArchitectures,
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
      validators: capabilitySchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.status,
      options: Object.values(CapabilityStatus).map(
        (status): SelectOption => ({
          value: status,
          label: getStatusLabel(status),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      required: true,
      validators: capabilitySchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'maturityLevel',
      label: 'Reifegrad',
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.maturityLevel,
      options: [0, 1, 2, 3].map(
        (level): SelectOption => ({
          value: level,
          label: getLevelLabel(level),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'businessValue',
      label: 'Geschäftswert',
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.businessValue,
      options: Array.from(
        { length: 11 },
        (_, i): SelectOption => ({
          value: i,
          label: i.toString(),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      options: availableTags.map((tag): SelectOption => ({ value: tag, label: tag })),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'ownerId',
      label: 'Verantwortlicher',
      type: 'select',
      options:
        personData?.people?.map(
          (person: { id: string; firstName: string; lastName: string }): SelectOption => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ) || [],
      size: { xs: 12, md: 6 },
      loadingOptions: personLoading,
      tabId: 'general',
    },
    {
      name: 'parentId',
      label: 'Übergeordnete Capability',
      type: 'select',
      options: [
        { value: '', label: 'Keine' },
        ...availableCapabilities
          .filter(cap => cap.id !== capability?.id)
          .map(
            (cap): SelectOption => ({
              value: cap.id,
              label: cap.name,
            })
          ),
      ],
      size: 12,
      tabId: 'relationships',
    },
    {
      name: 'children',
      label: 'Untergeordnete Capabilities',
      type: 'autocomplete',
      multiple: true,
      options: availableCapabilities
        .filter(cap => cap.id !== capability?.id)
        .map(
          (cap): SelectOption => ({
            value: cap.id,
            label: cap.name,
          })
        ),
      size: 12,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingCap = availableCapabilities.find(cap => cap.id === option)
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
      name: 'supportedByApplications',
      label: 'Unterstützende Applikationen',
      type: 'autocomplete',
      multiple: true,
      options:
        applicationData?.applications?.map(
          (app: Application): SelectOption => ({
            value: app.id,
            label: app.name,
          })
        ) || [],
      loadingOptions: applicationLoading,
      size: 12,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApp = applicationData?.applications?.find(
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
      options:
        architectureData?.architectures?.map(
          (arch: Architecture): SelectOption => ({
            value: arch.id,
            label: arch.name,
          })
        ) || [],
      loadingOptions: architectureLoading,
      size: 12,
      tabId: 'architectures',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingArch = architectureData?.architectures?.find(
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
  ]

  // Tabs-Konfiguration
  const tabs = [
    { id: 'general', label: 'Allgemein' },
    { id: 'relationships', label: 'Beziehungen' },
    { id: 'architectures', label: 'Architekturen' },
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? 'Neue Business Capability erstellen'
          : mode === 'edit'
            ? 'Business Capability bearbeiten'
            : 'Business Capability Details'
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      tabs={tabs}
      form={form}
      enableDelete={mode === 'edit' && !!capability && isArchitect()}
      onDelete={capability?.id ? () => onDelete?.(capability.id) : undefined}
      onEditMode={onEditMode}
      entityId={capability?.id}
      entityName="Business Capability"
      metadata={
        capability
          ? {
              createdAt: capability.createdAt,
              updatedAt: capability.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default CapabilityForm
