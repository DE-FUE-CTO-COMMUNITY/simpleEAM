'use client'

import React from 'react'
import { Add as AddIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useMutation, useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { useSnackbar } from 'notistack'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { CREATE_MISSION, GET_MISSIONS, UPDATE_MISSION } from '@/graphql/mission'
import { CREATE_VISION, GET_VISIONS } from '@/graphql/vision'
import { CREATE_VALUE, GET_VALUES, UPDATE_VALUE } from '@/graphql/value'
import { CREATE_GOAL, GET_GOALS, UPDATE_GOAL } from '@/graphql/goal'
import { CREATE_STRATEGY, GET_STRATEGIES } from '@/graphql/strategy'
import {
  calculateNormalizedScorePercent,
  getEdgeScore,
} from '@/components/matrix-editor/scoreUtils'

type MatrixMode = 'missionVision' | 'valueMissionVision' | 'goalMissionVision' | 'goalStrategy'

type VerticalNode = {
  id: string
  name: string
  type: 'mission' | 'vision' | 'value' | 'strategy'
  statement?: string
}

type HorizontalNode = {
  id: string
  name: string
  statement?: string
  [key: string]: unknown
}

type AxisEntityType = 'mission' | 'vision' | 'value' | 'goal' | 'strategy'

type AddAxisDialogState = {
  open: boolean
  axis: 'horizontal' | 'vertical'
}

type MatrixCellScore = number | null

type ScoreValue = -3 | -2 | -1 | 0 | 1 | 2 | 3
type ScoreLabelKey =
  | 'scoreStrongSupport'
  | 'scoreSupport'
  | 'scoreWeakSupport'
  | 'scoreNeutral'
  | 'scoreSlightContradiction'
  | 'scoreSignificantConflict'
  | 'scoreDirectContradiction'

const scoreOptions: ReadonlyArray<{ value: ScoreValue; key: ScoreLabelKey }> = [
  { value: 3, key: 'scoreStrongSupport' },
  { value: 2, key: 'scoreSupport' },
  { value: 1, key: 'scoreWeakSupport' },
  { value: 0, key: 'scoreNeutral' },
  { value: -1, key: 'scoreSlightContradiction' },
  { value: -2, key: 'scoreSignificantConflict' },
  { value: -3, key: 'scoreDirectContradiction' },
]

const MatrixEditorPage = () => {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('matrixEditor')
  const { selectedCompanyId } = useCompanyContext()
  const companyWhere = useCompanyWhere('company')
  const [mode, setMode] = React.useState<MatrixMode>('missionVision')
  const [addDialog, setAddDialog] = React.useState<AddAxisDialogState>({
    open: false,
    axis: 'horizontal',
  })
  const [newElementName, setNewElementName] = React.useState('')
  const [newElementStatement, setNewElementStatement] = React.useState('')
  const [newElementType, setNewElementType] = React.useState<AxisEntityType>('mission')

  const {
    data: missionData,
    loading: missionsLoading,
    error: missionsError,
    refetch: refetchMissions,
  } = useQuery(GET_MISSIONS, {
    variables: { where: companyWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const {
    data: visionData,
    loading: visionsLoading,
    error: visionsError,
    refetch: refetchVisions,
  } = useQuery(GET_VISIONS, {
    variables: { where: companyWhere },
    fetchPolicy: 'cache-and-network',
  })
  const {
    data: valueData,
    loading: valuesLoading,
    error: valuesError,
    refetch: refetchValues,
  } = useQuery(GET_VALUES, {
    variables: { where: companyWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const {
    data: goalData,
    loading: goalsLoading,
    error: goalsError,
    refetch: refetchGoals,
  } = useQuery(GET_GOALS, {
    variables: { where: companyWhere },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
  const {
    data: strategyData,
    loading: strategiesLoading,
    error: strategiesError,
    refetch: refetchStrategies,
  } = useQuery(GET_STRATEGIES, {
    variables: { where: companyWhere },
    fetchPolicy: 'cache-and-network',
  })

  const [updateMission] = useMutation(UPDATE_MISSION)
  const [updateValue] = useMutation(UPDATE_VALUE)
  const [updateGoal] = useMutation(UPDATE_GOAL)
  const [createMission, { loading: isCreatingMission }] = useMutation(CREATE_MISSION)
  const [createVision, { loading: isCreatingVision }] = useMutation(CREATE_VISION)
  const [createValue, { loading: isCreatingValue }] = useMutation(CREATE_VALUE)
  const [createGoal, { loading: isCreatingGoal }] = useMutation(CREATE_GOAL)
  const [createStrategy, { loading: isCreatingStrategy }] = useMutation(CREATE_STRATEGY)

  const missions = React.useMemo(() => missionData?.geaMissions ?? [], [missionData?.geaMissions])
  const visions = React.useMemo(() => visionData?.geaVisions ?? [], [visionData?.geaVisions])
  const values = React.useMemo(() => valueData?.geaValues ?? [], [valueData?.geaValues])
  const goals = React.useMemo(() => goalData?.geaGoals ?? [], [goalData?.geaGoals])
  const strategies = React.useMemo(
    () => strategyData?.geaStrategies ?? [],
    [strategyData?.geaStrategies]
  )

  const getCellBackground = React.useCallback(
    (score: number | null) => {
      if (score === null) {
        return theme.palette.background.paper
      }

      if (score > 0) {
        return alpha(theme.palette.success.main, (Math.min(score, 3) / 3) * 0.5)
      }

      if (score < 0) {
        return alpha(theme.palette.error.main, (Math.min(Math.abs(score), 3) / 3) * 0.5)
      }

      return theme.palette.background.paper
    },
    [theme]
  )

  const onModeChange = (event: SelectChangeEvent<MatrixMode>) => {
    setMode(event.target.value as MatrixMode)
  }

  const horizontalType: AxisEntityType =
    mode === 'missionVision' ? 'mission' : mode === 'valueMissionVision' ? 'value' : 'goal'

  const verticalTypes: AxisEntityType[] =
    mode === 'missionVision'
      ? ['vision']
      : mode === 'valueMissionVision'
        ? ['mission', 'vision']
        : mode === 'goalMissionVision'
          ? ['mission', 'vision', 'value']
          : ['strategy']

  const axisLabel =
    mode === 'missionVision'
      ? `${t('axes.vision')}/${t('axes.mission')}`
      : mode === 'valueMissionVision'
        ? `${t('axes.missionAndVision')}/${t('axes.value')}`
        : mode === 'goalMissionVision'
          ? `${t('axes.missionAndVision')}/${t('axes.value')}/${t('axes.goal')}`
          : `${t('axes.strategy')}/${t('axes.goal')}`

  const entityTypeLabel: Record<AxisEntityType, string> = {
    mission: t('axes.mission'),
    vision: t('axes.vision'),
    value: t('axes.value'),
    goal: t('axes.goal'),
    strategy: t('axes.strategy'),
  }

  const verticalButtonTypeLabel =
    verticalTypes.length > 1
      ? verticalTypes.map(type => entityTypeLabel[type]).join('/')
      : entityTypeLabel[verticalTypes[0]]

  const horizontalButtonTypeLabel = entityTypeLabel[horizontalType]

  const resetAddDialog = () => {
    setAddDialog({ open: false, axis: 'horizontal' })
    setNewElementName('')
    setNewElementStatement('')
    setNewElementType('mission')
  }

  const openAddDialog = (axis: 'horizontal' | 'vertical') => {
    const defaultType = axis === 'horizontal' ? horizontalType : verticalTypes[0]
    setNewElementType(defaultType)
    setNewElementName('')
    setNewElementStatement('')
    setAddDialog({ open: true, axis })
  }

  const tableContainerRef = React.useRef<HTMLDivElement | null>(null)
  const scrollBeforeUpdateRef = React.useRef<{ top: number; left: number } | null>(null)

  const captureScrollPosition = React.useCallback(() => {
    const container = tableContainerRef.current
    if (!container) {
      return
    }

    scrollBeforeUpdateRef.current = {
      top: container.scrollTop,
      left: container.scrollLeft,
    }
  }, [])

  const restoreScrollPosition = React.useCallback(() => {
    const container = tableContainerRef.current
    if (!container) {
      return
    }

    if (!scrollBeforeUpdateRef.current) {
      return
    }

    const { top, left } = scrollBeforeUpdateRef.current
    scrollBeforeUpdateRef.current = null

    requestAnimationFrame(() => {
      container.scrollTo({ top, left, behavior: 'auto' })
    })
  }, [])

  const withNotifications = async (action: () => Promise<void>) => {
    try {
      await action()
      enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('messages.updateError')
      enqueueSnackbar(`${t('messages.updateError')}: ${message}`, { variant: 'error' })
    } finally {
      restoreScrollPosition()
    }
  }

  const refetchAfterCreate = async (entityType: AxisEntityType) => {
    if (entityType === 'mission') {
      await refetchMissions({ where: companyWhere })
      return
    }
    if (entityType === 'vision') {
      await refetchVisions({ where: companyWhere })
      return
    }
    if (entityType === 'value') {
      await refetchValues({ where: companyWhere })
      return
    }
    if (entityType === 'goal') {
      await refetchGoals({ where: companyWhere })
      return
    }

    if (entityType === 'strategy') {
      await refetchStrategies({ where: companyWhere })
    }
  }

  const createEntity = async () => {
    if (!selectedCompanyId) {
      enqueueSnackbar(t('messages.selectCompanyFirst'), { variant: 'warning' })
      return
    }

    const trimmedName = newElementName.trim()
    const trimmedStatement = newElementStatement.trim()
    if (!trimmedName) {
      enqueueSnackbar(t('messages.nameRequired'), { variant: 'warning' })
      return
    }

    try {
      if (newElementType === 'mission') {
        await createMission({
          variables: {
            input: [
              {
                name: trimmedName,
                purposeStatement: trimmedStatement,
                year: new Date().toISOString().split('T')[0],
                company: {
                  connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
                },
              },
            ],
          },
        })
        await refetchMissions({ where: companyWhere })
      } else if (newElementType === 'vision') {
        await createVision({
          variables: {
            input: [
              {
                name: trimmedName,
                visionStatement: trimmedStatement,
                year: new Date().toISOString().split('T')[0],
                company: {
                  connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
                },
              },
            ],
          },
        })
      } else if (newElementType === 'value') {
        await createValue({
          variables: {
            input: [
              {
                name: trimmedName,
                valueStatement: trimmedStatement,
                company: {
                  connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
                },
              },
            ],
          },
        })
        await refetchValues({ where: companyWhere })
      } else if (newElementType === 'goal') {
        await createGoal({
          variables: {
            input: [
              {
                name: trimmedName,
                goalStatement: trimmedStatement,
                company: {
                  connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
                },
              },
            ],
          },
        })
        await refetchGoals({ where: companyWhere })
      } else {
        await createStrategy({
          variables: {
            input: [
              {
                name: trimmedName,
                description: trimmedStatement,
                company: {
                  connect: [{ where: { node: { id: { eq: selectedCompanyId } } } }],
                },
              },
            ],
          },
        })
      }

      await refetchAfterCreate(newElementType)
      enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
      resetAddDialog()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('messages.createError')
      enqueueSnackbar(`${t('messages.createError')}: ${message}`, { variant: 'error' })
    }
  }

  const updateMissionVisionCell = async (
    missionId: string,
    visionId: string,
    newScore: number | null
  ) => {
    await withNotifications(async () => {
      const relationInput: Record<string, unknown> = {
        supportedByVisions: {
          disconnect: [{ where: { node: { id: { eq: visionId } } } }],
        },
      }

      if (newScore !== null) {
        relationInput.supportedByVisions = {
          disconnect: [{ where: { node: { id: { eq: visionId } } } }],
          connect: [
            {
              where: { node: { id: { eq: visionId } } },
              edge: { score: newScore },
            },
          ],
        }
      }

      await updateMission({
        variables: {
          id: missionId,
          input: relationInput,
        },
      })
      await refetchMissions({ where: companyWhere })
    })
  }

  const updateValueCell = async (
    valueId: string,
    vertical: VerticalNode,
    newScore: number | null
  ) => {
    await withNotifications(async () => {
      const relationKey = vertical.type === 'mission' ? 'supportsMissions' : 'supportsVisions'
      const relationInput: Record<string, unknown> = {
        [relationKey]: {
          disconnect: [{ where: { node: { id: { eq: vertical.id } } } }],
        },
      }

      if (newScore !== null) {
        relationInput[relationKey] = {
          disconnect: [{ where: { node: { id: { eq: vertical.id } } } }],
          connect: [
            {
              where: { node: { id: { eq: vertical.id } } },
              edge: { score: newScore },
            },
          ],
        }
      }

      await updateValue({
        variables: {
          id: valueId,
          input: relationInput,
        },
      })
      await refetchValues({ where: companyWhere })
    })
  }

  const updateGoalCell = async (
    goalId: string,
    vertical: VerticalNode,
    newScore: number | null
  ) => {
    await withNotifications(async () => {
      const relationKey =
        vertical.type === 'mission'
          ? 'supportsMissions'
          : vertical.type === 'vision'
            ? 'operationalizesVisions'
            : vertical.type === 'value'
              ? 'supportsValues'
              : 'achievedByStrategies'

      const relationInput: Record<string, unknown> = {
        [relationKey]: {
          disconnect: [{ where: { node: { id: { eq: vertical.id } } } }],
        },
      }

      if (newScore !== null) {
        relationInput[relationKey] = {
          disconnect: [{ where: { node: { id: { eq: vertical.id } } } }],
          connect: [
            {
              where: { node: { id: { eq: vertical.id } } },
              edge: { score: newScore },
            },
          ],
        }
      }

      await updateGoal({
        variables: {
          id: goalId,
          input: relationInput,
        },
      })
      await refetchGoals({ where: companyWhere })
    })
  }

  const verticalNodes: VerticalNode[] = React.useMemo(() => {
    if (mode === 'missionVision') {
      return visions.map(
        (vision: { id: string; name: string; visionStatement?: string | null }) => ({
          id: vision.id,
          name: vision.name,
          type: 'vision' as const,
          statement: vision.visionStatement ?? undefined,
        })
      )
    }

    if (mode === 'valueMissionVision') {
      return [
        ...missions.map(
          (mission: { id: string; name: string; purposeStatement?: string | null }) => ({
            id: mission.id,
            name: mission.name,
            type: 'mission' as const,
            statement: mission.purposeStatement ?? undefined,
          })
        ),
        ...visions.map((vision: { id: string; name: string; visionStatement?: string | null }) => ({
          id: vision.id,
          name: vision.name,
          type: 'vision' as const,
          statement: vision.visionStatement ?? undefined,
        })),
      ]
    }

    if (mode === 'goalMissionVision') {
      return [
        ...missions.map(
          (mission: { id: string; name: string; purposeStatement?: string | null }) => ({
            id: mission.id,
            name: mission.name,
            type: 'mission' as const,
            statement: mission.purposeStatement ?? undefined,
          })
        ),
        ...visions.map((vision: { id: string; name: string; visionStatement?: string | null }) => ({
          id: vision.id,
          name: vision.name,
          type: 'vision' as const,
          statement: vision.visionStatement ?? undefined,
        })),
        ...values.map((value: { id: string; name: string; valueStatement?: string | null }) => ({
          id: value.id,
          name: value.name,
          type: 'value' as const,
          statement: value.valueStatement ?? undefined,
        })),
      ]
    }

    return strategies.map(
      (strategy: { id: string; name: string; description?: string | null }) => ({
        id: strategy.id,
        name: strategy.name,
        type: 'strategy' as const,
        statement: strategy.description ?? undefined,
      })
    )
  }, [mode, missions, visions, values, strategies])

  const horizontalNodes: HorizontalNode[] = React.useMemo(() => {
    if (mode === 'missionVision') {
      return missions.map((mission: Record<string, unknown>) => ({
        ...mission,
        statement: (mission.purposeStatement as string | null | undefined) ?? undefined,
      }))
    }
    if (mode === 'valueMissionVision') {
      return values.map((value: Record<string, unknown>) => ({
        ...value,
        statement: (value.valueStatement as string | null | undefined) ?? undefined,
      }))
    }
    return goals.map((goal: Record<string, unknown>) => ({
      ...goal,
      statement: (goal.goalStatement as string | null | undefined) ?? undefined,
    }))
  }, [mode, missions, values, goals])

  const resolveScore = (
    horizontalNode: Record<string, any>,
    verticalNode: VerticalNode
  ): number | null => {
    if (mode === 'missionVision') {
      return getEdgeScore(horizontalNode.supportedByVisionsConnection?.edges, verticalNode.id)
    }

    if (mode === 'valueMissionVision') {
      if (verticalNode.type === 'mission') {
        return getEdgeScore(horizontalNode.supportsMissionsConnection?.edges, verticalNode.id)
      }
      return getEdgeScore(horizontalNode.supportsVisionsConnection?.edges, verticalNode.id)
    }

    if (mode === 'goalMissionVision') {
      if (verticalNode.type === 'mission') {
        return getEdgeScore(horizontalNode.supportsMissionsConnection?.edges, verticalNode.id)
      }
      if (verticalNode.type === 'vision') {
        return getEdgeScore(horizontalNode.operationalizesVisionsConnection?.edges, verticalNode.id)
      }
      return getEdgeScore(horizontalNode.supportsValuesConnection?.edges, verticalNode.id)
    }

    return getEdgeScore(horizontalNode.achievedByStrategiesConnection?.edges, verticalNode.id)
  }

  const updateCell = async (
    horizontalNode: { id: string },
    verticalNode: VerticalNode,
    value: string
  ) => {
    captureScrollPosition()

    const parsed = value === '' ? null : Number(value)
    if (parsed !== null && (parsed < -3 || parsed > 3 || Number.isNaN(parsed))) {
      return
    }

    if (mode === 'missionVision') {
      await updateMissionVisionCell(horizontalNode.id, verticalNode.id, parsed)
      return
    }

    if (mode === 'valueMissionVision') {
      await updateValueCell(horizontalNode.id, verticalNode, parsed)
      return
    }

    await updateGoalCell(horizontalNode.id, verticalNode, parsed)
  }

  const matrixScores: MatrixCellScore[][] = verticalNodes.map(verticalNode =>
    horizontalNodes.map((horizontalNode: { id: string; name: string }) =>
      resolveScore(horizontalNode as Record<string, any>, verticalNode)
    )
  )

  const rowSums: number[] = matrixScores.map(row =>
    row.reduce<number>((sum, score) => sum + (score ?? 0), 0)
  )

  const columnSums: number[] = horizontalNodes.map(
    (_horizontalNode: { id: string; name: string }, columnIndex: number) =>
      matrixScores.reduce((sum, row) => sum + (row[columnIndex] ?? 0), 0)
  )

  const totalSum: number = matrixScores.reduce(
    (sum, row) => sum + row.reduce<number>((rowSum, score) => rowSum + (score ?? 0), 0),
    0
  )

  const totalScorePercent = calculateNormalizedScorePercent(matrixScores.flatMap(row => row))

  const formatSignedNumber = (value: number) => (value > 0 ? `+${value}` : `${value}`)
  const formatSignedPercent = (value: number) => {
    const rounded = Math.round(value * 10) / 10
    return `${rounded}%`
  }

  const statementLabelByType: Record<AxisEntityType, string> = {
    mission: t('purposeStatement'),
    vision: t('visionStatement'),
    value: t('valueStatement'),
    goal: t('goalStatement'),
    strategy: t('description'),
  }

  const firstColumnMinWidth = 260
  const matrixColumnWidth = 150
  const sumColumnWidth = 120
  const tableMinWidth =
    firstColumnMinWidth + horizontalNodes.length * matrixColumnWidth + sumColumnWidth

  const isLoading =
    (!missionData && missionsLoading) ||
    (!visionData && visionsLoading) ||
    (!valueData && valuesLoading) ||
    (!goalData && goalsLoading) ||
    (!strategyData && strategiesLoading) ||
    isCreatingMission ||
    isCreatingVision ||
    isCreatingValue ||
    isCreatingGoal ||
    isCreatingStrategy

  const hasError = missionsError || visionsError || valuesError || goalsError || strategiesError

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        px: 2,
        pt: 2,
        pb: 0.5,
        height: 'calc(100dvh - 64px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <FormControl fullWidth sx={{ flex: 1, minWidth: 260 }}>
            <InputLabel id="matrix-mode-label">{t('selectMatrix')}</InputLabel>
            <Select<MatrixMode>
              labelId="matrix-mode-label"
              value={mode}
              label={t('selectMatrix')}
              onChange={onModeChange}
            >
              <MenuItem value="missionVision">{t('matrices.missionToVision')}</MenuItem>
              <MenuItem value="valueMissionVision">{t('matrices.valueToMissionVision')}</MenuItem>
              <MenuItem value="goalMissionVision">{t('matrices.goalToMissionVision')}</MenuItem>
              <MenuItem value="goalStrategy">{t('matrices.goalToStrategy')}</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              px: 2,
              minHeight: 56,
              boxSizing: 'border-box',
              borderRadius: 2,
              backgroundColor: getCellBackground((totalScorePercent / 100) * 3),
              border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('totalScore')}:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              {formatSignedPercent(totalScorePercent)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {scoreOptions.map(option => (
            <Chip
              key={`legend-${option.value}`}
              label={`${option.value}: ${t(option.key)}`}
              size="small"
              sx={{ backgroundColor: getCellBackground(option.value) }}
            />
          ))}
        </Box>
      </Paper>

      {hasError && <Alert severity="error">{t('messages.loadError')}</Alert>}

      <Paper
        sx={{
          p: 2,
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, flex: 1 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            ref={tableContainerRef}
            sx={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              overflow: 'auto',
              overflowX: 'auto',
              overflowY: 'auto',
              width: '100%',
              maxWidth: '100%',
              display: 'block',
            }}
          >
            <Box sx={{ width: tableMinWidth, minWidth: '100%' }}>
              <Table
                size="small"
                stickyHeader
                sx={{
                  width: '100%',
                  tableLayout: 'fixed',
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: firstColumnMinWidth, whiteSpace: 'nowrap' }}>
                      {axisLabel}
                    </TableCell>
                    {horizontalNodes.map(
                      (item: { id: string; name: string; statement?: string }) => (
                        <TableCell
                          key={`horizontal-${item.id}`}
                          align="center"
                          sx={{
                            width: matrixColumnWidth,
                            minWidth: matrixColumnWidth,
                            maxWidth: matrixColumnWidth,
                          }}
                        >
                          {item.statement ? (
                            <Tooltip title={item.statement} arrow placement="top">
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'normal',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.2,
                                  cursor: 'default',
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                lineHeight: 1.2,
                                cursor: 'default',
                              }}
                            >
                              {item.name}
                            </Typography>
                          )}
                        </TableCell>
                      )
                    )}
                    <TableCell
                      align="center"
                      sx={{
                        width: sumColumnWidth,
                        minWidth: sumColumnWidth,
                        maxWidth: sumColumnWidth,
                        fontWeight: 700,
                        backgroundColor: 'action.hover',
                      }}
                    >
                      {t('rowSum')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {verticalNodes.map((verticalNode, rowIndex) => (
                    <TableRow key={`${verticalNode.type}-${verticalNode.id}`}>
                      <TableCell
                        sx={{
                          minWidth: firstColumnMinWidth,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {verticalNode.statement ? (
                            <Tooltip title={verticalNode.statement} arrow placement="top-start">
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: { xs: 'normal', xl: 'nowrap' },
                                  wordBreak: 'break-word',
                                  display: { xs: '-webkit-box', xl: 'block' },
                                  WebkitLineClamp: { xs: 2, xl: 'unset' },
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: { xs: 'clip', xl: 'ellipsis' },
                                  cursor: 'default',
                                }}
                              >
                                {verticalNode.name}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: { xs: 'normal', xl: 'nowrap' },
                                wordBreak: 'break-word',
                                display: { xs: '-webkit-box', xl: 'block' },
                                WebkitLineClamp: { xs: 2, xl: 'unset' },
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: { xs: 'clip', xl: 'ellipsis' },
                                cursor: 'default',
                              }}
                            >
                              {verticalNode.name}
                            </Typography>
                          )}
                          {(mode === 'valueMissionVision' || mode === 'goalMissionVision') && (
                            <Chip
                              size="small"
                              label={
                                verticalNode.type === 'mission'
                                  ? t('types.mission')
                                  : verticalNode.type === 'vision'
                                    ? t('types.vision')
                                    : t('axes.value')
                              }
                            />
                          )}
                        </Box>
                      </TableCell>

                      {horizontalNodes.map(
                        (horizontalNode: { id: string; name: string }, columnIndex: number) => {
                          const score = matrixScores[rowIndex]?.[columnIndex] ?? null
                          const selectValue = score === null ? '' : String(score)

                          return (
                            <TableCell
                              key={`${verticalNode.type}-${verticalNode.id}-${horizontalNode.id}`}
                              align="center"
                              sx={{
                                width: matrixColumnWidth,
                                minWidth: matrixColumnWidth,
                                maxWidth: matrixColumnWidth,
                                backgroundColor: getCellBackground(score),
                                transition: 'background-color 150ms ease-in-out',
                              }}
                            >
                              <Select
                                value={selectValue}
                                size="small"
                                displayEmpty
                                onChange={event =>
                                  void updateCell(horizontalNode, verticalNode, event.target.value)
                                }
                                sx={{ minWidth: 90 }}
                              >
                                <MenuItem value="">{t('emptyCell')}</MenuItem>
                                {scoreOptions.map(option => (
                                  <MenuItem
                                    key={`option-${option.value}`}
                                    value={String(option.value)}
                                  >
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                          )
                        }
                      )}

                      <TableCell
                        align="center"
                        sx={{
                          width: sumColumnWidth,
                          minWidth: sumColumnWidth,
                          maxWidth: sumColumnWidth,
                          fontWeight: 700,
                          backgroundColor: 'action.hover',
                        }}
                      >
                        {formatSignedNumber(rowSums[rowIndex] ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell sx={{ minWidth: firstColumnMinWidth, fontWeight: 700 }}>
                      {t('columnSum')}
                    </TableCell>
                    {columnSums.map((sum: number, index: number) => (
                      <TableCell
                        key={`column-sum-${index}`}
                        align="center"
                        sx={{
                          width: matrixColumnWidth,
                          minWidth: matrixColumnWidth,
                          maxWidth: matrixColumnWidth,
                          fontWeight: 700,
                        }}
                      >
                        {formatSignedNumber(sum)}
                      </TableCell>
                    ))}
                    <TableCell
                      align="center"
                      sx={{
                        width: sumColumnWidth,
                        minWidth: sumColumnWidth,
                        maxWidth: sumColumnWidth,
                        fontWeight: 700,
                      }}
                    >
                      {formatSignedNumber(totalSum)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        )}
      </Paper>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mt: 1,
          mb: 0.5,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          onClick={() => openAddDialog('vertical')}
          startIcon={<AddIcon />}
        >
          {t('addType', { type: verticalButtonTypeLabel })}
        </Button>
        <Button
          variant="contained"
          onClick={() => openAddDialog('horizontal')}
          startIcon={<AddIcon />}
        >
          {t('addType', { type: horizontalButtonTypeLabel })}
        </Button>
      </Box>

      <Dialog open={addDialog.open} onClose={resetAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('addType', {
            type:
              addDialog.axis === 'vertical'
                ? verticalTypes.map(type => entityTypeLabel[type]).join('/')
                : entityTypeLabel[horizontalType],
          })}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="new-element-type-label">{t('entityType')}</InputLabel>
              <Select<AxisEntityType>
                labelId="new-element-type-label"
                value={newElementType}
                label={t('entityType')}
                onChange={event => setNewElementType(event.target.value as AxisEntityType)}
              >
                {(addDialog.axis === 'horizontal' ? [horizontalType] : verticalTypes).map(type => (
                  <MenuItem key={`type-${type}`} value={type}>
                    {entityTypeLabel[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('name')}
              value={newElementName}
              onChange={event => setNewElementName(event.target.value)}
              fullWidth
              autoFocus
            />

            <TextField
              label={statementLabelByType[newElementType]}
              value={newElementStatement}
              onChange={event => setNewElementStatement(event.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetAddDialog}>{t('cancel')}</Button>
          <Button variant="contained" onClick={() => void createEntity()}>
            {t('create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MatrixEditorPage
