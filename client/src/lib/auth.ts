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
  keycloakInitPromise = keycloak.init({
    onLoad: 'login-required', // Geändert von 'check-sso' zu 'login-required'
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
    redirectUri: window.location.origin,
    checkLoginIframe: false,
  })

  return keycloakInitPromise
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
