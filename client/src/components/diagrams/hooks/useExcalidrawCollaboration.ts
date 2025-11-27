'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useExcalidrawConfig } from '@/lib/runtime-config'
import type { LocalStoredDiagramMetadata } from '@/components/diagrams/components/dialogs/types'

export type CollaborationAccessDecision = 'allow' | 'deny' | 'ignore'

export interface Collaborator {
  id: string
  name: string
  avatarUrl?: string
  pointer?: { x: number; y: number }
  [key: string]: unknown
}

interface ExcalidrawElement {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  [key: string]: unknown
}

interface AppState {
  viewBackgroundColor?: string
  scrollX: number
  scrollY: number
  zoom: { value: number }
  collaborators?: Map<string, Collaborator>
  [key: string]: unknown
}

interface SceneBroadcastPayload {
  elements?: ExcalidrawElement[]
  appState?: Pick<AppState, 'scrollX' | 'scrollY' | 'zoom'>
  diagram?: CurrentDiagramInfo | null
  collaborator?: Collaborator
}

interface ExcalidrawImperativeAPI {
  updateScene: (sceneData: {
    elements?: ExcalidrawElement[]
    appState?: Partial<AppState>
    commitToHistory?: boolean
  }) => void
  getSceneElements: () => ExcalidrawElement[]
  getAppState: () => AppState
  [key: string]: unknown
}

type ExcalidrawImperativeAPIWithBroadcast = ExcalidrawImperativeAPI & {
  broadcastSceneUpdate?: (elements: ExcalidrawElement[], appState: AppState) => void
}

export interface CurrentDiagramInfo {
  id: string | null
  title?: string | null
  metadata?: LocalStoredDiagramMetadata
  companyId?: string | null
  companyName?: string | null
}

interface UseExcalidrawCollaborationProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null
  username?: string
  userAvatarUrl?: string
  currentDiagram?: CurrentDiagramInfo | null
  onDiagramUpdate?: (diagram: CurrentDiagramInfo | null) => void
  authorizeAccess?: (diagram: CurrentDiagramInfo | null) => CollaborationAccessDecision
  onAuthorizationDenied?: () => void
  onAuthorizationGranted?: () => void
}

interface CollaborationState {
  isCollaborating: boolean
  collaborators: Map<string, Collaborator>
  roomId: string | null
  socket: Socket | null
}

export function useExcalidrawCollaboration({
  excalidrawAPI,
  username: providedUsername = 'Anonymous User',
  userAvatarUrl,
  currentDiagram,
  onDiagramUpdate,
  authorizeAccess,
  onAuthorizationDenied,
  onAuthorizationGranted,
}: UseExcalidrawCollaborationProps) {
  const [state, setState] = useState<CollaborationState>({
    isCollaborating: false,
    collaborators: new Map(),
    roomId: null,
    socket: null,
  })

  const isReceivingUpdateRef = useRef(false)
  const hasReceivedInitialSceneRef = useRef(false)
  const isFirstUserRef = useRef(false)
  const [isFirstUser, setIsFirstUser] = useState(false)
  const hasConfirmedAccessRef = useRef(false)

  const excalidrawConfig = useExcalidrawConfig()
  const socketServerUrl = excalidrawConfig.wsServerUrl || 'http://localhost:8890'

  const cleanupSocket = useCallback((socket?: Socket | null) => {
    if (socket) {
      try {
        socket.disconnect()
      } catch (error) {
        console.warn('Failed to disconnect socket', error)
      }
    }
  }, [])

  const stopCollaboration = useCallback(() => {
    setState(prev => {
      cleanupSocket(prev.socket)
      return {
        isCollaborating: false,
        collaborators: new Map(),
        roomId: null,
        socket: null,
      }
    })

    isReceivingUpdateRef.current = false
    hasReceivedInitialSceneRef.current = false
    isFirstUserRef.current = false
    setIsFirstUser(false)
    hasConfirmedAccessRef.current = false

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('room')
      window.history.replaceState({}, '', url.toString())
    }
  }, [cleanupSocket])

  const startCollaboration = useCallback(
    async (roomId: string) => {
      if (!roomId) {
        throw new Error('Room ID is required to start collaboration')
      }

      cleanupSocket(state.socket)
      isReceivingUpdateRef.current = false
      hasReceivedInitialSceneRef.current = false
      isFirstUserRef.current = false
      setIsFirstUser(false)
      hasConfirmedAccessRef.current = false

      const socket = io(socketServerUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      })

      const emitCollaboratorPresence = () => {
        if (!socket.id) {
          return
        }
        try {
          const payload: SceneBroadcastPayload = {
            diagram: currentDiagram ? { ...currentDiagram } : null,
            collaborator: {
              id: socket.id,
              name: providedUsername,
              avatarUrl: userAvatarUrl,
            },
          }
          const encoder = new TextEncoder()
          const dataBuffer = encoder.encode(JSON.stringify(payload)).buffer
          const iv = new Uint8Array(16)
          socket.emit('server-broadcast', roomId, dataBuffer, iv)
        } catch (error) {
          console.error('Failed to broadcast collaborator presence:', error)
        }
      }

      socket.on('connect', () => {
        socket.emit('join-room', roomId)
        setTimeout(emitCollaboratorPresence, 100)
      })

      socket.on('connect_error', error => {
        console.error('Socket.IO connection error:', error)
      })

      socket.on('first-in-room', () => {
        isFirstUserRef.current = true
        setIsFirstUser(true)
        hasReceivedInitialSceneRef.current = true
        if (!hasConfirmedAccessRef.current) {
          hasConfirmedAccessRef.current = true
          onAuthorizationGranted?.()
        }
      })

      socket.on('new-user', (socketId: string) => {
        setState(prev => {
          const updated = new Map(prev.collaborators)
          if (!updated.has(socketId)) {
            updated.set(socketId, {
              id: socketId,
              name: `Participant ${socketId.substring(0, 8)}`,
            })
          }
          return { ...prev, collaborators: updated }
        })

        if (excalidrawAPI) {
          setTimeout(() => {
            try {
              const currentElements = excalidrawAPI.getSceneElements() || []
              const currentAppState = excalidrawAPI.getAppState()

              const sceneData: SceneBroadcastPayload = {
                elements: currentElements,
                appState: {
                  scrollX: currentAppState.scrollX,
                  scrollY: currentAppState.scrollY,
                  zoom: currentAppState.zoom,
                },
                diagram: currentDiagram ? { ...currentDiagram } : null,
                collaborator: socket.id
                  ? {
                      id: socket.id,
                      name: providedUsername,
                      avatarUrl: userAvatarUrl,
                    }
                  : undefined,
              }

              const encoder = new TextEncoder()
              const dataBuffer = encoder.encode(JSON.stringify(sceneData)).buffer
              const iv = new Uint8Array(16)
              socket.emit('server-broadcast', roomId, dataBuffer, iv)
            } catch (error) {
              console.error('Failed to broadcast scene to new user:', error)
            }
          }, 200)
        }
      })

      socket.on('room-user-change', (userIds: string[]) => {
        setState(prev => {
          const collaborators = new Map<string, Collaborator>()
          userIds.forEach(id => {
            if (id !== socket.id) {
              const existing = prev.collaborators.get(id)
              collaborators.set(
                id,
                existing || {
                  id,
                  name: `Participant ${id.substring(0, 8)}`,
                }
              )
            }
          })
          return { ...prev, collaborators }
        })
      })

      socket.on('client-broadcast', (encryptedData: ArrayBuffer, _iv: Uint8Array) => {
        isReceivingUpdateRef.current = true
        try {
          const decoder = new TextDecoder()
          const dataString = decoder.decode(encryptedData)
          const sceneData = JSON.parse(dataString)

          const diagramInfo: CurrentDiagramInfo | null = sceneData?.diagram ?? null

          const accessDecision = authorizeAccess ? authorizeAccess(diagramInfo) : 'allow'

          if (accessDecision === 'deny') {
            stopCollaboration()
            onAuthorizationDenied?.()
            isReceivingUpdateRef.current = false
            return
          }

          if (accessDecision === 'ignore') {
            isReceivingUpdateRef.current = false
            return
          }

          if (!hasConfirmedAccessRef.current) {
            hasConfirmedAccessRef.current = true
            onAuthorizationGranted?.()
          }

          if (diagramInfo && onDiagramUpdate) {
            onDiagramUpdate(diagramInfo)
          }

          if (sceneData?.collaborator?.id && sceneData.collaborator.id !== socket.id) {
            setState(prev => {
              const updated = new Map(prev.collaborators)
              const existing = updated.get(sceneData.collaborator!.id)
              updated.set(sceneData.collaborator!.id, {
                id: sceneData.collaborator!.id,
                name:
                  sceneData.collaborator!.name?.trim() ||
                  existing?.name ||
                  `Participant ${sceneData.collaborator!.id.substring(0, 8)}`,
                avatarUrl: sceneData.collaborator!.avatarUrl ?? existing?.avatarUrl,
              })
              return { ...prev, collaborators: updated }
            })
          }

          if (excalidrawAPI && Array.isArray(sceneData?.elements)) {
            if (!hasReceivedInitialSceneRef.current) {
              hasReceivedInitialSceneRef.current = true
            }

            const apiWithBroadcast = excalidrawAPI as ExcalidrawImperativeAPIWithBroadcast
            const originalBroadcast = apiWithBroadcast.broadcastSceneUpdate
            delete apiWithBroadcast.broadcastSceneUpdate

            excalidrawAPI.updateScene({
              elements: sceneData.elements,
              appState: sceneData.appState || {},
              commitToHistory: false,
            })

            setTimeout(() => {
              apiWithBroadcast.broadcastSceneUpdate = originalBroadcast
              isReceivingUpdateRef.current = false
            }, 50)
          } else {
            isReceivingUpdateRef.current = false
          }
        } catch (error) {
          console.error('Failed to process scene update:', error)
          isReceivingUpdateRef.current = false
        }
      })

      setState({
        isCollaborating: true,
        collaborators: new Map(),
        roomId,
        socket,
      })

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('room', roomId)
        window.history.replaceState({}, '', url.toString())
      }
    },
    [
      authorizeAccess,
      cleanupSocket,
      currentDiagram,
      excalidrawAPI,
      onDiagramUpdate,
      onAuthorizationDenied,
      onAuthorizationGranted,
      providedUsername,
      stopCollaboration,
      socketServerUrl,
      state.socket,
      userAvatarUrl,
    ]
  )

  const broadcastSceneUpdate = useCallback(
    (elements: ExcalidrawElement[], appState: AppState) => {
      if (
        !state.socket ||
        !state.roomId ||
        !state.isCollaborating ||
        isReceivingUpdateRef.current ||
        !hasReceivedInitialSceneRef.current
      ) {
        return
      }

      try {
        const sceneData: SceneBroadcastPayload = {
          elements,
          appState: {
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom,
          },
          diagram: currentDiagram ? { ...currentDiagram } : null,
          collaborator: state.socket?.id
            ? {
                id: state.socket.id,
                name: providedUsername,
                avatarUrl: userAvatarUrl,
              }
            : undefined,
        }

        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(JSON.stringify(sceneData)).buffer
        const iv = new Uint8Array(16)
        state.socket.emit('server-broadcast', state.roomId, dataBuffer, iv)
      } catch (error) {
        console.error('Failed to broadcast scene update:', error)
      }
    },
    [
      currentDiagram,
      providedUsername,
      state.isCollaborating,
      state.roomId,
      state.socket,
      userAvatarUrl,
    ]
  )

  useEffect(() => {
    if (excalidrawAPI && state.isCollaborating) {
      const apiWithBroadcast = excalidrawAPI as ExcalidrawImperativeAPIWithBroadcast
      apiWithBroadcast.broadcastSceneUpdate = broadcastSceneUpdate
    }
  }, [broadcastSceneUpdate, excalidrawAPI, state.isCollaborating])

  useEffect(() => () => cleanupSocket(state.socket), [cleanupSocket, state.socket])

  return {
    startCollaboration,
    stopCollaboration,
    isCollaborating: state.isCollaborating,
    collaborators: state.collaborators,
    roomId: state.roomId,
    broadcastSceneUpdate,
    isFirstUser,
  }
}
