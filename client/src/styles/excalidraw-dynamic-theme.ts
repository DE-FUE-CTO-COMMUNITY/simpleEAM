/**
 * Dynamische Excalidraw Theme CSS-Generierung
 *
 * Diese Datei wird zur Build-Zeit oder zur Laufzeit generiert und wendet
 * die Farben aus den Umgebungsvariablen auf Excalidraw an.
 */

import { generateExcalidrawThemeCSS } from './excalidraw-theme-adapter'

// Generiere CSS basierend auf aktuellen Umgebungsvariablen
const dynamicCSS = generateExcalidrawThemeCSS()

// Export CSS as string for dynamic injection
export default dynamicCSS

// Function to inject CSS into DOM
export function injectExcalidrawThemeCSS(_mode: 'light' | 'dark' = 'light') {
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

  // Create new style element
  const styleElement = document.createElement('style')
  styleElement.id = 'excalidraw-dynamic-theme'
  styleElement.type = 'text/css'
  styleElement.textContent = dynamicCSS

  // Insert CSS with highest priority
  document.head.appendChild(styleElement)
}
