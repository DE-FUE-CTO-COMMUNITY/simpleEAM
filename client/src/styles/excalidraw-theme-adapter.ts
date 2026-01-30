/**
 * Excalidraw Theme Adapter
 *
 * Dieses Modul stellt eine generische Brücke zwischen den Umgebungsvariablen
 * und der Excalidraw-Library dar. Es konvertiert Material UI Theme-Farben
 * automatisch zu Excalidraw CSS-Variablen.
 */

export type ExcalidrawThemeOverrides = {
  primaryColor?: string | null
  secondaryColor?: string | null
}

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

const normalizeHexColor = (color?: string | null): string | null => {
  if (!color) return null
  const trimmed = color.trim()
  if (!trimmed) return null
  const prefixed = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  if (!HEX_COLOR_REGEX.test(prefixed)) {
    return null
  }

  if (prefixed.length === 4) {
    const r = prefixed[1]
    const g = prefixed[2]
    const b = prefixed[3]
    if (!r || !g || !b) {
      return null
    }
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }

  return prefixed.toUpperCase()
}

/**
 * Generates color variants from a main color
 * Verwendet einfache Hex-Manipulation für bessere Kompatibilität
 * Adapted for button backgrounds similar to original (#e6f2ff für #4d94e0)
 */
function generateExcalidrawColorVariants(mainColor: string) {
  // Automatically generates color variants from the main color
  return {
    main: mainColor,
    lighter: lightenColor(mainColor, 0.95), // Very light for button backgrounds like #e6f2ff
    light: lightenColor(mainColor, 0.85), // Light for UI elements
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
 * Can be used both client-side and server-side
 */
export function generateExcalidrawThemeVariables(
  overrides?: ExcalidrawThemeOverrides,
  runtimeConfig?: { primaryColor: string; secondaryColor: string }
) {
  // Read theme colors from overrides first, then runtime config
  const primaryColor =
    normalizeHexColor(overrides?.primaryColor) ||
    (runtimeConfig && normalizeHexColor(runtimeConfig.primaryColor)) ||
    '#0066CC'
  const secondaryColor =
    normalizeHexColor(overrides?.secondaryColor) ||
    (runtimeConfig && normalizeHexColor(runtimeConfig.secondaryColor)) ||
    '#00AEEF'

  // Farbvarianten generieren
  const primaryVariants = generateExcalidrawColorVariants(primaryColor)
  const secondaryVariants = generateExcalidrawColorVariants(secondaryColor)

  // Generate CSS variables for Excalidraw light theme
  const lightThemeVariables = {
    // Primary Color Familie
    '--color-primary': primaryVariants.main,
    '--color-primary-darker': primaryVariants.dark,
    '--color-primary-darkest': primaryVariants.darker,
    '--color-primary-light': primaryVariants.lighter,
    '--color-primary-light-darker': primaryVariants.light,
    '--color-primary-hover': primaryVariants.hover,

    // Brand color family (for special UI elements)
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

    // Button states (original-compatible: hover/active/selected = very light, borders = primary/darker)
    '--button-hover-bg': primaryVariants.lighter, // = #e6f2ff equivalent (very light for hover)
    '--button-active-bg': primaryVariants.lighter, // = #e6f2ff equivalent (very light for active)
    '--button-active-border': primaryVariants.darker, // = #2761a8 equivalent (darker for active border)
    '--button-selected-bg': primaryVariants.lighter, // = #e6f2ff equivalent (very light for selected)
    '--button-selected-border': primaryVariants.main, // = #4d94e0 equivalent (primary for selected border)

    // Border radius (if defined in ENV)
    '--border-radius-md': '0.25rem',
    '--border-radius-lg': '0.25rem',
    '--border-radius-sm': '0.25rem',
  }

  // Generate CSS variables for Excalidraw dark theme
  const darkThemeVariables = {
    // Primary color family (adapted for dark mode)
    '--color-primary': primaryVariants.light,
    '--color-primary-darker': primaryVariants.main,
    '--color-primary-darkest': primaryVariants.dark,
    '--color-primary-light': primaryVariants.darker,
    '--color-primary-light-darker': primaryVariants.darkest,
    '--color-primary-hover': primaryVariants.hover,

    // Brand color family for dark mode
    '--color-brand': primaryVariants.light,
    '--color-brand-hover': primaryVariants.hover,
    '--color-brand-active': primaryVariants.main,

    // Container colors for dark mode
    '--color-on-primary-container': primaryVariants.lighter,
    '--color-surface-primary-container': primaryVariants.darkest,
    '--color-logo-icon': primaryVariants.light,
    '--color-logo-text': primaryVariants.lighter,
    '--color-promo': primaryVariants.light,

    // UI element colors for dark mode
    '--focus-highlight-color': primaryVariants.darkest,
    '--select-highlight-color': primaryVariants.light,
    '--link-color': primaryVariants.light,

    // Button states for dark mode
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
export function generateExcalidrawThemeCSS(
  overrides?: ExcalidrawThemeOverrides,
  runtimeConfig?: { primaryColor: string; secondaryColor: string }
): string {
  const themeVars = generateExcalidrawThemeVariables(overrides, runtimeConfig)

  const lightCSS = Object.entries(themeVars.light)
    .map(([key, value]) => `  ${key}: ${value} !important;`)
    .join('\n')

  const darkCSS = Object.entries(themeVars.dark)
    .map(([key, value]) => `  ${key}: ${value} !important;`)
    .join('\n')

  return `
/* Dynamische Excalidraw Theme-Anpassung aus Umgebungsvariablen */
/* Generated for Primary: ${themeVars.debug.primaryColor}, Secondary: ${themeVars.debug.secondaryColor} */

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
  theme: 'light' | 'dark' = 'light',
  runtimeConfig?: { primaryColor: string; secondaryColor: string }
) {
  const themeVars = generateExcalidrawThemeVariables(undefined, runtimeConfig)
  const variables = themeVars[theme]

  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}

// Debug export for development
export function debugThemeVariables() {
  // Debug function disabled in production
}
