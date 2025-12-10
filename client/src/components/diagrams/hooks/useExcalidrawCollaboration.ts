/**
 * Hook für Excalidraw Collaboration
 * Implementiert die Collaboration-Logik basierend auf dem excalidraw-room Server (Socket.IO)
 */

import { useCallback, useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useExcalidrawConfig } from '@/lib/runtime-config'

// Import types from our Excalidraw fork
interface ExcalidrawElement {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  [key: string]: any
}

interface AppState {
  viewBackgroundColor: string
  scrollX: number
  scrollY: number
  zoom: { value: number }
  collaborators?: Map<string, Collaborator>
  [key: string]: any
}

interface ExcalidrawImperativeAPI {
  updateScene: (sceneData: {
    elements?: ExcalidrawElement[]
    appState?: Partial<AppState>
    commitToHistory?: boolean
  }) => void
  getSceneElements: () => ExcalidrawElement[]
  getAppState: () => AppState
  [key: string]: any
}

interface Collaborator {
  id: string
  name: string
  avatarUrl?: string
  pointer?: { x: number; y: number }
  [key: string]: any
}

interface CollaborationState {
  isCollaborating: boolean
  collaborators: Map<string, Collaborator>
  roomId: string | null
  socket: Socket | null
}

interface CollaborationAPI {
  startCollaboration: (roomId: string) => Promise<void>
  stopCollaboration: () => void
  isCollaborating: boolean
  collaborators: Map<string, Collaborator>
  roomId: string | null
  broadcastSceneUpdate?: (elements: ExcalidrawElement[], appState: AppState) => void
  isReceivingUpdateRef: React.MutableRefObject<boolean>
}

interface UseExcalidrawCollaborationProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null
  username?: string
  userAvatarUrl?: string
  onCollaboratorJoin?: (collaborator: Collaborator) => void
  onCollaboratorLeave?: (collaborator: Collaborator) => void
  currentDiagram?: any // Add current diagram data for sharing
  onDiagramUpdate?: (diagram: any) => void // Callback when diagram metadata is received
  authorizeAccess?: (diagram: any) => 'allow' | 'deny' | 'ignore' // Authorization callback
}

export const useExcalidrawCollaboration = ({
  excalidrawAPI,
  username: providedUsername = 'Anonymous User',
  userAvatarUrl,
  onCollaboratorJoin,
  onCollaboratorLeave: _onCollaboratorLeave,
  currentDiagram,
  onDiagramUpdate,
  authorizeAccess,
}: UseExcalidrawCollaborationProps): CollaborationAPI => {
  const [state, setState] = useState<CollaborationState>({
    isCollaborating: false,
    collaborators: new Map(),
    roomId: null,
    socket: null,
  })

  // Use ref to track if we're currently processing an incoming update
  const isReceivingUpdateRef = useRef(false)
  // Track if we've received initial scene data as a new user
  const hasReceivedInitialSceneRef = useRef(false)
  // Track if we're the first user in the room
  const isFirstUserRef = useRef(false)
  // Track the current socket for comparison
  const socketRef = useRef<Socket | null>(null)

  // Get Excalidraw WebSocket server URL from runtime config
  const excalidrawConfig = useExcalidrawConfig()
  const socketServerUrl = excalidrawConfig.wsServerUrl || 'http://localhost:8890'

  const stopCollaboration = useCallback(() => {
    setState(prev => {
      if (prev.socket) {
        prev.socket.disconnect()
      }
      return {
        isCollaborating: false,
        collaborators: new Map(),
        roomId: null,
        socket: null,
      }
    })

    // Reset refs
    socketRef.current = null
    isReceivingUpdateRef.current = false
    hasReceivedInitialSceneRef.current = false
    isFirstUserRef.current = false

    // Remove room parameter from URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('room')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  const startCollaboration = useCallback(
    async (roomId: string) => {
      try {
        // Cleanup any existing connection first
        setState(prev => {
          if (prev.socket) {
            prev.socket.disconnect()
          }
          return {
            isCollaborating: false,
            collaborators: new Map(),
            roomId: null,
            socket: null,
          }
        })

        // Reset refs for new collaboration session
        isReceivingUpdateRef.current = false
        hasReceivedInitialSceneRef.current = false
        isFirstUserRef.current = false

        // Create Socket.IO connection
        const socket = io(socketServerUrl, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
        })

        // Store socket reference
        socketRef.current = socket

        // Helper to get diagram snapshot - only if we're first user or have received initial scene
        const getCurrentDiagramSnapshot = () => {
          if (!isFirstUserRef.current && !hasReceivedInitialSceneRef.current) {
            return null
          }
          return currentDiagram
            ? {
                id: currentDiagram.id,
                title: currentDiagram.title,
                description: currentDiagram.description,
                diagramType: currentDiagram.diagramType,
                company: currentDiagram.company,
                companyId: currentDiagram.companyId,
                architecture: currentDiagram.architecture,
              }
            : null
        }

        // Function to broadcast collaborator presence (name, avatar) to other users
        const emitCollaboratorPresence = () => {
          if (!socket.id) {
            return
          }
          try {
            const payload = {
              diagram: getCurrentDiagramSnapshot(),
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

        // Set up event listeners
        socket.on('connect', () => {
          socket.emit('join-room', roomId)
          // Broadcast presence after joining so others know our name
          setTimeout(emitCollaboratorPresence, 100)
        })

        socket.on('connect_error', error => {
          console.error('Socket.IO connection error:', error)
        })

        socket.on('first-in-room', () => {
          isFirstUserRef.current = true
          hasReceivedInitialSceneRef.current = true // First user doesn't need to wait for initial scene
        })

        socket.on('new-user', (socketId: string) => {
          const newCollaborator: Collaborator = {
            id: socketId,
            name: `User ${socketId.substring(0, 8)}`,
          }

          setState(prev => {
            const newCollaborators = new Map(prev.collaborators)
            newCollaborators.set(socketId, newCollaborator)
            return { ...prev, collaborators: newCollaborators }
          })

          // When a new user joins, broadcast current scene to them
          if (excalidrawAPI) {
            setTimeout(() => {
              try {
                const currentElements = excalidrawAPI.getSceneElements()
                const currentAppState = excalidrawAPI.getAppState()

                // Create a complete data structure with diagram metadata
                const sceneData = {
                  elements: currentElements || [],
                  appState: {
                    scrollX: currentAppState.scrollX,
                    scrollY: currentAppState.scrollY,
                    zoom: currentAppState.zoom,
                  },
                  diagram: currentDiagram
                    ? {
                        id: currentDiagram.id,
                        title: currentDiagram.title,
                        // Include other relevant diagram metadata
                        ...currentDiagram,
                      }
                    : null,
                  collaborator: socket.id
                    ? {
                        id: socket.id,
                        name: providedUsername,
                        avatarUrl: userAvatarUrl,
                      }
                    : undefined,
                }

                // Convert to ArrayBuffer for compatibility with excalidraw-room server
                const dataString = JSON.stringify(sceneData)
                const encoder = new TextEncoder()
                const dataBuffer = encoder.encode(dataString).buffer
                const iv = new Uint8Array(16) // Dummy IV for development

                socket.emit('server-broadcast', roomId, dataBuffer, iv)
              } catch (error) {
                console.error('Failed to broadcast scene to new user:', error)
              }
            }, 200) // Small delay to ensure the new user is ready to receive
          }

          if (onCollaboratorJoin) {
            onCollaboratorJoin(newCollaborator)
          }
        })

        socket.on('room-user-change', (userIds: string[]) => {
          setState(prev => {
            const newCollaborators = new Map<string, Collaborator>()
            userIds.forEach(userId => {
              if (userId !== socket.id) {
                // Preserve existing collaborator info if available
                const existing = prev.collaborators.get(userId)
                const collaborator: Collaborator = existing || {
                  id: userId,
                  name: `User ${userId.substring(0, 8)}`,
                }
                newCollaborators.set(userId, collaborator)
              }
            })
            return { ...prev, collaborators: newCollaborators }
          })
        })

        socket.on('client-broadcast', (encryptedData: ArrayBuffer, _iv: Uint8Array) => {
          // Prevent re-broadcasting immediately
          isReceivingUpdateRef.current = true

          try {
            // Debug: Log the received data
            // For development, we'll implement basic decryption
            // Convert ArrayBuffer back to string
            const decoder = new TextDecoder()
            const dataString = decoder.decode(encryptedData)
            const sceneData = JSON.parse(dataString)

            // Skip processing our own broadcasts
            if (sceneData?.collaborator?.id === socket.id) {
              isReceivingUpdateRef.current = false
              return
            }

            // SECURITY: Check authorization BEFORE processing diagram data
            if (sceneData.diagram && authorizeAccess) {
              const authResult = authorizeAccess(sceneData.diagram)

              if (authResult === 'deny') {
                console.warn(
                  '[useExcalidrawCollaboration] Access denied to diagram, stopping collaboration'
                )
                isReceivingUpdateRef.current = false
                stopCollaboration()
                return
              }
            }

            // Handle diagram metadata update
            if (sceneData.diagram && onDiagramUpdate) {
              onDiagramUpdate(sceneData.diagram)
            }

            // Update collaborator info from received broadcast (BEFORE checking elements)
            if (
              sceneData?.collaborator?.id &&
              sceneData.collaborator.id !== socketRef.current?.id
            ) {
              setState(prev => {
                const updated = new Map(prev.collaborators)
                const existing = updated.get(sceneData.collaborator!.id)
                updated.set(sceneData.collaborator!.id, {
                  id: sceneData.collaborator!.id,
                  name:
                    sceneData.collaborator!.name?.trim() ||
                    existing?.name ||
                    `User ${sceneData.collaborator!.id.substring(0, 8)}`,
                  avatarUrl: sceneData.collaborator!.avatarUrl ?? existing?.avatarUrl,
                })
                return { ...prev, collaborators: updated }
              })
            }

            // Only update scene if elements are provided
            if (excalidrawAPI && sceneData && Array.isArray(sceneData.elements)) {
              // Mark that we've received initial scene data
              if (!hasReceivedInitialSceneRef.current) {
                hasReceivedInitialSceneRef.current = true
              }

              // Always update - this ensures proper synchronization
              // The business logic should prevent sending empty scenes when they shouldn't be sent

              // Temporarily remove the broadcast function to prevent loops
              const originalBroadcast = (excalidrawAPI as any).broadcastSceneUpdate
              delete (excalidrawAPI as any).broadcastSceneUpdate

              // CRITICAL: Set suppressOnChange flag BEFORE calling updateScene
              // This prevents the onChange callback from running at all
              const suppressOnChangeRef = (excalidrawAPI as any).suppressOnChangeRef
              if (suppressOnChangeRef) {
                suppressOnChangeRef.current = true
              }

              excalidrawAPI.updateScene({
                elements: sceneData.elements || [],
                appState: sceneData.appState || {},
                commitToHistory: false,
              })

              // Restore the broadcast function after a short delay
              setTimeout(() => {
                const api = excalidrawAPI as any
                api.broadcastSceneUpdate = originalBroadcast
                isReceivingUpdateRef.current = false
              }, 50)
            } else {
              isReceivingUpdateRef.current = false
            }
          } catch (error) {
            console.error('Failed to process scene update:', error)
            console.error('Error details:', error instanceof Error ? error.message : String(error))
            isReceivingUpdateRef.current = false
          }
        })

        // Store socket and update state
        setState({
          isCollaborating: true,
          collaborators: new Map(),
          roomId,
          socket,
        })

        // Update URL to include room parameter
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.set('room', roomId)
          window.history.replaceState({}, '', url.toString())
        }
      } catch (error) {
        console.error('Failed to start collaboration:', error)
        setState({
          isCollaborating: false,
          collaborators: new Map(),
          roomId: null,
          socket: null,
        })
        throw error
      }
    },
    [socketServerUrl, excalidrawAPI, onCollaboratorJoin, currentDiagram, onDiagramUpdate]
  )

  // Broadcast scene updates to other collaborators
  const broadcastSceneUpdate = useCallback(
    (elements: ExcalidrawElement[], appState: AppState) => {
      // Don't broadcast if we're currently receiving an update (prevents loops)
      // Don't broadcast if we haven't received initial scene data yet (prevents new users from overriding existing content)
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
        // Create a complete data structure to broadcast with diagram metadata
        // IMPORTANT: Only send minimal diagram metadata, not the entire GraphQL object
        const sceneData = {
          elements,
          appState: {
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom,
          },
          diagram: currentDiagram
            ? {
                id: currentDiagram.id,
                title: currentDiagram.title,
                description: currentDiagram.description,
                diagramType: currentDiagram.diagramType,
                company: currentDiagram.company, // Array with {id, name}
                companyId: Array.isArray(currentDiagram.company)
                  ? currentDiagram.company[0]?.id
                  : currentDiagram.company?.id,
                architecture: currentDiagram.architecture, // Array with architecture info
              }
            : null,
        }

        // Convert to ArrayBuffer for compatibility with excalidraw-room server
        const dataString = JSON.stringify(sceneData)
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(dataString).buffer
        const iv = new Uint8Array(16) // Dummy IV for development
        state.socket.emit('server-broadcast', state.roomId, dataBuffer, iv)
      } catch (error) {
        console.error('Failed to broadcast scene update:', error)
        console.error(
          'Broadcast error details:',
          error instanceof Error ? error.message : String(error)
        )
      }
    },
    [state.socket, state.roomId, state.isCollaborating, currentDiagram]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setState(prev => {
        if (prev.socket) {
          prev.socket.disconnect()
        }
        return {
          isCollaborating: false,
          collaborators: new Map(),
          roomId: null,
          socket: null,
        }
      })
    }
  }, [])

  // Add broadcastSceneUpdate to excalidrawAPI if available
  useEffect(() => {
    if (excalidrawAPI && state.isCollaborating) {
      // Add the broadcast function to the API so it can be called from ExcalidrawWrapper
      const api = excalidrawAPI as any
      api.broadcastSceneUpdate = broadcastSceneUpdate
    }
  }, [excalidrawAPI, state.isCollaborating, broadcastSceneUpdate])

  return {
    startCollaboration,
    stopCollaboration,
    isCollaborating: state.isCollaborating,
    collaborators: state.collaborators,
    roomId: state.roomId,
    broadcastSceneUpdate,
    isReceivingUpdateRef,
  }
}
