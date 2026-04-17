'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useApolloClient } from '@apollo/client'
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
  TextField,
  Typography,
} from '@mui/material'
import { Add, DeleteOutline, EditOutlined, FolderOutlined, Sync } from '@mui/icons-material'
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
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useAnalyticsConfig } from '@/lib/runtime-config'

import {
  AnalyticsChartDatum,
  AnalyticsDraftReport,
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

const chartColors = ['#00796B', '#F57C00', '#455A64', '#D84315', '#546E7A', '#00838F']

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

function createDefaultDraft(): AnalyticsDraftReport {
  return {
    id: null,
    name: '',
    isPublic: false,
    elementType: 'application',
    chartType: 'bar',
    dimension: 'status',
    measure: 'count',
    folderId: null,
  }
}

function sortReports(reports: readonly AnalyticsReportDefinition[]) {
  return [...reports].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

function sortFolders(folders: readonly AnalyticsReportFolderDefinition[]) {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name))
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
  const apolloClient = useApolloClient()
  const analyticsConfig = useAnalyticsConfig()
  const { selectedCompanyId } = useCompanyContext()
  const { currentPerson, isLoading: currentPersonLoading } = useCurrentPerson()
  const [draft, setDraft] = useState<AnalyticsDraftReport>(createDefaultDraft())
  const [savedReports, setSavedReports] = useState<AnalyticsReportDefinition[]>([])
  const [savedFolders, setSavedFolders] = useState<AnalyticsReportFolderDefinition[]>([])
  const [chartData, setChartData] = useState<AnalyticsChartDatum[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [foldersLoading, setFoldersLoading] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [folderSaving, setFolderSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [reportScope, setReportScope] = useState<AnalyticsReportScope>('all')
  const [folderDialog, setFolderDialog] = useState<FolderDialogState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [reportUpdateMessage, setReportUpdateMessage] = useState<string | null>(null)
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null)

  const analyticsBaseUrl = analyticsConfig.apiUrl
  const activeSchema = analyticsSchemaByElementType[draft.elementType]
  const availableDimensions = activeSchema.dimensions
  const availableMeasures = activeSchema.measures
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
          setError(loadError instanceof Error ? loadError.message : t('loadFoldersError'))
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

    if (reportScope === 'mine' && currentPersonLoading) {
      setReportsLoading(true)
      return
    }

    if (reportScope === 'mine' && !currentPerson?.id) {
      setSavedReports([])
      setReportsLoading(false)
      return
    }

    let cancelled = false
    setReportsLoading(true)
    setError(null)

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
  }, [apolloClient, currentPerson?.id, currentPersonLoading, reportScope, selectedCompanyId, t])

  useEffect(() => {
    if (!analyticsBaseUrl) {
      setChartData([])
      return
    }

    let cancelled = false
    setQueryLoading(true)

    void queryAnalyticsPreview(analyticsBaseUrl, {
      companyId: selectedCompanyId,
      elementType: draft.elementType,
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
  }, [analyticsBaseUrl, draft.dimension, draft.elementType, draft.measure, selectedCompanyId, t])

  useEffect(() => {
    if (
      !availableDimensions.includes(draft.dimension) ||
      !availableMeasures.includes(draft.measure)
    ) {
      setDraft(current => ({
        ...current,
        dimension: availableDimensions[0],
        measure: availableMeasures[0],
      }))
    }
  }, [availableDimensions, availableMeasures, draft.dimension, draft.measure])

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

  const handleSave = async () => {
    if (!selectedCompanyId || !currentPerson?.id) {
      return
    }

    const reportName = draft.name.trim()
    if (!reportName) {
      return
    }

    setSaving(true)
    setError(null)
    setInfoMessage(null)
    setReportUpdateMessage(null)

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
      setDraft(createDefaultDraft())
      if (draft.id) {
        setReportUpdateMessage(t('reportUpdated'))
      } else {
        setInfoMessage(t('reportSaved'))
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t('saveError'))
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
      measure: report.measure,
      folderId: report.folderId ?? null,
    })

    if (!canEditReport) {
      setInfoMessage(t('loadedAsCopy'))
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    setError(null)
    setInfoMessage(null)

    try {
      await deleteAnalyticsReport(apolloClient, reportId)
      setSavedReports(current => current.filter(report => report.id !== reportId))
      setDraft(current => (current.id === reportId ? createDefaultDraft() : current))
      setInfoMessage(t('reportDeleted'))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : t('deleteError'))
    }
  }

  const handleConfirmFolderDialog = async () => {
    if (!folderDialog || !selectedCompanyId || !currentPerson?.id) {
      return
    }

    setFolderSaving(true)
    setError(null)
    setInfoMessage(null)

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
        setInfoMessage(t('folderCreated'))
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
            current.map(currentFolder =>
              currentFolder.id === folder.id ? folder : currentFolder
            )
          )
        )
        setInfoMessage(t('folderUpdated'))
      }

      if (folderDialog.mode === 'delete' && folderDialog.folder) {
        const targetParentId = folderDialog.folder.parentId ?? null
        const reportsToMove = savedReports.filter(report => report.folderId === folderDialog.folder?.id)
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
        setInfoMessage(t('folderDeleted'))
      }

      setFolderDialog(null)
    } catch (folderError) {
      setError(folderError instanceof Error ? folderError.message : t('folderSaveError'))
    } finally {
      setFolderSaving(false)
    }
  }

  const handleSync = async () => {
    if (!analyticsBaseUrl || !selectedCompanyId) {
      return
    }

    setSyncing(true)
    setError(null)
    setInfoMessage(null)
    setSyncSuccessMessage(null)

    try {
      const result = await syncAnalyticsProjection(analyticsBaseUrl, selectedCompanyId)
      setSyncSuccessMessage(
        t('syncSuccess', {
          applications: result.applications,
          capabilities: result.capabilities,
          aiComponents: result.aiComponents,
          dataObjects: result.dataObjects,
          interfaces: result.interfaces,
          infrastructure: result.infrastructure,
        })
      )
      const refreshed = await queryAnalyticsPreview(analyticsBaseUrl, {
        companyId: selectedCompanyId,
        elementType: draft.elementType,
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

  const previewTotal = chartData.reduce((sum, entry) => sum + entry.value, 0)
  const previewTotalLabel = analyticsCurrencyMeasures.includes(draft.measure)
    ? currencyFormatter.format(previewTotal)
    : previewTotal.toLocaleString()

  const renderReportCard = (report: AnalyticsReportDefinition) => {
    const canEditReport = currentPerson?.id === report.creatorId

    return (
      <Card key={report.id} variant="outlined" sx={{ overflow: 'hidden' }}>
        <CardActionArea onClick={() => handleLoad(report)}>
          <CardContent sx={{ px: 1.5, py: 1.25, '&:last-child': { pb: 1.25 } }}>
            <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {report.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.25 }}
                >
                  {t(report.isPublic ? 'publicReport' : 'privateReport')} ·{' '}
                  {t(`elementTypes.${report.elementType}`)} · {t(`types.${report.chartType}`)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {t(`dimensions.${report.dimension}`)} · {t(`measures.${report.measure}`)}
                </Typography>
              </Box>
              {canEditReport && (
                <IconButton
                  color="error"
                  size="small"
                  aria-label={t('deleteReport')}
                  onClick={event => {
                    event.stopPropagation()
                    void handleDeleteReport(report.id)
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              )}
            </Stack>
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
            <Stack spacing={1}>{directReports.map(renderReportCard)}</Stack>
          </Box>
        )}

        {childFolders.map(folder => {
          const canEditFolder = currentPerson?.id === folder.creatorId
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
                  <FolderOutlined fontSize="small" color="action" />
                  <Typography variant="subtitle1">{folder.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
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
                  {canEditFolder && (
                    <IconButton
                      size="small"
                      onClick={() => openEditFolderDialog(folder)}
                      aria-label={t('editFolderAria')}
                      title={t('editFolder')}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  )}
                  {canEditFolder && (
                    <IconButton
                      size="small"
                      onClick={() => openDeleteFolderDialog(folder)}
                      aria-label={t('deleteFolderAria')}
                      title={t('deleteFolder')}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>

              <Stack spacing={1} sx={{ mt: 1, ml: 2 }}>
                {folderReports.map(renderReportCard)}
                {childContent}
                {!hasFolderContent && (
                  <Typography variant="body2" color="text.secondary">
                    {t('emptyFolder')}
                  </Typography>
                )}
              </Stack>
            </Box>
          )
        })}
      </Stack>
    )
  }

  const hasSavedItems = savedFolders.length > 0 || savedReports.length > 0

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
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {infoMessage && <Alert severity="success">{infoMessage}</Alert>}

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              xl: 'minmax(340px, 380px) minmax(420px, 1fr) minmax(280px, 340px)',
            },
          }}
        >
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">{t('savedReportsTitle')}</Typography>
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

                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
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

                {(reportsLoading || foldersLoading) && <LinearProgress />}

                {!hasSavedItems ? (
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('emptySavedReports')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('emptySavedReportsHint')}
                    </Typography>
                  </Box>
                ) : (
                  renderFolderTree()
                )}
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
                    {previewTotalLabel}
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
                    const nextElementType = event.target.value as AnalyticsDraftReport['elementType']
                    const nextSchema = analyticsSchemaByElementType[nextElementType]

                    setDraft(current => ({
                      ...current,
                      elementType: nextElementType,
                      dimension: nextSchema.dimensions[0],
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
                  {availableDimensions.map(dimension => (
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
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
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
            <Button onClick={closeFolderDialog}>{t('folderActionCancel')}</Button>
            <Button
              variant="contained"
              color={folderDialog?.mode === 'delete' ? 'error' : 'primary'}
              onClick={() => void handleConfirmFolderDialog()}
              disabled={
                folderSaving ||
                (!folderDialog || (folderDialog.mode !== 'delete' && !folderDialog.name.trim()))
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
          open={Boolean(reportUpdateMessage)}
          autoHideDuration={4000}
          onClose={() => setReportUpdateMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setReportUpdateMessage(null)}
            severity="success"
            variant="filled"
          >
            {reportUpdateMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={Boolean(syncSuccessMessage)}
          autoHideDuration={4000}
          onClose={() => setSyncSuccessMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSyncSuccessMessage(null)} severity="success" variant="filled">
            {syncSuccessMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  )
}
