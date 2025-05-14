'use client';

import React, { useState, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import { ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import { AuthContext, initKeycloak, keycloak } from '@/lib/auth';
import { createApolloClient } from '@/lib/apollo-client';
import theme from '@/theme/theme';
import { CircularProgress, Box } from '@mui/material';
import RootLayout from '@/components/layout/RootLayout';

// Emotion Cache für Server-Side Rendering
export function useClientStyleRegistry() {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true });
    return {
      cache,
      flush: () => cache.sheet.tags.forEach(tag => tag.parentNode?.removeChild(tag)),
    };
  });

  useServerInsertedHTML(() => {
    const names = new Set();
    const styles = Array.from(cache.sheet.tags)
      .map(tag => {
        const key = tag.getAttribute('data-emotion')?.split(' ')[1] ?? '';
        if (names.has(key)) return null;
        names.add(key);
        return tag.innerHTML;
      })
      .filter(Boolean);

    if (styles.length === 0) return null;

    return (
      <style
        key="emotion-styles"
        data-emotion={`css ${Array.from(names).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles.join('') }}
      />
    );
  });

  return { cache, flush };
}

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { cache } = useClientStyleRegistry();
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);

  // Verwenden Sie useEffect, um Keycloak nur auf dem Client zu initialisieren
  useEffect(() => {
    // Erstelle eine Fallback-Client-Instanz für SSR
    const defaultClient = createApolloClient();
    setClient(defaultClient);

    const initAuth = async () => {
      // Vermeidet Hydration-Probleme, indem Authentifizierung nur clientseitig ausgeführt wird
      if (typeof window === 'undefined') {
        setInitialized(true);
        return;
      }

      try {
        // Keycloak nur auf dem Client initialisieren
        const authenticated = await initKeycloak();
        setAuthenticated(authenticated);

        // Apollo-Client mit Token initialisieren, wenn keycloak und token vorhanden sind
        if (keycloak && keycloak.token) {
          const apolloClient = createApolloClient(keycloak.token);
          setClient(apolloClient);

          // Token-Refresh-Handler
          // Wir verwenden eine lokale Variable für keycloak, um TypeScript-Fehler zu vermeiden
          const kc = keycloak;
          kc.onTokenExpired = () => {
            kc.updateToken(30)
              .then(refreshed => {
                if (refreshed && kc.token) {
                  const newToken = kc.token;
                  const refreshedClient = createApolloClient(newToken);
                  setClient(refreshedClient);
                }
              })
              .catch(() => {
                console.error('Failed to refresh token');
              });
          };
        }
      } catch (error) {
        console.error('Keycloak init error:', error);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Render-Funktion
  const renderContent = () => {
    // Zeige Spinner nur, wenn wir auf dem Client sind und noch initialisieren
    if (typeof window !== 'undefined' && !initialized) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    // Stelle sicher, dass wir immer einen Apollo-Client verwenden, auch wenn Authentifizierung fehlschlägt
    const apolloClient = client || createApolloClient();

    return (
      <AuthContext.Provider value={{ keycloak, initialized, authenticated }}>
        <ApolloProvider client={apolloClient}>
          <RootLayout>{children}</RootLayout>
        </ApolloProvider>
      </AuthContext.Provider>
    );
  };

  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Simple EAM</title>
      </head>
      <body>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {renderContent()}
            </SnackbarProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
