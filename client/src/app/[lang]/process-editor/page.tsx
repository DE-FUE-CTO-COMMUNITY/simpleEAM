'use client'

import React from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
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

  const modelerRef = React.useRef<any>(null)
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const selectedProcess = React.useMemo(
    () => processes.find((process: any) => process.id === selectedProcessId),
    [processes, selectedProcessId]
  )

  const selectionStorageKey = React.useMemo(
    () =>
      selectedCompanyId ? `${PROCESS_EDITOR_SELECTION_KEY}:${selectedCompanyId}` : PROCESS_EDITOR_SELECTION_KEY,
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
  }, [companyLoading, selectedCompanyId, loading, processes, selectedProcessId, selectionStorageKey])

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
      const result = await modelerRef.current.saveXML({ format: true })
      const xml = result.xml
      if (!xml) {
        enqueueSnackbar(t('messages.saveError'), { variant: 'error' })
        return
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
    } catch (saveError) {
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
      const xml = await file.text()
      await importXmlIntoCanvas(xml)
      setIsDirty(true)
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
            <FormControl
              sx={{ minWidth: 300 }}
              size="small"
              disabled={loading || processes.length === 0}
            >
              <InputLabel id="process-select-label">{t('process')}</InputLabel>
              <Select
                labelId="process-select-label"
                value={selectedProcessId}
                label={t('process')}
                onChange={event => void handleProcessChange(event.target.value)}
              >
                {processes.map((process: any) => (
                  <MenuItem key={process.id} value={process.id}>
                    {process.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          </Stack>

          {!selectedProcess && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('noProcessSelected')}
            </Alert>
          )}
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
    </Box>
  )
}

export default ProcessEditorPage
