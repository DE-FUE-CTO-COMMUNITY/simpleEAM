/**
 * Excalidraw Theme Adapter
 * 
 * Dieses Modul stellt eine generische Brücke zwischen den Umgebungsvariablen
 * und der Excalidraw-Library dar. Es konvertiert Material UI Theme-Farben
 * automatisch zu Excalidraw CSS-Variablen.
 */

/**
 * Generiert Farbvarianten aus einer Hauptfarbe
 * Verwendet einfache Hex-Manipulation für bessere Kompatibilität
 */
function generateExcalidrawColorVariants(mainColor: string) {
  // Generiert automatisch Farbvarianten aus der Hauptfarbe
  return {
    main: mainColor,
    lighter: lightenColor(mainColor, 0.9),
    light: lightenColor(mainColor, 0.3),
    dark: darkenColor(mainColor, 0.2),
    darker: darkenColor(mainColor, 0.4),
    darkest: darkenColor(mainColor, 0.6),
    hover: lightenColor(mainColor, 0.1)
  }
}

/**
 * Einfache Funktion zum Aufhellen einer Hex-Farbe
 */
function lightenColor(color: string, factor: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const newR = Math.min(255, Math.round(r + (255 - r) * factor))
  const newG = Math.min(255, Math.round(g + (255 - g) * factor))
  const newB = Math.min(255, Math.round(b + (255 - b) * factor))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Einfache Funktion zum Verdunkeln einer Hex-Farbe
 */
function darkenColor(color: string, factor: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const newR = Math.max(0, Math.round(r * (1 - factor)))
  const newG = Math.max(0, Math.round(g * (1 - factor)))
  const newB = Math.max(0, Math.round(b * (1 - factor)))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Erstellt CSS-Variablen für Excalidraw basierend auf Umgebungsvariablen
 * Kann sowohl client- als auch serverseitig verwendet werden
 */
export function generateExcalidrawThemeVariables() {
  // Theme-Farben aus Umgebungsvariablen lesen
  const primaryColor = process.env.NEXT_PUBLIC_THEME_PRIMARY_COLOR || '#0066CC'
  const secondaryColor = process.env.NEXT_PUBLIC_THEME_SECONDARY_COLOR || '#00AEEF'
  
  // Farbvarianten generieren
  const primaryVariants = generateExcalidrawColorVariants(primaryColor)
  const secondaryVariants = generateExcalidrawColorVariants(secondaryColor)

  // CSS-Variablen für Excalidraw Light Theme generieren
  const lightThemeVariables = {
    // Primary Color Familie
    '--color-primary': primaryVariants.main,
    '--color-primary-darker': primaryVariants.dark,
    '--color-primary-darkest': primaryVariants.darker,
    '--color-primary-light': primaryVariants.lighter,
    '--color-primary-light-darker': primaryVariants.light,
    '--color-primary-hover': primaryVariants.hover,

    // Brand Color Familie (für spezielle UI-Elemente)
    '--color-brand': primaryVariants.main,
    '--color-brand-hover': primaryVariants.hover,
    '--color-brand-active': primaryVariants.dark,

    // Container Farben
    '--color-on-primary-container': primaryVariants.darker,
    '--color-surface-primary-container': primaryVariants.lighter,
    '--color-logo-icon': primaryVariants.main,
    '--color-logo-text': primaryVariants.darker,
    '--color-promo': primaryVariants.main,

    // UI-Element Farben
    '--focus-highlight-color': primaryVariants.lighter,
    '--select-highlight-color': primaryVariants.main,
    '--link-color': primaryVariants.main,

    // Button States
    '--button-hover-bg': primaryVariants.lighter,
    '--button-active-bg': primaryVariants.lighter,
    '--button-active-border': primaryVariants.dark,

    // Border-Radius (falls aus ENV definiert)
    '--border-radius-md': '0.25rem',
    '--border-radius-lg': '0.25rem',
    '--border-radius-sm': '0.25rem',
  }

  // CSS-Variablen für Excalidraw Dark Theme generieren
  const darkThemeVariables = {
    // Primary Color Familie (angepasst für Dark Mode)
    '--color-primary': primaryVariants.light,
    '--color-primary-darker': primaryVariants.main,
    '--color-primary-darkest': primaryVariants.dark,
    '--color-primary-light': primaryVariants.darker,
    '--color-primary-light-darker': primaryVariants.darkest,
    '--color-primary-hover': primaryVariants.hover,

    // Brand Color Familie für Dark Mode
    '--color-brand': primaryVariants.light,
    '--color-brand-hover': primaryVariants.hover,
    '--color-brand-active': primaryVariants.main,

    // Container Farben für Dark Mode
    '--color-on-primary-container': primaryVariants.lighter,
    '--color-surface-primary-container': primaryVariants.darkest,
    '--color-logo-icon': primaryVariants.light,
    '--color-logo-text': primaryVariants.lighter,
    '--color-promo': primaryVariants.light,

    // UI-Element Farben für Dark Mode
    '--focus-highlight-color': primaryVariants.darkest,
    '--select-highlight-color': primaryVariants.light,
    '--link-color': primaryVariants.light,

    // Button States für Dark Mode
    '--button-hover-bg': primaryVariants.darkest,
    '--button-active-bg': primaryVariants.darker,
    '--button-active-border': primaryVariants.light,
  }

  return {
    light: lightThemeVariables,
    dark: darkThemeVariables,
    debug: {
      primaryColor,
      secondaryColor,
      primaryVariants,
      secondaryVariants
    }
  }
}

/**
 * Generiert CSS-Text für Excalidraw Theme-Variablen
 */
export function generateExcalidrawThemeCSS(): string {
  const themeVars = generateExcalidrawThemeVariables()
  
  const lightCSS = Object.entries(themeVars.light)
    .map(([key, value]) => `  ${key}: ${value} !important;`)
    .join('\n')

  const darkCSS = Object.entries(themeVars.dark)
    .map(([key, value]) => `  ${key}: ${value} !important;`)
    .join('\n')

  return `
/* Dynamische Excalidraw Theme-Anpassung aus Umgebungsvariablen */
/* Generiert für Primary: ${themeVars.debug.primaryColor}, Secondary: ${themeVars.debug.secondaryColor} */

.excalidraw {
${lightCSS}
}

.excalidraw.theme--dark {
${darkCSS}
}

/* Component-specific overrides */
.excalidraw .library-actions-counter {
  background-color: var(--color-primary) !important;
  color: var(--color-primary-light) !important;
}

.excalidraw .ToolIcon_type_button:hover,
.excalidraw button:hover {
  background-color: var(--button-hover-bg) !important;
}

.excalidraw .ToolIcon_type_button:active,
.excalidraw button:active {
  background-color: var(--button-active-bg) !important;
  border-color: var(--button-active-border) !important;
}
`.trim()
}

/**
 * Wendet die Theme-Variablen direkt auf ein HTML-Element an
 */
export function applyExcalidrawThemeVariables(element: HTMLElement, theme: 'light' | 'dark' = 'light') {
  const themeVars = generateExcalidrawThemeVariables()
  const variables = themeVars[theme]

  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}

// Debug-Export für Entwicklung
export function debugThemeVariables() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const themeVars = generateExcalidrawThemeVariables()
    console.group('🎨 Excalidraw Theme Variables Debug')
    console.log('Environment Variables:', {
      PRIMARY_COLOR: process.env.NEXT_PUBLIC_THEME_PRIMARY_COLOR,
      SECONDARY_COLOR: process.env.NEXT_PUBLIC_THEME_SECONDARY_COLOR,
    })
    console.log('Generated Variables:', themeVars)
    console.log('Generated CSS:', generateExcalidrawThemeCSS())
    console.groupEnd()
  }
}
