import { createTheme, ThemeOptions } from '@mui/material/styles'

// Farbpalette für das Corporate Design - dynamisch aus Umgebungsvariablen
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
 * Verwendet einen einfachen HSL-Ansatz für konsistente Farbvariationen
 */
function generateColorVariants(mainColor: string) {
  // Einfache Farb-Manipulation für bessere Browser-Kompatibilität
  // In einer Production-Umgebung könnte hier eine robustere Farb-Bibliothek verwendet werden
  
  // Für häufige Hex-Farben manuelle Varianten definieren
  const colorVariants: Record<string, { light: string; dark: string; lighter?: string; darker?: string }> = {
    // Atos Colors
    '#0066CC': { light: '#4D94E0', dark: '#004C99', lighter: '#E6F0FF', darker: '#003366' },
    '#00AEEF': { light: '#4DC8F4', dark: '#007DBC' },
    
    // DIN Colors  
    '#004164': { light: '#336B8A', dark: '#002A42', lighter: '#E8F1F5', darker: '#001A28' },
    '#821E3C': { light: '#A94866', dark: '#5A1529', lighter: '#F4E8EC', darker: '#3D0F1C' },
    
    // MF2 Colors
    '#c9ece1': { light: '#E0F6F0', dark: '#A8D4C6', lighter: '#F0FAF7', darker: '#8BC2B3' },
    '#2765c3': { light: '#5A8BD9', dark: '#1B4A94', lighter: '#E7F0FB', darker: '#123468' },
    
    // Fallback für unbekannte Farben
    '#D32F2F': { light: '#EF5350', dark: '#C62828' },
    '#ED6C02': { light: '#FF9800', dark: '#E65100' },
    '#0288D1': { light: '#03A9F4', dark: '#01579B' },
    '#2E7D32': { light: '#4CAF50', dark: '#1B5E20' },
  }
  
  const variants = colorVariants[mainColor.toUpperCase()]
  if (variants) {
    return variants
  }
  
  // Fallback: Verwende die ursprüngliche Farbe für alle Varianten
  console.warn(`Keine Farbvarianten für ${mainColor} definiert. Verwende Originalfarbe als Fallback.`)
  return {
    light: mainColor,
    dark: mainColor,
    lighter: mainColor,
    darker: mainColor,
  }
}

/**
 * Erstellt ein dynamisches Theme basierend auf Umgebungsvariablen
 * Unterstützt sowohl Legacy- als auch neue Variablennamen
 */
export function createDynamicTheme(): ReturnType<typeof createTheme> {
  // Primary Color aus Umgebungsvariablen laden
  const primaryColor = 
    process.env.NEXT_PUBLIC_THEME_PRIMARY_COLOR ||
    process.env.NEXT_PUBLIC_PRIMARY_COLOR ||
    '#0066CC' // Atos Blue als Fallback

  // Secondary Color aus Umgebungsvariablen laden  
  const secondaryColor = 
    process.env.NEXT_PUBLIC_THEME_SECONDARY_COLOR ||
    process.env.NEXT_PUBLIC_SECONDARY_COLOR ||
    '#00AEEF' // Atos Light Blue als Fallback

  // Font Family aus Umgebungsvariablen laden
  const fontFamily = 
    process.env.NEXT_PUBLIC_THEME_FONT_FAMILY ||
    process.env.NEXT_PUBLIC_FONT_FAMILY ||
    '"Roboto", "Helvetica", "Arial", sans-serif'

  // Debug-Ausgabe
  console.log('🎨 Dynamic Theme Debug Information:')
  console.log('NEXT_PUBLIC_THEME_PRIMARY_COLOR:', process.env.NEXT_PUBLIC_THEME_PRIMARY_COLOR)
  console.log('NEXT_PUBLIC_THEME_SECONDARY_COLOR:', process.env.NEXT_PUBLIC_THEME_SECONDARY_COLOR)
  console.log('NEXT_PUBLIC_THEME_FONT_FAMILY:', process.env.NEXT_PUBLIC_THEME_FONT_FAMILY)
  console.log('Resolved Primary Color:', primaryColor)
  console.log('Resolved Secondary Color:', secondaryColor)
  console.log('Resolved Font Family:', fontFamily)
  console.log(
    'All NEXT_PUBLIC_THEME env vars:',
    Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_THEME_'))
  )

  // Farbvarianten generieren
  const primaryVariants = generateColorVariants(primaryColor)
  const secondaryVariants = generateColorVariants(secondaryColor)

  const themeOptions: ThemeOptions = {
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        light: primaryVariants.light,
        dark: primaryVariants.dark,
        lighter: primaryVariants.lighter,
        darker: primaryVariants.darker,
      },
      secondary: {
        main: secondaryColor,
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
      background: {
        default: '#F5F7FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
      },
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
            // Entferne das Standard-24px Margin von Material UI 7
            margin: '0 !important',
            // Entferne auch mögliche margin-bottom Einstellungen
            marginBottom: '0 !important',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            // Entferne das Standard-Margin von CardContent
            margin: '0 !important',
            marginBottom: '0 !important',
            '&:last-child': {
              paddingBottom: '16px', // Standard-Padding beibehalten
            },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            // Entferne das Standard-Margin von CardHeader
            margin: '0 !important',
            marginBottom: '0 !important',
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            // Entferne das Standard-Margin von CardActions
            margin: '0 !important',
            marginBottom: '0 !important',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // Entferne das Standard-24px Margin von Material UI 7
            margin: '0 !important',
            // Entferne auch mögliche margin-bottom Einstellungen
            marginBottom: '0 !important',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: '#F5F7FA',
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
