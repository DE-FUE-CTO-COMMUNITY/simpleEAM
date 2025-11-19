import { createTheme, ThemeOptions } from '@mui/material/styles'

export type ThemeBrandingOverrides = {
  primaryColor?: string | null
  secondaryColor?: string | null
  fontFamily?: string | null
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
    const [, r, g, b] = prefixed
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }

  return prefixed.toUpperCase()
}

// Color palette for the Corporate Design - dynamically from environment variables
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string
    darker?: string
  }

  interface SimplePaletteColorOptions {
    lighter?: string
    darker?: string
  }
}

/**
 * Generiert automatisch light und dark Varianten einer Hauptfarbe
 * Uses a simple HSL approach for consistent color variations
 */
function generateColorVariants(mainColor: string) {
  // Simple color manipulation for better browser compatibility
  // In a production environment, a more robust color library could be used here

  // Define manual variants for common hex colors
  const colorVariants: Record<
    string,
    { light: string; dark: string; lighter?: string; darker?: string }
  > = {}

  const variants = colorVariants[mainColor.toUpperCase()]
  if (variants) {
    return variants
  }

  // Fallback: Use the original color for all variants
  console.warn(`No color variants defined for ${mainColor}. Using original color as fallback.`)
  return {
    light: mainColor,
    dark: mainColor,
    lighter: mainColor,
    darker: mainColor,
  }
}

/**
 * Erstellt ein dynamisches Theme basierend auf Umgebungsvariablen
 * Supports both legacy and new variable names
 */
export function createDynamicTheme(
  mode: 'light' | 'dark' = 'light',
  branding?: ThemeBrandingOverrides
): ReturnType<typeof createTheme> {
  const resolvedPrimary =
    normalizeHexColor(branding?.primaryColor) ||
    normalizeHexColor(process.env.NEXT_PUBLIC_THEME_PRIMARY_COLOR) ||
    normalizeHexColor(process.env.NEXT_PUBLIC_PRIMARY_COLOR) ||
    '#0066CC'

  const resolvedSecondary =
    normalizeHexColor(branding?.secondaryColor) ||
    normalizeHexColor(process.env.NEXT_PUBLIC_THEME_SECONDARY_COLOR) ||
    normalizeHexColor(process.env.NEXT_PUBLIC_SECONDARY_COLOR) ||
    '#00AEEF'

  const fontFamily =
    (branding?.fontFamily && branding.fontFamily.trim()) ||
    process.env.NEXT_PUBLIC_THEME_FONT_FAMILY ||
    process.env.NEXT_PUBLIC_FONT_FAMILY ||
    '"Roboto", "Helvetica", "Arial", sans-serif'

  // Farbvarianten generieren
  const primaryVariants = generateColorVariants(resolvedPrimary)
  const secondaryVariants = generateColorVariants(resolvedSecondary)

  // Base palette configuration depending on mode
  const basePalette =
    mode === 'dark'
      ? {
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.6)',
            disabled: 'rgba(255, 255, 255, 0.38)',
          },
        }
      : {
          background: {
            default: '#F5F7FA',
            paper: '#FFFFFF',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
        }

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: resolvedPrimary,
        light: primaryVariants.light,
        dark: primaryVariants.dark,
        lighter: primaryVariants.lighter,
        darker: primaryVariants.darker,
      },
      secondary: {
        main: resolvedSecondary,
        light: secondaryVariants.light,
        dark: secondaryVariants.dark,
      },
      error: {
        main: '#D32F2F',
        light: '#EF5350',
        dark: '#C62828',
      },
      warning: {
        main: '#ED6C02',
        light: '#FF9800',
        dark: '#E65100',
      },
      info: {
        main: '#0288D1',
        light: '#03A9F4',
        dark: '#01579B',
      },
      success: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
      },
      grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        A100: '#F5F5F5',
        A200: '#EEEEEE',
        A400: '#BDBDBD',
        A700: '#616161',
      },
      ...basePalette,
    },
    typography: {
      fontFamily: fontFamily,
      h1: {
        fontWeight: 500,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 500,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      subtitle1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
            },
          },
          sizeSmall: {
            height: '32px',
            padding: '0 12px',
          },
          sizeMedium: {
            height: '40px',
            padding: '0 16px',
          },
          sizeLarge: {
            height: '48px',
            padding: '0 24px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            // Remove the default 24px margin from Material UI 7
            margin: '0 !important',
            // Also remove possible margin-bottom settings
            marginBottom: '0 !important',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            // Remove the default margin from CardContent
            margin: '0 !important',
            marginBottom: '0 !important',
            '&:last-child': {
              paddingBottom: '16px', // Keep standard padding
            },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            // Remove the default margin from CardHeader
            margin: '0 !important',
            marginBottom: '0 !important',
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            // Remove the default margin from CardActions
            margin: '0 !important',
            marginBottom: '0 !important',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // Remove the default 24px margin from Material UI 7
            margin: '0 !important',
            // Also remove possible margin-bottom settings
            marginBottom: '0 !important',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: mode === 'dark' ? '#2c2c2c' : '#F5F7FA',
            },
          },
        },
      },
    },
  }

  return createTheme(themeOptions)
}

// Statisches Theme als Fallback exportieren
export { default as staticTheme } from './theme'
