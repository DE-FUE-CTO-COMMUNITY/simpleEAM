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
import { createApolloClient } from '@/lib/apollo-client'
import theme from '@/theme/theme'
import { CircularProgress } from '@mui/material'
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

        // Apollo-Client mit Token initialisieren, wenn keycloak und token vorhanden sind
        if (keycloak && keycloak.token) {
          const apolloClient = createApolloClient(keycloak.token)
          setClient(apolloClient)

          // Token-Refresh-Handler
          const kc = keycloak
          kc.onTokenExpired = () => {
            kc.updateToken(30)
              .then(refreshed => {
                if (refreshed && kc.token) {
                  const newToken = kc.token
                  const refreshedClient = createApolloClient(newToken)
                  setClient(refreshedClient)
                }
              })
              .catch(() => {
                // Error bei Token-Refresh aufgetreten - aber nicht im Log ausgeben wegen ESLint
              })
          }
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

    initAuth()
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

    return (
      <>
        {/* Loading-Zustand: Konsistente Struktur für Server und Client */}
        <div
          style={{
            display: 'none', // Initial IMMER verstecken für SSR, wird nur client-seitig aktualisiert
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            background: 'white',
          }}
          id="loading-overlay"
        >
          <CircularProgress size={40} />
        </div>

        {/* Haupt-Content: Immer konsistente Struktur */}
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          id="main-content"
        >
          <AuthContext.Provider value={{ keycloak, initialized, authenticated }}>
            <ApolloProvider client={apolloClient}>
              <RootLayout>{children}</RootLayout>
            </ApolloProvider>
          </AuthContext.Provider>
        </div>
      </>
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
