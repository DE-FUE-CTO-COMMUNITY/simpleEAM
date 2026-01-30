import Keycloak from 'keycloak-js'
import { createContext, useContext } from 'react'

/**
 * LocalStorage key for login status
 */
const LOGIN_STATUS_KEY = 'user_logged_in'
const LAST_LOGIN_SESSION_KEY = 'last_login_session'

/**
 * Markiert den Benutzer als eingeloggt mit Session-Timestamp
 */
const setUserLoggedIn = () => {
  if (typeof window !== 'undefined') {
    const sessionTimestamp = Date.now().toString()
    localStorage.setItem(LOGIN_STATUS_KEY, 'true')
    localStorage.setItem(LAST_LOGIN_SESSION_KEY, sessionTimestamp)
  }
}

/**
 * Checks if previous session is too old (for real new logins)
 */
const checkForOldSession = (): boolean => {
  if (typeof window !== 'undefined') {
    const lastSessionTimestamp = localStorage.getItem(LAST_LOGIN_SESSION_KEY)

    // If no timestamp exists, then new login
    if (!lastSessionTimestamp) {
      return true
    }

    // Check if last session is VERY old (more than 24 hours)
    const sessionAge = Date.now() - parseInt(lastSessionTimestamp, 10)
    const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

    return sessionAge > twentyFourHours
  }
  return true
}

/**
 * Entfernt den Login-Status (bei Logout)
 */
const clearLoginStatus = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGIN_STATUS_KEY)
    localStorage.removeItem(LAST_LOGIN_SESSION_KEY)
  }
}

// Keycloak configuration - will be populated from runtime config
let keycloakConfig: {
  url: string
  realm: string
  clientId: string
} | null = null

/**
 * Fetch Keycloak configuration from runtime config
 */
async function fetchKeycloakConfig() {
  if (keycloakConfig) {
    return keycloakConfig
  }

  try {
    const response = await fetch('/api/runtime-config')
    if (response.ok) {
      const config = await response.json()
      keycloakConfig = config.keycloak
      return keycloakConfig
    }
  } catch (error) {
    console.error('Failed to fetch runtime config for Keycloak:', error)
  }

  // Fallback to defaults
  keycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'simple-eam',
    clientId: 'eam-client',
  }
  return keycloakConfig
}

/**
 * Keycloak instance for authentication (client-side only)
 */
export let keycloak: Keycloak | undefined
let keycloakInitPromise: Promise<boolean> | null = null

/**
 * Initializes Keycloak instance and returns a Promise
 * Diese Funktion stellt sicher, dass Keycloak nur einmal initialisiert wird
 */
export const initKeycloak = async () => {
  if (typeof window === 'undefined') {
    // If server environment, return empty promise
    return Promise.resolve(false)
  }

  // If promise already exists, return it
  if (keycloakInitPromise) {
    return keycloakInitPromise
  }

  // Fetch Keycloak configuration from runtime config
  const config = await fetchKeycloakConfig()

  // Erstelle Keycloak-Instanz, falls noch nicht geschehen
  if (!keycloak && config) {
    keycloak = new Keycloak(config)
  }

  // Guard: If keycloak could not be initialized, return false
  if (!keycloak) {
    console.error('Failed to initialize Keycloak instance')
    return Promise.resolve(false)
  }

  // Initialisiere Keycloak und speichere die Promise
  keycloakInitPromise = keycloak
    .init({
      onLoad: 'login-required',
      silentCheckSsoRedirectUri:
        typeof window !== 'undefined'
          ? window.location.origin + '/silent-check-sso.html'
          : '/silent-check-sso.html',
      pkceMethod: 'S256',
      // NO automatic redirectUri here - this always causes redirects
      checkLoginIframe: true,
      checkLoginIframeInterval: 5,
      enableLogging: process.env.NODE_ENV === 'development',
    })
    .then(authenticated => {
      if (authenticated && keycloak) {
        // Set up automatic token refresh
        setupTokenRefresh()

        // IMPORTANT: Set session status FIRST, BEFORE checking if it is a new login
        const wasAlreadyLoggedIn = localStorage.getItem(LOGIN_STATUS_KEY) === 'true'

        // Always set session status (for page refreshes)
        setUserLoggedIn()

        // Check if it was a REAL new login (based on previous status)
        const isNewLogin = !wasAlreadyLoggedIn || checkForOldSession()

        if (isNewLogin) {
          // Only update LastLogin date on real new login
          updateLastLoginDate()

          // Redirect to dashboard
          const currentPath = window.location.pathname
          const langMatch = currentPath.match(/^\/([a-z]{2})/)
          const lang = langMatch ? langMatch[1] : 'de'
          const dashboardUrl = `/${lang}`

          if (window.location.pathname !== dashboardUrl) {
            window.location.href = dashboardUrl
          }
        }
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
          // Trigger event for token update
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

  // Preventive token refresh every 5 minutes
  setInterval(
    () => {
      if (keycloak?.authenticated) {
        keycloak
          .updateToken(70) // Refresh if less than 70 seconds remaining
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
            console.error('Preventive token refresh failed:', error)
          })
      }
    },
    5 * 60 * 1000
  ) // 5 Minuten

  // Event listener for auth errors
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

// Debounce mechanism for updateLastLoginDate
let lastLoginUpdateInProgress = false

/**
 * Aktualisiert das letzte Login-Datum in den Keycloak-Benutzerattributen
 * (Race-Condition und Doppelaufruf-sicher)
 */
const updateLastLoginDate = async () => {
  if (!keycloak?.authenticated || !keycloak?.token) {
    return
  }

  // Schutz vor gleichzeitigen Aufrufen
  if (lastLoginUpdateInProgress) {
    return
  }

  lastLoginUpdateInProgress = true

  try {
    const currentTimestamp = new Date().toISOString()

    // API call to our Next.js route for updating user attribute
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

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ LastLogin Update fehlgeschlagen:', errorData)
    }
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren des letzten Login-Datums:', error)
  } finally {
    // Reset flag after completion
    lastLoginUpdateInProgress = false
  }
}

/**
 * Sets company_ids of logged-in user via Keycloak Admin API through our Next.js route.
 * Achtung: Wird NICHT automatisch aufgerufen, nur explizit vom Aufrufer verwenden.
 */
export const updateCompanyIdsFromClient = async (companyIds: string[]) => {
  if (!keycloak?.authenticated || !keycloak?.token) {
    throw new Error('Not authenticated')
  }
  if (!Array.isArray(companyIds)) {
    throw new Error('companyIds must be an array')
  }
  await fetch('/api/auth/update-company-ids', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keycloak.token}`,
    },
    body: JSON.stringify({ companyIds }),
  })
}

/**
 * AuthContext for use with useAuth hook
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
 * Hook for easy access to auth data and functions
 */
export const useAuth = () => useContext(AuthContext)

/**
 * Funktion zum Logout des Benutzers
 */
export const logout = () => {
  if (typeof window !== 'undefined' && keycloak) {
    // Clean up login status on logout
    clearLoginStatus()
    keycloak.logout()
  }
}

/**
 * Funktion zum Login des Benutzers
 */
export const login = () => {
  if (typeof window !== 'undefined' && keycloak) {
    // DO NOT set flag here - that happens only after successful login

    // Determine dashboard URL based on current language
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
 * Checks if user has the specified role
 */
export const hasRole = (role: string): boolean => {
  if (typeof window !== 'undefined' && keycloak) {
    return keycloak.hasRealmRole(role)
  }
  return false
}

/**
 * Returns user roles
 */
export const getRoles = (): string[] => {
  if (typeof window !== 'undefined' && keycloak) {
    return keycloak.realmAccess?.roles || []
  }
  return []
}

/**
 * Checks if user has admin rights
 */
export const isAdmin = (): boolean => {
  return hasRole('admin')
}

/**
 * Checks if user has architect rights
 */
export const isArchitect = (): boolean => {
  return hasRole('architect') || isAdmin()
}

/**
 * Checks if user has only viewer rights
 */
export const isViewer = (): boolean => {
  return hasRole('viewer') && !isArchitect() && !isAdmin()
}

/**
 * Returns Keycloak instance
 */
export const getKeycloak = () => {
  return keycloak
}
