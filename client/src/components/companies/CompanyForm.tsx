'use client'

import React, { useEffect } from 'react'
import { Box, TextField, MenuItem } from '@mui/material'
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

// LLM Provider configuration
interface LlmProviderConfig {
  key: string
  name: string
  url: string
  fixedUrl: boolean
  models: string[]
}

const LLM_PROVIDERS: LlmProviderConfig[] = [
  {
    key: 'openai',
    name: 'OpenAI',
    url: 'https://api.openai.com/v1',
    fixedUrl: true,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo', 'o1', 'o1-mini', 'o3-mini'],
  },
  {
    key: 'anthropic',
    name: 'Anthropic',
    url: 'https://api.anthropic.com',
    fixedUrl: true,
    models: [
      'claude-opus-4-5',
      'claude-sonnet-4-5',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
    ],
  },
  {
    key: 'google',
    name: 'Google Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta',
    fixedUrl: true,
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  {
    key: 'azure',
    name: 'Azure OpenAI',
    url: '',
    fixedUrl: true,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-35-turbo'],
  },
  {
    key: 'mistral',
    name: 'Mistral AI',
    url: 'https://api.mistral.ai/v1',
    fixedUrl: true,
    models: [
      'mistral-large-latest',
      'mistral-medium-latest',
      'mistral-small-latest',
      'open-mistral-7b',
    ],
  },
  {
    key: 'xai',
    name: 'xAI (Grok)',
    url: 'https://api.x.ai/v1',
    fixedUrl: true,
    models: ['grok-3-latest', 'grok-2-latest', 'grok-beta'],
  },
  {
    key: 'deepseek',
    name: 'DeepSeek',
    url: 'https://api.deepseek.com/v1',
    fixedUrl: true,
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  {
    key: 'others',
    name: 'Others',
    url: '',
    fixedUrl: false,
    models: [],
  },
]

const normalizeUrl = (url: string) => url.replace(/\/$/, '')

const deriveProviderFromUrl = (url?: string | null): string => {
  if (!url) return ''
  const normalized = normalizeUrl(url)
  const exactMatch = LLM_PROVIDERS.find(
    p => p.fixedUrl && p.url && normalizeUrl(p.url) === normalized
  )
  if (exactMatch) return exactMatch.key
  if (normalized.includes('.openai.azure.com')) return 'azure'
  return 'others'
}
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
  llmUrl: z.string().url().optional().or(z.literal('')),
  llmModel: z.string().max(200).optional().or(z.literal('')),
  llmKey: z.string().max(500).optional().or(z.literal('')),
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
      llmUrl: '',
      llmModel: '',
      llmKey: '',
    }),
    []
  )

  const [lensFlags, setLensFlags] = React.useState<LensFlags>(() => buildDefaultLensFlags())
  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlags>(() =>
    buildDefaultFeatureFlags()
  )

  const [currentLlmProvider, setCurrentLlmProvider] = React.useState<string>('')
  const [currentLlmModel, setCurrentLlmModel] = React.useState<string>('')
  const [currentLlmKey, setCurrentLlmKey] = React.useState<string>('')
  const [isCustomModel, setIsCustomModel] = React.useState<boolean>(false)

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
      form.setFieldValue('llmUrl', company.llmUrl || '')
      form.setFieldValue('llmModel', company.llmModel || '')
      form.setFieldValue('llmKey', company.llmKey || '')
      const derivedProvider = deriveProviderFromUrl(company.llmUrl)
      setCurrentLlmProvider(derivedProvider)
      setCurrentLlmModel(company.llmModel || '')
      setCurrentLlmKey(company.llmKey || '')
      const derivedProviderConfig = LLM_PROVIDERS.find(p => p.key === derivedProvider)
      setIsCustomModel(
        !!(
          company.llmModel &&
          derivedProvider !== 'others' &&
          derivedProviderConfig &&
          !derivedProviderConfig.models.includes(company.llmModel)
        )
      )
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
      setCurrentLlmProvider('')
      setCurrentLlmModel('')
      setCurrentLlmKey('')
      setIsCustomModel(false)
    }
  }, [applyFeatureDependencies, company, form, updateFeaturesValue])

  // Render function for the LLM Config tab section
  const renderLlmConfig = React.useCallback(
    (field: any, disabled: boolean): React.ReactNode => {
      const providerConfig = LLM_PROVIDERS.find(p => p.key === currentLlmProvider)
      const showUrlField = !providerConfig?.fixedUrl && currentLlmProvider !== ''
      const hasKnownModels = !!(providerConfig && providerConfig.models.length > 0)
      const showModelSelect = hasKnownModels && !isCustomModel

      const handleProviderChange = (newProvider: string) => {
        setCurrentLlmProvider(newProvider)
        setCurrentLlmModel('')
        setCurrentLlmKey('')
        setIsCustomModel(false)
        form.setFieldValue('llmModel', '')
        form.setFieldValue('llmKey', '')
        const newProviderConfig = LLM_PROVIDERS.find(p => p.key === newProvider)
        const newUrl =
          newProvider === '' ? '' : newProviderConfig?.fixedUrl ? newProviderConfig.url : ''
        field.handleChange(newUrl)
      }

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Provider select */}
          <TextField
            select
            label={t('form.llmProvider')}
            value={currentLlmProvider}
            onChange={e => handleProviderChange(e.target.value)}
            disabled={disabled}
            fullWidth
            helperText={t('form.llmProviderHelperText')}
          >
            <MenuItem value="">
              <em>{t('form.selectProvider')}</em>
            </MenuItem>
            {LLM_PROVIDERS.map(p => (
              <MenuItem key={p.key} value={p.key}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Remaining fields only shown once a provider is selected */}
          {currentLlmProvider && (
            <>
              {/* URL: only for non-fixed-url providers (Azure, Others) */}
              {showUrlField && (
                <TextField
                  label={t('form.llmUrl')}
                  value={field.state.value || ''}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={disabled}
                  fullWidth
                  helperText={t('form.llmUrlHelperText')}
                />
              )}

              {/* Model: dropdown for known providers, text for Others / custom */}
              {showModelSelect ? (
                <TextField
                  select
                  label={t('form.llmModel')}
                  value={currentLlmModel}
                  onChange={e => {
                    const val = e.target.value
                    if (val === '__custom__') {
                      setIsCustomModel(true)
                      setCurrentLlmModel('')
                      form.setFieldValue('llmModel', '')
                    } else {
                      setCurrentLlmModel(val)
                      form.setFieldValue('llmModel', val)
                    }
                  }}
                  disabled={disabled}
                  fullWidth
                  helperText={t('form.llmModelHelperText')}
                >
                  {providerConfig!.models.map(model => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                  <MenuItem value="__custom__">
                    <em>{t('form.otherModel')}</em>
                  </MenuItem>
                </TextField>
              ) : (
                <TextField
                  label={t('form.llmModel')}
                  value={currentLlmModel}
                  onChange={e => {
                    setCurrentLlmModel(e.target.value)
                    form.setFieldValue('llmModel', e.target.value)
                  }}
                  disabled={disabled}
                  fullWidth
                  helperText={t('form.llmModelHelperText')}
                />
              )}

              {/* API Key — always a password text field */}
              <TextField
                label={t('form.llmKey')}
                type="password"
                value={currentLlmKey}
                onChange={e => {
                  setCurrentLlmKey(e.target.value)
                  form.setFieldValue('llmKey', e.target.value)
                }}
                disabled={disabled}
                fullWidth
                helperText={t('form.llmKeyHelperText')}
              />
            </>
          )}
        </Box>
      )
    },
    [
      currentLlmProvider,
      currentLlmModel,
      currentLlmKey,
      isCustomModel,
      form,
      t,
      setCurrentLlmProvider,
      setCurrentLlmModel,
      setCurrentLlmKey,
      setIsCustomModel,
    ]
  )

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
    // LLM Config section — single custom field drives the full provider UI
    {
      name: 'llmUrl',
      label: '',
      type: 'custom',
      tabId: 'llmConfig',
      customRender: renderLlmConfig,
    },
  ]

  // Tab-Konfigurationen definieren
  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'branding', label: t('tabs.branding') },
    { id: 'employees', label: t('tabs.employees') },
    { id: 'features', label: t('tabs.features') },
    { id: 'llmConfig', label: t('tabs.llmConfig') },
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
