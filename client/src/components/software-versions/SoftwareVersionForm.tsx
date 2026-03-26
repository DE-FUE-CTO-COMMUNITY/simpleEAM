'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { useQuery } from '@apollo/client'
import { sha256 } from 'js-sha256'
import * as d3 from 'd3'
import { Box, Button, Typography } from '@mui/material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
} from '@mui/material'
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import {
  Application,
  Infrastructure,
  LifecycleStatus,
  SoftwareVersion,
  SoftwareProduct,
} from '@/gql/generated'
import { GET_SOFTWARE_PRODUCTS } from '@/graphql/softwareProduct'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { isArchitect } from '@/lib/auth'
import GenericForm, { FieldConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'

const createSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t('nameRequired')).max(100, t('nameMax')),
    version: z.string().max(100, t('versionMax')).optional(),
    releaseChannel: z.string().max(100, t('releaseChannelMax')).optional(),
    supportTier: z.string().max(100, t('supportTierMax')).optional(),
    isLts: z.boolean().optional(),
    softwareProductId: z.string().optional(),
    usedByApplicationIds: z.array(z.string()).optional(),
    usedByInfrastructureIds: z.array(z.string()).optional(),
    lifecycleRecordId: z.string().optional(),
    lifecycleStatus: z.nativeEnum(LifecycleStatus).optional().nullable(),
    gaDate: z.any().optional().nullable(),
    mainstreamSupportEndDate: z.any().optional().nullable(),
    extendedSupportEndDate: z.any().optional().nullable(),
    eosDate: z.any().optional().nullable(),
    eolDate: z.any().optional().nullable(),
    source: z.string().optional().nullable(),
    sourceUrl: z.string().optional().nullable(),
    sourceConfidence: z.number().optional().nullable(),
    lastValidatedAt: z.any().optional().nullable(),
    sbomTouched: z.boolean().optional(),
    sbomMarkedForDeletion: z.boolean().optional(),
    sbomDocumentId: z.string().optional().nullable(),
    sbomFormat: z.string().optional().nullable(),
    sbomVersionValue: z.string().optional().nullable(),
    sbomSourceValue: z.string().optional().nullable(),
    sbomSourceUrlValue: z.string().optional().nullable(),
    sbomGeneratedAt: z.any().optional().nullable(),
    sbomTool: z.string().optional().nullable(),
    sbomDigestValue: z.string().optional().nullable(),
    sbomSummary: z.string().optional().nullable(),
    sbomFileName: z.string().optional().nullable(),
    sbomJson: z.string().optional().nullable(),
  })

export type SoftwareVersionFormValues = z.infer<ReturnType<typeof createSchema>>

interface SbomTreeNode {
  id: string
  name: string
  version: string
  license: string
  children: SbomTreeNode[]
}

const SoftwareVersionForm: React.FC<
  GenericFormProps<SoftwareVersion, SoftwareVersionFormValues>
> = ({ data, isOpen, onClose, onSubmit, onDelete, mode, loading = false, onEditMode }) => {
  const t = useTranslations('softwareVersions.form')
  const tEntity = useTranslations('softwareVersions')
  const tCommon = useTranslations('common')
  const tLifecycle = useTranslations('softwareProducts.lifecycleStatuses')
  const companyWhere = useCompanyWhere('company')
  const [sbomViewerOpen, setSbomViewerOpen] = useState(false)
  const [sbomViewerData, setSbomViewerData] = useState<SbomTreeNode | null>(null)
  const sbomTreeSvgRef = useRef<SVGSVGElement | null>(null)
  const [sbomErrorOpen, setSbomErrorOpen] = useState(false)
  const [sbomErrorMessage, setSbomErrorMessage] = useState('')

  const { data: productsData, loading: productsLoading } = useQuery(GET_SOFTWARE_PRODUCTS, {
    variables: { where: companyWhere },
  })
  const { data: applicationsData, loading: applicationsLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })
  const { data: infrastructuresData, loading: infrastructuresLoading } = useQuery(
    GET_INFRASTRUCTURES,
    {
      variables: { where: companyWhere },
    }
  )

  const products = (productsData?.softwareProducts ?? []) as SoftwareProduct[]
  const productOptions = useMemo(
    () => products.map(product => ({ value: product.id, label: product.name })),
    [products]
  )

  const schema = useMemo(() => createSchema(t), [t])

  const defaultValues = useMemo<SoftwareVersionFormValues>(
    () => ({
      name: '',
      version: '',
      releaseChannel: '',
      supportTier: '',
      isLts: false,
      softwareProductId: '',
      usedByApplicationIds: [],
      usedByInfrastructureIds: [],
      lifecycleRecordId: '',
      lifecycleStatus: null,
      gaDate: null,
      mainstreamSupportEndDate: null,
      extendedSupportEndDate: null,
      eosDate: null,
      eolDate: null,
      source: '',
      sourceUrl: '',
      sourceConfidence: null,
      lastValidatedAt: null,
      sbomTouched: false,
      sbomMarkedForDeletion: false,
      sbomDocumentId: null,
      sbomFormat: null,
      sbomVersionValue: null,
      sbomSourceValue: null,
      sbomSourceUrlValue: null,
      sbomGeneratedAt: null,
      sbomTool: null,
      sbomDigestValue: null,
      sbomSummary: '',
      sbomFileName: null,
      sbomJson: null,
    }),
    []
  )

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset()
      return
    }

    if ((mode === 'view' || mode === 'edit') && data) {
      const lifecycleRecord = data.lifecycleRecords?.[0]
      const sbomDocument = data.sbomDocuments?.[0]
      const sbomSummaryParts = [
        sbomDocument?.format ? `${t('sbomFormat')}: ${sbomDocument.format}` : null,
        sbomDocument?.version ? `${t('sbomVersion')}: ${sbomDocument.version}` : null,
        sbomDocument?.source ? `${t('sbomSource')}: ${sbomDocument.source}` : null,
      ].filter(Boolean)

      form.reset({
        name: data.name ?? '',
        version: data.version ?? '',
        releaseChannel: data.releaseChannel ?? '',
        supportTier: data.supportTier ?? '',
        isLts: data.isLts ?? false,
        softwareProductId: data.softwareProduct?.[0]?.id ?? '',
        usedByApplicationIds: data.usedByApplications?.map(application => application.id) ?? [],
        usedByInfrastructureIds:
          data.usedByInfrastructure?.map(infrastructure => infrastructure.id) ?? [],
        lifecycleRecordId: lifecycleRecord?.id ?? '',
        lifecycleStatus: lifecycleRecord?.lifecycleStatus ?? null,
        gaDate: lifecycleRecord?.gaDate ?? null,
        mainstreamSupportEndDate: lifecycleRecord?.mainstreamSupportEndDate ?? null,
        extendedSupportEndDate: lifecycleRecord?.extendedSupportEndDate ?? null,
        eosDate: lifecycleRecord?.eosDate ?? null,
        eolDate: lifecycleRecord?.eolDate ?? null,
        source: lifecycleRecord?.source ?? '',
        sourceUrl: lifecycleRecord?.sourceUrl ?? '',
        sourceConfidence: lifecycleRecord?.sourceConfidence ?? null,
        lastValidatedAt: lifecycleRecord?.lastValidatedAt ?? null,
        sbomTouched: false,
        sbomMarkedForDeletion: false,
        sbomDocumentId: sbomDocument?.id ?? null,
        sbomFormat: sbomDocument?.format ?? null,
        sbomVersionValue: sbomDocument?.version ?? null,
        sbomSourceValue: sbomDocument?.source ?? null,
        sbomSourceUrlValue: sbomDocument?.sourceUrl ?? null,
        sbomGeneratedAt: sbomDocument?.generatedAt ?? null,
        sbomTool: sbomDocument?.tool ?? null,
        sbomDigestValue: sbomDocument?.digest ?? null,
        sbomSummary:
          sbomSummaryParts.length > 0 ? sbomSummaryParts.join(' | ') : t('noSbomUploaded'),
        sbomFileName: sbomDocument?.source ?? null,
        sbomJson: sbomDocument?.storageReference ?? null,
      })
    }

    if (mode === 'create') {
      form.reset(defaultValues)
    }
  }, [data, defaultValues, form, isOpen, mode])

  const detectSbomFormat = (parsed: unknown): 'CycloneDX' | 'SPDX' | null => {
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    const data = parsed as Record<string, unknown>

    if (data.bomFormat === 'CycloneDX' && typeof data.specVersion === 'string') {
      return 'CycloneDX'
    }

    if (typeof data.spdxVersion === 'string' || typeof data.SPDXID === 'string') {
      return 'SPDX'
    }

    return null
  }

  const calculateSha256 = (rawContent: string): string => {
    return sha256(rawContent)
  }

  const showSbomError = (message: string) => {
    setSbomErrorMessage(message)
    setSbomErrorOpen(true)
  }

  const toDisplayName = (component: Record<string, unknown>): string => {
    const group = typeof component.group === 'string' ? component.group.trim() : ''
    const name = typeof component.name === 'string' ? component.name.trim() : ''

    if (!name) {
      return ''
    }

    return group ? `${group}/${name}` : name
  }

  const toVersion = (component: Record<string, unknown>): string => {
    return typeof component.version === 'string' && component.version.trim()
      ? component.version.trim()
      : '-'
  }

  const toLicense = (component: Record<string, any>): string => {
    if (!Array.isArray(component.licenses) || component.licenses.length === 0) {
      return '-'
    }

    const names = component.licenses
      .map((entry: any) => {
        if (!entry || typeof entry !== 'object') {
          return null
        }

        if (typeof entry.expression === 'string' && entry.expression.trim()) {
          return entry.expression.trim()
        }

        if (entry.license && typeof entry.license === 'object') {
          if (typeof entry.license.id === 'string' && entry.license.id.trim()) {
            return entry.license.id.trim()
          }

          if (typeof entry.license.name === 'string' && entry.license.name.trim()) {
            return entry.license.name.trim()
          }
        }

        return null
      })
      .filter(Boolean)

    return names.length > 0 ? names.join(', ') : '-'
  }

  const buildSbomViewerData = (parsed: unknown): SbomTreeNode | null => {
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    const data = parsed as Record<string, any>

    const componentMap = new Map<
      string,
      { ref: string; name: string; version: string; license: string }
    >()

    if (Array.isArray(data.components)) {
      data.components
        .filter((component: any) => component && typeof component === 'object')
        .forEach((component: Record<string, unknown>) => {
          const ref =
            typeof component['bom-ref'] === 'string'
              ? component['bom-ref']
              : typeof component.SPDXID === 'string'
                ? component.SPDXID
                : null

          const name = toDisplayName(component)
          if (!ref || !name) {
            return
          }

          componentMap.set(ref, {
            ref,
            name,
            version: toVersion(component),
            license: toLicense(component),
          })
        })
    }

    const sortedComponents = Array.from(componentMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    )

    const dependencyMap = new Map<string, string[]>()
    if (Array.isArray(data.dependencies)) {
      data.dependencies
        .filter((dependency: any) => dependency && typeof dependency.ref === 'string')
        .forEach((dependency: Record<string, unknown>) => {
          const ref = dependency.ref as string
          const dependsOn = Array.isArray(dependency.dependsOn)
            ? dependency.dependsOn.filter((depRef: unknown) => typeof depRef === 'string')
            : []
          dependencyMap.set(ref, Array.from(new Set(dependsOn)))
        })
    }

    const metadataComponent =
      data?.metadata?.component && typeof data.metadata.component === 'object'
        ? (data.metadata.component as Record<string, unknown>)
        : null

    const rootName = metadataComponent ? toDisplayName(metadataComponent) : ''

    return {
      id: 'module-root',
      name: rootName || t('viewerRootComponent'),
      version: metadataComponent ? toVersion(metadataComponent) : '-',
      license: metadataComponent ? toLicense(metadataComponent) : '-',
      children: sortedComponents.map(component => {
        const dependencyChildren = (dependencyMap.get(component.ref) || [])
          .map(depRef => {
            const dependencyComponent = componentMap.get(depRef)
            if (dependencyComponent) {
              return {
                id: `${component.ref}::${depRef}`,
                name: dependencyComponent.name,
                version: dependencyComponent.version,
                license: dependencyComponent.license,
                children: [],
              }
            }

            return {
              id: `${component.ref}::${depRef}`,
              name: depRef,
              version: '-',
              license: '-',
              children: [],
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

        return {
          id: component.ref,
          name: component.name,
          version: component.version,
          license: component.license,
          children: dependencyChildren,
        }
      }),
    }
  }

  useEffect(() => {
    if (!sbomViewerOpen || !sbomViewerData || !sbomTreeSvgRef.current) {
      return
    }

    const formatLabel = (value: string, maxLength = 72): string => {
      if (value.length <= maxLength) {
        return value
      }
      return `${value.slice(0, maxLength - 1)}…`
    }

    const nodeSize = 22
    const indent = 26
    let nodeIndex = 0
    const root = d3.hierarchy(sbomViewerData).eachBefore(d => {
      ;(d as any).index = nodeIndex
      nodeIndex += 1
    })
    const nodes = root.descendants()
    const width = 980
    const height = Math.max((nodes.length + 2) * nodeSize, 200)

    const columns = [
      {
        label: t('sbomVersion'),
        x: 690,
        value: (node: d3.HierarchyNode<SbomTreeNode>) => node.data.version,
      },
      {
        label: 'License',
        x: 840,
        value: (node: d3.HierarchyNode<SbomTreeNode>) => node.data.license,
      },
    ]

    const svg = d3
      .select(sbomTreeSvgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; font: 12px sans-serif; overflow: visible;')

    svg.selectAll('*').remove()

    const chart = svg.append('g').attr('transform', 'translate(16,36)')

    chart
      .append('text')
      .attr('x', 4)
      .attr('y', -14)
      .attr('fill', '#5f6b7a')
      .attr('font-weight', 600)
      .text('Name')

    chart
      .selectAll('text.column-header')
      .data(columns)
      .join('text')
      .attr('class', 'column-header')
      .attr('x', column => column.x)
      .attr('y', -14)
      .attr('fill', '#5f6b7a')
      .attr('font-weight', 600)
      .text(column => column.label)

    chart
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#c7ced8')
      .attr('stroke-opacity', 0.9)
      .selectAll('path')
      .data(nodes.slice(1))
      .join('path')
      .attr('d', node => {
        const parent = node.parent
        if (!parent) {
          return ''
        }

        const x = (node as any).index * nodeSize
        const y = node.depth * indent
        const parentX = (parent as any).index * nodeSize
        const parentY = parent.depth * indent

        return `M${parentY},${parentX}V${x}H${y}`
      })

    const nodeGroup = chart
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', node => `translate(${node.depth * indent},${(node as any).index * nodeSize})`)

    nodeGroup
      .append('circle')
      .attr('r', 3)
      .attr('fill', node => (node.depth === 0 ? '#1976d2' : node.depth === 1 ? '#455a64' : '#78909c'))

    nodeGroup
      .append('text')
      .attr('x', 10)
      .attr('dy', '0.32em')
      .attr('fill', '#1f2937')
      .text(node => formatLabel(node.data.name))

    nodeGroup
      .append('text')
      .attr('x', columns[0].x)
      .attr('dy', '0.32em')
      .attr('fill', '#455a64')
      .text(node => columns[0].value(node) || '-')

    nodeGroup
      .append('text')
      .attr('x', columns[1].x)
      .attr('dy', '0.32em')
      .attr('fill', '#455a64')
      .text(node => columns[1].value(node) || '-')

    nodeGroup
      .append('title')
      .text(node => `${node.data.name}\n${t('sbomVersion')}: ${node.data.version}\nLicense: ${node.data.license}`)
  }, [sbomViewerData, sbomViewerOpen, t])

  const inferSbomMetadata = (rawJson: string) => {
    const parsed = JSON.parse(rawJson)
    const detectedFormat = detectSbomFormat(parsed)

    if (!detectedFormat) {
      throw new Error(t('invalidSbomFormat'))
    }

    return {
      inferredFormat: detectedFormat,
      inferredVersion: parsed?.specVersion || parsed?.spdxVersion || parsed?.version || null,
      inferredSbomId:
        parsed?.serialNumber || parsed?.SPDXID || parsed?.bomRef || parsed?.id || null,
      inferredGeneratedAt: parsed?.creationInfo?.created || parsed?.metadata?.timestamp || null,
      inferredTool:
        Array.isArray(parsed?.metadata?.tools) && parsed.metadata.tools.length > 0
          ? parsed.metadata.tools
              .map((tool: any) => tool?.name)
              .filter(Boolean)
              .join(', ')
          : parsed?.creationInfo?.creators?.join(', ') || null,
      inferredDigest:
        parsed?.metadata?.component?.hashes?.[0]?.content ||
        parsed?.packages?.[0]?.checksums?.[0]?.checksumValue ||
        null,
      parsed,
    }
  }

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: t('name'),
      type: 'text',
      required: true,
    },
    {
      name: 'version',
      label: t('version'),
      type: 'text',
    },
    {
      name: 'releaseChannel',
      label: t('releaseChannel'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
        { value: 'STABLE', label: 'Stable' },
        { value: 'LTS', label: 'LTS' },
        { value: 'RC', label: 'Release Candidate' },
        { value: 'BETA', label: 'Beta' },
        { value: 'ALPHA', label: 'Alpha' },
        { value: 'PREVIEW', label: 'Preview' },
      ],
    },
    {
      name: 'supportTier',
      label: t('supportTier'),
      type: 'select',
      options: [
        { value: '', label: t('none') },
        { value: 'STANDARD', label: 'Standard' },
        { value: 'EXTENDED', label: 'Extended' },
        { value: 'PREMIUM', label: 'Premium' },
        { value: 'COMMUNITY', label: 'Community' },
        { value: 'DEPRECATED', label: 'Deprecated' },
        { value: 'END_OF_SUPPORT', label: 'End of Support' },
      ],
    },
    {
      name: 'isLts',
      label: t('isLts'),
      type: 'checkbox',
    },
    {
      name: 'softwareProductId',
      label: t('softwareProduct'),
      type: 'select',
      options: [{ value: '', label: t('none') }, ...productOptions],
      loadingOptions: productsLoading,
      tabId: 'relationships',
    },
    {
      name: 'usedByApplicationIds',
      label: t('usedByApplications'),
      type: 'autocomplete',
      multiple: true,
      options: (applicationsData?.applications || []).map((application: Application) => ({
        value: application.id,
        label: application.name,
      })),
      loadingOptions: applicationsLoading,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingApplication = applicationsData?.applications?.find(
            (application: Application) => application.id === option
          )
          return matchingApplication?.name || option
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
      name: 'usedByInfrastructureIds',
      label: t('usedByInfrastructure'),
      type: 'autocomplete',
      multiple: true,
      options: (infrastructuresData?.infrastructures || []).map(
        (infrastructure: Infrastructure) => ({
          value: infrastructure.id,
          label: infrastructure.name,
        })
      ),
      loadingOptions: infrastructuresLoading,
      tabId: 'relationships',
      getOptionLabel: (option: any) => {
        if (typeof option === 'string') {
          const matchingInfrastructure = infrastructuresData?.infrastructures?.find(
            (infrastructure: Infrastructure) => infrastructure.id === option
          )
          return matchingInfrastructure?.name || option
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
      name: 'lifecycleStatus',
      label: t('lifecycleStatus'),
      type: 'select',
      options: [
        { value: null, label: t('none') },
        { value: LifecycleStatus.SUPPORTED, label: tLifecycle('SUPPORTED') },
        { value: LifecycleStatus.APPROACHING_EOS, label: tLifecycle('APPROACHING_EOS') },
        { value: LifecycleStatus.APPROACHING_EOL, label: tLifecycle('APPROACHING_EOL') },
        { value: LifecycleStatus.EOS, label: tLifecycle('EOS') },
        { value: LifecycleStatus.EOL, label: tLifecycle('EOL') },
        { value: LifecycleStatus.UNSUPPORTED, label: tLifecycle('UNSUPPORTED') },
      ],
      tabId: 'lifecycle',
    },
    {
      name: 'gaDate',
      label: t('gaDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'mainstreamSupportEndDate',
      label: t('mainstreamSupportEndDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'extendedSupportEndDate',
      label: t('extendedSupportEndDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'eosDate',
      label: t('eosDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'eolDate',
      label: t('eolDate'),
      type: 'date',
      tabId: 'lifecycle',
    },
    {
      name: 'source',
      label: t('source'),
      type: 'text',
      tabId: 'lifecycle',
    },
    {
      name: 'sourceUrl',
      label: t('sourceUrl'),
      type: 'text',
      tabId: 'lifecycle',
    },
    {
      name: 'sourceConfidence',
      label: t('sourceConfidence'),
      type: 'number',
      tabId: 'lifecycle',
    },
    {
      name: 'lastValidatedAt',
      label: t('lastValidatedAt'),
      type: 'datetime',
      tabId: 'lifecycle',
    },
    {
      name: 'sbomSummary',
      label: t('currentSbomDocument'),
      type: 'displayText',
      tabId: 'sbom',
      emptyText: t('noSbomUploaded'),
    },
    {
      name: 'sbomFormat',
      label: t('sbomFormat'),
      type: 'select',
      tabId: 'sbom',
      options: [
        { value: '', label: t('none') },
        { value: 'CycloneDX', label: 'CycloneDX' },
        { value: 'SPDX', label: 'SPDX' },
      ],
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomVersionValue',
      label: t('sbomVersion'),
      type: 'text',
      tabId: 'sbom',
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomSourceValue',
      label: t('sbomSource'),
      type: 'text',
      tabId: 'sbom',
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomSourceUrlValue',
      label: t('sbomSourceUrl'),
      type: 'text',
      tabId: 'sbom',
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomGeneratedAt',
      label: t('sbomGeneratedAt'),
      type: 'datetime',
      tabId: 'sbom',
      readOnly: true,
      disabled: true,
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomTool',
      label: t('sbomTool'),
      type: 'select',
      tabId: 'sbom',
      options: [
        { value: '', label: t('none') },
        { value: 'Syft', label: 'Syft' },
        { value: 'Trivy', label: 'Trivy' },
        { value: 'Snyk', label: 'Snyk' },
        { value: 'CycloneDX CLI', label: 'CycloneDX CLI' },
        { value: 'SPDX Tools', label: 'SPDX Tools' },
        { value: 'Dependency-Track', label: 'Dependency-Track' },
        { value: 'Other', label: 'Other' },
      ],
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomDigestValue',
      label: t('sbomDigest'),
      type: 'text',
      tabId: 'sbom',
      readOnly: true,
      disabled: true,
      onChange: () => form.setFieldValue('sbomTouched', true),
    },
    {
      name: 'sbomJson',
      label: t('uploadSbomJson'),
      type: 'custom',
      tabId: 'sbom',
      customRender: (field, disabled) => (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              disabled={disabled}
            >
              {t('uploadSbomJson')}
              <input
                type="file"
                hidden
                accept="application/json,.json"
                onChange={async event => {
                  const file = event.target.files?.[0]
                  if (!file) {
                    return
                  }

                  const fileContent = await file.text()

                  try {
                    const inferred = inferSbomMetadata(fileContent)
                    const generatedDigest = calculateSha256(fileContent)
                    const viewerData = buildSbomViewerData(inferred.parsed)
                    field.handleChange(fileContent)
                    form.setFieldValue('sbomTouched', true)
                    form.setFieldValue('sbomMarkedForDeletion', false)
                    form.setFieldValue('sbomFileName', file.name)
                    form.setFieldValue('sbomFormat', inferred.inferredFormat)
                    form.setFieldValue(
                      'sbomVersionValue',
                      inferred.inferredVersion ? String(inferred.inferredVersion) : null
                    )
                    form.setFieldValue('sbomSourceValue', file.name)
                    form.setFieldValue('sbomSourceUrlValue', null)
                    const fileMetadataTimestamp =
                      Number.isFinite(file.lastModified) && file.lastModified > 0
                        ? new Date(file.lastModified).toISOString()
                        : null

                    form.setFieldValue(
                      'sbomGeneratedAt',
                      fileMetadataTimestamp || inferred.inferredGeneratedAt
                    )
                    form.setFieldValue('sbomTool', inferred.inferredTool)
                    form.setFieldValue(
                      'sbomDigestValue',
                      inferred.inferredDigest || generatedDigest
                    )
                    form.setFieldValue('sbomSummary', `${t('uploadedFile')}: ${file.name}`)
                    setSbomViewerData(viewerData)
                  } catch (error) {
                    showSbomError(error instanceof Error ? error.message : t('invalidSbomJson'))
                  }

                  event.target.value = ''
                }}
              />
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const rawJson = field.state.value
                if (!rawJson) {
                  return
                }

                const fileName = form.getFieldValue('sbomFileName') || 'sbom.json'
                const blob = new Blob([rawJson], { type: 'application/json;charset=utf-8' })
                const objectUrl = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = objectUrl
                link.download = fileName
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(objectUrl)
              }}
              disabled={!field.state.value}
            >
              {t('downloadSbomJson')}
            </Button>

            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => {
                const rawJson = field.state.value
                if (!rawJson) {
                  return
                }

                try {
                  const parsed = JSON.parse(rawJson)
                  const detectedFormat = detectSbomFormat(parsed)

                  if (!detectedFormat) {
                    showSbomError(t('invalidSbomFormat'))
                    return
                  }

                  form.setFieldValue('sbomFormat', detectedFormat)
                  const viewerData = buildSbomViewerData(parsed)
                  setSbomViewerData(viewerData)
                  setSbomViewerOpen(true)
                } catch {
                  showSbomError(t('invalidSbomJson'))
                }
              }}
              disabled={!field.state.value}
            >
              {t('viewSbomContent')}
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={disabled || !form.getFieldValue('sbomDocumentId')}
              onClick={() => {
                form.setFieldValue('sbomTouched', true)
                form.setFieldValue('sbomMarkedForDeletion', true)
                form.setFieldValue('sbomDocumentId', null)
                form.setFieldValue('sbomFormat', null)
                form.setFieldValue('sbomVersionValue', null)
                form.setFieldValue('sbomSourceValue', null)
                form.setFieldValue('sbomSourceUrlValue', null)
                form.setFieldValue('sbomGeneratedAt', null)
                form.setFieldValue('sbomTool', null)
                form.setFieldValue('sbomDigestValue', null)
                form.setFieldValue('sbomFileName', null)
                form.setFieldValue('sbomJson', null)
                form.setFieldValue('sbomSummary', t('noSbomUploaded'))
              }}
            >
              {t('deleteSbom')}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {t('sbomUploadHint')}
          </Typography>
        </Box>
      ),
    },
  ]

  return (
    <>
      <GenericForm
        form={form}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => form.handleSubmit()}
        enableDelete={mode === 'edit' && !!data && isArchitect()}
        onDelete={data?.id && onDelete ? () => onDelete(data.id) : undefined}
        mode={mode}
        isLoading={loading}
        onEditMode={onEditMode}
        title={
          mode === 'create'
            ? tEntity('createTitle')
            : mode === 'edit'
              ? tEntity('editTitle')
              : tEntity('viewTitle')
        }
        fields={fields}
        tabs={[
          { id: 'general', label: tEntity('tabs.general') },
          { id: 'relationships', label: tEntity('tabs.relationships') },
          { id: 'lifecycle', label: tEntity('tabs.lifecycle') },
          { id: 'sbom', label: tEntity('tabs.sbom') },
        ]}
        submitButtonText={tCommon('save')}
        cancelButtonText={tCommon('cancel')}
        deleteButtonText={tCommon('delete')}
        deleteConfirmationText={tEntity('deleteConfirmation')}
      />

      <Dialog
        open={sbomViewerOpen}
        onClose={() => setSbomViewerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {t('sbomContentTitle')}
          <IconButton aria-label={t('closeSbomViewer')} onClick={() => setSbomViewerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {sbomViewerData ? (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <svg ref={sbomTreeSvgRef} role="img" aria-label={t('sbomContentTitle')} />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('noSbomUploaded')}
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={sbomErrorOpen} onClose={() => setSbomErrorOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('sbomValidationErrorTitle')}</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 1 }}>
            {sbomErrorMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSbomErrorOpen(false)}>{tCommon('close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SoftwareVersionForm
