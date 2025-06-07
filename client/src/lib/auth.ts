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
      // redirectUri entfernt - Keycloak verwendet dann automatisch die aktuelle URL
      checkLoginIframe: true, // Silent token refresh aktivieren
      checkLoginIframeInterval: 5, // Alle 5 Sekunden prüfen
      enableLogging: process.env.NODE_ENV === 'development',
    })
    .then(authenticated => {
      if (authenticated && keycloak) {
        // Automatischen Token-Refresh einrichten
        setupTokenRefresh()
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
    console.log('Token abgelaufen, versuche Refresh...')
    if (!keycloak) return

    keycloak
      .updateToken(30)
      .then(refreshed => {
        if (refreshed && keycloak) {
          console.log('Token erfolgreich aktualisiert')
          // Event für Token-Update auslösen
          window.dispatchEvent(
            new CustomEvent('tokenRefreshed', {
              detail: { token: keycloak.token },
            })
          )
        } else {
          console.log('Token noch gültig')
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
              console.log('Token präventiv aktualisiert')
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
    console.log('Auth-Fehler erkannt, versuche Token-Refresh...')
    if (keycloak?.authenticated) {
      keycloak
        .updateToken(0) // Erzwinge Token-Refresh
        .then(refreshed => {
          if (refreshed && keycloak) {
            console.log('Token nach Auth-Fehler aktualisiert')
            window.dispatchEvent(
              new CustomEvent('tokenRefreshed', {
                detail: { token: keycloak.token },
              })
            )
          } else {
            console.log('Token-Refresh nach Auth-Fehler fehlgeschlagen, leite zu Login weiter')
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
    keycloak.login()
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
