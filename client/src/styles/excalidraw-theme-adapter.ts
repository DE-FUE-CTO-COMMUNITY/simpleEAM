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
 * Angepasst für Button-Hintergründe analog zum Original (#e6f2ff für #4d94e0)
 */
function generateExcalidrawColorVariants(mainColor: string) {
  // Generiert automatisch Farbvarianten aus der Hauptfarbe
  return {
    main: mainColor,
    lighter: lightenColor(mainColor, 0.95), // Sehr hell für Button-Hintergründe wie #e6f2ff
    light: lightenColor(mainColor, 0.85), // Hell für UI-Elemente
    dark: darkenColor(mainColor, 0.2),
    darker: darkenColor(mainColor, 0.4),
    darkest: darkenColor(mainColor, 0.6),
    hover: lightenColor(mainColor, 0.1),
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

    // Button States (Original-kompatibel: hover/active/selected = sehr hell, borders = primär/dunkler)
    '--button-hover-bg': primaryVariants.lighter, // = #e6f2ff äquivalent (sehr hell für Hover)
    '--button-active-bg': primaryVariants.lighter, // = #e6f2ff äquivalent (sehr hell für Active)
    '--button-active-border': primaryVariants.darker, // = #2761a8 äquivalent (dunkler für Active Border)
    '--button-selected-bg': primaryVariants.lighter, // = #e6f2ff äquivalent (sehr hell für Selected)
    '--button-selected-border': primaryVariants.main, // = #4d94e0 äquivalent (primär für Selected Border)

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
    '--button-active-bg': primaryVariants.light,
    '--button-active-border': primaryVariants.lighter,
    '--button-selected-bg': primaryVariants.light,
    '--button-selected-border': primaryVariants.lighter,
  }

  return {
    light: lightThemeVariables,
    dark: darkThemeVariables,
    debug: {
      primaryColor,
      secondaryColor,
      primaryVariants,
      secondaryVariants,
    },
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

/* COMPLETE EXCALIDRAW OVERRIDE - All styling in one place */

/* Library button hiding */
.excalidraw .library-menu-browse-button {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* Border radius application */
.excalidraw .Island,
.excalidraw .dropdown-menu-container,
.excalidraw .Modal,
.excalidraw .dialog,
.excalidraw .ToolIcon_type_button,
.excalidraw button {
  border-radius: var(--border-radius-lg) !important;
}

/* Component-specific styling with colors and structure */
.excalidraw .library-actions-counter {
  background-color: var(--color-primary) !important;
  color: var(--color-primary-light) !important;
  border-radius: 50% !important;
}

/* Button states - Original Logic Replication */
.excalidraw .ToolIcon_type_button:hover,
.excalidraw button:hover {
  background-color: var(--button-hover-bg) !important;
}

.excalidraw .ToolIcon_type_button:active,
.excalidraw button:active,
.excalidraw .ToolIcon_type_button--active {
  background-color: var(--button-active-bg) !important;
  border-color: var(--button-active-border) !important;
}

.excalidraw .ToolIcon_type_button--selected,
.excalidraw .ToolIcon_type_button:focus {
  background-color: var(--button-selected-bg) !important;
  border-color: var(--button-selected-border) !important;
}

/* Library element responsive sizing - CRITICAL for fork functionality */
.excalidraw .library-unit {
  width: 55px !important;
  height: 27.5px !important;
  border-radius: var(--border-radius-lg) !important;
}

@media (min-width: 768px) {
  .excalidraw .library-unit {
    width: 70px !important;
    height: 35px !important;
  }
}

@media (min-width: 1024px) {
  .excalidraw .library-unit {
    width: 95px !important;
    height: 47.5px !important;
  }
}

@media (min-width: 1440px) {
  .excalidraw .library-unit {
    width: 120px !important;
    height: 60px !important;
  }
}

/* Library grid layout adjustments */
.excalidraw .library-menu-items-container__grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr 1fr !important;
  grid-gap: 0.5rem !important;
}

@media (min-width: 768px) {
  .excalidraw .library-menu-items-container__grid {
    grid-template-columns: 1fr 1fr 1fr !important;
  }
}

@media (min-width: 1024px) {
  .excalidraw .library-menu-items-container__grid {
    grid-template-columns: 1fr 1fr 1fr !important;
  }
}

@media (min-width: 1440px) {
  .excalidraw .library-menu-items-container__grid {
    grid-template-columns: 1fr 1fr !important;
  }
}

/* Library row adjustments */
.excalidraw .library-menu-items-container__row {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 0.5rem !important;
}

@media (min-width: 768px) {
  .excalidraw .library-menu-items-container__row {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.75rem !important;
  }
}

@media (min-width: 1024px) {
  .excalidraw .library-menu-items-container__row {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem !important;
  }
}

@media (min-width: 1440px) {
  .excalidraw .library-menu-items-container__row {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.25rem !important;
  }
}

/* Library button hiding - can be controlled via environment variables in the future */
.excalidraw .library-menu-browse-button {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* Border radius application */
.excalidraw .Island,
.excalidraw .dropdown-menu-container,
.excalidraw .Modal,
.excalidraw .dialog,
.excalidraw .ToolIcon_type_button,
.excalidraw button {
  border-radius: var(--border-radius-lg) !important;
}
`.trim()
}

/**
 * Wendet die Theme-Variablen direkt auf ein HTML-Element an
 */
export function applyExcalidrawThemeVariables(
  element: HTMLElement,
  theme: 'light' | 'dark' = 'light'
) {
  const themeVars = generateExcalidrawThemeVariables()
  const variables = themeVars[theme]

  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}

// Debug-Export für Entwicklung
export function debugThemeVariables() {
  // Debug function disabled in production
}
