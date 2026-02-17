'use client'

import React from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  Download as DownloadIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material'
import { useMutation, useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import { useSnackbar } from 'notistack'
import { GET_BUSINESS_PROCESSES, UPDATE_BUSINESS_PROCESS } from '@/graphql/businessProcess'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCompanyContext } from '@/contexts/CompanyContext'

const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start" />
    <bpmn:task id="Task_1" name="Task" />
    <bpmn:endEvent id="EndEvent_1" name="End" />
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="392" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="392" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`

const PROCESS_EDITOR_SELECTION_KEY = 'process-editor:selected-process-id'

type ValidationPanelState = {
  severity: 'error' | 'warning'
  title: string
  messages: string[]
}

const ProcessEditorPage = () => {
  const t = useTranslations('processEditor')
  const { enqueueSnackbar } = useSnackbar()
  const { selectedCompanyId, loading: companyLoading } = useCompanyContext()
  const companyWhere = useCompanyWhere('company')

  const { data, loading, error } = useQuery(GET_BUSINESS_PROCESSES, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { where: companyWhere },
  })

  const [updateBusinessProcess, { loading: saving }] = useMutation(UPDATE_BUSINESS_PROCESS)

  const processes = React.useMemo(() => data?.businessProcesses || [], [data?.businessProcesses])
  const [selectedProcessId, setSelectedProcessId] = React.useState<string>('')
  const [isDirty, setIsDirty] = React.useState(false)
  const [isModelerReady, setIsModelerReady] = React.useState(false)
  const [modelerError, setModelerError] = React.useState<string | null>(null)
  const [validationPanel, setValidationPanel] = React.useState<ValidationPanelState | null>(null)

  const modelerRef = React.useRef<any>(null)
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const selectedProcess = React.useMemo(
    () => processes.find((process: any) => process.id === selectedProcessId),
    [processes, selectedProcessId]
  )

  const selectionStorageKey = React.useMemo(
    () =>
      selectedCompanyId
        ? `${PROCESS_EDITOR_SELECTION_KEY}:${selectedCompanyId}`
        : PROCESS_EDITOR_SELECTION_KEY,
    [selectedCompanyId]
  )

  const importXmlIntoCanvas = React.useCallback(
    async (xml: string) => {
      const modeler = modelerRef.current
      if (!modeler) return
      await modeler.importXML(xml)
      const canvas = modeler.get('canvas') as any
      canvas.zoom('fit-viewport')
      setIsDirty(false)
    },
    [setIsDirty]
  )

  const validateBpmnXml = React.useCallback(async (xml: string) => {
    try {
      const bpmnModdleModule = (await import('bpmn-moddle')) as any
      const BpmnModdleConstructor =
        bpmnModdleModule?.BpmnModdle ??
        bpmnModdleModule?.default?.BpmnModdle ??
        bpmnModdleModule?.default?.default ??
        bpmnModdleModule?.default ??
        bpmnModdleModule

      if (typeof BpmnModdleConstructor !== 'function') {
        throw new Error('BPMN validation library could not be initialized.')
      }

      const moddle = new BpmnModdleConstructor()
      const validationResult = (await moddle.fromXML(xml)) as any

      const rootType = validationResult?.rootElement?.$type
      if (rootType !== 'bpmn:Definitions') {
        return {
          isValid: false,
          message: 'Invalid BPMN XML: root element must be bpmn:Definitions.',
          warnings: [] as string[],
        }
      }

      const warnings = ((validationResult?.warnings ?? []) as any[])
        .map(warning => warning?.message)
        .filter(Boolean)

      const semanticErrors: string[] = []
      const definitions = validationResult?.rootElement
      const rootElements = Array.isArray(definitions?.rootElements) ? definitions.rootElements : []
      const bpmnProcesses = rootElements.filter((element: any) => element?.$type === 'bpmn:Process')

      if (bpmnProcesses.length === 0) {
        semanticErrors.push('BPMN must contain at least one process.')
      }

      bpmnProcesses.forEach((process: any) => {
        const processName =
          typeof process?.name === 'string' && process.name.trim() ? process.name.trim() : null
        const rawProcessId = typeof process?.id === 'string' ? process.id : null
        const isGenericProcessId = !!rawProcessId && /^Process_\d+$/i.test(rawProcessId)
        const processLabel = processName || (!isGenericProcessId ? rawProcessId : null)
        const processSuffix = processLabel ? ` in process "${processLabel}"` : ''
        const flowElements = Array.isArray(process?.flowElements) ? process.flowElements : []

        if (flowElements.length === 0) {
          semanticErrors.push(`The BPMN must contain flow elements${processSuffix}.`)
          return
        }

        const startEvents = flowElements.filter(
          (element: any) => element?.$type === 'bpmn:StartEvent'
        )
        const endEvents = flowElements.filter((element: any) => element?.$type === 'bpmn:EndEvent')

        if (startEvents.length === 0) {
          semanticErrors.push(`At least one start event is required${processSuffix}.`)
        }

        if (endEvents.length === 0) {
          semanticErrors.push(`At least one end event is required${processSuffix}.`)
        }

        const flowElementsById = new Map<string, any>()
        flowElements.forEach((element: any) => {
          if (typeof element?.id === 'string' && element.id.length > 0) {
            flowElementsById.set(element.id, element)
          }
        })

        const elementIds = new Set(Array.from(flowElementsById.keys()))

        const formatTypeLabel = (bpmnType: string | undefined) => {
          if (!bpmnType) return 'element'
          return bpmnType
            .replace('bpmn:', '')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase()
        }

        const getElementDisplayLabel = (element: any) => {
          if (!element) return 'Unknown element'

          const elementName =
            typeof element?.name === 'string' && element.name.trim() ? element.name.trim() : null
          const elementId =
            typeof element?.id === 'string' && element.id.trim() ? element.id.trim() : null
          const typeLabel = formatTypeLabel(element?.$type)

          if (elementName) return `${elementName} (${typeLabel})`
          if (elementId) return `${typeLabel} (${elementId})`
          return `Unnamed ${typeLabel}`
        }

        const flowNodes = flowElements.filter(
          (element: any) =>
            element?.$type !== 'bpmn:SequenceFlow' && typeof element?.id === 'string'
        )
        const incomingById = new Map<string, number>()
        const outgoingById = new Map<string, number>()
        const edgesBySource = new Map<string, string[]>()

        flowNodes.forEach((node: any) => {
          incomingById.set(node.id, 0)
          outgoingById.set(node.id, 0)
        })

        const sequenceFlows = flowElements.filter(
          (element: any) => element?.$type === 'bpmn:SequenceFlow'
        )
        sequenceFlows.forEach((sequenceFlow: any) => {
          const sourceId = sequenceFlow?.sourceRef?.id
          const targetId = sequenceFlow?.targetRef?.id
          const sequenceFlowId = sequenceFlow?.id || 'UnknownSequenceFlow'
          const sequenceFlowLabel =
            (typeof sequenceFlow?.name === 'string' && sequenceFlow.name.trim()) || sequenceFlowId

          if (!sourceId || !targetId) {
            semanticErrors.push(
              `Sequence flow "${sequenceFlowLabel}" must define both source and target elements.`
            )
            return
          }

          if (!elementIds.has(sourceId)) {
            semanticErrors.push(
              `Sequence flow "${sequenceFlowLabel}" references an unknown source element (${sourceId}).`
            )
          }

          if (!elementIds.has(targetId)) {
            semanticErrors.push(
              `Sequence flow "${sequenceFlowLabel}" references an unknown target element (${targetId}).`
            )
          }

          if (sourceId && targetId) {
            outgoingById.set(sourceId, (outgoingById.get(sourceId) ?? 0) + 1)
            incomingById.set(targetId, (incomingById.get(targetId) ?? 0) + 1)
            const currentTargets = edgesBySource.get(sourceId) ?? []
            edgesBySource.set(sourceId, [...currentTargets, targetId])
          }
        })

        startEvents.forEach((event: any) => {
          const outCount = outgoingById.get(event.id) ?? 0
          if (outCount === 0) {
            semanticErrors.push(
              `${getElementDisplayLabel(event)} must have an outgoing sequence flow.`
            )
          }
        })

        endEvents.forEach((event: any) => {
          const inCount = incomingById.get(event.id) ?? 0
          if (inCount === 0) {
            semanticErrors.push(
              `${getElementDisplayLabel(event)} must have an incoming sequence flow.`
            )
          }
        })

        flowNodes.forEach((node: any) => {
          const nodeType = node?.$type
          const nodeId = node?.id
          if (!nodeId) return

          if (
            nodeType === 'bpmn:StartEvent' ||
            nodeType === 'bpmn:EndEvent' ||
            nodeType === 'bpmn:BoundaryEvent'
          ) {
            return
          }

          const inCount = incomingById.get(nodeId) ?? 0
          const outCount = outgoingById.get(nodeId) ?? 0
          const nodeLabel = getElementDisplayLabel(node)

          if (inCount === 0) {
            semanticErrors.push(`${nodeLabel} has no incoming sequence flow.`)
          }

          if (outCount === 0) {
            semanticErrors.push(`${nodeLabel} has no outgoing sequence flow.`)
          }
        })

        const startIds: string[] = startEvents
          .map((event: any) => event?.id)
          .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
        const endIds: string[] = endEvents
          .map((event: any) => event?.id)
          .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)

        if (startIds.length > 0 && endIds.length > 0) {
          const visited = new Set<string>()
          const queue = [...startIds]

          while (queue.length > 0) {
            const current = queue.shift() as string
            if (visited.has(current)) continue
            visited.add(current)

            const nextTargets = edgesBySource.get(current) ?? []
            nextTargets.forEach(targetId => {
              if (!visited.has(targetId)) {
                queue.push(targetId)
              }
            })
          }

          const reachableEndExists = endIds.some(endId => visited.has(endId))
          if (!reachableEndExists) {
            semanticErrors.push(
              `There is no sequence-flow path from any start event to any end event${processSuffix}.`
            )
          }

          const unreachableEnds = endIds.filter(endId => !visited.has(endId))
          unreachableEnds.forEach(endId => {
            const endEvent = flowElementsById.get(endId)
            semanticErrors.push(
              `${getElementDisplayLabel(endEvent)} is not reachable from any start event.`
            )
          })
        }
      })

      const blockingErrors = [
        ...semanticErrors,
        ...warnings.map(warning => `Parser warning: ${warning}`),
      ]
      if (blockingErrors.length > 0) {
        return {
          isValid: false,
          message: blockingErrors[0],
          warnings: blockingErrors.slice(1),
        }
      }

      return {
        isValid: true,
        message: null as string | null,
        warnings,
      }
    } catch (validationError: any) {
      const warningMessages = ((validationError?.warnings ?? []) as any[])
        .map(warning => warning?.message)
        .filter(Boolean)
      const message =
        validationError?.message || warningMessages[0] || 'Invalid BPMN XML. Please fix the file.'

      return {
        isValid: false,
        message,
        warnings: warningMessages,
      }
    }
  }, [])

  const buildValidationMessages = React.useCallback(
    (message: string | null, warnings: string[]) => {
      const messages = [message, ...warnings].filter(Boolean) as string[]
      return Array.from(new Set(messages))
    },
    []
  )

  const closeValidationPanel = React.useCallback(() => {
    setValidationPanel(null)
  }, [])

  React.useEffect(() => {
    if (!canvasRef.current || modelerRef.current) return

    let destroyed = false
    let onChange: (() => void) | null = null

    const initializeModeler = async () => {
      try {
        const { default: Modeler } = await import('bpmn-js/lib/Modeler')
        if (destroyed || !canvasRef.current) return

        const modeler = new Modeler({
          container: canvasRef.current,
          keyboard: {
            bindTo: window,
          },
        })

        onChange = () => setIsDirty(true)
        modeler.on('commandStack.changed', onChange)
        modelerRef.current = modeler
        setModelerError(null)
        setIsModelerReady(true)
      } catch (error) {
        setIsModelerReady(false)
        setModelerError(
          error instanceof Error ? error.message : 'Unknown BPMN initialization error'
        )
      }
    }

    void initializeModeler()

    return () => {
      destroyed = true
      const modeler = modelerRef.current
      if (modeler && onChange) {
        modeler.off('commandStack.changed', onChange)
      }
      if (modeler) {
        modeler.destroy()
      }
      modelerRef.current = null
      setIsModelerReady(false)
    }
  }, [])

  React.useEffect(() => {
    if (companyLoading || !selectedCompanyId || loading) return

    if (processes.length === 0) {
      setSelectedProcessId('')
      return
    }

    const hasCurrentSelection = processes.some((process: any) => process.id === selectedProcessId)
    if (hasCurrentSelection) {
      return
    }

    const savedSelectionId = window.localStorage.getItem(selectionStorageKey)
    const hasSavedSelection =
      !!savedSelectionId && processes.some((process: any) => process.id === savedSelectionId)

    if (hasSavedSelection && savedSelectionId) {
      setSelectedProcessId(savedSelectionId)
      return
    }

    setSelectedProcessId(processes[0].id)
  }, [
    companyLoading,
    selectedCompanyId,
    loading,
    processes,
    selectedProcessId,
    selectionStorageKey,
  ])

  React.useEffect(() => {
    if (companyLoading || !selectedCompanyId) return

    if (!selectedProcessId) {
      return
    }

    const hasCurrentSelection = processes.some((process: any) => process.id === selectedProcessId)
    if (!hasCurrentSelection) {
      return
    }

    window.localStorage.setItem(selectionStorageKey, selectedProcessId)
  }, [companyLoading, selectedCompanyId, selectedProcessId, selectionStorageKey, processes])

  React.useEffect(() => {
    if (!isModelerReady) return
    const xml = selectedProcess?.bpmnXml || DEFAULT_BPMN_XML
    void importXmlIntoCanvas(xml).catch(error => {
      setModelerError(error instanceof Error ? error.message : 'Unknown BPMN import error')
      enqueueSnackbar(t('messages.loadError'), { variant: 'error' })
    })
  }, [importXmlIntoCanvas, isModelerReady, selectedProcess])

  const handleProcessChange = async (nextProcessId: string) => {
    if (isDirty) {
      const shouldContinue = window.confirm(t('discardChangesConfirm'))
      if (!shouldContinue) {
        return
      }
    }
    setSelectedProcessId(nextProcessId)
  }

  const handleSave = async () => {
    if (!selectedProcess || !modelerRef.current) return
    try {
      setValidationPanel(null)
      const result = await modelerRef.current.saveXML({ format: true })
      const xml = result.xml
      if (!xml) {
        enqueueSnackbar(t('messages.saveError'), { variant: 'error' })
        return
      }

      const validation = await validateBpmnXml(xml)
      if (!validation.isValid) {
        setValidationPanel({
          severity: 'error',
          title: 'BPMN validation failed',
          messages: buildValidationMessages(validation.message, validation.warnings),
        })
        enqueueSnackbar(`${t('messages.saveError')}: ${validation.message}`, { variant: 'error' })
        return
      }

      if (validation.warnings.length > 0) {
        setValidationPanel({
          severity: 'warning',
          title: 'BPMN validation warnings',
          messages: buildValidationMessages(null, validation.warnings),
        })
        enqueueSnackbar(validation.warnings[0], { variant: 'warning' })
      }

      await updateBusinessProcess({
        variables: {
          id: selectedProcess.id,
          input: {
            bpmnXml: { set: xml },
          },
        },
      })

      setIsDirty(false)
      enqueueSnackbar(t('messages.saveSuccess'), { variant: 'success' })
    } catch {
      enqueueSnackbar(t('messages.saveError'), { variant: 'error' })
    }
  }

  const handleResetToDefault = async () => {
    try {
      await importXmlIntoCanvas(DEFAULT_BPMN_XML)
      setIsDirty(true)
    } catch {
      enqueueSnackbar(t('messages.resetError'), { variant: 'error' })
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setValidationPanel(null)
      const xml = await file.text()

      const validation = await validateBpmnXml(xml)
      if (!validation.isValid) {
        setValidationPanel({
          severity: 'error',
          title: 'BPMN validation failed',
          messages: buildValidationMessages(validation.message, validation.warnings),
        })
        enqueueSnackbar(`${t('messages.importError')}: ${validation.message}`, { variant: 'error' })
        return
      }

      await importXmlIntoCanvas(xml)
      setIsDirty(true)

      if (validation.warnings.length > 0) {
        setValidationPanel({
          severity: 'warning',
          title: 'BPMN validation warnings',
          messages: buildValidationMessages(null, validation.warnings),
        })
        enqueueSnackbar(validation.warnings[0], { variant: 'warning' })
      }

      enqueueSnackbar(t('messages.importSuccess'), { variant: 'success' })
    } catch {
      enqueueSnackbar(t('messages.importError'), { variant: 'error' })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleExportXml = async () => {
    if (!modelerRef.current || !selectedProcess) return

    try {
      const result = await modelerRef.current.saveXML({ format: true })
      const xml = result.xml
      if (!xml) {
        enqueueSnackbar(t('messages.exportError'), { variant: 'error' })
        return
      }

      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedProcess.name.replace(/\s+/g, '_')}.bpmn`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      enqueueSnackbar(t('messages.exportError'), { variant: 'error' })
    }
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {t('title')}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Autocomplete
              sx={{ minWidth: 320 }}
              size="small"
              options={processes}
              loading={loading}
              value={selectedProcess || null}
              disableClearable={processes.length > 0}
              getOptionLabel={option => option?.name ?? ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => {
                const nextProcessId = value?.id ?? ''
                if (nextProcessId === selectedProcessId) {
                  return
                }
                void handleProcessChange(nextProcessId)
              }}
              disabled={loading || processes.length === 0}
              renderInput={params => <TextField {...params} label={t('process')} />}
            />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => void handleSave()}
              disabled={!selectedProcess || saving}
            >
              {saving ? t('saving') : t('save')}
            </Button>

            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleImportClick}
              disabled={!isModelerReady}
            >
              {t('importXml')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".bpmn,.xml,text/xml"
              style={{ display: 'none' }}
              onChange={event => void handleImportFile(event)}
            />

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => void handleExportXml()}
              disabled={!isModelerReady}
            >
              {t('exportXml')}
            </Button>

            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={() => void handleResetToDefault()}
              disabled={!isModelerReady}
            >
              {t('resetDiagram')}
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            {isDirty && (
              <Typography variant="body2" color="warning.main" sx={{ whiteSpace: 'nowrap' }}>
                {t('unsavedChanges')}
              </Typography>
            )}

            {!selectedProcess && (
              <Typography variant="body2" color="info.main" sx={{ whiteSpace: 'nowrap' }}>
                {t('noProcessSelected')}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('messages.loadError')}
        </Alert>
      )}

      {modelerError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('messages.loadError')}: {modelerError}
        </Alert>
      )}

      <Paper
        sx={{
          height: 'calc(100vh - 280px)',
          minHeight: 600,
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={canvasRef}
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: 'background.paper',
            '& .djs-palette': {
              display: 'block',
              visibility: 'visible',
              zIndex: 20,
            },
            '& .djs-context-pad': {
              visibility: 'visible',
              zIndex: 20,
            },
          }}
        />

        {loading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.35)',
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('description')}
      </Typography>

      <Dialog open={!!validationPanel} onClose={closeValidationPanel} fullWidth maxWidth="md">
        <DialogTitle>{validationPanel?.title || 'Validation'}</DialogTitle>
        <DialogContent dividers>
          {validationPanel && (
            <Alert severity={validationPanel.severity}>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {validationPanel.messages.map(message => (
                  <Box component="li" key={message}>
                    <Typography variant="body2">{message}</Typography>
                  </Box>
                ))}
              </Box>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeValidationPanel} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProcessEditorPage
