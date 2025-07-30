import Keycloak from 'keycloak-js'
import { createContext, useContext } from 'react'

// Keycloak-Konfiguration
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'eam-client',
}

/**
 * Keycloak-Instanz für die Authentifizierung (nur clientseitig)
 */
export let keycloak: Keycloak | undefined
let keycloakInitPromise: Promise<boolean> | null = null

/**
 * Initialisiert die Keycloak-Instanz und gibt ein Promise zurück
 * Diese Funktion stellt sicher, dass Keycloak nur einmal initialisiert wird
 */
export const initKeycloak = () => {
  if (typeof window === 'undefined') {
    // Wenn Server-Umgebung, leeres Promise zurückgeben
    return Promise.resolve(false)
  }

  // Wenn die Promise bereits existiert, gib sie zurück
  if (keycloakInitPromise) {
    return keycloakInitPromise
  }

  // Erstelle Keycloak-Instanz, falls noch nicht geschehen
  if (!keycloak) {
    keycloak = new Keycloak(keycloakConfig)
  }

  // Initialisiere Keycloak und speichere die Promise
  keycloakInitPromise = keycloak
    .init({
      onLoad: 'login-required', // Zurück zu 'login-required' für automatische Weiterleitung
      silentCheckSsoRedirectUri:
        typeof window !== 'undefined'
          ? window.location.origin + '/silent-check-sso.html'
          : '/silent-check-sso.html',
      pkceMethod: 'S256',
      // Nach dem Login immer zum Dashboard weiterleiten
      redirectUri:
        typeof window !== 'undefined'
          ? (() => {
              const currentPath = window.location.pathname
              const langMatch = currentPath.match(/^\/([a-z]{2})/)
              const lang = langMatch ? langMatch[1] : 'de'
              return `${window.location.origin}/${lang}`
            })()
          : undefined,
      checkLoginIframe: true, // Silent token refresh aktivieren
      checkLoginIframeInterval: 5, // Alle 5 Sekunden prüfen
      enableLogging: process.env.NODE_ENV === 'development',
    })
    .then(authenticated => {
      if (authenticated && keycloak) {
        // Automatischen Token-Refresh einrichten
        setupTokenRefresh()
        // Letztes Login-Datum aktualisieren
        updateLastLoginDate()
      }
      return authenticated
    })

  return keycloakInitPromise
}

/**
 * Setzt automatischen Token-Refresh auf
 */
const setupTokenRefresh = () => {
  if (!keycloak) return

  // Token-Refresh bei Ablauf
  keycloak.onTokenExpired = () => {
    if (!keycloak) return

    keycloak
      .updateToken(30)
      .then(refreshed => {
        if (refreshed && keycloak) {
          // Event für Token-Update auslösen
          window.dispatchEvent(
            new CustomEvent('tokenRefreshed', {
              detail: { token: keycloak.token },
            })
          )
        }
      })
      .catch(() => {
        console.error('Token-Refresh fehlgeschlagen, Benutzer wird abgemeldet')
        if (keycloak) {
          keycloak.login()
        }
      })
  }

  // Präventiver Token-Refresh alle 5 Minuten
  setInterval(
    () => {
      if (keycloak?.authenticated) {
        keycloak
          .updateToken(70) // Refresh wenn weniger als 70 Sekunden verbleiben
          .then(refreshed => {
            if (refreshed && keycloak) {
              window.dispatchEvent(
                new CustomEvent('tokenRefreshed', {
                  detail: { token: keycloak.token },
                })
              )
            }
          })
          .catch(error => {
            console.error('Präventiver Token-Refresh fehlgeschlagen:', error)
          })
      }
    },
    5 * 60 * 1000
  ) // 5 Minuten

  // Event-Listener für Auth-Fehler
  const handleAuthError = () => {
    if (keycloak?.authenticated) {
      keycloak
        .updateToken(0) // Erzwinge Token-Refresh
        .then(refreshed => {
          if (refreshed && keycloak) {
            window.dispatchEvent(
              new CustomEvent('tokenRefreshed', {
                detail: { token: keycloak.token },
              })
            )
          } else {
            if (keycloak) {
              keycloak.login()
            }
          }
        })
        .catch(() => {
          console.error('Token-Refresh nach Auth-Fehler fehlgeschlagen, leite zu Login weiter')
          if (keycloak) {
            keycloak.login()
          }
        })
    }
  }

  window.addEventListener('authError', handleAuthError)
}

/**
 * Aktualisiert das letzte Login-Datum in den Keycloak-Benutzerattributen
 */
const updateLastLoginDate = async () => {
  if (!keycloak?.authenticated || !keycloak?.token) {
    return
  }

  try {
    const currentTimestamp = new Date().toISOString()

    // API-Aufruf an unsere Next.js Route für die Aktualisierung des Benutzerattributs
    const response = await fetch('/api/auth/update-last-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({
        lastLogin: currentTimestamp,
      }),
    })

    if (response.ok) {
      console.log('🕐 Letztes Login-Datum erfolgreich aktualisiert:', currentTimestamp)
    } else {
      console.warn('⚠️ Fehler beim Aktualisieren des letzten Login-Datums:', response.status)
    }
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren des letzten Login-Datums:', error)
  }
}

/**
 * AuthContext für die Verwendung mit useAuth-Hook
 */
export const AuthContext = createContext<{
  keycloak: Keycloak | undefined
  initialized: boolean
  authenticated?: boolean
}>({
  keycloak: undefined,
  initialized: false,
})

/**
 * Hook für den einfachen Zugriff auf Auth-Daten und -Funktionen
 */
export const useAuth = () => useContext(AuthContext)

/**
 * Funktion zum Logout des Benutzers
 */
export const logout = () => {
  if (typeof window !== 'undefined' && keycloak) {
    keycloak.logout()
  }
}

/**
 * Funktion zum Login des Benutzers
 */
export const login = () => {
  if (typeof window !== 'undefined' && keycloak) {
    // Bestimme die Dashboard-URL basierend auf der aktuellen Sprache
    const currentPath = window.location.pathname
    const langMatch = currentPath.match(/^\/([a-z]{2})/)
    const lang = langMatch ? langMatch[1] : 'de'
    const dashboardUrl = `${window.location.origin}/${lang}`

    keycloak.login({
      redirectUri: dashboardUrl,
    })
  }
}

/**
 * Prüft, ob der Benutzer die angegebene Rolle hat
 */
export const hasRole = (role: string): boolean => {
  if (typeof window !== 'undefined' && keycloak) {
    return keycloak.hasRealmRole(role)
  }
  return false
}

/**
 * Gibt die Benutzerrollen zurück
 */
export const getRoles = (): string[] => {
  if (typeof window !== 'undefined' && keycloak) {
    return keycloak.realmAccess?.roles || []
  }
  return []
}

/**
 * Prüft, ob der Benutzer Admin-Rechte hat
 */
export const isAdmin = (): boolean => {
  return hasRole('admin')
}

/**
 * Prüft, ob der Benutzer Architect-Rechte hat
 */
export const isArchitect = (): boolean => {
  return hasRole('architect') || isAdmin()
}

/**
 * Prüft, ob der Benutzer nur Viewer-Rechte hat
 */
export const isViewer = (): boolean => {
  return hasRole('viewer') && !isArchitect() && !isAdmin()
}

/**
 * Gibt die Keycloak-Instanz zurück
 */
export const getKeycloak = () => {
  return keycloak
}
