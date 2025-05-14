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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { cache } = useClientStyleRegistry();
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authenticated = await initKeycloak();
        setAuthenticated(authenticated);

        // Apollo-Client mit Token initialisieren
        if (keycloak?.token) {
          const apolloClient = createApolloClient(keycloak.token);
          setClient(apolloClient);

          // Token-Refresh-Handler
          keycloak.onTokenExpired = () => {
            keycloak
              .updateToken(30)
              .then(refreshed => {
                if (refreshed && keycloak.token) {
                  const newToken = keycloak.token;
                  const refreshedClient = createApolloClient(newToken);
                  setClient(refreshedClient);
                }
              })
              .catch(() => {
                console.error('Failed to refresh token');
              });
          };
        } else {
          // Fallback für Client ohne Auth-Token
          const apolloClient = createApolloClient();
          setClient(apolloClient);
        }
      } catch (error) {
        console.error('Keycloak init error:', error);
        // Fallback für Client bei Auth-Fehler
        const apolloClient = createApolloClient();
        setClient(apolloClient);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Render-Funktion
  const renderContent = () => {
    if (!initialized) {
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

    if (!client) {
      return null;
    }

    return (
      <AuthContext.Provider value={{ keycloak, initialized, authenticated }}>
        <ApolloProvider client={client}>
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
