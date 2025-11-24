import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '../../../../lib/auth-middleware'

// Available roles in the system
const AVAILABLE_ROLES = ['viewer', 'architect', 'admin']

// API Route for Keycloak Admin operations
export const GET = withAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const getRoles = searchParams.get('getRoles') === 'true'

  // If only roles are requested
  if (getRoles) {
    return NextResponse.json({ roles: AVAILABLE_ROLES })
  }
  try {
    // Get admin token
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080'
    const realm = process.env.KEYCLOAK_REALM || 'simple-eam'

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

    // Load users
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

    // Load roles for each user
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

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { action, userId, userData } = body

    // Extract role from userData and remove (only for create/update)
    let role = null
    let keycloakUserData = userData

    if (userData && (action === 'create' || action === 'update')) {
      const extracted = userData
      role = extracted.role
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { role: _, ...restData } = extracted
      keycloakUserData = restData
    }

    // Get admin token
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080'
    const realm = process.env.KEYCLOAK_REALM || 'simple-eam'

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
        // Create user (without role property) but with requiredActions for password setup
        const userDataWithActions = {
          ...keycloakUserData,
          requiredActions: ['UPDATE_PASSWORD'], // User must set password on first login
        }

        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDataWithActions),
        })

        // After successful creation, set role if specified
        if (apiResponse.ok && role) {
          try {
            // Extract user ID from Location header
            const location = apiResponse.headers.get('location')
            const extractedUserId = location?.split('/').pop()

            if (extractedUserId) {
              // Assign role to user
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
        // Update user (without role property)
        apiResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(keycloakUserData),
        })

        // After successful update, set role if specified
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

        // Reset password
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

        // If password was successfully set, update requiredActions
        if (apiResponse.ok) {
          // Load user data to get current requiredActions
          const userResponse = await fetch(`${keycloakUrl}/admin/realms/${realm}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            let requiredActions = userData.requiredActions || []

            // Remember if user previously had UPDATE_PASSWORD (= never had a password)
            const hadNoPasswordBefore = requiredActions.includes('UPDATE_PASSWORD')

            // Remove UPDATE_PASSWORD from requiredActions since a password is now set
            requiredActions = requiredActions.filter(
              (action: string) => action !== 'UPDATE_PASSWORD'
            )

            // If temporary password was set:
            // - New users (had UPDATE_PASSWORD): Keep UPDATE_PASSWORD
            // - Existing users (had no UPDATE_PASSWORD): Get UPDATE_PASSWORD only as temporary measure
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
                // Additionally: Mark in user attributes whether this was the first password set
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

    // 204 No Content for successful updates/deletes
    if (apiResponse.status === 204) {
      return NextResponse.json({ success: true })
    }

    // 201 Created for successful creates (often without JSON body)
    if (apiResponse.status === 201) {
      return NextResponse.json({ success: true, message: 'User created successfully' })
    }

    // Only parse JSON if content is present
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

// Helper function: Assign role to user
async function assignRoleToUser(
  keycloakUrl: string,
  realm: string,
  adminToken: string,
  userId: string,
  roleName: string
) {
  // First fetch all current roles of the user
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

    // Remove all current roles (both our AVAILABLE_ROLES and default roles)
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

  // Fetch role details
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

  // Assign new role
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
