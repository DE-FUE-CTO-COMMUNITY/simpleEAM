/**
 * Dynamische Excalidraw Theme CSS-Generierung
 *
 * Diese Datei wird zur Build-Zeit oder zur Laufzeit generiert und wendet
 * die Farben aus den Umgebungsvariablen auf Excalidraw an.
 */

import { generateExcalidrawThemeCSS } from './excalidraw-theme-adapter'

// Generiere CSS basierend auf aktuellen Umgebungsvariablen
const dynamicCSS = generateExcalidrawThemeCSS()

// CSS als String exportieren für dynamische Injection
export default dynamicCSS

// Funktion zum Injizieren des CSS in den DOM
export function injectExcalidrawThemeCSS(mode: 'light' | 'dark' = 'light') {
  if (typeof document === 'undefined') {
    return // Server-side rendering guard
  }

  // Entferne vorhandenes dynamisches Theme-CSS
  const existingStyle = document.getElementById('excalidraw-dynamic-theme')
  if (existingStyle) {
    existingStyle.remove()
  }

  // Generiere CSS basierend auf dem aktuellen Mode
  const dynamicCSS = generateExcalidrawThemeCSS()

  // Neues Style-Element erstellen
  const styleElement = document.createElement('style')
  styleElement.id = 'excalidraw-dynamic-theme'
  styleElement.type = 'text/css'
  styleElement.textContent = dynamicCSS

  // CSS mit höchster Priorität einfügen
  document.head.appendChild(styleElement)

  // Debug-Ausgabe in Entwicklungsumgebung
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎨 Excalidraw dynamic theme CSS injected for ${mode} mode:`, styleElement)
  }
}
