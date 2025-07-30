import { keycloak } from './auth'

// Keycloak Admin API Base URL
const getAdminBaseUrl = () => {
  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'
  return `${keycloakUrl}/admin/realms/${realm}`
}

// Keycloak User Representation
export interface KeycloakUser {
  id?: string
  username: string
  email?: string
  firstName?: string
  lastName?: string
  enabled?: boolean
  emailVerified?: boolean
  attributes?: Record<string, string[]>
  createdTimestamp?: number
  requiredActions?: string[]
  realmRoles?: string[]
  clientRoles?: Record<string, string[]>
}

// Keycloak Role Representation
export interface KeycloakRole {
  id?: string
  name: string
  description?: string
  composite?: boolean
  clientRole?: boolean
  containerId?: string
}

// Error Handling
export class KeycloakAdminError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'KeycloakAdminError'
  }
}

// Base API Call Function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!keycloak?.token) {
    throw new KeycloakAdminError(
      'Kein gültiges Authentifizierungstoken verfügbar. Sind Sie als Administrator angemeldet?'
    )
  }

  if (!keycloak.authenticated) {
    throw new KeycloakAdminError('Benutzer ist nicht authentifiziert')
  }

  const url = `${getAdminBaseUrl()}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keycloak.token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    console.error('Keycloak API Error:', {
      status: response.status,
      statusText: response.statusText,
      url,
      errorText,
    })

    // Spezielle Behandlung für häufige Fehler
    if (response.status === 403) {
      errorMessage = 'Keine Berechtigung für Admin-Zugriff. Prüfen Sie Ihre Rollen in Keycloak.'
    } else if (response.status === 401) {
      errorMessage = 'Authentifizierung fehlgeschlagen. Token möglicherweise abgelaufen.'
    } else {
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.errorMessage) {
          errorMessage = errorJson.errorMessage
        } else if (errorJson.error) {
          errorMessage = errorJson.error
        } else if (errorJson.error_description) {
          errorMessage = errorJson.error_description
        }
      } catch {
        // Fallback to response text
        if (errorText) {
          errorMessage = errorText
        }
      }
    }

    throw new KeycloakAdminError(errorMessage, response.status, errorText)
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text() as unknown as T
}

// User Management Functions

/**
 * Prüft, ob der aktuelle Benutzer Admin-Berechtigung hat
 */
export async function checkAdminAccess(): Promise<{
  hasAccess: boolean
  message: string
  details?: any
}> {
  try {
    if (!keycloak?.token) {
      return {
        hasAccess: false,
        message: 'Kein gültiges Authentifizierungstoken verfügbar',
      }
    }

    if (!keycloak.authenticated) {
      return {
        hasAccess: false,
        message: 'Benutzer ist nicht authentifiziert',
      }
    }

    // Prüfe Token-Details
    const tokenParsed = keycloak.tokenParsed

    // Teste einen einfachen Admin-API-Aufruf
    const response = await fetch(`${getAdminBaseUrl()}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })

    if (response.ok) {
      return {
        hasAccess: true,
        message: 'Admin-Zugriff verfügbar',
      }
    } else {
      const errorText = await response.text()
      return {
        hasAccess: false,
        message: `Admin-Zugriff verweigert (${response.status}): ${response.statusText}`,
        details: {
          status: response.status,
          error: errorText,
          realmRoles: tokenParsed?.realm_access?.roles,
          resourceAccess: tokenParsed?.resource_access,
        },
      }
    }
  } catch (error) {
    return {
      hasAccess: false,
      message: `Fehler bei Admin-Zugriffsprüfung: ${error}`,
      details: error,
    }
  }
}
export async function getUsers(): Promise<KeycloakUser[]> {
  try {
    const users = await apiCall<KeycloakUser[]>('/users?briefRepresentation=false')

    // Für jeden Benutzer die Rollen laden
    const usersWithRoles = await Promise.all(
      users.map(async user => {
        if (user.id) {
          try {
            const realmRoles = await getUserRealmRoles(user.id)
            return {
              ...user,
              realmRoles: realmRoles.map((role: KeycloakRole) => role.name),
            }
          } catch (error) {
            console.warn(`Fehler beim Laden der Rollen für Benutzer ${user.username}:`, error)
            return user
          }
        }
        return user
      })
    )

    return usersWithRoles
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error)
    throw error
  }
}

/**
 * Holt einen spezifischen Benutzer anhand der ID
 */
export async function getUser(userId: string): Promise<KeycloakUser> {
  return apiCall<KeycloakUser>(`/users/${userId}`)
}

/**
 * Erstellt einen neuen Benutzer in Keycloak
 */
export async function createUser(user: Omit<KeycloakUser, 'id'>): Promise<void> {
  const userData = {
    ...user,
    enabled: user.enabled ?? true,
    emailVerified: user.emailVerified ?? false,
  }

  return apiCall<void>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

/**
 * Aktualisiert einen bestehenden Benutzer in Keycloak
 */
export async function updateUser(userId: string, user: Partial<KeycloakUser>): Promise<void> {
  return apiCall<void>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  })
}

/**
 * Löscht einen Benutzer aus Keycloak
 */
export async function deleteUser(userId: string): Promise<void> {
  return apiCall<void>(`/users/${userId}`, {
    method: 'DELETE',
  })
}

/**
 * Setzt das Passwort für einen Benutzer
 */
export async function setUserPassword(
  userId: string,
  password: string,
  temporary: boolean = false
): Promise<void> {
  const credentialData = {
    type: 'password',
    value: password,
    temporary,
  }

  return apiCall<void>(`/users/${userId}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify(credentialData),
  })
}

/**
 * Holt die Realm-Rollen eines Benutzers
 */
export async function getUserRealmRoles(userId: string): Promise<KeycloakRole[]> {
  return apiCall<KeycloakRole[]>(`/users/${userId}/role-mappings/realm`)
}

/**
 * Holt alle verfügbaren Realm-Rollen
 */
export async function getRealmRoles(): Promise<KeycloakRole[]> {
  return apiCall<KeycloakRole[]>('/roles')
}

/**
 * Sendet eine E-Mail zur Passwort-Zurücksetzung
 */
export async function sendResetPasswordEmail(userId: string): Promise<void> {
  return apiCall<void>(`/users/${userId}/execute-actions-email`, {
    method: 'PUT',
    body: JSON.stringify(['UPDATE_PASSWORD']),
  })
}

/**
 * Sendet eine E-Mail zur E-Mail-Verifizierung
 */
export async function sendVerificationEmail(userId: string): Promise<void> {
  return apiCall<void>(`/users/${userId}/send-verify-email`, {
    method: 'PUT',
  })
}

/**
 * Aktiviert/Deaktiviert einen Benutzer
 */
export async function setUserEnabled(userId: string, enabled: boolean): Promise<void> {
  return updateUser(userId, { enabled })
}

/**
 * Sucht Benutzer anhand von Kriterien
 */
export async function searchUsers(params: {
  search?: string
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  max?: number
}): Promise<KeycloakUser[]> {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString())
    }
  })

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/users?${queryString}` : '/users'

  return apiCall<KeycloakUser[]>(endpoint)
}
