'use client'

import React, { useEffect, useState } from 'react'
import { useForm, useStore } from '@tanstack/react-form'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { useTheme } from '@mui/material/styles'
import { useTranslations } from 'next-intl'
import {
  Architecture,
  ArchitectureDomain,
  ArchitectureType,
  Infrastructure,
} from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_DIAGRAMS } from '@/graphql/diagram'
import { GET_APPLICATION_INTERFACES } from '@/graphql/applicationInterface'
import { GET_ARCHITECTURE_PRINCIPLES } from '@/graphql/architecturePrinciple'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { isArchitect } from '@/lib/auth'
import { useDomainLabel, useTypeLabel } from './utils'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useChipClickHandlers } from '@/hooks/useChipClickHandlers'
import CapabilityForm from '../capabilities/CapabilityForm'
import ApplicationForm from '../applications/ApplicationForm'
import DataObjectForm from '../dataobjects/DataObjectForm'
import ApplicationInterfaceForm from '../interfaces/ApplicationInterfaceForm'
import InfrastructureForm from '../infrastructure/InfrastructureForm'
import ArchitecturePrincipleForm from '../architecture-principles/ArchitecturePrincipleForm'

// Schema for form validation
export const architectureSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  timestamp: z.date({
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
  containsInterfaceIds: z.array(z.string()).optional(),
  containsInfrastructureIds: z.array(z.string()).optional(),
  diagramIds: z.array(z.string()).optional(),
  parentArchitectureId: z.string().optional(),
  appliedPrincipleIds: z.array(z.string()).optional(),
  elementsNote: z.string().optional(),
})

// TypeScript Typen basierend auf dem Schema
export type ArchitectureFormValues = z.infer<typeof architectureSchema>

import { GenericFormProps } from '../common/GenericFormProps'

export interface ArchitectureFormProps
  extends GenericFormProps<Architecture, ArchitectureFormValues> {
  availableArchitectures?: Architecture[]
}

const ArchitectureForm: React.FC<ArchitectureFormProps> = ({
  data: architecture,
  availableArchitectures = [],
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
  isNested,
}) => {
  const theme = useTheme()
  const t = useTranslations('architectures')
  const getDomainLabelTranslated = useDomainLabel()
  const getTypeLabelTranslated = useTypeLabel()

  const [nestedFormState, setNestedFormState] = useState<{
    isOpen: boolean
    entityType: string | null
    entityId: string | null
    mode: 'view' | 'edit'
  }>({ isOpen: false, entityType: null, entityId: null, mode: 'view' })

  const { createChipClickHandler } = useChipClickHandlers({
    onOpenNestedForm: (entityType, entityId, mode) => {
      setNestedFormState({ isOpen: true, entityType, entityId, mode })
    },
    customEntityTypeMap: {
      containsCapabilityIds: 'capabilities',
      containsApplicationIds: 'applications',
      containsDataObjectIds: 'dataObjects',
      containsInterfaceIds: 'applicationInterfaces',
      containsInfrastructureIds: 'infrastructures',
      appliedPrincipleIds: 'architecturePrinciples',
      diagramIds: 'diagrams',
    },
  })

  const handleCloseNestedForm = () => {
    setNestedFormState({ isOpen: false, entityType: null, entityId: null, mode: 'view' })
  }

  // Aktuellen Benutzer als Standard-Owner abrufen
  const { currentPerson } = useCurrentPerson()

  // Personen laden
  const personWhere = useCompanyWhere('companies')
  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })

  // Load applications
  const companyWhere = useCompanyWhere('company')
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })

  // Capabilities laden
  const { data: capabilityData, loading: capabilityLoading } = useQuery(GET_CAPABILITIES, {
    variables: { where: companyWhere },
  })

  // DataObjects laden
  const { data: dataObjectData, loading: dataObjectLoading } = useQuery(GET_DATA_OBJECTS, {
    variables: { where: companyWhere },
  })

  // Diagramme laden
  const { data: diagramData, loading: diagramLoading } = useQuery(GET_DIAGRAMS, {
    variables: { where: companyWhere },
  })

  // Schnittstellen laden
  const { data: interfaceData, loading: interfaceLoading } = useQuery(GET_APPLICATION_INTERFACES, {
    variables: { where: companyWhere },
  })

  // Architektur-Prinzipien laden
  const { data: principleData, loading: principleLoading } = useQuery(GET_ARCHITECTURE_PRINCIPLES, {
    variables: { where: companyWhere },
  })

  // Infrastruktur laden
  const { data: infrastructureData, loading: infrastructureLoading } = useQuery(
    GET_INFRASTRUCTURES,
    { variables: { where: companyWhere } }
  )

  // Nested queries for chip navigation (on demand)
  const { data: nestedCapabilityData } = useQuery(GET_CAPABILITIES, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'capabilities',
  })

  const { data: nestedApplicationData } = useQuery(GET_APPLICATIONS, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applications',
  })

  const { data: nestedDataObjectData } = useQuery(GET_DATA_OBJECTS, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'dataObjects',
  })

  const { data: nestedInterfaceData } = useQuery(GET_APPLICATION_INTERFACES, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'applicationInterfaces',
  })

  const { data: nestedInfrastructureData } = useQuery(GET_INFRASTRUCTURES, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'infrastructures',
  })

  const { data: nestedPrincipleData } = useQuery(GET_ARCHITECTURE_PRINCIPLES, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architecturePrinciples',
  })

  const { data: nestedArchitectureData } = useQuery(GET_ARCHITECTURES, {
    variables: { where: { id: { eq: nestedFormState.entityId }, ...companyWhere } },
    skip: !nestedFormState.isOpen || nestedFormState.entityType !== 'architectures',
  })

  // Initialize form data with useMemo
  const defaultValues = React.useMemo<ArchitectureFormValues>(
    () => ({
      name: '',
      description: '',
      domain: ArchitectureDomain.ENTERPRISE,
      type: ArchitectureType.CURRENT_STATE,
      timestamp: new Date(1735689600000), // Fixed timestamp for SSR consistency
      tags: [],
      ownerId: currentPerson?.id || '',
      containsApplicationIds: [],
      containsCapabilityIds: [],
      containsDataObjectIds: [],
      containsInterfaceIds: [],
      containsInfrastructureIds: [],
      diagramIds: [],
      parentArchitectureId: '',
      appliedPrincipleIds: [],
      elementsNote: t('form.elementsNote'),
    }),
    [t, currentPerson?.id]
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Prüfen und validieren des Timestamps
      let timestampValue = new Date(1735689600000) // Fixed timestamp for SSR consistency

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
          containsInterfaceIds: Array.isArray(value.containsInterfaceIds)
            ? value.containsInterfaceIds
            : [],
          containsInfrastructureIds: Array.isArray(value.containsInfrastructureIds)
            ? value.containsInfrastructureIds
            : [],
          diagramIds: Array.isArray(value.diagramIds) ? value.diagramIds : [],
          appliedPrincipleIds: Array.isArray(value.appliedPrincipleIds)
            ? value.appliedPrincipleIds
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
            domain: values.domain || ArchitectureDomain.ENTERPRISE,
            type: values.type || ArchitectureType.CURRENT_STATE,
            timestamp:
              values.timestamp instanceof Date ? values.timestamp : new Date(1735689600000),
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
            timestamp:
              values.timestamp instanceof Date ? values.timestamp : new Date(1735689600000),
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
    // Bei 'edit' und 'view' wird das Form separat mit architecture-Daten initialisiert
  }, [isOpen, defaultValues, form, mode]) // Alle Dependencies hinzufügen

  // 2. Separater useEffect für die Aktualisierung mit Architecture-Daten
  // Dieser wird nur ausgeführt, wenn architecture sich ändert oder der Mode wechselt
  const architectureId = architecture?.id // Stabile ID-Referenz

  useEffect(() => {
    // Wenn kein Architecture-Objekt oder Dialog nicht geöffnet, nichts tun
    if (!architecture || !isOpen || mode === 'create') {
      return
    }

    // Aktualisiere das Formular mit Architecture-Daten
    try {
      // Sicherstellen, dass wir ein gültiges Date-Objekt haben
      const timestamp = architecture.timestamp
        ? new Date(architecture.timestamp)
        : new Date(1735689600000)

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
        containsInterfaceIds: architecture.containsInterfaces?.map(iface => iface.id) || [],
        containsInfrastructureIds: architecture.containsInfrastructure?.map(inf => inf.id) || [],
        diagramIds: architecture.diagrams?.map(diag => diag.id) || [],
        appliedPrincipleIds: architecture.appliedPrinciples?.map(principle => principle.id) || [],
        parentArchitectureId:
          architecture.parentArchitecture && architecture.parentArchitecture.length > 0
            ? architecture.parentArchitecture[0].id
            : '',
        elementsNote: t('form.elementsNote'),
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
  }, [architectureId, isOpen, mode, architecture, form, t]) // Alle Dependencies hinzufügen

  // Beobachte das diagramIds-Feld
  const diagramIds = useStore(form.store, (state: any) => state.values.diagramIds)

  // Verwende useRef, um den vorherigen Zustand zu speichern, ohne Rerendering auszulösen
  const prevDiagramIdsRef = React.useRef<string[]>()

  useEffect(() => {
    // Vergleiche aktuelle mit vorherigen Diagramm-IDs
    const prevDiagramIds = prevDiagramIdsRef.current

    // Aktualisiere Referenz für nächsten Durchlauf
    prevDiagramIdsRef.current = diagramIds

    // Nur fortfahren, wenn es eine tatsächliche Änderung gibt und nicht beim ersten Render
    if (prevDiagramIds && JSON.stringify(prevDiagramIds) !== JSON.stringify(diagramIds)) {
      // Verzögerung für bessere UI-Erfahrung
      setTimeout(() => {
        // Setze die Felder zurück, um ein Re-Rendering zu erzwingen
        const appIds = form.getFieldValue('containsApplicationIds')
        const capIds = form.getFieldValue('containsCapabilityIds')
        const objIds = form.getFieldValue('containsDataObjectIds')

        if (appIds) form.setFieldValue('containsApplicationIds', [...appIds])
        if (capIds) form.setFieldValue('containsCapabilityIds', [...capIds])
        if (objIds) form.setFieldValue('containsDataObjectIds', [...objIds])
      }, 100)
    }
  }, [diagramIds, form])

  // Tab-Konfiguration für die vier Tabs
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'elements', label: t('tabs.elements') },
    { id: 'principles', label: t('tabs.principles') },
    { id: 'diagrams', label: t('tabs.diagrams') },
  ]

  // Field configuration for the generic form
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
      label: t('form.name'),
      type: 'text',
      required: true,
      validators: architectureSchema.shape.name,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'domain',
      label: t('form.domain'),
      type: 'select',
      required: true,
      validators: architectureSchema.shape.domain,
      tabId: 'general',
      options: Object.values(ArchitectureDomain).map(domain => ({
        value: domain,
        label: getDomainLabelTranslated(domain),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'type',
      label: t('form.type'),
      type: 'select',
      required: true,
      validators: architectureSchema.shape.type,
      tabId: 'general',
      options: Object.values(ArchitectureType).map(type => ({
        value: type,
        label: getTypeLabelTranslated(type),
      })),
      size: { xs: 12, md: 6 },
    },
    {
      name: 'timestamp',
      label: t('form.timestamp'),
      type: 'date',
      required: true,
      validators: architectureSchema.shape.timestamp,
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'description',
      label: t('form.description'),
      type: 'textarea',
      required: true,
      validators: architectureSchema.shape.description,
      tabId: 'general',
      rows: 4,
      size: 12,
    },
    {
      name: 'tags',
      label: t('form.tags'),
      type: 'tags',
      tabId: 'general',
      size: { xs: 12, md: 6 },
    },
    {
      name: 'ownerId',
      label: t('form.owner'),
      type: 'select',
      tabId: 'general',
      options: [
        { value: '', label: t('form.none') },
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
      label: t('form.parentArchitecture'),
      type: 'select',
      tabId: 'general',
      options: [
        { value: '', label: t('form.none') },
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

  // Felder für den zweiten Tab (Architekturelemente) mit Debug-Ausgaben
  const elementsFields: FieldConfigWithSelect[] = [
    {
      name: 'containsCapabilityIds',
      label: t('form.capabilities'),
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
          const result = matchingCap?.name || option
          return result
        }
        return option?.label || ''
      },
      getOptionBackgroundColor: (option: any) => {
        try {
          // Finde die BusinessCapability und prüfe, ob sie in Diagrammen der aktuellen Architektur dargestellt ist
          const capId = typeof option === 'string' ? option : option?.value

          // Sicherstellen, dass capabilityData und businessCapabilities existieren
          if (!capabilityData?.businessCapabilities) {
            return undefined
          }

          const capability = capabilityData.businessCapabilities.find(
            (cap: any) => cap.id === capId
          )

          // Wenn die Capability nicht gefunden wurde, keine Hintergrundfarbe anwenden
          if (!capability) {
            return undefined
          }

          // Hole die IDs der Diagramme, die zu dieser Architektur gehören
          const architectureDiagramIds = form.getFieldValue('diagramIds') || []

          // Prüfe, ob die Capability in mindestens einem Diagramm dieser Architektur dargestellt ist
          const capabilityDiagramIds = (capability.depictedInDiagrams || []).map(
            (diag: any) => diag.id
          )

          // Schnittmenge zwischen den Diagrammen der Capability und den Diagrammen der Architektur
          const isDepictedInArchitectureDiagrams = capabilityDiagramIds.some((diagId: string) =>
            architectureDiagramIds.includes(diagId)
          )

          // Markiere gelb, wenn die Capability nicht in einem Diagramm dieser Architektur dargestellt ist
          const backgroundColor = !isDepictedInArchitectureDiagrams
            ? theme.palette.warning.light
            : undefined
          return backgroundColor
        } catch (error) {
          console.error('Error in capability getOptionBackgroundColor:', error)
          return undefined
        }
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('containsCapabilityIds'),
    },
    {
      name: 'containsApplicationIds',
      label: t('form.applications'),
      type: 'autocomplete',
      tabId: 'elements',
      multiple: true,
      size: { xs: 12, md: 12 },
      options: (() => {
        const options =
          applicationData?.applications?.map(
            (app: { id: string; name: string }): SelectOption => ({
              value: app.id,
              label: app.name,
            })
          ) || []
        return options
      })(),
      loadingOptions: applicationLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          // Direkte ID - suche passende Option
          const matchingApp = applicationData?.applications?.find(
            (app: { id: string; name: string }) => app.id === option
          )
          const result = matchingApp?.name || option
          return result
        }
        return option?.label || ''
      },
      getOptionBackgroundColor: (option: any) => {
        try {
          // Finde die Application und prüfe, ob sie in Diagrammen der aktuellen Architektur dargestellt ist
          const appId = typeof option === 'string' ? option : option?.value

          // Sicherstellen, dass applicationData und applications existieren
          if (!applicationData?.applications) {
            return undefined
          }

          const app = applicationData.applications.find((app: any) => app.id === appId)

          // Wenn die App nicht gefunden wurde, keine Hintergrundfarbe anwenden
          if (!app) {
            return undefined
          }

          // Hole die IDs der Diagramme, die zu dieser Architektur gehören
          const architectureDiagramIds = form.getFieldValue('diagramIds') || []

          // Prüfe, ob die App in mindestens einem Diagramm dieser Architektur dargestellt ist
          const appDiagramIds = (app.depictedInDiagrams || []).map((diag: any) => diag.id)

          // Schnittmenge zwischen den Diagrammen der App und den Diagrammen der Architektur
          const isDepictedInArchitectureDiagrams = appDiagramIds.some((diagId: string) =>
            architectureDiagramIds.includes(diagId)
          )

          // Markiere gelb, wenn die App nicht in einem Diagramm dieser Architektur dargestellt ist
          const backgroundColor = !isDepictedInArchitectureDiagrams
            ? theme.palette.warning.light
            : undefined
          return backgroundColor
        } catch (error) {
          console.error('Error in application getOptionBackgroundColor:', error)
          return undefined
        }
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
      onChipClick: createChipClickHandler('containsApplicationIds'),
    },
    {
      name: 'containsDataObjectIds',
      label: t('form.dataObjects'),
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
          const result = matchingObj?.name || option
          return result
        }
        return option?.label || ''
      },
      onChipClick: createChipClickHandler('containsDataObjectIds'),
      getOptionBackgroundColor: (option: any) => {
        try {
          // Finde das DataObject und prüfe, ob es in Diagrammen der aktuellen Architektur dargestellt ist
          const objId = typeof option === 'string' ? option : option?.value

          // Sicherstellen, dass dataObjectData existiert
          if (!dataObjectData?.dataObjects) {
            return undefined
          }

          const dataObject = dataObjectData.dataObjects.find((obj: any) => obj.id === objId)

          // Wenn das DataObject nicht gefunden wurde, keine Hintergrundfarbe anwenden
          if (!dataObject) {
            return undefined
          }

          // Hole die IDs der Diagramme, die zu dieser Architektur gehören
          const architectureDiagramIds = form.getFieldValue('diagramIds') || []

          // Prüfe, ob das DataObject in mindestens einem Diagramm dieser Architektur dargestellt ist
          const dataObjectDiagramIds = (dataObject.depictedInDiagrams || []).map(
            (diag: any) => diag.id
          )

          // Schnittmenge zwischen den Diagrammen des DataObjects und den Diagrammen der Architektur
          const isDepictedInArchitectureDiagrams = dataObjectDiagramIds.some((diagId: string) =>
            architectureDiagramIds.includes(diagId)
          )

          // Markiere gelb, wenn das DataObject nicht in einem Diagramm dieser Architektur dargestellt ist
          const backgroundColor = !isDepictedInArchitectureDiagrams
            ? theme.palette.warning.light
            : undefined
          return backgroundColor
        } catch (error) {
          console.error('Error in dataObject getOptionBackgroundColor:', error)
          return undefined
        }
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'containsInterfaceIds',
      label: t('form.interfaces'),
      type: 'autocomplete',
      tabId: 'elements',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        interfaceData?.applicationInterfaces?.map(
          (iface: { id: string; name: string }): SelectOption => ({
            value: iface.id,
            label: iface.name,
          })
        ) || [],
      loadingOptions: interfaceLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInterface = interfaceData?.applicationInterfaces?.find(
            (iface: { id: string; name: string }) => iface.id === option
          )
          const result = matchingInterface?.name || option
          return result
        }
        return option?.label || ''
      },
      onChipClick: createChipClickHandler('containsInterfaceIds'),
      getOptionBackgroundColor: (option: any) => {
        try {
          // Finde die Schnittstelle und prüfe, ob sie in Diagrammen der aktuellen Architektur dargestellt ist
          const ifaceId = typeof option === 'string' ? option : option?.value

          // Sicherstellen, dass interfaceData existiert
          if (!interfaceData?.applicationInterfaces) {
            return undefined
          }

          const iface = interfaceData.applicationInterfaces.find(
            (iface: any) => iface.id === ifaceId
          )

          // Wenn die Schnittstelle nicht gefunden wurde, keine Hintergrundfarbe anwenden
          if (!iface) {
            return undefined
          }

          // Hole die IDs der Diagramme, die zu dieser Architektur gehören
          const architectureDiagramIds = form.getFieldValue('diagramIds') || []

          // Prüfe, ob die Schnittstelle in mindestens einem Diagramm dieser Architektur dargestellt ist
          const interfaceDiagramIds = (iface.depictedInDiagrams || []).map((diag: any) => diag.id)

          // Schnittmenge zwischen den Diagrammen der Schnittstelle und den Diagrammen der Architektur
          const isDepictedInArchitectureDiagrams = interfaceDiagramIds.some((diagId: string) =>
            architectureDiagramIds.includes(diagId)
          )

          // Markiere gelb, wenn die Schnittstelle nicht in einem Diagramm dieser Architektur dargestellt ist
          const backgroundColor = !isDepictedInArchitectureDiagrams
            ? theme.palette.warning.light
            : undefined
          return backgroundColor
        } catch (error) {
          console.error('Error in interface getOptionBackgroundColor:', error)
          return undefined
        }
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'containsInfrastructureIds',
      label: t('form.infrastructure'),
      type: 'autocomplete',
      tabId: 'elements',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        infrastructureData?.infrastructures?.map(
          (infra: Infrastructure): SelectOption => ({
            value: infra.id,
            label: infra.name,
          })
        ) || [],
      loadingOptions: infrastructureLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInfra = infrastructureData?.infrastructures?.find(
            (infra: Infrastructure) => infra.id === option
          )
          const result = matchingInfra?.name || option
          return result
        }
        return option?.label || ''
      },
      onChipClick: createChipClickHandler('containsInfrastructureIds'),
      getOptionBackgroundColor: (option: any) => {
        try {
          // Finde die Infrastruktur und prüfe, ob sie in Diagrammen der aktuellen Architektur dargestellt ist
          const infraId = typeof option === 'string' ? option : option?.value

          // Sicherstellen, dass infrastructureData existiert
          if (!infrastructureData?.infrastructures) {
            return undefined
          }

          const infra = infrastructureData.infrastructures.find(
            (infra: any) => infra.id === infraId
          )

          // Wenn die Infrastruktur nicht gefunden wurde, keine Hintergrundfarbe anwenden
          if (!infra) {
            return undefined
          }

          // Hole die IDs der Diagramme, die zu dieser Architektur gehören
          const architectureDiagramIds = form.getFieldValue('diagramIds') || []

          // Prüfe, ob die Infrastruktur in mindestens einem Diagramm dieser Architektur dargestellt ist
          const infraDiagramIds = (infra.depictedInDiagrams || []).map((diag: any) => diag.id)

          // Schnittmenge zwischen den Diagrammen der Infrastruktur und den Diagrammen der Architektur
          const isDepictedInArchitectureDiagrams = infraDiagramIds.some((diagId: string) =>
            architectureDiagramIds.includes(diagId)
          )

          // Markiere gelb, wenn die Infrastruktur nicht in einem Diagramm dieser Architektur dargestellt ist
          const backgroundColor = !isDepictedInArchitectureDiagrams
            ? theme.palette.warning.light
            : undefined
          return backgroundColor
        } catch (error) {
          console.error('Error in infrastructure getOptionBackgroundColor:', error)
          return undefined
        }
      },
      isOptionEqualToValue: (option: any, value: any) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
  ]

  // Hinweistext für den Tab "Architekturelemente" hinzufügen
  elementsFields.push({
    name: 'elementsNote',
    label: '', // Label leer lassen, um Doppelung zu vermeiden
    type: 'displayText',
    tabId: 'elements',
    size: { xs: 12, md: 12 },
    variant: 'body1',
    sx: {
      marginTop: 3,
      marginBottom: 1,
      color: 'text.primary',
      fontWeight: 'normal',
    },
  })

  // Felder für den dritten Tab (Architektur-Prinzipien)
  const principleFields: FieldConfigWithSelect[] = [
    {
      name: 'appliedPrincipleIds',
      label: t('form.principles'),
      type: 'autocomplete',
      tabId: 'principles',
      multiple: true,
      size: { xs: 12, md: 12 },
      options:
        principleData?.architecturePrinciples?.map(
          (principle: { id: string; name: string; description?: string }): SelectOption => ({
            value: principle.id,
            label: principle.name,
          })
        ) || [],
      loadingOptions: principleLoading,
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingPrinciple = principleData?.architecturePrinciples?.find(
            (principle: { id: string; name: string }) => principle.id === option
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
      onChipClick: createChipClickHandler('appliedPrincipleIds'),
    },
  ]

  // Felder für den vierten Tab (Diagramme)
  const diagramFields: FieldConfigWithSelect[] = [
    {
      name: 'diagramIds',
      label: t('form.diagrams'),
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
      onChipClick: createChipClickHandler('diagramIds'),
    },
  ]

  // Alle Felder zusammenfügen
  const fields: FieldConfigWithSelect[] = [
    ...generalFields,
    ...elementsFields,
    ...principleFields,
    ...diagramFields,
  ]

  // Standardwerte für optionale Props bereitstellen
  const formMode = mode || 'view'
  const formIsOpen = isOpen !== undefined ? isOpen : true
  const formLoading = loading || false
  const handleClose = onClose || (() => {})
  const handleSubmit = onSubmit || (async () => {})

  return (
    <>
      <GenericForm
        title={
          formMode === 'create'
            ? t('form.createTitle')
            : formMode === 'edit'
              ? t('form.editTitle')
              : t('form.viewTitle')
        }
        isOpen={formIsOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={
          formLoading ||
          personLoading ||
          applicationLoading ||
          capabilityLoading ||
          dataObjectLoading ||
          interfaceLoading ||
          infrastructureLoading ||
          diagramLoading ||
          principleLoading
        }
        mode={formMode}
        isNested={isNested}
        fields={fields}
        form={form}
        tabs={tabs}
        enableDelete={formMode === 'edit' && !!architecture && isArchitect()}
        onDelete={architecture?.id && onDelete ? () => onDelete(architecture.id) : undefined}
        onEditMode={onEditMode}
        entityId={architecture?.id}
        entityName={t('form.entityName')}
        metadata={
          architecture
            ? {
                createdAt: architecture.createdAt,
                updatedAt: architecture.updatedAt,
              }
            : undefined
        }
      />

      {/* Nested Capability Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'capabilities' &&
        nestedCapabilityData?.businessCapabilities?.[0] && (
          <CapabilityForm
            data={nestedCapabilityData.businessCapabilities[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Application Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'applications' &&
        nestedApplicationData?.applications?.[0] && (
          <ApplicationForm
            data={nestedApplicationData.applications[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Data Object Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'dataObjects' &&
        nestedDataObjectData?.dataObjects?.[0] && (
          <DataObjectForm
            data={nestedDataObjectData.dataObjects[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Application Interface Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'applicationInterfaces' &&
        nestedInterfaceData?.applicationInterfaces?.[0] && (
          <ApplicationInterfaceForm
            data={nestedInterfaceData.applicationInterfaces[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Infrastructure Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'infrastructures' &&
        nestedInfrastructureData?.infrastructures?.[0] && (
          <InfrastructureForm
            data={nestedInfrastructureData.infrastructures[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Architecture Principle Form */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'architecturePrinciples' &&
        nestedPrincipleData?.architecturePrinciples?.[0] && (
          <ArchitecturePrincipleForm
            data={nestedPrincipleData.architecturePrinciples[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}

      {/* Nested Architecture Form (parent/linked) */}
      {nestedFormState.isOpen &&
        nestedFormState.entityType === 'architectures' &&
        nestedArchitectureData?.architectures?.[0] && (
          <ArchitectureForm
            data={nestedArchitectureData.architectures[0]}
            isOpen={true}
            mode={nestedFormState.mode}
            isNested={true}
            onClose={handleCloseNestedForm}
            onSubmit={async () => {}}
            onDelete={async () => {}}
            loading={false}
          />
        )}
    </>
  )
}

export default ArchitectureForm
