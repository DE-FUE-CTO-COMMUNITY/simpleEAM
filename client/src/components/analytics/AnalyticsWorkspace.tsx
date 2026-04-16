'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DeleteOutline, Insights, Lan, Storage, Sync } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useAnalyticsConfig } from '@/lib/runtime-config'

import {
  AnalyticsChartDatum,
  AnalyticsDraftReport,
  AnalyticsReportDefinition,
  analyticsChartTypes,
  analyticsDimensionKeys,
  analyticsMeasureKeys,
} from './types'
import {
  createAnalyticsReport,
  deleteAnalyticsReport,
  listAnalyticsReports,
  queryAnalyticsPreview,
  syncAnalyticsProjection,
  updateAnalyticsReport,
} from './api'

const chartColors = ['#00796B', '#F57C00', '#455A64', '#D84315', '#546E7A', '#00838F']

function createDefaultDraft(): AnalyticsDraftReport {
  return {
    id: null,
    name: '',
    chartType: 'bar',
    dimension: 'status',
    measure: 'applicationCount',
  }
}

function renderChart(chartType: AnalyticsDraftReport['chartType'], data: AnalyticsChartDatum[]) {
  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#00796B" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey="value" nameKey="label" outerRadius={110} label>
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#00796B" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsWorkspace() {
  const t = useTranslations('analytics')
  const analyticsConfig = useAnalyticsConfig()
  const { selectedCompany, selectedCompanyId } = useCompanyContext()
  const [draft, setDraft] = useState<AnalyticsDraftReport>(createDefaultDraft())
  const [savedReports, setSavedReports] = useState<AnalyticsReportDefinition[]>([])
  const [chartData, setChartData] = useState<AnalyticsChartDatum[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const analyticsBaseUrl = analyticsConfig.apiUrl
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    []
  )

  useEffect(() => {
    if (!analyticsBaseUrl) {
      setSavedReports([])
      return
    }

    let cancelled = false
    setReportsLoading(true)
    setError(null)

    void listAnalyticsReports(analyticsBaseUrl, selectedCompanyId)
      .then(reports => {
        if (!cancelled) {
          setSavedReports(reports)
        }
      })
      .catch(loadError => {
        if (!cancelled) {
          setSavedReports([])
          setError(loadError instanceof Error ? loadError.message : t('loadReportsError'))
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
  }, [analyticsBaseUrl, selectedCompanyId, t])

  useEffect(() => {
    if (!analyticsBaseUrl) {
      setChartData([])
      return
    }

    let cancelled = false
    setQueryLoading(true)

    void queryAnalyticsPreview(analyticsBaseUrl, {
      companyId: selectedCompanyId,
      dimension: draft.dimension,
      measure: draft.measure,
    })
      .then(payload => {
        if (!cancelled) {
          setChartData(payload.data)
        }
      })
      .catch(queryError => {
        if (!cancelled) {
          setChartData([])
          setError(queryError instanceof Error ? queryError.message : t('loadPreviewError'))
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
  }, [analyticsBaseUrl, draft.dimension, draft.measure, selectedCompanyId, t])

  const handleDraftChange = <T extends keyof AnalyticsDraftReport>(
    key: T,
    value: AnalyticsDraftReport[T]
  ) => {
    setDraft(current => ({ ...current, [key]: value }))
  }

  const handleSave = async () => {
    if (!analyticsBaseUrl) {
      return
    }

    const reportName = draft.name.trim()
    if (!reportName) {
      return
    }

    setSaving(true)
    setError(null)
    setInfoMessage(null)

    try {
      const input = {
        companyId: selectedCompanyId,
        name: reportName,
        chartType: draft.chartType,
        dimension: draft.dimension,
        measure: draft.measure,
      }

      const report = draft.id
        ? await updateAnalyticsReport(analyticsBaseUrl, draft.id, input)
        : await createAnalyticsReport(analyticsBaseUrl, input)

      setSavedReports(current => {
        const remaining = current.filter(currentReport => currentReport.id !== report.id)
        return [report, ...remaining]
      })
      setDraft(createDefaultDraft())
      setInfoMessage(draft.id ? t('reportUpdated') : t('reportSaved'))
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t('saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = (report: AnalyticsReportDefinition) => {
    setDraft({
      id: report.id,
      name: report.name,
      chartType: report.chartType,
      dimension: report.dimension,
      measure: report.measure,
    })
  }

  const handleDelete = async (reportId: string) => {
    if (!analyticsBaseUrl) {
      return
    }

    setError(null)
    setInfoMessage(null)

    try {
      await deleteAnalyticsReport(analyticsBaseUrl, reportId)
      setSavedReports(current => current.filter(report => report.id !== reportId))
      setDraft(current => (current.id === reportId ? createDefaultDraft() : current))
      setInfoMessage(t('reportDeleted'))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : t('deleteError'))
    }
  }

  const handleSync = async () => {
    if (!analyticsBaseUrl || !selectedCompanyId) {
      return
    }

    setSyncing(true)
    setError(null)
    setInfoMessage(null)

    try {
      const result = await syncAnalyticsProjection(analyticsBaseUrl, selectedCompanyId)
      setInfoMessage(
        t('syncSuccess', {
          applications: result.applications,
          capabilities: result.capabilities,
        })
      )
      const refreshed = await queryAnalyticsPreview(analyticsBaseUrl, {
        companyId: selectedCompanyId,
        dimension: draft.dimension,
        measure: draft.measure,
      })
      setChartData(refreshed.data)
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : t('syncError'))
    } finally {
      setSyncing(false)
    }
  }

  const scopeLabel = selectedCompany?.name || t('globalScope')
  const connectionReady = Boolean(analyticsConfig.apiUrl)
  const previewTotal = chartData.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            {t('title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('subtitle')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip
              label={`${t('companyScope')}: ${scopeLabel}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${t('apiEndpoint')}: ${connectionReady ? analyticsConfig.apiUrl : t('connectionMissing')}`}
              color={connectionReady ? 'success' : 'default'}
              variant="outlined"
            />
          </Stack>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {infoMessage && <Alert severity="success">{infoMessage}</Alert>}
        <Alert severity="info">{t('liveDataHint')}</Alert>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              xl: 'minmax(320px, 360px) minmax(420px, 1fr) minmax(280px, 340px)',
            },
          }}
        >
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
                  label={t('chartType')}
                  value={draft.chartType}
                  onChange={event =>
                    handleDraftChange(
                      'chartType',
                      event.target.value as AnalyticsDraftReport['chartType']
                    )
                  }
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
                  {analyticsDimensionKeys.map(dimension => (
                    <MenuItem key={dimension} value={dimension}>
                      {t(`dimensions.${dimension}`)}
                    </MenuItem>
                  ))}
                </TextField>
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
                  {analyticsMeasureKeys.map(measure => (
                    <MenuItem key={measure} value={measure}>
                      {t(`measures.${measure}`)}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    onClick={() => void handleSave()}
                    disabled={!draft.name.trim() || saving || !analyticsBaseUrl}
                  >
                    {draft.id ? t('updateReport') : t('saveReport')}
                  </Button>
                  <Button variant="outlined" onClick={() => setDraft(createDefaultDraft())}>
                    {t('newReport')}
                  </Button>
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={<Sync />}
                  onClick={() => void handleSync()}
                  disabled={syncing || !selectedCompanyId || !analyticsBaseUrl}
                >
                  {t('syncProjection')}
                </Button>
                {!selectedCompanyId && (
                  <Typography variant="caption" color="text.secondary">
                    {t('syncRequiresCompany')}
                  </Typography>
                )}
                <Divider />
                <Typography variant="subtitle2">{t('pipelineTitle')}</Typography>
                <Stack spacing={1.25}>
                  <Chip icon={<Storage />} label={t('pipelineSource')} variant="outlined" />
                  <Chip icon={<Lan />} label={t('pipelineProjection')} variant="outlined" />
                  <Chip icon={<Insights />} label={t('pipelineSemantic')} variant="outlined" />
                  <Chip label={t('pipelineUi')} color="primary" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <Typography variant="h6">{t('previewTitle')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {draft.measure === 'monthlyCost'
                      ? currencyFormatter.format(previewTotal)
                      : `${previewTotal.toLocaleString()} ${t('measures.applicationCount').toLowerCase()}`}
                  </Typography>
                </Stack>
                {(queryLoading || syncing) && <LinearProgress />}
                {!queryLoading && chartData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('emptyPreview')}
                  </Typography>
                ) : (
                  renderChart(draft.chartType, chartData)
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{t('savedReportsTitle')}</Typography>
                {reportsLoading && <LinearProgress />}
                {savedReports.length === 0 ? (
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('emptySavedReports')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('emptySavedReportsHint')}
                    </Typography>
                  </Box>
                ) : (
                  savedReports.map(report => (
                    <Card key={report.id} variant="outlined">
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <Box>
                              <Typography variant="subtitle1">{report.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t(`types.${report.chartType}`)} ·{' '}
                                {t(`dimensions.${report.dimension}`)} ·{' '}
                                {t(`measures.${report.measure}`)}
                              </Typography>
                            </Box>
                            <Button
                              color="error"
                              size="small"
                              startIcon={<DeleteOutline />}
                              onClick={() => void handleDelete(report.id)}
                            >
                              {t('deleteReport')}
                            </Button>
                          </Stack>
                          <Button variant="outlined" onClick={() => handleLoad(report)}>
                            {t('loadReport')}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  )
}
