/**
 * Hook für Excalidraw Collaboration
 * Implementiert die Collaboration-Logik basierend auf dem excalidraw-room Server (Socket.IO)
 */

import { useCallback, useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

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
}

interface UseExcalidrawCollaborationProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null
  username?: string
  userAvatarUrl?: string
  onCollaboratorJoin?: (collaborator: Collaborator) => void
  onCollaboratorLeave?: (collaborator: Collaborator) => void
}

export const useExcalidrawCollaboration = ({
  excalidrawAPI,
  username: _username = 'Anonymous User',
  userAvatarUrl: _userAvatarUrl,
  onCollaboratorJoin,
  onCollaboratorLeave: _onCollaboratorLeave,
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

  // Socket.IO Server URL aus der Umgebungsvariable
  const socketServerUrl =
    process.env.NEXT_PUBLIC_EXCALIDRAW_WS_SERVER_URL || 'http://localhost:8890'

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
      console.log('Starting collaboration for room:', roomId)

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

        // Set up event listeners
        socket.on('connect', () => {
          console.log('Socket.IO connected, joining room:', roomId)
          socket.emit('join-room', roomId)
        })

        socket.on('disconnect', () => {
          console.log('Socket.IO disconnected')
        })

        socket.on('connect_error', error => {
          console.error('Socket.IO connection error:', error)
        })

        socket.on('init-room', () => {
          console.log('Room initialized')
        })

        socket.on('first-in-room', () => {
          console.log('First user in room - will broadcast current scene when ready')
          isFirstUserRef.current = true
          hasReceivedInitialSceneRef.current = true // First user doesn't need to wait for initial scene
        })

        socket.on('new-user', (socketId: string) => {
          console.log('New user joined:', socketId)
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

                // Only broadcast if there are elements to share
                if (currentElements && currentElements.length > 0) {
                  console.log(
                    `Broadcasting current scene (${currentElements.length} elements) to new user ${socketId}`
                  )

                  // Create a simple data structure to broadcast
                  const sceneData = {
                    elements: currentElements,
                    appState: {
                      scrollX: currentAppState.scrollX,
                      scrollY: currentAppState.scrollY,
                      zoom: currentAppState.zoom,
                    },
                  }

                  // Convert to ArrayBuffer for compatibility with excalidraw-room server
                  const dataString = JSON.stringify(sceneData)
                  const encoder = new TextEncoder()
                  const dataBuffer = encoder.encode(dataString).buffer
                  const iv = new Uint8Array(16) // Dummy IV for development

                  socket.emit('server-broadcast', roomId, dataBuffer, iv)
                } else {
                  console.log('No elements to broadcast to new user')
                }
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
          console.log('Room users changed:', userIds)
          setState(prev => {
            const newCollaborators = new Map<string, Collaborator>()
            userIds.forEach(userId => {
              if (userId !== socket.id) {
                const collaborator: Collaborator = {
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
          console.log('Received scene update from collaborator')

          // Prevent re-broadcasting immediately
          isReceivingUpdateRef.current = true

          try {
            // Debug: Log the received data
            console.log('Received data type:', typeof encryptedData)
            console.log('Received data length:', encryptedData?.byteLength || 'undefined')

            // For development, we'll implement basic decryption
            // Convert ArrayBuffer back to string
            const decoder = new TextDecoder()
            const dataString = decoder.decode(encryptedData)
            console.log('Decoded string preview:', dataString.substring(0, 100) + '...')

            const sceneData = JSON.parse(dataString)
            console.log('Parsed scene data:', {
              hasElements: !!sceneData.elements,
              elementCount: sceneData.elements?.length || 0,
              hasAppState: !!sceneData.appState,
              keys: Object.keys(sceneData),
            })

            if (excalidrawAPI && sceneData && sceneData.elements !== undefined) {
              const incomingElementCount = sceneData.elements ? sceneData.elements.length : 0

              console.log(`Updating scene with ${incomingElementCount} elements from collaborator`)

              // Mark that we've received initial scene data
              if (!hasReceivedInitialSceneRef.current) {
                hasReceivedInitialSceneRef.current = true
                console.log('Received initial scene data from existing users')
              }

              // Always update - this ensures proper synchronization
              // The business logic should prevent sending empty scenes when they shouldn't be sent

              // Temporarily remove the broadcast function to prevent loops
              const originalBroadcast = (excalidrawAPI as any).broadcastSceneUpdate
              delete (excalidrawAPI as any).broadcastSceneUpdate

              excalidrawAPI.updateScene({
                elements: sceneData.elements || [],
                appState: sceneData.appState || {},
                commitToHistory: false,
              })

              // Restore the broadcast function after a short delay
              setTimeout(() => {
                ;(excalidrawAPI as any).broadcastSceneUpdate = originalBroadcast
                isReceivingUpdateRef.current = false
              }, 50)
            } else {
              console.log('Received invalid scene data, skipping update. SceneData:', sceneData)
              console.log('ExcalidrawAPI available:', !!excalidrawAPI)
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
    [socketServerUrl, excalidrawAPI, onCollaboratorJoin]
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
        console.log('Skipping broadcast - conditions not met:', {
          hasSocket: !!state.socket,
          hasRoomId: !!state.roomId,
          isCollaborating: state.isCollaborating,
          isReceivingUpdate: isReceivingUpdateRef.current,
          hasReceivedInitialScene: hasReceivedInitialSceneRef.current,
        })
        return
      }

      try {
        // Create a simple data structure to broadcast
        const sceneData = {
          elements,
          appState: {
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom,
          },
        }

        console.log('Preparing to broadcast scene data:', {
          elementCount: elements?.length || 0,
          hasAppState: !!appState,
          scrollX: appState?.scrollX,
          scrollY: appState?.scrollY,
          zoom: appState?.zoom?.value,
        })

        // Convert to ArrayBuffer for compatibility with excalidraw-room server
        const dataString = JSON.stringify(sceneData)
        console.log('JSON string length:', dataString.length)
        console.log('JSON preview:', dataString.substring(0, 200) + '...')

        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(dataString).buffer
        const iv = new Uint8Array(16) // Dummy IV for development

        console.log('Broadcasting scene update to collaborators')
        console.log('Buffer length:', dataBuffer.byteLength)
        state.socket.emit('server-broadcast', state.roomId, dataBuffer, iv)
      } catch (error) {
        console.error('Failed to broadcast scene update:', error)
        console.error(
          'Broadcast error details:',
          error instanceof Error ? error.message : String(error)
        )
      }
    },
    [state.socket, state.roomId, state.isCollaborating]
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
      ;(excalidrawAPI as any).broadcastSceneUpdate = broadcastSceneUpdate
    }
  }, [excalidrawAPI, state.isCollaborating, broadcastSceneUpdate])

  return {
    startCollaboration,
    stopCollaboration,
    isCollaborating: state.isCollaborating,
    collaborators: state.collaborators,
    roomId: state.roomId,
    broadcastSceneUpdate,
  }
}
