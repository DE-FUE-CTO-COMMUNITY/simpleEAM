'use client'

// Ein globaler Event-Bus für die Kommunikation zwischen Komponenten
// Dies umgeht die Probleme mit React-Hooks-Reihenfolge und Timing

export const DiagramEventBus = {
  // Globales Objekt für die API und Handler
  api: null as any,
  handler: null as any,

  // API-Referenz setzen
  setExcalidrawAPI(api: any) {
    console.log('DiagramEventBus: API wird gesetzt', !!api)
    this.api = api
    this.triggerEvent('apiReady')
  },

  // Handler-Referenz setzen
  setOpenHandler(handler: Function) {
    console.log('DiagramEventBus: Handler wird gesetzt', !!handler)
    this.handler = handler
    this.triggerEvent('handlerReady')
  },

  // Alle Referenzen zurücksetzen
  reset() {
    this.api = null
    this.handler = null
  },

  // Diagramm öffnen
  openDiagram(diagramData: any) {
    console.log('DiagramEventBus: Versuche Diagramm zu öffnen', {
      apiExists: !!this.api,
      handlerExists: !!this.handler,
      diagramExists: !!diagramData,
    })

    if (this.handler && diagramData) {
      try {
        console.log('DiagramEventBus: Öffne Diagramm mit Handler')
        this.handler(diagramData)
        return true
      } catch (error) {
        console.error('DiagramEventBus: Fehler beim Öffnen des Diagramms', error)
        return false
      }
    }
    return false
  },

  // Event auslösen
  triggerEvent(eventName: string, detail: any = {}) {
    if (typeof window !== 'undefined') {
      console.log(`DiagramEventBus: Event "${eventName}" wird ausgelöst`, detail)
      const event = new CustomEvent(`diagram_${eventName}`, { detail })
      window.dispatchEvent(event)
    }
  },

  // Event-Listener registrieren
  on(eventName: string, callback: Function) {
    if (typeof window !== 'undefined') {
      const handler = (event: any) => callback(event.detail)
      window.addEventListener(`diagram_${eventName}`, handler as EventListener)

      return () => {
        window.removeEventListener(`diagram_${eventName}`, handler as EventListener)
      }
    }
    return () => {}
  },
}

export default DiagramEventBus
