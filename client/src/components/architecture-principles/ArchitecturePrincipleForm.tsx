'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { ArchitecturePrinciple, PrincipleCategory, PrinciplePriority } from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_APPLICATIONS } from '@/graphql/application'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { useCategoryLabel, usePriorityLabel } from './utils'

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
  rationale: z.string().optional(),
  implications: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean(),
  ownerId: z.string().optional(),
  appliedInArchitectureIds: z.array(z.string()).optional(),
  implementedByApplicationIds: z.array(z.string()).optional(),
})

// TypeScript Typen basierend auf dem Schema
export type ArchitecturePrincipleFormValues = z.infer<typeof architecturePrincipleSchema>

import { GenericFormProps } from '../common/GenericFormProps'

const ArchitecturePrincipleForm: React.FC<
  GenericFormProps<ArchitecturePrinciple, ArchitecturePrincipleFormValues>
> = ({
  data: principle,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('architecturePrinciples')
  const tCommon = useTranslations('common')
  const tForms = useTranslations('forms.validation')
  const getCategoryLabel = useCategoryLabel()
  const getPriorityLabel = usePriorityLabel()

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()
  const personWhere = useCompanyWhere('company')

  // Personen laden
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })

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
      ownerId: currentPerson?.id || '',
      appliedInArchitectureIds: [],
      implementedByApplicationIds: [],
    }),
    [currentPerson?.id]
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
          rationale: value.rationale || '',
          implications: value.implications || '',
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
            return { error: tForms('noFormData') }
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
          return { error: 'Validierungsfehler beim Absenden' }
        }
      },
    },
  })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        form.setFieldValue(key as any, value as any)
      })
    } catch (error) {
      console.warn('Fehler beim Aktualisieren des Formulars:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principleId, isOpen, mode])

  // Tab-Konfiguration für die zwei Tabs
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'relationships', label: t('tabs.relationships') },
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
      label: t('form.name'),
      type: 'text',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'category',
      label: t('form.category'),
      type: 'select',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: Object.values(PrincipleCategory).map(category => ({
        value: category,
        label: getCategoryLabel(category),
      })),
    },
    {
      name: 'priority',
      label: t('form.priority'),
      type: 'select',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: Object.values(PrinciplePriority).map(priority => ({
        value: priority,
        label: getPriorityLabel(priority),
      })),
    },
    {
      name: 'isActive',
      label: t('form.status'),
      type: 'select',
      required: true,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: [
        { value: true, label: t('states.active') },
        { value: false, label: t('states.inactive') },
      ],
    },
    {
      name: 'description',
      label: t('form.description'),
      type: 'textarea',
      required: true,
      tabId: 'general',
      size: 12,
      rows: 4,
    },
    {
      name: 'rationale',
      label: t('form.rationale'),
      type: 'textarea',
      required: false,
      tabId: 'general',
      size: 12,
      rows: 3,
    },
    {
      name: 'implications',
      label: t('form.implications'),
      type: 'textarea',
      required: false,
      tabId: 'general',
      size: 12,
      rows: 3,
    },
    {
      name: 'tags',
      label: t('form.tags'),
      type: 'tags',
      required: false,
      tabId: 'general',
      size: 12,
      options: [], // Tags sind freeSolo
    },
    {
      name: 'ownerId',
      label: t('form.owner'),
      type: 'select',
      required: false,
      tabId: 'general',
      size: { xs: 12, md: 6 },
      options: [
        { value: '', label: tCommon('none') },
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
      label: t('form.appliedInArchitectures'),
      type: 'autocomplete',
      required: false,
      tabId: 'relationships',
      size: 12,
      multiple: true,
      options:
        architectureData?.architectures?.map((arch: any) => ({
          value: arch.id,
          label: arch.name,
        })) || [],
      loadingOptions: architectureLoading,
    },
    {
      name: 'implementedByApplicationIds',
      label: t('form.implementedByApplications'),
      type: 'autocomplete',
      required: false,
      tabId: 'relationships',
      size: 12,
      multiple: true,
      options:
        applicationData?.applications?.map((app: any) => ({
          value: app.id,
          label: app.name,
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
        formMode === 'create' ? t('addNew') : formMode === 'edit' ? t('editTitle') : t('viewTitle')
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
