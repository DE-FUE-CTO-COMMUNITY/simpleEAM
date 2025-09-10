import Keycloak from 'keycloak-js'
import { createContext, useContext } from 'react'

/**
 * LocalStorage-Schlüssel für Login-Status
 */
const LOGIN_STATUS_KEY = 'user_logged_in'

/**
 * Markiert den Benutzer als eingeloggt
 */
const setUserLoggedIn = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOGIN_STATUS_KEY, 'true')
  }
}

/**
 * Prüft, ob der Benutzer neu eingeloggt ist
 */
const checkForNewLogin = (): boolean => {
  console.log('🔍 DEBUG: checkForNewLogin() aufgerufen')
  
  if (typeof window !== 'undefined') {
    const wasLoggedIn = localStorage.getItem(LOGIN_STATUS_KEY) === 'true'
    console.log('📱 DEBUG: localStorage Check:')
    console.log('  - LOGIN_STATUS_KEY:', LOGIN_STATUS_KEY)
    console.log('  - localStorage Wert:', localStorage.getItem(LOGIN_STATUS_KEY))
    console.log('  - wasLoggedIn:', wasLoggedIn)
    
    if (!wasLoggedIn) {
      // Noch nicht als eingeloggt markiert = neuer Login
      console.log('✅ DEBUG: Neuer Login erkannt!')
      return true
    }
    console.log('ℹ️ DEBUG: Bereits eingeloggt (kein neuer Login)')
    return false
  }
  console.log('❌ DEBUG: window nicht verfügbar (SSR)')
  return false
}

/**
 * Debug-Funktion: Cleart den Login-Status und simuliert einen neuen Login
 * Zur Verwendung in der Browser-Konsole: window.debugLastLogin()
 */
const debugLastLogin = () => {
  console.log('🔧 DEBUG: Login-Status wird zurückgesetzt...')
  clearLoginStatus()
  console.log('🔧 DEBUG: localStorage nach Clear:', localStorage.getItem(LOGIN_STATUS_KEY))
  
  if (keycloak?.authenticated) {
    console.log('🔧 DEBUG: Simuliere neuen Login...')
    setUserLoggedIn()
    updateLastLoginDate()
  } else {
    console.log('❌ DEBUG: Keycloak nicht authentifiziert')
  }
}

// Debug-Funktion global verfügbar machen (nur in Development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugLastLogin = debugLastLogin
  ;(window as any).checkLoginStatus = () => {
    console.log('🔍 DEBUG: Aktueller Login-Status')
    console.log('  - localStorage:', localStorage.getItem(LOGIN_STATUS_KEY))
    console.log('  - Keycloak authenticated:', keycloak?.authenticated)
    console.log('  - Token vorhanden:', !!keycloak?.token)
    console.log('  - User Email:', keycloak?.tokenParsed?.email)
    console.log('  - User ID:', keycloak?.tokenParsed?.sub)
  }
}

/**
 * Entfernt den Login-Status (bei Logout)
 */
const clearLoginStatus = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGIN_STATUS_KEY)
  }
}

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
      onLoad: 'login-required',
      silentCheckSsoRedirectUri:
        typeof window !== 'undefined'
          ? window.location.origin + '/silent-check-sso.html'
          : '/silent-check-sso.html',
      pkceMethod: 'S256',
      // KEINE automatische redirectUri hier - das verursacht immer Redirects
      checkLoginIframe: true,
      checkLoginIframeInterval: 5,
      enableLogging: process.env.NODE_ENV === 'development',
    })
    .then(authenticated => {
      console.log('🔍 DEBUG: Keycloak initialisiert - authenticated:', authenticated)
      
      if (authenticated && keycloak) {
        console.log('🔑 DEBUG: Benutzer ist authentifiziert')
        console.log('  - Token vorhanden:', !!keycloak.token)
        console.log('  - User ID (sub):', keycloak.tokenParsed?.sub)
        console.log('  - Email:', keycloak.tokenParsed?.email)
        
        // Automatischen Token-Refresh einrichten
        setupTokenRefresh()

        // Prüfen, ob es ein neuer Login war
        const isNewLogin = checkForNewLogin()
        console.log('🔍 DEBUG: isNewLogin Ergebnis:', isNewLogin)

        if (isNewLogin) {
          console.log('🚀 DEBUG: Neuer Login verarbeitung startet...')
          // JETZT erst als eingeloggt markieren (nach dem ersten Check)
          setUserLoggedIn()
          console.log('📱 DEBUG: Login-Status gesetzt')
          
          updateLastLoginDate()
          console.log('⏰ DEBUG: updateLastLoginDate() aufgerufen')

          // Zum Dashboard weiterleiten
          const currentPath = window.location.pathname
          const langMatch = currentPath.match(/^\/([a-z]{2})/)
          const lang = langMatch ? langMatch[1] : 'de'
          const dashboardUrl = `/${lang}`

          if (window.location.pathname !== dashboardUrl) {
            console.log('🔄 DEBUG: Weiterleitung zum Dashboard:', dashboardUrl)
            window.location.href = dashboardUrl
          }
        } else {
          console.log('ℹ️ DEBUG: Kein neuer Login - updateLastLoginDate wird NICHT aufgerufen')
        }
      } else {
        console.log('❌ DEBUG: Benutzer ist NICHT authentifiziert')
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
  console.log('🔍 DEBUG: updateLastLoginDate() aufgerufen')
  
  if (!keycloak?.authenticated || !keycloak?.token) {
    console.log('❌ DEBUG: Keycloak nicht authentifiziert oder kein Token')
    console.log('  - authenticated:', keycloak?.authenticated)
    console.log('  - token vorhanden:', !!keycloak?.token)
    return
  }

  try {
    const currentTimestamp = new Date().toISOString()
    console.log('📅 DEBUG: Sende lastLogin Update:', currentTimestamp)

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

    console.log('📡 DEBUG: API Response Status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ DEBUG: API Response Error:', errorData)
    } else {
      const responseData = await response.json()
      console.log('✅ DEBUG: API Response Success:', responseData)
    }
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren des letzten Login-Datums:', error)
  }
}

/**
 * Setzt die company_ids des eingeloggten Benutzers via Keycloak Admin API über unsere Next.js Route.
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
    // Login-Status bereinigen beim Logout
    clearLoginStatus()
    keycloak.logout()
  }
}

/**
 * Funktion zum Login des Benutzers
 */
export const login = () => {
  if (typeof window !== 'undefined' && keycloak) {
    // KEIN Flag setzen hier - das passiert erst nach erfolgreichem Login

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
