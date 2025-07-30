import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthResult } from '../../../../lib/auth-middleware'

// Verfügbare Rollen im System
const AVAILABLE_ROLES = ['viewer', 'architect', 'admin']

// API Route für Keycloak Admin Operationen
export const GET = withAuth(async (request: NextRequest, _authResult: AuthResult) => {
  const { searchParams } = new URL(request.url)
  const getRoles = searchParams.get('getRoles') === 'true'

  // Wenn nur Rollen angefragt werden
  if (getRoles) {
    return NextResponse.json({ roles: AVAILABLE_ROLES })
  }
  try {
    // Admin Token holen
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'

    const tokenResponse = await fetch(
      `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
      {
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
      }
    )

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return NextResponse.json(
        {
          error: `Admin Token Request failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
          details: errorText,
        },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const adminToken = tokenData.access_token

    // Benutzer laden
    const usersResponse = await fetch(
      `${keycloakUrl}/admin/realms/${realm}/users?briefRepresentation=false`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text()
      return NextResponse.json(
        {
          error: `Users Request failed: ${usersResponse.status} ${usersResponse.statusText}`,
          details: errorText,
        },
        { status: usersResponse.status }
      )
    }

    const users = await usersResponse.json()

    // Für jeden Benutzer die Rollen laden
    const usersWithRoles = await Promise.all(
      users.map(async (user: any) => {
        if (user.id) {
          try {
            const rolesResponse = await fetch(
              `${keycloakUrl}/admin/realms/${realm}/users/${user.id}/role-mappings/realm`,
              {
                headers: {
                  Authorization: `Bearer ${adminToken}`,
                  'Content-Type': 'application/json',
                },
              }
            )

            if (rolesResponse.ok) {
              const roles = await rolesResponse.json()
              return {
                ...user,
                realmRoles: roles.map((role: any) => role.name),
              }
            }
          } catch (error) {
            console.warn(`Fehler beim Laden der Rollen für Benutzer ${user.username}:`, error)
          }
        }
        return user
      })
    )

    return NextResponse.json(usersWithRoles)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}, true) // true = requireAdmin

export const POST = withAuth(async (request: NextRequest, _authResult: AuthResult) => {
  try {
    const body = await request.json()
    const { action, userId, userData } = body

    // Rolle aus userData extrahieren und entfernen (nur bei create/update)
    let role = null
    let keycloakUserData = userData

    if (userData && (action === 'create' || action === 'update')) {
      const extracted = userData
      role = extracted.role
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role: _, ...restData } = extracted
      keycloakUserData = restData
    }

    // Admin Token holen
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'simple-eam'

    const tokenResponse = await fetch(
      `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
      {
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
      }
    )

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return NextResponse.json(
        {
          error: `Admin Token Request failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
          details: errorText,
        },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const adminToken = tokenData.access_token

    let apiResponse

    switch (action) {
      case 'create': {
        // Benutzer erstellen (ohne role Property) aber mit requiredActions für Passwort-Setup
        const userDataWithActions = {
          ...keycloakUserData,
          requiredActions: ['UPDATE_PASSWORD'], // Benutzer muss beim ersten Login Passwort setzen
        }

        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDataWithActions),
        })

        // Nach erfolgreichem Erstellen die Rolle setzen, falls angegeben
        if (apiResponse.ok && role) {
          try {
            // Benutzer-ID aus dem Location-Header extrahieren
            const location = apiResponse.headers.get('location')
            const extractedUserId = location?.split('/').pop()

            if (extractedUserId) {
              // Rolle dem Benutzer zuweisen
              await assignRoleToUser(keycloakUrl, realm, adminToken, extractedUserId, role)
            }
          } catch (roleError) {
            console.warn(
              'Warnung: Benutzer wurde erstellt, aber Rolle konnte nicht zugewiesen werden:',
              roleError
            )
          }
        }
        break
      }

      case 'update': {
        // Benutzer aktualisieren (ohne role Property)
        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(keycloakUserData),
        })

        // Nach erfolgreichem Update die Rolle setzen, falls angegeben
        if (apiResponse.ok && role) {
          try {
            await assignRoleToUser(keycloakUrl, realm, adminToken, userId, role)
          } catch (roleError) {
            console.warn(
              'Warnung: Benutzer wurde aktualisiert, aber Rolle konnte nicht zugewiesen werden:',
              roleError
            )
          }
        }
        break
      }

      case 'delete': {
        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
        break
      }

      case 'resetPassword': {
        const { password, temporary } = body

        if (!password) {
          return NextResponse.json({ error: 'Password is required' }, { status: 400 })
        }

        // Passwort zurücksetzen
        apiResponse = await fetch(
          `${keycloakUrl}/admin/realms/${realm}/users/${userId}/reset-password`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'password',
              value: password,
              temporary: temporary !== false, // Standardmäßig temporär, außer explizit auf false gesetzt
            }),
          }
        )

        // Wenn das Passwort erfolgreich gesetzt wurde, requiredActions aktualisieren
        if (apiResponse.ok) {
          // Benutzer-Daten laden, um aktuelle requiredActions zu bekommen
          const userResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            let requiredActions = userData.requiredActions || []

            // Merken, ob der Benutzer vorher bereits UPDATE_PASSWORD hatte (= hatte noch nie ein Passwort)
            const hadNoPasswordBefore = requiredActions.includes('UPDATE_PASSWORD')

            // UPDATE_PASSWORD aus requiredActions entfernen, da jetzt ein Passwort gesetzt ist
            requiredActions = requiredActions.filter(
              (action: string) => action !== 'UPDATE_PASSWORD'
            )

            // Wenn temporäres Passwort gesetzt wurde:
            // - Neue Benutzer (hatten UPDATE_PASSWORD): Behalten UPDATE_PASSWORD
            // - Bestehende Benutzer (hatten kein UPDATE_PASSWORD): Bekommen UPDATE_PASSWORD nur als temporäre Maßnahme
            if (temporary !== false) {
              requiredActions.push('UPDATE_PASSWORD')
            }

            // requiredActions aktualisieren
            await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${adminToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...userData,
                requiredActions,
                // Zusätzlich: Markiere in User-Attributen, ob dies der erste Passwort-Set war
                attributes: {
                  ...userData.attributes,
                  firstPasswordSet: hadNoPasswordBefore
                    ? ['true']
                    : userData.attributes?.firstPasswordSet || ['false'],
                },
              }),
            })
          }
        }
        break
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      return NextResponse.json(
        {
          error: `${action} failed: ${apiResponse.status} ${apiResponse.statusText}`,
          details: errorText,
        },
        { status: apiResponse.status }
      )
    }

    // 204 No Content für erfolgreiche Updates/Deletes
    if (apiResponse.status === 204) {
      return NextResponse.json({ success: true })
    }

    // 201 Created für erfolgreiche Creates (oft ohne JSON Body)
    if (apiResponse.status === 201) {
      return NextResponse.json({ success: true, message: 'User created successfully' })
    }

    // Nur JSON parsen, wenn Content vorhanden ist
    const contentLength = apiResponse.headers.get('content-length')
    const contentType = apiResponse.headers.get('content-type')

    if (contentLength === '0' || !contentType?.includes('application/json')) {
      return NextResponse.json({ success: true })
    }

    try {
      const result = await apiResponse.json()
      return NextResponse.json(result)
    } catch {
      // Falls JSON-Parsing fehlschlägt, trotzdem Erfolg zurückgeben
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}, true) // true = requireAdmin

// Hilfsfunktion: Rolle einem Benutzer zuweisen
async function assignRoleToUser(
  keycloakUrl: string,
  realm: string,
  adminToken: string,
  userId: string,
  roleName: string
) {
  // Zuerst alle aktuellen Rollen des Benutzers abrufen
  const currentRolesResponse = await fetch(
    `${keycloakUrl}/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (currentRolesResponse.ok) {
    const currentRoles = await currentRolesResponse.json()

    // Alle aktuellen Rollen entfernen (sowohl unsere AVAILABLE_ROLES als auch Default-Rollen)
    const rolesToRemove = currentRoles.filter(
      (role: any) => AVAILABLE_ROLES.includes(role.name) || role.name.startsWith('default-roles-')
    )

    if (rolesToRemove.length > 0) {
      await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}/role-mappings/realm`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rolesToRemove),
      })
    }
  }

  // Rolle-Details abrufen
  const roleResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/roles/${roleName}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!roleResponse.ok) {
    throw new Error(`Rolle ${roleName} nicht gefunden`)
  }

  const role = await roleResponse.json()

  // Neue Rolle zuweisen
  const assignResponse = await fetch(
    `${keycloakUrl}/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([role]),
    }
  )

  if (!assignResponse.ok) {
    throw new Error(`Fehler beim Zuweisen der Rolle ${roleName}`)
  }
}
