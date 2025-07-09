'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { GET_DIAGRAM } from '@/graphql/diagram'
import { useDiagramState } from '../state/DiagramState'
import { useDiagramHandlers } from '../handlers/DiagramHandlers'

export const useDiagramURLParams = () => {
  const searchParams = useSearchParams()
  const openDiagramId = searchParams.get('openDiagram')

  // GraphQL-Abfrage für das Diagramm, wenn eine ID in der URL vorhanden ist
  const {
    data: diagramData,
    loading: diagramLoading,
    error: diagramError,
  } = useQuery(GET_DIAGRAM, {
    variables: { id: openDiagramId },
    skip: !openDiagramId,
    fetchPolicy: 'network-only', // Stellt sicher, dass wir die neueste Version erhalten
    notifyOnNetworkStatusChange: true, // Aktualisiert den Ladezustand bei jedem Netzwerkstatus
  })

  // Custom Event-Listener für direkte API-Kommunikation
  useEffect(() => {
    if (typeof window !== 'undefined' && openDiagramId) {
      // Event-Listener für direkte API-Kommunikation registrieren
      const handleAPIReady = (event: any) => {
        if (event.detail?.id === openDiagramId) {
          console.log(
            'ExcalidrawAPIReady Event empfangen, versuche Diagramm zu öffnen:',
            event.detail.id
          )

          // Verzögert ausführen, um sicherzustellen, dass alle Komponenten bereit sind
          setTimeout(() => {
            // Direkt auf die globalen Objekte zugreifen, um Timing-Probleme zu umgehen
            const api = (window as any).__excalidrawAPI
            const handler = (window as any).__handleOpenDiagram

            if (api && handler && diagramData?.diagrams?.[0]) {
              console.log('Öffne Diagramm über globale Handler nach Event')
              handler(diagramData.diagrams[0])
            }
          }, 500)
        }
      }

      window.addEventListener('excalidrawAPIReady', handleAPIReady)

      return () => {
        window.removeEventListener('excalidrawAPIReady', handleAPIReady)
      }
    }
  }, [openDiagramId, diagramData])

  // Debugging für GraphQL-Abfrage
  useEffect(() => {
    if (openDiagramId) {
      console.log('Diagramm-Abfrage:', {
        id: openDiagramId,
        loading: diagramLoading,
        error: diagramError?.message,
        data: diagramData,
      })
    }
  }, [openDiagramId, diagramLoading, diagramError, diagramData])

  const {
    excalidrawAPI,
    currentDiagram,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
    updateDialogState,
    lastSavedScene,
  } = useDiagramState()

  const { handleOpenDiagram } = useDiagramHandlers(
    excalidrawAPI,
    currentDiagram,
    setCurrentDiagram,
    setCurrentScene,
    setHasUnsavedChanges,
    setLastSavedScene,
    setNotification,
    open => updateDialogState('saveDialogOpen', open),
    open => updateDialogState('saveAsDialogOpen', open),
    lastSavedScene
  )

  // Auto-open diagram from URL parameter
  useEffect(() => {
    console.log('URL Param Werte:', {
      openDiagramId,
      excalidrawAPIExists: !!excalidrawAPI,
      excalidrawAPIReady: excalidrawAPI?.ready === true, // Prüfe explizit, ob die API bereit ist
      excalidrawAPIFunctions: excalidrawAPI ? Object.keys(excalidrawAPI).join(', ') : 'keine',
      globalAPIExists: !!(window as any).__excalidrawAPI,
      diagramDataExists: !!diagramData,
      diagramsExist: diagramData?.diagrams?.length > 0,
      diagramJson: diagramData?.diagrams?.[0]?.diagramJson ? 'Vorhanden' : 'Fehlt',
    })

    // Alternative API-Referenz aus dem globalen Objekt verwenden, wenn der State noch nicht aktualisiert ist
    // Diese Lösung umgeht das React-State-Timing-Problem
    const api = (window as any).__excalidrawAPI || excalidrawAPI

    if (
      openDiagramId &&
      api &&
      typeof api.updateScene === 'function' && // Explizit prüfen, ob die updateScene-Funktion existiert
      diagramData &&
      diagramData.diagrams &&
      diagramData.diagrams.length > 0
    ) {
      // Warte einen längeren Moment, damit die Excalidraw-API garantiert vollständig initialisiert ist
      const timeoutId = setTimeout(() => {
        console.log('Öffne Diagramm aus URL-Parameter:', openDiagramId)
        console.log('Excalidraw API Zustand:', {
          excalidrawAPIReady: !!api,
          updateSceneExists: typeof api.updateScene === 'function',
          getSceneElementsExists: typeof api.getSceneElements === 'function',
          apiSource: api === excalidrawAPI ? 'state' : 'global',
        })
        console.log('Diagramm-Daten zum Öffnen:', diagramData.diagrams[0])

        if (!diagramData.diagrams[0].diagramJson) {
          console.error('Fehler: diagramJson fehlt im Diagrammobjekt:', diagramData.diagrams[0])
          setNotification({
            open: true,
            message: 'Fehler beim Öffnen des Diagramms: JSON-Daten fehlen',
            severity: 'error',
          })
          return
        }

        try {
          // Direkter Test der API-Funktionalität vor dem eigentlichen Öffnen
          const testData = JSON.parse(diagramData.diagrams[0].diagramJson)
          console.log('Diagramm JSON valid:', !!testData)

          // Stelle sicher, dass wir die globale API-Referenz nutzen
          // @ts-expect-error - Manueller API-Zugriff für Zuverlässigkeit
          window.__handleOpenDiagram = handleOpenDiagram

          // KRITISCHE ÄNDERUNG: Verwende handleOpenDiagram direkt mit lokaler API und Daten
          // Dies umgeht die Probleme mit den globalen Variablen und Event-Handling
          console.log('DIREKTER AUFRUF von handleOpenDiagram ohne Events oder globale Variablen')
          handleOpenDiagram(diagramData.diagrams[0])
        } catch (error) {
          console.error('Fehler beim Parsen des Diagramm-JSON:', error)
          setNotification({
            open: true,
            message: 'Fehler beim Öffnen des Diagramms: JSON-Daten ungültig',
            severity: 'error',
          })
        }
      }, 1800) // NOCH längere Verzögerung für bessere Zuverlässigkeit

      return () => clearTimeout(timeoutId)
    }
  }, [openDiagramId, excalidrawAPI, diagramData, handleOpenDiagram, setNotification])

  return {
    openDiagramId,
  }
}

export default useDiagramURLParams
