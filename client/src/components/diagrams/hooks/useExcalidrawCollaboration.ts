'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useExcalidrawConfig } from '@/lib/runtime-config'

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

export interface CurrentDiagramInfo {
  id: string | null
  title?: string | null
  [key: string]: unknown
}

interface UseExcalidrawCollaborationProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null
  username?: string
  userAvatarUrl?: string
  currentDiagram?: CurrentDiagramInfo | null
  onDiagramUpdate?: (diagram: CurrentDiagramInfo | null) => void
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

      const socket = io(socketServerUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      })

      socket.on('connect', () => {
        socket.emit('join-room', roomId)
      })

      socket.on('connect_error', error => {
        console.error('Socket.IO connection error:', error)
      })

      socket.on('first-in-room', () => {
        isFirstUserRef.current = true
        hasReceivedInitialSceneRef.current = true
      })

      socket.on('new-user', (socketId: string) => {
        const newCollaborator: Collaborator = {
          id: socketId,
          name: `${providedUsername} ${socketId.substring(0, 8)}`.trim(),
          avatarUrl: userAvatarUrl,
        }

        setState(prev => {
          const updated = new Map(prev.collaborators)
          updated.set(socketId, newCollaborator)
          return { ...prev, collaborators: updated }
        })

        if (excalidrawAPI) {
          setTimeout(() => {
            try {
              const currentElements = excalidrawAPI.getSceneElements() || []
              const currentAppState = excalidrawAPI.getAppState()

              const sceneData = {
                elements: currentElements,
                appState: {
                  scrollX: currentAppState.scrollX,
                  scrollY: currentAppState.scrollY,
                  zoom: currentAppState.zoom,
                },
                diagram: currentDiagram ? { ...currentDiagram } : null,
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
              collaborators.set(id, {
                id,
                name: `${providedUsername} ${id.substring(0, 8)}`.trim(),
              })
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

          if (sceneData?.diagram && onDiagramUpdate) {
            onDiagramUpdate(sceneData.diagram)
          }

          if (excalidrawAPI && Array.isArray(sceneData?.elements)) {
            if (!hasReceivedInitialSceneRef.current) {
              hasReceivedInitialSceneRef.current = true
            }

            const originalBroadcast = (excalidrawAPI as any).broadcastSceneUpdate
            delete (excalidrawAPI as any).broadcastSceneUpdate

            excalidrawAPI.updateScene({
              elements: sceneData.elements,
              appState: sceneData.appState || {},
              commitToHistory: false,
            })

            setTimeout(() => {
              ;(excalidrawAPI as any).broadcastSceneUpdate = originalBroadcast
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
      cleanupSocket,
      currentDiagram,
      excalidrawAPI,
      onDiagramUpdate,
      providedUsername,
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
        const sceneData = {
          elements,
          appState: {
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom,
          },
          diagram: currentDiagram ? { ...currentDiagram } : null,
        }

        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(JSON.stringify(sceneData)).buffer
        const iv = new Uint8Array(16)
        state.socket.emit('server-broadcast', state.roomId, dataBuffer, iv)
      } catch (error) {
        console.error('Failed to broadcast scene update:', error)
      }
    },
    [currentDiagram, state.isCollaborating, state.roomId, state.socket]
  )

  useEffect(() => {
    if (excalidrawAPI && state.isCollaborating) {
      ;(excalidrawAPI as any).broadcastSceneUpdate = broadcastSceneUpdate
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
  }
}
