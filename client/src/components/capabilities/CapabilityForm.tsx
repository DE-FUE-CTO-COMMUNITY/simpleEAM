'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import {
  BusinessCapability,
  CapabilityStatus,
  CapabilityType,
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
  status: z.nativeEnum(CapabilityStatus),
  type: z.nativeEnum(CapabilityType).optional(),
  businessValue: z
    .number()
    .int()
    .min(0, 'Geschäftswert muss 0 oder höher sein')
    .max(10, 'Geschäftswert darf maximal 10 sein'),
  sequenceNumber: z.number().int().min(0, 'Sequenznummer muss 0 oder höher sein').optional(),
  introductionDate: z.date().optional(),
  endDate: z.date().optional(),
  ownerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().optional(),
  children: z.array(z.string()).optional(),
  supportedByApplications: z.array(z.string()).optional(),
  partOfArchitectures: z.array(z.string()).optional(),
  partOfDiagrams: z.array(z.string()).optional(),
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

const getLevelLabel = (level: number | null | undefined, t: any): string => {
  if (level === null || level === undefined) {
    return t('capabilities.maturityLevels.undefined')
  }

  return t(`capabilities.maturityLevels.${level}`)
}

const getStatusLabel = (status: CapabilityStatus, t: any): string => {
  return t(`capabilities.statuses.${status}`)
}

const getTypeLabel = (type: CapabilityType, t: any): string => {
  return t(`capabilities.types.${type}`)
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
  const t = useTranslations()
  const tForm = useTranslations('capabilities.form')
  const tTabs = useTranslations('capabilities.tabs')

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()

  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS)

  // Applikationen laden
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS)

  // Architekturen laden
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES)

  // Diagramme laden
  const { data: diagramData, loading: diagramLoading } = useQuery(GET_DIAGRAMS)

  // Formulardaten mit useMemo initialisieren, um unnötige Re-Renders zu vermeiden
  const defaultValues = React.useMemo<CapabilityFormValues>(
    () => ({
      name: '',
      description: '',
      maturityLevel: 0,
      businessValue: 0,
      status: CapabilityStatus.ACTIVE,
      type: CapabilityType.OPERATIONAL,
      sequenceNumber: 0,
      introductionDate: undefined,
      endDate: undefined,
      ownerId: currentPerson?.id || '', // Standard-Owner auf aktuellen Benutzer setzen
      tags: [],
      parentId: '',
      children: [],
      supportedByApplications: [],
      partOfArchitectures: [],
      partOfDiagrams: [],
    }),
    [currentPerson?.id]
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
  const capabilityType = capability?.type
  const capabilitySequenceNumber = capability?.sequenceNumber
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
  // Diagramme, in denen die Capability dargestellt wird
  const capabilityPartOfDiagrams = React.useMemo(
    () => capability?.depictedInDiagrams?.map(diagram => diagram.id) ?? [],
    [capability?.depictedInDiagrams]
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
        type: capabilityType ?? CapabilityType.OPERATIONAL,
        sequenceNumber: capabilitySequenceNumber ?? 0,
        introductionDate: capability?.introductionDate
          ? new Date(capability.introductionDate)
          : undefined,
        endDate: capability?.endDate ? new Date(capability.endDate) : undefined,
        ownerId: capabilityOwnerId ?? '',
        tags: capabilityTags ?? [],
        parentId: capabilityParentId ?? '',
        children: capabilityChildren,
        supportedByApplications: capabilitySupportedByApplications,
        partOfArchitectures: capabilityPartOfArchitectures,
        partOfDiagrams: capabilityPartOfDiagrams,
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
    capabilityType,
    capabilitySequenceNumber,
    capabilityOwnerId,
    capabilityTags,
    capabilityParentId,
    capabilityChildren,
    capabilitySupportedByApplications,
    capabilityPartOfArchitectures,
    capabilityPartOfDiagrams,
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
      label: tForm('name'),
      type: 'text',
      required: true,
      validators: capabilitySchema.shape.name,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'status',
      label: tForm('status'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.status,
      options: Object.values(CapabilityStatus).map(
        (status): SelectOption => ({
          value: status,
          label: getStatusLabel(status, t),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'type',
      label: tForm('type'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.type,
      options: Object.values(CapabilityType).map(
        (type): SelectOption => ({
          value: type,
          label: getTypeLabel(type, t),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'sequenceNumber',
      label: tForm('sequenceNumber'),
      type: 'number',
      validators: capabilitySchema.shape.sequenceNumber,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: tForm('description'),
      type: 'textarea',
      required: true,
      validators: capabilitySchema.shape.description,
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'maturityLevel',
      label: tForm('maturityLevel'),
      type: 'select',
      required: true,
      validators: capabilitySchema.shape.maturityLevel,
      options: [0, 1, 2, 3].map(
        (level): SelectOption => ({
          value: level,
          label: getLevelLabel(level, t),
        })
      ),
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'businessValue',
      label: tForm('businessValue'),
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
      label: tForm('tags'),
      type: 'tags',
      options: availableTags.map((tag): SelectOption => ({ value: tag, label: tag })),
      size: 12,
      tabId: 'general',
    },
    {
      name: 'ownerId',
      label: tForm('owner'),
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
      label: tForm('parentCapability'),
      type: 'select',
      options: [
        { value: '', label: tForm('none') },
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
      label: tForm('childCapabilities'),
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
      label: tForm('supportedByApplications'),
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
      label: tForm('partOfArchitectures'),
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
    {
      name: 'partOfDiagrams',
      label: tForm('partOfDiagrams'),
      type: 'autocomplete',
      multiple: true,
      options:
        diagramData?.diagrams?.map(
          (diagram: any): SelectOption => ({
            value: diagram.id,
            label: diagram.title,
          })
        ) || [],
      loadingOptions: diagramLoading,
      size: 12,
      tabId: 'architectures',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingDiagram = diagramData?.diagrams?.find(
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
    {
      name: 'introductionDate',
      label: tForm('introductionDate'),
      type: 'date',
      validators: capabilitySchema.shape.introductionDate,
      size: { xs: 12, md: 6 },
      tabId: 'lifecycle',
    },
    {
      name: 'endDate',
      label: tForm('endDate'),
      type: 'date',
      validators: capabilitySchema.shape.endDate,
      size: { xs: 12, md: 6 },
      tabId: 'lifecycle',
    },
  ]

  // Tabs-Konfiguration
  const tabs = [
    { id: 'general', label: tTabs('general') },
    { id: 'lifecycle', label: tTabs('lifecycle') },
    { id: 'relationships', label: tTabs('relationships') },
    { id: 'architectures', label: tTabs('architectures') },
  ]

  return (
    <GenericForm
      title={
        mode === 'create'
          ? tForm('createTitle')
          : mode === 'edit'
            ? tForm('editTitle')
            : tForm('viewTitle')
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
