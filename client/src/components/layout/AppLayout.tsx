'use client'

import React, { useState, useEffect } from 'react'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { useServerInsertedHTML } from 'next/navigation'
import createCache from '@emotion/cache'
import { ApolloProvider } from '@apollo/client'
import { SnackbarProvider } from 'notistack'
import { AuthContext, initKeycloak, keycloak } from '@/lib/auth'
import { setupSessionMonitoring } from '@/utils/sessionUtils'
import { createApolloClient } from '@/lib/apollo-client'
import ThemeProvider from '@/contexts/ThemeContext'
import { CircularProgress, Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RootLayout from '@/components/layout/RootLayout'
import { useLocale } from 'next-intl'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/en'

// Import der globalen Styles
import '@/styles/global.css'

// Emotion Cache für Server-Side Rendering mit besserer Hydration-Kompatibilität
let clientSideCache: ReturnType<typeof createCache> | null = null

function useClientStyleRegistry() {
  const [cache] = useState(() => {
    // Cache nur einmal erstellen und wiederverwenden
    if (typeof window !== 'undefined' && clientSideCache) {
      return clientSideCache
    }

    const newCache = createCache({
      key: 'mui',
      prepend: true,
      // Stabile Konfiguration für Server und Client
      speedy: process.env.NODE_ENV === 'production',
    })

    if (typeof window !== 'undefined') {
      clientSideCache = newCache
    }

    return newCache
  })

  useServerInsertedHTML(() => {
    // Nur auf dem Server styles einfügen
    if (typeof window !== 'undefined') return null

    const names = cache.inserted
    if (!names || Object.keys(names).length === 0) return null

    let styles = ''
    let dataEmotionAttribute = cache.key

    Object.keys(names).forEach(name => {
      const serialized = names[name]
      if (serialized !== true) {
        styles += serialized
        dataEmotionAttribute += ` ${name}`
      }
    })

    return (
      <style
        key={cache.key}
        data-emotion={dataEmotionAttribute}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return { cache }
}

import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const { cache } = useClientStyleRegistry()

  // Dayjs Lokalisierung basierend auf der aktuellen Sprache
  useEffect(() => {
    dayjs.locale(locale === 'en' ? 'en' : 'de')
  }, [locale])

  // Vereinfachte State-Verwaltung für bessere Hydration
  const [mounted, setMounted] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)

  // Client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Authentication und Apollo Client Initialisierung
  useEffect(() => {
    if (!mounted) return

    const initializeApp = async () => {
      try {
        // Keycloak Initialisierung zuerst
        const isAuthenticated = await initKeycloak()
        setAuthenticated(isAuthenticated)

        // Session Monitoring
        setupSessionMonitoring()

        // Apollo Client mit dynamischem Token erstellen (einmalig)
        const apolloClient = createApolloClient(keycloak?.token)
        setClient(apolloClient)

        // Token Refresh Listener - aktualisiere nur den Token, nicht den ganzen Client
        const handleTokenRefresh = (_event: CustomEvent) => {
          // Der Apollo Client wird so konfiguriert, dass er das aktuelle Token
          // aus der Keycloak-Instanz holt, daher keine weitere Aktion nötig
        }

        // Auth Error Listener - erstelle Client ohne Token
        const handleAuthError = () => {
          const unauthenticatedClient = createApolloClient()
          setClient(unauthenticatedClient)
        }

        window.addEventListener('tokenRefreshed', handleTokenRefresh as EventListener)
        window.addEventListener('authError', handleAuthError as EventListener)

        return () => {
          window.removeEventListener('tokenRefreshed', handleTokenRefresh as EventListener)
          window.removeEventListener('authError', handleAuthError as EventListener)
        }
      } catch (error) {
        console.warn('Authentication initialization failed:', error)
      } finally {
        setInitialized(true)
      }
    }

    const cleanup = initializeApp()
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn?.())
      }
    }
  }, [mounted])

  // Verhindere Hydration-Fehler durch einheitliche Server/Client Struktur
  if (!mounted) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  // Warte auf die Apollo Client Initialisierung, bevor Komponenten gerendert werden
  if (!client) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <div>Initializing...</div>
      </div>
    )
  }

  const apolloClient = client

  return (
    <CacheProvider value={cache}>
      <ThemeProvider>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={locale === 'en' ? 'en' : 'de'}
        >
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <AuthContext.Provider value={{ keycloak, initialized, authenticated }}>
              <ApolloProvider client={apolloClient}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100vh',
                    position: 'relative',
                  }}
                >
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

                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      opacity: initialized ? 1 : 0.3,
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                  >
                    <RootLayout>{children}</RootLayout>
                  </Box>
                </Box>
              </ApolloProvider>
            </AuthContext.Provider>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
