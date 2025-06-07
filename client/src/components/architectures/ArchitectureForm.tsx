'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { Architecture, ArchitectureDomain, ArchitectureType } from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { getDomainLabel, getTypeLabel } from './utils'

// Schema für die Formularvalidierung
export const architectureSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  timestamp: z
    .date({
      required_error: 'Architekturdatum ist erforderlich',
      invalid_type_error: 'Architekturdatum muss ein gültiges Datum sein',
    }),
    // Default wird in defaultValues gesetzt, um Hydration-Probleme zu vermeiden
  domain: z.nativeEnum(ArchitectureDomain),
  type: z.nativeEnum(ArchitectureType),
  tags: z.array(z.string()).optional(),
  ownerId: z.string().optional(),
  containsApplicationIds: z.array(z.string()).optional(),
  containsCapabilityIds: z.array(z.string()).optional(),
  containsDataObjectIds: z.array(z.string()).optional(),
  diagramIds: z.array(z.string()).optional(),
  parentArchitectureId: z.string().optional(),
})

// TypeScript Typen basierend auf dem Schema
export type ArchitectureFormValues = z.infer<typeof architectureSchema>

export interface ArchitectureFormProps {
  architecture?: Architecture | null
  availableArchitectures?: Architecture[]
  mode: 'create' | 'edit' | 'view'
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: (data: ArchitectureFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  loading?: boolean
  onEditMode?: () => void
}

const ArchitectureForm: React.FC<ArchitectureFormProps> = ({
  architecture,
  availableArchitectures = [],
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

  // Capabilities laden
  const { data: capabilityData, loading: capabilityLoading } = useQuery(GET_CAPABILITIES)

  // DataObjects laden
  const { data: dataObjectData, loading: dataObjectLoading } = useQuery(GET_DATA_OBJECTS)

  // Diagramme laden
  const { data: diagramData, loading: diagramLoading } = useQuery(GET_DIAGRAMS)

  // Formulardaten mit useMemo initialisieren
  const defaultValues = React.useMemo<ArchitectureFormValues>(
    () => ({
      name: '',
      description: '',
      domain: ArchitectureDomain.ENTERPRISE,
      type: ArchitectureType.CURRENT_STATE,
      timestamp: new Date(), // Wird clientseitig durch useEffect aktualisiert
      tags: [],
      ownerId: '',
      containsApplicationIds: [],
      containsCapabilityIds: [],
      containsDataObjectIds: [],
      diagramIds: [],
      parentArchitectureId: '',
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Prüfen und validieren des Timestamps
      let timestampValue = new Date()

      if (value.timestamp) {
        if (value.timestamp instanceof Date) {
          timestampValue = value.timestamp
        } else if (typeof value.timestamp === 'string') {
          try {
            timestampValue = new Date(value.timestamp)
          } catch {
            // Fehler beim Konvertieren des Timestamps - verwende aktuelles Datum
          }
        }
      }

      if (onSubmit) {
        // Bereinige alle Werte vor der Übermittlung
        const submissionData = {
          ...value,
          name: value.name || '',
          description: value.description || '',
          domain: value.domain || ArchitectureDomain.ENTERPRISE,
          type: value.type || ArchitectureType.CURRENT_STATE,
          timestamp: timestampValue,
          // Stelle sicher, dass Arrays nicht undefined sind
          tags: Array.isArray(value.tags) ? value.tags : [],
          containsApplicationIds: Array.isArray(value.containsApplicationIds)
            ? value.containsApplicationIds
            : [],
          containsCapabilityIds: Array.isArray(value.containsCapabilityIds)
            ? value.containsCapabilityIds
            : [],
          containsDataObjectIds: Array.isArray(value.containsDataObjectIds)
            ? value.containsDataObjectIds
            : [],
          diagramIds: Array.isArray(value.diagramIds) ? value.diagramIds : [],
        }

        await onSubmit(submissionData)
      }
    },
    // Benutzerdefinierte Validierungsfunktionen für TanStack Form
    validators: {
      // Primäre Validierungsfunktion für Änderungen
      onChange: formState => {
        try {
          // formState enthält die Werte im value-Property
          const values = formState.value

          if (!values) {
            return undefined
          }

          // Daten aus dem Formular mit Standardwerten anreichern
          const validationData = {
            ...values,
            name: values.name || '',
            description: values.description || '',
            domain: values.domain || ArchitectureDomain.ENTERPRISE,
            type: values.type || ArchitectureType.CURRENT_STATE,
            timestamp: values.timestamp instanceof Date ? values.timestamp : new Date(),
          }

          // Schema-Validierung durchführen
          architectureSchema.parse(validationData)
          return undefined // Kein Fehler
        } catch (e) {
          if (e instanceof z.ZodError) {
            return e.format()
          }
          return { error: 'Validierungsfehler' }
        }
      },
      // Finale Validierung beim Absenden
      onSubmit: formState => {
        try {
          // formState enthält die Werte im value-Property
          const values = formState.value

          if (!values) {
            return { error: 'Keine Formulardaten vorhanden' }
          }

          // Daten aus dem Formular mit Standardwerten anreichern
          const validationData = {
            ...values,
            name: values.name || '',
            description: values.description || '',
            domain: values.domain || ArchitectureDomain.ENTERPRISE,
            type: values.type || ArchitectureType.CURRENT_STATE,
            timestamp: values.timestamp instanceof Date ? values.timestamp : new Date(),
          }

          // Schema-Validierung durchführen
          architectureSchema.parse(validationData)
          return undefined // Kein Fehler
        } catch (e) {
          if (e instanceof z.ZodError) {
            return e.format()
          }
          return { error: 'Validierungsfehler im Formular' }
        }
      },
    },
  })

  // Clientseitige Initialisierung des Timestamps um Hydration-Probleme zu vermeiden
  React.useEffect(() => {
    if (!architecture && mode === 'create') {
      form.setFieldValue('timestamp', new Date())
    }
  }, [form, architecture, mode])

  // Alle Werte werden direkt im useEffect-Hook extrahiert

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    } else if (architecture) {
      // Aktualisiere das Formular bei Änderungen am Architecture-Objekt
      try {
        // Sicherstellen, dass wir ein gültiges Date-Objekt haben
        const timestamp = architecture.timestamp ? new Date(architecture.timestamp) : new Date()

        const resetValues = {
          name: architecture.name || '',
          description: architecture.description || '',
          domain: architecture.domain || ArchitectureDomain.ENTERPRISE,
          type: architecture.type || ArchitectureType.CURRENT_STATE,
          timestamp: timestamp,
          tags: architecture.tags || [],
          ownerId:
            architecture.owners && architecture.owners.length > 0 ? architecture.owners[0].id : '',
          containsApplicationIds: architecture.containsApplications?.map(app => app.id) || [],
          containsCapabilityIds: architecture.containsCapabilities?.map(cap => cap.id) || [],
          containsDataObjectIds: architecture.containsDataObjects?.map(obj => obj.id) || [],
          diagramIds: architecture.diagrams?.map(diag => diag.id) || [],
          parentArchitectureId:
            architecture.parentArchitecture && architecture.parentArchitecture.length > 0
              ? architecture.parentArchitecture[0].id
              : '',
        }

        form.reset(resetValues)
      } catch (error) {
        // Bei Fehler auf Standardwerte zurückfallen
        console.warn('Fehler beim Zurücksetzen des Formulars:', error)
        form.reset(defaultValues)
      }
    } else {
      // Wenn kein Architecture-Objekt übergeben wurde, aber das Formular geöffnet ist
      form.reset(defaultValues)
    }
  }, [isOpen, form, architecture, defaultValues])

  // Tab-Konfiguration für die drei Tabs
  const tabs: TabConfig[] = [
    { id: 'general', label: 'Allgemein' },
    { id: 'elements', label: 'Enthaltene Architekturelemente' },
    { id: 'diagrams', label: 'Diagramme' },
  ]

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

  // Allgemeine Felder für den ersten Tab
  const generalFields: FieldConfigWithSelect[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validators: architectureSchema.shape.name,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'domain',
      label: 'Domäne',
      type: 'select',
      required: true,
      validators: architectureSchema.shape.domain,
      tabId: 'general',
      options: Object.values(ArchitectureDomain).map(domain => ({
        value: domain,
        label: getDomainLabel(domain),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'type',
      label: 'Typ',
      type: 'select',
      required: true,
      validators: architectureSchema.shape.type,
      tabId: 'general',
      options: Object.values(ArchitectureType).map(type => ({
        value: type,
        label: getTypeLabel(type),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'timestamp',
      label: 'Architekturdatum',
      type: 'date',
      required: true,
      validators: architectureSchema.shape.timestamp,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      required: true,
      validators: architectureSchema.shape.description,
      tabId: 'general',
      rows: 4,
      size: 12,
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'ownerId',
      label: 'Verantwortlicher',
      type: 'select',
      tabId: 'general',
      options: [
        { value: '', label: 'Keine' },
        ...(personData?.people || []).map(
          (person: { id: string; firstName: string; lastName: string }): SelectOption => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ),
      ],
      size: { xs: 12, md: 6 },
      loadingOptions: personLoading,
    },
    {
      name: 'parentArchitectureId',
      label: 'Übergeordnete Architektur',
      type: 'select',
      tabId: 'general',
      options: [
        { value: '', label: 'Keine' },
        ...availableArchitectures
          .filter(arch => arch.id !== architecture?.id)
          .map(
            (arch): SelectOption => ({
              value: arch.id,
              label: arch.name,
            })
          ),
      ],
      size: { xs: 12, md: 6 },
    },
  ]

  // Felder für den zweiten Tab (Architekturelemente)
  const elementsFields: FieldConfigWithSelect[] = [
    {
      name: 'containsApplicationIds',
      label: 'Applikationen',
      type: 'autocomplete',
      tabId: 'elements',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        applicationData?.applications?.map(
          (app: { id: string; name: string }): SelectOption => ({
            value: app.id,
            label: app.name,
          })
        ) || [],
      loadingOptions: applicationLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
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
      name: 'containsCapabilityIds',
      label: 'Capabilities',
      type: 'autocomplete',
      tabId: 'elements',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        capabilityData?.businessCapabilities?.map(
          (cap: { id: string; name: string }): SelectOption => ({
            value: cap.id,
            label: cap.name,
          })
        ) || [],
      loadingOptions: capabilityLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingCap = capabilityData?.businessCapabilities?.find(
            (cap: { id: string; name: string }) => cap.id === option
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
      name: 'containsDataObjectIds',
      label: 'Datenobjekte',
      type: 'autocomplete',
      tabId: 'elements',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        dataObjectData?.dataObjects?.map(
          (obj: { id: string; name: string }): SelectOption => ({
            value: obj.id,
            label: obj.name,
          })
        ) || [],
      loadingOptions: dataObjectLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingObj = dataObjectData?.dataObjects?.find(
            (obj: { id: string; name: string }) => obj.id === option
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

  // Felder für den dritten Tab (Diagramme)
  const diagramFields: FieldConfigWithSelect[] = [
    {
      name: 'diagramIds',
      label: 'Diagramme',
      type: 'autocomplete',
      tabId: 'diagrams',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        diagramData?.diagrams?.map(
          (diagram: { id: string; title: string }): SelectOption => ({
            value: diagram.id,
            label: diagram.title,
          })
        ) || [],
      loadingOptions: diagramLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingDiagram = diagramData?.diagrams?.find(
            (diagram: { id: string; title: string }) => diagram.id === option
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

  // Alle Felder zusammenfügen
  const fields: FieldConfigWithSelect[] = [...generalFields, ...elementsFields, ...diagramFields]

  // Standardwerte für optionale Props bereitstellen
  const formMode = mode || 'view'
  const formIsOpen = isOpen !== undefined ? isOpen : true
  const formLoading = loading || false
  const handleClose = onClose || (() => {})
  const handleSubmit = onSubmit || (async () => {})

  return (
    <GenericForm
      title={
        formMode === 'create'
          ? 'Neue Architektur erstellen'
          : formMode === 'edit'
            ? 'Architektur bearbeiten'
            : 'Architekturdetails'
      }
      isOpen={formIsOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      isLoading={formLoading}
      mode={formMode}
      fields={fields}
      form={form}
      tabs={tabs}
      enableDelete={formMode === 'edit' && !!architecture && isArchitect()}
      onDelete={architecture?.id && onDelete ? () => onDelete(architecture.id) : undefined}
      onEditMode={onEditMode}
      entityId={architecture?.id}
      entityName="Architektur"
      metadata={
        architecture
          ? {
              createdAt: architecture.createdAt,
              updatedAt: architecture.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default ArchitectureForm
