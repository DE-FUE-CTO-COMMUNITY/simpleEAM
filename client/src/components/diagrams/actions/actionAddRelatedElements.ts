import React from 'react'

/**
 * Custom Action für "Verwandte Elemente hinzufügen"
 * Diese Action wird automatisch im Kontext-Menü angezeigt, wenn die Bedingungen erfüllt sind
 */
export const actionAddRelatedElements = {
  name: 'addRelatedElements' as const,
  label: 'Verwandte Elemente hinzufügen',
  icon: React.createElement(
    'svg',
    {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
    },
    React.createElement('path', {
      d: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
    })
  ),
  // Diese Action wird nur für Elemente mit databaseId angezeigt
  predicate: (elements: any[], appState: any, _appProps: any, _app: any) => {
    // Nur anzeigen wenn nicht im View-Modus und ein Element ausgewählt ist
    if (appState.viewModeEnabled || !elements || elements.length === 0) {
      return false
    }

    // Prüfen ob das ausgewählte Element eine databaseId hat
    const selectedElement = elements[0]
    const hasDbId = selectedElement?.customData?.databaseId

    return Boolean(hasDbId)
  },
  perform: (elements: any[], _appState: any, _formData: any, _app: any) => {
    // Hier wird die Action ausgeführt
    const selectedElement = elements[0]

    console.log('Add Related Elements action triggered for:', selectedElement)

    // Wir müssen Zugriff auf die onOpenAddRelatedElementsDialog-Funktion haben
    // Das können wir über eine globale Variable oder über das app-Objekt machen

    // Für jetzt verwenden wir window um die Funktion zu erreichen
    const globalApp = (window as any).__excalidrawApp
    if (globalApp && globalApp.onOpenAddRelatedElementsDialog) {
      globalApp.onOpenAddRelatedElementsDialog(selectedElement)
    }

    // Return false bedeutet, dass keine Änderungen am Canvas vorgenommen werden
    return false
  },
  trackEvent: {
    category: 'element' as const,
    action: 'addRelatedElements',
  },
  viewMode: false, // Nicht im View-Modus verfügbar
}
