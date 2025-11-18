// Alternative Admin API via Keycloak Admin Credentials
const getAdminToken = async (): Promise<string> => {
  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'

  const response = await fetch(`${keycloakUrl}/realms/master/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: process.env.KEYCLOAK_ADMIN || 'admin',
      password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
    }),
  })

  if (!response.ok) {
    throw new Error(`Admin Token Request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

// Admin API Call mit Admin Token
async function adminApiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'

  const adminToken = await getAdminToken()
  const url = `${keycloakUrl}/admin/realms/${realm}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Admin API Error:', {
      status: response.status,
      statusText: response.statusText,
      url,
      errorText,
    })

    throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text() as unknown as T
}

// Keycloak User Interface (simplified)
export interface KeycloakUserAlt {
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
}

export interface KeycloakRole {
  id?: string
  name: string
  description?: string
  composite?: boolean
  clientRole?: boolean
  containerId?: string
}

// Admin API Funktionen mit Admin Token
export async function getUsersViaAdmin(): Promise<KeycloakUserAlt[]> {
  try {
    const users = await adminApiCall<KeycloakUserAlt[]>('/users?briefRepresentation=false')

    // Load roles for each user
    const usersWithRoles = await Promise.all(
      users.map(async user => {
        if (user.id) {
          try {
            const realmRoles = await getUserRealmRolesViaAdmin(user.id)
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
    console.error('Fehler beim Laden der Benutzer via Admin:', error)
    throw error
  }
}

export async function getUserRealmRolesViaAdmin(userId: string): Promise<KeycloakRole[]> {
  return adminApiCall<KeycloakRole[]>(`/users/${userId}/role-mappings/realm`)
}

export async function createUserViaAdmin(user: Omit<KeycloakUserAlt, 'id'>): Promise<void> {
  const userData = {
    ...user,
    enabled: user.enabled ?? true,
    emailVerified: user.emailVerified ?? false,
  }

  return adminApiCall<void>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function updateUserViaAdmin(
  userId: string,
  user: Partial<KeycloakUserAlt>
): Promise<void> {
  return adminApiCall<void>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  })
}

export async function deleteUserViaAdmin(userId: string): Promise<void> {
  return adminApiCall<void>(`/users/${userId}`, {
    method: 'DELETE',
  })
}

export async function setUserPasswordViaAdmin(
  userId: string,
  password: string,
  temporary: boolean = false
): Promise<void> {
  const credentialData = {
    type: 'password',
    value: password,
    temporary,
  }

  return adminApiCall<void>(`/users/${userId}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify(credentialData),
  })
}
