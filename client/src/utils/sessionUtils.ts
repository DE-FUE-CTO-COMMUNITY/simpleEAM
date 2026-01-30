/**
 * Session-Utilities für bessere Token-Verwaltung und Fehlerbehandlung
 */

import { keycloak } from '../lib/auth'

/**
 * Prüft, ob der aktuelle Token gültig ist
 */
export const isTokenValid = (): boolean => {
  if (!keycloak?.token) {
    return false
  }

  try {
    const tokenPayload = JSON.parse(atob(keycloak.token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)

    // Check expiration time with 30 second buffer
    return tokenPayload.exp > currentTime + 30
  } catch (error) {
    console.error('Fehler beim Parsen des Tokens:', error)
    return false
  }
}

/**
 * Versucht Token-Refresh und gibt neuen Token zurück
 */
export const refreshToken = async (): Promise<string | null> => {
  if (!keycloak?.authenticated) {
    return null
  }

  try {
    const refreshed = await keycloak.updateToken(30)
    if (refreshed && keycloak.token) {
      return keycloak.token
    } else {
      return keycloak.token || null
    }
  } catch (error) {
    console.error('Token-Refresh fehlgeschlagen:', error)
    return null
  }
}

/**
 * Führt eine sichere API-Anfrage mit automatischem Token-Refresh durch
 */
export const secureApiCall = async <T>(apiCall: (token: string) => Promise<T>): Promise<T> => {
  if (!keycloak?.token) {
    throw new Error('Nicht authentifiziert')
  }

  // Prüfe Token-Gültigkeit
  if (!isTokenValid()) {
    const newToken = await refreshToken()
    if (!newToken) {
      throw new Error('Token-Refresh fehlgeschlagen')
    }
  }

  try {
    return await apiCall(keycloak.token!)
  } catch (error: any) {
    // On auth errors try token refresh and retry request
    if (
      error.message?.includes('unauthenticated') ||
      error.status === 401 ||
      error.status === 403
    ) {
      const newToken = await refreshToken()
      if (!newToken) {
        throw new Error('Token-Refresh nach Auth-Fehler fehlgeschlagen')
      }

      // Retry request with new token
      return await apiCall(newToken)
    }

    // Andere Fehler weiterwerfen
    throw error
  }
}

/**
 * Überwacht Session-Status und führt automatische Aktionen durch
 */
export const setupSessionMonitoring = () => {
  if (typeof window === 'undefined') return

  // Überwache Page Visibility für Token-Refresh bei Tab-Wechsel
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && keycloak?.authenticated) {
      // When tab becomes active again, check token validity
      if (!isTokenValid()) {
        refreshToken().then(newToken => {
          if (newToken) {
            window.dispatchEvent(
              new CustomEvent('tokenRefreshed', {
                detail: { token: newToken },
              })
            )
          }
        })
      }
    }
  })

  // Überwache Online-Status
  window.addEventListener('online', () => {
    if (keycloak?.authenticated) {
      refreshToken().then(newToken => {
        if (newToken) {
          window.dispatchEvent(
            new CustomEvent('tokenRefreshed', {
              detail: { token: newToken },
            })
          )
        }
      })
    }
  })

  // Überwache Storage-Events für SSO-Logout
  window.addEventListener('storage', event => {
    if (event.key === 'kc-logout' && event.newValue) {
      if (keycloak) {
        keycloak.logout()
      }
    }
  })
}

/**
 * Helper function for Token-Info
 */
export const getTokenInfo = () => {
  if (!keycloak?.token) {
    return null
  }

  try {
    const tokenPayload = JSON.parse(atob(keycloak.token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)

    return {
      isValid: tokenPayload.exp > currentTime,
      expiresAt: new Date(tokenPayload.exp * 1000),
      timeToExpiry: tokenPayload.exp - currentTime,
      user: tokenPayload.preferred_username || tokenPayload.sub,
      roles: tokenPayload.realm_access?.roles || [],
    }
  } catch (error) {
    console.error('Fehler beim Parsen des Tokens:', error)
    return null
  }
}
