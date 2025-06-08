import { useState, useEffect } from 'react'

/**
 * Hook zur automatischen Berechnung der Seitengröße basierend auf der verfügbaren Fensterhöhe
 * @param tableRef - Referenz zum Tabellen-Container-Element
 * @param headerHeight - Geschätzte Höhe des Tabellenkopfs in Pixeln (Standard: 60px)
 * @param footerHeight - Geschätzte Höhe des Tabellenfußes in Pixeln (Standard: 80px)
 * @param rowHeight - Geschätzte Höhe einer Tabellenzeile in Pixeln (Standard: 60px)
 * @param offsetHeight - Zusätzlicher Offset für andere UI-Elemente (Standard: 200px)
 * @returns Die berechnete Seitengröße
 */
const useAutomaticPageSize = (
  tableRef: React.RefObject<HTMLElement>,
  headerHeight: number = 60,
  footerHeight: number = 80,
  rowHeight: number = 60,
  offsetHeight: number = 200
): number => {
  const [pageSize, setPageSize] = useState(10) // Standard-Seitengröße

  useEffect(() => {
    const calculatePageSize = () => {
      // Verfügbare Fensterhöhe
      const windowHeight = window.innerHeight

      // Verfügbare Höhe für die Tabelle berechnen
      let availableHeight = windowHeight - offsetHeight

      // Wenn tableRef verfügbar ist, nutze eine präzisere Berechnung
      if (tableRef.current) {
        const rect = tableRef.current.getBoundingClientRect()
        // Berechne die verfügbare Höhe ab der aktuellen Position der Tabelle
        // Verwende einen kleineren, festen Puffer für Footer und Scrollbars
        const remainingHeight = windowHeight - rect.top - 80 // 80px Puffer für Footer/Scrollbars

        // Nutze die bessere der beiden Berechnungen
        availableHeight = Math.max(remainingHeight, windowHeight - offsetHeight)
      }

      // Höhe für Tabelleninhalt (ohne Header und Paginierung)
      const contentHeight = Math.max(0, availableHeight - headerHeight - footerHeight)

      // Berechne die Anzahl der Zeilen, die in den verfügbaren Raum passen
      // Reduziere um 1 Zeile als Sicherheitspuffer, um Scrollbars zu vermeiden
      const calculatedPageSize = Math.floor(contentHeight / rowHeight) - 1

      // Mindestens 5 Zeilen, maximal 50 Zeilen anzeigen
      const newPageSize = Math.max(5, Math.min(50, calculatedPageSize))

      setPageSize(newPageSize)
    }

    // Initiale Berechnung
    calculatePageSize()

    // Event Listener für Fenstergröße-Änderungen mit Debounce
    let resizeTimeout: NodeJS.Timeout | null = null
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      // Debounce für bessere Performance
      resizeTimeout = setTimeout(calculatePageSize, 150)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [tableRef, headerHeight, footerHeight, rowHeight, offsetHeight])

  return pageSize
}

export default useAutomaticPageSize
