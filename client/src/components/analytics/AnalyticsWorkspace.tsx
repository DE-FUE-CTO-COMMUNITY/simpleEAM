'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { toPng } from 'html-to-image'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip as MuiTooltip,
  Typography,
} from '@mui/material'
import { Add, Download, FolderOpenOutlined, FolderOutlined, Sync } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sankey,
  Treemap,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { isAdmin } from '@/lib/auth'
import { useAnalyticsConfig } from '@/lib/runtime-config'

import {
  AnalyticsChartDatum,
  AnalyticsDraftReport,
  AnalyticsPreviewRecord,
  AnalyticsReportFolderDefinition,
  AnalyticsReportDefinition,
  AnalyticsReportScope,
  analyticsChartTypes,
  analyticsCurrencyMeasures,
  analyticsElementTypes,
  analyticsSchemaByElementType,
} from './types'
import {
  createAnalyticsReport,
  createReportFolder,
  deleteAnalyticsReport,
  deleteReportFolder,
  listAnalyticsReports,
  listReportFolders,
  queryAnalyticsPreview,
  syncAnalyticsProjection,
  updateAnalyticsReport,
  updateReportFolder,
} from './api'
import { exportToExcel } from '@/utils/excelUtils'

const chartColors = ['#00796B', '#F57C00', '#455A64', '#D84315', '#546E7A', '#00838F']
const analyticsReportScopeStorageKey = 'analytics-report-scope'
const analyticsCollapsedFoldersStorageKey = 'analytics-collapsed-folders'

interface FolderDialogState {
  readonly mode: 'create' | 'edit' | 'delete'
  readonly folder: AnalyticsReportFolderDefinition | null
  readonly parentId: string | null
  readonly name: string
}

interface FolderOption {
  readonly id: string
  readonly label: string
}

interface NotificationState {
  readonly message: string
  readonly severity: 'success' | 'error'
}

type AnalyticsPreviewTab = 'chart' | 'records'

interface CartesianSeriesDefinition {
  readonly key: string
  readonly label: string
  readonly color: string
}

interface CartesianChartModel {
  readonly rows: Array<Record<string, string | number>>
  readonly series: CartesianSeriesDefinition[]
  readonly hasSecondarySeries: boolean
}

interface TreemapNode {
  readonly name: string
  readonly size?: number
  readonly fill?: string
  readonly primaryName?: string
  readonly secondaryName?: string
  readonly children?: TreemapNode[]
}

interface TreemapNodeShapeProps {
  readonly x?: number
  readonly y?: number
  readonly width?: number
  readonly height?: number
  readonly depth?: number
  readonly index?: number
  readonly name?: string
  readonly fill?: string
  readonly primaryName?: string
  readonly secondaryName?: string
  readonly children?: TreemapNode[]
  readonly payload?: TreemapNode
}

interface SankeyNode {
  readonly name: string
}

interface SankeyLink {
  readonly source: number
  readonly target: number
  readonly value: number
}

interface SankeyChartModel {
  readonly nodes: SankeyNode[]
  readonly links: SankeyLink[]
}

interface SankeyNodeShapeProps {
  readonly x?: number
  readonly y?: number
  readonly width?: number
  readonly height?: number
  readonly index?: number
  readonly payload?: {
    readonly name?: string
  }
  readonly depth?: number
}

const chartTypesRequiringSecondDimension: readonly AnalyticsDraftReport['chartType'][] = [
  'groupedBar',
  'stackedArea',
  'treemap',
  'sankey',
]

function requiresSecondDimension(chartType: AnalyticsDraftReport['chartType']) {
  return chartTypesRequiringSecondDimension.includes(chartType)
}

function pickDefaultSecondDimension(
  dimensions: readonly AnalyticsDraftReport['dimension'][],
  primaryDimension: AnalyticsDraftReport['dimension']
) {
  return dimensions.find(dimension => dimension !== primaryDimension) ?? null
}

function getChartMinHeight(chartType: AnalyticsDraftReport['chartType']) {
  if (chartType === 'pie' || chartType === 'treemap' || chartType === 'sankey') {
    return 400
  }

  return 320
}

function getAllowedPrimaryDimensions(
  chartType: AnalyticsDraftReport['chartType'],
  dimensions: readonly AnalyticsDraftReport['dimension'][]
) {
  if (chartType === 'stackedArea' && dimensions.includes('month')) {
    return dimensions.filter(dimension => dimension === 'month')
  }

  return [...dimensions]
}

function getAllowedSecondDimensions(
  chartType: AnalyticsDraftReport['chartType'],
  dimensions: readonly AnalyticsDraftReport['dimension'][],
  primaryDimension: AnalyticsDraftReport['dimension']
) {
  if (chartType === 'pie') {
    return []
  }

  if (chartType === 'stackedArea') {
    return dimensions.filter(dimension => dimension !== 'month')
  }

  return dimensions.filter(dimension => dimension !== primaryDimension)
}

function getAllowedMeasures(
  chartType: AnalyticsDraftReport['chartType'],
  measures: readonly AnalyticsDraftReport['measure'][]
) {
  if (chartType === 'sankey') {
    return measures.filter(measure => measure === 'count')
  }

  return [...measures]
}

function renderSankeyNode(props: SankeyNodeShapeProps) {
  const x = props.x ?? 0
  const y = props.y ?? 0
  const width = props.width ?? 0
  const height = props.height ?? 0
  const index = props.index ?? 0
  const label = props.payload?.name ?? ''
  const isTargetColumn = (props.depth ?? 0) > 0
  const textX = isTargetColumn ? x + width + 8 : x - 8
  const textAnchor = isTargetColumn ? 'start' : 'end'

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={chartColors[index % chartColors.length]} />
      <text x={textX} y={y + height / 2} textAnchor={textAnchor} dominantBaseline="middle" fontSize={12}>
        {label}
      </text>
    </g>
  )
}

function createDefaultDraft(): AnalyticsDraftReport {
  return {
    id: null,
    name: '',
    isPublic: false,
    elementType: 'application',
    chartType: 'bar',
    dimension: 'status',
    secondDimension: null,
    measure: 'count',
    folderId: null,
  }
}

function sortReports(reports: readonly AnalyticsReportDefinition[]) {
  return [...reports].sort((left, right) =>
    (right.updatedAt ?? '').localeCompare(left.updatedAt ?? '')
  )
}

function sortFolders(folders: readonly AnalyticsReportFolderDefinition[]) {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name))
}

function applyFillOpacity(hexColor: string, opacity: string) {
  return `${hexColor}${opacity}`
}

function buildFolderOptions(
  folders: readonly AnalyticsReportFolderDefinition[],
  parentId: string | null = null,
  depth = 0
): FolderOption[] {
  const directChildren = sortFolders(
    folders.filter(folder => (folder.parentId ?? null) === parentId)
  )

  return directChildren.flatMap(folder => [
    {
      id: folder.id,
      label: `${'  '.repeat(depth)}${depth > 0 ? '↳ ' : ''}${folder.name}`,
    },
    ...buildFolderOptions(folders, folder.id, depth + 1),
  ])
}

function buildCartesianChartModel(data: AnalyticsChartDatum[]): CartesianChartModel {
  const hasSecondarySeries = data.some(entry => Boolean(entry.series))
  const rowsByLabel = new Map<string, Record<string, string | number>>()
  const seriesKeysByLabel = new Map<string, string>()
  const series: CartesianSeriesDefinition[] = []

  data.forEach(entry => {
    const seriesLabel = hasSecondarySeries ? (entry.series ?? 'UNSPECIFIED') : 'Value'
    let seriesKey = seriesKeysByLabel.get(seriesLabel)

    if (!seriesKey) {
      seriesKey = hasSecondarySeries ? `series${series.length}` : 'value'
      seriesKeysByLabel.set(seriesLabel, seriesKey)
      series.push({
        key: seriesKey,
        label: seriesLabel,
        color: chartColors[series.length % chartColors.length],
      })
    }

    const row = rowsByLabel.get(entry.label) ?? { label: entry.label }
    row[seriesKey] = entry.value
    rowsByLabel.set(entry.label, row)
  })

  return {
    rows: Array.from(rowsByLabel.values()),
    series,
    hasSecondarySeries,
  }
}

function buildTreemapChartModel(data: AnalyticsChartDatum[]): TreemapNode[] {
  const hasSecondarySeries = data.some(entry => Boolean(entry.series))
  const primaryLabels = Array.from(new Set(data.map(entry => entry.label)))
  const primaryColorMap = new Map(
    primaryLabels.map((label, index) => [label, chartColors[index % chartColors.length]])
  )

  if (!hasSecondarySeries) {
    return data.map(entry => ({
      name: entry.label,
      primaryName: entry.label,
      size: entry.value,
      fill: primaryColorMap.get(entry.label) ?? chartColors[0],
    }))
  }

  const groupedNodes = new Map<string, TreemapNode[]>()

  data.forEach(entry => {
    const seriesLabel = entry.series ?? 'UNSPECIFIED'

    const groupChildren = groupedNodes.get(entry.label) ?? []
    groupChildren.push({
      name: `${entry.label} - ${seriesLabel}`,
      primaryName: entry.label,
      secondaryName: seriesLabel,
      size: entry.value,
      fill: primaryColorMap.get(entry.label) ?? chartColors[0],
    })
    groupedNodes.set(entry.label, groupChildren)
  })

  return Array.from(groupedNodes.entries()).map(([label, children]) => ({
    name: label,
    primaryName: label,
    fill: primaryColorMap.get(label) ?? chartColors[0],
    children,
  }))
}

function buildTreemapLegendItems(nodes: readonly TreemapNode[]) {
  return nodes.map(node => ({
    label: node.primaryName ?? node.name,
    color: node.fill ?? chartColors[0],
  }))
}

function TreemapNodeContent(props: TreemapNodeShapeProps) {
  const x = props.x ?? 0
  const y = props.y ?? 0
  const width = props.width ?? 0
  const height = props.height ?? 0
  const index = props.index ?? 0
  const node = props.payload ?? props
  const fill = node.fill ?? chartColors[index % chartColors.length]
  const hasChildren = Boolean(node.children && node.children.length > 0)

  if (width <= 0 || height <= 0) {
    return null
  }

  if (hasChildren) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={applyFillOpacity(fill, '22')}
          stroke={fill}
        />
        {width > 72 && height > 20 && (
          <text x={x + 6} y={y + 16} fontSize={12} fill="#263238">
            {node.primaryName ?? node.name ?? props.name}
          </text>
        )}
      </g>
    )
  }

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#ffffff" />
      {width > 48 && height > 22 && (
        <text x={x + 6} y={y + 16} fontSize={11} fill="#102027">
          {node.secondaryName || node.name || props.name}
        </text>
      )}
    </g>
  )
}

function buildSankeyChartModel(data: AnalyticsChartDatum[]): SankeyChartModel {
  const nodeIndexByKey = new Map<string, number>()
  const nodes: SankeyNode[] = []
  const linksByKey = new Map<string, SankeyLink>()

  data.forEach(entry => {
    const sourceName = entry.label
    const targetName = entry.series ?? 'UNSPECIFIED'
    const sourceKey = `source:${sourceName}`
    const targetKey = `target:${targetName}`

    if (!nodeIndexByKey.has(sourceKey)) {
      nodeIndexByKey.set(sourceKey, nodes.length)
      nodes.push({ name: sourceName })
    }

    if (!nodeIndexByKey.has(targetKey)) {
      nodeIndexByKey.set(targetKey, nodes.length)
      nodes.push({ name: targetName })
    }

    const source = nodeIndexByKey.get(sourceKey)
    const target = nodeIndexByKey.get(targetKey)
    if (source === undefined || target === undefined) {
      return
    }

    const linkKey = `${source}->${target}`
    const existingLink = linksByKey.get(linkKey)

    if (existingLink) {
      linksByKey.set(linkKey, { ...existingLink, value: existingLink.value + entry.value })
      return
    }

    linksByKey.set(linkKey, {
      source,
      target,
      value: entry.value,
    })
  })

  return {
    nodes,
    links: Array.from(linksByKey.values()),
  }
}

function renderChart(chartType: AnalyticsDraftReport['chartType'], data: AnalyticsChartDatum[]) {
  const cartesianChartModel = buildCartesianChartModel(data)
  const treemapChartModel = buildTreemapChartModel(data)
  const treemapLegendItems = buildTreemapLegendItems(treemapChartModel)
  const sankeyChartModel = buildSankeyChartModel(data)
  const sankeySourceLabelMargin = Math.max(
    64,
    ...sankeyChartModel.nodes.slice(0, Math.ceil(sankeyChartModel.nodes.length / 2)).map(node => node.name.length * 7 + 20)
  )
  const sankeyTargetLabelMargin = Math.max(
    96,
    ...sankeyChartModel.nodes.slice(Math.ceil(sankeyChartModel.nodes.length / 2)).map(node => node.name.length * 7 + 24)
  )

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="38%"
            cy="50%"
            outerRadius="80%"
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === 'treemap') {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {treemapLegendItems.length > 0 && (
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {treemapLegendItems.map(item => (
              <Stack key={item.label} direction="row" spacing={0.75} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 0.5,
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapChartModel}
              dataKey="size"
              nameKey="name"
              content={<TreemapNodeContent />}
              stroke="#ffffff"
              aspectRatio={4 / 3}
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </Box>
      </Box>
    )
  }

  if (chartType === 'sankey') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={sankeyChartModel}
          node={renderSankeyNode}
          nodePadding={24}
          nodeWidth={14}
          margin={{
            top: 16,
            right: sankeyTargetLabelMargin,
            bottom: 16,
            left: sankeySourceLabelMargin,
          }}
          link={{ stroke: '#90A4AE' }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    )
  }

  if (chartType === 'stackedArea') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={cartesianChartModel.rows}
          margin={{ top: 8, right: 8, bottom: 24, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          {cartesianChartModel.hasSecondarySeries && <Legend verticalAlign="bottom" height={36} />}
          {cartesianChartModel.series.map(series => (
            <Area
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color}
              fill={series.color}
              fillOpacity={0.35}
              stackId="total"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === 'groupedBar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cartesianChartModel.rows} margin={{ top: 8, right: 8, bottom: 24, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          {cartesianChartModel.hasSecondarySeries && <Legend verticalAlign="bottom" height={36} />}
          {cartesianChartModel.series.map(series => (
            <Bar key={series.key} dataKey={series.key} name={series.label} fill={series.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={cartesianChartModel.rows} margin={{ top: 8, right: 8, bottom: 24, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        {cartesianChartModel.hasSecondarySeries && <Legend verticalAlign="bottom" height={36} />}
        {cartesianChartModel.series.map(series => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.label}
            fill={series.color}
            stackId={cartesianChartModel.hasSecondarySeries ? 'total' : undefined}
            radius={cartesianChartModel.hasSecondarySeries ? undefined : [8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsWorkspace() {
  const t = useTranslations('analytics')
  const apolloClient = useApolloClient()
  const analyticsConfig = useAnalyticsConfig()
  const { selectedCompanyId } = useCompanyContext()
  const { currentPerson, isLoading: currentPersonLoading } = useCurrentPerson()
  const [draft, setDraft] = useState<AnalyticsDraftReport>(createDefaultDraft())
  const [savedReports, setSavedReports] = useState<AnalyticsReportDefinition[]>([])
  const [savedFolders, setSavedFolders] = useState<AnalyticsReportFolderDefinition[]>([])
  const [chartData, setChartData] = useState<AnalyticsChartDatum[]>([])
  const [previewRecords, setPreviewRecords] = useState<AnalyticsPreviewRecord[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [foldersLoading, setFoldersLoading] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [folderSaving, setFolderSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [reportScope, setReportScope] = useState<AnalyticsReportScope>(() => {
    if (typeof window === 'undefined') {
      return 'all'
    }

    const storedReportScope = window.localStorage.getItem(analyticsReportScopeStorageKey)

    return storedReportScope === 'mine' ? 'mine' : 'all'
  })
  const [previewTab, setPreviewTab] = useState<AnalyticsPreviewTab>('chart')
  const [folderDialog, setFolderDialog] = useState<FolderDialogState | null>(null)
  const [notification, setNotification] = useState<NotificationState | null>(null)
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const storedCollapsedFolders = window.localStorage.getItem(
        analyticsCollapsedFoldersStorageKey
      )

      return storedCollapsedFolders ? (JSON.parse(storedCollapsedFolders) as string[]) : []
    } catch {
      return []
    }
  })
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  const analyticsBaseUrl = analyticsConfig.apiUrl
  const activeSchema = analyticsSchemaByElementType[draft.elementType]
  const availableDimensions = getAllowedPrimaryDimensions(draft.chartType, activeSchema.dimensions)
  const availableSecondDimensions = getAllowedSecondDimensions(
    draft.chartType,
    activeSchema.dimensions,
    draft.dimension
  )
  const availableMeasures = getAllowedMeasures(draft.chartType, activeSchema.measures)
  const adminMode = isAdmin()
  const canManageFolders = Boolean(selectedCompanyId && currentPerson?.id && !currentPersonLoading)
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    []
  )
  const folderOptions = useMemo(() => buildFolderOptions(savedFolders), [savedFolders])

  const showNotification = (message: string, severity: NotificationState['severity']) => {
    setNotification({ message, severity })
  }

  useEffect(() => {
    window.localStorage.setItem(analyticsReportScopeStorageKey, reportScope)
  }, [reportScope])

  useEffect(() => {
    window.localStorage.setItem(
      analyticsCollapsedFoldersStorageKey,
      JSON.stringify(collapsedFolderIds)
    )
  }, [collapsedFolderIds])

  useEffect(() => {
    if (!selectedCompanyId) {
      setSavedFolders([])
      setFoldersLoading(false)
      return
    }

    let cancelled = false
    setFoldersLoading(true)

    void listReportFolders(apolloClient, selectedCompanyId)
      .then(folders => {
        if (!cancelled) {
          setSavedFolders(folders)
        }
      })
      .catch(loadError => {
        if (!cancelled) {
          setSavedFolders([])
          showNotification(
            loadError instanceof Error ? loadError.message : t('loadFoldersError'),
            'error'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setFoldersLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [apolloClient, selectedCompanyId, t])

  useEffect(() => {
    if (!selectedCompanyId) {
      setSavedReports([])
      setReportsLoading(false)
      return
    }

    if (currentPersonLoading) {
      setReportsLoading(true)
      return
    }

    if (!currentPerson?.id) {
      setSavedReports([])
      setReportsLoading(false)
      return
    }

    let cancelled = false
    setReportsLoading(true)

    void listAnalyticsReports(
      apolloClient,
      selectedCompanyId,
      currentPerson?.id ?? null,
      reportScope === 'mine'
    )
      .then(reports => {
        if (!cancelled) {
          setSavedReports(reports)
        }
      })
      .catch(loadError => {
        if (!cancelled) {
          setSavedReports([])
          showNotification(
            loadError instanceof Error ? loadError.message : t('loadReportsError'),
            'error'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReportsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    apolloClient,
    adminMode,
    currentPerson?.id,
    currentPersonLoading,
    reportScope,
    selectedCompanyId,
    t,
  ])

  useEffect(() => {
    if (!analyticsBaseUrl) {
      setChartData([])
      setPreviewRecords([])
      return
    }

    let cancelled = false
    setQueryLoading(true)

    void queryAnalyticsPreview(analyticsBaseUrl, {
      companyId: selectedCompanyId,
      elementType: draft.elementType,
      dimension: draft.dimension,
      secondDimension: draft.chartType === 'pie' ? null : draft.secondDimension,
      measure: draft.measure,
    })
      .then(payload => {
        if (!cancelled) {
          setChartData(payload.data)
          setPreviewRecords(payload.records)
        }
      })
      .catch(queryError => {
        if (!cancelled) {
          setChartData([])
          setPreviewRecords([])
          showNotification(
            queryError instanceof Error ? queryError.message : t('loadPreviewError'),
            'error'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setQueryLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    analyticsBaseUrl,
    draft.chartType,
    draft.dimension,
    draft.elementType,
    draft.measure,
    draft.secondDimension,
    selectedCompanyId,
    t,
  ])

  useEffect(() => {
    const nextDimension = availableDimensions.includes(draft.dimension)
      ? draft.dimension
      : availableDimensions[0]
    const nextMeasure = availableMeasures.includes(draft.measure)
      ? draft.measure
      : availableMeasures[0]
    const validSecondDimension =
      draft.secondDimension &&
      draft.secondDimension !== nextDimension &&
      availableSecondDimensions.includes(draft.secondDimension)
        ? draft.secondDimension
        : null
    const nextSecondDimension =
      draft.chartType === 'pie'
        ? null
        : validSecondDimension ??
          (requiresSecondDimension(draft.chartType)
            ? pickDefaultSecondDimension(availableSecondDimensions, nextDimension)
            : null)

    if (
      nextDimension !== draft.dimension ||
      nextMeasure !== draft.measure ||
      nextSecondDimension !== draft.secondDimension
    ) {
      setDraft(current => ({
        ...current,
        dimension: nextDimension,
        secondDimension: nextSecondDimension,
        measure: nextMeasure,
      }))
    }
  }, [
    availableDimensions,
    availableSecondDimensions,
    availableMeasures,
    draft.chartType,
    draft.dimension,
    draft.measure,
    draft.secondDimension,
  ])

  const handleDraftChange = <T extends keyof AnalyticsDraftReport>(
    key: T,
    value: AnalyticsDraftReport[T]
  ) => {
    setDraft(current => ({ ...current, [key]: value }))
  }

  const openCreateFolderDialog = (parentId: string | null) => {
    setFolderDialog({
      mode: 'create',
      folder: null,
      parentId,
      name: '',
    })
  }

  const openEditFolderDialog = (folder: AnalyticsReportFolderDefinition) => {
    setFolderDialog({
      mode: 'edit',
      folder,
      parentId: folder.parentId ?? null,
      name: folder.name,
    })
  }

  const openDeleteFolderDialog = (folder: AnalyticsReportFolderDefinition) => {
    setFolderDialog({
      mode: 'delete',
      folder,
      parentId: folder.parentId ?? null,
      name: folder.name,
    })
  }

  const closeFolderDialog = () => {
    if (!folderSaving) {
      setFolderDialog(null)
    }
  }

  const toggleFolderOpen = (folderId: string) => {
    setCollapsedFolderIds(current =>
      current.includes(folderId)
        ? current.filter(currentFolderId => currentFolderId !== folderId)
        : [...current, folderId]
    )
  }

  const handleSave = async () => {
    if (!selectedCompanyId || !currentPerson?.id) {
      return
    }

    const reportName = draft.name.trim()
    if (!reportName) {
      return
    }

    setSaving(true)

    try {
      const input = {
        companyId: selectedCompanyId,
        creatorId: currentPerson.id,
        folderId: draft.folderId,
        isPublic: draft.isPublic,
        name: reportName,
        elementType: draft.elementType,
        chartType: draft.chartType,
        dimension: draft.dimension,
        secondDimension: draft.chartType === 'pie' ? null : draft.secondDimension,
        measure: draft.measure,
      }

      const report = draft.id
        ? await updateAnalyticsReport(apolloClient, draft.id, {
            currentCompanyId:
              savedReports.find(currentReport => currentReport.id === draft.id)?.companyId ?? null,
            currentFolderId:
              savedReports.find(currentReport => currentReport.id === draft.id)?.folderId ?? null,
            ...input,
          })
        : await createAnalyticsReport(apolloClient, input)

      setSavedReports(current => {
        const remaining = current.filter(currentReport => currentReport.id !== report.id)
        return [report, ...remaining]
      })
      if (draft.id) {
        setDraft(current => ({
          ...current,
          id: report.id,
          name: report.name,
          isPublic: report.isPublic,
          elementType: report.elementType,
          chartType: report.chartType,
          dimension: report.dimension,
          secondDimension: report.secondDimension ?? null,
          measure: report.measure,
          folderId: report.folderId ?? null,
        }))
        showNotification(t('reportUpdated'), 'success')
      } else {
        setDraft(current => ({
          ...current,
          id: report.id,
          name: report.name,
          isPublic: report.isPublic,
          elementType: report.elementType,
          chartType: report.chartType,
          dimension: report.dimension,
          secondDimension: report.secondDimension ?? null,
          measure: report.measure,
          folderId: report.folderId ?? null,
        }))
        showNotification(t('reportSaved'), 'success')
      }
    } catch (saveError) {
      showNotification(saveError instanceof Error ? saveError.message : t('saveError'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = (report: AnalyticsReportDefinition) => {
    const canEditReport = currentPerson?.id === report.creatorId

    setDraft({
      id: canEditReport ? report.id : null,
      name: report.name,
      isPublic: report.isPublic,
      elementType: report.elementType,
      chartType: report.chartType,
      dimension: report.dimension,
      secondDimension: report.chartType === 'pie' ? null : (report.secondDimension ?? null),
      measure: report.measure,
      folderId: report.folderId ?? null,
    })

    if (!canEditReport) {
      showNotification(t('loadedAsCopy'), 'success')
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteAnalyticsReport(apolloClient, reportId)
      setSavedReports(current => current.filter(report => report.id !== reportId))
      setDraft(current => (current.id === reportId ? createDefaultDraft() : current))
      showNotification(t('reportDeleted'), 'success')
    } catch (deleteError) {
      showNotification(
        deleteError instanceof Error ? deleteError.message : t('deleteError'),
        'error'
      )
    }
  }

  const handleConfirmFolderDialog = async () => {
    if (!folderDialog || !selectedCompanyId || !currentPerson?.id) {
      return
    }

    setFolderSaving(true)

    try {
      if (folderDialog.mode === 'create') {
        const name = folderDialog.name.trim()
        if (!name) {
          return
        }

        const folder = await createReportFolder(apolloClient, {
          companyId: selectedCompanyId,
          creatorId: currentPerson.id,
          parentId: folderDialog.parentId,
          name,
        })

        setSavedFolders(current => sortFolders([...current, folder]))
        showNotification(t('folderCreated'), 'success')
      }

      if (folderDialog.mode === 'edit' && folderDialog.folder) {
        const name = folderDialog.name.trim()
        if (!name) {
          return
        }

        const folder = await updateReportFolder(apolloClient, folderDialog.folder.id, {
          name,
          currentParentId: folderDialog.folder.parentId ?? null,
          parentId: folderDialog.folder.parentId ?? null,
        })

        setSavedFolders(current =>
          sortFolders(
            current.map(currentFolder => (currentFolder.id === folder.id ? folder : currentFolder))
          )
        )
        showNotification(t('folderUpdated'), 'success')
      }

      if (folderDialog.mode === 'delete' && folderDialog.folder) {
        const targetParentId = folderDialog.folder.parentId ?? null
        const reportsToMove = savedReports.filter(
          report => report.folderId === folderDialog.folder?.id
        )
        const childFoldersToMove = savedFolders.filter(
          folder => folder.parentId === folderDialog.folder?.id
        )

        await Promise.all(
          reportsToMove.map(report =>
            updateAnalyticsReport(apolloClient, report.id, {
              currentCompanyId: report.companyId ?? selectedCompanyId,
              currentFolderId: folderDialog.folder?.id ?? null,
              companyId: report.companyId ?? selectedCompanyId,
              folderId: targetParentId,
              isPublic: report.isPublic,
              name: report.name,
              elementType: report.elementType,
              chartType: report.chartType,
              dimension: report.dimension,
              secondDimension: report.secondDimension ?? null,
              measure: report.measure,
            })
          )
        )

        await Promise.all(
          childFoldersToMove.map(folder =>
            updateReportFolder(apolloClient, folder.id, {
              name: folder.name,
              currentParentId: folderDialog.folder?.id ?? null,
              parentId: targetParentId,
            })
          )
        )

        await deleteReportFolder(apolloClient, folderDialog.folder.id)

        setSavedReports(current =>
          current.map(report =>
            report.folderId === folderDialog.folder?.id
              ? { ...report, folderId: targetParentId }
              : report
          )
        )
        setSavedFolders(current =>
          sortFolders(
            current
              .filter(folder => folder.id !== folderDialog.folder?.id)
              .map(folder =>
                folder.parentId === folderDialog.folder?.id
                  ? { ...folder, parentId: targetParentId }
                  : folder
              )
          )
        )
        setDraft(current =>
          current.folderId === folderDialog.folder?.id
            ? { ...current, folderId: targetParentId }
            : current
        )
        showNotification(t('folderDeleted'), 'success')
      }

      setFolderDialog(null)
    } catch (folderError) {
      showNotification(
        folderError instanceof Error ? folderError.message : t('folderSaveError'),
        'error'
      )
    } finally {
      setFolderSaving(false)
    }
  }

  const handleSync = async () => {
    if (!analyticsBaseUrl || !selectedCompanyId) {
      return
    }

    setSyncing(true)

    try {
      const result = await syncAnalyticsProjection(analyticsBaseUrl, selectedCompanyId)
      showNotification(
        t('syncSuccess', {
          applications: result.applications,
          capabilities: result.capabilities,
          aiComponents: result.aiComponents,
          dataObjects: result.dataObjects,
          interfaces: result.interfaces,
          infrastructure: result.infrastructure,
        }),
        'success'
      )
      const refreshed = await queryAnalyticsPreview(analyticsBaseUrl, {
        companyId: selectedCompanyId,
        elementType: draft.elementType,
        dimension: draft.dimension,
        secondDimension: draft.chartType === 'pie' ? null : draft.secondDimension,
        measure: draft.measure,
      })
      setChartData(refreshed.data)
      setPreviewRecords(refreshed.records)
    } catch (syncError) {
      showNotification(syncError instanceof Error ? syncError.message : t('syncError'), 'error')
    } finally {
      setSyncing(false)
    }
  }

  const handleDownloadChart = async () => {
    const chartContainer = chartContainerRef.current

    if (!chartContainer) {
      showNotification(t('downloadChartError'), 'error')
      return
    }

    try {
      const { width, height } = chartContainer.getBoundingClientRect()
      const safeWidth = Math.max(Math.round(width), 320)
      const safeHeight = Math.max(Math.round(height), getChartMinHeight(draft.chartType))
      const link = document.createElement('a')
      const baseLabel = draft.name.trim() || `${draft.elementType}-${draft.chartType}-chart`
      const dimensionSegment = [draft.dimension, draft.secondDimension].filter(Boolean).join('-')
      const fileNameBase = `${baseLabel}-${dimensionSegment}-${draft.measure}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      link.href = await toPng(chartContainer, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: Math.max(window.devicePixelRatio, 2),
        canvasWidth: safeWidth,
        canvasHeight: safeHeight,
      })
      link.download = `${fileNameBase || 'analytics-chart'}.png`
      link.click()
    } catch {
      showNotification(t('downloadChartError'), 'error')
    }
  }

  const handleDownloadRecords = async () => {
    if (previewRecords.length === 0) {
      showNotification(t('downloadRecordsError'), 'error')
      return
    }

    try {
      const baseLabel = draft.name.trim() || `${draft.elementType}-records`
      const dimensionSegment = [draft.dimension, draft.secondDimension].filter(Boolean).join('-')
      const filename = `${baseLabel}-${dimensionSegment}-${draft.measure}-records`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      await exportToExcel(
        previewRecords.map(record => ({
          [t('recordsId')]: record.id,
          [t('recordsName')]: record.name,
          [t(`dimensions.${draft.dimension}`)]: record.label,
          ...(draft.secondDimension
            ? {
                [t(`dimensions.${draft.secondDimension}`)]: record.secondaryLabel ?? 'UNSPECIFIED',
              }
            : {}),
          ...(showRecordMeasureColumn
            ? {
                [t(`measures.${draft.measure}`)]: record.value,
              }
            : {}),
        })),
        {
          filename: filename || 'analytics-records',
          sheetName: 'Records',
          format: 'xlsx',
          includeHeaders: true,
        }
      )
    } catch {
      showNotification(t('downloadRecordsError'), 'error')
    }
  }

  const previewTotal = chartData.reduce((sum, entry) => sum + entry.value, 0)
  const previewTotalLabel = analyticsCurrencyMeasures.includes(draft.measure)
    ? currencyFormatter.format(previewTotal)
    : previewTotal.toLocaleString()
  const showRecordMeasureColumn = draft.measure !== 'count'
  const draftDimensionsLabel = [
    t(`dimensions.${draft.dimension}`),
    ...(draft.secondDimension ? [t(`dimensions.${draft.secondDimension}`)] : []),
  ].join(' + ')
  const chartTitle = `${t(`elementTypes.${draft.elementType}`)} · ${draftDimensionsLabel} · ${t(
    `measures.${draft.measure}`
  )}`
  const chartTitleWithTotal = `${chartTitle} (${previewTotalLabel})`

  const renderReportCard = (report: AnalyticsReportDefinition) => {
    const reportTitle =
      report.isPublic && report.creatorName
        ? `${report.name} (${t('reportOwner', { owner: report.creatorName })})`
        : report.name

    return (
      <Card key={report.id} variant="outlined" sx={{ overflow: 'hidden' }}>
        <CardActionArea onClick={() => handleLoad(report)}>
          <CardContent sx={{ px: 1.5, py: 1.25, '&:last-child': { pb: 1.25 } }}>
            <Box sx={{ minWidth: 0 }}>
              <MuiTooltip title={reportTitle} placement="top" arrow>
                <Typography variant="subtitle2" noWrap>
                  {reportTitle}
                </Typography>
              </MuiTooltip>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.25 }}
              >
                {t(report.isPublic ? 'publicReport' : 'privateReport')} ·{' '}
                {t(`elementTypes.${report.elementType}`)} · {t(`types.${report.chartType}`)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {[t(`dimensions.${report.dimension}`)]
                  .concat(report.secondDimension ? [t(`dimensions.${report.secondDimension}`)] : [])
                  .join(' + ')}{' '}
                · {t(`measures.${report.measure}`)}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  const renderFolderTree = (parentId: string | null = null, depth = 0): React.ReactNode => {
    const childFolders = sortFolders(
      savedFolders.filter(folder => (folder.parentId ?? null) === parentId)
    )
    const directReports = sortReports(
      savedReports.filter(report => (report.folderId ?? null) === parentId)
    )

    if (parentId !== null && childFolders.length === 0 && directReports.length === 0) {
      return null
    }

    return (
      <Stack spacing={1.25}>
        {parentId === null && directReports.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t('unfiledReports')}
            </Typography>
            <Stack spacing={1.5} useFlexGap>
              {directReports.map(renderReportCard)}
            </Stack>
          </Box>
        )}

        {childFolders.map(folder => {
          const canEditFolder = currentPerson?.id === folder.creatorId
          const isFolderOpen = !collapsedFolderIds.includes(folder.id)
          const folderReports = sortReports(
            savedReports.filter(report => (report.folderId ?? null) === folder.id)
          )
          const childContent = renderFolderTree(folder.id, depth + 1)
          const hasFolderContent = folderReports.length > 0 || childContent !== null

          return (
            <Box
              key={folder.id}
              sx={{
                ml: depth > 0 ? 2 : 0,
                pl: depth > 0 ? 1.5 : 0,
                borderLeft: depth > 0 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
                alignItems="center"
                sx={{ py: 0.5 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => toggleFolderOpen(folder.id)}
                    aria-label={isFolderOpen ? t('collapseFolder') : t('expandFolder')}
                    title={isFolderOpen ? t('collapseFolder') : t('expandFolder')}
                  >
                    {isFolderOpen ? (
                      <FolderOpenOutlined fontSize="small" color="action" />
                    ) : (
                      <FolderOutlined fontSize="small" color="action" />
                    )}
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    component={canEditFolder ? 'button' : 'div'}
                    onClick={canEditFolder ? () => openEditFolderDialog(folder) : undefined}
                    sx={
                      canEditFolder
                        ? {
                            border: 0,
                            background: 'none',
                            p: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                            font: 'inherit',
                            color: 'inherit',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }
                        : undefined
                    }
                  >
                    {folder.name}
                  </Typography>
                </Stack>
                {canManageFolders && (
                  <IconButton
                    size="small"
                    onClick={() => openCreateFolderDialog(folder.id)}
                    aria-label={t('addSubfolderAria')}
                    title={t('addSubfolder')}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                )}
              </Stack>

              {isFolderOpen && (
                <Stack spacing={1.5} useFlexGap sx={{ mt: 1, ml: 2 }}>
                  {folderReports.length > 0 && (
                    <Stack spacing={1.5} useFlexGap>
                      {folderReports.map(renderReportCard)}
                    </Stack>
                  )}
                  {childContent}
                  {!hasFolderContent && (
                    <Typography variant="body2" color="text.secondary">
                      {t('emptyFolder')}
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          )
        })}
      </Stack>
    )
  }

  const hasSavedItems = savedFolders.length > 0 || savedReports.length > 0

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 3,
        height: { xs: 'auto', xl: 'calc(100vh - 120px)' },
        overflow: { xs: 'visible', xl: 'hidden' },
      }}
    >
      <Stack spacing={3} sx={{ height: '100%', minHeight: 0 }}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            {t('title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('subtitle')}
          </Typography>
        </Stack>

        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gap: 3,
            minHeight: 0,
            gridTemplateColumns: {
              xs: '1fr',
              xl: 'minmax(340px, 380px) minmax(420px, 1fr) minmax(400px, 460px)',
            },
          }}
        >
          <Card variant="outlined" sx={{ minHeight: 0, overflow: 'hidden' }}>
            <CardContent sx={{ height: '100%', minHeight: 0 }}>
              <Stack spacing={2} sx={{ height: '100%', minHeight: 0 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                    <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
                      {t('savedReportsTitle')}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flexWrap: 'nowrap', minWidth: 0 }}
                    >
                      <Typography
                        variant="body2"
                        color={reportScope === 'all' ? 'text.primary' : 'text.secondary'}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {t('allReports')}
                      </Typography>
                      <Switch
                        checked={reportScope === 'mine'}
                        onChange={event => setReportScope(event.target.checked ? 'mine' : 'all')}
                      />
                      <Typography
                        variant="body2"
                        color={reportScope === 'mine' ? 'text.primary' : 'text.secondary'}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {t('myReports')}
                      </Typography>
                    </Stack>
                  </Stack>
                  {canManageFolders && (
                    <IconButton
                      size="small"
                      onClick={() => openCreateFolderDialog(null)}
                      aria-label={t('addRootFolderAria')}
                      title={t('createFolder')}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  )}
                </Stack>

                {(reportsLoading || foldersLoading) && <LinearProgress />}

                {!hasSavedItems ? (
                  <Box sx={{ py: 4, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('emptySavedReports')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('emptySavedReportsHint')}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      overflowY: 'auto',
                      pr: 0.5,
                    }}
                  >
                    {renderFolderTree()}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ minHeight: 0, overflow: 'hidden' }}>
            <CardContent sx={{ height: '100%', minHeight: 0 }}>
              <Stack spacing={2} sx={{ height: '100%', minHeight: 0 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <Tabs
                    value={previewTab}
                    onChange={(_event, value: AnalyticsPreviewTab) => setPreviewTab(value)}
                    aria-label={t('previewTabs')}
                  >
                    <Tab value="chart" label={t('chartTab')} />
                    <Tab value="records" label={t('recordsTab')} />
                  </Tabs>
                  {previewTab === 'chart' && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => void handleDownloadChart()}
                      disabled={queryLoading || chartData.length === 0}
                    >
                      {t('downloadChart')}
                    </Button>
                  )}
                  {previewTab === 'records' && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => void handleDownloadRecords()}
                      disabled={queryLoading || previewRecords.length === 0}
                    >
                      {t('downloadRecords')}
                    </Button>
                  )}
                </Stack>
                {(queryLoading || syncing) && <LinearProgress />}
                {!queryLoading && chartData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('emptyPreview')}
                  </Typography>
                ) : previewTab === 'records' ? (
                  <TableContainer
                    component={Box}
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      overflow: 'auto',
                    }}
                  >
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('recordsName')}</TableCell>
                          <TableCell>{t(`dimensions.${draft.dimension}`)}</TableCell>
                          {draft.secondDimension && (
                            <TableCell>{t(`dimensions.${draft.secondDimension}`)}</TableCell>
                          )}
                          {showRecordMeasureColumn && (
                            <TableCell align="right">{t(`measures.${draft.measure}`)}</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewRecords.map(entry => (
                          <TableRow key={entry.id || `${entry.name}-${entry.label}`} hover>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.label}</TableCell>
                            {draft.secondDimension && (
                              <TableCell>{entry.secondaryLabel ?? 'UNSPECIFIED'}</TableCell>
                            )}
                            {showRecordMeasureColumn && (
                              <TableCell align="right">{entry.value.toLocaleString()}</TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    ref={chartContainerRef}
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                      {chartTitleWithTotal}
                    </Typography>
                    <Box sx={{ flex: 1, minHeight: getChartMinHeight(draft.chartType) }}>
                      {renderChart(draft.chartType, chartData)}
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6">{t('builderTitle')}</Typography>
                <TextField
                  label={t('reportName')}
                  value={draft.name}
                  onChange={event => handleDraftChange('name', event.target.value)}
                  fullWidth
                />
                <TextField
                  select
                  label={t('folder')}
                  value={draft.folderId ?? ''}
                  onChange={event => handleDraftChange('folderId', event.target.value || null)}
                  fullWidth
                >
                  <MenuItem value="">{t('noFolder')}</MenuItem>
                  {folderOptions.map(folder => (
                    <MenuItem key={folder.id} value={folder.id}>
                      {folder.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t('elementType')}
                  value={draft.elementType}
                  onChange={event => {
                    const nextElementType = event.target
                      .value as AnalyticsDraftReport['elementType']
                    const nextSchema = analyticsSchemaByElementType[nextElementType]

                    setDraft(current => ({
                      ...current,
                      elementType: nextElementType,
                      dimension: getAllowedPrimaryDimensions(current.chartType, nextSchema.dimensions)[0],
                      secondDimension: null,
                      measure: nextSchema.measures[0],
                    }))
                  }}
                  fullWidth
                >
                  {analyticsElementTypes.map(elementType => (
                    <MenuItem key={elementType} value={elementType}>
                      {t(`elementTypes.${elementType}`)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t('chartType')}
                  value={draft.chartType}
                  onChange={event => {
                    const nextChartType = event.target.value as AnalyticsDraftReport['chartType']
                    const nextPrimaryDimensions = getAllowedPrimaryDimensions(
                      nextChartType,
                      activeSchema.dimensions
                    )
                    const nextDimension = nextPrimaryDimensions.includes(draft.dimension)
                      ? draft.dimension
                      : nextPrimaryDimensions[0]
                    const nextSecondDimensions = getAllowedSecondDimensions(
                      nextChartType,
                      activeSchema.dimensions,
                      nextDimension
                    )
                    const nextMeasures = getAllowedMeasures(nextChartType, activeSchema.measures)
                    const nextSecondDimension =
                      nextChartType === 'pie'
                        ? null
                        : draft.secondDimension && nextSecondDimensions.includes(draft.secondDimension)
                          ? draft.secondDimension
                          : requiresSecondDimension(nextChartType)
                            ? pickDefaultSecondDimension(nextSecondDimensions, nextDimension)
                            : null

                    setDraft(current => ({
                      ...current,
                      chartType: nextChartType,
                      dimension: nextDimension,
                      secondDimension: nextSecondDimension,
                      measure: nextMeasures.includes(current.measure)
                        ? current.measure
                        : nextMeasures[0],
                    }))
                  }}
                  fullWidth
                >
                  {analyticsChartTypes.map(chartType => (
                    <MenuItem key={chartType} value={chartType}>
                      {t(`types.${chartType}`)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t('dimension')}
                  value={draft.dimension}
                  onChange={event =>
                    handleDraftChange(
                      'dimension',
                      event.target.value as AnalyticsDraftReport['dimension']
                    )
                  }
                  fullWidth
                >
                  {availableDimensions.map(dimension => (
                    <MenuItem key={dimension} value={dimension}>
                      {t(`dimensions.${dimension}`)}
                    </MenuItem>
                  ))}
                </TextField>
                {draft.chartType !== 'pie' && (
                  <TextField
                    select
                    label={t('secondDimension')}
                    value={draft.secondDimension ?? ''}
                    onChange={event =>
                      handleDraftChange(
                        'secondDimension',
                        (event.target.value || null) as AnalyticsDraftReport['secondDimension']
                      )
                    }
                    fullWidth
                  >
                    {!requiresSecondDimension(draft.chartType) && (
                      <MenuItem value="">{t('noSecondDimension')}</MenuItem>
                    )}
                    {availableSecondDimensions.map(dimension => (
                      <MenuItem key={dimension} value={dimension}>
                        {t(`dimensions.${dimension}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField
                  select
                  label={t('measure')}
                  value={draft.measure}
                  onChange={event =>
                    handleDraftChange(
                      'measure',
                      event.target.value as AnalyticsDraftReport['measure']
                    )
                  }
                  fullWidth
                >
                  {availableMeasures.map(measure => (
                    <MenuItem key={measure} value={measure}>
                      {t(`measures.${measure}`)}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={draft.isPublic}
                      onChange={event => handleDraftChange('isPublic', event.target.checked)}
                    />
                  }
                  label={t('publicReportToggle')}
                />
                <Typography variant="caption" color="text.secondary">
                  {draft.isPublic ? t('publicReportHint') : t('privateReportHint')}
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ width: '100%', flexWrap: 'nowrap' }}>
                  <Button
                    variant="contained"
                    sx={{ flex: 1, minWidth: 0 }}
                    onClick={() => void handleSave()}
                    disabled={
                      !draft.name.trim() ||
                      saving ||
                      !selectedCompanyId ||
                      !currentPerson?.id ||
                      currentPersonLoading
                    }
                  >
                    {draft.id ? t('updateReport') : t('saveReport')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ flex: 1, minWidth: 0 }}
                    onClick={() => setDraft(createDefaultDraft())}
                  >
                    {t('newReport')}
                  </Button>
                  {draft.id && (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}
                      onClick={() => void handleDeleteReport(draft.id as string)}
                    >
                      {t('deleteReport')}
                    </Button>
                  )}
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={<Sync />}
                  onClick={() => void handleSync()}
                  disabled={syncing || !selectedCompanyId || !analyticsBaseUrl}
                >
                  {t('syncData')}
                </Button>
                {!selectedCompanyId && (
                  <Typography variant="caption" color="text.secondary">
                    {t('syncRequiresCompany')}
                  </Typography>
                )}
                {selectedCompanyId && !currentPerson?.id && !currentPersonLoading && (
                  <Typography variant="caption" color="text.secondary">
                    {t('saveRequiresCurrentPerson')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Dialog open={Boolean(folderDialog)} onClose={closeFolderDialog} fullWidth maxWidth="xs">
          <DialogTitle>
            {folderDialog?.mode === 'create'
              ? folderDialog.parentId
                ? t('createSubfolderDialogTitle')
                : t('createFolderDialogTitle')
              : folderDialog?.mode === 'edit'
                ? t('editFolderDialogTitle')
                : t('deleteFolderDialogTitle')}
          </DialogTitle>
          <DialogContent>
            {folderDialog?.mode === 'delete' ? (
              <Stack spacing={1.5} sx={{ pt: 1 }}>
                <Typography variant="body2">
                  {t('deleteFolderDialogDescription', { name: folderDialog.name })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {folderDialog.parentId
                    ? t('deleteFolderMoveToParent')
                    : t('deleteFolderMoveToRoot')}
                </Typography>
              </Stack>
            ) : (
              <TextField
                autoFocus
                margin="dense"
                label={t('folderName')}
                value={folderDialog?.name ?? ''}
                onChange={event =>
                  setFolderDialog(current =>
                    current ? { ...current, name: event.target.value } : current
                  )
                }
                fullWidth
              />
            )}
          </DialogContent>
          <DialogActions>
            {folderDialog?.mode === 'edit' && folderDialog.folder && (
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: 'auto' }}
                onClick={() => openDeleteFolderDialog(folderDialog.folder!)}
              >
                {t('folderActionDelete')}
              </Button>
            )}
            <Button onClick={closeFolderDialog}>{t('folderActionCancel')}</Button>
            <Button
              variant="contained"
              color={folderDialog?.mode === 'delete' ? 'error' : 'primary'}
              onClick={() => void handleConfirmFolderDialog()}
              disabled={
                folderSaving ||
                !folderDialog ||
                (folderDialog.mode !== 'delete' && !folderDialog.name.trim())
              }
            >
              {folderDialog?.mode === 'create'
                ? t('folderActionCreate')
                : folderDialog?.mode === 'edit'
                  ? t('folderActionSave')
                  : t('folderActionDelete')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setNotification(null)}
            severity={notification?.severity ?? 'success'}
            variant="filled"
          >
            {notification?.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  )
}
