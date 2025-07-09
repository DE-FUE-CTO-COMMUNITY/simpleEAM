'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { ArchitecturePrinciple, PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_APPLICATIONS } from '@/graphql/application'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'

// Schema für die Formularvalidierung
export const architecturePrincipleSchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  category: z.nativeEnum(PrincipleCategory),
  priority: z.nativeEnum(PrinciplePriority),
  rationale: z
    .string()
    .min(10, 'Die Begründung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Begründung darf maximal 1000 Zeichen lang sein')
    .optional(),
  implications: z
    .string()
    .max(1000, 'Die Auswirkungen dürfen maximal 1000 Zeichen lang sein')
    .optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean(),
  ownerId: z.string().optional(),
  appliedInArchitectureIds: z.array(z.string()).optional(),
  implementedByApplicationIds: z.array(z.string()).optional(),
})

// TypeScript Typen basierend auf dem Schema
export type ArchitecturePrincipleFormValues = z.infer<typeof architecturePrincipleSchema>

export interface ArchitecturePrincipleFormProps {
  principle?: ArchitecturePrinciple | null
  mode: 'create' | 'edit' | 'view'
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: (data: ArchitecturePrincipleFormValues) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  loading?: boolean
  onEditMode?: () => void
}

// Hilfsfunktionen für Labels
const getCategoryLabel = (category: PrincipleCategory): string => {
  const labels: Record<PrincipleCategory, string> = {
    [PrincipleCategory.BUSINESS]: 'Business',
    [PrincipleCategory.DATA]: 'Daten',
    [PrincipleCategory.APPLICATION]: 'Anwendung',
    [PrincipleCategory.TECHNOLOGY]: 'Technologie',
    [PrincipleCategory.SECURITY]: 'Sicherheit',
    [PrincipleCategory.INTEGRATION]: 'Integration',
    [PrincipleCategory.GOVERNANCE]: 'Governance',
    [PrincipleCategory.COMPLIANCE]: 'Compliance',
    [PrincipleCategory.PERFORMANCE]: 'Performance',
    [PrincipleCategory.SCALABILITY]: 'Skalierbarkeit',
    [PrincipleCategory.RELIABILITY]: 'Zuverlässigkeit',
    [PrincipleCategory.MAINTAINABILITY]: 'Wartbarkeit',
    [PrincipleCategory.INTEROPERABILITY]: 'Interoperabilität',
    [PrincipleCategory.REUSABILITY]: 'Wiederverwendbarkeit',
    [PrincipleCategory.FLEXIBILITY]: 'Flexibilität',
    [PrincipleCategory.COST_OPTIMIZATION]: 'Kostenoptimierung',
  }
  return labels[category] || category
}

const getPriorityLabel = (priority: PrinciplePriority): string => {
  const labels: Record<PrinciplePriority, string> = {
    [PrinciplePriority.LOW]: 'Niedrig',
    [PrinciplePriority.MEDIUM]: 'Mittel',
    [PrinciplePriority.HIGH]: 'Hoch',
    [PrinciplePriority.CRITICAL]: 'Kritisch',
  }
  return labels[priority] || priority
}

const ArchitecturePrincipleForm: React.FC<ArchitecturePrincipleFormProps> = ({
  principle,
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

  // Architekturen laden
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES)

  // Applikationen laden
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS)

  // Formulardaten mit useMemo initialisieren
  const defaultValues = React.useMemo<ArchitecturePrincipleFormValues>(
    () => ({
      name: '',
      description: '',
      category: PrincipleCategory.BUSINESS,
      priority: PrinciplePriority.MEDIUM,
      rationale: '',
      implications: '',
      tags: [],
      isActive: true,
      ownerId: '',
      appliedInArchitectureIds: [],
      implementedByApplicationIds: [],
    }),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        // Bereinige alle Werte vor der Übermittlung
        const submissionData = {
          ...value,
          name: value.name || '',
          description: value.description || '',
          category: value.category || PrincipleCategory.BUSINESS,
          priority: value.priority || PrinciplePriority.MEDIUM,
          isActive: value.isActive !== undefined ? value.isActive : true,
          // Stelle sicher, dass Arrays nicht undefined sind
          tags: Array.isArray(value.tags) ? value.tags : [],
          appliedInArchitectureIds: Array.isArray(value.appliedInArchitectureIds)
            ? value.appliedInArchitectureIds
            : [],
          implementedByApplicationIds: Array.isArray(value.implementedByApplicationIds)
            ? value.implementedByApplicationIds
            : [],
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
            category: values.category || PrincipleCategory.BUSINESS,
            priority: values.priority || PrinciplePriority.MEDIUM,
            isActive: values.isActive !== undefined ? values.isActive : true,
          }

          // Schema-Validierung durchführen
          architecturePrincipleSchema.parse(validationData)
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
            category: values.category || PrincipleCategory.BUSINESS,
            priority: values.priority || PrinciplePriority.MEDIUM,
            isActive: values.isActive !== undefined ? values.isActive : true,
          }

          // Schema-Validierung durchführen
          architecturePrincipleSchema.parse(validationData)
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

  // Clientseitige Initialisierung für Create-Modus um Hydration-Probleme zu vermeiden
  React.useEffect(() => {
    if (!principle && mode === 'create') {
      form.setFieldValue('isActive', true)
    }
  }, [form, principle, mode])

  // Alle Werte werden direkt im useEffect-Hook extrahiert

  // 1. useEffect für das Initialisieren und Zurücksetzen des Formulars beim Öffnen/Schließen
  useEffect(() => {
    if (!isOpen) {
      // Dialog wird geschlossen - setze Form zurück
      form.reset()
      return
    }

    // Dialog wurde gerade geöffnet - form initialisieren
    if (mode === 'create') {
      // Im Create-Modus mit defaultValues initialisieren
      form.reset(defaultValues)
    }
    // Bei 'edit' und 'view' wird das Form separat mit principle-Daten initialisiert
  }, [isOpen]) // Nur abhängig vom Dialog-Status

  // 2. Separater useEffect für die Aktualisierung mit ArchitecturePrinciple-Daten
  // Dieser wird nur ausgeführt, wenn principle sich ändert oder der Mode wechselt
  const principleId = principle?.id // Stabile ID-Referenz

  useEffect(() => {
    // Wenn kein Principle-Objekt oder Dialog nicht geöffnet, nichts tun
    if (!principle || !isOpen || mode === 'create') {
      return
    }

    // Aktualisiere das Formular mit Principle-Daten
    try {
      const resetValues = {
        name: principle.name || '',
        description: principle.description || '',
        category: principle.category || PrincipleCategory.BUSINESS,
        priority: principle.priority || PrinciplePriority.MEDIUM,
        rationale: principle.rationale || '',
        implications: principle.implications || '',
        tags: principle.tags || [],
        isActive: principle.isActive !== undefined ? principle.isActive : true,
        ownerId: principle.owners && principle.owners.length > 0 ? principle.owners[0].id : '',
        appliedInArchitectureIds: principle.appliedInArchitectures?.map(arch => arch.id) || [],
        implementedByApplicationIds: principle.implementedByApplications?.map(app => app.id) || [],
      }

      // Verwende setValues statt reset, um keine neuen Re-Renders auszulösen
      Object.entries(resetValues).forEach(([key, value]) => {
        // TypeScript-Casting für value, um den Compiler-Fehler zu beheben
        // Die Tanstack Form API erwartet spezifische Typen, aber wir haben hier gemischte Werte
        form.setFieldValue(key as any, value as any)
      })
    } catch (error) {
      console.warn('Fehler beim Aktualisieren des Formulars:', error)
    }
  }, [principleId, isOpen, mode])

  // Tab-Konfiguration
  const tabs: TabConfig[] = [
    { id: 'general', label: 'Allgemein' },
    { id: 'relationships', label: 'Beziehungen' },
  ]

  // Feldkonfiguration für das generische Formular
  interface SelectOption {
    value: string | number | boolean
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
      validators: architecturePrincipleSchema.shape.name,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'select',
      required: true,
      validators: architecturePrincipleSchema.shape.category,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: Object.values(PrincipleCategory).map(category => ({
        value: category,
        label: getCategoryLabel(category),
      })),
    },
    {
      name: 'priority',
      label: 'Priorität',
      type: 'select',
      required: true,
      validators: architecturePrincipleSchema.shape.priority,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: Object.values(PrinciplePriority).map(priority => ({
        value: priority,
        label: getPriorityLabel(priority),
      })),
    },
    {
      name: 'isActive',
      label: 'Status',
      type: 'select',
      required: true,
      validators: architecturePrincipleSchema.shape.isActive,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: [
        { value: true, label: 'Aktiv' },
        { value: false, label: 'Inaktiv' },
      ],
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'text',
      required: true,
      multiline: true,
      rows: 4,
      validators: architecturePrincipleSchema.shape.description,
      tabId: 'general',
      size: 12,
    },
    {
      name: 'rationale',
      label: 'Begründung',
      type: 'text',
      required: false,
      multiline: true,
      rows: 3,
      validators: architecturePrincipleSchema.shape.rationale,
      tabId: 'general',
      size: 12,
    },
    {
      name: 'implications',
      label: 'Auswirkungen',
      type: 'text',
      required: false,
      multiline: true,
      rows: 3,
      validators: architecturePrincipleSchema.shape.implications,
      tabId: 'general',
      size: 12,
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      required: false,
      validators: architecturePrincipleSchema.shape.tags,
      tabId: 'general',
      size: 12,
    },
    {
      name: 'ownerId',
      label: 'Verantwortlicher',
      type: 'select',
      required: false,
      tabId: 'general',
      size: 12,
      options: [
        { value: '', label: 'Keine' },
        ...(personData?.people || []).map(
          (person: { id: string; firstName: string; lastName: string }) => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`,
          })
        ),
      ],
      loadingOptions: personLoading,
    },
  ]

  // Beziehungsfelder für den zweiten Tab
  const relationshipFields: FieldConfigWithSelect[] = [
    {
      name: 'appliedInArchitectureIds',
      label: 'Angewendet in Architekturen',
      type: 'autocomplete',
      required: false,
      tabId: 'relationships',
      size: 12,
      options:
        architectureData?.architectures?.map((architecture: any) => ({
          value: architecture.id,
          label: architecture.name,
        })) || [],
      loadingOptions: architectureLoading,
    },
    {
      name: 'implementedByApplicationIds',
      label: 'Implementiert von Applikationen',
      type: 'autocomplete',
      required: false,
      tabId: 'relationships',
      size: 12,
      options:
        applicationData?.applications?.map((application: any) => ({
          value: application.id,
          label: application.name,
        })) || [],
      loadingOptions: applicationLoading,
    },
  ]

  // Alle Felder zusammenfügen
  const fields: FieldConfigWithSelect[] = [...generalFields, ...relationshipFields]

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
          ? 'Neues Architektur-Prinzip erstellen'
          : formMode === 'edit'
            ? 'Architektur-Prinzip bearbeiten'
            : 'Architektur-Prinzip Details'
      }
      isOpen={formIsOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      isLoading={formLoading}
      mode={formMode}
      fields={fields}
      form={form}
      tabs={tabs}
      enableDelete={formMode === 'edit' && !!principle && isArchitect()}
      onDelete={principle?.id && onDelete ? () => onDelete(principle.id) : undefined}
      onEditMode={onEditMode}
      entityId={principle?.id}
      entityName="Architektur-Prinzip"
      metadata={
        principle
          ? {
              createdAt: principle.createdAt,
              updatedAt: principle.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default ArchitecturePrincipleForm
