'use client'

import React, { useState, useEffect } from 'react'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useServerInsertedHTML } from 'next/navigation'
import createCache from '@emotion/cache'
import { ApolloProvider } from '@apollo/client'
import { SnackbarProvider } from 'notistack'
import { AuthContext, initKeycloak, keycloak } from '@/lib/auth'
import { setupSessionMonitoring } from '@/utils/sessionUtils'
import { createApolloClient } from '@/lib/apollo-client'
import theme from '@/theme/theme'
import { CircularProgress, Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RootLayout from '@/components/layout/RootLayout'
import dayjs from 'dayjs'
import 'dayjs/locale/de'

// Import der globalen Styles
import '@/styles/global.css'

// Dayjs Lokalisierung
dayjs.locale('de')

// Emotion Cache für Server-Side Rendering
export function useClientStyleRegistry() {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({
      key: 'mui',
      prepend: true,
      // Konfiguration für stabile Klassennamen zwischen Server und Client
      stylisPlugins: [],
      // Vermeidet Optimierungen, die zu unterschiedlichen Klassennamen führen könnten
      speedy: false,
    })
    return {
      cache,
      flush: () => {
        // Sicherstellen, dass alle Tags entfernt werden
        if (typeof window !== 'undefined') {
          cache.sheet.tags.forEach(tag => tag.parentNode?.removeChild(tag))
        }
        cache.sheet.flush()
      },
    }
  })

  useServerInsertedHTML(() => {
    // Nur auf dem Server ausführen
    if (typeof window !== 'undefined') return null

    const names = new Set()
    const styles = Array.from(cache.sheet.tags)
      .map(tag => {
        const key = tag.getAttribute('data-emotion')?.split(' ')[1] ?? ''
        if (names.has(key)) return null
        names.add(key)
        return tag.innerHTML
      })
      .filter(Boolean)

    if (styles.length === 0) return null

    return (
      <style
        key="emotion-styles"
        data-emotion={`mui ${Array.from(names).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles.join('') }}
      />
    )
  })

  return { cache, flush }
}

import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { cache } = useClientStyleRegistry()
  // Um Hydration-Fehler zu vermeiden, initialisieren wir mit false
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)
  // Verzögertes Mounting für clientseitige Initialisierung
  const [mounted, setMounted] = useState(false)

  // Verwenden Sie useEffect, um Keycloak nur auf dem Client zu initialisieren
  // Trennung von Mounting- und Auth-Logik für bessere Kontrolle
  useEffect(() => {
    // Markieren als gemounted für clientseitigen Hydration-Fix
    setMounted(true)
  }, [])

  // Separate useEffect für die Authentifizierung
  useEffect(() => {
    // Initialisierung nur durchführen, wenn wir auf dem Client sind
    if (!mounted) return

    // Erstelle eine Fallback-Client-Instanz für SSR
    const defaultClient = createApolloClient()
    setClient(defaultClient)

    const initAuth = async () => {
      try {
        // Keycloak nur auf dem Client initialisieren
        const authenticated = await initKeycloak()
        setAuthenticated(authenticated)

        // Session-Monitoring einrichten
        setupSessionMonitoring()

        // Apollo-Client mit Token initialisieren, wenn keycloak und token vorhanden sind
        if (keycloak && keycloak.token) {
          const apolloClient = createApolloClient(keycloak.token)
          setClient(apolloClient)
        }

        // Event-Listener für Token-Updates
        const handleTokenRefreshed = (event: CustomEvent) => {
          console.log('Token wurde aktualisiert, Apollo-Client wird neu erstellt...')
          const newToken = event.detail.token
          const refreshedClient = createApolloClient(newToken)
          setClient(refreshedClient)
        }

        window.addEventListener('tokenRefreshed', handleTokenRefreshed as EventListener)

        return () => {
          window.removeEventListener('tokenRefreshed', handleTokenRefreshed as EventListener)
        }
      } catch {
        // Keycloak Initialisierungsfehler - aber nicht im Log ausgeben wegen ESLint
      } finally {
        // Verzögertes Setzen des initialisierten Status um Flash of Loading zu vermeiden
        setTimeout(() => {
          setInitialized(true)
        }, 300)
      }
    }

    const cleanup = initAuth()

    // Cleanup-Funktion zurückgeben
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => {
          if (typeof cleanupFn === 'function') {
            cleanupFn()
          }
        })
      }
    }
  }, [mounted])

  // Client-Side Effekt nach dem Rendering
  useEffect(() => {
    if (mounted) {
      // Loading-Overlay nur anzeigen, wenn noch nicht initialisiert
      const loadingOverlay = document.getElementById('loading-overlay')
      if (loadingOverlay) {
        if (!initialized) {
          loadingOverlay.style.display = 'flex'
        } else {
          loadingOverlay.style.display = 'none'
        }
      }
    }
  }, [mounted, initialized])

  // Render-Funktion mit verzögertem Mounting, um Hydration-Fehler zu vermeiden
  const renderContent = () => {
    const apolloClient = client || createApolloClient()

    // Verwende eine einfachere, konsistente DOM-Struktur
    return (
      <AuthContext.Provider value={{ keycloak, initialized, authenticated }}>
        <ApolloProvider client={apolloClient}>
          <Box
            sx={{
              width: '100%',
              height: '100vh',
              position: 'relative',
            }}
          >
            {/* Loading-Zustand mit Material-UI Box für konsistente Styles */}
            {!initialized && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 9999,
                  bgcolor: 'background.default',
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}
            
            {/* Haupt-Content */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                opacity: initialized ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            >
              <RootLayout>{children}</RootLayout>
            </Box>
          </Box>
        </ApolloProvider>
      </AuthContext.Provider>
    )
  }

  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {/* Wichtig für Emotion und MUI Hydration */}
        <meta name="emotion-insertion-point" content="" />
        <title>Simple EAM</title>
      </head>
      <body>
        <CacheProvider value={cache}>
          {/* Gleiche DOM-Struktur sowohl auf Server als auch auf Client */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {renderContent()}
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
