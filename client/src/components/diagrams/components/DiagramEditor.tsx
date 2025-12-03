'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLazyQuery, useMutation } from '@apollo/client'
import { FONT_FAMILY } from '@excalidraw/excalidraw'
import { useSnackbar } from 'notistack'
import { useTranslations, useLocale } from 'next-intl'
import type { ExcalidrawFont } from '@/components/companies/types'
import { useThemeMode } from '@/contexts/ThemeContext'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import { useAuth, isAdmin, isArchitect } from '@/lib/auth'
import { useThemeConfig } from '@/lib/runtime-config'
import { CREATE_DIAGRAM, GET_DIAGRAM, UPDATE_DIAGRAM } from '@/graphql/diagram'
import { convertExcalidrawToDrawIO, downloadDrawIOFile } from '@/utils/drawioConverter'
import DiagramLibrarySidebar, { type DiagramLibrarySidebarHandle } from './DiagramLibrarySidebar'
import DeleteDiagramDialog from './dialogs/DeleteDiagramDialog'
import LocalOpenDiagramDialog, { LocalOpenDialogDiagram } from './dialogs/LocalOpenDiagramDialog'
import LocalSaveDiagramDialog from './dialogs/LocalSaveDiagramDialog'
import CollaborationDialog, { type CollaborationDialogHandle } from './dialogs/CollaborationDialog'
import type { LocalStoredDiagramMetadata } from './dialogs/types'
import {
  type CollaborationAccessDecision,
  type CurrentDiagramInfo,
  useExcalidrawCollaboration,
} from '@/components/diagrams/hooks/useExcalidrawCollaboration'

const LOCAL_DRAFT_STORAGE_KEY = 'diagram-editor-local-draft'

type CollaborationPermissionFailure = 'missing-edit' | 'missing-company' | 'forbidden-company'

interface LocalDiagramDraftPayload {
  diagramJson: string
  metadata?: LocalStoredDiagramMetadata | null
  diagramId?: string | null
  diagramName?: string | null
  updatedAt: string
}

interface MinimalExcalidrawProps {
  theme: 'light' | 'dark'
  initialData: any
  onNewDiagram: () => void
  onOpenDiagram: () => void
  onSaveDiagram: () => void
  onSaveAsDiagram: () => void
  onDeleteDiagram: () => void
  canDeleteDiagram: boolean
  onImportJSON: () => void
  onExportJSON: () => void
  onExportDrawIO: () => void
  onExportPNG: () => void
  onOpenCollaboration: () => void
  onFindOnCanvas: () => void
  isCollaborating: boolean
  onSceneChange: (elements: readonly any[], appState: any, files: any) => void
  onReady: (api: any) => void
}

const ExcalidrawCanvas = dynamic<MinimalExcalidrawProps>(
  async () => {
    await import('@excalidraw/excalidraw/index.css')
    const { Excalidraw, MainMenu } = await import('@excalidraw/excalidraw')

    const MenuIcon = ({ path }: { path: string }) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    )

    const MinimalExcalidraw = ({
      theme,
      initialData,
      onNewDiagram,
      onOpenDiagram,
      onSaveDiagram,
      onSaveAsDiagram,
      onDeleteDiagram,
      canDeleteDiagram,
      onImportJSON,
      onExportJSON,
      onExportDrawIO,
      onExportPNG,
      onOpenCollaboration,
      onFindOnCanvas,
      isCollaborating,
      onSceneChange,
      onReady,
    }: MinimalExcalidrawProps) => {
      const t = useTranslations('diagrams')
      const locale = useLocale()

      const placeholder = (action: string) => () =>
        console.info(`[DiagramEditor] ${action} action not implemented yet.`)
      const MainMenuDefaultItems = (MainMenu as any).DefaultItems

      const excalidrawLangCode = useMemo(() => {
        switch (locale) {
          case 'de':
            return 'de-DE'
          case 'en':
          default:
            return 'en'
        }
      }, [locale])

      return (
        <div style={{ height: '100%', width: '100%' }}>
          <Excalidraw
            theme={theme}
            initialData={initialData}
            langCode={excalidrawLangCode}
            onChange={onSceneChange}
            excalidrawAPI={api => {
              onReady(api)
            }}
          >
            <MainMenu>
              <MainMenu.Item
                onSelect={onNewDiagram}
                icon={<MenuIcon path="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />}
                shortcut="Ctrl+N"
              >
                {t('actions.new')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onOpenDiagram}
                icon={
                  <MenuIcon path="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                }
                shortcut="Ctrl+O"
              >
                {t('actions.open')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onSaveDiagram}
                icon={
                  <MenuIcon path="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
                }
                shortcut="Ctrl+S"
              >
                {t('actions.save')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onSaveAsDiagram}
                icon={
                  <MenuIcon path="M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M17,7H19V19H5V5H14V7H17M10,17L14,13L10.5,9.5L9.08,10.92L11.5,13.33L12.92,11.92L17,16V17H10Z" />
                }
                shortcut="Ctrl+Shift+S"
              >
                {t('actions.saveAs')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={canDeleteDiagram ? onDeleteDiagram : undefined}
                disabled={!canDeleteDiagram}
                icon={
                  <MenuIcon path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                }
                shortcut="Shift+Del"
              >
                {t('actions.delete')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={placeholder('manualSync')}
                icon={
                  <MenuIcon path="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                }
                shortcut="Ctrl+R"
              >
                {t('actions.syncDatabase')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={placeholder('capabilityMap')}
                icon={
                  <MenuIcon path="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z M13,17V15H18V13H13V11L10,14L13,17Z M11,10V8H6V10H11V12L14,9L11,6V8Z" />
                }
                shortcut="Ctrl+M"
              >
                {t('actions.generateCapabilityMap')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onFindOnCanvas}
                icon={
                  <MenuIcon path="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                }
                shortcut="Ctrl+F"
              >
                {t('actions.findOnCanvas')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onOpenCollaboration}
                icon={
                  <MenuIcon path="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,12C10.21,12 12,10.21 12,8C12,5.79 10.21,4 8,4C5.79,4 4,5.79 4,8C4,10.21 5.79,12 8,12M8,14C5.33,14 0,15.33 0,18V20H8V18C8,16.9 8.63,15.72 9.69,14.81C9.08,14.61 8.42,14.5 8,14Z" />
                }
                shortcut="Ctrl+L"
              >
                {isCollaborating
                  ? (t('collaborationDialog.activeMenuLabel') ?? t('actions.liveCollaboration'))
                  : (t('actions.liveCollaboration') ?? 'Live Collaboration')}
              </MainMenu.Item>
              <MainMenu.Separator />
              <MainMenu.Item
                onSelect={onImportJSON}
                icon={
                  <MenuIcon path="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V14H16V12H8Z M10,10V16H14V10H10Z" />
                }
                shortcut="Ctrl+I"
              >
                {t('actions.importJSON')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onExportJSON}
                icon={
                  <MenuIcon path="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M8,12V14H16V12H8Z M10,10V16H14V10H10Z" />
                }
                shortcut="Ctrl+E"
              >
                {t('actions.exportJSON')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onExportDrawIO}
                icon={
                  <MenuIcon path="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7.27C13.4,7.61 13.6,8.26 13.6,9A2.4,2.4 0 0,1 11.2,11.4A2.4,2.4 0 0,1 8.8,9A2.4,2.4 0 0,1 11.2,6.6C11.93,6.6 12.58,7 12.92,7.4V5.73C12.31,5.39 12,4.74 12,4A2,2 0 0,1 14,2M21,9V15C21,16.1 20.1,17 19,17H13L16,14H19V10H16L13,7H19C20.1,7 21,7.9 21,9M8,13A2,2 0 0,1 6,15A2,2 0 0,1 4,13A2,2 0 0,1 6,11A2,2 0 0,1 8,13Z" />
                }
                shortcut="Ctrl+D"
              >
                {t('actions.exportDrawIO')}
              </MainMenu.Item>
              <MainMenu.Item
                onSelect={onExportPNG}
                icon={
                  <MenuIcon path="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,17L16,12H13V8H11V12H8L12,17Z" />
                }
                shortcut="Ctrl+Shift+E"
              >
                {t('actions.exportPNG')}
              </MainMenu.Item>
              <MainMenu.Separator />
              <MainMenuDefaultItems.ChangeCanvasBackground />
            </MainMenu>
          </Excalidraw>
        </div>
      )
    }

    return MinimalExcalidraw
  },
  {
    ssr: false,
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Diagram Editor</div>,
  }
)

const COMPANY_FONT_TO_EXCALIDRAW: Record<ExcalidrawFont, number> = {
  'Comic Shanns': FONT_FAMILY['Comic Shanns'],
  Excalifont: FONT_FAMILY.Excalifont,
  'Lilita One': FONT_FAMILY['Lilita One'],
  Nunito: FONT_FAMILY.Nunito,
}

const FALLBACK_EXCALIDRAW_FONT = FONT_FAMILY.Excalifont

export default function DiagramEditor() {
  const { mode } = useThemeMode()
  const {
    selectedCompany,
    selectedCompanyId,
    companies,
    setSelectedCompanyId,
    setCompanySelectionLock,
  } = useCompanyContext()
  const { currentPerson, userEmail } = useCurrentPerson()
  const { keycloak } = useAuth()
  const themeConfig = useThemeConfig()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentDiagramName, setCurrentDiagramName] = useState<string | null>(null)
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null)
  const [currentDiagramMetadata, setCurrentDiagramMetadata] = useState<LocalStoredDiagramMetadata>()
  const [, setHasUnsavedChanges] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCollaborationDialogOpen, setIsCollaborationDialogOpen] = useState(false)
  const [saveDialogInitialName, setSaveDialogInitialName] = useState<string | null>(null)
  const [saveDialogInitialMetadata, setSaveDialogInitialMetadata] = useState<
    LocalStoredDiagramMetadata | undefined
  >(undefined)
  const [saveDialogForceSaveAs, setSaveDialogForceSaveAs] = useState(false)
  const [createDiagramMutation] = useMutation(CREATE_DIAGRAM)
  const [updateDiagramMutation] = useMutation(UPDATE_DIAGRAM)
  const [fetchDiagramById] = useLazyQuery(GET_DIAGRAM)
  const { enqueueSnackbar } = useSnackbar()
  const collaborationDialogRef = useRef<CollaborationDialogHandle | null>(null)
  const isCollaborationHostRef = useRef(false)
  const pendingCollaborationSyncRef = useRef(false)
  const activeDiagramIdRef = useRef<string | null>(null)
  const collaborationTranslations = useTranslations('diagrams.collaborationDialog')
  const excalidrawAPIRef = useRef<any>(null)
  const sidebarRef = useRef<DiagramLibrarySidebarHandle | null>(null)
  const sceneInitializedRef = useRef(false)
  const pendingDiagramProcessingRef = useRef(false)
  const suppressSceneChangeRef = useRef(false)
  const autoJoinAttemptedRef = useRef(false)
  const authorizationFailureRef = useRef(false)
  const authorizationSuccessRef = useRef(false)
  const authorizationOutcomeRef = useRef<{
    resolve?: () => void
    reject?: (error: Error) => void
  } | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isSceneEmpty, setIsSceneEmpty] = useState(true)

  const updateCurrentDiagramId = useCallback((diagramId: string | null) => {
    activeDiagramIdRef.current = diagramId
    setCurrentDiagramId(diagramId)
  }, [])

  useEffect(() => {
    activeDiagramIdRef.current = currentDiagramId ?? null
  }, [currentDiagramId])

  const canDeleteDiagram = useMemo(
    () => Boolean(currentDiagramId && !isSceneEmpty),
    [currentDiagramId, isSceneEmpty]
  )

  const waitForCanvasHydration = useCallback(async () => {
    if (typeof window === 'undefined') {
      return
    }

    await new Promise<void>(resolve => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve())
      })
    })
  }, [])

  const branding = useMemo(
    () => ({
      primaryColor: selectedCompany?.primaryColor || undefined,
      secondaryColor: selectedCompany?.secondaryColor || undefined,
    }),
    [selectedCompany?.primaryColor, selectedCompany?.secondaryColor]
  )

  const defaultCanvasBackground = useMemo(() => (mode === 'dark' ? '#121212' : '#ffffff'), [mode])

  const companyFontFamily = useMemo(() => {
    const diagramFont = selectedCompany?.diagramFont as ExcalidrawFont | undefined
    if (diagramFont && COMPANY_FONT_TO_EXCALIDRAW[diagramFont]) {
      return COMPANY_FONT_TO_EXCALIDRAW[diagramFont]
    }
    return FALLBACK_EXCALIDRAW_FONT
  }, [selectedCompany?.diagramFont])

  const accessibleCompanyIds = useMemo(
    () => new Set(companies.map(company => company.id)),
    [companies]
  )

  const syncSelectedCompanyToDiagram = useCallback(
    (companyId?: string | null) => {
      if (!companyId) {
        return
      }
      if (!accessibleCompanyIds.has(companyId)) {
        return
      }
      if (selectedCompanyId === companyId) {
        return
      }
      setSelectedCompanyId(companyId)
    },
    [accessibleCompanyIds, selectedCompanyId, setSelectedCompanyId]
  )

  const buildCompanyMetadata = useCallback(() => {
    if (!selectedCompanyId) {
      return undefined
    }
    return {
      id: selectedCompanyId,
      name: selectedCompany?.name ?? null,
    }
  }, [selectedCompany?.name, selectedCompanyId])

  useEffect(() => {
    const companyInfo = buildCompanyMetadata()

    const stripCompany = (metadata?: LocalStoredDiagramMetadata) => {
      if (!metadata) {
        return undefined
      }
      if (!metadata.company) {
        return metadata
      }
      const rest = { ...metadata }
      delete rest.company
      const hasFields = Object.keys(rest).length > 0
      return hasFields ? (rest as LocalStoredDiagramMetadata) : undefined
    }

    const applyCompany = (metadata?: LocalStoredDiagramMetadata) => {
      if (!companyInfo) {
        return stripCompany(metadata)
      }
      if (metadata?.company?.id === companyInfo.id && metadata.company.name === companyInfo.name) {
        return metadata
      }
      if (!metadata) {
        return { company: companyInfo }
      }
      return { ...metadata, company: companyInfo }
    }

    setCurrentDiagramMetadata(prev => applyCompany(prev))
    setSaveDialogInitialMetadata(prev => applyCompany(prev))
  }, [buildCompanyMetadata])

  const collaborationDisplayName = useMemo(() => {
    const first = currentPerson?.firstName?.trim() ?? ''
    const last = currentPerson?.lastName?.trim() ?? ''
    const combined = `${first} ${last}`.trim()
    if (combined) {
      return combined
    }

    if (currentPerson?.email?.trim()) {
      return currentPerson.email.trim()
    }

    if (userEmail?.trim()) {
      return userEmail.trim()
    }

    const token = keycloak?.tokenParsed
    const tokenName = token?.name?.trim()
    if (tokenName) {
      return tokenName
    }

    const given = token?.given_name?.trim() ?? ''
    const family = token?.family_name?.trim() ?? ''
    const tokenCombined = `${given} ${family}`.trim()
    if (tokenCombined) {
      return tokenCombined
    }

    const preferredUsername = token?.preferred_username?.trim()
    if (preferredUsername) {
      return preferredUsername
    }

    return 'Anonymous User'
  }, [
    currentPerson?.email,
    currentPerson?.firstName,
    currentPerson?.lastName,
    keycloak?.tokenParsed,
    userEmail,
  ])

  const currentDiagramInfo = useMemo<CurrentDiagramInfo | null>(() => {
    const companyIdFromMetadata = currentDiagramMetadata?.company?.id ?? null
    const companyNameFromMetadata = currentDiagramMetadata?.company?.name ?? undefined
    const fallbackCompanyId = companyIdFromMetadata ?? selectedCompanyId ?? null
    const fallbackCompanyName = companyNameFromMetadata ?? selectedCompany?.name ?? undefined

    const hasAnyInfo = Boolean(
      currentDiagramId ??
        currentDiagramName ??
        currentDiagramMetadata ??
        fallbackCompanyId ??
        fallbackCompanyName
    )

    if (!hasAnyInfo) {
      return null
    }

    return {
      id: currentDiagramId ?? null,
      title: currentDiagramName,
      metadata: typeof currentDiagramMetadata === 'undefined' ? null : currentDiagramMetadata,
      companyId: fallbackCompanyId,
      companyName: fallbackCompanyName,
    }
  }, [
    currentDiagramId,
    currentDiagramMetadata,
    currentDiagramName,
    selectedCompany?.name,
    selectedCompanyId,
  ])

  const collaborationDiagramInfo = useMemo<CurrentDiagramInfo | null>(() => {
    if (currentDiagramInfo) {
      return currentDiagramInfo
    }

    if (!selectedCompanyId && !selectedCompany?.name) {
      return null
    }

    return {
      id: null,
      title: undefined,
      metadata: null,
      companyId: selectedCompanyId ?? null,
      companyName: selectedCompany?.name ?? undefined,
    }
  }, [currentDiagramInfo, selectedCompany?.name, selectedCompanyId])

  const handleCollaborativeDiagramUpdate = useCallback(
    (diagram: CurrentDiagramInfo | null) => {
      if (!diagram) {
        return
      }

      if (typeof diagram.id !== 'undefined') {
        updateCurrentDiagramId(diagram.id ?? null)
      }

      if (typeof diagram.title !== 'undefined') {
        const normalizedTitle = diagram.title ?? null
        setCurrentDiagramName(normalizedTitle)
        setSaveDialogInitialName(normalizedTitle)
      }

      if (typeof diagram.metadata !== 'undefined') {
        const normalizedMetadata = diagram.metadata ?? undefined
        setCurrentDiagramMetadata(normalizedMetadata)
        setSaveDialogInitialMetadata(normalizedMetadata)
      }

      const diagramCompanyId = diagram.companyId ?? diagram.metadata?.company?.id ?? null
      if (diagramCompanyId) {
        const shouldSyncCompany = !isCollaborationHostRef.current || Boolean(diagram.id)
        if (shouldSyncCompany) {
          syncSelectedCompanyToDiagram(diagramCompanyId)
        }
      }
    },
    [syncSelectedCompanyToDiagram, updateCurrentDiagramId]
  )

  const checkCollaborationPermission = useCallback(
    (companyId?: string | null, options: { silent?: boolean } = {}) => {
      let failure: CollaborationPermissionFailure | null = null

      if (!isArchitect()) {
        failure = 'missing-edit'
      } else if (!companyId) {
        failure = 'missing-company'
      } else if (!isAdmin() && !accessibleCompanyIds.has(companyId)) {
        failure = 'forbidden-company'
      }

      console.log('[DiagramEditor] Collaboration permission check:', { companyId, failure })

      if (failure) {
        if (!options.silent) {
          const translationKey =
            failure === 'missing-edit'
              ? 'permissionRequired'
              : failure === 'missing-company'
                ? 'companyMissing'
                : 'companyPermissionDenied'
          const message = collaborationTranslations(translationKey as any)
          if (collaborationDialogRef.current) {
            collaborationDialogRef.current.setError(message)
          } else {
            const variant = failure === 'missing-company' ? 'warning' : 'error'
            enqueueSnackbar(message, { variant })
          }
        }
        return { allowed: false as const, reason: failure }
      }

      return { allowed: true as const }
    },
    [accessibleCompanyIds, collaborationTranslations, enqueueSnackbar]
  )

  const authorizeIncomingDiagram = useCallback(
    (diagram: CurrentDiagramInfo | null): CollaborationAccessDecision => {
      if (!diagram) {
        return 'allow'
      }

      const localDiagramId = currentDiagramInfo?.id ?? null
      const incomingDiagramId = diagram.id ?? null

      if (localDiagramId && incomingDiagramId && incomingDiagramId !== localDiagramId) {
        return 'ignore'
      }

      const resolvedCompanyId = diagram.companyId ?? diagram.metadata?.company?.id ?? null

      if (!resolvedCompanyId) {
        authorizationFailureRef.current = true
        return 'deny'
      }

      const result = checkCollaborationPermission(resolvedCompanyId)
      if (!result.allowed) {
        authorizationFailureRef.current = true
      }
      return result.allowed ? 'allow' : 'deny'
    },
    [checkCollaborationPermission, currentDiagramInfo?.id]
  )

  const handleCollaborationAuthorizationDenied = useCallback(() => {
    authorizationFailureRef.current = true
    if (authorizationOutcomeRef.current?.reject) {
      authorizationOutcomeRef.current.reject(
        new Error('collaboration-permission:denied-after-start')
      )
      authorizationOutcomeRef.current = null
    }
  }, [])

  const handleCollaborationAuthorizationGranted = useCallback(() => {
    authorizationSuccessRef.current = true
    if (authorizationOutcomeRef.current?.resolve) {
      authorizationOutcomeRef.current.resolve()
      authorizationOutcomeRef.current = null
    }
  }, [])

  const {
    startCollaboration,
    stopCollaboration: stopCollaborationBase,
    isCollaborating,
    collaborators,
    roomId,
    broadcastSceneUpdate,
    isFirstUser,
  } = useExcalidrawCollaboration({
    excalidrawAPI: excalidrawAPIRef.current,
    username: collaborationDisplayName,
    userAvatarUrl: currentPerson?.avatarUrl ?? undefined,
    currentDiagram: collaborationDiagramInfo,
    onDiagramUpdate: handleCollaborativeDiagramUpdate,
    authorizeAccess: authorizeIncomingDiagram,
    onAuthorizationDenied: handleCollaborationAuthorizationDenied,
    onAuthorizationGranted: handleCollaborationAuthorizationGranted,
  })

  const broadcastCurrentScene = useCallback(() => {
    const api = excalidrawAPIRef.current
    if (!api?.getSceneElements || !api?.getAppState) {
      return
    }

    const elements = api.getSceneElements() ?? []
    const appState = api.getAppState() ?? {}
    broadcastSceneUpdate(elements as any[], appState)
  }, [broadcastSceneUpdate])

  useEffect(() => {
    isCollaborationHostRef.current = Boolean(isFirstUser)
  }, [isFirstUser])

  const scheduleCollaborationSync = useCallback(() => {
    pendingCollaborationSyncRef.current = true
  }, [])

  useEffect(() => {
    if (!isCollaborating || !pendingCollaborationSyncRef.current) {
      return
    }
    pendingCollaborationSyncRef.current = false
    broadcastCurrentScene()
  }, [broadcastCurrentScene, collaborationDiagramInfo, isCollaborating])

  useEffect(() => {
    const lockId = 'diagram-editor-collaboration-lock'
    if (isCollaborating) {
      const reason =
        collaborationTranslations('companySwitchLockedTooltip') ||
        'Stop live collaboration before switching companies.'
      setCompanySelectionLock(lockId, reason)
    } else {
      setCompanySelectionLock(lockId, null)
    }

    return () => {
      setCompanySelectionLock(lockId, null)
    }
  }, [collaborationTranslations, isCollaborating, setCompanySelectionLock])

  const stopCollaboration = useCallback(() => {
    authorizationOutcomeRef.current?.reject?.(new Error('collaboration-stopped'))
    authorizationOutcomeRef.current = null
    authorizationFailureRef.current = false
    authorizationSuccessRef.current = false
    stopCollaborationBase()
  }, [stopCollaborationBase])

  const guardedStartCollaboration = useCallback(
    async (roomId: string) => {
      authorizationFailureRef.current = false
      authorizationSuccessRef.current = false
      authorizationOutcomeRef.current = null
      const companyId =
        currentDiagramMetadata?.company?.id ??
        currentDiagramInfo?.companyId ??
        selectedCompanyId ??
        null
      const permission = checkCollaborationPermission(companyId)
      console.log('[DiagramEditor] Collaboration permission:', permission)
      if (!permission.allowed) {
        throw new Error(`collaboration-permission:${permission.reason ?? 'denied'}`)
      }
      const outcomePromise = new Promise<void>((resolve, reject) => {
        authorizationOutcomeRef.current = { resolve, reject }
      })

      console.log('[DiagramEditor] Starting collaboration in room:', roomId)
      await startCollaboration(roomId)

      if (authorizationFailureRef.current) {
        authorizationOutcomeRef.current = null
        authorizationFailureRef.current = false
        throw new Error('collaboration-permission:denied-after-start')
      }

      if (authorizationSuccessRef.current) {
        authorizationOutcomeRef.current = null
        return
      }

      try {
        await outcomePromise
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('collaboration-permission:denied-after-start')
      }
    },
    [
      checkCollaborationPermission,
      currentDiagramInfo?.companyId,
      currentDiagramMetadata?.company?.id,
      selectedCompanyId,
      startCollaboration,
    ]
  )

  useEffect(() => {
    let isMounted = true
    const updateTheme = async () => {
      const { injectExcalidrawThemeCSS } = await import('@/styles/excalidraw-dynamic-theme')
      if (isMounted) {
        injectExcalidrawThemeCSS(mode, branding, themeConfig)
      }
    }
    void updateTheme()

    return () => {
      isMounted = false
    }
  }, [mode, branding, themeConfig])

  const excalidrawTheme = mode === 'dark' ? 'dark' : 'light'

  const initialData = useMemo(
    () => ({
      elements: [],
      appState: {
        viewBackgroundColor: defaultCanvasBackground,
        currentItemFontFamily: companyFontFamily,
      },
    }),
    [defaultCanvasBackground, companyFontFamily]
  )

  const handleExcalidrawReady = useCallback((api: any) => {
    excalidrawAPIRef.current = api
    setIsEditorReady(true)
  }, [])

  const notifyEditorNotReady = useCallback(() => {
    enqueueSnackbar('Diagram editor is not ready yet.', { variant: 'warning' })
  }, [enqueueSnackbar])

  const closeMainMenu = useCallback(() => {
    const api = excalidrawAPIRef.current
    if (api?.setAppState) {
      api.setAppState({ openMenu: null })
      return
    }

    if (api?.updateScene) {
      const currentAppState = api.getAppState?.() ?? {}
      api.updateScene({
        appState: {
          ...currentAppState,
          openMenu: null,
        },
      })
    }
  }, [])

  const serializeCurrentScene = useCallback(() => {
    const api = excalidrawAPIRef.current
    if (!api?.getSceneElements || !api?.getAppState) {
      notifyEditorNotReady()
      return null
    }

    const elements = api.getSceneElements() ?? []
    const appState = api.getAppState() ?? {}
    const filesFromApi = api.getFiles ? api.getFiles() : undefined
    let files: Record<string, unknown> | undefined
    if (filesFromApi) {
      if (filesFromApi instanceof Map) {
        files = Object.fromEntries(filesFromApi.entries())
      } else {
        files = filesFromApi as Record<string, unknown>
      }
    }

    return JSON.stringify({
      elements,
      appState: {
        ...appState,
        collaborators: undefined,
      },
      files,
    })
  }, [notifyEditorNotReady])

  const getSceneForExport = useCallback(() => {
    const api = excalidrawAPIRef.current
    if (!api?.getSceneElements || !api?.getAppState) {
      notifyEditorNotReady()
      return null
    }

    const elements = api.getSceneElements() ?? []
    const appState = api.getAppState() ?? {}
    const filesFromApi = api.getFiles ? api.getFiles() : undefined
    const files =
      filesFromApi instanceof Map ? Object.fromEntries(filesFromApi.entries()) : filesFromApi

    return { elements, appState, files }
  }, [notifyEditorNotReady])

  const sanitizeFilenameBase = useCallback(() => {
    if (currentDiagramName?.trim()) {
      return currentDiagramName
        .trim()
        .replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase()
    }
    return 'diagram'
  }, [currentDiagramName])

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    if (typeof window === 'undefined') {
      return
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const loadDiagramFromJson = useCallback(
    (diagramJson: string) => {
      const api = excalidrawAPIRef.current
      if (!api?.updateScene) {
        notifyEditorNotReady()
        return false
      }

      let parsed: {
        elements?: any[]
        appState?: Record<string, unknown>
        files?: Record<string, unknown>
      }
      try {
        parsed = JSON.parse(diagramJson)
      } catch (error) {
        console.error('DiagramEditor: Unable to parse diagram JSON', error)
        enqueueSnackbar('Unable to open diagram because its data is corrupted.', {
          variant: 'error',
        })
        return false
      }

      const hasRenderableElements = Array.isArray(parsed.elements)
        ? parsed.elements.some(
            element => element && !(element as { isDeleted?: boolean }).isDeleted
          )
        : false

      // Remove viewport-specific properties that should not be restored
      // These are runtime values calculated by Excalidraw based on actual DOM layout
      const { width, height, offsetLeft, offsetTop, ...restAppState } = (parsed.appState ??
        {}) as Record<string, unknown>

      suppressSceneChangeRef.current = true
      api.updateScene({
        elements: parsed.elements ?? [],
        appState: {
          ...restAppState,
          collaborators: new Map(),
          currentItemFontFamily: companyFontFamily,
          // Let Excalidraw calculate these based on actual container size:
          // width, height, offsetLeft, offsetTop
        },
        files: parsed.files ?? {},
      })

      setHasUnsavedChanges(false)
      setIsSceneEmpty(!hasRenderableElements)
      return true
    },
    [companyFontFamily, enqueueSnackbar, notifyEditorNotReady]
  )

  type LocalDraftOverride = {
    metadata?: LocalStoredDiagramMetadata | null
    diagramId?: string | null
    diagramName?: string | null
  }

  const persistLocalDraft = useCallback(
    (diagramJson: string, override?: LocalDraftOverride) => {
      if (typeof window === 'undefined') {
        return
      }

      try {
        const hasOverride = <K extends keyof LocalDraftOverride>(key: K) =>
          Boolean(override && Object.prototype.hasOwnProperty.call(override, key))

        const metadataValue = hasOverride('metadata')
          ? (override?.metadata ?? undefined)
          : currentDiagramMetadata
        const diagramIdValue = hasOverride('diagramId')
          ? (override?.diagramId ?? null)
          : currentDiagramId
        const diagramNameValue = hasOverride('diagramName')
          ? (override?.diagramName ?? null)
          : currentDiagramName

        const payload: LocalDiagramDraftPayload = {
          diagramJson,
          metadata: metadataValue ?? null,
          diagramId: diagramIdValue ?? null,
          diagramName: diagramNameValue ?? null,
          updatedAt: new Date().toISOString(),
        }
        window.localStorage.setItem(LOCAL_DRAFT_STORAGE_KEY, JSON.stringify(payload))
      } catch (error) {
        console.warn('DiagramEditor: Unable to persist local draft', error)
      }
    },
    [currentDiagramId, currentDiagramMetadata, currentDiagramName]
  )

  const clearLocalDraft = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY)
    } catch (error) {
      console.warn('DiagramEditor: Unable to clear local draft', error)
    }
  }, [])

  const restoreLocalDraft = useCallback(async () => {
    if (typeof window === 'undefined') {
      return false
    }

    const rawDraft = window.localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY)
    if (!rawDraft) {
      return false
    }

    try {
      const parsed = JSON.parse(rawDraft) as LocalDiagramDraftPayload
      if (!parsed?.diagramJson) {
        return false
      }

      await waitForCanvasHydration()

      const loaded = loadDiagramFromJson(parsed.diagramJson)
      if (!loaded) {
        return false
      }

      const restoredMetadata = parsed.metadata ?? undefined
      updateCurrentDiagramId(parsed.diagramId ?? null)
      setCurrentDiagramName(parsed.diagramName ?? null)
      setCurrentDiagramMetadata(restoredMetadata)
      setSaveDialogInitialMetadata(restoredMetadata)
      setSaveDialogInitialName(parsed.diagramName ?? null)
      sceneInitializedRef.current = true
      return true
    } catch (error) {
      console.error('DiagramEditor: Unable to restore local draft', error)
      window.localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY)
      return false
    }
  }, [loadDiagramFromJson, updateCurrentDiagramId, waitForCanvasHydration])

  const openSaveDialog = useCallback(
    (proposedName?: string | null, metadata?: LocalStoredDiagramMetadata, forceSaveAs = false) => {
      setSaveDialogInitialName(proposedName ?? '')
      setSaveDialogInitialMetadata(metadata)
      setSaveDialogForceSaveAs(forceSaveAs)
      setIsSaveDialogOpen(true)
    },
    []
  )

  const handleNewDiagram = useCallback(() => {
    closeMainMenu()
    const api = excalidrawAPIRef.current
    if (!api?.resetScene) {
      console.warn('DiagramEditor: Excalidraw API not ready for new diagram action')
      return
    }

    const previousAppState = api.getAppState?.()
    const viewBackgroundColor = previousAppState?.viewBackgroundColor ?? defaultCanvasBackground

    suppressSceneChangeRef.current = true
    api.resetScene()

    const freshAppState = api.getAppState?.() || {}
    suppressSceneChangeRef.current = true
    api.updateScene({
      appState: {
        ...freshAppState,
        viewBackgroundColor,
        currentItemFontFamily: companyFontFamily,
      },
    })
    setCurrentDiagramName(null)
    updateCurrentDiagramId(null)
    setCurrentDiagramMetadata(undefined)
    setSaveDialogInitialMetadata(undefined)
    setSaveDialogInitialName(null)
    sceneInitializedRef.current = true
    clearLocalDraft()
    setHasUnsavedChanges(false)
    setIsSceneEmpty(true)
    scheduleCollaborationSync()
  }, [
    scheduleCollaborationSync,
    clearLocalDraft,
    closeMainMenu,
    companyFontFamily,
    defaultCanvasBackground,
    updateCurrentDiagramId,
  ])

  const handleSceneChange = useCallback(
    (elements: readonly unknown[] = [], appState: any = {}, filesParam: any = undefined) => {
      if (suppressSceneChangeRef.current) {
        suppressSceneChangeRef.current = false
        return
      }

      setHasUnsavedChanges(true)

      const hasRenderableElements = Array.isArray(elements)
        ? (elements as Array<{ isDeleted?: boolean }>).some(
            element => element && !element.isDeleted
          )
        : false
      setIsSceneEmpty(!hasRenderableElements)

      const files = (() => {
        if (!filesParam) {
          return undefined
        }
        if (filesParam instanceof Map) {
          return Object.fromEntries(filesParam.entries())
        }
        return filesParam
      })()

      const serialized = JSON.stringify({
        elements,
        appState: {
          ...(appState || {}),
          collaborators: undefined,
        },
        files,
      })

      persistLocalDraft(serialized)
      broadcastSceneUpdate(elements as any[], appState)
    },
    [broadcastSceneUpdate, persistLocalDraft]
  )

  const handleSaveAsDiagram = useCallback(() => {
    closeMainMenu()
    const proposedName = currentDiagramName ? `${currentDiagramName} - Copy` : ''
    openSaveDialog(proposedName, currentDiagramMetadata, true)
  }, [closeMainMenu, currentDiagramMetadata, currentDiagramName, openSaveDialog])

  const handleSaveDiagram = useCallback(() => {
    closeMainMenu()
    const proposedName = currentDiagramName ?? ''
    openSaveDialog(proposedName, currentDiagramMetadata, false)
  }, [closeMainMenu, currentDiagramMetadata, currentDiagramName, openSaveDialog])

  const handleOpenDiagram = useCallback(() => {
    closeMainMenu()
    setIsOpenDialogOpen(true)
  }, [closeMainMenu])

  const handleOpenCollaborationDialog = useCallback(() => {
    closeMainMenu()
    setIsCollaborationDialogOpen(true)
  }, [closeMainMenu])

  const handleCloseCollaborationDialog = useCallback(() => {
    setIsCollaborationDialogOpen(false)
  }, [])

  const handleExportJSON = useCallback(() => {
    closeMainMenu()
    const scene = getSceneForExport()
    if (!scene) {
      return
    }

    if (!scene.elements || scene.elements.length === 0) {
      enqueueSnackbar('There are no elements to export.', { variant: 'warning' })
      return
    }

    const payload = {
      type: 'excalidraw',
      version: 2,
      source: 'simple-eam',
      elements: scene.elements,
      appState: {
        ...(scene.appState || {}),
        collaborators: undefined,
      },
      files: scene.files ?? {},
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const filename = `${sanitizeFilenameBase()}.excalidraw`
    downloadBlob(blob, filename)
  }, [closeMainMenu, downloadBlob, enqueueSnackbar, getSceneForExport, sanitizeFilenameBase])

  const handleExportDrawIO = useCallback(() => {
    closeMainMenu()
    const scene = getSceneForExport()
    if (!scene) {
      return
    }

    if (!scene.elements || scene.elements.length === 0) {
      enqueueSnackbar('There are no elements to export.', { variant: 'warning' })
      return
    }

    const exportPayload = {
      type: 'excalidraw',
      version: 2,
      source: 'simple-eam',
      elements: scene.elements,
      appState: {
        ...(scene.appState || {}),
        collaborators: undefined,
      },
    }

    try {
      const xmlContent = convertExcalidrawToDrawIO(exportPayload)
      downloadDrawIOFile(xmlContent, sanitizeFilenameBase())
    } catch (error) {
      console.error('DiagramEditor: Failed to export draw.io XML', error)
      enqueueSnackbar('Failed to export draw.io XML. Please try again.', { variant: 'error' })
    }
  }, [closeMainMenu, enqueueSnackbar, getSceneForExport, sanitizeFilenameBase])

  const handleExportPNG = useCallback(async () => {
    closeMainMenu()
    const scene = getSceneForExport()
    if (!scene) {
      return
    }

    if (!scene.elements || scene.elements.length === 0) {
      enqueueSnackbar('There are no elements to export.', { variant: 'warning' })
      return
    }

    try {
      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements: scene.elements,
        appState: {
          ...scene.appState,
          collaborators: undefined,
          viewBackgroundColor: scene.appState?.viewBackgroundColor ?? defaultCanvasBackground,
          exportBackground: true,
          exportEmbedScene: false,
          exportWithDarkMode: false,
        },
        files: scene.files ?? {},
        mimeType: 'image/png',
        quality: 0.95,
        exportPadding: 20,
      })

      if (!blob) {
        throw new Error('No PNG blob generated')
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
      const filename = `${sanitizeFilenameBase()}_${timestamp}.png`
      downloadBlob(blob, filename)
    } catch (error) {
      console.error('DiagramEditor: Failed to export PNG', error)
      enqueueSnackbar('Failed to export PNG. Please try again.', { variant: 'error' })
    }
  }, [
    closeMainMenu,
    defaultCanvasBackground,
    downloadBlob,
    enqueueSnackbar,
    getSceneForExport,
    sanitizeFilenameBase,
  ])

  const handleImportJSON = useCallback(() => {
    closeMainMenu()
    if (typeof window === 'undefined') {
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.excalidraw'
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.onload = readerEvent => {
        try {
          const rawContent = readerEvent.target?.result
          if (typeof rawContent !== 'string') {
            throw new Error('Unable to read file contents')
          }

          const parsed = JSON.parse(rawContent)
          const normalized = {
            elements: parsed.elements ?? parsed.scene?.elements ?? [],
            appState: {
              ...(parsed.appState ?? parsed.scene?.appState ?? {}),
              collaborators: undefined,
            },
            files: parsed.files ?? parsed.binaryFiles ?? {},
          }

          if (!Array.isArray(normalized.elements)) {
            throw new Error('Invalid diagram structure')
          }

          const serialized = JSON.stringify(normalized)
          const loaded = loadDiagramFromJson(serialized)
          if (!loaded) {
            throw new Error('Failed to load imported diagram')
          }

          const baseName = file.name.replace(/\.[^.]+$/, '')
          updateCurrentDiagramId(null)
          setCurrentDiagramName(baseName || 'Imported diagram')
          setCurrentDiagramMetadata(undefined)
          setSaveDialogInitialMetadata(undefined)
          setSaveDialogInitialName(baseName || 'Imported diagram')
          persistLocalDraft(serialized, {
            metadata: null,
            diagramId: null,
            diagramName: baseName || 'Imported diagram',
          })
          scheduleCollaborationSync()
          enqueueSnackbar('Diagram imported. Remember to save it to persist in the database.', {
            variant: 'success',
          })
        } catch (error) {
          console.error('DiagramEditor: Failed to import JSON', error)
          enqueueSnackbar(
            'Failed to import the selected file. Please ensure it is a valid Excalidraw export.',
            { variant: 'error' }
          )
        } finally {
          closeMainMenu()
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }, [
    closeMainMenu,
    enqueueSnackbar,
    loadDiagramFromJson,
    persistLocalDraft,
    scheduleCollaborationSync,
    updateCurrentDiagramId,
  ])

  const handleRequestDelete = useCallback(() => {
    if (!canDeleteDiagram) {
      return
    }
    closeMainMenu()
    setIsDeleteDialogOpen(true)
  }, [canDeleteDiagram, closeMainMenu])

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false)
  }, [])

  const handleDiagramDeleted = useCallback(() => {
    handleNewDiagram()
  }, [handleNewDiagram])

  const handleConfirmSave = useCallback(
    async ({ name, metadata }: { name: string; metadata: LocalStoredDiagramMetadata }) => {
      const serialized = serializeCurrentScene()
      if (!serialized) {
        return false
      }

      if (!metadata.architecture?.id) {
        enqueueSnackbar('Please select an architecture before saving the diagram.', {
          variant: 'warning',
        })
        return false
      }

      const diagramType = metadata.diagramType ?? 'ARCHITECTURE'
      const metadataWithCompany: LocalStoredDiagramMetadata = {
        ...metadata,
        company: buildCompanyMetadata() ?? metadata.company,
      }
      const targetCompanyId =
        metadataWithCompany.company?.id ??
        currentDiagramInfo?.companyId ??
        selectedCompanyId ??
        null

      const permission = checkCollaborationPermission(targetCompanyId)
      if (!permission.allowed) {
        return false
      }
      const architectureConnect = {
        connect: [
          {
            where: {
              node: { id: { eq: metadata.architecture.id } },
            },
          },
        ],
      }

      try {
        const existingDiagramId = activeDiagramIdRef.current
        const shouldUpdateCompanyRelation = Boolean(
          targetCompanyId && targetCompanyId !== (currentDiagramInfo?.companyId ?? null)
        )
        const canUpdateCompanyRelation =
          shouldUpdateCompanyRelation &&
          targetCompanyId &&
          (!isCollaborating || isCollaborationHostRef.current || isAdmin())
        let resultingDiagramId = existingDiagramId

        if (existingDiagramId && !saveDialogForceSaveAs) {
          const updateInput: Record<string, unknown> = {
            title: { set: name },
            description: { set: metadataWithCompany.description ?? undefined },
            diagramType: { set: diagramType },
            diagramJson: { set: serialized },
            architecture: {
              disconnect: [{ where: {} }],
              ...architectureConnect,
            },
          }

          if (canUpdateCompanyRelation) {
            updateInput.company = {
              disconnect: [{ where: {} }],
              connect: [
                {
                  where: {
                    node: { id: { eq: targetCompanyId } },
                  },
                },
              ],
            }
          }

          const { data } = await updateDiagramMutation({
            variables: {
              id: existingDiagramId,
              input: updateInput,
            },
          })

          const updated = data?.updateDiagrams?.diagrams?.[0]
          if (!updated) {
            throw new Error('No diagram returned from update mutation')
          }
          updateCurrentDiagramId(updated.id ?? null)
          resultingDiagramId = updated.id
        } else {
          const createInput: Record<string, unknown> = {
            title: name,
            description: metadataWithCompany.description ?? undefined,
            diagramType,
            diagramJson: serialized,
            architecture: architectureConnect,
          }

          if (targetCompanyId) {
            createInput.company = {
              connect: [
                {
                  where: {
                    node: { id: { eq: targetCompanyId } },
                  },
                },
              ],
            }
          }

          if (currentPerson?.id) {
            createInput.creator = {
              connect: [
                {
                  where: {
                    node: { id: { eq: currentPerson.id } },
                  },
                },
              ],
            }
          }

          const { data } = await createDiagramMutation({
            variables: {
              input: [createInput],
            },
          })

          const created = data?.createDiagrams?.diagrams?.[0]
          if (!created) {
            throw new Error('No diagram returned from create mutation')
          }
          updateCurrentDiagramId(created.id ?? null)
          resultingDiagramId = created.id
        }

        setCurrentDiagramName(name)
        setCurrentDiagramMetadata(metadataWithCompany)
        setSaveDialogInitialMetadata(metadataWithCompany)
        setSaveDialogInitialName(name)
        if (metadataWithCompany.company?.id) {
          syncSelectedCompanyToDiagram(metadataWithCompany.company.id)
        }
        setIsSaveDialogOpen(false)
        setSaveDialogForceSaveAs(false)
        setHasUnsavedChanges(false)
        persistLocalDraft(serialized, {
          metadata: metadataWithCompany,
          diagramId: resultingDiagramId,
          diagramName: name,
        })
        scheduleCollaborationSync()
        return true
      } catch (error) {
        console.error('DiagramEditor: Failed to save diagram', error)
        enqueueSnackbar('Failed to save the diagram. Please try again.', { variant: 'error' })
        return false
      }
    },
    [
      buildCompanyMetadata,
      checkCollaborationPermission,
      createDiagramMutation,
      currentDiagramInfo?.companyId,
      currentPerson?.id,
      enqueueSnackbar,
      isCollaborating,
      persistLocalDraft,
      saveDialogForceSaveAs,
      serializeCurrentScene,
      syncSelectedCompanyToDiagram,
      updateCurrentDiagramId,
      updateDiagramMutation,
      scheduleCollaborationSync,
      selectedCompanyId,
    ]
  )

  const handleCancelSaveDialog = useCallback(() => {
    setIsSaveDialogOpen(false)
    setSaveDialogInitialMetadata(undefined)
    setSaveDialogForceSaveAs(false)
  }, [])

  const handleCloseOpenDialog = useCallback(() => {
    setIsOpenDialogOpen(false)
  }, [])

  const handleSelectDiagram = useCallback(
    (diagram: LocalOpenDialogDiagram): boolean => {
      if (!diagram.diagramJson) {
        enqueueSnackbar('Selected diagram has no stored content.', { variant: 'error' })
        return false
      }

      const loaded = loadDiagramFromJson(diagram.diagramJson)
      if (!loaded) {
        return false
      }

      const firstArchitecture = diagram.architecture?.[0]
      const owningCompany = diagram.company?.[0]
      const metadataCompany =
        buildCompanyMetadata() ??
        (owningCompany
          ? {
              id: owningCompany.id,
              name: owningCompany.name ?? null,
            }
          : undefined)
      const metadata: LocalStoredDiagramMetadata = {
        description: diagram.description ?? undefined,
        diagramType: diagram.diagramType ?? 'ARCHITECTURE',
        architecture: firstArchitecture
          ? {
              id: firstArchitecture.id,
              name: firstArchitecture.name,
              type: firstArchitecture.type,
              domain: firstArchitecture.domain,
            }
          : undefined,
        architectureName: firstArchitecture?.name,
        company: metadataCompany,
      }

      updateCurrentDiagramId(diagram.id ?? null)
      setCurrentDiagramName(diagram.title)
      setCurrentDiagramMetadata(metadata)
      setSaveDialogInitialMetadata(metadata)
      setSaveDialogInitialName(diagram.title)
      if (metadata.company?.id) {
        syncSelectedCompanyToDiagram(metadata.company.id)
      }
      sceneInitializedRef.current = true
      persistLocalDraft(diagram.diagramJson, {
        metadata,
        diagramId: diagram.id,
        diagramName: diagram.title,
      })
      scheduleCollaborationSync()
      setIsOpenDialogOpen(false)
      return true
    },
    [
      scheduleCollaborationSync,
      buildCompanyMetadata,
      enqueueSnackbar,
      loadDiagramFromJson,
      persistLocalDraft,
      syncSelectedCompanyToDiagram,
      updateCurrentDiagramId,
    ]
  )

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const handleFindOnCanvas = useCallback(() => {
    closeMainMenu()
    // Small delay to ensure menu closes before opening sidebar
    setTimeout(() => {
      sidebarRef.current?.openSearchTab()
    }, 50)
  }, [closeMainMenu])

  // Handle Ctrl+F keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+F (or Cmd+F on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault()
        event.stopPropagation()
        handleFindOnCanvas()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true) // Use capture phase
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleFindOnCanvas])

  useEffect(() => {
    if (!isEditorReady || sceneInitializedRef.current) {
      return
    }

    if (typeof window !== 'undefined') {
      const pendingPayloadExists = Boolean(window.localStorage.getItem('pendingDiagramToOpen'))
      if (pendingPayloadExists) {
        return
      }
    }

    if (pendingDiagramProcessingRef.current) {
      return
    }

    void (async () => {
      await restoreLocalDraft()
    })()
  }, [isEditorReady, restoreLocalDraft])

  useEffect(() => {
    if (typeof window === 'undefined' || !isEditorReady) {
      return
    }

    const rawPending = window.localStorage.getItem('pendingDiagramToOpen')
    if (!rawPending) {
      return
    }

    let isCancelled = false
    let shouldClearPending = false
    pendingDiagramProcessingRef.current = true

    const loadPendingDiagram = async () => {
      try {
        const parsed = JSON.parse(rawPending)
        let diagramToOpen: LocalOpenDialogDiagram | null = null

        if (typeof parsed.diagramJson === 'string') {
          diagramToOpen = parsed as LocalOpenDialogDiagram
        } else if (parsed.id) {
          const { data } = await fetchDiagramById({ variables: { id: parsed.id as string } })
          const fetched = data?.diagrams?.[0]
          if (fetched?.diagramJson) {
            diagramToOpen = {
              id: fetched.id,
              title: fetched.title ?? 'Untitled diagram',
              description: fetched.description,
              diagramType: fetched.diagramType,
              diagramJson: fetched.diagramJson,
              updatedAt: fetched.updatedAt,
              architecture: fetched.architecture,
              company: fetched.company,
            }
          }
        }

        if (diagramToOpen?.id && (!diagramToOpen.company || diagramToOpen.company.length === 0)) {
          try {
            const { data } = await fetchDiagramById({ variables: { id: diagramToOpen.id } })
            const enrichedCompany = data?.diagrams?.[0]?.company
            if (enrichedCompany?.length) {
              diagramToOpen = { ...diagramToOpen, company: enrichedCompany }
            }
          } catch (companyFetchError) {
            console.warn(
              'DiagramEditor: Unable to enrich pending diagram with company info',
              companyFetchError
            )
          }
        }

        if (!diagramToOpen) {
          enqueueSnackbar('Failed to load the selected diagram. Please try again.', {
            variant: 'error',
          })
          shouldClearPending = true
          return
        }

        if (!isCancelled) {
          await waitForCanvasHydration()

          if (isCancelled) {
            return
          }

          const loaded = handleSelectDiagram(diagramToOpen)
          shouldClearPending = true

          if (!loaded && !sceneInitializedRef.current) {
            await restoreLocalDraft()
          }
        }
      } catch (error) {
        console.error('DiagramEditor: Unable to process pending diagram', error)
        enqueueSnackbar('Failed to open the selected diagram. Please try again.', {
          variant: 'error',
        })
        shouldClearPending = true

        if (!sceneInitializedRef.current) {
          await restoreLocalDraft()
        }
      } finally {
        pendingDiagramProcessingRef.current = false
        if (shouldClearPending) {
          window.localStorage.removeItem('pendingDiagramToOpen')
        }
      }
    }

    void loadPendingDiagram()

    return () => {
      isCancelled = true
    }
  }, [
    fetchDiagramById,
    handleSelectDiagram,
    enqueueSnackbar,
    isEditorReady,
    restoreLocalDraft,
    waitForCanvasHydration,
  ])

  useEffect(() => {
    if (!isEditorReady || autoJoinAttemptedRef.current) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const roomParam = params.get('room')
    autoJoinAttemptedRef.current = true

    if (!roomParam || isCollaborating) {
      return
    }

    void guardedStartCollaboration(roomParam)
      .then(() => {
        if (!authorizationFailureRef.current) {
          enqueueSnackbar(collaborationTranslations('startSuccess'), { variant: 'success' })
        }
      })
      .catch(error => {
        if (error instanceof Error && error.message.startsWith('collaboration-permission')) {
          console.warn('DiagramEditor: Collaboration auto-join blocked due to permissions', error)
          return
        }
        console.error('DiagramEditor: Unable to auto-join collaboration room', error)
        enqueueSnackbar(collaborationTranslations('errorStart'), { variant: 'error' })
      })
  }, [
    collaborationTranslations,
    enqueueSnackbar,
    isCollaborating,
    isEditorReady,
    guardedStartCollaboration,
  ])

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: 'var(--excalidraw-bg, transparent)',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExcalidrawCanvas
            theme={excalidrawTheme}
            initialData={initialData}
            onNewDiagram={handleNewDiagram}
            onOpenDiagram={handleOpenDiagram}
            onSaveDiagram={handleSaveDiagram}
            onSaveAsDiagram={handleSaveAsDiagram}
            onDeleteDiagram={handleRequestDelete}
            canDeleteDiagram={canDeleteDiagram}
            onImportJSON={handleImportJSON}
            onExportJSON={handleExportJSON}
            onExportDrawIO={handleExportDrawIO}
            onExportPNG={handleExportPNG}
            onOpenCollaboration={handleOpenCollaborationDialog}
            onFindOnCanvas={handleFindOnCanvas}
            isCollaborating={isCollaborating}
            onSceneChange={handleSceneChange}
            onReady={handleExcalidrawReady}
          />
        </div>
        <DiagramLibrarySidebar
          ref={sidebarRef}
          excalidrawAPI={excalidrawAPIRef.current}
          defaultFontFamily={companyFontFamily}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
        />
      </div>
      <LocalSaveDiagramDialog
        open={isSaveDialogOpen}
        initialName={saveDialogInitialName}
        initialMetadata={saveDialogInitialMetadata}
        forceSaveAs={saveDialogForceSaveAs}
        isUpdate={!saveDialogForceSaveAs && Boolean(saveDialogInitialName)}
        onCancel={handleCancelSaveDialog}
        onConfirm={handleConfirmSave}
      />
      <LocalOpenDiagramDialog
        open={isOpenDialogOpen}
        onClose={handleCloseOpenDialog}
        onSelect={handleSelectDiagram}
      />
      <DeleteDiagramDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDeleted={handleDiagramDeleted}
        diagramId={currentDiagramId}
        diagramTitle={currentDiagramName}
      />
      <CollaborationDialog
        open={isCollaborationDialogOpen}
        isCollaborating={isCollaborating}
        roomId={roomId}
        collaborators={collaborators}
        onClose={handleCloseCollaborationDialog}
        onStartCollaboration={guardedStartCollaboration}
        ref={instance => {
          collaborationDialogRef.current = instance
        }}
        onStopCollaboration={stopCollaboration}
      />
    </>
  )
}
