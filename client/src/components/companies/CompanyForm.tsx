'use client'

import React, { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useQuery } from '@apollo/client'
import { z } from 'zod'
import { CompanyType, CompanyFormValues, EXCALIDRAW_FONTS, ExcalidrawFont } from './types'
import { CompanySize, Person } from '../../gql/generated'
import { GET_PERSONS } from '@/graphql/person'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { isArchitect } from '@/lib/auth'
import FeatureManagement from '@/components/admin/FeatureManagement'
import {
  buildDefaultFeatureFlags,
  buildDefaultLensFlags,
  parseCompanyFeatures,
  serializeCompanyFeatures,
} from '@/lib/company-features'
import type { FeatureFlags, LensFlags } from '@/lib/feature-definitions'

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/
const DEFAULT_DIAGRAM_FONT: ExcalidrawFont = 'Excalifont'
const getFontPreviewFamily = (font: string) =>
  `"${font}", "Segoe UI", "Nunito", "Helvetica Neue", sans-serif`

const normalizeDiagramFont = (font?: string | null): ExcalidrawFont => {
  if (font && (EXCALIDRAW_FONTS as readonly string[]).includes(font)) {
    return font as ExcalidrawFont
  }

  return DEFAULT_DIAGRAM_FONT
}

// Schema for form validation (export for external use)
export const companySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000).optional(),
  address: z.string().max(500).optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  size: z.nativeEnum(CompanySize).optional(),
  employees: z.array(z.string()).optional(),
  primaryColor: z.string().regex(HEX_COLOR_REGEX).optional().or(z.literal('')),
  secondaryColor: z.string().regex(HEX_COLOR_REGEX).optional().or(z.literal('')),
  font: z.string().max(200).optional().or(z.literal('')),
  diagramFont: z.enum(EXCALIDRAW_FONTS).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  features: z.string().optional().or(z.literal('')),
})

const CompaniesForm: React.FC<GenericFormProps<CompanyType, CompanyFormValues>> = ({
  data: company,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('companies')
  const tForms = useTranslations('forms')
  const tCommon = useTranslations('common')

  // Admin sollte alle Personen sehen können, nicht nur die der aktuellen Company
  // For the company form we load all available persons
  const { data: personsData, loading: personsLoading } = useQuery(GET_PERSONS, {
    variables: { where: {} }, // Keine Filterung - alle Personen laden
  })

  // Initialize form data with useMemo
  const defaultValues = React.useMemo<CompanyFormValues>(
    () => ({
      name: '',
      description: '',
      address: '',
      industry: '',
      website: '',
      size: undefined,
      employees: [],
      primaryColor: '',
      secondaryColor: '',
      font: '',
      diagramFont: DEFAULT_DIAGRAM_FONT,
      logo: '',
      features: serializeCompanyFeatures(buildDefaultLensFlags(), buildDefaultFeatureFlags()),
    }),
    []
  )

  const [lensFlags, setLensFlags] = React.useState<LensFlags>(() => buildDefaultLensFlags())
  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlags>(() =>
    buildDefaultFeatureFlags()
  )

  const applyFeatureDependencies = React.useCallback(
    (
      nextLensFlags: LensFlags,
      nextFeatureFlags: FeatureFlags,
      previousFeatureFlags?: FeatureFlags
    ) => {
      const normalizedFeatureFlags: FeatureFlags = { ...nextFeatureFlags }

      if (normalizedFeatureFlags.GEA && normalizedFeatureFlags.AMO) {
        const geaChanged =
          previousFeatureFlags && previousFeatureFlags.GEA !== normalizedFeatureFlags.GEA
        const amoChanged =
          previousFeatureFlags && previousFeatureFlags.AMO !== normalizedFeatureFlags.AMO

        if (geaChanged && normalizedFeatureFlags.GEA) {
          normalizedFeatureFlags.AMO = false
        } else if (amoChanged && normalizedFeatureFlags.AMO) {
          normalizedFeatureFlags.GEA = false
        } else {
          normalizedFeatureFlags.AMO = false
        }
      }

      const normalizedLensFlags: LensFlags = { ...nextLensFlags }
      const requiresBusinessArchitectureLens =
        normalizedFeatureFlags.GEA || normalizedFeatureFlags.BMC || normalizedFeatureFlags.BCA
      const requiresTechnologyManagementLens = normalizedFeatureFlags.Sovereignty

      if (requiresBusinessArchitectureLens) {
        normalizedLensFlags.businessArchitecture = true
      }

      if (requiresTechnologyManagementLens) {
        normalizedLensFlags.technologyManagement = true
      }

      return {
        lensFlags: normalizedLensFlags,
        featureFlags: normalizedFeatureFlags,
      }
    },
    []
  )

  const diagramFontOptions = React.useMemo(
    () =>
      EXCALIDRAW_FONTS.map(font => ({
        value: font,
        label: font,
        style: { fontFamily: getFontPreviewFamily(font) },
      })),
    []
  )

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        try {
          const result = await onSubmit(value)
          return result
        } catch (error) {
          console.error('💥 onSubmit prop threw error:', error)
          throw error
        }
      }
    },
  })

  const updateFeaturesValue = React.useCallback(
    (nextLensFlags: LensFlags, nextFeatureFlags: FeatureFlags) => {
      const json = serializeCompanyFeatures(nextLensFlags, nextFeatureFlags)
      form.setFieldValue('features', json)
    },
    [form]
  )

  // Update form data when entity changes
  useEffect(() => {
    if (company) {
      const parsedFeatures = parseCompanyFeatures(company.features)
      const normalized = applyFeatureDependencies(
        parsedFeatures.lensFlags,
        parsedFeatures.featureFlags
      )
      setLensFlags(normalized.lensFlags)
      setFeatureFlags(normalized.featureFlags)
      updateFeaturesValue(normalized.lensFlags, normalized.featureFlags)
      form.setFieldValue('name', company.name || '')
      form.setFieldValue('description', company.description || '')
      form.setFieldValue('address', company.address || '')
      form.setFieldValue('industry', company.industry || '')
      form.setFieldValue('website', company.website || '')
      form.setFieldValue('size', company.size || undefined)
      form.setFieldValue('primaryColor', company.primaryColor || '')
      form.setFieldValue('secondaryColor', company.secondaryColor || '')
      form.setFieldValue('font', company.font || '')
      form.setFieldValue('diagramFont', normalizeDiagramFont(company.diagramFont))
      form.setFieldValue('logo', company.logo || '')
      form.setFieldValue(
        'employees',
        (company as any).employees?.map((emp: Person) => emp.id) || []
      )
    } else {
      const parsedFeatures = parseCompanyFeatures('')
      const normalized = applyFeatureDependencies(
        parsedFeatures.lensFlags,
        parsedFeatures.featureFlags
      )
      setLensFlags(normalized.lensFlags)
      setFeatureFlags(normalized.featureFlags)
      updateFeaturesValue(normalized.lensFlags, normalized.featureFlags)
    }
  }, [applyFeatureDependencies, company, form, updateFeaturesValue])

  // Feldkonfigurationen definieren
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('form.name'),
      type: 'text',
      required: true,
      tabId: 'general',
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (!value || value.length < 3) {
            return tForms('validation.minLength', { count: 3 })
          }
          if (value.length > 100) {
            return tForms('validation.maxLength', { count: 100 })
          }
          return undefined
        },
      },
    },
    {
      name: 'description',
      label: t('form.description'),
      type: 'textarea',
      required: true,
      tabId: 'general',
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (!value || value.length < 10) {
            return tForms('validation.minLength', { count: 10 })
          }
          if (value.length > 1000) {
            return tForms('validation.maxLength', { count: 1000 })
          }
          return undefined
        },
      },
    },
    {
      name: 'address',
      label: t('form.address'),
      type: 'textarea',
      required: false,
      tabId: 'general',
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value.length > 500) {
            return tForms('validation.maxLength', { count: 500 })
          }
          return undefined
        },
      },
    },
    {
      name: 'industry',
      label: t('form.industry'),
      type: 'text',
      required: false,
      tabId: 'general',
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value.length > 100) {
            return tForms('validation.maxLength', { count: 100 })
          }
          return undefined
        },
      },
    },
    {
      name: 'website',
      label: t('form.website'),
      type: 'text',
      required: false,
      tabId: 'general',
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value !== '') {
            try {
              new URL(value.startsWith('http') ? value : `https://${value}`)
            } catch {
              return tForms('validation.url')
            }
          }
          return undefined
        },
      },
    },
    {
      name: 'size',
      label: t('form.size'),
      type: 'select',
      required: false,
      tabId: 'general',
      options: Object.values(CompanySize).map(size => ({
        value: size,
        label: size.charAt(0) + size.slice(1).toLowerCase(),
      })),
    },
    {
      name: 'primaryColor',
      label: t('form.primaryColor'),
      type: 'text',
      required: false,
      tabId: 'branding',
      placeholder: '#0A66FF',
      helperText: t('form.primaryColorHelperText'),
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && !HEX_COLOR_REGEX.test(value)) {
            return tForms('validation.hexColor')
          }
          return undefined
        },
      },
    },
    {
      name: 'secondaryColor',
      label: t('form.secondaryColor'),
      type: 'text',
      required: false,
      tabId: 'branding',
      placeholder: '#172B4D',
      helperText: t('form.secondaryColorHelperText'),
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && !HEX_COLOR_REGEX.test(value)) {
            return tForms('validation.hexColor')
          }
          return undefined
        },
      },
    },
    {
      name: 'font',
      label: t('form.font'),
      type: 'text',
      required: false,
      tabId: 'branding',
      helperText: t('form.fontHelperText'),
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value.length > 200) {
            return tForms('validation.maxLength', { count: 200 })
          }
          return undefined
        },
      },
    },
    {
      name: 'diagramFont',
      label: t('form.diagramFont'),
      type: 'select',
      required: false,
      tabId: 'branding',
      helperText: t('form.diagramFontHelperText'),
      options: diagramFontOptions,
      selectRenderValue: (value, option) => {
        const fontName = (option?.value as string) || (value as string) || DEFAULT_DIAGRAM_FONT
        const label = option?.label || value || t('form.diagramFont')
        return <span style={{ fontFamily: getFontPreviewFamily(fontName) }}>{label}</span>
      },
    },
    {
      name: 'logo',
      label: t('form.logo'),
      type: 'text',
      required: false,
      tabId: 'branding',
      helperText: t('form.logoHelperText'),
      validators: {
        onChange: ({ value }: { value: string }) => {
          if (value && value !== '') {
            try {
              new URL(value.startsWith('http') ? value : `https://${value}`)
            } catch {
              return tForms('validation.url')
            }
          }
          return undefined
        },
      },
    },
    // Mitarbeiter-Feld (Tab: employees)
    {
      name: 'employees',
      label: t('form.employees'),
      type: 'autocomplete',
      tabId: 'employees',
      multiple: true,
      options: (personsData?.people || []).map((person: Person) => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName}`,
      })),
      loadingOptions: personsLoading,
      size: { xs: 12 },
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingPerson = personsData?.people?.find((person: Person) => person.id === option)
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
      helperText: t('form.employeesHelperText'),
    },
    {
      name: 'features',
      label: t('tabs.features'),
      type: 'custom',
      tabId: 'features',
      customRender: (_field, disabled) => (
        <FeatureManagement
          lensFlags={lensFlags}
          featureFlags={featureFlags}
          onLensFlagsChange={next => {
            const normalized = applyFeatureDependencies(next, featureFlags, featureFlags)
            setLensFlags(normalized.lensFlags)
            setFeatureFlags(normalized.featureFlags)
            updateFeaturesValue(normalized.lensFlags, normalized.featureFlags)
          }}
          onFeatureFlagsChange={next => {
            const normalized = applyFeatureDependencies(lensFlags, next, featureFlags)
            setLensFlags(normalized.lensFlags)
            setFeatureFlags(normalized.featureFlags)
            updateFeaturesValue(normalized.lensFlags, normalized.featureFlags)
          }}
          disabled={disabled}
        />
      ),
    },
  ]

  // Tab-Konfigurationen definieren
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'branding', label: t('tabs.branding') },
    { id: 'employees', label: t('tabs.employees') },
    { id: 'features', label: t('tabs.features') },
  ]

  return (
    <GenericForm
      form={form}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => {
        console.error(
          '⚠️ GenericForm onSubmit called - this should not happen because TanStack Form handles it'
        )
      }}
      enableDelete={mode === 'edit' && !!company && isArchitect()}
      onDelete={company?.id && onDelete ? () => onDelete(company.id) : undefined}
      mode={mode}
      isLoading={loading}
      onEditMode={onEditMode}
      entityId={company?.id}
      entityName={t('entityName' as any)}
      title={
        mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
      }
      fields={fields}
      tabs={tabs}
      submitButtonText={tCommon('save')}
      cancelButtonText={tCommon('cancel')}
      deleteButtonText={tCommon('delete')}
      deleteConfirmationText={t('deleteConfirmation')}
    />
  )
}

export default CompaniesForm
